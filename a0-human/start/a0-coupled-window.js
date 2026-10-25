(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0CoupledWindow=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.3.0';
  const DÜRER=Object.freeze([
    Object.freeze([16,3,2,13]),
    Object.freeze([5,10,11,8]),
    Object.freeze([9,6,7,12]),
    Object.freeze([4,15,14,1])
  ]);
  const KHAJURAHO=Object.freeze([
    Object.freeze([7,12,1,14]),
    Object.freeze([2,13,8,11]),
    Object.freeze([16,3,10,5]),
    Object.freeze([9,6,15,4])
  ]);
  const CARRIERS=Object.freeze({durer:DÜRER,khajuraho:KHAJURAHO});
  const SCENARIOS=Object.freeze({
    'division-return':Object.freeze({id:'division-return',eyebrow:'THREE SOURCE-BOUND RECONSTRUCTION CONTRACTS',title:'Teilung · Übersetzung · Return',copy:'Split Rest, natives Re/ST-Profil und geprüfter CRT-Annex. Jede Station besitzt ihren eigenen Binder und vollständigen Rückweg; Chemistry 6+1 bleibt gesperrt.',modules:Object.freeze([Object.freeze({id:'division-return',label:'SOURCE → A/B → RULE → RESIDUAL → RETURN',title:'Split Rest · Re/ST · CRT',target:'divisionReturnBench',tone:'gold'})]),custom:'source-chain'}),
    'lens-return':Object.freeze({id:'lens-return',eyebrow:'SOURCE-BOUND VIEWS / SEPARATE NUMERIC RETURN',title:'Prisma · Linsen · Zahlenreturn',copy:'Vorhandene Prisma-Lesarten und Pentagon-Linsen im selben Fenster. Nur Linse und Fold Guide teilen die lokale Phase; der 978-Kanal bleibt ein eigener Integerzustand.',modules:Object.freeze([Object.freeze({id:'lens-return',label:'LENS OVERLAY + INDEPENDENT INTEGER RETURN',title:'AM / VM / PM · 978',target:'benchLensReturn',tone:'pink'}),Object.freeze({id:'prism',label:'SEPARATE PRISM VIEW CONTROLLER',title:'Prisma · drei Lesarten',target:'prismRelationLens',tone:'cyan'})]),custom:'source-chain'}),
    antipode:Object.freeze({id:'antipode',eyebrow:'FINITE SOURCE OPERATOR',title:'Antipode · Boundary-Band · Möbius readings',copy:'Existing OCB cycle contract; odd vertex antipode HOLD. Six band readings are separate from carrier identity.',modules:Object.freeze([Object.freeze({id:'antipode',label:'SOURCE → OPERATOR → VIEW → RESIDUAL → RETURN',title:'Finite Antipode',target:'finite-antipode',tone:'cyan'})]),custom:'source-chain'}),
    ghostgons:Object.freeze({id:'ghostgons',eyebrow:'DISTINCT FINITE VIEW ORDERS',title:'Ghostgons 17 / 19 / 23',copy:'Three declared regular polygons, separate contracts and phases; no common carrier or CRT geometry.',modules:Object.freeze([Object.freeze({id:'ghostgons',label:'ORDER → VERTEX → PHASE → RESIDUAL → RETURN',title:'Ghostgon contracts',target:'finite-ghostgons',tone:'gold'})]),custom:'source-chain'}),
    window:Object.freeze({
      id:'window',eyebrow:'A0-BL-036 · BOUND APPLICATION WINDOW',title:'Moving Aperture · Return Window',
      copy:'Ein lokaler Ausschnitt wandert über zwei getrennte Q4-Register. Messwert, Ort, Randregel und Residual bleiben sichtbar.',
      modules:Object.freeze([
        Object.freeze({id:'source',label:'SOURCE',title:'Dürer / Khajuraho',target:'integrationCrosswalk',tone:'cyan'}),
        Object.freeze({id:'aperture',label:'VIEW',title:'2×2 / 3×3 Window',target:'apertureMeasurement',tone:'gold'}),
        Object.freeze({id:'residual',label:'RESIDUAL',title:'Carrier + Address',target:'returnEconomyDemonstrator',tone:'pink'}),
        Object.freeze({id:'return',label:'RETURN',title:'Exact reconstruction',target:'ocbRecordReplay',tone:'green'})
      ]),custom:'moving-window'
    }),
    control:Object.freeze({
      id:'control',eyebrow:'BENCH CONTROL PLANE',title:'Master Cockpit · System Binder',
      copy:'Die gemeinsame Regie startet vorhandene Engines. Übergaben bleiben typisiert; getrennte Takte werden nicht zu einer Quelluhr erklärt.',
      modules:Object.freeze([
        Object.freeze({id:'master',label:'ORCHESTRATOR',title:'Master Cockpit',target:'masterCockpit',tone:'cyan'}),
        Object.freeze({id:'binder',label:'COUPLING',title:'System Binder',target:'systemBinder',tone:'gold'}),
        Object.freeze({id:'record',label:'RECEIPT',title:'Record / Replay',target:'ocbRecordReplay',tone:'green'})
      ]),action:'binder'
    }),
    native:Object.freeze({
      id:'native',eyebrow:'NATIVE SOURCE CHAIN',title:'Face → A·i·l → Ninefold → Return',
      copy:'Adressierte Flächen, lokale Punkte, deklarierte Scharniere und vier Satellitenflächen bilden eine prüfbare Quellenkette.',
      modules:Object.freeze([
        Object.freeze({id:'face',label:'SOURCE',title:'Native Face',target:'nativeFaceBridge',tone:'cyan'}),
        Object.freeze({id:'ail',label:'CONTROL',title:'A · i · l',target:'ailApertureControl',tone:'gold'}),
        Object.freeze({id:'ninefold',label:'ORBIT',title:'4×2+1 Ninefold',target:'fourApertureNinefold',tone:'pink'}),
        Object.freeze({id:'replay',label:'RETURN',title:'Versioned Replay',target:'ocbRecordReplay',tone:'green'})
      ]),action:'native',custom:'source-chain'
    }),
    measurement:Object.freeze({
      id:'measurement',eyebrow:'MEASUREMENT WINDOW',title:'M3 Trace · Aperture Stack',
      copy:'Eine geordnete 48-Sample-Spur wird als Unrolled, Cylinder, Top und Slice gelesen; der Stack kalibriert denselben Quellrecord.',
      modules:Object.freeze([
        Object.freeze({id:'m3',label:'TRACE',title:'M3 / I·A·I·U',target:'apertureMeasurement',tone:'cyan'}),
        Object.freeze({id:'views',label:'VIEWS',title:'Four projections',target:'apertureMeasurement',tone:'pink'}),
        Object.freeze({id:'stack',label:'CALIBRATION',title:'Aperture Stack',target:'apertureStackCalibration',tone:'gold'}),
        Object.freeze({id:'record',label:'EXPORT',title:'Difference record',target:'apertureMeasurement',tone:'green'})
      ]),action:'measurement'
    }),
    bridges:Object.freeze({
      id:'bridges',eyebrow:'SOURCE ADAPTER WINDOW',title:'PENT · LIFE03 · typed handoffs',
      copy:'PENT und LIFE03 bleiben eigenständige Carrier mit eigenen Sitzungen. Das Fenster zeigt bestätigte Übergaben, nicht eine Gesamtmaschine.',
      modules:Object.freeze([
        Object.freeze({id:'pent',label:'SOURCE A',title:'PENT adapter',target:'pentagonWorkbench',tone:'gold'}),
        Object.freeze({id:'master',label:'HANDOFF',title:'Master cue',target:'masterCockpit',tone:'cyan'}),
        Object.freeze({id:'life',label:'SOURCE B',title:'LIFE03 adapter',target:'life03Workbench',tone:'pink'})
      ]),action:'bridges'
    }),
    adapters:Object.freeze({
      id:'adapters',eyebrow:'EXTERNAL ADAPTER WINDOW',title:'JARP · Axial · AXIS08 · Boundary',
      copy:'Vier source-bound Reader laufen nebeneinander. Die gemeinsame Oberfläche standardisiert Inspection und Return, nicht ihre Carrier.',
      modules:Object.freeze([
        Object.freeze({id:'jarp',label:'PACKAGE A',title:'JARP',target:'adapterPackA',tone:'cyan'}),
        Object.freeze({id:'axial',label:'PACKAGE A',title:'Axial Carrier',target:'adapterPackA',tone:'green'}),
        Object.freeze({id:'axis08',label:'PACKAGE B',title:'AXIS08',target:'adapterPackB',tone:'gold'}),
        Object.freeze({id:'boundary',label:'PACKAGE B',title:'Boundary',target:'adapterPackB',tone:'pink'})
      ]),action:'adapters'
    }),
    economy:Object.freeze({
      id:'economy',eyebrow:'A0-BL-055 · CLOSED MIXED RESULT',title:'Return Economy · three carriers',
      copy:'Q106/O16, Typed Seam und Decimal D4 rekonstruieren exakt. Nur der Typed Seam unterschreitet seine Raw-Baseline.',
      modules:Object.freeze([
        Object.freeze({id:'q106',label:'NO SAVING',title:'Q106 / O16',target:'returnEconomyDemonstrator',tone:'cyan'}),
        Object.freeze({id:'seam',label:'ECONOMY',title:'Typed Seam',target:'returnEconomyDemonstrator',tone:'green'}),
        Object.freeze({id:'decimal',label:'NO SAVING',title:'Decimal D4',target:'returnEconomyDemonstrator',tone:'pink'})
      ]),action:'economy'
    }),
    observatory:Object.freeze({
      id:'observatory',eyebrow:'A0-BL-036 · FINITE COMPARISON BATTERY',title:'Aperture Invariance Observatory',
      copy:'Rotation, Spiegelung, Translation und eine Kontrollpermutation prüfen, was am Fensterwert erhalten bleibt und was nur seinen Ort wechselt.',
      modules:Object.freeze([
        Object.freeze({id:'source',label:'SOURCE',title:'Declared 4×4 register',target:'integrationCrosswalk',tone:'cyan'}),
        Object.freeze({id:'operator',label:'OPERATOR',title:'Finite placement transform',target:'coupledWindowHub',tone:'gold'}),
        Object.freeze({id:'heat',label:'COMPARE',title:'Window-sum heatmaps',target:'coupledWindowHub',tone:'pink'}),
        Object.freeze({id:'class',label:'CLASSIFY',title:'Invariant / location / placement',target:'coupledWindowHub',tone:'green'})
      ]),custom:'observatory'
    }),
    ledger:Object.freeze({
      id:'ledger',eyebrow:'BENCH WORKING MEMORY',title:'Coupled Session Ledger',
      copy:'Arbeitsfenster werden als getypte Engineering-Receipts gesammelt, verglichen, wieder geöffnet und exportiert — ohne gemeinsame Carrier- oder Uhrbehauptung.',
      modules:Object.freeze([
        Object.freeze({id:'capture',label:'CAPTURE',title:'Window record',target:'coupledWindowHub',tone:'cyan'}),
        Object.freeze({id:'compare',label:'COMPARE',title:'Typed delta',target:'coupledWindowHub',tone:'gold'}),
        Object.freeze({id:'replay',label:'REPLAY',title:'Open source window',target:'coupledWindowHub',tone:'pink'}),
        Object.freeze({id:'export',label:'RECEIPT',title:'Session JSON',target:'ocbRecordReplay',tone:'green'})
      ]),custom:'ledger'
    }),
    root:Object.freeze({
      id:'root',eyebrow:'ROOT / PROJECTION WINDOW',title:'Q4 Gray cycle · Root7 overlay',
      copy:'Der endliche Q4-Zyklus treibt deklarierte Projektionen. Schicht, Ansicht und Carrier bleiben unterscheidbar.',
      modules:Object.freeze([
        Object.freeze({id:'q4',label:'CARRIER',title:'Q4 · 16 states',target:'root7ProjectionOverlay',tone:'cyan'}),
        Object.freeze({id:'root7',label:'VIEW',title:'Root7 overlay',target:'root7ProjectionOverlay',tone:'gold'}),
        Object.freeze({id:'return',label:'RETURN',title:'16-tick closure',target:'root7ProjectionOverlay',tone:'green'})
      ]),action:'root'
    })
  });

  function mod(value,n){return((value%n)+n)%n}
  function positions(size,boundary){const count=boundary==='torus'?4:5-size;return Array.from({length:count*count},(_,index)=>({row:Math.floor(index/count),col:index%count}))}
  function windowCells(grid,size,row,col,boundary){
    const cells=[];
    for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++){
      const y=boundary==='torus'?mod(row+dy,4):row+dy,x=boundary==='torus'?mod(col+dx,4):col+dx;
      if(y<0||y>=4||x<0||x>=4)throw Error('window outside planar carrier');
      cells.push(Object.freeze({row:y,col:x,value:grid[y][x]}));
    }
    return Object.freeze(cells);
  }
  function measure(carrier,size,row,col,boundary){
    const grid=CARRIERS[carrier];if(!grid)throw Error(`unknown carrier: ${carrier}`);
    const cells=windowCells(grid,size,row,col,boundary),sum=cells.reduce((total,cell)=>total+cell.value,0);
    return Object.freeze({carrier,size,row,col,boundary,cells,sum,address:`${carrier.toUpperCase()}:${row}${col}:K${size}:${boundary.toUpperCase()}`});
  }
  function trace(carrier,size,boundary){return Object.freeze(positions(size,boundary).map(({row,col})=>measure(carrier,size,row,col,boundary)))}
  function candidates(carrier,size,boundary,sum){return Object.freeze(trace(carrier,size,boundary).filter(item=>item.sum===sum))}
  function createState(overrides={}){return Object.assign({scenario:'window',open:false,running:false,carrier:'durer',size:2,boundary:'planar',index:0},overrides)}
  function normalizeState(state){const places=positions(state.size,state.boundary),index=mod(state.index,places.length),point=places[index];return Object.assign({},state,{index,row:point.row,col:point.col})}
  function advance(state){return normalizeState(Object.assign({},state,{index:state.index+1}))}
  function snapshot(state){
    const clean=normalizeState(state),a=measure('durer',clean.size,clean.row,clean.col,clean.boundary),b=measure('khajuraho',clean.size,clean.row,clean.col,clean.boundary);
    const selected=clean.carrier==='khajuraho'?b:a,options=candidates(clean.carrier,clean.size,clean.boundary,selected.sum);
    return Object.freeze({state:Object.freeze(clean),durer:a,khajuraho:b,selected,candidates:options,viewUnique:options.length===1,returnExact:true,residual:`${clean.carrier.toUpperCase()} + ${clean.row},${clean.col} + K${clean.size} + ${clean.boundary.toUpperCase()}`});
  }
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
  function moduleMarkup(module){return `<article class="cw-module" data-tone="${module.tone}" data-module="${module.id}"><small>${module.label}</small><strong>${module.title}</strong><span>typed module</span><button type="button" data-cw-reveal="${module.target}">SOURCE ZEIGEN</button></article>`}
  function gridMarkup(id,grid){return `<article class="cw-grid-card"><header><small>${id==='durer'?'R180 PLACEMENT':'T(2,2) PLACEMENT'}</small><strong>${id==='durer'?'Dürer':'Khajuraho'}</strong><output data-cw-sum="${id}">Σ —</output></header><div class="cw-number-grid" data-cw-grid="${id}">${grid.flatMap((row,y)=>row.map((value,x)=>`<b data-row="${y}" data-col="${x}">${value}</b>`)).join('')}</div><div class="cw-trace" data-cw-trace="${id}"></div></article>`}
  function movingWindowMarkup(){return `<div class="cw-window-controls"><label>Carrier<select id="cwCarrier"><option value="durer">Dürer</option><option value="khajuraho">Khajuraho</option></select></label><label>Window<select id="cwSize"><option value="2">2×2</option><option value="3">3×3</option></select></label><label>Boundary<select id="cwBoundary"><option value="planar">Planar</option><option value="torus">Toroidal</option></select></label><button type="button" id="cwWindowPlay">▶ PLAY WINDOW</button><button type="button" id="cwWindowStep">STEP</button></div><div class="cw-grid-pair">${gridMarkup('durer',DÜRER)}${gridMarkup('khajuraho',KHAJURAHO)}</div><div class="cw-return-ledger"><article><small>LOCAL VIEW</small><b id="cwViewReadout">Σ —</b><span id="cwCollisionReadout">— candidates</span></article><i>+</i><article><small>RESIDUAL</small><b id="cwResidualReadout">carrier + address</b><span>restores the declared source</span></article><i>→</i><article class="return"><small>RETURN</small><b id="cwReturnReadout">READY</b><span>exact state · history not implied</span></article></div>`}

  function mount(doc,win=doc.defaultView||{}){
    const dialog=doc.getElementById('coupledWindow'),title=doc.getElementById('coupledWindowTitle'),eyebrow=doc.getElementById('coupledWindowEyebrow'),copy=doc.getElementById('coupledWindowCopy'),stage=doc.getElementById('coupledWindowStage'),close=doc.getElementById('coupledWindowClose'),returnButton=doc.getElementById('coupledWindowReturn'),sizeButton=doc.getElementById('coupledWindowSize'),status=doc.getElementById('coupledWindowStatus');
    if(!dialog||!title||!eyebrow||!copy||!stage||!close||!returnButton||!sizeButton||!status)throw Error('coupled window shell missing');
    const head=dialog.querySelector?.('.coupled-window-head');
    if(head&&!head.querySelector?.('.coupled-window-route')){const route=doc.createElement?.('p');if(route){route.className='coupled-window-route';route.setAttribute?.('role','note');route.textContent='LESEWEG · SOURCE ZEIGEN → ZUM MODUL · SCHLIESSEN → AN DIESER LESESTELLE WEITER';head.appendChild(route)}}
    returnButton.textContent='FENSTER SCHLIESSEN · ZUR LESESTELLE';
    returnButton.setAttribute?.('aria-label','Fenster schließen und zur vorherigen Lesestelle zurückkehren');
    let state=createState(),timer=0,lastFocus=null,customController=null,returnScroll=null,maximized=false;
    const reduced=()=>Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    function clear(){if(timer)win.clearInterval(timer);timer=0}
    function rememberReadingPlace(){if(!returnScroll)returnScroll={x:Number(win.scrollX)||0,y:Number(win.scrollY)||0}}
    function setMaximized(next){maximized=Boolean(next);dialog.classList.toggle('coupled-window-maximized',maximized);sizeButton.setAttribute('aria-pressed',String(maximized));sizeButton.setAttribute('aria-label',maximized?'Fenster wieder einpassen':'Fenster maximieren');sizeButton.textContent=maximized?'↙ EINPASSEN':'⛶ VERGRÖSSERN'}
    function openDialog(){rememberReadingPlace();if(typeof dialog.showModal==='function'&&!dialog.open)dialog.showModal();else{dialog.setAttribute('open','');dialog.hidden=false}doc.body.classList.add('coupled-window-open')}
    function closeDialog(options={}){const place=returnScroll;clear();customController?.stop?.();customController=null;state=createState({...state,open:false,running:false});win.A0SystemBinderController?.pause?.(false);win.A0ExternalAdapterPackController?.pause?.();win.A0ReturnEconomyController?.pause?.();const rootPlay=doc.getElementById('rootEnginePlay');if(rootPlay&&String(rootPlay.textContent).toLowerCase().includes('pause'))rootPlay.click();if(typeof dialog.close==='function'&&dialog.open)dialog.close();else{dialog.removeAttribute('open');dialog.hidden=true}doc.body.classList.remove('coupled-window-open');setMaximized(false);returnScroll=null;if(options.restoreFocus!==false)win.requestAnimationFrame?.(()=>{if(place)win.scrollTo({left:place.x,top:place.y,behavior:'instant'});lastFocus?.focus?.({preventScroll:true})})}
    function renderModules(scenario){
      customController?.stop?.();customController=null;
      const custom=scenario.custom==='moving-window'?movingWindowMarkup():scenario.custom==='observatory'?'<div id="cwObservatoryMount"></div>':scenario.custom==='ledger'?'<div id="cwLedgerMount"></div>':scenario.custom==='source-chain'?'<div class="cw-source-workspace"><div class="cw-source-toolbar"><div><small>LIVE SOURCE DECK</small><b>Quellmodule · direkt bedienen</b></div><div><button type="button" data-cw-source-mode="focus" aria-pressed="true">FOCUS</button><button type="button" data-cw-source-mode="overview" aria-pressed="false">OVERVIEW</button></div></div><div class="cw-source-deck" data-mode="focus"></div></div>':`<div class="cw-live-note"><small>LIVE COUPLING</small><b>${scenario.modules.length} bestehende Module · eine getypte Ansicht</b><span>Das Fenster steuert oder öffnet die vorhandenen Quellen. Es kopiert keinen Carrier und erzeugt keine gemeinsame Uhr.</span></div>`;
      stage.innerHTML=`<div class="cw-module-line">${scenario.modules.map(moduleMarkup).join('<i class="cw-connector" aria-hidden="true">→</i>')}</div>${custom}`;
      if(scenario.custom==='source-chain')customController=wireSourceChain(scenario);
      else stage.querySelectorAll('[data-cw-reveal]').forEach(button=>button.addEventListener('click',()=>reveal(button.dataset.cwReveal)));
      if(scenario.custom==='moving-window')wireMovingWindow();
      if(scenario.custom==='observatory'){customController=win.A0ApertureInvarianceObservatory.mount(stage.querySelector('#cwObservatoryMount'),{window:win,carriers:CARRIERS});win.A0ApertureObservatoryController=customController}
      if(scenario.custom==='ledger'){customController=win.A0BenchSessionLedger.mount(stage.querySelector('#cwLedgerMount'),{window:win,scenarios:Object.keys(SCENARIOS).filter(id=>id!=='ledger')});win.A0BenchSessionLedgerController=customController}
    }
    function wireSourceChain(scenario){
      const deck=stage.querySelector('.cw-source-deck'),workspace=stage.querySelector('.cw-source-workspace'),moved=[];
      let selected=scenario.modules[0].id,mode='focus';
      for(const module of scenario.modules){
        const source=doc.getElementById(module.target);if(!source)continue;
        const marker=doc.createComment(`cw-source-return:${module.target}`);source.parentNode.insertBefore(marker,source);
        const panel=doc.createElement('article');panel.className='cw-source-panel';panel.dataset.sourcePanel=module.id;panel.dataset.tone=module.tone;
        panel.innerHTML=`<header><small>${module.label} · SOURCE-OWNED</small><b>${module.title}</b><button type="button" data-cw-source-select="${module.id}">FOCUS</button></header>`;
        panel.appendChild(source);deck.appendChild(panel);moved.push({source,marker});
      }
      function render(){
        deck.dataset.mode=mode;
        deck.querySelectorAll('[data-source-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.sourcePanel===selected));
        stage.querySelectorAll('[data-cw-reveal]').forEach(button=>{const module=scenario.modules.find(item=>item.target===button.dataset.cwReveal),active=module?.id===selected;button.textContent=active?'IM FOKUS':'SOURCE ZEIGEN';button.setAttribute('aria-pressed',String(active));button.closest('.cw-module')?.classList.toggle('active',active)});
        stage.querySelectorAll('[data-cw-source-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cwSourceMode===mode)));
        status.textContent=mode==='overview'?scenario.modules.length+' SOURCES · OVERVIEW · DISTINCT CONTRACTS':`${String(selected).toUpperCase()} · FOCUS SOURCES`;
      }
      function select(id){selected=id;mode='focus';render();deck.querySelector(`[data-source-panel="${id}"]`)?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'})}
      stage.querySelectorAll('[data-cw-reveal]').forEach(button=>button.addEventListener('click',()=>{const module=scenario.modules.find(item=>item.target===button.dataset.cwReveal);if(module)select(module.id)}));
      deck.querySelectorAll('[data-cw-source-select]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.cwSourceSelect)));
      workspace.querySelectorAll('[data-cw-source-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.cwSourceMode;render()}));
      render();
      function pauseSources(){for(const module of scenario.modules){win.A0BenchFiniteControllers?.[module.id]?.pause?.();if(module.id==='prism'){win.A0PrismRelationLensController?.stop?.();win.A0PrismRelationLensController?.stopReturn?.()}}}
      return Object.freeze({select,setMode(next){mode=next==='overview'?'overview':'focus';render()},pause:pauseSources,stop(){pauseSources();for(const item of moved)if(item.marker.parentNode)item.marker.replaceWith(item.source)}});
    }
    function openScenario(id,options={}){const scenario=SCENARIOS[id]||SCENARIOS.window;clear();rememberReadingPlace();lastFocus=options.trigger||doc.activeElement;state=createState({...state,scenario:scenario.id,open:true,running:false,index:0});eyebrow.textContent=scenario.eyebrow;title.textContent=options.title||scenario.title;copy.textContent=options.copy||scenario.copy;status.textContent='LIVE · TYPED COUPLING';renderModules(scenario);openDialog();if(options.autoAction!==false)runAction(scenario.action,options);return snapshot(state)}
    function openDocument(url,options={}){
      clear();rememberReadingPlace();lastFocus=options.trigger||doc.activeElement;customController?.stop?.();customController=null;
      const source=new URL(url,doc.baseURI);state=createState({...state,scenario:'reader',open:true,running:false,index:0});
      eyebrow.textContent='LESEFADEN VIEWER · SOURCE-OWNED DEMONSTRATOR';title.textContent=options.title||'Demonstrator';
      copy.textContent=options.copy||'Der Demonstrator bleibt im Lesefaden. Schließen stellt die vorherige Position exakt wieder her.';
      status.textContent='VIEWER · CURRENT READING PLACE RETAINED';
      stage.innerHTML=`<div class="cw-reader"><div class="cw-reader-toolbar"><span>IM FENSTER · DIE SEITE BLEIBT AN IHRER STELLE</span><a href="${escapeHtml(source.href)}" target="_blank" rel="noopener">IN NEUEM TAB ÖFFNEN ↗</a></div><iframe class="cw-reader-frame" title="${escapeHtml(options.title||'NEXAH Demonstrator')}" src="${escapeHtml(source.href)}"></iframe></div>`;
      if(options.unloadOnClose===true)customController={stop(){stage.innerHTML='';}};
      openDialog();return Object.freeze({url:source.href,open:true,unloadOnClose:options.unloadOnClose===true});
    }
    function reveal(targetId){const target=doc.getElementById(targetId);closeDialog();if(!target)return;for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});target.classList.add('bench-tour-focus');win.setTimeout?.(()=>target.classList.remove('bench-tour-focus'),2400)}
    function runAction(action,options={}){
      if(action==='binder')Promise.resolve(win.A0SystemBinderController?.play?.()).catch(()=>{});
      if(action==='native'){Promise.resolve(win.A0NativeFaceBenchController?.setFace?.(0,32)).catch(()=>{});win.A0FourApertureNinefoldController?.play?.()}
      if(action==='measurement'&&options.view)win.A0ApertureMeasurementController?.setView?.(options.view);
      if(action==='adapters')win.A0ExternalAdapterPackController?.play?.(['jarp','axial','axis08','boundary']);
      if(action==='economy')win.A0ReturnEconomyController?.start?.();
      if(action==='root'){const button=doc.getElementById('rootEnginePlay');if(button&&!String(button.textContent).toLowerCase().includes('pause'))button.click()}
    }
    function cellSet(record){return new Set(record.cells.map(cell=>`${cell.row}:${cell.col}`))}
    function renderMovingWindow(){
      state=normalizeState(state);const shot=snapshot(state),selected=shot.selected;
      ['durer','khajuraho'].forEach(id=>{const record=shot[id],active=cellSet(record),grid=stage.querySelector(`[data-cw-grid="${id}"]`);grid?.querySelectorAll('b').forEach(cell=>cell.classList.toggle('active',active.has(`${cell.dataset.row}:${cell.dataset.col}`)));const sum=stage.querySelector(`[data-cw-sum="${id}"]`);if(sum)sum.textContent=`Σ ${record.sum}`;const values=trace(id,state.size,state.boundary).map(item=>item.sum),traceNode=stage.querySelector(`[data-cw-trace="${id}"]`);if(traceNode)traceNode.innerHTML=values.map((value,index)=>`<i class="${index===state.index?'active':''}">${value}</i>`).join('')});
      const view=stage.querySelector('#cwViewReadout'),collision=stage.querySelector('#cwCollisionReadout'),residual=stage.querySelector('#cwResidualReadout'),returned=stage.querySelector('#cwReturnReadout'),play=stage.querySelector('#cwWindowPlay');
      if(view)view.textContent=`Σ ${selected.sum}`;if(collision)collision.textContent=`${shot.candidates.length} candidate${shot.candidates.length===1?'':'s'} · ${shot.viewUnique?'unique':'ambiguous'}`;if(residual)residual.textContent=shot.residual;if(returned)returned.textContent=`EXACT · ${selected.address}`;if(play){play.textContent=state.running?'Ⅱ PAUSE WINDOW':'▶ PLAY WINDOW';play.setAttribute('aria-pressed',String(state.running))}
      status.textContent=shot.viewUnique?'VIEW UNIQUE · RETURN EXACT':`VIEW COLLISION ×${shot.candidates.length} · RESIDUAL RESTORES RETURN`;
    }
    function scheduleWindow(){clear();if(!state.running)return;timer=win.setInterval(()=>{state=advance(state);renderMovingWindow()},reduced()?2400:1200)}
    function wireMovingWindow(){
      const carrier=stage.querySelector('#cwCarrier'),size=stage.querySelector('#cwSize'),boundary=stage.querySelector('#cwBoundary'),play=stage.querySelector('#cwWindowPlay'),step=stage.querySelector('#cwWindowStep');
      carrier.value=state.carrier;size.value=String(state.size);boundary.value=state.boundary;
      carrier.addEventListener('change',()=>{state=createState({...state,carrier:carrier.value,index:0,running:false});clear();renderMovingWindow()});
      size.addEventListener('change',()=>{state=createState({...state,size:Number(size.value),index:0,running:false});clear();renderMovingWindow()});
      boundary.addEventListener('change',()=>{state=createState({...state,boundary:boundary.value,index:0,running:false});clear();renderMovingWindow()});
      play.addEventListener('click',()=>{state=createState({...state,running:!state.running});scheduleWindow();renderMovingWindow()});
      step.addEventListener('click',()=>{clear();state=advance(createState({...state,running:false}));renderMovingWindow()});renderMovingWindow()
    }
    doc.querySelectorAll('[data-coupled-open]').forEach(button=>button.addEventListener('click',()=>openScenario(button.dataset.coupledOpen,{trigger:button})));
    doc.addEventListener('click',event=>{const link=event.target.closest?.('a[data-reader-viewer],.bench-act-head a[href$=".html"],.source-grid a[href$=".html"]');if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank')return;event.preventDefault();openDocument(link.href,{trigger:link,title:link.textContent.trim()})});
    sizeButton.addEventListener('click',()=>setMaximized(!maximized));close.addEventListener('click',closeDialog);returnButton.addEventListener('click',closeDialog);dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog()});dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
    return Object.freeze({open:openScenario,openDocument,close:closeDialog,reveal,setMaximized,pause:()=>{clear();if(customController?.pause)customController.pause();else customController?.stop?.();state=createState({...state,running:false});if(state.scenario==='window'&&stage.querySelector('#cwWindowPlay'))renderMovingWindow()},get state(){return Object.assign({},state)},get maximized(){return maximized},scenarios:SCENARIOS,snapshot:()=>snapshot(state)});
  }

  return{VERSION,DÜRER,KHAJURAHO,CARRIERS,SCENARIOS,positions,windowCells,measure,trace,candidates,createState,normalizeState,advance,snapshot,mount};
});
