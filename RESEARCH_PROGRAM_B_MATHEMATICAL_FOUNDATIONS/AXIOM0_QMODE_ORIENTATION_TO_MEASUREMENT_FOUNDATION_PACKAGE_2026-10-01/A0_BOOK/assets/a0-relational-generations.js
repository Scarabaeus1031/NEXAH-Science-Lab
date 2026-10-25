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
  const RING_COORDINATES=[[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,1],[0,0]];
  function exactArrayEqual(a,b){return a.length===b.length&&a.every((value,index)=>Object.is(value,b[index]));}
  function rotateRing90(values,turns=1){
    sewing.fold(values);
    if(!Number.isInteger(turns))throw new RangeError('integer quarter turns required');
    const normalized=((turns%4)+4)%4,output=Array(8);
    values.forEach((value,index)=>{output[(index+2*normalized)%8]=value;});
    return output;
  }
  function ringAdapter(values){
    sewing.fold(values);
    return{schema:'A0_RING8_TO_GRID3X3_ADAPTER_V1',frame:{width:3,height:3,center:[1,1],axis:'+z through [1,1]',orientation:'x right, y down; clockwise quarter-turn as viewed on screen'},cells:values.map((value,index)=>({index,coordinate:RING_COORDINATES[index].slice(),value})),center:{coordinate:[1,1],value:null,role:'unoccupied adapter center'}};
  }
  function compareRotationGeneration(seed,configuration={}){
    sewing.fold(seed);
    const tolerance=configuration.tolerance??1e-12;
    if(!Number.isFinite(tolerance)||tolerance<0)throw new RangeError('finite nonnegative tolerance required');
    const o=options({count:1,offset:configuration.offset??0,direction:configuration.direction??1,exponent:configuration.exponent??2,gain:configuration.gain??1,epsilon:0});
    const rotatedInput=rotateRing90(seed,1),pathAStep=step(rotatedInput,0,o),pathBStep=step(seed,0,o);
    if(pathAStep.stopped||pathBStep.stopped)throw new RangeError('comparison stopped by generation magnitude guard');
    const pathA=pathAStep.output.slice(),pathB=rotateRing90(pathBStep.output,1),difference=pathA.map((value,index)=>value-pathB[index]),maxAbsDifference=Math.max(...difference.map(Math.abs));
    const rotations=Array.from({length:5},(_,turns)=>rotateRing90(seed,turns)),identity=rotateRing90(seed,0),inverse=rotateRing90(rotatedInput,-1);
    return{
      schema:'A0_ROTATION_GENERATION_ORDER_COMPARISON_V1',
      sourceState:{name:'AXIS08 laneMeans seed',values:seed.slice(),adapter:ringAdapter(seed)},
      R:{kind:'exact 2D index permutation',angleDegrees:90,axis:'+z through grid center [1,1]',coordinateMap:'(x,y) -> (2-y,x)',valueMap:'destination[(i+2) mod 8] = source[i]',not:'not a 3D cube operator'},
      T:{kind:'existing relational generation step',generation:0,offset:o.offset,direction:o.direction,exponent:o.exponent,gain:o.gain,formula:pathBStep.formula},
      pathA:{expression:'T(R(G))',rotatedInput,step:pathAStep,state:pathA},
      pathB:{expression:'R(T(G))',step:pathBStep,state:pathB},
      comparison:{difference,maxAbsDifference,exactEqual:exactArrayEqual(pathA,pathB),tolerance,withinTolerance:maxAbsDifference<=tolerance},
      controls:{identity:{state:identity,exact:exactArrayEqual(identity,seed)},fourQuarterTurns:{states:rotations,exact:exactArrayEqual(rotations[4],seed)},inverse:{state:inverse,exact:exactArrayEqual(inverse,seed)},numericPolicy:'R controls use exact copied values and Object.is. T path comparison uses IEEE-754 numbers and the declared absolute tolerance.'},
      ownerReadings:{tokens:['∫\\~','F-Lenk','Ineinanderdrehen'],binding:'retained as owner readings only; no integral operator or F-operation is defined'},
      boundary:'Bounded adapter comparison inside the existing generation view. No 3D rotation, new demonstrator, Study activation, Finding promotion or deployment.'
    };
  }
  return{power,options,step,run,returnInput,RING_COORDINATES,rotateRing90,ringAdapter,compareRotationGeneration};
});
