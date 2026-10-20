const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./a0-enjoy-loop.js'),bridge=require('./a0-root-room-bridge.js');
assert.equal(model.stages.length,38);assert.equal(model.position(model.cycleDuration).index,0);assert.equal(model.position(model.cycleDuration).cycle,1);assert.ok(Math.abs(model.delta(6.2,.02)-(2*Math.PI-6.18))<1e-12);assert.throws(()=>model.position(-1));
for(let n=0;n<640;n++){const p=model.position(n/10);assert.ok(p.opening>=.7&&p.opening<=1.2);assert.ok(p.strength>=.45&&p.strength<=.85);assert.ok(p.selected>=0&&p.selected<60);assert.ok(p.fill>=0&&p.fill<=60);assert.ok(p.c.every(Number.isFinite));}
class El{constructor(value='',type='select'){this.value=value;this.type=type;this.checked=false;this.events={};this.attrs={};}addEventListener(n,f){(this.events[n]??=[]).push(f);}dispatchEvent(e){for(const f of this.events[e.type]??[])f(e);}click(){this.dispatchEvent({type:'click'});}setAttribute(k,v){this.attrs[k]=v;}scrollIntoView(){this.scrolled=(this.scrolled??0)+1;}}
const ids=['enjoyLoopControls','enjoyLoopToggle','enjoyLoopRestart','enjoyLoopReturn','enjoyLoopStatus','enjoyLoopFlame','enjoyLoopFollow','breathingFinContent','breathingFinEnabled','breathingFinStrength','chamberShape','chamberOpening','chamberSequence','chamberStep','formation','shadowChamberInstrument','cells','orbitCanvas'],els=Object.fromEntries(ids.map(id=>[id,new El()]));
for(const id of ['enjoyLoopFlame','enjoyLoopFollow','breathingFinEnabled'])els[id].type='checkbox';els.enjoyLoopFollow.checked=true;els.breathingFinContent.value='mandelbrot';
for(const stage of model.stages)els[stage.target]??=new El();
let clock=0,playing=false,bodyPaused=false,calls=0,held;const poses=[],ratios=[],modes=[],phases=[],handler={},docHandlers={};
const doc={getElementById:id=>els[id],addEventListener:(n,f)=>(docHandlers[n]??=[]).push(f),hidden:false};
const view={get snapshot(){return{clock,signals:[0,1,0]};},get state(){return{ratio:ratios.at(-1)??'3:2',phaseDegrees:90,playing};},setRatio(value){ratios.push(value);emit();},setFocus(){emit();},setPhase(value){phases.push(value);emit();},setPlaying(value){playing=value;},refresh(){emit();}};
const body={pauseFill(){},setMotionPaused(value){bodyPaused=value;},setDemoPose(pose){poses.push({...pose});}};
const window={A0EnjoyLoopModel:model,A0ThreeLissajousPlanesView:view,A0BluePinkDodecaCellReturnView:body,A0FlameMandelbrotFormationView:{setParameter(...p){calls++;this.parameters=p;}},matchMedia:()=>({matches:false}),addEventListener:(n,f)=>(handler[n]??=[]).push(f),A0RootRoomPhaseBridge:{select(id){modes.push(id);if(id==='RETURN')held=bridge.makeReturn({c:[0,0],iterations:60},view.state,view.snapshot,null,null,null,null,null,window.A0EnjoyLoop.snapshot);emit();}}};
const readings=[];window.A0ShadowChamber={setReading(mode,angle){readings.push({mode,angle});emit();}};
const registers=[];window.A0RegisterOverlay={configure(mode,effect){registers.push({mode,effect});emit();}};
const flows=[];window.A0OneFlow={configure(mode,reach){flows.push({mode,reach});emit();}};
function emit(){for(const f of handler['a0-lissajous-frame']??[])f({detail:{clock}});}
const code=fs.readFileSync('./a0-enjoy-loop.js','utf8');assert.ok(!code.includes('requestAnimationFrame('));assert.ok(!code.includes('setInterval('));
vm.runInNewContext(code,{window,document:doc,Event:class{constructor(type){this.type=type;this.isTrusted=false;}}});
assert.equal(window.A0EnjoyLoop.snapshot.running,false);assert.equal(playing,false);
els.enjoyLoopToggle.click();assert.equal(window.A0EnjoyLoop.snapshot.running,true);assert.equal(playing,true);assert.equal(bodyPaused,true);
const visited=new Set(),frames=Math.ceil((model.cycleDuration*2+2)*10);for(let i=1;i<=frames;i++){clock=(i/10)%(2*Math.PI);emit();visited.add(window.A0EnjoyLoop.snapshot.position.index);}
assert.equal(visited.size,38);assert.equal(window.A0EnjoyLoop.snapshot.position.cycle,2);assert.ok(poses.some(p=>p.fill===60));assert.ok(poses.some(p=>p.selected===59));assert.ok(calls<frames/5,'fractal updates stay throttled');
for(const stage of model.stages)assert.ok(els[stage.target].scrolled>0,stage.target);
assert.ok(modes.includes('AM')&&modes.includes('VM')&&modes.includes('PM'));assert.ok(phases.includes(90)&&phases.includes(150)&&phases.includes(240));
for(const mode of ['cross','rotate','overlay','arc','sector','complement'])assert.ok(readings.some(r=>r.mode===mode));
assert.ok(readings.some(r=>r.mode==='rotate'&&r.angle>0&&r.angle<45));assert.ok(readings.some(r=>r.mode==='rotate'&&r.angle===45));
for(const effect of ['still','drift','wobble','opacity','combined'])assert.ok(registers.some(r=>r.mode==='tesa'&&r.effect===effect));assert.ok(registers.some(r=>r.mode==='eight'&&r.effect==='combined'));
for(const mode of ['contact','shells','plates','orbit','mobius','tesa','mobius-out','mobius-return','mobius-paired'])assert.ok(flows.some(f=>f.mode===mode));assert.ok(flows.some(f=>f.mode==='contact'&&f.reach===.68));assert.ok(flows.some(f=>f.mode==='contact'&&f.reach<.68));
// Every tour anchor must exist in the original HTML or one of its loaded renderers.
const sources=['A0_BLUE_PINK_DODECA_CELL_RETURN.html','a0-root-room-modes.js','a0-shadow-tracker.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');
for(const stage of model.stages)assert.ok(sources.includes(`id="${stage.target}"`)||sources.includes(`id='${stage.target}'`),`real anchor: ${stage.target}`);
const synthetic={isTrusted:false,target:{closest:()=>null}};for(const f of docHandlers.input)f(synthetic);assert.equal(window.A0EnjoyLoop.snapshot.running,true);
const trusted={isTrusted:true,target:{closest:()=>null}};for(const f of docHandlers.pointerdown)f(trusted);assert.equal(window.A0EnjoyLoop.snapshot.running,false);assert.equal(playing,false);const paused=window.A0EnjoyLoop.snapshot.elapsed;clock=(clock+.1)%(2*Math.PI);emit();assert.equal(window.A0EnjoyLoop.snapshot.elapsed,paused);
els.enjoyLoopToggle.click();assert.equal(playing,true);clock=(clock+.1)%(2*Math.PI);emit();assert.ok(window.A0EnjoyLoop.snapshot.elapsed>paused);
for(const f of docHandlers.wheel)f(trusted);assert.equal(playing,false);
els.enjoyLoopFlame.checked=true;els.enjoyLoopFlame.dispatchEvent({type:'change'});assert.equal(els.breathingFinContent.value,'flame');
els.enjoyLoopRestart.click();assert.equal(window.A0EnjoyLoop.snapshot.position.index,0);els.enjoyLoopReturn.click();assert.equal(playing,false);assert.equal(held.enjoyLoop.running,false);
els.enjoyLoopToggle.click();doc.hidden=true;for(const f of docHandlers.visibilitychange)f();assert.equal(window.A0EnjoyLoop.snapshot.running,false);
console.log('PASS: 38 stages and two full cycles; nine One Flow modes including 2x3 triads; six register handoffs; exact contact dwell; anchors, no timer, source-driven presets, trusted-input interruption, restart and Root Return');
