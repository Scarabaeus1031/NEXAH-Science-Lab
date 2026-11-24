'use strict';
const fs=require('fs');
const path=require('path');
const base=__dirname;
const file=path.join(base,'A0_PRIMEFIELD.html');
const html=fs.readFileSync(file,'utf8');
const failures=[];let checks=0;
function ok(value,label){checks++;if(!value)failures.push(label)}
ok(/<title>A0 Primefield/.test(html),'Primefield title');
ok(/id="grammar"/.test(html),'grammar section');
ok(/id="instruments"/.test(html),'instrument atlas');
ok(/id="equations"/.test(html),'equation section');
ok(/id="cases"/.test(html),'orientation cases');
ok(/id="status"/.test(html),'status section');
for(const token of ['Source integer','Primecube','NLK ↔ Primecube','Harmonic Prime Grid 37','Prime Torus Thread','Prime Polar Cut Atlas','Helix / RDMH','Projection Suite','Mirror Nodes','CRT ↔ Root','Root Shrinking 1729','1729 ↔ 1836']){
  ok(html.includes(token)||html.toUpperCase().includes(token),'content token '+token);
}
for(const equation of ['n = 1 + x + 11y + 121z','column = (n−1) mod 37','Δₖ = √(k+1) − √k','θₘ(p) = 2π']){
  ok(html.includes(equation),'equation '+equation);
}
const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(match=>match[1]).filter(href=>!href.startsWith('#')&&!href.startsWith('http'));
for(const href of hrefs){
  const [localWithQuery,anchor]=href.split('#');
  const local=localWithQuery.split('?')[0];
  const target=path.join(base,local);
  ok(fs.existsSync(target),'local route exists '+href);
  if(anchor&&fs.existsSync(target)&&path.extname(target)==='.html'){
    const targetHtml=fs.readFileSync(target,'utf8');
    ok(targetHtml.includes('id="'+anchor+'"'),'anchor exists '+href);
  }
}
const manifest=JSON.parse(fs.readFileSync(path.join(base,'A0_BOOK_MANIFEST.json'),'utf8'));
ok(manifest.surface_registry.some(entry=>entry.surface==='A0_PRIMEFIELD.html'),'Book Manifest registers Primefield');
const architecture=JSON.parse(fs.readFileSync(path.join(base,'assets/a0-prime-architecture-v1.json'),'utf8'));
ok(architecture.master_surface==='A0_PRIMEFIELD.html','machine manifest binds master surface');
ok(architecture.canonical_identity_created===false,'no new canonical identity');
if(failures.length){console.error(JSON.stringify({status:'FAIL',checks,failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:'PASS',checks,scope:'Primefield static structure, local routes, anchors and manifest binding'},null,2));

