// Get Azure Translator API configuration from global CONFIG object
// This assumes config.js is loaded before this script
const AZURE_KEY = self.CONFIG ? self.CONFIG.AZURE_TRANSLATOR_KEY : null;
const AZURE_ENDPOINT = self.CONFIG ? self.CONFIG.AZURE_TRANSLATOR_ENDPOINT : null;
const AZURE_REGION = self.CONFIG ? self.CONFIG.AZURE_TRANSLATOR_REGION : null;

// Verify Azure configuration is available
if (!AZURE_KEY || !AZURE_ENDPOINT || !AZURE_REGION) {
    console.error('Azure Translator configuration not found. Make sure config.js is loaded before service-worker.js');
}

// Function to translate and transliterate text using Azure Translator API
async function translateAndTransliterate(text) {
    try {
        // Make two parallel requests: one for translation and one for transliteration
        const [translationResponse, transliterationResponse] = await Promise.all([
            // Translation request
            fetch(
                `${AZURE_ENDPOINT}/translate?api-version=3.0&from=fa&to=en`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': AZURE_KEY,
                        'Ocp-Apim-Subscription-Region': AZURE_REGION
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
                `${AZURE_ENDPOINT}/transliterate?api-version=3.0&language=fa&fromScript=Arab&toScript=Latn`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': AZURE_KEY,
                        'Ocp-Apim-Subscription-Region': AZURE_REGION
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
});

// Service worker lifecycle events
self.addEventListener('activate', (event) => {
    self.skipWaiting();
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});
