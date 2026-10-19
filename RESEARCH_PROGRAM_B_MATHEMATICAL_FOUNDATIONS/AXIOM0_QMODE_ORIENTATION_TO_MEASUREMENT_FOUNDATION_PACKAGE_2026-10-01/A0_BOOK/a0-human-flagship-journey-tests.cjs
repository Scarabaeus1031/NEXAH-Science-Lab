"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const api=require("./a0-human-flagship-journey.js"),focusApi=require("./a0-human-instrument-focus.js");
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++};
class Element{
 constructor(tag="div"){this.tagName=tag;this.children=[];this.attributes={};this.listeners={};this.dataset={};this.style={};this.hidden=false}
 append(child){child.remove();child.parent=this;this.children.push(child)}
 prepend(child){child.remove();child.parent=this;this.children.unshift(child)}
 remove(){if(this.parent){this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null}}
 setAttribute(key,value){this.attributes[key]=value}
 removeAttribute(key){delete this.attributes[key]}
 addEventListener(key,fn){this.listeners[key]=fn}
 focus(){this.focused=true}scrollIntoView(){this.scrolled=true}
 click(){this.listeners.click?.({preventDefault(){}})}
}
const html=fs.readFileSync(path.join(__dirname,"DRAFTS/A0_HUMAN_BOOK_DRAFT.html"),"utf8");
check(api.stations.length===5,"five curated Human Book chapters");
check(!/heroCanvas|humanCanvas|ENTER THE RAIN|PLAY THE ALBUM|a0-context-navigation.js/.test(html),"no old competing starts or automatic navigation overlay");
check((html.match(/<h1 /g)||[]).length===1,"one page title");
check(/<noscript>/.test(html)&&/skip/.test(html),"no-JS and skip access");
check(/href="https:\/\/scarabaeus1031\.github\.io\/NEXAH-Science-Lab\/book\/index\.html" class="brand"/.test(html),"NEXAH brand returns to the stable GitHub Pages A0 start");
check(/NEXAH <span>ENTWURF<\/span>/.test(html),"draft is visibly labelled");
check(/href="A0_NEXAH_APERTURE_JOURNEY.html#human-view">Human View/.test(html),"draft returns to canonical Human View");
check(/href="A0_GAME_OF_WORLDS_PLAY\.html\?world=life#life"/.test(html),"Human Book exposes direct Arkade gate");
for(const station of api.stations){
 const source=fs.readFileSync(path.join(__dirname,station.file),"utf8");
 if(station.focus!==false){check(source.includes('id="'+station.target+'"'),"existing source target "+station.target);check(source.includes('src="a0-human-instrument-focus.js"'),"source installs presentation only focus");check(focusApi.allowed[station.file].includes(station.target),"allowlisted focus "+station.target);check(api.sourceUrl(station).includes("?human-stage="+station.target+"#"+station.target),"source-only route")}else{check(source.includes('id="pickLife"')&&source.includes('id="pickNumbers"'),"Arkade reuses complete playable source");check(api.sourceUrl(station)==="A0_GAME_OF_WORLDS_PLAY.html?world=life#life","Arkade Human route")}
 check(station.action&&station.notice&&station.boundary,"action and boundary each station");
}
const allIds=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
check(new Set(allIds).size===allIds.length,"unique HTML ids");
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const href=match[1];if(href.startsWith("#")){check(allIds.includes(href.slice(1))||/^#station-[1-5]$/.test(href),"internal anchor "+href);continue}
 if(/^https:\/\//.test(href)){check(href==="https://scarabaeus1031.github.io/NEXAH-Science-Lab/book/index.html","approved external target "+href);continue}
 check(fs.existsSync(path.join(__dirname,href.split(/[?#]/)[0])),"local target "+href);
}
const elements=Object.fromEntries(allIds.map(id=>[id,new Element()])),rail=Array.from({length:5},(_,i)=>{const e=new Element("a");e.dataset.station=String(i);return e});
const listeners={},doc={getElementById:id=>elements[id],querySelectorAll:()=>rail,createElement:tag=>new Element(tag)};
const win={location:{hash:""},addEventListener:(key,fn)=>listeners[key]=fn,matchMedia:()=>({matches:true})};
const view=api.mount(doc,win);
check(!elements.instrumentShell.children.length,"no eager iframe or source autoplay");
view.load();const first=elements.instrumentShell.children[0];check(first.tagName==="iframe"&&first.src===api.sourceUrl(api.stations[0]),"user loads real source");
check(first.attributes.sandbox==="allow-scripts allow-same-origin","bounded iframe permissions");
win.location.hash="#station-2";listeners.hashchange();check(!first.parent&&elements.instrumentShell.children.length===1,"switch unloads previous source");
check(view.current===1&&elements.stationTitle.textContent===api.stations[1].title,"station story advances");
check(elements.stationCopy.focused,"keyboard focus follows station");
elements.stopInstrument.click();check(!elements.instrumentShell.children.length,"stop unloads frame");
win.location.hash="#station-3";listeners.hashchange();check(!elements.instrumentShell.children.length,"after stop next station does not reload");
view.select(4);elements.nextStation.click();check(elements.return.focused&&elements.return.scrolled,"end closes and focuses conclusion");
const retained=view.current;view.select(5);check(view.current===retained,"invalid station rejected");
check(api.indexFromHash("#station-0")===null&&api.indexFromHash("#station-6")===null,"invalid deep links rejected");
view.load();listeners.pagehide();check(!elements.instrumentShell.children.length,"pagehide cleanup");
const hc=require("./a0-human-crosswalk.js"),context={scene:5,moment:77,layer:"visibility"};
win.A0HumanCrosswalk=hc;win.location.search=new URL(hc.outbound(context,"journey"),"file:///fixture/").search;
api.mount(doc,win);check(elements.humanCrosswalkBack.href.includes("hc_moment=77"),"incoming model position retained on return");
check(elements.humanCrosswalkCopy.textContent.includes("keinen früheren Fragen-Loop"),"no false old-question restoration");
function sourceFixture(file,id,embedded=true){
 const target=new Element("section"),body=new Element("body"),head=new Element("head");body.append(target);let reveal=0,resize=0;
 const sourceDoc={body,head,getElementById:()=>target,createElement:tag=>new Element(tag)};
 const sourceWin={location:{href:"file:///fixture/"+file+"?human-stage="+id},Event:class{constructor(type){this.type=type}},dispatchEvent:()=>resize++,scrollTo(){},A0BlueBodyReadingMode:{showExpert(){reveal++}}};
 sourceWin.parent=embedded?{}:sourceWin;return{target,body,head,sourceDoc,sourceWin,get reveal(){return reveal},get resize(){return resize}};
}
for(const s of api.stations.filter(item=>item.focus!==false)){const f=sourceFixture(s.file,s.target);check(focusApi.focus(f.sourceDoc,f.sourceWin),"valid focus "+s.target);const host=f.body.children.find(x=>x.id==="a0-human-instrument-focus");check(host.children.includes(f.target),"original node moved not cloned");check(f.resize===1,"source redraw requested after move");if(s.target==="fold-contact")check(f.reveal===1,"existing expert visibility API used")}
let f=sourceFixture(api.stations[0].file,"lab",false);check(!focusApi.focus(f.sourceDoc,f.sourceWin)&&f.head.children.length===0,"standalone originals untouched");
f=sourceFixture(api.stations[0].file,"arbitrary");check(!focusApi.focus(f.sourceDoc,f.sourceWin),"unknown target fail closed");
const focusSource=fs.readFileSync(path.join(__dirname,"a0-human-instrument-focus.js"),"utf8");check(!/cloneNode|innerHTML|\.click\(|setInterval|postMessage/.test(focusSource),"focus does not duplicate renderers, start players or issue commands");
const css=fs.readFileSync(path.join(__dirname,"a0-human-flagship-journey.css"),"utf8");check(css.includes("prefers-reduced-motion")&&css.includes("max-width:720px")&&css.includes("focus-visible"),"reduced motion mobile and keyboard styles");
const gateCss=fs.readFileSync(path.join(__dirname,"a0-human-builder-gate.css"),"utf8");check(gateCss.includes(".builder-gate")&&gateCss.includes(".journey-gates"),"Human to Builder gate is styled");
console.log(JSON.stringify({status:"PASS",checks,scope:"HTML/source links, real controller with DOM doubles, original-node focus lifecycle. No browser pixels or scientific replay."},null,2));
