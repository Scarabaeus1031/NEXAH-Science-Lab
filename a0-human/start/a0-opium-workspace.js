/* Navigation-only launch of the existing Club -> embedded Bench receiver. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0OpiumWorkspace=api.mount(root.document,root);})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const HASH='#clubBenchMonitorHost';
 function mount(doc,win){
  const button=doc.getElementById('clubOpenBenchMonitor'),host=doc.getElementById('clubBenchMonitorHost');if(!button||!host)return null;
  let requested=false;
  function open(){
   if(!win.A0PlayerBenchRelay){const status=doc.getElementById('clubBenchLinkStatus');if(status)status.textContent='HOLD · vorhandener Player/Bench-Anschluss nicht geladen';return false;}
   requested=true;button.click();return true;
  }
  function follow(){if(win.location.hash===HASH)open();}
  win.addEventListener('hashchange',follow);follow();
  win.addEventListener('pagehide',()=>win.removeEventListener?.('hashchange',follow));
  return Object.freeze({open,snapshot:()=>({requested,route:HASH,monitorCreatedBy:'existing A0PlayerBenchLink sender',playRequested:false,newSourceModel:false})});
 }
 return{HASH,mount};
});
