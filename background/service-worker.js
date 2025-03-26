// Get API key from global CONFIG object
// This assumes config.js is loaded before this script
const API_KEY = self.CONFIG ? self.CONFIG.API_KEY : null;

// Verify API key is available
if (!API_KEY) {
    console.error('API key not found. Make sure config.js is loaded before service-worker.js');
}

// Function to translate text using API key
async function translateText(text) {
    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'fa',
                    target: 'en',
                    format: 'text'
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Translation error');
        }

        return data.data.translations[0].translatedText;
    } catch (error) {
        throw error;
    }
}

// Set up message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        // Start the translation process
        translateText(request.text)
            .then(translation => {
                sendResponse({ translation });
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
