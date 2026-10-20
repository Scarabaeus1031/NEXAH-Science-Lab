'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('./a0-shared-measurement.js'),F=require('./a0-one-flow.js'),C=require('./a0-shadow-chamber.js');
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m);},eq=(a,b)=>{checks++;assert.deepEqual(a,b);},near=(a,b)=>ok(Math.abs(a-b)<1e-10);
const html=fs.readFileSync(__dirname+'/A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8'),code=fs.readFileSync(__dirname+'/a0-shared-measurement.js','utf8');
const nativeValues=html.match(/function values\(t\)\{[^\n]+\}/)[0];
const sandbox={ratioControl:{value:'3:2'},phaseControl:{value:'90'},Math,Number};vm.createContext(sandbox);vm.runInContext(nativeValues,sandbox);
const signals=t=>Array.from(sandbox.values(t));
let frames=0;
for(const shape of ['open','kite','square','rose'])for(const opening of [.4,1,1.4])for(let tick=0;tick<=180;tick++){
  const t=tick*Math.PI/90,source={clock:t,signals:signals(t)},before=JSON.stringify(source),r=M.reading(source,{shape,opening}),native=C.observe(source,{shape,opening});frames++;
  eq(JSON.stringify(source),before);eq(r.time,t);eq(r.rows.length,3);ok(M.verify(M.record(r)));
  r.rows.forEach((row,i)=>{
    eq(row.point,native.views[i].platePoint);eq(row.referenceCell,F.mapping(source.signals).points[i].cell);eq(row.admitted,native.views[i].admitted);
    eq(row.outputCell,row.admitted?row.referenceCell:null);eq(row.weight,null);ok(row.referenceCell.address>=1&&row.referenceCell.address<=28);
    eq(row.shadow,[row.point[0],0]);eq(row.projection.hit[1],-2.3);
    const p=row.projection;near(p.hit[0],p.observer[0]+p.lambda*(row.point[0]-p.observer[0]));near(p.hit[1],p.observer[1]+p.lambda*(row.point[1]-p.observer[1]));ok(p.lambda>0&&p.lambda<1);
  });
}
const r=M.reading({clock:0,signals:[1,1,1]},{shape:'square',opening:.4});ok(r.rows.every(row=>!row.admitted&&row.outputCell===null&&row.referenceCell));
const rec=M.record(r);for(const mutate of [v=>v.reading.time=-1,v=>v.reading.rows[0].weight=1,v=>v.reading.rows[0].referenceCell.address=29,v=>v.reading.rows[0].projection.hit[0]=12,v=>v.extra=true]){const bad=structuredClone(rec);mutate(bad);ok(!M.verify(bad));}
for(const source of [{clock:-1,signals:[0,0,0]},{clock:0,signals:[0,Infinity,0]},{clock:0,signals:[2,0,0]},{clock:0,signals:[0,0]}]){checks++;assert.throws(()=>M.reading(source,{shape:'open',opening:1}));}
const nodes=new Map(),events=new Map();for(const id of ['sharedMeasurement','sharedMeasurementDrawing','sharedMeasurementStatus','sharedMeasurementRows','sharedMeasurementRegisters','sharedMeasurementCapture','sharedMeasurementExport','sharedMeasurementRecord','chamberShape','chamberOpening','registerMode','registerEffect'])nodes.set(id,{events:{},addEventListener(k,f){this.events[k]=f;}});
let time=1,shape='open',opening=1,samples=0,downloads=0,blobText='',revoked=0;
const sourceView={get snapshot(){return{clock:time,signals:signals(time)};},get state(){return{ratio:'3:2',phaseDegrees:90,playing:true};},sample(t){samples++;return signals(t);}};
const win={A0ThreeLissajousPlanesView:sourceView,A0ShadowChamber:{get reading(){return{current:{aperture:{shape,opening}}};}},A0RegisterOverlay:{get snapshot(){return{sourceClock:time,pose:{layers:[{name:'A',dx:2,dy:1,opacity:.4},{name:'B',dx:-2,dy:-1,opacity:.6}]}};}},addEventListener(k,f){events.set(k,f);},URL:{createObjectURL(){return'blob:test';},revokeObjectURL(){revoked++;}},Blob:class{constructor(parts){blobText=parts.join('');}}};
const doc={getElementById:id=>nodes.get(id),createElement(tag){eq(tag,'a');return{click(){downloads++;}};}};
const lens=M.mount(doc,win);ok(lens.readOnly);eq(lens.current.time,1);eq(samples,181);ok(nodes.get('sharedMeasurementRegisters').textContent.includes('kein Gewicht'));
nodes.get('sharedMeasurementCapture').events.click();const held=lens.held;ok(M.verify(held));eq(held.reading.time,1);
time=2;events.get('a0-lissajous-frame')();eq(lens.current.time,2);eq(lens.held,held);eq(sourceView.state.playing,true);
shape='square';opening=.4;nodes.get('chamberOpening').events.input();eq(lens.current.aperture,{shape,opening});
nodes.get('sharedMeasurementExport').events.click();eq(JSON.parse(blobText),held);eq(downloads,1);eq(revoked,1);
time=NaN;events.get('a0-lissajous-frame')();eq(lens.current,null);ok(nodes.get('sharedMeasurementStatus').textContent.startsWith('HOLD'));eq(nodes.get('sharedMeasurementRows').textContent,'');
eq(M.mount({getElementById:()=>null},{}),null);
ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage|contentDocument|setPlaying|\.setPhase|\.setRatio/.test(code),'no clock, cross-window access or source commands');
ok(html.includes('sample:time=>'));ok(html.includes('id="sharedMeasurement"'));ok(html.indexOf('a0-shared-measurement.js')>html.indexOf('a0-flow-grid.js'));
let parsed=0;for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g))if(!/src=/.test(match[1])&&match[2].trim()){new Function(match[2]);parsed++;}ok(parsed>0);
const svg=M.drawing(r);eq((svg.match(/<rect /g)||[]).length,28);ok(svg.includes('OBSERVER'));ok(svg.includes('28 Adressen'));
console.log(JSON.stringify({status:'PASS',checks,frames,inlineScriptsParsed:parsed,browserAcceptance:false,scope:'native signal sampler, existing aperture/address models, projection collinearity, records, actual read-only mount events and no-timer/source-write guard'}));
