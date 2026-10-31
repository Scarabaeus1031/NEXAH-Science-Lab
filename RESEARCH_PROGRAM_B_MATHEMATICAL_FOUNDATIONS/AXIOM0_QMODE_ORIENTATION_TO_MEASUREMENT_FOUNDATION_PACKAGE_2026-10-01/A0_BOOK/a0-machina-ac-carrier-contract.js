(function(root,factory){
  'use strict';
  const api=factory(
    typeof module==='object'&&module.exports?require('./assets/a0-blue-pink-dodeca-cell-return-v1.js'):root.A0BluePinkDodecaCellReturn,
    typeof module==='object'&&module.exports?require('./a0-tesseract-face-coupler.js'):root.A0TesseractFaceCoupler,
    typeof module==='object'&&module.exports?require('./a0-h7-o8-lens.js'):root.A0H7O8LensModel
  );
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0MachinaAcCarrierContract=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(cellReturn,tesseract,h7o8){
  'use strict';
  const VERSION='2026-10-30.1';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const ALIASES=Object.freeze(['TD Janus','∫ Janus','TDK','TTDI','RUDI','KR cycle']);
  const LOCATOR_MODES=Object.freeze(['TIP','BOUNDARY','OUTSIDE','RETURN']);
  const RETURN_PAIR=Object.freeze({'06':'21','21':'06'});
  const PORTS=Object.freeze({
    P60:Object.freeze({count:60,body:48,return:12,kind:'FACE_CELL_LEDGER'}),
    R48:Object.freeze({count:48,kind:'CRT16_INTERIOR_RECORDS'}),
    L84:Object.freeze({count:84,left:'14×6',right:'12×7',kind:'COUNT_MATCH_ONLY'}),
    Z28:Object.freeze({count:28,plates:4,slotsPerPlate:7,kind:'TESA_WINDING'}),
    V12:Object.freeze({count:12,banks:2,slotsPerBank:6,kind:'VIEW_TRANSLATOR'}),
    Q24:Object.freeze({count:24,kind:'Q4_FACE_CARRIER'}),
    G512:Object.freeze({count:512,kind:'G8_CUBED_SAMPLES'}),
    K8:Object.freeze({count:8,top:4,down:4,kind:'TD_JANUS_PORTS'})
  });
  const TOP=Object.freeze(Array.from({length:4},(_,index)=>Object.freeze({side:'TOP',index,id:`T${index}`})));
  const DOWN=Object.freeze(Array.from({length:4},(_,index)=>Object.freeze({side:'DOWN',index,id:`D${index}`})));
  const KR_SEQUENCE=Object.freeze([...TOP,...DOWN.slice().reverse()].map(port=>port.id));
  const mod=(value,base)=>((value%base)+base)%base;
  function returnMarker(marker){
    const key=String(marker).padStart(2,'0');
    if(!Object.hasOwn(RETURN_PAIR,key))throw new RangeError('return marker must be 06 or 21');
    return RETURN_PAIR[key];
  }
  function quarterPhase(residue,quarterTurns=1){
    if(!Number.isInteger(residue)||!Number.isInteger(quarterTurns))throw new TypeError('integer residue and quarterTurns required');
    const offsetSlots=PORTS.Z28.count/4;
    return Object.freeze({
      input:mod(residue,PORTS.Z28.count),
      quarterTurns,
      offsetTurns:.25*quarterTurns,
      offsetSlots:offsetSlots*quarterTurns,
      output:mod(residue+offsetSlots*quarterTurns,PORTS.Z28.count),
      cardinality:PORTS.Z28.count
    });
  }
  function resolveTdPort(port){
    const id=typeof port==='string'?port:port?.id;
    const match=/^([TD])([0-3])$/.exec(String(id));
    if(!match)throw new RangeError('TD port must be T0..T3 or D0..D3');
    const side=match[1]==='T'?'TOP':'DOWN',index=Number(match[2]);
    return side==='TOP'?TOP[index]:DOWN[index];
  }
  function tdJanus(port){
    const source=resolveTdPort(port),targetIndex=3-source.index;
    return source.side==='TOP'?DOWN[targetIndex]:TOP[targetIndex];
  }
  function krStep(port,steps=1){
    if(!Number.isInteger(steps))throw new TypeError('integer steps required');
    const source=resolveTdPort(port),index=KR_SEQUENCE.indexOf(source.id);
    return resolveTdPort(KR_SEQUENCE[mod(index+steps,KR_SEQUENCE.length)]);
  }
  function locate(input={}){
    const port=resolveTdPort(input.port||'T0'),partner=tdJanus(port),receipt=Object.hasOwn(PORTS,input.receipt)?input.receipt:'P60',residue=mod(Number.isInteger(input.residue)?input.residue:0,PORTS.Z28.count),marker=String(input.marker)==='21'?'21':'06',focus=LOCATOR_MODES.includes(input.focus)?input.focus:'TIP';
    return Object.freeze({
      focus,
      tip:Object.freeze({role:'LOCAL_TIP',address:port.id,side:port.side,index:port.index}),
      boundary:Object.freeze({role:'CARRIER_SEAM',carrier:'Z28',residue,address:`Z28:r${String(residue).padStart(2,'0')}`}),
      outside:Object.freeze({role:'VIEW_WITNESS',receipt,address:`${receipt}:OUTSIDE`,claim:'VIEW_ROLE_ONLY'}),
      return:Object.freeze({role:'DECLARED_RETURN',marker,partner:returnMarker(marker),tdPartner:partner.id})
    });
  }
  function sourceAudit(){
    const cells=cellReturn.validate(),h7=h7o8.reading('connected'),q=tesseract.receipt;
    return Object.freeze({
      cells:Object.freeze({body:cells.bodyCells,return:cells.returnCells,total:cells.totalCells,exact:cells.exactLedger}),
      q4:Object.freeze({faces:tesseract.faces.length,vertices:tesseract.vertices.length,antipodeInvolution:tesseract.faces.every(face=>tesseract.antipode(tesseract.antipode(face)).id===face.id)}),
      cube:Object.freeze({samples:tesseract.cubeSamples.length}),
      winding:Object.freeze({ports:q.counts.zitherAddresses,plates:4,quarterOffsetSlots:7}),
      schedule:Object.freeze({rank:q.counts.scheduleAddresses}),
      h7o8:Object.freeze({removed:h7.seam.removedSides,inserted:h7.seam.insertedSides,typing:'COUNT_MATCH_ONLY'})
    });
  }
  function receipt(){
    const audit=sourceAudit();
    return Object.freeze({
      schema:'nexah.a0.machina-ac-carrier-contract/1',version:VERSION,identity:IDENTITY,
      status:audit.cells.exact&&audit.cells.total===60&&audit.q4.faces===24&&audit.cube.samples===512&&audit.winding.ports===28&&audit.schedule.rank===48&&audit.h7o8.removed===audit.h7o8.inserted?'PASS':'HOLD',
      operator:'TD_JANUS',aliases:ALIASES,ports:PORTS,audit,
      markerReturn:Object.freeze({pair:Object.freeze(['06','21']),operator:'J_06_21',involution:'J_06_21²=id'}),
      locator:Object.freeze({modes:LOCATOR_MODES,chain:'TIP → BOUNDARY → OUTSIDE → RETURN',typing:'READ_ONLY_VIEW_ROLES'}),
      phaseCoupling:Object.freeze({carrier:'Z28',offsetTurns:.25,offsetSlots:7,closureQuarterTurns:4,interpretation:'PHASE_OFFSET_NOT_FRACTIONAL_CARDINALITY'}),
      td:Object.freeze({top:TOP,down:DOWN,operator:'TD_JANUS',mapping:'T_i ↔ D_(3-i)',involution:'TD_JANUS²=id'}),
      kr:Object.freeze({sequence:KR_SEQUENCE,period:8,closure:'KR^8=id'}),
      authority:Object.freeze({newIdentity:false,newRelation:false,newCarrier:false,newOperatorFamily:false,scientificFinding:false}),
      boundaries:Object.freeze([
        '06 and 21 are declared return markers; no numeric, acoustic or geometric identity is inferred.',
        '28 + 0.25 means a quarter-turn phase offset of seven slots on Z28; the carrier cardinality remains 28.',
        '84 = 84 is a count equality only and supplies no H7/O8 morphism.',
        'TDK, TTDI, RUDI and KR cycle are owner vocabulary aliases, not canonical operator identities.',
        'All ports are typed views of existing source records; no second clock or source mutation is introduced.',
        'TIP, BOUNDARY, OUTSIDE and RETURN are view roles, not four bodies or a metric claim about physical location.'
      ])
    });
  }
  return Object.freeze({VERSION,IDENTITY,ALIASES,LOCATOR_MODES,PORTS,TOP,DOWN,KR_SEQUENCE,returnMarker,quarterPhase,resolveTdPort,tdJanus,krStep,locate,sourceAudit,receipt});
});
