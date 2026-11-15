(()=>{
  'use strict';
  const root=document.querySelector('[data-janus-coordinate-atlas]');
  if(!root)return;
  const gate=root.querySelector('[data-jca-gate]'),frame=root.querySelector('[data-jca-frame]'),state=root.querySelector('[data-jca-state]'),open=root.querySelector('[data-jca-open]');
  function load(){
    if(frame.getAttribute('src')==='about:blank')frame.setAttribute('src',frame.dataset.src);
    state.textContent='OPEN · canonical source loaded';
  }
  function openAtlas(){gate.open=true;load();gate.scrollIntoView({block:'start',behavior:'smooth'});}
  gate.addEventListener('toggle',()=>{if(gate.open)load();else state.textContent='CLOSED · source retained';});
  open.addEventListener('click',openAtlas);
  if(location.hash==='#janusCoordinateAtlas'){gate.open=true;load();}
})();
