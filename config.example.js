// Define CONFIG in the appropriate global scope (window in browser, self in service worker)
const CONFIG = {
    // Azure Translator API configuration
    AZURE_TRANSLATOR_KEY: 'YOUR_AZURE_TRANSLATOR_KEY_HERE',
    AZURE_TRANSLATOR_ENDPOINT: 'https://api.cognitive.microsofttranslator.com/',
    AZURE_TRANSLATOR_REGION: 'YOUR_AZURE_REGION_HERE', // e.g., 'eastus'

    // Azure Speech service configuration
    AZURE_SPEECH_KEY: 'YOUR_AZURE_SPEECH_KEY_HERE',
    AZURE_SPEECH_REGION: 'YOUR_AZURE_SPEECH_REGION_HERE', // e.g., 'eastus'
    AZURE_SPEECH_VOICE: 'fa-IR-DilaraNeural'
};

// Make CONFIG available globally in the appropriate context
(typeof self !== 'undefined' ? self : window).CONFIG = CONFIG;
