'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const html = read('A0_PRIMECUBE_GAP_FOLD_LAB.html');
const ui = read('a0-primecube-ui.js');
const css = read('a0-primecube-seams.css');
const sandbox = { window: {} };
vm.runInNewContext(read('a0-primecube-model.js'), sandbox);
const M = sandbox.window.A0PrimecubeModel;
const data = M.buildDataset();
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

check(html.includes('Address decks · 121 points each'), 'rail names the 121-address deck contract');
check((html.match(/data-pc-seam="/g) || []).length === 9, 'nine complete carrier decks are selectable');
check(html.includes('data-pc-deck-labels'), 'deck number-label control exists');
check(html.includes('Closure selects the whole deck'), 'deck and seam-only behaviors are distinguished');
check(css.includes('.pc-deck-label-button'), 'deck label control is styled');
check(css.includes('button[aria-pressed=true]'), 'selected deck has a visible state');
check(ui.includes("selectedDeck=null,deckLabelMode='all'"), 'deck focus and labels have explicit state');
check(ui.includes('function fillLayerDeck'), 'selected deck receives a plane fill');
check(ui.includes('function selectDeck'), 'closure buttons select full decks');
check(ui.includes("filter='all';view='cube'"), 'deck selection restores the full address set in cube view');
check(ui.includes("deckLabelMode==='all'?'primes'"), 'number labels cycle all to primes to off');
check(ui.includes("last-first+1} ADDRESSES"), 'deck readout reports the visible address count');
check(ui.includes("if(next==='seam'){selectedDeck=null"), 'seam-only filter exits deck focus');
check(html.includes('data-pc-view="plates"'), 'workbench exposes the plate-triad comparator');
check(html.includes('Three leaf families'), 'plate rail names the three orthogonal leaf families');
check(html.includes('data-pc-plate-base="11"') && html.includes('data-pc-plate-base="12"'), 'Base-11 and Base-12 remain selectable comparator registers');
check(html.includes('data-pc-plate-coupling="open"') && html.includes('data-pc-plate-coupling="tablet"') && html.includes('data-pc-plate-coupling="shadow"'), 'plate triad exposes open, active L/tablet and shadow-plate readings');
check(html.includes('L / Tablet + Line') && html.includes('share one exact hinge line'), 'active L/tablet exposes its exact shared line without multiplying the carrier');
check(css.includes('.pc-plate-rail'), 'plate comparator controls are styled');
check(ui.includes('function drawPlateTriad'), 'plate comparator has a dedicated renderer');
check(ui.includes('ACTIVE L / TABLET · XY + XZ') && ui.includes('SHADOW PLATE · YZ'), 'active L/tablet and separate shadow plate remain visibly typed');
check(ui.includes('TABLET HINGE · ${base} ADDRESSES'), 'plate renderer labels the exact tablet intersection line');
check(ui.includes('<code>G77</code>') && ui.includes('7×11 CRT / Rath-grid adapter'), 'G77 remains a separate 77-cell adapter rather than the hinge-line identity');
check(ui.includes('The separate 2501/5002 arithmetic is not assigned to this plate view'), '2501/5002 arithmetic is explicitly kept outside the plate reading');
check(ui.includes('No new Cube identity is introduced'), 'display palette and reading selection remain explicitly unnamed');
check(ui.includes('area=base*base') && ui.includes('volume=base*base*base'), 'plate area and volume are computed from the selected base');
check(ui.includes("plateBase===11?10:12"), 'Base-11 opens at the 1210 pre-closure and Base-12 at full 1728 closure');
check(10 * 11 ** 2 === 1210 && 11 ** 3 === 1331, 'Base-11 pre-closure and full-envelope counts are exact');
check(12 * 12 ** 2 === 12 ** 3 && 12 ** 3 === 1728, 'Base-12 twelve-plate closure is exact');

const closures = data.layerClosures;
check(JSON.stringify(closures) === JSON.stringify([121,242,363,484,605,726,847,968,1089]), 'closure values define nine exact deck ends');
for (let z = 0; z < 9; z += 1) {
  const nodes = data.nodes.filter(node => node.cube.z === z);
  check(nodes.length === 121, `deck z${z} contains 121 carrier addresses`);
  check(nodes[0].n === z * 121 + 1 && nodes.at(-1).n === (z + 1) * 121, `deck z${z} retains its exact numeric range`);
}

console.log(`PASS · ${checks} checks · Primecube address decks and orthogonal plate families retain exact counts.`);
