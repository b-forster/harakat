// Get Azure API configuration from global CONFIG object
// This assumes config.js is loaded before this script
const AZURE_TRANSLATOR_KEY = self.CONFIG ? self.CONFIG.AZURE_TRANSLATOR_KEY : null;
const AZURE_TRANSLATOR_ENDPOINT = self.CONFIG ? self.CONFIG.AZURE_TRANSLATOR_ENDPOINT : null;
const AZURE_TRANSLATOR_REGION = self.CONFIG ? self.CONFIG.AZURE_TRANSLATOR_REGION : null;

const AZURE_SPEECH_KEY = self.CONFIG ? self.CONFIG.AZURE_SPEECH_KEY : null;
const AZURE_SPEECH_REGION = self.CONFIG ? self.CONFIG.AZURE_SPEECH_REGION : null;
const AZURE_SPEECH_VOICE = self.CONFIG ? self.CONFIG.AZURE_SPEECH_VOICE : 'fa-IR-DilaraNeural';

// Verify Azure Translator configuration is available
if (!AZURE_TRANSLATOR_KEY || !AZURE_TRANSLATOR_ENDPOINT || !AZURE_TRANSLATOR_REGION) {
    console.error('Azure Translator configuration not found. Make sure config.js is loaded before service-worker.js');
}

// Verify Azure Speech configuration is available
if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
    console.error('Azure Speech configuration not found. Make sure config.js is loaded before service-worker.js');
}

// Function to translate and transliterate text using Azure Translator API
async function translateAndTransliterate(text) {
    try {
        // Make two parallel requests: one for translation and one for transliteration
        const [translationResponse, transliterationResponse] = await Promise.all([
            // Translation request
            fetch(
                `${AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&from=fa&to=en`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
                        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION
                    },
                    body: JSON.stringify([
                        {
                            text: text
                        }
                    ])
                }
            ),
            // Transliteration request
            fetch(
                `${AZURE_TRANSLATOR_ENDPOINT}/transliterate?api-version=3.0&language=fa&fromScript=Arab&toScript=Latn`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
                        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION
                    },
                    body: JSON.stringify([
                        {
                            text: text
                        }
                    ])
                }
            )
        ]);

        // Parse both responses
        const translationData = await translationResponse.json();
        const transliterationData = await transliterationResponse.json();

        // Check for errors
        if (!translationResponse.ok) {
            throw new Error(translationData.error?.message || 'Translation error');
        }
        if (!transliterationResponse.ok) {
            throw new Error(transliterationData.error?.message || 'Transliteration error');
        }

        // Extract translation and transliteration
        const translation = translationData[0]?.translations[0]?.text || '';
        const transliteration = transliterationData[0]?.text || '';

        return {
            translation,
            transliteration
        };
    } catch (error) {
        throw error;
    }
}

// Function to generate speech audio from text using Azure Speech service
async function generateSpeech(text) {
    try {
        // Construct the SSML (Speech Synthesis Markup Language) document
        const ssml = `
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="fa-IR">
                <voice name="${AZURE_SPEECH_VOICE}">
                    ${text}
                </voice>
            </speak>
        `;

        // Make request to Azure Speech service
        const response = await fetch(
            `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ssml+xml',
                    'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
                    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
                },
                body: ssml
            }
        );

        // Check for errors
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Speech service error: ${response.status} - ${errorText}`);
        }

        // Get audio data as blob
        const audioData = await response.blob();

        // Convert blob to base64 data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(audioData);
        });
    } catch (error) {
        throw error;
    }
}

// Set up message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        // Start the translation and transliteration process
        translateAndTransliterate(request.text)
            .then(result => {
                sendResponse(result);
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });

        return true; // Required for async sendResponse
    }

    if (request.action === 'speak') {
        // Generate speech audio
        generateSpeech(request.text)
            .then(audioDataUrl => {
                sendResponse({ audioDataUrl });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });

        return true; // Required for async sendResponse
    }
});

// Service worker lifecycle events
self.addEventListener('activate', (event) => {
    self.skipWaiting();
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});
