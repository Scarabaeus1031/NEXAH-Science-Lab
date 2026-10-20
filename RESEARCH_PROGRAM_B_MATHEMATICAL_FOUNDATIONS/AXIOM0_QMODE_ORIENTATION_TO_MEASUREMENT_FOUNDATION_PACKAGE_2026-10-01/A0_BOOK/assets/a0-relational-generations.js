(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-pentagon-sewing.js'):root.A0PentagonSewing);if(typeof module==='object'&&module.exports)module.exports=api;root.A0RelationalGenerations=api;})(typeof globalThis!=='undefined'?globalThis:this,function(sewing){
  'use strict';
  function power(x,k){return Math.sign(x)*Math.pow(Math.abs(x),k);}
  function options(o={}){const result={count:o.count??8,offset:o.offset??0,direction:o.direction??1,exponent:o.exponent??1,gain:o.gain??1,epsilon:o.epsilon??1e-6};if(!Number.isInteger(result.count)||result.count<1||result.count>24||!Number.isInteger(result.offset)||result.offset<0||result.offset>7||![1,-1].includes(result.direction)||![1,2].includes(result.exponent)||![1,2].includes(result.gain)||!Number.isFinite(result.epsilon)||result.epsilon<0||result.epsilon>.1)throw new RangeError('invalid generation options');return result;}
  function returnInput(record){const gain=record.gain??1,fold=sewing.fold(record.output.map(v=>v/gain),record.offset);return sewing.reconstruct({...fold,residuals:fold.residuals.map(r=>record.orientation*power(r,1/record.exponent))});}
  function step(input,g,o){
    const gain=o.gain??1,offset=((o.offset+o.direction*g)%8+8)%8,fold=sewing.fold(input,offset),orientation=o.direction,oriented=fold.residuals.map(r=>orientation*r),transformed=oriented.map(r=>power(r,o.exponent)),output=sewing.reconstruct({...fold,residuals:transformed}).map(v=>v*gain);
    if(!output.every(Number.isFinite)||Math.max(...output.map(Math.abs))>1e6)return{stopped:true,reason:'Magnitude guard 1e6 exceeded; no clipped generation admitted.'};
    const recovered=returnInput({output,offset,orientation,exponent:o.exponent,gain});
    return{generation:g+1,parent:g,input:input.slice(),offset,pairs:fold.pairs.map(p=>p.slice()),singles:fold.singles.slice(),quotient:fold.quotient.slice(),residuals:fold.residuals.slice(),orientation,exponent:o.exponent,gain,transformed,output,recovered,returnError:Math.max(...input.map((v,i)=>Math.abs(v-recovered[i]))),formula:`r' = ${o.exponent===1?'r_J':'sign(r_J)|r_J|²'}, r_J = ${orientation}r; full output ×${gain}; next pairing shifts ${orientation}`};
  }
  function run(seed,configuration={}){
    const o=options(configuration);sewing.fold(seed);let a=seed.slice(),b=seed.slice();b[0]+=o.epsilon;const steps=[],comparisons=[{generation:0,difference:Math.max(...a.map((v,i)=>Math.abs(v-b[i])))}];let stop=null;
    for(let g=0;g<o.count;g++){const left=step(a,g,o),right=step(b,g,o);if(left.stopped||right.stopped){stop={generation:g+1,reason:left.reason||right.reason};break;}steps.push({main:left,comparison:right});a=left.output;b=right.output;comparisons.push({generation:g+1,difference:Math.max(...a.map((v,i)=>Math.abs(v-b[i])))});}
    return{schema:'RELATIONAL_GENERATIONS_DISPLAY_V1',options:o,seed:seed.slice(),comparisonSeed:seed.map((v,i)=>v+(i===0?o.epsilon:0)),steps,comparisons,stop,boundary:'Declared demonstration rule, no Alpha calibration, no chaos or E8 claim. Return is local inverse plus retained provenance.'};
  }
  return{power,options,step,run,returnInput};
});
