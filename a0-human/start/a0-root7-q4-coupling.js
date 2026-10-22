(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Root7Coupling=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='1.2.0',SCHEMA='nexah.a0.root7-q4-view/1';
const sections=typeof module==='object'&&module.exports?require('./a0-root7-section-mirror.js'):globalThis.A0Root7Sections;
const book=typeof module==='object'&&module.exports?require('./a0-root7-open-book.js'):globalThis.A0Root7Book;
const roots=[2,3,5,7],weights=[2,1,1,1];
const source='A0_SCIENTIFIC_POSITION_REPORT.html';
function coordinates(address){return weights.map((weight,bit)=>weight*((address>>bit)&1));}
function snapshot(state,core,mode='q4',viewOptions={},bookOptions={}){
  if(!core||typeof core.rootSpaceEngineFrame!=='function')throw new TypeError('source controller unavailable');
  if(!state||state.carrierId!=='MOD:TESSAREC'||state.artifactId!=='ART:TESSAREC:ROOT_SPACE_8_16')throw new TypeError('incompatible source carrier');
  if(!Number.isInteger(state.tick)||state.tick<0||state.tick>15||!Number.isInteger(state.cycles)||state.cycles<0||!Array.isArray(state.history))throw new TypeError('invalid source state');
  if(typeof state.running!=='boolean'||!Number.isInteger(state.speedMs)||state.speedMs<120)throw new TypeError('invalid source clock');
  if(!['q3','double','q4','mask'].includes(mode))throw new TypeError('invalid source view');
  const expected=core.rootSpaceEngineFrame(state.tick),frame=state.frame;
  for(const key of ['tick','q4Address','bits','layer','vertex','previousAddress','previousLayer','previousVertex','axis','transitionType','returned']){
    if(!frame||frame[key]!==expected[key])throw new TypeError('source frame mismatch: '+key);
  }
  const address=frame.q4Address,point=coordinates(address),bits=roots.map((_,bit)=>(address>>bit)&1);
  const last=state.history.at(-1);let transition=null;
  if(last){
    if(last.toTick!==state.tick||!Number.isInteger(last.fromTick)||last.fromTick<0||last.fromTick>15||![1,15].includes((last.toTick-last.fromTick+16)%16))throw new TypeError('history/frame mismatch');
    const from=core.rootSpaceEngineFrame(last.fromTick).q4Address,xor=from^address,axis=Math.log2(xor);
    if(!Number.isInteger(axis)||axis<0||axis>3||last.axis!==axis||last.bits!==frame.bits||last.q4Address!==address||last.transitionType!==(axis===3?'BRIDGE':'INTERNAL'))throw new TypeError('invalid source transition');
    transition={fromAddress:from,toAddress:address,axis,type:axis===3?'BRIDGE':'INTERNAL',metricStep:weights[axis]};
  }
  const normSquared=point.reduce((s,v)=>s+v*v,0);
  return{schema:SCHEMA,version:VERSION,status:'BOUND_VIEW',source:{carrierId:state.carrierId,artifactId:state.artifactId,controllerVersion:core.VERSION,tick:state.tick,cycles:state.cycles,running:state.running,speedMs:state.speedMs,mode,address,bits:frame.bits,layer:frame.layer,vertex:frame.vertex,activeNodeVisible:mode!=='q3'||frame.layer===0},encoding:{order:'printed bits b3 b2 b1 b0; fields below use b0 b1 b2 b3',rootLabels:roots.slice(),bitValues:bits,signs:bits.map(bit=>2*bit-1),metricWeights:weights.slice(),rule:'v=(2*b0,b1,b2,b3); sign_i=2*b_i-1; declared coding, not a field metric'},metric:{point,normSquared,norm:Math.sqrt(normSquared),referenceEndpoint:[2,1,1,1],referenceNormSquared:7,isReferenceEndpoint:address===15},sectionView:sections.snapshot(state.tick,frame.layer,viewOptions),bookView:book.snapshot(state.tick,frame.layer,bookOptions),pair:{partnerAddress:address^8,vertex:frame.vertex,matchingEdges:8,metricStep:1},transition,return:{decodedAddress:bits.reduce((s,bit,i)=>s+(bit<<i),0),addressExact:true,projectionInverseClaim:false},boundary:'Read-only view of source Q4 clock. Eight available bridge edges; Gray cycle uses two bridge transitions per 16 steps. No axis identification, physical dynamics, field norm or universal mechanism.'};
}
function drawing(record){
  if(!record||record.status!=='BOUND_VIEW')throw new TypeError('bound view required');
  const project=address=>{const [x,y,z,w]=coordinates(address);return[80+110*x+45*y+350*w,205-45*y-110*z+70*w];};
  const ln=(a,b,color,width=1,opacity=1,dash='')=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+color+'" stroke-width="'+width+'" opacity="'+opacity+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
  const tx=(x,y,label,color='#b9cbd4')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="13" font-family="ui-monospace,monospace">'+label+'</text>';
  let s='<title>Root7 Stretch-Einbettung desselben Q4-Zustands</title><desc>Zwei projizierte Quader, acht grüne Paarungen, aktiver Zustand und Referenzdiagonale. Bildabstände sind nicht metrisch kalibriert.</desc>';
  for(let a=0;a<16;a++)for(let bit=0;bit<4;bit++){
    const z=a^(1<<bit);if(a<z)s+=ln(project(a),project(z),bit===3?'#62dfa0':a<8?'#4ed8f2':'#efbd59',bit===3?1.3:1.8,bit===3?.22:.5);
  }
  s+=ln(project(0),project(15),'#a77dff',2,.6,'5 5');
  const current=record.source.address;
  s+=ln(project(current),project(current^8),'#62dfa0',3,.8,'3 4');
  if(record.transition)s+=ln(project(record.transition.fromAddress),project(current),record.transition.type==='BRIDGE'?'#62dfa0':'#f1698c',5,1);
  s+=ln(project(0),project(current),'#e7f0f4',2,.9);
  for(let a=0;a<16;a++){
    const p=project(a),active=a===current;
    s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(active?10:4)+'" fill="'+(active?'#fff':a<8?'#4ed8f2':'#efbd59')+'" stroke="'+(active?'#f1698c':'none')+'" stroke-width="3"/>';
    s+=tx(p[0]-18,p[1]+23,a.toString(2).padStart(4,'0'),active?'#fff':'#8ca5b3');
  }
  s+=tx(75,35,'w=0 / Blau / Vorzeichen √7: −','#4ed8f2')+tx(430,85,'w=1 / Gold / Vorzeichen √7: +','#efbd59');
  s+=tx(80,332,'Referenz O → 1111: √7 · aktuelle Strecke separat im Ledger','#a77dff');
  s+=tx(80,357,'Grün: vierter Kanal · Schritt 1; rosa: letzter interner Schritt','#62dfa0');
  return s;
}
function render(doc,state,core,mode){
  const panel=doc.getElementById('root7Coupling');if(!panel)return null;
  const put=(id,value)=>{const el=doc.getElementById(id);if(el)el.textContent=String(value);};
  try{
    const record=snapshot(state,core,mode,sections.readOptions(doc),book.readOptions(doc));
    panel.dataset.status=record.status;
    put('root7Source','TICK '+String(record.source.tick).padStart(2,'0')+' · '+record.source.bits+' · '+(record.source.running?'RUNNING':'PAUSED'));
    put('root7Signs',record.encoding.rootLabels.map((r,i)=>(record.encoding.signs[i]<0?'−':'+')+'√'+r).join(' · '));
    put('root7Point','('+record.metric.point.join(', ')+')');
    put('root7Length','√'+record.metric.normSquared+' = '+record.metric.norm.toFixed(4)+(record.metric.isReferenceEndpoint?' · ROOT7 TARGET':''));
    put('root7Transition',record.transition?(record.transition.type==='BRIDGE'?'Brücke w':'Interne Achse '+record.transition.axis)+' · Schritt '+record.transition.metricStep:'READY · noch kein Schritt');
    put('root7Return',record.return.decodedAddress+' ↔ '+record.source.address+' · ADDRESS RETURN EXACT');
    put('root7Visibility',record.source.activeNodeVisible?'Selbe Adresse wie im Q4-Graphen.':'Q3-Modus blendet die aktive Gold-Lage aus; Engine-Zustand bleibt erhalten.');
    doc.getElementById('root7StretchSvg').innerHTML=drawing(record);
    sections.render(doc,record);
    book.render(doc,record);
    return record;
  }catch(error){
    panel.dataset.status='HOLD';
    for(const id of ['root7Signs','root7Point','root7Length','root7Transition','root7Return'])put(id,'—');
    put('root7Source','HOLD · '+error.message);put('root7Visibility','Keine gültige Quellbindung; kein abgeleitetes Ergebnis.');
    doc.getElementById('root7StretchSvg').innerHTML='';
    for(const id of ['root7SectionSvg','root7SectionLedger','root7BookSvg','root7BookLedger','root7WingCutSvg']){const el=doc.getElementById(id);if(el){el.innerHTML='';el.textContent='HOLD';}}
    return null;
  }
}
return{VERSION,SCHEMA,source,coordinates,snapshot,drawing,render};
});
