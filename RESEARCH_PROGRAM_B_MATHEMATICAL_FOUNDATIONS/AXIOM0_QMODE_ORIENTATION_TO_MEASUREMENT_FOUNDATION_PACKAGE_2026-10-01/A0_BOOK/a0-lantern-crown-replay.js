(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.A0LanternCrownReplay=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const defaults=Object.freeze({
    flapAltitude:0.7806558302560331,
    baseApothem:0.6881909602355868,
    leg:0.9270509831248421,
    contactFoldDegrees:151.83050078622392,
    frameHeight:0.7676481280896634,
    lowerFrame:Object.freeze([
      Object.freeze([0.2628655560595668,0.8090169943749473,0]),
      Object.freeze([-0.6881909602355867,0.5000000000000001,0]),
      Object.freeze([-0.6881909602355868,-0.4999999999999999,0]),
      Object.freeze([0.26286555605956663,-0.8090169943749475,0]),
      Object.freeze([0.8506508083520399,-2.0834935792808685e-16,0])
    ]),
    middleFrame:Object.freeze([
      Object.freeze([3.8976439470416135e-17,0.9922676077370961,0.3838240640448317]),
      Object.freeze([-0.9437025742469685,0.3066275537585369,0.3838240640448317]),
      Object.freeze([-0.5832402661553978,-0.8027613576270847,0.3838240640448317]),
      Object.freeze([0.5832402661553976,-0.8027613576270848,0.3838240640448317]),
      Object.freeze([0.9437025742469685,0.30662755375853645,0.3838240640448317])
    ]),
    upperFrame:Object.freeze([
      Object.freeze([-0.26286555605956674,0.8090169943749475,0.7676481280896634]),
      Object.freeze([-0.8506508083520399,1.0417467896404342e-16,0.7676481280896634]),
      Object.freeze([-0.2628655560595669,-0.8090169943749473,0.7676481280896634]),
      Object.freeze([0.6881909602355867,-0.5000000000000001,0.7676481280896634]),
      Object.freeze([0.6881909602355868,0.4999999999999998,0.7676481280896634])
    ])
  });

  const add=(a,b)=>a.map((value,index)=>value+b[index]);
  const sub=(a,b)=>a.map((value,index)=>value-b[index]);
  const scale=(a,factor)=>a.map(value=>value*factor);
  const length=a=>Math.hypot(...a);
  const distance=(a,b)=>length(sub(a,b));
  const midpoint=(a,b)=>scale(add(a,b),0.5);
  const normalize=a=>scale(a,1/length(a));
  const radians=degrees=>degrees*Math.PI/180;

  const sourceFromRecords=(models,native)=>Object.freeze({
    flapAltitude:native.pentagonExtension.flapAltitude,
    baseApothem:native.pentagonExtension.baseApothem,
    leg:native.pentagonExtension.leg,
    contactFoldDegrees:native.pentagonExtension.contactFoldDegrees,
    frameHeight:models.reference.h,
    lowerFrame:Object.freeze(models.reference.A.map(point=>Object.freeze([...point]))),
    middleFrame:Object.freeze(models.reference.M.map(point=>Object.freeze([...point]))),
    upperFrame:Object.freeze(models.reference.B.map(point=>Object.freeze([...point])))
  });

  const hinges=(source=defaults)=>source.upperFrame.map((left,index)=>{
    const right=source.upperFrame[(index+1)%source.upperFrame.length];
    const center=midpoint(left,right);
    const outward=normalize([center[0],center[1],0]);
    return Object.freeze({left,right,center,outward});
  });

  const tipsAt=(foldDegrees,source=defaults)=>{
    const fold=radians(foldDegrees);
    return hinges(source).map(({center,outward})=>add(center,add(
      scale(outward,source.flapAltitude*Math.cos(fold)),
      [0,0,source.flapAltitude*Math.sin(fold)]
    )));
  };

  const runReplay=(source=defaults)=>{
    const checks=[];
    let maxLegError=0;
    const contactFold=source.contactFoldDegrees;
    for(let step=0;step<=120;step++){
      const tips=tipsAt(contactFold*step/120,source);
      hinges(source).forEach((hinge,index)=>{
        const leftError=Math.abs(distance(tips[index],hinge.left)-source.leg);
        const rightError=Math.abs(distance(tips[index],hinge.right)-source.leg);
        maxLegError=Math.max(maxLegError,leftError,rightError);
        checks.push(leftError<1e-12,rightError<1e-12);
      });
    }
    const contact=tipsAt(contactFold,source);
    const contactTarget=[0,0,source.frameHeight+source.flapAltitude*Math.sin(radians(contactFold))];
    let maxContactError=0;
    contact.forEach(tip=>{
      const error=distance(tip,contactTarget);
      maxContactError=Math.max(maxContactError,error);
      checks.push(error<1e-12);
    });
    const open=tipsAt(0,source);
    const returned=tipsAt(0,source);
    let maxReturnError=0;
    open.forEach((tip,index)=>{
      const error=distance(tip,returned[index]);
      maxReturnError=Math.max(maxReturnError,error);
      checks.push(error<1e-15);
    });
    return Object.freeze({
      pass:checks.every(Boolean),
      passed:checks.filter(Boolean).length,
      total:checks.length,
      frames:121,
      flaps:5,
      maxLegError,
      maxContactError,
      maxReturnError,
      contactFoldDegrees:contactFold,
      claim:"ZERO_THICKNESS_RIGID_FLAP_GEOMETRY_ONLY",
      hold:"FINITE_THICKNESS_COLLISION / GUIDES / ACTUATOR / HOUSING"
    });
  };

  return Object.freeze({defaults,sourceFromRecords,hinges,tipsAt,runReplay,distance});
});
