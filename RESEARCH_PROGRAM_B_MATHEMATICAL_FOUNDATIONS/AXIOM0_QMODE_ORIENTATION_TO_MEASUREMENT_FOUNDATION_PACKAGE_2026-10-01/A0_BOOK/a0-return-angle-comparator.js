(function(root,factory){
  const api=factory(
    typeof module==='object'&&module.exports?require('./a0-pi-portal-coupling.js'):root.A0PiPortalCoupling,
    typeof module==='object'&&module.exports?require('./a0-ullinirium-q4-view-anchor.js'):root.A0UlliniriumQ4ViewAnchor,
    typeof module==='object'&&module.exports?require('./assets/a0-blue-pink-dodeca-cruiser-v1.js'):root.A0BluePinkDodecaCruiser,
    typeof module==='object'&&module.exports?require('./assets/a0-coupled-channel-boundary-v1.js'):root.A0CoupledChannelBoundary
  );
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0ReturnAngleComparator=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Portal,Ullinirium,Cruiser,Coupled){
  'use strict';
  if(!Portal||!Ullinirium||!Cruiser||!Coupled)throw new Error('A0_RETURN_COMPARATOR_SOURCES_REQUIRED');

  const SCHEMA='a0.return-angle-comparator/1.0.0';
  const PI_ROLE='PHASE_ADDRESS';
  const ULLINIRIUM_ROLE='VIEW_ANCHOR';

  function ensure(condition,code){if(!condition)throw new TypeError(code)}
  function createReceipt({slot=0,route='YELLOW',faceIndex=0,addressSlot=0}={}){
    const pi=Portal.audit();
    const ullinirium=Ullinirium.createReceipt({slot,route});
    const cruiser=Cruiser.assemblyState({faceIndex,addressSlot,aperture:1,thrust:1});
    const coupled=Coupled.snapshot();
    const piDegrees=pi.addressChain.phaseAddress;
    const anchorDegrees=ullinirium.source.view_anchor_degrees;
    const record={
      schema:SCHEMA,
      status:'PASS_TYPED_RETURN_COMPARATOR',
      sources:{
        pi:{role:PI_ROLE,degrees:piDegrees,status:pi.status,authority:'A0_PLATINUM_IRIDIUM_PI_LENS.html#piLens'},
        ullinirium:{role:ULLINIRIUM_ROLE,degrees:anchorDegrees,status:ullinirium.profile_state,authority:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#ulliniriumQ4ViewAnchor'},
        cruiser:{role:'LOCAL_VECTOR_CLOSURE',equation:cruiser.vectorClosure.equation,exact:cruiser.vectorClosure.exact,authority:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#cruiser'}
      },
      comparison:{
        numeric_separation_degrees:Math.abs(piDegrees-anchorDegrees),
        angle_roles_equal:false,
        derivation:false,
        transition_operator:null,
        disposition:'DISPLAY_COMPARISON_ONLY'
      },
      shared_grammar:['FIXED_CARRIER','PROJECTED_VIEW','MOVING_WITNESS','APERTURE','COMMON_RETURN_PIVOT'],
      closure:{
        equation:cruiser.vectorClosure.equation,
        error:cruiser.vectorClosure.error,
        outside_in:cruiser.vectorClosure.outsideIn,
        inside_out:cruiser.vectorClosure.insideOut,
        return_cell:cruiser.returnCell.cell_id,
        ullinirium_return_role:ullinirium.return.pivot_role,
        exact:true
      },
      overlay:{
        grid_steps_degrees:{n36:10,t9:40,beta27:40/3,flip64:5.625},
        exact_alignment_periods_degrees:{n36_t9:40,n36_beta27:40,n36_flip64:90,full_return:360},
        ghostgrid_role:'DISPLAY_RESIDUAL_ONLY',
        schlieren_role:'DISPLAY_CONTRAST_ONLY_NOT_PHYSICAL_SCHLIEREN',
        plus_minus_2_status:'HOLD_SOURCE_REQUIRED',
        interpolation:'CSS_VECTOR_DISPLAY_NO_SOURCE_SAMPLING'
      },
      existing_state:{
        parameter:{namespace:'DYNAMICAL_PARAMETER',symbol:'c',value:[coupled.state.cRe,coupled.state.cIm]},
        classification:coupled.boundaries.dynamical.code,
        shared_by:coupled.coupledParameter.sharedBy,
        angle_operator:null,
        source_mutation:false
      },
      display:{pulse_role:'DISPLAY_ENVELOPE_ONLY',carrier_mutation:false,address_mutation:false},
      identity_reuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC','EXISTING_PI_PHASE_ADDRESS_204','RETURN-00'],
      new_canonical_ids:[],
      relation_changes:[],
      aliases:[],
      claim_boundary:'204 degrees is an existing PI phase address; 135 degrees is an existing ULLINIRIUM view anchor. Their 69 degree numerical separation is displayed only and defines no map, identity or transition operator. P=A+B is the existing Cruiser local vector closure into the existing RETURN-00 cell family. Pulse is display motion only.'
    };
    return validate(record);
  }

  function validate(record){
    ensure(record&&record.schema===SCHEMA,'RETURN_COMPARATOR_SCHEMA_INVALID');
    ensure(record.status==='PASS_TYPED_RETURN_COMPARATOR','RETURN_COMPARATOR_STATUS_INVALID');
    ensure(record.sources?.pi?.role===PI_ROLE&&record.sources.pi.degrees===204,'RETURN_COMPARATOR_PI_SOURCE_INVALID');
    ensure(record.sources?.ullinirium?.role===ULLINIRIUM_ROLE&&record.sources.ullinirium.degrees===135,'RETURN_COMPARATOR_ULLINIRIUM_SOURCE_INVALID');
    ensure(record.sources.pi.role!==record.sources.ullinirium.role,'RETURN_COMPARATOR_TYPE_COLLAPSE_FORBIDDEN');
    ensure(record.comparison?.numeric_separation_degrees===69,'RETURN_COMPARATOR_NUMERIC_SEPARATION_INVALID');
    ensure(record.comparison.angle_roles_equal===false&&record.comparison.derivation===false&&record.comparison.transition_operator===null,'RETURN_COMPARATOR_OPERATOR_FORBIDDEN');
    ensure(record.comparison.disposition==='DISPLAY_COMPARISON_ONLY','RETURN_COMPARATOR_DISPOSITION_INVALID');
    ensure(record.sources.cruiser.equation==='P=A+B'&&record.sources.cruiser.exact===true,'RETURN_COMPARATOR_CRUISER_CLOSURE_INVALID');
    ensure(record.closure?.equation==='P=A+B'&&record.closure.error===0&&record.closure.exact===true,'RETURN_COMPARATOR_CLOSURE_INVALID');
    ensure(/^RETURN-00:F\d{2}$/.test(record.closure.return_cell),'RETURN_COMPARATOR_RETURN_CELL_INVALID');
    ensure(record.closure.ullinirium_return_role==='ULLINIRIUM_COMMON_RETURN_WITNESS','RETURN_COMPARATOR_RETURN_ROLE_INVALID');
    ensure(record.overlay?.grid_steps_degrees?.n36===10&&record.overlay.grid_steps_degrees.t9===40&&record.overlay.grid_steps_degrees.beta27===40/3&&record.overlay.grid_steps_degrees.flip64===5.625,'RETURN_COMPARATOR_GRID_STEPS_INVALID');
    ensure(record.overlay?.exact_alignment_periods_degrees?.n36_t9===40&&record.overlay.exact_alignment_periods_degrees.n36_beta27===40&&record.overlay.exact_alignment_periods_degrees.n36_flip64===90&&record.overlay.exact_alignment_periods_degrees.full_return===360,'RETURN_COMPARATOR_GRID_ALIGNMENT_INVALID');
    ensure(record.overlay.ghostgrid_role==='DISPLAY_RESIDUAL_ONLY'&&record.overlay.plus_minus_2_status==='HOLD_SOURCE_REQUIRED','RETURN_COMPARATOR_GRID_BOUNDARY_INVALID');
    ensure(record.existing_state?.parameter?.namespace==='DYNAMICAL_PARAMETER'&&record.existing_state.parameter.symbol==='c'&&record.existing_state.parameter.value[0]===-0.1087&&record.existing_state.parameter.value[1]===0,'RETURN_COMPARATOR_EXISTING_PARAMETER_INVALID');
    ensure(record.existing_state.classification==='EXACT_INTERIOR'&&record.existing_state.angle_operator===null&&record.existing_state.source_mutation===false,'RETURN_COMPARATOR_EXISTING_STATE_BOUNDARY_INVALID');
    ensure(record.display?.pulse_role==='DISPLAY_ENVELOPE_ONLY'&&record.display.carrier_mutation===false&&record.display.address_mutation===false,'RETURN_COMPARATOR_PULSE_BOUNDARY_INVALID');
    ensure(Array.isArray(record.new_canonical_ids)&&record.new_canonical_ids.length===0,'RETURN_COMPARATOR_NEW_ID_FORBIDDEN');
    ensure(Array.isArray(record.relation_changes)&&record.relation_changes.length===0,'RETURN_COMPARATOR_RELATION_FORBIDDEN');
    ensure(Array.isArray(record.aliases)&&record.aliases.length===0,'RETURN_COMPARATOR_ALIAS_FORBIDDEN');
    return record;
  }

  function mount(host){
    if(!host)return null;
    const run=host.querySelector('[data-rac-run]');
    const pulse=host.querySelector('[data-rac-pulse]');
    const grid=host.querySelector('[data-rac-grid]');
    const hold=host.querySelector('[data-rac-hold]');
    const status=host.querySelector('[data-rac-status]');
    const gridStatus=host.querySelector('[data-rac-grid-status]');
    const receiptOut=host.querySelector('[data-rac-receipt]');
    const returnCell=host.querySelector('[data-rac-return-cell]');
    let running=false,pulsing=false,gridVisible=false;
    const receipt=createReceipt();
    function draw(){
      host.classList.toggle('is-running',running);
      host.classList.toggle('is-pulsing',pulsing);
      host.classList.toggle('is-grid',gridVisible);
      run?.setAttribute('aria-pressed',String(running));
      pulse?.setAttribute('aria-pressed',String(pulsing));
      grid?.setAttribute('aria-pressed',String(gridVisible));
      if(returnCell)returnCell.textContent=receipt.closure.return_cell;
      if(status)status.textContent=running?'PASS · TYPED RETURN COMPARATOR · 204° PHASE / 135° VIEW / NO ANGLE MAP':'HOLD · SOURCES TYPED · READY';
      if(gridStatus)gridStatus.textContent=gridVisible?'GRID ON · EXACT ALIGNMENTS 40° · 90° · 360° · ±2° HOLD':'GRID OFF · EXISTING VIEW UNCHANGED';
      if(receiptOut)receiptOut.textContent=JSON.stringify(receipt,null,2);
    }
    run?.addEventListener('click',()=>{running=!running;draw()});
    pulse?.addEventListener('click',()=>{pulsing=!pulsing;draw()});
    grid?.addEventListener('click',()=>{gridVisible=!gridVisible;draw()});
    hold?.addEventListener('click',()=>{running=false;pulsing=false;gridVisible=false;draw()});
    draw();
    return{receipt,setRunning:value=>{running=Boolean(value);draw()},setPulsing:value=>{pulsing=Boolean(value);draw()},setGrid:value=>{gridVisible=Boolean(value);draw()},get state(){return{running,pulsing,grid:gridVisible}}};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-return-angle-comparator]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}
  return{SCHEMA,PI_ROLE,ULLINIRIUM_ROLE,createReceipt,validate,mount,mountAll};
});
