(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0BenchSourceSections=api;root.A0BenchSourceSectionsController=api.mount(document,root);}})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const FILE='A0_BLUE_PINK_DODECA_CELL_RETURN.html';
  const SECTIONS=Object.freeze([
    {id:'tesa',anchor:'registerOverlay',label:'TESA · Raster verschieben'},
    {id:'lissajous',anchor:'threeLissajousPlanes',label:'AM / VM / PM + Overlay'},
    {id:'measurement',anchor:'sharedMeasurement',label:'Shared View · Adresse · Schnitt'},
    {id:'distance',anchor:'lissajousDistanceMeter',label:'Strecken / Verhältnisse'},
    {id:'signals',anchor:'shadowDisplacementTracker',label:'Signalschreiber'},
    {id:'grid',anchor:'flowGrid',label:'1000×1000 · Ausschnitt'},
    {id:'formation',anchor:'formation',label:'Mandelbrot / Julia / Critical Orbit'},
    {id:'chamber',anchor:'shadowChamberInstrument',label:'Apertur → Teller'},
    {id:'flow',anchor:'oneFlow',label:'Schalen / Teller / Möbius'}
  ].map(Object.freeze));
  function mount(doc,win={}){
    const host=doc.getElementById('sourceSections'),frame=doc.getElementById('nativeFaceSourceFrame');if(!host||!frame)return null;
    const status=doc.getElementById('sourceSectionsStatus'),original=doc.getElementById('sourceSectionsOriginal');let active=null;
    function focus(allowNavigation){
      const section=SECTIONS.find(s=>s.id===active);if(!section)return null;
      const current=String(frame.getAttribute?.('src')||frame.src||''),base=current.split('#')[0];
      if(base.split('/').pop().split('?')[0]!==FILE){status.textContent='HOLD · unerwartete Quelladresse; nichts navigiert.';return{status:'HOLD',anchor:section.anchor};}
      original.href=base+'#'+section.anchor;
      try{const target=frame.contentDocument?.getElementById(section.anchor);if(target){target.scrollIntoView({block:'start',behavior:'auto'});status.textContent='ABSCHNITT FOKUSSIERT · '+section.label+' · Original selbst bedienen; keine Quellwerte geschrieben.';return{status:'FOCUSED',anchor:section.anchor};}}catch(_){/* opaque file origins: ordinary fragment navigation, no access workaround */}
      if(allowNavigation){frame.src=base+'#'+section.anchor;status.textContent='FRAGMENT ANGEFORDERT · '+section.label+' · Browserzugriff nicht bestätigt; ggf. Original separat öffnen.';return{status:'FRAGMENT_REQUESTED',anchor:section.anchor};}
      status.textContent='WAITING · Abschnitt nicht lesbar/verfügbar. Original separat öffnen oder erneut wählen.';return{status:'WAITING',anchor:section.anchor};
    }
    function select(id){
      if(!SECTIONS.some(s=>s.id===id))throw Error('unknown source section');
      win.A0CoupledWindowController?.close?.({restoreFocus:false});active=id;
      const bridge=doc.getElementById('nativeFaceBridge');for(let node=bridge;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
      bridge?.classList.add('source-section-expanded');doc.getElementById('sourceSectionsSize')?.setAttribute('aria-pressed','true');
      SECTIONS.forEach(s=>doc.getElementById('sourceSection_'+s.id)?.setAttribute('aria-pressed',String(s.id===id)));
      host.scrollIntoView({block:'start',behavior:'auto'});return focus(true);
    }
    SECTIONS.forEach(s=>doc.getElementById('sourceSection_'+s.id)?.addEventListener('click',()=>select(s.id)));
    frame.addEventListener('load',()=>focus(false));
    doc.getElementById('sourceSectionsSize')?.addEventListener('click',()=>{const bridge=doc.getElementById('nativeFaceBridge'),on=bridge.classList.toggle('source-section-expanded');doc.getElementById('sourceSectionsSize').setAttribute('aria-pressed',String(on));});
    return{select,get active(){return active;},sharedFrame:true,sharedClock:false,wholeMachineReturn:false};
  }
  return{FILE,SECTIONS,mount};
});
