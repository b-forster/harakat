// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

const text = 'Hello, world!';
const target = 'fa';

async function detectLanguage() {
    let [detections] = await translate.detect(text);
    detections = Array.isArray(detections) ? detections : [detections];
    console.log('Detections:');
    detections.forEach(detection => {
        console.log(`${detection.input} => ${detection.language}`);
    });
}

detectLanguage();

async function translateText() {
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log('Translations:');
    translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${target}) ${translation}`);
    });
}

translateText();
