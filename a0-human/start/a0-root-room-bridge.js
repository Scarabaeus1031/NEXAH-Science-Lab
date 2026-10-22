/* A shared reading and return record, not a map from fractal c to signal frequencies. */
(() => {
  const phases=[
    {id:'AM',focus:'AM_PLANE',label:'AM · Eintritt / Injection',text:'Die AM-Ebene liest (s₁,s₂). Der weiße Zeitmarker und sein goldener Schattenpunkt gehören zu demselben Zeitpunkt.'},
    {id:'VM',focus:'VM_PLANE',label:'VM · Übergang / Absorption',text:'Die VM-Ebene liest (s₂,s₃). Ihr cyanfarbener Schatten zeigt den ersten Koordinatenwert dieses Paares auf der horizontalen Achse.'},
    {id:'PM',focus:'PM_PLANE',label:'PM · Emission / Rückweg',text:'Die PM-Ebene liest (s₃,s₁). Der pinke Schattenpunkt bleibt über die gestrichelte Projektionsstrecke mit dem bewegten Punkt verbunden.'},
    {id:'RETURN',focus:'RETURN',label:'Return · Lesestand halten',text:'Return pausiert den Lissajous-Zeitlauf und hält Parameter c, Quellzelle, Zeit, drei Punkte und drei Schatten gemeinsam fest. Der Record behauptet keinen exakten Seam.'}
  ];
  function projectSignals(signals){
    if(!Array.isArray(signals)||signals.length!==3||!signals.every(Number.isFinite))throw new TypeError('Three finite signal values required');
    const pairs=[[0,1],[1,2],[2,0]];
    return pairs.map((pair,index)=>({plane:phases[index].id,point:[signals[pair[0]],signals[pair[1]]],shadow:[signals[pair[0]],0]}));
  }
  function makeReturn(fractal,lissajous,snapshot,shadowTracker=null,rootRingReading=null,shadowChamber=null,cellPivotWiring=null,breathingFin=null,enjoyLoop=null,registerOverlay=null,oneFlow=null){return{
    role:'SHARED_READING_RECORD',
    fractal:{c:[...fractal.c],iterations:fractal.iterations,observerSeed:fractal.observerSeed,operator:'z_(n+1)=z_n^2+c'},
    lissajous:{ratio:lissajous.ratio,phaseDegrees:lissajous.phaseDegrees,time:snapshot.clock,signals:[...snapshot.signals],views:projectSignals(snapshot.signals),distance:snapshot.distance?JSON.parse(JSON.stringify(snapshot.distance)):null},
    shadowRule:'Orthogonal coordinate projection (x,y) -> (x,0) in each local plane',
    shadowTracker:shadowTracker?JSON.parse(JSON.stringify(shadowTracker)):null,
    rootRingReading:rootRingReading?JSON.parse(JSON.stringify(rootRingReading)):null,
    shadowChamber:shadowChamber?JSON.parse(JSON.stringify(shadowChamber)):null,
    cellPivotWiring:cellPivotWiring?JSON.parse(JSON.stringify(cellPivotWiring)):null,
    breathingFin:breathingFin?JSON.parse(JSON.stringify(breathingFin)):null,
    enjoyLoop:enjoyLoop?JSON.parse(JSON.stringify(enjoyLoop)):null,
    registerOverlay:registerOverlay?JSON.parse(JSON.stringify(registerOverlay)):null,
    oneFlow:oneFlow?JSON.parse(JSON.stringify(oneFlow)):null,
    relation:'Co-recorded views; no automatic map from c to frequency or phase; no seam equality asserted'
  };}
  if(typeof module!=='undefined'&&module.exports){module.exports={phases,projectSignals,makeReturn};return;}
  const root=document.getElementById('rootRoom'),planes=document.getElementById('threeLissajousPlanes'),view=window.A0ThreeLissajousPlanesView;
  if(!root||!planes||!view)return;
  root.append(planes); // Reuse the live instrument; do not clone its canvas or create another loop.
  const bridge=document.createElement('section');bridge.id='rootRoomPhaseBridge';bridge.className='bp-root-bridge';bridge.setAttribute('aria-label','Root Room mit drei Ebenen und Return');
  const heading=document.createElement('h3');heading.textContent='Ein Weg · drei Teller · drei Schatten · Return';
  const intro=document.createElement('p');intro.textContent='Mandelbrot → Root Room → Julia bleibt der Weg desselben c. Darunter lesen AM / VM / PM drei Koordinatenpaare desselben Signalträgers zur gemeinsamen Zeit t. Die Auswahl verbindet die Lesarten, nicht ihre Gleichungen.';
  const nav=document.createElement('nav');nav.setAttribute('aria-label','AM VM PM und Return auswählen');
  const description=document.createElement('p');description.setAttribute('aria-live','polite');
  const live=document.createElement('output');live.className='bp-root-live';live.setAttribute('aria-live','off');
  const records=document.createElement('details');records.className='bp-root-record';
  const summary=document.createElement('summary');summary.textContent='Return Record · noch nicht gehalten';const pre=document.createElement('pre');pre.textContent='Return wählen, um den aktuellen Lesestand festzuhalten.';records.append(summary,pre);
  const buttons=[];
  function select(id){
    const phase=phases.find(item=>item.id===id);if(!phase)return;
    view.setFocus(phase.focus);description.textContent=phase.text;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.phase===id)));
    if(id==='RETURN'){
      window.A0CellReturnPerformance?.stop('Root-Return gehalten');
      view.setPlaying(false);
      window.dispatchEvent(new CustomEvent('a0-root-mode-change',{detail:{mode:id}}));
      const record=makeReturn(window.A0FlameMandelbrotFormationView.state,view.state,view.snapshot,window.A0ShadowTracker?.snapshot,window.A0RootRoomModes?.snapshot,window.A0ShadowChamber?.snapshot,window.A0CellPivotWiring?.snapshot,window.A0BreathingFin?.snapshot,window.A0EnjoyLoop?.snapshot,window.A0RegisterOverlay?.snapshot,window.A0OneFlow?.snapshot);
      record.cellReturnPerformance=window.A0CellReturnPerformance?.snapshot??null;
      pre.textContent=JSON.stringify(record,null,2);summary.textContent='Return Record · gehaltener Lesestand';records.open=true;
    }
    if(id!=='RETURN')window.dispatchEvent(new CustomEvent('a0-root-mode-change',{detail:{mode:id}}));
  }
  phases.forEach(phase=>{const button=document.createElement('button');button.type='button';button.dataset.phase=phase.id;button.textContent=phase.label;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>select(phase.id));buttons.push(button);nav.append(button);});
  const all=document.createElement('button');all.type='button';all.textContent='Alle Ebenen';all.addEventListener('click',()=>{view.setFocus('ALL');buttons.forEach(button=>button.setAttribute('aria-pressed','false'));description.textContent='Alle drei Ebenen lesen denselben Zeitpunkt. Der Loop wird mit „Play loop“ fortgesetzt.';window.dispatchEvent(new CustomEvent('a0-root-mode-change',{detail:{mode:'ALL'}}));});nav.append(all);
  const legend=document.createElement('p');legend.className='bp-root-key';legend.textContent='Weißer Punkt = bewegter Zeitmarker · farbiger Punkt = sein Achsenschatten · gestrichelte Strecke = Projektion (x,y) → (x,0). Drei + drei Marker, keine sechs Körper. Im Overlay erscheinen dieselben drei Zeitmarker erneut.';
  bridge.append(heading,intro,nav,description,live,legend,records);root.querySelector('.root-room-head').after(bridge);
  function update(snapshot){const views=projectSignals(snapshot.signals);live.textContent=`t=${snapshot.clock.toFixed(3)} · `+views.map(item=>`${item.plane}: (${item.point.map(n=>n.toFixed(3)).join(', ')}) → (${item.shadow[0].toFixed(3)}, 0)`).join(' | ');}
  window.addEventListener('a0-lissajous-frame',event=>update(event.detail));
  select('AM');update(view.snapshot);
  window.A0RootRoomPhaseBridge={select,get record(){return pre.textContent;}};
})();
