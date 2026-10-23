const fs = require('fs');
const path = require('path');

const book = __dirname;
const pkg = path.dirname(book);
const read = file => fs.readFileSync(file, 'utf8');
const desk = read(path.join(book, 'A0_RESEARCH_DESK.html'));
const log = read(path.join(book, 'A0_BUILDER_LOG.html'));
const protocol = read(path.join(pkg, '106_A0_ORIENTATION_CONTROLLER_BENCH_SCIENCE_DESK_RETURN_2026-10-16.md'));
const findings = read(path.join(pkg, '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'));
const receipt = JSON.parse(read(path.join(book, 'results/a0-tower-shell-closed-return-2026-10-23.json')));

let checks = 0;
const ok = (value, label) => {
  checks += 1;
  if (!value) throw new Error(`FAIL ${checks}: ${label}`);
};

[
  [desk, 'tower-shell-return-science-desk-20261023'],
  [desk, 'METHOD_RELEVANT_ENGINEERING_OBSERVATION'],
  [desk, 'NO_NEW_FINDING'],
  [desk, 'WITNESS_HELD · 10/18'],
  [desk, 'CLOSED · q01 · RETURN'],
  [desk, 'Kein wiedergewonnener Tower-Operator'],
  [desk, 'results/a0-tower-shell-closed-return-2026-10-23.json'],
  [log, 'tower-shell-closed-return-20261023'],
  [log, 'MOUSE_Q_ADDRESS → TL_FINAL_PIN → DG_SHARED_APERTURE'],
  [log, 'CLOSED · q01 · RETURN HELD'],
  [protocol, 'tower-shell-closed-return-20261023'],
  [protocol, 'NO NEW FINDING'],
  [protocol, 'NO_ACTIVATION'],
  [findings, 'tower-shell-return-triage-20261023'],
  [findings, 'no new `F-A0` record'],
  [findings, 'Paper C'],
  [findings, 'Paper E'],
  [findings, 'No transfer'],
].forEach(([source, needle]) => ok(source.includes(needle), `missing ${needle}`));

ok(receipt.status === 'PASS', 'receipt status');
ok(receipt.classification === 'METHOD_RELEVANT_ENGINEERING_OBSERVATION', 'classification');
ok(receipt.findingDisposition === 'NO_NEW_FINDING', 'finding disposition');
ok(receipt.identity === 'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH', 'identity reuse');
ok(receipt.acceptance.moduleChecks === 84, 'module checks');
ok(receipt.acceptance.status === 'CLOSED · q01 · RETURN', 'browser status');
ok(receipt.acceptance.address === 'q01 · PIN ACCEPTED', 'browser address');
ok(receipt.acceptance.witness === 'WITNESS_HELD · 10/18', 'browser witness');
ok(receipt.acceptance.rootGate === 'CLOSED · q01 · RETURN HELD', 'browser root gate');
ok(receipt.closureContract.mismatchDisposition === 'HOLD', 'fail closed');
ok(receipt.route[0] === 'MOUSE_Q_ADDRESS', 'route source');
ok(receipt.route.at(-1) === 'SOURCE_ADDRESS_RECEIPT', 'route receipt');
ok(receipt.negativeControls.includes('NO_RECOVERED_TOWER_OPERATOR'), 'operator boundary');
ok(receipt.negativeControls.includes('NO_Q17_TO_N18_MAPPING'), 'basis boundary');
ok(receipt.negativeControls.includes('NO_SHARED_CLOCK'), 'clock boundary');
ok(receipt.negativeControls.includes('NO_WHOLE_MACHINE_RETURN'), 'return boundary');
ok(receipt.navigatorMutation === false, 'no navigator mutation');
ok(receipt.scienceRun === false, 'no science run');
ok(receipt.publicationRelease === false, 'no publication release');

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  scope: 'Tower–Shell closed Return backbound to Science Desk, return protocol, findings triage and Builder Log'
}));
