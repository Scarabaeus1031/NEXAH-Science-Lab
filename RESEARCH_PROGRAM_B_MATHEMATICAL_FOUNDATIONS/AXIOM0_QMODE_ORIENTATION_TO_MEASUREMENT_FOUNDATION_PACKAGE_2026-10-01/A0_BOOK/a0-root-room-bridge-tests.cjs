const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {phases,projectSignals,makeReturn}=require('./a0-root-room-bridge.js');
assert.deepEqual(phases.map(item=>item.id),['AM','VM','PM','RETURN']);
assert.deepEqual(projectSignals([.5,-.75,1]),[
  {plane:'AM',point:[.5,-.75],shadow:[.5,0]},
  {plane:'VM',point:[-.75,1],shadow:[-.75,0]},
  {plane:'PM',point:[1,.5],shadow:[1,0]}
]);
assert.throws(()=>projectSignals([1,2]));assert.throws(()=>projectSignals([1,NaN,3]));
const fractal={c:[-.1087,0],iterations:120,observerSeed:'RETURN-00:F01'},liss={ratio:'3:2',phaseDegrees:90},snapshot={clock:.25,signals:[.1,.2,.3]};
const record=makeReturn(fractal,liss,snapshot);
assert.equal(record.lissajous.views.length,3);assert.equal(record.fractal.operator,'z_(n+1)=z_n^2+c');
assert.match(record.relation,/no automatic map/);assert.match(record.relation,/no seam equality/);
fractal.c[0]=0;assert.equal(record.fractal.c[0],-.1087,'Record retains independent parameter copy');
const html=fs.readFileSync(path.join(__dirname,'A0_BLUE_PINK_DODECA_CELL_RETURN.html'),'utf8');
for(const match of html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
assert.match(html,/marker\(item\.plane\.projection,item\.x,item\.y,paneW,paneH,color,true\)/);
assert.match(html,/setFocus:value/);assert.match(html,/get snapshot/);assert.match(html,/a0-root-room-bridge\.js/);
const script=fs.readFileSync(path.join(__dirname,'a0-root-room-bridge.js'),'utf8');
class El{constructor(){this.children=[];this.events={};this.dataset={};this.attrs={};}append(...items){this.children.push(...items);}after(item){this.afterItem=item;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.events[k]=v;}querySelector(){return this.header||(this.header=new El());}}
const root=new El(),planes=new El(),eventHandlers={};let playing=true,focus='ALL';
const view={setFocus:value=>{focus=value;},setPlaying:value=>{playing=value;},state:liss,snapshot};let performanceStops=0;const performanceState={position:{step:59},interior:{frame:{source:{sourceKey:'P2:1100'}},receipt:{status:'HOLD_MISSING_WITNESS'}}};
vm.runInNewContext(script,{document:{getElementById:id=>id==='rootRoom'?root:planes,createElement:()=>new El()},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},window:{A0ThreeLissajousPlanesView:view,A0FlameMandelbrotFormationView:{state:fractal},A0CellReturnPerformance:{stop(){performanceStops++;},get snapshot(){return JSON.parse(JSON.stringify(performanceState));}},addEventListener:(key,fn)=>{eventHandlers[key]=fn;},dispatchEvent:event=>eventHandlers[event.type]?.(event)}});
assert.equal(root.children[0],planes,'Reuses and integrates existing live instrument');
assert.equal(focus,'AM_PLANE');const bridge=root.header.afterItem,nav=bridge.children[2];
nav.children[1].events.click();assert.equal(focus,'VM_PLANE');
nav.children[2].events.click();assert.equal(focus,'PM_PLANE');
nav.children[3].events.click();assert.equal(focus,'RETURN');assert.equal(playing,false);
const held=JSON.parse(bridge.children[6].children[1].textContent);assert.equal(held.lissajous.time,.25);assert.equal(held.lissajous.views.length,3);
assert.equal(performanceStops,1);assert.equal(held.cellReturnPerformance.position.step,59);assert.equal(held.cellReturnPerformance.interior.receipt.status,'HOLD_MISSING_WITNESS');performanceState.position.step=0;assert.equal(held.cellReturnPerformance.position.step,59);
nav.children[4].events.click();assert.equal(focus,'ALL');assert.equal(playing,false,'Does not silently restart a held return');
eventHandlers['a0-lissajous-frame']({detail:snapshot});assert.match(bridge.children[4].textContent,/AM:/);
console.log('PASS: three planes + three coordinate shadows, AM/VM/PM focus, held return, no automatic c-to-signal mapping');
