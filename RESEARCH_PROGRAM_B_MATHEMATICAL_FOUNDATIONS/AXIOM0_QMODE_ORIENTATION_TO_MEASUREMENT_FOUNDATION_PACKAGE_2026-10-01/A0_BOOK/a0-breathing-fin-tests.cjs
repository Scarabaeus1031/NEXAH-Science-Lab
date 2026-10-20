const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./a0-breathing-fin.js'),chamber=require('./a0-shadow-chamber.js'),wiring=require('./a0-cell-pivot-wiring.js'),bridge=require('./a0-root-room-bridge.js');
for(const strength of [0,.6,1])for(let i=0;i<1000;i++){
  const b=model.breath(i/50,strength);assert.ok(b.width>=.75&&b.width<=1.25);assert.ok(b.height>=.96&&b.height<=1.04);assert.ok(b.opening>=0&&b.opening<=1);
  if(strength===0){assert.equal(b.width,1);assert.equal(b.height,1);assert.equal(b.bend,0);}
}
assert.throws(()=>model.breath(NaN));assert.throws(()=>model.breath(0,2));
class El{constructor(value=''){this.value=value;this.checked=true;this.textContent='';this.events={};}addEventListener(n,f){(this.events[n]??=[]).push(f);}fire(n){for(const f of this.events[n]??[])f();}}
const els=Object.fromEntries(['breathingFinControls','breathingFinEnabled','breathingFinContent','breathingFinStrength','breathingFinStrengthOut','breathingFinStatus','breathingFinReturn','chamberSequence','chamberStep','chamberPrevious','chamberNext'].map(id=>[id,new El()]));els.breathingFinContent.value='overlay';els.breathingFinStrength.value='.6';
let clock=0,reference=null,selected=0,redraws=0,flames=0,held;const state={ratio:'3:2',phaseDegrees:90,playing:true},fractal={c:[.26,0],iterations:120};
const view={get snapshot(){return{clock,signals:[Math.sin(3*clock),Math.cos(2*clock),Math.sin(clock+Math.PI/4)]};},get state(){return state;}};
const events={},window={A0BreathingFinModel:model,A0ThreeLissajousPlanesView:view,A0ShadowChamber:{get explanation(){return reference;}},A0CellPivotWiring:{get snapshot(){return{route:wiring.route(selected)};}},A0BluePinkDodecaCellReturnView:{refresh(){redraws++;}},A0FlameMandelbrotFormationView:{redrawFlame(){flames++;},state:fractal},addEventListener:(n,f)=>(events[n]??=[]).push(f),A0RootRoomPhaseBridge:{select(id){assert.equal(id,'RETURN');state.playing=false;held=bridge.makeReturn(fractal,state,view.snapshot,null,null,null,null,window.A0BreathingFin.snapshot);}}};
const source=fs.readFileSync('./a0-breathing-fin.js','utf8');assert.ok(!source.includes('requestAnimationFrame('));assert.ok(!source.includes('setInterval('));vm.runInNewContext(source,{window,document:{getElementById:id=>els[id]}});
const fin=window.A0BreathingFin,initial=fin.snapshot;assert.equal(initial.content.mode,'overlay');assert.equal(initial.breath.time,clock);
clock=.2;events['a0-lissajous-frame'][0]({detail:{clock}});assert.ok(redraws>1);const before=redraws;events['a0-lissajous-frame'][0]({detail:{clock}});assert.equal(redraws,before,'same signal time has no new repaint');
els.breathingFinContent.value='pi';els.breathingFinContent.fire('change');assert.equal(fin.snapshot.content.available,false);assert.match(els.breathingFinStatus.textContent,/Erklärteller/);
const seq=chamber.sequence(state,'dyadic');reference={...seq,index:9,selected:seq.steps[9]};els.chamberStep.fire('input');assert.equal(fin.snapshot.content.sequence.selected.factor,512);assert.equal(fin.snapshot.breath.time,.2,'reference time does not replace breath clock');
const calls=[],context=new Proxy({},{get(target,key){return key in target?target[key]:(...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg));calls.push([key,...args]);};}});
fin.renderFin(context,100,100,0,150,.1);fin.renderFlame(context,{width:300,height:330,layers:['axis','core','boundary','envelope'],observerSeed:'RETURN-00:F01',definitions:[{id:'axis',label:'AXIS',role:'reference'}]});
assert.equal(calls.filter(c=>c[0]==='clip').length,2);assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
els.breathingFinContent.value='cell';els.breathingFinContent.fire('change');selected=25;events['a0-cell-selection'][0]();assert.equal(fin.snapshot.content.selected,'PINK-01:F02');assert.equal(fin.snapshot.content.pivot,'RETURN-00:F02');
els.breathingFinStrength.value='0';els.breathingFinStrength.fire('input');assert.equal(fin.snapshot.breath.width,1);
els.breathingFinReturn.fire('click');assert.equal(state.playing,false);assert.equal(held.breathingFin.content.selected,'PINK-01:F02');assert.deepEqual(held.fractal.c,[.26,0]);
selected=0;els.breathingFinStrength.value='1';els.breathingFinStrength.fire('input');assert.equal(held.breathingFin.breath.strength,0);assert.equal(held.breathingFin.content.selected,'PINK-01:F02');
els.breathingFinEnabled.checked=false;els.breathingFinEnabled.fire('change');assert.equal(fin.enabled,false);assert.deepEqual(fractal,{c:[.26,0],iterations:120});
const html=fs.readFileSync('./A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8');assert.match(html,/redrawFlame:drawFlame/);assert.match(html,/drawLegacyFin/);for(const m of html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
els.breathingFinEnabled.checked=true;
const flameHook=html.split('\n').find(line=>line.includes('function drawFlame()')),clipCount=calls.filter(c=>c[0]==='clip').length;
vm.runInNewContext(flameHook+';drawFlame();',{window,fit:()=>[300,330],flame:{},fctx:context,activeLayers:new Set(['axis','core','boundary','envelope']),observerSeed:'RETURN-00:F01',lens:{LAYERS:[{id:'axis',label:'AXIS',role:'reference'}]}});
assert.equal(calls.filter(c=>c[0]==='clip').length,clipCount+1,'real formation renderer delegates only its flame drawing');
els.mandelbrotCanvas={width:400,height:400};let renderedSource=null;
Object.defineProperty(window.A0FlameMandelbrotFormationView,'mandelbrotSource',{get(){return renderedSource;}});
els.breathingFinContent.value='mandelbrot';els.breathingFinContent.fire('change');assert.equal(fin.snapshot.content.available,false);
renderedSource={c:[.26,0],iterations:120,width:400,height:400,cssHeight:200,viewport:{re:[-2.25,1],im:[-1.35,1.35]}};
fin.sourceRendered();assert.equal(fin.snapshot.content.available,true);assert.deepEqual(JSON.parse(JSON.stringify(fin.snapshot.content.cropPixels)),[0,0,400,300]);
fin.renderFin(context,100,100,0,150,0);const textureCall=calls.find(c=>c[0]==='drawImage');assert.equal(textureCall[1],els.mandelbrotCanvas);assert.deepEqual(textureCall.slice(2,6),[0,0,400,300]);assert.equal(textureCall.length,10);
els.breathingFinReturn.fire('click');const textureReturn=held.breathingFin;assert.equal(textureReturn.content.bitmapStoredInReturn,false);assert.deepEqual(textureReturn.content.renderedSource.c,[.26,0]);
renderedSource.c[0]=.3;assert.equal(textureReturn.content.renderedSource.c[0],.26,'Return preserves the rendered source, not a live reference');
const planeHook=html.split('\n').find(line=>line.includes('function drawPlane(')),testCanvas={width:400,height:400};
const testEnv={fit:()=>[200,200],document:{createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}})})},real:{value:'.26'},imag:{value:'0'},iterations:{value:'2'},signed:String,renderedMandelbrot:null,testCanvas,context};
vm.runInNewContext(planeHook+';drawPlane(testCanvas,context,"mandelbrot");',testEnv);assert.equal(testEnv.renderedMandelbrot.iterations,2);assert.deepEqual(Array.from(testEnv.renderedMandelbrot.c),[.26,0]);assert.equal(testEnv.renderedMandelbrot.cssHeight,200);
els.breathingFinContent.value='orbit';els.breathingFinContent.fire('change');assert.equal(fin.snapshot.content.available,false);
window.A0FlameMandelbrotFormationView.orbitSource={c:[.26,0],iterations:120,orbit:require('./assets/a0-flame-mandelbrot-formation-v1.js').criticalOrbit(.26,0,120)};
els.breathingFinContent.fire('change');assert.equal(fin.snapshot.content.available,true);assert.deepEqual(JSON.parse(JSON.stringify(fin.snapshot.content.points[0])),[0,0]);const orbitPaint=calls.length;fin.renderFin(context,100,100,0,150,0);assert.ok(calls.slice(orbitPaint).some(c=>c[0]==='lineTo'));els.breathingFinReturn.fire('click');assert.deepEqual(held.breathingFin.content.source.c,[.26,0]);window.A0FlameMandelbrotFormationView.orbitSource.c[0]=.4;assert.equal(held.breathingFin.content.source.c[0],.26);assert.deepEqual(fractal.c,[.26,0]);
console.log('PASS: 3000 breath samples, source-driven content including existing critical orbit, missing-source handling, clipping, renderer metadata, immutable Return and unchanged c');
window.A0FlameMandelbrotFormationView.orbitSource={c:[-.1087,0],iterations:120,orbit:require('./assets/a0-flame-mandelbrot-formation-v1.js').criticalOrbit(-.1087,0,120)};assert.equal(fin.snapshot.content.points.length,80);assert.equal(fin.snapshot.content.source.orbit.points.length,121);
