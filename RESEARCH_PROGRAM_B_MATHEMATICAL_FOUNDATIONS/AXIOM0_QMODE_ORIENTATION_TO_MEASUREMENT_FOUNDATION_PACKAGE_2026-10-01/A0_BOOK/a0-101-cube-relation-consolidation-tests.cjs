const fs = require('fs');
const path = require('path');

const root = __dirname;
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-101-cube-relation-consolidation-2026-11-24.json'), 'utf8'));
const note = fs.readFileSync(path.join(root, 'A0_101_CUBE_RELATION_CONSOLIDATION_2026-11-24.md'), 'utf8');
const science = fs.readFileSync(path.join(root, 'A0_SCIENCE.html'), 'utf8');
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const checks = [];
const check = (name, condition) => checks.push({ name, condition: Boolean(condition) });

check('reuses Number View Suite', receipt.identity_reuse.includes('MOD:NUMBER_VIEW_SUITE'));
check('records nine local bindings', receipt.local_bindings.length === 9);
check('Root Ruler keeps two root orders and three source registers typed', receipt.exact_register.root_ruler.square_asymptotic === '1/(2sqrt(k))' && receipt.exact_register.root_ruler.cube_asymptotic === '1/(3*k^(2/3))' && receipt.exact_register.root_ruler.numeric_map_declared === false);
check('keeps graph delta zero', receipt.authority_effect.graph_delta === 0);
check('keeps canonical relation delta zero', receipt.authority_effect.canonical_relation_delta === 0);
check('keeps A0/101 a reader route', receipt.non_identities.includes('A0/101 != another cube identity'));
check('keeps F4 and F5 separate', receipt.non_identities.includes('F4 Phase/Drift != F5 Connectivity/Topology'));
check('records centered plate 2501', receipt.exact_register.centered_plate_values['25'] === 2501);
check('records paired channel 5002', receipt.exact_register.paired_channel_at_m25 === 5002);
check('records 167 threads plus endpoint witnesses separately', receipt.exact_register.prime_thread_total === 167 && receipt.exact_register.prime_thread_endpoint_witnesses === 2);
check('note states no merge', note.includes('NO MERGE'));
check('science return is linked', science.includes('id="a0-101-cube-relations-20261124"'));
check('science desk return is linked', desk.includes('id="a0-101-cube-relations-20261124"'));
check('A0/101 entry points to relation return', home.includes('A0/101 · Relationsregister'));

const failed = checks.filter((item) => !item.condition);
for (const item of checks) console.log(`${item.condition ? 'PASS' : 'FAIL'} ${item.name}`);
if (failed.length) process.exit(1);
console.log(`PASS ${checks.length}/${checks.length} A0/101 cube relation consolidation checks`);
