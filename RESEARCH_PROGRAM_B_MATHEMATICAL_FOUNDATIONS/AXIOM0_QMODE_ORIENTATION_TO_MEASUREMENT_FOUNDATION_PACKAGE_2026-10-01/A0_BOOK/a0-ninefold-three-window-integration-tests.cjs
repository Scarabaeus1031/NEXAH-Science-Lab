const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const ok = (condition, label) => {
  checks += 1;
  if (!condition) throw new Error(`FAIL ${checks}: ${label}`);
  console.log(`PASS ${checks}: ${label}`);
};

const workbench = read('A0_WERKBANK.html');
const mathfield = read('A0_MATHEMATICAL_JOINTS.html');
const science = read('A0_RESEARCH_DESK.html');
const findings = read('../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md');
const binding = JSON.parse(read('assets/a0-ninefold-three-window-source-binding-v1.json'));

ok(workbench.includes('id="ninefold-three-window-machine"'), 'Workbench exposes the machine-grammar crosswalk');
ok(workbench.indexOf('id="ninefold-three-window-machine"') < workbench.indexOf('id="numberTowerOrientationLens"'), 'Machine grammar sits directly before the Number Tower carrier section');
ok(workbench.includes('8 DIREKTIONALE VIEWS + 1 RETURN-PIVOT + 3 ARBEITSFENSTER'), 'Workbench declares the 8+1+3 reading');
ok(workbench.includes('assets/game-of-worlds-play/ioi-world-cube/index.html?embed=progression'), 'Workbench visibly embeds the existing source-bound Cube module');
ok(workbench.includes('EXISTING MODULE · VIEW ONLY'), 'Cube embed remains explicitly view-only');
ok(workbench.includes('Das Game bleibt geparkt'), 'Workbench keeps the game parked');
ok(workbench.includes('13') && workbench.includes('offene nächste Schwelle'), 'Workbench keeps 13 open');
ok(mathfield.includes('id="ninefold-three-window-reading-contract"'), 'Mathfield carries the reading contract');
ok(mathfield.includes('EDITORIAL ADDRESS COUNT ONLY') && mathfield.includes('GAME 0'), 'Mathfield enforces the claim ceiling');
ok(science.includes('8+1 FRAME + 3 WINDOWS'), 'Science Desk classifies the Workbench placement');
ok(science.includes('A0_WERKBANK.html#ninefold-three-window-machine'), 'Science Desk returns to the Workbench crosswalk');
ok(findings.includes('Ninefold + Three Windows — Machine-Grammatik und Paper-Routing'), 'Findings workspace carries the paper routing');
ok(findings.includes('Paper C / Return without identity') && findings.includes('Paper E / Orientation') && findings.includes('Paper F / frame sequences and envelopes'), 'Paper C, E and F are routed explicitly');
ok(binding.status === 'DOCUMENTARY_CROSSWALK_ONLY_GAME_PARKED', 'Binding is documentary and game-parking is explicit');
ok(binding.reading.editorialAddressCount === 12 && binding.reading.nextThreshold.includes('OPEN'), 'Binding records 12 as editorial and 13 as open');
ok(binding.authority.newCanonicalIdentity === false && binding.authority.newGraphRelation === false && binding.authority.gameActivation === false, 'Binding creates no identity, graph relation or game activation');

for (const source of binding.sources) {
  const absolute = path.resolve(root, 'assets', source.path);
  ok(fs.existsSync(absolute), `Bound source exists: ${source.path}`);
  const actual = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
  ok(actual === source.sha256, `Bound source hash matches: ${source.path}`);
}

console.log(`PASS ${checks}/${checks} · NINEFOLD + THREE-WINDOW INTEGRATION`);
