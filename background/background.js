// Import config.js using importScripts
try {
    importScripts('../config.js');
    console.log('Config loaded successfully');
} catch (e) {
    console.error('Error loading config.js:', e);
}

// Now import the service worker script
importScripts('service-worker.js');
