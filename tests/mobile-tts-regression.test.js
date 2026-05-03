const fs = require('fs');
const assert = require('assert');

const files = [
  ['adventure', fs.readFileSync('宁鱼鱼的单词冒险.html', 'utf8')],
  ['garden', fs.readFileSync('宁鱼鱼的声音花园.html', 'utf8')]
];

function assertIncludes(source, expected, label) {
  assert(
    source.includes(expected),
    `${label}: expected to find ${JSON.stringify(expected)}`
  );
}

for (const [label, source] of files) {
  assertIncludes(source, 'const TTS_START_DELAY_MS = 60;', `${label} delays speech after cancel for mobile browsers`);
  assertIncludes(source, "utter.lang = 'en-US';", `${label} pins word TTS to English`);
  assertIncludes(source, 'if (speechSynthesis.paused) speechSynthesis.resume();', `${label} resumes paused mobile speech synthesis`);
  assertIncludes(source, 'setTimeout(speakNext, TTS_START_DELAY_MS);', `${label} does not speak synchronously after cancel`);
  assertIncludes(source, 'function warmUpSpeechSynthesis()', `${label} uses a named warm-up path`);
  assertIncludes(source, 'u.text = \'ready\';', `${label} warm-up utterance is non-empty for iOS Safari`);
  assertIncludes(source, 'u.volume = 0.01;', `${label} warm-up stays effectively silent without using an empty utterance`);
}

console.log('mobile TTS regression checks passed');
