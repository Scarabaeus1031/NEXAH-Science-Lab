(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0SourceSeamGuidedTest=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const CONTACT_EXTENSION=1.618033988749895/Math.sqrt(2);
  const STEPS=[
    {id:'domains',section:'bodyDomainSuite',short:'Körperrollen',label:'Körper-Domänen · Carrier, Host, vier Satelliten und Return',duration:5000},
    {id:'carrier-spin',section:'lab',short:'Carrier dreht',label:'Carrier · Orbit, laufende Adresssequenz und blinkende Flächen',duration:4000},
    {id:'carrier-tilt',section:'lab',short:'Carrier kippt',label:'Carrier · Kamera kippen und die räumliche Hülle lesen',duration:3000},
    {id:'carrier-top',section:'lab',short:'Top / Fläche',label:'Carrier · Top-Ansicht, Face-Typ und Quelladresse',duration:3000},
    {id:'interior',section:'blue-body-interior-crt16',short:'Innenregister',label:'Innenregister · CRT16 × P3 × vier Ansichten',duration:3000},
    {id:'player-day',section:'pentagon-body-player',short:'Player · Day',label:'48er Player · beide Körper kippen, 16/17-Treppe taktet',duration:3500},
    {id:'player-night',section:'pentagon-body-player',short:'Player · Night',label:'48er Player · Night-Linse und nächster Sequenzschritt',duration:3000},
    {id:'player-mirror',section:'pentagon-body-player',short:'Player · Mirror',label:'48er Player · Mirror-Linse, Gegenkippung und House-Fokus',duration:3500},
    {id:'double-disjoint',section:'double',short:'Double · getrennt',label:'Double Body · zwei getrennte Frames als Ausgangslage',duration:2500},
    {id:'double-connected',section:'double',short:'H7 + M7',label:'Double Body · H7-Naht verbunden, M7-Ansichten laufen',duration:3500},
    {id:'double-octagons',section:'double',short:'4 × O8',label:'Double Body · vier animierte Oktagone als Projektionslinse',duration:3000},
    {id:'fiber',section:'fiber-geometry',short:'1111 / Gauss',label:'1111 / Gauss · Fiber und Pentagon-Schnitt',duration:3000},
    {id:'spectrum',section:'spectral-audit',short:'Spektrum / E8',label:'Spektrum / E8 · Lanes, Host und Rückweg',duration:3000},
    {id:'transition-projection',section:'spectral-audit',short:'4→2 Projection',label:'Übergangsdeck · 4→2-Projektion',duration:1800},
    {id:'transition-ihara',section:'spectral-audit',short:'Ihara cycles',label:'Übergangsdeck · Ihara-Zyklen',duration:1800},
    {id:'transition-tunnel',section:'spectral-audit',short:'IN→OUT Tunnel',label:'Übergangsdeck · IN→OUT-Tunnel',duration:1800},
    {id:'transition-ledger',section:'spectral-audit',short:'Path ledger',label:'Übergangsdeck · Pfad-Ledger',duration:1800},
    {id:'rings',section:'fibonacci-ring-operator',short:'Fibonacci / Euler',label:'Fibonacci / Euler · Sampling und gekoppelte Phase laufen',duration:3000},
    {id:'ring-ratios',section:'fibonacci-ring-operator',short:'Ratio rings',label:'Ringdeck · Verhältnisringe',duration:1800},
    {id:'ring-unified',section:'fibonacci-ring-operator',short:'Unified lenses',label:'Ringdeck · gemeinsame Vergleichslinsen',duration:1800},
    {id:'ring-fibonacci',section:'fibonacci-ring-operator',short:'Fibonacci / Pascal',label:'Ringdeck · Fibonacci- und Pascal-Linse',duration:1800},
    {id:'ring-sampling',section:'fibonacci-ring-operator',short:'Sampling control',label:'Ringdeck · Sampling-Kontrolle und drei Zeitordnungen',duration:2200},
    {id:'fold',section:'fold-contact',short:'Fold / CON–DAO',label:'Fold / CON–DAO · Box und bewegte Laschen',duration:3000},
    {id:'contact',section:'fold-contact',short:'Kontakt / Capture',label:'Exakter Kontakt · 1111 · P1 / F26 · Capture',duration:3000},
    {id:'coupled',section:'coupled-views',short:'Quellenroute',label:'Quellenroute · sechs Zuständigkeiten, ein gebundener Lesepfad',duration:3000},
    {id:'return',section:'return',short:'Return',label:'Return · vom Kontrast exakt zum Kontaktanker',duration:3000}
  ];
  function createRunner(env){
    let running=false,index=-1,timer=0,checkpoint=null,history=[];
    const command=request=>{const value=env.dispatch(request);if(!value?.ok)throw Error(value?.error||request.command+' failed');history.push({step:STEPS[index]?.id||'none',command:request.command,state:value.state||null});return value};
    function stopMotion(){env.stopFold();env.stopBreath();env.stopShowroom?.();env.stopBodyDomains?.()}
    function finish(status,message){if(timer)env.clearTimeout(timer);timer=0;running=false;stopMotion();env.render({status,index,message,history:[...history]});env.finish?.(status)}
    function act(step){
      env.showSection?.(step.section);
      if(step.id==='domains')env.showBodyDomains?.();
      else if(step.id==='carrier-spin')env.showCarrierSpin?.();
      else if(step.id==='carrier-tilt')env.showCarrierTilt?.();
      else if(step.id==='carrier-top')env.showCarrierTop?.();
      else if(step.id==='interior')env.showInterior?.();
      else if(step.id==='player-day')env.showPlayerDay?.();
      else if(step.id==='player-night')env.showPlayerNight?.();
      else if(step.id==='player-mirror')env.showPlayerMirror?.();
      else if(step.id==='double-disjoint')env.showDoubleDisjoint?.();
      else if(step.id==='double-connected')env.showDoubleConnected?.();
      else if(step.id==='double-octagons')env.showDoubleOctagons?.();
      else if(step.id==='fiber')env.showFiber?.();
      else if(step.id==='spectrum')env.showSpectrum?.();
      else if(step.id.startsWith('transition-'))env.showTransitionView?.(step.id.slice('transition-'.length));
      else if(step.id==='rings')env.showRings?.();
      else if(step.id.startsWith('ring-'))env.showRingView?.(step.id.slice('ring-'.length));
      else if(step.id==='fold'){env.stopShowroom?.();command({command:'SET',payload:{t:.5,extension:1,foldDeg:0,mode:'square',baseOn:'on',number:1111}});env.startFold()}
      else if(step.id==='contact'){const set=command({command:'SET',payload:{t:.5,extension:CONTACT_EXTENSION,foldDeg:180,mode:'square',baseOn:'on',number:1111,layer:'P1'}}),capture=command({command:'CAPTURE'});checkpoint=capture.checkpoint;if(!checkpoint)throw Error('checkpoint missing');env.witness(set.reading,capture.state);env.startBreath()}
      else if(step.id==='return'){command({command:'SET',payload:{t:.61,extension:1.25,foldDeg:90,mode:'triangle',baseOn:'off',number:3333}});const value=command({command:'RETURN',checkpoint});if(!value.returnWitness?.exact)throw Error('exact Return witness missing');env.witness(value.reading,value.state)}
    }
    function next(){
      if(!running)return;
      index+=1;
      if(index>=STEPS.length){finish('pass',`${STEPS.length}/${STEPS.length} · GANZE SEITE GEZEIGT · RETURN EXACT`);return}
      const step=STEPS[index];
      try{act(step);env.render({status:'running',index,message:step.label,history:[...history]});timer=env.setTimeout(next,step.duration)}
      catch(error){finish('hold','HOLD · '+error.message)}
    }
    function start(){if(running)finish('stopped','Vorheriger Lauf gestoppt');history=[];checkpoint=null;index=-1;env.begin?.();running=true;env.render({status:'running',index,message:'Seitentour startet · alle Instrumente werden nacheinander gezeigt',history:[]});next()}
    function stop(message='Gestoppt · kein automatischer nächster Schritt'){finish('stopped',message)}
    return {start,stop,get snapshot(){return{running,index,checkpoint,history:[...history]}}};
  }
  function mount(doc,win=doc.defaultView){
    const root=doc.getElementById('sourceSeamGuidedRun');if(!root)return null;
    const start=root.querySelector('[data-guide-start]'),stop=root.querySelector('[data-guide-stop]'),status=root.querySelector('[data-guide-status]'),bar=root.querySelector('[data-guide-progress]'),list=root.querySelector('ol'),core=root.querySelector('[data-guide-core]'),sub=root.querySelector('[data-guide-sub]'),foldPlay=doc.getElementById('foldPlay');
    if(list){list.setAttribute('aria-label',`${STEPS.length} Stationen der Seitentour`);list.replaceChildren(...STEPS.map((step,i)=>{const item=doc.createElement('li');item.dataset.guideStep='';item.dataset.guideLabel=String(i+1);item.textContent=`${String(i+1).padStart(2,'0')} · ${step.short}`;return item}))}
    const items=[...root.querySelectorAll('[data-guide-step]')],badge=doc.querySelector('.hero .status span:first-child'),intro=root.querySelector('.source-guide-head p');
    if(badge)badge.textContent=`full-page tour · ${STEPS.length} stages`;if(intro)intro.textContent='Die Tour zeigt Körperrollen, Expertenflächen und vorhandene Ansichten in einem Lauf. Eigene Eingaben dürfen die laufende Ansicht verändern; nur „Tour stoppen“ beendet die Führung. Der letzte Teil führt den quellengebundenen Kontakt–Capture–Return aus.';stop.textContent='■ Tour stoppen';bar.max=STEPS.length;
    let spotlight=null;
    const input=(id,value)=>{const node=doc.getElementById(id);if(!node)return;node.value=String(value);node.dispatchEvent(new win.Event('input',{bubbles:true}))};
    const click=selector=>doc.querySelector(selector)?.click();
    const scroll=id=>{spotlight?.classList.remove('guide-showcase');spotlight=doc.getElementById(id);spotlight?.classList.add('guide-showcase');spotlight?.scrollIntoView({behavior:win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})};
    const env={
      dispatch(request){if(!win.A0NativeInstrument)throw Error('native source contract unavailable');return win.A0NativeInstrument.dispatch(request)},
      begin(){win.A0TessarecPageOrchestrator?.stop();doc.body.classList.add('guide-tour-running')},
      showSection:scroll,
      showBodyDomains(){const suite=win.A0BodyDomainSuiteController;suite?.stop();suite?.selectDomain('orientation');suite?.selectRole('CARRIER-48');suite?.play()},
      showCarrierSpin(){win.A0TessarecPageOrchestrator?.start();win.A0TessarecBlueBodyView?.selectMapping('layered');win.A0TessarecBlueBodyView?.selectView('orbit');win.A0TessarecBlueBodyView?.selectFaceType('ALL');win.A0TessarecBlueBodyView?.setRotation(true,.00055);input('stateRange',17)},
      showCarrierTilt(){win.A0TessarecBlueBodyView?.setRotation(false);win.A0TessarecBlueBodyView?.nudgeCamera(58,-32);input('stateRange',31);win.A0TessarecBlueBodyView?.selectFace('H-3')},
      showCarrierTop(){win.A0TessarecBlueBodyView?.selectView('top');win.A0TessarecBlueBodyView?.selectFaceType('O');input('stateRange',42)},
      showInterior(){input('interiorChannel',15);input('interiorLayer',1);input('interiorAperture',.65);click('#interiorPhaseForward');if(doc.getElementById('interiorPlay')?.getAttribute('aria-pressed')!=='true')click('#interiorPlay')},
      showPlayerDay(){const player=win.A0PentagonBodyPlayerController;player?.setSequence('layer1617');player?.setView('day');player?.nudgeBodies(48,-28);player?.step();input('bodySpeed',340);if(doc.getElementById('bodyPlayerPlay')?.getAttribute('aria-pressed')!=='true')click('#bodyPlayerPlay')},
      showPlayerNight(){const player=win.A0PentagonBodyPlayerController;player?.setView('night');player?.nudgeBodies(-72,18);player?.step();player?.setHouseFocus('VM')},
      showPlayerMirror(){const player=win.A0PentagonBodyPlayerController;player?.setView('mirror');player?.nudgeBodies(42,36);player?.step();player?.setHouseFocus('PM')},
      showDoubleDisjoint(){click('[data-seam="disjoint"]')},
      showDoubleConnected(){click('[data-seam="connected"]');win.A0TessarecM7GridView?.select('duerer34');win.A0TessarecM7GridView?.play()},
      showDoubleOctagons(){win.A0TessarecM7GridView?.stop();click('[data-seam="octagons"]')},
      showFiber(){click('[data-fiber-address="0111"]');input('cutRange',.45)},
      showSpectrum(){win.A0TessarecSpectralSlices?.setLane(4,false);input('e8PairRange',2)},
      showTransitionView(id){click(`[data-perspective-deck="transition"] [data-perspective-tab="${id}"]`)},
      showRings(){click('[data-fib-schedule="SEEDED_RANDOM"]');input('fibSampleCount',34);click('#fibEulerCouple')},
      showRingView(id){click(`[data-perspective-deck="rings"] [data-perspective-tab="${id}"]`);if(id==='sampling'){click('[data-fib-schedule="UNIFORM"]');click('[data-fib-schedule="FIBONACCI"]');click('[data-fib-schedule="SEEDED_RANDOM"]')}},
      stopShowroom(){win.A0TessarecPageOrchestrator?.stop();win.A0TessarecBlueBodyView?.setRotation(false);if(doc.getElementById('interiorPlay')?.getAttribute('aria-pressed')==='true')click('#interiorPlay');win.A0PentagonBodyPlayerController?.stop();win.A0TessarecM7GridView?.stop();const fib=doc.getElementById('fibPlay');if(fib?.classList.contains('active'))fib.click()},
      stopBodyDomains(){win.A0BodyDomainSuiteController?.stop()},
      startFold(){if(!foldPlay.textContent.startsWith('Pause'))foldPlay.click()},
      stopFold(){if(foldPlay.textContent.startsWith('Pause'))foldPlay.click()},
      startBreath(){const breathPlay=doc.getElementById('conDaoPlay');if(breathPlay&&!breathPlay.classList.contains('active'))breathPlay.click()},
      stopBreath(){win.A0FoldConDaoController?.stop()},
      setTimeout:(fn,ms)=>win.setTimeout(fn,ms),clearTimeout:id=>win.clearTimeout(id),
      witness(reading,state){root.dataset.contact=reading?.contact?.state||'';root.dataset.returnState=state?.conDao?.stateId||''},
      finish(result){spotlight?.classList.remove('guide-showcase');spotlight=null;doc.body.classList.remove('guide-tour-running');if(result==='pass')root.scrollIntoView({behavior:win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})},
      render(value){
        root.dataset.status=value.status;root.dataset.step=STEPS[value.index]?.id||value.status;status.textContent=value.message;start.disabled=value.status==='running';stop.disabled=value.status!=='running';
        if(core)core.textContent=value.index>=0?String(value.index+1).padStart(2,'0'):'TOUR';if(sub)sub.textContent=STEPS[value.index]?.id.toUpperCase()||'ALLE BEDIENUNGEN';
        const completed=value.status==='pass'?STEPS.length:Math.max(0,value.index);bar.value=completed;bar.max=STEPS.length;
        items.forEach((item,i)=>{item.classList.toggle('active',value.status==='running'&&i===value.index);item.classList.toggle('done',value.status==='pass'||i<value.index)});
      }
    };
    const runner=createRunner(env);start.addEventListener('click',runner.start);stop.addEventListener('click',()=>runner.stop());win.addEventListener('pagehide',()=>runner.stop(),{once:true});return runner;
  }
  return {CONTACT_EXTENSION,STEPS,createRunner,mount};
});
