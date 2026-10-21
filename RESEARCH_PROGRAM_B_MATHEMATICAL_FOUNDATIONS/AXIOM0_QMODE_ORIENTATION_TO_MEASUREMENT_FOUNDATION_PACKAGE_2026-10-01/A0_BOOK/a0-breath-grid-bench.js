/* Read-only display adapter. No timer, source commands, new address space or physical breath claim. */
(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./assets/a0-tesa-grid-candidate.js'):root.A0TesaGridCandidate,
    node?require('./a0-con-dao-phase.js'):root.A0ConDaoPhase,
    node?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers);
  if(node)module.exports=api;
  else {root.A0BreathGridBench=api;root.A0BreathGridController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(T,C,N){
  'use strict';
  const TAU=2*Math.PI,clone=x=>JSON.parse(JSON.stringify(x));
  function sourceTick(clock){
    if(!Number.isFinite(clock)||clock<0)throw Error('Ungültige Quellzeit');
    return Math.min(13,Math.floor((clock%TAU)/TAU*14));
  }
  function reading(model,tick,options={}){
    const phase=C.reading(model,tick),circle=options.circle===true,grid=options.grid===true;
    const stretch=grid?1+phase.displayPhase:1;
    return {tick,phase,circleRadius:circle?13+13*phase.displayPhase:13,stretch,
      cells:Array.from({length:28},(_,i)=>T.view(i+1,{stretch})),
      gridShape:[4,7],external:[29],admission:'UNBOUND',weights:'UNBOUND',
      boundary:'Declared display coupling: radius 13..26 and horizontal TESA stretch 1..2. No aperture gate, 28-to-32 conversion, signal-point mapping or native Return.'};
  }
  function drawing(r){
    const cellWidth=24*r.stretch,cellHeight=40;
    const cells=r.cells.map(p=>'<g><rect x="'+(10+p.col*cellWidth)+'" y="'+(40+p.row*cellHeight)+'" width="'+cellWidth+'" height="'+cellHeight+'" fill="none" stroke="currentColor" opacity=".5"/><text x="'+(10+(p.col+.5)*cellWidth)+'" y="'+(64+p.row*cellHeight)+'" text-anchor="middle" fill="currentColor">'+p.address+'</text></g>').join('');
    return '<div class="breath-grid-panels"><svg viewBox="0 0 180 230" role="img" aria-label="Kreisradius, reine Atemanzeige"><title>Kreisradius, keine Aperturprüfung</title><circle cx="90" cy="115" r="65" fill="none" stroke="currentColor" opacity=".3"/><circle cx="90" cy="115" r="'+(r.circleRadius*2.5)+'" fill="none" stroke="#e5b340" stroke-width="2"/><text x="90" y="215" text-anchor="middle" fill="currentColor">Radius '+r.circleRadius.toFixed(2)+'</text></svg><svg viewBox="0 0 370 230" role="img" aria-label="TESA, vier Reihen und sieben Spalten, 28 erhaltene Adressen"><title>Horizontale Grid-Streckung, kein Zoom</title>'+cells+'<text x="10" y="25" fill="currentColor">4 × 7 · Streckung '+r.stretch.toFixed(3)+'</text><text x="10" y="222" fill="currentColor">29 bleibt extern · keine 32er-Umwandlung</text></svg></div>';
  }
  function mount(doc,win){
    const host=doc.getElementById('breathGridBench');if(!host)return null;
    const model=win.NEXAH_BREATH_MODEL,clock=win.A0MaskClockBench;
    let source='bluepink',circle=true,grid=false,session=N.start('elevator'),current=null;
    host.innerHTML='<h2>Bewegung vergleichen · Kreis ↔ TESA</h2><p>Quelle → CON–DAO-Anzeigephase → Kreisradius / Grid-Streckung → erhaltene Adressen. Ein lesender Anschluss, keine neue Uhr.</p><div class="breath-grid-controls"><label>Quelle <select data-bg-source><option value="bluepink">Blue/Pink · bestätigtes Readback</option><option value="numbers">Numbergame · lokaler gespeicherter Elevator-Vergleich</option></select></label><label><input type="checkbox" data-bg-circle checked> Kreis folgt</label><label><input type="checkbox" data-bg-grid> Grid folgt</label><button type="button" data-bg-off>Beide Anschlüsse aus</button></div><p data-bg-blue>Blue/Pink oben verbinden; Start / Pause / Step bleiben ausschließlich bei der Quelle.</p><div data-bg-number hidden><button type="button" data-bg-prev>Gespeicherter Schritt zurück</button><button type="button" data-bg-next>Numbergame +1</button><label>Gespeicherter Cursor <input type="range" min="0" max="0" value="0" data-bg-cursor></label><p>Eigene Vergleichskopie der bestehenden Elevator-Regel, keine Übernahme des offenen Numbergame-Fensters und keine Blue/Pink-Kopplung. Schritte bleiben beim Quellenwechsel erhalten.</p></div><output data-bg-status role="status">HOLD · wartet auf bestätigte Quelle</output><div data-bg-drawing></div><p data-bg-readout></p><details><summary>Vertrag, Quellen und offene Verbindungen</summary><p>Blue/Pink: floor(14 × (t mod 2π) / 2π) liefert die 14 CON–DAO-Anzeigeticks einschließlich STILL ×2. Deklarierter Adapter, nicht der native CON–DAO-Takt. Numbergame: genau ein Anzeigetick pro gespeichertem Elevator-Schritt. Quellenwechsel verbindet keine Uhren.</p><p>Kreis = 13 + 13p; horizontale Grid-Streckung = 1 + p. Beide einzeln abschaltbar. Rasterhöhe und Projektionsmaßstab bleiben fest; Adresszahl, Nachbarschaft und inverse Adresslesung bleiben erhalten. Keine Durchlassprüfung oder Gewichte. 7→8, AM/VM/PM-Zuordnung, CARO, Rotation/Gegenrotation und Inflow/Outflow bleiben getrennt.</p><p><a href="assets/game-of-worlds-play/numbers/index.html">Numbergame öffnen</a> · <a href="#maskClockLink">Blue/Pink-Quellsteuerung</a></p></details>';
    const $=q=>host.querySelector('[data-bg-'+q+']');
    function render(){
      $('number').hidden=source!=='numbers';$('blue').hidden=source!=='bluepink';
      $('cursor').max=String(session.frames.length-1);$('cursor').value=String(session.cursor);
      $('prev').disabled=session.cursor===0;$('next').disabled=session.cursor===N.limit('elevator');
      try{
        let tick,stamp;
        if(source==='bluepink'){
          if(!clock?.ready)throw Error('Blue/Pink nicht bestätigt / getrennt. Oben verbinden; kein Ersatzwert.');
          const s=clock.last.source;tick=sourceTick(s.clock);stamp='Blue/Pink t='+s.clock.toFixed(4)+' · '+s.ratio+' / '+s.phaseDegrees+'° · '+(s.playing?'läuft':'pausiert');
        }else{tick=session.cursor;stamp='Lokaler Numbergame-Elevator n='+tick+' · N='+session.frames[tick].state.a+' · gespeichert / schrittweise';}
        current={source,sourceState:source==='bluepink'?clock.last:clone(session),reading:reading(model,tick,{circle,grid})};
        $('status').textContent=stamp;
        $('drawing').innerHTML=drawing(current.reading);
        $('readout').textContent=current.reading.phase.stateId+' · Tick '+(current.reading.phase.slot+1)+'/14 · Kreis '+(circle?'verbunden':'fest')+' · Grid '+(grid?'verbunden':'fest')+' · 28 Adressen erhalten · Apertur / Gewichte UNBOUND';
      }catch(error){current=null;$('status').textContent='HOLD · '+error.message;$('drawing').innerHTML='';$('readout').textContent='Keine aktuelle Messlesung. Keine autonome Fortsetzung.';}
    }
    $('source').addEventListener('change',e=>{source=e.target.value;render();});
    $('circle').addEventListener('change',e=>{circle=e.target.checked;render();});
    $('grid').addEventListener('change',e=>{grid=e.target.checked;render();});
    $('off').addEventListener('click',()=>{circle=grid=false;$('circle').checked=$('grid').checked=false;render();});
    $('prev').addEventListener('click',()=>{if(session.cursor>0)session=N.at(session,session.cursor-1);render();});
    $('next').addEventListener('click',()=>{if(session.cursor<N.limit('elevator'))session=N.step(session);render();});
    $('cursor').addEventListener('input',e=>{session=N.at(session,Number(e.target.value));render();});
    const unsubscribe=clock?.subscribe(render);render();
    return{refresh:render,get snapshot(){return current?clone(current):null;},dispose(){unsubscribe?.();}};
  }
  return{sourceTick,reading,drawing,mount};
});
