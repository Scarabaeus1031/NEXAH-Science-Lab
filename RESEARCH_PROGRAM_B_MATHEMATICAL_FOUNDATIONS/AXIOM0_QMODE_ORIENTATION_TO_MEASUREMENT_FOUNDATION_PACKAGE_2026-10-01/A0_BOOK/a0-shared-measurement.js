/* Read-only lens inside the native source document. No timer or cross-window access. */
(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-one-flow.js'):root.A0OneFlowModel,node?require('./a0-shadow-chamber.js'):root.A0ShadowChamberModel);
  if(node)module.exports=api;else{root.A0SharedMeasurement=api;api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(F,C){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x)),colors=['#ffd36a','#29c7ef','#ee6ca5'];
  function reading(source,aperture){
    if(!source||!Number.isFinite(source.clock)||source.clock<0||!Array.isArray(source.signals)||source.signals.length!==3||!source.signals.every(v=>Number.isFinite(v)&&Math.abs(v)<=1))throw new TypeError('native bounded signals and nonnegative source time required');
    const observation=C.observe(source,aperture),mapping=F.mapping(source.signals);
    const rows=observation.views.map((v,i)=>{
      const q=v.platePoint,observer=[0,-3.5],screenY=-2.3,lambda=(screenY-observer[1])/(q[1]-observer[1]);
      return{plane:v.plane,sourcePair:v.sourcePoint,point:q,shadow:[q[0],0],referenceCell:mapping.points[i].cell,
        admitted:v.admitted,outputCell:v.admitted?mapping.points[i].cell:null,
        projection:{observer,screenY,lambda,hit:[observer[0]+lambda*(q[0]-observer[0]),screenY]},weight:null};
    });
    return{schema:'a0.shared-measurement/1',time:observation.time,signals:observation.signals,aperture:observation.aperture,rows,
      boundary:'One native signal snapshot. TESA addresses use the existing fixed 4x7 mapping; 29 stays external. Aperture admission is contains(point), not a screen-hit test. Observer/screen is a declared coordinate projection, not the independent Bench mask-observer. White signal markers are not observers. Weight is UNBOUND; no new clock, source write, return operator or physical optics.'};
  }
  function record(value){return{schema:'a0.shared-measurement-record/1',reading:clone(value),scope:'Frozen readout only; no source Capture/Return or history authentication.'};}
  function verify(r){try{const v=r.reading,expected=record(reading({clock:v.time,signals:v.signals},v.aperture));return JSON.stringify(r)===JSON.stringify(expected);}catch(_){return false;}}
  const fmt=n=>n.toFixed(4),pair=p=>'('+p.map(fmt).join(', ')+')';
  function drawing(r,curves=[]){
    let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1140 420" role="img" aria-label="Drei aktuelle Signalpunkte, festes TESA-Raster und deklarierte Observer-Projektion" style="width:100%;min-width:900px;background:#020d15;font-family:monospace">';
    const line=(a,b,color,dash='')=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+color+'" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/>';
    const dot=(p,color,radius=5)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+radius+'" fill="#fff" stroke="'+color+'" stroke-width="2"/>';
    const text=(x,y,t,color='#c5dbe3')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="12">'+t+'</text>';
    const pos=q=>[175+q[0]*118,205-q[1]*118],grid=q=>[420+(q[0]+1)*140,95+(1-q[1])*80];
    s+=text(20,25,'SHARED · aktuelle Punkte / ein t')+text(415,25,'TESA · feste 4 × 7 · y nach oben')+text(810,25,'OBSERVER · deklarierte Projektion');
    s+=line(pos([-1.15,0]),pos([1.15,0]),'#315364')+line(pos([0,-1.15]),pos([0,1.15]),'#315364');
    curves.forEach((points,i)=>{s+='<path d="'+points.map((q,j)=>(j?'L':'M')+pos(q).join(',')).join(' ')+'" fill="none" stroke="'+colors[i]+'" opacity=".55"/>';});
    const boundary=C.boundary(r.aperture);
    if(boundary.length)s+='<path d="'+boundary.map((q,i)=>(i?'L':'M')+pos(q).join(',')).join(' ')+' Z" fill="none" stroke="#bca7dd" stroke-width="2"/>';
    for(let y=0;y<4;y++)for(let x=0;x<7;x++){
      const cell=F.address([-1+(x+.5)*2/7,1-(y+.5)*.5]);
      s+='<rect x="'+(420+x*40)+'" y="'+(95+y*40)+'" width="40" height="40" fill="none" stroke="#456575"/>'+text(424+x*40,110+y*40,String(cell.address),'#718b98');
    }
    const observerPos=q=>[970+q[0]*100,60+(q[1]+3.5)*72],o=observerPos([0,-3.5]);
    s+=line(observerPos([-1.5,-2.3]),observerPos([1.5,-2.3]),'#8491a1')+dot(o,'#fff',5)+text(982,60,'Observer');
    r.rows.forEach((row,i)=>{
      const color=colors[i],p=pos(row.point),h=pos(row.shadow),next=pos(r.rows[(i+1)%3].point);
      s+=line(p,next,'#61727c','3 4')+line(p,h,color,'3 4')+dot(p,color)+dot(grid(row.point),color);
      const q=observerPos(row.point),hit=observerPos(row.projection.hit);
      s+=line(o,q,color)+dot(q,color)+dot(hit,color,4)+text(20+i*112,375,row.plane+': '+(row.admitted?'DURCH':'VERDECKT'),color);
    });
    s+=text(420,295,'Weiß = Signalpunkt · Farbe = Ebene')+text(420,317,'28 Adressen · kein 32er-Register')+text(810,375,'Screen y = −2.3; Observer y = −3.5')+text(810,397,'Durchlass wird vor Projektion geprüft');
    return s+'</svg>';
  }
  function mount(doc,win){
    const $=id=>doc.getElementById(id),host=$('sharedMeasurement'),view=win.A0ThreeLissajousPlanesView,chamber=win.A0ShadowChamber;
    if(!host||!view||!chamber)return null;
    let current=null,held=null;
    function refresh(){
      try{
        const source=view.snapshot,aperture=chamber.reading.current.aperture,r=reading(source,aperture);current=r;
        const samples=typeof view.sample==='function'?Array.from({length:181},(_,i)=>view.sample(i*Math.PI/90)):[];
        const curves=[[0,1],[1,2],[2,0]].map(pair=>samples.map(s=>pair.map(k=>s[k]/Math.sqrt(2))));
        $('sharedMeasurementDrawing').innerHTML=drawing(r,curves);
        $('sharedMeasurementRows').textContent=r.rows.map(row=>`${row.plane} · q ${pair(row.point)} · Schatten ${pair(row.shadow)} · TESA ${row.referenceCell?.address??'außerhalb'} · ${row.admitted?'DURCH':'VERDECKT'} · Ausgabe ${row.outputCell?.address??'—'} · Screen ${pair(row.projection.hit)} · Gewicht UNBOUND`).join('\n');
        $('sharedMeasurementStatus').textContent=`LIVE-QUELLE · t=${fmt(r.time)} · ${view.state.ratio} · δ=${view.state.phaseDegrees}° · ${view.state.playing?'läuft':'pausiert'} · Maske ${r.aperture.shape}, Öffnung ${fmt(r.aperture.opening)}. π-Referenzen bleiben separat.`;
        const register=win.A0RegisterOverlay?.snapshot;
        $('sharedMeasurementRegisters').textContent=register&&register.sourceClock===source.clock?register.pose.layers.map(l=>`${l.name}: Δx ${fmt(l.dx)}, Δy ${fmt(l.dy)} SVG-Einheiten; Deckkraft ${fmt(l.opacity)} (kein Gewicht)`).join('\n'):'Registerkontext nicht am selben Quellzeitpunkt verfügbar; kein Ersatzwert.';
      }catch(error){current=null;$('sharedMeasurementStatus').textContent='HOLD · '+error.message;$('sharedMeasurementDrawing').innerHTML='';$('sharedMeasurementRows').textContent='';$('sharedMeasurementRegisters').textContent='';}
    }
    $('sharedMeasurementCapture').addEventListener('click',()=>{if(!current)return;held=record(current);$('sharedMeasurementRecord').textContent=JSON.stringify(held,null,2);$('sharedMeasurementExport').disabled=false;});
    $('sharedMeasurementExport').addEventListener('click',()=>{if(!held)return;const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(held,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-shared-measurement.json';a.click();win.URL.revokeObjectURL(url);});
    win.addEventListener('a0-lissajous-frame',refresh);
    for(const id of ['chamberShape','chamberOpening'])$(id)?.addEventListener(id==='chamberShape'?'change':'input',refresh);
    for(const id of ['registerMode','registerEffect'])$(id)?.addEventListener('change',refresh);
    $('lissajousPlay')?.addEventListener('click',refresh);
    refresh();return{refresh,get current(){return clone(current);},get held(){return clone(held);},readOnly:true};
  }
  return{reading,record,verify,drawing,mount};
});
