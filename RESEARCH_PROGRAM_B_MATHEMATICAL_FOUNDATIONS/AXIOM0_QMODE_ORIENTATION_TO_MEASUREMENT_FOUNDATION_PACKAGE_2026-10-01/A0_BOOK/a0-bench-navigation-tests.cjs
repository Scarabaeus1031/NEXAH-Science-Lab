const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let checks=0;
function ok(value,message){assert.ok(value,message);checks++;}
const files=['A0_BENCH_ENTDECKEN.html','A0_BENCH_ARBEITEN.html','A0_BENCH_QUELLEN.html'];
const flagshipCounts={'A0_BENCH_ENTDECKEN.html':6,'A0_BENCH_ARBEITEN.html':3,'A0_BENCH_QUELLEN.html':3};
for(const file of files){
 const html=fs.readFileSync(path.join(__dirname,file),'utf8');
 ok(html.includes('a0-context-navigation.js'),file+' shared A0 header');
 ok(html.includes('class="bench-location"'),file+' location');
 ok(html.includes('href="A0_WERKBANK.html"'),file+' persistent Werkbank start return');
 ok((html.match(/class="bench-flagship(?: |")/g)||[]).length===flagshipCounts[file],file+' expected flagship count');
 ok((html.match(/aria-current="page"/g)||[]).length===1,file+' one active work mode');
 for(const token of ['A0_MACHINA_COCKPIT.html','A0_TESSAREC_BLUE_BODY_LAB.html','A0_PINK_DIAMOND_GRID_ATLAS.html','A0_BLUE_PINK_DODECA_CELL_RETURN.html','A0_TOWER_RETURN_DEMONSTRATOR.html','A0_IOTA_BRIDGE_DEMONSTRATOR.html'])ok(html.includes(token),file+' six-flagship route '+token);
 ok(!/<iframe|setInterval|autoplay|\.play\(/i.test(html),file+' editorial only');
 for(const href of [...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
   const [rawName,anchor]=href.split('#');
   const name=rawName.split('?')[0];
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
const buildOverview=fs.readFileSync(path.join(__dirname,'A0_BENCH_ENTDECKEN.html'),'utf8');
ok(buildOverview.includes('id="localAddressAperture"'),'Build overview exposes the local address aperture');
ok(buildOverview.includes('id="mathJointsGateway"'),'Build overview exposes the Mathematical Joints website gateway');
ok(buildOverview.includes('A0_MATHEMATICAL_JOINTS.html#relation-rotation-spectrum-route'),'gateway binds the four-instrument Mathematical Joints entry');
ok(buildOverview.includes('assets/a0-def-g-relation-view-lab/index.html#boundary-ar'),'gateway reaches the standalone DEF to G lab');
ok(buildOverview.includes('assets/a0-field-notes/index.html?archive=1#note-13'),'gateway reaches the bounded critical-orbit record');
for(const token of ['//','≠','01:00','77-LINE','EINZUG'])ok(buildOverview.includes(token),'local address aperture retains Owner notation '+token);
ok(buildOverview.includes('Interface-Glyphe und keine neue arithmetische Definition'),'local address aperture states its notation boundary');
ok(buildOverview.includes('1.111.111.111'),'local address aperture shows the owner address label');
ok(buildOverview.includes('01 · erstes 3×3'),'owner address is bound to the first 3×3 carrier');
ok(buildOverview.includes('PINK_K90_DIAMOND'),'local address hierarchy reuses the shared pink hinge address');
ok(buildOverview.includes('assets/a0-def-g-relation-view-lab/index.html#glyph-double-cover'),'local address hierarchy links the existing flap instrument');
ok(buildOverview.includes('1:8878/A0'),'local return is shown as the owner subaddress');
ok(buildOverview.includes('keine wörtlich zu lesende registrierte IPv4-Adresse'),'owner label is explicitly separated from literal IPv4 semantics');
const shortAddressPath=path.join(__dirname,'..','A0','index.html');
ok(fs.existsSync(shortAddressPath),'short local /A0 address exists');
const shortAddress=fs.readFileSync(shortAddressPath,'utf8');
ok(shortAddress.includes("new URL('../A0_BOOK/A0_BENCH_ENTDECKEN.html'"),'short local /A0 address reuses the Build overview');
ok(shortAddress.includes("destination.hash = location.hash || '#body-exhibition'"),'short local /A0 address preserves explicit anchors and owns a default');
ok(shortAddress.includes('location.replace(destination.href)'),'short local /A0 address replaces rather than forks browser history');
ok(shortAddress.includes('keine zweite Instanz'),'short local /A0 address states the non-identity boundary');
const overviewCards=[...buildOverview.matchAll(/<article class="bench-flagship[\s\S]*?<\/article>/g)].map(m=>m[0]);
ok(overviewCards.length===6,'Build overview has six route-deck cards');
for(const card of overviewCards){
 ok((card.match(/<nav class="bench-card-links(?: |")/g)||[]).length===1,'Build overview card has one path deck');
 const isMachina=card.includes('aria-label="THE MACHINA Wege"');
 ok((card.match(/<a href=/g)||[]).length===(isMachina?4:3),'Build overview card has its declared route links');
 ok(isMachina?/>EXHIBITION<\/b>[\s\S]*?>COCKPIT<\/b>[\s\S]*?>PARTS<\/b>[\s\S]*?>WORK<\/b>/.test(card):/>ENTRY<\/b>[\s\S]*?>DEMO<\/b>[\s\S]*?>WORK<\/b>/.test(card),'Build overview card keeps its role order');
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
ok((home.match(/class="bench-flagship(?: |")/g)||[]).length===6,'Werkbank start offers six flagships');
ok((home.match(/class="bench-mode-grid"/g)||[]).length===1,'Werkbank start keeps three work modes subordinate');
ok((home.match(/aria-current="page"/g)||[]).length===1,'Werkbank start marks one current route');
ok(!/<iframe|setInterval|autoplay|\.play\(/i.test(home),'Werkbank start is editorial only');
for(const href of [...home.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
 const [route,anchor]=href.split('#');
 const name=route.split('?')[0];
 ok(fs.existsSync(path.join(__dirname,name)),'Werkbank start target exists: '+href);
 if(anchor){
  let target=fs.readFileSync(path.join(__dirname,name),'utf8');
  if(anchor==='benchWorkDesk')target+=fs.readFileSync(path.join(__dirname,'a0-bench-workdesk.js'),'utf8');
  ok(target.includes('id="'+anchor+'"')||target.includes("id='"+anchor+"'"),'Werkbank start target owns anchor: '+href);
 }
}
const bench=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
ok(bench.includes('<header class="top">'),'runtime uses A0 header');
for(const token of ['A0_MACHINA_COCKPIT.html','A0_TESSAREC_BLUE_BODY_LAB.html','A0_PINK_DIAMOND_GRID_ATLAS.html','A0_BLUE_PINK_DODECA_CELL_RETURN.html','A0_TOWER_RETURN_DEMONSTRATOR.html','A0_IOTA_BRIDGE_DEMONSTRATOR.html'])ok(bench.includes(token),'runtime exposes six-flagship route '+token);
ok(bench.includes('aria-label="THE MACHINA Räume"'),'runtime separates THE MACHINA rooms from flagships');
ok(bench.includes('<details class="bench-local-tools">'),'old controls folded, retained');
const pinkAtlas=fs.readFileSync(path.join(__dirname,'A0_PINK_DIAMOND_GRID_ATLAS.html'),'utf8');
ok(pinkAtlas.includes('<header class="top">'),'Pink Atlas provides the shared A0 navigation mount');
ok(pinkAtlas.includes('class="brand" href="A0_WERKBANK.html"'),'Pink Atlas mast returns to Werkbank');
ok(pinkAtlas.includes('href="A0_ORIENTATION_CONTROLLER_BENCH.html#gridFoldReturn"'),'Pink Atlas returns to the real Grid machine anchor');
ok(!pinkAtlas.includes('#bench-area-1'),'stale Bench anchor removed');
const flagshipPages=['A0_MACHINA_COCKPIT.html','A0_TESSAREC_BLUE_BODY_LAB.html','A0_PINK_DIAMOND_GRID_ATLAS.html','A0_BLUE_PINK_DODECA_CELL_RETURN.html','A0_TOWER_RETURN_DEMONSTRATOR.html','A0_IOTA_BRIDGE_DEMONSTRATOR.html'];
for(const file of flagshipPages){
 const html=fs.readFileSync(path.join(__dirname,file),'utf8');
 const bodyStart=html.indexOf('<body');
 const bodyOpen=html.indexOf('>',bodyStart)+1;
 const firstMarkup=html.slice(bodyOpen).trimStart();
 ok(firstMarkup.startsWith('<nav class="bench-sections"'),file+' starts with the stable flagship rail');
 ok(html.indexOf('class="bench-sections"',bodyOpen)<html.indexOf('class="bench-modes"',bodyOpen),file+' keeps flagship rail before view modes');
 ok((html.match(/class="bench-quick-access"/g)||[]).length===1,file+' has one shared quick-access deck');
 const quick=html.match(/<nav class="bench-quick-access"[\s\S]*?<\/nav>/)?.[0]||'';
 ok((quick.match(/<a /g)||[]).length===4,file+' orders four quick-access levels');
 const isMachina=file==='A0_MACHINA_COCKPIT.html';
 ok(isMachina?/<small>01<\/small>[\s\S]*?>EXHIBITION<\/em>[\s\S]*?<small>02<\/small>[\s\S]*?>ORIENTATION<\/em>[\s\S]*?<small>03<\/small>[\s\S]*?>MODELS<\/em>[\s\S]*?<small>04<\/small>[\s\S]*?>WORK<\/em>/.test(quick):/<small>01<\/small>[\s\S]*?>ENTRY<\/em>[\s\S]*?<small>02<\/small>[\s\S]*?>(?:DEMO|INTEGRATED|DEDICATED)<\/em>[\s\S]*?<small>03<\/small>[\s\S]*?>WORK<\/em>[\s\S]*?<small>04<\/small>[\s\S]*?>RETURN<\/em>/.test(quick),file+' keeps its declared quick-access role order');
 for(const label of (isMachina?['EXHIBITION','ORIENTATION','MODELS','WORK']:['ENTRY','WORK','RETURN']))ok(quick.includes('>'+label+'</em>'),file+' labels quick-access role '+label);
}
const machinaCockpit=fs.readFileSync(path.join(__dirname,'A0_MACHINA_COCKPIT.html'),'utf8');
ok(machinaCockpit.includes('<span aria-current="page">Pentagon Cockpit</span>'),'THE MACHINA names the Pentagon as its active orientation room');
for(const route of ['#benchFoyer','#universalMachinePartsShelf','#benchWorkDesk'])ok(machinaCockpit.includes(route),'THE MACHINA cockpit exposes adjacent room '+route);
for(const role of ['EXHIBITION','COCKPIT','PARTS SHELF','FULL BENCH'])ok(machinaCockpit.includes(role),'THE MACHINA room map names '+role);
ok(machinaCockpit.includes('Das Cockpit ist nicht die ganze Exhibition.'),'THE MACHINA distinguishes orientation from exhibition');
const benchNavigationCss=fs.readFileSync(path.join(__dirname,'a0-bench-navigation.css'),'utf8');
ok(benchNavigationCss.includes('flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden'),'flagship rail keeps one stable row with horizontal overflow');
ok(benchNavigationCss.includes('min-height:58px'),'flagship rail reserves a stable desktop height');
ok(benchNavigationCss.includes('.bench-quick-access'),'shared quick-access deck is styled centrally');
ok(benchNavigationCss.includes('SCHNELLZUGRIFF'),'shared quick-access deck has a stable human label');
ok(benchNavigationCss.includes('.bench-card-links'),'Build overview route decks are styled centrally');
for(const id of ['benchGuideTop','benchTourTop'])ok((bench.match(new RegExp('id="'+id+'"','g'))||[]).length===1,'control ID retained once '+id);
let listener;const label={textContent:'',setAttribute(name,value){this[name]=value;}};const location={hash:'#anuTowerWorkbench'};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'a0-bench-navigation.js'),'utf8'),{
 document:{getElementById:id=>id==='benchLocationLabel'?label:null},
 location,window:{addEventListener:(event,fn)=>{assert.equal(event,'hashchange');listener=fn;}}
});
ok(label.textContent==='Arbeiten · Tower / ANU','native Tower location');
location.hash='#benchFoyer';listener();ok(label.textContent==='Entdecken · Foyer','Foyer location');
console.log(JSON.stringify({status:'PASS',checks,scope:'static routes, flagship targets, shared header and hash-only location; browser pixels OPEN'}));

