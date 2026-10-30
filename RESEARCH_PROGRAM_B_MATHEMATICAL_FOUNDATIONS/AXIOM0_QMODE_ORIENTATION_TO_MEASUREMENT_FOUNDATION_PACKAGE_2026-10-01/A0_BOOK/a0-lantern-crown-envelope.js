(function(root,factory){
  const api=factory(
    typeof module==="object"&&module.exports?require("./a0-lantern-crown-replay.js"):root.A0LanternCrownReplay
  );
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.A0LanternCrownEnvelope=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(replay){
  "use strict";

  const contract=Object.freeze({
    sourceUnitMillimetres:100,
    thickness:0.02,
    clearance:0.01,
    hingeEndRelief:0.06,
    stations:761,
    searchIterations:60
  });
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const scale=(a,k)=>a.map(v=>v*k);
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const lengthSquared=a=>dot(a,a);
  const distance=(a,b)=>Math.sqrt(lengthSquared(sub(a,b)));
  const clamp=(v,lo=0,hi=1)=>Math.max(lo,Math.min(hi,v));

  function pointSegmentDistance(p,a,b){
    const ab=sub(b,a),den=lengthSquared(ab);
    if(den<1e-30)return distance(p,a);
    return distance(p,add(a,scale(ab,clamp(dot(sub(p,a),ab)/den))));
  }

  function segmentSegmentDistance(p1,q1,p2,q2){
    const d1=sub(q1,p1),d2=sub(q2,p2),r=sub(p1,p2);
    const a=dot(d1,d1),e=dot(d2,d2),f=dot(d2,r),eps=1e-15;
    let s=0,t=0;
    if(a<=eps&&e<=eps)return distance(p1,p2);
    if(a<=eps)t=clamp(f/e);
    else{
      const c=dot(d1,r);
      if(e<=eps)s=clamp(-c/a);
      else{
        const b=dot(d1,d2),den=a*e-b*b;
        if(Math.abs(den)>eps)s=clamp((b*f-c*e)/den);
        t=(b*s+f)/e;
        if(t<0){t=0;s=clamp(-c/a);}
        else if(t>1){t=1;s=clamp((b-c)/a);}
      }
    }
    return distance(add(p1,scale(d1,s)),add(p2,scale(d2,t)));
  }

  function pointTriangleDistance(p,a,b,c){
    const ab=sub(b,a),ac=sub(c,a),ap=sub(p,a);
    const d1=dot(ab,ap),d2=dot(ac,ap);
    if(d1<=0&&d2<=0)return distance(p,a);
    const bp=sub(p,b),d3=dot(ab,bp),d4=dot(ac,bp);
    if(d3>=0&&d4<=d3)return distance(p,b);
    const vc=d1*d4-d3*d2;
    if(vc<=0&&d1>=0&&d3<=0)return distance(p,add(a,scale(ab,d1/(d1-d3))));
    const cp=sub(p,c),d5=dot(ab,cp),d6=dot(ac,cp);
    if(d6>=0&&d5<=d6)return distance(p,c);
    const vb=d5*d2-d1*d6;
    if(vb<=0&&d2>=0&&d6<=0)return distance(p,add(a,scale(ac,d2/(d2-d6))));
    const va=d3*d6-d5*d4;
    if(va<=0&&(d4-d3)>=0&&(d5-d6)>=0){
      const bc=sub(c,b),w=(d4-d3)/((d4-d3)+(d5-d6));
      return distance(p,add(b,scale(bc,w)));
    }
    const denom=1/(va+vb+vc),v=vb*denom,w=vc*denom;
    return distance(p,add(a,add(scale(ab,v),scale(ac,w))));
  }

  function segmentIntersectsTriangle(p,q,a,b,c){
    const direction=sub(q,p),edge1=sub(b,a),edge2=sub(c,a),h=cross(direction,edge2),det=dot(edge1,h),eps=1e-12;
    if(Math.abs(det)<eps)return false;
    const inv=1/det,s=sub(p,a),u=inv*dot(s,h);
    if(u<-eps||u>1+eps)return false;
    const v=inv*dot(direction,cross(s,edge1));
    if(v<-eps||u+v>1+eps)return false;
    const t=inv*dot(edge2,cross(s,edge1));
    return t>=-eps&&t<=1+eps;
  }

  const edges=triangle=>[[triangle[0],triangle[1]],[triangle[1],triangle[2]],[triangle[2],triangle[0]]];
  function triangleDistance(a,b){
    let minimum=Infinity;
    for(const p of a)minimum=Math.min(minimum,pointTriangleDistance(p,...b));
    for(const p of b)minimum=Math.min(minimum,pointTriangleDistance(p,...a));
    for(const ea of edges(a))for(const eb of edges(b))minimum=Math.min(minimum,segmentSegmentDistance(...ea,...eb));
    return minimum;
  }
  function segmentTriangleDistance(segment,triangle){
    if(segmentIntersectsTriangle(...segment,...triangle))return 0;
    let minimum=Math.min(pointTriangleDistance(segment[0],...triangle),pointTriangleDistance(segment[1],...triangle));
    for(const point of triangle)minimum=Math.min(minimum,pointSegmentDistance(point,...segment));
    for(const edge of edges(triangle))minimum=Math.min(minimum,segmentSegmentDistance(...segment,...edge));
    return minimum;
  }

  function trimmedTriangles(foldDegrees,source=replay.defaults,options=contract){
    const tips=replay.tipsAt(foldDegrees,source);
    return replay.hinges(source).map((hinge,index)=>{
      const tangent=scale(sub(hinge.right,hinge.left),1/distance(hinge.left,hinge.right));
      return [add(hinge.left,scale(tangent,options.hingeEndRelief)),add(hinge.right,scale(tangent,-options.hingeEndRelief)),tips[index]];
    });
  }

  function fixedSegments(source=replay.defaults){
    const A=source.lowerFrame||[];
    const M=source.middleFrame||[];
    const B=source.upperFrame;
    const items=[];
    if(A.length===5)for(let i=0;i<5;i++)items.push({id:`A${i}`,points:[A[i],A[(i+1)%5]],radius:0.009});
    if(M.length===5)for(let i=0;i<5;i++)items.push({id:`M${i}`,points:[M[i],M[(i+1)%5]],radius:0.006});
    if(A.length===5&&M.length===5)for(let i=0;i<5;i++)items.push({id:`AM${i}`,points:[A[i],M[i]],radius:0.007});
    if(M.length===5)for(let i=0;i<5;i++)items.push({id:`MB${i}`,points:[M[i],B[i]],radius:0.007});
    for(let i=0;i<5;i++)items.push({id:`B${i}`,points:[B[i],B[(i+1)%5]],radius:0.014,hinge:i});
    items.push({id:"PIN",points:[[0,0,source.frameHeight/2-0.045],[0,0,source.frameHeight/2+0.045]],radius:0.025});
    return items;
  }

  function clearanceAt(foldDegrees,source=replay.defaults,options=contract){
    const triangles=trimmedTriangles(foldDegrees,source,options);
    let pairDistance=Infinity,pair=null,fixedGap=Infinity,fixed=null;
    for(let i=0;i<triangles.length;i++)for(let j=i+1;j<triangles.length;j++){
      const value=triangleDistance(triangles[i],triangles[j]);
      if(value<pairDistance){pairDistance=value;pair=[i,j];}
    }
    const segments=fixedSegments(source);
    triangles.forEach((triangle,flap)=>segments.forEach(segment=>{
      if(segment.hinge===flap)return;
      const value=segmentTriangleDistance(segment.points,triangle)-options.thickness/2-segment.radius;
      if(value<fixedGap){fixedGap=value;fixed={flap,segment:segment.id};}
    }));
    return Object.freeze({
      foldDegrees,
      pairDistance,
      pairGap:pairDistance-options.thickness,
      pair,
      fixedGap,
      fixed,
      tipRadius:Math.hypot(triangles[0][2][0],triangles[0][2][1])
    });
  }

  function runEnvelope(source=replay.defaults,overrides={}){
    const options=Object.freeze({...contract,...overrides});
    const required=options.clearance;
    let lo=0,hi=source.contactFoldDegrees;
    for(let i=0;i<options.searchIterations;i++){
      const mid=(lo+hi)/2,state=clearanceAt(mid,source,options);
      if(state.pairGap>=required&&state.fixedGap>=required)lo=mid;else hi=mid;
    }
    const safeAngle=lo,safe=clearanceAt(safeAngle,source,options),nominal=clearanceAt(source.contactFoldDegrees,source,options);
    let minPairGap=Infinity,minFixedGap=Infinity,checks=0,passed=0;
    for(let station=0;station<options.stations;station++){
      const angle=safeAngle*station/(options.stations-1),triangles=trimmedTriangles(angle,source,options),segments=fixedSegments(source);
      for(let i=0;i<triangles.length;i++)for(let j=i+1;j<triangles.length;j++){
        const gap=triangleDistance(triangles[i],triangles[j])-options.thickness;
        minPairGap=Math.min(minPairGap,gap);checks++;if(gap>=required-1e-10)passed++;
      }
      triangles.forEach((triangle,flap)=>segments.forEach(segment=>{
        if(segment.hinge===flap)return;
        const gap=segmentTriangleDistance(segment.points,triangle)-options.thickness/2-segment.radius;
        minFixedGap=Math.min(minFixedGap,gap);checks++;if(gap>=required-1e-10)passed++;
      }));
    }
    const open=trimmedTriangles(0,source,options),returned=trimmedTriangles(0,source,options);
    let returnError=0;
    open.forEach((triangle,i)=>triangle.forEach((point,j)=>{returnError=Math.max(returnError,distance(point,returned[i][j]));checks++;if(distance(point,returned[i][j])<1e-15)passed++;}));
    checks++;if(nominal.pairGap<required)passed++;
    return Object.freeze({
      pass:passed===checks,
      passed,total:checks,
      options,
      safeAngleDegrees:safeAngle,
      nominalContactDegrees:source.contactFoldDegrees,
      angleHoldDegrees:source.contactFoldDegrees-safeAngle,
      safeTipRadius:safe.tipRadius,
      safeApertureDiameter:2*safe.tipRadius,
      minOperatingPairGap:minPairGap,
      minOperatingFixedGap:minFixedGap,
      nominalContactPairGap:nominal.pairGap,
      nominalContactCollisionDetected:nominal.pairGap<required,
      returnError,
      claim:"FINITE_THICKNESS_SAMPLED_ENVELOPE_WITH_EARLY_STOP",
      hold:"CONTINUOUS_COLLISION_CERTIFICATE / HINGE_DETAIL / ACTUATOR / HOUSING / FORCE / MATERIAL"
    });
  }

  return Object.freeze({contract,trimmedTriangles,fixedSegments,clearanceAt,runEnvelope,triangleDistance,segmentTriangleDistance});
});
