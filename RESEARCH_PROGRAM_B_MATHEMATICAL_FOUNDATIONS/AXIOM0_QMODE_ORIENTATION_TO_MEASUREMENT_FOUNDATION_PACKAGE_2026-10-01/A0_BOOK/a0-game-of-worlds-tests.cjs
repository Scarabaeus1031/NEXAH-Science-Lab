const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const model=require('./a0-game-of-worlds-model.js'),life=require('../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/cylinder-engine.js'),temporal=require('../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/temporal-z-cylinder.js'),reader=require('./a0-family-spatial-navigation.js');
let checks=0;function ok(v,m){assert.ok(v,m);checks++}
const originals=['A0_GAME_4_LIFE_PLUS_1.html','../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/cylinder-engine.js','../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/temporal-z-cylinder.js','../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/three-domain-transition-test/domain-engine.js','../../../../../10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/three-domain-transition-test/transition-montage.js'];
const pins=originals.map(p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,p))).digest('hex'));
for(const pattern of ['blinker','block','glider'])for(const boundary of life.MODES){
  let session=model.start({world:'life',pattern,boundary}),native=life.initial({kind:'pattern',pattern,size:16},boundary);
  for(let g=0;g<=64;g++){
    const frame=session.frames[session.cursor];
    ok(life.equal(frame.state,native),'unmodified native LIFE semantics '+pattern+boundary+g);
    ok(frame.points.every(p=>p.x>=0&&p.x<16&&p.y>=0&&p.y<16&&p.generation===g),'address and generation retained');
    const joint=model.joint(session),previous=session.frames[Math.max(0,g-1)];
    ok(joint.exact&&joint.c00+joint.c01+joint.c10+joint.c11===256,'source Joint exact partition');
    ok(joint.previous.one===previous.points.length&&joint.current.one===frame.points.length,'source Joint preserves both marginals');
    if(g<64){session=model.step(session);native=life.step(native)}
  }
  ok(model.replay(session).status==='PASS','all stored LIFE frames replay');
  const future=JSON.stringify(session.frames),back=model.at(session,0),next=model.step(back);
  ok(next.cursor===1&&JSON.stringify(next.frames)===future,'Replay forward reads stored states without duplicate generation');
  assert.throws(()=>model.step(session));checks++;
}
for(const [re,im] of [[3,4],[-10,10],[0,0],[1,-2]]){
  let session=model.start({world:'euler',re,im});
  for(let g=1;g<=64;g++){session=model.step(session);const s=session.frames[g].state;ok(s.re*s.re+s.im*s.im===re*re+im*im,'Euler exact norm');if(g%4===0)ok(model.fingerprint(s)===model.fingerprint(session.frames[0].state),'Euler four-turn Return')}
  ok(model.replay(session).status==='PASS','Euler deterministic replay');
}
let fib=model.start({world:'fibonacci'});
for(let g=0;g<30;g++){const old=fib.frames[g].state;fib=model.step(fib);const now=fib.frames[g+1].state;ok(now.a===old.b&&BigInt(now.b)===BigInt(old.a)+BigInt(old.b),'Fibonacci pair, not single-value recurrence');ok(fib.frames[g+1].points[0].x===Number(BigInt(now.a)%11n),'declared remainder projection')}
ok(fib.frames[7].state.a==='13'&&fib.frames[30].state.a==='832040','Fibonacci target and horizon');
ok(model.replay(fib).status==='PASS','Fibonacci deterministic replay');
const collision=model.joint(model.at(fib,2));
ok(collision.total===77&&collision.occupancyEqual&&!collision.fullStateEqual,'same Fibonacci display value does not imply same complete pair state');
const corrupt=JSON.parse(JSON.stringify(fib));corrupt.frames[7].state.a='14';
ok(model.replay(corrupt).status==='FAIL','record mutation rejected');
const invalid=JSON.parse(JSON.stringify(fib));invalid.cursor=99;ok(model.replay(invalid).status==='INVALID','out-of-range cursor rejected');
ok(model.replay({schema:'unknown'}).status==='INVALID','unknown schema rejected');
for(const config of [{world:'unknown'},{world:'__proto__'},{world:'euler',re:11},{world:'euler',re:''},{world:'euler',im:1.5},{world:'life',pattern:'unknown'}]){assert.throws(()=>model.start(config));checks++}
for(const world of Object.keys(model.worlds)){let s=model.start({world});for(let i=0;i<model.mission(s).target;i++)s=model.step(s);ok(model.mission(s).success,'playable mission '+world)}
for(const world of Object.keys(model.worlds)){const s=model.start({world});ok(s.viewContract.axis_kind===(world==='life'?'time':'sequence'),'explicit axis semantics '+world);const changed=JSON.parse(JSON.stringify(s));changed.viewContract.axis_kind='physical-universal-time';ok(model.replay(changed).status==='INVALID','Replay rejects changed axis semantics '+world)}
// Production UI: real adapters, deterministic timer, canvas commands stubbed only.
const html=fs.readFileSync(__dirname+'/A0_GAME_OF_WORLDS.html','utf8'),nodes={},listeners={},timers=new Map();let nextTimer=0;
for(const token of ['class="top gw-top"','a0-context-navigation.css?rev=game-of-worlds-human-flagship-20261022','a0-context-navigation.js?rev=game-of-worlds-human-flagship-20261022','id="gatewayTitle"','START ONE PULSE','id="worldRoutes"','ONE CLOCK · THREE WORLDS · ONE WITNESS','00 · 3+1 / WITNESS','01 · SOURCE','02 · CARRIER','03 · LENS','<small>+1</small><b>RETURN</b>','id="methodLab"','ENGINE ROOM · REGELN, REPLAY UND QUELLEN','world=pulse#pulse'])ok(html.includes(token),'front door '+token);
function element(){return{children:[],style:{},attrs:{},dataset:{},value:'',append(...n){this.children.push(...n)},replaceChildren(...n){this.children=n},setAttribute(k,v){this.attrs[k]=v},click(){},remove(){},getBoundingClientRect:()=>({left:0,top:0,width:440,height:310}),setPointerCapture(){},getContext:()=>new Proxy({},{get:()=>()=>{}})}}
for(const match of html.matchAll(/id="([^"]+)"/g))nodes[match[1]]=element();
Object.assign(nodes.worldPick,{value:'life'});nodes.worldPattern.value='blinker';nodes.worldBoundary.value='finite-dead';nodes.worldRe.value='3';nodes.worldIm.value='4';nodes.worldSpeed.value='500';nodes.worldHistoryShape.value='cylinder';
let exported=null;
const sandbox={A0GameOfWorldsModel:model,LifeTemporalZ:temporal,A0SpatialReaderPrimitives:reader,Blob:class{constructor(parts){this.parts=parts}},URL:{createObjectURL:blob=>{exported=JSON.parse(blob.parts[0]);return'blob:test'},revokeObjectURL(){}},document:{hidden:false,body:element(),getElementById:id=>nodes[id],createElement:element,addEventListener:(type,fn)=>listeners[type]=fn},addEventListener(){},setTimeout:fn=>fn(),setInterval:fn=>{const id=nextTimer++;timers.set(id,fn);return id},clearInterval:id=>timers.delete(id)};
sandbox.window=sandbox;vm.runInNewContext(fs.readFileSync(__dirname+'/a0-game-of-worlds.js','utf8'),sandbox);
const ui=sandbox.A0GameOfWorlds;
ok(ui.snapshot().config.world==='life'&&ui.snapshot().cursor===0,'game starts ready, no autoplay');
ok(timers.size===0,'no automatic world evolution');
nodes.worldPlay.onclick();ok(timers.size===1,'explicit play');
[...timers.values()][0]();[...timers.values()][0]();
ok(ui.snapshot().cursor===2&&timers.size===0,'play reaches LIFE mission and pauses');
ok(nodes.worldAchievement.textContent.includes('ZIEL ERREICHT'),'mission visibly achieved');
nodes.worldHome.onclick();ok(ui.snapshot().cursor===0&&ui.snapshot().frames.length===3,'Return reads stored start without destroying history');
nodes.worldStep.onclick();ok(ui.snapshot().cursor===1&&ui.snapshot().frames.length===3,'forward Replay no duplicate frames');
const beforeView=JSON.stringify(ui.snapshot());nodes.worldHistoryShape.value='plate';nodes.worldHistoryShape.onchange();
nodes.worldHistory.onkeydown({key:'ArrowRight',preventDefault(){}});
ok(JSON.stringify(ui.snapshot())===beforeView,'view and camera cannot mutate simulation');
nodes.worldInspectX.value='0';nodes.worldInspectY.value='0';nodes.worldInspect.onclick();
ok(JSON.stringify(ui.snapshot())===beforeView&&nodes.worldAddress.textContent.includes('(0,0)'),'keyboard-address inspection does not mutate world');
nodes.worldPick.value='euler';nodes.worldPick.onchange();
ok(ui.snapshot().config.world==='life'&&nodes.worldPlay.disabled,'pending config neither resets nor plays wrong world');
nodes.worldNew.onclick();ok(ui.snapshot().config.world==='euler','explicit new-world start');
nodes.worldPlay.onclick();for(let i=0;i<4;i++)[...timers.values()][0]();
ok(ui.snapshot().cursor===4&&timers.size===0&&ui.replay().status==='PASS','Euler playable mission and Replay');
nodes.worldPick.value='fibonacci';nodes.worldPick.onchange();nodes.worldNew.onclick();
for(let i=0;i<7;i++)nodes.worldStep.onclick();
ok(ui.snapshot().frames[7].state.a==='13','Fibonacci playable mission');
nodes.worldReplayCheck.onclick();ok(nodes.worldReceipt.textContent.startsWith('PASS'),'actual Replay UI');
ok(nodes.worldJointReadout.textContent.includes('EXACT'),'source Joint participates in every rendered game step');
nodes.worldPlay.onclick();sandbox.document.hidden=true;listeners.visibilitychange();
ok(timers.size===0,'hidden game pauses, never advances unattended');
nodes.worldPick.value='euler';nodes.worldRe.value='99';nodes.worldNew.onclick();
ok(ui.snapshot().config.world==='fibonacci'&&nodes.worldError.textContent.includes('Euler'),'invalid reset preserves previous game');
nodes.worldExport.onclick();ok(exported?.config.world==='fibonacci'&&model.replay(exported).status==='PASS','export is a replayable actual active game, not pending controls');
for(const [i,p] of originals.entries())ok(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,p))).digest('hex')===pins[i],'original remained read-only '+p);
console.log(JSON.stringify({status:'PASS',checks,scope:'native LIFE reuse, exact equations, addressed views, missions, Replay integrity and actual game UI in simulated DOM; not browser pixel or Human utility acceptance'},null,2));
