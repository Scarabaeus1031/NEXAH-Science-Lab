const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('./a0-orientation-controller-bench.js');
const protocol='A0_ORIENTATION_READING_V1',bridge=fs.readFileSync('./a0-orientation-source-bridge.js','utf8');
function child(kind){
  const messages=[],handlers={},parent={postMessage:data=>messages.push(data)},els=kind==='pascal'?{pascalShadowGon:{},pascalDepth:{value:'8'},shadowTitle:{textContent:'29-gon comparison frame'},pascalState:{textContent:'state (8,0,0; +) / antipode (0,0,8; −)'}}:{ghostPreset:{value:'root7'}};
  for(const id of ['handleDecision','pascalShadow','crt16-tile','ghost-tiles'])els[id]={scrollIntoView(){this.scrolled=true;}};
  const window={parent,A0OrientationController:C,A0GhostTiles:{selection:{x:2,y:2,value:17},side:10,phase:3},A0TesaGridLens:{snapshot:()=>({source:{address:17},status:'CANDIDATE'})},addEventListener:(name,fn)=>handlers[name]=fn};
  vm.runInNewContext(bridge,{window,document:{getElementById:id=>els[id]},Date});
  const receive=(data,source=parent)=>handlers.message({data,source});
  return{messages,els,parent,receive};
}
const p=child('pascal');p.receive({protocol,target:'pascal',action:'snapshot',requestId:'one'},{});assert.equal(p.messages.length,0);
p.receive({protocol:'wrong',target:'pascal',action:'snapshot',requestId:'one'});assert.equal(p.messages.length,0);
p.receive({protocol,target:'pascal',action:'snapshot',requestId:'one'});
const result=p.messages[0];assert.equal(result.status,'READ');assert.equal(result.record.depth,8);assert.equal(result.record.sides,29);assert.equal(result.record.plus.macroNodes,45);assert.equal(result.record.plus.pathMass,6561);assert.equal(result.record.projectionCollision,true);
p.receive({protocol,target:'pascal',action:'focus',focus:'return'});assert.equal(p.els.handleDecision.scrolled,true);
p.els.pascalDepth.value='99';p.receive({protocol,target:'pascal',action:'snapshot',requestId:'bad'});assert.equal(p.messages[1].status,'UNAVAILABLE');
const g=child('grid');g.receive({protocol,target:'grid',action:'snapshot',requestId:'two'});assert.equal(g.messages[0].record.tesa,null);
g.els.ghostPreset.value='tesa28';g.receive({protocol,target:'grid',action:'snapshot',requestId:'three'});assert.equal(g.messages[1].record.tesa.source.address,17);assert.equal(g.messages[1].record.recordNotes.windings,11);
class El{
  constructor(){this.value='';this.children=[];this.attrs={};this.events={};this.dataset={};this.textContent='';this.hidden=false;this.contentWindow={sent:[],postMessage(data){this.sent.push(data);}};}
  addEventListener(n,f){this.events[n]=f;}fire(n){this.events[n]?.();}appendChild(el){this.children.push(el);}setAttribute(k,v){this.attrs[k]=v;}scrollIntoView(){this.scrolled=true;}
}
const ids=['orientationReading','orientationReadingFocus','orientationReadingQuestion','orientationReadingPanels','orientationReadingCurrent','orientationReadingStandalone','orientationReadingRecord','orientationReadingStatus','orientationReadingExport','orientationReadingCapture','orientationReadingSewing','pentagonSewing'],els=Object.fromEntries(ids.map(id=>[id,new El()]));
const tabs=['sewing','pascal','grid'].map(key=>{const el=new El();el.dataset.orientationView=key;return el;});els.orientationReading.querySelectorAll=()=>tabs;els.orientationReadingFocus.value='source';
const handlers={},timers=new Map();let timerId=0;
const sewing={record:{mode:'5+3',source:[1,2,3,4,5,6,7,8]},time:1.25};
const window={A0PentagonSewingView:{snapshot:()=>sewing},addEventListener:(name,fn)=>handlers[name]=fn};
vm.runInNewContext(fs.readFileSync('./a0-orientation-reading-workspace.js','utf8'),{window,document:{getElementById:id=>els[id],createElement:()=>new El()},setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),Date});
const W=window.A0OrientationReadingWorkspace;assert.equal(els.orientationReadingPanels.children.length,0);
W.collect();assert.equal(W.snapshot().sources.pascal.status,'NOT_OPENED');assert.equal(W.snapshot().sources.sewing.record.time,1.25);
W.select('pascal');W.select('grid');W.select('pascal');assert.equal(els.orientationReadingPanels.children.length,2);assert.equal(els.orientationReadingPanels.children[0].hidden,false);assert.equal(els.orientationReadingPanels.children[1].hidden,true);
W.collect();const request=W.snapshot().requestId,panel=els.orientationReadingPanels.children[0],pframe=panel.children[0],gframe=els.orientationReadingPanels.children[1].children[0];assert.equal(els.orientationReadingExport.disabled,true);
const reply={protocol,source:'pascal',requestId:request,status:'READ',capturedAt:result.capturedAt,record:result.record};
handlers.message({data:reply,source:{}});assert.equal(W.snapshot().sources.pascal.status,'PENDING');
handlers.message({data:{...reply,requestId:'old'},source:pframe.contentWindow});assert.equal(W.snapshot().sources.pascal.status,'PENDING');
handlers.message({data:reply,source:pframe.contentWindow});assert.equal(W.snapshot().sources.pascal.record.depth,8);
handlers.message({data:{protocol,source:'grid',requestId:request,status:'READ',record:g.messages[1].record},source:gframe.contentWindow});assert.equal(els.orientationReadingExport.disabled,false);assert.equal(W.snapshot().relations.commonCarrier,'UNBOUND');
sewing.time=2;assert.equal(W.snapshot().sources.sewing.record.time,1.25);
W.collect();assert.equal(W.snapshot().sources.sewing.record.time,2);for(const fn of timers.values())fn();assert.equal(W.snapshot().sources.pascal.status,'UNAVAILABLE');assert.equal(W.snapshot().sources.grid.status,'UNAVAILABLE');assert.equal(els.orientationReadingExport.disabled,false);
els.orientationReadingFocus.value='projection';els.orientationReadingFocus.fire('change');assert.match(els.orientationReadingQuestion.textContent,/kein zeitliches Signal/);assert.equal(pframe.contentWindow.sent.at(-1).action,'focus');
els.orientationReadingSewing.fire('click');assert.equal(els.pentagonSewing.scrolled,true);
for(const file of ['A0_AXIS08_FOLD_RETURN_SEQUENCER.html','A0_ORIENTATION_CONTROLLER_BENCH.html','A0_PINK_DIAMOND_GRID_ATLAS.html'])assert.ok(fs.existsSync(file));
assert.match(fs.readFileSync('./A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),/id="pascalShadow"/);
console.log('PASS: source adapters with real Pascal model; lazy original panels; source-window/protocol/request guards; missing/invalid/stale/timeout states; immutable comparative records; independent sources and explicit unbound relations');
