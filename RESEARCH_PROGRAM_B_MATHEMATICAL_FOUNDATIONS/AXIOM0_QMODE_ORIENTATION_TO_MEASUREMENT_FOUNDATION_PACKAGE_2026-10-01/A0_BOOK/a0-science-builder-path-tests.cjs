'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const A=require('./a0-science-builder-path.js'),S=require('./a0-bench-visual-shelves.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
for(const file of A.EXPLAIN){ok(A.purpose({path:file,role:'instrument'})==='explain',file);ok(!A.inToyStore({path:file,role:'instrument'}),'no explanatory flagship '+file);}
for(const file of A.INTERNAL)ok(!A.inToyStore({path:file,role:'instrument'}),'no internal Desk in cabinet');
for(const file of A.WORK)ok(A.purpose({path:file,role:'record'})==='work','workbench overrides old display role');
ok(A.inToyStore({path:'A0_PINK_DIAMOND_GRID_ATLAS.html',role:'instrument'}),'hybrid Pink instrument retained');
ok(!A.inToyStore({path:'A0_NEXAH_APERTURE_JOURNEY.html',role:'record'}),'Human reader not a Toy');
ok(!A.inToyStore({path:'new-unknown.html',role:'record'}),'unknown records not promoted');
const state={family:'F2',route:'all',stage:null,mode:'family',stop:'theta',elevatorFamily:'F2',layout:'plate',camera:{yaw:.4,pitch:.38,zoom:1}};
ok(A.validReader(state));
const data=new Map(),storage={setItem:(k,v)=>data.set(k,v),getItem:k=>data.get(k)};
ok(A.save(storage,state));assert.deepEqual(A.read(storage).state,state);checks++;
state.camera.yaw=.7;ok(A.read(storage).state.camera.yaw===.4,'stored snapshot detached');
for(const patch of [{family:'F9'},{mode:'execute'},{stop:'delta'},{layout:'remote'},{stage:'T10'},{camera:{yaw:0,pitch:0,zoom:9}}])ok(!A.validReader({...state,...patch}),'invalid reader rejected');
const p=A.packet({...state,href:'https://untrusted.invalid',payload:{instrument:'start'}});ok(!('href' in p.state)&&!('payload' in p.state),'reader whitelist only');
ok(A.read({getItem(){throw Error('denied');}})===null);ok(!A.save({setItem(){throw Error('denied');}},state));
data.set(A.KEY,'not json');ok(A.read(storage)===null);data.set(A.KEY,JSON.stringify({schema:'wrong',state}));ok(A.read(storage)===null);
class E{constructor(){this.children=[];this.value="";this.dataset={};this.events={};this.hidden=false;this.style={setProperty(){}};this.classList={toggle(){}};}append(x){this.children.push(x);}replaceChildren(...x){this.children=x;}addEventListener(k,f){this.events[k]=f;}setAttribute(){}querySelectorAll(){return this.children;}}
const panel=new E(),resume=new E(),status=new E(),events={};panel.dataset.readingPath='return';let restored=null;
const doc={querySelectorAll:s=>s==='[data-reading-path]'?[panel]:[status],querySelector:()=>resume,addEventListener:(k,f)=>events[k]=f};
const win={sessionStorage:storage,A0FamilySpatialReader:{snapshot:()=>state,resume:s=>{restored=s;return true;}}};
A.mount(doc,win);ok(panel.hidden);ok(resume.hidden);events.click({target:{closest:()=>({})}});ok(A.read(storage).state.family==='F2');
A.mount(doc,win);ok(!panel.hidden);ok(!resume.hidden);resume.events.click();ok(restored.family==='F2');ok(status.textContent.includes('kein Instrumentzustand'));
const deniedWin={get sessionStorage(){throw Error('denied');}};ok(A.mount(doc,deniedWin));ok(panel.hidden);events.click({target:{closest:()=>({})}});ok(status.textContent.includes('nicht speicherbar'));
// Actual Toy Store controller with LIFE canvas absent and reduced motion.
const elements={},get=s=>elements[s]||(elements[s]=new E()),asset={};
vm.runInNewContext(fs.readFileSync(__dirname+'/assets/a0-asset-index-v1.js','utf8'),{window:asset});
const toyDoc={querySelector:s=>s==='#builder-life-field'?null:get(s),querySelectorAll:()=>[],createElement:()=>new E()};
const toyWin={A0ScienceBuilderPath:A,A0_ASSET_INDEX:asset.A0_ASSET_INDEX,matchMedia:()=>({matches:true})};
vm.runInNewContext(fs.readFileSync(__dirname+'/a0-builder-toy-store.js','utf8'),{document:toyDoc,window:toyWin,Uint8Array,setInterval(){throw Error('unexpected timer');},clearInterval(){}});
ok(get('#flagship-selector').children.length===10,'ten hands-on flagships');
const tools=get('#tool-grid').children;
ok(tools.length>0);ok(tools.every(e=>!String(e.href).includes('A0_FAMILY_CONNECTION_ATLAS.html')&&!String(e.href).includes('A0_FIELDS_AND_JOINTS_ATLAS.html')),'no explanatory atlas in dynamic wall');
ok(tools.some(e=>e.href==='A0_ORIENTATION_CONTROLLER_BENCH.html'),'Bench retained');ok(tools.some(e=>e.href==='A0_PINK_DIAMOND_GRID_ATLAS.html'),'Pink instrument retained');
const nav=fs.readFileSync(__dirname+'/a0-context-navigation.js','utf8'),lanes=JSON.parse(nav.match(/const readerLanes = (\[[\s\S]*?\n  \]);/)[1]);
const science=lanes.find(l=>l.key==='science'),builder=lanes.find(l=>l.key==='builder');
ok(science.sections.some(s=>s.label==='Verstehen & Zusammenhänge'&&s.items.some(i=>i[0]==='A0_FAMILY_CONNECTION_ATLAS.html#spatial-navigation')));
ok(!builder.sections.flatMap(s=>s.items).some(i=>i[0]==='A0_FAMILY_CONNECTION_ATLAS.html'),'no competing Builder home');
ok(builder.sections.flatMap(s=>s.items).some(i=>i[0]==='A0_FIELDS_AND_JOINTS_ATLAS.html#joint-workspace'),'work context distinct from explanation');
const scienceHtml=fs.readFileSync(__dirname+'/A0_SCIENCE.html','utf8'),toyHtml=fs.readFileSync(__dirname+'/A0_BUILDER_TOY_STORE.html','utf8');
ok(scienceHtml.includes('id="understand"'));ok(scienceHtml.includes('id="windows"'),'old anchor retained');ok(toyHtml.includes('A0_SCIENCE.html#understand'));ok(!toyHtml.includes('A0_FAMILY_CONNECTION_ATLAS.html#spatial-navigation'));
const room=S.roomMarkup(1,'Grids','',null,null);ok(room.includes('A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles'));ok(room.includes('A0_FAMILY_CONNECTION_ATLAS.html#spatial-navigation'));
for(const file of ['A0_FAMILY_CONNECTION_ATLAS.html','A0_PINK_DIAMOND_GRID_ATLAS.html','A0_ORIENTATION_CONTROLLER_BENCH.html']){const html=fs.readFileSync(__dirname+'/'+file,'utf8');ok(html.includes('a0-science-builder-path.js'));ok(html.includes('a0-science-builder-path.css'));}
for(const [file,anchor]of [['A0_ORIENTATION_CONTROLLER_BENCH.html','benchFoyer'],['A0_PINK_DIAMOND_GRID_ATLAS.html','ghost-tiles'],['A0_PINK_DIAMOND_GRID_ATLAS.html','crt16-tile'],['A0_FAMILY_CONNECTION_ATLAS.html','spatial-navigation']])ok(fs.readFileSync(__dirname+'/'+file,'utf8').includes('id="'+anchor+'"'),'real anchor '+anchor);
ok(!/fetch\(|postMessage|setInterval|\.play\(/.test(fs.readFileSync(__dirname+'/a0-science-builder-path.js','utf8')),'navigation only');
console.log(JSON.stringify({status:'PASS',checks,scope:'purpose cut, actual Toy runtime, original routes, bounded reader capture and explicit resume, rejected/denied storage, Pink pilot; browser pixels OPEN'}));
