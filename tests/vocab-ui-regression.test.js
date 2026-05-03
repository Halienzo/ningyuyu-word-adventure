const fs = require('fs');
const assert = require('assert');

const adventure = fs.readFileSync('宁鱼鱼的单词冒险.html', 'utf8');
const garden = fs.readFileSync('宁鱼鱼的声音花园.html', 'utf8');

function assertIncludes(source, expected, label) {
  assert(
    source.includes(expected),
    `${label}: expected to find ${JSON.stringify(expected)}`
  );
}

function assertRegex(source, regex, label) {
  assert(regex.test(source), `${label}: expected ${regex}`);
}

function countCheers(source) {
  const match = source.match(/const CHEERS = \[([\s\S]*?)\];/);
  assert(match, 'expected CHEERS array');
  return [...match[1].matchAll(/'[^']+'/g)].length;
}

assertIncludes(adventure, 'class="meaning-preview"', 'adventure cards show Chinese on front');
assertIncludes(adventure, 'data-meaning=', 'adventure cards keep Chinese metadata');
assertIncludes(adventure, 'data-pos=', 'adventure cards keep part-of-speech metadata');
assertIncludes(adventure, 'const vocabIndex = buildVocabIndex();', 'adventure review queue uses vocab index');
assertRegex(
  adventure,
  /\.vocab-card-front \.pos-tag \{[\s\S]*?font-size:\s*0\.88em/,
  'adventure desktop part-of-speech badge is larger'
);
assertRegex(
  adventure,
  /\.vocab-card \.pos-tag \{ font-size:\s*0\.78em/,
  'adventure mobile part-of-speech badge is larger'
);

assertIncludes(garden, 'const LISTENING_POS_MAP = {', 'garden has listening part-of-speech map');
assertIncludes(garden, 'class="pos-tag"', 'garden cards render part-of-speech badge');
assertIncludes(garden, 'class="flashcard-zh"', 'garden flashcards show Chinese on front');
assertRegex(
  garden,
  /\.vocab-item-front \.pos-tag[\s\S]*?font-size:\s*0\.92em/,
  'garden scenario part-of-speech badge is larger'
);
assertRegex(
  garden,
  /\.flashcard \.pos-tag[\s\S]*?font-size:\s*0\.9em/,
  'garden flashcard part-of-speech badge is visible'
);

for (const [label, source] of [
  ['adventure', adventure],
  ['garden', garden]
]) {
  assertIncludes(source, 'Calm Ocean Study UI refresh', `${label} has refreshed design system`);
  assertIncludes(source, '--bg-card: rgba(255,255,255,0.82);', `${label} uses glass card token`);
  assertIncludes(source, '.fish-mascot::before', `${label} replaces emoji fish with CSS mascot body`);
  assertIncludes(source, '.fish-mascot::after', `${label} replaces emoji fish with CSS mascot tail`);
  assertIncludes(source, '@keyframes fish-drift', `${label} fish has idle drift animation`);
  assertIncludes(source, '@keyframes fish-tail-wag', `${label} fish has tail animation`);
  assertIncludes(source, '@keyframes fish-click-pop', `${label} fish has click animation`);
  assertIncludes(source, 'fish.classList.add(\'clicked\')', `${label} click triggers dynamic fish state`);
  assertIncludes(source, 'linear-gradient(135deg, var(--primary), var(--accent))', `${label} uses calm purple-blue action gradient`);
  assertIncludes(source, 'backdrop-filter: blur', `${label} uses soft glass surfaces`);
  assert(
    countCheers(source) >= 60,
    `${label}: expected at least 60 fish encouragement messages`
  );
}

assertIncludes(adventure, "playSound('cheer')", 'adventure fish click keeps sound feedback');
assertIncludes(garden, "playSoundEffect('cheer')", 'garden fish click keeps sound feedback');

console.log('vocab UI regression checks passed');
