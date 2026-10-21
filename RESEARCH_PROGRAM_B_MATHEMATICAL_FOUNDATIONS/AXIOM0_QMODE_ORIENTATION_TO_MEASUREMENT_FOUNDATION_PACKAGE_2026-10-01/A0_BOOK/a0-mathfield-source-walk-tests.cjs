const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const html=fs.readFileSync('A0_MATHEMATICAL_JOINTS.html','utf8');
const part=html.split('<section class="section" id="register-cut-aperture"')[1]?.split('<section class="hero"')[0];
check(Boolean(part),'existing Mathfield has the new source walk');
check((part.match(/<svg /g)||[]).length===4,'four static schematics');
check((part.match(/<title>/g)||[]).length===4,'each diagram has accessible title');
check(!/<script|<iframe|setInterval|requestAnimationFrame/.test(part),'no second simulation or auto-loaded source');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
check(new Set(ids).size===ids.length,'unique page IDs');
for(const m of part.matchAll(/href="([^"]+)"/g)){
 const [file,anchor]=m[1].split('#'),target=path.resolve(decodeURIComponent(file));
 check(fs.existsSync(target),'local source exists: '+file);
 if(anchor){
  const text=fs.readFileSync(target,'utf8');
  if(file.endsWith('/APP/index.html')&&anchor==='ilau-orientation'){
   const binder=JSON.parse(fs.readFileSync('../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/ILAU_ORIENTATION_INSTRUMENTS_2026-10-09/ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json','utf8'));
   check(binder.route==='#'+anchor,'generated NSN route is source-bound');
  }else check(text.includes('id="'+anchor+'"'),'local anchor exists: '+m[1]);
 }
}
for(const term of ['keine neue Simulation','keinen gemeinsamen Generator','beschnittener Formen','A ∖ B','B ∖ A','1/64','sechs','sieben','keine Topologie- oder Operatoridentität','nicht die 28 TESA-Zelladressen','Papers'])check(part.includes(term),'explicit boundary: '+term);
check(fs.readFileSync('A0_NUMBERMAGICK_GRID_RESEARCH.html','utf8').includes('A0_MATHEMATICAL_JOINTS.html#register-cut-aperture'),'reciprocal NumberMagick link');
check(fs.readFileSync('a0-mathfield-source-walk.css','utf8').includes('@media(max-width:720px)'),'narrow layouts stack');
console.log(JSON.stringify({status:'PASS',checks,scope:'Static source walk, source paths/anchors, NSN route, unique IDs, accessible titles and claim boundaries. Browser visual acceptance OPEN.'},null,2));
