(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-trinity-lens.js'):root.A0TrinityLens);if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0CaroOrientationModes=api;root.A0CaroOrientationModesView=api.mount(document,root);}})(typeof globalThis==='undefined'?this:globalThis,function(T){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x)),markers=T.markers.slice(),gallery=[{"id":"triangle","title":"√3 / √7 · Dreieck","path":"assets/au-na-he-ti-reference/triangle.jpeg"},{"id":"root-grid","title":"Root-Grid / Nugget-Achse","path":"assets/au-na-he-ti-reference/root-grid.jpeg"},{"id":"saddle","title":"Rootroom / Saddle / Shadow","path":"assets/au-na-he-ti-reference/saddle.jpeg"},{"id":"mirror","title":"Symmetrie- und Spiegel-Dreieck","path":"assets/au-na-he-ti-reference/mirror.jpeg"},{"id":"sigil","title":"ÀU-NÁ-HÊ-TI ↔ CA-RO-THÉ-MA-NU","path":"assets/au-na-he-ti-reference/sigil.jpeg"},{"id":"spirals","title":"Innere / äußere DAO-Spirale","path":"assets/au-na-he-ti-reference/spirals.jpeg"},{"id":"gear29","title":"29 Zähne · historische Synchronisations-Tafel","path":"assets/au-na-he-ti-reference/gear29.jpeg"}];
  function valid(s){if(!s||Object.keys(s).sort().join(',')!=='direction,marker'||!['up','down'].includes(s.direction)||!markers.includes(s.marker))throw Error('INVALID · direction / reading marker');return s;}
  function create(){
    let state={direction:'up',marker:'dawn'},anchor=null,events=[];
    function command(type,payload={}){
      if(events.length>=128)throw Error('HOLD · Journal voll; zuerst exportieren');
      if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('INVALID · payload');
      let next=clone(state),saved=clone(anchor);
      if(type==='SET'){if(!Object.keys(payload).length||Object.keys(payload).some(k=>!['direction','marker'].includes(k)))throw Error('INVALID · fields');next=valid({...next,...payload});}
      else{if(Object.keys(payload).length)throw Error('INVALID · unexpected payload');if(type==='CAPTURE')saved=clone(state);else if(type==='RETURN'){if(!anchor)throw Error('HOLD · Ansichtsanker fehlt');next=clone(anchor);}else throw Error('INVALID · command');}
      state=next;anchor=saved;events.push({type,payload:clone(payload)});return clone(state);
    }
    function record(){return {schema:'a0.caro-orientation-modes/1',state:clone(state),anchor:clone(anchor),events:clone(events),semantics:{C:'Crossing · existing CARO label',D:'Day · owner alias for existing player view, not a fifth CARO phase',AV:'up/down display reflection, owner AM/VM direction reading; not a reassignment of Trinity signal roles',Q:'five existing manual Trinity reading markers; no calibrated five-state physical model',returnScope:'direction and reading marker only; not CARO channel/time, body player, phase or history',sharedClock:false}};}
    return {command,record,snapshot:()=>clone(state)};
  }
  function verify(r){try{const engine=create();if(!r||r.schema!=='a0.caro-orientation-modes/1'||!Array.isArray(r.events)||r.events.length>128)throw Error('record');for(const e of r.events){if(!e||Object.keys(e).sort().join(',')!=='payload,type')throw Error('event');engine.command(e.type,e.payload);}if(JSON.stringify(engine.record())!==JSON.stringify(r))throw Error('replay mismatch');return {status:r.anchor?'PASS':'HOLD'};}catch(e){return {status:'INVALID',reason:e.message};}}
  function geometry(phase,settings,direction){
    if(!['up','down'].includes(direction))throw Error('INVALID · direction');
    const source=T.snapshot(phase,settings),sign=direction==='up'?1:-1;
    const transform=points=>points.map(([x,y])=>[x,sign*y]);
    return {source,sign,left:transform(source.left),right:transform(source.right),overlap:transform(source.overlap),rootTriangle:[[0,0],[Math.sqrt(3),0],[0,sign*Math.sqrt(7)]],sourcePhaseUnchanged:true};
  }
  function drawing(r){
    const poly=p=>p.map(([x,y])=>[250+100*x,190-100*y].join(',')).join(' '),settings=r.source.contract.settings;
    let s='<svg viewBox="0 0 820 380" role="img" aria-label="Hoch oder runter: dieselbe Trinity-Geometrie und gespiegeltes Wurzeldreieck"><path d="M35 190H465M250 35V345" stroke="#456775"/>';
    if(settings.left)s+='<polygon points="'+poly(r.left)+'" fill="#efbd55" fill-opacity=".65"/>';
    if(settings.right)s+='<polygon points="'+poly(r.right)+'" fill="#54d7ef" fill-opacity=".65"/>';
    if(r.source.VM)s+='<polygon points="'+poly(r.overlap)+'" fill="#b78aef" stroke="#eee" stroke-width="2"/>';
    s+='<circle cx="250" cy="190" r="5" fill="#fff"/><text x="30" y="25" fill="#eee">C · CROSSING / Q° · LESERPOSITION</text><text x="30" y="365" fill="#eee">'+(r.sign===1?'A ↑ · AM-Richtungslesart':'V ↓ · VM-Richtungslesart')+' · gleiche Quellphase '+r.source.phase+'°</text>';
    const points=r.rootTriangle.map(([x,y])=>[555+60*x,190-60*y].join(',')).join(' ');
    return s+'<path d="M520 190H790" stroke="#456775"/><polygon points="'+points+'" fill="#b78aef" fill-opacity=".15" stroke="#efbd55" stroke-width="2"/><circle cx="555" cy="190" r="4" fill="#fff"/><text x="530" y="25" fill="#eee">ÀU-NÁ-HÊ-TI · √3 / √7</text><text x="530" y="345" fill="#eee">Hypotenuse √10 · Spiegelung y ↦ −y</text><text x="530" y="365" fill="#a9bdc9">Deklarierte Bildgeometrie, kein Frequenzgesetz</text></svg>';
  }
  function mount(doc,win={}){
    const host=doc.getElementById('caroOrientationModes');if(!host)return null;
    const el=id=>doc.getElementById(id);let engine=create();
    const make=(tag,text)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;return e;},marker=el('caroQMarker');
    markers.forEach((m,i)=>{const option=make('option',(i+1)+' · '+m.toUpperCase());option.value=m;marker.append(option);});
    function render(){
      const s=engine.snapshot(),lens=win.A0BenchLensReturnController?.state,phase=lens?.phase??0,settings=lens?.settings??T.defaults;
      el('caroDirectionSvg').innerHTML=drawing(geometry(phase,settings,s.direction));marker.value=s.marker;
      el('caroDirectionUp').setAttribute('aria-pressed',String(s.direction==='up'));el('caroDirectionDown').setAttribute('aria-pressed',String(s.direction==='down'));
      el('caroModeReturn').disabled=!engine.record().anchor;
      el('caroModeObservation').textContent='Richtung '+(s.direction==='up'?'A ↑':'V ↓')+' · Q°-Lesemarke '+s.marker.toUpperCase()+' · native Linsenmarke '+(lens?.settings?.marker??'NICHT VERFÜGBAR')+' · Phase '+phase+'° unverändert';
    }
    function setMarker(value){if(!markers.includes(value))throw Error('INVALID · marker');const lens=win.A0BenchLensReturnController;if(!lens||lens.command('settings',{marker:value})!==true)throw Error('HOLD · vorhandene Linsensteuerung nicht verfügbar');}
    function command(type,payload={}){
      try{
        const probe=create();for(const e of engine.record().events)probe.command(e.type,e.payload);probe.command(type,payload);
        if(type==='SET'&&payload.marker!==undefined){valid({...engine.snapshot(),...payload});if(engine.record().events.length>=128)throw Error('HOLD · Journal voll');setMarker(payload.marker);}
        if(type==='RETURN'){const r=engine.record();if(!r.anchor)throw Error('HOLD · Ansichtsanker fehlt');if(r.events.length>=128)throw Error('HOLD · Journal voll');setMarker(r.anchor.marker);}
        engine.command(type,payload);render();el('caroModeStatus').textContent=type==='RETURN'?'EXACT · Richtung und Lesemarke zurück; andere Quellenzustände unverändert':'Ansicht gesetzt · kein Quellenoperator ausgeführt';return true;
      }catch(e){el('caroModeStatus').textContent=e.message;render();return false;}
    }
    el('caroDirectionUp').addEventListener('click',()=>command('SET',{direction:'up'}));el('caroDirectionDown').addEventListener('click',()=>command('SET',{direction:'down'}));marker.addEventListener('change',()=>command('SET',{marker:marker.value}));
    el('caroModeCapture').addEventListener('click',()=>command('CAPTURE'));el('caroModeReturn').addEventListener('click',()=>command('RETURN'));
    function open(id,reading){
      const pane=win.A0BenchPerspectiveDeckView?.panes.A;if(!pane){el('caroModeStatus').textContent='HOLD · Quellfenster fehlt';return false;}
      if(reading&&!command('SET',{marker:reading}))return false;
      pane.unload();pane.select(id);pane.open();doc.getElementById('benchPerspectiveDeck')?.scrollIntoView({block:'start',behavior:'auto'});
      el('caroModeStatus').textContent='QUELLE ANGEFORDERT · '+id+' · Sitzung in Fenster A neu geöffnet, kein Master-Readback';return true;
    }
    for(const [id,source,reading] of [['caroDayOpen','body-day','day'],['caroNightOpen','body-night','night'],['caroMirrorOpen','body-mirror',null],['caroJanusOpen','janus',null],['caroConDaoOpen','condao',null],['caroQJoystickOpen','q-joystick',null],['caroQShadowOpen','q-shadow',null]])el(id).addEventListener('click',()=>open(source,reading));
    el('caroModeExport').addEventListener('click',()=>{const record=engine.record();if(verify(record).status==='INVALID')return;const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(record,null,2)],{type:'application/json'})),a=make('a');a.href=url;a.download='a0-caro-orientation-modes.json';a.click();win.URL.revokeObjectURL(url);});
    for(const item of gallery){const figure=make('figure'),a=make('a'),img=make('img');a.href=item.path;a.target='_blank';a.rel='noopener noreferrer';img.src=item.path;img.alt=item.title;img.loading='lazy';a.append(img);figure.append(a,make('figcaption',item.title));el('aunaReferenceGallery').append(figure);}
    const sourceHost=doc.getElementById('benchLensReturn');for(const event of ['input','change','click'])sourceHost?.addEventListener(event,render);
    render();return {command,open,render,record:()=>engine.record()};
  }
  return {markers,gallery,create,verify,geometry,drawing,mount};
});
