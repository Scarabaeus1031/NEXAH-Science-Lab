const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {URLSearchParams}=require('node:url');
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const html=fs.readFileSync('A0_MATHEMATICAL_JOINTS.html','utf8');
const part=html.split('<section class="section" id="register-cut-aperture"')[1]?.split('<section class="section dark" id="qdef"')[0];
check(Boolean(part),'existing Mathfield has the new source walk');
const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
const systemMap=main.search(/<section\b[^>]*\bid="a0-svr-01-route"/);
const hero=main.search(/<section\b[^>]*\bclass="hero"/);
const executableMath=main.search(/<section\b[^>]*\bid="executable-math"/);
check(systemMap>=0&&hero>systemMap,'A0-SVR-01 precedes the hero');
check(hero>=0&&executableMath>hero,'hero precedes Executable Math');
check(html.includes('function restoreDeepLink()'),'file deep links are restored after embedded assets load');
check((part.match(/<svg /g)||[]).length===4,'four static schematics');
check((part.match(/<title>/g)||[]).length===4,'each diagram has accessible title');
check(!/<script|<iframe|setInterval|requestAnimationFrame/.test(part),'no second simulation or auto-loaded source');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
check(new Set(ids).size===ids.length,'unique page IDs');
for(const m of part.matchAll(/href="([^"]+)"/g)){
 if(m[1].startsWith('https://')){
  if(m[1].startsWith('https://github.com/Scarabaeus1033/NEXAH-CODEX/')){
   const source=m[1].match(/^https:\/\/github\.com\/Scarabaeus1033\/NEXAH-CODEX\/blob\/[a-f0-9]{40}\/(.+)#L\d+-L\d+$/)?.[1];
   check(source&&decodeURIComponent(source)==='SYSTEM_1_MATHEMATICA/Hermetic_Pythagoras_Model/GEOMETRIA NOVA · Part VII — Quaternionic Resonance & Retrograde Proofs/README.md','revision-pinned Geometria Nova VII source link');
   continue;
  }
  const source=m[1].match(/^https:\/\/github\.com\/Scarabaeus1031\/NEXAH\/blob\/[a-f0-9]{40}\/(.+)#L\d+-L\d+$/)?.[1];
  check([
   'RESEARCH/FOUNDATION/MATHEMATICAL_FOUNDATIONS_GLOSSARY.md',
   'APPLICATIONS/power_systems/stability_field_dynamics/ieee_test_cases/outputs/v32_phase_classifier.csv',
  ].includes(source),'revision-pinned Core source link: '+m[1]);
  continue;
 }
 const [location,anchor]=m[1].split('#');
 const [file,query='']=location.split('?');
 if(!file&&anchor){
  check(ids.includes(anchor),'same-page anchor exists: '+m[1]);
  continue;
 }
 const target=path.resolve(decodeURIComponent(file));
 check(fs.existsSync(target),'local source exists: '+file);
 if(anchor){
  const text=fs.readFileSync(target,'utf8');
  if(file==='A0_GAME_OF_WORLDS_PLAY.html'&&anchor==='numbers'){
   const params=new URLSearchParams(query.replaceAll('&amp;','&'));
   check(text.includes('data-route="numbers"'),'Numbergame route exists');
   check(params.get('world')==='numbers'&&params.get('view')==='wheels'&&params.get('rule')==='wheels','Numbergame link selects Wheels');
  }else if(file.endsWith('/APP/index.html')&&anchor==='ilau-orientation'){
   const binder=JSON.parse(fs.readFileSync('../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/ILAU_ORIENTATION_INSTRUMENTS_2026-10-09/ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json','utf8'));
   check(binder.route==='#'+anchor,'generated NSN route is source-bound');
  }else check(text.includes('id="'+anchor+'"'),'local anchor exists: '+m[1]);
 }
}
for(const term of ['keine neue Simulation','keinen gemeinsamen Generator','beschnittener Formen','A ∖ B','B ∖ A','1/64','sechs','sieben','keine Topologie- oder Operatoridentität','nicht die 28 TESA-Zelladressen','Papers'])check(part.includes(term),'explicit boundary: '+term);
check(fs.readFileSync('A0_NUMBERMAGICK_GRID_RESEARCH.html','utf8').includes('A0_MATHEMATICAL_JOINTS.html#register-cut-aperture'),'reciprocal NumberMagick link');
const css=fs.readFileSync('a0-mathfield-source-walk.css','utf8');
check(css.includes('@media(max-width:720px)'),'narrow layouts stack');
check(css.includes('#register-cut-aperture:target'),'direct target is visibly marked');
console.log(JSON.stringify({status:'PASS',checks,scope:'Static source walk, source paths/anchors, NSN route, unique IDs, accessible titles and claim boundaries. Browser visual acceptance OPEN.'},null,2));
