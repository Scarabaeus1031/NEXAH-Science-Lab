(()=>{
  'use strict';
  const $=id=>document.getElementById(id), qsa=s=>[...document.querySelectorAll(s)];
  const model=$('contactModel'), stage=$('viewerStage'), slider=$('phaseSlider');
  const duration=8, times={OPEN:0,CONTACT:4,RETURN:8};
  const views={FRONT:'0deg 74deg 2.35m',BACK:'180deg 74deg 2.35m',SECTION:'90deg 82deg 2.05m'};
  const sources={integrated:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb',crown:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb'};
  const contacts={U1:{role:'UP',p:[0,.3575,.19]},U2:{role:'UP',p:[-.3096040818529368,-.17875,.19]},U3:{role:'UP',p:[.30960408185293675,-.17875,.19]},D1:{role:'DOWN',p:[-.16,0,.19]},D2:{role:'DOWN',p:[.16,0,.19]},'WHITE PEARL':{role:'FIXED PIN',p:[0,0,.3838240640448317]}};
  let state='OPEN',view='FRONT',source='integrated',load='EQUAL',playing=false,phase=0;
  const fmt=n=>Math.abs(n)<5e-7?'0':Number(n.toFixed(6)).toString().replace('-', '−');
  const toGlb=([x,y,z])=>[.1*x,.1*z,-.1*y];
  function updatePhase(t){const clamped=Math.max(0,Math.min(duration,t));phase=clamped;model.currentTime=clamped;slider.value=String(clamped/duration*100);const pct=Math.round(clamped/duration*100);state=clamped<.05?'OPEN':Math.abs(clamped-4)<.05?'CONTACT':clamped>7.95?'RETURN':'TRANSIT';$('phaseState').textContent=`${state} · ${pct}%`;$('timeState').textContent=`t=${clamped.toFixed(2)} s`;$('viewLabel').textContent=`${view} · ${state} · t=${clamped.toFixed(2)}s`;$('contactState').textContent=state==='CONTACT'?'CONTACT PLANE / DECLARED':state==='RETURN'?'RETURN / SEPARATED':'OPEN / SEPARATED';qsa('[data-state]').forEach(b=>b.classList.toggle('active',b.dataset.state===state));}
  function setState(next){playing=false;model.pause?.();$('playToggle').textContent='▶ PLAY';updatePhase(times[next]);}
  qsa('[data-state]').forEach(b=>b.addEventListener('click',()=>setState(b.dataset.state)));
  $('stepState').addEventListener('click',()=>setState(state==='OPEN'?'CONTACT':state==='CONTACT'?'RETURN':'OPEN'));
  $('playToggle').addEventListener('click',()=>{playing=!playing;if(playing){if(model.currentTime>=7.98)model.currentTime=0;model.play?.();$('playToggle').textContent='Ⅱ PAUSE'}else{model.pause?.();$('playToggle').textContent='▶ PLAY'}});
  slider.addEventListener('input',()=>{playing=false;model.pause?.();$('playToggle').textContent='▶ PLAY';updatePhase(Number(slider.value)/100*duration)});
  model.addEventListener('timeupdate',()=>{if(playing){updatePhase(model.currentTime);if(model.currentTime>=7.98){playing=false;model.pause?.();$('playToggle').textContent='▶ PLAY'}}});
  qsa('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;model.cameraOrbit=views[view];stage.classList.toggle('section',view==='SECTION');qsa('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('viewLabel').textContent=`${view} · ${state} · t=${phase.toFixed(2)}s`}));
  qsa('[data-model]').forEach(b=>b.addEventListener('click',()=>{source=b.dataset.model;playing=false;model.pause?.();model.src=sources[source];$('modelLabel').textContent=source==='integrated'?'INTEGRATED 3+2':'CROWN SOURCE · TRIANGLE HIDDEN';qsa('[data-model]').forEach(x=>x.classList.toggle('active',x===b));setState('OPEN')}));
  qsa('[data-contact]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.contact,c=contacts[id],g=toGlb(c.p);qsa('[data-contact]').forEach(x=>x.classList.toggle('active',x.dataset.contact===id));$('contactId').textContent=`${id} · ${c.role}`;$('contactSource').textContent=c.p.map(fmt).join(' · ');$('contactGlb').textContent=g.map(fmt).join(' · ')}));
  qsa('[data-load]').forEach(b=>b.addEventListener('click',()=>{load=b.dataset.load;qsa('[data-load]').forEach(x=>x.classList.toggle('active',x===b));if(load==='EQUAL'){$('forceRead').textContent='+1';$('loadRead').textContent='UNBALANCED RESULTANT · CONSTRUCTION CASE'}else{$('forceRead').textContent='0';$('loadRead').textContent='STATIC RESULTANT ZERO · STABILITY OPEN'}}));
  model.addEventListener('load',()=>setState('OPEN'),{once:true});
  updatePhase(0);
})();
