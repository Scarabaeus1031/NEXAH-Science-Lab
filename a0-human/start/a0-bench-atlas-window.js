(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0BenchAtlasWindowController=api.mount(document,window);})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const SOURCE='A0_FAMILY_CONNECTION_ATLAS.html#tessarec';
  function mount(doc,win){
    const button=doc.getElementById('atlasTessarecOpen'),status=doc.getElementById('atlasTessarecStatus');if(!button)return null;
    function open(){
      const reader=win.A0CoupledWindowController;
      if(!reader||typeof reader.openDocument!=='function'){status.textContent='HOLD · Bench-Fenster nicht verfügbar. Original separat öffnen.';return {status:'HOLD'};}
      reader.openDocument(SOURCE,{trigger:button,title:'Atlas · Tessarec State / Phase / Observer',unloadOnClose:true,copy:'Vollständiges Original: Q4 / Q4×P3, Phasen, H(t), ±θ, Record-Formate und Big-Blue-Vergleich. Eigene Quelluhr, keine 5B-/Mixer-Synchronisierung. Schließen entlädt die Sitzung; wichtige Records vorher im Original exportieren.'});
      reader.setMaximized(true);
      status.textContent='Originalfenster angefordert · eigene Atlas-Regler und Uhr. Schließen entlädt die Sitzung; keine automatische Prüfung gestartet.';
      return {status:'REQUESTED',source:SOURCE,sharedClock:false,sourceValuesWritten:false};
    }
    button.addEventListener('click',open);return {open,source:SOURCE};
  }
  return {SOURCE,mount};
});
