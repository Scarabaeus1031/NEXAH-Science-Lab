(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./a0-orientation-controller-bench.js'):root.A0OrientationController,typeof module==='object'&&module.exports?require('./a0-mask-observer.js'):root.A0MaskObserver);
 if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0PascalAperture=api;root.A0PascalApertureController=api.mount(root.document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(C,M){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x)),key=p=>[p.i,p.j,p.k,p.sigma].join(':'),sort=a=>a.slice().sort((a,b)=>key(a).localeCompare(key(b))),EPS=1e-8;
 function validateSource(s){
  if(!s||![7,8,17,19,29].includes(s.sides)||!['algo','pentagon','caro'].includes(s.lens)||!['shadow','signed','body'].includes(s.exterior))throw Error('invalid Pascal source');
  const layer=C.trinomialLayer(s.depth);
  if(!Array.isArray(s.points)||s.points.length!==layer.length||JSON.stringify(s.envelope)!==JSON.stringify([[220,28],[35,315],[405,315]]))throw Error('source contour mismatch');
  for(let t=0;t<layer.length;t++){
   const p=s.points[t],a=layer[t],x=s.depth?(a.i*220+a.j*35+a.k*405)/s.depth:220,y=s.depth?(a.i*28+a.j*315+a.k*315)/s.depth:175;
   if(['i','j','k','multiplicity'].some(k=>p[k]!==a[k])||!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x-x)>EPS||Math.abs(p.y-y)>EPS)throw Error('source point mismatch');
  }
  if(!s.selected||s.selected.sigma!==1||!layer.some(p=>p.i===s.selected.i&&p.j===s.selected.j&&p.k===s.selected.k))throw Error('invalid source selection');
  return copy(s);
 }
 function options(o={}){
  const out={shape:o.shape??'triangle',scale:o.scale??.6,folded:o.folded??false,keepResidual:o.keepResidual??true};
  if(!['triangle','square'].includes(out.shape)||!Number.isFinite(out.scale)||out.scale<.25||out.scale>1||typeof out.folded!=='boolean'||typeof out.keepResidual!=='boolean')throw Error('invalid aperture options');
  return out;
 }
 function aperture(source,o){
  const base=o.shape==='triangle'?source.envelope:M.frame({...M.DEFAULT,kind:'square',dx:0,dy:0,angle:0,amplitude:0,phase:0,fold:false},0).a.map(([x,y])=>[220+185*x,175-185*y]);
  return base.map(([x,y])=>[220+(x-220)*o.scale,175+(y-175)*o.scale]);
 }
 function inside([x,y],poly){
  let positive=false,negative=false;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],v=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);if(v>EPS)positive=true;if(v<-EPS)negative=true;}
  return !(positive&&negative);
 }
 function reconstruct(observation,residual=[]){
  try{
   const {depth,folded,visible}=observation,layer=C.trinomialLayer(depth);
   if(typeof folded!=='boolean'||!Array.isArray(visible)||!Array.isArray(residual))throw Error('invalid observation');
   const entries=[...visible,...residual],seen=new Set(),states=[];
   for(const e of entries){
    if(!e||![1,-1].includes(e.sigma)||!layer.some(p=>p.i===e.i&&p.j===e.j&&p.k===e.k&&p.multiplicity===e.multiplicity))throw Error('invalid oriented entry');
    const id=key(e);if(seen.has(id))throw Error('duplicate oriented entry');seen.add(id);
    const q=folded?C.antipodePascal(e):e;states.push({i:q.i,j:q.j,k:q.k,sigma:q.sigma,multiplicity:e.multiplicity});
   }
   return {status:states.length===2*layer.length?'PASS':'HOLD',states:sort(states),missing:2*layer.length-states.length,scope:'EXPLICIT_MACRO_RECORD_REASSEMBLY_NOT_PIXEL_INVERSE'};
  }catch(e){return {status:'INVALID',reason:e.message};}
 }
 function snapshot(input,opt={}){
  const source=validateSource(input),o=options(opt),gate=aperture(source,o),lookup=new Map(source.points.map(p=>[[p.i,p.j,p.k].join(':'),p])),sheets=[],visible=[],hidden=[];
  for(const sigma of [1,-1]){
   const nodes=source.points.map(p=>{
    const original={i:p.i,j:p.j,k:p.k,sigma},d=o.folded?C.antipodePascal(original):original,q=lookup.get([d.i,d.j,d.k].join(':')),entry={...d,multiplicity:p.multiplicity},admitted=inside([q.x,q.y],gate);
    (admitted?visible:hidden).push(entry);
    return {entry,point:[q.x,q.y],admitted,selected:p.i===source.selected.i&&p.j===source.selected.j&&p.k===source.selected.k};
   });
   sheets.push({sourceSigma:sigma,displaySigma:o.folded?-sigma:sigma,nodes});
  }
  const observation={depth:source.depth,folded:o.folded,visible},residual=o.keepResidual?hidden:[],returned=reconstruct(observation,residual);
  return {schema:'a0.pascal-aperture-bridge/1',source,options:o,gate,sheets,observation,residual,returned,
    ledger:{sourceMacroEntries:visible.length+hidden.length,visible:visible.length,hidden:hidden.length,storedResidual:residual.length,retainedMassPerSheet:3**source.depth,hiddenIsNotDeleted:true},
    shadow:{plus:C.shadowGonProjection(source.depth,source.sides,1),minus:C.shadowGonProjection(source.depth,source.sides,-1),scope:'NATIVE_FULL_LAYER_SHADOW_BEFORE_APERTURE'},
    boundary:'New source-bound view over unchanged Pascal/mask operators. Two orientations, not two independent carriers. Aperture scale is declared display geometry; Return requires explicit hidden records and sign. No microhistory recovery, optical law, connected origami, E8 specificity or whole-machine Return.'};
 }
 function verify(r){try{return {status:JSON.stringify(snapshot(r.source,r.options))===JSON.stringify(r)?'PASS':'INVALID'};}catch{return {status:'INVALID'};}}
 function drawing(r){
  if(verify(r).status!=='PASS')throw Error('invalid bridge record');
  let s='<svg viewBox="0 0 1380 440" role="img" aria-label="Zwei Pascal-Schichten, Apertur und unverändertes Shadow-Polygon"><title>Pascal-Schichten und Aperturausschnitt</title><rect width="1380" height="440" fill="#061722"/>';
  const txt=(x,y,t,color='#dcecf4')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="15" font-family="system-ui,sans-serif">'+t+'</text>',poly=p=>p.map(q=>q.join(',')).join(' ');
  r.sheets.forEach((sheet,i)=>{
   s+='<g transform="translate('+(i*460)+',45)">';
   s+=txt(20,-15,'QUELLSCHICHT '+(sheet.sourceSigma>0?'+':'−')+' · '+(r.options.folded?'A → ':'I → ')+(sheet.displaySigma>0?'+':'−'));
   s+='<polygon points="'+poly(r.source.envelope)+'" fill="none" stroke="#557485"/>';
   for(const node of sheet.nodes){const[x,y]=node.point,col=sheet.displaySigma>0?'#54d7ef':'#e976ce';s+='<circle cx="'+x+'" cy="'+y+'" r="'+(node.selected?8:4)+'" fill="'+(node.admitted?col:'#687681')+'" opacity="'+(node.admitted?1:.3)+'"/>';if(node.selected)s+='<circle cx="'+x+'" cy="'+y+'" r="12" fill="none" stroke="#efbd55"/>';}
   s+='<polygon points="'+poly(r.gate)+'" fill="none" stroke="#efbd55" stroke-width="2"/>';
   s+=txt(15,365,sheet.nodes.filter(p=>p.admitted).length+' sichtbar / '+sheet.nodes.length+' Makroeinträge')+'</g>';
  });
  const proj=r.shadow.plus,m=proj.sides,points=proj.normalized.map((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/m;return[1145+(28+108*v)*Math.cos(a),220+(28+108*v)*Math.sin(a)];});
  s+=txt(940,30,'NATIVER C'+m+'-SHADOW · VOR DER APERTUR');
  s+='<polygon points="'+poly(Array.from({length:m},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/m;return[1145+145*Math.cos(a),220+145*Math.sin(a)];}))+'" fill="none" stroke="#557485"/>';
  s+='<polygon points="'+poly(points)+'" fill="#54d7ef" fill-opacity=".1" stroke="#54d7ef" stroke-width="2"/>';
  const neg=r.shadow.minus.normalized.map((v,i)=>{const a=-Math.PI/2+i*2*Math.PI/m;return[1145+(28+108*v)*Math.cos(a),220+(28+108*v)*Math.sin(a)];});
  s+='<polygon points="'+poly(neg)+'" fill="none" stroke="#e976ce" stroke-dasharray="5 5"/>';
  s+=txt(940,410,'σ+ / σ− können hier zusammenfallen.');
  return s+'</svg>';
 }
 function mount(doc,win){
  const el=id=>doc.getElementById(id);if(!el('pascalApertureBridge'))return null;
  let latest=null,anchor=null,folded=false;
  const readOptions=()=>({shape:el('pabShape').value,scale:Number(el('pabScale').value)/100,folded,keepResidual:el('pabResidual').checked});
  function render(source=win.A0PascalSource?.read()){
   if(!source){latest=null;el('pabStatus').textContent='HOLD · Pascal-Quelle fehlt';return;}
   latest=snapshot(source,readOptions());el('pabDrawing').innerHTML=drawing(latest);el('pabScaleOut').textContent=Math.round(latest.options.scale*100)+'%';
   el('pabStatus').textContent='n='+source.depth+' · 1+1 Orientierungen · '+(folded?'A ANGEWENDET':'QUELLANSICHT')+' · Record-Return '+latest.returned.status;
   el('pabLedger').textContent='Erhalten: '+latest.ledger.sourceMacroEntries+' Makroeinträge · sichtbar '+latest.ledger.visible+' · verdeckt '+latest.ledger.hidden+' · im Rest gespeichert '+latest.ledger.storedResidual+'. Ohne ausreichenden Rest: HOLD, keine erfundene Rekonstruktion.';
   el('pabReturn').disabled=!anchor;return latest;
  }
  for(const id of ['pabShape','pabResidual'])el(id).addEventListener('change',()=>render());
  el('pabScale').addEventListener('input',()=>render());el('pabFold').addEventListener('click',()=>{folded=!folded;render();});
  el('pabCapture').addEventListener('click',()=>{try{const source=win.A0PascalSource.capture();anchor={source:copy(source),options:readOptions()};render(source);el('pabStatus').textContent+=' · QUELLANKER GESPEICHERT';}catch(e){el('pabStatus').textContent='HOLD · '+e.message;}});
  el('pabReturn').addEventListener('click',()=>{if(!anchor)return;try{const o=anchor.options;el('pabShape').value=o.shape;el('pabScale').value=String(o.scale*100);el('pabResidual').checked=o.keepResidual;folded=o.folded;const returned=win.A0PascalSource.restore(copy(anchor.source));render(returned);el('pabStatus').textContent+=' · '+(JSON.stringify(returned)===JSON.stringify(anchor.source)?'QUELLRETURN EXAKT':'HOLD · QUELLRETURN ABWEICHUNG');}catch(e){el('pabStatus').textContent='HOLD · '+e.message;}});
  el('pabExport').addEventListener('click',()=>{render();if(!latest)return;const payload={view:latest,checkpoint:copy(anchor),returnScope:'SAVED_PASCAL_SELECTION_AND_LOCAL_VIEW_ONLY'},url=win.URL.createObjectURL(new win.Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-pascal-aperture-record.json';a.click();win.URL.revokeObjectURL(url);});
  render();return {sourceChanged:render,record:()=>copy(latest)};
 }
 return {validateSource,options,aperture,inside,reconstruct,snapshot,verify,drawing,mount};
});
