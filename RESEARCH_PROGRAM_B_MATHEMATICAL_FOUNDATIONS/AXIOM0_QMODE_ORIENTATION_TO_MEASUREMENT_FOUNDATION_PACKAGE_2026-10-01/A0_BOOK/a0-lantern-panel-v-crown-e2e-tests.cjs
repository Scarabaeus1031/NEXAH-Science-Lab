const fs = require('node:fs');
const path = require('node:path');

let checks = 0;
const failures = [];
const check = (condition, label) => {
  checks += 1;
  if (!condition) failures.push(label);
};
const read = (relative) => fs.readFileSync(path.join(__dirname, relative), 'utf8');
const panel = read('A0_LANTERN_PANEL_V_CONTROL_LENS.html');
const crown = read('A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html');
const workbench = read('A0_WERKBANK.html');
const desk = read('A0_RESEARCH_DESK.html');
const registers = read('A0_DATA_AND_REGISTERS.html');
const bench = read('A0_ORIENTATION_CONTROLLER_BENCH.html');
const modules = read('A0_BENCH_MODULES.html');
const receipt = JSON.parse(read('results/a0-pentagon-crown-return-demonstrator-2026-10-29.json'));
const navRoot = path.resolve(__dirname, '../../../SCIENCE_LAB/NAVIGATION');
const binder = JSON.parse(fs.readFileSync(path.join(navRoot, 'EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json'), 'utf8'));
const app = fs.readFileSync(path.join(navRoot, 'APP/app.js'), 'utf8');
const registry = fs.readFileSync(path.join(navRoot, 'NEXAH_MODULE_REGISTRY_V2_2026-10-05.json'), 'utf8');
const graphIndex = fs.readFileSync(path.join(navRoot, 'GOVERNANCE/SOURCE_GRAPH_INDEX_V1_2026-10-10.json'), 'utf8');

const expectedAnchors = [
  ['A0_WERKBANK.html', 'lanternPanelVCrownExactReturn'],
  ['A0_WERKBANK.html', 'lanternHingeActuatorEngineering'],
  ['A0_LANTERN_PANEL_V_CONTROL_LENS.html', 'bench-page-top'],
  ['A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html', 'bench-page-top'],
  ['A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html', 'returnPlane'],
  ['A0_RESEARCH_DESK.html', 'panel-v-control-lens-return-20261029'],
  ['A0_RESEARCH_DESK.html', 'lantern-panel-v-crown-exact-return-20261029'],
  ['A0_RESEARCH_DESK.html', 'lantern-crown-source-replay-return-20261029'],
  ['A0_RESEARCH_DESK.html', 'lantern-crown-finite-envelope-return-20261029'],
  ['A0_RESEARCH_DESK.html', 'lantern-hinge-actuator-housing-return-20261029'],
  ['A0_RESEARCH_DESK.html', 'spin-to-bloom-measurement-return-20261029']
];
for (const [file, anchor] of expectedAnchors) {
  const html = read(file);
  check(html.includes(`id="${anchor}"`), `${file}#${anchor}`);
}

check(panel.includes('A0_RESEARCH_DESK.html#panel-v-control-lens-return-20261029'), 'Panel V direct I-46S.2 return');
check(panel.includes('A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html#bench-page-top'), 'Panel V to Crown');
check(panel.includes('A0_RESEARCH_DESK.html#lantern-panel-v-crown-exact-return-20261029'), 'Panel V to canonical Desk receipt');
check(crown.includes('A0_LANTERN_PANEL_V_CONTROL_LENS.html#bench-page-top'), 'Crown to Panel V');
check(crown.includes('A0_WERKBANK.html#lanternPanelVCrownExactReturn'), 'Crown to Workbench reference');
check(crown.includes('A0_RESEARCH_DESK.html#lantern-panel-v-crown-exact-return-20261029'), 'Crown to Desk receipt');
check(workbench.includes('Panel V → Crown → Exact Return → Desk'), 'Workbench canonical route wording');
check(desk.includes('CURRENT_CANONICAL_SOURCE_BOUND_REFERENCE'), 'Desk classification');
check(registers.includes('id="lantern-panel-v-crown-exact-return"'), 'register locator projection');
check(bench.includes('id="lanternPanelVCrownExactReturnBench"'), 'Full Bench route projection');
check(modules.includes('Panel V Control Lens'), 'Module shelf projection');

const crosswalk = binder.bench_science_return_crosswalk_20261029;
const panelArtifact = crosswalk.artifacts.find((item) => item.name === 'Panel V Fold Pocket and Joint Microscope');
const crownArtifact = crosswalk.artifacts.find((item) => item.name === 'Pentagon Crown demonstrator UI cut');
check(panelArtifact.bench_configuration.endsWith('#lanternHingeActuatorEngineering'), 'Panel V direct Bench configuration');
check(panelArtifact.science_desk.endsWith('#panel-v-control-lens-return-20261029'), 'Panel V direct Desk anchor');
check(crownArtifact.bench_configuration.endsWith('#lanternPanelVCrownExactReturn'), 'Crown canonical Workbench anchor');
check(crownArtifact.science_desk.endsWith('#lantern-panel-v-crown-exact-return-20261029'), 'Crown canonical Desk receipt');

const frozen = binder.canonical_flagship_reference_20261029;
check(frozen.status === 'CURRENT_CANONICAL_SOURCE_BOUND_REFERENCE_FROZEN', 'frozen canonical status');
check(frozen.chain.map((item) => item.stage).join('→') === 'Lantern / Panel V→Pentagon Crown→Exact Return→Science Desk Receipt', 'four-stage canonical chain');
check(frozen.identity_reuse.join(',') === 'ART:A0:MATHEMATICAL_JOINTS,NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1,NEXAH_A0_ORIENTATION_CONTROLLER_BENCH', 'identity reuse only');
check(Object.values(frozen.authority_bindings).join(',') === 'I-46Q,I-46R,I-46S,I-46S.2,I-46S.4', 'authority bindings retained');
check(frozen.new_canonical_ids.length === 0 && frozen.relation_changes.length === 0, 'no ID or relation changes');
check(frozen.publication_authorized === false, 'no publication authority');
check(receipt.canonical_end_to_end_reference.status === 'CURRENT_CANONICAL_SOURCE_BOUND_REFERENCE_FROZEN', 'receipt freeze status');
check(receipt.canonical_end_to_end_reference.new_canonical_identity === false, 'receipt no identity creation');
check(receipt.canonical_end_to_end_reference.new_relation === false, 'receipt no relation creation');
check(receipt.verification.module_test === '35/35 PASS', 'Crown module test retained');
check(app.includes('canonical_flagship_reference_20261029') && app.includes('a0-lantern-panel-v-crown-exact-return'), 'NSNavigator renders canonical reference');
check(registry.includes('ART:A0:MATHEMATICAL_JOINTS'), 'existing registry identity present');
check(graphIndex.includes('A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json'), 'existing Source Graph component retained');

if (failures.length) {
  console.error(JSON.stringify({ status: 'FAIL', checks, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  status: 'PASS',
  checks,
  chain: 'Lantern / Panel V → Pentagon Crown → Exact Return → Science Desk Receipt',
  newCanonicalIds: 0,
  relationChanges: 0
}, null, 2));
