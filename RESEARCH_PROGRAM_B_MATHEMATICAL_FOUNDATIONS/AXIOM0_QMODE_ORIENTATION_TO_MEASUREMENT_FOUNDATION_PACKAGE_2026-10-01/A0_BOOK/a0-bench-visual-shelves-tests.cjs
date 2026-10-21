'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const A=require('./a0-bench-visual-shelves.js'),M=require('./a0-bench-map.js'),O=require('./a0-orientation-map.js'),W=require('./a0-bench-walk.js'),S=require('./a0-orientation-shelf.js');
let checks=0;const ok=x=>{assert(x);checks++;};
const all=A.entries();ok(all.length===50);ok(new Set(all.map(e=>e.id)).size===50);
ok(all.filter(e=>e.module).length===M.MODULES.length);
for(const m of M.MODULES)ok(all.some(e=>e.module===m.id&&e.target===m.focusTarget));
for(const [id,[,color]]of Object.entries(A.ROLES))ok(S.rows.some(row=>row.families.includes(id)&&row.color===color));
for(let area=0;area<9;area++){const list=A.select(all,{area},O);ok(list.length>0);ok(area===7||list.every(e=>e.area===area||area===0&&e.body!==undefined||A.MEMBERS[area].includes(e.module)));const markup=W.markup(area,null,A,null,O);ok(markup.includes('bvs-grid'));ok(!markup.includes('DEIN ERSTER SCHRITT'));ok(!markup.includes('bw-hero'));ok(markup.includes('Rubrik wechseln'));ok(!markup.includes('Rubrik kennenlernen'));ok((markup.match(/class="bvs-master"/g)||[]).length===1);ok(!markup.includes('bvs-picture'));}
const tiles=A.groupTiles(null,O);ok((tiles.match(/class="bvs-group-tile"/g)||[]).length===9);ok((tiles.match(/aria-expanded="false"/g)||[]).length===9);ok(!tiles.includes('data-shelf-card'));ok((tiles.match(/aria-controls="bvs-expanded-group"/g)||[]).length===9);
const rows=A.shelfMarkup(all,null,O);ok(!/<img|<svg|bvs-picture/.test(rows));ok((rows.match(/role="listitem"/g)||[]).length===50);ok(rows.includes('Demonstrator erleben'));ok(rows.includes('LAUNCHER'));ok(rows.includes('Family-Leselinse offen'));
const pink=all.find(e=>e.id==='pink-grid');ok(A.select(all,{area:1},O).includes(pink));ok(A.families(pink,O).join(',')==='F1,F2');ok(A.families(all.find(e=>e.id==='grid-collection'),O).length===0);
for(const e of all.filter(e=>['pink-grid','grid-collection'].includes(e.id))){const [file,anchor]=e.href.split('#');ok(fs.readFileSync(__dirname+'/'+file,'utf8').includes('id="'+anchor+'"'));}
ok(A.select(all,{query:'xyz-not-found'},O).length===0);
for(const role of Object.keys(A.ROLES)){ok(A.select(all,{role},O).every(e=>A.families(e,O).includes(role)));}
ok(A.families(all.find(e=>e.id==='body-view-0'),O).join(',')==='F1,F3,F5');
ok(A.families(all.find(e=>e.id==='mask-observer'),O).length===0);
ok(A.preview(all[0],null).label.includes('Quellgeometrie'));
const missing=A.preview(all.find(e=>e.module==='glb-archive'),null);ok(missing.label.includes('Gruppenreferenz'));ok(missing.html.includes('<img'));ok(!missing.label.includes('Momentaufnahme'));
const docPreview={querySelector:()=>({dataset:{preview:'svg'},querySelector:()=>({src:'data:image/svg+xml,example'})})};
ok(A.preview(all.find(e=>e.module==='state'),docPreview).html.includes('data:image/'));
const sketchDoc={querySelector:()=>({dataset:{preview:'unloaded'},querySelector:()=>({src:'data:image/svg+xml,sketch'})})};
ok(A.preview(all.find(e=>e.module==='state'),sketchDoc).label.includes('Quellfixture'));
class E{
 constructor(){this.parts={};this.events={};this.dataset={};this.attrs={};this.classList={remove:()=>{}};}
 querySelector(s){return this.parts[s]||(this.parts[s]=new E());}
 querySelectorAll(){return [];}setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,f){this.events[k]=f;}scrollIntoView(){this.scrolled=true;}focus(){this.focused=true;}
}
const host=new E(),body=new E(),target=new E(),events={},opened=[];let remembered;
const buttons=Array.from({length:9},(_,i)=>{const b=new E();b.dataset.shelfArea=String(i);return b;});
host.querySelectorAll=s=>s==='[data-shelf-area]'?buttons:[];
const doc={getElementById:id=>id==='benchVisualShelves'?host:id==='bodyRouteBench'?target:id.startsWith('bvs-group-')?buttons[Number(id.slice(10))]:null,querySelector:()=>null,body,addEventListener:(k,f)=>events[k]=f};
const win={A0OrientationMap:O,A0BenchWalkController:{remember:i=>remembered=i},A0BenchBodyRouteController:{select:id=>opened.push(id)},location:{hash:'#benchFoyer'},addEventListener:(k,f)=>events[k]=f};
const ctl=A.mount(doc,win),el=n=>host.querySelector('[data-shelf-'+n+']');
ok(el('results').innerHTML==='');ok(el('panel').hidden);ok(el('count').textContent.startsWith('Neun Gruppen'));ok(host.innerHTML.includes('aria-expanded="false"'));
const chip={dataset:{shelfArea:'0'}};host.events.click({target:{closest:()=>chip}});ok(ctl.filters.area===0);ok(el('about').href==='#bench-area-0');
ok(buttons[0].attrs['aria-expanded']==='true');ok(buttons.slice(1).every(b=>b.attrs['aria-expanded']==='false'));
ok(!el('panel').hidden);ok(el('results').innerHTML.includes('bvs-list'));ok(!/<svg|<img/.test(el('results').innerHTML));
host.events.click({target:{closest:()=>chip}});ok(ctl.filters.area===-1);ok(el('panel').hidden);
host.events.click({target:{closest:()=>({dataset:{shelfArea:'1'}})}});ok(el('results').innerHTML.includes('Pink Diamond Grid Atlas'));ok(el('title').textContent==='Grids & Teller');
host.events.click({target:{closest:()=>({dataset:{shelfArea:'99'}})}});ok(ctl.filters.area===1);
el('close').events.click();ok(el('panel').hidden);ok(ctl.filters.area===-1);ok(buttons[1].focused);ok(buttons.every(b=>b.attrs['aria-expanded']==='false'));
el('role').value='F5';el('role').events.change();ok(ctl.filters.role==='F5');
ok(!el('panel').hidden);ok(el('title').textContent.includes('Suchergebnisse'));
el('query').value='nonexistent-token';el('query').events.input();ok(el('results').innerHTML.includes('Keine passenden'));
el('reset').events.click();ok(ctl.filters.area===-1);ok(ctl.filters.query==='');ok(el('panel').hidden);ok(el('results').innerHTML==='');
ok(ctl.open('pink-grid')===false); // External originals use native links, never a Bench engine.
let prevented=false;
events.click({target:{closest:()=>({dataset:{shelfOpen:'body-view-0'}})},preventDefault:()=>prevented=true});ok(prevented);ok(remembered===0);ok(opened[0]==='player');ok(win.location.hash==='#bodyRouteBench');
win.location.hash='#bench-area-7';ok(ctl.open('body-view-0'));ok(remembered===7);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(!html.includes('class="bf-door"'));ok(html.includes('id="benchVisualShelves"'));
const source=fs.readFileSync(__dirname+'/a0-bench-visual-shelves.js','utf8');ok(!/setInterval|postMessage|fetch\(|\.play\(|createElement\(['"]iframe/.test(source));
let promoted=0;const drawing={};const heading={after:node=>{ok(node===drawing);promoted++;}};const panel={querySelector:s=>s==='h2'?heading:drawing};drawing.parentElement=panel;
ok(A.promoteViews({getElementById:()=>panel})===5);ok(promoted===5);
const navigation=fs.readFileSync(__dirname+'/a0-context-navigation.js','utf8');ok(navigation.slice(navigation.indexOf('const builderShowcase'),navigation.indexOf('const scienceHighlights')).includes('A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles'));
console.log(JSON.stringify({status:'PASS',checks,modules:39,sourceViews:6,arcadeLinks:3,gridLinks:2,rooms:9,scope:'group tiles collapsed initially, single expanded list without images, retained binding/family legends, toggle/search/reset/close, exact Pink routes and lenses, no source clocks; browser pixels OPEN'}));
