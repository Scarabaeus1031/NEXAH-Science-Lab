(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.A0TypedCompass=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const MODULUS=280;
  const STEP=107;
  const MIRROR_STEP=(MODULUS-STEP)%MODULUS;
  const HALF_TURN=MODULUS/2;
  const ALPHA_RESIDUAL=HALF_TURN-STEP;
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
  function seedFieldAudit(count=MODULUS){
    if(!Number.isInteger(count)||count<1||count>MODULUS) throw new TypeError('seed field count must be an integer from 1 through 280');
    const angle=goldenStepAudit();
    const points=Array.from({length:count},(_,offset)=>{
      const ordinal=offset+1;
      return {
        ordinal,
        radius:Math.sqrt(ordinal/count),
        wheelPhase:mod(ordinal*STEP),
        wheelDegrees:mod(ordinal*angle.stepAngle,360),
        goldenDegrees:mod(ordinal*angle.goldenAngle,360)
      };
    });
    return {
      count,
      radialRule:'r_n = sqrt(n/N)',
      centreSeed:{index:7,prime:17,label:'SEED 7 / p7=17'},
      wheel:{step:STEP,modulus:MODULUS,degrees:angle.stepAngle,fullFiniteOrbit:count===MODULUS&&gcd(STEP,MODULUS)===1},
      goldenComparator:{degrees:angle.goldenAngle,perStepDifference:angle.error,cumulativeUnwrappedDifference:(count-1)*angle.error,status:'COMPARATOR_ONLY_NOT_WHEEL_OPERATOR'},
      gateOrdinals:[28,29,30],
      gatePrimes:[107,109,113],
      points,
      typeBoundary:'CENTRE_SEED_REGISTER != RADIAL_INDEX != WHEEL_PHASE != GOLDEN_COMPARATOR'
    };
  }
  function nautilusStairAudit(mode='nautilus'){
    const availableModes=['nautilus','stairs','triangle','cube'];
    if(!availableModes.includes(mode)) throw new TypeError(`nautilus stair mode must be one of ${availableModes.join(', ')}`);
    const triangle=[107,109,113].map(value=>({value,index:primeIndex(value)}));
    const letterCube=[
      {face:'A',role:'SEED_INDEX',value:7},
      {face:'B',role:'SEED_PRIME',value:17},
      {face:'C',role:'GATE_P28',value:107},
      {face:'D',role:'GATE_P29',value:109},
      {face:'E',role:'GATE_P30',value:113},
      {face:'F',role:'FINITE_RETURN',value:280}
    ];
    return {
      mode,
      availableModes,
      centreSeed:{index:7,prime:17},
      arc:{step:STEP,modulus:MODULUS,label:'R107/280 NAUTILUS PATH',status:'MORPHOLOGY_AND_ORIENTATION_GUIDE_ONLY'},
      stairs:PRIME_MILESTONES.map(({index,prime})=>({index,prime})),
      pinkTriangle:triangle,
      letterCube,
      handoff:['SEED_FIELD','NAUTILUS_PATH','PRIME_STAIR','PINK_TRIANGLE','LETTER_CUBE'],
      sourceBindings:['A0_TYPED_MIRROR_ROTATION_COMPASS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','PBM:GRID11'],
      exclusions:['ASTROPHYSICS','ZODIAC','NEUTRINO','STARGATE'],
      graphDelta:{nodes:0,relations:0,aliases:0,status:'ZERO_GRAPH_DELTA_EXISTING_A0_IDENTITY_REUSED'},
      typeBoundary:'NAUTILUS_PATH != BIOLOGICAL_SHELL != STAIR_HEIGHT != TRIANGLE_METRIC != LETTER_MEANING != CUBE_FACE_IDENTITY'
    };
  }
  function octagonWobbleAudit(mode='octagon'){
    const availableModes=['octagon','pi-out','wobble29','crescent-strip'];
    if(!availableModes.includes(mode)) throw new TypeError(`octagon wobble mode must be one of ${availableModes.join(', ')}`);
    const diameter=1,radius=diameter/2,sides=8;
    const innerPerimeter=sides*diameter*Math.sin(Math.PI/sides);
    const outerPerimeter=sides*diameter*Math.tan(Math.PI/sides);
    const hits=Array.from({length:29},(_,index)=>{
      const phase=2*Math.PI*index/29;
      return {index:index+1,degrees:360*index/29,wobbleRadius:1+0.04*Math.sin(3*phase),mark:'X'};
    });
    return {
      mode,
      availableModes,
      circle:{diameter,radius,circumference:Math.PI*diameter},
      octagon:{sides,turnDegrees:360/sides,innerPerimeter,outerPerimeter,sourceApproximation:3.31},
      localIJ:{I:'INSCRIBED_INNER_POLYGON',J:'CIRCUMSCRIBED_OUTER_JACKET'},
      hits,
      strip:{cells:29,order:'CIRCULAR_ORDER_UNWRAPPED_LEFT_TO_RIGHT',mask:'CRESCENT_DISPLAY_OCCLUDER',readableUnderMask:true},
      sourceBinding:'SESSION_TRANSCRIPT_ARCHIMEDES_CIRCLE_APPROXIMATION_11_32_TO_16_39',
      graphDelta:{nodes:0,relations:0,aliases:0,status:'ZERO_GRAPH_DELTA_EXISTING_A0_IDENTITY_REUSED'},
      typeBoundary:'OCTAGON_VERTEX != PI_CIRCUMFERENCE != I_INNER_POLYGON != J_OUTER_JACKET != X_HIT != WOBBLE_DISPLAY_OFFSET != CRESCENT_MASK != STRIP_ADDRESS'
    };
  }
  function pascalStringTowerAudit(round=8,iotaOffset=0){
    const k=Number(round),offset=Number(iotaOffset);
    if(!Number.isInteger(k)||k<0||k>64) throw new TypeError('Pascal tower round must be an integer from 0 through 64');
    if(!Number.isFinite(offset)||offset<-22.5||offset>22.5) throw new TypeError('Iota offset must be between -22.5 and 22.5 degrees');
    const row=[];let coefficient=1n;
    for(let column=0;column<=k;column+=1){row.push(coefficient);coefficient=coefficient*BigInt(k-column)/BigInt(column+1);}
    const binaryMass=2n**BigInt(k),ternaryMass=3n**BigInt(k);
    const riceField=k===0?0n:2n**BigInt(k-1),riceThrough=2n**BigInt(k)-1n;
    return {
      round:k,
      sharedCounter:{decimal:String(k),binary:k.toString(2),ternary:k.toString(3),status:'SAME_INTEGER_DIFFERENT_RADIX_WRITINGS'},
      pascal:{layers:k+1,rowCells:k+1,row,rowSum:binaryMass,rule:'SUM_BINOMIAL_ROW_K=2^K'},
      trinomial:{layers:k+1,layerCells:(k+1)*(k+2)/2,coefficientSum:ternaryMass,rule:'SUM_TRINOMIAL_LAYER_K=3^K'},
      doubling:{fields:k,fieldMass:riceField,totalThroughField:riceThrough,field64:2n**63n,totalThrough64:2n**64n-1n},
      octagon:{vertices:8,openVertex:8,heldEdge:[8,1],turnDegrees:45,status:'OPEN_AT_8_DISPLAY_GAP'},
      iota:{offsetDegrees:offset,baseDegrees:45,displayDegrees:45+offset,status:'LOCAL_DISPLAY_OFFSET_NOT_OPERATOR'},
      yellowTriangles:[
        {id:'TOWER_CABLE',legs:[30,40],hypotenuse:50,status:'EXACT_3_4_5_SCALE'},
        {id:'IOTA_COMPARATOR',baseDegrees:45,offsetDegrees:offset,status:'ROTATED_DISPLAY_SHADOW'}
      ],
      tower:{measuredHeight:30,groundDistance:40,cableLength:50,sourceNarratedStorageFloors:32000,storageFloorClaimStatus:'TRANSCRIPT_NARRATION_NOT_DERIVED_HERE'},
      sourceBindings:['A0OE:PASCAL_PENTAGON_D5_TEST','A0-BL-050','A0_VV8_COUNTERPHASE_MODEL','SESSION_TRANSCRIPT_2026_11_08'],
      graphDelta:{nodes:0,relations:0,aliases:0,status:'ZERO_GRAPH_DELTA_EXISTING_A0_IDENTITY_REUSED'},
      typeBoundary:'PASCAL_LAYER != TRINOMIAL_LAYER != RADIX_WRITING != RICE_FIELD != PHYSICAL_TOWER_HEIGHT != IOTA_OFFSET != OCTAGON_GAP'
    };
  }
  function keystoneNewDayAudit(offsetSeconds=-300,microseconds=0){
    const offset=Number(offsetSeconds),micros=Number(microseconds);
    if(!Number.isInteger(offset)||offset<-300||offset>300) throw new TypeError('New Day offset must be an integer from -300 through 300 seconds');
    if(!Number.isInteger(micros)||micros<0||micros>999999) throw new TypeError('Microsecond offset must be an integer from 0 through 999999');
    const daySeconds=24*60*60;
    const wrappedSeconds=((offset%daySeconds)+daySeconds)%daySeconds;
    const hours=Math.floor(wrappedSeconds/3600),minutes=Math.floor((wrappedSeconds%3600)/60),seconds=wrappedSeconds%60;
    const pad=value=>String(value).padStart(2,'0');
    const frames=[
      {id:'t1',offsetSeconds:-300,label:'23:55:00',role:'FIVE_MINUTES_BEFORE_BOUNDARY'},
      {id:'t2',offsetSeconds:-60,label:'23:59:00',role:'FINAL_MINUTE'},
      {id:'t3',offsetSeconds:-1,label:'23:59:59',role:'FINAL_SECOND'},
      {id:'t4',offsetSeconds:0,label:'00:00:00',role:'IOTA_RESET_PIVOT'},
      {id:'t5',offsetSeconds:1,label:'00:00:01',role:'YUGO_POST_RESET_VIEW'}
    ];
    const closestFrame=frames.reduce((best,frame)=>Math.abs(frame.offsetSeconds-offset)<Math.abs(best.offsetSeconds-offset)?frame:best,frames[0]);
    return {
      offsetSeconds:offset,
      microseconds:micros,
      displayTime:`${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${String(micros).padStart(6,'0')}`,
      clockHands:{hourDegrees:(wrappedSeconds+micros/1e6)/120,minuteDegrees:((wrappedSeconds%3600)+micros/1e6)/10,secondDegrees:(seconds+micros/1e6)*6},
      frames,
      closestFrame,
      tower:{side:50,squareCells:50*50,keystone:1,total:50*50+1,factors:[41,61],formula:'L^2+1',doubling:[2501,5002,10004,20008]},
      primeOverlap:{yearString:'1997',split:['19','97'],suffixValue:97,primeIndex:25,primeValue:97,exact:isPrime(97)&&primeIndex(97)===25,status:'STRING_SUFFIX_AND_PRIME_ADDRESS_OVERLAP_ONLY'},
      neighborRegisters:{twentyFourPlusMinusOne:[23,25],imageCorridor:[24,25,26],status:'TWO_DECLARED_READINGS_NOT_ONE_OPERATOR'},
      geometry:{outerVertices:8,pentagons:2,pentagonVertices:5,tubeRole:'PRE_RESET_TO_POST_RESET_VIEW_CONNECTOR'},
      roles:{iota:'HELD_EVENT_PIVOT_AT_T4',yugo:'NORMALIZED_POST_RESET_DIRECTION_VIEW'},
      sourceBindings:['A0_BLUE_PINK_DODECA_CELL_RETURN#LUX','A0_RESEARCH_DESK#typed-symbol-and-address-addendum','A0OE:PRIME_STAIR','A0_YUGO_IOTA_PIVOT'],
      graphDelta:{nodes:0,relations:0,aliases:0,status:'ZERO_GRAPH_DELTA_EXISTING_A0_IDENTITY_REUSED'},
      typeBoundary:'TOWER_CELL_COUNT != KEYSTONE_ADDRESS != MOD2501_CARRIER != YEAR_STRING != PRIME_VALUE != PRIME_INDEX != CLOCK_STATE != IOTA_PIVOT != YUGO_DIRECTION'
    };
  }
  function primeGateGridAudit(){
    const seedField=seedFieldAudit();
    const gates=seedField.gateOrdinals.map((index,offset)=>{
      const prime=seedField.gatePrimes[offset],point=seedField.points[index-1],angleRadians=point.wheelDegrees*Math.PI/180;
      return {
        index,
        prime,
        sum:index+prime,
        indexMinusPrime:index-prime,
        primeMinusIndex:prime-index,
        product:index*prime,
        wheelDegrees:point.wheelDegrees,
        comparatorDegrees:point.goldenDegrees,
        driftDegrees:index*seedField.goldenComparator.perStepDifference,
        cosineProjection:{x:Math.cos(angleRadians),y:Math.sin(angleRadians)}
      };
    });
    return {
      gates,
      sums:gates.map(entry=>entry.sum),
      sumGaps:gates.slice(1).map((entry,index)=>entry.sum-gates[index].sum),
      signedDifferences:gates.map(entry=>entry.indexMinusPrime),
      reverseDifferences:gates.map(entry=>entry.primeMinusIndex),
      products:gates.map(entry=>entry.product),
      threads:gates.map((entry,lane)=>({lane:lane+1,index:entry.index,radius:142+lane*24,status:'SEPARATE_CONCENTRIC_DISPLAY_LANE'})),
      yellowTriangle:{source:'WHEEL_FIELD_R107_OVER_280',vertices:gates.map(entry=>entry.index)},
      greenShadow:{source:'GOLDEN_COMPARATOR_ONLY',driftDegrees:gates.map(entry=>entry.driftDegrees),status:'COMPARATOR_SHADOW_NOT_SECOND_GATE'},
      cosineStatus:'ANGLE_COORDINATE_PROJECTION_NOT_PRIME_LAW',
      graphDelta:{nodes:0,relations:0,aliases:0},
      arithmeticCorrections:['29-109=-80_NOT_-70','30-113=-83_NOT_-87'],
      typeBoundary:'PRIME_INDEX != PRIME_VALUE != SUM != SIGNED_DIFFERENCE != PRODUCT != COSINE_COORDINATE'
    };
  }
  function typedStartCrosswalkAudit(){
    const primeSeedIndex=7;
    const primeSeedValue=17;
    const gate=[107,109,113];
    const nBandRatio=((1+Math.sqrt(5))/2)**3/(Math.PI**2);
    const wheelComparator=3/7;
    const phase203=203;
    return {
      ep:{formatInches:7,rpm:45,role:'SOURCE_FORMAT_AND_ENTRY_POINT_NOT_NUMERIC_OPERATOR'},
      primeSeed:{index:primeSeedIndex,value:primeSeedValue,indexExact:primeIndex(primeSeedValue)===primeSeedIndex},
      gate:gate.map(value=>({value,index:primeIndex(value)})),
      gateStartIndexMultiple:primeIndex(gate[0])/primeSeedIndex,
      alpha33:{halfTurn:HALF_TURN,step:STEP,residual:ALPHA_RESIDUAL,degrees:360*ALPHA_RESIDUAL/MODULUS,closure:STEP+ALPHA_RESIDUAL===HALF_TURN},
      nBandComparator:{ratio:nBandRatio,wheelRatio:wheelComparator,difference:nBandRatio-wheelComparator,status:'NUMERIC_COMPARATOR_NOT_IDENTITY'},
      phase203:{source:phase203,unwrapped:phase203+STEP,wrapped:rotate(phase203),degrees:360*phase203/MODULUS,mirror:circleMirror(phase203),status:'OWNER_DECLARED_DECIMAL_SUFFIX_COMPARATOR_NOT_INTRINSIC'},
      typeBoundary:'EP_FORMAT != PRIME_SEED != PRIME_INDEX != WHEEL_PHASE'
    };
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
  function flyingCarpetAudit(mode='grid'){
    const modes=['grid','branch','spectrum'];
    if(!modes.includes(mode)) throw new TypeError('flying carpet mode must be grid, branch or spectrum');
    const stair=primeStairAudit();
    const points=stair.milestones.map((entry,index)=>({
      ...entry,
      cFreeLabel:C_FREE_STAIR_LABELS[index],
      gridU:entry.indexMod11,
      gridV:C_FREE_STAIR_LABELS[index]%11
    }));
    const yellowApertures=[points[0],points[4]].map(entry=>({
      prime:entry.prime,
      displayLabel:entry.cFreeLabel,
      visibleDifference:entry.prime-entry.cFreeLabel,
      relation:'VISUAL_SEPARATION_ONLY'
    }));
    return {
      mode,
      availableModes:modes,
      points,
      cubeAddress:{sourceWord:'101',nRegister:15,displayWord:'151',status:'OWNER_DECLARED_CUBE_ADDRESS_READING_NOT_ARITHMETIC_EQUALITY'},
      yellowApertures,
      orangeBranch:points.map(entry=>entry.prime),
      spectrumClasses:stair.mod9Classes,
      coordinateRule:'U = PRIME_INDEX_MOD_11; V = OWNER_DECLARED_C_FREE_LABEL_MOD_11',
      cFreeUniformRule:false,
      typeBoundary:'GRID_COORDINATE != PRIME_VALUE != C_FREE_DISPLAY_LABEL != CUBE_ADDRESS_GLYPH'
    };
  }
  function hingeOneAudit(mode='split'){
    const modes=['split','hedge','drip','glyphs'];
    if(!modes.includes(mode)) throw new TypeError('hinge-one mode must be split, hedge, drip or glyphs');
    const glyphs=[
      {slot:1,glyph:'*',colourRole:'PINK'},
      {slot:2,glyph:'#',colourRole:'PINK'},
      {slot:3,glyph:'Θ',colourRole:'YELLOW'},
      {slot:4,glyph:'ị',colourRole:'PINK'},
      {slot:5,glyph:'0',colourRole:'ORANGE'},
      {slot:6,glyph:'•',colourRole:'YELLOW'},
      {slot:7,glyph:'!',colourRole:'PINK'},
      {slot:8,glyph:'∧',colourRole:'PINK'},
      {slot:9,glyph:'Ж',colourRole:'YELLOW'}
    ];
    return {
      mode,
      availableModes:modes,
      hinge:{address:1,label:'H1',role:'OWNER_DECLARED_DISPLAY_HINGE',operationBound:false},
      partition:{upper:'PINK_HEDGE',lower:'YELLOW_DRIP',seam:'HINGE_1',status:'DISPLAY_PARTITION_ONLY'},
      pinkHedge:{mark:'×',markCount:60,turns:1,status:'OWNER_VISUAL_SAMPLE_NOT_PANTONE_BINDING'},
      yellowDrip:{dropCount:glyphs.length,source:'HINGE_1',target:'GLYPH_REGISTER',status:'DISPLAY_TRACE_ONLY'},
      glyphRegister:{rows:3,columns:3,glyphs,status:'OWNER_SUPPLIED_UNASSIGNED_DISPLAY_GLYPHS'},
      sourceBinding:{grid:'PBM:GRID11',carrier:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',addressGrammar:'QDC_ADDRESS_GRAMMAR_V2',majorPins:2,microPins:3,closureGlyph:'ị'},
      typeBoundary:'HINGE_ADDRESS != OPERATOR != HEDGE_MARK != YELLOW_DROP != GLYPH_MEANING'
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
  function eulerRingBreathAudit(step=140){
    step=Number(step);
    if(!Number.isInteger(step)||step<0||step>MODULUS) throw new TypeError('Euler ring breath step must be an integer from 0 through 280');
    const angle=goldenStepAudit();
    const relativeDegrees=step*angle.error;
    const normalizedAperture=2*Math.abs(Math.sin(relativeDegrees*Math.PI/360));
    return {
      step,
      floors:{lower:8,upper:5,total:13,closes:8+5===13},
      floorPrime:{value:13,index:primeIndex(13),exact:primeIndex(13)===6},
      addressBridge:{source:101,indexLift:primeIndex(13),target:107,exact:101+primeIndex(13)===107},
      primePath:[{value:101,index:primeIndex(101)},{value:103,index:primeIndex(103)},{value:107,index:primeIndex(107)}],
      primeGaps:[103-101,107-103],
      gapTotal:107-101,
      drift:{perStepDegrees:angle.error,relativeDegrees,normalizedAperture,terminalDegrees:MODULUS*angle.error},
      arithmeticBoundary:{threeTimesTwo:3*2,threeSquared:3**2,oneSquared:1**2,oneIsPrime:isPrime(1)},
      typeBoundary:'FLOOR_COUNT -> PRIME_INDEX -> ADDRESS_INCREMENT; VIEW_APERTURE_NOT_EULER_OPERATOR_OR_PHYSICAL_BREATH'
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
      seedField:seedFieldAudit(),
      nautilusStair:nautilusStairAudit(),
      primeGateGrid:primeGateGridAudit(),
      geometry:geometryAudit(),
      typedStartCrosswalk:typedStartCrosswalkAudit(),
      primeCorridor:primeCorridorAudit(),
      symmetric567:symmetric567Audit(),
      constructionLedger:constructionLedgerAudit(),
      q840:q840Audit(),
      binary20:binary20Audit(),
      primeStair:primeStairAudit(),
      flyingCarpet:flyingCarpetAudit(),
      hingeOne:hingeOneAudit(),
      ulamMilestones:ulamMilestoneAudit(),
      eulerRainbow:eulerRainbowAudit(),
      eulerRingBreath:eulerRingBreathAudit(),
      timegear:timegearAudit(),
      e8SpokeChoir:e8SpokeChoirAudit(),
      fiveTRllr:fiveTRllrAudit(),
      keystoneNewDay:keystoneNewDayAudit(),
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

  return {MODULUS,STEP,MIRROR_STEP,HALF_TURN,ALPHA_RESIDUAL,TRAIL_RADIUS,TRAIL_POINT_COUNT,INNER_RING_RADIUS,PRIME_CORRIDOR,PRIME_MILESTONES,EULER_HISTORICAL_FLOORS,EULER_CORRECTED_FLOORS,C_FREE_STAIR_LABELS,E8_COXETER_RADII,E8_PHI_PAIRS,mod,gcd,lcm,rotate,circleMirror,digitMirror,lift,isPrime,factors,primeIndex,orbit,goldenStepAudit,seedFieldAudit,nautilusStairAudit,octagonWobbleAudit,pascalStringTowerAudit,keystoneNewDayAudit,primeGateGridAudit,typedStartCrosswalkAudit,geometryAudit,primeCorridorAudit,symmetric567Audit,constructionLedgerAudit,q840Audit,binary20Audit,primeStairAudit,flyingCarpetAudit,hingeOneAudit,ulamCoordinate,ulamMilestoneAudit,eulerRainbowAudit,eulerRingBreathAudit,timegearAudit,e8SpokeChoirAudit,fiveTRllrAudit,exactAudit,createState,apply};
});
