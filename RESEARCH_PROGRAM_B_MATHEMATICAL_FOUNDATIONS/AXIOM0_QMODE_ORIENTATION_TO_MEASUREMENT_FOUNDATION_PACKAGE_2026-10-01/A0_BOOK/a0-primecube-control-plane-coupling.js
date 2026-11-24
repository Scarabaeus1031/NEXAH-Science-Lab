(function(root,factory){
  const api=factory(
    typeof module==='object'&&module.exports?require('./a0-primecube-model.js'):root.A0PrimecubeModel,
    typeof module==='object'&&module.exports?require('./a0-loki-tessarec-pipe.js'):root.A0LokiTessarecPipe,
    typeof module==='object'&&module.exports?require('./a0-primecube-control-plane-baseline.js'):root.A0PrimecubeControlPlaneBaseline
  );
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeControlPlaneCoupling=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Primecube,Loki,Baseline){
  'use strict';
  if(!Primecube||!Loki)throw Error('Primecube and LOKI coupling dependencies are required');

  const VERSION='1.10.0';
  const Q=1001;
  const Q_PERIOD=60;
  const LOKI_PERIOD=56;
  const FOLD_PERIOD=2;
  const JOINT_PERIOD=840;
  const UNIT_WINDOW=720;
  const WINDOW_JOINT_RETURN=5040;
  const ANCHORS=Object.freeze([1,8,11,22,27,33]);
  const FOLD_MAP=Object.freeze({1:11,8:8,11:1,22:33,27:27,33:22});
  const ADAPTER_STRIDE=10;
  const ADAPTER_GENERATOR=Primecube.modularPower(20,ADAPTER_STRIDE,Q);
  const ADAPTER_INVERSE_GENERATOR=Primecube.modularPower(20,Q_PERIOD-ADAPTER_STRIDE,Q);
  const mod=(n,m)=>((n%m)+m)%m;
  const lcm=(a,b)=>a/Primecube.gcd(a,b)*b;

  function jointState(step){
    if(!Number.isInteger(step)||step<0)throw new RangeError('step must be a non-negative integer');
    const q=Primecube.modularPower(20,step,Q),loki=Loki.state(step),fold=step%2,mz24=Primecube.mz24CompassRecord(q);
    return Object.freeze({step,q,loki:Object.freeze({station:loki.station,orientation:loki.orientation}),fold,mz24:Object.freeze({tick:mz24.tick,angleDegrees:mz24.angleDegrees})});
  }

  function coupledReturnRecord(){
    const states=Object.freeze(Array.from({length:JOINT_PERIOD+1},(_,step)=>jointState(step)));
    const key=state=>`${state.q}:${state.loki.station}:${state.loki.orientation}:${state.fold}`;
    const jointReturns=states.filter(state=>state.step>0&&key(state)===key(states[0])).map(state=>state.step);
    const mz24Counts=Object.freeze(Object.fromEntries(Array.from({length:24},(_,tick)=>[tick,states.slice(0,-1).filter(state=>state.mz24.tick===tick).length])));
    return Object.freeze({
      name:'Q60_LOKI56_FOLD2_COUPLED_RETURN',periods:Object.freeze([Q_PERIOD,LOKI_PERIOD,FOLD_PERIOD]),leastCommonMultiple:lcm(lcm(Q_PERIOD,LOKI_PERIOD),FOLD_PERIOD),
      start:states[0],end:states.at(-1),firstJointReturn:jointReturns[0]||null,jointReturns:Object.freeze(jointReturns),
      uniqueJointStates:new Set(states.slice(0,-1).map(key)).size,states,mz24Counts,
      status:'EXACT_SYNCHRONIZED_PRODUCT_RETURN',
      boundary:'The 840-step return is the least common multiple of three retained independent periods. It does not establish a shared natural clock, common carrier, physical coupling or causal mechanism.'
    });
  }

  function adapterRecord(direction='FORWARD'){
    if(!['FORWARD','REVERSE'].includes(direction))throw new RangeError('direction must be FORWARD or REVERSE');
    const generator=direction==='FORWARD'?ADAPTER_GENERATOR:ADAPTER_INVERSE_GENERATOR;
    const orderedAnchors=direction==='FORWARD'?ANCHORS: Object.freeze([ANCHORS[0],...ANCHORS.slice(1).reverse()]);
    const entries=Object.freeze(orderedAnchors.map((anchor,index)=>{
      const q=Primecube.modularPower(generator,index,Q),mz24=Primecube.mz24CompassRecord(q);
      return Object.freeze({index,anchor,q,mz24:Object.freeze({tick:mz24.tick,angleDegrees:mz24.angleDegrees})});
    }));
    const anchorToEntry=new Map(entries.map(entry=>[entry.anchor,entry]));
    const qToEntry=new Map(entries.map(entry=>[entry.q,entry]));
    const rotateAnchor=anchor=>{
      const entry=anchorToEntry.get(anchor);if(!entry)throw new RangeError('anchor is outside the Splinter C6 boundary');
      return entries[(entry.index+1)%entries.length].anchor;
    };
    const inverseRotateAnchor=anchor=>{
      const entry=anchorToEntry.get(anchor);if(!entry)throw new RangeError('anchor is outside the Splinter C6 boundary');
      return entries[mod(entry.index-1,entries.length)].anchor;
    };
    const reflectAnchor=anchor=>{
      if(!Object.hasOwn(FOLD_MAP,anchor))throw new RangeError('anchor is outside the Splinter fold map');
      return FOLD_MAP[anchor];
    };
    const reflectQ=q=>{
      const entry=qToEntry.get(q);if(!entry)throw new RangeError('q is outside the six-state adapter subgroup');
      const anchor=reflectAnchor(entry.anchor),target=anchorToEntry.get(anchor);
      return target.q;
    };
    const edges=Object.freeze(entries.map((entry,index)=>{
      const target=entries[(index+1)%entries.length],deltaTick=mod(target.mz24.tick-entry.mz24.tick,24);
      return Object.freeze({sourceAnchor:entry.anchor,targetAnchor:target.anchor,sourceQ:entry.q,targetQ:target.q,sourceTick:entry.mz24.tick,targetTick:target.mz24.tick,deltaTick});
    }));
    const foldChecks=Object.freeze(entries.map(entry=>{
      const foldedAnchor=reflectAnchor(entry.anchor),foldedQ=anchorToEntry.get(foldedAnchor).q;
      return Object.freeze({anchor:entry.anchor,foldedAnchor,q:entry.q,foldedQ,adapterReflectionQ:reflectQ(entry.q),preserved:foldedQ===reflectQ(entry.q)});
    }));
    const dihedralChecks=Object.freeze(entries.map(entry=>Object.freeze({
      anchor:entry.anchor,
      left:reflectAnchor(rotateAnchor(reflectAnchor(entry.anchor))),
      right:inverseRotateAnchor(entry.anchor),
      preserved:reflectAnchor(rotateAnchor(reflectAnchor(entry.anchor)))===inverseRotateAnchor(entry.anchor)
    })));
    const orderSixStrides=Object.freeze(Array.from({length:Q_PERIOD-1},(_,index)=>index+1).filter(stride=>Primecube.multiplicativeOrder(Primecube.modularPower(20,stride,Q),Q)===6));
    return Object.freeze({
      name:'SPLINTER_C6_TO_Q_T20_STRIDE10_ADAPTER',direction,anchors:orderedAnchors,generator,generatorOrder:Primecube.multiplicativeOrder(generator,Q),entries,edges,
      laws:Object.freeze({rotation:'A(R(a)) = g·A(a) mod 1001',foldIndex:'F(i)=2−i mod 6 in the forward boundary order',dihedral:'F R F = R^−1'}),
      closure:Object.freeze({injective:new Set(entries.map(entry=>entry.q)).size===6,returnAfter:6,lastToFirst:mod(entries.at(-1).q*generator,Q)===entries[0].q}),
      fold:Object.freeze({map:FOLD_MAP,checks:foldChecks,allPreserved:foldChecks.every(check=>check.preserved),fixedAnchors:Object.freeze(entries.filter(entry=>reflectAnchor(entry.anchor)===entry.anchor).map(entry=>entry.anchor)),dihedralChecks,dihedralPreserved:dihedralChecks.every(check=>check.preserved)}),
      phase:Object.freeze({ticks:Object.freeze(entries.map(entry=>entry.mz24.tick)),deltaTicks:Object.freeze(edges.map(edge=>edge.deltaTick)),uniformDelta:new Set(edges.map(edge=>edge.deltaTick)).size===1,returnSumMod24:mod(edges.reduce((sum,edge)=>sum+edge.deltaTick,0),24)}),
      alternatives:Object.freeze({orderSixStrides,minimalPositiveStrideWithOrder6:orderSixStrides[0],reverseStrideWithOrder6:orderSixStrides.at(-1),orientationUnique:orderSixStrides.length===1}),
      status:'PASS_TYPED_C6_ADAPTER_WITH_PHASE_NONINVARIANCE',
      boundary:'The adapter is a declared six-state sampling of the existing 60-cycle using T20^10. The C6 boundary order and Q identity basepoint select the alignment; forward and reverse orientations remain two valid choices. This is not a natural identity of the Splinter anchors with CRT residues.'
    });
  }

  function colonPhaseLineProbe(){
    const adapter=adapterRecord('FORWARD');
    const qStateLine=Object.freeze({
      sourcePort:'.:SOURCE_POINT',connector:':',targetPort:'.:TARGET_POINT',direction:'FORWARD_C6',payload:'Q_SUBGROUP_STATE',
      updateLaw:`q' = ${adapter.generator}q mod ${Q}`,inverseLaw:`q' = ${ADAPTER_INVERSE_GENERATOR}q mod ${Q}`,returnAfter:6,
      deterministic:true,reversible:true,closed:true
    });
    const phaseLine=Object.freeze({
      readout:'MZ24(q)',ticks:adapter.phase.ticks,edgeDeltas:adapter.phase.deltaTicks,
      proposedLaw:'phi_target = phi_source + DELTA mod 24 with one constant DELTA',
      constantDeltaExists:adapter.phase.uniformDelta,closedAfterSix:adapter.phase.returnSumMod24===0,
      result:'FAIL_UNIFORM_PHASE_TRANSPORT'
    });
    return Object.freeze({
      name:'COLON_TYPED_LINE_HYPOTHESIS_PROBE',qStateLine,phaseLine,
      disposition:'PASS_REVERSIBLE_Q_STATE_EDGE / FAIL_UNIFORM_MZ24_PHASE_LINE / COLON_REMAINS_OPEN_BY_DEFAULT',
      colonRoleBefore:'OPEN_TYPED_JOINT / NO GLUING SELECTED',
      colonRoleAfter:'OPEN_TYPED_JOINT; Q_STATE_EDGE MAY BE SELECTED EXPLICITLY; PHASE_TRANSPORT NOT ESTABLISHED',
      boundary:'Six-step phase closure alone is insufficient: the per-edge MZ24 increments are not constant. The colon glyph therefore does not acquire a global phase-line meaning.'
    });
  }

  function d6ChamberControlRecord(){
    const adapter=adapterRecord('FORWARD');
    return Object.freeze({
      name:'C6_D6_CHAMBER_CONTROL',rotationOrder:adapter.generatorOrder,reflectionOrder:2,groupOrder:12,
      rotationAngle:Object.freeze({radians:'2π/6 = π/3',degrees:360/6}),
      reflectionChamber:Object.freeze({radians:'2π/12 = π/6',degrees:360/12}),
      laws:Object.freeze(['R^6=id','F^2=id','F R F=R^-1']),lawsVerified:adapter.fold.dihedralPreserved,
      circleQuotient:Object.freeze({cyclic:'S^1/C6 is topologically S^1; the covering degree is 6',dihedral:'S^1/D6 has a reflection chamber represented by a closed interval',boundary:'The π/6 chamber comes from adjoining reflections to the C6 rotation; it is not an MZ24 phase law.'}),
      status:'PASS_EXACT_D6_ACTION_AND_PI_OVER_6_CHAMBER'
    });
  }

  function permutations(values){
    if(values.length<2)return [values.slice()];
    const out=[];
    values.forEach((value,index)=>{
      const rest=values.slice(0,index).concat(values.slice(index+1));
      permutations(rest).forEach(tail=>out.push([value,...tail]));
    });
    return out;
  }

  function relabelingControlRecord(){
    const fold=anchor=>FOLD_MAP[anchor];
    const isCompatible=order=>{
      const index=new Map(order.map((anchor,i)=>[anchor,i]));
      const rotate=anchor=>order[(index.get(anchor)+1)%order.length];
      const inverse=anchor=>order[mod(index.get(anchor)-1,order.length)];
      return order.every(anchor=>fold(rotate(fold(anchor)))===inverse(anchor));
    };
    const orders=permutations(ANCHORS),passing=orders.filter(isCompatible);
    const firstFailing=orders.find(order=>!isCompatible(order));
    return Object.freeze({
      name:'SPLINTER_D6_RELABELING_CONTROL',totalLinearOrders:orders.length,passingLinearOrders:passing.length,
      dihedralRepresentationsPerCyclicClass:12,passingCyclicClasses:passing.length/12,currentOrder:Object.freeze(ANCHORS.slice()),currentOrderPass:isCompatible(ANCHORS),
      firstFailingControl:Object.freeze(firstFailing),passFraction:`${passing.length}/${orders.length} = 1/15`,
      status:'PASS_EXISTING_ORDER_COMPATIBLE_BUT_NOT_UNIQUE',
      boundary:'Fold compatibility excludes fourteen fifteenths of linear orders, but it leaves four cyclic classes. The retained 2x3 chassis supplies the chosen boundary order; the fold relation alone does not uniquely derive it.'
    });
  }

  function generatorControlRecord(){
    const orderSixUnits=[];
    for(let g=1;g<Q;g++)if(Primecube.gcd(g,Q)===1&&Primecube.multiplicativeOrder(g,Q)===6)orderSixUnits.push(g);
    const t20Powers=Array.from({length:Q_PERIOD-1},(_,index)=>index+1).filter(stride=>Primecube.multiplicativeOrder(Primecube.modularPower(20,stride,Q),Q)===6);
    return Object.freeze({
      name:'Q1001_ORDER6_GENERATOR_CONTROL',unitGroupSize:Primecube.qCubeRecord().phi,orderSixUnitCount:orderSixUnits.length,
      orderSixUnits:Object.freeze(orderSixUnits),t20OrderSixStrides:Object.freeze(t20Powers),t20OrderSixGenerators:Object.freeze(t20Powers.map(stride=>Primecube.modularPower(20,stride,Q))),
      status:'PASS_T20_SPECIFIC_TWO_ORIENTATIONS_NOT_GLOBALLY_UNIQUE',
      boundary:'The T20 orbit selects exactly strides 10 and 50, but the full unit group modulo 1001 contains other order-six elements. The adapter is exact and source-specific, not the unique C6 embedding in the CRT unit group.'
    });
  }

  function phaseControlRecord(){
    const generators=generatorControlRecord().orderSixUnits;
    const probes=generators.map(generator=>{
      const ticks=Array.from({length:6},(_,index)=>Primecube.mz24CompassRecord(Primecube.modularPower(generator,index,Q)).tick);
      const deltas=ticks.map((tick,index)=>mod(ticks[(index+1)%ticks.length]-tick,24));
      const uniform=new Set(deltas).size===1;
      return Object.freeze({generator,ticks:Object.freeze(ticks),deltas:Object.freeze(deltas),uniform,delta:uniform?deltas[0]:null,informative:uniform&&deltas[0]!==0});
    });
    const uniform=probes.filter(probe=>probe.uniform),informative=uniform.filter(probe=>probe.informative);
    const indexPositive=Object.freeze({ticks:Object.freeze([0,4,8,12,16,20]),deltas:Object.freeze([4,4,4,4,4,4]),status:'CONSTRUCTED_INDEX_PHASE_POSITIVE_CONTROL_NOT_MZ24'});
    return Object.freeze({
      name:'MZ24_ORDER6_PHASE_CONTROLS',testedOrderSixGenerators:probes.length,uniformGeneratorCount:uniform.length,informativeUniformGeneratorCount:informative.length,
      uniformGenerators:Object.freeze(uniform.map(probe=>Object.freeze({generator:probe.generator,ticks:probe.ticks,delta:probe.delta}))),
      t20Stride10:Object.freeze(probes.find(probe=>probe.generator===ADAPTER_GENERATOR)),t20Stride50:Object.freeze(probes.find(probe=>probe.generator===ADAPTER_INVERSE_GENERATOR)),
      indexPositiveControl:indexPositive,status:'VALIDATED_NEGATIVE_NO_NONTRIVIAL_UNIFORM_MZ24_ORDER6_PHASE',
      boundary:'Two order-six generators keep MZ24 constantly at tick 2; this is a degenerate zero-delta readout, not phase transport. The uniform nonzero index phase is deliberately constructed and is not an MZ24 result.'
    });
  }

  function glyphDecisionRecord(){
    return Object.freeze({
      name:'CONTROL_PLANE_TYPED_GLYPH_DECISION',tokens:Object.freeze([
        Object.freeze({token:'.:SOURCE',role:'ADDRESSED_SOURCE_POINT',status:'BOUND'}),
        Object.freeze({token:':',role:'OPEN_TYPED_JOINT / NO EDGE SELECTED',status:'BOUND_DEFAULT'}),
        Object.freeze({token:':Q+',role:`EXPLICIT Q EDGE · q'=${ADAPTER_GENERATOR}q mod ${Q}`,status:'BOUND_LOCAL_SYNTAX'}),
        Object.freeze({token:':Q−',role:`EXPLICIT INVERSE Q EDGE · q'=${ADAPTER_INVERSE_GENERATOR}q mod ${Q}`,status:'BOUND_LOCAL_SYNTAX'}),
        Object.freeze({token:':φ',role:'UNIFORM PHASE EDGE',status:'HOLD_REJECTED_FOR_MZ24'}),
        Object.freeze({token:'€',role:'EXCHANGE_VALUE_VIEW',status:'OWNER_CANDIDATE_UNBOUND'}),
        Object.freeze({token:'¢',role:'UNASSIGNED_GLYPH_PORT',status:'UNBOUND_HOLD'})
      ]),
      newVocabulary:false,globalColonRedefinition:false,status:'PASS_LOCAL_TYPED_SYNTAX_WITH_UNBOUND_GLYPHS',
      boundary:'The :Q annotations are local display syntax for a selected edge contract. They do not redefine punctuation globally or admit Euro and cent as operators.'
    });
  }

  function unitWindowControlRecord(){
    const phi=Primecube.qCubeRecord().phi;
    const windows=Object.freeze(Array.from({length:8},(_,index)=>{
      const step=index*UNIT_WINDOW,state=jointState(step),offsetMod56=mod(step,LOKI_PERIOD);
      return Object.freeze({index,step,offsetMod56,lokiStation:state.loki.station,lokiOrientation:state.loki.orientation,q:state.q,fold:state.fold});
    }));
    return Object.freeze({
      name:'Q720_WINDOW_VS_840_JOINT_RETURN_CONTROL',unitWindow:UNIT_WINDOW,unitGroupSize:phi,jointPeriod:JOINT_PERIOD,
      complementToJoint:JOINT_PERIOD-UNIT_WINDOW,doubleWindow:2*UNIT_WINDOW,windowReturn:WINDOW_JOINT_RETURN,
      windowReturnCount:WINDOW_JOINT_RETURN/UNIT_WINDOW,jointReturnCount:WINDOW_JOINT_RETURN/JOINT_PERIOD,
      gcdWithLoki:Primecube.gcd(UNIT_WINDOW,LOKI_PERIOD),lokiWindowResidue:mod(UNIT_WINDOW,LOKI_PERIOD),
      lokiSignedOffset:-8,windows,
      laws:Object.freeze(['720 = φ(1001)','840−120 = 720','840+600 = 1440','720 ≡ −8 (mod 56)','7·720 = 6·840 = 5040']),
      cubeCrosswalk:Object.freeze({numericEightEqualsTwoCubed:true,lokiOrientationCount:8,cubeDerivationEstablished:false,status:'EXACT_NUMERIC_CROSSWALK_ONLY'}),
      status:'PASS_720_WINDOW_STABLE_LOKI_MINUS_ONE_STATION_RECURRENCE',
      boundary:'The minus-eight LOKI residue is exact because 720 mod 56 equals 48, or minus 8. Since 720 is divisible by 8, orientation returns while the C7 station moves back by one. Equality with 2^3 is a typed numeric crosswalk, not a derivation from cube geometry.'
    });
  }

  function commonRefinement24Record(){
    const embed=order=>Object.freeze(Array.from({length:order},(_,index)=>index*(24/order)));
    const c6=embed(6),c8=embed(8),d12=embed(12);
    const intersection=(left,right)=>Object.freeze(left.filter(tick=>right.includes(tick)));
    const mz24=adapterRecord('FORWARD').phase.ticks;
    const matches=c6.map((tick,index)=>tick===mz24[index]);
    return Object.freeze({
      name:'C6_C8_D12_COMMON_REFINEMENT_24',modulus:24,
      embeddings:Object.freeze({c6,c8,d12}),
      intersections:Object.freeze({c8_d12:intersection(c8,d12),c6_c8:intersection(c6,c8),c6_d12:intersection(c6,d12)}),
      angleCardinalityCross:Object.freeze({angle60:60,angle90:90,loki56:56,expanded84:84,scaleNumerator:3,scaleDenominator:2,leftProduct:60*84,rightProduct:90*56,determinant:56*90-60*84,expanded84Factors:Object.freeze([6,7,2])}),
      mz24Comparator:Object.freeze({constructedC6Ticks:c6,observedMZ24Ticks:mz24,positionMatches:Object.freeze(matches),matchCount:matches.filter(Boolean).length,identityEstablished:matches.every(Boolean)}),
      status:'PASS_EXACT_C24_COMMON_REFINEMENT_WITH_MZ24_IDENTITY_NEGATIVE',
      boundary:'C6, C8 and the twelve D6 operations embed injectively into an index C24. This constructed common refinement is not the retained MZ24 residue readout; equal modulus does not merge the encodings.'
    });
  }

  function lengthUnitAdapterRecord(){
    const fixture=inches=>{
      const ticks=inches*127,cmHundredths=inches*254;
      return Object.freeze({inches,ticks,cmHundredths,centimeters:`${Math.floor(cmHundredths/100)}.${String(cmHundredths%100).padStart(2,'0')}`});
    };
    const fixtures=Object.freeze([1,2,10,12,50].map(fixture));
    return Object.freeze({
      name:'EXACT_INCH_CENTIMETER_COMMON_TICK_ADAPTER',definition:Object.freeze({inchToCentimeter:'1 in = 2.54 cm = 127/50 cm',tickMillimeter:'0.2',tickCentimeter:'0.02',ticksPerCentimeter:50,ticksPerInch:127}),
      fixtures,commonReturn:Object.freeze({ticks:6350,inches:50,centimeters:127}),
      diskRatio:Object.freeze({leftInches:10,rightInches:12,reduced:'5:6',leftCentimeters:'25.40',rightCentimeters:'30.48',unitInvariant:true}),
      status:'PASS_EXACT_RATIONAL_UNIT_ADAPTER_NO_ROUNDING',
      boundary:'Length value, unit label and integer tick address remain separate fields. The exact unit conversion preserves ratios but creates no angle, phase, state-count or physical coupling claim.'
    });
  }

  function origamiSplinterTransportRecord(){
    const source=Object.freeze({top:Object.freeze([1,8,11]),bottom:Object.freeze([33,27,22])});
    const applyDelta=(row,delta)=>Object.freeze(row.map((value,index)=>value+delta[index]));
    const rowSum=row=>row.reduce((sum,value)=>sum+value,0);
    const verticalGaps=rows=>Object.freeze(rows.bottom.map((value,index)=>value-rows.top[index]));
    const makeState=(name,delta)=>{
      const rows=Object.freeze({top:applyDelta(source.top,delta),bottom:applyDelta(source.bottom,delta)});
      const flattened=[...rows.top,...rows.bottom],unique=new Set(flattened).size===flattened.length;
      return Object.freeze({
        name,delta:Object.freeze(delta.slice()),rows,
        rowSums:Object.freeze({top:rowSum(rows.top),bottom:rowSum(rows.bottom),total:rowSum(rows.top)+rowSum(rows.bottom)}),
        verticalGaps:verticalGaps(rows),injective:unique,collisions:Object.freeze(flattened.filter((value,index)=>flattened.indexOf(value)!==index)),
        fixedAxis:Object.freeze([rows.top[1],rows.bottom[1]]),foldPairs:Object.freeze([[rows.top[0],rows.top[2]],[rows.bottom[0],rows.bottom[2]]].map(pair=>Object.freeze(pair))),
        primeAnchorCount:flattened.filter(value=>value>1&&Primecube.isPrime(value)).length
      });
    };
    const sourceState=makeState('SOURCE',[0,0,0]),wandering=makeState('WANDERING_MINUS_PLUS_MINUS',[-1,1,-1]),conservationControl=makeState('ZERO_SUM_CONSERVATION_CONTROL',[-1,2,-1]);
    return Object.freeze({
      name:'ORIGAMI_SPLINTER_INTEGER_LABEL_TRANSPORT_ADAPTER',source:sourceState,wandering,conservationControl,
      axisMigration:Object.freeze({from:Object.freeze([8,27]),to:Object.freeze([9,28])}),
      foldPairMigration:Object.freeze({from:Object.freeze([[1,11],[33,22]].map(pair=>Object.freeze(pair))),to:Object.freeze([[0,10],[32,21]].map(pair=>Object.freeze(pair)))}),
      invariant:Object.freeze({verticalGaps:Object.freeze([32,19,11]),outerDeltaEqual:true,foldReflectionPreserved:true}),
      sourceBinding:Object.freeze({role:'EXISTING_ORIGAMI_SPLINTER_DEMONSTRATOR',identityMerge:false,relationChange:false}),
      status:'PASS_WANDERING_TRANSPORT_WITH_NONINJECTIVE_CONSERVATION_CONTROL',
      boundary:'This is an integer-label transport overlay on the retained 2x3 Splinter chassis. Equal per-column deltas preserve vertical gaps and symmetric outer deltas preserve the fold pairing. The labels are not promoted to prime anchors, physical motion, a new carrier or a shared identity with the Origami demonstrator.'
    });
  }

  function zirkelSplitControlRecord(){
    const x=1000;
    const probe=(id,denominator,role)=>{
      const delta=1/denominator,betaPlus=.5+delta,betaMinus=.5-delta;
      const amplitudePlus=Math.pow(x,delta),amplitudeMinus=Math.pow(x,-delta);
      return Object.freeze({
        id,role,delta,
        fraction:`1/${denominator}`,betaPlus,betaMinus,
        betaPlusFraction:`${denominator+2}/${2*denominator}`,betaMinusFraction:`${denominator-2}/${2*denominator}`,
        midpoint:(betaPlus+betaMinus)/2,amplitudePlus,amplitudeMinus,amplitudeProduct:amplitudePlus*amplitudeMinus,
        reciprocal:true,specialnessEstablished:false
      });
    };
    const probes=Object.freeze([probe('DELTA_1_11',11,'OWNER_CANDIDATE'),probe('DELTA_1_12',12,'PHASE_DENOMINATOR_CONTROL'),probe('DELTA_1_10',10,'ARBITRARY_DENOMINATOR_CONTROL')]);
    const zeroContainmentStrips=Object.freeze([
      Object.freeze({id:'OPENAI_2026_ONE_TWELFTH_TO_ELEVEN_TWELFTH',lower:1/12,upper:11/12,lowerFraction:'1/12',upperFraction:'11/12',center:.5,halfWidth:5/12,width:5/6,portEdge:Object.freeze([8,10]),role:'BOUND_ZIRKEL_VIEW',verification:'MANUSCRIPT_CONTEXT_NOT_REPROVED_HERE'}),
      Object.freeze({id:'OPENAI_2026_ONE_EIGHTH_TO_SEVEN_EIGHTHS',lower:1/8,upper:7/8,lowerFraction:'1/8',upperFraction:'7/8',center:.5,halfWidth:3/8,width:3/4,portEdge:null,role:'STRONGER_RELEASE_COMPARATOR',verification:'FORMALIZATION_REPORTED_BY_RELEASE_NOT_REPROVED_HERE'})
    ]);
    const roles=Object.freeze([
      ...Array.from({length:7},(_,index)=>Object.freeze({address:index+1,role:'OUTER_STRUCTURE_POINT',sourceVisualRole:'1_TO_7_STRUCTURE'})),
      Object.freeze({address:8,role:'ALPHA_ZETA_PIVOT',sourceVisualRole:'CENTER'}),
      Object.freeze({address:9,role:'POLARITY_PORT',sourceVisualRole:'VISIBLE_UNCONNECTED_CONTROL'}),
      Object.freeze({address:10,role:'OBSERVER_PROJECTION_PORT',sourceVisualRole:'DASHED_BLACK_LINE'}),
      Object.freeze({address:11,role:'TAO_WAL_BOUNDARY_PORT',sourceVisualRole:'SOLID_BLACK_LINE'})
    ]);
    return Object.freeze({
      name:'LANIF_ZIRKEL_SPLIT_RETURN_CONTROL',decomposition:'7+1+3',roles,pivot:8,ports:Object.freeze([9,10,11]),
      sourceVisualGraph:Object.freeze({observedEdges:Object.freeze([[8,10],[8,11]].map(edge=>Object.freeze(edge))),unconnectedPort:9,idleAndActivatedPair:true,visualWitnessCount:8}),
      comparatorGraph:Object.freeze({declaredEdges:Object.freeze([[8,9],[8,10],[8,11]].map(edge=>Object.freeze(edge))),addedLocalEdge:Object.freeze([8,9]),addedLocalEdgeStatus:'DECLARED_COMPARATOR_EXTENSION_NOT_SOURCE_VISUAL_EDGE'}),
      portContracts:Object.freeze({
        9:Object.freeze({operator:'delta -> -delta',type:'POLARITY_INVOLUTION',return:'EXACT_INVOLUTION',law:'P(P(delta))=delta'}),
        10:Object.freeze({operator:'nontrivial-zero claim -> symmetric containment-strip view + source receipt',type:'ZERO_CONTAINMENT_STRIP_VIEW_WITH_SOURCE_RECEIPT',return:'EXACT_ONLY_WITH_STORED_SOURCE_RECEIPT',invertibleFromProjectionAlone:false,stripId:'OPENAI_2026_ONE_TWELFTH_TO_ELEVEN_TWELFTH',law:'1/12 <= Re(s) <= 11/12',center:'1/2',halfWidth:'5/12'}),
        11:Object.freeze({operator:'pivot -> Tao/Wal boundary role',type:'TAO_WAL_BOUNDARY_PORT',return:'SOURCE_ROLE_ONLY',stripEndpoint:false})
      }),
      criticalLine:Object.freeze({fixedRealPart:.5,probes,x,law:'A_plus=x^delta; A_minus=x^-delta; A_plus*A_minus=1'}),
      zeroContainmentStrips,
      phaseSeamComparator:Object.freeze({shadow:'-1/12',visible:'11/12',liftDelta:1,equivalentModuloOne:true,status:'SEPARATE_FROM_ZERO_CONTAINMENT_STRIP_AND_PORT_11'}),
      externalContext:Object.freeze({openAiRepository:'https://github.com/openai/math',releaseStatement:'Re(s)>11/12 zero-free half-plane; functional symmetry supplies the 1/12 lower boundary',youtubeTranscript:'https://www.youtube.com/watch?v=1zHOdTjH1I0&t=5s',authority:'CONTEXT_SOURCE_NOT_LOCAL_PROOF'}),
      c11Control:Object.freeze({addressCount:11,regularC11Established:false,phaseStepEstablished:false,candidateStep:'2pi/11',status:'HOLD_UNTIL_EQUAL_SPACING_AND_CYCLIC_OPERATOR_ARE_DECLARED'}),
      arithmeticWitness:Object.freeze({verified:Object.freeze(['17 is prime #7','34=2*17','97 is prime #25','289=17^2','521 is prime #98','1042=2*521','1031 and 1033 are twin primes','1036=4*259']),butterflyCenterCorrection:'midpoint(1031,1033)=1032, not 1034'}),
      sourceBinding:Object.freeze({identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS']),newIdentity:false,newRelation:false,sourceVisualsAreEvidence:false}),
      status:'PASS_7_PLUS_1_PLUS_3_TYPED_PORTS_WITH_C11_HOLD',
      boundary:'The Zirkel is a typed 7+1+3 role field and local control comparator. Edge 8->10 displays the externally sourced 1/12..11/12 zero-containment strip; it does not derive or prove that theorem. Delta=1/12 around the critical line instead gives 5/12..7/12 and remains a separate probe. Port 11 is a Tao/Wal source role, not the strip endpoint. Eleven addresses do not establish a regular C11 carrier, one-eleventh phase step, resonance field, zeta mechanism or physical Black Line.'
    });
  }

  function baselAlphaBetaControlRecord(){
    const gcd=(a,b)=>{let x=Math.abs(a),y=Math.abs(b);while(y){const r=x%y;x=y;y=r}return x};
    const density=6/(Math.PI*Math.PI);
    const sample=n=>{let coprime=0;for(let a=1;a<=n;a++)for(let b=1;b<=n;b++)if(gcd(a,b)===1)coprime++;const total=n*n,ratio=coprime/total;return Object.freeze({n,coprime,total,ratio,error:ratio-density})};
    const samples=Object.freeze([6,12,24,60,120,720].map(sample));
    return Object.freeze({
      name:'BASEL_ZETA_ALPHA_BETA_GRID_CONTROL',
      glyphSplit:Object.freeze({sourceGlyph:'ζ',readings:Object.freeze([
        Object.freeze({digits:'73',primeValues:Object.freeze([7,3]),primeIndices:Object.freeze([4,2]),order:'p4,p2'}),
        Object.freeze({digits:'37',primeValues:Object.freeze([3,7]),primeIndices:Object.freeze([2,4]),order:'p2,p4'})
      ]),status:'OWNER_GLYPH_CUT_ONLY',numericIdentityEstablished:false}),
      basel:Object.freeze({series:'sum(n>=1,1/n^2)',zetaArgument:2,zeta2:Math.PI*Math.PI/6,law:'zeta(2)=pi^2/6',inverseLaw:'1/zeta(2)=6/pi^2',coprimePairDensity:density}),
      cubeCrosswalk:Object.freeze({faceCount:6,law:'pi^2=6*zeta(2)',perFaceFormalShare:'pi^2/6=zeta(2)',exactScaling:true,cubeDerivationEstablished:false,geometricMechanismEstablished:false}),
      alphaBetaSplit:Object.freeze({center:.5,delta:1/12,alpha:5/12,beta:7/12,alphaFraction:'5/12',betaFraction:'7/12',separation:1/6,separationFraction:'1/6',sum:1,product:35/144,localNamesOnly:true,externalStripIdentity:false}),
      coprimeGrid:Object.freeze({domain:'ordered pairs (a,b) in {1..N}^2',predicate:'gcd(a,b)=1',limit:'6/pi^2',samples,last:samples.at(-1),monotoneErrorOnDeclaredSamples:samples.every((item,index)=>index===0||Math.abs(item.error)<Math.abs(samples[index-1].error))}),
      sourceBinding:Object.freeze({identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS']),newIdentity:false,newRelation:false,studyActivated:false,findingCreated:false}),
      status:'PASS_BASEL_DENSITY_WITH_TYPED_GLYPH_CUBE_AND_ALPHA_BETA_CROSSWALKS',
      boundary:'The Basel identity and finite gcd counts are exact. The 73/37 reading is an Owner glyph cut, not a numeric value of zeta. Six faces provide an exact normalization pi^2=6*zeta(2), not a cube derivation of pi or zeta. Alpha and beta are local labels for 5/12 and 7/12 and are not the external 1/12..11/12 zero-containment strip.'
    });
  }

  function scarabT11ShadowRailControlRecord(){
    const point=(n,role)=>Object.freeze({n,role,address:Primecube.fullCubeAddress(n),base11:Primecube.toBase11(n),carrierStatus:n<=Primecube.MAX_N?'CARRIER_RECORD':'SHADOW_ADDRESS'});
    const step=(source,target,role)=>Object.freeze({source:point(source,'SOURCE'),target:point(target,'TARGET'),delta:target-source,steps:(target-source)/11,columnPreserved:Primecube.fullCubeAddress(source).x===Primecube.fullCubeAddress(target).x,role});
    const centerToOuter=step(17,28,'ROOT_MEAN_TO_MIGRATED_OUTER_AXIS');
    const scarabLift=Object.freeze([41,42,43].map(n=>step(n,n+990,'SCARAB_H_TO_H_PLUS_990')));
    const imagePatch=Object.freeze([1024,1031,1033,1034,1036,1042].map(n=>point(n,'OWNER_BUTTERFLY_VALUE')));
    const negativeControls=Object.freeze([10,12].map(delta=>{const source=17,target=source+delta;return Object.freeze({delta,source:point(source,'SOURCE'),target:point(target,'CONTROL_TARGET'),columnPreserved:Primecube.fullCubeAddress(source).x===Primecube.fullCubeAddress(target).x,status:'FAIL_COLUMN_RETURN'})}));
    return Object.freeze({
      name:'SCARAB_T11_SHADOW_RAIL_CONTROL',
      operator:Object.freeze({id:'T11',law:'T11(n)=n+11',addressLaw:'[x,y,z] -> [x,y+1,z] with Base-11 carry',preserves:'x column',invertibleOnDeclaredIntegerEnvelope:true,inverse:'T11^-1(n)=n-11'}),
      centerToOuter,
      scarabLift:Object.freeze({mapping:'h -> h+990',factorization:'990=90*11=8*121+2*11',steps:90,fixtures:scarabLift}),
      shadowCrossing:Object.freeze({railOrigin:point(17,'ROOT_MEAN'),lastCarrier:point(1106,'LAST_CARRIER_ON_X5_RAIL'),firstShadow:point(1117,'FIRST_SHADOW_ON_X5_RAIL'),lastEnvelope:point(1326,'LAST_X5_RAIL_ADDRESS_IN_11_CUBE'),lastCarrierStep:99,firstShadowStep:100,lastEnvelopeStep:119,globalShadowFirst:1112}),
      imagePatch,
      imageWitnesses:Object.freeze({rowStep:step(1031,1042,'OWNER_IMAGE_PLUS_11_PAIR'),factorBridge:Object.freeze({equation:'1036=4*259=28*37',source:1036,inner:259,outer28:28,zeta37:37,exact:true})}),
      negativeControls,
      sourceBinding:Object.freeze({identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','MOD:ORIENTATION_DEMONSTRATORS']),newIdentity:false,newRelation:false,studyActivated:false,findingCreated:false}),
      status:'PASS_T11_COLUMN_RAIL_WITH_SCARAB_LIFT_AND_SHADOW_CROSSING',
      boundary:'T11 is an exact Base-11 address translation. The 17-to-28 step, Scarab h-to-h+990 fixtures and x=5 Shadow crossing instantiate the same operator without identifying their source roles. The butterfly values are a source-bound local patch; 1036=28*37 is exact factor arithmetic, not a zeta or Scarab mechanism.'
    });
  }

  function center13And5040ControlRecord(){
    const isPrime=n=>{if(!Number.isInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true};
    const primeRank=n=>{let rank=0;for(let value=2;value<=n;value++)if(isPrime(value))rank++;return isPrime(n)?rank:null};
    const factorize=n=>{const factors=[];let rest=n;for(let d=2;d*d<=rest;d++)while(rest%d===0){factors.push(d);rest/=d}if(rest>1)factors.push(rest);return Object.freeze(factors)};
    const firstPrimes=count=>{const values=[];for(let n=2;values.length<count;n++)if(isPrime(n))values.push(n);return Object.freeze(values)};
    const nestedRadical=coefficients=>{let value=1;for(let i=coefficients.length-1;i>=0;i--)value=Math.sqrt(1+coefficients[i]*value);return value};
    const alternatingReciprocal=denominators=>denominators.reduce((sum,value,index)=>sum+(index%2?-1:1)/value,0);
    const indexedWindow=Object.freeze(Array.from({length:25},(_,index)=>Object.freeze({i:index-12,value:13+index-12})));
    const suffixes=Object.freeze([39,40,41].map(value=>Object.freeze({value,factors:factorize(value),prime:isPrime(value),primeRank:primeRank(value)})));
    const eulerValues=Object.freeze(Array.from({length:41},(_,n)=>Object.freeze({n,value:n*n+n+41,prime:isPrime(n*n+n+41)})));
    return Object.freeze({
      name:'CENTER13_DOUBLE_WING_AND_5040_NEIGHBOR_CONTROL',
      centerWindow:Object.freeze({
        countView:Object.freeze({leftCount:12,pivotCount:1,rightCount:12,total:25,law:'12+1+12=25'}),
        weightedView:Object.freeze({leftWeight:12,pivotWeight:13,rightWeight:12,total:37,law:'12+13+12=37',totalPrimeRank:12}),
        indexView:Object.freeze({law:'13+i',domain:Object.freeze([-12,12]),range:Object.freeze([1,25]),values:indexedWindow,indexType:'INTEGER_OFFSET_NOT_IMAGINARY_UNIT'}),
        conDaoComparator:Object.freeze({canonical:'6|1|6',declared:'12|13|12',status:'DOUBLED_WING_COMPARATOR_NOT_CANONICAL_REDEFINITION'}),
        complexNegativeControl:Object.freeze({expression:'13+i',interpretation:'IMAGINARY_UNIT',normSquared:170,sameAsIntegerIndex:false})
      }),
      cubicReturn:Object.freeze({
        predecessor:1728,successor:1729,law:'12^3+1^3=1729',secondLaw:'10^3+9^3=1729',factors:Object.freeze([7,13,19]),factorMirror:'(13-6)*13*(13+6)',
        predecessorExtendedAddress:Object.freeze([0,3,14]),successorExtendedAddress:Object.freeze([1,3,14]),addressStep:Object.freeze([1,0,0]),carrierStatus:'OUTSIDE_PRIMECUBE_AND_FULL_11_CUBE_ENVELOPES'
      }),
      returnNeighborhood:Object.freeze({
        values:Object.freeze([5039,5040,5041]),law:'7!-1 | 7! | 7!+1',
        left:Object.freeze({value:5039,prime:true,primeRank:675,factors:Object.freeze([5039]),type:'PRIME'}),
        center:Object.freeze({value:5040,factorial:7,factors:Object.freeze([2,2,2,2,3,3,5,7]),divisorCount:60,type:'FACTORIAL_RETURN',mod13:5040%13}),
        right:Object.freeze({value:5041,squareRoot:71,factors:Object.freeze([71,71]),type:'SQUARE'}),
        symmetricOffsets:Object.freeze([-1,0,1]),brownPair:Object.freeze({factorialInput:7,squareRoot:71,law:'7!+1=71^2'}),
        existingReturnProducts:Object.freeze(['7*720','6*840','84*60','90*56'])
      }),
      carrierSwitch:Object.freeze({
        sourcePair:Object.freeze([3564,1476]),targetPair:Object.freeze([3565,1475]),operator:Object.freeze([1,-1]),totalInvariant:5040,
        sourceConstruction:Object.freeze({left:'1836+1728=17*108+16*108=33*108=3564',right:'5040-3564=1476=36*41',commonCarrier:36,reducedPair:Object.freeze([99,41])}),
        targetConstruction:Object.freeze({left:'3565=5*23*31',right:'1475=25*59',commonCarrier:5,reducedPair:Object.freeze([713,295])}),
        laws:Object.freeze(['3564+1476=5040','3565+1475=5040','gcd(3564,1476)=36','gcd(3565,1475)=5']),
        status:'PASS_CONSERVATIVE_PLUS_ONE_MINUS_ONE_CARRIER_SWITCH'
      }),
      markerRail:Object.freeze({
        markers:Object.freeze([
          Object.freeze({value:1476,cut:'1|47|6',parts:Object.freeze([1,47,6]),partSum:54,factors:factorize(1476),role:'SOURCE_COMPLEMENT_DECIMAL_MARKER'}),
          Object.freeze({value:1475,cut:'1|47|5',parts:Object.freeze([1,47,5]),partSum:53,partSumPrime:true,factors:factorize(1475),role:'TARGET_COMPLEMENT_DECIMAL_MARKER'}),
          Object.freeze({value:7119,cut:'71|19',parts:Object.freeze([71,19]),partSum:90,factors:factorize(7119),returnLaw:'71+19=90; 90*56=5040',role:'SEPARATE_BLOCK_SUM_MARKER'})
        ]),
        ownerEquation:Object.freeze({typedInput:'1113+51+1',literalReading:Object.freeze({expression:'1113+51+1',terms:Object.freeze([1113,51,1]),value:1165,factors:factorize(1165),law:'1113+51+1=1165=5*233'}),powerReading:Object.freeze({expression:'11^3+5^1+1',terms:Object.freeze([1331,5,1]),value:1337,factors:factorize(1337),law:'11^3+5^1+1=1337=7*191'}),status:'TWO_EXACT_TYPED_READINGS_OWNER_NOTATION_AMBIGUOUS_NO_OPERATOR_INFERRED'}),
        boundary:'Decimal and block cuts are declared views. Their part sums do not factor or reconstruct the source number unless a separate operator is supplied.'
      }),
      quantizationSeam1025:Object.freeze({
        address:Object.freeze({predecessor:1024,value:1025,step:1,law:'1025=1024+1=2^10+1'}),
        factorization:Object.freeze({factors:factorize(1025),law:'1025=5^2*41',primeFactor:Object.freeze({value:41,rank:primeRank(41),role:'P13_FACTOR'})}),
        primeGap:Object.freeze({lowerPrime:1021,upperPrime:1031,lowerDistance:4,upperDistance:6,gap:10,midpoint:1026,midpointOffset:-1,law:'1021+4=1025=1031-6'}),
        channelReceipt:Object.freeze({observedText:'0.002499999999979167',observedFloat:0.002499999999979167,exactTicks:3,tickDenominator:1200,reducedNumerator:1,reducedDenominator:400,exactValue:1/400,floatError:0.002499999999979167-1/400,status:'RAW_FLOAT_NORMALIZED_TO_EXACT_RATIONAL'}),
        sourceWitness:Object.freeze({kind:'OWNER_SCREENSHOT',fileName:'CD7AC699-9CCA-491D-8899-D06037D7A012_4_5005_c.jpeg',status:'VISUAL_RECEIPT_NOT_CANONICAL_DATASET'}),
        boundary:'Address, factorization, nearest-prime distances and channel value are four typed registers. The observed floating tail is normalized to 3/1200 only within the declared raster comparator; it is not extra precision, a physical amplitude or a Mandelbrot invariant.'
      }),
      ramanujanPrimeSubstitution:Object.freeze((()=>{
        const depth=12,classicalCoefficients=Object.freeze(Array.from({length:depth},(_,index)=>index+2)),primeCoefficients=firstPrimes(depth);
        const leibnizDenominators=Object.freeze(Array.from({length:depth},(_,index)=>2*index+1));
        const primeDenominators=Object.freeze([1,...firstPrimes(depth).filter(value=>value>2).slice(0,depth-1)]);
        return {
          seed:Object.freeze({value:1,displayLabel:'FIBONACCI_SEED_CANDIDATE',status:'ONE_ALONE_DOES_NOT_ESTABLISH_A_FIBONACCI_OPERATOR'}),
          radical:Object.freeze({depth,classicalCoefficients,primeCoefficients,classicalReadout:nestedRadical(classicalCoefficients),primeReadout:nestedRadical(primeCoefficients),classicalInfiniteIdentity:'sqrt(1+2sqrt(1+3sqrt(1+...)))=3',primeStatus:'FINITE_PRIME_SUBSTITUTION_COMPARATOR_NO_EQUAL_THREE_CLAIM'}),
          reciprocalSeries:Object.freeze({depth,leibnizDenominators,primeDenominators,leibnizReadout:alternatingReciprocal(leibnizDenominators),primeReadout:alternatingReciprocal(primeDenominators),leibnizIdentity:'pi/4=sum((-1)^n/(2n+1))',primeStatus:'PRIME_DENOMINATOR_SUBSTITUTION_IS_NOT_THE_LEIBNIZ_PI_SERIES'}),
          exactRamanujanSeries:Object.freeze({law:'1/pi=(2sqrt(2)/9801)*sum((4n)!(1103+26390n)/((n!)^4*396^(4n)))',status:'REUSED_ART_A0_MATHEMATICAL_JOINTS_EXACT_FORMULA'}),
          boundary:'Replacing the consecutive radical coefficients or the odd Leibniz denominators by primes defines new finite comparator readouts. It does not preserve the classical equalities to 3 or pi. The seed 1 is a display marker, not by itself a Fibonacci derivation.'
        };
      })()),
      calendarClockControl:Object.freeze({
        exact:Object.freeze({
          commonYear:Object.freeze({days:365,weeks:52,residueDays:1,law:'365=52*7+1'}),
          leapYear:Object.freeze({days:366,weeks:52,residueDays:2,law:'366=52*7+2'}),
          idealWeekYear:Object.freeze({days:364,weeks:52,residueDays:0,law:'364=52*7'}),
          weekMinutes:Object.freeze({value:10080,half:5040,law:'7*24*60=10080=2*5040'}),
          return5040Days:Object.freeze({weeks:720,ideal360DayYears:14,law:'5040 days=720 weeks=14*360 days'}),
          hourFixtures:Object.freeze({hours1728Days:72,hours1836Days:76.5,relation1728:'72=360/5',relation1836:'76.5=11*7-0.5'}),
          julian28YearComparator:Object.freeze({commonDays:28*365,leapDays:7,totalDays:10227,weeks:1461,law:'28*365+7=10227=1461*7',gregorianUniversalReturn:false}),
          gregorian400YearReturn:Object.freeze({commonYears:303,leapYears:97,totalDays:146097,weeks:20871,iso52WeekYears:329,iso53WeekYears:71,law:'400*365+97=146097=20871*7'})
        }),
        historical:Object.freeze({
          egyptianCivil:Object.freeze({scheme:'12*30+5=365',quadriennialLeapDay:false,status:'HISTORICAL_360_PLUS_5_WITHOUT_ORIGINAL_LEAP_DAY'}),
          alexandrian:Object.freeze({scheme:'12*30+5 plus sixth epagomenal day every fourth year',quadriennialLeapDay:true,status:'LATER_REFORM'}),
          mayaHaab:Object.freeze({scheme:'18*20+5=365',quadriennialLeapDay:false,status:'HISTORICAL_360_PLUS_5_NO_GENERAL_LEAP_DAY'}),
          sources:Object.freeze(['https://www.metmuseum.org/essays/telling-time-in-ancient-egypt','https://maya.nmai.si.edu/calendar/calendar-system','https://aa.usno.navy.mil/downloads/c15_usb_online.pdf'])
        }),
        analogy:Object.freeze({name:'SPRINGING_ONE_CALENDAR_COMPARATOR',exactIdentityWithCarrierSwitch:false,physicalMechanismEstablished:false,status:'INTERPRETIVE_ANALOGY_OVER_EXACT_REMAINDER_ARITHMETIC'}),
        isoWeekBoundary:Object.freeze({week53IsInsertedCorrection:false,rule:'ISO week-year has 53 weeks when its week-date boundary conditions require it',status:'CALENDAR_CLASSIFICATION_NOT_ACCUMULATED_DAY_INSERTION'})
      }),
      decimalCut:Object.freeze({prefix:50,suffixes,status:'BASE10_DISPLAY_CUT_ONLY'}),
      eulerPolynomialControl:Object.freeze({constant:41,constantPrimeRank:13,law:'n^2+n+41',primeForN0Through39:eulerValues.slice(0,40).every(item=>item.prime),failureAt40:eulerValues[40],status:'EULER_POLYNOMIAL_CONSTANT_NOT_5041_PRIMALITY'}),
      negativeControls:Object.freeze({centerDivisibleBy13:false,centerMod13:5040%13,digitCutIsFactorization:false,eulerConstantMakes5041Prime:false,conDaoCanonicalRedefined:false}),
      sourceContext:Object.freeze({url:'https://en.wikipedia.org/wiki/5040_(number)',role:'SECONDARY_CONTEXT_FOR_5040_FACTS'}),
      sourceBinding:Object.freeze({identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','NEXAH:CON_DAO_BREATH:V1']),newIdentity:false,newRelation:false,studyActivated:false,findingCreated:false}),
      status:'PASS_CENTER13_CUBIC_PLUS_ONE_AND_5040_NEIGHBOR_CONTROLS',
      boundary:'The 12|13|12 window, 1024-to-1025 quantization seam, 1729 cube sum, 5040 factorial neighborhood, conservative carrier switch, marker cuts, Ramanujan/prime substitution display, calendar remainder arithmetic and base-10 suffix cut are typed comparators. Prime substitution does not preserve the classical radical or pi-series identity. The 1025 channel receipt does not establish a physical amplitude or Mandelbrot invariant. The calendar analogy does not establish historical derivation, one natural carrier, a Con Dao redefinition, a zeta mechanism, a Shadow-Cube identity or a physical controller.'
    });
  }

  function verifyControls(){
    const checks=[];const check=(value,label)=>{if(!value)throw Error(`FAIL ${label}`);checks.push(label)};
    const d6=d6ChamberControlRecord(),relabel=relabelingControlRecord(),generators=generatorControlRecord(),phase=phaseControlRecord(),glyphs=glyphDecisionRecord(),unitWindow=unitWindowControlRecord(),refinement24=commonRefinement24Record(),lengthUnits=lengthUnitAdapterRecord(),origamiTransport=origamiSplinterTransportRecord(),zirkel=zirkelSplitControlRecord(),baselAlphaBeta=baselAlphaBetaControlRecord(),scarabT11Shadow=scarabT11ShadowRailControlRecord(),center13And5040=center13And5040ControlRecord();
    check(d6.rotationOrder===6&&d6.reflectionOrder===2&&d6.groupOrder===12,'C6 rotation and fold generate a twelve-element D6 action');
    check(d6.rotationAngle.degrees===60&&d6.reflectionChamber.degrees===30,'C6 and D6 fundamental angles are sixty and thirty degrees');
    check(d6.rotationAngle.radians.includes('π/3')&&d6.reflectionChamber.radians.includes('π/6'),'radian labels distinguish pi over three from pi over six');
    check(d6.lawsVerified&&d6.laws.join('|')==='R^6=id|F^2=id|F R F=R^-1','all D6 laws remain verified');
    check(relabel.totalLinearOrders===720&&relabel.passingLinearOrders===48,'exhaustive relabeling checks all 720 linear orders and retains 48');
    check(relabel.passingCyclicClasses===4&&relabel.passFraction.endsWith('1/15'),'fold compatibility leaves four cyclic classes or one fifteenth of linear orders');
    check(relabel.currentOrderPass&&relabel.firstFailingControl.length===6,'retained order passes and an explicit failing control exists');
    check(generators.unitGroupSize===720&&generators.orderSixUnitCount===56,'full Q unit group has 720 units and 56 order-six elements');
    check(generators.t20OrderSixStrides.join(',')==='10,50'&&generators.t20OrderSixGenerators.join(',')==='771,309','T20 contributes exactly the forward and reverse order-six adapters');
    check(phase.testedOrderSixGenerators===56&&phase.uniformGeneratorCount===2,'all 56 order-six generators receive an MZ24 phase control');
    check(phase.uniformGenerators.map(item=>item.generator).join(',')==='430,859'&&phase.uniformGenerators.every(item=>item.delta===0),'only two degenerate zero-delta MZ24 controls are uniform');
    check(phase.informativeUniformGeneratorCount===0,'no order-six generator produces nontrivial uniform MZ24 phase transport');
    check(phase.indexPositiveControl.deltas.every(delta=>delta===4),'constructed index-phase positive control closes uniformly');
    check(glyphs.tokens.find(item=>item.token===':Q+').status==='BOUND_LOCAL_SYNTAX'&&glyphs.tokens.find(item=>item.token===':φ').status.includes('REJECTED'),'Q edge syntax is bound locally while phase syntax remains rejected');
    check(!glyphs.newVocabulary&&!glyphs.globalColonRedefinition,'glyph decision creates no global vocabulary or colon redefinition');
    check(unitWindow.unitWindow===unitWindow.unitGroupSize&&unitWindow.complementToJoint===120&&unitWindow.doubleWindow===1440,'720 window equals phi 1001 and retains the 120 and 1440 arithmetic controls');
    check(unitWindow.lokiWindowResidue===48&&unitWindow.lokiSignedOffset===-8&&unitWindow.gcdWithLoki===8,'each 720 window has the exact minus-eight residue modulo 56');
    check(unitWindow.windows.every(item=>item.q===1&&item.fold===0&&item.lokiOrientation===0),'Q60 fold2 and the LOKI orientation return at every 720 window');
    check(unitWindow.windows.map(item=>item.lokiStation).join(',')==='0,6,5,4,3,2,1,0','LOKI station moves backward by one and returns after seven windows');
    check(unitWindow.windowReturn===5040&&unitWindow.windowReturnCount===7&&unitWindow.jointReturnCount===6,'seven 720 windows equal six 840 returns at 5040');
    check(unitWindow.cubeCrosswalk.numericEightEqualsTwoCubed&&!unitWindow.cubeCrosswalk.cubeDerivationEstablished,'eight equals two cubed only as a bounded numeric crosswalk');
    check(refinement24.modulus===24&&refinement24.embeddings.c6.length===6&&refinement24.embeddings.c8.length===8&&refinement24.embeddings.d12.length===12,'C6 C8 and D12 embed into one exact index C24');
    check(refinement24.embeddings.c6.join(',')==='0,4,8,12,16,20'&&refinement24.embeddings.c8.join(',')==='0,3,6,9,12,15,18,21'&&refinement24.embeddings.d12.join(',')==='0,2,4,6,8,10,12,14,16,18,20,22','all C24 embedding ticks are exact');
    check(refinement24.intersections.c8_d12.join(',')==='0,6,12,18'&&refinement24.intersections.c6_c8.join(',')==='0,12'&&refinement24.intersections.c6_d12.join(',')==='0,4,8,12,16,20','pairwise C24 intersections are exact');
    check(refinement24.angleCardinalityCross.leftProduct===5040&&refinement24.angleCardinalityCross.rightProduct===5040&&refinement24.angleCardinalityCross.determinant===0,'60 by 84 and 90 by 56 form an exact three-to-two cross proportion');
    check(refinement24.angleCardinalityCross.expanded84Factors.join(',')==='6,7,2','84 retains the six by seven by two factorization');
    check(refinement24.mz24Comparator.matchCount===0&&!refinement24.mz24Comparator.identityEstablished,'constructed C24 C6 ticks remain distinct from the observed MZ24 readout');
    check(lengthUnits.definition.ticksPerCentimeter===50&&lengthUnits.definition.ticksPerInch===127,'inch and centimeter share an exact zero-point-two millimeter integer tick');
    check(lengthUnits.fixtures.find(item=>item.inches===10).ticks===1270&&lengthUnits.fixtures.find(item=>item.inches===10).centimeters==='25.40','ten inch disk converts exactly to 25.40 centimeters and 1270 ticks');
    check(lengthUnits.fixtures.find(item=>item.inches===12).ticks===1524&&lengthUnits.fixtures.find(item=>item.inches===12).centimeters==='30.48','twelve inch disk converts exactly to 30.48 centimeters and 1524 ticks');
    check(lengthUnits.commonReturn.ticks===6350&&lengthUnits.commonReturn.inches===50&&lengthUnits.commonReturn.centimeters===127&&lengthUnits.diskRatio.reduced==='5:6','unit rails return at 50 inches equals 127 centimeters and preserve the five-to-six disk ratio');
    check(origamiTransport.wandering.rows.top.join(',')==='0,9,10'&&origamiTransport.wandering.rows.bottom.join(',')==='32,28,21','minus plus minus transports both Splinter rows to the exact integer labels');
    check(origamiTransport.wandering.rowSums.top===19&&origamiTransport.wandering.rowSums.bottom===81&&origamiTransport.wandering.rowSums.total===100,'wandering transport has net minus one per row and minus two overall');
    check(origamiTransport.source.verticalGaps.join(',')==='32,19,11'&&origamiTransport.wandering.verticalGaps.join(',')==='32,19,11','same column delta preserves all three vertical gaps');
    check(origamiTransport.wandering.fixedAxis.join(',')==='9,28'&&origamiTransport.wandering.foldPairs.flat().join(',')==='0,10,32,21','fold axis and both outer pairs migrate exactly');
    check(origamiTransport.wandering.injective&&origamiTransport.wandering.collisions.length===0,'wandering transport remains an injective six-label display');
    check(origamiTransport.conservationControl.rowSums.total===102&&origamiTransport.conservationControl.rows.top.join(',')==='0,10,10','zero-sum control conserves the total but creates a repeated top label');
    check(!origamiTransport.conservationControl.injective&&origamiTransport.conservationControl.collisions.join(',')==='10','conservation control explicitly fails injective address relabeling');
    check(origamiTransport.wandering.primeAnchorCount===0&&!origamiTransport.sourceBinding.identityMerge&&!origamiTransport.sourceBinding.relationChange,'transport remains a non-prime integer overlay with no identity or relation merge');
    check(zirkel.roles.length===11&&zirkel.decomposition==='7+1+3'&&zirkel.pivot===8&&zirkel.ports.join(',')==='9,10,11','Zirkel retains the exact seven plus one plus three role decomposition');
    check(zirkel.sourceVisualGraph.observedEdges.flat().join(',')==='8,10,8,11'&&zirkel.sourceVisualGraph.unconnectedPort===9,'source visuals expose two active Black Lines and one unconnected polarity port');
    check(zirkel.comparatorGraph.declaredEdges.flat().join(',')==='8,9,8,10,8,11'&&zirkel.comparatorGraph.addedLocalEdgeStatus.includes('NOT_SOURCE_VISUAL_EDGE'),'comparator adds the missing 8 to 9 control edge without rewriting the source visual');
    check(zirkel.criticalLine.probes.map(item=>`${item.betaMinusFraction}|${item.betaPlusFraction}`).join(',')==='9/22|13/22,10/24|14/24,8/20|12/20','one-eleventh one-twelfth and one-tenth probes retain exact rational endpoints');
    check(zirkel.criticalLine.probes.every(item=>Math.abs(item.midpoint-.5)<1e-12&&Math.abs(item.amplitudeProduct-1)<1e-12&&item.reciprocal),'all symmetric beta probes retain midpoint one-half and reciprocal normalized envelopes');
    check(zirkel.portContracts[9].return==='EXACT_INVOLUTION'&&!zirkel.portContracts[10].invertibleFromProjectionAlone,'polarity returns by involution while strip projection requires its source receipt');
    check(zirkel.portContracts[10].law==='1/12 <= Re(s) <= 11/12'&&zirkel.portContracts[10].halfWidth==='5/12','edge eight to ten carries the one-twelfth to eleven-twelfths strip with half-width five-twelfths');
    check(zirkel.zeroContainmentStrips[0].center===.5&&zirkel.zeroContainmentStrips[0].width===5/6&&zirkel.zeroContainmentStrips[1].width===3/4,'both release strips are symmetric about one-half and the one-eighth strip is narrower');
    check(zirkel.portContracts[11].type==='TAO_WAL_BOUNDARY_PORT'&&!zirkel.portContracts[11].stripEndpoint&&zirkel.phaseSeamComparator.status.includes('SEPARATE'),'port eleven and the phase seam remain separate from the zero-containment strip');
    check(!zirkel.c11Control.regularC11Established&&!zirkel.c11Control.phaseStepEstablished&&zirkel.c11Control.status.startsWith('HOLD'),'eleven visible roles do not establish a regular C11 phase carrier');
    check(zirkel.arithmeticWitness.butterflyCenterCorrection.includes('1032')&&!zirkel.sourceBinding.newIdentity&&!zirkel.sourceBinding.newRelation,'arithmetic correction and zero graph delta remain explicit');
    check(Math.abs(baselAlphaBeta.basel.zeta2-Math.PI*Math.PI/6)<1e-15&&Math.abs(baselAlphaBeta.basel.coprimePairDensity-6/(Math.PI*Math.PI))<1e-15,'Basel value and reciprocal coprime density remain exact in the display model');
    check(baselAlphaBeta.glyphSplit.readings.map(item=>item.digits).join(',')==='73,37'&&baselAlphaBeta.glyphSplit.readings.flatMap(item=>item.primeIndices).join(',')==='4,2,2,4','zeta glyph cut retains both p4 p2 and p2 p4 readings');
    check(!baselAlphaBeta.glyphSplit.numericIdentityEstablished&&baselAlphaBeta.glyphSplit.status==='OWNER_GLYPH_CUT_ONLY','glyph split remains explicitly non-numeric');
    check(baselAlphaBeta.cubeCrosswalk.faceCount===6&&baselAlphaBeta.cubeCrosswalk.exactScaling&&!baselAlphaBeta.cubeCrosswalk.cubeDerivationEstablished,'six-face pi-squared normalization is exact without a cube derivation claim');
    check(baselAlphaBeta.alphaBetaSplit.alphaFraction==='5/12'&&baselAlphaBeta.alphaBetaSplit.betaFraction==='7/12'&&baselAlphaBeta.alphaBetaSplit.separationFraction==='1/6','alpha beta split is exactly one-half plus or minus one-twelfth');
    check(baselAlphaBeta.alphaBetaSplit.sum===1&&!baselAlphaBeta.alphaBetaSplit.externalStripIdentity,'alpha beta pair closes at one and stays distinct from the theorem strip');
    check(baselAlphaBeta.coprimeGrid.samples.map(item=>item.coprime).join(',')==='23,91,359,2203,8771,315387'&&baselAlphaBeta.coprimeGrid.monotoneErrorOnDeclaredSamples,'declared finite coprime grids converge monotonically toward six over pi squared');
    check(scarabT11Shadow.operator.law==='T11(n)=n+11'&&scarabT11Shadow.centerToOuter.source.n===17&&scarabT11Shadow.centerToOuter.target.n===28,'T11 carries the Root mean seventeen to the migrated outer value twenty-eight');
    check(scarabT11Shadow.centerToOuter.columnPreserved&&scarabT11Shadow.centerToOuter.source.address.x===5&&scarabT11Shadow.centerToOuter.target.address.x===5,'seventeen to twenty-eight preserves Cube column five');
    check(scarabT11Shadow.scarabLift.steps===90&&scarabT11Shadow.scarabLift.fixtures.map(item=>`${item.source.n}:${item.target.n}`).join(',')==='41:1031,42:1032,43:1033','Scarab lift is exactly ninety T11 steps on all three fixtures');
    check(scarabT11Shadow.scarabLift.fixtures.every(item=>item.columnPreserved&&item.delta===990),'every Scarab fixture preserves its Cube x column under plus nine-hundred-ninety');
    check(scarabT11Shadow.shadowCrossing.lastCarrier.n===1106&&scarabT11Shadow.shadowCrossing.firstShadow.n===1117&&scarabT11Shadow.shadowCrossing.firstShadowStep===100,'x-five rail crosses from carrier to Shadow between steps ninety-nine and one-hundred');
    check(scarabT11Shadow.shadowCrossing.lastCarrier.carrierStatus==='CARRIER_RECORD'&&scarabT11Shadow.shadowCrossing.firstShadow.carrierStatus==='SHADOW_ADDRESS','rail crossing preserves the carrier-record versus shadow-address boundary');
    check(scarabT11Shadow.imageWitnesses.rowStep.columnPreserved&&scarabT11Shadow.imageWitnesses.rowStep.delta===11&&scarabT11Shadow.imageWitnesses.factorBridge.equation==='1036=4*259=28*37','owner image retains an exact plus-eleven pair and the twenty-eight by thirty-seven factor bridge');
    check(scarabT11Shadow.imagePatch.every(item=>item.address.z===8)&&scarabT11Shadow.imagePatch.map(item=>item.address.y).join(',')==='5,5,5,5,6,6','six butterfly values occupy one local two-row patch in Cube layer eight');
    check(scarabT11Shadow.negativeControls.every(item=>!item.columnPreserved&&item.status==='FAIL_COLUMN_RETURN'),'plus-ten and plus-twelve controls both fail Cube-column preservation');
    check(!scarabT11Shadow.sourceBinding.newIdentity&&!scarabT11Shadow.sourceBinding.newRelation&&!scarabT11Shadow.sourceBinding.studyActivated&&!scarabT11Shadow.sourceBinding.findingCreated,'T11 connector creates no identity relation Study or Finding');
    check(center13And5040.centerWindow.countView.total===25&&center13And5040.centerWindow.weightedView.total===37,'twelve one twelve count view and twelve thirteen twelve weighted view remain distinct and exact');
    check(center13And5040.centerWindow.weightedView.totalPrimeRank===12&&center13And5040.centerWindow.indexView.values.map(item=>item.value).join(',')===Array.from({length:25},(_,i)=>i+1).join(','),'thirty-seven is prime twelve and integer offset thirteen plus i spans one through twenty-five');
    check(center13And5040.centerWindow.complexNegativeControl.normSquared===170&&!center13And5040.centerWindow.complexNegativeControl.sameAsIntegerIndex,'imaginary thirteen plus i remains a separate negative control');
    check(center13And5040.cubicReturn.predecessor===1728&&center13And5040.cubicReturn.successor===1729&&center13And5040.cubicReturn.factors.join(',')==='7,13,19','twelve cubed plus one cubed yields the exact 1729 factor bridge');
    check(center13And5040.cubicReturn.secondLaw==='10^3+9^3=1729'&&center13And5040.cubicReturn.successorExtendedAddress.join(',')==='1,3,14','1729 retains its second cube sum and extended base-eleven address');
    check(center13And5040.returnNeighborhood.values.join(',')==='5039,5040,5041'&&center13And5040.returnNeighborhood.symmetricOffsets.join(',')==='-1,0,1','factorial return has exact symmetric neighbors');
    check(center13And5040.returnNeighborhood.left.prime&&center13And5040.returnNeighborhood.left.primeRank===675&&center13And5040.returnNeighborhood.right.squareRoot===71,'5039 is prime number 675 and 5041 is seventy-one squared');
    check(center13And5040.returnNeighborhood.center.factorial===7&&center13And5040.returnNeighborhood.center.divisorCount===60&&center13And5040.returnNeighborhood.center.factors.join(',')==='2,2,2,2,3,3,5,7','5040 is seven factorial with sixty divisors and exact prime factors');
    check(center13And5040.decimalCut.suffixes.map(item=>item.value).join(',')==='39,40,41'&&center13And5040.decimalCut.suffixes[0].factors.join(',')==='3,13'&&center13And5040.decimalCut.suffixes[1].factors.join(',')==='2,2,2,5'&&center13And5040.decimalCut.suffixes[2].primeRank===13,'base-ten suffix rail is three times thirteen two cubed times five and prime thirteen');
    check(center13And5040.eulerPolynomialControl.primeForN0Through39&&center13And5040.eulerPolynomialControl.failureAt40.value===1681&&!center13And5040.eulerPolynomialControl.failureAt40.prime,'Euler polynomial control passes zero through thirty-nine and fails at forty with forty-one squared');
    check(center13And5040.negativeControls.centerMod13===9&&!center13And5040.negativeControls.centerDivisibleBy13&&!center13And5040.negativeControls.digitCutIsFactorization,'5040 is not divisible by thirteen and decimal cutting is not factorization');
    check(!center13And5040.sourceBinding.newIdentity&&!center13And5040.sourceBinding.newRelation&&!center13And5040.sourceBinding.studyActivated&&!center13And5040.sourceBinding.findingCreated,'center thirteen and 5040 comparator creates no graph Study or Finding delta');
    check(center13And5040.carrierSwitch.sourcePair.join(',')==='3564,1476'&&center13And5040.carrierSwitch.targetPair.join(',')==='3565,1475'&&center13And5040.carrierSwitch.operator.join(',')==='1,-1','plus one minus one transfers exactly between the two 5040 complements');
    check(center13And5040.carrierSwitch.sourcePair.reduce((a,b)=>a+b)===5040&&center13And5040.carrierSwitch.targetPair.reduce((a,b)=>a+b)===5040,'carrier switch conserves the 5040 total');
    check(Primecube.gcd(...center13And5040.carrierSwitch.sourcePair)===36&&center13And5040.carrierSwitch.sourceConstruction.commonCarrier===36&&center13And5040.carrierSwitch.sourceConstruction.reducedPair.join(',')==='99,41','source complement pair has common carrier thirty-six and reduced pair ninety-nine forty-one');
    check(Primecube.gcd(...center13And5040.carrierSwitch.targetPair)===5&&center13And5040.carrierSwitch.targetConstruction.commonCarrier===5&&center13And5040.carrierSwitch.targetConstruction.reducedPair.join(',')==='713,295','target complement pair has common carrier five and exact reduced pair');
    check(center13And5040.markerRail.markers.map(item=>item.cut).join(',')==='1|47|6,1|47|5,71|19'&&center13And5040.markerRail.markers.map(item=>item.partSum).join(',')==='54,53,90','decimal marker rail retains fifty-four fifty-three and ninety as separate block sums');
    check(center13And5040.markerRail.markers[1].partSumPrime&&center13And5040.markerRail.markers[2].returnLaw==='71+19=90; 90*56=5040','marker rail retains prime fifty-three and the exact ninety by fifty-six return');
    check(center13And5040.markerRail.ownerEquation.literalReading.value===1165&&center13And5040.markerRail.ownerEquation.literalReading.factors.join(',')==='5,233','literal owner equation eleven-thirteen plus fifty-one plus one returns 1165 equals five times 233');
    check(center13And5040.markerRail.ownerEquation.powerReading.value===1337&&center13And5040.markerRail.ownerEquation.powerReading.factors.join(',')==='7,191','power owner equation eleven cubed plus five plus one returns 1337 equals seven times 191');
    check(center13And5040.quantizationSeam1025.address.predecessor===1024&&center13And5040.quantizationSeam1025.address.value===1025&&center13And5040.quantizationSeam1025.address.step===1,'quantization seam retains the exact two-to-the-tenth plus-one address step');
    check(center13And5040.quantizationSeam1025.factorization.factors.join(',')==='5,5,41'&&center13And5040.quantizationSeam1025.factorization.primeFactor.rank===13,'1025 factors as five squared times prime thirteen');
    check(center13And5040.quantizationSeam1025.primeGap.lowerDistance===4&&center13And5040.quantizationSeam1025.primeGap.upperDistance===6&&center13And5040.quantizationSeam1025.primeGap.midpointOffset===-1,'1025 occupies the exact four-six asymmetric position in the 1021-to-1031 prime gap');
    check(center13And5040.quantizationSeam1025.channelReceipt.exactTicks===3&&center13And5040.quantizationSeam1025.channelReceipt.tickDenominator===1200&&center13And5040.quantizationSeam1025.channelReceipt.reducedDenominator===400&&Math.abs(center13And5040.quantizationSeam1025.channelReceipt.floatError)<1e-12,'1025 channel receipt normalizes three over twelve-hundred to one over four-hundred');
    check(center13And5040.ramanujanPrimeSubstitution.radical.classicalCoefficients.slice(0,4).join(',')==='2,3,4,5'&&center13And5040.ramanujanPrimeSubstitution.radical.primeCoefficients.slice(0,4).join(',')==='2,3,5,7','radical comparator keeps consecutive and prime coefficient rows distinct');
    check(Math.abs(center13And5040.ramanujanPrimeSubstitution.radical.classicalReadout-2.998630317889081)<1e-12&&Math.abs(center13And5040.ramanujanPrimeSubstitution.radical.primeReadout-3.223259890774551)<1e-12,'depth-twelve radical readouts are deterministic');
    check(center13And5040.ramanujanPrimeSubstitution.reciprocalSeries.leibnizDenominators.slice(0,6).join(',')==='1,3,5,7,9,11'&&center13And5040.ramanujanPrimeSubstitution.reciprocalSeries.primeDenominators.slice(0,6).join(',')==='1,3,5,7,11,13','Leibniz and prime denominator rows diverge visibly at the fifth denominator');
    check(/NOT_THE_LEIBNIZ_PI_SERIES/.test(center13And5040.ramanujanPrimeSubstitution.reciprocalSeries.primeStatus)&&/NO_EQUAL_THREE_CLAIM/.test(center13And5040.ramanujanPrimeSubstitution.radical.primeStatus),'prime substitutions remain explicit negative identity controls');
    check(center13And5040.calendarClockControl.exact.commonYear.residueDays===1&&center13And5040.calendarClockControl.exact.leapYear.residueDays===2&&center13And5040.calendarClockControl.exact.idealWeekYear.residueDays===0,'common leap and ideal week years retain residues one two and zero');
    check(center13And5040.calendarClockControl.exact.weekMinutes.value===10080&&center13And5040.calendarClockControl.exact.weekMinutes.half===5040,'one week has twice 5040 minutes');
    check(center13And5040.calendarClockControl.exact.return5040Days.weeks===720&&center13And5040.calendarClockControl.exact.return5040Days.ideal360DayYears===14,'5040 days equal seven-hundred-twenty weeks and fourteen ideal 360-day years');
    check(center13And5040.calendarClockControl.exact.hourFixtures.hours1728Days===72&&center13And5040.calendarClockControl.exact.hourFixtures.hours1836Days===76.5,'1728 and 1836 hours convert exactly to seventy-two and seventy-six point five days');
    check(center13And5040.calendarClockControl.exact.julian28YearComparator.totalDays===10227&&center13And5040.calendarClockControl.exact.julian28YearComparator.weeks===1461&&!center13And5040.calendarClockControl.exact.julian28YearComparator.gregorianUniversalReturn,'twenty-eight-year return is exact only as the declared Julian comparator');
    check(center13And5040.calendarClockControl.exact.gregorian400YearReturn.totalDays===146097&&center13And5040.calendarClockControl.exact.gregorian400YearReturn.weeks===20871&&center13And5040.calendarClockControl.exact.gregorian400YearReturn.iso53WeekYears===71,'Gregorian four-hundred-year cycle returns after 20871 weeks with seventy-one long ISO years');
    check(!center13And5040.calendarClockControl.historical.egyptianCivil.quadriennialLeapDay&&center13And5040.calendarClockControl.historical.alexandrian.quadriennialLeapDay&&!center13And5040.calendarClockControl.historical.mayaHaab.quadriennialLeapDay,'historical calendar controls separate Egyptian Maya and later Alexandrian leap treatment');
    check(!center13And5040.calendarClockControl.analogy.exactIdentityWithCarrierSwitch&&!center13And5040.calendarClockControl.isoWeekBoundary.week53IsInsertedCorrection,'springing-one analogy and ISO week 53 remain explicit nonidentity controls');
    return Object.freeze({
      schema:'nexah.a0.primecube-control-plane-controls/1',version:VERSION,status:'PASS_STEPS_7_TO_14_WITH_ZIRKEL_SPLIT_RETURN_CONTROL',checkCount:checks.length,checks:Object.freeze(checks),
      d6,relabeling:relabel,generators,phase,glyphs,unitWindow,refinement24,lengthUnits,origamiTransport,zirkel,baselAlphaBeta,scarabT11Shadow,center13And5040,newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      claimBoundary:'Exhaustive finite controls only. The 720 recurrence and C24 embeddings are index arithmetic; the exact inch-centimeter adapter is a length conversion; the Origami transport is an integer-label overlay; the Zirkel is a 7+1+3 typed role field. None establishes a cube-derived mechanism, regular C11 carrier, MZ24 identity, resonance field, physical Black Line or cross-type physical coupling.'
    });
  }

  function controlPlaneRecord(){
    return Object.freeze({coupling:verify(),controls:verifyControls(),joint:coupledReturnRecord(),forward:adapterRecord('FORWARD'),reverse:adapterRecord('REVERSE'),colon:colonPhaseLineProbe(),glyphs:glyphDecisionRecord(),unitWindow:unitWindowControlRecord(),refinement24:commonRefinement24Record(),lengthUnits:lengthUnitAdapterRecord(),origamiTransport:origamiSplinterTransportRecord(),zirkel:zirkelSplitControlRecord(),baselAlphaBeta:baselAlphaBetaControlRecord(),scarabT11Shadow:scarabT11ShadowRailControlRecord(),center13And5040:center13And5040ControlRecord()});
  }

  function verify(){
    if(!Baseline)throw Error('Primecube control-plane baseline is required for full verification');
    const checks=[];const check=(value,label)=>{if(!value)throw Error(`FAIL ${label}`);checks.push(label)};
    const baseline=Baseline.verify(),joint=coupledReturnRecord(),adapter=adapterRecord('FORWARD'),reverse=adapterRecord('REVERSE'),colon=colonPhaseLineProbe();
    check(baseline.status==='PASS_BASELINE_WITH_EXPLICIT_HOLDS','steps one to three baseline remains valid');
    check(JOINT_PERIOD===840&&joint.leastCommonMultiple===840,'least common multiple of 60 56 and 2 is 840');
    check(joint.firstJointReturn===840&&joint.jointReturns.join(',')==='840','first complete joint return occurs at step 840');
    check(joint.uniqueJointStates===840,'all joint states before return are distinct');
    check(joint.start.q===1&&joint.end.q===1,'Q register returns to one');
    check(joint.end.loki.station===0&&joint.end.loki.orientation===0,'LOKI register returns to zero zero');
    check(joint.end.fold===0,'fold register returns to even parity');
    check(Object.values(joint.mz24Counts).reduce((a,b)=>a+b,0)===840,'MZ24 distribution accounts for all 840 steps');
    check(joint.mz24Counts[0]===0&&joint.mz24Counts[1]===0&&joint.mz24Counts[22]===0&&joint.mz24Counts[23]===0,'T20 product run preserves the four missing MZ24 ticks');
    check(ADAPTER_GENERATOR===771&&ADAPTER_INVERSE_GENERATOR===309,'forward and reverse stride-ten generators are exact');
    check(adapter.generatorOrder===6&&reverse.generatorOrder===6,'both adapter orientations have order six');
    check(adapter.entries.map(entry=>entry.q).join(',')==='1,771,848,155,386,309','forward adapter Q states are exact');
    check(adapter.closure.injective&&adapter.closure.lastToFirst&&adapter.closure.returnAfter===6,'forward adapter is injective and closes after six steps');
    check(reverse.closure.injective&&reverse.closure.lastToFirst,'reverse adapter is injective and closes');
    check(adapter.fold.allPreserved&&adapter.fold.fixedAnchors.join(',')==='8,27','fold reflection transfers exactly and fixes the 8 to 27 axis');
    check(adapter.entries.every((entry,index)=>adapter.entries[(index+1)%6].q===mod(entry.q*adapter.generator,Q)),'adapter intertwines C6 rotation with T20 power ten');
    check(adapter.fold.dihedralPreserved&&adapter.laws.dihedral==='F R F = R^−1','fold and rotation retain the dihedral relation');
    check(adapter.phase.ticks.join(',')==='2,5,4,13,10,11','adapter MZ24 ticks are exact');
    check(adapter.phase.deltaTicks.join(',')==='3,23,9,21,1,15','adapter phase increments are exact');
    check(!adapter.phase.uniformDelta&&adapter.phase.returnSumMod24===0,'phase closes after six edges but has no constant increment');
    check(adapter.alternatives.orderSixStrides.join(',')==='10,50'&&adapter.alternatives.minimalPositiveStrideWithOrder6===10&&adapter.alternatives.reverseStrideWithOrder6===50,'exactly two stride orientations retain order six');
    check(colon.qStateLine.deterministic&&colon.qStateLine.reversible&&colon.qStateLine.closed,'colon candidate supports an explicit reversible Q-state edge');
    check(!colon.phaseLine.constantDeltaExists&&colon.phaseLine.closedAfterSix,'uniform MZ24 phase transport fails despite cycle closure');
    check(colon.disposition.includes('COLON_REMAINS_OPEN_BY_DEFAULT'),'colon remains open unless an edge type is explicitly selected');
    check(!adapter.boundary.includes('natural identity')||adapter.boundary.includes('not a natural identity'),'adapter retains non-identity boundary');
    return Object.freeze({
      schema:'nexah.a0.primecube-control-plane-coupling/1',version:VERSION,status:'PASS_STEPS_4_TO_6_WITH_PHASE_LINE_NEGATIVE',checkCount:checks.length,checks:Object.freeze(checks),
      jointReturn:Object.freeze({period:joint.firstJointReturn,uniqueStates:joint.uniqueJointStates,periods:joint.periods,status:joint.status}),
      adapter:Object.freeze({stride:ADAPTER_STRIDE,generator:adapter.generator,reverseGenerator:reverse.generator,states:adapter.entries,status:adapter.status,phase:adapter.phase}),
      colon:Object.freeze({disposition:colon.disposition,phaseLine:colon.phaseLine}),
      holds:Object.freeze(['COMMON_NATURAL_CLOCK_NOT_ESTABLISHED','SPLINTER_Q_NATURAL_IDENTITY_NOT_ESTABLISHED','UNIFORM_MZ24_PHASE_LINE_REJECTED','COLON_GLOBAL_PHASE_MEANING_REJECTED']),
      identityReuse:Baseline.IDENTITY_REUSE,newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      claimBoundary:'Bounded exact engineering/formal-design fixture only. The synchronized product, stride-ten adapter and dihedral transfer do not create a Study, Finding, common physical carrier, natural clock, causal phase line, energy channel or publication state.'
    });
  }

  return Object.freeze({VERSION,Q,Q_PERIOD,LOKI_PERIOD,FOLD_PERIOD,JOINT_PERIOD,UNIT_WINDOW,WINDOW_JOINT_RETURN,ANCHORS,FOLD_MAP,ADAPTER_STRIDE,ADAPTER_GENERATOR,ADAPTER_INVERSE_GENERATOR,jointState,coupledReturnRecord,adapterRecord,colonPhaseLineProbe,d6ChamberControlRecord,relabelingControlRecord,generatorControlRecord,phaseControlRecord,glyphDecisionRecord,unitWindowControlRecord,commonRefinement24Record,lengthUnitAdapterRecord,origamiSplinterTransportRecord,zirkelSplitControlRecord,baselAlphaBetaControlRecord,scarabT11ShadowRailControlRecord,center13And5040ControlRecord,verify,verifyControls,controlPlaneRecord});
});
