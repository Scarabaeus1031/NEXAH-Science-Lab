const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/a0-context-navigation.js','utf8');let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;};
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
 ok(roles.length===3,'three Reader roles retained');
 ok(lanes.children.length===3,'only the three perspectives form the reading row');
 ok(!menus.some(n=>n.className.endsWith('--bench')),'Werkbank is not duplicated as a top-level lane');
 const scienceLane=menus.find(n=>n.className.endsWith('--science'));
 ok(m.nodes.some(n=>n.className?.includes('a0-reader-section')&&(n.innerHTML||'').includes('Daten & Register')),'Data and registers is integrated into Science');
 ok(m.nodes.some(n=>n.className?.includes('a0-reader-section')&&(n.innerHTML||'').includes('Werkbank · Start & Räume')),'Werkbank is integrated into Builder');
 const workspaceOverview=h.children[2];
 ok(workspaceOverview.className==='a0-workspace-overviews','workspace overviews are separated on the right');
 ok(workspaceOverview.children.length===0,'public view does not expose local owner workspaces');
 ok(roles.every(n=>!n.open),'Reader menus closed by default');
 for(const lane of roles){
  const layout=lane.children[1].children[0];
  ok(lane.children[1].children[0]===layout,'Reader panel starts with its useful navigation content');
  ok(layout.className==='a0-reader-layout','layout inside existing panel');
  const [showcase,reading]=layout.children;
  ok(showcase.className==='a0-showcase'&&reading.className==='a0-reader-reading','features left / first, theory right / second');
  const science=lane.className.endsWith('--science');
  ok(showcase.children.length===3,'three curated flagship cards per menu');
  for(const card of showcase.children){
   const [page,anchor]=card.href.split('#');
   const target=fs.readFileSync(__dirname+'/'+page,'utf8');
   ok(!anchor||target.includes('id="'+anchor+'"'),'existing local target and anchor '+card.href);
  }
  if(science){
   ok(showcase.children[0].href==='NEXAH_SCIENCE.html#overview','Science foregrounds the broad NEXAH research index');
   ok(showcase.children[0].className.includes('a0-showcase-card--nexah'),'NEXAH Science uses its editorial nexah.de flagship treatment');
   ok(showcase.children[1].href==='A0_MATHEMATICAL_JOINTS.html','Science keeps Mathfield beside the NEXAH flagship');
   ok(showcase.children[2].href==='A0_DATA_AND_REGISTERS.html#top','Science foregrounds its source-bound data and register map');
   ok(showcase.children.every(card=>!card.href.includes('TOY_STORE')),'no app showcase in Science');
  }
  if(lane.className.endsWith('--human')){ok(showcase.children[0].href==='a0-public-arkade-index.html#arkade','ARKADE is the first Human flagship');ok(showcase.children[1].href==='A0_OPIUM.html'&&showcase.children[1].innerHTML.includes('Human Flagship'),'OPIUM / Club is the second Human flagship');ok(showcase.children[2].href==='A0_LOOK_AGAIN_PLAY.html'&&showcase.children[2].innerHTML.includes('Perception'),'LOOK AGAIN is the third Human-facing experience');ok(showcase.children.every(card=>!card.href.includes('TOY_STORE')&&!card.href.includes('APERTURE_JOURNEY')),'Human showcase contains no Builder Toy Store or duplicate Human View');}
  if(lane.className.endsWith('--builder')){ok(showcase.children.some(card=>card.href==='A0_WERKBANK.html'&&card.innerHTML.includes('Builder Flagship')),'Builder foregrounds Werkbank');ok(showcase.children.some(card=>card.href==='A0_MACHINA_COCKPIT.html#benchFoyer'&&card.innerHTML.includes('THE MACHINA')),'Builder foregrounds THE MACHINA');ok(showcase.children.some(card=>card.href==='A0_BUILDER_TOY_STORE.html'),'Builder retains Toy Store');ok(showcase.children.every(card=>!card.href.includes('A0_OPIUM')&&!card.href.includes('arkade')),'Human experiences stay out of Builder showcase');}
  ok(reading.children[0].className==='a0-reader-sections','reading sections retained');
 }
 if(file==='index.html'){
  ok(roles.every(lane=>lane.dataset.current!=='true'),'portal does not preselect a Reader house');
  const scienceSummary=roles.find(lane=>lane.className.endsWith('--science')).children[0];
  let prevented=false;scienceSummary.events.click[0]({preventDefault(){prevented=true;}});
  ok(prevented&&scienceSummary.events.click.length>0,'first Science click is handled as entry into the Science page');
 }
 ok(h.children[3].children[0].textContent==='Übersicht','one overview menu');
 ok(!h.children[3].open,'overview closed by default');
 ok(h.children[3].children[1].children[0].className==='a0-overview-current','five-entry overview is foregrounded');
 ok(h.children[3].children[1].children[0].innerHTML.includes('Fünf Eingänge. Ein Werk.'),'overview contains the five-entry heading');
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
const localLanes=localOwner.header.children[1],localWorkspaceOverview=localOwner.header.children[2],localScienceDesk=localWorkspaceOverview.children.find(n=>n.className.includes('a0-science-desk-link')),localBuilderDesk=localWorkspaceOverview.children.find(n=>n.className.includes('a0-builder-desk-link')),localNexah=localWorkspaceOverview.children.find(n=>n.className.includes('a0-nexah-link'));
ok(localNexah.href.includes('40%20EXPERIENCE%20PRODUCTION/NEXAH-Experience/dist/index.html'),'local NEXAH Preview icon points to the composed release artifact');
ok(!localNexah.target&&!localNexah.rel,'local NEXAH Release Preview stays in the current A0 shell');
ok(localWorkspaceOverview.children.length===4&&localScienceDesk&&localBuilderDesk&&localWorkspaceOverview.children.some(n=>n.className.includes('a0-mission-control-link'))&&localNexah,'Science Desk, Builder Desk, Mission Control and NEXAH Release Preview form the right-side overview group');
ok(localScienceDesk.href==='A0_RESEARCH_DESK.html?desk=research&rev=desk-top-r2#top','Science Desk enters the selected view at its top with a fresh in-app-browser revision');
ok(localScienceDesk.innerHTML.includes('Science Desk')&&localBuilderDesk.innerHTML.includes('Builder Desk'),'Science Desk and Builder Desk are direct icon routes');
ok(!localOwner.nodes.filter(n=>n.className?.includes('a0-reader-section')).some(n=>(n.innerHTML||'').includes('Science Desk')||(n.innerHTML||'').includes('Builder Desk')),'Desk links do not occupy Reader menus');
const localBuilderMenu=localOwner.header.children[1].children.find(n=>n.className.endsWith('--builder'));
const localBuilderShowcase=localBuilderMenu.children[1].children[0].children[0];
ok(localBuilderShowcase.children.length===4&&localBuilderShowcase.children[0].href.includes('BUILDER_STATUS_REPORT.html#top'),'local Builder menu foregrounds the Mission Control Showcase at its top before the three workshop cards');
const localProjections=localOwner.nodes.filter(n=>n.className==='a0-site-projection');
ok(localProjections.length===5&&localProjections.every(n=>n.hidden),'Human, Builder Showcase, Builder Desk, Mission Control and NEXAH Release Preview projections are prepared but initially closed');
const humanProjection=localProjections.find(n=>n.attributes['aria-label']==='NEXAHEDRON · HUMAN VIEW');
ok(humanProjection?.children[0].children.at(-1).textContent==='A0 zurück','NEXAHEDRON stays inside the common A0 frame');
const localHumanMenu=localOwner.header.children[1].children.find(n=>n.className.endsWith('--human'));
ok(humanProjection?.children[1].title.includes('aktuelle Staging-Ansicht'),'local A0 identifies NEXAHEDRON as the current staging view');
for(const handler of localHumanMenu.children[0].events.click)handler({preventDefault(){},currentTarget:localHumanMenu.children[0]});
const localHumanProjectionHref=new URL(humanProjection.children[1].getAttribute('src'));
ok(humanProjection.hidden===false&&localHumanProjectionHref.origin==='http://127.0.0.1:8766'&&localHumanProjectionHref.pathname.endsWith('/a0-human/start/index.html')&&/^\d+$/.test(localHumanProjectionHref.searchParams.get('a0_preview')||''),'local Human entry opens the freshly revisioned NEXAHEDRON staging application from the shared A0 Owner server');
ok(localHumanMenu.dataset.projectionCurrent==='true','visible NEXAHEDRON projection inversely marks Human as the active house');
ok(localHumanMenu.parentNode.children.find(n=>n.className.endsWith('--science')).dataset.projectionObscured===undefined,'portal source page has no stale Science highlight');
for(const handler of localHumanMenu.children[0].events.click)handler({preventDefault(){},currentTarget:localHumanMenu.children[0]});
ok(humanProjection.hidden===true&&localHumanMenu.open===true,'second Human click returns from the house view and opens the Human navigation panel');
ok(localOwner.nodes.some(n=>n.tagName==='A'&&n.href==='index.html#top'&&(n.innerHTML||'').includes('NEXAH A0 · Startseite')),'Human navigation restores an explicit NEXAH A0 start link');
ok(humanProjection.children[0].innerHTML.includes('class="a0-site-projection-home" href="index.html#top"'),'house bar exposes NEXAH A0 as a real start-page link');
for(const handler of localHumanMenu.children[0].events.click)handler({preventDefault(){},currentTarget:localHumanMenu.children[0]});
ok(humanProjection.hidden===false&&localHumanMenu.open===false,'Human house view can be reopened after using its navigation panel');
humanProjection.children[0].children.at(-1).events.click[0]();
ok(localHumanMenu.dataset.projectionCurrent===undefined,'closing the projection restores the page-derived A0 navigation state');
const localScienceProjection=mount('A0_SCIENCE.html','','?projection=nexahedron',{protocol:'file:',hostname:''});
const projectedScienceLanes=localScienceProjection.header.children[1];
const projectedHuman=projectedScienceLanes.children.find(n=>n.className.endsWith('--human'));
const projectedScience=projectedScienceLanes.children.find(n=>n.className.endsWith('--science'));
ok(projectedHuman.dataset.projectionCurrent==='true','visible NEXAHEDRON house overrides the source page and marks Human current');
ok(projectedScience.dataset.current==='true'&&projectedScience.dataset.projectionObscured==='true','Science remains the return context without appearing active behind NEXAHEDRON');
ok(localProjections.some(n=>n.attributes['aria-label']==='BUILDER SHOWCASE · THOOTH / MISSION CONTROL'),'THOOTH Mission Control Builder Showcase is available as a closable A0 house view');
const localNexahProjection=localProjections.find(n=>n.attributes['aria-label']==='NEXAH RELEASE PREVIEW · OWNER-ABNAHME');
localNexah.events.click[0]({preventDefault(){},currentTarget:localNexah});
ok(localNexahProjection.hidden===false&&localNexahProjection.children[1].getAttribute('src')===localNexah.href,'NEXAH Preview icon opens the composed release artifact under the persistent A0 header');
localNexahProjection.children[0].children.at(-1).events.click[0]();
ok(localNexahProjection.hidden===true,'A0 return closes the embedded NEXAH.de preview');
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
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-nexah-link')).href.startsWith('http://127.0.0.1:8766/40%20EXPERIENCE%20PRODUCTION/NEXAH-Experience/dist/'),'localhost NEXAH Release Preview uses the shared Owner server');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-mission-control-link')).href.startsWith('http://127.0.0.1:8766/00%20EXECUTIVE/'),'localhost Mission Control uses the shared Owner server');
ok(localServerWorkspace.children.find(n=>n.className.includes('a0-builder-desk-link')).href.startsWith('http://127.0.0.1:8766/10%20NEXAH%20CORE/'),'localhost Builder Desk uses the shared Owner server');
const directBuilder=mount('index.html','','?projection=builder-showcase',{protocol:'file:',hostname:''});
const directBuilderProjection=directBuilder.nodes.find(n=>n.attributes['aria-label']==='BUILDER SHOWCASE · THOOTH / MISSION CONTROL');
ok(directBuilderProjection?.hidden===false,'direct Builder route opens inside the persistent A0 shell');
ok(directBuilderProjection?.children[1].getAttribute('src').includes('BUILDER_STATUS_REPORT.html#top'),'direct Builder route loads the Mission Control Showcase at its top in the A0 projection');
const builderStatus=fs.readFileSync(path.resolve(__dirname,'../../../../../00 EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html'),'utf8');
ok(builderStatus.includes('window.self !== window.top')&&builderStatus.includes('index.html?projection=builder-showcase'),'standalone Mission Control Builder entry returns to the A0 shell while its embedded projection stays in place');
ok(builderStatus.includes('params.get("standalone") === "1"'),'explicit standalone inspection remains available as a bounded escape hatch');
console.log(JSON.stringify({status:'PASS',checks,scope:'actual shared navigation script in DOM double; menu structure, index-only folding and contextual banner; not browser pixels'},null,2));
