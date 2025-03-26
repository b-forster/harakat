// Harakat: Persian Reading Helper
// Content script that detects Persian text and shows pronunciations and definitions

// Helper function to detect if text is Persian
function isPersianText(text) {
    // Persian Unicode range: \u0600-\u06FF (Arabic and Persian)
    // Additional Persian characters: \u0750-\u077F, \u08A0-\u08FF, \uFB50-\uFDFF, \uFE70-\uFEFF
    const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return persianRegex.test(text);
}

// Function to get word at position
function getWordAtPosition(element, x, y) {
    const range = document.caretRangeFromPoint(x, y);
    if (!range) return null;

    // Expand range to word boundaries
    range.expand('word');

    // Get the selected word
    const word = range.toString().trim();

    // Check if it's Persian
    if (word && isPersianText(word)) {
        return {
            word,
            range
        };
    }

    return null;
}

// Function to create and show tooltip
function showTooltip(word, x, y) {
    // Remove any existing tooltips
    removeTooltip();

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'harakat-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y + 20}px`;
    tooltip.style.zIndex = '10000';

    // Add loading message
    tooltip.innerHTML = `
        <div class="harakat-content">
            <div class="harakat-word">${word}</div>
            <div class="harakat-loading">Loading...</div>
        </div>
    `;

    // Add to page
    document.body.appendChild(tooltip);

    // In a real implementation, you would call your translation API here
    // For now, we'll simulate with a timeout
    setTimeout(() => {
        if (document.getElementById('harakat-tooltip')) {
            tooltip.innerHTML = `
                <div class="harakat-content">
                    <div class="harakat-word">${word}</div>
                    <div class="harakat-pronunciation">Pronunciation placeholder</div>
                    <div class="harakat-definition">Definition placeholder</div>
                </div>
            `;
        }
    }, 500);
}

// Function to remove tooltip
function removeTooltip() {
    const existingTooltip = document.getElementById('harakat-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// Check if extension is enabled
function isExtensionEnabled(callback) {
    chrome.storage.sync.get(['enabled'], function (result) {
        const enabled = result.enabled !== undefined ? result.enabled : true;
        callback(enabled);
    });
}

// Mouse move handler
let debounceTimer;
document.addEventListener('mousemove', function (e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        isExtensionEnabled((enabled) => {
            if (!enabled) {
                removeTooltip();
                return;
            }

            const wordInfo = getWordAtPosition(e.target, e.clientX, e.clientY);
            if (wordInfo) {
                showTooltip(wordInfo.word, e.pageX, e.pageY);
            } else {
                removeTooltip();
            }
        });
    }, 300); // Debounce delay
});

// Remove tooltip when clicking elsewhere
document.addEventListener('click', function (e) {
    if (!e.target.closest('#harakat-tooltip')) {
        removeTooltip();
    }
});

console.log('Harakat: Persian Reading Helper loaded');
