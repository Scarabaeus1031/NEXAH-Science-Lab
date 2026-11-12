const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/a0-context-navigation.js','utf8');let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;};
const legacyNexahedronRoute=fs.readFileSync(__dirname+'/a0-human/start/index.html','utf8');
ok(legacyNexahedronRoute.includes('/40%20EXPERIENCE%20PRODUCTION/NEXAHEDRON/public/a0-human/start/A0_NEXAH_APERTURE_JOURNEY.html#human-view')&&legacyNexahedronRoute.includes('location.replace(target)'),'legacy A0 NEXAHEDRON route remains a redirect to the maintained Human View source, not a duplicate application');
const generationCornerEntry=fs.readFileSync(__dirname+'/A0_PASCAL_GENERATION_CORNER.html','utf8');
ok(generationCornerEntry.includes('id="unified-generation-corner-candidate"')&&generationCornerEntry.includes('A0 internal candidate · unpushed · no public channel'),'A0 Generation Corner entry declares the unified candidate as internal and unpushed');
ok(generationCornerEntry.includes('http://127.0.0.1:4328/laboratory/roedelheim-observatory/generation-corner/'),'A0 Generation Corner entry opens the exact local Experience candidate');
ok(generationCornerEntry.includes('A0_RESEARCH_DESK.html#scc-003-r1-generation-review-bridge-20261110')&&generationCornerEntry.includes('http://127.0.0.1:4328/scc-003-r1/'),'A0 Generation Corner returns to the Science Desk and keeps the SCC-003-R1 review target as local staging');
function mount(file,hash='',search='',surface={}){
 const nodes=[];
 class E{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this.events={};this.style={};this.open=false;this.hidden=false;this.className='';nodes.push(this);}
  append(...items){for(const n of items){n.parentNode=this;this.children.push(n);}}
  prepend(n){n.parentNode=this;this.children.unshift(n);}
  after(n){if(this.parentNode){const i=this.parentNode.children.indexOf(this);n.parentNode=this.parentNode;this.parentNode.children.splice(i+1,0,n);}else{this.afterNodes??=[];this.afterNodes.push(n);}}
  replaceChildren(...items){this.children=[];this.append(...items);}
  setAttribute(k,v){this.attributes[k]=v;}
  removeAttribute(k){delete this.attributes[k];}
  getAttribute(k){return this.attributes[k]||null;}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
  click(){for(const fn of this.events.click||[])fn({preventDefault(){},currentTarget:this,target:this});}
  querySelector(s){if(s==='nav')return this.children.find(n=>n.tagName==='NAV');if(s==='.brand')return this.children.find(n=>n.className==='brand');if(s==='.a0-site-projection-bar button'){const bar=this.querySelector('.a0-site-projection-bar');return bar?.children.find(n=>n.tagName==='BUTTON')||null;}if(s.startsWith('.')){let found=null;const name=s.slice(1);const walk=n=>{for(const c of n.children){if((c.className||'').split(' ').includes(name)){found=c;return;}walk(c);if(found)return;}};walk(this);return found;}return null;}
  querySelectorAll(s){if(s===':scope > a')return this.children.filter(n=>n.tagName==='A');const all=[];function walk(n){for(const c of n.children){all.push(c);walk(c);}}walk(this);if(s==='.a0-reader-lane')return all.filter(n=>(n.className||'').split(' ').includes('a0-reader-lane'));if(s.includes('[open]'))return all.filter(n=>n.tagName==='DETAILS'&&n.open);return [];}
  scrollIntoView(){this.scrolled=true;}
  focus(){this.focused=true;}
  getBoundingClientRect(){return{bottom:64};}
 }
 const header=new E('header'),brand=new E('a'),nav=new E('nav'),local=new E('a'),context=new E('a'),main=new E('main'),head=new E('head'),body=new E('body'),banner=new E('aside');brand.className='brand';local.setAttribute('href','#example');context.setAttribute('href','A0_THEORY_STORYBOARD.html#overview');context.id='humanCrosswalkNavBack';nav.append(local,context);header.append(brand,nav);banner.id='humanCrosswalkReturn';
 const doc={title:'A0 · test',head,body,currentScript:null,querySelector(s){if(s==='header.top, header.topbar')return header;if(s==='main')return main;if(s==='.a0-site-projection:not([hidden])')return nodes.find(n=>n.className==='a0-site-projection'&&!n.hidden)||null;return null;},querySelectorAll(s){const match=s.match(/^\[([^\]]+)\]$/);return match?nodes.filter(n=>Object.prototype.hasOwnProperty.call(n.attributes,match[1])):[];},getElementById(id){return nodes.find(n=>n.id===id)||null;},createElement(tag){return new E(tag);},addEventListener(){}};
 const protocol=surface.protocol,hostname=surface.hostname;
 const location={pathname:'/book/'+file,hash,search,protocol,hostname};
 location.href=protocol==='file:'?`file://${location.pathname}${search}${hash}`:`${protocol||'https:'}//${hostname||'example.invalid'}${location.pathname}${search}${hash}`;
 const events={},history={pushState(_state,_title,url){const value=String(url);location.href=protocol==='file:'?`file://${value}`:`${protocol||'https:'}//${hostname||'example.invalid'}${value}`;location.hash=value.includes('#')?value.slice(value.indexOf('#')):'';}},win={location,addEventListener(k,fn){events[k]=fn;},scrollTo(){win.scrolled=true;}};win.self=win;win.top=win;
 vm.runInNewContext(source,{window:win,document:doc,location,history,URL,URLSearchParams,requestAnimationFrame:(callback)=>callback()});
 return{header,main,banner,nodes,location,events,win,history};
}
for(const file of ['index.html','A0_LIVING_BLUEPRINT.html','A0_SCIENTIFIC_POSITION_REPORT.html','A0_RESEARCH_DESK.html','A0_WERKBANK.html','A0_BENCH_ENTDECKEN.html','A0_ORIENTATION_CONTROLLER_BENCH.html','A0_DATA_AND_REGISTERS.html']){
 const m=mount(file),h=m.header;
 ok(h.children.length===4,'one compact header row with a separate overview group '+file);
 ok(h.children[0].textContent==='NEXAH A0','shared A0 portal brand');
 const lanes=h.children[1],menus=lanes.children.filter(n=>n.tagName==='DETAILS'),roles=menus.filter(n=>['--human','--science','--builder'].some(key=>n.className.endsWith(key)));
 ok(roles.length===3,'A0 Human View, A0 Science and A0 Builder form the internal expandable lane row');
 ok(lanes.children.length===6,'three A0 lanes, direct Workbench, direct Register and the separated public-channel group form the navigation row');
 ok(!menus.some(n=>n.className.endsWith('--bench')),'Werkbank is not duplicated as a top-level lane');
 const builder=menus.find(n=>n.className.endsWith('--builder'));
 ok(builder?.children[0].innerHTML.includes('A0 · Builder'),'the existing scarab lane is restored as A0 Builder');
 ok(!builder.children[0].events.click,'public A0 Builder keeps a direct expandable fallback without owner-only projections');
 const workbench=lanes.children.find(n=>n.className==='a0-workbench-entry');
 ok(workbench?.tagName==='DETAILS'&&workbench.children[0].innerHTML.includes('a0-machina-mark')&&workbench.children[0].innerHTML.includes('THE MACHINA'),'THE MACHINA is a marked dropdown house');
 ok(workbench.children[1].className==='a0-machina-menu'&&workbench.children[1].children.length===4,'THE MACHINA dropdown separates rooms, eight main modules, typed configurations and return maps');
 const machinaLinks=workbench.children[1].children.flatMap(group=>group.children.at(-1).children);
 for(const href of ['A0_WERKBANK.html#bench-page-top','A0_MACHINA_COCKPIT.html#benchFoyer','A0_MACHINA_COCKPIT.html#machinaCockpitTitle','A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf','A0_ORIENTATION_CONTROLLER_BENCH.html#benchWorkDesk'])ok(machinaLinks.some(link=>link.href===href),'THE MACHINA room '+href);
 ok(machinaLinks.some(link=>link.href==='A0_NLK_LSHELL_DEVELOPMENT_PROBE.html#mainStageShell'),'THE MACHINA exposes the current NLK flagship instrument');
 ok(machinaLinks.some(link=>link.href==='DRAFTS/A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html'),'THE MACHINA exposes IOI as a frozen Machine Configuration');
 ok(machinaLinks.some(link=>link.href==='DRAFTS/A0_PERIODIC_CARRIER_Z100_2026-11-03.html#game-of-worlds-carrier-binding'),'THE MACHINA exposes Z100 as a Science Instrument');
 const register=lanes.children.find(n=>n.className==='a0-register-entry');
 ok(register?.href==='A0_DATA_AND_REGISTERS.html#top'&&register.innerHTML.includes('A0 · NSNavigator'),'A0 NSNavigator is a direct shortcut beside THE MACHINA');
 ok((file==='A0_DATA_AND_REGISTERS.html')===(register?.attributes['aria-current']==='page'),'NSNavigator shortcut marks only its existing locator page current');
 const channels=lanes.children.find(n=>n.className==='a0-public-channels');
 ok(channels?.children[0].href==='https://nexahedron.com/'&&channels.children[1].href==='https://nexah.de/'&&channels.children[2].href==='https://www.scarabaeus1033.net/','the three public websites are visibly separated from A0 lanes');
 const scienceLane=menus.find(n=>n.className.endsWith('--science'));
 ok(m.nodes.some(n=>n.className?.includes('a0-reader-section')&&(n.innerHTML||'').includes('A0 NSNavigator')),'A0 NSNavigator is integrated into Science');
 const scienceReading=scienceLane.children[1].children[0].children[1];
 const generationCornerSection=scienceReading.children[0].children.find(n=>(n.innerHTML||'').includes('Instrumente & interne Kandidaten'));
 ok(generationCornerSection?.children.some(link=>link.href==='A0_PASCAL_GENERATION_CORNER.html#unified-generation-corner-candidate'),'Science routes the unpushed unified Generation Corner through its existing A0 entry instead of presenting it as a public channel');
 ok(generationCornerSection?.children.some(link=>link.href==='http://127.0.0.1:4328/scc-003-r1/'&&link.innerHTML.includes('Reviewraum (lokal)')),'Science exposes the intended SCC-003-R1 review room as local owner staging, not as a deployed public channel');
 ok(generationCornerSection?.children.some(link=>link.href==='http://127.0.0.1:4328/review-assets/scc-003-r1/demonstrators/complex-fold-18x23.html?rev=crt-ghost-grid-20261110#root432-keystone-capsule'),'Science exposes the existing SCC-003 Complex Fold demonstrator as a direct A0 route');
 for(const section of ['Highlights · aktueller Build','Workbench','Demonstratoren','Bestand & Status'])ok(m.nodes.some(n=>n.className?.includes('a0-reader-section')&&(n.innerHTML||'').includes(section)),section+' is separated inside Builder');
 ok(!m.nodes.some(n=>n.className?.includes('a0-reader-section')&&(n.innerHTML||'').includes('Flagship Labs')),'Builder directory does not repeat the flagship constellation');
 const workspaceOverview=h.children[2];
 ok(workspaceOverview.className==='a0-workspace-overviews','workspace overviews are separated on the right');
 ok(workspaceOverview.children.length===0,'public view does not expose local owner workspaces');
 ok(roles.every(n=>!n.open),'Reader menus closed by default');
 for(const lane of roles){
  const layout=lane.children[1].children[0];
  ok(lane.children[1].children[0]===layout,'Reader panel starts with its useful navigation content');
  ok(layout.className==='a0-reader-layout','layout inside existing panel');
  const builder=lane.className.endsWith('--builder');
  const [showcase,currentFlagship,constellation,reading]=builder?layout.children:[layout.children[0],null,null,layout.children[1]];
  ok(showcase.className==='a0-showcase'&&reading.className==='a0-reader-reading','features first and directory last');
  const science=lane.className.endsWith('--science');
  const human=lane.className.endsWith('--human');
  ok(showcase.children.length===(science?10:builder?4:5),science?'ten curated Science cards including PI Lens, Generation Corner, SCC-003-R1 Review, Red Balloon, Complex Fold and 101 / A0':builder?'four curated Builder entry cards':'five curated Human entry cards');
  for(const card of showcase.children){
   if(/^https?:/.test(card.href))continue;
   const [route,anchor]=card.href.split('#'),page=route.split('?')[0];
   const target=fs.readFileSync(__dirname+'/'+page,'utf8');
   const dynamicAnchor=anchor==='a0-current-state'&&fs.readFileSync(__dirname+'/a0-current-state-desk.js','utf8').includes('section.id = "a0-current-state"');
   ok(!anchor||target.includes('id="'+anchor+'"')||dynamicAnchor,'existing local target and anchor '+card.href);
  }
  if(science){
   ok(showcase.children[0].href==='A0_PLATINUM_IRIDIUM_PI_LENS.html'&&showcase.children[0].attributes['data-a0-science-current-highlight']===''&&showcase.children[0].innerHTML.includes('CURRENT HIGHLIGHT'),'Science foregrounds the current PI Lens highlight without creating a new identity');
   ok(showcase.children[1].href==='A0_SCIENCE.html#top','Science keeps the long A0 Science editorial page');
   ok(showcase.children[1].className.includes('a0-showcase-card--nexah'),'A0 Science retains its editorial flagship treatment');
   ok(showcase.children[2].href==='A0_RESEARCH_DESK.html?desk=overview&channel=science#a0-current-state'&&showcase.children[2].innerHTML.includes('CURRENT STATE · SCIENCE'),'Science retains the bounded current-state lens without repeating the Science Desk card');
   ok(showcase.children[3].href==='A0_PASCAL_GENERATION_CORNER.html#unified-generation-corner-candidate'&&showcase.children[3].innerHTML.includes('A0 INTERNAL CANDIDATE · UNPUSHED')&&showcase.children[3].innerHTML.includes('GENERATION CORNER'),'Science keeps the unpushed unified Generation Corner inside its existing A0 frame instead of routing to the separate nexah.de preview');
   ok(showcase.children[4].href==='http://127.0.0.1:4328/scc-003-r1/'&&showcase.children[4].innerHTML.includes('REVIEWER PENDING · LOCAL ONLY'),'Science keeps the intended review.nexah.de route as a local-only outreach gate');
   ok(showcase.children[5].href==='DRAFTS/A0_PERIODIC_CARRIER_Z100_2026-11-03.html#game-of-worlds-carrier-binding'&&showcase.children[5].attributes['data-a0-science-flagship']===''&&showcase.children[5].innerHTML.includes('SCIENCE FLAGSHIP · STOFFREGISTER'),'Science foregrounds the Z100 Stoffregister at its source-bound Game-of-Worlds anchor and marks it for the A0 house view');
   ok(showcase.children[6].href.startsWith('http://127.0.0.1:4328/')&&showcase.children[6].innerHTML.includes('SCIENCE FLAGSHIP · RED BALLOON'),'Science exposes Red Balloon as its source-bound local flagship notebook');
   ok(showcase.children.some(card=>card.href==='http://127.0.0.1:4328/review-assets/scc-003-r1/demonstrators/complex-fold-18x23.html?rev=crt-ghost-grid-20261110#root432-keystone-capsule'&&card.innerHTML.includes('SCC-003 · SOURCE-BOUND DEMONSTRATOR')),'Science exposes Complex Fold beside Red Balloon without promoting it to a separate flagship identity');
   ok(showcase.children[8].href==='DRAFTS/A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html#tessarec3OperatorMatrix'&&showcase.children[8].innerHTML.includes('SCIENCE FLAGSHIP · 101 / A0'),'Science exposes the frozen 101 / A0 Open Book route');
   ok(showcase.children[9].href==='A0_DATA_AND_REGISTERS.html#top','Science foregrounds its source-bound data and register map');
   ok(!showcase.children.some(card=>card.innerHTML.includes('A0 Science Desk')),'Science Desk is not duplicated as a flagship card');
   ok(showcase.children.every(card=>!card.href.includes('TOY_STORE')),'no app showcase in Science');
  }
  if(builder){ok(showcase.children[0].href==='A0_BUILDER_TOY_STORE.html#top'&&showcase.children[0].innerHTML.includes('A0 Builder Home'),'Builder foregrounds the existing long source-bound Builder surface');ok(showcase.children[1].href==='A0_RESEARCH_DESK.html?desk=overview&channel=builder#a0-current-state'&&showcase.children[1].innerHTML.includes('CURRENT STATE · BUILDER'),'Builder retains its bounded current-state lens');ok(showcase.children[2].href==='A0_MACHINA_COCKPIT.html#benchFoyer'&&showcase.children[2].innerHTML.includes('THE MACHINA'),'Builder ranks THE MACHINA as house before the atlas');ok(showcase.children[3].href==='A0_BUILDER_TOY_STORE.html#instrument-atlas'&&showcase.children[3].innerHTML.includes('Instrument Atlas'),'Builder keeps the compact atlas separate from the full Werkbank');ok(currentFlagship.className==='a0-current-flagship'&&currentFlagship.children.length===1&&currentFlagship.children[0].href==='A0_SPIN_TO_BLOOM_MEASUREMENT.html#edelweissBridge'&&currentFlagship.children[0].innerHTML.includes('CURRENT FLAGSHIP'),'Edelweiß is the current highlighted flagship');ok(constellation.className==='a0-flagship-constellation'&&constellation.children.length===8,'eight main modules form the current constellation');for(const href of ['A0_MACHINA_COCKPIT.html#machinaAssembly','A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry','A0_TESSAREC_BLUE_BODY_LAB.html#module-entry','A0_PINK_DIAMOND_GRID_ATLAS.html#module-entry','A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship','A0_NLK_LSHELL_DEVELOPMENT_PROBE.html#mainStageShell'])ok(constellation.children.some(card=>card.href===href),'constellation route '+href);ok(showcase.children.every(card=>!card.href.includes('A0_OPIUM')&&!card.href.includes('arkade')),'Human experiences stay out of the Builder showcase');}
  ok(reading.children[0].className==='a0-reader-sections','reading sections retained');
 }
 if(file==='index.html'){
  ok(roles.every(lane=>lane.dataset.current!=='true'),'portal does not preselect a Reader house');
  const scienceSummary=roles.find(lane=>lane.className.endsWith('--science')).children[0];
  ok(!(scienceSummary.events.click||[]).length,'Science opens its navigation drawer instead of redirecting to the internal Desk');
 }
 ok(h.children[3].children[0].textContent==='A0 Navigator','one consistently named A0 Navigator');
 ok(h.children[3].id==='a0-navigator','A0 Navigator has a stable shared target');
 ok(!h.children[3].open,'overview closed by default');
 ok(h.children[3].children[1].children[0].className==='a0-overview-current','five-entry overview is foregrounded');
 ok(h.children[3].children[1].children[0].innerHTML.includes('Fünf Eingänge. Ein Werk.'),'overview contains the five-entry heading');
 ok(h.children[3].children[1].innerHTML.includes('Workbench Map')&&h.children[3].children[1].innerHTML.includes('Family Connection Map'),'A0 Navigator exposes both named maps');
 for(const label of ['HUMAN','PLAY','MATHFIELD','BUILDER','SCIENCE'])ok(h.children[3].children[1].children[0].innerHTML.includes(label),'overview contains '+label);
 ok(!h.children.some(node=>node.className==='nexah-public-connect'),'A0 has no global pink Connect point');
 ok(!h.children.some(node=>node.className==='a0-connect-link'),'redundant labelled C-ball is absent');
 const overviewBody=h.children[3].children[1],internalMenu=m.nodes.find(n=>n.className==='a0-overview-internal');
 ok(overviewBody.children.includes(internalMenu)===['A0_RESEARCH_DESK.html'].includes(file),'internal work menu is mounted only on internal pages');
 ok(!h.afterNodes?.length,'no appended primary or module strips');
 const directory=m.nodes.find(n=>n.id==='a0-navigation-directory');
 if(file==='index.html'){ok(directory?.tagName==='DETAILS'&&!directory.open,'folded index-only directory');ok(m.main.children.at(-1)===directory,'directory appended after content');m.location.hash='#a0-navigation-directory';m.events.hashchange();ok(directory.open&&directory.scrolled,'explicit anchor opens directory');}
 else ok(!directory,'no directory injection on '+file);
 if(file==='A0_LIVING_BLUEPRINT.html')ok(m.banner.hidden,'no neutral return banner in default Blueprint');
}
const incoming=mount('A0_LIVING_BLUEPRINT.html','','?hc_v=1&hc_scene=5');ok(!incoming.banner.hidden,'provided crosswalk context remains visible for protocol validation');
const localOwner=mount('index.html','','',{protocol:'file:',hostname:''});
const localLanes=localOwner.header.children[1],localWorkspaceOverview=localOwner.header.children[2],localScienceView=localWorkspaceOverview.children.find(n=>n.className.includes('a0-science-view-link')),localBuilderView=localWorkspaceOverview.children.find(n=>n.className.includes('a0-builder-view-link')),localScienceMenu=localLanes.children.find(n=>n.className.endsWith('--science')),localScienceSummary=localScienceMenu.children[0];
ok(!localWorkspaceOverview.children.some(n=>n.className.includes('a0-human-draft-entry')),'the archived DRAFT has no visible A0 control');
ok(localScienceSummary.innerHTML.includes('A0 · Science'),'the primary Science lane is explicitly internal to A0');
ok((localScienceSummary.events.click||[]).length===1,'the primary A0 Science icon opens its long page before its drawer');
ok(!String(localOwner.location.href||'').includes('A0_RESEARCH_DESK.html'),'opening Science navigation does not replace the A0 page with the internal Desk');
ok(!localWorkspaceOverview.children.some(n=>n.className.includes('a0-nexah-link')),'no redundant NEXAH Science staging button remains in the owner workspace group');
ok(localWorkspaceOverview.children.length===3&&localScienceView&&localBuilderView&&localWorkspaceOverview.children.some(n=>n.className.includes('a0-mission-control-link')),'Science Desk, Builder Desk and TH Mission Control form the right-side Desk group');
ok(localScienceView.href==='A0_RESEARCH_DESK.html?desk=overview&rev=research-reader-r1-20261110#nexah-research-reader-currentness-20261110'&&localScienceView.innerHTML.includes('Science Desk'),'Science icon opens the current Science Desk directly');
ok(localBuilderView.href.includes('10%20NEXAH%20CORE/NEXAH/BUILDER/B0_BUILDER_DECK/build-desk.html#top')&&localBuilderView.innerHTML.includes('Builder Desk'),'Builder icon opens the B0 Builder Desk directly');
ok(!(localScienceView.events.click||[]).length&&!(localBuilderView.events.click||[]).length,'Science and Builder Desk icons remain direct links instead of projection triggers');
ok(!localOwner.nodes.filter(n=>n.className?.includes('a0-reader-section')).some(n=>(n.innerHTML||'').includes('Science Desk')||(n.innerHTML||'').includes('Builder Desk')),'Desk links do not occupy Reader menus');
const localBuilderMenu=localOwner.header.children[1].children.find(n=>n.className.endsWith('--builder')),localBuilderSummary=localBuilderMenu.children[0];
const localMachinaEntry=localOwner.header.children[1].children.find(n=>n.className==='a0-workbench-entry'),localMachinaSummary=localMachinaEntry.children[0];
const localBuilderShowcase=localBuilderMenu.children[1].children[0].children[0];
ok(localBuilderShowcase.children.length===4&&localBuilderShowcase.children[0].href==='A0_BUILDER_TOY_STORE.html#top'&&localBuilderShowcase.children[0].innerHTML.includes('A0 Builder Home'),'local Builder home uses the real long source-bound Builder surface');
const localProjections=localOwner.nodes.filter(n=>n.className==='a0-site-projection');
ok(localProjections.length===7&&localProjections.every(n=>n.hidden),'existing house, Science flagship and owner projections are prepared but initially closed');
const humanProjection=localProjections.find(n=>n.attributes['aria-label']==='NEXAHEDRON · HUMAN VIEW');
ok(humanProjection?.children[0].children.at(-1).textContent==='A0 zurück','NEXAHEDRON stays inside the common A0 frame');
ok(humanProjection?.children[1].title.includes('aktuelle Staging-Ansicht'),'local A0 identifies NEXAHEDRON as the current staging view');
ok(humanProjection.children[0].innerHTML.includes('class="a0-site-projection-home" href="index.html#top"'),'house bar exposes NEXAH A0 as a real start-page link');
ok(source.includes('event.source !== projectionFrame.contentWindow')&&source.includes('returnMessage: "nexah:a0-projection-return"'),'embedded Human return is scoped to its own frame and closes the A0 projection instead of nesting the portal');
const localScienceProjection=mount('A0_SCIENCE.html','','?projection=nexahedron',{protocol:'file:',hostname:''});
const projectedScienceLanes=localScienceProjection.header.children[1];
const projectedScience=projectedScienceLanes.children.find(n=>n.className.endsWith('--science'));
ok(projectedScience.dataset.current==='true'&&projectedScience.dataset.projectionObscured==='true','Science remains the return context without appearing active behind NEXAHEDRON');
ok(localProjections.some(n=>n.attributes['aria-label']==='WHAT CAN WE BUILD NOW? · BUILDER SHOWCASE'),'the source-bound Builder Showcase is available as a clearly named A0 house view');
const scienceReaderProjection=localProjections.find(n=>n.attributes['aria-label']==='A0 SCIENCE · FORSCHUNGSSTAND');
const scienceFlagshipProjection=localProjections.find(n=>n.attributes['aria-label']==='A0 SCIENCE FLAGSHIP · STOFFREGISTER Z100');
const builderShowcaseProjection=localProjections.find(n=>n.attributes['aria-label']==='WHAT CAN WE BUILD NOW? · BUILDER SHOWCASE');
const machinaProjection=localProjections.find(n=>n.attributes['aria-label']==='THE MACHINA · WERKBANK');
ok(!localBuilderSummary.attributes['data-a0-builder-showcase']&&(localBuilderSummary.events.click||[]).length===1,'Builder icon opens What can we build before its drawer');
ok((localBuilderShowcase.children[0].events.click||[]).length===1&&builderShowcaseProjection.hidden===true,'A0 Builder Home opens the maintained long Builder surface inside the prepared projection');
const localScienceShowcase=localScienceMenu.children[1].children[0].children[0],localScienceFlagship=localScienceShowcase.children[5];
ok((localScienceFlagship.events.click||[]).length===1&&scienceFlagshipProjection.hidden===true,'the Science Stoffregister flagship is bound to an A0 house projection');
localScienceFlagship.events.click[0]({preventDefault(){},currentTarget:localScienceFlagship});
ok(scienceFlagshipProjection.hidden===false&&scienceFlagshipProjection.children[1].getAttribute('src').includes('DRAFTS/A0_PERIODIC_CARRIER_Z100_2026-11-03.html#game-of-worlds-carrier-binding'),'the Stoffregister opens at its exact anchor inside the persistent A0 frame');
scienceFlagshipProjection.children[0].children.at(-1).events.click[0]({preventDefault(){},currentTarget:scienceFlagshipProjection.children[0].children.at(-1)});
ok(scienceFlagshipProjection.hidden===true,'A0 zurück closes the Stoffregister house view');
localScienceSummary.events.click[0]({preventDefault(){},currentTarget:localScienceSummary});
ok(scienceReaderProjection.hidden===false&&scienceReaderProjection.children[1].getAttribute('src').includes('A0_SCIENCE.html?a0_projection=1#top'),'first Science icon click opens the long A0 Science page without a nested A0 shell');
localScienceSummary.events.click[0]({preventDefault(){},currentTarget:localScienceSummary});
ok(scienceReaderProjection.hidden===true&&localScienceMenu.open===true,'second Science click closes the reader and opens the Science menu');
localBuilderSummary.events.click[0]({preventDefault(){},currentTarget:localBuilderSummary});
ok(builderShowcaseProjection.hidden===false&&builderShowcaseProjection.children[1].getAttribute('src').includes('A0_BUILDER_TOY_STORE.html'),'first Builder click opens the real long A0 Builder surface');
localBuilderSummary.events.click[0]({preventDefault(){},currentTarget:localBuilderSummary});
ok(builderShowcaseProjection.hidden===true&&localBuilderMenu.open===true,'second Builder click closes the showcase and opens the Builder menu');
localScienceSummary.events.click[0]({preventDefault(){},currentTarget:localScienceSummary});
localBuilderSummary.events.click[0]({preventDefault(){},currentTarget:localBuilderSummary});
ok(scienceReaderProjection.hidden===true&&builderShowcaseProjection.hidden===false&&!localScienceMenu.open,'switching Science to Builder closes the previous projection and drawer completely');
localMachinaSummary.events.click[0]({preventDefault(){},currentTarget:localMachinaSummary});
ok(builderShowcaseProjection.hidden===true&&machinaProjection.hidden===false&&machinaProjection.children[1].getAttribute('src').includes('A0_WERKBANK.html?view=machina&a0_projection=1'),'first THE MACHINA click switches cleanly to its Werkbank view without a nested A0 shell');
localMachinaSummary.events.click[0]({preventDefault(){},currentTarget:localMachinaSummary});
ok(machinaProjection.hidden===true&&localMachinaEntry.open===true,'second THE MACHINA click closes the view and opens the machine menu');
const localMachina=mount('A0_WERKBANK.html','','',{protocol:'file:',hostname:''});
const localMachinaLanes=localMachina.header.children[1],localMachinaPageEntry=localMachinaLanes.children.find(n=>n.className==='a0-workbench-entry'),localMachinaBuilder=localMachinaLanes.children.find(n=>n.className.endsWith('--builder')),localMachinaBuilderSummary=localMachinaBuilder.children[0],localMachinaBuilderProjection=localMachina.nodes.find(n=>n.attributes['aria-label']==='WHAT CAN WE BUILD NOW? · BUILDER SHOWCASE');
ok(localMachinaPageEntry.dataset.current==='true','THE MACHINA starts as the single active return context on its own page');
ok(!localMachinaBuilderSummary.attributes['data-a0-builder-showcase']&&(localMachinaBuilderSummary.events.click||[]).length===1&&localMachinaBuilderProjection.hidden===true,'THE MACHINA page keeps the Builder icon bound to the optional Showcase projection');
const missionLink=localWorkspaceOverview.children.find(n=>n.className.includes('a0-mission-control-link'));
const missionProjection=localProjections.find(n=>n.attributes['aria-label']==='TH · MISSION CONTROL · STEUERUNG');
missionLink.events.click[0]({preventDefault(){},currentTarget:missionLink});
ok(missionProjection.hidden===false&&missionProjection.children[1].getAttribute('src')===missionLink.href,'Mission Control opens as a closable A0 house view');
const localServer=mount('A0_SCIENCE.html','','',{protocol:'http:',hostname:'127.0.0.1'});
const localServerWorkspace=localServer.header.children[2];
const localServerScience=localServer.header.children[1].children.find(n=>n.className.endsWith('--science')).children[0];
ok(localServerScience.innerHTML.includes('A0 · Science'),'localhost retains the internal A0 Science lane beside the separate nexah.de channel');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-mission-control-link')).href.includes('NEXAH-Mission-Control/INTERNAL_NAVIGATOR/index.html#action-board'),'localhost restores TH to the ecosystem Mission Control action board');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-science-view-link')).href.includes('A0_RESEARCH_DESK.html?desk=overview'),'localhost keeps the Science Desk on the Science icon');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-builder-view-link')).href.includes('B0_BUILDER_DECK/build-desk.html#top'),'localhost keeps the B0 Builder Desk on the Builder icon');
const directBuilder=mount('index.html','','?projection=builder-showcase',{protocol:'file:',hostname:''});
const directBuilderProjection=directBuilder.nodes.find(n=>n.attributes['aria-label']==='WHAT CAN WE BUILD NOW? · BUILDER SHOWCASE');
ok(directBuilderProjection?.hidden===false,'direct Builder route opens inside the persistent A0 shell');
ok(directBuilderProjection?.children[1].getAttribute('src').includes('A0_BUILDER_TOY_STORE.html'),'direct Builder route loads the real What can we build showcase in the A0 projection');
ok(directBuilderProjection?.children[1].getAttribute('src').includes('a0_projection=1'),'Builder projection suppresses its inner A0 shell and cannot recurse into nested masks');
const directNexah=mount('index.html','','?projection=nexah-science',{protocol:'file:',hostname:''});
const directNexahProjection=directNexah.nodes.find(n=>n.attributes['aria-label']==='NEXAH SCIENCE · STAGING / OWNER-ABNAHME');
ok(directNexahProjection?.hidden===false,'direct NEXAH Science staging route opens inside the persistent A0 shell');
const directStoffregister=mount('index.html','','?projection=science-stoffregister',{protocol:'file:',hostname:''});
const directStoffregisterProjection=directStoffregister.nodes.find(n=>n.attributes['aria-label']==='A0 SCIENCE FLAGSHIP · STOFFREGISTER Z100');
ok(directStoffregisterProjection?.hidden===false&&directStoffregisterProjection.children[1].getAttribute('src').includes('DRAFTS/A0_PERIODIC_CARRIER_Z100_2026-11-03.html#game-of-worlds-carrier-binding'),'direct Stoffregister route opens the exact source anchor inside the persistent A0 shell');
const brandReturn=mount('index.html','#top','',{protocol:'file:',hostname:''});
const brandMachinaEntry=brandReturn.header.children[1].children.find(n=>n.className==='a0-workbench-entry');
const brandMachinaProjection=brandReturn.nodes.find(n=>n.attributes['aria-label']==='THE MACHINA · WERKBANK');
brandMachinaEntry.children[0].events.click[0]({preventDefault(){},currentTarget:brandMachinaEntry.children[0]});
ok(brandMachinaProjection.hidden===false,'start-page regression setup opens a house projection');
brandReturn.header.children[0].click();
ok(brandMachinaProjection.hidden===true&&brandReturn.win.scrolled===true,'NEXAH A0 closes the active house projection and visibly returns to the start-page top');
const builderDesk=fs.readFileSync(path.resolve(__dirname,'A0_BUILDER_LOG.html'),'utf8');
ok(builderDesk.includes('a0-context-navigation.js?rev=a0-page-first-r3-20261101'),'current Builder Desk participates in the shared A0 shell');
ok(builderDesk.includes('31. Oktober 2026')&&builderDesk.includes('474 kontrollierte Quellen'),'Builder Desk exposes the currentness snapshot rather than the stale abbreviated surface');
console.log(JSON.stringify({status:'PASS',checks,scope:'actual shared navigation script in DOM double; menu structure, index-only folding and contextual banner; not browser pixels'},null,2));
