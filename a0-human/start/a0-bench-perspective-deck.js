(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0BenchPerspectiveDeck=api;root.A0BenchPerspectiveDeckView=api.mount(document,root);}})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const orbit='A0_SCIENTIFIC_POSITION_REPORT.html';
  const synthesis=orbit+'NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html';
  const miwa='A0_SCIENTIFIC_POSITION_REPORT.html';
  const sources=[
    ...[['loki','LOKI · vier Generatoren / acht Green Bridges'],['h3','H3 · Spiegel / Pentagon'],['e8','E8 · Mutation / Coxeter'],['astrolabe','Astrolabium · zwölf Flächen'],['roman','Roman Stack · PP / RP / Ghost']].map(([mode,title])=>({id:'synthesis-'+mode,title,path:synthesis+'?a0BenchPreset=synthesis-'+mode,kind:'SOURCE_OPERATOR',note:'Originalgeneratoren und MIWA-Schnitt direkt bedienen. Wortlauf höchstens 128 Schritte; Reset, Moduswechsel und manuelle Generatorwahl brechen offene Wörter ab. Keine 5B-Masteruhr.'})),
    ...[['outside','Gesamt / Milky Way / Pineal / Andromeda'],['earth','Earth Sky'],['solar','Solar System'],['saturn','Saturn / Titan'],['uranus','Uranus / Moons'],['loki','Green Bridge / Loki'],['closure','Closure Transit']].map(([mode,title])=>({id:'miwa-'+mode,title:'MIWA · '+title,path:miwa+'?a0BenchPreset=miwa-'+mode,kind:'SOURCE_VIEW',note:'Originalmodus mit eigener Uhr und sämtlichen nativen Reglern. Astronomische Frames bleiben schematisch; keine neue Messung.'})),
    ...['day','night','mirror'].map(mode=>({id:'body-'+mode,title:'Körperplayer · '+mode.toUpperCase(),path:'A0_TESSAREC_BLUE_BODY_LAB.html?a0BenchPreset=body-'+mode+'#pentagon-body-player',kind:'SOURCE_VIEW',note:'Vorhandene Day/Night/View-Mirror-Ansicht des 48er-Players. Quellsequenz pausiert; native Kamerabewegung bleibt quelleneigen. Kein CARO-Hell/Dunkel und keine neue Quellsequenz.'})),
    {id:'q-joystick',title:'Q° · Relational Joystick / vier Basisblätter',path:'assets/fields-and-joints/Q_DEGREE_RELATIONAL_JOYSTICK_PLAYER.html',kind:'SOURCE_VIEW',note:'Original: q=a+bi+cj+dk, zentrale Q°-Steuerrolle und normierte Joystickposition. Q° ist ausdrücklich keine fünfte Quaternion-Komponente; keine Identität mit fünf Tages-Lesemarken.'},
    {id:'q-shadow',title:'Q° · Shadow Switchyard / Projektion',path:'assets/fields-and-joints/Q_DEGREE_SHADOW_SWITCHYARD_PLAYER.html',kind:'SOURCE_VIEW',note:'Originalplayer für Shadowposition, Projektion und Q°-Linie. Eigene Controls, keine Übertragung physikalischer oder Quaternionalgebra-Claims.'},
    {id:'janus',title:'Janus · Arithmetic Ladder / Spiegelmitte',path:'A0_SCIENTIFIC_POSITION_REPORT.html',kind:'SOURCE_OPERATOR',note:'Bestehende affine Spiegelungen und sieben Leiterpositionen; nicht automatisch Bench-J oder CARO-Richtungswechsel.'},
    {id:'condao',title:'Janus · CON–DAO / Atemsequenz',path:'A0_SCIENTIFIC_POSITION_REPORT.html',kind:'SOURCE_OPERATOR',note:'Vorhandene CON–DAO-Zustände mit Janus-Partnern. Eigene Sequenz, nicht die fünf manuellen Q°-Lesemarken.'},
    {id:'flower',title:'Tessarec · andere Flower / Hülle / Gegenblick',path:'A0_FAMILY_CONNECTION_ATLAS.html#tessarec',kind:'SOURCE_VIEW',note:'Q3 / Q4 / Q4×P3, intrinsische Hülle und Beobachter ±θ. Eigene Atlas-Phase; keine automatische Gleichsetzung mit dem 5B-Ansichtsflip.'},
    {id:'box',title:'Box innen · Quadrat / Dreieck / CON–DAO',path:'A0_TESSAREC_BLUE_BODY_LAB.html#fold-contact',kind:'SOURCE_VIEW',note:'Vier Quadratklappen oder drei Kite-Klappen; Schnitt t, Verlängerung e, Faltwinkel und Boden. Innenkreis = berechnete Öffnung, kein nachgewiesener 3D-Zylinder.'},
    {id:'cylinder',title:'Platte / Zylinder · Naht und M7',path:'A0_TESSAREC_BLUE_BODY_LAB.html#double',kind:'SOURCE_VIEW',note:'Bestehende Platte-/Zylinderansicht und Naht im Original; von der Boxöffnung getrennt.'},
    {id:'critical',title:'Critical Orbit · Mandelbrot ↔ Julia / Bündelung',path:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#formation',kind:'SOURCE_OPERATOR',note:'Links Parameterraum c, rechts dynamische Ebene z: derselbe c verbindet beide Fenster. Kritische Bahn z₀=0, zₙ₊₁=zₙ²+c. Achse/Kern/Rand/Envelope bündeln die Ansicht, nicht die Quelldaten. Endliches N ist kein allgemeiner Innerheitsbeweis.'},
    {id:'aperture',title:'Apertur · Root Room / Blickrichtung / Schatten',path:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#rootRoom',kind:'SOURCE_VIEW',note:'Mandelbrot → Orientierung → Julia für denselben Parameter; Φ / π / √2 sind getrennte Ansichtsrollen.'},
    {id:'plate',title:'Teller / One Flow · Orbit / Membran / TESA',path:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#oneFlow',kind:'SOURCE_VIEW',note:'Kontakt → Schalen → Teller → Critical Orbit → Boundary-Band → TESA. Native Modi wählen; keine erzwungene Gesamtmechanik.'},
    {id:'pascal',title:'Pascal-Faden · Grid / Bügel / Spirale / Membran',path:'A0_NUMBERMAGICK_GRID_RESEARCH.html#pascal-thread-demonstrator',kind:'SOURCE_OPERATOR',note:'Ein Pascal-Pfad, mehrere deklarierte Ansichten und Faserordinal-Return. Exakter historischer Membrangenerator bleibt offen.'},
    {id:'grids',title:'Pink- / Ghost-Grids · Quellen und Gegenfenster',path:'A0_NUMBERMAGICK_GRID_RESEARCH.html#grid-collection',kind:'SOURCE_VIEW',note:'Pink, Ghost und Pascal bleiben typisierte Quellen mit eigenen Decodern; keine allgemeine Farbidentität.'},
    {id:'pink',title:'Pink Diamond · Grid Atlas',path:'A0_PINK_DIAMOND_GRID_ATLAS.html',kind:'SOURCE_VIEW',note:'Bestehende Pink-Grid-Ansichten und Adressen; keine automatische Übernahme in LOKI.'},
    {id:'joint',title:'Pascal / Ghost Joint · Boundary Graph',path:'A0_BOUNDARY_GRAPH_DEMONSTRATOR.html',kind:'SOURCE_VIEW',note:'Felder, gekreuzte Grenzen, Pillars, Hinge und Joint bleiben im Original unterscheidbar.'},
    {id:'ihara',title:'Ihara / Hashimoto · Kante → Zyklus → Zeta',path:'A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html',kind:'SOURCE_OPERATOR',note:'Nicht unmittelbar rücklaufende Wege im endlichen Graphen. Keine Identität mit Riemann-Zeta oder einem optischen Tunnel.'}
  ].map(Object.freeze);
  function mount(doc,win={}){
    const host=doc.getElementById('benchPerspectiveDeck');if(!host)return null;
    const make=(tag,text)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
    const panes={};
    for(const lane of ['A','B']){
      const root=doc.getElementById('perspectivePane'+lane),label=make('label','Quelle '+lane+' / Modus '),select=make('select');
      select.setAttribute('aria-label','Quellmodus '+lane);sources.forEach(s=>{const option=make('option',s.title);option.value=s.id;select.append(option);});select.value=lane==='A'?'synthesis-loki':'flower';label.append(select);
      const note=make('p'),actions=make('div'),load=make('button','Hier laden'),close=make('button','Entladen'),link=make('a','Original separat ↗'),status=make('p','NICHT GELADEN'),slot=make('div');
      actions.className='perspective-actions';slot.className='perspective-slot';status.setAttribute('role','status');load.type=close.type='button';close.disabled=true;link.target='_blank';link.rel='noopener noreferrer';let frame=null,active=null,loaded=false;
      const choose=()=>sources.find(s=>s.id===select.value);
      function describe(){const s=choose();note.textContent=s.note;link.href=s.path;}
      function unload(){if(!frame)return;const old=frame;frame=null;active=null;loaded=false;old.src='about:blank';slot.replaceChildren();select.disabled=false;load.disabled=false;close.disabled=true;status.textContent='ENTLADEN · Sitzung verworfen, kein Return; separate Fenster bleiben unabhängig.';}
      function open(){if(frame)return {status:'ALREADY_LOADED'};const s=choose();if(!s)throw Error('Unknown source');active=s.id;loaded=false;const current=make('iframe');frame=current;current.title='Quelle '+lane+' · '+s.title;current.setAttribute('referrerpolicy','no-referrer');
        current.addEventListener('load',()=>{if(frame!==current)return;loaded=true;status.textContent='DOKUMENT GELADEN · native Regler im Fenster bedienen; dies bestätigt keinen gemeinsamen Zustandsvertrag.';});
        current.addEventListener('error',()=>{if(frame===current){loaded=false;status.textContent='HOLD · Original separat öffnen; kein Zugriff bestätigt.';}});
        current.src=s.path;slot.replaceChildren(current);select.disabled=true;load.disabled=true;close.disabled=false;status.textContent='ANGEFORDERT · '+s.title+' · native Animationen können starten.';return {status:'REQUESTED',source:s.id};
      }
      load.addEventListener('click',open);close.addEventListener('click',unload);select.addEventListener('change',describe);actions.append(load,close,link);root.append(label,note,actions,status,slot);describe();
      panes[lane]={open,unload,select(id){if(frame)throw Error('Quelle zuerst entladen');if(!sources.some(s=>s.id===id))throw Error('Unknown source');select.value=id;describe();},snapshot:()=>({requested:active,documentLoaded:loaded,modeReadback:false,sharedClock:false})};
    }
    function compare(a,b){for(const lane of ['A','B'])panes[lane].unload();panes.A.select(a);panes.B.select(b);panes.A.open();panes.B.open();}
    doc.getElementById('perspectivePairLoki').addEventListener('click',()=>compare('synthesis-loki','miwa-loki'));
    doc.getElementById('perspectivePairFlower').addEventListener('click',()=>compare('flower','box'));
    doc.getElementById('perspectivePairOrbit').addEventListener('click',()=>compare('critical','plate'));
    doc.getElementById('perspectivePairJoint').addEventListener('click',()=>compare('pascal','joint'));
    doc.getElementById('perspectiveUnloadAll').addEventListener('click',()=>{panes.A.unload();panes.B.unload();});
    let fold=null;
    function accept(record){
      fold=JSON.parse(JSON.stringify(record));const enabled=doc.getElementById('foldCycleEnabled')?.checked??false,coupled=win.A0FoldCycleCoupling?.snapshot(record,enabled);
      doc.getElementById('perspectiveFoldReadout').textContent='5B · Z '+record.slice+'/28 · Pose '+(record.slice+1)+'/29 · '+(coupled?.flip?'ABSCHLUSS / ANSICHTSFLIP':'laufende Pose')+' · Quellfenster bleiben unabhängig';
      if(win.A0FoldLagLens)doc.getElementById('perspectiveFoldSvg').innerHTML=coupled?win.A0FoldCycleCoupling.presentation(coupled):win.A0FoldLagLens.drawing(record);
    }
    const view=win.A0FoldLagView;if(view){const previous=view.onRender;view.onRender=record=>{if(previous)previous(record);accept(record);};accept(view.snapshot());}
    else doc.getElementById('perspectiveFoldReadout').textContent='HOLD · 5B-Quelle nicht verfügbar';
    function snapshot(){return {schema:'a0.bench-perspective-deck/1',panes:{A:panes.A.snapshot(),B:panes.B.snapshot()},fold,sharedClock:false,sharedCarrier:false,wholeMachineReturn:false,browserAcceptance:false,unresolved:['Pol 7↔8 address binding','Algo graph → 5B operator binding','box aperture → spatial cylinder','historical membrane generator']};}
    doc.getElementById('perspectiveExport').addEventListener('click',()=>{const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'})),a=make('a');a.href=url;a.download='a0-perspective-deck.json';a.click();win.URL.revokeObjectURL(url);});
    return {panes,compare,snapshot,accept};
  }
  return {sources,mount};
});
