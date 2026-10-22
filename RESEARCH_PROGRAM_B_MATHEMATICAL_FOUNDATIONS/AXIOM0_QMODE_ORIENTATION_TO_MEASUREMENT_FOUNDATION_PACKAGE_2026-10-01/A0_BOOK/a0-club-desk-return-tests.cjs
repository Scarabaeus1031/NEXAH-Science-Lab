const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),A=require('./build-a0-navigation-blueprint.cjs');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
const id='club-control-return-20261022',files=['A0_BUILDER_LOG.html','A0_RESEARCH_DESK.html','A0_SCIENTIFIC_POSITION_REPORT.html','../22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md','../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'];
for(const file of files){const text=fs.readFileSync(path.resolve(__dirname,file),'utf8');eq([...text.matchAll(new RegExp('id="'+id+'"','g'))].length,1);ok(text.includes('Numbers'),file+' includes Numbers');}
function target(file,href){
 const decoded=decodeURIComponent(href),[p,anchor]=decoded.split('#'),base=path.resolve(__dirname,path.dirname(file),p||path.basename(file));
 ok(fs.existsSync(base),'existing '+href);
 if(anchor&&!base.endsWith('/NAVIGATION/APP/index.html')){const t=fs.readFileSync(base,'utf8'),slug=base.endsWith('.md')?[...t.matchAll(/^#+ (.+)$/gm)].map(m=>m[1].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-')):[];ok(t.includes('id="'+anchor+'"')||slug.includes(anchor),'anchor '+href);}
}
for(const file of files.filter(x=>x.endsWith('.html'))){
 const text=fs.readFileSync(path.resolve(__dirname,file),'utf8'),section=text.slice(text.lastIndexOf('<section',text.indexOf('id="'+id+'"')),text.indexOf('</section>',text.indexOf('id="'+id+'"')));
 for(const m of section.matchAll(/href="([^"]+)"/g))target(file,m[1]);
}
const demo='DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html',text=fs.readFileSync(path.resolve(__dirname,demo),'utf8'),sources=text.split('<details id="controlRoomSources">')[1].split('</details>')[0];
for(const m of sources.matchAll(/href="([^"]+)"/g))target(demo,m[1]);
for(const phrase of ['deklarierte Spielregel','NN:CRT_QRT_37_CARRIER_LADDER','MOD:NUMBER_VIEW_SUITE','22/22','12/12','16 FIT','nicht erneut ausgeführt','keine neu erzeugte Live-Kopplung'])ok(sources.includes(phrase),phrase);
const g=A.parse(fs.readFileSync(__dirname+'/assets/a0-navigation-blueprint-20261021.mmd','utf8'));
for(const node of ['Club','Deck','Control','OneOne','Numbers','Tower','Desk','Log'])ok(g.nodes.has(node));
ok(g.edges.some(e=>e.from==='Deck'&&e.to==='Control'&&e.coupled));
ok(!g.edges.some(e=>e.from==='Deck'&&e.to==='OneOne'&&e.coupled));
const workspace=fs.readFileSync(path.resolve(__dirname,files.at(-1)),'utf8');
const section=workspace.split('## Club / Numbers / Control Room')[1].split('## Findings ledger')[0];
ok(!/\| \x60F-A0-\d+/.test(section));ok(section.includes('No manuscript'));ok(section.includes('shared inverse'));
console.log(JSON.stringify({status:'PASS',checks,scope:'Desk/Log/protocol/position/findings currentness; local source and fragment links; historical experiments vs game rule; typed diagram edges; no new F-A0 row; browser pixels OPEN'}));
