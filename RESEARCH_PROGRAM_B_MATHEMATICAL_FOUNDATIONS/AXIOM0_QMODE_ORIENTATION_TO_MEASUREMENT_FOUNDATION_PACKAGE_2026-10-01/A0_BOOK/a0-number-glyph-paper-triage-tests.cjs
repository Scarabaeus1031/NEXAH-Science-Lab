const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const html=fs.readFileSync('A0_NUMBERMAGICK_GRID_RESEARCH.html','utf8'),workspace=fs.readFileSync('../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md','utf8');
const section=html.split('<section id="number-glyph-weight-return"')[1]?.split('<section id="entwicklung"')[0];
check(Boolean(section),'NumberMagick has scoped synthesis');
for(const m of section.matchAll(/href="([^"]+)"/g)){
 const [file,anchor]=m[1].split('#'),target=path.resolve(decodeURIComponent(file));
 check(fs.existsSync(target),'source exists: '+file);
 if(anchor)check(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),'anchor exists: '+anchor);
}
const triage=workspace.split('## Number, glyph and weight — paper triage, 2026-10-20')[1]?.split('## Findings ledger')[0];
check(Boolean(triage),'paper triage separate from ledger');
for(const m of triage.matchAll(/\]\(([^)]+)\)/g)){
 const [file,anchor]=m[1].split('#'),target=path.resolve('..',file);
 check(fs.existsSync(target),'workspace source exists: '+file);
 if(anchor)check(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),'workspace anchor exists: '+anchor);
}
for(const [n,q,r,m] of [[11537n,576n,17n,20n],[11735n,586n,15n,20n],[11537n,1048n,9n,11n],[11735n,1066n,9n,11n]])check(n===m*q+r,'typed integer decomposition');
const source=fs.readFileSync('../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08/README.md','utf8');
for(const number of ['0.5307','0.5277','0.5853','0.6084'])check(source.includes(number)&&triage.includes(number),'counterevidence retained: '+number);
for(const word of ['NOT_ACTIVE','NOT_SUBMITTED','No new formal finding','not an extension of the F-A0 ledger','Paper manuscripts and review states are','negative result must accompany the formula','not a second backlog'])check(workspace.includes(word),'paper boundary: '+word);
check(!/<script|<iframe/.test(section),'no new runtime');
check(section.includes('nicht bestätigt')&&section.includes('7→8'),'negative result and topology boundary visible');
console.log(JSON.stringify({status:'PASS',checks,scope:'Editorial links, exact integer examples and preserved source counterevidence; no science rerun. Browser visual acceptance OPEN.'},null,2));
