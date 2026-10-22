(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('assets/external/nexah-profiles.js'):root.NexahProfiles);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0DivisionReturn=api;
})(typeof globalThis==='undefined'?this:globalThis,function(P){
  'use strict';
  const SCHEMA='a0.bench-division-return/1',ids=['split','rest','crt'],clone=x=>JSON.parse(JSON.stringify(x));
  const SOURCE_PINS=[{"path":"assets/external/nexah-profiles.js","role":"Original Re/ST executable profile","sha256":"9e2a55497ae2c7fe5510398818e75658d6d27b83b6e7c89606465e26f85cd71d"},{"path":"../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/A0_SCIENTIFIC_POSITION_REPORT.html","role":"Existing exact CRT annex record","sha256":"0c57ca230df24b9257e4dc5d5e939769445e705aabe4b3a5e70cf6fcf7ca1036"}];
  const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
  const equal=(a,b)=>canonical(a)===canonical(b);
  const native=()=>{const p=P?.executable?.find(p=>p.id==='rest-atomic');if(!p||p.status!=='EXECUTABLE'||p.version!=='0.1.0')throw Error('Re/ST source profile unavailable');return p};
  function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x)}return x}
  function split(value='8451',divisor='4'){
    if(!/^\d{1,48}$/.test(String(value))||!/^\d{1,5}$/.test(String(divisor)))throw Error('Invalid nonnegative integer input');
    const n=BigInt(value),d=BigInt(divisor);if(d<1n||d>10000n)throw Error('Divisor outside scope');const q=n/d,r=n%d,upper=q+(r?1n:0n);
    return{value:String(n),divisor:String(d),lower:{quotient:String(q),remainder:String(r)},upper:{quotient:String(upper),remainder:String(n-d*upper)},intervalWidth:r?'1':'0'};
  }
  function crtAddress(residues){if(!Array.isArray(residues)||residues.length!==2||!residues.every(Number.isInteger)||residues[0]<0||residues[0]>=29||residues[1]<0||residues[1]>=31)throw Error('Invalid CRT address');for(let a=residues[0];a<899;a+=29)if(a%31===residues[1])return a;throw Error('CRT reconstruction failed')}
  function crt(value){if(!Number.isSafeInteger(value)||value<0)throw Error('Invalid CRT integer');return{value,residues:[value%29,value%31],quotient:Math.floor(value/899),address:value%899}}
  function fullInteger(cut){const a=crtAddress(cut.residues);if(!Number.isSafeInteger(cut.quotient)||cut.quotient<0)throw Error('Missing or invalid quotient sidecar');const n=899*cut.quotient+a;if(!Number.isSafeInteger(n))throw Error('Integer outside exact range');return n}
  function source(id){
    if(id==='split')return{schema:'split-rest-integer/1',...split(),binder:'SIGNED_QUOTIENT_REMAINDER',boundary:'Same integer, two quotient bounds. Divisor 4; quotient interval width 1.'};
    if(id==='rest'){native();return{schema:'rest-atomic-source/0.1.0',lower:[58,59,60],upper:[90,91,92],midpoint:75,binder:'rest-atomic:reverse-pair-v1',boundary:'Atomic-number arithmetic only; no chemical reaction or equivalence.'}}
    if(id==='crt')return{schema:'CA-IDENT-03-CRT-SHADOW/29-31',left:11357,right:19643,sum:31000,moduli:[29,31],product:899,binder:'CRT_29_31_WITH_QUOTIENT',boundary:'Residues reconstruct modulo 899. Full integer return additionally retains each quotient; not the unresolved 3+1000 label.'};
    throw Error('Unknown station');
  }
  function cut(id,side){if(!['A','B'].includes(side))throw Error('Invalid cut side');const s=source(id);let value;
    if(id==='split')value={divisor:s.divisor,...s[side==='A'?'lower':'upper']};
    if(id==='rest')value=native().sample(s,{offset_days:0},side);
    if(id==='crt')value=crt(side==='A'?s.left:s.right);
    return freeze({side,sourceSchema:s.schema,value});
  }
  function bind(id,a,b){if(!equal(a,cut(id,'A'))||!equal(b,cut(id,'B')))throw Error('REJECT · captured source mismatch');const s=source(id);
    if(id==='split'){const restore=c=>String(BigInt(c.value.divisor)*BigInt(c.value.quotient)+BigInt(c.value.remainder));return{binder:s.binder,fromA:restore(a),fromB:restore(b),signedRemainders:[a.value.remainder,b.value.remainder],reconstructionError:'0'}}
    if(id==='rest'){const p=native(),bound=p.bind(clone(b.value)),comparison=p.compare(a.value,bound),residual=p.residual(comparison);return{binder:s.binder,boundRow:bound.row,directShift:s.upper.map((n,i)=>n-s.lower[i]),pairGaps:bound.row.map((n,i)=>n-s.lower[i]),comparison,residual}}
    const residues=a.value.residues.map((r,i)=>(r+b.value.residues[i])%s.moduli[i]),address=crtAddress(residues),sum=fullInteger(a.value)+fullInteger(b.value);return{binder:s.binder,residues,address,retainedQuotient:Math.floor(sum/899),carry:Math.floor((a.value.address+b.value.address)/899),sum,modulus:899};
  }
  function returnWitness(id,a,b,result){const expected=bind(id,a,b);if(!equal(result,expected))throw Error('REJECT · binder/result mismatch');const s=source(id);
    if(id==='split'){if(result.fromA!==s.value||result.fromB!==s.value)throw Error('REJECT · split reconstruction');return{status:'EXACT',scope:'FULL_INTEGER_TWO_RECONSTRUCTIONS',recoveredA:result.fromA,recoveredB:result.fromB}}
    if(id==='rest'){const recoveredA=result.boundRow.map(n=>2*s.midpoint-n),recoveredB=native().bind({row:result.boundRow}).row;if(!equal(recoveredA,s.lower)||!equal(recoveredB,s.upper))throw Error('REJECT · Re/ST reconstruction');return{status:'EXACT',scope:'FULL_ORDERED_ROWS',recoveredA,recoveredB,midpoint:75}}
    const recoveredA=fullInteger(a.value),recoveredB=fullInteger(b.value),recoveredSum=899*result.retainedQuotient+result.address;if(recoveredSum!==s.sum||recoveredA+recoveredB!==s.sum)throw Error('REJECT · CRT full return');return{status:'EXACT',scope:'FULL_INTEGERS_WITH_QUOTIENT_SIDECAR',recoveredA,recoveredB,recoveredSum,modularAddress:result.address,modulus:899};
  }
  function create(id='split'){source(id);return{station:id,cuts:{A:null,B:null},result:null,witness:null,events:[]}}
  function transition(state,action){const s=clone(state);if(s.events.length>=4)throw Error('HOLD · completed record; start a new pair');if(action==='A'||action==='B'){if(s.cuts[action])throw Error('HOLD · cut already frozen');s.cuts[action]=cut(s.station,action)}
    else if(action==='bind'){if(!s.cuts.A||!s.cuts.B||s.result)throw Error('HOLD · capture both cuts once');s.result=bind(s.station,s.cuts.A,s.cuts.B)}
    else if(action==='return'){if(!s.result||s.witness)throw Error('HOLD · apply declared rule first');s.witness=returnWitness(s.station,s.cuts.A,s.cuts.B,s.result)}
    else throw Error('Unknown command');s.events.push(action);return freeze(s);
  }
  function replayState(state){if(!state||!ids.includes(state.station)||!Array.isArray(state.events)||state.events.length>4)throw Error('Invalid session');let rebuilt=create(state.station);for(const e of state.events)rebuilt=transition(rebuilt,e);if(!equal(rebuilt,state))throw Error('Session differs from source replay');return rebuilt}
  function command(state,action){replayState(state);return transition(state,action)}
  function record(state){replayState(state);if(!state.witness)throw Error('HOLD · Return must pass before export');return{schema:SCHEMA,sourceBindings:clone(SOURCE_PINS),source:source(state.station),session:clone(state),boundary:'Deterministic source-bound engineering replay, not a cryptographic signature, physical claim or evidence of when the cuts were made.'}}
  function verify(r){try{return{status:r?.schema===SCHEMA&&equal(record(r.session),r)?'PASS':'INVALID'}}catch{return{status:'INVALID'}}}
  return{SCHEMA,SOURCE_PINS:freeze(SOURCE_PINS),ids,source,split,crt,crtAddress,fullInteger,cut,bind,returnWitness,create,command,replayState,record,verify};
});
