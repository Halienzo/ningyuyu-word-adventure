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
  assertIncludes(source, "const TTS_LANG = 'en-GB';", `${label} pins word TTS to British English`);
  assertIncludes(source, 'v => v.lang.startsWith(TTS_LANG)', `${label} prefers British English voices`);
  assertIncludes(source, 'utter.lang = TTS_LANG;', `${label} sends British English language hint`);
  assertIncludes(source, 'u.lang = TTS_LANG;', `${label} warms up British English speech synthesis`);
  assertIncludes(source, 'if (speechSynthesis.paused) speechSynthesis.resume();', `${label} resumes paused mobile speech synthesis`);
  assertIncludes(source, 'function warmUpSpeechSynthesis()', `${label} uses a named warm-up path`);
  assertIncludes(source, 'u.text = \'ready\';', `${label} warm-up utterance is non-empty for iOS Safari`);
  assertIncludes(source, 'u.volume = 0.01;', `${label} warm-up stays effectively silent without using an empty utterance`);
  assertIncludes(source, 'handleSpeakWordClick: function(e, text, el)', `${label} routes TTS buttons through a synchronous click handler`);
  assertIncludes(source, 'e.preventDefault();', `${label} prevents mobile click fallthrough`);
  assertIncludes(source, 'e.stopImmediatePropagation();', `${label} prevents warm-up handlers from stealing the TTS gesture`);
  assertIncludes(source, "target.closest('.tts-btn')", `${label} skips generic warm-up when the actual TTS button is touched`);
  assertIncludes(source, 'function resetSpeechState(cancelActiveSpeech)', `${label} separates state reset from speech cancellation`);
  assertIncludes(source, 'if (cancelActiveSpeech && typeof speechSynthesis !== \'undefined\')', `${label} only cancels active speech`);
  assertIncludes(source, 'speechSynthesis.speaking || speechSynthesis.pending || isSpeakingFlag', `${label} checks for active speech before cancel`);
  assertIncludes(source, 'speakNext();', `${label} speaks synchronously inside the click activation`);
  assert(
    !source.includes('TTS_START_DELAY_MS'),
    `${label}: Android TTS must not defer first speech outside the click activation`
  );
  assert(
    !source.includes("setTimeout(speakNext, TTS_START_DELAY_MS);"),
    `${label}: Android TTS must not use delayed speech start`
  );
  assert(
    !source.includes("en-US"),
    `${label}: expected British English TTS without hard-coded en-US fallback`
  );
  assert(
    !/onclick="event\.stopPropagation\(\);TTSManager\.speakWord/.test(source),
    `${label}: inline TTS buttons should use handleSpeakWordClick`
  );
  assert(
    !/speak:\s*function[\s\S]*?this\.stop\(\);[\s\S]*?speakNext\(\);/.test(source),
    `${label}: speak() must not unconditionally cancel before Android word playback`
  );
}

console.log('mobile TTS regression checks passed');
