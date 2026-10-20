(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0BenchShowcaseTour=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='2.0.0';
  const SOURCE_STATIONS=Object.freeze([
    Object.freeze({id:'division-return',target:'divisionReturnBench',scenario:'division-return',title:'Teilung · Übersetzung · Return',copy:'Drei eigene A/B-Verträge: gerichteter Split Rest, natives Re/ST-Profil, CRT-Reste mit vollständigem Quotienten-Return. Quellen erfassen und Regeln ausdrücklich anwenden.'}),
    Object.freeze({id:'lens-return',target:'benchLensReturn',scenario:'lens-return',title:'Linse → VM → Zahlenreturn',copy:'Zwei Linsen, markierte Überlagerung und separater exakter 978-Kanal. Anker erfassen, vorwärts gehen und inverse Schritte am vollen Integer prüfen.'}),
    Object.freeze({id:'launch',target:'masterCockpit',scenario:'control',title:'Master Cockpit',copy:'Die gemeinsame Regie startet. Alle Übergaben bleiben typisiert und sichtbar.'}),
    Object.freeze({id:'binder',target:'systemBinder',scenario:'control',title:'System Binder · Engines an',copy:'M3, Aperture Stack und Master laufen; PENT und LIFE03 folgen über ihre Source-Adapter.'}),
    Object.freeze({id:'native-face',target:'nativeFaceBridge',scenario:'native',title:'Native Face · echte Quelle',copy:'Eine adressierte Blue/Pink/Dodeca-Fläche bewegt sich an einer expliziten Scharnierkante; der Renderer bestätigt den Zustand.'}),
    Object.freeze({id:'ail',target:'ailApertureControl',scenario:'native',title:'A · i · l · typisierte Apertur',copy:'A adressiert die Quellfläche, i liest den lokalen Punkt und l bewegt ausschließlich das deklarierte Scharnier.'}),
    Object.freeze({id:'ninefold',target:'fourApertureNinefold',scenario:'native',title:'Four Apertures · 4×2+1',copy:'Vier Quellflächen laufen outbound und inbound um den zentralen Return-Pivot.'}),
    Object.freeze({id:'replay',target:'ocbRecordReplay',scenario:'native',title:'Record / Replay · prüfbarer Return',copy:'Native Face, A·i·l und Ninefold werden in einer versionierten Hülle gesichert, geprüft und exakt zur Quelle zurückgeführt.'}),
    Object.freeze({id:'family-grid-life',target:'familyGridCoupler',view:'life',title:'Family / Life · source grid',copy:'Das lokale 11er-Register zeigt 1/0, aktuellen Puls und pinken Ein-Schritt-Ghost.'}),
    Object.freeze({id:'family-grid-plate',target:'familyGridCoupler',view:'plate',title:'Game4Life+1 · flache Platte',copy:'Dieselben elf Displayzellen liegen in der flachen FINITE_DEAD_FIELD-Lesart.'}),
    Object.freeze({id:'family-grid-cylinder',target:'familyGridCoupler',view:'cylinder',title:'Game4Life+1 · Zylinder / Q°',copy:'q wird als θ=2πq/11 in Grad, exaktem π-Ausdruck und Dezimal-Radiant gelesen.'}),
    Object.freeze({id:'m3-unrolled',target:'apertureMeasurement',scenario:'measurement',view:'unrolled',title:'M3 · Unrolled',copy:'48 geordnete Samples als abgewickelte Spur.'}),
    Object.freeze({id:'m3-cylinder',target:'apertureMeasurement',scenario:'measurement',view:'cylinder',title:'M3 · Cylinder',copy:'Dieselben Samples, gerollte Zylinderansicht.'}),
    Object.freeze({id:'m3-top',target:'apertureMeasurement',scenario:'measurement',view:'top',title:'M3 · Top',copy:'Draufsicht auf denselben Carrier; keine neue Messung.'}),
    Object.freeze({id:'m3-slice',target:'apertureMeasurement',scenario:'measurement',view:'slice',title:'M3 · Aperture Slice',copy:'Apertur gegen Höhe; Azimut bleibt im Record erhalten.'}),
    Object.freeze({id:'stack',target:'apertureStackCalibration',scenario:'measurement',title:'Aperture Stack',copy:'Kalibrierung und Return laufen neben M3 auf derselben geordneten Quelle.'}),
    Object.freeze({id:'pent',target:'pentagonWorkbench',scenario:'bridges',title:'PENT · Source Adapter',copy:'Der vorhandene PENT-Zustand bleibt ein eigener Carrier mit bestätigter Übergabe.'}),
    Object.freeze({id:'life03',target:'life03Workbench',scenario:'bridges',title:'LIFE03 · Source Adapter',copy:'Life/E8 behält eigene Sitzung und Uhr; die Bench zeigt nur den typisierten Handoff.'}),
    Object.freeze({id:'adapter-a',target:'adapterPackA',scenario:'adapters',title:'Paket A · JARP + Axial Carrier',copy:'Zehn eingefrorene Return-Fälle und sechs getypte Projektions-Lanes laufen als getrennte Source-Records.'}),
    Object.freeze({id:'adapter-b',target:'adapterPackB',scenario:'adapters',title:'Paket B · Fold + Boundary',copy:'AXIS08 führt 8→7+Residual→8 vor; Boundary wechselt Fläche, Naht, Graph und Pascal-Lesart.'}),
    Object.freeze({id:'moving-window',target:'coupledWindowHub',scenario:'window',title:'Moving Aperture · Return Window',copy:'Ein 2×2- oder 3×3-Fenster wandert über Dürer und Khajuraho. Gleiche Messwerte können verschiedene Orte verdecken; ein getyptes Residual stellt den Return wieder her.'}),
    Object.freeze({id:'aperture-observatory',target:'coupledWindowHub',scenario:'observatory',title:'Aperture Invariance Observatory',copy:'Rotation, Spiegelung, Translation und Kontrollpermutation zeigen, ob Fensterwerte invariant, nur ortsverschoben oder platzierungsabhängig sind.'}),
    Object.freeze({id:'session-ledger',target:'coupledWindowHub',scenario:'ledger',title:'Coupled Session Ledger',copy:'Getypte Fensterrecords werden gesammelt, verglichen, wieder geöffnet und als begrenzter Engineering-Receipt exportiert.'}),
    Object.freeze({id:'return-economy',target:'returnEconomyDemonstrator',scenario:'economy',title:'Return Economy · drei Carrier im Vergleich',copy:'Alle drei Lanes rekonstruieren ihre Quelle exakt. Nur der Typed Seam liegt unter seiner Raw-Baseline.'}),
    Object.freeze({id:'finite-antipode',target:'finite-antipode',scenario:'antipode',title:'Antipode · typed source operator',copy:'C6/C8 exact vertex antipode; C7 HOLD. Band seam and six chart readings remain separate.'}),
    Object.freeze({id:'finite-ghostgons',target:'finite-ghostgons',scenario:'ghostgons',title:'Ghostgons · 17 / 19 / 23',copy:'Order changes the complete state contract. Capture, phase step, negative controls and exact source Return.'}),
    Object.freeze({id:'root',target:'root7ProjectionOverlay',scenario:'root',title:'Root / Projection / Return',copy:'Schichten, Projektionen und der deklarierte Return schließen den Rundgang.'})
  ]);

  const EXTRA=[
  {
    "id": "body-interior",
    "target": "bodyRouteBench",
    "title": "01b · Blue Body von innen",
    "copy": "Körperquelle öffnen; 01b und 01c teilen dieselbe Quellsitzung.",
    "chapter": "Quelle & Körper",
    "local": true
  },
  {
    "id": "body-player",
    "target": "bodyRouteBench",
    "title": "01c · Körper bespielen",
    "copy": "Wir wechseln im selben Originalfenster zum Body-Player. Bei blockiertem Zugriff im Original selbst bedienen.",
    "chapter": "Quelle & Körper",
    "local": true
  },
  {
    "id": "body-dodeca",
    "target": "nativeFaceBridge",
    "title": "Blue Body → Dodeka",
    "copy": "Die vorhandene Dodeka-Quelle bleibt ein eigener Carrier. Diese Navigation behauptet keine Körperidentität.",
    "chapter": "Quelle & Körper",
    "local": true
  },
  {
    "id": "one-flow",
    "target": "nativeFaceBridge",
    "title": "One Flow · Teller / Band / Grid",
    "copy": "Zum ursprünglichen One-Flow-Abschnitt wechseln. Das Quellfenster behält seine eigene Uhr.",
    "chapter": "Quelle & Körper",
    "local": true
  },
  {
    "id": "glb-sources",
    "target": "nsnGlbSources",
    "title": "GLB-Fundus · die Körper sind da",
    "copy": "17 Floors, Kristall, Double Crown und Chiron: Quellen und Fundorte lesen. Keine Datei wird automatisch heruntergeladen.",
    "chapter": "Quelle & Körper",
    "local": true
  },
  {
    "id": "mask-overview",
    "target": "maskObserverBench",
    "title": "Zwei Körper · zwei Masken",
    "copy": "Wir setzen Pentagone, Tick 0 und erfassen den lokalen Anker. Die Tour verändert Regler und überschreibt diesen lokalen Anker.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "mask-lrrl",
    "target": "maskObserverBench",
    "title": "LRRL · Verschiebung live",
    "copy": "Der vorhandene Player fährt einen vollständigen Ausflug. Beobachte Schnittzahlen, Maskenhälften und zugelassene/gesperrte Spur.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "mask-rllr",
    "target": "maskObserverBench",
    "title": "RLLR · Gegenlesart",
    "copy": "Dasselbe Modell, umgekehrtes Wegwort. Die Spur speichert besuchte Ticks, keine unbegrenzte Vergangenheit.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "mask-return",
    "target": "maskObserverBench",
    "title": "Zurück zum erfassten Zustand",
    "copy": "Return stellt den zuvor erfassten Masken-/Montagezustand her. Kein physikalischer Rückwärtslauf.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "teller-am",
    "target": "maskAssemblySvg",
    "title": "Teller · AM · Linse auf der Acht",
    "copy": "AM auswählen, denselben Tick bewegen. Teller, Bandmarker und Detail-Linse lesen die lokale Phase.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "teller-vm",
    "target": "maskAssemblySvg",
    "title": "Teller · VM · Ansicht um 90°",
    "copy": "VM plus Vierteldrehung: Ansicht wechseln, nicht den Träger austauschen. Nutze Pause, um die Regler selbst auszuprobieren.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "teller-pm",
    "target": "maskCompassTitle",
    "title": "PM · Kompass / Goldring",
    "copy": "PM liest das dritte Paar. Gerichtete Nadel, zeitliche Kreuze und Goldring sind von den vier 5B-Flügeln getrennt.",
    "chapter": "Maske & Teller",
    "local": true
  },
  {
    "id": "fold-play",
    "target": "foldLagLens",
    "title": "Lila 5B · vier Flügel live",
    "copy": "Originale 29-Posen-Folge starten: vier unabhängige starre Flügel, Nachlauf 3. Der Z-Stapel ist ein Sequenzindex.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "fold-mirror",
    "target": "foldLagLens",
    "title": "Andere Seite · Spiegeloperator",
    "copy": "Horizontal spiegeln und Schnitt 14 wählen. Der feste weiße Kreuzrahmen bleibt die Referenz.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "fold-end",
    "target": "foldLagLens",
    "title": "Pose 29 · Grenze sichtbar",
    "copy": "Index 28 ist die 29. Pose. Zielwinkel endet bei 7°: noch keine geometrisch bestätigte Wende oder geschlossener Falt-Return.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "codes-a",
    "target": "codeCalendarLens",
    "title": "3+1 · Datum / Code / V",
    "copy": "Originale 1974/1972-Zeugen und 9/8/10. Paar A und Verhältnis 3:4 unabhängig wählen, Auswahl erfassen.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "codes-b",
    "target": "codeCalendarLens",
    "title": "Paar B · 2:3 · Gegenrichtung",
    "copy": "132 ↔ 231 und 2:3 vergleichen. Die Adressen 7↔9 / 8↔10 sind keine bestätigte Kalender- oder AM/PM-Umrechnung.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "codes-c",
    "target": "codeCalendarLens",
    "title": "Paar C · 1:2 · Prüfmatrix",
    "copy": "213 ↔ 312 und 1:2 wählen; die vorhandenen 93 Comparator-Prüfungen ausführen. Kein Test einer Bewegungsregel.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "codes-return",
    "target": "codeCalendarLens",
    "title": "Auswahl zurückholen",
    "copy": "Zur zuvor erfassten A-/3:4-Auswahl zurückkehren. Die offenen Bindungen bleiben im Record ausdrücklich null.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "caro-open",
    "target": "caroControlBench",
    "title": "CARO · Green Mirror",
    "copy": "Originalgeometrie öffnen, lokalen Zustand erfassen und SVG-Präsentation starten. Fehlt SVG-Zeitsteuerung, bleibt HOLD sichtbar.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "caro-closed",
    "target": "caroControlBench",
    "title": "CARO · Kanal schließen",
    "copy": "Kanal schließen und Präsentationszeit um ¼ Sekunde schalten. Lotus und Spiegel sind Quellgeometrie.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "caro-return",
    "target": "caroControlBench",
    "title": "CARO · Return zum Anker",
    "copy": "OPEN/CLOSED, Theme und Präsentationszeit kehren zum lokalen Anker zurück. Kein gemeinsamer Bench-Takt.",
    "chapter": "Faltung & Spiegel",
    "local": true
  },
  {
    "id": "sewing-source",
    "target": "sewingSourceWindow",
    "title": "Schaukeln · das vollständige Original",
    "copy": "Originalfenster laden. Für Partitur/Sewing selbst im Quellfenster starten; die Tour erfindet keinen Zugriff durch Browser-Sperren. Pause zum Ausprobieren.",
    "chapter": "Faltung & Spiegel",
    "local": true
  }
];
  const CLOCK_STATIONS=Object.freeze([{"id":"clock-source","target":"nativeFaceBridge","title":"1 · Blue/Pink als führende Quelle","copy":"Die vorhandene Signalansicht öffnen. Hier laufen AM, VM und PM mit einer Quellzeit. Die Maske wird erst in der nächsten Station verbunden.","local":true,"chapter":"Blue/Pink → Maske"},{"id":"clock-connect","target":"maskClockLink","title":"2 · Verbinden und Pause bestätigen","copy":"Die Quelle wird pausiert. Erst ACK plus Masken-Readback ergeben SYNC. Keine Bestätigung: HOLD, kein vorgetäuschter Start.","local":true,"chapter":"Blue/Pink → Maske"},{"id":"clock-step","target":"maskObserverBench","title":"3 · Ein gemeinsamer Step","copy":"Ein Step erhöht die native Signalzeit um 1/120 Zyklus. Die Maske übernimmt den daraus berechneten Tick; ihre eigene Uhr bleibt aus.","local":true,"chapter":"Blue/Pink → Maske"},{"id":"clock-play","target":"maskObserverBench","title":"4 · Blue/Pink führt die Maskenbewegung","copy":"Die Quelle läuft; die Maskengeometrie folgt quantisiert. Frequenzpaar und Phase bleiben Quellenparameter. Montage/Kompass sind keine angepassten Signalfolger.","local":true,"chapter":"Blue/Pink → Maske"},{"id":"clock-pause","target":"maskClockLink","title":"5 · Gemeinsam pausieren","copy":"PAUSE wird von der Quelle bestätigt; der letzte Mask-Tick bleibt stehen. Das ist ein bestätigter Lesestand, kein gemeinsamer Return.","local":true,"chapter":"Blue/Pink → Maske"},{"id":"clock-disconnect","target":"maskClockLink","title":"6 · Entkoppeln und lokal weiterarbeiten","copy":"Die Quelle erhält DISCONNECT/Pause, die Maske bleibt stehen und ihre lokale Bedienung wird frei. Kein Quell-ACK für einen Gesamt-Return wird behauptet.","local":true,"chapter":"Blue/Pink → Maske"}].map(Object.freeze));
  const ORDER=["launch","binder","body-interior","body-player","body-dodeca","one-flow","clock-source","clock-connect","clock-step","clock-play","clock-pause","clock-disconnect","glb-sources","mask-overview","mask-lrrl","mask-rllr","mask-return","teller-am","teller-vm","teller-pm","fold-play","fold-mirror","fold-end","codes-a","codes-b","codes-c","codes-return","caro-open","caro-closed","caro-return","sewing-source","native-face","ail","ninefold","family-grid-life","family-grid-plate","family-grid-cylinder","lens-return","m3-unrolled","m3-cylinder","m3-top","m3-slice","stack","pent","life03","adapter-a","adapter-b","finite-antipode","finite-ghostgons","moving-window","aperture-observatory","root","division-return","return-economy","replay","session-ledger"];
  function chapter(s){if(s.chapter)return s.chapter;if(['launch','binder'].includes(s.id))return 'Quelle & Körper';if(['native-face','ail','ninefold'].includes(s.id))return 'Native Bedienung';if(s.id.startsWith('family-grid-')||s.id.startsWith('m3-')||['stack','lens-return'].includes(s.id))return 'Ansichten & Messung';if(['pent','life03','adapter-a','adapter-b','finite-antipode','finite-ghostgons'].includes(s.id))return 'Adapter & Grenzfälle';if(['moving-window','aperture-observatory','root'].includes(s.id))return 'Fenster & Projektion';return 'Return & Record';}
  const STATIONS=Object.freeze(ORDER.map(id=>{const s=[...SOURCE_STATIONS,...EXTRA,...CLOCK_STATIONS].find(s=>s.id===id);return Object.freeze({...s,chapter:chapter(s)});}));
  const CHAPTERS=Object.freeze([...new Set(STATIONS.map(s=>s.chapter))]);
  function createState(overrides={}){return Object.assign({running:false,index:-1,completed:false},overrides);}
  // The last station gets its full dwell before completion.
  function nextState(s){if(s.index>=STATIONS.length-1)return{running:false,index:STATIONS.length-1,completed:true};return{running:s.running,index:s.index+1,completed:false};}
  function buttonLabel(s){return s.running?'Ⅱ TOUR PAUSIEREN':s.completed?'↻ TOUR ERNEUT STARTEN':s.index>=0?'▶ TOUR FORTSETZEN':'▶ BENCH TOUR STARTEN';}
  function mount(doc,win=doc.defaultView||{}){
    const el=id=>doc.getElementById(id),start=el('benchTourStart'),title=el('benchTourTitle'),copy=el('benchTourCopy'),counter=el('benchTourCounter'),progress=el('benchTourProgress');
    if(!start||!title||!copy||!counter||!progress)throw Error('showcase controls missing');
    let state=createState(),timer=0,token=0,focus=null,status='Bereit · lokale Demo verändert Regler und lokale Anker.',pace=18000,actionDepth=0,cancelPending=null,rangeEnd=null;
    const reduced=()=>Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    function emit(action,station=STATIONS[state.index]){doc.dispatchEvent(new win.CustomEvent('a0:bench-playback',{detail:{schema:'nexah.a0.bench-playback-event/1',source:'BENCH_SHOWCASE_TOUR',state:action,stationId:station?.id||null,target:station?.target||null,moduleId:win.A0BenchMapController?.moduleForTarget?.(station?.target)?.id||null,index:state.index,running:state.running,completed:state.completed,ownsBenchState:false}}));}
    function clearTimer(){if(timer)win.clearTimeout(timer);timer=0;}
    function cancelWait(){if(cancelPending){cancelPending();cancelPending=null;}}
    function bounded(promise){return new Promise((resolve,reject)=>{let done=false;const finish=(fn,value)=>{if(done)return;done=true;win.clearTimeout(id);cancelPending=null;fn(value);};const id=win.setTimeout(()=>finish(reject,Error('Quellantwort nach 12 s noch offen; keine Bestätigung behauptet')),12000);cancelPending=()=>finish(resolve,null);Promise.resolve(promise).then(value=>finish(resolve,value),error=>finish(reject,error));});}
    function optional(controller,method,...args){return win[controller]?.[method]?.(...args);}
    function requireCall(controller,method,...args){if(typeof win[controller]?.[method]!=='function')throw Error(controller+' nicht bereit');return win[controller][method](...args);}
    function click(id){const node=el(id);if(!node||node.disabled)throw Error(id+' nicht bedienbar');node.click();}
    function set(id,value,type='change'){const node=el(id);if(!node)throw Error(id+' fehlt');node.value=String(value);node.dispatchEvent(new win.Event(type,{bubbles:true}));}
    function mask(command,payload){const result=requireCall('A0MaskObserverController','command',command,payload);if(result===false)throw Error('Maskenbefehl abgewiesen');}
    function pauseLocal(){optional('A0MaskObserverController','pause');optional('A0FoldLagView','pause');optional('A0CaroBenchController','pause');}
    function pausePlayers(preserveClock=false){if(!preserveClock&&win.A0MaskClockBench?.connected)optional('A0MaskClockBench','disconnect');pauseLocal();optional('A0SystemBinderController','pause',false);optional('A0ExternalAdapterPackController','pause');optional('A0ReturnEconomyController','pause');optional('A0FamilyGridCouplerController','pause');optional('A0CoupledWindowController','pause');optional('A0FourApertureNinefoldController','stop');const root=el('rootEnginePlay');if(root?.getAttribute?.('aria-pressed')==='true')root.click();}
    function render(){
      const label=buttonLabel(state);for(const id of ['benchTourStart','benchTourTop','benchTourDockPlay'])if(el(id)){el(id).textContent=label;el(id).dataset.running=String(state.running);el(id).setAttribute('aria-pressed',String(state.running));}
      doc.body.classList.toggle('bench-tour-running',state.running);
      if(el('benchTourDock'))el('benchTourDock').hidden=state.index<0;
      [...progress.children].forEach((node,i)=>{node.classList.toggle('done',i<state.index||state.completed);node.classList.toggle('active',i===state.index&&!state.completed);});
      const station=STATIONS[state.index],count=state.index<0?'BEREIT':String(state.index+1).padStart(2,'0')+' / '+STATIONS.length+' · '+(state.completed?'BESUCHT':state.running?'LÄUFT':'PAUSE');
      counter.textContent=count;if(station){title.textContent=station.title;copy.textContent=station.copy;}
      for(const id of ['benchTourDockTitle'])if(el(id))el(id).textContent=station?station.title:'Demo-Tour';
      if(el('benchTourDockCopy'))el('benchTourDockCopy').textContent=station?.copy||'';
      if(el('benchTourChapter'))el('benchTourChapter').textContent=station?.chapter||(CHAPTERS.length+' Kapitel · '+STATIONS.length+' Stationen');
      if(el('benchTourActionStatus'))el('benchTourActionStatus').textContent=status;
      if(el('benchTourDockCounter'))el('benchTourDockCounter').textContent=count;
      if(el('benchTourStation'))el('benchTourStation').value=String(Math.max(0,state.index));
      if(el('benchTourPrev'))el('benchTourPrev').disabled=state.index<=0;
      if(el('benchTourNext'))el('benchTourNext').disabled=state.completed;
      if(el('benchTourPace'))el('benchTourPace').value=String(pace);
    }
    function reveal(target){for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;}
    async function localAction(id){
      if(id==='clock-source'){optional('A0MaskClockBench','disconnect');return requireCall('A0BenchSourceSectionsController','select','lissajous');}
      if(id==='clock-disconnect')return requireCall('A0MaskClockBench','disconnect');
      if(id.startsWith('clock-'))return requireCall('A0MaskClockBench','confirmed',({'clock-connect':'CONNECT','clock-step':'STEP','clock-play':reduced()?'PAUSE':'PLAY','clock-pause':'PAUSE'})[id]);
      if(id.startsWith('body-')||id==='one-flow')return requireCall('A0BenchBodyRouteController','select',{'body-interior':'interior','body-player':'player','body-dodeca':'dodeca','one-flow':'flow'}[id]);
      if(id==='glb-sources')return;
      if(id==='mask-overview'){mask('SET',{kind:'pentagon',angle:36,dx:0,dy:0,phase:0,word:'LRRL',amplitude:.45,fold:true});mask('ASSEMBLY',{rotation:0,plane:'AM',lens:'eight',palette:'source'});mask('TICK',0);mask('CAPTURE');}
      if(id==='mask-lrrl'||id==='mask-rllr'){mask('SET',{word:id==='mask-lrrl'?'LRRL':'RLLR'});mask('TICK',0);if(!reduced())click('maskPlay');else mask('TICK',30);}
      if(id==='mask-return')mask('RETURN');
      if(id.startsWith('teller-')){mask('ASSEMBLY',{plane:id.slice(-2).toUpperCase(),rotation:id==='teller-vm'?90:0});mask('TICK',id==='teller-am'?20:id==='teller-vm'?50:80);}
      if(id.startsWith('fold-')){set('foldLagMode','target','input');set('foldLagDelay',3,'input');set('foldLagMirror',id==='fold-mirror'?'horizontal':'none','input');set('foldLagSlice',id==='fold-play'?0:id==='fold-mirror'?14:28,'input');if(id==='fold-play'&&!reduced())click('foldLagPlay');}
      if(id.startsWith('codes-')){if(id==='codes-return')click('codeCalendarReturn');else{const index=['codes-a','codes-b','codes-c'].indexOf(id);set('codeCalendarAxis',index);set('codeCalendarRatio',index);if(id==='codes-a')click('codeCalendarCapture');if(id==='codes-b')click('codeCalendarReverse');if(id==='codes-c')click('codeCalendarTest');}}
      if(id.startsWith('caro-')){if(id==='caro-open'){requireCall('A0CaroBenchController','command','reset');requireCall('A0CaroBenchController','command','capture');if(!reduced())requireCall('A0CaroBenchController','play');}if(id==='caro-closed'){requireCall('A0CaroBenchController','command','toggle');requireCall('A0CaroBenchController','command','step');}if(id==='caro-return'&&requireCall('A0CaroBenchController','command','return')===false)throw Error('CARO-Anker fehlt');}
      if(id==='sewing-source'){if(!el('sewingSourceOpen')?.disabled)click('sewingSourceOpen');}
    }
    async function originalAction(s){
      if(s.id.startsWith('family-grid-')){requireCall('A0FamilyGridCouplerController','setView',s.view);if(!reduced())requireCall('A0FamilyGridCouplerController','start');}else optional('A0FamilyGridCouplerController','pause');
      if(s.view&&!s.id.startsWith('family-grid-'))requireCall('A0ApertureMeasurementController','setView',s.view);
      if(['launch','binder','stack'].includes(s.id)&&!reduced())await requireCall('A0SystemBinderController','play');
      if(s.id==='native-face')await requireCall('A0NativeFaceBenchController','setFace',0,32);
      if(s.id==='ail'&&!reduced())await requireCall('A0AILApertureControlController','run');
      if(s.id==='ninefold'&&!reduced())requireCall('A0FourApertureNinefoldController','play');
      if(s.id==='adapter-a'&&!reduced())requireCall('A0ExternalAdapterPackController','play',['jarp','axial']);
      if(s.id==='adapter-b'&&!reduced())requireCall('A0ExternalAdapterPackController','play',['axis08','boundary']);
      if(s.id==='return-economy'&&!reduced())requireCall('A0ReturnEconomyController','start');else optional('A0ReturnEconomyController','pause');
      if(s.id==='root'&&!reduced()){const node=el('rootEnginePlay');if(node?.getAttribute?.('aria-pressed')!=='true')click('rootEnginePlay');}
      if(s.id==='moving-window')click(reduced()?'cwWindowStep':'cwWindowPlay');
      if(s.id==='lens-return'){for(const [action,value]of [['capture'],['step'],['step'],['return'],['phase',280]])if(requireCall('A0BenchLensReturnController','command',action,value)===false)throw Error('Zahlenreturn: '+action+' abgewiesen');}
      if(s.id==='division-return'){requireCall('A0DivisionReturnController','select','split');for(const action of ['A','B','bind','return'])if(requireCall('A0DivisionReturnController','command',action)===false)throw Error('Split-Return: '+action+' abgewiesen');}
      if(s.id.startsWith('finite-')){const source=win.A0BenchFiniteControllers?.[s.id.slice(7)];if(!source)throw Error('Finite Quelle nicht bereit');for(const action of ['READ','CAPTURE','STEP'])if(source.command(action)?.status==='HOLD')throw Error('Finite Quelle: '+action+' bleibt HOLD');if(!reduced())source.play();}
    }
    function schedule(localToken){clearTimer();if(!state.running||pace===0)return;timer=win.setTimeout(async()=>{if(localToken!==token)return;if(state.index===STATIONS.length-1||state.index===rangeEnd){state={...state,running:false,completed:true};pausePlayers();status=rangeEnd!==null?'Blue/Pink → Maske vorgeführt · entkoppelt, kein Gesamt-Return.':'Alle Stationen besucht · kein Gesamtmaschinen-Return. Quellfenster behalten eigene Zustände.';emit('COMPLETE');render();return;}await visit(state.index+1,true);},pace);}
    async function visit(index,running=false){
      if(!Number.isInteger(index)||index<0||index>=STATIONS.length)throw Error('invalid station index');
      const localToken=++token;clearTimer();cancelWait();pausePlayers(STATIONS[index].id.startsWith('clock-'));optional('A0MaskClockBench','focus',false);if(rangeEnd!==null&&(index>rangeEnd||!STATIONS[index].id.startsWith('clock-')))rangeEnd=null;state={running,index,completed:false};
      focus?.classList.remove('bench-tour-focus');const station=STATIONS[index],target=el(station.target);
      status='Bedienung läuft · '+station.title;render();
      try{
        if(!target)throw Error('Ziel fehlt: '+station.target);
        const dock=el('benchTourDock');if(dock)doc.body.appendChild(dock);
        if(!station.scenario)optional('A0CoupledWindowController','close',{restoreFocus:false});
        reveal(target);const drawer=el('benchSetupDrawer');if(drawer&&!target.closest?.('#benchSetupDrawer'))drawer.open=false;
        if(station.scenario){requireCall('A0CoupledWindowController','open',station.scenario,{title:station.title,copy:station.copy,view:station.view,autoAction:false});if(dock&&el('coupledWindow'))el('coupledWindow').appendChild(dock);}
        else{target.classList.add('bench-tour-focus');focus=target;target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});}
        const result=await bounded(station.local?localAction(station.id):originalAction(station));
        if(localToken!==token)return;
        status=station.id.startsWith('clock-')?(station.id==='clock-source'?'QUELLANSICHT ANGEFORDERT · nächste Station wartet auf echtes ACK.':station.id==='clock-disconnect'?'ENTKOPPELT · Maske steht; lokale Bedienung frei.':('BESTÄTIGT · t='+result.source.clock.toFixed(4)+' → Mask-Tick '+result.maskTick+' · '+(result.source.playing?'läuft':'pausiert')+(station.id==='clock-play'&&reduced()?' · reduzierte Bewegung: kein Autostart.':''))):station.id==='sewing-source'?'QUELLFENSTER GEÖFFNET · im Original starten; kein bestätigter Fernzugriff.':station.id==='glb-sources'?'QUELLENANSICHT · keine automatische Dateiöffnung.':'BEDIENUNG ANGEFORDERT · Readout im Modul prüfen; kein Gesamt-Return.';
      }catch(error){if(localToken!==token)return;status='HOLD · '+String(error.message||error)+' · Weiter bleibt möglich.';if(station.id.startsWith('clock-')){state={...state,running:false};pausePlayers();}}
      if(localToken!==token)return;emit('STATION',station);render();schedule(localToken);
    }
    function pause(){token++;clearTimer();cancelWait();state={...state,running:false};pausePlayers();status='PAUSE · selbst bedienen oder mit Weiter fortfahren. Bereits gesendete Quellanfragen sind nicht zurückgenommen; Quellfenster können eigene Uhren haben.';emit('PAUSE');render();}
    async function begin(){if(state.index<0||state.completed){rangeEnd=null;return visit(0,true);}if(STATIONS[state.index]?.id.startsWith('clock-')&&!['clock-source','clock-disconnect'].includes(STATIONS[state.index].id)&&!win.A0MaskClockBench?.connected)return visit(STATIONS.findIndex(s=>s.id==='clock-connect'),true);state={...state,running:true,completed:false};status='FORTSETZEN · aktuelle Station bleibt unverändert; zum Wiederholen erneut in der Liste wählen.';emit('PLAY');render();schedule(token);}
    const toggle=()=>state.running?pause():begin();
    function startClockDemo(){rangeEnd=STATIONS.findIndex(s=>s.id==='clock-disconnect');return visit(STATIONS.findIndex(s=>s.id==='clock-source'),true);}
    for(const id of ['benchTourClockDemo','benchTourClockDemoTop'])el(id)?.addEventListener('click',startClockDemo);
    for(const id of ['benchTourStart','benchTourTop','benchTourDockPlay'])el(id)?.addEventListener('click',toggle);
    el('benchTourPrev')?.addEventListener('click',()=>visit(Math.max(0,state.index-1),false));
    el('benchTourNext')?.addEventListener('click',()=>{if(state.index===STATIONS.length-1||state.index===rangeEnd){pause();state.completed=true;render();}else visit(Math.max(0,state.index+1),false);});
    el('benchTourStation')?.addEventListener('change',()=>visit(Number(el('benchTourStation').value),false));
    el('benchTourPace')?.addEventListener('change',()=>{const value=Number(el('benchTourPace').value);if(![0,10000,18000,30000].includes(value))return;pace=value;if(pace===0)pause();else{render();schedule(token);}});
    el('benchTourClose')?.addEventListener('click',()=>{pause();state=createState();focus?.classList.remove('bench-tour-focus');if(el('benchTourDock'))doc.body.appendChild(el('benchTourDock'));render();});
    el('coupledWindow')?.addEventListener('close',()=>{const dock=el('benchTourDock');if(!el('coupledWindow').open&&dock?.parentElement===el('coupledWindow')){doc.body.appendChild(dock);pause();}});
    doc.addEventListener('pointerdown',event=>{if(!actionDepth&&state.running&&!event.target.closest?.('[data-tour-ui]'))pause();},{capture:true});
    doc.addEventListener('keydown',event=>{if(event.key==='Escape')pause();else if(state.running&&!actionDepth&&!event.target.closest?.('[data-tour-ui]'))pause();});
    doc.addEventListener('wheel',()=>{if(state.running&&!actionDepth)pause();},{passive:true,capture:true});
    doc.addEventListener('touchmove',()=>{if(state.running&&!actionDepth)pause();},{passive:true,capture:true});
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden)pause();});
    win.addEventListener?.('blur',()=>{if(state.running)pause();});
    if(el('benchTourStation'))el('benchTourStation').innerHTML=STATIONS.map((s,i)=>'<option value="'+i+'">'+String(i+1).padStart(2,'0')+' · '+s.chapter+' / '+s.title+'</option>').join('');
    progress.innerHTML=STATIONS.map(()=>'<i></i>').join('');render();
    return Object.freeze({start:begin,pause,visit,startClockDemo,get state(){return{...state}},stations:STATIONS});
  }
  return{VERSION,STATIONS,CHAPTERS,createState,nextState,buttonLabel,mount};
});
