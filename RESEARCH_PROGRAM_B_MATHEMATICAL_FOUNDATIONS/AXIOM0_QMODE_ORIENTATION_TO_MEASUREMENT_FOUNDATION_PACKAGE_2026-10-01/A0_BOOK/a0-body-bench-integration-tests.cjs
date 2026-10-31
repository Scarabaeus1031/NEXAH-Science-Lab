const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks++; };
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const blue = read('A0_TESSAREC_BLUE_BODY_LAB.html');
const pink = read('A0_PINK_DIAMOND_GRID_ATLAS.html');
const joint = read('A0_BLUE_PINK_DODECA_CELL_RETURN.html');
const discover = read('A0_BENCH_ENTDECKEN.html');
const css = read('a0-bench-navigation.css');
const roleApi = require('./assets/a0-blue-pink-dodeca-cell-return-v1.js');

for (const [name, html, current] of [
  ['blue', blue, 'domain-blue'],
  ['pink', pink, 'domain-pink'],
  ['joint', joint, 'domain-joint']
]) {
  const isReturnRegister = name === 'joint';
  ok(html.includes('a0-bench-navigation.css'), name + ' loads shared flagship navigation');
  ok(html.includes(isReturnRegister ? 'class="bench-context-path"' : 'class="bench-sections '), name + ' declares its navigation scope');
  ok(html.includes('aria-label="Ansichtsebenen"'), name + ' separates overview, instrument and source layers');
  ok(html.includes('class="body-bench-identity"'), name + ' declares full-bench identity');
  ok(html.includes('class="' + current + '" aria-current="page"'), name + ' marks the correct flagship');
  ok(html.includes('A0_TESSAREC_BLUE_BODY_LAB.html') || current === 'domain-blue', name + ' exposes Blue Body');
  ok(html.includes('A0_PINK_DIAMOND_GRID_ATLAS.html') || current === 'domain-pink', name + ' exposes Pink Diamond');
  ok(html.includes('A0_BLUE_PINK_DODECA_CELL_RETURN.html') || current === 'domain-joint', name + ' exposes Blue x Pink Lab');
  ok(html.includes('A0_MACHINA_COCKPIT.html') || html.includes('A0_WERKBANK.html?view=machina'), name + ' returns to THE MACHINA house');
  ok(html.includes('A0_BENCH_ENTDECKEN.html#body-exhibition'), name + ' links to the compatible Build overview anchor');
}

ok(discover.includes('id="body-exhibition"'), 'Build overview retains the compatible historical anchor');
ok(discover.includes('Blue Body'), 'discover page exposes Blue Body');
ok(discover.includes('Pink Diamond'), 'discover page names the flagship Pink Diamond');
ok(discover.includes('Blue × Pink Lab'), 'discover page promotes the coupled lab as the large connection flagship');
ok(discover.includes('Game of Worlds läuft auf dem Build.'), 'discover page types Game of Worlds as software layer');
ok((discover.match(/class="bench-flagship(?: |")/g) || []).length === 7, 'discover page has seven flagship entries');
ok(css.includes('.domain-joint'), 'shared CSS styles the coupled build flagship');
ok(css.includes('.body-bench-identity'), 'shared CSS styles full-bench identity');
ok(css.includes('.software-layer-note'), 'shared CSS styles the software-layer distinction');
ok(css.includes('.diamond-role-map'), 'shared CSS styles the diamond role contract');

const role = roleApi.buildPinkDiamondRoleContract();
ok(role.entry === 'ORANGE_FLOOR', 'Pink Diamond begins at the Orange Floor');
ok(role.carrier === 'WHITE_DODECA', 'the Dodeca carrier remains white');
ok(role.views.AM === 'YELLOW_DIAMOND', 'AM colors the diamond yellow');
ok(role.views.PM === 'PINK_DIAMOND', 'PM colors the diamond pink');
ok(role.boundary.includes('GRID_IS_THE_ADDRESS_INSTRUMENT'), 'the grid remains an internal address instrument');
ok(joint.includes('ORANGE FLOOR'), 'joint bench exposes the Orange Floor entry');
ok(joint.includes('WHITE DODECA'), 'joint bench exposes the white Dodeca carrier');
ok(joint.includes('AM · YELLOW DIAMOND'), 'joint bench exposes the AM yellow view');
ok(joint.includes('PM · PINK DIAMOND'), 'joint bench exposes the PM pink view');

for (const href of [
  'A0_MACHINA_COCKPIT.html',
  'A0_TESSAREC_BLUE_BODY_LAB.html',
  'A0_PINK_DIAMOND_GRID_ATLAS.html',
  'A0_BLUE_PINK_DODECA_CELL_RETURN.html',
  'A0_BENCH_ENTDECKEN.html'
]) ok(fs.existsSync(path.join(__dirname, href)), 'route exists: ' + href);

console.log(JSON.stringify({status:'PASS', checks, scope:'seven persistent flagships; Build overview, instruments and sources separated as view layers; Game of Worlds typed as software layer'}));
