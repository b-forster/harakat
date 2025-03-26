// Define CONFIG in the appropriate global scope (window in browser, self in service worker)
const CONFIG = {
    // Azure Translator API configuration
    AZURE_TRANSLATOR_KEY: 'YOUR_AZURE_TRANSLATOR_KEY_HERE',
    AZURE_TRANSLATOR_ENDPOINT: 'https://api.cognitive.microsofttranslator.com/',
    AZURE_TRANSLATOR_REGION: 'YOUR_AZURE_REGION_HERE' // e.g., 'eastus'
};

// Make CONFIG available globally in the appropriate context
(typeof self !== 'undefined' ? self : window).CONFIG = CONFIG;
