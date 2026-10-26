const fs = require('node:fs');
const path = require('node:path');

const book = __dirname;
const pkg = path.dirname(book);
const lab = path.resolve(pkg, '..', '..', 'SCIENCE_LAB');
const receiptPath = path.join(book, 'results', 'a0-session-science-log-backlog-return-2026-10-26.json');
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
let checks = 0;
const expect = (condition, message) => {
  checks += 1;
  if (!condition) throw new Error(message);
};

expect(receipt.status === 'PASS_DOCUMENTARY_ENGINEERING_RETURN', 'session status drift');
expect(receipt.scientific_intake?.status === 'INTAKE_TRIAGE_ONLY_NOT_ADMITTED', 'intake must remain not admitted');
expect(receipt.scientific_intake?.build_authorized === false, 'intake must not authorize build');
expect(receipt.identity_decision?.new_identity === false, 'unexpected identity');
expect(receipt.identity_decision?.new_relation === false, 'unexpected relation');
expect(receipt.identity_decision?.new_study === false, 'unexpected study');
expect(receipt.identity_decision?.new_finding === false, 'unexpected finding');
for (const name of [
  'a0-blue-body-nine-view-swing-sync-return-2026-10-26.json',
  'a0-module-window-return-2026-10-26.json'
]) {
  expect(receipt.receipts.includes(name), `missing receipt ${name}`);
  expect(fs.existsSync(path.join(book, 'results', name)), `receipt not found ${name}`);
}

const targets = [
  [path.join(pkg, '22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md'), 'session-scientific-intake-20261026'],
  [path.join(pkg, '24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md'), 'session-scientific-intake-20261026'],
  [path.join(pkg, '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'), 'session-scientific-intake-20261026'],
  [path.join(book, 'A0_RESEARCH_BACKLOG.html'), 'INTAKE_TRIAGE_ONLY'],
  [path.join(book, 'A0_RESEARCH_DESK.html'), 'SCIENTIFIC_INTAKE_NOT_ADMITTED'],
  [path.join(book, 'A0_BUILDER_LOG.html'), 'NO_BUILD_AUTHORIZATION'],
  [path.join(lab, 'MISSION_CONTROL_RETURN_A0_SESSION_CLOSEOUT_AND_SCIENTIFIC_INTAKE_2026-10-26.md'), 'M-PUB01']
];
for (const [file, token] of targets) {
  expect(fs.existsSync(file), `missing target ${file}`);
  expect(fs.readFileSync(file, 'utf8').includes(token), `missing token ${token} in ${file}`);
}
expect(receipt.binding_targets.some((value) => value.includes('NAVIGATION/APP/index.html#a0-orientation-evidence')), 'NSN binding missing');
expect(receipt.binding_targets.some((value) => value.includes('MISSION_CONTROL_RETURN_A0_SESSION_CLOSEOUT')), 'Mission Control return missing');
expect(receipt.scientific_intake.stop_rule.includes('STOP'), 'STOP rule missing');

console.log(`PASS_${checks} A0 session closeout and scientific intake bindings`);
