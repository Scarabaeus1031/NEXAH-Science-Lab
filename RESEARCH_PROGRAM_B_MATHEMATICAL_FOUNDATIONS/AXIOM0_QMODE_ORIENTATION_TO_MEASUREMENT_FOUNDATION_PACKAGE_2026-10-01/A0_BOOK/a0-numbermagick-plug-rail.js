(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(
    node?require('./a0-number-representation-plug.js'):root.A0NumberRepresentationPlug,
    node?require('./a0-prime-address-countershot.js'):root.A0PrimeAddressCountershot
  );
  if(node)module.exports=api;else root.A0NumbermagickPlugRail=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(representation,primeAddress){
  'use strict';
  const PORTS=Object.freeze(['DEC','BIN','QRT20','QRT60','CRT105','ANTIPODE','ILAU']);
  const CARRIERS=Object.freeze([37,137,937,1031,1032,1033,2037]);
  const clampCarrier=value=>CARRIERS.includes(Number(value))?Number(value):137;
  const normalizePort=value=>PORTS.includes(String(value).toUpperCase())?String(value).toUpperCase():'DEC';
  function fnv1a32(value){
    let hash=0x811c9dc5;
    for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,0x01000193)>>>0}
    return hash.toString(16).padStart(8,'0');
  }
  function returnKey(value){return `nmpr-${fnv1a32(`MOD:NUMBER_VIEW_SUITE|${value}|HELD_INTEGER`)}`}
  function delegated(value,port){
    const record=representation.representInteger(String(value),port);
    return Object.freeze({
      reading:record.reading.value,
      kind:record.reading.kind,
      rule:`decode(${record.reading.value})=${record.receipt.decoded}`,
      decoded:Number(record.receipt.decoded),
      exact:record.receipt.status==='EXACT_RETURN',
      witness:record.receipt.witness,
      contract:'NUMBER REPRESENTATION PLUG / 2'
    });
  }
  function portRecord(value,port,integration){
    if(['DEC','BIN','QRT20','QRT60'].includes(port))return delegated(value,port);
    if(port==='CRT105'){
      const {mod3,mod5,mod7}=integration.crt;
      return Object.freeze({reading:`(${mod3}, ${mod5}, ${mod7})`,kind:'RESIDUE_ADDRESS_PROJECTION',rule:`n ≡ ${value%105} (mod 105)`,decoded:null,exact:false,witness:'QUOTIENT_OR_BOUNDED_DOMAIN_REQUIRED',contract:'CRT 3·5·7 / ADDRESS ONLY'});
    }
    if(port==='ANTIPODE'){
      if(!integration.antipode)return Object.freeze({reading:'NO DECLARED OPERATOR',kind:'DOMAIN_GATED_INVOLUTION',rule:'return undefined',decoded:null,exact:false,witness:'DECLARED_ANTIPODE_REQUIRED',contract:'ANTIPODE / DOMAIN HOLD'});
      const antipode=integration.antipode;
      return Object.freeze({reading:`${antipode.value} · ${antipode.domain}`,kind:'DECLARED_AFFINE_INVOLUTION',rule:`${antipode.operator}; apply twice → ${value}`,decoded:value,exact:true,witness:'OPERATOR_AND_DOMAIN_RETAINED',contract:'ANTIPODE / INVOLUTION'});
    }
    return Object.freeze({reading:'I / L / A / U',kind:'COMPARISON_RECORD_CLASSIFICATION',rule:'classification ≠ integer decoder',decoded:null,exact:false,witness:'SOURCE_INTEGER_REQUIRED',contract:'ILAU / VIEW AUDIT'});
  }
  function model(value=137,port='DEC',keyMatches=true){
    const carrier=clampCarrier(value),selected=normalizePort(port),integration=primeAddress.primeAddressIntegrationModel(carrier),reading=portRecord(carrier,selected,integration),key=returnKey(carrier);
    const result=!keyMatches?'WRONG_KEY':reading.exact?'EXACT':'AMBIGUOUS';
    const residual=result==='EXACT'?'0':result==='WRONG_KEY'?'KEY_MISMATCH':'SOURCE_WITNESS_REQUIRED';
    return Object.freeze({
      schema:'a0.numbermagick-plug-rail/1',
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','NN:CRT_QRT_37_CARRIER_LADDER','SG:LENS:ILAU_ORIENTATION']),
      value:carrier,port:selected,keyMatches,returnKey:key,result,residual,reading,
      source:Object.freeze({record:'MOD:NUMBER_VIEW_SUITE',held:true,prime:integration.prime,primeIndex:integration.primeIndex,factors:integration.factors}),
      resultVocabulary:Object.freeze(['EXACT','AMBIGUOUS','WRONG_KEY']),
      newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      authority:Object.freeze({newIdentity:false,newRelation:false,newAlias:false,newOperator:false,newStudy:false,newFinding:false,publication:false}),
      boundary:'THIS IS A SOURCE-BOUND INTEGER VIEW RAIL. IT REUSES THE NUMBER REPRESENTATION PLUG FOR LOSSLESS CODECS. CRT AND ILAU REMAIN PARTIAL VIEWS. A0.RETURN-GATE.V1 REMAINS A SEPARATE ANGLE-PRESET CONTRACT.'
    });
  }
  function verify(){
    let checks=0;const need=(condition,label)=>{if(!condition)throw new Error(label);checks++};
    for(const value of CARRIERS)for(const port of ['DEC','BIN','QRT20','QRT60']){const record=model(value,port);need(record.result==='EXACT'&&record.reading.decoded===value,`${value} ${port} exact`)}
    for(const value of CARRIERS)need(model(value,'CRT105').result==='AMBIGUOUS',`${value} CRT remains partial`);
    for(const value of CARRIERS)need(model(value,'ILAU').result==='AMBIGUOUS',`${value} ILAU remains classification`);
    for(const value of CARRIERS.slice(0,-1))need(model(value,'ANTIPODE').result==='EXACT',`${value} declared antipode return`);
    need(model(2037,'ANTIPODE').result==='AMBIGUOUS','2037 antipode domain hold');
    need(model(137,'DEC',false).result==='WRONG_KEY','wrong key override');
    need(model(137).returnKey===model(137,'QRT20').returnKey,'source key independent of view');
    need(Object.values(model().authority).every(value=>value===false),'governance boundary');
    return Object.freeze({status:'PASS_NUMBERMAGICK_PLUG_RAIL',checks,newCanonicalIds:[],relationChanges:[],exactPorts:['DEC','BIN','QRT20','QRT60','ANTIPODE_IF_DECLARED'],partialPorts:['CRT105','ILAU','ANTIPODE_IF_UNDECLARED']});
  }
  function mount(scope=document){
    const rail=scope.querySelector?.('[data-numbermagick-plug-rail]');if(!rail)return null;
    const carrier=rail.querySelector('[data-nmp-carrier]'),key=rail.querySelector('[data-nmp-key]');let port='DEC';
    const out=name=>rail.querySelector(`[data-nmp-${name}]`);
    const integrationButtons=[...scope.querySelectorAll('[data-prime-integration-value]')];
    function paint(){
      const record=model(carrier.value,port,key.checked),sourceLabel=record.source.prime?`PRIME · π(${record.value})=${record.source.primeIndex}`:`COMPOSITE · ${record.source.factors.join(' × ')}`;
      out('status').textContent=record.result;out('status').dataset.result=record.result;
      out('value').textContent=String(record.value);out('source').textContent=sourceLabel;out('record').textContent='MOD:NUMBER_VIEW_SUITE · HELD';
      out('reading').textContent=record.reading.reading;out('kind').textContent=record.reading.kind;out('rule').textContent=record.reading.rule;
      out('result').textContent=record.result;out('witness').textContent=record.result==='WRONG_KEY'?'EXPECTED SOURCE KEY NOT PRESENT':record.reading.witness;out('return-key').textContent=record.returnKey;
      out('held').textContent=`n=${record.value} · ${record.keyMatches?'key retained':'key replaced'}`;out('decoded').textContent=record.reading.decoded===null?'OPEN':String(record.reading.decoded);out('residual').textContent=record.residual;out('contract').textContent=record.reading.contract;
      rail.dataset.result=record.result.toLowerCase();rail.querySelectorAll('[data-nmp-port]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nmpPort===port)));
      return record;
    }
    function setCarrier(value,syncCrosswalk=true){
      carrier.value=String(clampCarrier(value));
      if(syncCrosswalk){const target=integrationButtons.find(button=>Number(button.dataset.primeIntegrationValue)===Number(carrier.value));target?.click()}
      return paint();
    }
    rail.querySelectorAll('[data-nmp-port]').forEach(button=>button.addEventListener('click',()=>{port=normalizePort(button.dataset.nmpPort);paint()}));
    carrier.addEventListener('change',()=>setCarrier(carrier.value));key.addEventListener('change',paint);
    integrationButtons.forEach(button=>button.addEventListener('click',()=>setCarrier(button.dataset.primeIntegrationValue,false)));
    paint();
    return Object.freeze({paint,setCarrier,select:value=>{port=normalizePort(value);return paint()},verify,get record(){return model(carrier.value,port,key.checked)}});
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document));
  return Object.freeze({PORTS,CARRIERS,fnv1a32,returnKey,model,verify,mount});
});
