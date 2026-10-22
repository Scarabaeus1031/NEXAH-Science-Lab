const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/a0-context-navigation.js','utf8');let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;};
function mount(file,hash='',search=''){
 const nodes=[];
 class E{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this.events={};this.style={};this.open=false;this.hidden=false;this.className='';nodes.push(this);}
  append(...items){for(const n of items){n.parentNode=this;this.children.push(n);}}
  prepend(n){n.parentNode=this;this.children.unshift(n);}
  after(n){this.afterNodes??=[];this.afterNodes.push(n);}
  replaceChildren(...items){this.children=[];this.append(...items);}
  setAttribute(k,v){this.attributes[k]=v;}
  getAttribute(k){return this.attributes[k]||null;}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  querySelector(s){if(s==='nav')return this.children.find(n=>n.tagName==='NAV');if(s==='.brand')return this.children.find(n=>n.className==='brand');return null;}
  querySelectorAll(s){if(s===':scope > a')return this.children.filter(n=>n.tagName==='A');const all=[];function walk(n){for(const c of n.children){all.push(c);walk(c);}}walk(this);if(s.includes('[open]'))return all.filter(n=>n.tagName==='DETAILS'&&n.open);return [];}
  scrollIntoView(){this.scrolled=true;}
 }
 const header=new E('header'),brand=new E('a'),nav=new E('nav'),local=new E('a'),context=new E('a'),main=new E('main'),head=new E('head'),banner=new E('aside');brand.className='brand';local.setAttribute('href','#example');context.setAttribute('href','A0_THEORY_STORYBOARD.html#overview');context.id='humanCrosswalkNavBack';nav.append(local,context);header.append(brand,nav);banner.id='humanCrosswalkReturn';
 const doc={title:'A0 · test',head,currentScript:null,querySelector(s){if(s==='header.top, header.topbar')return header;if(s==='main')return main;return null;},getElementById(id){return nodes.find(n=>n.id===id)||null;},createElement(tag){return new E(tag);},addEventListener(){}};
 const location={pathname:'/book/'+file,hash,search},events={},win={location,addEventListener(k,fn){events[k]=fn;}};win.self=win;win.top=win;
 vm.runInNewContext(source,{window:win,document:doc,location,URL,URLSearchParams});
 return{header,main,banner,nodes,location,events};
}
for(const file of ['index.html','A0_LIVING_BLUEPRINT.html','A0_SCIENTIFIC_POSITION_REPORT.html','A0_RESEARCH_DESK.html','A0_BENCH_ENTDECKEN.html','A0_ORIENTATION_CONTROLLER_BENCH.html']){
 const m=mount(file),h=m.header;
 ok(h.children.length===4,'four compact header components '+file);
 ok(h.children[0].textContent==='NEXAH','brand');
 const lanes=h.children[1],menus=lanes.children.filter(n=>n.tagName==='DETAILS'),roles=menus.filter(n=>!n.className.endsWith('--bench'));
 ok(roles.length===3,'three Reader roles retained');
 ok(lanes.children.length===4,'only three perspectives and Bench; no duplicate Einstieg');
 const bench=menus.at(-1);ok(bench.className.endsWith('--bench'),'Bench after the three perspectives');
 ok(!bench.open,'Bench closed initially');
 const benchLayout=bench.children[1].children[0];
 ok(benchLayout.className==='a0-reader-layout','Bench uses shared menu layout');
 ok(benchLayout.children[0].className==='a0-showcase','Bench flagships left');
 ok(benchLayout.children[0].children.length===3,'three Bench flagship cards');
 ok(benchLayout.children[1].children[0].children.length===3,'three grouped Bench areas on right');
 ok(bench.children[1].innerHTML.includes('Zur Werkstatt →'),'explicit workshop home');
 for(const card of benchLayout.children[0].children){
   const [page,anchor]=card.href.split('#');const target=fs.readFileSync(__dirname+'/'+page,'utf8');
   ok(!anchor||target.includes('id="'+anchor+'"'),'Bench flagship target '+card.href);
 }
 bench.open=true;roles[0].open=true;bench.events.toggle[0]();
 ok(!roles[0].open&&bench.open,'opening Bench closes other perspective');
 roles[1].open=true;roles[1].events.toggle[0]();
 ok(!bench.open&&roles[1].open,'opening a perspective closes Bench');roles[1].open=false;
 ok(roles.every(n=>!n.open),'Reader menus closed by default');
 for(const lane of roles){
  const layout=lane.children[1].children[0];
  ok(layout.className==='a0-reader-layout','layout inside existing panel');
  const [showcase,reading]=layout.children;
  ok(showcase.className==='a0-showcase'&&reading.className==='a0-reader-reading','features left / first, theory right / second');
  const science=lane.className.endsWith('--science');
  ok(showcase.children.length===(science?5:lane.className.endsWith('--human')?4:6),'lane-specific curated cards');
  for(const card of showcase.children){
   const [page,anchor]=card.href.split('#');
   const target=fs.readFileSync(__dirname+'/'+page,'utf8');
   ok(!anchor||target.includes('id="'+anchor+'"'),'existing local target and anchor '+card.href);
  }
  if(science){
   ok(showcase.children[0].href==='A0_SCIENCE.html#understand','Science foregrounds explanation home');
   ok(showcase.children.some(card=>card.href==='A0_SCIENTIFIC_POSITION_REPORT.html'),'Science retains scientific position');
   ok(showcase.children.some(card=>card.href==='A0_SCIENCE.html#contributions'),'Science retains concrete contributions');
   ok(showcase.children.every(card=>!card.href.includes('TOY_STORE')),'no app showcase in Science');
  }else ok(showcase.children.some(card=>card.innerHTML.includes('ARKADE')),'ARKADE exposes existing three-world entry');
  if(lane.className.endsWith('--human')){ok(showcase.children[0].href==='A0_NEXAH_APERTURE_JOURNEY.html#human-view','Human Book is the Human portal');ok(showcase.children.every(card=>!card.href.includes('TOY_STORE')),'Toy Store stays out of Human Experience');}
  ok(reading.children[0].className==='a0-reader-sections','reading sections retained');
 }
 ok(h.children[2].children[0].textContent==='Übersicht','one overview menu');
 ok(!h.children[2].open,'overview closed by default');
 ok(h.children[3].href==='A0_RESEARCH_DESK.html','one separate owner shortcut');
 ok(!h.afterNodes?.length,'no appended primary or module strips');
 const directory=m.nodes.find(n=>n.id==='a0-navigation-directory');
 if(file==='index.html'){ok(directory?.tagName==='DETAILS'&&!directory.open,'folded index-only directory');ok(m.main.children.at(-1)===directory,'directory appended after content');m.location.hash='#a0-navigation-directory';m.events.hashchange();ok(directory.open&&directory.scrolled,'explicit anchor opens directory');}
 else ok(!directory,'no directory injection on '+file);
 if(file==='A0_LIVING_BLUEPRINT.html')ok(m.banner.hidden,'no neutral return banner in default Blueprint');
}
const incoming=mount('A0_LIVING_BLUEPRINT.html','','?hc_v=1&hc_scene=5');ok(!incoming.banner.hidden,'provided crosswalk context remains visible for protocol validation');
console.log(JSON.stringify({status:'PASS',checks,scope:'actual shared navigation script in DOM double; menu structure, index-only folding and contextual banner; not browser pixels'},null,2));
