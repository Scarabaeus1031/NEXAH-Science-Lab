import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
let checks=0;
const failures=[];
const check=(condition,label)=>{checks+=1;if(!condition)failures.push(label)};
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');

const receiptPath='A0_BOOK/results/a0-session-science-log-backlog-return-2026-10-26.json';
const receipt=JSON.parse(read(receiptPath));
check(receipt.status==='PASS_DOCUMENTARY_ENGINEERING_RETURN','consolidated return status');
check(receipt.identity_decision.new_identity===false,'no new identity');
check(receipt.identity_decision.new_relation===false,'no new relation');
check(receipt.identity_decision.lab_register_changed===false,'Lab Register unchanged');
check(receipt.still_shell_boundary.state_token==='STILL','STILL token retained');
check(receipt.still_shell_boundary.owner_mnemonic==='S-HELL','S-HELL mnemonic recorded');
check(receipt.still_shell_boundary.canonical_open_shell_binding===null,'no canonical Open Shell binding');

for(const name of receipt.receipts){
  const relative=`A0_BOOK/results/${name}`;
  check(fs.existsSync(path.join(root,relative)),`receipt exists: ${name}`);
  if(fs.existsSync(path.join(root,relative)))check(Boolean(JSON.parse(read(relative))),`receipt parses: ${name}`);
}

const bindings=[
  ['22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md','session-engineering-return-20261026'],
  ['24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md','session-engineering-return-20261026'],
  ['A0_BOOK/A0_RESEARCH_BACKLOG.html','session-engineering-return-20261026'],
  ['A0_BOOK/A0_RESEARCH_DESK.html','session-engineering-return-20261026'],
  ['A0_BOOK/A0_BUILDER_LOG.html','session-engineering-return-20261026'],
  ['A0_BOOK/A0_IOTA_BRIDGE_DEMONSTRATOR.html','S-HELL'],
  ['A0_BOOK/a0-iota-2-3-bridge-probe.js','LOCAL_VIEW_MNEMONIC']
];
for(const [relative,token] of bindings)check(read(relative).includes(token),`${relative} binds ${token}`);

const backlog=read('24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md');
for(const token of ['DOC-01','DOC-02','SCC-003','YUGO? UNBOUND'])check(backlog.includes(token),`open gate preserved: ${token}`);

const report={status:failures.length?'FAIL':'PASS',checks,failures,scope:'A0 2026-10-26 documentary return chain and STILL/S-HELL collision boundary; no science activation'};
console.log(JSON.stringify(report));
if(failures.length)process.exitCode=1;
