const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/a0-context-navigation.js','utf8');let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;};
const legacyNexahedronRoute=fs.readFileSync(__dirname+'/a0-human/start/index.html','utf8');
ok(legacyNexahedronRoute.includes('/40%20EXPERIENCE%20PRODUCTION/NEXAHEDRON/public/a0-human/start/A0_NEXAH_APERTURE_JOURNEY.html#human-view')&&legacyNexahedronRoute.includes('location.replace(target)'),'legacy A0 NEXAHEDRON route remains a redirect to the maintained Human View source, not a duplicate application');
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
  querySelector(s){if(s==='nav')return this.children.find(n=>n.tagName==='NAV');if(s==='.brand')return this.children.find(n=>n.className==='brand');if(s.startsWith('.')){let found=null;const name=s.slice(1);const walk=n=>{for(const c of n.children){if((c.className||'').split(' ').includes(name)){found=c;return;}walk(c);if(found)return;}};walk(this);return found;}return null;}
  querySelectorAll(s){if(s===':scope > a')return this.children.filter(n=>n.tagName==='A');const all=[];function walk(n){for(const c of n.children){all.push(c);walk(c);}}walk(this);if(s==='.a0-reader-lane')return all.filter(n=>(n.className||'').split(' ').includes('a0-reader-lane'));if(s.includes('[open]'))return all.filter(n=>n.tagName==='DETAILS'&&n.open);return [];}
  scrollIntoView(){this.scrolled=true;}
  focus(){this.focused=true;}
  getBoundingClientRect(){return{bottom:64};}
 }
 const header=new E('header'),brand=new E('a'),nav=new E('nav'),local=new E('a'),context=new E('a'),main=new E('main'),head=new E('head'),body=new E('body'),banner=new E('aside');brand.className='brand';local.setAttribute('href','#example');context.setAttribute('href','A0_THEORY_STORYBOARD.html#overview');context.id='humanCrosswalkNavBack';nav.append(local,context);header.append(brand,nav);banner.id='humanCrosswalkReturn';
 const doc={title:'A0 · test',head,body,currentScript:null,querySelector(s){if(s==='header.top, header.topbar')return header;if(s==='main')return main;return null;},querySelectorAll(s){const match=s.match(/^\[([^\]]+)\]$/);return match?nodes.filter(n=>Object.prototype.hasOwnProperty.call(n.attributes,match[1])):[];},getElementById(id){return nodes.find(n=>n.id===id)||null;},createElement(tag){return new E(tag);},addEventListener(){}};
 const location={pathname:'/book/'+file,hash,search,protocol:surface.protocol,hostname:surface.hostname},events={},win={location,addEventListener(k,fn){events[k]=fn;}};win.self=win;win.top=win;
 vm.runInNewContext(source,{window:win,document:doc,location,URL,URLSearchParams});
 return{header,main,banner,nodes,location,events};
}
for(const file of ['index.html','A0_LIVING_BLUEPRINT.html','A0_SCIENTIFIC_POSITION_REPORT.html','A0_RESEARCH_DESK.html','A0_WERKBANK.html','A0_BENCH_ENTDECKEN.html','A0_ORIENTATION_CONTROLLER_BENCH.html','A0_DATA_AND_REGISTERS.html']){
 const m=mount(file),h=m.header;
 ok(h.children.length===4,'one compact header row with a separate overview group '+file);
 ok(h.children[0].textContent==='NEXAH A0','shared A0 portal brand');
 const lanes=h.children[1],menus=lanes.children.filter(n=>n.tagName==='DETAILS'),roles=menus.filter(n=>['--human','--science','--builder'].some(key=>n.className.endsWith(key)));
 ok(roles.length===2,'A0 Science and A0 Builder form the internal expandable lane row');
 ok(lanes.children.length===5,'two A0 lanes, direct Workbench, direct Register and the separated public-channel group form the navigation row');
 ok(!menus.some(n=>n.className.endsWith('--bench')),'Werkbank is not duplicated as a top-level lane');
 const builder=menus.find(n=>n.className.endsWith('--builder'));
 ok(builder?.children[0].innerHTML.includes('A0 · Builder'),'the existing scarab lane is restored as A0 Builder');
 ok(!builder.children[0].events.click,'public A0 Builder keeps a direct expandable fallback without owner-only projections');
 const workbench=lanes.children.find(n=>n.className==='a0-workbench-entry');
 ok(workbench?.tagName==='DETAILS'&&workbench.children[0].innerHTML.includes('a0-machina-mark')&&workbench.children[0].innerHTML.includes('THE MACHINA'),'THE MACHINA is a marked dropdown house');
 ok(workbench.children[1].className==='a0-machina-menu'&&workbench.children[1].children.length===5,'THE MACHINA dropdown exposes Werkbank and four rooms');
 for(const href of ['A0_WERKBANK.html#bench-page-top','A0_MACHINA_COCKPIT.html#benchFoyer','A0_MACHINA_COCKPIT.html#machinaCockpitTitle','A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf','A0_ORIENTATION_CONTROLLER_BENCH.html#benchWorkDesk'])ok(workbench.children[1].children.some(link=>link.href===href),'THE MACHINA room '+href);
 const register=lanes.children.find(n=>n.className==='a0-register-entry');
 ok(register?.href==='A0_DATA_AND_REGISTERS.html#top'&&register.innerHTML.includes('A0 · NSNavigator'),'A0 NSNavigator is a direct shortcut beside THE MACHINA');
 ok((file==='A0_DATA_AND_REGISTERS.html')===(register?.attributes['aria-current']==='page'),'NSNavigator shortcut marks only its existing locator page current');
 const channels=lanes.children.find(n=>n.className==='a0-public-channels');
 ok(channels?.children[0].href==='https://nexahedron.com/'&&channels.children[1].href==='https://nexah.de/'&&channels.children[2].href==='https://www.scarabaeus1033.net/','the three public websites are visibly separated from A0 lanes');
 const scienceLane=menus.find(n=>n.className.endsWith('--science'));
 ok(m.nodes.some(n=>n.className?.includes('a0-reader-section')&&(n.innerHTML||'').includes('A0 NSNavigator')),'A0 NSNavigator is integrated into Science');
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
  ok(showcase.children.length===3,'three curated entry cards per menu');
  for(const card of showcase.children){
   const [route,anchor]=card.href.split('#'),page=route.split('?')[0];
   const target=fs.readFileSync(__dirname+'/'+page,'utf8');
   ok(!anchor||target.includes('id="'+anchor+'"'),'existing local target and anchor '+card.href);
  }
  if(science){
   ok(showcase.children[0].href==='A0_SCIENCE.html#top','Science menu retains the bounded A0 Science reader without duplicating the public website');
   ok(showcase.children[0].className.includes('a0-showcase-card--nexah'),'A0 Science retains its editorial flagship treatment');
   ok(showcase.children[1].href==='A0_MATHEMATICAL_JOINTS.html','Science keeps Mathfield beside the NEXAH flagship');
   ok(showcase.children[2].href==='A0_DATA_AND_REGISTERS.html#top','Science foregrounds its source-bound data and register map');
   ok(showcase.children.every(card=>!card.href.includes('TOY_STORE')),'no app showcase in Science');
  }
  if(builder){ok(showcase.children[0].href==='index.html?projection=builder-showcase'&&showcase.children[0].innerHTML.includes('A0 Builder Home'),'Builder foregrounds the existing long source-bound A0 projection');ok(showcase.children[1].href==='A0_MACHINA_COCKPIT.html#benchFoyer'&&showcase.children[1].innerHTML.includes('THE MACHINA'),'Builder ranks THE MACHINA as house before Werkbank');ok(showcase.children[2].href==='A0_WERKBANK.html'&&showcase.children[2].innerHTML.includes('Werkbank'),'Builder ranks Werkbank as the operating surface');ok(currentFlagship.className==='a0-current-flagship'&&currentFlagship.children.length===1&&currentFlagship.children[0].href==='A0_SPIN_TO_BLOOM_MEASUREMENT.html#edelweissBridge'&&currentFlagship.children[0].innerHTML.includes('CURRENT FLAGSHIP'),'Edelweiß is the single current flagship');ok(constellation.className==='a0-flagship-constellation'&&constellation.children.length===5,'five major flagships form one constellation');for(const href of ['A0_MATHEMATICAL_JOINTS.html','A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry','A0_TESSAREC_BLUE_BODY_LAB.html#module-entry','A0_PINK_DIAMOND_GRID_ATLAS.html#module-entry','A0_GAME_OF_WORLDS_PLAY.html?world=pulse#pulse'])ok(constellation.children.some(card=>card.href===href),'constellation route '+href);ok(showcase.children.every(card=>!card.href.includes('A0_OPIUM')&&!card.href.includes('arkade')),'Human experiences stay out of the Builder showcase');}
  ok(reading.children[0].className==='a0-reader-sections','reading sections retained');
 }
 if(file==='index.html'){
  ok(roles.every(lane=>lane.dataset.current!=='true'),'portal does not preselect a Reader house');
  const scienceSummary=roles.find(lane=>lane.className.endsWith('--science')).children[0];
  let prevented=false;scienceSummary.events.click[0]({preventDefault(){prevented=true;}});
  ok(prevented&&scienceSummary.events.click.length>0,'first Science click is handled as entry into the Science page');
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
const localLanes=localOwner.header.children[1],localWorkspaceOverview=localOwner.header.children[2],localScienceDesk=localWorkspaceOverview.children.find(n=>n.className.includes('a0-science-desk-link')),localBuilderDesk=localWorkspaceOverview.children.find(n=>n.className.includes('a0-builder-desk-link')),localScienceMenu=localLanes.children.find(n=>n.className.endsWith('--science')),localScienceSummary=localScienceMenu.children[0];
ok(!localWorkspaceOverview.children.some(n=>n.className.includes('a0-human-draft-entry')),'the archived DRAFT has no visible A0 control');
ok(localScienceSummary.innerHTML.includes('A0 · Science'),'the primary Science lane is explicitly internal to A0');
for(const handler of localScienceSummary.events.click)handler({preventDefault(){},currentTarget:localScienceSummary});
ok(localOwner.location.href==='A0_SCIENCE.html','the A0 Science lane opens the local A0 Science reader');
ok(!localWorkspaceOverview.children.some(n=>n.className.includes('a0-nexah-link')),'no redundant NEXAH Science staging button remains in the owner workspace group');
ok(localWorkspaceOverview.children.length===3&&localScienceDesk&&localBuilderDesk&&localWorkspaceOverview.children.some(n=>n.className.includes('a0-mission-control-link')),'Science Desk, Builder Desk and Mission Control form the right-side owner workspace group');
ok(localScienceDesk.href==='A0_RESEARCH_DESK.html?desk=research&rev=desk-top-r2#top','Science Desk enters the selected view at its top with a fresh in-app-browser revision');
ok(localScienceDesk.innerHTML.includes('Science Desk')&&localBuilderDesk.innerHTML.includes('Builder Desk'),'Science Desk and Builder Desk are direct icon routes');
ok(!localOwner.nodes.filter(n=>n.className?.includes('a0-reader-section')).some(n=>(n.innerHTML||'').includes('Science Desk')||(n.innerHTML||'').includes('Builder Desk')),'Desk links do not occupy Reader menus');
const localBuilderMenu=localOwner.header.children[1].children.find(n=>n.className.endsWith('--builder')),localBuilderSummary=localBuilderMenu.children[0];
const localBuilderShowcase=localBuilderMenu.children[1].children[0].children[0];
ok(localBuilderShowcase.children.length===3&&localBuilderShowcase.children[0].href==='index.html?projection=builder-showcase'&&localBuilderShowcase.children[0].innerHTML.includes('A0 Builder Home'),'local Builder home uses the existing long source-bound A0 projection');
const localProjections=localOwner.nodes.filter(n=>n.className==='a0-site-projection');
ok(localProjections.length===5&&localProjections.every(n=>n.hidden),'existing house and owner projections are prepared but initially closed');
const humanProjection=localProjections.find(n=>n.attributes['aria-label']==='NEXAHEDRON · HUMAN VIEW');
ok(humanProjection?.children[0].children.at(-1).textContent==='A0 zurück','NEXAHEDRON stays inside the common A0 frame');
ok(humanProjection?.children[1].title.includes('aktuelle Staging-Ansicht'),'local A0 identifies NEXAHEDRON as the current staging view');
ok(humanProjection.children[0].innerHTML.includes('class="a0-site-projection-home" href="index.html#top"'),'house bar exposes NEXAH A0 as a real start-page link');
ok(source.includes('event.source !== projectionFrame.contentWindow')&&source.includes('returnMessage: "nexah:a0-projection-return"'),'embedded Human return is scoped to its own frame and closes the A0 projection instead of nesting the portal');
const localScienceProjection=mount('A0_SCIENCE.html','','?projection=nexahedron',{protocol:'file:',hostname:''});
const projectedScienceLanes=localScienceProjection.header.children[1];
const projectedScience=projectedScienceLanes.children.find(n=>n.className.endsWith('--science'));
ok(projectedScience.dataset.current==='true'&&projectedScience.dataset.projectionObscured==='true','Science remains the return context without appearing active behind NEXAHEDRON');
ok(localProjections.some(n=>n.attributes['aria-label']==='A0 BUILDER HOME · SHOWCASE'),'the source-bound Builder Showcase is available as a clearly named A0 house view');
const builderShowcaseProjection=localProjections.find(n=>n.attributes['aria-label']==='A0 BUILDER HOME · SHOWCASE');
ok(!localBuilderSummary.attributes['data-a0-builder-showcase']&&!(localBuilderSummary.events.click||[]).length,'Builder summary is a direct disclosure and no longer intercepts the first click');
ok(!(localBuilderShowcase.children[0].events.click||[]).length&&builderShowcaseProjection.hidden===true,'A0 Builder Home is a stable query route into the prepared A0 projection');
const localMachina=mount('A0_WERKBANK.html','','',{protocol:'file:',hostname:''});
const localMachinaLanes=localMachina.header.children[1],localMachinaEntry=localMachinaLanes.children.find(n=>n.className==='a0-workbench-entry'),localMachinaBuilder=localMachinaLanes.children.find(n=>n.className.endsWith('--builder')),localMachinaBuilderSummary=localMachinaBuilder.children[0],localMachinaBuilderProjection=localMachina.nodes.find(n=>n.attributes['aria-label']==='A0 BUILDER HOME · SHOWCASE');
ok(localMachinaEntry.dataset.current==='true','THE MACHINA starts as the single active return context on its own page');
ok(!localMachinaBuilderSummary.attributes['data-a0-builder-showcase']&&localMachinaBuilderProjection.hidden===true,'THE MACHINA page also keeps Builder disclosure separate from the optional Showcase projection');
const builderDeskProjection=localProjections.find(n=>n.attributes['aria-label']==='BUILDER DESK · B0');
localBuilderDesk.events.click[0]({preventDefault(){},currentTarget:localBuilderDesk});
ok(builderDeskProjection.hidden===false&&builderDeskProjection.children[1].getAttribute('src')===localBuilderDesk.href,'Builder Desk opens as a closable A0 house view');
builderDeskProjection.children[0].children.at(-1).events.click[0]();
const missionLink=localWorkspaceOverview.children.find(n=>n.className.includes('a0-mission-control-link'));
const missionProjection=localProjections.find(n=>n.attributes['aria-label']==='MISSION CONTROL · STEUERUNG');
missionLink.events.click[0]({preventDefault(){},currentTarget:missionLink});
ok(missionProjection.hidden===false&&missionProjection.children[1].getAttribute('src')===missionLink.href,'Mission Control opens as a closable A0 house view');
const localServer=mount('A0_SCIENCE.html','','',{protocol:'http:',hostname:'127.0.0.1'});
const localServerWorkspace=localServer.header.children[2];
const localServerScience=localServer.header.children[1].children.find(n=>n.className.endsWith('--science')).children[0];
ok(localServerScience.innerHTML.includes('A0 · Science'),'localhost retains the internal A0 Science lane beside the separate nexah.de channel');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-mission-control-link')).href.startsWith('http://127.0.0.1:8766/00%20EXECUTIVE/'),'localhost Mission Control uses the shared Owner server');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-builder-desk-link')).href.startsWith('http://127.0.0.1:8766/10%20NEXAH%20CORE/'),'localhost Builder Desk uses the shared Owner server');
const directBuilder=mount('index.html','','?projection=builder-showcase',{protocol:'file:',hostname:''});
const directBuilderProjection=directBuilder.nodes.find(n=>n.attributes['aria-label']==='A0 BUILDER HOME · SHOWCASE');
ok(directBuilderProjection?.hidden===false,'direct Builder route opens inside the persistent A0 shell');
ok(directBuilderProjection?.children[1].getAttribute('src').includes('BUILDER_STATUS_REPORT.html?standalone=1#top'),'direct Builder route loads the complete Mission Control Showcase at its top in the A0 projection');
const directNexah=mount('index.html','','?projection=nexah-science',{protocol:'file:',hostname:''});
const directNexahProjection=directNexah.nodes.find(n=>n.attributes['aria-label']==='NEXAH SCIENCE · STAGING / OWNER-ABNAHME');
ok(directNexahProjection?.hidden===false,'direct NEXAH Science staging route opens inside the persistent A0 shell');
const builderStatus=fs.readFileSync(path.resolve(__dirname,'../../../../../00 EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html'),'utf8');
ok(builderStatus.includes('window.self !== window.top')&&builderStatus.includes('index.html?projection=builder-showcase'),'standalone Mission Control Builder entry returns to the A0 shell while its embedded projection stays in place');
ok(builderStatus.includes('params.get("standalone") === "1"'),'explicit standalone inspection remains available as a bounded escape hatch');
console.log(JSON.stringify({status:'PASS',checks,scope:'actual shared navigation script in DOM double; menu structure, index-only folding and contextual banner; not browser pixels'},null,2));
