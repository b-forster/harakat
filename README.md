# Harakat (حَرَکَت) 

<img src="assets/icons/icon128.png" width="128" height="128" />

A Chrome browser extension that shows the pronunciation and English definition of Persian (Farsi) words when you hover over text in the browser.

Inspired by [rikaikun](https://chromewebstore.google.com/detail/rikaikun/jipdnfibhldikgcjhfnomkfpcebammhp) and [Zhongwen](https://chromewebstore.google.com/detail/zhongwen-chinese-english/kkmlkkjojmombglmlpbpapmhcaljjkde).

## Features

- Detects Persian text on any webpage
- Shows translations when hovering over Persian words
- Clean, unobtrusive tooltip design
- Toggle extension on/off from popup

## Setup

### API Key Configuration

This extension requires a Google Cloud Translation API key to function:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Cloud Translation API
3. Create an API key in "APIs & Services" > "Credentials"
4. Copy `config.example.js` to `config.js`
5. Replace `YOUR_GOOGLE_TRANSLATE_API_KEY_HERE` with your actual API key

### Installation

1. Clone this repository
2. Configure your API key as described above
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension directory

## Security Notes

- The `config.js` file is excluded from version control via `.gitignore`
- Always restrict your API key in the Google Cloud Console:
  - Limit to the Translation API only
  - Set usage quotas
  - Restrict by website/referrer (your extension ID)

## Tech Stack

- JavaScript
- Chrome Extension APIs
- Google Translation API
