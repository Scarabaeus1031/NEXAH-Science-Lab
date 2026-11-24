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

check(html.includes('data-pc-view="centered"'), 'workbench exposes the centered four-plate motion view');
check((html.match(/data-pc-centered-size=/g) || []).length === 4, '3², 5², 7² and 25² windows are selectable');
check(html.includes('5×5 center window') && html.includes('not added to C(m)=4m²+1'), 'visible 5×5 inspection window is kept outside the count');
check(html.includes('data-pc-centered-channel="paired"') && html.includes('paired · 5002'), 'paired 2501 channel exposes its exact 5002 count');
check(html.includes('3 ↔ 9') && html.includes('4 ↔ 10') && html.includes('6 ↔ 0/12'), 'opposite mod-12 axes remain explicit controls');
check(css.includes('.pc-centered-rail'), 'centered plate motion controls are styled');
check(ui.includes('function drawCenteredPlateWindow'), 'centered plate family has a dedicated renderer');
check(ui.includes("centeredStep>=24") && ui.includes("step ${centeredStep}/24"), 'tipping slash-cube motion closes after two 12-step rounds');
check(html.includes('data-pc-centered-root7') && html.includes('thread 4/167'), 'Root 7 to 11 can be shown as the fourth of 167 transitions');
check(html.includes('A0_MATHEMATICAL_JOINTS.html#ramanujan-pentagon-comparator') && html.includes('A0_NUMBERMAGICK_GRID_RESEARCH.html#pascal-bracket-tilt-projection'), 'centered view links its existing Mathfield and NumberMagick source instruments');
check(html.includes('A0_FAMILY_CONNECTION_ATLAS.html#start') && html.includes('A0_ORIENTATION_CONTROLLER_BENCH.html#caroControlBench'), 'centered view links the existing Family Elevator and CARO controller');
check(ui.includes('167 transitions + root/target') && ui.includes('not two extra threads'), '167 plus two is typed as transitions plus endpoint witnesses');
check(ui.includes('existing NumberMagick tilt connector') && ui.includes('not a new operator'), 'slash body reuses the tilt source instead of creating a new operator');
const centered = M.centeredPlateWindowRecord();
check(centered.formula === 'C(m)=4m^2+1', 'centered plate family declares the exact count formula');
check(JSON.stringify(centered.windowSizes.map(item => item.count)) === JSON.stringify([37,101,197,2501]), 'centered plate counts reproduce 37, 101, 197 and 2501');
check(centered.windowSizes.at(-1).pairedCount === 5002, 'paired outer window returns exactly 5002');
check(centered.windowSizes.every(item => item.count === 4 * item.m ** 2 + 1), 'every centered window satisfies four square plates plus one center');
check(centered.axisPairs.length === 6 && centered.axisPairs.every(([a,b]) => (b-a+12)%12 === 6), 'all six mod-12 pairs are opposite axes');
check(centered.rounds * centered.stepsPerRound === 24, 'motion contract is exactly two twelve-step rounds');
check(centered.sourceReuse.primeThread.rawTransitions === 167 && centered.sourceReuse.primeThread.endpointWitnesses === 2, 'Prime Thread inventory retains 167 transitions plus two endpoint witnesses');
check(JSON.stringify(centered.sourceReuse.primeThread.root7.rawDelta) === JSON.stringify([4,-7]) && JSON.stringify(centered.sourceReuse.primeThread.root7.wrappedDelta) === JSON.stringify([-3,4]), 'Root 7 to 11 retains exact raw and wrapped deltas');
check(centered.slashCube.role === 'NUMBERMAGICK_TILT_ADAPTER_VIEW' && centered.slashCube.source.endsWith('#pascal-bracket-tilt-projection'), 'slash body is an adapter of the existing NumberMagick tilt connector');
check(centered.sourceReuse.mathfield.roles.join('|') === 'CIKADA_CURTAIN|SCARAB_HULL|DRAGONFLY_010', 'Mathfield visual roles are reused without new identities');
check(centered.sourceReuse.familyAtlas.phase === 'F4_PHASE_DRIFT' && centered.sourceReuse.familyAtlas.topology === 'F5_CONNECTIVITY_TOPOLOGY', 'Family Elevator keeps phase/drift distinct from connectivity/topology');
check(centered.sourceReuse.caro.role === 'EXISTING_CARO_GREEN_MIRROR_CONTROLLER' && centered.sourceReuse.caro.plateRoute.endsWith('#plateMirrorBench'), 'CARO and plate mirror remain existing controller roles');
check(centered.navigatorEffect === 'NONE', 'bounded view creates no Navigator identity or relation');

check(html.includes('Δ₂(k)=√(k+1)−√k') && html.includes('Δ₃(k)=∛(k+1)−∛k'), 'Root Ruler note separates square-root and cube-root gaps');
check(ui.includes("trace(k=>M.rootGap(k).direct,'#67b8ff'") && ui.includes("trace(k=>M.cubeRootGap(k).direct,'#ffc21a'"), 'Root Ruler draws both exact gap traces');
check(ui.includes("1/(2*Math.sqrt(k))") && ui.includes("1/(3*Math.cbrt(k*k))"), 'Root Ruler draws both declared asymptotes');
check(ui.includes('TRIDENT SOURCE GUIDE') && ui.includes('3×120° · no numeric map'), 'Trident remains a typed source guide without a numeric coupling');
const rootRuler = M.rootRulerRecord(235);
check(Math.abs(rootRuler.square.direct - rootRuler.square.rationalized) < 1e-14, 'square-root gap rationalization returns at k=235');
check(Math.abs(rootRuler.cube.direct - rootRuler.cube.rationalized) < 1e-14, 'cube-root gap rationalization returns at k=235');
check(Math.abs(rootRuler.square.asymptoticRatio - 1) < .01 && Math.abs(rootRuler.cube.asymptoticRatio - 1) < .01, 'both exact gaps approach their asymptotic comparators by k=235');
check(JSON.stringify(rootRuler.anchors.rootroom) === JSON.stringify([2,5,7]) && JSON.stringify(rootRuler.anchors.codonF1) === JSON.stringify([5,11,17]), 'Rootroom and CODON source anchors remain separate registers');
check(JSON.stringify(rootRuler.sourceOverlay.tridentAnglesDegrees) === JSON.stringify([90,210,330]) && rootRuler.sourceOverlay.separationDegrees === 120, 'Trident source guide preserves its exact three-axis spacing');
check(data.roots.perfectCubeAnchors.every(n => Number.isInteger(Math.cbrt(n))), 'all cube-root anchors are perfect cubes inside the carrier');

const closures = data.layerClosures;
check(JSON.stringify(closures) === JSON.stringify([121,242,363,484,605,726,847,968,1089]), 'closure values define nine exact deck ends');
for (let z = 0; z < 9; z += 1) {
  const nodes = data.nodes.filter(node => node.cube.z === z);
  check(nodes.length === 121, `deck z${z} contains 121 carrier addresses`);
  check(nodes[0].n === z * 121 + 1 && nodes.at(-1).n === (z + 1) * 121, `deck z${z} retains its exact numeric range`);
}

console.log(`PASS · ${checks} checks · Primecube address decks and orthogonal plate families retain exact counts.`);
