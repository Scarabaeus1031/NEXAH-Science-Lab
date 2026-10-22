/* Load the unchanged source page on explicit request; unload stops its own clocks. */
(function(root){
  'use strict';
  function mount(doc){
    const open=doc.getElementById('sewingSourceOpen'),close=doc.getElementById('sewingSourceClose'),host=doc.getElementById('sewingSourceFrameHost'),status=doc.getElementById('sewingSourceStatus');
    if(!open||!close||!host||!status)return null;
    let frame=null;
    function load(){
      if(frame)return;
      frame=doc.createElement('iframe');
      frame.title='Original AXIS08 · Sewing-Schaukeln und Atem-Partitur';
      frame.src='A0_AXIS08_FOLD_RETURN_SEQUENCER.html#pentagonSewing';
      frame.setAttribute('style','width:100%;height:850px;border:0;background:#020d15');
      host.appendChild(frame);open.disabled=true;close.disabled=false;
      status.textContent='Original geladen · eigene Uhr. Start/Pause und Return im Quellfenster bedienen. Entladen verwirft den lokalen Zustand.';
    }
    function unload(){
      if(frame){frame.remove();frame=null;}
      open.disabled=false;close.disabled=true;
      status.textContent='Quellfenster entladen · lokale Uhr und Zustand beendet. Gehaltene Returns bleiben nur erhalten, wenn vorher kopiert.';
    }
    open.addEventListener('click',load);close.addEventListener('click',unload);
    return {load,unload};
  }
  if(typeof module==='object'&&module.exports)module.exports={mount};
  if(root.document)mount(root.document);
})(typeof window==='undefined'?globalThis:window);
