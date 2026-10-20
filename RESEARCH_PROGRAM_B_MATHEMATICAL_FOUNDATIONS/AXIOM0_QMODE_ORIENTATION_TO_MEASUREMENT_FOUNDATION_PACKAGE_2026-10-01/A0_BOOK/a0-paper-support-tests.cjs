const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const html = fs.readFileSync(path.join(__dirname, 'A0_RESEARCH_DESK.html'), 'utf8');
const section = html.match(/<section class="spread" id="paper-support-20261018"[\s\S]*?<\/section>/)[0];
const notesPath = path.join(root, 'NUMBER_OPERATOR_ARCHITECTURE_CONCORDANCE_AUDIT/09_CURRENT_RELEVANCE_TO_A0_TESSAREC_IHARA_2026-10-13.md');
const notes = fs.readFileSync(notesPath, 'utf8');
let links = 0;
for (const [, href] of section.matchAll(/href="([^"]+)"/g)) {
  const [file, hash] = href.split('#');
  const target = file ? path.resolve(__dirname, decodeURIComponent(file)) : path.join(__dirname, 'A0_RESEARCH_DESK.html');
  assert.ok(fs.existsSync(target), href);
  if (hash && target.endsWith('.html')) assert.ok(fs.readFileSync(target, 'utf8').includes('id="' + hash + '"'), href);
  links++;
}
for (const [, href] of notes.slice(notes.indexOf('## 13.')).split('## 12.')[0].matchAll(/\]\(<?([^\n]+?)>?\)/g)) {
  const target = path.resolve(path.dirname(notesPath), href.split('#')[0]);
  assert.ok(fs.existsSync(target), href);
  links++;
}
assert.equal((section.match(/class="paper-card"/g) || []).length, 6);
assert.match(section, /keine Study-Aktivierung/);
assert.match(section, /Owner-Disposition offen/);
assert.match(section, /Bench bleibt geparkt/);
assert.match(notes, /Noch offen: Paar/);
assert.match(notes, /historischen PDFs/);
function phi(n) { let count = 0; for (let i=1;i<=n;i++) { let a=i,b=n; while(b) [a,b]=[b,a%b]; if(a===1) count++; } return count; }
assert.equal(phi(1111), 1000);
assert.equal(1111, 11*101);
assert.equal(1111-phi(1111), 111);
const primes=[2,3,5,7,11];
for (const [value, exps] of [[1000,[3,0,3,0,0]],[10000,[4,0,4,0,0]],[40,[3,0,1,0,0]],[400,[4,0,2,0,0]],[2,[1,0,0,0,0]]]) {
  assert.equal(exps.reduce((v,e,i)=>v*primes[i]**e,1),value);
}
assert.equal(40**2+40+41,41**2);
const workspace=fs.readFileSync(path.join(__dirname,'../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'),'utf8');
assert.equal(workspace.split('\n').filter(l=>l.startsWith('| `F-A0-')).length,16);
const manuscript = fs.readFileSync(path.join(__dirname, '../35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md'), 'utf8');
const paper = fs.readFileSync(path.join(__dirname, 'A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html'), 'utf8');
assert.match(manuscript, /### 8\.6 Zahl–Operator–Darstellungsfeld/);
assert.match(manuscript, /11537→11573→11357/);
assert.match(manuscript, /keine gespeicherten Zeit-Echos/);
assert.match(paper, /id="number-operator-instruments"/);
assert.match(html, /id="number-operator-paper-update"/);
assert.match(workspace, /Number–operator instrument field — paper integration/);
assert.match(manuscript, /id="theory-to-method"/);
assert.match(manuscript, /### 2\.1 Relationen werden Quellen/);
assert.match(manuscript, /### 14\.6 Sieben Primzahlen/);
assert.match(paper, /id="theory-to-method"/);
assert.match(html, /id="theory-method-paper-update"/);
assert.match(html, /id="core-documents"/);
assert.match(html, /href="A0_LIVING_BLUEPRINT\.html#a0-map-home">Crosswalk/);
assert.match(html, /NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07\.md/);
assert.match(html, /PATTERN_TOOLBOX_V0_1\.md/);
assert.match(notes, /id="prime-rhythm-20261018"/);
const firstSeven = Array.from({length:16}, (_,i)=>i+2).filter(n=>{
  for(let d=2;d*d<=n;d++) if(n%d===0) return false;
  return true;
});
assert.deepEqual(firstSeven,[2,3,5,7,11,13,17]);
assert.equal(firstSeven.filter(n=>n<10).length,4);
assert.equal(firstSeven.filter(n=>n>=10).length,3);
const context=html.match(/<section class="spread" id="nexah-a0-context"[\s\S]*?<\/section>/)[0];
assert.equal((context.match(/data-nexah-context=/g)||[]).length,3,'three self-description additions, not new findings');
for(const role of ['purpose','offer','question'])assert.ok(context.includes('data-nexah-context="'+role+'"'));
assert.match(context,/Kuratieren, Gestalten und Untersuchen/);
assert.match(context,/Zusatzinformation ermöglicht eine eindeutige Rekonstruktion/);
assert.match(context,/kein neues Finding/);
assert.match(context,/noch keine Freigabe/);
assert.match(context,/keine vollständige A0-Veröffentlichung/);
assert.match(context,/ohne den bestehenden Workspace zu ersetzen/);
assert.match(context,/Verfügbarkeit, Kontrolle und technische Eignung sind nicht geprüft/);
for(const [,href]of context.matchAll(/href="([^"]+)"/g)){
  if(href.startsWith('https://'))continue;
  const [file,hash]=href.split('#'),target=file?path.resolve(__dirname,decodeURIComponent(file)):path.join(__dirname,'A0_RESEARCH_DESK.html');
  assert.ok(fs.existsSync(target),href);
  if(hash){const source=fs.readFileSync(target,'utf8');assert.ok(source.includes('id="'+hash+'"'),href);}
  links++;
}
assert.ok(context.includes('https://nexah.de/'),'public description remains attached');
const log=fs.readFileSync(path.join(__dirname,'A0_BUILDER_LOG.html'),'utf8');
assert.ok(log.includes('A0_RESEARCH_DESK.html#nexah-a0-context'),'Builder return');
const strategy=html.match(/<section class="spread" id="mc-a0-strategy-return"[\s\S]*?<\/section>/)[0];
assert.match(strategy,/Owner-Disposition ausstehend/);
assert.match(strategy,/bleibt bis zu dieser Disposition und gesonderter Aktivierung/);
assert.match(strategy,/kein PASS für sämtliche Portfolio-Belege/);
for(const [,href]of strategy.matchAll(/href="([^"]+)"/g)){
 const [file,anchor]=href.split('#'),target=file?path.resolve(__dirname,decodeURIComponent(file)):path.join(__dirname,'A0_RESEARCH_DESK.html');
 assert.ok(fs.existsSync(target),href);
 if(anchor)assert.ok(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),href);
 links++;
}
const ownerPath=path.resolve(__dirname,'../../../../../00 EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/OWNER_VIEW.md'),owner=fs.readFileSync(ownerPath,'utf8');
const assessment=owner.split('<a id="a0-strategy-assessment-20261018"></a>')[1].split('#### Bestehende Leitprioritäten')[0];
assert.match(owner,/ACTIVE PRIORITY: NONE/);
assert.match(assessment,/RECOMMENDATIONS_NOT_ACTIVATED/);
for(const exit of ['Wissenschaftlicher Exit','Kulturell-edukativer Exit','Methoden-\/Anwendungs-Exit','Bewahrungs-Exit'])assert.ok(assessment.includes(exit.replace('\\/','/')),exit);
assert.match(assessment,/7\.535714/);
assert.match(assessment,/kein neuer Run|keinen neuen Run/);
for(const match of assessment.matchAll(/\]\(<([^>]+)>\)/g)){
 const target=path.resolve(path.dirname(ownerPath),match[1].split('#')[0]);
 assert.ok(fs.existsSync(target),match[1]);links++;
}
console.log(JSON.stringify({status:'PASS', local_links:links, paper_cards:6, formal_records:16, paper_e_integration:true, scope:'documentary support and exploration; no science run'},null,2));

