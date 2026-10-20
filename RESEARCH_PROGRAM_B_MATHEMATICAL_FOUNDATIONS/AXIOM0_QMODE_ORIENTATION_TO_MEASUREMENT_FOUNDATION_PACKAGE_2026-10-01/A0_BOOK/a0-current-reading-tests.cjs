'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),M=require('./a0-orientation-map.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++},read=f=>fs.readFileSync(path.resolve(__dirname,f),'utf8');
const tours=read('A0_TOURS.html'),section=tours.split('<section id="current-reading"')[1].split('</section>')[0];
ok(section,'current reading section');
ok((section.match(/<figure>/g)||[]).length===5,'five owner visuals kept together');
ok(section.includes('Bench-Bau pausiert')&&section.includes('Keine automatische Fortsetzung'),'pause survives navigation update');
for(const phrase of ['NO E8 ANTIPODAL SPECIFICITY','PARTIAL SIGNAL / GATE FAIL','kein physikalisches Farbspektrum','Browserabnahme dieser neuen Pfade offen','Auditprofil, nicht Schattenantrieb'])ok(section.includes(phrase),'boundary '+phrase);
for(const m of section.matchAll(/(?:href|src)="([^"]+)"/g)){
  const [file,anchor]=m[1].split('#'),target=path.resolve(__dirname,file);
  ok(fs.existsSync(target),'existing route '+file);
  if(anchor&&file!=='A0_THEORY_STORYBOARD.html')ok(read(file).includes('id="'+anchor+'"'),'real anchor '+m[1]);
}
for(const f of ['A0_LIVING_BLUEPRINT.html','A0_THEORY_STORYBOARD.html'])ok(read(f).includes('A0_TOURS.html#current-reading'),'reading path bound into '+f);
for(const r of M.routes.filter(r=>['joint','fold'].includes(r.key)))ok(M.advance(r,0).blocked,'parked runtime transition cannot advance');
const receipt=JSON.parse(read('assets/a0-orientation-map-v1.json'));
for(const image of receipt.readingPath.visuals){
  const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  ok(hash(path.resolve(__dirname,image.path))===image.sha256,'copied visual hash');
  ok(hash(image.originalPath)===image.sha256,'owner original unchanged');
}
const mapSource=fs.readFileSync(path.join(__dirname,'a0-orientation-map.js'),'utf8');
ok(!/postMessage|setInterval|fetch\(/.test(mapSource),'map remains read-only, no source clock or commands');
ok(mapSource.includes('requestAnimationFrame')&&mapSource.includes('restoreSourceFocus'),'animation frame is limited to exact UI return, not a source clock');
ok(receipt.readingPath.benchBuildPaused&&receipt.readingPath.browserAcceptance===false,'no activation or acceptance promotion');
console.log(JSON.stringify({status:'PASS',checks,visuals:5,mapNodes:M.nodes.length,edges:M.edges.length,routes:M.routes.length,browserAcceptance:false}));
