(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.A0TypedCompass=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const MODULUS=280;
  const STEP=107;
  const MIRROR_STEP=(MODULUS-STEP)%MODULUS;
  const TRAIL_RADIUS=213;
  const TRAIL_POINT_COUNT=42;
  const INNER_RING_RADIUS=80;
  const PRIME_CORRIDOR=Object.freeze([107,109,113,127,131,137]);
  const PRIME_MILESTONES=Object.freeze([
    {index:25,prime:97,mod9:7,mod13:6,mod72:25,ring13:6},
    {index:50,prime:229,mod9:4,mod13:8,mod72:13,ring13:7},
    {index:75,prime:379,mod9:1,mod13:2,mod72:19,ring13:7},
    {index:100,prime:541,mod9:1,mod13:8,mod72:37,ring13:7},
    {index:125,prime:691,mod9:7,mod13:2,mod72:43,ring13:7},
    {index:150,prime:863,mod9:8,mod13:5,mod72:71,ring13:5},
    {index:175,prime:1039,mod9:4,mod13:12,mod72:31,ring13:6},
    {index:200,prime:1223,mod9:8,mod13:1,mod72:71,ring13:6}
  ]);
  const EULER_HISTORICAL_FLOORS=Object.freeze([13,41,137,241,367,487,617,751,883,1031,1171,1303,1459]);
  const EULER_CORRECTED_FLOORS=Object.freeze([13,41,137,241,367,487,617,751,883,1031,1171,1303,1471]);
  const C_FREE_STAIR_LABELS=Object.freeze([7,29,79,41,91,63,39,23]);
  const E8_COXETER_RADII=Object.freeze([0.238235,0.385473,0.473861,0.572925,0.704294,0.766723,0.927011,1.139572]);
  const E8_PHI_PAIRS=Object.freeze([[1,2],[3,6],[4,7],[5,8]]);

  function mod(n,m=MODULUS){return ((Number(n)%m)+m)%m;}
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;}
  function lcm(a,b){return Math.abs(Number(a)*Number(b))/gcd(a,b);}
  function rotate(n,step=STEP){return mod(Number(n)+Number(step));}
  function circleMirror(n){return mod(-Number(n));}
  function digitMirror(value,width=String(value).length){
    const s=String(value);
    if(!/^\d+$/.test(s)||!Number.isInteger(width)||width<s.length) throw new TypeError('digitMirror requires digits and a width that preserves the source');
    return s.padStart(width,'0').split('').reverse().join('');
  }
  function lift(value,k){
    if(!Number.isInteger(k)||k<0) throw new TypeError('lift exponent must be a non-negative integer');
    return BigInt(value)*(10n**BigInt(k));
  }
  function isPrime(n){
    n=Number(n);if(!Number.isInteger(n)||n<2)return false;if(n%2===0)return n===2;
    for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;return true;
  }
  function factors(n){
    n=Math.abs(Number(n));const out=[];for(let d=2;d*d<=n;d+=(d===2?1:2)){while(n%d===0){out.push(d);n/=d;}}if(n>1)out.push(n);return out;
  }
  function primeIndex(n){if(!isPrime(n))return null;let k=0;for(let i=2;i<=n;i++)if(isPrime(i))k+=1;return k;}
  function orbit(start=0,step=STEP,modulus=MODULUS){
    const out=[];let n=mod(start,modulus);do{out.push(n);n=mod(n+step,modulus);}while(n!==mod(start,modulus)&&out.length<=modulus);return out;
  }
  function goldenStepAudit(){
    const goldenAngle=360*(1-1/((1+Math.sqrt(5))/2));
    const stepAngle=360*STEP/MODULUS;
    return {goldenAngle,stepAngle,error:Math.abs(stepAngle-goldenAngle),coprime:gcd(STEP,MODULUS)===1,orbitLength:orbit().length};
  }
  function geometryAudit(){
    const stepAngle=360*STEP/MODULUS;
    const minorAngle=Math.min(stepAngle,360-stepAngle);
    const tangentRadius=TRAIL_RADIUS*Math.cos((minorAngle*Math.PI/180)/2);
    return {
      trailRadius:TRAIL_RADIUS,
      trailPoints:TRAIL_POINT_COUNT,
      trailSegments:TRAIL_POINT_COUNT-1,
      minorAngle,
      tangentRadius,
      drawnInnerRing:INNER_RING_RADIUS,
      ringGap:INNER_RING_RADIUS-tangentRadius,
      cut32Status:'OPEN_COUNTING_RULE_REQUIRED'
    };
  }
  function primeCorridorAudit(){
    return {
      primes:PRIME_CORRIDOR.slice(),
      start:PRIME_CORRIDOR[0],
      end:PRIME_CORRIDOR[PRIME_CORRIDOR.length-1],
      valueDifference:137-107,
      startPrimeIndex:primeIndex(107),
      endPrimeIndex:primeIndex(137),
      indexDifference:primeIndex(137)-primeIndex(107),
      layoutBoundaryOnly:true
    };
  }
  function symmetric567Audit(){
    const carrier=[5,6,7];
    const pairProducts=[carrier[0]*carrier[1],carrier[0]*carrier[2],carrier[1]*carrier[2]];
    return {
      carrier,
      e1:carrier.reduce((sum,n)=>sum+n,0),
      pairProducts,
      e2:pairProducts.reduce((sum,n)=>sum+n,0),
      e3:carrier.reduce((product,n)=>product*n,1)
    };
  }
  function constructionLedgerAudit(){
    const symmetry32=[7,8,17];
    const primeCore48=[7,11,13,17];
    const symmetrySum=symmetry32.reduce((sum,n)=>sum+n,0);
    const coreSum=primeCore48.reduce((sum,n)=>sum+n,0);
    return {
      symmetry32,
      symmetrySum,
      primeCore48,
      coreSum,
      constructionRadius:symmetrySum+coreSum,
      displayedChordCount:TRAIL_POINT_COUNT-1,
      countTypesRemainDistinct:symmetrySum!==TRAIL_POINT_COUNT-1
    };
  }
  function q840Audit(){
    const modulus=840;
    const divisors=[30,35,42];
    const ticks=Array.from({length:modulus},(_,n)=>n);
    const members=Object.fromEntries(divisors.map(d=>[d,ticks.filter(n=>n%d===0)]));
    const union=ticks.filter(n=>divisors.some(d=>n%d===0));
    const triple=ticks.filter(n=>divisors.every(d=>n%d===0));
    const exclusive=Object.fromEntries(divisors.map(d=>[d,ticks.filter(n=>n%d===0&&divisors.filter(other=>n%other===0).length===1)]));
    const pairOnly=ticks.filter(n=>divisors.filter(d=>n%d===0).length===2);
    return {
      modulus,
      divisors,
      period:lcm(lcm(divisors[0],divisors[1]),divisors[2]),
      totalCounts:Object.fromEntries(divisors.map(d=>[d,members[d].length])),
      exclusiveCounts:Object.fromEntries(divisors.map(d=>[d,exclusive[d].length])),
      unionCount:union.length,
      triple,
      pairOnlyCount:pairOnly.length,
      sourceStatus:'EXISTING_ARTIFACT_COMPRESSION'
    };
  }
  function binary20Audit(value=36669){
    value=Number(value);
    if(!Number.isSafeInteger(value)||value<0||value>=2**20) throw new TypeError('binary20 value must be an unsigned 20-bit integer');
    const binary=value.toString(2);
    const word=binary.padStart(20,'0');
    const ones=[...word].filter(bit=>bit==='1').length;
    return {
      value,
      binary,
      word,
      grouped:word.match(/.{1,4}/g).join(' '),
      width:20,
      ones,
      zeros:word.length-ones,
      balanced:ones===word.length-ones,
      quotient:Math.floor(value/20),
      remainder:value%20,
      factors:factors(value),
      interpretationBoundary:'BINARY_WORD_ON_20_SLOT_FRAME_NOT_BASE20_NUMERAL'
    };
  }
  function primeStairAudit(){
    const milestones=PRIME_MILESTONES.map(entry=>({...entry,indexMod11:entry.index%11,primeMod11:entry.prime%11}));
    const gaps=milestones.slice(1).map((entry,i)=>entry.prime-milestones[i].prime);
    const mod9Classes=[...new Set(milestones.map(entry=>entry.mod9))].sort((a,b)=>a-b);
    return {
      milestones,
      gaps,
      indexStride:25,
      indexStrideMod11:25%11,
      indexPhase11:milestones.map(entry=>entry.indexMod11),
      mod9Classes,
      forbiddenPrimeMod9Classes:[0,3,6],
      allPrimeIndicesExact:milestones.every(entry=>primeIndex(entry.prime)===entry.index),
      allPrimeMod9ClassesAllowed:milestones.every(entry=>![0,3,6].includes(entry.mod9)),
      repeated72Residue:milestones.filter(entry=>entry.mod72===71).map(entry=>entry.prime),
      projectionBoundary:'ORDINAL_HEIGHT_RESIDUE_LENS_NOT_UNIQUE_CUBE_EMBEDDING'
    };
  }
  function ulamCoordinate(n){
    n=Number(n);
    if(!Number.isInteger(n)||n<1) throw new TypeError('ulamCoordinate requires a positive integer');
    let x=0,y=0,value=1,step=1;
    while(value<n){
      for(let i=0;i<step&&value<n;i++){x+=1;value+=1;}
      for(let i=0;i<step&&value<n;i++){y+=1;value+=1;}
      step+=1;
      for(let i=0;i<step&&value<n;i++){x-=1;value+=1;}
      for(let i=0;i<step&&value<n;i++){y-=1;value+=1;}
      step+=1;
    }
    return {x,y};
  }
  function ulamMilestoneAudit(){
    const milestones=PRIME_MILESTONES.map((entry,index)=>({...entry,...ulamCoordinate(entry.prime),cFreeLabel:C_FREE_STAIR_LABELS[index]}));
    const axisHits=milestones.filter(entry=>entry.x===0||entry.y===0).map(entry=>entry.prime);
    const mainDiagonalHits=milestones.filter(entry=>Math.abs(entry.x)===Math.abs(entry.y)).map(entry=>entry.prime);
    return {
      convention:'1_CENTER_2_EAST_COUNTERCLOCKWISE_SQUARE_SPIRAL',
      limit:PRIME_MILESTONES.at(-1).prime,
      milestones,
      cFreeLabels:C_FREE_STAIR_LABELS.slice(),
      cFreeRule:'OWNER_DECLARED_DISPLAY_CUT_FIRST_TERM_EXCEPTION_NOT_UNIFORM_MOD100',
      axisHits,
      mainDiagonalHits,
      eastAxis541:{...ulamCoordinate(541),shell:12,identity:541===4*12**2-3*12+1},
      commonLineClaim:false,
      interpretationBoundary:'ULAM_COORDINATE_PROJECTION_NOT_EULER_OR_FIBONACCI_IDENTITY'
    };
  }
  function eulerRainbowAudit(){
    const value=(n,c)=>Number(n)**2+Number(n)+Number(c);
    return {
      formula:'E_c(n)=n^2+n+c',
      historicalFloors:EULER_HISTORICAL_FLOORS.slice(),
      correctedFloors:EULER_CORRECTED_FLOORS.slice(),
      floorCount:EULER_HISTORICAL_FLOORS.length,
      displayPartition:{lower:EULER_HISTORICAL_FLOORS.slice(0,8),upper:EULER_HISTORICAL_FLOORS.slice(8),label:'8+5_DECLARED_DISPLAY_PARTITION'},
      sampleAt60:EULER_HISTORICAL_FLOORS.map(c=>value(60,c)),
      parallelOffsetInvariant:EULER_HISTORICAL_FLOORS.every(c=>value(60,c)-value(0,c)===3660),
      historicalTerminal:{value:1459,primeIndex:primeIndex(1459)},
      correctedTerminal:{value:1471,primeIndex:primeIndex(1471)},
      interpretationBoundary:'THIRTEEN_OFFSETS_ONE_SHARED_QUADRATIC_SHAPE'
    };
  }
  function timegearAudit(){
    const cycles=[400,420,600],gateCount=20;
    const gcdAll=cycles.reduce((a,b)=>gcd(a,b));
    const commonReturn=cycles.reduce((a,b)=>lcm(a,b));
    return {
      cycles,
      gateCount,
      gateAngle:360/gateCount,
      ticksPerGate:cycles.map(n=>n/gateCount),
      tickDifferencesPerGate:[420/20-400/20,600/20-420/20,600/20-400/20],
      angularResolution:cycles.map(n=>360/n),
      gcdAll,
      commonReturn,
      revolutionsAtReturn:cycles.map(n=>commonReturn/n),
      originGate:0,
      antipodeGate:10,
      readout:Array.from({length:gateCount},(_,g)=>({gate:g,angle:g*18,ticks:[20*g,21*g,30*g]})),
      driftStatus:'0.464_DEGREES_NOT_DERIVED',
      gammaStatus:'NO_TYPED_MAP_TO_EULER_MASCHERONI_CONSTANT',
      sourceStatus:'EXISTING_OWNER_AUTHORIZED_ENGINEERING_RESULT'
    };
  }
  function e8SpokeChoirAudit(){
    const phi=(1+Math.sqrt(5))/2;
    const rings=E8_COXETER_RADII.map((radius,index)=>({ring:index+1,radius}));
    const pairs=E8_PHI_PAIRS.map(([inner,outer])=>({inner,outer,ratio:E8_COXETER_RADII[outer-1]/E8_COXETER_RADII[inner-1],error:Math.abs(E8_COXETER_RADII[outer-1]/E8_COXETER_RADII[inner-1]-phi)}));
    return {
      rootCount:240,
      orbitCount:8,
      pointsPerOrbit:30,
      rotationDegrees:12,
      operatorOrder:30,
      squaredNorm:2,
      edgeCount:6720,
      degree:56,
      rings,
      pairs,
      phi,
      maximumRoundedPairError:Math.max(...pairs.map(pair=>pair.error)),
      canonicalStop:'R8',
      continuationGuide:[phi*E8_COXETER_RADII[7],phi*phi*E8_COXETER_RADII[7]],
      continuationStatus:'COMPOSITIONAL_PHI_EXTENSION_ONLY_NOT_ADDITIONAL_E8_ORBITS',
      interpretationBoundary:'COXETER_PLANE_REFERENCE_PROJECTION_NOT_ACOUSTIC_OR_PHYSICAL_COUPLING'
    };
  }
  function fiveTRllrAudit(){
    const P=64,R=8,T=5;
    const rllrWord='RLLR',benchTicks=120,letterTicks=benchTicks/rllrWord.length;
    const seed=Date.UTC(1972,1,29),target=Date.UTC(1972,2,24),dayMs=86400000;
    const dayOfYear=ms=>Math.floor((ms-Date.UTC(new Date(ms).getUTCFullYear(),0,1))/dayMs)+1;
    const intervalDays=(target-seed)/dayMs;
    return {
      carriers:{P,R,T},
      fiveSplit:{sixty:60/T,oneTwenty:120/T},
      squareClosure:P===R*R,
      sideEquation:{left:P/(R*T),right:R/T,equal:P/(R*T)===R/T},
      normalizedEquation:{left:(P/P)/T,right:(R/R)/T,equal:(P/P)/T===(R/R)/T},
      calendar:{seed:'1972-02-29',target:'1972-03-24',seedDayOfYear:dayOfYear(seed),targetDayOfYear:dayOfYear(target),intervalDays,inclusiveDayCount:intervalDays+1,validLeapSeed:new Date(seed).toISOString().slice(0,10)==='1972-02-29'},
      fiveTPhase:intervalDays%T,
      intervalMatchesOneTwentySplit:intervalDays===120/T,
      sourceCrosswalk:{
        dateSource:'A0_NUMBERMAGICK_GRID_RESEARCH#calendar-void-cut-return-20261106',
        routeSource:'A0_ORIENTATION_CONTROLLER_BENCH#maskObserverBench',
        existingDirectRelation:false,
        declaredAddressMap:'calendar interval day count -> bench tick address',
        benchTicks,
        word:rllrWord,
        letterTicks,
        tickAddress:intervalDays,
        normalizedPhase:intervalDays/benchTicks,
        segmentIndex:Math.floor(intervalDays/letterTicks),
        segmentLetter:rllrWord[Math.floor(intervalDays/letterTicks)],
        fractionWithinSegment:(intervalDays%letterTicks)/letterTicks,
        status:'SOURCE_BOUND_COMPARISON_CROSSWALK_NOT_NATIVE_DATE_RULE'
      },
      unitBoundary:'DIVISION_PRESERVES_DECLARED_INPUT_UNIT_NO_AUTOMATIC_HOUR_CONVERSION',
      rllrStatus:'WITNESS_WORD_ONLY_OPERATOR_UNDEFINED',
      interpretationBoundary:'EXACT_FINITE_RATIO_AND_CALENDAR_WITNESS_NO_EVENT_OR_CAUSAL_IDENTITY'
    };
  }
  function exactAudit(){
    const a=goldenStepAudit();
    return {
      status:'EXACT_ARITHMETIC_PASS',
      typedSeparation:'M_digit != M_circle != L_k',
      digitPairs:[
        {source:'1087',mirror:digitMirror('1087',4),sourcePrime:isPrime(1087),sourcePrimeIndex:primeIndex(1087),mirrorPrime:isPrime(7801),mirrorFactors:factors(7801)},
        {source:'1078',mirror:digitMirror('1078',4),sourcePrime:isPrime(1078),sourceFactors:factors(1078),mirrorPrime:isPrime(8701),mirrorFactors:factors(8701)}
      ],
      midpoint:{left:1031,mid:1032,right:1033,identity:1031+1033===2*1032,leftPrimeIndex:primeIndex(1031),rightPrimeIndex:primeIndex(1033)},
      residual:{high:1836,low:1729,difference:1836-1729,primeIndex:primeIndex(1836-1729)},
      circle:{modulus:MODULUS,step:STEP,mirrorStep:MIRROR_STEP,gcd:gcd(STEP,MODULUS),orbitLength:a.orbitLength,stepAngle:a.stepAngle,goldenAngle:a.goldenAngle,error:a.error,conjugacy:circleMirror(rotate(circleMirror(41),STEP))===rotate(41,MIRROR_STEP)},
      geometry:geometryAudit(),
      primeCorridor:primeCorridorAudit(),
      symmetric567:symmetric567Audit(),
      constructionLedger:constructionLedgerAudit(),
      q840:q840Audit(),
      binary20:binary20Audit(),
      primeStair:primeStairAudit(),
      ulamMilestones:ulamMilestoneAudit(),
      eulerRainbow:eulerRainbowAudit(),
      timegear:timegearAudit(),
      e8SpokeChoir:e8SpokeChoirAudit(),
      fiveTRllr:fiveTRllrAudit(),
      lift:{operator:'L_k(n)=10^k n',sample:String(lift(1,7)),notMirror:true}
    };
  }

  function createState(source=1087){return {source:String(source),width:String(source).length,phase:0,history:[],circleMirrored:false};}
  function apply(state,operator){
    const next={...state,history:state.history.slice()};
    if(operator==='DIGIT_MIRROR')next.source=digitMirror(next.source,next.width);
    else if(operator==='ROTATE_107')next.phase=rotate(next.phase);
    else if(operator==='CIRCLE_MIRROR'){next.phase=circleMirror(next.phase);next.circleMirrored=!next.circleMirrored;}
    else if(operator==='RETURN'){next.source='1087';next.width=4;next.phase=0;next.circleMirrored=false;}
    else throw new TypeError('unknown operator');
    next.history.push(operator);return next;
  }

  return {MODULUS,STEP,MIRROR_STEP,TRAIL_RADIUS,TRAIL_POINT_COUNT,INNER_RING_RADIUS,PRIME_CORRIDOR,PRIME_MILESTONES,EULER_HISTORICAL_FLOORS,EULER_CORRECTED_FLOORS,C_FREE_STAIR_LABELS,E8_COXETER_RADII,E8_PHI_PAIRS,mod,gcd,lcm,rotate,circleMirror,digitMirror,lift,isPrime,factors,primeIndex,orbit,goldenStepAudit,geometryAudit,primeCorridorAudit,symmetric567Audit,constructionLedgerAudit,q840Audit,binary20Audit,primeStairAudit,ulamCoordinate,ulamMilestoneAudit,eulerRainbowAudit,timegearAudit,e8SpokeChoirAudit,fiveTRllrAudit,exactAudit,createState,apply};
});
