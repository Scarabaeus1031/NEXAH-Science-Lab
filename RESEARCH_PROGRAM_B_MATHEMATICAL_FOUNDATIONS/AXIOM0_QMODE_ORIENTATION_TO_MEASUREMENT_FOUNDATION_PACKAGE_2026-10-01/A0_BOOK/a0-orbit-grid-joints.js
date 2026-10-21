(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-mask-observer.js'):root.A0MaskObserver,node?require('./assets/a0-flame-mandelbrot-formation-v1.js'):root.A0FlameMandelbrotFormation,node?require('./a0-one-flow.js'):root.A0OneFlowModel,node?require('./assets/a0-tesa-grid-candidate.js'):root.A0TesaGridCandidate);
  if(node)module.exports=api;else{root.A0OrbitGridJoints=api;root.A0OrbitGridJointsController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(M,F,O,T){
  'use strict';
  const PRESETS={upper:[-.4,.55],lower:[-.4,-.55],cycle:[0,1],escape:[.26,0]};
  function project(point,frame){
    if(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite))return{status:'HOLD_INVALID_POINT'};
    const t=(frame.screenY-frame.observer[1])/(point[1]-frame.observer[1]);
    if(!Number.isFinite(t)||t<=0||t>=1)return{status:'HOLD_INVALID_PROJECTION'};
    const x=frame.observer[0]+t*(point[0]-frame.observer[0]);
    if(!Number.isFinite(x))return{status:'HOLD_INVALID_PROJECTION'};
    const gate=frame.windows.find(w=>w.screenInterval&&x>=w.screenInterval[0]-1e-8&&x<=w.screenInterval[1]+1e-8);
    return{status:gate?'ADMITTED':'BLOCKED',source:point.slice(),hit:[x,frame.screenY],window:gate?.id??null};
  }
  function reading(config,tick,preset='upper',source='orbit'){
    if(!Object.hasOwn(PRESETS,preset)||!['orbit','polygon'].includes(source))throw Error('unknown joint source');
    const frame=M.frame(config,tick),c=PRESETS[preset].slice(),orbit=F.criticalOrbit(...c,120);
    const point=source==='polygon'?frame.probe:orbit.points[tick];
    return{schema:'a0.orbit-mask-reading/1',source,preset,c,tick,config:JSON.parse(JSON.stringify(config)),orbitPointCount:orbit.points.length,
      policy:'n = mask tick; identity z→(x,y), fixed scale; no wrap, interpolation or source writeback',
      frame,result:point?project(point,frame):{status:'HOLD_ORBIT_END'}};
  }
  function plateCell(address,sign=1){
    T.cell(address);if(![-1,1].includes(sign))throw Error('plate sign');
    const cell=T.cell(address),xy=[-1+2*(cell.col+.5)/7,1-2*(cell.row+.5)/4],r=Math.hypot(...xy);
    if(r>1)return{address,sign,xy,status:'HOLD_OUTSIDE_PLATE_DISK',point:null};
    const point=O.plate(sign,r,Math.atan2(xy[1],xy[0])),back=O.address(point.slice(0,2));
    return{address,sign,xy,status:'MAPPED_CELL_CENTER',point,returnedAddress:back.address,
      boundary:'New cell-center sampling of existing plate; quantized address return, not recovery of arbitrary source points or adjacency distances'};
  }
  function record(r){return{schema:'a0.orbit-mask-record/1',reading:r,wholeMachineReturn:false};}
  function verify(r){try{return r.schema==='a0.orbit-mask-record/1'&&JSON.stringify(r)===JSON.stringify(record(reading(r.reading.config,r.reading.tick,r.reading.preset,r.reading.source)));}catch{return false;}}
  function drawing(r){
    const f=r.frame,p=q=>[320+90*q[0],35+75*(q[1]+3.5)],line=(a,b,color,width=1)=>{const x=p(a),y=p(b);return '<line x1="'+x[0]+'" y1="'+x[1]+'" x2="'+y[0]+'" y2="'+y[1]+'" stroke="'+color+'" stroke-width="'+width+'"/>';};
    let s='<svg viewBox="0 0 640 470" role="img" aria-label="Orbit und Polygon am selben Observer"><title>Gleiche Maske, wählbarer Prüfpunkt; kein physikalisches Pendel</title>';
    s+=line([-3,f.screenY],[3,f.screenY],'#858b9e',8);
    for(const w of f.windows)if(w.screenInterval)s+=line([w.screenInterval[0],f.screenY],[w.screenInterval[1],f.screenY],w.id==='L'?'#29c7ef':'#ee6ca5',8);
    s+='<polygon points="'+f.b.map(q=>p(q).join(',')).join(' ')+'" fill="none" stroke="#81a4ff"/>';
    const baseline=project(f.probe,f);if(baseline.hit)s+=line(f.observer,f.probe,'#697a84');
    if(r.result.hit){s+=line(f.observer,r.result.source,'#e5b340',2);const h=p(r.result.hit);s+='<circle cx="'+h[0]+'" cy="'+h[1]+'" r="5" fill="'+(r.result.status==='ADMITTED'?'#63d9aa':'#ff6578')+'"/>';}
    const eye=p(f.observer);return s+'<circle cx="'+eye[0]+'" cy="'+eye[1]+'" r="5" fill="white"/><text x="20" y="450" fill="#c7dce5">Grau: Polygon-Referenz · Gold: gewählte Quelle · y=0 → Screen</text></svg>';
  }
  function gridDrawing(selected,sign){
    let s='<svg viewBox="0 0 640 310" role="img" aria-label="28 TESA-Adressen und Zellmittelpunkte auf einer Paraboloidschale"><title>24 gültige Zellmittelpunkte, vier außerhalb der Kreisscheibe</title>';
    for(let n=1;n<=28;n++){
      const c=T.cell(n),r=plateCell(n,sign),x=15+c.col*38,y=20+c.row*48;
      s+='<rect x="'+x+'" y="'+y+'" width="35" height="44" fill="'+(n===selected?'#624c16':r.point?'#10384a':'#30333c')+'" stroke="#71909b"/><text x="'+(x+8)+'" y="'+(y+27)+'" fill="white">'+n+'</text>';
      if(r.point){const q=O.project(r.point),px=460+95*q[0],py=155+100*q[1];s+='<circle cx="'+px+'" cy="'+py+'" r="'+(n===selected?6:3)+'" fill="'+(n===selected?'#e5b340':'#29c7ef')+'"/>';}
    }
    for(const c of O.curves('plates').filter(x=>x.index===(sign===1?0:2))){s+='<polyline points="'+c.points.map(q=>{const p=O.project(q);return[460+95*p[0],155+100*p[1]].join(',');}).join(' ')+'" fill="none" stroke="#628894" opacity=".6"/>';}
    return s+'<text x="15" y="250" fill="#c7dce5">Grau: Mittelpunkt außerhalb · Adresse bleibt erhalten</text><text x="15" y="278" fill="#c7dce5">29 bleibt extern · Taille symbolisch / UNBOUND</text></svg>';
  }
  function mount(doc,win){
    const host=doc.getElementById('orbitGridJoints');if(!host)return null;
    host.innerHTML='<h2>Orbit → Observer · Grid → Teller</h2><p>Vorhandene Modelle, neuer expliziter Vergleich. Keine gemeinsame Physik oder Ihara-/Riemann-Identität.</p><div class="ogj-controls"><label>Prüfquelle <select data-ogj-source><option value="orbit">Kritische Bahn</option><option value="polygon">Polygon-Referenz</option></select></label><label>Lokaler c-Vergleich <select data-ogj-preset><option value="upper">−0.4 + 0.55i</option><option value="lower">−0.4 − 0.55i</option><option value="cycle">i · periodische Bahn</option><option value="escape">0.26 · endliche Fluchtbahn</option></select></label><button type="button" data-ogj-capture>Vergleich festhalten</button></div><p>Quelle: vorhandener Mandelbrot-Generator, lokal gewähltes c — nicht der Live-c-Regler im Blue/Pink-Fenster. Cursor: bestehender Maskentick; ein Orbit-Schritt pro Tick, keine neue Uhr. Bei Blue/Pink-Führung wird dessen Bestätigung abgewartet.</p><p data-ogj-status role="status"></p><div data-ogj-drawing></div><details><summary>Festgehaltener Vergleich / JSON</summary><pre data-ogj-record>Noch kein Vergleich festgehalten.</pre></details><h3>TESA-Zellmittelpunkte auf vorhandenen Tellern</h3><div class="ogj-controls"><label>Adresse <input data-ogj-address type="number" min="1" max="28" value="14"></label><label>Schale <select data-ogj-sign><option value="1">Oben +</option><option value="-1">Unten −</option></select></label></div><p data-ogj-grid-status role="status"></p><div data-ogj-grid></div><p>Die 4×7-Adressen bleiben unverändert. Vier Eck-Zellmittelpunkte liegen außerhalb der vorhandenen Kreisscheibe: HOLD, kein Clamping. Rücklesen prüft die Adresse, nicht verlorene Unterzellkoordinaten. Die Taille bleibt symbolisch; keine Three-Domains- oder AU–NA–HE–TI-Dynamik übernommen.</p><p><a href="A0_BLUE_PINK_DODECA_CELL_RETURN.html#formation">Mandelbrot / Julia</a> · <a href="A0_BLUE_PINK_DODECA_CELL_RETURN.html#oneFlow">One Flow / Teller / TESA</a> · <a href="A0_GAME_OF_WORLDS_PLAY.html?world=numbers#numbers">Numbergame</a> · <a href="A0_GAME_OF_WORLDS_PLAY.html?world=domains#domains">Three Domains (getrennte Modelle)</a> · <a href="A0_MATHEMATICAL_JOINTS.html#executable-math">Mathfield</a></p>';
    const el=n=>host.querySelector('[data-ogj-'+n+']');let current=null,held=null,disposed=false;
    function refresh(){
      if(disposed)return;
      try{
        const source=win.A0MaskObserverController;if(!source)throw Error('Maskenquelle fehlt');
        if(source.clockOwner&&!win.A0MaskClockBench?.ready)throw Error('Quellbestätigung fehlt');
        const state=source.state;current=reading(state.config,state.tick,el('preset').value,el('source').value);
        el('status').textContent=current.result.status+' · n='+current.tick+' · '+current.source+' · festes c=('+current.c.join(', ')+')';
        el('drawing').innerHTML=drawing(current);el('capture').disabled=false;
      }catch(error){current=null;el('status').textContent='HOLD · '+error.message;el('drawing').innerHTML='';el('capture').disabled=true;}
    }
    function grid(){
      try{const r=plateCell(Number(el('address').value),Number(el('sign').value));el('grid-status').textContent=r.status+' · Adresse '+r.address+(r.point?' → ('+r.point.map(v=>v.toFixed(4)).join(', ')+') → '+r.returnedAddress:' · kein Tellerpunkt');el('grid').innerHTML=gridDrawing(r.address,r.sign);}
      catch(error){el('grid-status').textContent='HOLD · '+error.message;el('grid').innerHTML='';}
    }
    el('source').addEventListener('change',refresh);el('preset').addEventListener('change',refresh);
    el('capture').addEventListener('click',()=>{if(!current)return;held=JSON.parse(JSON.stringify(record(current)));el('record').textContent=JSON.stringify(held,null,2);});
    el('address').addEventListener('input',grid);el('sign').addEventListener('change',grid);
    const unsub=win.A0MaskObserverController?.subscribe(refresh),unclock=win.A0MaskClockBench?.subscribe(refresh);
    grid();refresh();return{refresh,get snapshot(){return current?JSON.parse(JSON.stringify(current)):null;},get held(){return held?JSON.parse(JSON.stringify(held)):null;},dispose(){disposed=true;unsub?.();unclock?.();}};
  }
  return{PRESETS,project,reading,plateCell,record,verify,drawing,gridDrawing,mount};
});
