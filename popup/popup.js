document.addEventListener('DOMContentLoaded', function () {
    // You can add functionality here to:
    // 1. Toggle the extension on/off
    // 2. Show statistics (e.g., number of words translated)
    // 3. Provide settings options

    // Example: Update status based on whether the extension is enabled
    chrome.storage.sync.get(['enabled'], function (result) {
        const enabled = result.enabled !== undefined ? result.enabled : true;
        const statusElement = document.getElementById('status');

        if (enabled) {
            statusElement.textContent = 'Active';
            statusElement.style.color = '#34A853'; // Green
        } else {
            statusElement.textContent = 'Inactive';
            statusElement.style.color = '#EA4335'; // Red
        }
    });
});
