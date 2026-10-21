const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const book = __dirname;
const packageRoot = path.resolve(book, '..');
const read = file => fs.readFileSync(file, 'utf8');
const workspace = read(path.join(packageRoot, '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'));
const paperCSource = read(path.join(packageRoot, '34_A0_RETURN_WITHOUT_IDENTITY_PAPER_DRAFT_2026-10-11.md'));
const paperESource = read(path.join(packageRoot, '35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md'));
const paperFSource = read(path.join(packageRoot, '36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md'));
const paperCHtml = read(path.join(book, 'A0_RETURN_WITHOUT_IDENTITY_PAPER.html'));
const paperEHtml = read(path.join(book, 'A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html'));
const paperFHtml = read(path.join(book, 'A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html'));

assert.match(workspace, /Three-Domain Game Atlas — documentary paper routing/);
assert.match(workspace, /NO_NEW_FINDING \/ NO_PAPER_STATE_CHANGE/);
assert.match(workspace, /Lane remains `OUTLINE_ONLY`/);
assert.match(workspace, /This routing adds no `F-A0` row/);
assert.match(paperCSource, /### 11\.1 Documentary instrument example/);
assert.match(paperESource, /### 8\.8 Three-Domain Game Atlas/);
assert.match(paperFSource, /### 16\.1 Three-Domain Atlas \/ Blue Body address projection/);
assert.match(paperCHtml, /id="game-atlas"/);
assert.match(paperEHtml, /id="three-domain-game-atlas-method"/);
assert.match(paperFHtml, /id="game-atlas-address-view"/);

let checkedLinks = 0;
for (const document of [paperCHtml, paperEHtml, paperFHtml]) {
  for (const [, href] of document.matchAll(/href="([^"]*(?:three-domain-transition-test|three-domain-blue-body-return|a0-game-of-worlds-three-domain-atlas-return)[^"]*)"/g)) {
    const [file, anchor] = href.split('#');
    const target = path.resolve(book, decodeURIComponent(file));
    assert.ok(fs.existsSync(target), href);
    if (anchor && target.endsWith('.html') && anchor !== 'atlas') {
      assert.ok(read(target).includes(`id="${anchor}"`), href);
    }
    checkedLinks++;
  }
}

assert.equal(checkedLinks, 9);
console.log(JSON.stringify({
  status: 'PASS',
  papers: ['C', 'D-workspace', 'E', 'F'],
  documentaryLinks: checkedLinks,
  findingChange: false,
  claimChange: false
}, null, 2));
