(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0ThreeMatrixHolonomy=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const EPS=1e-10;
  const deg=value=>value*Math.PI/180;
  const clean=value=>Math.abs(value)<1e-12?0:value;
  const I=()=>[[1,0,0],[0,1,0],[0,0,1]];
  const transpose=a=>a[0].map((_,column)=>a.map(row=>row[column]));
  const multiply=(a,b)=>a.map(row=>b[0].map((_,column)=>row.reduce((sum,value,index)=>sum+value*b[index][column],0)));
  const apply=(a,v)=>a.map(row=>row.reduce((sum,value,index)=>sum+value*v[index],0));
  const subtract=(a,b)=>a.map((row,i)=>row.map((value,j)=>value-b[i][j]));
  const frobenius=a=>Math.sqrt(a.reduce((sum,row)=>sum+row.reduce((inner,value)=>inner+value*value,0),0));
  const determinant=a=>a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);
  const rotationX=angle=>{const c=Math.cos(deg(angle)),s=Math.sin(deg(angle));return[[1,0,0],[0,c,-s],[0,s,c]];};
  const rotationY=angle=>{const c=Math.cos(deg(angle)),s=Math.sin(deg(angle));return[[c,0,s],[0,1,0],[-s,0,c]];};
  const rotationZ=angle=>{const c=Math.cos(deg(angle)),s=Math.sin(deg(angle));return[[c,-s,0],[s,c,0],[0,0,1]];};
  const frame=(azimuth,tilt)=>multiply(rotationZ(azimuth),rotationY(tilt));
  const reflection=()=>[[1,0,0],[0,-1,0],[0,0,1]];
  function stageMatrix(stage,index,kleinFlip){
    const basis=frame(stage.azimuth,stage.tilt);
    let local=rotationZ(stage.angle);
    if(kleinFlip&&index===2)local=multiply(reflection(),local);
    return multiply(multiply(basis,local),transpose(basis));
  }
  function normalizeStages(stages){
    if(!Array.isArray(stages)||stages.length!==3)throw new TypeError('exactly three matrix stages required');
    return stages.map((stage,index)=>{
      const normalized={angle:Number(stage.angle),azimuth:Number(stage.azimuth),tilt:Number(stage.tilt)};
      Object.values(normalized).forEach(value=>{if(!Number.isFinite(value))throw new TypeError(`stage ${index+1} requires finite values`);});
      return normalized;
    });
  }
  function analyze(input={}){
    const stages=normalizeStages(input.stages||PRESETS.lamella.stages),kleinFlip=Boolean(input.kleinFlip);
    const matrices=stages.map((stage,index)=>stageMatrix(stage,index,kleinFlip));
    const forward=multiply(matrices[2],multiply(matrices[1],matrices[0]));
    const reverse=multiply(matrices[0],multiply(matrices[1],matrices[2]));
    const commutators=[[0,1],[1,2],[0,2]].map(([left,right])=>({pair:`A${left+1}/A${right+1}`,residual:frobenius(subtract(multiply(matrices[left],matrices[right]),multiply(matrices[right],matrices[left])))}));
    const maxCommutator=Math.max(...commutators.map(item=>item.residual));
    const reference=[1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)];
    const determinantForward=determinant(forward),orientationReversing=determinantForward<0;
    const trace=forward[0][0]+forward[1][1]+forward[2][2];
    const holonomyAngle=orientationReversing?null:Math.acos(Math.max(-1,Math.min(1,(trace-1)/2)))*180/Math.PI;
    const classification=orientationReversing?'ORIENTATION_REVERSING_KLEIN_MONODROMY':maxCommutator>EPS?'NONCOMMUTING_LAMELLA_HOLONOMY':'CYCLIC_C4_CONTROL';
    const cumulative=[I(),matrices[0],multiply(matrices[1],matrices[0]),forward];
    return{
      schema:'a0.three-matrix-holonomy-workbench/1.0.0',
      scope:'FINITE_3_BY_3_ORTHOGONAL_MATRIX_COMPARATOR',
      identityReuse:['ART:A0:MATHEMATICAL_JOINTS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'],
      sourceBindings:['A0_SPIN_TO_BLOOM_MEASUREMENT.html#kleinLamellaReturnBridge','A0_SPIN_TO_BLOOM_MEASUREMENT.html#greyRotationRegimeAtlas','a0-spin-to-bloom-measurement.js'],
      stages,kleinFlip,matrices,cumulative,forward,reverse,
      metrics:{
        stageDeterminants:matrices.map(determinant),
        determinant:determinantForward,
        orthogonalityResidual:frobenius(subtract(multiply(transpose(forward),forward),I())),
        returnResidual:frobenius(subtract(forward,I())),
        referenceReturnResidual:Math.sqrt(apply(subtract(forward,I()),reference).reduce((sum,value)=>sum+value*value,0)),
        orderResidual:frobenius(subtract(forward,reverse)),
        commutators,maxCommutator,holonomyAngle
      },
      classification,
      penroseGate:maxCommutator>EPS?'PROJECTIVE_ANALOGY_ONLY_NO_APERIODIC_TILING':'NOT_TRIGGERED_PLANAR_CONTROL',
      newCanonicalIds:[],relationChanges:[],
      claimBoundary:'Finite synthetic matrix comparator only. Noncommuting lamella holonomy and an orientation-reversing Klein step do not establish a Penrose tiling, aperiodic substitution, physical quantum dynamics, material behavior or a new topology identity.'
    };
  }
  const PRESETS=Object.freeze({
    control:Object.freeze({label:'C4 CONTROL',kleinFlip:false,stages:Object.freeze([{angle:90,azimuth:0,tilt:0},{angle:180,azimuth:0,tilt:0},{angle:270,azimuth:0,tilt:0}])}),
    lamella:Object.freeze({label:'3 LAMELLAE',kleinFlip:false,stages:Object.freeze([{angle:90,azimuth:0,tilt:0},{angle:180,azimuth:120,tilt:54.7356},{angle:270,azimuth:240,tilt:54.7356}])}),
    klein:Object.freeze({label:'KLEIN FLIP',kleinFlip:true,stages:Object.freeze([{angle:90,azimuth:0,tilt:0},{angle:180,azimuth:120,tilt:54.7356},{angle:270,azimuth:240,tilt:54.7356}])})
  });
  const clonePreset=name=>{const preset=PRESETS[name];if(!preset)throw new RangeError('unknown preset');return{kleinFlip:preset.kleinFlip,stages:preset.stages.map(stage=>({...stage}))};};
  return Object.freeze({EPS,I,transpose,multiply,apply,subtract,frobenius,determinant,rotationX,rotationY,rotationZ,frame,stageMatrix,analyze,PRESETS,clonePreset,clean});
});
