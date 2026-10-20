const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./a0-cell-pivot-wiring.js'),cells=require('./assets/a0-blue-pink-dodeca-cell-return-v1.js'),h3=require('./assets/a0-blue-body-dodeca-countershot-v1.js'),bridge=require('./a0-root-room-bridge.js');
for(let shift=0;shift<12;shift++)for(let selected=0;selected<60;selected++){
  const r=model.route(selected,shift);assert.equal(r.linkedIndices.length,5);assert.equal(new Set(r.linkedIndices).size,5);assert.equal(r.edges.length,4);
  assert.equal(r.selected.id,cells.cellAt(selected).cell_id);assert.equal(r.pivot.id,cells.cellAt(r.pivot.index).cell_id);
  if(selected<48)assert.equal(model.recover(r.pivot.index,Math.floor(selected/12),shift).index,selected);
  else{assert.equal(r.origin,null);assert.equal(r.pivot.index,selected);assert.equal(r.sources.length,4);}
}
assert.throws(()=>model.route(60));assert.throws(()=>model.route(1,12));assert.throws(()=>model.recover(1,0));
class El{
  constructor(){this.value='';this.checked=false;this.events={};this.attrs={};this.dataset={};this.clientWidth=800;this.clientHeight=760;this.classList={toggle(){},add(){},remove(){}};}
  addEventListener(n,f){(this.events[n]??=[]).push(f);}fire(n,event={}){for(const f of this.events[n]??[])f(event);}setAttribute(k,v){this.attrs[k]=v;}getContext(){return context;}setPointerCapture(){}hasPointerCapture(){return false;}getBoundingClientRect(){return{left:0,top:0};}
}
const context=new Proxy({createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})},{get(target,key){return key in target?target[key]:()=>{};}});
const els={},$=id=>els[id]??(els[id]=new El()),dots=Array.from({length:60},(_,i)=>{const e=new El();e.dataset.index=String(i);return e;});
Object.entries({projectionMode:'orbit',angleRange:'42',fillRange:'60',breathRange:'1',pivotWiringShift:'0'}).forEach(([id,v])=>$(id).value=v);$('pivotWiringEnabled').checked=true;
const events={};let interval=null;
const window={A0BlueBodyDodecaCountershot:h3,A0BluePinkDodecaCellReturn:cells,A0CellPivotWiringModel:model,addEventListener:(n,f)=>(events[n]??=[]).push(f),dispatchEvent:e=>{for(const f of events[e.type]??[])f(e);}};
const sandbox={window,document:{getElementById:$,querySelectorAll:()=>dots},performance:{now:()=>0},devicePixelRatio:1,matchMedia:()=>({matches:true}),ResizeObserver:class{observe(){}},requestAnimationFrame:()=>1,setInterval:fn=>{interval=fn;return 1;},clearInterval:()=>{interval=null;},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},Date};
const html=fs.readFileSync('./A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8'),renderer=[...html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g)].find(m=>m[1].includes('const h3=window.A0BlueBodyDodecaCountershot'))[1];
const ctx=vm.createContext(sandbox);vm.runInContext(renderer,ctx);
const code=fs.readFileSync('./a0-cell-pivot-wiring.js','utf8');assert.ok(!code.includes('setInterval('));assert.ok(!code.includes('requestAnimationFrame('));vm.runInContext(code,ctx);
assert.equal(window.A0CellPivotWiring.snapshot.counts.total,60);assert.equal(window.A0CellPivotWiring.snapshot.route.pivot.index,48);
$('playFill').fire('click');assert.ok(interval);assert.equal(window.A0BluePinkDodecaCellReturnView.state.selected,0);
for(let i=0;i<60;i++)interval?.();assert.equal(interval,null);assert.equal(window.A0BluePinkDodecaCellReturnView.state.fill,60);assert.equal(window.A0BluePinkDodecaCellReturnView.state.selected,59);
const trail=window.A0CellPivotWiring.snapshot.trail;assert.ok(trail.some(p=>p.source?.id==='BLUE-01:F01'));assert.ok(trail.some(p=>p.source?.id==='PINK-02:F12'));assert.equal(trail.at(-1).selected.id,'RETURN-00:F12');assert.equal(trail.at(-1).sourceCandidates.length,4);
window.A0BluePinkDodecaCellReturnView.selectCell(13);assert.equal(window.A0CellPivotWiring.snapshot.route.origin.id,'BLUE-02:F02');assert.ok(window.A0CellPivotWiring.isLinked(49,13));
$('pivotWiringShift').value='3';$('pivotWiringShift').fire('change');assert.equal(window.A0CellPivotWiring.snapshot.route.pivot.index,52);assert.equal(window.A0CellPivotWiring.snapshot.trail.length,1);
$('pivotWiringHold').fire('click');const held=JSON.parse($('pivotWiringRecord').textContent);assert.equal(held.route.origin.id,'BLUE-02:F02');assert.equal(held.route.pivot.id,'RETURN-00:F05');
window.A0BluePinkDodecaCellReturnView.selectCell(25);assert.equal(held.route.origin.id,'BLUE-02:F02');assert.equal(window.A0CellPivotWiring.snapshot.route.origin.id,'PINK-01:F02');
const rootReturn=bridge.makeReturn({c:[0,0],iterations:10},{ratio:'3:2',phaseDegrees:90},{clock:0,signals:[0,1,0]},null,null,null,window.A0CellPivotWiring.snapshot);assert.equal(rootReturn.cellPivotWiring.route.origin.id,'PINK-01:F02');
$('pivotWiringClear').fire('click');assert.equal(window.A0CellPivotWiring.snapshot.trail.length,0);$('pivotWiringEnabled').checked=false;$('pivotWiringEnabled').fire('change');assert.equal(window.A0CellPivotWiring.isLinked(25,25),false);
assert.match(html,/type="button" class="cell-dot/);assert.match(html,/for\(const\[faceIndex,face\]of dodeca.faces.entries\(\)\)/);
let finDraws=0;window.A0BreathingFin={enabled:true,renderFin(){finDraws++;}};window.A0BluePinkDodecaCellReturnView.refresh();assert.ok(finDraws>0);const finBefore=finDraws;$('finToggle').fire('click');assert.equal(finDraws,finBefore,'existing fin-off switch also hides breathing contents');
console.log('PASS: 720 declared routes, 576 source-aware inverse checks; real original canvas renderer and 60-step Play cell return; shadow hooks, shift, ambiguity, retained provenance, hold/clear/toggle and Root Room record');
