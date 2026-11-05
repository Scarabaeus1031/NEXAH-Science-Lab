(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-tesseract-face-coupler.js'):root.A0TesseractFaceCoupler);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0UlliniriumQ4ViewAnchor=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(C){
  'use strict';
  if(!C)throw new Error('A0_TESSERACT_FACE_COUPLER_REQUIRED');

  const SCHEMA='nexah.udf.ullinirium-q4-view-anchor/0.1.0-experimental';
  const ROUTES=Object.freeze(['YELLOW','PINK']);
  const LUX=Object.freeze({L:50,unitAddress:2501,doubleAddress:5002,rule:'L×L+1; double=2×(L×L+1)'});
  const PAIRS=Object.freeze(C.faces
    .filter(face=>face.index<C.antipode(face).index)
    .map((face,slot)=>Object.freeze({slot,origin:face.id,originIndex:face.index,target:C.antipode(face).id,targetIndex:C.antipode(face).index})));

  function ensure(condition,code){if(!condition)throw new TypeError(code)}
  function pairForSlot(slot){
    ensure(Number.isInteger(slot)&&slot>=0&&slot<12,'ULLINIRIUM_SLOT_INVALID');
    return PAIRS[slot];
  }
  function returnSlot(originId,targetId){
    const pair=PAIRS.find(item=>(item.origin===originId&&item.target===targetId)||(item.origin===targetId&&item.target===originId));
    ensure(pair,'Q4_ANTIPODE_PAIR_NOT_BOUND');
    return pair.slot;
  }
  function createReceipt({slot=0,route='YELLOW'}={}){
    ensure(ROUTES.includes(route),'ULLINIRIUM_ROUTE_INVALID');
    const pair=pairForSlot(slot),split=C.splitRoutes(pair.origin),path=(route==='YELLOW'?split.yellow:split.pink).map(face=>face.id);
    const record={
      schema:SCHEMA,
      profile_state:'EXPERIMENTAL_VIEW_EXTENSION_NOT_FROZEN',
      source:{
        role:'ULLINIRIUM_LOCAL_COORDINATION_VIEW',
        authority_path:'A0_BOOK/A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry',
        ring_slots:12,
        return_pivots:1,
        view_anchor_degrees:135,
        selected_slot:slot,
        source_mutation:false
      },
      mapping:{
        kind:'DECLARED_12_TO_12_VIEW_INDEX_BIJECTION',
        identity_claim:false,
        geometric_equivalence_claim:false,
        q4_pair_ordinal:slot,
        origin:pair.origin,
        antipode:pair.target,
        antipode_operator:'A(F_ij|ab)=F_ij|a̅b̅',
        involution:'A²=id',
        route,
        route_path:path
      },
      labels:{
        LUX:{role:'EXACT_ADDRESS_LENS',status:'BOUND',address:LUX.unitAddress,double_address:LUX.doubleAddress,derived_from_slot:false},
        nXeT:{role:'LOWERED_T_ROUTE_VIEW_LABEL',status:'WORKING_LABEL_NOT_OPERATOR'},
        XVA:{role:'AXIS_BRIDGE_RECEIPT_LABEL',status:'HISTORICAL_PROVENANCE_NOT_FORMAT_IMPLEMENTATION'}
      },
      return:{
        slot:returnSlot(pair.origin,pair.target),
        pivot_role:'ULLINIRIUM_COMMON_RETURN_WITNESS',
        exact:true,
        source_mutation:false
      },
      identity_reuse:['MOD:TESSAREC','BT-045','OP-UDF-01'],
      new_canonical_ids:[],
      relation_changes:[],
      aliases:[],
      claim_boundary:'Declared invertible index bridge between twelve ULLINIRIUM outer view slots and twelve unordered Q4 antipodal face pairs. It does not identify the geometries, derive 2501/5002 from a slot, turn nXeT or XVA into an operator or format, establish a physical mechanism, or create a Navigator relation.'
    };
    return validate(record);
  }
  function validate(record){
    ensure(record&&record.schema===SCHEMA,'ULLINIRIUM_Q4_SCHEMA_INVALID');
    ensure(record.profile_state==='EXPERIMENTAL_VIEW_EXTENSION_NOT_FROZEN','ULLINIRIUM_Q4_STATE_INVALID');
    const pair=pairForSlot(record.source?.selected_slot);
    ensure(record.source.ring_slots===12&&record.source.return_pivots===1&&record.source.view_anchor_degrees===135,'ULLINIRIUM_SOURCE_VIEW_INVALID');
    ensure(record.source.source_mutation===false,'ULLINIRIUM_SOURCE_MUTATION_FORBIDDEN');
    ensure(record.mapping?.kind==='DECLARED_12_TO_12_VIEW_INDEX_BIJECTION'&&record.mapping.identity_claim===false&&record.mapping.geometric_equivalence_claim===false,'ULLINIRIUM_Q4_MAPPING_BOUNDARY_INVALID');
    ensure(record.mapping.origin===pair.origin&&record.mapping.antipode===pair.target&&C.antipode(pair.origin).id===pair.target,'ULLINIRIUM_Q4_PAIR_INVALID');
    ensure(ROUTES.includes(record.mapping.route),'ULLINIRIUM_ROUTE_INVALID');
    const expected=C.splitRoutes(pair.origin)[record.mapping.route.toLowerCase()].map(face=>face.id);
    ensure(JSON.stringify(record.mapping.route_path)===JSON.stringify(expected),'ULLINIRIUM_ROUTE_PATH_INVALID');
    ensure(record.labels?.LUX?.address===2501&&record.labels.LUX.double_address===5002&&record.labels.LUX.derived_from_slot===false,'ULLINIRIUM_LUX_LENS_INVALID');
    ensure(record.labels?.nXeT?.status==='WORKING_LABEL_NOT_OPERATOR','ULLINIRIUM_NXET_BOUNDARY_INVALID');
    ensure(record.labels?.XVA?.status==='HISTORICAL_PROVENANCE_NOT_FORMAT_IMPLEMENTATION','ULLINIRIUM_XVA_BOUNDARY_INVALID');
    ensure(record.return?.slot===record.source.selected_slot&&record.return.exact===true&&record.return.source_mutation===false,'ULLINIRIUM_RETURN_INVALID');
    ensure(Array.isArray(record.new_canonical_ids)&&record.new_canonical_ids.length===0,'ULLINIRIUM_NEW_ID_FORBIDDEN');
    ensure(Array.isArray(record.relation_changes)&&record.relation_changes.length===0,'ULLINIRIUM_RELATION_CHANGE_FORBIDDEN');
    ensure(Array.isArray(record.aliases)&&record.aliases.length===0,'ULLINIRIUM_ALIAS_FORBIDDEN');
    return record;
  }

  function mount(host){
    if(!host)return null;
    const slotSelect=host.querySelector('[data-uq4-slot]'),routeButtons=[...host.querySelectorAll('[data-uq4-route]')],status=host.querySelector('[data-uq4-status]'),receiptOut=host.querySelector('[data-uq4-receipt]'),origin=host.querySelector('[data-uq4-origin]'),mid=host.querySelector('[data-uq4-mid]'),target=host.querySelector('[data-uq4-target]'),returnOut=host.querySelector('[data-uq4-return]'),returnButton=host.querySelector('[data-uq4-return-button]');
    PAIRS.forEach(pair=>{const option=document.createElement('option');option.value=String(pair.slot);option.textContent=`${String(pair.slot+1).padStart(2,'0')} · ${pair.origin} ↔ ${pair.target}`;slotSelect.append(option)});
    let route='YELLOW',held=false;
    function draw(){
      const record=createReceipt({slot:Number(slotSelect.value||0),route}),path=record.mapping.route_path;
      routeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.uq4Route===route)));
      origin.textContent=path[0];mid.textContent=path[1];target.textContent=path[2];returnOut.textContent=`SLOT ${String(record.return.slot+1).padStart(2,'0')} · ${held?'RETURN HELD':'READY'}`;
      status.textContent=`PASS · ULLINIRIUM ${record.source.selected_slot+1}/12 ↔ Q4 PAIR ${record.mapping.q4_pair_ordinal+1}/12 · ${route} ROUTE · A²=id · LUX 2501/5002 SEPARATE`;
      receiptOut.textContent=JSON.stringify(record,null,2);
      host.dataset.route=route.toLowerCase();host.dataset.return=held?'held':'ready';
    }
    slotSelect.addEventListener('change',()=>{held=false;draw()});
    routeButtons.forEach(button=>button.addEventListener('click',()=>{route=button.dataset.uq4Route;held=false;draw()}));
    returnButton.addEventListener('click',()=>{held=true;draw()});
    draw();
    return{setSlot:value=>{slotSelect.value=String(value);held=false;draw()},setRoute:value=>{ensure(ROUTES.includes(value),'ULLINIRIUM_ROUTE_INVALID');route=value;held=false;draw()},holdReturn:()=>{held=true;draw()},get receipt(){return createReceipt({slot:Number(slotSelect.value),route})}};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-uq4-anchor]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}
  return{SCHEMA,ROUTES,LUX,PAIRS,pairForSlot,returnSlot,createReceipt,validate,mount,mountAll};
});
