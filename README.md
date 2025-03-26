# Harakat (حَرَکَت) 

<img src="assets/icons/icon128.png" width="128" height="128" />

A Chrome browser extension that shows the pronunciation and English definition of Persian (Farsi) words when you hover over text in the browser.

Inspired by [rikaikun](https://chromewebstore.google.com/detail/rikaikun/jipdnfibhldikgcjhfnomkfpcebammhp) and [Zhongwen](https://chromewebstore.google.com/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde).

## Features

- Detects Persian text on any webpage
- Shows both Latin alphabet transliterations and English translations when hovering over Persian words
- Text-to-speech pronunciation
- Clean, unobtrusive tooltip design
- Toggle extension on/off from popup

## Setup

### Azure Services Configuration

This extension requires Azure Translator and Speech services to function:

1. Create an Azure account if you don't have one
2. Create a Translator resource in the Azure portal
   - Get your Translator API key, endpoint, and region
3. Create a Speech resource in the Azure portal
   - Get your Speech API key and region
4. Copy `config.example.js` to `config.js`
5. Replace the placeholder values with your actual Azure API keys, endpoints, and regions

### Installation

1. Clone this repository
2. Configure your Azure API key as described above
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension directory

## Security Notes

- The `config.js` file is excluded from version control via `.gitignore`
- Always restrict your Azure API key in the Azure portal:
  - Set usage quotas
  - Configure network restrictions if needed

## Tech Stack

- JavaScript
- Chrome Extension APIs
- Azure Translator API
- Azure Speech API

## Acknowledgements

- This project was developed with assistance from Cline AI
- Icon by [icons8](https://icons8.com/)
- Inspired by [rikaikun](https://chromewebstore.google.com/detail/rikaikun/jipdnfibhldikgcjhfnomkfpcebammhp) and [Zhongwen](https://chromewebstore.google.com/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde)
