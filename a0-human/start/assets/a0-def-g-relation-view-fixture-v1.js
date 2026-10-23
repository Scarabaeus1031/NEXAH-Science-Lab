(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.A0DefGFixture=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const VIEWS=['exact','permuted','weight','look'];

  function bit(value,name){
    if(value!==0&&value!==1) throw new TypeError(`${name} must be 0 or 1`);
    return value;
  }
  function source(input){
    if(!input||!Object.prototype.hasOwnProperty.call(input,'d')||!Object.prototype.hasOwnProperty.call(input,'e')||!Object.prototype.hasOwnProperty.call(input,'f')) throw new TypeError('D, E and F are required');
    return {d:bit(input.d,'D'),e:bit(input.e,'E'),f:bit(input.f,'F')};
  }
  function stable(value){
    if(Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
    if(value&&typeof value==='object') return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
    return JSON.stringify(value);
  }
  function hash(value){
    const text=typeof value==='string'?value:stable(value);
    let h=2166136261;
    for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}
    return `fnv1a32:${(h>>>0).toString(16).padStart(8,'0')}`;
  }
  function deltaDEF(input){
    const x=source(input);
    return {
      pairwise:{de:x.d^x.e,ef:x.e^x.f,fd:x.f^x.d},
      parity:x.d^x.e^x.f,
      weight:x.d+x.e+x.f
    };
  }
  function record(input){
    const x=source(input),g=deltaDEF(x);
    return {source:x,sourceKey:hash(x),relation:g,relationKey:hash(g)};
  }
  function residualFor(rec,view){
    return {schema:'a0.def-g.residual/1',view,source:rec.source,sourceKey:rec.sourceKey,relationKey:rec.relationKey,receipt:hash({view,sourceKey:rec.sourceKey,relationKey:rec.relationKey})};
  }
  function project(input,view='exact',look='cyan-gold'){
    if(!VIEWS.includes(view)) throw new TypeError(`Unknown view ${view}`);
    const rec=record(input);
    if(view==='exact') return {schema:'a0.def-g.view/1',view,payload:[rec.source.d,rec.source.e,rec.source.f],look:'typed',residual:null};
    if(view==='permuted') return {schema:'a0.def-g.view/1',view,payload:[rec.source.f,rec.source.d,rec.source.e],look:'F-D-E',residual:residualFor(rec,view)};
    if(view==='weight') return {schema:'a0.def-g.view/1',view,payload:{weight:rec.relation.weight},look:'scalar',residual:residualFor(rec,view)};
    return {schema:'a0.def-g.view/1',view,payload:[rec.source.d,rec.source.e,rec.source.f],look,residual:null};
  }
  function hold(reason){return {status:'HOLD',reason,source:null,relation:null}}
  function fail(reason){return {status:'FAIL',reason,source:null,relation:null}}
  function ok(rec){return {status:'PASS',reason:'EXACT_TYPED_RETURN',source:rec.source,sourceKey:rec.sourceKey,relation:rec.relation,relationKey:rec.relationKey}}
  function returnFromView(viewRecord,residual=viewRecord&&viewRecord.residual,expectedSourceKey=null){
    if(!viewRecord||!VIEWS.includes(viewRecord.view)) return fail('INVALID_VIEW');
    let x;
    if(viewRecord.view==='exact'||viewRecord.view==='look'){
      if(!Array.isArray(viewRecord.payload)||viewRecord.payload.length!==3) return fail('INVALID_EXACT_PAYLOAD');
      try{x=source({d:viewRecord.payload[0],e:viewRecord.payload[1],f:viewRecord.payload[2]})}catch(error){return fail('INVALID_SOURCE_BITS')}
    }else if(viewRecord.view==='permuted'){
      if(!Array.isArray(viewRecord.payload)||viewRecord.payload.length!==3) return fail('INVALID_PERMUTED_PAYLOAD');
      try{x=source({d:viewRecord.payload[1],e:viewRecord.payload[2],f:viewRecord.payload[0]})}catch(error){return fail('INVALID_SOURCE_BITS')}
    }else{
      if(!residual) return hold('MISSING_RESIDUAL');
      try{x=source(residual.source)}catch(error){return fail('INVALID_RESIDUAL_SOURCE')}
    }
    const rec=record(x);
    if(expectedSourceKey&&rec.sourceKey!==expectedSourceKey) return fail('EXPECTED_SOURCE_MISMATCH');
    if(residual){
      const receipt=hash({view:viewRecord.view,sourceKey:residual.sourceKey,relationKey:residual.relationKey});
      if(residual.schema!=='a0.def-g.residual/1'||residual.view!==viewRecord.view||residual.sourceKey!==rec.sourceKey||residual.relationKey!==rec.relationKey||residual.receipt!==receipt) return fail('RESIDUAL_BINDING_MISMATCH');
    }
    if(viewRecord.view==='weight'&&(!viewRecord.payload||viewRecord.payload.weight!==rec.relation.weight)) return fail('VIEW_RESIDUAL_MISMATCH');
    return ok(rec);
  }
  function maybeRecord(input){
    try{return ok(record(input))}catch(error){return hold('MISSING_OR_INVALID_CHANNEL')}
  }
  function fromIndex(index){
    if(!Number.isInteger(index)||index<0||index>7) throw new RangeError('index must be 0…7');
    return {d:(index>>2)&1,e:(index>>1)&1,f:index&1};
  }
  function mutate(input,channel){
    const x=source(input);
    if(!['d','e','f'].includes(channel)) throw new TypeError('channel must be d, e or f');
    return {...x,[channel]:x[channel]^1};
  }
  function runAudit(){
    const assertions=[];
    const check=(id,pass,detail)=>assertions.push({id,pass:Boolean(pass),detail});
    const records=Array.from({length:8},(_,i)=>record(fromIndex(i)));
    records.forEach((rec,i)=>{
      check(`R${i}-deterministic`,hash(deltaDEF(rec.source))===rec.relationKey,'ΔDEF repeats exactly');
      ['exact','permuted','look'].forEach(view=>{
        const projection=project(rec.source,view,view==='look'?'magenta-shuffle':'typed');
        const returned=returnFromView(projection,projection.residual,rec.sourceKey);
        check(`R${i}-${view}-return`,returned.status==='PASS'&&returned.relationKey===rec.relationKey,'view returns registered G');
      });
      const weight=project(rec.source,'weight');
      const returned=returnFromView(weight,weight.residual,rec.sourceKey);
      check(`R${i}-weight-residual`,returned.status==='PASS'&&returned.relationKey===rec.relationKey,'lossy view returns only with residual');
      check(`R${i}-weight-hold`,returnFromView(weight,null,rec.sourceKey).status==='HOLD','lossy view without residual holds');
      ['d','e','f'].forEach(channel=>{
        const partial={...rec.source}; delete partial[channel];
        check(`R${i}-ablate-${channel}`,maybeRecord(partial).status==='HOLD',`missing ${channel.toUpperCase()} holds`);
      });
      const wrong=project(fromIndex((i+1)%8),'weight').residual;
      check(`R${i}-wrong-residual`,returnFromView(weight,wrong,rec.sourceKey).status==='FAIL','foreign residual fails closed');
      check(`R${i}-mutation`,record(mutate(rec.source,'d')).relationKey!==rec.relationKey,'D mutation changes registered G');
      const lookA=project(rec.source,'look','cyan-gold'),lookB=project(rec.source,'look','pink-green');
      check(`R${i}-look-shuffle`,stable(lookA.payload)===stable(lookB.payload)&&returnFromView(lookB,null,rec.sourceKey).relationKey===rec.relationKey,'look changes, record does not');
    });
    for(let a=0;a<records.length;a++) for(let b=a+1;b<records.length;b++){
      if(records[a].relation.weight===records[b].relation.weight){
        const va=project(records[a].source,'weight'),vb=project(records[b].source,'weight');
        check(`collision-${a}-${b}-same-view`,stable(va.payload)===stable(vb.payload),'lossy views collide');
        check(`collision-${a}-${b}-different-G`,records[a].relationKey!==records[b].relationKey,'collision does not imply relation identity');
      }
    }
    const passed=assertions.filter(item=>item.pass).length,failed=assertions.length-passed;
    return {schema:'a0.def-g.audit/1',fixtureVersion:VERSION,carrier:'Q3 = {0,1}^3',operator:'ΔDEF = pairwise XOR + parity + Hamming weight',views:VIEWS,assertions:{total:assertions.length,passed,failed},outcome:failed===0?'PASS_RELATION_VIEW_SEPARATED':'INVALID_CONTRACT',claimBoundary:'FINITE_ENGINEERING_FIXTURE_ONLY / SCIENTIFIC_NOT_ADMITTED',details:assertions};
  }
  return {VERSION,VIEWS,stable,hash,source,deltaDEF,record,project,returnFromView,maybeRecord,fromIndex,mutate,runAudit};
});
