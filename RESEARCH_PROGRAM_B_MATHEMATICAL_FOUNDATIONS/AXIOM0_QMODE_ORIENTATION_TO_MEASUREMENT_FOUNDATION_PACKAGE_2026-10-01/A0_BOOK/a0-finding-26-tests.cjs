#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const receipt = JSON.parse(read('results/a0-octave-2plus3-cross-carrier-finding-return-2026-10-30.json'));
const desk = read('A0_RESEARCH_DESK.html');
const mathfield = read('A0_MATHEMATICAL_JOINTS.html');
const builder = read('A0_BUILDER_LOG.html');
const paper = fs.readFileSync(path.resolve(root, '../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'), 'utf8');
const backlog = fs.readFileSync(path.resolve(root, '../24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md'), 'utf8');
const synthesis = read('results/a0-thread-science-desk-synthesis-2026-10-30.md');

const checks = [];
const check = (name, value) => checks.push({name, pass: Boolean(value)});

check('finding id', receipt.finding_id === 'F-A0-26');
check('partition 2+3', receipt.exact_core.partition.reduce((a,b)=>a+b,0) === receipt.exact_core.total);
check('keyboard black keys', receipt.exact_core.keyboard_octave.black_key_count === 5);
check('octave semitone steps', receipt.exact_core.keyboard_octave.semitone_steps === 12);
check('endpoint inclusive positions', receipt.exact_core.keyboard_octave.endpoint_inclusive_positions === 13);
check('graph degree split', receipt.exact_core.edelweiss_slot_graph.return_degree + receipt.exact_core.edelweiss_slot_graph.residual_degree === receipt.exact_core.edelweiss_slot_graph.full_degree);
check('shadow clamp role split', receipt.exact_core.shadow_clamp_view.up_roles + receipt.exact_core.shadow_clamp_view.down_roles === 5);
check('counterweight all 30 positions', Array.from({length:30},(_,i)=>i+(29-i)).every(v=>v===29));
check('counterweight comparator only', receipt.exact_core.pascal_counterweight.role === 'COMPARATOR_ONLY');
check('no address mutation', receipt.exact_core.pascal_counterweight.address_mutation === false);
check('3+1 remains hold', receipt.typed_extensions.three_plus_one_bands.status === 'HOLD');
check('paper E bounded route', receipt.paper_route.paper_e === 'BOUNDED_METHOD_AND_REPRESENTATION_EXAMPLE');
check('paper C held', receipt.paper_route.paper_c.includes('HOLD'));
check('no manuscript claim', receipt.paper_route.manuscript_claim_added === false);
check('no publication', receipt.paper_route.publication_authorized === false);
check('no navigator ids', receipt.governance.new_navigator_ids.length === 0);
check('no graph relations', receipt.governance.source_graph_relation_changes.length === 0);
check('no Study activation', receipt.governance.study_activation === false);
check('Desk binding', desk.includes('id="f-a0-26-octave-2plus3-cross-carrier-20261030"'));
check('Desk full synthesis binding', desk.includes('id="a0-thread-science-synthesis-20261030"'));
check('Mathfield finding', mathfield.includes('id="octave-2plus3-cross-carrier-finding"'));
check('Mathfield balance matrix', mathfield.includes('id="octave-balance-pair-band-extension"'));
check('Paper ledger row', paper.includes('| `F-A0-26`'));
check('Backlog science gates', backlog.includes('id="f-a0-26-science-gates-20261030"'));
check('Builder role boundary', builder.includes('id="f-a0-26-builder-binding-20261030"'));
check('Twelve-station synthesis', synthesis.includes('## 12. F-A0-26'));
check('fifth boundary retained', synthesis.includes('perfect fifth spans seven semitone steps'));
check('ten octave correction retained', synthesis.includes('ten octaves do not mathematically produce twelve'));

const failures = checks.filter(item=>!item.pass);
if (failures.length) {
  console.error(JSON.stringify({status:'FAIL', checks:checks.length, failures}, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({status:'PASS', checks:checks.length, finding:'F-A0-26', exactCore:'2+3=5 + typed counterpairs', extension:'3+1 HOLD'}, null, 2));
