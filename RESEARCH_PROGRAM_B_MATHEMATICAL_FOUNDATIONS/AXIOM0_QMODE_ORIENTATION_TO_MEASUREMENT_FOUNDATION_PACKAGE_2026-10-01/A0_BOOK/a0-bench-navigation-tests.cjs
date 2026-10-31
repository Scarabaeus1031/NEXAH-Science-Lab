const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let checks=0;
function ok(value,message){assert.ok(value,message);checks++;}
const files=['A0_BENCH_ENTDECKEN.html','A0_BENCH_ARBEITEN.html','A0_BENCH_QUELLEN.html','A0_BENCH_MODULES.html'];
const flagshipCounts={'A0_BENCH_ENTDECKEN.html':7,'A0_BENCH_ARBEITEN.html':3,'A0_BENCH_QUELLEN.html':3,'A0_BENCH_MODULES.html':0};
for(const file of files){
 const html=fs.readFileSync(path.join(__dirname,file),'utf8');
 ok(html.includes('a0-context-navigation.js'),file+' shared A0 header');
 ok(html.includes('class="bench-location"'),file+' location');
 ok(html.includes('href="A0_WERKBANK.html"'),file+' persistent Werkbank start return');
 ok((html.match(/class="bench-flagship(?: |")/g)||[]).length===flagshipCounts[file],file+' expected flagship count');
 ok((html.match(/aria-current="page"/g)||[]).length===1,file+' one active production stage or map');
 const categoryTabs=html.match(/<nav class="bench-sections bench-category-tabs[^"]*"[\s\S]*?<\/nav>/)?.[0]||'';
 for(const token of ['THE MACHINA','SOURCE / ASSET','MODULE / TOOL','BENCH CONFIG.','DEMONSTRATOR','TOY STORE / CUTS'])ok(categoryTabs.includes(token),file+' production navigation '+token);
 ok(categoryTabs.includes('A0_WERKBANK.html?view=machina#machinaHouseTitle'),file+' House route stays inside the Workbench overview');
 ok(html.includes('id="bench-page-top"'),file+' owns the stable page-top target');
 ok(!/(?:BLUE BODY|PINK DIAMOND|BLUE × PINK LAB|TOWER|BRIDGE)/.test(categoryTabs),file+' category tabs do not mix individual Labs or Demonstrators');
 ok(!html.includes('class="bench-category-items"'),file+' removes the redundant Workbench object row');
 const mapNav=html.match(/<nav class="bench-modes bench-map-nav"[\s\S]*?<\/nav>/)?.[0]||'';
 ok((mapNav.match(/<a /g)||[]).length===6&&['Entdecken','8 Hauptmodule','Machina Anatomy','Living Blueprint','Workbench Map','Family Connection Map'].every(label=>mapNav.includes(label)),file+' exposes the main-module and anatomy routes before the supporting maps');
 ok(mapNav.includes('A0_BENCH_ENTDECKEN.html#body-exhibition')&&mapNav.includes('A0_LIVING_BLUEPRINT.html#a0-map-home'),file+' map routes deep-link to the structural sections');
 ok(!/<iframe|setInterval|autoplay|\.play\(/i.test(html),file+' editorial only');
 for(const href of [...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
   const [rawName,anchor]=href.split('#');
   const name=rawName.split('?')[0];
   ok(fs.existsSync(path.join(__dirname,name)),file+' target exists: '+href);
   if(anchor){
     let target=fs.readFileSync(path.join(__dirname,name),'utf8');
     const generated={benchWorkDesk:'a0-bench-workdesk.js',carrierReturnWorkbench:'a0-carrier-return.js',anuTowerWorkbench:'a0-anu-tower.js',pulseBenchMonitor:'a0-pulse-bench.js'};
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
ok(shortAddress.includes("new URL('../A0_BOOK/index.html'"),'short local /A0 address returns to the one canonical A0 site');
ok(shortAddress.includes("destination.hash = location.hash || '#top'"),'short local /A0 address preserves explicit anchors and defaults to the canonical top');
ok(shortAddress.includes('location.replace(destination.href)'),'short local /A0 address replaces rather than forks browser history');
ok(shortAddress.includes('keine zweite Instanz')&&shortAddress.includes('keine eigene Edition'),'short local /A0 address states the non-identity and non-edition boundary');
const overviewCards=[...buildOverview.matchAll(/<article class="bench-flagship[\s\S]*?<\/article>/g)].map(m=>m[0]);
ok(overviewCards.length===7,'Build overview has seven route-deck cards including the Edelweiß flagship');
ok(buildOverview.includes('aria-label="Edelweiß Wege"')&&buildOverview.includes('04 / ROOT · FIELD · BLOOM · RECEIPT'),'Build overview presents Edelweiß in the flagship sequence');
for(const card of overviewCards){
 ok((card.match(/<nav class="bench-card-links(?: |")/g)||[]).length===1,'Build overview card has one path deck');
 const isMachina=card.includes('aria-label="THE MACHINA Wege"');
 const isBluePink=card.includes('aria-label="Blue Pink Lab Wege"');
 const isEdelweiss=card.includes('aria-label="Edelweiß Wege"');
 ok((card.match(/<a href=/g)||[]).length===(isMachina||isBluePink?4:3),'Build overview card has its declared route links');
 ok(isMachina?/>VIEWER<\/b>[\s\S]*?>COCKPIT<\/b>[\s\S]*?>PARTS<\/b>[\s\S]*?>WORK<\/b>/.test(card):isBluePink?/>ENTRY<\/b>[\s\S]*?>DEMO<\/b>[\s\S]*?>WORK<\/b>[\s\S]*?>CRUISER<\/b>/.test(card):isEdelweiss?/>ENTRY<\/b>[\s\S]*?>BUILD<\/b>[\s\S]*?>RECEIPT<\/b>/.test(card):/>ENTRY<\/b>[\s\S]*?>DEMO<\/b>[\s\S]*?>WORK<\/b>/.test(card),'Build overview card keeps its role order');
}
const nav=fs.readFileSync(path.join(__dirname,'a0-context-navigation.js'),'utf8');
const nlk=fs.readFileSync(path.join(__dirname,'A0_NLK_LSHELL_DEVELOPMENT_PROBE.html'),'utf8');
const iota=fs.readFileSync(path.join(__dirname,'A0_IOTA_BRIDGE_DEMONSTRATOR.html'),'utf8');
ok(nav.includes('"key": "builder"')&&nav.includes('"label": "A0 · Builder"'),'shared navigation restores the existing expandable A0 Builder lane');
ok(nav.includes('"entry": "A0_BUILDER_TOY_STORE.html#bench-page-top"'),'shared Builder entry opens the normal A0 Builder source rather than its Scarabaeus edition');
ok(nav.includes('const machinaRooms = [')&&nav.includes('"A0_WERKBANK.html#bench-page-top"'),'shared navigation gives THE MACHINA a room dropdown with its existing entrance');
ok(nav.includes('const machinaMainModules = [')&&((nav.match(/"FLAGSHIP (?:LAB|DEMONSTRATOR|INSTRUMENT)"/g)||[]).length>=6),'shared navigation declares the eight main-module routes with typed roles');
ok(nav.includes('"A0_NLK_LSHELL_DEVELOPMENT_PROBE.html#mainStageShell"')&&nav.includes('"A0_MACHINA_ANATOMY_MAP.html#mainModules"'),'shared Machina sheet reaches NLK and the large main-module map');
ok(/<header class="top"[^>]*>[\s\S]*?<nav aria-label="Lokale NLK-Navigation">/.test(nlk),'NLK supplies the host header required by shared A0 navigation');
ok(nlk.includes('href="#nlkIotaDock"')&&nlk.includes('href="A0_MACHINA_ANATOMY_MAP.html#mainModules"')&&nlk.includes('href="A0_WERKBANK.html#bench-page-top"'),'NLK host header exposes dock, main modules, and THE MACHINA returns');
ok(iota.includes('a0-context-navigation.css?rev=iota-nlk-nav-r1-20261031')&&iota.includes('a0-context-navigation.js?rev=iota-nlk-nav-r1-20261031'),'IOTA Grid Bridge loads the shared A0 navigation surface');
ok(/<header class="top"[^>]*>[\s\S]*?<nav aria-label="Lokale IOTA- und NLK-Navigation">/.test(iota),'IOTA Grid Bridge supplies the host header required by shared A0 navigation');
ok((iota.match(/href="A0_NLK_LSHELL_DEVELOPMENT_PROBE\.html#nlkIotaDock"/g)||[]).length>=4,'IOTA exposes NLK as persistent header, quick-access, intro, and flagship return port');
ok(iota.includes('href="index.html#portal"')&&iota.includes('href="A0_MACHINA_ANATOMY_MAP.html#mainModules"'),'IOTA exposes explicit A0 and THE MACHINA returns');
ok(nav.includes('"A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship"')&&nav.includes('"IOTA GRID BRIDGE"'),'shared Machina sheet names and opens the Grid Bridge flagship directly');
ok(nav.includes('appendMachinaGroup("RÄUME & WORK"')&&nav.includes('appendMachinaGroup("8 HAUPTMODULE"')&&nav.includes('appendMachinaGroup("KARTEN & RETURN"'),'shared Machina sheet separates rooms, main modules and maps');
ok(nav.includes('class="a0-machina-mark"')&&nav.includes('<strong>THE MACHINA</strong>'),'shared navigation names and marks the enclosing house instead of promoting Workbench to the top level');
ok(nav.includes('registerEntry.href = "A0_DATA_AND_REGISTERS.html#top"'),'shared navigation exposes the existing Register as a direct room beside Workbench');
ok(nav.includes('registerEntry.innerHTML = "<strong>A0 · NSNavigator</strong>"'),'shared navigation names the existing register lens A0 NSNavigator');
for(const section of ['Highlights · aktueller Build','Workbench','Demonstratoren','Bestand & Status'])ok(nav.includes(`"label": "${section}"`),'shared Builder menu separates '+section);
ok(!nav.includes('"label": "Flagship Labs"'),'shared Builder directory does not duplicate the flagship card set');
ok(nav.includes('const builderShowcase = ['),'Builder menu retains its curated showcase cards');
ok(nav.includes('const builderCurrentFlagship =')&&nav.includes('const builderFlagshipConstellation ='),'shared Builder menu separates current flagship from the major constellation');
const groups=JSON.parse(nav.match(/const navigationGroups = (\[[\s\S]*?\]);/)[1]);
for(const file of files)ok(groups.flatMap(g=>g.sections.flatMap(s=>s.pages)).filter(x=>x===file).length===1,file+' one navigation home');
ok(groups.flatMap(g=>g.sections.flatMap(s=>s.pages)).filter(x=>x==='A0_WERKBANK.html').length===1,'Werkbank start has one navigation home');
const home=fs.readFileSync(path.join(__dirname,'A0_WERKBANK.html'),'utf8');
ok(home.includes('a0-context-navigation.js'),'Werkbank start uses shared A0 header');
ok(home.includes('class="bench-location"'),'Werkbank start has location');
ok((home.match(/class="bench-flagship(?: |")/g)||[]).length===0,'Werkbank start no longer repeats its examples as large flagship cards');
ok((home.match(/class="bench-mode-grid"/g)||[]).length===0,'Werkbank start removes the redundant work-mode card deck');
ok(home.includes('class="bench-house-overview"'),'Werkbank start places THE MACHINA house before the production chain');
ok(/data-view="machina"[^>]*aria-current="location"[^>]*href="A0_WERKBANK\.html\?view=machina#machinaHouseTitle"/.test(home),'THE MACHINA house tab stays inside the Workbench overview and marks the enclosing house');
ok(home.includes('A0_WERKBANK.html?view=demonstrators#bench-page-top')&&home.includes('A0_BUILDER_TOY_STORE.html#arkade'),'Production navigation retains the Demonstrator view and routes Cuts into the Toy Store');
for(const label of ['THE MACHINA','SOURCE / ASSET','MODULE / TOOL','BENCH CONFIG.','DEMONSTRATOR','TOY STORE / CUTS','Entdecken','Machina Anatomy','Living Blueprint','Workbench','Family Atlas'])ok(home.includes(label),'Werkbank start exposes '+label);
const homeMaps=home.match(/<nav class="bench-modes bench-map-nav"[\s\S]*?<\/nav>/)?.[0]||'';
ok((homeMaps.match(/<a /g)||[]).length===6&&homeMaps.includes('Entdecken')&&homeMaps.includes('8 Hauptmodule')&&homeMaps.includes('Machina Anatomy')&&homeMaps.includes('Living Blueprint')&&homeMaps.includes('Workbench')&&homeMaps.includes('Family Atlas'),'Werkbank keeps one tour, three orientation routes and two supporting maps');
ok(homeMaps.indexOf('>8 Hauptmodule<')<homeMaps.indexOf('>Machina Anatomy<')&&homeMaps.indexOf('>Machina Anatomy<')<homeMaps.indexOf('>Living Blueprint<')&&homeMaps.indexOf('>Living Blueprint<')<homeMaps.indexOf('>Workbench<'),'Werkbank orders main modules before anatomy, system view and work map');
ok(homeMaps.includes('A0_BENCH_ENTDECKEN.html#body-exhibition'),'Workbench Map opens the role-and-inventory section of the discovery tour');
ok(homeMaps.includes('A0_LIVING_BLUEPRINT.html#a0-map-home'),'Family Atlas reuses the existing Living Blueprint technical map');
ok(homeMaps.includes('A0_MACHINA_ANATOMY_MAP.html#mainModules')&&homeMaps.includes('A0_MACHINA_ANATOMY_MAP.html#anatomyMap'),'Werkbank separates the eight main-module entrance from the seven-role anatomy lens');
ok(!homeMaps.includes('Register')&&!homeMaps.includes('Tools &amp; Modules')&&!homeMaps.includes('Sources &amp; Verify'),'Werkbank map row contains no duplicated global or production routes');
ok(!home.includes('>Alle Builds<'),'Werkbank no longer hides the Toy Store behind the ambiguous Alle Builds label');
for(const stage of ['Source / Asset','Module / Tool','Bench Configuration','Demonstrator','Consumer Cut'])ok(home.includes(stage),'Werkbank start exposes production stage '+stage);
for(const example of ['FAM-009 GLB','Pink Grid','Coupled Window System','Tower Return','Game of Worlds'])ok(home.includes(example),'Werkbank production chain carries example '+example);
ok(home.includes('THE MACHINA und die Flagship Labs bleiben Räume beziehungsweise source-bound Arbeitskontexte'),'Werkbank separates production stages from spaces and source-bound work contexts');
ok(home.includes('Die Full Bench zeigt den verbundenen Arbeitsbestand – nicht automatisch das gesamte A0-Inventar'),'Werkbank states the connected Full Bench scope');
ok(home.includes('class="bench-role-index"')&&home.includes('kompakter Index · kein zweites Menü'),'Werkbank replaces large repeated cards with one compact role index');
ok(/FLAGSHIP LABS[\s\S]*?A0_SPIN_TO_BLOOM_MEASUREMENT\.html#edelweissBridge[\s\S]*?Edelweiß/.test(home),'Werkbank role index classifies Edelweiß as a flagship');
ok(!/DEMONSTRATORS[\s\S]*?Spin → Bloom \/ Edelweiß Bridge/.test(home),'Werkbank no longer leaves Edelweiß in the demonstrator role');
ok(home.includes('A0_BREATHING_CRYSTAL_APERTURE.html')&&home.includes('Breathing Crystal Aperture'),'Werkbank exposes the bounded Breathing Crystal Aperture demonstrator');
ok(home.includes('A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship')&&home.includes('IOTA Grid Bridge'),'Werkbank separates the Grid Bridge flagship from the 8/12 schedule demonstrator');
ok(!/<iframe|setInterval|autoplay|\.play\(/i.test(home),'Werkbank start is editorial only');
const toyStore=fs.readFileSync(path.join(__dirname,'A0_BUILDER_TOY_STORE.html'),'utf8');
const toyStoreCategories=toyStore.match(/<nav class="bench-sections bench-category-tabs[^"]*"[\s\S]*?<\/nav>/)?.[0]||'';
const toyStoreModes=toyStore.match(/<nav class="bench-modes[^"]*"[\s\S]*?<\/nav>/)?.[0]||'';
for(const token of ['THE MACHINA','SOURCE / ASSET','MODULE / TOOL','BENCH CONFIG.','DEMONSTRATOR','TOY STORE / CUTS'])ok(toyStoreCategories.includes(token),'Toy Store retains production stage '+token);
for(const token of ['Entdecken','8 Hauptmodule','Machina Anatomy','Living Blueprint','Workbench Map','Family Connection Map'])ok(toyStoreModes.includes(token),'Toy Store retains tour/orientation/map route '+token);
ok(!toyStoreModes.includes('Register')&&!toyStoreModes.includes('Build Atlas')&&!toyStoreModes.includes('Quellen &amp; Prüfen'),'Toy Store removes duplicated global and production routes');
ok(toyStoreCategories.includes('href="A0_BENCH_MODULES.html"'),'Toy Store sends Module / Tool to its independent shelf');
ok(toyStoreCategories.includes('aria-current="page" href="#arkade"'),'Toy Store remains the active delivery stage on every internal section');
ok(!toyStoreCategories.includes('data-toy-stage')&&!toyStore.includes("['#arkade','#story-bridge','#shelf'].includes(location.hash)"),'Toy Store no longer impersonates the Module / Tool stage');
ok(toyStore.includes('id="bench-page-top"'),'Toy Store owns the stable page-top target');
const moduleShelf=fs.readFileSync(path.join(__dirname,'A0_BENCH_MODULES.html'),'utf8');
ok(moduleShelf.includes('class="bench-tool-grid"'),'Module / Tool owns a separate Tool Shelf');
ok((moduleShelf.match(/<article>/g)||[]).length===9,'Tool Shelf exposes nine existing operable entries');
for(const label of ['Pink Diamond Grid','CRT16 Interior','Fünfflaschenkrone','Pascal ↔ Crown Joint','AXIS08 Sequencer','Q° Joystick','Ihara / Hashimoto','Parts Shelf','Panel V Control Lens'])ok(moduleShelf.includes(label),'Tool Shelf reuses '+label);
ok(moduleShelf.includes('≠ SOURCE · ≠ CONFIGURATION · ≠ DEMONSTRATOR · ≠ DELIVERY'),'Tool Shelf states its production boundary');
const registers=fs.readFileSync(path.join(__dirname,'A0_DATA_AND_REGISTERS.html'),'utf8');
ok(registers.includes('class="data-bench-context" hidden'),'Register keeps its shared role outside the optional Werkbank context');
ok(registers.includes("get('context')==='workbench'"),'Register restores the Werkbank frame for Werkbank arrivals');
ok(registers.includes('<span aria-current="page">NSNavigator</span>'),'NSNavigator marks its current THE MACHINA task');
for(const href of [...home.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
 const [route,anchor]=href.split('#');
 const name=route.split('?')[0]||'A0_WERKBANK.html';
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
ok(/<header class="top"(?:\s|>)/.test(pinkAtlas),'Pink Atlas provides the shared A0 navigation mount');
ok(pinkAtlas.includes('class="brand" href="A0_WERKBANK.html"'),'Pink Atlas mast returns to Werkbank');
ok(pinkAtlas.includes('href="A0_ORIENTATION_CONTROLLER_BENCH.html#gridFoldReturn"'),'Pink Atlas returns to the real Grid machine anchor');
ok(!pinkAtlas.includes('#bench-area-1'),'stale Bench anchor removed');
const flagshipPages=['A0_MACHINA_COCKPIT.html','A0_TESSAREC_BLUE_BODY_LAB.html','A0_PINK_DIAMOND_GRID_ATLAS.html','A0_BLUE_PINK_DODECA_CELL_RETURN.html','A0_TOWER_RETURN_DEMONSTRATOR.html','A0_IOTA_BRIDGE_DEMONSTRATOR.html'];
for(const file of flagshipPages){
 const html=fs.readFileSync(path.join(__dirname,file),'utf8');
 const bodyStart=html.indexOf('<body');
 const bodyOpen=html.indexOf('>',bodyStart)+1;
 const firstMarkup=html.slice(bodyOpen).trimStart();
 const hasGlobalHeader=/<header class="top"(?:\s|>)/.test(html);
 const isReturnRegister=file==='A0_BLUE_PINK_DODECA_CELL_RETURN.html';
 const primaryNavClass=isReturnRegister?'bench-context-path':'bench-sections bench-category-tabs';
 ok(hasGlobalHeader?/^<header class="top"(?:\s|>)/.test(firstMarkup):firstMarkup.startsWith('<nav class="bench-sections bench-category-tabs"'),file+' begins with the highest available navigation level');
 if(hasGlobalHeader)ok(html.indexOf('<header class="top"',bodyOpen)<html.indexOf(`class="${primaryNavClass}`,bodyOpen),file+' keeps A0 global navigation above its declared context navigation');
 ok(html.indexOf(`class="${primaryNavClass}`,bodyOpen)<html.indexOf('class="bench-modes',bodyOpen),file+' keeps context navigation before local view modes');
 const categoryTabs=isReturnRegister?(html.match(/<nav class="bench-context-path"[\s\S]*?<\/nav>/)?.[0]||''):(html.match(/<nav class="bench-sections bench-category-tabs[^"]*"[\s\S]*?<\/nav>/)?.[0]||'');
 const isMachina=file==='A0_MACHINA_COCKPIT.html';
 const isIotaBridge=file==='A0_IOTA_BRIDGE_DEMONSTRATOR.html';
 for(const token of (isReturnRegister?['THE MACHINA','BLUE × PINK LAB','RETURN REGISTER','GLOBALE NAVIGATION']:isMachina?['THE MACHINA','SOURCE / ASSET','MODULE / TOOL','BENCH CONFIG.','DEMONSTRATOR','TOY STORE / CUTS']:['START','WORKBENCH','FLAGSHIP LABS','DEMONSTRATORS','TOY STORE']))ok(categoryTabs.includes(token),file+' exposes category '+token);
 ok(isReturnRegister||!/(?:THE MΛCHINΛ|BLUE BODY|PINK DIAMOND|BLUE × PINK LAB|TOWER|BRIDGE)/.test(categoryTabs),file+' category tabs contain no individual object names');
 ok(isMachina?!html.includes('class="bench-category-items"'):html.includes('class="bench-category-items"'),file+' uses the declared current-object row policy');
 ok(isReturnRegister?categoryTabs.includes('A0_WERKBANK.html?view=demonstrators'):isMachina?categoryTabs.includes('A0_BENCH_MODULES.html'):html.includes('class="bench-catalog" href="A0_BUILDER_TOY_STORE.html#bench-page-top">TOY STORE</a>'),file+' exposes the declared global entrance');
 ok(html.includes('id="bench-page-top"'),file+' owns the stable page-top target');
 ok((html.match(/class="bench-quick-access"/g)||[]).length===1,file+' has one shared quick-access deck');
 const quick=html.match(/<nav class="bench-quick-access"[\s\S]*?<\/nav>/)?.[0]||'';
 ok((quick.match(/<a /g)||[]).length===(isMachina?6:isIotaBridge?7:4),file+' orders its declared quick-access levels');
 ok(isMachina?/<small>01<\/small>[\s\S]*?>EXHIBITION<\/em>[\s\S]*?<small>02<\/small>[\s\S]*?>ORIENTATION<\/em>[\s\S]*?<small>C5<\/small>[\s\S]*?>LIVE BRIDGE<\/em>[\s\S]*?<small>03<\/small>[\s\S]*?>MODELS<\/em>[\s\S]*?<small>04<\/small>[\s\S]*?>WORK<\/em>[\s\S]*?<small>05<\/small>[\s\S]*?>ASSEMBLY<\/em>/.test(quick):isIotaBridge?/<small>01<\/small>[\s\S]*?>ENTRY<\/em>[\s\S]*?<small>02<\/small>[\s\S]*?>DEDICATED<\/em>[\s\S]*?<small>03<\/small>[\s\S]*?>FLAGSHIP<\/em>[\s\S]*?<small>04<\/small>[\s\S]*?>DOCK<\/em>[\s\S]*?<small>05<\/small>[\s\S]*?>WORK<\/em>[\s\S]*?<small>06<\/small>[\s\S]*?>RETURN<\/em>[\s\S]*?<small>07<\/small>[\s\S]*?>CONTROL<\/em>/.test(quick):/<small>01<\/small>[\s\S]*?>ENTRY<\/em>[\s\S]*?<small>02<\/small>[\s\S]*?>(?:DEMO|INTEGRATED|DEDICATED)<\/em>[\s\S]*?<small>03<\/small>[\s\S]*?>WORK<\/em>[\s\S]*?<small>04<\/small>[\s\S]*?>RETURN<\/em>/.test(quick),file+' keeps its declared quick-access role order');
 for(const label of (isMachina?['EXHIBITION','ORIENTATION','LIVE BRIDGE','MODELS','WORK','ASSEMBLY']:isIotaBridge?['ENTRY','WORK','RETURN','CONTROL']:['ENTRY','WORK','RETURN']))ok(quick.includes('>'+label+'</em>'),file+' labels quick-access role '+label);
}
const machinaCockpit=fs.readFileSync(path.join(__dirname,'A0_MACHINA_COCKPIT.html'),'utf8');
ok(machinaCockpit.includes('<a href="#machinaCockpitTitle">Pentagon Cockpit</a>'),'THE MACHINA exposes the Pentagon as its orientation room without hiding the shared Viewer page');
for(const route of ['#benchFoyer','#universalMachinePartsShelf','#benchWorkDesk'])ok(machinaCockpit.includes(route),'THE MACHINA cockpit exposes adjacent room '+route);
for(const role of ['EXHIBITION','COCKPIT','PARTS SHELF','FULL BENCH'])ok(machinaCockpit.includes(role),'THE MACHINA room map names '+role);
ok(machinaCockpit.includes('Das Cockpit ist nicht die ganze Exhibition.'),'THE MACHINA distinguishes orientation from exhibition');
const benchNavigationCss=fs.readFileSync(path.join(__dirname,'a0-bench-navigation.css'),'utf8');
ok(benchNavigationCss.includes('.bench-production-nav{position:sticky;top:var(--a0-context-header-height,66px);z-index:900'),'production navigation stays visible below the measured A0 header');
ok(benchNavigationCss.includes('body:has(>header.top)>.bench-production-nav,.data-bench-context .bench-production-nav{top:var(--a0-context-header-height,66px)}'),'production navigation overrides the older category top reset');
ok(benchNavigationCss.includes('.bench-map-nav{position:sticky;top:calc(var(--a0-context-header-height,66px) + 58px);z-index:890'),'map navigation stays visible below the production row');
for(const id of ['machinaHouseTitle','instrument-atlas','arkade','coupledWindowHub','pulseBenchMonitor','carrierReturnWorkbench'])ok(benchNavigationCss.includes('#'+id),'deep target clears the persistent navigation: '+id);
ok(benchNavigationCss.includes('scroll-margin-top:178px'),'deep targets retain the shared persistent-navigation clearance');
ok(benchNavigationCss.includes('.bench-category-tabs'),'Bench navigation styles the category tabs separately');
ok(/\.bench-category-tabs\{[^}]*justify-content:flex-start/.test(benchNavigationCss),'Werkbank category navigation starts at the left edge');
ok(benchNavigationCss.includes('body:has(>header.top)>.bench-sections'),'Werkbank categories remain below the shared A0 header');
ok(benchNavigationCss.includes('body:has(>header.top)>.bench-category-tabs,.data-bench-context .bench-category-tabs{top:auto}'),'Werkbank category tabs do not overlap the following work-mode row');
ok(benchNavigationCss.includes('.bench-category-items'),'Bench navigation styles the object row separately');
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

