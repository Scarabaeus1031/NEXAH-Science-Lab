(()=>{
  'use strict';
  const root=document.querySelector('[data-janus-coordinate-atlas]');
  if(!root)return;
  const gate=root.querySelector('[data-jca-gate]');
  const frame=root.querySelector('[data-jca-frame]');
  const state=root.querySelector('[data-jca-state]');
  const openAtlasButton=root.querySelector('[data-jca-open]');
  const openCurtainButton=root.querySelector('[data-jca-curtain]');
  const views=new Set(['atlas','curtain']);
  let pendingView='atlas';

  function sourceFor(view){
    const url=new URL(frame.dataset.src,document.baseURI);
    url.searchParams.set('view',view);
    url.hash=view;
    return url.href;
  }
  function dispatchView(view){
    if(!views.has(view))return false;
    const instrument=frame.contentWindow&&frame.contentWindow.A0NativeInstrument;
    if(!instrument||typeof instrument.dispatch!=='function')return false;
    const payload=view==='curtain'
      ?{view:'curtain',curtainStage:0,curtainX:11357,curtainCenter:11947,curtainDrift:0,curtainMapped:true}
      :{view:'atlas'};
    instrument.dispatch({command:'SET',payload});
    root.dataset.jcaView=view;
    state.textContent=`OPEN · ${view.toUpperCase()} · canonical source`;
    return true;
  }
  function load(view='atlas'){
    pendingView=views.has(view)?view:'atlas';
    root.dataset.jcaView=pendingView;
    if(frame.getAttribute('src')==='about:blank'){
      frame.setAttribute('src',sourceFor(pendingView));
      state.textContent=`LOADING · ${pendingView.toUpperCase()} · canonical source`;
      return;
    }
    if(!dispatchView(pendingView))state.textContent=`OPEN · ${pendingView.toUpperCase()} · source preset retained`;
  }
  function openView(view){
    gate.open=true;
    load(view);
    gate.scrollIntoView({block:'start',behavior:'smooth'});
  }
  frame.addEventListener('load',()=>dispatchView(pendingView));
  gate.addEventListener('toggle',()=>{if(gate.open)load(pendingView);else state.textContent=`CLOSED · ${pendingView.toUpperCase()} · source retained`;});
  openAtlasButton.addEventListener('click',()=>openView('atlas'));
  openCurtainButton.addEventListener('click',()=>openView('curtain'));
  if(location.hash==='#janusCurtainReturn')openView('curtain');
  else if(location.hash==='#janusCoordinateAtlas'){gate.open=true;load('atlas');}
})();
