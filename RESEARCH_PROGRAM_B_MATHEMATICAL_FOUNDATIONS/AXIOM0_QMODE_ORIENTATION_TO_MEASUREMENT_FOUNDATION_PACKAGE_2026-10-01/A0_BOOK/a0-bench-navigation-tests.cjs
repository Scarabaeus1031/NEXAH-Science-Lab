const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let checks=0;
function ok(value,message){assert.ok(value,message);checks++;}
const files=['A0_BENCH_ENTDECKEN.html','A0_BENCH_ARBEITEN.html','A0_BENCH_QUELLEN.html'];
for(const file of files){
 const html=fs.readFileSync(path.join(__dirname,file),'utf8');
 ok(html.includes('a0-context-navigation.js'),file+' shared A0 header');
 ok(html.includes('class="bench-location"'),file+' location');
 ok(html.includes('href="A0_WERKBANK.html"'),file+' persistent Werkbank start return');
 ok((html.match(/class="bench-flagship"/g)||[]).length===3,file+' three flagships');
 ok((html.match(/aria-current="page"/g)||[]).length===1,file+' one active local area');
 ok(!/<iframe|setInterval|autoplay|\.play\(/i.test(html),file+' editorial only');
 for(const href of [...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
   const [name,anchor]=href.split('#');
   ok(fs.existsSync(path.join(__dirname,name)),file+' target exists: '+href);
   if(anchor){
     let target=fs.readFileSync(path.join(__dirname,name),'utf8');
     const generated={benchWorkDesk:'a0-bench-workdesk.js',carrierReturnWorkbench:'a0-carrier-return.js',anuTowerWorkbench:'a0-anu-tower.js'};
     if(generated[anchor]){
       ok(target.includes(generated[anchor]),'target mounts its native module');
       target+=fs.readFileSync(path.join(__dirname,generated[anchor]),'utf8');
     }
     ok(target.includes('id="'+anchor+'"')||target.includes("id='"+anchor+"'")||target.includes("id = '"+anchor+"'")||target.includes('id="'+anchor+'"'),file+' source-owned target: '+href);
   }
 }
}
const nav=fs.readFileSync(path.join(__dirname,'a0-context-navigation.js'),'utf8');
ok(nav.includes('key: "bench", code: "Werkstatt", label: "Werkbank"'),'shared Werkbank menu uses the public German name');
ok(nav.includes('entry: "A0_WERKBANK.html"'),'shared Werkbank entry is the quiet start page');
ok(nav.includes('{ label: "00 · Start & THE MΛCHINΛ"'),'shared Werkbank menu separates its start from THE MACHINA');
ok(nav.includes('const benchHighlights = ['),'Bench menu has curated flagship cards');
const groups=JSON.parse(nav.match(/const navigationGroups = (\[[\s\S]*?\]);/)[1]);
for(const file of files)ok(groups.flatMap(g=>g.sections.flatMap(s=>s.pages)).filter(x=>x===file).length===1,file+' one navigation home');
ok(groups.flatMap(g=>g.sections.flatMap(s=>s.pages)).filter(x=>x==='A0_WERKBANK.html').length===1,'Werkbank start has one navigation home');
const home=fs.readFileSync(path.join(__dirname,'A0_WERKBANK.html'),'utf8');
ok(home.includes('a0-context-navigation.js'),'Werkbank start uses shared A0 header');
ok(home.includes('class="bench-location"'),'Werkbank start has location');
ok((home.match(/class="bench-flagship(?: |")/g)||[]).length===4,'Werkbank start offers machine plus three areas');
ok((home.match(/aria-current="page"/g)||[]).length===1,'Werkbank start marks one current route');
ok(!/<iframe|setInterval|autoplay|\.play\(/i.test(home),'Werkbank start is editorial only');
for(const href of [...home.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
 const [route,anchor]=href.split('#');
 const name=route.split('?')[0];
 ok(fs.existsSync(path.join(__dirname,name)),'Werkbank start target exists: '+href);
 if(anchor){
  let target=fs.readFileSync(path.join(__dirname,name),'utf8');
  ok(target.includes('id="'+anchor+'"')||target.includes("id='"+anchor+"'"),'Werkbank start target owns anchor: '+href);
 }
}
const bench=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
ok(bench.includes('<header class="top">'),'runtime uses A0 header');
ok(bench.includes('<span aria-current="page" aria-label="THE MACHINA">THE MΛCHINΛ</span>'),'runtime marks the technical Bench as THE MACHINA');
ok(bench.includes('<details class="bench-local-tools">'),'old controls folded, retained');
const pinkAtlas=fs.readFileSync(path.join(__dirname,'A0_PINK_DIAMOND_GRID_ATLAS.html'),'utf8');
ok(pinkAtlas.includes('<header class="top">'),'Pink Atlas provides the shared A0 navigation mount');
ok(pinkAtlas.includes('class="brand" href="A0_WERKBANK.html"'),'Pink Atlas mast returns to Werkbank');
ok(pinkAtlas.includes('href="A0_ORIENTATION_CONTROLLER_BENCH.html#gridFoldReturn"'),'Pink Atlas returns to the real Grid machine anchor');
ok(!pinkAtlas.includes('#bench-area-1'),'stale Bench anchor removed');
for(const id of ['benchGuideTop','benchTourTop'])ok((bench.match(new RegExp('id="'+id+'"','g'))||[]).length===1,'control ID retained once '+id);
let listener;const label={textContent:'',setAttribute(name,value){this[name]=value;}};const location={hash:'#anuTowerWorkbench'};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'a0-bench-navigation.js'),'utf8'),{
 document:{getElementById:id=>id==='benchLocationLabel'?label:null},
 location,window:{addEventListener:(event,fn)=>{assert.equal(event,'hashchange');listener=fn;}}
});
ok(label.textContent==='Arbeiten · Tower / ANU','native Tower location');
location.hash='#benchFoyer';listener();ok(label.textContent==='Entdecken · Foyer','Foyer location');
console.log(JSON.stringify({status:'PASS',checks,scope:'static routes, flagship targets, shared header and hash-only location; browser pixels OPEN'}));

