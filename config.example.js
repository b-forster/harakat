// Define CONFIG in the appropriate global scope (window in browser, self in service worker)
const CONFIG = {
    API_KEY: 'YOUR_GOOGLE_TRANSLATE_API_KEY_HERE'
};

// Make CONFIG available globally in the appropriate context
(typeof self !== 'undefined' ? self : window).CONFIG = CONFIG;
