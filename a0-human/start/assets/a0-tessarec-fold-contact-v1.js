(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0TessarecFoldContact=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const PHI=(1+Math.sqrt(5))/2;
  const ROOT7_LENS_ID='NEXAH:NAVIGATOR:ROOT7:LOOK:2026-10-08';

  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const r=a%b;a=b;b=r}return a}
  function totient(n){
    if(!Number.isInteger(n)||n<1)throw new TypeError('n must be a positive integer');
    let result=n,x=n;
    for(let p=2;p*p<=x;p++)if(x%p===0){while(x%p===0)x/=p;result-=result/p}
    if(x>1)result-=result/x;
    return result;
  }
  function factorization(n){
    if(!Number.isInteger(n)||n<1)throw new TypeError('n must be a positive integer');
    const out=[];let x=n;
    for(let p=2;p*p<=x;p++)if(x%p===0){let e=0;while(x%p===0){x/=p;e++}out.push([p,e])}
    if(x>1)out.push([x,1]);
    return out;
  }
  function numberProfile(n){
    const phi=totient(n);
    return {n,factors:factorization(n),totient:phi,gap:n-phi,ratio:phi/n};
  }
  function foldAudit(options={}){
    const t=Number(options.t??0.5),extension=Number(options.extension??1),foldDeg=Number(options.foldDeg??180),side=Number(options.side??1);
    if(!(t>0&&t<1))throw new RangeError('t must be between 0 and 1');
    if(!(extension>=PHI/2))throw new RangeError('extension does not form an isosceles flap');
    if(!(foldDeg>=0&&foldDeg<=180))throw new RangeError('foldDeg must be in [0,180]');
    const cutEdge=PHI*t*side;
    const flapLeg=extension*t*side;
    const flapAltitude=Math.sqrt(Math.max(0,flapLeg*flapLeg-(cutEdge*cutEdge)/4));
    const halfAperture=cutEdge/2;
    const projectedInward=-flapAltitude*Math.cos(foldDeg*Math.PI/180);
    const contactRatio=projectedInward/halfAperture;
    const exactExtension=PHI/Math.sqrt(2);
    const tolerance=1e-3;
    const state=contactRatio<1-tolerance?'OPEN':contactRatio>1+tolerance?'OVERLAP_TUCK':'TOUCH';
    return {t,extension,foldDeg,side,cutEdge,flapLeg,flapAltitude,halfAperture,projectedInward,contactRatio,centralGap:Math.max(0,2*(halfAperture-projectedInward)),exactExtension,state};
  }
  function a7Root7Guard(){
    return {
      a7:{namespace:'SHELL_VERTEX_ADDRESS',address:'A7',degree:3,incidentFaces:[5,5,8],regularFaceAngleSumDeg:351,regularFaceDefectDeg:9,mappingInvariant:false},
      root7:{namespace:'EXACT_METRIC_LENS',identity:ROOT7_LENS_ID,normSquared:7,axisIdentifiable:false,epsilon7:'UNRESOLVED'},
      verdict:'REJECT_IDENTITY_COLLAPSE',
      permittedRelation:'TYPED_COMPARATOR_ONLY'
    };
  }
  function addressFoldAdapter(host){
    const adapters={
      A2:{panels:3,mode:'triangle',label:'A2 -> 3-fold',status:'HYPOTHESIS_ONLY'},
      A7:{panels:8,mode:'octagon',label:'A7 -> 8-fold',status:'HYPOTHESIS_ONLY'}
    };
    return adapters[host]||{panels:null,mode:null,label:`${host} -> no declared fold`,status:'NO_ADAPTER'};
  }
  function run(options={}){
    const labels=(options.labels||[1111,3333,4444,7777]).map(numberProfile);
    return {version:'A0:TESSAREC:FOLD_CONTACT:V1',fold:foldAudit(options),labels,a7Root7:a7Root7Guard(),claimBoundary:'SCHEMATIC_KINEMATIC_CONTACT_AUDIT_NOT_PHYSICAL_REALIZATION'};
  }
  return {PHI,ROOT7_LENS_ID,gcd,totient,factorization,numberProfile,foldAudit,a7Root7Guard,addressFoldAdapter,run};
});
