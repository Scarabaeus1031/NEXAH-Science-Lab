/* Source-owned engines: navigation and read-only comparison, not a whole-machine return. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0BenchBodyRouteController=api.mount(document);
})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const ROUTES=Object.freeze([
    Object.freeze({id:'interior',label:'01b · CRT16-Innenleben',page:'body',file:'A0_TESSAREC_BLUE_BODY_LAB.html',anchor:'blue-body-interior-crt16',reader:w=>w.A0BlueBodyInteriorController?.snapshot}),
    Object.freeze({id:'player',label:'01c · großer Blue Body / Player',page:'body',file:'A0_TESSAREC_BLUE_BODY_LAB.html',anchor:'pentagon-body-player',reader:w=>w.A0PentagonBodyPlayerView}),
    Object.freeze({id:'dodeca',label:'Dodeka · vier Satelliten + Return',page:'dodeca',file:'A0_BLUE_PINK_DODECA_CELL_RETURN.html',anchor:'cells',reader:w=>w.A0BluePinkDodecaCellReturnView?.captureState()}),
    Object.freeze({id:'flow',label:'One Flow · Schalen / Band / Grid',page:'dodeca',file:'A0_BLUE_PINK_DODECA_CELL_RETURN.html',anchor:'oneFlow',reader:w=>w.A0OneFlow?.snapshot})
  ]);
  const clone=x=>JSON.parse(JSON.stringify(x));
  function observe(route,frame,now){
    const base={route:route.id,source:route.file,anchor:route.anchor,observedAt:now()};
    if(!frame)return {...base,status:'UNLOADED',snapshot:null};
    try{
      const value=route.reader(frame.contentWindow);
      if(value===undefined||value===null)return {...base,status:'WAITING',snapshot:null};
      const text=JSON.stringify(value);
      if(text.length>2000000)throw Error('source snapshot exceeds 2 MB');
      return {...base,status:'READ',snapshot:JSON.parse(text)};
    }catch(error){return {...base,status:'HOLD',snapshot:null,error:String(error.message||error)};}
  }
  function mount(doc,options={}){
    const host=doc.getElementById('bodyRouteBench');
    if(!host)return null;
    const slot=doc.getElementById('bodyRouteFrameHost'),status=doc.getElementById('bodyRouteStatus'),out=doc.getElementById('bodyRouteRecord'),original=doc.getElementById('bodyRouteOriginal');
    const buttons=ROUTES.map(r=>doc.getElementById('bodyRoute_'+r.id));
    const now=options.now||(()=>new Date().toISOString());
    let body=null,active='interior',held=null;
    const sourceFrame=r=>r.page==='body'?body:doc.getElementById('nativeFaceSourceFrame');
    function fragmentFocus(route,frame){
      // Ordinary same-document fragment navigation remains available for opaque file origins.
      // Retain the complete URL/query; never replace the source page with a different engine.
      const current=String(frame.getAttribute?.('src')||frame.src||'');
      const base=current.split('#')[0],file=base.split('/').pop().split('?')[0];
      if(file!==route.file){status.textContent='HOLD · Quelladresse stimmt nicht; keine Navigation ausgeführt.';return;}
      frame.src=base+'#'+route.anchor;
      status.textContent=route.label+' · Fragmentnavigation im bestehenden Quellfenster. Direkter Readback bleibt ungeprüft; bei Browser-Sperre Original separat öffnen.';
    }
    function focusSource(route,frame){
      try{
        const sourceDoc=frame.contentDocument;
        if(!sourceDoc){fragmentFocus(route,frame);return;}
        const target=sourceDoc.getElementById(route.anchor);
        if(!target){status.textContent='WAITING · Zielabschnitt noch nicht verfügbar. Nach Laden erneut wählen oder Original separat öffnen.';return;}
        target.scrollIntoView({block:'start',behavior:'auto'});
        status.textContent=route.label+' · Originalabschnitt fokussiert; keine Quellwerte oder Uhren geändert.';
      }catch(error){fragmentFocus(route,frame);}
    }
    function render(){
      const route=ROUTES.find(r=>r.id===active);
      buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(ROUTES[i].id===active)));
      original.href=route.file+'#'+route.anchor;
      slot.hidden=route.page!=='body';
      doc.getElementById('bodyRouteUnload').disabled=!body;
      return route;
    }
    function select(id){
      const route=ROUTES.find(r=>r.id===id);
      if(!route)throw Error('Unknown body route');
      active=id;render();
      if(route.page==='body'&&!body){
        body=doc.createElement('iframe');body.id='bodyRouteSourceFrame';
        body.title='Original Body Lab · 01b und 01c · gemeinsame Quellsitzung';
        body.addEventListener('load',()=>{const current=ROUTES.find(r=>r.id===active);if(current.page==='body')focusSource(current,body);});
        body.src=route.file+'#'+route.anchor;
        slot.appendChild(body);render();
        status.textContent='Lädt · Body-Lab-Original. 01b/01c teilen diese eine Sitzung.';
      }else{
        const frame=sourceFrame(route);
        if(frame)focusSource(route,frame);
        else status.textContent='HOLD · vorhandenes Dodeka-Quellfenster fehlt.';
      }
      if(route.page==='dodeca'){
        const target=doc.getElementById('nativeFaceBridge');
        for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
        target?.scrollIntoView({block:'start',behavior:'auto'});
      }
      return route.id;
    }
    function collect(){
      held={schema:'a0.bench-body-route-comparison/1',activeRoute:active,sources:ROUTES.map(r=>observe(r,sourceFrame(r),now)),simultaneous:false,sharedClock:false,wholeMachineReturn:false,browserAcceptance:false,boundary:'Read-only observations, independently timestamped. No map from the 48-state carrier to 60 face slots or to One Flow; no restore or synchronization contract.'};
      out.textContent=JSON.stringify(held,null,2);
      status.textContent='Vergleich gehalten · '+held.sources.map(x=>x.route+': '+x.status).join(' · ')+' · kein Gesamt-Return.';
      return clone(held);
    }
    function unload(){
      if(body){body.remove();body=null;}
      render();status.textContent='Body-Lab entladen · Sitzung verworfen. Gehaltener Vergleich bleibt lesbar; Native Face / Dodeka läuft unabhängig weiter.';
    }
    buttons.forEach((button,i)=>button.addEventListener('click',()=>select(ROUTES[i].id)));
    doc.getElementById('bodyRouteCollect').addEventListener('click',collect);
    doc.getElementById('bodyRouteUnload').addEventListener('click',unload);
    render();
    return {select,collect,unload,get held(){return held?clone(held):null;}};
  }
  return {ROUTES,observe,mount};
});
