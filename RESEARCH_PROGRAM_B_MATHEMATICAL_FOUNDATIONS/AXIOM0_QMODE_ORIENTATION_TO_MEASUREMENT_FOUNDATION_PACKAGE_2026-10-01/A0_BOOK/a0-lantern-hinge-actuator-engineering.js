(function(root,factory){
  const api=factory(
    typeof module==="object"&&module.exports?require("./a0-lantern-crown-replay.js"):root.A0LanternCrownReplay,
    typeof module==="object"&&module.exports?require("./a0-lantern-crown-envelope.js"):root.A0LanternCrownEnvelope
  );
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.A0LanternHingeActuatorEngineering=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(replay,envelope){
  "use strict";

  const contract=Object.freeze({
    sourceUnitMillimetres:100,
    operatingStopDegrees:147.5,
    continuousIntervals:4096,
    requiredClearanceMillimetres:1,
    flapThicknessMillimetres:2,
    hingeEndReliefMillimetres:6,
    pinDiameterMillimetres:4,
    bearingBoreDiameterMillimetres:5,
    bearingOuterDiameterMillimetres:8,
    bearingWidthMillimetres:4,
    shaftOverhangMillimetres:12,
    actuatorPodAxialGapMillimetres:2,
    housingInnerRadiusMillimetres:153,
    housingWallMillimetres:4,
    housingBottomMillimetres:-8,
    housingTopMillimetres:122
  });
  const radians=degrees=>degrees*Math.PI/180;
  const mm=(value,options=contract)=>value*options.sourceUnitMillimetres;

  function continuousCertificate(source=replay.defaults,options=contract){
    const intervalWidth=options.operatingStopDegrees/options.continuousIntervals;
    const halfWidth=intervalWidth/2;
    const tipSpeedPerDegree=mm(source.flapAltitude)*Math.PI/180;
    const pairLipschitz=2*tipSpeedPerDegree;
    const fixedLipschitz=tipSpeedPerDegree;
    let pairLower=Infinity,fixedLower=Infinity,pairWitness=null,fixedWitness=null;
    for(let i=0;i<options.continuousIntervals;i++){
      const midpoint=(i+0.5)*intervalWidth;
      const state=envelope.clearanceAt(midpoint,source);
      const pair=mm(state.pairGap)-pairLipschitz*halfWidth;
      const fixed=mm(state.fixedGap)-fixedLipschitz*halfWidth;
      if(pair<pairLower){pairLower=pair;pairWitness={interval:i,midpointDegrees:midpoint,pair:state.pair};}
      if(fixed<fixedLower){fixedLower=fixed;fixedWitness={interval:i,midpointDegrees:midpoint,fixed:state.fixed};}
    }
    return Object.freeze({
      method:"LIPSCHITZ_INTERVAL_LOWER_BOUND",
      intervals:options.continuousIntervals,
      intervalWidthDegrees:intervalWidth,
      pairLipschitzMillimetresPerDegree:pairLipschitz,
      fixedLipschitzMillimetresPerDegree:fixedLipschitz,
      certifiedPairClearanceMillimetres:pairLower,
      certifiedFixedClearanceMillimetres:fixedLower,
      requiredClearanceMillimetres:options.requiredClearanceMillimetres,
      pairWitness,fixedWitness,
      pass:pairLower>=options.requiredClearanceMillimetres&&fixedLower>=options.requiredClearanceMillimetres
    });
  }

  function runEngineering(source=replay.defaults,overrides={}){
    const options=Object.freeze({...contract,...overrides});
    const hinges=replay.hinges(source);
    const edgeLengths=hinges.map(hinge=>mm(replay.distance(hinge.left,hinge.right),options));
    const openTipRadius=mm(Math.hypot(...replay.tipsAt(0,source)[0].slice(0,2)),options);
    const stopTips=replay.tipsAt(options.operatingStopDegrees,source);
    const stopAperture=2*mm(Math.hypot(stopTips[0][0],stopTips[0][1]),options);
    const maximumStopZ=Math.max(...stopTips.map(point=>mm(point[2],options)));
    const certificate=continuousCertificate(source,options);
    const radialRunningClearance=(options.bearingBoreDiameterMillimetres-options.pinDiameterMillimetres)/2;
    const housingRadialMargin=options.housingInnerRadiusMillimetres-openTipRadius-options.flapThicknessMillimetres/2;
    const housingTopMargin=options.housingTopMillimetres-maximumStopZ-options.flapThicknessMillimetres/2;
    const checks=[
      options.bearingWidthMillimetres<=options.hingeEndReliefMillimetres,
      radialRunningClearance>0,
      options.bearingOuterDiameterMillimetres>options.bearingBoreDiameterMillimetres,
      options.shaftOverhangMillimetres>=options.bearingWidthMillimetres+options.actuatorPodAxialGapMillimetres,
      Math.min(...edgeLengths)>2*options.hingeEndReliefMillimetres,
      housingRadialMargin>=options.requiredClearanceMillimetres,
      housingTopMargin>=options.requiredClearanceMillimetres,
      options.housingBottomMillimetres<=-options.requiredClearanceMillimetres,
      certificate.pass,
      options.operatingStopDegrees<source.contactFoldDegrees
    ];
    const bearings=hinges.map((hinge,index)=>Object.freeze({
      id:`HINGE-${index+1}`,
      axis:[hinge.right.map((v,i)=>v-hinge.left[i]),hinge.left],
      pinDiameterMillimetres:options.pinDiameterMillimetres,
      boreDiameterMillimetres:options.bearingBoreDiameterMillimetres,
      outerDiameterMillimetres:options.bearingOuterDiameterMillimetres,
      widthMillimetres:options.bearingWidthMillimetres,
      radialRunningClearanceMillimetres:radialRunningClearance,
      endReliefMillimetres:options.hingeEndReliefMillimetres
    }));
    const actuators=hinges.map((hinge,index)=>Object.freeze({
      id:`ACT-${index+1}`,
      route:"COAXIAL_HINGE_SHAFT_TO_EXTERNAL_SERVO_POD",
      hinge:`HINGE-${index+1}`,
      shaftOverhangMillimetres:options.shaftOverhangMillimetres,
      podAxialGapMillimetres:options.actuatorPodAxialGapMillimetres,
      synchronization:"EXTERNAL_CONTROLLER / NO INTERNAL CROSSING LINK",
      torqueClaim:"NOT_RATED"
    }));
    return Object.freeze({
      pass:checks.every(Boolean),
      passed:checks.filter(Boolean).length,
      total:checks.length,
      options,certificate,bearings,actuators,
      geometry:{
        edgeLengthMillimetres:{min:Math.min(...edgeLengths),max:Math.max(...edgeLengths)},
        radialRunningClearanceMillimetres:radialRunningClearance,
        openTipRadiusMillimetres:openTipRadius,
        operatingStopDegrees:options.operatingStopDegrees,
        stopApertureDiameterMillimetres:stopAperture,
        maximumStopZMillimetres:maximumStopZ,
        housingRadialMarginMillimetres:housingRadialMargin,
        housingTopMarginMillimetres:housingTopMargin
      },
      housing:{
        type:"OPEN_CYLINDRICAL_GUARD_WITH_SERVICE_CAP",
        innerRadiusMillimetres:options.housingInnerRadiusMillimetres,
        outerRadiusMillimetres:options.housingInnerRadiusMillimetres+options.housingWallMillimetres,
        bottomMillimetres:options.housingBottomMillimetres,
        topMillimetres:options.housingTopMillimetres
      },
      materials:{
        flapPrototype:"PETG / 2 mm / KINEMATIC PROTOTYPE ONLY",
        pin:"AISI 316 STAINLESS / 4 mm",
        bearing:"POM-C LINER / 5 mm BORE / 8 mm OD",
        housing:"PETG / 4 mm GUARD / NON-STRUCTURAL",
        actuator:"EXTERNAL MICRO-SERVO PLACEHOLDER / TORQUE UNRATED"
      },
      claim:"KINEMATIC_HINGE_ACTUATOR_HOUSING_PROTOTYPE_WITH_CONTINUOUS_CLEARANCE_CERTIFICATE",
      hold:"LOAD / FATIGUE / WEAR / THERMAL / TORQUE / FASTENER / FABRICATION RELEASE"
    });
  }

  return Object.freeze({contract,continuousCertificate,runEngineering});
});
