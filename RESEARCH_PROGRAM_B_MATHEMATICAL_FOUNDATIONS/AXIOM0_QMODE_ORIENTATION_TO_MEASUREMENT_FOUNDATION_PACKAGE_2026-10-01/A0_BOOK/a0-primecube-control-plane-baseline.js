(function(root,factory){
  const api=factory(
    typeof module==='object'&&module.exports?require('./a0-primecube-model.js'):root.A0PrimecubeModel,
    typeof module==='object'&&module.exports?require('./a0-loki-tessarec-pipe.js'):root.A0LokiTessarecPipe,
    typeof module==='object'&&module.exports?require('./a0-point-line-topology-return.js'):root.A0PointLineTopologyReturn,
    typeof module==='object'&&module.exports?require('./a0-ae-zipper-boundary.js'):root.A0AeZipperBoundary
  );
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeControlPlaneBaseline=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Primecube,Loki,PointLine,AeZipper){
  'use strict';
  if(!Primecube||!Loki||!PointLine||!AeZipper)throw Error('Primecube control-plane baseline dependencies are required');

  const VERSION='1.0.0';
  const IDENTITY_REUSE=Object.freeze([
    'NEXAH_AX0_QMODE_FOUNDATION_PACKAGE',
    'ART:A0:MATHEMATICAL_JOINTS',
    'MOD:NUMBER_VIEW_SUITE',
    'MOD:TESSAREC',
    'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'
  ]);

  const SECTION_INVENTORY=Object.freeze([
    ['contract-demo-audit','CONTRACT_COVERAGE','AUDIT'],
    ['primecube-workbench','PRIMECUBE_1_TO_1111','CARRIER_AND_VIEW_WORKBENCH'],
    ['shadow-cube-envelope','SHADOW_11_CUBED','ADDRESS_ENVELOPE'],
    ['critical-line-root-topology-gate','ROOT_TOPOLOGY','GATED_VIEW'],
    ['thoth-aua-khipu-ledger','KHIPU_KNOT','LEDGER_AND_VIEW'],
    ['sz-chirality-invariant-lab','SZ_CHIRALITY','DISPLAY_LAB'],
    ['primecube-reviewer-packet','REVIEWER_PACKET','RECEIPT_VIEW'],
    ['coupled-orbit-demonstrator','Q_T20_BARCODE','COUPLED_ADDRESS_VIEW'],
    ['loki-chassis','SPLINTER_SAIL_GRID','RETAINED_SCREEN_CHASSIS'],
    ['mathfield-coupling-deck','MATHFIELD_COUPLING_DECK','TYPED_VIEW_SWITCH'],
    ['primecube-boundary-transversal-plane-return','TRANSVERSAL_PLANE_RETURN','SCIENCE_RETURN_CROSS_SECTION'],
    ['primecube-wheel-7-8-gate13-demonstrator','W7_W8_G13','FINITE_PRODUCT_STATE_ADAPTER'],
    ['scarab-control-lens','SCARAB_CONTROL','DISPLAY_CONTROLLER'],
    ['fixed-point-nband-demonstrator','FIXED_POINT_N_BANDS','COMPARATOR'],
    ['mandelbrot-memory-field','ALPHA_BETA_MEMORY','ITERATION_VIEW'],
    ['al-jabr-dot-lens','AL_JABR_DOT','TYPED_DOT_ROLES'],
    ['hrecord-crosswalk','H_RECORD','TYPED_CROSSWALK'],
    ['nlk-package-port','NLK','EXTERNAL_TYPED_PORT'],
    ['q-t20-cube','Q_CRT_T20','REVERSIBLE_STATE_ENGINE'],
    ['unit-root-shear','UNIT_ROOT_SHEAR','COMPARATOR_VIEW'],
    ['number-view-suite-port','NUMBER_VIEW_SUITE','EXTERNAL_TYPED_PORT']
  ].map(([sectionId,moduleId,role])=>Object.freeze({sectionId,moduleId,role,status:'BOUND_EXISTING'})));

  const GLYPH_GRAMMAR=Object.freeze([
    Object.freeze({id:'SOURCE_POINT',glyph:'.',type:'ADDRESSED_SOURCE_LATCH',status:'BOUND',source:'a0-point-line-topology-return.js',not:Object.freeze(['DECIMAL_POINT','PRODUCT_DOT','PHASE_SIGNAL'])}),
    Object.freeze({id:'CENTER_DOT',glyph:'·',type:'SELECTED_GRID_CELL',status:'BOUND',source:'a0-primecube-model.js',not:Object.freeze(['SOURCE_POINT','DECIMAL_POINT','PRODUCT_DOT'])}),
    Object.freeze({id:'DECIMAL_POINT',glyph:'.',type:'DECLARED_SCALE_CHANGE',status:'BOUND',source:'a0-primecube-model.js',not:Object.freeze(['SOURCE_POINT','PRODUCT_DOT'])}),
    Object.freeze({id:'PRODUCT_DOT',glyph:'·',type:'MULTIPLICATION',status:'BOUND',source:'a0-primecube-model.js',not:Object.freeze(['SOURCE_POINT','DECIMAL_POINT'])}),
    Object.freeze({id:'OPEN_TYPED_JOINT',glyph:':',type:'OPEN_CONNECTOR_NO_GLUE',status:'BOUND',source:'a0-point-line-topology-return.js',not:Object.freeze(['DIVISION','RATIO','TOPOLOGY','PHASE_TRANSPORT'])}),
    Object.freeze({id:'EURO_VIEW',glyph:'€',type:'EXCHANGE_VALUE_VIEW',status:'OWNER_CANDIDATE_HOLD',source:'a0-ae-zipper-boundary.js',not:Object.freeze(['OPERATOR','MEASUREMENT','MECHANISM','E5_ADDRESS'])}),
    Object.freeze({id:'CENT_VIEW',glyph:'¢',type:'UNASSIGNED_GLYPH_PORT',status:'UNBOUND_HOLD',source:null,not:Object.freeze(['OPERATOR','PHASE_SIGNAL','CURRENCY_RELATION'])})
  ]);

  const CONTROL_ROLES=Object.freeze([
    Object.freeze({id:'QCTRL',type:'VIEW_SELECTOR',operator:'SELECT_INSERT / HIGHLIGHT_SAIL / RETURN_TO_SOURCE',period:null,return:'RETAINED_ROOT_AND_SOURCE_NUMBER'}),
    Object.freeze({id:'Q_CUBE',type:'CRT_STATE_REGISTER',operator:'n -> (n mod 7, n mod 11, n mod 13)',period:null,return:'CRT_ADDRESS_OF_RETAINED_INTEGER'}),
    Object.freeze({id:'T20_PLUS_MINUS',type:'REVERSIBLE_STATE_TRANSITION',operator:'n -> 20n mod 1001 / n -> 951n mod 1001',period:60,return:'EXACT_INVERSE_AND_POWER_60'}),
    Object.freeze({id:'MZ24',type:'NON_INJECTIVE_24_SLOT_PHASE_READOUT_WITH_RESTRICTED_IMAGE',operator:'((n mod 11)+(n mod 13)) mod 24',period:null,return:'DERIVED_READOUT_ONLY'}),
    Object.freeze({id:'MATHFIELD_DECK',type:'TYPED_VIEW_SWITCH',operator:'SELECT_ADAPTER',period:null,return:'ADAPTER_LOCAL_RETURN'}),
    Object.freeze({id:'ISO45_FOLD',type:'GEOMETRIC_VIEW_INVOLUTION',operator:'F=(1 11)(33 22)(8)(27)',period:2,return:'EXACT_VIEW_RETURN'}),
    Object.freeze({id:'LOKI_C7_C8',type:'DISPLAY_STATE_CYCLE',operator:'k -> (k mod 7, k mod 8)',period:56,return:'EXACT_56_STEP_RETURN'}),
    Object.freeze({id:'RETURN_RECEIPT',type:'VALIDATION_GATE',operator:'COMPARE_SOURCE_AND_RETURN_WITNESSES',period:null,return:'PASS_FAIL_HOLD'})
  ]);

  const mod=(n,m)=>((n%m)+m)%m;
  function splinterQBaseline(){
    const anchors=Object.freeze([1,8,11,22,27,33]);
    const mapped=Object.freeze(anchors.map(n=>mod(20*n,1001)));
    const phases=Object.freeze(anchors.map(n=>Object.freeze({n,tick:Primecube.mz24CompassRecord(n).tick,degrees:Primecube.mz24CompassRecord(n).angleDegrees})));
    const byN=new Map(phases.map(item=>[item.n,item]));
    const foldPhasePairs=Object.freeze([[1,11],[33,22]].map(([a,b])=>Object.freeze({pair:Object.freeze([a,b]),deltaDegrees:Math.abs(byN.get(a).degrees-byN.get(b).degrees)})));
    return Object.freeze({
      anchors,mapped,closedUnderT20:mapped.every(n=>anchors.includes(n)),phases,foldPhasePairs,
      uniformFoldPhaseDelta:new Set(foldPhasePairs.map(item=>item.deltaDegrees)).size===1,
      status:'BASELINE_NEGATIVE_NO_DIRECT_Q_TO_SPLINTER_CLOSURE',
      boundary:'This result blocks an implicit Q-Cube-to-Splinter control claim. A separately declared adapter is required before coupling tests.'
    });
  }

  function verify(){
    const checks=[];
    const check=(value,label)=>{if(!value)throw Error(`FAIL ${label}`);checks.push(label)};
    const q=Primecube.qCubeRecord(),fold=Primecube.splinterBookFoldRecord(90,'SOURCE'),loki=Loki.verify(),point=PointLine.inspect(1),dots=Primecube.alJabrDotLensRecord(),deck=Primecube.mathfieldCouplingDeckRecord(),sail=Primecube.lokiChassisRecord(),euro=AeZipper.PLATES.EURO,baseline=splinterQBaseline();
    check(SECTION_INVENTORY.length===21,'twenty-one visible Primecube page sections inventoried');
    check(Primecube.contractDemoCoverageRecord().count===36&&Primecube.contractDemoCoverageRecord().boundCount===36,'thirty-six of thirty-six contract modules are demo-bound');
    check(new Set(GLYPH_GRAMMAR.map(item=>item.id)).size===GLYPH_GRAMMAR.length,'glyph role identifiers are unique');
    check(point.sourceRole==='SOURCE_POINT'&&point.colonRole==='OPEN_TYPED_JOINT / NO GLUING SELECTED','source point and open colon joint remain distinct');
    check(point.colonRole.includes('NO GLUING')&&!point.colonRole.includes('PHASE'),'colon has no phase-transport contract');
    check(dots.operators.map(item=>item.id).join(',')==='CENTER_DOT,DECIMAL_POINT,PRODUCT_DOT','three Primecube dot roles remain distinct');
    check(euro.glyph==='€'&&euro.role==='EXCHANGE_VALUE_VIEW'&&euro.status==='OWNER_CANDIDATE','Euro remains an Owner-candidate view');
    check(GLYPH_GRAMMAR.find(item=>item.id==='CENT_VIEW').status==='UNBOUND_HOLD','cent glyph remains unbound');
    check(q.modulus===1001&&q.factorization.join(',')==='7,11,13','Q Cube retains modulus 1001 and factors 7 11 13');
    check(q.forward.order===60&&q.inverse.order===60,'T20 plus and minus each have order 60');
    check(q.exactReturn.forwardThenInverse===1&&q.exactReturn.power60===1,'Q Cube inverse and step-60 return are exact');
    check(q.forward.orbit.length===60&&new Set(q.forward.orbit).size===60,'T20 orbit contains sixty distinct retained states');
    check(loki.status==='PASS'&&loki.orbitLength===56,'LOKI C7 by C8 cycle returns after 56 states');
    check(Loki.state(56).station===0&&Loki.state(56).orientation===0,'LOKI return state is exactly zero zero');
    check(fold.closure.involution&&fold.closure.axisDrift===0,'ISO45 fold is an axis-fixed involution');
    check(fold.return.exact&&fold.return.maxCoordinateError===0,'ISO45 view return is exact');
    check(fold.invariance.source===false&&fold.invariance.symmetric===true,'source diagonal set fails while symmetric control passes');
    check(Array.from({length:1001},(_,n)=>Primecube.mz24CompassRecord(n).tick).every(tick=>tick>=0&&tick<24),'MZ24 readout stays within 24 ticks');
    const allMz24Ticks=new Set(Array.from({length:1001},(_,n)=>Primecube.mz24CompassRecord(n).tick));
    check(allMz24Ticks.size===23&&!allMz24Ticks.has(23),'MZ24 has 24 display slots but its declared law reaches only ticks zero through twenty-two');
    check(Primecube.mz24CompassRecord(27).angleDegrees===90,'anchor 27 reads 90 degrees on MZ24');
    check(sail.qctrl.role==='DECLARED_VIEW_CONTROLLER'&&sail.qctrl.operators.includes('RETURN_TO_SOURCE'),'QCTRL is a source-returning view controller');
    check(deck.navigatorEffect.newCanonicalIds===0&&deck.navigatorEffect.relationChanges===0,'Mathfield deck creates no identity or relation');
    check(deck.adapters.find(item=>item.id==='LOKI').period===56&&deck.adapters.find(item=>item.id==='ISO45_FOLD').returnContract==='EXACT_VIEW_RETURN','deck keeps LOKI and ISO45 as typed adapters');
    check(!baseline.closedUnderT20&&baseline.mapped.join(',')==='20,160,220,440,540,660','Splinter anchor set is not closed under T20');
    check(!baseline.uniformFoldPhaseDelta&&baseline.foldPhasePairs.map(item=>item.deltaDegrees).join(',')==='135,30','fold pairs do not share one MZ24 phase delta');
    return Object.freeze({
      schema:'nexah.a0.primecube-control-plane-baseline/1',version:VERSION,status:'PASS_BASELINE_WITH_EXPLICIT_HOLDS',checks:Object.freeze(checks),checkCount:checks.length,
      inventory:Object.freeze({visibleSections:SECTION_INVENTORY.length,contractModules:34,contractModulesBound:34}),
      periods:Object.freeze({qT20:60,loki:56,iso45Fold:2}),
      holds:Object.freeze(['COLON_PHASE_TRANSPORT_UNDEFINED','CENT_GLYPH_UNBOUND','EURO_OPERATOR_UNBOUND','DIRECT_Q_TO_SPLINTER_ADAPTER_ABSENT','COMBINED_840_STEP_TEST_NOT_STARTED']),
      splinterQBaseline:baseline,identityReuse:IDENTITY_REUSE,newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      claimBoundary:'Inventory, notation typing and existing finite-model replay only. No new Study, Finding, physical mechanism, common carrier, shared clock, phase line, currency relation or publication state is created.'
    });
  }

  return Object.freeze({VERSION,IDENTITY_REUSE,SECTION_INVENTORY,GLYPH_GRAMMAR,CONTROL_ROLES,splinterQBaseline,verify});
});
