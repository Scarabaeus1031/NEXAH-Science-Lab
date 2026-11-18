(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0PiOuterInnerViewer=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LAYERS=Object.freeze(['GEOMETRY','HISTORICAL','NEXAH']);
  const VIEW_GROUPS=Object.freeze([
    Object.freeze({id:'GEOMETRY',label:'A · GEOMETRY',views:Object.freeze(['SOURCE','C8_XY','Q_PLUS_MINUS'])}),
    Object.freeze({id:'MATERIAL',label:'B · MATERIAL / SURFACE',views:Object.freeze(['METAL_RELAY','LIGHT_CASCADE','MOBIUS_REACTOR'])}),
    Object.freeze({id:'TOPOLOGY',label:'C · TOPOLOGY / SPECTRUM',views:Object.freeze(['KLEIN_FLIP','FOURIER_SLICE','FOURIER_FAMILY'])}),
    Object.freeze({id:'AUDIT',label:'D · AUDIT / OPERATOR',views:Object.freeze(['CARRIER_AUDIT','NUMBER_LOOP','MATRIX_HOLONOMY'])}),
    Object.freeze({id:'RETURN',label:'E · RELATION / RETURN',views:Object.freeze(['MASK_PHASE_RELATION','BINDING_ZIPPER','OUTER_INNER_VIEWER'])})
  ]);
  const ROUTE=Object.freeze([
    Object.freeze({id:'OORT',label:'OORT SHELL',objectClass:'OUTER_ENVELOPE_VIEW',y:88,note:'Äußere Hülle der Ansicht; kein TNO-Knoten.'}),
    Object.freeze({id:'ARROKOTH',label:'ARROKOTH',objectClass:'TNO / COLD CLASSICAL KBO',y:230,note:'Lokaler View-Anker; nicht das physische Zentrum des Sonnensystems.'}),
    Object.freeze({id:'PLUTO',label:'PLUTO',objectClass:'TNO / KBO / DWARF PLANET',y:372,note:'TNO-Station auf der deklarierten Indexroute.'}),
    Object.freeze({id:'CHIRON',label:'CHIRON',objectClass:'CENTAUR',y:514,note:'Getrennt typisierte Übergangsstation; kein TNO.'}),
    Object.freeze({id:'RETURN',label:'INNER RETURN',objectClass:'LOCAL_VIEW_RETURN',y:626,note:'Viewer-Endpunkt und Rückgabeadresse.'})
  ]);
  const CORRESPONDENCES=Object.freeze([
    Object.freeze({sign:'☉',planet:'SUN',metal:'GOLD'}),Object.freeze({sign:'☽',planet:'MOON',metal:'SILVER'}),
    Object.freeze({sign:'☿',planet:'MERCURY',metal:'MERCURY'}),Object.freeze({sign:'♀',planet:'VENUS',metal:'COPPER'}),
    Object.freeze({sign:'♂',planet:'MARS',metal:'IRON'}),Object.freeze({sign:'♃',planet:'JUPITER',metal:'TIN'}),
    Object.freeze({sign:'♄',planet:'SATURN',metal:'LEAD'})
  ]);
  const MACHINA_BINDINGS=Object.freeze({
    localName:'WAFFLER',carrier:'PI_DUAL_POLYHEDRON',
    field:Object.freeze({id:'F-IJ-01',i:9,j:10,sum:19,operator:'T(x,y)=(y,x)',return:'I→J→I',source:'A0_WERKBANK.html#nmAxisSwitch'}),
    finalPin:Object.freeze({role:'COMMON_READ_POINT',label:'FINAL PIN / SPARK',source:'A0_ORIENTATION_CONTROLLER_BENCH.html#tlFinalPin'}),
    foldContact:Object.freeze({sequence:'√ DOWN → ° SPARK → ^ UP',source:'A0_TESSAREC_BLUE_BODY_LAB.html'})
  });
  const LAYER_COPY=Object.freeze({
    GEOMETRY:['GEOMETRY · OORT → ARROKOTH → PLUTO → CHIRON','Deklarierte View-Reihenfolge, keine Ephemeride oder maßstäbliche Entfernung.'],
    HISTORICAL:['HISTORICAL · 7 METALS / PLANETS / SIGNS','Überlieferte Korrespondenzsprache; keine neue stoffliche oder astronomische Relation.'],
    NEXAH:['NEXAH · RED LINE / ORANGE LOOP / DUAL SHELL','Lokale Viewer-Rollen derselben PI-Linse; keine neue Identität oder Graphrelation.']
  });
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function redLineFlip(index){
    if(!Number.isInteger(index)||index<0||index>=ROUTE.length)throw new RangeError('route index required');
    return ROUTE.length-1-index;
  }
  function redLineAudit(){
    const inwardPath=ROUTE.map(x=>x.id),outwardPath=[...inwardPath].reverse();
    const roundTrip=[...inwardPath,...outwardPath.slice(1)];
    const residuals=ROUTE.map((_,index)=>Math.abs(redLineFlip(redLineFlip(index))-index));
    const returnsToOuter=roundTrip.at(-1)===inwardPath[0];
    return Object.freeze({
      schema:'a0.pi-red-line-return-control/1.1.0',
      status:returnsToOuter&&Math.max(...residuals)===0?'PASS_TYPED_RED_LINE_RETURN_CONTROL':'FAIL_RED_LINE_RETURN_CONTROL',
      inwardPath,outwardPath,roundTrip,
      indexFlip:Object.freeze({formula:'R(i)=4−i',involution:true,maxResidual:Math.max(...residuals),carrier:'FINITE_ROUTE_INDEX_SET'}),
      aida:Object.freeze({status:'TYPED_TEST_FIXTURE_ONLY',reading:['A · OUTER ADDRESS','I · RED LINE INTERFACE','D · DIRECTED TRAVERSAL','A′ · RETURNED OUTER ADDRESS'],returnLabel:'A′',addressEqual:returnsToOuter,historyEqual:false,canonicalVocabulary:false}),
      uiOuterReturn:Object.freeze({operation:'ANIMATED_REVERSE_TRAVERSAL',pathReversalExact:true,controlInvolution:false,visibleReverseTraversal:true,reason:'the control visibly replays the declared route from the current address toward OORT; path reversal is exact while the button itself is a directed command'}),
      classical7:Object.freeze({count:CORRESPONDENCES.length,routeTransitionCount:ROUTE.length-1,point83Supported:false,relationToRoute:'SEPARATE_HISTORICAL_LAYER'}),
      redLine:Object.freeze({role:'VIEW_ROUTE_CARRIER',physicalConnection:false,ephemeris:false,distanceScale:false}),
      recognizedObjectClasses:Object.freeze(ROUTE.map(x=>x.objectClass)),
      unboundLabels:Object.freeze(['NTO','NTI','oO0Q°','.83']),
      identityReuse:Object.freeze(['PI_DUAL_POLYHEDRON','PLUTO_CHIRON_ARROKOTH_PATTERN_ONLY']),
      graphDelta:Object.freeze({identities:0,relations:0,aliases:0})
    });
  }
  function state(input={}){return Object.freeze({layer:LAYERS.includes(input.layer)?input.layer:'GEOMETRY',index:clamp(Math.round(Number(input.index)||0),0,ROUTE.length-1),progress:clamp(Number(input.progress)||0,0,1),running:Boolean(input.running),direction:input.direction==='OUTWARD'?'OUTWARD':'INWARD'});}
  function startTraversal(input={},direction='INWARD'){
    const current=state(input),nextDirection=direction==='OUTWARD'?'OUTWARD':'INWARD';
    if(nextDirection==='OUTWARD'&&current.index===0)return state({...current,direction:nextDirection,running:false,progress:0});
    const index=nextDirection==='INWARD'&&current.index===ROUTE.length-1?0:current.index;
    return state({...current,index,direction:nextDirection,running:true,progress:0});
  }
  function advanceTraversal(input={},elapsedMs=0){
    let current=state(input);if(!current.running)return current;
    let progress=current.progress+Math.max(0,Number(elapsedMs)||0)/900,index=current.index;
    const step=current.direction==='OUTWARD'?-1:1,end=current.direction==='OUTWARD'?0:ROUTE.length-1;
    while(progress>=1&&index!==end){progress-=1;index+=step;}
    if(index===end)return state({...current,index,progress:0,running:false});
    return state({...current,index,progress,running:true});
  }
  function audit(){const classes=ROUTE.map(x=>x.objectClass),views=VIEW_GROUPS.flatMap(x=>x.views),field=MACHINA_BINDINGS.field;return Object.freeze({schema:'a0.pi-outer-inner-viewer/1.3.0',status:ROUTE.length===5&&CORRESPONDENCES.length===7&&VIEW_GROUPS.length===5&&views.length===15&&new Set(views).size===15&&classes[1].startsWith('TNO')&&classes[2].startsWith('TNO')&&classes[3]==='CENTAUR'&&field.id==='F-IJ-01'&&field.i+field.j===field.sum&&field.operator==='T(x,y)=(y,x)'?'PASS_TYPED_OUTER_INNER_VIEWER':'FAIL',route:ROUTE.map(x=>x.id),redLineReturn:redLineAudit(),viewGroups:VIEW_GROUPS.map(x=>({id:x.id,count:x.views.length})),sharedCarrier:MACHINA_BINDINGS.carrier,historicalCorrespondences:CORRESPONDENCES.length,machinaBinding:{localName:MACHINA_BINDINGS.localName,fieldId:field.id,operator:field.operator,return:field.return,finalPin:MACHINA_BINDINGS.finalPin.role,foldContact:MACHINA_BINDINGS.foldContact.sequence,displayRole:'LOCAL_THE_MACHINA_WAFFLER'},claims:{ephemeris:false,distanceScale:false,newAstrophysics:false,materialCoupling:false,alchemicalPhysics:false,sparkEnergy:false,newOperator:false},identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:ORIENTATION_DEMONSTRATORS','PLUTO_CHIRON_ARROKOTH_PATTERN_ONLY'],graphDelta:{identities:0,relations:0,aliases:0}});}
  function markerY(input){const s=state(input),step=s.direction==='OUTWARD'?-1:1,next=clamp(s.index+step,0,ROUTE.length-1),a=ROUTE[s.index].y,b=ROUTE[next].y;return a+(b-a)*s.progress;}
  function svgMarkup(input={}){const s=state(input),active=ROUTE[s.index],y=markerY(s);const routeNodes=ROUTE.map((x,i)=>`<g class="oi-node ${i===s.index?'active':''}"><circle cx="500" cy="${x.y}" r="${i===0?18:12}"/><text x="530" y="${x.y-4}">${x.label}</text><text class="sub" x="530" y="${x.y+17}">${x.objectClass}</text></g>`).join('');const hist=CORRESPONDENCES.map((x,i)=>{const a=-Math.PI/2+i*Math.PI*2/7,cx=500+250*Math.cos(a),cy=340+250*Math.sin(a);return `<g class="oi-correspondence"><circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="34"/><text class="sign" x="${cx.toFixed(2)}" y="${(cy+7).toFixed(2)}">${x.sign}</text><text x="${cx.toFixed(2)}" y="${(cy+52).toFixed(2)}">${x.planet} · ${x.metal}</text></g>`}).join('');return `<defs><filter id="oiGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="oiCylinder" x1="0" x2="1"><stop stop-color="#ff9d28" stop-opacity=".08"/><stop offset=".5" stop-color="#ffb62e" stop-opacity=".28"/><stop offset="1" stop-color="#ff9d28" stop-opacity=".08"/></linearGradient></defs><rect width="1000" height="690" class="oi-bg"/><g class="oi-geometry ${s.layer==='GEOMETRY'?'selected':''}"><ellipse cx="500" cy="340" rx="430" ry="305" class="oi-oort"/><text x="96" y="74" class="oi-shell-label">OORT · OUTER ENVELOPE</text><path d="M500 66V642" class="oi-red-line"/><g class="oi-cylinder"><ellipse cx="500" cy="340" rx="192" ry="74"/><path d="M308 340V475M692 340V475"/><ellipse cx="500" cy="475" rx="192" ry="74"/><path d="M308 340A192 74 0 0 0 692 340" class="orange"/></g>${routeNodes}<circle cx="500" cy="${y.toFixed(2)}" r="20" class="oi-rider" filter="url(#oiGlow)"/><text x="470" y="${(y+5).toFixed(2)}" class="oi-rider-label" text-anchor="end">${active.id}</text></g><g class="oi-historical ${s.layer==='HISTORICAL'?'selected':''}">${hist}<circle cx="500" cy="340" r="112" class="oi-hist-core"/><text x="500" y="332" class="oi-core-title">CLASSICAL 7</text><text x="500" y="358" class="oi-core-sub">HISTORICAL CORRESPONDENCE</text></g><g class="oi-nexah ${s.layer==='NEXAH'?'selected':''}"><ellipse cx="500" cy="340" rx="288" ry="170" class="oi-shell platinum"/><ellipse cx="500" cy="340" rx="370" ry="226" class="oi-shell iridium"/><path d="M124 340H876" class="oi-red-line horizontal"/><ellipse cx="500" cy="340" rx="210" ry="82" class="oi-orange-loop"/><path d="M500 250V430M410 340H590" class="oi-waffler-axis"/><circle cx="500" cy="340" r="10" class="oi-waffler-spark" filter="url(#oiGlow)"/><text x="500" y="278" class="oi-waffler-title">THE MACHINA · WAFFLER</text><text x="500" y="306" class="oi-waffler-label">ARROKOTH · VIEW CENTER / SAME CARRIER</text><text x="500" y="332" class="oi-waffler-label">F-IJ-01 · i↔j SPARK</text><text x="500" y="368" class="oi-waffler-label">T(x,y)=(y,x) · I→J→I</text><text x="500" y="394" class="oi-waffler-label">√ DOWN → ° SPARK → ^ UP</text><text x="500" y="458" class="oi-core-sub">RED LINE · ORANGE LOOP · CYLINDER RETURN</text><text x="500" y="484" class="oi-core-sub">PLATINUM INNER · IRIDIUM OUTER</text></g>`;}
  function mount(doc=document,win=window){const dialog=doc.getElementById('piOuterInnerViewer');if(!dialog)return null;const open=doc.getElementById('piOuterInnerOpen'),svg=doc.getElementById('piOiSvg'),readout=doc.getElementById('piOiReadout'),note=doc.getElementById('piOiNote'),status=doc.getElementById('piOiStatus'),ledger=doc.getElementById('piOiLedger'),step=doc.getElementById('piOiStep'),ride=doc.getElementById('piOiRide'),ret=doc.getElementById('piOiReturn'),buttons=[...dialog.querySelectorAll('[data-oi-layer]')],groupButtons=[...doc.querySelectorAll('[data-pi-view-group]')],perspectives=[...doc.querySelectorAll('[data-pi-group]')],groupRows=[...doc.querySelectorAll('[data-pi-group-row]')],groupTitle=doc.getElementById('piViewGroupTitle');let current=state(),raf=0,last=0;
    function selectGroup(id,{activate=false}={}){const group=VIEW_GROUPS.find(x=>x.id===id)||VIEW_GROUPS[0];groupButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.piViewGroup===group.id)));groupRows.forEach(row=>{row.dataset.active=String(row.dataset.piGroupRow===group.id);});if(groupTitle)groupTitle.textContent=`${group.label} · ACTIVE FAMILY`;if(activate){const first=perspectives.find(b=>b.dataset.piGroup===group.id&&b.dataset.piVisual&&!b.hasAttribute('data-pi-fixed-reference'));first?.click();}}
    function render(){const item=ROUTE[current.index],copy=LAYER_COPY[current.layer],motion=current.running?`RIDING ${current.direction}`:'HELD';svg.innerHTML=svgMarkup(current);readout.textContent=copy[0];note.textContent=copy[1];status.textContent=`${motion} · ${item.label} · INDEX ${current.index}/${ROUTE.length-1}`;ledger.innerHTML=`<div><dt>ADDRESS</dt><dd>${item.id}</dd></div><div><dt>OBJECT CLASS</dt><dd>${item.objectClass}</dd></div><div><dt>DIRECTION</dt><dd>${current.direction}</dd></div><div><dt>VIEW NOTE</dt><dd>${item.note}</dd></div><div><dt>LAYER</dt><dd>${current.layer}</dd></div>`;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oiLayer===current.layer)));ride.setAttribute('aria-pressed',String(current.running&&current.direction==='INWARD'));ret.setAttribute('aria-pressed',String(current.running&&current.direction==='OUTWARD'));ride.textContent=current.running&&current.direction==='INWARD'?'Ⅱ HOLD INWARD':'▶ RIDE RED LINE';ret.textContent=current.running&&current.direction==='OUTWARD'?'Ⅱ HOLD OUTWARD':'↩ RIDE OUTWARD';}
    function stop(){current=state({...current,running:false,progress:0});if(raf)win.cancelAnimationFrame?.(raf);raf=0;render();}
    function tick(t){if(!current.running)return;const dt=last?Math.min(60,t-last):16;last=t;current=advanceTraversal(current,dt);render();if(current.running)raf=win.requestAnimationFrame(tick);else raf=0;}
    open?.addEventListener('click',()=>{dialog.showModal?dialog.showModal():dialog.setAttribute('open','');render();});groupButtons.forEach(b=>b.addEventListener('click',()=>selectGroup(b.dataset.piViewGroup,{activate:true})));perspectives.forEach(b=>b.addEventListener('click',()=>selectGroup(b.dataset.piGroup)));buttons.forEach(b=>b.addEventListener('click',()=>{current=state({...current,layer:b.dataset.oiLayer});render();}));step.addEventListener('click',()=>{current=state({...current,index:(current.index+1)%ROUTE.length,progress:0,running:false,direction:'INWARD'});render();});ride.addEventListener('click',()=>{if(current.running){stop();return;}current=startTraversal(current,'INWARD');last=0;render();if(current.running)raf=win.requestAnimationFrame(tick);});ret.addEventListener('click',()=>{if(current.running){stop();return;}current=startTraversal(current,'OUTWARD');last=0;render();if(current.running)raf=win.requestAnimationFrame(tick);});dialog.addEventListener('close',()=>{if(current.running)stop();});const activePerspective=perspectives.find(b=>b.dataset.piVisual&&b.getAttribute('aria-pressed')==='true');selectGroup(activePerspective?.dataset.piGroup||'GEOMETRY');render();return Object.freeze({getState:()=>current,audit,selectGroup,close:()=>dialog.close?.()});}
  return{LAYERS,VIEW_GROUPS,ROUTE,CORRESPONDENCES,MACHINA_BINDINGS,redLineFlip,redLineAudit,state,startTraversal,advanceTraversal,audit,markerY,svgMarkup,mount};
});
