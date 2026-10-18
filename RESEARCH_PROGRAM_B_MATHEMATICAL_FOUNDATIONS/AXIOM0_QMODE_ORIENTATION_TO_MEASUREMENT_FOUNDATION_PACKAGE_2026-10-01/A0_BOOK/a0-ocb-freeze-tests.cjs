const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');

const freeze = JSON.parse(fs.readFileSync('assets/a0-orientation-controller-bench-freeze-v0.17.0.json', 'utf8'));
const recovery = JSON.parse(fs.readFileSync('assets/a0-ocb-source-recovery-v1.json', 'utf8'));
const manual = JSON.parse(fs.readFileSync('results/a0-ocb-manual-browser-acceptance-2026-10-18.json', 'utf8'));
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks += 1; };
const hash = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');

eq(freeze.version, '0.17.0', 'frozen version');
eq(freeze.legacySpecificationPath.decision, 'RETAIN_STABLE_HISTORICAL_FILENAME', 'legacy filename decision');
eq(freeze.legacySpecificationPath.rename, false, 'no path churn');
eq(freeze.files.length, 16, 'incremental freeze pin count');
freeze.files.forEach(file => {
  ok(fs.existsSync(file.path), `exists: ${file.path}`);
  eq(hash(file.path), file.sha256, `hash: ${file.path}`);
});
eq(JSON.parse(fs.readFileSync('assets/a0-orientation-controller-bench-v0.5.json', 'utf8')).version, freeze.version, 'spec version agrees');
ok(fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html', 'utf8').includes(`v${freeze.version}`), 'HTML version agrees');
eq(recovery.targets.length, 7, 'seven recovery targets');
eq(recovery.summary.exactSources, 0, 'no invented exact source');
eq(recovery.summary.derivativeViews, 1, 'one recovered derivative');
eq(recovery.summary.screenshotOnly, 1, 'one screenshot-only target');
eq(recovery.summary.ownerSuppliedConceptVisuals, 5, 'five concept visuals');
recovery.targets.forEach(target => ok(['EXACT SOURCE','HISTORICAL EXECUTABLE','DERIVATIVE VIEW','SCREENSHOT-ONLY','OWNER-SUPPLIED CONCEPT VISUAL'].includes(target.classification), `classification: ${target.title}`));
eq(manual.status, 'HUMAN_OWNER_REVIEW_REQUIRED_LOCAL_FILE_AUTOMATION_BLOCKED', 'manual status honest');
eq(manual.attempts.every(attempt => attempt.visualPassClaimed === false), true, 'no false visual pass');
eq(manual.requested.length, 4, 'tablet phone high zoom and live adapters retained');
eq(freeze.authority.newCanonicalIdentity, false, 'no new identity');
eq(freeze.authority.researchExecution, false, 'not a research run');
eq(freeze.acceptance.coupledWindows, 'PASS_10_WINDOWS_90_APERTURE_RECORDS', 'coupled window acceptance');
eq(freeze.acceptance.invarianceObservatory, 'PASS_235_OF_235_56_COMPARISONS', 'observatory acceptance');
eq(freeze.acceptance.sessionLedger, 'PASS_18_OF_18', 'session ledger acceptance');
eq(freeze.acceptance.showcaseTour, 'PASS_48_OF_48_20_STATIONS', 'twenty-station tour acceptance');

console.log(JSON.stringify({status:'PASS', checks, freezePins:freeze.files.length, recoveryTargets:recovery.targets.length, manualPixelAcceptance:false}));
