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
ok(nav.includes('key: "bench", code: "Werkstatt", label: "Bench"'),'shared Bench menu');
ok(nav.includes('const benchHighlights = ['),'Bench menu has curated flagship cards');
const groups=JSON.parse(nav.match(/const navigationGroups = (\[[\s\S]*?\]);/)[1]);
for(const file of files)ok(groups.flatMap(g=>g.sections.flatMap(s=>s.pages)).filter(x=>x===file).length===1,file+' one navigation home');
const bench=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
ok(bench.includes('<header class="top">'),'runtime uses A0 header');
ok(bench.includes('<details class="bench-local-tools">'),'old controls folded, retained');
for(const id of ['benchGuideTop','benchTourTop'])ok((bench.match(new RegExp('id="'+id+'"','g'))||[]).length===1,'control ID retained once '+id);
let listener;const label={textContent:''};const location={hash:'#anuTowerWorkbench'};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'a0-bench-navigation.js'),'utf8'),{
 document:{getElementById:id=>id==='benchLocationLabel'?label:null},
 location,window:{addEventListener:(event,fn)=>{assert.equal(event,'hashchange');listener=fn;}}
});
ok(label.textContent==='Arbeiten · Tower / ANU','native Tower location');
location.hash='#benchFoyer';listener();ok(label.textContent==='Entdecken · Foyer','Foyer location');
console.log(JSON.stringify({status:'PASS',checks,scope:'static routes, flagship targets, shared header and hash-only location; browser pixels OPEN'}));

