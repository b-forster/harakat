// Default settings
const defaultSettings = {
    enabled: true,
    tooltipDelay: 300,
    showPronunciation: true,
    showDefinition: true
};

// Save settings to Chrome storage
function saveOptions() {
    const settings = {
        enabled: document.getElementById('enabled').checked,
        tooltipDelay: parseInt(document.getElementById('tooltip-delay').value, 10),
        showPronunciation: document.getElementById('show-pronunciation').checked,
        showDefinition: document.getElementById('show-definition').checked
    };

    chrome.storage.sync.set(settings, function () {
        // Update status to let user know options were saved
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        status.className = 'success';

        setTimeout(function () {
            status.textContent = '';
            status.className = '';
        }, 1500);
    });
}

// Restore settings from Chrome storage
function restoreOptions() {
    chrome.storage.sync.get(defaultSettings, function (items) {
        document.getElementById('enabled').checked = items.enabled;
        document.getElementById('tooltip-delay').value = items.tooltipDelay;
        document.getElementById('show-pronunciation').checked = items.showPronunciation;
        document.getElementById('show-definition').checked = items.showDefinition;
    });
}

// Reset settings to defaults
function resetOptions() {
    document.getElementById('enabled').checked = defaultSettings.enabled;
    document.getElementById('tooltip-delay').value = defaultSettings.tooltipDelay;
    document.getElementById('show-pronunciation').checked = defaultSettings.showPronunciation;
    document.getElementById('show-definition').checked = defaultSettings.showDefinition;

    saveOptions();
}

// Initialize the options page
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);

// Add input validation for tooltip delay
document.getElementById('tooltip-delay').addEventListener('input', function (e) {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) {
        e.target.value = 0;
    } else if (value > 1000) {
        e.target.value = 1000;
    }
});
