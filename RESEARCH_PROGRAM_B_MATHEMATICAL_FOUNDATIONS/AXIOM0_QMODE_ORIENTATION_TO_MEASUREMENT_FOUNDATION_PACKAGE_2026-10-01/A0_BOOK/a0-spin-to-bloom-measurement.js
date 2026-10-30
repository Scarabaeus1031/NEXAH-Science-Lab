(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0SpinToBloomMeasurement=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=Math.PI*2,DEFAULTS=Object.freeze({a:5,b:6,phaseDegrees:90,stepDegrees:11,layers:11,gain:.55,samples:8192});
  function finite(value,label){if(!Number.isFinite(value))throw new TypeError(`${label} must be finite`);return value;}
  function integer(value,label,min=1){if(!Number.isInteger(value)||value<min)throw new RangeError(`${label} must be an integer >= ${min}`);return value;}
  function normalize(input={}){const p={...DEFAULTS,...input};integer(p.a,'frequency a');integer(p.b,'frequency b');integer(p.layers,'layers');integer(p.samples,'samples',512);finite(p.phaseDegrees,'phaseDegrees');finite(p.stepDegrees,'stepDegrees');finite(p.gain,'gain');if(p.gain<=0||p.gain>=.95)throw new RangeError('gain must be between 0 and .95');return p;}
  function radians(degrees){return degrees*Math.PI/180;}
  function carrier(t,input={}){const p=normalize(input),phase=radians(p.phaseDegrees),u=Math.sin(p.a*t),v=Math.sin(p.b*t+phase);return{u,v,mix:u*v};}
  function orbitPoint(t,input={}){const q=carrier(t,input);return{x:q.u,y:q.v};}
  function bloomPoint(t,input={}){const p=normalize(input),q=carrier(t,p),radius=1+p.gain*q.mix;return{x:radius*Math.cos(t),y:radius*Math.sin(t),radius,mix:q.mix};}
  function closureError(input={},kind='bloom'){const p=normalize(input),fn=kind==='orbit'?orbitPoint:bloomPoint,a=fn(0,p),b=fn(TAU,p);return Math.hypot(a.x-b.x,a.y-b.y);}
  function sampledBloom(input={}){
    const p=normalize(input),values=[];
    for(let index=0;index<p.samples;index+=1){const t=index/p.samples*TAU,point=bloomPoint(t,p);values.push({index,t,radius:point.radius,x:point.x,y:point.y});}
    return{parameters:p,values};
  }
  function detectTips(input={}){
    const sampled=sampledBloom(input),p=sampled.parameters,values=sampled.values;
    const tips=[];
    for(let index=0;index<p.samples;index+=1){const previous=values[(index-1+p.samples)%p.samples].radius,current=values[index].radius,next=values[(index+1)%p.samples].radius;if(current>previous&&current>=next)tips.push(values[index]);}
    return{count:tips.length,tips,method:'periodic sampled local radial maxima',samples:p.samples};
  }
  function forwardIndexDistance(from,to,size){return(to-from+size)%size;}
  function minimumBetween(values,fromIndex,toIndex){
    const size=values.length,steps=forwardIndexDistance(fromIndex,toIndex,size);let minimum=values[fromIndex];
    for(let offset=0;offset<=steps;offset+=1){const value=values[(fromIndex+offset)%size];if(value.radius<minimum.radius)minimum=value;}
    return minimum;
  }
  function degrees(value){return value*180/Math.PI;}
  function tipEvents(input={}){
    const sampled=sampledBloom(input),p=sampled.parameters,values=sampled.values,detected=detectTips(p),events=[];
    detected.tips.forEach((tip,tipIndex)=>{
      const previousTip=detected.tips[(tipIndex-1+detected.count)%detected.count],nextTip=detected.tips[(tipIndex+1)%detected.count],left=minimumBetween(values,previousTip.index,tip.index),right=minimumBetween(values,tip.index,nextTip.index),previous=values[(tip.index-1+p.samples)%p.samples],next=values[(tip.index+1)%p.samples],curvature=previous.radius-2*tip.radius+next.radius,pinGapSamples=forwardIndexDistance(left.index,right.index,p.samples);
      events.push({
        id:`TIP_${String(tipIndex+1).padStart(2,'0')}`,tipIndex,tipSampleIndex:tip.index,tipPhaseRadians:tip.t,tipPhaseDegrees:degrees(tip.t),radius:tip.radius,curvatureSecondDifference:curvature,
        Y:{role:'GRIP',side:'LEFT_FLANK',sampleIndex:left.index,phaseRadians:left.t,phaseDegrees:degrees(left.t),radius:left.radius,gapDepth:tip.radius-left.radius},
        Z:{role:'DIVOT',side:'RIGHT_FLANK',sampleIndex:right.index,phaseRadians:right.t,phaseDegrees:degrees(right.t),radius:right.radius,gapDepth:tip.radius-right.radius},
        pinGap:{samples:pinGapSamples,phaseRadians:pinGapSamples/p.samples*TAU,phaseDegrees:pinGapSamples/p.samples*360},pairNotation:'Y:Z',orientationScope:'LOCAL_BLOOM_VIEW_ONLY'
      });
    });
    return{schema:'a0.spin-to-bloom-tip-events/1.0.0',count:events.length,events,method:'periodic tip with adjacent inter-tip radial minima as Y/Z flanks',orientationScope:'LOCAL_BLOOM_VIEW_ONLY'};
  }
  function envelopeTrace(input={},angularSamples=720){
    const p=normalize(input);integer(angularSamples,'angularSamples',64);
    const planes=Array.from({length:p.layers},(_,index)=>({index,phaseDegrees:p.phaseDegrees+index*p.stepDegrees,minRadius:Infinity,maxRadius:-Infinity,radiusSum:0})),samples=[];
    let innerMin=Infinity,innerMax=-Infinity,innerSum=0,outerMin=Infinity,outerMax=-Infinity,outerSum=0,midMin=Infinity,midMax=-Infinity,midSum=0,gapSum=0,gapSquareSum=0,gapMax=0;
    for(let sampleIndex=0;sampleIndex<=angularSamples;sampleIndex+=1){
      const t=sampleIndex/angularSamples*TAU,radii=planes.map((plane,index)=>bloomPoint(t,{...p,phaseDegrees:p.phaseDegrees+index*p.stepDegrees}).radius),innerRadius=Math.min(...radii),outerRadius=Math.max(...radii),midRadius=(innerRadius+outerRadius)/2,greenRadius=radii[0],pinkRadius=radii[Math.min(1,radii.length-1)],stripGap=Math.abs(greenRadius-pinkRadius);
      samples.push({t,innerRadius,outerRadius,midRadius,greenRadius,pinkRadius});
      if(sampleIndex<angularSamples){
        innerMin=Math.min(innerMin,innerRadius);innerMax=Math.max(innerMax,innerRadius);innerSum+=innerRadius;outerMin=Math.min(outerMin,outerRadius);outerMax=Math.max(outerMax,outerRadius);outerSum+=outerRadius;midMin=Math.min(midMin,midRadius);midMax=Math.max(midMax,midRadius);midSum+=midRadius;gapSum+=stripGap;gapSquareSum+=stripGap*stripGap;gapMax=Math.max(gapMax,stripGap);
        radii.forEach((radius,index)=>{const plane=planes[index];plane.minRadius=Math.min(plane.minRadius,radius);plane.maxRadius=Math.max(plane.maxRadius,radius);plane.radiusSum+=radius;});
      }
    }
    return{parameters:p,angularSamples,samples,summary:{schema:'a0.spin-to-bloom-envelope-observables/1.0.0',scope:'DERIVED_LOCAL_PHASE_SWEEP_VIEW',ringPlaneCount:p.layers,innerEnvelope:{workingLabel:'BLACK_SUN_NEGATIVE_SPACE',minRadius:innerMin,maxRadius:innerMax,meanRadius:innerSum/angularSamples},outerBoundary:{workingLabel:'OUTER_EDGE',minRadius:outerMin,maxRadius:outerMax,meanRadius:outerSum/angularSamples},greyMidline:{workingLabel:'GREY_STAR_MIDLINE',minRadius:midMin,maxRadius:midMax,meanRadius:midSum/angularSamples},rgStrip:{workingLabel:'GREEN_PINK_ADJACENT_LAYER_GAP',greenLayerIndex:0,pinkLayerIndex:Math.min(1,p.layers-1),meanGap:gapSum/angularSamples,rmsGap:Math.sqrt(gapSquareSum/angularSamples),maxGap:gapMax},pin:{workingLabel:'GREY_PIN_ORIGIN',x:0,y:0,offset:0},ringPlanes:planes.map(plane=>({index:plane.index,phaseDegrees:plane.phaseDegrees,minRadius:plane.minRadius,maxRadius:plane.maxRadius,meanRadius:plane.radiusSum/angularSamples})),claimBoundary:'Derived extrema, midline and adjacent-layer gap of the declared synthetic phase sweep only; working labels are view labels, not physical objects or topology claims.'}};
  }
  function envelopeObservables(input={}){return envelopeTrace(input,720).summary;}
  function phaseSweep(input={}){
    const p=normalize(input),layers=[];
    for(let index=0;index<p.layers;index+=1){const phaseDegrees=p.phaseDegrees+index*p.stepDegrees,result=detectTips({...p,phaseDegrees});layers.push({index,phaseDegrees,tipCount:result.count});}
    const counts=[...new Set(layers.map(layer=>layer.tipCount))];return{layers,counts,stable:counts.length===1,referenceCount:layers[0].tipCount};
  }
  function gcd(a,b){let x=Math.abs(a),y=Math.abs(b);while(y){const remainder=x%y;x=y;y=remainder;}return x;}
  const LAMELLA_VARIANTS=Object.freeze([
    Object.freeze({id:'SMOOTH',label:'Smooth',file:'kleinbottle_smooth.glb',bytes:163236,sha256:'64e1aa9ed2bf4cc4e3e318f3ace57aa0363677fb62df595c83e09495a4d8a817',displayRole:'continuous source silhouette'}),
    Object.freeze({id:'MIXED',label:'Mixed',file:'klein_mixed_faceted_smooth2.glb',bytes:1157472,sha256:'f3f646e789a312df21449abeaf148683121ef3dea64da196c36560b5e8ac1d84',displayRole:'smooth/faceted comparator'}),
    Object.freeze({id:'FACETED',label:'Faceted',file:'klein_faceted_ticks_numbered.glb',bytes:580788,sha256:'ac7145ba7579f28eb8365a918b20f7f27e9a52d5b9518e19d25faf2d5bffa709',displayRole:'faceted/ticked source comparator'})
  ]);
  function normalizeAxisDegrees(value){finite(value,'angle');return((value%180)+180)%180;}
  function axisDistance(a,b){const distance=Math.abs(normalizeAxisDegrees(a)-normalizeAxisDegrees(b));return Math.min(distance,180-distance);}
  function vmFlipDegrees(theta){return normalizeAxisDegrees(180-normalizeAxisDegrees(theta));}
  function lamellaPlanes(input={}){
    const p=normalize(input),envelope=envelopeObservables(p);
    return envelope.ringPlanes.map((plane,index)=>({
      id:`L${String(index+1).padStart(2,'0')}`,
      index,
      declaredNormalDegrees:normalizeAxisDegrees(plane.phaseDegrees),
      sourcePhaseDegrees:plane.phaseDegrees,
      spacingDegrees:index===0?null:Math.abs(plane.phaseDegrees-envelope.ringPlanes[index-1].phaseDegrees),
      minRadius:plane.minRadius,
      meanRadius:plane.meanRadius,
      maxRadius:plane.maxRadius,
      adapter:'INDEX_PRESERVING_LAMELLA_TO_RING_PLANE'
    }));
  }
  function lamellaCrosswalk(input={},cutDegrees=47.5){
    const p=normalize(input),planes=lamellaPlanes(p),sourceAngle=normalizeAxisDegrees(cutDegrees),returnAngle=vmFlipDegrees(sourceAngle);
    const nearest=angle=>planes.reduce((best,plane)=>axisDistance(plane.declaredNormalDegrees,angle)<axisDistance(best.declaredNormalDegrees,angle)?plane:best,planes[0]);
    const sourcePlane=nearest(sourceAngle),returnPlane=nearest(returnAngle);
    return{schema:'a0.klein-lamella-plane-crosswalk/1.0.0',scope:'DECLARED_INDEX_ADAPTER_NOT_GLB_GEOMETRY_EXTRACTION',sourceAngle,returnAngle,vmRule:'VM(theta) = (180° - theta) mod 180°',sourcePlane,returnPlane,planes,exactPairs:{betaDelta:vmFlipDegrees(47.5)===132.5,iotaPhantom:vmFlipDegrees(50)===130,alphaFixed:vmFlipDegrees(90)===90},claimBoundary:'Lamella IDs are a declared diagnostic adapter onto the existing Spin-to-Bloom ring-plane indices. They are not a segmentation or topology inference from the bound GLB payloads.'};
  }
  function lamellaBenchState(input={}){
    const raw=input.parameters||input,parameters=['a','b','phaseDegrees','stepDegrees','layers','gain','samples'].reduce((result,key)=>{if(raw[key]!==undefined)result[key]=raw[key];return result;},{}),p=normalize(parameters),variant=LAMELLA_VARIANTS.find(item=>item.id===(input.variant||'MIXED'))||LAMELLA_VARIANTS[1],selectedIndex=Math.max(0,Math.min(p.layers-1,Number.isInteger(input.selectedIndex)?input.selectedIndex:5)),cutDegrees=normalizeAxisDegrees(input.cutDegrees??47.5),step=input.step||'SOURCE';
    return{schema:'a0.klein-lamella-return-state/1.0.0',identity:'ART:A0:MATHEMATICAL_JOINTS',variant:variant.id,selectedIndex,cutDegrees,step,parameters:p};
  }
  function advanceLamellaBench(state,step){
    const allowed=['SOURCE','SELECT','CUT','COMPARE','RECORD','RETURN'];if(!allowed.includes(step))throw new RangeError('invalid lamella bench step');
    const next=lamellaBenchState({...state,step}),crosswalk=lamellaCrosswalk(next.parameters,next.cutDegrees),selected=crosswalk.planes[next.selectedIndex];
    return{...next,selectedLamella:selected,crosswalk,returnVerified:step==='RETURN'?JSON.stringify(lamellaBenchState({parameters:next.parameters}))===JSON.stringify(lamellaBenchState({parameters:next.parameters,variant:'MIXED',selectedIndex:5,cutDegrees:47.5,step:'SOURCE'})):false};
  }
  function lamellaReturnReceipt(input={}){
    const working=lamellaBenchState(input),source=lamellaBenchState({parameters:working.parameters}),record=advanceLamellaBench(working,'RECORD'),returned=advanceLamellaBench(source,'RETURN');
    return{schema:'a0.klein-lamella-return-receipt/1.0.0',status:returned.returnVerified?'PASS_EXACT_DECLARED_SOURCE_STATE_RETURN':'HOLD_RETURN_MISMATCH',identityReuse:['ART:A0:MATHEMATICAL_JOINTS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','A0_IOTA_BRIDGE_DEMONSTRATOR'],sourceVariants:LAMELLA_VARIANTS,sourceState:source,record,returnedState:returned,newCanonicalIds:[],relationChanges:[],claimBoundary:'Source-bound diagnostic comparator and exact UI-state return only. The GLBs remain historical intake assets; the lamella adapter does not infer their topology, physics, manufacture or scientific identity.'};
  }
  const WIGGLE_DEFAULTS=Object.freeze({channels:11,cycles:6.25,amplitude:.48,damping:3.5,phaseSpread:.68,captureThreshold:.045,samples:360});
  function normalizeWiggleControls(input={}){
    const controls={...WIGGLE_DEFAULTS,...input};
    integer(controls.channels,'channels',3);integer(controls.samples,'samples',120);finite(controls.cycles,'cycles');finite(controls.amplitude,'amplitude');finite(controls.damping,'damping');finite(controls.phaseSpread,'phaseSpread');finite(controls.captureThreshold,'captureThreshold');
    if(controls.channels>24)throw new RangeError('channels must be <= 24');
    if(controls.cycles<=0||controls.cycles>20)throw new RangeError('cycles must be between 0 and 20');
    if(controls.amplitude<=0||controls.amplitude>1)throw new RangeError('amplitude must be between 0 and 1');
    if(controls.damping<=0||controls.damping>12)throw new RangeError('damping must be between 0 and 12');
    if(controls.phaseSpread<0||controls.phaseSpread>Math.PI)throw new RangeError('phaseSpread must be between 0 and pi');
    if(controls.captureThreshold<=0||controls.captureThreshold>=controls.amplitude)throw new RangeError('captureThreshold must be positive and smaller than amplitude');
    return controls;
  }
  function wiggleReturnTrace(input={},controlInput={}){
    const p=normalize(input),controls=normalizeWiggleControls({...controlInput,channels:controlInput.channels??p.layers}),samples=[];
    for(let index=0;index<=controls.samples;index+=1){
      const progress=index/controls.samples,center=.18*Math.sin(TAU*(.72*progress+.09*Math.sin(Math.PI*progress)))*(1-.22*progress),envelope=controls.amplitude*Math.exp(-controls.damping*progress),channels=[];
      for(let channel=0;channel<controls.channels;channel+=1){const centered=channel/(controls.channels-1)-.5,phase=centered*controls.phaseSpread,wave=.72*Math.sin(TAU*controls.cycles*progress+phase)+.28*Math.sin(TAU*(controls.cycles+1.35)*progress-phase*.5);channels.push(center+envelope*wave);}
      const minimum=Math.min(...channels),maximum=Math.max(...channels);samples.push({index,progress,center,envelope,lowerEnvelope:center-envelope,upperEnvelope:center+envelope,minimum,maximum,bundleWidth:maximum-minimum,channels});
    }
    const captureIndex=samples.findIndex(sample=>sample.envelope<=controls.captureThreshold),capture=captureIndex>=0?samples[captureIndex]:null,final=samples[samples.length-1],initialWidth=samples[0].bundleWidth,returnResidual=Math.max(...final.channels.map(value=>Math.abs(value-final.center)));
    return{schema:'a0.spin-to-bloom-wiggle-return/1.0.0',scope:'DETERMINISTIC_SYNTHETIC_BUNDLE_DIAGNOSTIC',identity:'ART:A0:MATHEMATICAL_JOINTS',parameters:p,controls,samples,capture:capture?{index:capture.index,progress:capture.progress,envelope:capture.envelope,bundleWidth:capture.bundleWidth,threshold:controls.captureThreshold}:null,summary:{status:capture?'PASS_DECLARED_CAPTURE':'HOLD_NO_CAPTURE_WITHIN_WINDOW',channels:controls.channels,captureProgress:capture?capture.progress:null,captureBundleWidth:capture?capture.bundleWidth:null,returnResidual,initialBundleWidth:initialWidth,coherenceGain:initialWidth>0?1-returnResidual/initialWidth:1},newCanonicalIds:[],relationChanges:[],claimBoundary:'Deterministic display bundle around a declared centerline. Envelope decay and the capture threshold are model controls, not inferred natural modes, material damping, energy transfer or physical lock-in.'};
  }
  const GREY_ROTATION_DEFAULTS=Object.freeze({frameAngleDegrees:0,rotationRateDegrees:18});
  const REGIME_DOMAINS=Object.freeze([
    Object.freeze({id:'CONTROL_1_1',label:'CONTROL',a:1,b:1}),
    Object.freeze({id:'SOURCE_3_2',label:'SOURCE',a:3,b:2}),
    Object.freeze({id:'RETURN_5_6',label:'RETURN',a:5,b:6})
  ]);
  const REGIME_PHASES=Object.freeze([
    Object.freeze({id:'ALIGN_0',label:'ALIGN',phaseDegrees:0}),
    Object.freeze({id:'DRIFT_45',label:'DRIFT',phaseDegrees:45}),
    Object.freeze({id:'QUADRATURE_90',label:'QUADRATURE',phaseDegrees:90})
  ]);
  function normalizeGreyRotationControls(input={}){
    const controls={...GREY_ROTATION_DEFAULTS,...input};finite(controls.frameAngleDegrees,'frameAngleDegrees');finite(controls.rotationRateDegrees,'rotationRateDegrees');
    if(Math.abs(controls.rotationRateDegrees)>180)throw new RangeError('rotationRateDegrees must be between -180 and 180');
    controls.frameAngleDegrees=((controls.frameAngleDegrees%360)+360)%360;return controls;
  }
  function greyRotationState(input={},controlInput={}){
    const p=normalize(input),controls=normalizeGreyRotationControls(controlInput),angle=radians(controls.frameAngleDegrees),cos=Math.cos(angle),sin=Math.sin(angle),tipCount=detectTips(p).count,orbitClosureError=closureError(p,'orbit'),bloomClosureError=closureError(p,'bloom');
    return{schema:'a0.spin-to-bloom-grey-rotation/1.0.0',scope:'COHERENT_FIELD_FRAME_ROTATION_ONLY',identity:'ART:A0:MATHEMATICAL_JOINTS',parameters:p,controls,frameMatrix:[[cos,-sin],[sin,cos]],nullComparison:{stationaryRateDegrees:0,activeRateDegrees:controls.rotationRateDegrees,tipCountInvariant:tipCount,orbitClosureErrorInvariant:orbitClosureError,bloomClosureErrorInvariant:bloomClosureError,closureChangeUnderFrameRotation:0,status:'PASS_FRAME_ROTATION_ONLY'},newCanonicalIds:[],relationChanges:[],claimBoundary:'The coherent FIELD is sampled in a rotated display frame. Rotation changes only the observation coordinates; it is not stochastic Grey Noise, recovered dynamics, a new domain identity or evidence of physical rotation.'};
  }
  function lissajousRegimeAtlas(){
    const cells=[];
    REGIME_DOMAINS.forEach((domain,row)=>REGIME_PHASES.forEach((regime,column)=>{const parameters=normalize({a:domain.a,b:domain.b,phaseDegrees:regime.phaseDegrees}),tips=detectTips(parameters),orbitClosureError=closureError(parameters,'orbit'),bloomClosureError=closureError(parameters,'bloom');cells.push({id:`${domain.id}__${regime.id}`,row,column,domain:{id:domain.id,label:domain.label,ratio:`${domain.a}:${domain.b}`,a:domain.a,b:domain.b},regime:{id:regime.id,label:regime.label,phaseDegrees:regime.phaseDegrees},tipCount:tips.count,orbitClosureError,bloomClosureError,status:orbitClosureError<1e-12&&bloomClosureError<1e-12?'PASS_EXACT_DECLARED_CLOSURE':'HOLD_CLOSURE'});}));
    return{schema:'a0.spin-to-bloom-lissajous-regime-atlas/1.0.0',scope:'DECLARED_3_BY_3_DOMAIN_REGIME_COMPARATOR',identity:'ART:A0:MATHEMATICAL_JOINTS',rows:REGIME_DOMAINS,columns:REGIME_PHASES,cells,status:cells.every(cell=>cell.status==='PASS_EXACT_DECLARED_CLOSURE')?'PASS_9_DECLARED_CELLS':'HOLD_ATLAS',newCanonicalIds:[],relationChanges:[],claimBoundary:'Rows are three declared frequency domains and columns are three declared phase regimes. The nine views are finite synthetic comparators; they do not imply equivalence between domains, a universal regime map, physical oscillators or a new canonical identity.'};
  }
  const ROOT_FAMILIES=Object.freeze([
    Object.freeze({id:'ROOT_2',label:'√2',domain:'MACRO',kind:'SCALAR_ROOT',radicand:2,norm:Math.sqrt(2),components:null}),
    Object.freeze({id:'ROOT_3',label:'√3',domain:'MACRO',kind:'SCALAR_ROOT',radicand:3,norm:Math.sqrt(3),components:null}),
    Object.freeze({id:'ROOT_5',label:'√5',domain:'MACRO',kind:'SCALAR_ROOT',radicand:5,norm:Math.sqrt(5),components:null}),
    Object.freeze({id:'ROOT_7',label:'√7',domain:'MACRO',kind:'SCALAR_ROOT',radicand:7,norm:Math.sqrt(7),components:null}),
    Object.freeze({id:'ROOT_I',label:'√i',domain:'MICRO',kind:'PRINCIPAL_QUATERNION_ROOT',axis:'i',norm:1,components:[Math.SQRT1_2,Math.SQRT1_2,0,0]}),
    Object.freeze({id:'ROOT_J',label:'√j',domain:'MICRO',kind:'PRINCIPAL_QUATERNION_ROOT',axis:'j',norm:1,components:[Math.SQRT1_2,0,Math.SQRT1_2,0]}),
    Object.freeze({id:'ROOT_K',label:'√k',domain:'MICRO',kind:'PRINCIPAL_QUATERNION_ROOT',axis:'k',norm:1,components:[Math.SQRT1_2,0,0,Math.SQRT1_2]})
  ]);
  function rationalApproximation(value,maxDenominator=24){
    finite(value,'value');integer(maxDenominator,'maxDenominator',1);let best={numerator:0,denominator:1,error:Math.abs(value)};
    for(let denominator=1;denominator<=maxDenominator;denominator+=1){const numerator=Math.round(value*denominator),error=Math.abs(value-numerator/denominator);if(error<best.error)best={numerator,denominator,error};}
    return{...best,label:`${best.numerator}:${best.denominator}`};
  }
  function rootRelation(firstId,secondId){
    const first=ROOT_FAMILIES.find(node=>node.id===firstId),second=ROOT_FAMILIES.find(node=>node.id===secondId);if(!first||!second||first.id===second.id)throw new RangeError('root relation requires two distinct declared root families');
    const domains=first.domain===second.domain?first.domain:'CROSS',type=domains==='MACRO'?'SCALAR_ROOT_RATIO':domains==='MICRO'?'QUATERNION_AXIS_COMPARATOR':'CROSS_DOMAIN_NORM_COMPARATOR',larger=Math.max(first.norm,second.norm),smaller=Math.min(first.norm,second.norm),normRatio=smaller/larger,normDifference=Math.abs(first.norm-second.norm),normSum=first.norm+second.norm,tightness=Math.exp(-3*Math.abs(Math.log(normRatio))),slackProxy=1-tightness,returnTarget=5/6,returnResidual=Math.abs(normRatio-returnTarget),returnAffinity=1/(1+12*returnResidual),axisDot=domains==='MICRO'?0:null;
    return{id:`${first.id}__${second.id}`,firstId:first.id,secondId:second.id,labels:[first.label,second.label],domain:domains,type,normRatio,normDifference,normSum,rationalApproximation:rationalApproximation(normRatio),tightnessProxy:tightness,slackProxy,rgBandGapProxy:.2+.8*slackProxy,returnComparator:{target:'5:6',targetValue:returnTarget,residual:returnResidual,affinity:returnAffinity,identityClaim:false},axisDot,claimBoundary:type==='SCALAR_ROOT_RATIO'?'Ratio of two declared positive scalar roots.':type==='QUATERNION_AXIS_COMPARATOR'?'Principal quaternion roots share unit norm; axisDot compares distinct imaginary axes and is not scalar division.':'Cross-domain value compares norms only; it is not a scalar root identity or algebraic equivalence.'};
  }
  function rootMycelium(){
    const edges=[];for(let first=0;first<ROOT_FAMILIES.length;first+=1)for(let second=first+1;second<ROOT_FAMILIES.length;second+=1)edges.push(rootRelation(ROOT_FAMILIES[first].id,ROOT_FAMILIES[second].id));
    const closestReturnEdge=edges.filter(edge=>edge.domain==='MACRO').reduce((best,edge)=>edge.returnComparator.residual<best.returnComparator.residual?edge:best);
    return{schema:'a0.spin-to-bloom-root-ratio-mycelium/1.0.0',scope:'DECLARED_TYPED_ROOT_RELATION_VIEW',identity:'ART:A0:MATHEMATICAL_JOINTS',nodes:ROOT_FAMILIES,edges,counts:{nodes:ROOT_FAMILIES.length,edges:edges.length,macro:edges.filter(edge=>edge.domain==='MACRO').length,micro:edges.filter(edge=>edge.domain==='MICRO').length,cross:edges.filter(edge=>edge.domain==='CROSS').length},closestReturnEdgeId:closestReturnEdge.id,status:'PASS_7_ROOTS_21_TYPED_RELATIONS',newCanonicalIds:[],relationChanges:[],claimBoundary:'Finite view over four positive scalar roots and three declared principal quaternion roots. White fibers, slack/tightness and RG band response are normalized display proxies only; they are not forces, material tension, biological mycelium, physical coupling or evidence that a root relation equals the 5:6 carrier return.'};
  }
  function rootFieldConnector(edgeId){
    const network=rootMycelium(),edge=network.edges.find(item=>item.id===edgeId);if(!edge)throw new RangeError('root connector requires a declared root edge');
    if(edge.domain!=='MACRO')return{schema:'a0.spin-to-bloom-root-field-connector/1.0.0',status:'HOLD_NON_SCALAR_EDGE',edgeId,edgeType:edge.type,carrierRatio:null,mappingRule:null,independentCoordinates:['phaseDegrees','frameAngleDegrees'],newCanonicalIds:[],relationChanges:[],claimBoundary:'Micro and cross-domain edges are not converted into scalar carrier frequencies.'};
    const first=ROOT_FAMILIES.find(node=>node.id===edge.firstId),second=ROOT_FAMILIES.find(node=>node.id===edge.secondId),carrierRatio=`${first.radicand}:${second.radicand}`;
    return{schema:'a0.spin-to-bloom-root-field-connector/1.0.0',status:'READY_DECLARED_RADICAND_CARRIER',edgeId,edgeType:edge.type,sourceLabels:edge.labels,rootNormRatio:edge.normRatio,carrierRatio,a:first.radicand,b:second.radicand,mappingRule:'√a ↔ √b → scalar carrier a:b',independentCoordinates:['phaseDegrees','frameAngleDegrees'],newCanonicalIds:[],relationChanges:[],claimBoundary:'This adapter sends the radicands of one selected positive scalar-root pair into the existing integer carrier. It does not identify √(a/b) with a:b, derive phase or frame rotation, or establish physical coupling.'};
  }
  function edelweissBridge(edgeId,input={}){
    const connector=rootFieldConnector(edgeId);
    if(connector.status!=='READY_DECLARED_RADICAND_CARRIER')return{schema:'a0.spin-to-bloom-edelweiss-bridge/1.0.0',status:'HOLD_NON_SCALAR_ROOT_EDGE',edgeId,carrierRatio:null,petalCount:null,whiteDodeca:{faceSlots:12,occupiedSlots:0,fit:'HOLD'},blueBody:{addressCount:48,mapping:'NO_FACE_VERTEX_BIJECTION_DECLARED'},pinkDiamond:{vertexCount:4,role:'RETURN_APERTURE_VIEW'},newCanonicalIds:[],relationChanges:[],claimBoundary:'The Edelweiss display bridge accepts only the declared positive scalar-root carrier adapter.'};
    const parameters=normalize({...input,a:connector.a,b:connector.b}),petalCount=detectTips(parameters).count,faceSlots=12,occupiedSlots=Math.min(faceSlots,petalCount),fit=petalCount===faceSlots?'PASS_EXACT_12_TIP_TO_12_SLOT_DISPLAY':'HOLD_NON_12_SLOT_COUNT';
    return{schema:'a0.spin-to-bloom-edelweiss-bridge/1.0.0',status:fit,scope:'DECLARED_ROOT_FIELD_BLOOM_TO_EXISTING_BODY_DISPLAY_ADAPTER',identity:'ART:A0:MATHEMATICAL_JOINTS',edgeId,sourceLabels:connector.sourceLabels,carrierRatio:connector.carrierRatio,parameters,petalCount,sequence:['ROOT_EDGE','RADICAND_CARRIER','BLUE_BODY_ENVELOPE','WHITE_DODECA_12_SLOT_LENS','PINK_DIAMOND_RETURN_APERTURE','BLOOM_RETURN'],blueBody:{addressCount:48,role:'OUTER_BODY_VIEW',source:'A0_TESSAREC_BLUE_BODY_LAB.html',mapping:'NO_FACE_VERTEX_BIJECTION_DECLARED'},whiteDodeca:{faceSlots,occupiedSlots,fit,source:'A0_BLUE_PINK_DODECA_CELL_RETURN.html'},pinkDiamond:{vertexCount:4,role:'RETURN_APERTURE_VIEW',source:'A0_PINK_DIAMOND_GRID_ATLAS.html#diamond-lens'},independentCoordinates:['phaseDegrees','frameAngleDegrees'],identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],claimBoundary:'Edelweiss is a mnemonic display bridge: the selected macro root edge supplies the existing integer carrier, whose measured radial-tip count is compared with twelve white dodeca face slots. Blue Body, white dodeca and Pink Diamond remain source-bound view layers. Exact 12-to-12 count is not a face-to-tip bijection, gluing rule, topology identity, physical body coupling or new canonical relation.'};
  }
  function dodecaFaceGraph(dodecahedron){
    if(!dodecahedron||!Array.isArray(dodecahedron.faces)||dodecahedron.faces.length!==12)throw new TypeError('declared 12-face dodecahedron geometry required');
    const faces=dodecahedron.faces.map((face,index)=>({id:face.id||`D-${String(index+1).padStart(2,'0')}`,vertices:[...face.vertices]})),adjacency=faces.map(()=>[]);
    for(let left=0;left<faces.length;left+=1)for(let right=left+1;right<faces.length;right+=1){const vertices=new Set(faces[left].vertices),shared=faces[right].vertices.filter(vertex=>vertices.has(vertex)).length;if(shared===2){adjacency[left].push(right);adjacency[right].push(left);}}
    adjacency.forEach(neighbors=>neighbors.sort((a,b)=>a-b));
    const edgeCount=adjacency.reduce((sum,neighbors)=>sum+neighbors.length,0)/2,degreeSequence=adjacency.map(neighbors=>neighbors.length);
    return{schema:'a0.edelweiss-dodeca-face-graph/1.0.0',faces,adjacency,edgeCount,degreeSequence,status:edgeCount===30&&degreeSequence.every(degree=>degree===5)?'PASS_DODECA_FACE_INCIDENCE':'HOLD_INVALID_FACE_INCIDENCE'};
  }
  function hamiltonianFaceCycles(faceGraph){
    const adjacency=faceGraph.adjacency,cycles=new Map(),path=[0],used=new Set(path);
    function canonical(cycle){const reverse=[cycle[0],...cycle.slice(1).reverse()],forward=cycle.join(','),backward=reverse.join(',');return forward<backward?forward:backward;}
    function visit(){
      if(path.length===adjacency.length){if(adjacency[path.at(-1)].includes(path[0])){const cycle=[...path],key=canonical(cycle);if(!cycles.has(key))cycles.set(key,cycle);}return;}
      for(const next of adjacency[path.at(-1)])if(!used.has(next)){used.add(next);path.push(next);visit();path.pop();used.delete(next);}
    }
    visit();
    const values=[...cycles.values()];
    return{anchoredUndirectedCycles:values.length,labeledTipAssignments:values.length*adjacency.length*2,witnesses:values.slice(0,2),allCycles:values};
  }
  function edelweissIncidenceAudit(edgeId,input={},dodecahedron){
    const bridge=edelweissBridge(edgeId,input);
    if(bridge.status!=='PASS_EXACT_12_TIP_TO_12_SLOT_DISPLAY')return{schema:'a0.edelweiss-incidence-audit/1.0.0',status:'HOLD_12_TO_12_COUNT_REQUIRED',disposition:'COUNT_MISMATCH',edgeId,carrierRatio:bridge.carrierRatio,newCanonicalIds:[],relationChanges:[],claimBoundary:'Incidence is not tested until the declared carrier supplies exactly twelve tips.'};
    if(!dodecahedron)return{schema:'a0.edelweiss-incidence-audit/1.0.0',status:'HOLD_SOURCE_GEOMETRY_REQUIRED',disposition:'COUNT_FIT_ONLY',edgeId,carrierRatio:bridge.carrierRatio,newCanonicalIds:[],relationChanges:[],claimBoundary:'The 12-to-12 count alone does not supply ordered dodecahedral face incidence.'};
    const graph=dodecaFaceGraph(dodecahedron),cycles=hamiltonianFaceCycles(graph),tipCycleEdges=12,preservedSlotEdges=cycles.anchoredUndirectedCycles?tipCycleEdges:0,residualSlotEdges=graph.edgeCount-preservedSlotEdges;
    const labelCycle=cycle=>cycle.map((slotIndex,tipIndex)=>({tipId:`TIP_${String(tipIndex+1).padStart(2,'0')}`,slotId:graph.faces[slotIndex].id}));
    const witness=cycles.witnesses[0]?labelCycle(cycles.witnesses[0]):[],alternativeWitness=cycles.witnesses[1]?labelCycle(cycles.witnesses[1]):[];
    return{
      schema:'a0.edelweiss-incidence-audit/1.0.0',status:cycles.anchoredUndirectedCycles>1?'PASS_EXISTENCE_FAIL_UNIQUENESS_COUNT_FIT_ONLY':'HOLD_INCIDENCE_ENUMERATION',disposition:'COUNT_FIT_ONLY',scope:'FINITE_COMBINATORIAL_TIP_CYCLE_TO_DODECA_FACE_GRAPH_AUDIT',edgeId,carrierRatio:bridge.carrierRatio,
      counts:{tips:bridge.petalCount,slots:bridge.whiteDodeca.faceSlots,tipCycleEdges,dodecaFaceEdges:graph.edgeCount,preservedSlotEdges,residualSlotEdges,anchoredUndirectedHamiltonianCycles:cycles.anchoredUndirectedCycles,labeledTipAssignments:cycles.labeledTipAssignments},
      degreeComparison:{tipCycleDegree:2,dodecaFaceDegree:graph.degreeSequence[0],fullIncidenceIsomorphism:false,reason:'C12 is 2-regular; the dodecahedral face-adjacency graph is 5-regular.'},
      tests:{permutationExists:cycles.anchoredUndirectedCycles>0,cyclicAdjacencyPreserved:preservedSlotEdges===tipCycleEdges,uniqueDistinguishedPermutation:cycles.anchoredUndirectedCycles===1,fullIncidencePreserved:false,greyFrameStability:'PASS_COMBINATORIAL_EQUIVARIANT_FAMILY_ONLY',returnStability:'PASS_CYCLE_FAMILY_STABLE_NO_DISTINGUISHED_MAP'},
      witness,alternativeWitness,sourceGeometry:{status:graph.status,faceIds:graph.faces.map(face=>face.id),degreeSequence:graph.degreeSequence},identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],
      claimBoundary:'At least one cyclic tip-to-face assignment exists, but it is not unique. The audit enumerates many equally valid Hamiltonian embeddings and preserves only 12 of 30 dodecahedral face adjacencies. Grey-frame rotation and Return preserve the combinatorial family, not one distinguished physical or topological bijection. The result therefore remains COUNT_FIT_ONLY.'
    };
  }
  function edelweissDegreeDecompositionAudit(edgeId,input={},dodecahedron){
    const incidence=edelweissIncidenceAudit(edgeId,input,dodecahedron);
    if(!dodecahedron||incidence.status!=='PASS_EXISTENCE_FAIL_UNIQUENESS_COUNT_FIT_ONLY')return{schema:'a0.edelweiss-degree-decomposition-audit/1.0.0',status:'HOLD_INCIDENCE_AUDIT_REQUIRED',disposition:'STRUCTURAL_DECOMPOSITION_UNTESTED',edgeId,carrierRatio:incidence.carrierRatio||null,newCanonicalIds:[],relationChanges:[],claimBoundary:'The 2+3 decomposition is not tested without a passing twelve-tip incidence audit and declared source geometry.'};
    const graph=dodecaFaceGraph(dodecahedron),cycles=hamiltonianFaceCycles(graph);
    const edgeKey=(left,right)=>left<right?`${left}:${right}`:`${right}:${left}`;
    const analyses=cycles.allCycles.map(cycle=>{
      const returnEdges=new Set(cycle.map((vertex,index)=>edgeKey(vertex,cycle[(index+1)%cycle.length])));
      const returnDegrees=graph.adjacency.map((neighbors,vertex)=>neighbors.filter(neighbor=>returnEdges.has(edgeKey(vertex,neighbor))).length);
      const residualAdjacency=graph.adjacency.map((neighbors,vertex)=>neighbors.filter(neighbor=>!returnEdges.has(edgeKey(vertex,neighbor))));
      const residualDegrees=residualAdjacency.map(neighbors=>neighbors.length),residualEdges=residualDegrees.reduce((sum,degree)=>sum+degree,0)/2;
      const visited=new Set([0]),queue=[0];while(queue.length)for(const neighbor of residualAdjacency[queue.shift()])if(!visited.has(neighbor)){visited.add(neighbor);queue.push(neighbor);}
      let triangles=0;for(let first=0;first<residualAdjacency.length;first+=1)for(const second of residualAdjacency[first])for(const third of residualAdjacency[second])if(first<second&&second<third&&residualAdjacency[third].includes(first))triangles+=1;
      return{returnDegrees,residualDegrees,residualEdges,residualConnected:visited.size===graph.faces.length,triangles};
    });
    const triangleCounts=analyses.map(analysis=>analysis.triangles),everyCycleHasReturnDegree2=analyses.every(analysis=>analysis.returnDegrees.every(degree=>degree===2)),everyComplementHasResidualDegree3=analyses.every(analysis=>analysis.residualDegrees.every(degree=>degree===3)),everyComplementHas18Edges=analyses.every(analysis=>analysis.residualEdges===18),everyComplementIsConnected=analyses.every(analysis=>analysis.residualConnected);
    const pass=cycles.anchoredUndirectedCycles===1280&&everyCycleHasReturnDegree2&&everyComplementHasResidualDegree3&&everyComplementHas18Edges&&everyComplementIsConnected;
    return{
      schema:'a0.edelweiss-degree-decomposition-audit/1.0.0',status:pass?'PASS_2_PLUS_3_EQUALS_5_FOR_ALL_CYCLES':'HOLD_DECOMPOSITION_COUNTEREXAMPLE',disposition:pass?'STRUCTURAL_DECOMPOSITION_EXACT_ROOT_SEMANTICS_OPEN':'STRUCTURAL_DECOMPOSITION_FAILED',scope:'ALL_ANCHORED_UNDIRECTED_HAMILTONIAN_CYCLES',edgeId,carrierRatio:incidence.carrierRatio,
      counts:{cyclesTested:analyses.length,returnEdges:incidence.counts.preservedSlotEdges,residualEdges:incidence.counts.residualSlotEdges,totalEdges:incidence.counts.dodecaFaceEdges},
      degrees:{returnSpine:2,residualMycelium:3,fullSlotGraph:graph.degreeSequence[0],identity:'2 + 3 = 5'},
      tests:{everyCycleHasReturnDegree2,everyComplementHasResidualDegree3,everyComplementHas18Edges,everyComplementIsConnected},
      residualVariation:{triangleCountRange:[Math.min(...triangleCounts),Math.max(...triangleCounts)],distinguishedResidualGraph:false,reason:'The degree split is invariant, while residual subgraphs vary across valid Hamiltonian cycles.'},
      rootScalarIdentity:{radicands:{returnSpine:2,residualMycelium:3,fullCarrier:5},squaredNormIdentity:2+3===5,notation:'(√2)² + (√3)² = (√5)²',ratioRoot2ToRoot5:Math.sqrt(2/5),ratioNotation:'√2 / √5 = √(2/5)',mappingEstablished:false,status:'EXACT_SCALAR_IDENTITY_ONLY_NO_COUPLING_INFERENCE'},
      identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],
      claimBoundary:'The finite graph audit proves an invariant degree decomposition: every tested Hamiltonian Return spine uses degree 2 and leaves a connected 3-regular, 18-edge residual complement inside the 5-regular dodecahedral face graph. The scalar root identity is exact, but it does not establish that √2, √3 or √5 physically, geometrically or canonically label those graph layers. No distinguished cycle, residual graph or Root-to-network coupling follows.'
    };
  }
  function octaveSuccessorFifthsBridge(){
    const notes=['DO','RE','MI','FA','SOL','LA','SI','DO'];
    const octaveRail=notes.map((note,index)=>{const exponent=7-index,a=6*(2**exponent);return{index,note,exponent,a,operator:index===0?'ANCHOR_6_TIMES_2_POW_7':'HALVE_PREVIOUS',intervalAfter:index===2?'MI_FA':index===6?'SI_DO':null};});
    const successorRail=octaveRail.map(step=>({...step,b:step.a+1,operator:'bₙ = aₙ + 1'}));
    const intervalGaps=[{id:'MI_FA',from:'MI',to:'FA',fromA:192,toA:96,railTransition:'÷2',selectionStatus:'SYMBOLIC_INTERVAL_MARKER_NOT_ARITHMETIC_EXCEPTION'},{id:'SI_DO',from:'SI',to:'DO',fromA:12,toA:6,railTransition:'÷2',selectionStatus:'SYMBOLIC_INTERVAL_MARKER_NOT_ARITHMETIC_EXCEPTION'}];
    const primeIndex=index=>{let count=0,candidate=1;while(count<index){candidate+=1;let prime=candidate>1;for(let divisor=2;divisor*divisor<=candidate&&prime;divisor+=1)if(candidate%divisor===0)prime=false;if(prime)count+=1;}return candidate;};
    const fifthNames=['C','G','D','A','E','B','F♯/G♭','C♯/D♭','G♯/A♭','D♯/E♭','A♯/B♭','F','C′ + COMMA'];
    const fifthSteps=fifthNames.map((name,step)=>{const numerator=3**step,rawDenominator=2**step,octaveFolds=Math.floor(Math.log2(numerator/rawDenominator)),foldedNumerator=numerator,foldedDenominator=rawDenominator*(2**octaveFolds);return{step,name,numerator:foldedNumerator,denominator:foldedDenominator,foldedRatio:foldedNumerator/foldedDenominator,octaveFolds};});
    const commaNumerator=3**12,commaDenominator=2**19,commaRatio=commaNumerator/commaDenominator;
    const exactPins={squareGate:{rail:'b',exponent:2,value:25,identity:'25 = 5²'},primeIndexGate:{fromExponent:2,toExponent:4,index:25,value:primeIndex(25),identity:'p₂₅ = 97 = b₄'},successorPair:{exponent:4,a:96,b:97,identity:'a₄ | b₄ = 96 | 97'}};
    const tests={octaveRailExact:octaveRail.every(step=>step.a===6*(2**step.exponent)),successorRailExact:successorRail.every(step=>step.b===step.a+1),primeIndexClosureExact:primeIndex(25)===97&&successorRail.find(step=>step.exponent===4).b===97,fifthsReturnExact:commaNumerator===commaDenominator,sharedMechanismEstablished:false};
    return{schema:'a0.octave-successor-fifths-bridge/1.0.0',status:'PASS_THREE_TYPED_RAILS_EXACT_RELATIONS_OPEN_COUPLING',scope:'BOUNDED_COMPARISON_OF_DOUBLING_SUCCESSOR_AND_FIFTH_FOLD_OPERATORS',octaveRail,successorRail,intervalGaps,exactPins,fifthsWheel:{operator:'×3/2 · octave fold ×2',steps:fifthSteps,returnResidual:{name:'PYTHAGOREAN_COMMA',numerator:commaNumerator,denominator:commaDenominator,ratio:commaRatio,cents:1200*Math.log2(commaRatio),exactReturn:false}},tests,typedSeparation:{octave:'aₙ = 6·2ⁿ',successor:'bₙ = aₙ + 1',fifths:'rₙ₊₁ = fold₂((3/2)rₙ)',rootBridge:'b₂ = 25 = 5²; this does not define q√5 or a Root-to-tone map',qAndBRootIdentity:false},sourceBinding:{operatorLadder:'42_A0_TESSAREC_OPERATOR_LADDER_PRIME_INDEX_ENGINEERING_CHECK_2026-10-13.md',gurdjieffNumberLabels:'OWNER_SUPPLIED_REFERENCE_IMAGE_INTERPRETED_AS_COMPARISON_CUE_ONLY'},identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],claimBoundary:'The octave rail, successor rail and fifths wheel are three separately typed exact arithmetic views. The a-rail matches the supplied 768-to-6 halving labels and the b-rail contains the existing 25 and 97 pins. The fifths wheel has a nonzero Pythagorean-comma residual. These coincidences do not establish a shared musical, Gurdjieff, physical, Root, q-state or canonical NEXAH mechanism; the two named octave gaps remain symbolic comparison markers until an independent selection rule is frozen and tested.'};
  }
  function stopinderDeflectionBridge(){
    const source=[{note:'DO',frequency:24,absoluteRatio:'1',colorRole:'VIOLET'},{note:'RE',frequency:27,absoluteRatio:'9/8',colorRole:'CORAL'},{note:'MI',frequency:30,absoluteRatio:'5/4',colorRole:'ORANGE'},{note:'FA',frequency:32,absoluteRatio:'4/3',colorRole:'YELLOW'},{note:'SOL',frequency:36,absoluteRatio:'3/2',colorRole:'GREEN'},{note:'LA',frequency:40,absoluteRatio:'5/3',colorRole:'CYAN'},{note:'SI',frequency:45,absoluteRatio:'15/8',colorRole:'BLUE'},{note:'DO′',frequency:48,absoluteRatio:'2',colorRole:'VIOLET'}];
    const base=source[0].frequency,span=source.at(-1).frequency-base,ratioLabels=['9/8','10/9','16/15','9/8','10/9','9/8','16/15'];
    const notes=source.map((item,index)=>({...item,index,linearBandAngleDegrees:(item.frequency-base)/span*360,projection:'LINEAR_FREQUENCY_OFFSET_NOT_LOG_PITCH'}));
    const steps=notes.slice(0,-1).map((item,index)=>{const next=notes[index+1],stopinder=next.frequency-item.frequency;return{index,from:item.note,to:next.note,stopinder,ratio:ratioLabels[index],ratioValue:next.frequency/item.frequency,deflectionDegrees:stopinder/span*360,colorFrom:item.colorRole,colorTo:next.colorRole};});
    const family=ratio=>{const members=steps.filter(step=>step.ratio===ratio);return{ratio,multiplicity:members.length,steps:members.map(step=>`${step.from}→${step.to}`),stopinders:members.map(step=>step.stopinder),deflectionsDegrees:members.map(step=>step.deflectionDegrees)};};
    const ratioProduct=steps.reduce((product,step)=>product*step.ratioValue,1),find=note=>notes.find(item=>item.note===note),pair=(numerator,denominator,ratio)=>({numerator,denominator,frequencies:[find(numerator).frequency,find(denominator).frequency],ratio});
    return{schema:'a0.stopinder-deflection-bridge/1.0.0',status:'PASS_TYPED_FREQUENCY_DIFFERENCE_RATIO_ANGLE_VIEW',scope:'FINITE_OWNER_REFERENCE_TRANSCRIBED_AS_TYPED_COMPARISON_VIEW',notes,steps,ratioFamilies:{'9/8':family('9/8'),'10/9':family('10/9'),'16/15':family('16/15')},exactChecks:{frequencySpan:span,stopinderSum:steps.reduce((sum,step)=>sum+step.stopinder,0),ratioProduct,octaveRatio:notes.at(-1).frequency/base,si:{frequency:find('SI').frequency,absoluteRatio:find('SI').absoluteRatio,linearBandAngleDegrees:find('SI').linearBandAngleDegrees},siToDoDeflectionDegrees:steps.at(-1).deflectionDegrees,linearAngleScaleDegreesPerFrequencyUnit:360/span},pairComparators:{siSol:pair('SI','SOL','5/4'),laMi:pair('LA','MI','4/3'),faLowDo:pair('FA','DO','4/3'),highDoFa:{numerator:'DO′',denominator:'FA',frequencies:[find('DO′').frequency,find('FA').frequency],ratio:'3/2'}},blitzDonner:{blitz:{role:'COLOR_AND_LINEAR_BAND_ANGLE_VIEW'},donner:{role:'FREQUENCY_AND_STOPINDER_DIFFERENCE_VIEW'},workingLabelOnly:true,physicalLatencyMeasured:false},tests:{frequencyRailExact:notes.every((item,index)=>item.frequency===source[index].frequency),stopinderClosureExact:steps.reduce((sum,step)=>sum+step.stopinder,0)===span,ratioClosureExact:Math.abs(ratioProduct-2)<1e-12,linearBandProjectionExact:notes.every(item=>Math.abs(item.linearBandAngleDegrees-(item.frequency-base)/span*360)<1e-12),sharedPhysicalMechanismEstablished:false},sourceBinding:{referenceImage:'OWNER_SUPPLIED_SCREENSHOT_2026-10-29',status:'COMPARISON_CUE_ONLY_NOT_ADMITTED_SOURCE'},identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],claimBoundary:'Frequency, absolute difference, rational ratio, color role and linear band angle are separate typed coordinates. The 45-degree addresses are produced only by the declared linear projection (f-24)/24×360 degrees; they are not equal-temperament pitch angles, physical folds or evidence for a Gurdjieff, Root, graph, lightning-thunder or material mechanism. Blitz and Donner are local dual-view labels only.'};
  }
  function residueLiftWheelBridge(){
    const mod=(value,base)=>((value%base)+base)%base,isPrime=value=>{if(!Number.isInteger(value)||value<2)return false;for(let divisor=2;divisor*divisor<=value;divisor+=1)if(value%divisor===0)return false;return true;};
    const doublingCycle=[1,2,4,8,7,5,1],triadCycle=[3,6,9,3],wheelNodes=Array.from({length:9},(_,index)=>{const label=index===0?9:index;return{label,residue:index,angleDegrees:index*40,cycle:doublingCycle.includes(label)?'DOUBLING_HEXAD':triadCycle.includes(label)?'THREE_SIX_NINE_TRIAD':'ANCHOR'};});
    const liftValues=[7,8,9,10,11],liftOffsets=liftValues.map(value=>value-9),liftResidues=liftValues.map(value=>mod(value,9)),complementPairs=[[4,11],[5,10],[6,9],[7,8]],primeValues=[7,11,29],primeChecks=Object.fromEntries([7,8,9,10,11,15,29,783].map(value=>[value,isPrime(value)]));
    const digitalRoot=value=>value===0?0:1+mod(value-1,9),value783={value:783,factorization:'3³ × 29',factors:[3,3,3,29],digitSum:18,digitalRoot:digitalRoot(783),prime:false};
    return{schema:'a0.residue-lift-wheel-bridge/1.0.0',status:'PASS_FOUR_TYPED_ARITHMETIC_VIEWS_TONE_MAPPING_OPEN',scope:'FINITE_MOD9_LIFT_COMPLEMENT_AND_FACTOR_COMPARISON_VIEW',mod9Wheel:{base:9,squareAnchor:'3² = 9',nodes:wheelNodes,doublingCycle,triadCycle,partitionExact:new Set([...doublingCycle.slice(0,-1),...triadCycle.slice(0,-1)]).size===9},lifts:{anchor:9,values:liftValues,offsets:liftOffsets,residues:liftResidues,identities:['9−2=7','9−1=8','9≡0 (mod 9)','9+1=10≡1','9+2=11≡2']},complement15:{target:15,pairs:complementPairs,allExact:complementPairs.every(([left,right])=>left+right===15)},exactPins:{eightPlusOne:8+1,sixPlusOne:6+1,ninePlusSix:9+6,eightPlusSeven:8+7},numberMagic:{value783,primeValues,primeChecks,workingAddresses:{A1:{value:1,role:'WORKING_ADDRESS'},I9:{value:9,residue:0,role:'WORKING_ADDRESS'},zeroBar15:{notation:'0|15',values:[0,15],role:'WORKING_ADDRESS'},AAPlus:{notation:'AA+',value:783,role:'OWNER_WORKING_LABEL'},toneMappingEstablished:false,primeRuleEstablished:false}},tests:{doublingCycleExact:doublingCycle.slice(0,-1).every((value,index,items)=>items[(index+1)%items.length]===mod(value*2,9)||items[(index+1)%items.length]===9),triadCycleExact:triadCycle.slice(0,-1).every((value,index)=>mod(triadCycle[index+1],9)===mod(value+3,9)),liftResiduesExact:liftValues.every((value,index)=>liftResidues[index]===mod(value,9)),complementsExact:complementPairs.every(([left,right])=>left+right===15),factor783Exact:3**3*29===783,sharedTonePrimeMechanismEstablished:false},sourceBinding:{referenceImage:'OWNER_SUPPLIED_SCREENSHOT_2026-10-29',status:'COMPARISON_CUE_ONLY_NOT_ADMITTED_SOURCE'},identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC','MOD:NUMBER_VIEW_SUITE'],newCanonicalIds:[],relationChanges:[],claimBoundary:'The mod-9 cycles, integer lifts, sum-15 complements and factor/prime checks are separate exact arithmetic views. A1, I9, 0|15, AA+, 783, note names and intermediate-tone language remain local working addresses. No residue-to-frequency map, prime-generation rule, Gurdjieff law, musical derivation, physical beam or canonical NEXAH mechanism is established.'};
  }
  function v12XyGraphTranslator(){
    const stopinder=stopinderDeflectionBridge(),residue=residueLiftWheelBridge(),bankA=residue.mod9Wheel.doublingCycle.slice(0,-1),bankB=[...bankA].reverse();
    const cylinders=[...bankA.map((value,index)=>({id:`A${index+1}`,bank:'A',index:index+1,residue:value,role:'VIEW_SLOT'})),...bankB.map((value,index)=>({id:`B${index+1}`,bank:'B',index:index+1,residue:value,role:'MIRRORED_VIEW_SLOT'}))];
    const elevators=stopinder.notes.map((note,index)=>({id:`E${index+1}`,note:note.note,frequency:note.frequency,railIndex:index,angleDegrees:note.linearBandAngleDegrees,role:'RAIL_TO_RADIAL_ADDRESS_VIEW'}));
    const braces=['9/8','10/9','16/15'].map((ratio,index)=>{const family=stopinder.ratioFamilies[ratio];return{id:`BRACE_${index+1}`,ratio,multiplicity:family.multiplicity,steps:family.steps,role:'RATIO_FAMILY_BRACE_VIEW'};});
    const mWChords=[{id:'CHORD_SI_SOL',notes:['SI','SOL'],ratio:'5/4'},{id:'CHORD_LA_MI',notes:['LA','MI'],ratio:'4/3'},{id:'CHORD_FA_DO',notes:['FA','DO'],ratio:'4/3'},{id:'CHORD_DO_FA',notes:['DO′','FA'],ratio:'3/2'}];
    const exit={note:'RE',frequency:27,angleDegrees:45,role:'EXIT_AXIS_WORKING_VIEW'},returnAxis={note:'DO′',frequency:48,angleDegrees:360,role:'RETURN_AXIS_WORKING_VIEW'};
    const rail={nodes:stopinder.notes.map(note=>({note:note.note,frequency:note.frequency,angleDegrees:note.linearBandAngleDegrees})),arches:stopinder.steps.map(step=>({from:step.from,to:step.to,difference:step.stopinder,ratio:step.ratio,deflectionDegrees:step.deflectionDegrees}))};
    return{schema:'a0.v12-xy-graph-translator/1.0.0',status:'PASS_FIVE_VIEW_PROJECTION_MECHANICAL_METAPHOR_OPEN',scope:'FINITE_RAIL_TO_DUAL_BANK_TO_XY_CHORD_VIEW_TRANSLATOR',viewModes:['RAIL','V12','XY','BRACES','EXIT'],linearRail:rail,v12DualBank:{sourceCycle:bankA,bankA,bankB,cylinders,uniqueResidues:new Set(cylinders.map(item=>item.residue)).size,mirroredDuplication:true,physicalEngineMechanismEstablished:false},xyTranslation:{xAxis:{notes:['DO','DO′'],role:'FREQUENCY_RAIL_SPAN'},yAxis:{notes:['DO/DO′','SOL'],role:'RADIAL_DIAMETER_VIEW'},mWChords,elevators,coordinateIdentityEstablished:false},braces,exitReturn:{exit,return:returnAxis,semanticAxisEstablished:false},tests:{railPreserved:rail.nodes.length===8&&rail.arches.length===7,bankMirrorExact:bankB.every((value,index)=>value===bankA.at(-1-index)),braceCoverageExact:braces.reduce((sum,item)=>sum+item.multiplicity,0)===7,exitAddressExact:exit.frequency===27&&exit.angleDegrees===45,physicalMechanismEstablished:false},sourceBinding:{ownerObservation:'V12 / X-Y / M-W / ELEVATOR / RE EXIT',status:'LOCAL_VIEW_CUE_ONLY_NOT_ADMITTED_SOURCE'},identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC','MOD:NUMBER_VIEW_SUITE'],newCanonicalIds:[],relationChanges:[],claimBoundary:'The dual six-bank, V12, elevator, X/Y, M/W, brace and RE-exit labels are local projection roles over the existing finite residue cycle and Stopinder rail. The twelve cylinders are twelve display slots made by mirroring six residues, not twelve independent arithmetic states or a physical engine. RE at 45 degrees and DO-prime at 360 degrees are exact addresses under the declared linear projection, while Exit and Return remain working semantics. No crankshaft, firing order, mechanical elevator, motor, musical derivation, geometric identity or physical mechanism is established.'};
  }
  function v12CrystalOrientationAdapter(input={}){
    const pair=String(input.pair||'ab').toLowerCase(),allowedPairs=['ab','bc','ca'];if(!allowedPairs.includes(pair))throw new RangeError('pair must be ab, bc or ca');
    const thetaDegrees=finite(Number(input.thetaDegrees??input.theta_degrees??90),'thetaDegrees'),radius=finite(Number(input.radius??0),'radius');if(radius<0||radius>Math.SQRT2+1e-9)throw new RangeError('radius must be between 0 and sqrt(2)');
    const thetaNormalized=((thetaDegrees%360)+360)%360,thetaRadians=radians(thetaNormalized),x=radius*Math.cos(thetaRadians),y=radius*Math.sin(thetaRadians),displayRadiusNormalized=Math.min(1,radius/Math.SQRT2),horizontalRelation=String(input.horizontalRelation??input.horizontal_relation??(Math.abs(y)<1e-9?'ON_H':y>0?'ABOVE_H':'BELOW_H')),verticalRelation=String(input.verticalRelation??input.vertical_relation??(Math.abs(x)<1e-9?'ON_V':x>0?'RIGHT_OF_V':'LEFT_OF_V')),winding=Number(input.winding??-1),direction=String(input.direction||(winding<0?'CW':'CCW'));
    const nodes={ab:['BAND_0.429','BAND_0.456'],bc:['BAND_0.456','BAND_0.487'],ca:['BAND_0.487','BAND_0.429']}[pair],horizontalNode=String(input.horizontalNode??input.horizontal_node??nodes[0]),verticalNode=String(input.verticalNode??input.vertical_node??nodes[1]);
    return{schema:'a0.v12-crystal-orientation-adapter/1.0.0',status:'PASS_TYPED_VIEW_HANDOFF',sourceIdentity:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',targetIdentity:'MOD:TESSAREC',sourceContract:'nexah.a0.breathing-crystal-orientation-ledger/1.0.0',targetContract:'a0.v12-xy-graph-translator/1.0.0',mapping:{pin:{source:'FIXED_RELATION_ORIGIN',target:'V12_RADIAL_CENTER'},horizontalAxis:{source:horizontalNode,target:'V12_X_AXIS'},verticalAxis:{source:verticalNode,target:'V12_Y_AXIS'},currentVector:{thetaDegrees:thetaNormalized,radius,x,y,displayRadiusNormalized,horizontalRelation,verticalRelation,winding,direction},v12Comparators:{exit:{label:'RE · EXIT',angleDegrees:45},return:{label:'DO′ · RETURN',angleDegrees:360}}},pair,identityReuse:['NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],newCanonicalIds:[],relationChanges:[],sourceMutation:false,sharedMechanismEstablished:false,claimBoundary:'This adapter places the existing Breathing Crystal PIN, selected H/X and V/Y band axes, and current orientation vector into the existing V12 radial display coordinates. It does not identify the Crystal vector with RE exit or DO-prime return, alter either source, establish a shared mechanism, add a graph relation, or claim physical coupling.'};
  }
  function translatorOrientationReceipt(mode='REFERENCE'){
    const selected=String(mode||'REFERENCE').toUpperCase(),supportedModes=['REFERENCE','BANK_SWAP','MISSING_RESIDUE','BROKEN_BRACE','RE_PLUS_1'];if(!supportedModes.includes(selected))throw new RangeError(`mode must be one of ${supportedModes.join(', ')}`);
    const translator=v12XyGraphTranslator(),crystal=v12CrystalOrientationAdapter({pair:'ab',thetaDegrees:90,radius:Math.sqrt(3)/2,horizontalRelation:'ABOVE_H',verticalRelation:'ON_V',horizontalNode:'BAND_0.429',verticalNode:'BAND_0.456',winding:-1,direction:'CW'}),bankA=[...translator.v12DualBank.bankA],bankB=[...translator.v12DualBank.bankB],braces=translator.braces.map(item=>({...item})),exit={...translator.exitReturn.exit},returnAxis={...translator.exitReturn.return};
    if(selected==='BANK_SWAP')[bankB[0],bankB[1]]=[bankB[1],bankB[0]];
    if(selected==='MISSING_RESIDUE'){bankA[bankA.length-1]=bankA[bankA.length-2];bankB.splice(0,bankB.length,...bankA.toReversed());}
    if(selected==='BROKEN_BRACE')braces[0].multiplicity-=1;
    if(selected==='RE_PLUS_1')exit.angleDegrees+=1;
    const quadrant=angle=>angle===0?'X_POS':angle===360?'X_POS_RETURN':angle===90?'Y_POS':angle===180?'X_NEG':angle===270?'Y_NEG':angle<90?'Q1':angle<180?'Q2':angle<270?'Q3':'Q4';
    const addresses=translator.linearRail.nodes.map((node,index)=>{const radiansValue=radians(node.angleDegrees),x=Math.cos(radiansValue),y=Math.sin(radiansValue);return{index,note:node.note,frequency:node.frequency,railAngleDegrees:node.angleDegrees,angleDegrees:node.angleDegrees,quadrant:quadrant(node.angleDegrees),x,y,distanceFromPin:Math.hypot(x,y)};});
    const invariant=(id,pass,expected,observed)=>({id,pass:Boolean(pass),expected,observed});
    const invariants=[
      invariant('RAIL_RADIAL_ADDRESS_PRESERVATION',translator.xyTranslation.elevators.every((item,index)=>item.angleDegrees===translator.linearRail.nodes[index].angleDegrees),'8/8 rail angles preserved',`${translator.xyTranslation.elevators.filter((item,index)=>item.angleDegrees===translator.linearRail.nodes[index].angleDegrees).length}/8`),
      invariant('BANK_MIRROR_PARITY',bankB.length===bankA.length&&bankB.every((value,index)=>value===bankA.at(-1-index)),'B = reverse(A)',`${bankA.join('')} ↔ ${bankB.join('')}`),
      invariant('SIX_RESIDUE_COVERAGE',new Set(bankA).size===6&&bankA.length===6,'6 unique residues',`${new Set(bankA).size} unique / ${bankA.length} slots`),
      invariant('THREE_BRACE_COVERAGE',braces.length===3&&braces.reduce((sum,item)=>sum+item.multiplicity,0)===7,'3 families / 7 rail steps',`${braces.length} families / ${braces.reduce((sum,item)=>sum+item.multiplicity,0)} steps`),
      invariant('EXIT_RETURN_EXACT',exit.angleDegrees===45&&returnAxis.angleDegrees===360,'RE 45° / DO′ 360°',`RE ${exit.angleDegrees}° / DO′ ${returnAxis.angleDegrees}°`),
      invariant('CRYSTAL_AXIS_HANDOFF',crystal.mapping.pin.target==='V12_RADIAL_CENTER'&&crystal.mapping.horizontalAxis.target==='V12_X_AXIS'&&crystal.mapping.verticalAxis.target==='V12_Y_AXIS','PIN→center / H→X / V→Y',`${crystal.mapping.pin.target} / ${crystal.mapping.horizontalAxis.target} / ${crystal.mapping.verticalAxis.target}`),
      invariant('PIN_DISTANCE_UNIT',addresses.every(item=>Math.abs(item.distanceFromPin-1)<1e-12),'all radial addresses at r=1',`${addresses.filter(item=>Math.abs(item.distanceFromPin-1)<1e-12).length}/8`)
    ];
    const failed=invariants.filter(item=>!item.pass),reference=selected==='REFERENCE',status=reference&&!failed.length?'PASS_TRANSLATION_ORIENTATION_INVARIANTS':!reference&&failed.length===1?'FAIL_AS_EXPECTED_NEGATIVE_CONTROL':'REVIEW_UNEXPECTED_INVARIANT_PATTERN';
    return{schema:'a0.translator-orientation-receipt/1.0.0',status,mode:selected,supportedModes,scope:'FINITE_TRANSLATOR_AND_TYPED_CRYSTAL_HANDOFF_INVARIANTS',ledger:{pin:{id:'PIN',x:0,y:0,role:'FIXED_RELATION_ORIGIN'},axes:{horizontal:'V12_X_AXIS',vertical:'V12_Y_AXIS'},addresses,horizontalCrossings:addresses.filter(item=>Math.abs(item.y)<1e-12).length,verticalCrossings:addresses.filter(item=>Math.abs(item.x)<1e-12).length,winding:addresses.at(-1).angleDegrees-addresses[0].angleDegrees===360?1:0,crystalVector:crystal.mapping.currentVector},observed:{bankA,bankB,braces,exit,return:returnAxis},invariants,firstLossPoint:failed[0]?.id||null,summary:{passed:invariants.length-failed.length,failed:failed.length,total:invariants.length},identityReuse:['NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC','MOD:NUMBER_VIEW_SUITE'],newCanonicalIds:[],relationChanges:[],claimBoundary:'This finite receipt checks address preservation, mirror parity, residue and brace coverage, exact Exit/Return addresses, the typed Crystal axis handoff and unit PIN distance. Its negative controls demonstrate detection of specific information loss; they do not prove a physical engine, shared mechanism, musical law or universal orientation model.'};
  }
  const RIG_DEFAULTS=Object.freeze({foldDegrees:28,tension:.68,cutDepth:.22,rigPhaseDegrees:0,shadowPhaseDegrees:0,counterRate:.65,aliasDepth:.72});
  function normalizeRigControls(input={}){
    const controls={...RIG_DEFAULTS,...input};
    if(input.lightPhaseDegrees!==undefined&&input.shadowPhaseDegrees===undefined)controls.shadowPhaseDegrees=input.lightPhaseDegrees;
    finite(controls.foldDegrees,'foldDegrees');finite(controls.tension,'tension');finite(controls.cutDepth,'cutDepth');finite(controls.rigPhaseDegrees,'rigPhaseDegrees');finite(controls.shadowPhaseDegrees,'shadowPhaseDegrees');finite(controls.counterRate,'counterRate');finite(controls.aliasDepth,'aliasDepth');
    if(controls.foldDegrees<0||controls.foldDegrees>60)throw new RangeError('foldDegrees must be between 0 and 60');
    if(controls.tension<0||controls.tension>1)throw new RangeError('tension must be between 0 and 1');
    if(controls.cutDepth<0||controls.cutDepth>.48)throw new RangeError('cutDepth must be between 0 and .48');
    if(controls.counterRate<=0||controls.counterRate>2)throw new RangeError('counterRate must be between 0 and 2');
    if(controls.aliasDepth<0||controls.aliasDepth>1.5)throw new RangeError('aliasDepth must be between 0 and 1.5');
    controls.rigPhaseDegrees=((controls.rigPhaseDegrees%360)+360)%360;controls.shadowPhaseDegrees=((controls.shadowPhaseDegrees%360)+360)%360;
    return controls;
  }
  function counterRotationShadowState(progress=0,controlInput={}){
    finite(progress,'progress');if(progress<0||progress>1)throw new RangeError('progress must be between 0 and 1');
    const controls=normalizeRigControls(controlInput),rigAngleRadians=progress*TAU,counterAngleRadians=radians(controls.shadowPhaseDegrees)-controls.counterRate*rigAngleRadians,relativeAngleRadians=counterAngleRadians-rigAngleRadians,apparentAngleRadians=rigAngleRadians+controls.aliasDepth*Math.sin(relativeAngleRadians),apparentVelocity=1-controls.aliasDepth*(1+controls.counterRate)*Math.cos(relativeAngleRadians),direction=Math.abs(apparentVelocity)<.03?'HOLD':apparentVelocity<0?'BACKWARD':'FORWARD';
    return{schema:'a0.spin-to-bloom-counterrotation-shadow-state/1.0.0',progress,rigAngleRadians,counterAngleRadians,relativeAngleRadians,apparentAngleRadians,apparentVelocity,direction,controls,workingLabel:'FUCHSFELGEN_EFFECT'};
  }
  function counterRotationShadowTrace(controlInput={},samples=360){
    integer(samples,'samples',60);const controls=normalizeRigControls(controlInput),states=Array.from({length:samples+1},(_,index)=>counterRotationShadowState(index/samples,controls)),directionSequence=[];
    states.forEach(state=>{if(directionSequence.at(-1)!==state.direction)directionSequence.push(state.direction);});
    return{schema:'a0.spin-to-bloom-counterrotation-shadow-trace/1.0.0',scope:'DECLARED_COUNTERROTATION_PROJECTION_VIEW',controls,states,summary:{directionSequence,backwardSamples:states.filter(state=>state.direction==='BACKWARD').length,holdSamples:states.filter(state=>state.direction==='HOLD').length,forwardSamples:states.filter(state=>state.direction==='FORWARD').length,status:directionSequence.includes('BACKWARD')&&directionSequence.includes('FORWARD')?'PASS_BACKWARD_HOLD_FORWARD_VIEW':'HOLD_NO_APPARENT_REVERSAL'},claimBoundary:'Forward rig rotation, counter-rotating shadow carrier and the resulting apparent shadow phase are kept separate. Apparent reversal is a deterministic projection/alias view; Fuchsfelgen-Effekt is a working label, not a validated physical law, material measurement or recovered historical term.'};
  }
  function membraneRig(input={},controlInput={}){
    const p=normalize(input),controls=normalizeRigControls(controlInput),tips=detectTips(p).tips,fold=radians(controls.foldDegrees),pin={id:'PIN',x:0,y:0,z:.12*Math.sin(fold)},shadow=counterRotationShadowState(controls.rigPhaseDegrees/360,controls);
    const anchors=tips.map((tip,index)=>{
      const angle=Math.atan2(tip.y,tip.x),alternation=index%2===0?1:-1,z=Math.sin(fold)*(controls.tension*.18*Math.sin(angle*2)+alternation*.08*(1-controls.tension));
      return{id:`TIP_${String(index+1).padStart(2,'0')}`,index,x:tip.x,y:tip.y,z,phaseRadians:tip.t,phaseDegrees:degrees(tip.t)};
    });
    const cuts=anchors.map((anchor,index)=>{
      const next=anchors[(index+1)%anchors.length],mid={x:(anchor.x+next.x)/2,y:(anchor.y+next.y)/2,z:(anchor.z+next.z)/2},depth=controls.cutDepth*(.72+.28*Math.sin((index+1)*2.399963229728653));
      return{id:`CUT_${String(index+1).padStart(2,'0')}`,index,x:mid.x*(1-depth),y:mid.y*(1-depth),z:mid.z*(1-controls.cutDepth*.5),depth,between:[anchor.id,next.id]};
    });
    const rods=anchors.map(anchor=>({id:`ROD_${String(anchor.index+1).padStart(2,'0')}`,from:'PIN',to:anchor.id,length:Math.hypot(anchor.x-pin.x,anchor.y-pin.y,anchor.z-pin.z)}));
    const panels=anchors.map((anchor,index)=>({id:`PANEL_${String(index+1).padStart(2,'0')}`,index,vertices:['PIN',anchor.id,cuts[index].id,anchors[(index+1)%anchors.length].id],cutId:cuts[index].id,shimmerPhaseDegrees:(degrees(shadow.apparentAngleRadians)+index*360/anchors.length+720)%360}));
    return{schema:'a0.spin-to-bloom-membrane-rig/1.0.0',scope:'DECLARED_KINEMATIC_VIEW_NOT_CLOTH_SIMULATION',identity:'ART:A0:MATHEMATICAL_JOINTS',parameters:p,controls,shadow,pin,anchors,rods,cuts,panels,counts:{pins:1,rods:rods.length,anchors:anchors.length,cuts:cuts.length,panels:panels.length},claimBoundary:'The rig is a deterministic view adapter over measured Bloom tips. Rods are display constraints, the membrane is interpolated, edge cuts are graphic apertures and shimmer is an optical curvature cue. Rig rotation, counter-rotation and apparent shadow reversal are separate declared view coordinates. No cloth mechanics, load path, stress, material behavior, optical calibration, fabrication tolerance or physical validation is established.'};
  }
  function membraneRigReceipt(input={},controls={}){
    const rig=membraneRig(input,controls),finiteGeometry=[rig.pin,...rig.anchors,...rig.cuts].every(point=>['x','y','z'].every(key=>Number.isFinite(point[key]))),matched=rig.counts.rods===rig.counts.anchors&&rig.counts.cuts===rig.counts.anchors&&rig.counts.panels===rig.counts.anchors;
    return{schema:'a0.spin-to-bloom-membrane-rig-receipt/1.0.0',status:finiteGeometry&&matched?'PASS_BOUNDED_KINEMATIC_VIEW_MATERIAL_HOLD':'HOLD_RIG_CONTRACT',identityReuse:['ART:A0:MATHEMATICAL_JOINTS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'],rig,newCanonicalIds:[],relationChanges:[],materialState:'HOLD_NOT_SIMULATED',fabricationState:'HOLD_NOT_RELEASED',claimBoundary:rig.claimBoundary};
  }
  const CONTROL_CASES=Object.freeze([{id:'EQUAL_5_5',a:5,b:5},{id:'NON_COPRIME_4_6',a:4,b:6},{id:'RETURN_5_6',a:5,b:6},{id:'COMPARATOR_5_7',a:5,b:7},{id:'NEIGHBOR_6_7',a:6,b:7}]);
  function controlMatrix(cases=CONTROL_CASES,input={}){
    if(!Array.isArray(cases)||cases.length===0)throw new TypeError('control cases must be a non-empty array');
    const base=normalize(input),rows=cases.map((entry,index)=>{const parameters={...base,...entry},tips=detectTips(parameters),events=tipEvents(parameters),sweep=phaseSweep(parameters);return{id:entry.id||`CASE_${index+1}`,a:parameters.a,b:parameters.b,gcd:gcd(parameters.a,parameters.b),sumFrequency:parameters.a+parameters.b,differenceFrequency:Math.abs(parameters.a-parameters.b),observedTips:tips.count,countMatchesSumFrequency:tips.count===parameters.a+parameters.b,eventCount:events.count,addressSlots:tips.count**2,phaseSweepCounts:sweep.counts,stableAcrossDeclaredSweep:sweep.stable,bloomClosureError:closureError(parameters,'bloom')};});
    return{schema:'a0.spin-to-bloom-control-matrix/1.0.0',status:rows.every(row=>row.countMatchesSumFrequency&&row.stableAcrossDeclaredSweep&&row.eventCount===row.observedTips&&row.bloomClosureError<1e-12)?'PASS_DECLARED_CONTROLS':'REVIEW_DECLARED_CONTROLS',parameters:{phaseDegrees:base.phaseDegrees,stepDegrees:base.stepDegrees,layers:base.layers,gain:base.gain,samples:base.samples},rows,claimBoundary:'Finite declared synthetic control matrix only; rows do not establish a universal law or physical coupling.'};
  }
  function receipt(input={}){
    const p=normalize(input),tips=detectTips(p),events=tipEvents(p),sweep=phaseSweep(p),orbitClosure=closureError(p,'orbit'),bloomClosure=closureError(p,'bloom'),wiggleReturn=wiggleReturnTrace(p),greyRotation=greyRotationState(p),regimeAtlas=lissajousRegimeAtlas(),rootNetwork=rootMycelium(),edelweiss=edelweissBridge(rootNetwork.closestReturnEdgeId,p);
    return{schema:'a0.spin-to-bloom-measurement-receipt/1.7.0',status:'PASS_BOUNDED_VIEW_MEASUREMENT',identity:'ART:A0:MATHEMATICAL_JOINTS',parameters:p,transform:{carrier:'u=sin(a*t); v=sin(b*t+delta)',spin:'r=1+gain*u*v; x=r*cos(t); y=r*sin(t)',productToSum:'sin(A)sin(B)=0.5[cos(A-B)-cos(A+B)]'},measurement:{tipCount:tips.count,pairCount:tips.count,addressSlots:tips.count**2,expectedSumFrequency:p.a+p.b,countMatchesSumFrequency:tips.count===p.a+p.b,countsAcrossPhaseSweep:sweep.counts,stableAcrossDeclaredSweep:sweep.stable,orbitClosureError:orbitClosure,bloomClosureError:bloomClosure,eventSummary:{schema:events.schema,count:events.count,pairNotation:'Y:Z',orientationScope:events.orientationScope},tipEvents:events.events,envelopeObservables:envelopeObservables(p),greyRotation:greyRotation.nullComparison,regimeAtlas:{status:regimeAtlas.status,cells:regimeAtlas.cells.length},rootMycelium:{status:rootNetwork.status,nodes:rootNetwork.counts.nodes,edges:rootNetwork.counts.edges,closestReturnEdgeId:rootNetwork.closestReturnEdgeId,defaultFieldConnector:rootFieldConnector(rootNetwork.closestReturnEdgeId)},edelweissBridge:{status:edelweiss.status,carrierRatio:edelweiss.carrierRatio,petalCount:edelweiss.petalCount,faceSlots:edelweiss.whiteDodeca.faceSlots},wiggleReturn:wiggleReturn.summary},workingRoles:{tipLeftFlank:'Y / GRIP',tipRightFlank:'Z / DIVOT',pairNotation:':',innerEnvelope:'BLACK SUN / NEGATIVE SPACE',outerBoundary:'EDGE',phaseMidline:'GREY STAR / MIDLINE',adjacentLayerGap:'GREEN-PINK STRIP',rotatingFrame:'GREY ROTATION / OBSERVATION FRAME',regimeAtlas:'DOMAIN ROW × PHASE REGIME COLUMN',rootNetwork:'TYPED ROOT-RATIO MYCELIUM VIEW',rootFiber:'WHITE DISPLAY RELATION',rootTension:'NORMALIZED SLACK/TIGHTNESS PROXY',rootFieldConnector:'DECLARED RADICAND-TO-CARRIER VIEW-STATE ADAPTER',edelweissBridge:'BLUE BODY / WHITE DODECA / PINK DIAMOND DISPLAY ADAPTER',wiggleCenterline:'DECLARED RETURN CENTERLINE',wiggleEnvelope:'DECLARED DECAY ENVELOPE',capturePoint:'FIRST ENVELOPE CROSSING OF DECLARED CORRIDOR'},sourceReuse:['THREE_SIGNAL_CARRIER','ART:A0:MATHEMATICAL_JOINTS','MOD:TESSAREC'],claimBoundary:'Deterministic synthetic signal view, sampled radial-tip count, coherent display-frame rotation, finite 3-by-3 Lissajous domain/regime comparator, typed seven-root relation view with a declared macro-radicand carrier adapter, bounded Edelweiss display bridge, derived local phase-sweep envelope and declared wiggle-return diagnostic only. FIELD is a coherent interference preview, not stochastic noise. The connector maps √a↔√b to the existing integer carrier a:b without identifying the two or deriving phase/frame rotation. The Edelweiss bridge compares the resulting tip count with twelve dodeca face slots; it does not infer a face-to-tip bijection, topology or physical coupling. Black Sun, Grey Star, edge, strip, root fibers, slack/tightness, bundle and capture are working view labels; they do not establish physical coupling, natural modes, material tension, biological mycelium, material damping, a universal flower law, topology or orientation outside the local view, a new operator, a new Study or publication authority.'};
  }
  return{TAU,DEFAULTS,RIG_DEFAULTS,WIGGLE_DEFAULTS,GREY_ROTATION_DEFAULTS,REGIME_DOMAINS,REGIME_PHASES,ROOT_FAMILIES,CONTROL_CASES,LAMELLA_VARIANTS,normalize,carrier,orbitPoint,bloomPoint,closureError,detectTips,tipEvents,envelopeTrace,envelopeObservables,phaseSweep,normalizeAxisDegrees,axisDistance,vmFlipDegrees,lamellaPlanes,lamellaCrosswalk,lamellaBenchState,advanceLamellaBench,lamellaReturnReceipt,normalizeWiggleControls,wiggleReturnTrace,normalizeGreyRotationControls,greyRotationState,lissajousRegimeAtlas,rationalApproximation,rootRelation,rootMycelium,rootFieldConnector,edelweissBridge,dodecaFaceGraph,hamiltonianFaceCycles,edelweissIncidenceAudit,edelweissDegreeDecompositionAudit,octaveSuccessorFifthsBridge,stopinderDeflectionBridge,residueLiftWheelBridge,v12XyGraphTranslator,v12CrystalOrientationAdapter,translatorOrientationReceipt,normalizeRigControls,counterRotationShadowState,counterRotationShadowTrace,membraneRig,membraneRigReceipt,controlMatrix,receipt};
});
