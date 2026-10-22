(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers,node?require('./a0-trinity-lens.js'):root.A0TrinityLens,()=>node?require('./a0-bench-fold-guide.js'):root.A0BenchFoldGuide);
  if(node)module.exports=api;else root.A0BenchLensReturn=api;
})(typeof globalThis==='undefined'?this:globalThis,function(M,T,getGuide){
  'use strict';
  const SCHEMA='a0.bench-lens-return/1',clone=x=>JSON.parse(JSON.stringify(x));
  function create(){return{phase:232,settings:T.settings(),session:M.start('sevenword'),anchor:null,witness:null}}
  function validate(s){
    if(!s||!Number.isInteger(s.phase)||s.phase<0||s.phase>360)throw Error('Invalid source phase');
    if(JSON.stringify(T.settings(s.settings))!==JSON.stringify(s.settings))throw Error('Invalid lens settings');
    if(s.session?.config?.world!=='sevenword'||M.replay(M.record(s.session,'rails',{side:'front',touch:null,...(s.witness?{returnWitness:s.witness}:{})})).status!=='PASS')throw Error('Invalid native sequence or inverse witness');
    if(s.anchor!==null&&(!Number.isInteger(s.anchor?.cursor)||s.anchor.cursor<0||s.anchor.cursor>=s.session.frames.length||JSON.stringify(s.anchor.frame)!==JSON.stringify(s.session.frames[s.anchor.cursor])))throw Error('Invalid captured source anchor');
    return s;
  }
  function apply(state,action,value){
    validate(state);const s=clone(state);
    if(action==='phase'){s.phase=Number(value)}
    else if(action==='settings'){s.settings=T.settings({...s.settings,...value})}
    else if(action==='capture'){s.anchor={cursor:s.session.cursor,frame:clone(s.session.frames[s.session.cursor])};s.witness=null}
    else if(action==='step'){s.session=M.step(s.session);s.witness=null}
    else if(action==='reset'){return create()}
    else if(action==='inverse'||action==='return'){
      const target=action==='inverse'?s.session.cursor-1:s.anchor?.cursor;
      if(target===undefined)throw Error('HOLD · zuerst einen Quellanker erfassen');
      if(target<0)throw Error('HOLD · 978 ist der deklarierte Start');
      const w=M.returnTo(s.session,target);if(w.status!=='EXACT')throw Error(w.status+' · '+w.reason);
      s.session=M.at(s.session,target);s.witness=w;
    }else throw Error('Unknown lens-return action');
    return validate(s);
  }
  function snapshot(s){validate(s);return{lens:T.snapshot(s.phase,s.settings),fold:M.mixerFold(s.phase),number:s.session.frames[s.session.cursor],boundary:'Shared local display phase for lens and Fold Guide only. Numeric generation is independent; no native-face, Lorenz, CA or E–D–C identity.'}}
  function record(s){return{schema:SCHEMA,state:clone(validate(s)),reading:snapshot(s)}}
  function verify(r){try{return{status:r?.schema===SCHEMA&&JSON.stringify(record(r.state))===JSON.stringify(r)?'PASS':'INVALID'}}catch{return{status:'INVALID'}}}
  function mount(doc,win){
    const host=doc.getElementById('benchLensReturn');if(!host)return null;let state=create();const readingListeners=new Set();
    host.innerHTML=`<header class="blr-head"><div><small>VIEW → OVERLAY → INVERSE → RECORD</small><h2>Linsen, Falte &amp; Rücklauf</h2><p>AM · Tag / PM · Nacht. Der Lila Falter VM entsteht erst in der Überlagerung.</p></div><a href="A0_GAME_OF_WORLDS_PLAY.html#numbers">Numbers öffnen ↗</a></header>
      <div class="blr-controls"><label>Quellphase <input data-blr-phase type="range" min="0" max="360" step="1" value="232"></label><output data-blr-phase-label></output><label><input type="checkbox" data-blr-left checked> Linse A</label><label><input type="checkbox" data-blr-right checked> Linse B</label><label>Farbe <select data-blr-palette><option value="roles">Rollenfarben</option><option value="rgb">RGB · Lichtansicht</option><option value="cmyk">YMCK / CMYK · Druckansicht</option></select></label><label>K · Schwarz <input data-blr-k type="range" min="0" max="1" step="0.05" value="0"></label><label>Lesemarke <select data-blr-marker>${T.markers.map(x=>`<option value="${x}"${x==='dawn'?' selected':''}>${x}</option>`).join('')}</select></label><button data-blr-action="swap" type="button">AM / PM tauschen</button></div>
      <div data-blr-drawing></div>
      <section id="benchMixerFoldGuide" aria-labelledby="benchMixerFoldTitle"><h3 id="benchMixerFoldTitle">Numbers Mixer · Fold Guide</h3><div data-blr-guide style="max-width:900px"></div>
      <div class="blr-actions">${M.MIXER_FOLD_STOPS.map(stop=>`<button type="button" data-blr-stop="${stop.phase}" aria-pressed="false">φ ${stop.phase}° → Falte ${stop.angle}°</button>`).join('')}</div>
      <p>Dieselbe lokale Phase wie die Linsen oben. Eigene Mixer-Folge: 0° → 78° → 33° → 7° → 0°. 5B benutzt andere Zielwinkel und 29 Posen; Atlas-Tessarec besitzt wiederum eigene Phasen und Uhr. Kein automatisches Mapping zwischen diesen Instrumenten.</p></section><p class="blr-fold" data-blr-fold></p>
      <section class="blr-number" aria-labelledby="benchNumberReturn"><div><small>NATIVE 978 CHANNEL · INDEPENDENT GENERATION</small><h3 id="benchNumberReturn">978 → 9778 → 97778 …</h3><output data-blr-number aria-live="polite"></output><p>N′ = 10N − 2 · invers: (N + 2) / 10. Voller Integerzustand, nicht nur gleicher Rest.</p></div><div class="blr-actions"><button data-blr-action="capture" type="button">1 · Anker erfassen</button><button data-blr-action="step" type="button">2 · Vorwärts +1</button><button data-blr-action="inverse" type="button">Invers −1</button><button data-blr-action="return" type="button">3 · Zum Anker</button><button data-blr-action="export" type="button">4 · Record exportieren</button><button data-blr-action="reset" type="button">Neu beginnen</button></div></section>
      <output class="blr-status" data-blr-status role="status" aria-live="polite">Bereit · zuerst einen Anker erfassen.</output>
      <label class="blr-import">Export prüfen (ohne Zustandsübernahme) <input data-blr-import type="file" accept="application/json,.json"></label>
      <details class="blr-boundary"><summary>Vertrag &amp; Grenzen</summary><p>Linse und Fold Guide lesen dieselbe lokale Phase der vorhandenen Pentagon-Szene. Die Zahlengeneration besitzt keine implizite Phasenkopplung. Anker/Return betreffen nur den vollständigen Zahlenzustand; Linsenansicht und Verlauf werden nicht zurückgesetzt. JSON prüft die enthaltenen Quellen und Lesarten, beweist aber keine Entstehungsgeschichte.</p><p>RGB / YMCK sind vereinfachte Bildschirmlesarten; K ist kein vierter Zustand. Q° ist ein historisches Beobachterlabel. CA, Sunset Boulevard, T1/T2/T3, E–D–C und die native Prismaflächen-Zuordnung bleiben offen. Keine kalibrierte Optik und keine Lorenz-Gleichsetzung.</p></details>`;
    const $=q=>host.querySelector(q),status=$('[data-blr-status]');
    function render(){const r=snapshot(state),n=r.number;$('[data-blr-drawing]').innerHTML=T.drawing(r.lens);$('[data-blr-guide]').innerHTML=getGuide().drawing(state.phase);for(const b of host.querySelectorAll('[data-blr-stop]'))b.setAttribute('aria-pressed',String(Number(b.dataset.blrStop)===state.phase));$('[data-blr-phase-label]').textContent=state.phase+'°';$('[data-blr-fold]').textContent=`Fold Guide ${r.fold.angle}° · Achse ${r.fold.axis} · Crown ${r.fold.crownTick}/19 (Index, kein Bruch) · VM ${r.lens.VM?'aktiv':'aus'}`;$('[data-blr-number]').textContent=n.state.a+' · Generation '+n.generation+' / '+M.limit('sevenword');$('[data-blr-action="step"]').disabled=state.session.cursor===M.limit('sevenword');$('[data-blr-action="inverse"]').disabled=state.session.cursor===0;$('[data-blr-action="return"]').disabled=!state.anchor||state.anchor.cursor>state.session.cursor;$('[data-blr-k]').disabled=state.settings.palette!=='cmyk';}
    function sync(){const s=state.settings;$('[data-blr-phase]').value=state.phase;$('[data-blr-left]').checked=s.left;$('[data-blr-right]').checked=s.right;$('[data-blr-palette]').value=s.palette;$('[data-blr-k]').value=s.K;$('[data-blr-marker]').value=s.marker;render();for(const f of [...readingListeners])f();}
    function command(action,value){try{state=apply(state,action,value);status.textContent=state.witness?'EXACT · '+state.witness.steps+' inverse Schritte · voller Zahlenanker bestätigt · Verlauf erhalten':action==='capture'?'Anker erfasst · Generation '+state.anchor.cursor:action==='step'?'Vorwärts · N′ = 10N − 2':'Ansicht / Zustand aktualisiert';sync();return true}catch(e){status.textContent=e.message;return false}}
    $('[data-blr-phase]').addEventListener('input',e=>command('phase',e.target.value));
    for(const button of host.querySelectorAll('[data-blr-stop]'))button.addEventListener('click',()=>command('phase',Number(button.dataset.blrStop)));
    for(const [key,selector,event,read] of [['left','left','change',e=>e.target.checked],['right','right','change',e=>e.target.checked],['palette','palette','change',e=>e.target.value],['K','k','input',e=>Number(e.target.value)],['marker','marker','change',e=>e.target.value]])$('[data-blr-'+selector+']').addEventListener(event,e=>command('settings',{[key]:read(e)}));
    for(const button of host.querySelectorAll('[data-blr-action]'))button.addEventListener('click',()=>{const a=button.dataset.blrAction;if(a==='swap')command('settings',{swap:!state.settings.swap});else if(a==='export'){const r=record(state);if(verify(r).status!=='PASS'){status.textContent='REJECT · Recordprüfung';return}const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(r,null,2)],{type:'application/json'})),link=doc.createElement('a');link.href=url;link.download='a0-bench-lens-return.json';link.click();win.setTimeout(()=>win.URL.revokeObjectURL(url),1000);status.textContent='PASS · Record geprüft und exportiert'}else command(a)});
    $('[data-blr-import]').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2*1024*1024)throw Error('Datei über 2 MiB');const result=verify(JSON.parse(await file.text()));status.textContent=result.status+' · importierter Record geprüft · aktueller Zustand unverändert'}catch(err){status.textContent='INVALID · '+err.message}e.target.value=''});
    sync();return{command,record:()=>record(state),subscribeReading(listener){readingListeners.add(listener);return()=>readingListeners.delete(listener);},get state(){return clone(state)}};
  }
  return{SCHEMA,create,apply,validate,snapshot,record,verify,mount};
});
