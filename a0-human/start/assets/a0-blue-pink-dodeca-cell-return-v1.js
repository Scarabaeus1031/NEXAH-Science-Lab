(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0BluePinkDodecaCellReturn=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SATELLITE_COUNT=4;
  const FACES_PER_DODECA=12;
  const BODY_CELL_COUNT=SATELLITE_COUNT*FACES_PER_DODECA;
  const RETURN_CELL_COUNT=FACES_PER_DODECA;
  const TOTAL_CELL_COUNT=BODY_CELL_COUNT+RETURN_CELL_COUNT;
  const SHADOW_COUNT=SATELLITE_COUNT;
  const PINK_DIAMOND_ROLE_CONTRACT=Object.freeze({entry:'ORANGE_FLOOR',carrier:'WHITE_DODECA',views:Object.freeze({AM:'YELLOW_DIAMOND',PM:'PINK_DIAMOND'}),boundary:'BODY_IS_NOT_VIEW_COLOR_AND_GRID_IS_THE_ADDRESS_INSTRUMENT_NOT_THE_FLAGSHIP_NAME'});
  const BODY_DEFS=[
    {id:'BLUE-01',side:'BLUE',observer:-1,role:'DAY_VIEW',offset:[-.72,-.28]},
    {id:'BLUE-02',side:'BLUE',observer:-1,role:'DAY_VIEW',offset:[-.46,.42]},
    {id:'PINK-01',side:'PINK',observer:1,role:'NIGHT_VIEW',offset:[.72,-.28]},
    {id:'PINK-02',side:'PINK',observer:1,role:'NIGHT_VIEW',offset:[.46,.42]}
  ];
  function buildLedger(){
    const bodies=BODY_DEFS.map((body,bodyIndex)=>({...body,faces:Array.from({length:FACES_PER_DODECA},(_,faceIndex)=>({
      cell_index:bodyIndex*FACES_PER_DODECA+faceIndex,
      cell_id:`${body.id}:F${String(faceIndex+1).padStart(2,'0')}`,
      layer:'BODY'
    }))}));
    const returnBody={id:'RETURN-00',side:'CENTER',observer:0,role:'RETURN_PIVOT',faces:Array.from({length:FACES_PER_DODECA},(_,faceIndex)=>({
      cell_index:BODY_CELL_COUNT+faceIndex,
      cell_id:`RETURN-00:F${String(faceIndex+1).padStart(2,'0')}`,
      layer:'RETURN'
    }))};
    return {bodies,returnBody,counts:{satellite_dodecahedra:SATELLITE_COUNT,faces_per_dodecahedron:FACES_PER_DODECA,body_cells:BODY_CELL_COUNT,return_cells:RETURN_CELL_COUNT,total_cells:TOTAL_CELL_COUNT}};
  }
  function cellAt(index){const ledger=buildLedger();if(!Number.isInteger(index)||index<0||index>=TOTAL_CELL_COUNT)return null;return index<BODY_CELL_COUNT?ledger.bodies[Math.floor(index/FACES_PER_DODECA)].faces[index%FACES_PER_DODECA]:ledger.returnBody.faces[index-BODY_CELL_COUNT];}
  function buildShadowLayer(){return BODY_DEFS.map((body,index)=>({shadow_id:`SHADOW-${String(index+1).padStart(2,'0')}`,source_body_id:body.id,role:'PROJECTED_VIEW_RESIDUAL',identity_effect:'NONE'}));}
  function buildActivationSequence(){return [
    {index:0,id:'INPUT_PENTAGON',role:'SELECTED_WHITE_FACE_APERTURE',count:1,evidence:'DECLARED_VIEW_ROLE',intake:{grammar:'O-C-O',center:'C',ports:['O','O'],aperturePolygon:'PENTAGON',surroundingHypothesis:{polygon:'HEPTAGON',count:7,status:'OPEN_INTAKE_HYPOTHESIS'}}},
    {index:1,id:'THREE_PLUS_ONE_STAGE',role:'THREE_TRANSFORMATION_REGISTERS_PLUS_RETAINED_INPUT_REFERENCE',count:4,evidence:'CONSTRUCTED_SEQUENCE_ROLE'},
    {index:2,id:'FOUR_PLUS_ONE_VIEW',role:'FOUR_SATELLITE_VIEWS_PLUS_ONE_CENTRAL_RETURN_PIVOT',count:5,evidence:'EXACT_DECLARED_BODY_COUNT'},
    {index:3,id:'FOUR_SHADOW_PROJECTION',role:'ONE_VIEW_RESIDUAL_PER_SATELLITE_BODY',count:SHADOW_COUNT,evidence:'CONSTRUCTED_PROJECTION_LAYER'},
    {index:4,id:'FOUR_APERTURE_GRID',role:'FOUR_PROJECTED_WALL_SLOTS_FORM_THE_TERMINAL_VIEW_GRID',count:4,evidence:'REUSED_CHECK_85_86_PROJECTION_ONLY'},
    {index:5,id:'RETURN_RECORD',role:'CENTRAL_PIVOT_AND_DISPLAY_FIN_CLOSE_THE_VIEW',count:1,evidence:'DECLARED_VIEW_ROLE'}
  ];}
  function buildLookbackModel(){return {
    carrier:'SHARED_VISIBILITY_FIELD',
    covariantViews:[
      {id:'BLACK_SUN',role:'UNDERLYING_PARTLY_OCCLUDED_FIELD_SIDE'},
      {id:'BIG_MOON',role:'RETURNING_VISIBLE_RECORD_SIDE'}
    ],
    connector:{rootAddress:[1,1],operators:{I:'IDENTITY',J:'MIRROR',law:'J^2=I'},seam:'I/J',typing:'GRID_ADDRESS_NOT_DECIMAL_1.1'},
    terminalGrid:{id:'FOUR_APERTURE_GRID',apertureCount:4,adapter:'4xO8_OVERLAP_TO_FOUR_WALL_SLOTS',status:'PROJECTION_ONLY',sourceChecks:[85,86]},
    motion:{rotation:'WHOLE_DISPLAY_SPACE_ROTATION',interaction:'DRAG_ROTATES_GRID_OVAL_APERTURES_AND_CELL_FORMATION_TOGETHER',autoRotation:true,breathing:'COMPARISON_ENVELOPE',intrinsicMechanismClaim:false},
    mnemonic:{label:'THE_ROOM_LOOKS_BACK',status:'FRAME_AND_BOUNDARY_CONDITIONED_OBSERVATION_RETURN_ONLY'},
    boundary:'One field and two records; no agency, consciousness, astronomy or physical breathing mechanism is asserted.'
  };}
  function buildMirrorAnatomy(){return {
    visibleTips:{count:3,role:'VISIBLE_PROJECTION_SAMPLE',status:'NOT_A_POLYHEDRON_VERTEX_COUNT'},
    aperture:{id:'LIVING_FLAME',role:'OPENING_WHERE_LIGHT_SHADOW_DIFFERENCE_IS_READ'},
    growthAnalogy:{label:'LEAF_GROWTH',status:'METAPHOR_ONLY'},
    localChannels:{
      AM:{semanticRole:'ACTIVE_MEANING',regimeRole:'OPEN_EXPAND_OUTWARD_FLOW_DAY'},
      VM:{semanticRole:'VISIONARY_EMERGENCE',regimeRole:'VIRTUAL_MIXED_TRANSITION_BLEND_PHASE_SHIFT_INTERFERENCE',position:'MIDDLE_SEAM'},
      PM:{semanticRole:'PRAGMATIC_MANIFESTATION',regimeRole:'CLOSE_CONTRACT_INWARD_FLOW_NIGHT'}
    },
    transitionGeometry:{goldenSeam:{role:'ZIPPER_SEAM_APERTURE_SPINE',action:'OPENS_AND_CLOSES_THE_VIEW'},violetBand:{role:'PREFERRED_OBSERVATION_CORRIDOR',projection:'TWO_DIMENSIONAL_SLICE_OF_THE_VIEW'},relation:'SEAM_CROSSES_BAND_AT_THE_APERTURE'},
    layers:['POLAR_GRID_BACKGROUND','VIOLET_VIEW_BAND','GOLDEN_SEAM','FOLD','OVAL_VISIBILITY_APERTURE'],
    mnemonic:{label:'MAKEUP_MIRROR',role:'TWO_SIDES_AND_A_RETURNING_VIEW'},
    boundary:'This is a source-bound view-reading grammar. Pole semantics and regime labels are retained as distinct vocabularies; no physical light mechanism or literal Möbius surface is asserted.'
  };}
  function buildRootRoomLens(){return {
    route:['MANDELBROT_PARAMETER_SPACE','ROOT_ROOM_ORIENTATION_GATE','JULIA_DYNAMICAL_FIBER'],
    sharedParameter:'c',
    operators:[
      {id:'PHI',value:(1+Math.sqrt(5))/2,role:'EXPANSION_VIEW'},
      {id:'PI',value:Math.PI,role:'ROTATION_VIEW'},
      {id:'ROOT_2',value:Math.sqrt(2),role:'PROJECTION_VIEW'}
    ],
    rootNode:{label:'L50',status:'OWNER_VISUAL_MARKER_NOT_COMPUTED_SELECTOR'},
    apertureGate:{role:'SELECTIVE_VIEW_CUT',output:'SHADOW_CHAMBER'},
    phaseCycle:['AM_INJECTION','VM_ABSORPTION','PM_TRANSITION_EMISSION','RETURN'],
    executedOperator:'z_(n+1)=z_n^2+c',
    boundary:'Phi, pi, root 2, L50, horseshoe and flame names remain separate view markers. Only the standard quadratic iteration is executed.'
  };}
  function buildThreeLissajousPlanes(){return {
    status:'LIVE_THREE_PLANE_PROJECTION_OF_ONE_DECLARED_SIGNAL_CARRIER',
    carrier:{id:'THREE_SIGNAL_CARRIER',signals:['sin(a*t)','sin(b*t+delta)','sin(t+delta/2)'],defaultFrequencies:[3,2,1],sharedTime:true},
    defaultRatio:'3:2',
    defaultPhase:Math.PI/2,
    planes:[
      {id:'AM_PLANE',projection:[0,1],semanticRole:'ACTIVE_MEANING',regimeRole:'OPEN_EXPAND_OUTWARD_FLOW_DAY'},
      {id:'VM_PLANE',projection:[1,2],semanticRole:'VISIONARY_EMERGENCE',regimeRole:'VIRTUAL_MIXED_TRANSITION_BLEND_PHASE_SHIFT_INTERFERENCE'},
      {id:'PM_PLANE',projection:[2,0],semanticRole:'PRAGMATIC_MANIFESTATION',regimeRole:'CLOSE_CONTRACT_INWARD_FLOW_NIGHT'}
    ],
    orientationRecord:'THE_SHARED_MOVING_TIME_MARKER_RETAINS_TRACE_DIRECTION',
    overlayRole:'SIMULTANEOUS_COMPARISON_OF_THREE_COORDINATE_PROJECTIONS',
    seamMode:{
      points:['P_AM=(s1,s2)','P_VM=(s2,s3)','P_PM=(s3,s1)'],
      centroid:'G=((s1+s2+s3)/3,(s1+s2+s3)/3)',
      dispersion:'D=(s1-s2)^2+(s2-s3)^2+(s3-s1)^2',
      signedTriangleArea:'A_signed=-D/4',
      exactCondition:'D=0 iff s1=s2=s3',
      typing:'THREE_PROJECTIONS_PLUS_ONE_SHARED_COINCIDENCE_EVENT_NOT_FOUR_BODIES',
      returnRequirement:'RE_SEPARATION_REQUIRES_AN_ORDERED_TIME_OR_DERIVATIVE_RECORD'
    },
    defaultDiagnostic:{ratio:'3:2',phase:'pi/2',classification:'NEAR_SEAM_NOT_EXACT',minimumTimeApprox:0.3122526798108317,minimumDispersionApprox:0.013394457185717435,method:'DENSE_NUMERICAL_SCAN_AND_LOCAL_REFINEMENT_NOT_FORMAL_PROOF'},
    boundary:'The curves are three declared 2D projections of one synthetic signal carrier. They are a live view instrument, not evidence of a tri-solar, lunar, energetic or physical mechanism.'
  };}
  function buildPinkDiamondRoleContract(){return {entry:PINK_DIAMOND_ROLE_CONTRACT.entry,carrier:PINK_DIAMOND_ROLE_CONTRACT.carrier,views:{...PINK_DIAMOND_ROLE_CONTRACT.views},boundary:PINK_DIAMOND_ROLE_CONTRACT.boundary};}
  function validate(){const ledger=buildLedger(),bodyCells=ledger.bodies.flatMap(body=>body.faces),sequence=buildActivationSequence();return {
    satelliteDodecahedra:ledger.bodies.length,
    facesPerDodecahedron:FACES_PER_DODECA,
    bodyCells:bodyCells.length,
    returnCells:ledger.returnBody.faces.length,
    totalCells:bodyCells.length+ledger.returnBody.faces.length,
    uniqueCells:new Set([...bodyCells,...ledger.returnBody.faces].map(cell=>cell.cell_id)).size,
    bilateral:ledger.bodies.filter(body=>body.side==='BLUE').length===2&&ledger.bodies.filter(body=>body.side==='PINK').length===2,
    shadowCount:buildShadowLayer().length,
    shadowSourcesUnique:new Set(buildShadowLayer().map(shadow=>shadow.source_body_id)).size===SHADOW_COUNT,
    exactLedger:SATELLITE_COUNT*FACES_PER_DODECA+RETURN_CELL_COUNT===TOTAL_CELL_COUNT,
    activationSteps:sequence.length,
    inputApertureRetained:sequence[0].id==='INPUT_PENTAGON'&&sequence[1].role.includes('RETAINED_INPUT_REFERENCE'),
    fourPlusOneView:sequence[2].count===SATELLITE_COUNT+1,
    fourApertureTerminal:sequence[4].id==='FOUR_APERTURE_GRID'&&sequence[4].count===4,
    orderedReturn:sequence.map(step=>step.id).join('>')==='INPUT_PENTAGON>THREE_PLUS_ONE_STAGE>FOUR_PLUS_ONE_VIEW>FOUR_SHADOW_PROJECTION>FOUR_APERTURE_GRID>RETURN_RECORD',
    cycleClosed:sequence[0].id==='INPUT_PENTAGON'&&sequence.at(-1).id==='RETURN_RECORD'
  };}
  return {SATELLITE_COUNT,FACES_PER_DODECA,BODY_CELL_COUNT,RETURN_CELL_COUNT,TOTAL_CELL_COUNT,SHADOW_COUNT,BODY_DEFS,PINK_DIAMOND_ROLE_CONTRACT,buildLedger,buildShadowLayer,buildActivationSequence,buildLookbackModel,buildMirrorAnatomy,buildRootRoomLens,buildThreeLissajousPlanes,buildPinkDiamondRoleContract,cellAt,validate};
});
