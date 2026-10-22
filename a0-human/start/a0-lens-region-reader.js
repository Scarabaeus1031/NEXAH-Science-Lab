/* Source-bound display partition; no new clock or changes to the source record. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./a0-trinity-lens.js'):root.A0TrinityLens,node?require('./a0-layered-pentagon-scene.js'):root.A0LayeredPentagonScene);
 if(node)module.exports=api;else{root.A0LensRegionReader=api;root.A0LensRegionController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(T,S){
 'use strict';
 const MODES=['partition','intersection','differences'],copy=x=>JSON.parse(JSON.stringify(x)),sum=pieces=>pieces.reduce((a,p)=>a+S.area(p),0);
 function split(a,b){
  if(!a.length)return{intersection:[],outside:[]};
  if(!b.length)return{intersection:[],outside:[copy(a)]};
  return S.partition(a,b);
 }
 function reading(phase,settings,mode='partition'){
  if(!MODES.includes(mode))throw Error('Unknown region mode');
  const source=T.snapshot(phase,settings),a=source.contract.settings.left?source.left:[],b=source.contract.settings.right?source.right:[],ab=split(a,b),ba=split(b,a);
  const areas={A:S.area(a),B:S.area(b),intersection:S.area(ab.intersection),leftOnly:sum(ab.outside),rightOnly:sum(ba.outside)};
  const residual=Math.max(Math.abs(areas.A-areas.intersection-areas.leftOnly),Math.abs(areas.B-areas.intersection-areas.rightOnly));
  if(residual>1e-7)throw Error('Partition area accounting failed');
  return{schema:'a0.lens-region-reading/1',phase,settings:copy(source.contract.settings),mode,
   references:{A:source.left,B:source.right},regions:{intersection:ab.intersection,leftOnly:ab.outside,rightOnly:ba.outside},areas,residual,
   boundary:'Existing clipped polygon windows, not full circle disks. Areas in normalized coordinate units squared. Outside of A union B not drawn; no physical optics, source feedback, weights or overall Return. Role colours do not compute colour mixing.'};
 }
 function record(r){return{schema:'a0.lens-region-record/1',reading:copy(r),scope:'Recomputable local readout, not authenticated source history or a source Capture/Return.'};}
 function verify(value){try{const r=value.reading;return value.schema==='a0.lens-region-record/1'&&JSON.stringify(value)===JSON.stringify(record(reading(r.phase,r.settings,r.mode)));}catch{return false;}}
 function drawing(r){
  if(!verify(record(r)))throw Error('Region reading differs from source');
  const points=p=>p.map(([x,y])=>[200+120*x,150-120*y].join(',')).join(' ');
  const poly=(p,color,label)=>p.length?'<polygon points="'+points(p)+'" fill="'+color+'" fill-opacity=".55" stroke="'+color+'" data-region="'+label+'"/>':'';
  const showCut=r.mode!=='differences',showSides=r.mode!=='intersection';
  let svg='<svg viewBox="0 0 400 300" role="img" aria-label="Ausgewählte Bereiche desselben Linsen-Quellzustands"><title>Linse und andere Seite bei Phase '+r.phase+' Grad</title>';
  for(const [name,p]of Object.entries(r.references))svg+='<polygon points="'+points(p)+'" fill="none" stroke="currentColor" opacity=".4" stroke-dasharray="3 4" data-reference="'+name+'"/>';
  if(showSides){for(const p of r.regions.leftOnly)svg+=poly(p,'#e5b340','A-minus-B');for(const p of r.regions.rightOnly)svg+=poly(p,'#29c7ef','B-minus-A');}
  if(showCut)svg+=poly(r.regions.intersection,'#b783ff','A-intersection-B');
  return svg+'</svg>';
 }
 function mount(doc,win){
  const parent=doc.getElementById('benchLensReturn'),source=win.A0BenchLensReturnController;if(!parent||!source)return null;
  const host=doc.createElement('section');host.id='lensRegionReader';host.className='blr-region-reader';
  host.innerHTML='<h3>Linse ↔ andere Seite · mit derselben Quellphase</h3><label>Bereich <select data-lrr-mode><option value="partition">Drei Bereiche zusammen</option><option value="intersection">Nur Linse · A ∩ B</option><option value="differences">Nur andere Seiten · A ∖ B / B ∖ A</option></select></label><button type="button" data-lrr-capture>Lesestand halten</button><button type="button" data-lrr-export disabled>Gehaltenen Record exportieren</button><output data-lrr-status role="status"></output><div class="lrr-layout"><div data-lrr-drawing></div><div><p>Gold: A ∖ B · Lila: A ∩ B · Cyan: B ∖ A. Farben sind Rollenmarkierungen. Gestrichelt: unveränderte Referenzkonturen, auch bei deaktivierter Linse.</p><p data-lrr-areas></p><p>Auswahl ändert nur diese Lesart. Phase, A/B-Schalter und Quelle bleiben oben bedienbar. Der Zahlenanker/Return darunter ist weiterhin unabhängig. Außenraum nicht dargestellt; keine vollständigen Kreisscheiben oder elektromagnetische Spule.</p><p><a href="A0_MATHEMATICAL_JOINTS.html#register-cut-aperture">Mathfield · Quelle und andere Seite</a></p></div></div>';
  parent.querySelector('[data-blr-drawing]').after(host);
  const $=name=>host.querySelector('[data-lrr-'+name+']');let current=null,held=null;
  function refresh(){
   try{const state=source.state;current=reading(state.phase,state.settings,$('mode').value||'partition');
    $('drawing').innerHTML=drawing(current);const a=current.areas;
    $('areas').textContent='A='+a.A.toFixed(5)+' · B='+a.B.toFixed(5)+' · A∩B='+a.intersection.toFixed(5)+' · A∖B='+a.leftOnly.toFixed(5)+' · B∖A='+a.rightOnly.toFixed(5)+' · Flächenbilanz Δ='+current.residual.toExponential(1)+' (normierte Einheiten²)';
    $('status').textContent='LIVE-LESART · gleiche Phase '+current.phase+'° · A '+(current.settings.left?'an':'aus')+' / B '+(current.settings.right?'an':'aus')+' · '+(held?'gehaltener Export bleibt separat':'noch kein gehaltener Record');
   }catch(error){current=null;$('drawing').innerHTML='';$('areas').textContent='';$('status').textContent='HOLD · '+error.message;}
  }
  $('mode').addEventListener('change',refresh);
  $('capture').addEventListener('click',()=>{if(!current)return;held=record(current);$('export').disabled=false;refresh();});
  $('export').addEventListener('click',()=>{if(!held||!verify(held))return;const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(held,null,2)],{type:'application/json'})),link=doc.createElement('a');link.href=url;link.download='a0-lens-region-record.json';link.click();win.URL.revokeObjectURL(url);});
  const unsubscribe=source.subscribeReading(refresh);refresh();
  return{refresh,get snapshot(){return current?copy(current):null;},get held(){return held?copy(held):null;},dispose(){unsubscribe();}};
 }
 return{MODES,split,reading,record,verify,drawing,mount};
});
