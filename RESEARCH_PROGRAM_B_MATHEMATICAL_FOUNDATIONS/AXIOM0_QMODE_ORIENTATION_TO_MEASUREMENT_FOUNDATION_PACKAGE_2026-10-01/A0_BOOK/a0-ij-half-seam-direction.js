(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0IJHalfSeamDirection=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const HALF_SEAM=Object.freeze([-0.5,0,0.5]);
  function reflect(value){
    if(!Number.isFinite(value))throw new TypeError('value must be finite');
    return -value;
  }
  function field19(){
    return Object.freeze({fieldId:'F-IJ-01',i:3**2,j:10,sum:19,axisSwap:'T(x,y)=(y,x)',sameRecord:true});
  }
  function seam(){
    const [minus,zero,plus]=HALF_SEAM;
    return Object.freeze({minus,zero,plus,midpoint:(minus+plus)/2,separation:plus-minus,reflected:Object.freeze(HALF_SEAM.map(reflect)),dimensionless:true});
  }
  function bipyramid(height=1){
    if(!Number.isFinite(height)||height<=0)throw new RangeError('height must be positive');
    return Object.freeze({base:Object.freeze([[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0]].map(Object.freeze)),apices:Object.freeze([[0,0,height],[0,0,-height]].map(Object.freeze)),counts:Object.freeze({vertices:6,edges:12,faces:8}),cone:false});
  }
  function nBand(){
    const value=297/7;
    return Object.freeze({numerator:297,denominator:7,value,rounded3:Number(value.toFixed(3)),from45:45-value,from45Exact:'18/7'});
  }
  function verify(){
    const field=field19(),s=seam(),body=bipyramid(),n=nBand();
    const assertions=Object.freeze({fieldSum:field.i+field.j===19,iIsThreeSquared:field.i===9,halfSeam:s.midpoint===0&&s.separation===1&&s.reflected.join(',')==='0.5,0,-0.5',bipyramidCounts:body.counts.vertices===6&&body.counts.edges===12&&body.counts.faces===8&&!body.cone,nBandExact:n.rounded3===42.429&&Math.abs(n.from45-18/7)<1e-12});
    return Object.freeze({status:Object.values(assertions).every(Boolean)?'PASS':'FAIL',identity:IDENTITY,classification:'BOUNDED_VIEW_CONTRACT',assertions,field,seam:s,body,nBand:n,boundary:'Display opposition is not quaternion antipody. A square bipyramid is not a cone; a cone requires a continuous sweep. Twist is a view phase; friction is unbound. Ounce, karat and the local 24k counter remain distinct types.',authority:Object.freeze({newIdentity:false,newRelation:false,newOperator:false,study:false,finding:false})});
  }
  return Object.freeze({IDENTITY,HALF_SEAM,reflect,field19,seam,bipyramid,nBand,verify});
});
