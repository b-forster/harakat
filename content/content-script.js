// Harakat: Persian Reading Helper
// Content script that detects Persian text and shows pronunciations and definitions

// Check if extension context is valid
function isExtensionContextValid() {
    try {
        // Try to access chrome.runtime.id - this will throw if context is invalid
        return !!chrome.runtime.id;
    } catch (e) {
        return false;
    }
}

// Get translation and transliteration from background script
function getTranslationAndTransliteration(text) {
    return new Promise((resolve, reject) => {
        // Check if extension context is valid
        if (!isExtensionContextValid()) {
            reject(new Error('Extension context invalidated. Please refresh the page.'));
            return;
        }

        chrome.runtime.sendMessage(
            { action: 'translate', text: text },
            response => {
                // Check again after response in case context was invalidated during request
                if (!isExtensionContextValid()) {
                    reject(new Error('Extension context invalidated. Please refresh the page.'));
                    return;
                }

                if (chrome.runtime.lastError) {
                    // Check for specific error messages
                    if (chrome.runtime.lastError.message.includes('Receiving end does not exist')) {
                        reject(new Error('Background service worker not ready. Try refreshing the page.'));
                    } else {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    return;
                }

                // Process the response
                if (response && response.error) {
                    reject(new Error(response.error));
                } else if (response && response.translation && response.transliteration) {
                    resolve({
                        translation: response.translation,
                        transliteration: response.transliteration
                    });
                } else {
                    reject(new Error('Invalid response from background script'));
                }
            }
        );
    });
}

// Helper function to detect if text is Persian
function isPersianText(text) {
    // Persian Unicode range: \u0600-\u06FF (Arabic and Persian)
    // Additional Persian characters: \u0750-\u077F, \u08A0-\u08FF, \uFB50-\uFDFF, \uFE70-\uFEFF
    const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return persianRegex.test(text);
}

// Get word at position
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

// Create and show tooltip
async function showTooltip(word, x, y) {
    // Remove any existing tooltips
    removeTooltip();

    // Create tooltip element with loading state
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

    try {
        // Get translation and transliteration from background script
        const result = await getTranslationAndTransliteration(word);

        if (document.getElementById('harakat-tooltip')) {
            tooltip.innerHTML = `
            <div class="harakat-content">
              <div class="harakat-word">${word}</div>
              <div class="harakat-pronunciation">${result.transliteration}</div>
              <div class="harakat-definition">${result.translation}</div>
            </div>
          `;
        }
    } catch (error) {
        if (document.getElementById('harakat-tooltip')) {
            // Special handling for extension context invalidated
            if (error.message.includes('Extension context invalidated')) {
                tooltip.innerHTML = `
                <div class="harakat-content">
                  <div class="harakat-word">${word}</div>
                  <div class="harakat-error">Extension reloaded. Please refresh the page.</div>
                </div>
              `;
            } else {
                tooltip.innerHTML = `
                <div class="harakat-content">
                  <div class="harakat-word">${word}</div>
                  <div class="harakat-error">Error: ${error.message}</div>
                </div>
              `;
            }
        }
    }
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
    // Check if extension context is valid
    if (!isExtensionContextValid()) {
        callback(false);
        return;
    }

    try {
        chrome.storage.sync.get(['enabled'], function (result) {
            if (chrome.runtime.lastError) {
                callback(false);
                return;
            }

            const enabled = result.enabled !== undefined ? result.enabled : true;
            callback(enabled);
        });
    } catch (e) {
        callback(false);
    }
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
