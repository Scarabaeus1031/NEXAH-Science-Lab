(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0CoupledChannelBoundary=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.8.0';
  const SCHEMA='nexah.a0.coupled-channel-boundary-lens/1';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const PHASES=Object.freeze(['APPROACH','FIT','CONTACT','TRANSFER','RELEASE','RETURN']);
  const PAINTER_MODES=Object.freeze(['BOUNDARY_BAND','ESCAPE_TIME','SOURCE_ROLES','RESIDUAL']);
  const MIX_VIEWS=Object.freeze(['OVERLAP_3X3','CLUB_RING','SHIFT_NODES','AM_VM_PM']);
  const OBSERVER_VIEWS=Object.freeze(['NEWTON','LEIBNIZ','GOETHE']);
  const DEFAULT_STATE=Object.freeze({
    phaseIndex:0,
    maskPosition:0,
    cRe:-0.1087,
    cIm:0,
    iterations:120,
    painterMode:'BOUNDARY_BAND',
    painterMix:0.62,
    latexOverlay:false,
    outerRotation:0,
    speedScale:1,
    shutterAperture:.58,
    shutterAuto:true,
    mixView:'OVERLAP_3X3',
    observerView:'NEWTON',
    ratio:'2:3'
  });

  const clone=value=>JSON.parse(JSON.stringify(value));
  const finite=(value,label)=>{if(!Number.isFinite(value))throw new TypeError(`${label} must be finite`);return value};
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function validate(input=DEFAULT_STATE){
    const state={...DEFAULT_STATE,...input};
    if(!Number.isInteger(state.phaseIndex)||state.phaseIndex<0||state.phaseIndex>=PHASES.length)throw new RangeError('phaseIndex outside coupled-channel sequence');
    finite(state.maskPosition,'maskPosition');
    finite(state.cRe,'cRe');
    finite(state.cIm,'cIm');
    finite(state.iterations,'iterations');
    finite(state.painterMix,'painterMix');
    finite(state.outerRotation,'outerRotation');
    finite(state.speedScale,'speedScale');
    finite(state.shutterAperture,'shutterAperture');
    if(!Number.isInteger(state.iterations)||state.iterations<20||state.iterations>1000)throw new RangeError('iterations outside finite observation budget');
    if(!PAINTER_MODES.includes(state.painterMode))throw new RangeError('unknown painterMode');
    if(!MIX_VIEWS.includes(state.mixView))throw new RangeError('unknown mixView');
    if(!OBSERVER_VIEWS.includes(state.observerView))throw new RangeError('unknown observerView');
    if(!['2:3','3:2'].includes(state.ratio))throw new RangeError('ratio must remain a declared display ratio');
    if(typeof state.latexOverlay!=='boolean')throw new TypeError('latexOverlay must be boolean');
    if(typeof state.shutterAuto!=='boolean')throw new TypeError('shutterAuto must be boolean');
    return Object.freeze({
      ...state,
      maskPosition:clamp(state.maskPosition,-1,1),
      painterMix:clamp(state.painterMix,0,1),
      outerRotation:clamp(state.outerRotation,-45,45),
      speedScale:clamp(state.speedScale,.25,2),
      shutterAperture:clamp(state.shutterAperture,0,1)
    });
  }

  function criticalOrbit(re,im,maxIterations){
    finite(re,'re');finite(im,'im');
    if(!Number.isInteger(maxIterations)||maxIterations<1)throw new RangeError('maxIterations must be a positive integer');
    let zr=0,zi=0;const points=[[0,0]];
    for(let step=1;step<=maxIterations;step+=1){
      const next=zr*zr-zi*zi+re;
      zi=2*zr*zi+im;zr=next;points.push([zr,zi]);
      if(zr*zr+zi*zi>4)return Object.freeze({escaped:true,escapeIteration:step,points,last:[zr,zi]});
    }
    return Object.freeze({escaped:false,escapeIteration:null,points,last:[zr,zi]});
  }

  function dynamicalBoundary(re,im,maxIterations){
    const orbit=criticalOrbit(re,im,maxIterations),eps=1e-12;
    if(Math.abs(re+0.1087)<eps&&Math.abs(im)<eps)return Object.freeze({namespace:'DYNAMICAL_CLASS',code:'EXACT_INTERIOR',label:'main-cardioid interior',orbit});
    if(Math.abs(re+0.75)<eps&&Math.abs(im)<eps)return Object.freeze({namespace:'DYNAMICAL_CLASS',code:'EXACT_BOUNDARY',label:'period-doubling boundary',orbit});
    if(Math.abs(re-0.26)<eps&&Math.abs(im)<eps)return Object.freeze({namespace:'DYNAMICAL_CLASS',code:'EXACT_EXTERIOR',label:'exterior / escaped',orbit});
    return Object.freeze({namespace:'DYNAMICAL_CLASS',code:orbit.escaped?'FINITE_ESCAPE':'BOUNDED_AT_N',label:orbit.escaped?`escaped at ${orbit.escapeIteration}`:`bounded through ${maxIterations}`,orbit});
  }

  function geometricSide(position){
    finite(position,'position');
    const p=clamp(position,-1,1),eps=1e-9;
    return Object.freeze({namespace:'GEOMETRIC_SIDE',code:Math.abs(p)<=eps?'MEMBRANE':p<0?'INSIDE':'OUTSIDE',coordinate:p});
  }

  function returnRole(phaseIndex){
    if(!Number.isInteger(phaseIndex)||phaseIndex<0||phaseIndex>=PHASES.length)throw new RangeError('phaseIndex outside sequence');
    const phase=PHASES[phaseIndex];
    return Object.freeze({namespace:'RETURN_ROLE',code:phase==='RETURN'?'RETURN':phaseIndex<2?'SOURCE':'CHANNEL',phase});
  }

  function snapshot(input=DEFAULT_STATE){
    const state=validate(input),dynamical=dynamicalBoundary(state.cRe,state.cIm,state.iterations),geometric=geometricSide(state.maskPosition),route=returnRole(state.phaseIndex);
    return Object.freeze({
      schema:SCHEMA,
      version:VERSION,
      identity:IDENTITY,
      classification:'SOURCE_BOUND_ENGINEERING_AND_EXHIBITION_LENS_NOT_SCIENCE_RUN',
      state,
      geometry:Object.freeze({
        outerBodies:Object.freeze([
          Object.freeze({id:'LEFT_RED_7_FORM',displayName:'B17_CAP',role:'SOURCE_BODY',motionDirection:'COUNTERCLOCKWISE',mirrorIdentity:false}),
          Object.freeze({id:'RIGHT_BLUE_7_FORM',displayName:'A18_DOME',role:'RETURN_BODY',motionDirection:'CLOCKWISE',mirrorIdentity:false})
        ]),
        pentagonAnchors:Object.freeze({count:2,role:'LOCAL_ORDER_FRAMES',carrierIdentity:false}),
        aperture:Object.freeze({id:'PINK_STRIP_ZIPPER',transversalPlanes:2,role:'FINITE_MASK_AND_HANDOFF_VIEW',touchPoint:Object.freeze({id:'COIL_TOUCH_POINT',activationPhase:'CONTACT',transferPhase:'TRANSFER',addressMutation:false,physicalContactClaim:false})}),
        motion:Object.freeze({ratio:state.ratio,phase:PHASES[state.phaseIndex],counterRotation:true,totalAngleDegrees:2040,durationSeconds:20,baseSpeedDegreesPerSecond:102,speedScale:state.speedScale,generationSamples:20,elevators:3,pivotGlyph:'°',sharedFrameBinding:Object.freeze({event:'a0-lissajous-frame',receiveOnly:true,sharedNumericalClock:true,signals:Object.freeze(['s1','s2','s3']),fallback:'LOCAL_20_SECOND_DISPLAY_CLOCK',sourceMutation:false,crossTab:false}),shutter:Object.freeze({blades:6,bladePairs:3,mode:state.shutterAuto?'INVERSE_CUCKOO_AUTO':'MANUAL',aperture:state.shutterAperture,physicalMechanism:false}),pulseBinding:Object.freeze({schema:'nexah.a0.pulse-grammar-clock-view/1',channel:'nexah-a0-pulse-grammar-clock-v1',transition:'STILL / PINK DOT',receiveOnly:true,sharedNumericalClock:false,fallback:'LOCAL_20_SECOND_DISPLAY_CLOCK'}),colourPulseDock:Object.freeze({grammar:'CMY_PLUS_K_VIEW_ONLY',carrier:'C_CYAN_BLUE_BODY',dancePartners:Object.freeze(['Y_YELLOW_SEAM','M_MAGENTA_ZIPPER']),key:'K_MASK_SHUTTER_NOT_FOURTH_STATE',wheels:Object.freeze(['Y','M','K']),chromaticStateCount:3,physicalColourModel:false,identicalToScienceLabCBPI:false}),mixingField:Object.freeze({layout:'THREE_BY_THREE_CIRCLE_OVERLAP_VIEW',activeView:state.mixView,views:MIX_VIEWS,perspectiveTriad:Object.freeze([{id:'AM',pair:'S1_S2',role:'ACTIVE_MEANING',colour:'GOLD'},{id:'VM',pair:'S2_S3',role:'VISIONARY_EMERGENCE',colour:'CYAN'},{id:'PM',pair:'S3_S1',role:'PRAGMATIC_MANIFESTATION',colour:'PINK'}]),perspectivesShareSourceTime:true,perspectiveIdentityMerge:false,circleCount:9,shiftStations:24,shiftOffsets:Object.freeze({C:0,Y:8,M:16}),outerBelt:'LOCAL_DISPLAY_SHIFT_RING',sharedShiftState:true,keyRole:'K_MODULATES_BELT_APERTURE_ONLY',intersectionStateCount:null,addressMutation:false,sourceStateMutation:false,flowerOfLifeOperator:false,physicalColourMixing:false}),observerTriad:Object.freeze({ownerViewId:'A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS',ownerSurface:'A0_NEWTON_GOETHE_OBSERVER_LENS.html#lens',activeView:state.observerView,views:OBSERVER_VIEWS,modes:Object.freeze([{id:'NEWTON',role:'SPECTRAL_DECOMPOSITION',display:'WHITE_INPUT_TO_7_ORDERED_BANDS'},{id:'LEIBNIZ',role:'RELATIONAL_ORDER',display:'A_NOT_B_AND_I_NOT_O'},{id:'GOETHE',role:'BOUNDARY_APPEARANCE',display:'LIGHT_DARK_BOUNDARY_TO_APPEARANCE'}]),sharedObserverPivot:true,identicalToAmVmPm:false,remoteControlOwner:false,newGraphRelation:false,calibratedOptics:false,historicalEquivalence:false}),schlieren:'FINITE_DISPLAY_TRAIL',physicalMechanism:false})
      }),
      addressLenses:Object.freeze({
        crt16:Object.freeze({channels:16,modulusStart:17,display:'15_PLUS_1',role:'ADDRESS_VIEW',identicalToOuter7Forms:false}),
        cockpit1619:Object.freeze({stations:Object.freeze([16,17,18,19]),still:'XX/20',role:'COCKPIT_VIEW',identicalToPentagonAnchors:false}),
        double18:Object.freeze({floor17:'7+10',lift19:'8+11',diagonals18:Object.freeze(['7+11','8+10']),role:'DOCUMENTARY_ARITHMETIC_VIEW'})
      }),
      boundaries:Object.freeze({geometric,dynamical,route,collapsed:false}),
      coupledParameter:Object.freeze({parameter:'c',value:Object.freeze([state.cRe,state.cIm]),sharedBy:Object.freeze(['MANDELBROT_PARAMETER_PLANE','JULIA_DYNAMICAL_PLANE']),sharedByOtherModules:false}),
      painter:Object.freeze({mode:state.painterMode,mix:state.painterMix,mutatesSources:false}),
      latex:Object.freeze({enabled:state.latexOverlay,source:'assets/a0-coupled-channel-boundary-overlay-v1.tex',runtime:'OPTIONAL_DOCKED_SOURCE_DRAWER_WITH_ACCESSIBLE_FALLBACK_NO_EXTERNAL_TYPESETTER'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newGraphRelation:false,newCarrier:false,newOperator:false,claimPromotion:false,physicalMechanism:false,publicationAuthorized:false}),
      boundary:'One read-only coupling lens over existing A0 sources. Shared c couples Mandelbrot and Julia only. Geometric side, dynamical class and return role remain separate namespaces. Visual similarity creates no carrier, operator, mechanism or identity.'
    });
  }

  function createState(overrides={}){return validate({...DEFAULT_STATE,...overrides})}
  function update(state,patch){return validate({...validate(state),...patch})}
  function step(state=DEFAULT_STATE){const current=validate(state);return update(current,{phaseIndex:Math.min(current.phaseIndex+1,PHASES.length-1)})}
  function reset(){return createState()}
  function capture(state=DEFAULT_STATE){return Object.freeze({schema:`${SCHEMA}.return/1`,captured:snapshot(state),returnType:'SAVED_VIEW_STATE_NOT_PHYSICAL_INVERSE'})}
  function restore(record){
    if(!record||record.schema!==`${SCHEMA}.return/1`||!record.captured||record.captured.schema!==SCHEMA)throw new Error('invalid coupled-channel return record');
    return createState(record.captured.state);
  }
  function verifyReturn(record){
    try{
      const restored=restore(record),recaptured=capture(restored);
      return Object.freeze({status:JSON.stringify(recaptured.captured.state)===JSON.stringify(record.captured.state)?'PASS':'FAIL',restored,wholeMachineReturn:false});
    }catch(error){return Object.freeze({status:'FAIL',error:error.message,wholeMachineReturn:false})}
  }

  return Object.freeze({VERSION,SCHEMA,IDENTITY,PHASES,PAINTER_MODES,MIX_VIEWS,OBSERVER_VIEWS,DEFAULT_STATE,validate,criticalOrbit,dynamicalBoundary,geometricSide,returnRole,snapshot,createState,update,step,reset,capture,restore,verifyReturn,clone});
});
