const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const navigation = fs.readFileSync(path.join(root, 'a0-context-navigation.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'a0-context-navigation.css'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'A0_BOOK_MANIFEST.json'), 'utf8'));
const registered = [...new Set(manifest.surface_registry.map((record) => record.surface.split('#')[0]).filter((surface) => surface.endsWith('.html')))];

for (const surface of registered) assert.ok(navigation.includes(surface), `${surface} must be reachable from the shared Reader navigation`);

for (const token of [
  'key: "human", code: "H", label: "Human"',
  'key: "science", code: "S", label: "Science"',
  'key: "builder", code: "B", label: "Builder"',
  'Reader nach Perspektive',
  'Auf dieser Seite',
  'Science Desk',
  'Authority & Currentness',
  'Szenen · Deep Links',
  'Achievements',
  'C · Connect'
]) assert.ok(navigation.includes(token), `navigation contract missing: ${token}`);

assert.match(navigation, /entry: "A0_RESEARCH_DESK\.html"/);
assert.match(navigation, /A0_SCIENTIFIC_POSITION_REPORT\.html/);
assert.match(navigation, /A0_RESEARCH_DESK\.html#achievements-reader/);

for (const selector of ['.a0-reader-lanes', '.a0-reader-panel', '.a0-page-context', '.a0-page-menu-body']) {
  assert.ok(styles.includes(selector), `shared style missing: ${selector}`);
}
assert.match(styles, /@media\(max-width:820px\)/);
assert.match(styles, /@media\(max-width:560px\)/);

const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
const shared = htmlFiles.filter((name) => fs.readFileSync(path.join(root, name), 'utf8').includes('a0-context-navigation.js'));
assert.deepEqual(htmlFiles.filter((name) => !shared.includes(name)).sort(), ['A0_ASSET_INDEX.html', 'A0_ORIENTATION_CONTROLLER_BENCH.html', 'LAB_ORIENTATION_MACHINE.html']);

const livingBlueprint = fs.readFileSync(path.join(root, 'A0_LIVING_BLUEPRINT.html'), 'utf8');
assert.match(livingBlueprint, /a0-context-navigation\.css\?rev=reader-lanes-20261015/);
assert.match(livingBlueprint, /a0-context-navigation\.js\?rev=reader-lanes-20261015/);

console.log(JSON.stringify({ status: 'PASS', registeredReaders: registered.length, sharedNavigationSurfaces: shared.length, standaloneUtilities: 3 }, null, 2));
