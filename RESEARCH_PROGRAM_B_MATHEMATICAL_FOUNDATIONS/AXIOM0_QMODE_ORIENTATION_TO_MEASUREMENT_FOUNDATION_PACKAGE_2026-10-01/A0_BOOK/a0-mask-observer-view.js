(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-mask-observer.js'):root.A0MaskObserver,node?require('./a0-mask-assembly.js'):root.A0MaskAssembly,node?require('./a0-compass-assembly.js'):root.A0CompassAssembly,node?require('./a0-mask-elastic-links.js'):root.A0MaskElasticLinks);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0MaskObserverController=api.mount(document,root);
})(typeof globalThis==='undefined'?this:globalThis,function(M,A,C,E){
  'use strict';
  const n=x=>Number(x.toFixed(5));
  function draw(f,history,linkView={}){
    const p=q=>[350+110*q[0],280-110*q[1]],points=ps=>ps.map(q=>p(q).map(n).join(',')).join(' ');
    const polygon=(ps,fill,stroke)=>ps.length?'<polygon points="'+points(ps)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>':'';
    const dot=(q,color,r=4)=>{const a=p(q);return '<circle cx="'+n(a[0])+'" cy="'+n(a[1])+'" r="'+r+'" fill="'+color+'"/>';};
    let top='<title>Körperverschiebung, berechnete Überlappung und obere lila Faltungsansicht</title>';
    top+=polygon(f.a,'#f2ce5d18','#f2ce5d')+polygon(f.b,'#81a4ff20','#81a4ff');
    for(const w of f.windows)top+=polygon(w.polygon,w.id==='L'?'#29c7ef40':'#ee6ca540',w.id==='L'?'#29c7ef':'#ee6ca5');
    if(E)top+=E.drawing(f.config,f.tick,linkView);
    for(const q of f.cuts.points)top+=dot(q,'#cafff1');
    for(const q of f.a)top+=dot(q,'#f2ce5d',3);
    top+=dot(f.pivot,'#ffda73',5)+dot(f.probe,'#fff',5);
    top+='<text x="20" y="35" fill="#e4f7ff">AUFSICHT · B verschoben · L/R = zwei Hälften von A ∩ B</text>';
    top+='<text x="20" y="540" fill="#b7d1dc">Weiß: Kantenschnitte · Gold: A-Ecken / Mittelpunkt · Weißer Marker: B-Rand</text>';
    // Draw last: this is the Owner's display-layer placement, not a derived spatial height.
    if(f.fold.visible)top+='<g data-mask-fold-layer="top"><polyline points="'+points(f.fold.points)+'" fill="none" stroke="#e677ff" stroke-width="3"/><text x="20" y="565" fill="#e677ff">LILA FALTUNG · oberste Ansichtsebene · keine 3D-Verklebung</text></g>';
    const q=p=>[350+115*p[0],40+90*(p[1]+3.5)],line=(a,b,color,width=1)=>{const u=q(a),v=q(b);return '<line x1="'+n(u[0])+'" y1="'+n(u[1])+'" x2="'+n(v[0])+'" y2="'+n(v[1])+'" stroke="'+color+'" stroke-width="'+width+'"/>';};
    let observer='<title>Eine Projektion, abgeleitete Maskenintervalle, zugelassene und gesperrte Beobachterspur</title>';
    observer+='<text x="20" y="20" fill="#dff2f7">OBSERVER · Screen mit übernommenen y=0-Maskenintervallen</text>';
    observer+=line([-2.2,f.screenY],[2.2,f.screenY],'#8a91a5',10);
    for(const w of f.windows)if(w.screenInterval)observer+=line([w.screenInterval[0],f.screenY],[w.screenInterval[1],f.screenY],w.id==='L'?'#29c7ef':'#ee6ca5',10);
    for(const row of f.projection)observer+=line(f.observer,row.source,row.admitted?'#29c7ef66':'#ff657866');
    for(const h of history){const a=q(h.observation.hit);observer+='<circle cx="'+n(a[0])+'" cy="'+n(a[1])+'" r="2.5" fill="'+(h.observation.admitted?'#63d9aa':'#ff6578')+'"/>';}
    observer+=line(f.observer,f.probe,'#f2ce5d',2);
    const probe=q(f.probe),eye=q(f.observer),hit=q(f.probeProjection.hit);
    observer+='<polygon points="'+f.b.map(p=>q(p).map(n).join(',')).join(' ')+'" fill="#81a4ff18" stroke="#81a4ff"/>';
    observer+='<circle cx="'+n(eye[0])+'" cy="'+n(eye[1])+'" r="6" fill="#fff"/><text x="370" y="48" fill="#fff">Observer</text>';
    observer+='<circle cx="'+n(probe[0])+'" cy="'+n(probe[1])+'" r="5" fill="#f2ce5d"/><circle cx="'+n(hit[0])+'" cy="'+n(hit[1])+'" r="6" fill="'+(f.probeProjection.admitted?'#63d9aa':'#ff6578')+'"/>';
    observer+='<text x="20" y="565" fill="#b7d1dc">Ein deklarierter 2D-Gate-Vergleich · keine optische Kalibrierung</text>';
    return {top,observer};
  }
  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('maskObserverBench');if(!host)return null;
    const el=id=>doc.getElementById(id),listeners=new Set();let state=A.create(),timer=null,clockOwner=null;
    const controls={dx:'maskDx',dy:'maskDy',angle:'maskAngle',amplitude:'maskAmplitude',word:'maskWord',fold:'maskFold'};
    function render(){
      const f=M.frame(state.config,state.tick),linkView={visible:el('maskElasticVisible')?.checked??false,curved:el('maskElasticCurved')?.checked??true},svg=draw(f,state.history,linkView);
      if(el('maskElasticLedger')&&E)el('maskElasticLedger').innerHTML=E.ledger(f.config,f.tick,linkView);
      el('maskTopSvg').innerHTML=svg.top;el('maskObserverSvg').innerHTML=svg.observer;
      if(el('maskAssemblySvg'))el('maskAssemblySvg').innerHTML=A.draw(state);
      if(el('maskCompassSvg'))el('maskCompassSvg').innerHTML=C.draw(state);
      for(const [key,id]of Object.entries({rotation:'maskAssemblyRotation',plane:'maskAssemblyPlane',lens:'maskAssemblyLens',palette:'maskAssemblyPalette'}))if(el(id))el(id).value=String(state.assembly[key]);
      for(const [key,id]of Object.entries(controls))if(key==='fold')el(id).checked=state.config[key];else el(id).value=String(state.config[key]);
      el('maskTick').value=state.tick;
      el('maskReadout').textContent=state.config.kind+' · Tick '+state.tick+'/120 · B Δ=('+f.shift.map(x=>x.toFixed(3)).join(', ')+') · Kantenschnitte '+f.counts.edgeCrossings+' · + Mittelpunkt '+f.counts.crossingsPlusPivot+' · A-Ecken + Schnitte '+f.counts.referenceCornersPlusCrossings+' · '+f.counts.status;
      el('maskGateStatus').textContent=(f.probeProjection.admitted?'DURCHGELASSEN · '+f.probeProjection.window:'VERDECKT')+' · Screen x='+f.probeProjection.hit[0].toFixed(4)+' · '+state.history.length+'/128 Spurpunkte · verworfen '+state.dropped+' · '+(state.anchor?'Anker vorhanden':'kein Anker');
      el('maskReturn').disabled=!state.anchor;el('maskStep').disabled=state.tick===M.STEPS;
      if(clockOwner)for(const id of ['maskPlay','maskStep','maskTick','maskCapture','maskReturn','maskReset','maskPentagon','maskSquare','maskTakePhase',...Object.values(controls)])el(id).disabled=true;
      else for(const id of ['maskPlay','maskTick','maskCapture','maskReset','maskPentagon','maskSquare','maskTakePhase',...Object.values(controls)])el(id).disabled=false;
      el('maskPlay').textContent=timer===null?'LRRL / RLLR abspielen':'Pause';el('maskPlay').setAttribute('aria-pressed',String(timer!==null));
      for(const listener of listeners)try{listener(JSON.parse(JSON.stringify(state)));}catch(error){win.console?.warn?.('Mask view observer failed',error);}
    }
    function pause(){if(timer!==null){win.clearInterval(timer);timer=null;}render();}
    function command(action,value){if(clockOwner){el('maskStatus').textContent='HOLD · Blue/Pink führt; erst entkoppeln.';return false;}try{state=A.apply(state,action,value);render();return true;}catch(error){el('maskStatus').textContent=String(error.message||error);return false;}}
    function run(){
      if(clockOwner){el('maskStatus').textContent='HOLD · lokale Uhr im Folgemodus gesperrt.';return;}
      if(timer!==null){pause();return;}
      if(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches){el('maskStatus').textContent='Reduzierte Bewegung · Step oder Tick-Schieber verwenden.';return;}
      if(state.tick===M.STEPS)command('TICK',0);
      timer=win.setInterval(()=>{if(!command('STEP')||state.tick===M.STEPS)pause();},80);render();
    }
    el('maskPlay').addEventListener('click',run);
    for(const id of ['maskElasticVisible','maskElasticCurved'])el(id)?.addEventListener('change',render);
    for(const [id,action]of [['maskStep','STEP'],['maskCapture','CAPTURE'],['maskReturn','RETURN'],['maskReset','RESET']])el(id).addEventListener('click',()=>{pause();if(command(action))el('maskStatus').textContent=action==='RETURN'?'Gespeicherter Maskenzustand einschließlich Spur wiederhergestellt · kein physikalischer Zeitrücklauf.':action+' · lokaler Maskencontroller';});
    for(const [key,id]of Object.entries(controls))el(id).addEventListener(key==='fold'||key==='word'?'change':'input',()=>{const value=key==='fold'?el(id).checked:key==='word'?el(id).value:Number(el(id).value);pause();command('SET',{[key]:value});});
    el('maskTick').addEventListener('input',()=>{const value=Number(el('maskTick').value);pause();command('TICK',value);});
    function chooseSlice(event){
      const target=event.target.closest?.('[data-compass-slice]');
      if(!target)return;
      const slice=Number(target.dataset.compassSlice);
      if(!Number.isInteger(slice)||slice<0||slice>28)return;
      event.preventDefault?.();pause();command('TICK',Math.round(slice*120/28));
    }
    el('maskCompassSvg')?.addEventListener('click',chooseSlice);
    el('maskCompassSvg')?.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')chooseSlice(event);});
    for(const [key,id]of Object.entries({rotation:'maskAssemblyRotation',plane:'maskAssemblyPlane',lens:'maskAssemblyLens',palette:'maskAssemblyPalette'}))el(id)?.addEventListener('change',()=>{const value=key==='rotation'?Number(el(id).value):el(id).value;pause();command('ASSEMBLY',{[key]:value});});
    for(const [id,kind,angle]of [['maskPentagon','pentagon',36],['maskSquare','square',45]])el(id).addEventListener('click',()=>{pause();command('SET',{kind,angle,dx:0,dy:0,phase:0});});
    el('maskTakePhase').addEventListener('click',()=>{
      const phase=win.A0LayeredSceneView?.exportState?.().pose?.phase;
      if(!Number.isFinite(phase)){el('maskStatus').textContent='HOLD · Originalphase nicht erreichbar.';return;}
      pause();if(command('SET',{kind:'pentagon',phase,angle:36}))el('maskStatus').textContent='Original-Pentagonphase einmalig übernommen · kein gemeinsamer Takt.';
    });
    el('maskExport').addEventListener('click',()=>{
      pause();const record=C.record(state);if(C.verify(record).status!=='PASS')return;
      el('maskRecord').textContent=JSON.stringify(record,null,2);
      const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(record,null,2)],{type:'application/json'})),a=doc.createElement('a');
      a.href=url;a.download='a0-compass-assembly-record.json';a.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);
      el('maskStatus').textContent='PASS · konsistenter Zustand exportiert; kein Nachweis einer ausgeführten Historie.';
    });
    el('maskImport').addEventListener('change',async event=>{
      const file=event.target.files?.[0];if(!file)return;
      try{if(file.size>2*1024*1024)throw Error('Datei über 2 MiB');const r=C.verify(JSON.parse(await file.text()));el('maskStatus').textContent=r.status+' · Import nur geprüft; Live-Zustand unverändert.';}catch(error){el('maskStatus').textContent='INVALID · '+String(error.message||error);}
      event.target.value='';
    });
    doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)pause();});
    render();return {command,pause,
      bindClock(owner){if(typeof owner!=='string'||!owner)throw Error('clock owner required');if(clockOwner&&clockOwner!==owner)throw Error('clock already bound');pause();clockOwner=owner;render();return state.tick;},
      followClock(owner,tick){if(owner!==clockOwner||!clockOwner)throw Error('clock owner mismatch');if(!Number.isInteger(tick)||tick<0||tick>119)throw Error('invalid follower tick');if(state.tick!==tick){state=A.apply(state,'TICK',tick);render();}return{tick:state.tick,localTimerRunning:timer!==null};},
      unbindClock(owner){if(owner!==clockOwner)throw Error('clock owner mismatch');clockOwner=null;pause();},
      get clockOwner(){return clockOwner;},
      record:()=>C.record(state),get state(){return JSON.parse(JSON.stringify(state));},subscribe(listener){if(typeof listener!=='function')throw Error('observer must be a function');if(listeners.size>=32)throw Error('observer limit');listeners.add(listener);try{listener(JSON.parse(JSON.stringify(state)));}catch(error){listeners.delete(listener);throw error;}return()=>listeners.delete(listener);}};
  }
  return {draw,mount};
});
