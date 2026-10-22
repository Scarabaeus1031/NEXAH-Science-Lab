'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const A=require('./build-a0-navigation-blueprint.cjs');let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
const mmd=fs.readFileSync(__dirname+'/assets/a0-navigation-blueprint-20261021.mmd','utf8'),g=A.parse(mmd),svg=fs.readFileSync(__dirname+'/assets/a0-navigation-blueprint-20261021.svg','utf8'),html=fs.readFileSync(__dirname+'/A0_BUILDER_LOG.html','utf8');
ok(g.nodes.size===40);ok(g.edges.length===54);ok((svg.match(/class="node"/g)||[]).length===40);ok((svg.match(/class="edge"/g)||[]).length===54);
for(const [id,n]of g.nodes){ok(svg.includes('<title>'+id+'</title>'),'SVG node '+id);ok(g.classes.has(n.kind));}
for(const e of g.edges)ok(svg.includes('<title>'+e.from+'&#45;&gt;'+e.to+'</title>'),'same edge in offline SVG '+e.from+' '+e.to);
ok(g.edges.filter(e=>e.dashed).length===8);ok(g.edges.some(e=>e.from==='Atlas'&&e.to==='CaroStory'&&e.dashed&&e.label==='Geplanter Lesegang'));
ok(g.edges.filter(e=>e.coupled).length===3);
ok(g.edges.some(e=>e.from==='Deck'&&e.to==='Control'&&e.coupled));
ok(g.edges.some(e=>e.from==='OneOne'&&e.to==='Numbers'&&e.dashed));
ok(!g.edges.some(e=>e.from==='Deck'&&e.to==='OneOne'&&e.coupled));
ok(g.edges.some(e=>e.from==='BodySeam'&&e.to==='Bench'&&e.dashed&&e.label.includes('Typisierter Datenaustausch')));
ok(g.edges.some(e=>e.from==='BodyPlayer'&&e.to==='BodyViews'&&e.coupled));
ok(g.edges.some(e=>e.from==='BodyMaster'&&e.to==='BodyModules'&&e.coupled));
ok(!g.edges.some(e=>e.from==='Atlas'&&e.to==='BodyLab'&&e.coupled),'no fabricated common Atlas/Body clock');
ok(g.edges.some(e=>e.from==='NSN'&&e.to==='Original'&&e.dashed&&e.label.includes('≠ Live-Kopplung')));
for(const id of ['A0','S','B','Atlas','Bench'])ok(g.nodes.get(id).shape==='hexagon','central hub '+id);
ok(g.nodes.get('NSN').shape==='cylinder');ok(g.nodes.get('Verstehen').rounded);
ok(html.includes('id="navigation-blueprint-20261021"'));ok(html.indexOf('id="navigation-blueprint-20261021"')<html.indexOf('id="orbit-grid-joints-20261021"'));
for(const text of ['keine Live-Kopplung','nicht F1–F7','Geplant, nicht gebaut','Instrumentzustände werden nicht übertragen','Browser-/Mobilabnahme bleibt offen'])ok(html.includes(text),text);
const section=html.slice(html.indexOf('<section id="navigation-blueprint-20261021"'),html.indexOf('<section id="orbit-grid-joints-20261021"'));
for(const href of [...section.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
 const[file,anchor]=href.split('#');ok(fs.existsSync(path.resolve(__dirname,file)),'existing target '+file);
 if(file.endsWith('NAVIGATION/APP/index.html')&&anchor==='home')ok(fs.readFileSync(path.resolve(__dirname,path.dirname(file),'app.js'),'utf8').includes('default: renderHomeV2()'),'existing Navigator SPA home route');
 else if(anchor&&file.endsWith('.html'))ok(fs.readFileSync(path.resolve(__dirname,file),'utf8').includes('id="'+anchor+'"'),'anchor '+anchor);
}
ok(!/https?:\/\/|<script|iframe/.test(section),'offline documentary section');ok(!/NaN|Infinity/.test(svg));
ok(A.dot(g)===A.dot(A.parse(mmd)),'deterministic graph source');assert.throws(()=>A.parse('flowchart TD\ninvalid syntax'));checks++;
console.log(JSON.stringify({status:'PASS',checks,nodes:40,edges:54,scope:'Mermaid roles, offline SVG parity, existing anchors, local steering vs navigation vs typed adapter and planned boundaries; not browser acceptance'}));
