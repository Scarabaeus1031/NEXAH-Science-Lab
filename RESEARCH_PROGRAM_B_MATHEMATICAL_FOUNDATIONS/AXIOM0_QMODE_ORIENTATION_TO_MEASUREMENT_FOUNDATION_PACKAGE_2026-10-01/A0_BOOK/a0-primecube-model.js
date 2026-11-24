(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeModel=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const VERSION='1.58.0';
  const MAX_N=1111;
  const GRID_COLUMNS=37;
  const CUBE_SIZE=11;
  const LAYER_AREA=CUBE_SIZE*CUBE_SIZE;
  const LAYER_CLOSURES=Object.freeze(Array.from({length:9},(_,i)=>(i+1)*LAYER_AREA));
  const GAP=Object.freeze({
    leftTwin:Object.freeze([659,661]),
    rightTwin:Object.freeze([809,811]),
    interiorStart:662,
    interiorEnd:808,
    span:148,
    label:'TWIN-CLUSTER GAP 661→809'
  });

  function isPrime(n){
    if(!Number.isInteger(n)||n<2)return false;
    if(n%2===0)return n===2;
    for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;
    return true;
  }

  function sieve(limit=MAX_N){
    const composite=new Uint8Array(limit+1),primes=[];
    for(let p=2;p<=limit;p++){
      if(composite[p])continue;
      primes.push(p);
      if(p*p<=limit)for(let k=p*p;k<=limit;k+=p)composite[k]=1;
    }
    return primes;
  }

  function divisors(n){
    if(!Number.isInteger(n)||n<1)return [];
    const low=[],high=[];
    for(let d=1;d*d<=n;d++)if(n%d===0){low.push(d);if(d*d!==n)high.push(n/d)}
    return low.concat(high.reverse());
  }

  function primeFactorization(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    let rest=n;const factors={};
    for(let p=2;p*p<=rest;p+=(p===2?1:2))while(rest%p===0){factors[p]=(factors[p]||0)+1;rest/=p}
    if(rest>1)factors[rest]=(factors[rest]||0)+1;
    const entries=Object.entries(factors).map(([prime,exponent])=>Object.freeze({prime:Number(prime),exponent}));
    return Object.freeze({
      factors:Object.freeze(entries),
      omegaDistinct:entries.length,
      bigOmegaTotal:entries.reduce((sum,item)=>sum+item.exponent,0),
      is7Smooth:entries.every(item=>item.prime<=7),
      exact:entries.length?entries.map(item=>`${item.prime}${item.exponent===1?'':`^${item.exponent}`}`).join(' · '):'1'
    });
  }

  function mod(n,m){return((n%m)+m)%m}
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=b;b=a%b;a=t}return a}
  function multiplicativeOrder(base,modulus){
    if(gcd(base,modulus)!==1)return null;
    let value=1;for(let k=1;k<=modulus;k++){value=mod(value*base,modulus);if(value===1)return k}
    return null;
  }
  function modularPower(base,exponent,modulus){let result=1,value=mod(base,modulus),power=exponent;while(power>0){if(power%2)result=mod(result*value,modulus);value=mod(value*value,modulus);power=Math.floor(power/2)}return result}
  function freezeGroups(groups){return Object.freeze(groups.map(group=>Object.freeze(group.slice())))}

  function constellationGroups(limit=MAX_N){
    const primes=sieve(limit),set=new Set(primes),twins=[],triplets=[],quadruplets=[];
    for(const p of primes){
      if(p+2<=limit&&set.has(p+2))twins.push([p,p+2]);
      if(p+6<=limit&&set.has(p+2)&&set.has(p+6))triplets.push([p,p+2,p+6]);
      if(p+6<=limit&&set.has(p+4)&&set.has(p+6))triplets.push([p,p+4,p+6]);
      if(p+8<=limit&&set.has(p+2)&&set.has(p+6)&&set.has(p+8))quadruplets.push([p,p+2,p+6,p+8]);
    }
    return Object.freeze({
      twins:freezeGroups(twins),
      triplets:freezeGroups(triplets),
      quadruplets:freezeGroups(quadruplets)
    });
  }

  function membership(groups){
    const out={twin:new Map(),triplet:new Map(),quadruplet:new Map()};
    for(const [kind,list] of Object.entries({twin:groups.twins,triplet:groups.triplets,quadruplet:groups.quadruplets})){
      list.forEach((group,index)=>group.forEach(n=>{
        if(!out[kind].has(n))out[kind].set(n,[]);
        out[kind].get(n).push(index);
      }));
    }
    return out;
  }

  function cubeAddress(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    const q=n-1;
    return Object.freeze({x:q%CUBE_SIZE,y:Math.floor(q/CUBE_SIZE)%CUBE_SIZE,z:Math.floor(q/(CUBE_SIZE*CUBE_SIZE))});
  }

  function cubeNumber(address){
    const {x,y,z}=address||{};
    if(![x,y,z].every(Number.isInteger)||x<0||x>=CUBE_SIZE||y<0||y>=CUBE_SIZE||z<0||z>9)return null;
    const n=1+x+CUBE_SIZE*y+CUBE_SIZE*CUBE_SIZE*z;
    return n<=MAX_N?n:null;
  }

  function gridAddress(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    return Object.freeze({column:(n-1)%GRID_COLUMNS,row:Math.floor((n-1)/GRID_COLUMNS)});
  }

  function residueRecord(n){
    return Object.freeze({mod30:mod(n,30),primeCorridor30:n>5&&[1,7,11,13,17,19,23,29].includes(mod(n,30))});
  }

  function toBase11(n){
    if(!Number.isInteger(n)||n<0)throw new RangeError('n must be a non-negative integer');
    if(n===0)return'0';
    const digits='0123456789A';let value=n,out='';
    while(value){out=digits[value%11]+out;value=Math.floor(value/11)}
    return out;
  }

  function diceAddress(n,diceCount=5){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    if(![5,6].includes(diceCount))throw new RangeError('diceCount must be 5 or 6');
    let q=n-1;const dice=[];
    for(let i=0;i<diceCount;i++){dice.push(q%6+1);q=Math.floor(q/6)}
    return Object.freeze(dice);
  }

  function diceNumber(dice){
    if(!Array.isArray(dice)||![5,6].includes(dice.length)||!dice.every(d=>Number.isInteger(d)&&d>=1&&d<=6))return null;
    const n=1+dice.reduce((sum,d,i)=>sum+(d-1)*6**i,0);
    return n<=MAX_N?n:null;
  }

  function hammingDistance(left,right){
    if(!Array.isArray(left)||!Array.isArray(right)||left.length!==right.length)throw new TypeError('equal-length arrays required');
    return left.reduce((distance,value,index)=>distance+(value===right[index]?0:1),0);
  }

  function hRecord(n,dataset){
    const data=dataset||buildDataset(),record=numberRecord(n,data),h5=diceAddress(n,5),h6=diceAddress(n,6);
    return Object.freeze({
      schema:'nexah.a0.h-record/1.0.0',recordId:`HREC:PC1111:N${String(n).padStart(4,'0')}`,
      source:Object.freeze({recordId:record.recordId,n}),
      registers:Object.freeze({primeRank:record.primeIndex,cube:record.sourceAddress,base11:record.base11,residue:Object.freeze({mod30:record.mod30,mod37:mod(n,37)})}),
      dice:Object.freeze({
        h5:Object.freeze({state:h5,orderedCapacity:6**5,return:diceNumber(h5)}),
        h6:Object.freeze({state:h6,orderedCapacity:6**6,return:diceNumber(h6)}),
        frame17:Object.freeze({inventory:'5 dice positions + 6 face labels + 6 orientation poles',count:17,status:'DECLARED_VIEW_INVENTORY_NO_IDENTITY'})
      }),
      provenance:Object.freeze({method:'SHA256_SOURCE_WITNESS',binding:'assets/a0-primecube-gap-fold-v1.json',boundary:'Hashes identify source artifacts; they are not geometric coordinates.'}),
      return:Object.freeze({method:'RETAINED_SOURCE_ID_OR_EXACT_DICE_DECODE',n,h5Exact:diceNumber(h5)===n,h6Exact:diceNumber(h6)===n}),
      boundary:'Prime rank, Base-11 cube address, dice state and SHA-256 provenance remain typed, non-identical registers.'
    });
  }

  function orientationPath(){
    const values=[787,797,809,811],primeRank=new Map(sieve(MAX_N).map((p,i)=>[p,i+1]));
    return Object.freeze(values.map((n,index)=>{
      const h5=diceAddress(n,5),h6=diceAddress(n,6),previous=index?values[index-1]:null;
      return Object.freeze({n,primeRank:primeRank.get(n)||null,cube:cubeAddress(n),h5,h6,deltaValue:previous?n-previous:null,h5Distance:previous?hammingDistance(diceAddress(previous,5),h5):null,h6Distance:previous?hammingDistance(diceAddress(previous,6),h6):null});
    }));
  }

  function layerClosureRecord(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    const isClosure=LAYER_CLOSURES.includes(n),multiplier=isClosure?n/LAYER_AREA:null,layerIndex=isClosure?multiplier-1:null;
    return Object.freeze({
      isClosure,multiplier,layerIndex,
      cubeAddress:cubeAddress(n),
      nBase11:toBase11(n),addressValue:n-1,addressBase11:toBase11(n-1),
      squareClosure:isClosure&&Number.isInteger(Math.sqrt(n)),
      negativeControl:isClosure&&!isPrime(n),
      factor:isClosure?'11²':'NONE',
      boundary:isClosure?'Guaranteed composite by the explicit factor 11²; structural layer closure, not a prime event.':'Not an 11² layer closure.'
    });
  }

  function carrierFillRecord(){
    const fullLayers=Math.floor(MAX_N/LAYER_AREA),partialLayerNodes=MAX_N%LAYER_AREA,fullCubeCapacity=CUBE_SIZE**3;
    return Object.freeze({fullLayers,partialLayerNodes,partialLayerIndex:fullLayers,fullCubeCapacity,unusedNodes:fullCubeCapacity-MAX_N});
  }

  function seamShadowRecord(){
    const n=10*LAYER_AREA,q=n-1;
    return Object.freeze({
      schema:'nexah.a0.primecube-seam-shadow/1.0.0',role:'EXTRAPOLATED_TENTH_LAYER_CLOSURE',
      n,multiplier:10,prime:false,factorization:'2 · 5 · 11²',
      grid:Object.freeze({column:q%GRID_COLUMNS,row:Math.floor(q/GRID_COLUMNS)}),
      extendedCube:Object.freeze({x:q%CUBE_SIZE,y:Math.floor(q/CUBE_SIZE)%CUBE_SIZE,z:Math.floor(q/LAYER_AREA)}),
      base11:Object.freeze({number:toBase11(n),address:toBase11(q)}),
      previousClosure:LAYER_CLOSURES.at(-1),carrierMax:MAX_N,missingFromCarrier:n-MAX_N,nextFullCubeClosure:CUBE_SIZE**3,
      carrierStatus:'OUTSIDE_1_TO_1111',
      boundary:'Extrapolated address on the exact 121-step seam rail. It is not a carrier record, prime, canonical Family node or observed body; connector polygons require a separately declared edge rule.'
    });
  }

  function gapPhase(n){
    if(n<=661)return Object.freeze({segment:'BEFORE',t:0});
    if(n>=809)return Object.freeze({segment:'AFTER',t:1});
    return Object.freeze({segment:'INTERIOR',t:(n-661)/148});
  }

  function rootGap(k){
    if(!Number.isInteger(k)||k<1||k>=MAX_N)throw new RangeError(`k must be 1..${MAX_N-1}`);
    const direct=Math.sqrt(k+1)-Math.sqrt(k),rationalized=1/(Math.sqrt(k+1)+Math.sqrt(k));
    return Object.freeze({k,exact:`√${k+1} − √${k}`,rationalizedExact:`1 / (√${k+1} + √${k})`,direct,rationalized,residual:direct-rationalized});
  }

  function cubeRootGap(k){
    if(!Number.isInteger(k)||k<1||k>=MAX_N)throw new RangeError(`k must be 1..${MAX_N-1}`);
    const a=Math.cbrt(k+1),b=Math.cbrt(k),direct=a-b,rationalized=1/(a*a+a*b+b*b);
    return Object.freeze({k,exact:`∛${k+1} − ∛${k}`,rationalizedExact:`1 / ((∛${k+1})² + ∛${k+1}·∛${k} + (∛${k})²)`,direct,rationalized,residual:direct-rationalized});
  }

  function rootRulerRecord(k){
    if(!Number.isInteger(k)||k<1||k>=MAX_N)throw new RangeError(`k must be 1..${MAX_N-1}`);
    const square=rootGap(k),cube=cubeRootGap(k),squareAsymptotic=1/(2*Math.sqrt(k)),cubeAsymptotic=1/(3*Math.cbrt(k*k));
    return Object.freeze({
      recordId:`ROOT-RULER:PC1111:K${String(k).padStart(4,'0')}`,k,
      square:Object.freeze({...square,asymptotic:squareAsymptotic,asymptoticRatio:square.direct/squareAsymptotic}),
      cube:Object.freeze({...cube,asymptotic:cubeAsymptotic,asymptoticRatio:cube.direct/cubeAsymptotic}),
      anchors:Object.freeze({rootroom:Object.freeze([2,5,7]),codonF1:Object.freeze([5,11,17]),perfectCubes:Object.freeze([8,27,64,125,216,343,512,729,1000])}),
      sourceOverlay:Object.freeze({tridentAnglesDegrees:Object.freeze([90,210,330]),separationDegrees:120,clockStepDegrees:30,role:'HISTORICAL_THREE_AXIS_READING_GUIDE_NO_NUMERIC_MAP'}),
      return:Object.freeze({method:'RETAINED_SOURCE_K',k,exact:true}),
      boundary:'Square-root and cube-root gaps are exact symbolic operators with Float64 display values. Rootroom anchors, CODON F1 values and the Trident three-axis guide remain separate source registers; no resonance, time-field, zeta-zero, quaternion or physical coupling is asserted.'
    });
  }

  function rootRecord(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    const next=n<MAX_N?rootGap(n):null;
    return Object.freeze({recordId:`ROOT1111:N${String(n).padStart(4,'0')}`,sourceNumber:n,exact:`√${n}`,approximation:Math.sqrt(n),nextGap:next,referenceAnchor:[2,5,7].includes(n),return:Object.freeze({method:'RETAINED_SOURCE_NUMBER',n,exact:true}),boundary:'The radical expression is exact. Decimal values and residuals are Float64 display approximations.'});
  }

  function theodorosRecord(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    let theta=0;for(let k=1;k<n;k++)theta+=Math.atan(1/Math.sqrt(k));
    const radius=Math.sqrt(n),base=Object.freeze([radius*Math.cos(theta),radius*Math.sin(theta)]),hasForward=n<MAX_N;
    const stepAngle=hasForward?Math.atan(1/radius):null,nextTheta=hasForward?theta+stepAngle:null,nextRadius=hasForward?Math.sqrt(n+1):null;
    return Object.freeze({
      n,legA:radius,legB:1,hypotenuse:nextRadius,stepAngle,cumulativeTheta:theta,
      base,tip:hasForward?Object.freeze([nextRadius*Math.cos(nextTheta),nextRadius*Math.sin(nextTheta)]):null,
      operatorDomain:hasForward?'INTERNAL_FORWARD_EDGE':'NO_FORWARD_NEIGHBOR_IN_CARRIER',
      return:Object.freeze({method:'RETAINED_SOURCE_NUMBER',n,exact:true}),
      boundary:'The triangle coordinates and angles are Float64 display values. Source return uses retained n; record 1111 has no internal forward edge.'
    });
  }

  function rootGeometryRecord(n){
    if(!Number.isInteger(n)||n<1||n>MAX_N)throw new RangeError(`n must be 1..${MAX_N}`);
    const root=Math.sqrt(n),m=Math.floor(root),intervalStart=m*m,mathematicalEnd=(m+1)**2,carrierEnd=Math.min(mathematicalEnd,MAX_N),primeRank=isPrime(n)?sieve(n).length:null;
    const square=Number.isInteger(root),seam=LAYER_CLOSURES.includes(n),doubleAnchor=seam&&square,cubeBridge=[1,64,729].includes(n);
    return Object.freeze({
      recordId:`ROOT-GEOMETRY:PC1111:N${String(n).padStart(4,'0')}`,sourceNumber:n,
      factorization:primeFactorization(n),root:Object.freeze({exact:`√${n}`,approximation:root,isIntegerAnchor:square}),
      squareInterval:Object.freeze({m,start:intervalStart,mathematicalEnd,carrierEnd,steps:2*m+1,complete:mathematicalEnd<=MAX_N,rootLength:Math.sqrt(carrierEnd)-m,telescoping:`Σ Δk = √${carrierEnd} − ${m}`}),
      registers:Object.freeze({layerSeam:seam,doubleAnchor,cubeBridge,primeRank,primeRail:primeRank===null?null:(primeRank%2?'ODD_RANK':'EVEN_RANK')}),
      triangle:theodorosRecord(n),cube:cubeAddress(n),
      return:Object.freeze({method:'RETAINED_SOURCE_NUMBER',n,address:cubeAddress(n),exact:true}),
      boundary:'Square interval, Base-11 seam, sixth-power bridge and prime-rank rail are separate predicates. The Theodoros coordinates are a display construction, not a new carrier address.'
    });
  }

  function squareSeamTriangleRecord(){
    const primes=sieve(MAX_N),squares=Array.from({length:Math.floor(Math.sqrt(MAX_N))},(_,i)=>(i+1)**2),intervals=Array.from({length:33},(_,i)=>{
      const m=i+1,start=m*m,mathematicalEnd=(m+1)**2,carrierEnd=Math.min(mathematicalEnd,MAX_N);
      return Object.freeze({m,start,mathematicalEnd,carrierEnd,steps:2*m+1,complete:mathematicalEnd<=MAX_N,rootLength:Math.sqrt(carrierEnd)-m});
    });
    const rail=parity=>Object.freeze(primes.map((n,i)=>Object.freeze({n,primeRank:i+1,root:Math.sqrt(n)})).filter(item=>(item.primeRank%2?'ODD_RANK':'EVEN_RANK')===parity));
    return Object.freeze({
      name:'SQUARE_SEAM_TRIANGLE_VIEW',carrier:Object.freeze({min:1,max:MAX_N,matrix:Object.freeze([101,11]),fullLayers:9,headRows:2,unusedTo11Cubed:220}),
      squares:Object.freeze(squares.map(n=>Object.freeze({n,root:Math.sqrt(n),cube:cubeAddress(n),layerSeam:LAYER_CLOSURES.includes(n),doubleAnchor:[121,484,1089].includes(n),cubeBridge:[1,64,729].includes(n)}))),
      intervals:Object.freeze(intervals),seamSquares:Object.freeze([121,484,1089]),cubeBridges:Object.freeze([1,64,729]),
      primeRails:Object.freeze({oddRank:rail('ODD_RANK'),evenRank:rail('EVEN_RANK')}),
      laws:Object.freeze({rootGap:'Δk = √(k+1) − √k = 1/(√(k+1)+√k)',telescoping:'Σ[k=a..b−1] Δk = √b − √a',unitInterval:'Σ[k=m²..(m+1)²−1] Δk = 1',triangle:'(√k)² + 1² = (√(k+1))²'}),
      return:'RETAINED_SOURCE_NUMBER',
      boundary:'The internal forward-root and L-triangle domain ends at k=1110. Record 1111 remains an exact carrier address but has no internal forward edge. Prime rails split prime rank parity, not prime-value parity; pi is not a root carrier.'
    });
  }

  function lokiChassisRecord(){
    const goldRoots=[1,8,27],greenRoots=[11,22,33];
    const layout=[
      {root:1,column:0,row:0},{root:8,column:1,row:0},{root:11,column:2,row:0},
      {root:33,column:0,row:1},{root:27,column:1,row:1},{root:22,column:2,row:1}
    ];
    const anchor=item=>Object.freeze({
      ...item,n:item.root**2,
      register:goldRoots.includes(item.root)?'SIXTH_POWER_BRIDGE':'SEAM_SQUARE',
      colorRole:goldRoots.includes(item.root)?'GOLD':'GREEN',
      cube:cubeAddress(item.root**2),return:Object.freeze({n:item.root**2,exact:true})
    });
    const edge=(a,b,role)=>Object.freeze({a,b,role});
    const sail=(id,roots,cell)=>Object.freeze({id,roots:Object.freeze(roots),cell,role:'SCREEN_TRIANGULATION'});
    return Object.freeze({
      name:'SPLINTER_SAIL_GRID',ownerViewLabel:'LOKI CHASSIS',
      topology:Object.freeze({
        layout:'2x3_LADDER',boundary:'C6',regularHexagon:false,
        boundaryCycle:Object.freeze([1,8,11,22,27,33]),
        gridEdges:Object.freeze([edge(1,8,'TOP'),edge(8,11,'TOP'),edge(33,27,'BOTTOM'),edge(27,22,'BOTTOM'),edge(1,33,'LEFT'),edge(8,27,'CENTRAL_RUNG'),edge(11,22,'RIGHT')]),
        diagonals:Object.freeze([edge(8,33,'LEFT_SPLINTER'),edge(11,27,'RIGHT_SPLINTER')]),
        sails:Object.freeze([sail('S1',[1,8,33],'LEFT'),sail('S2',[8,27,33],'LEFT'),sail('S3',[8,11,27],'RIGHT'),sail('S4',[11,22,27],'RIGHT')])
      }),
      anchors:Object.freeze(layout.map(anchor)),
      rootMean:Object.freeze({sum:102,count:6,value:17,equation:'(1+8+11+22+27+33)/6 = 17'}),
      inserts:Object.freeze([
        Object.freeze({id:'A',label:'(5²)³',equation:'(5²)³ = 5⁶ = 15625',value:15625,factorization:'5⁶',carrierStatus:'OUTSIDE_1111',role:'SIXTH_POWER_BRIDGE'}),
        Object.freeze({id:'B',label:'204²',equation:'204² = (12·17)² = 41616',value:41616,factorization:'2⁴ · 3² · 17²',carrierStatus:'OUTSIDE_1111',role:'SQUARE_INSERT'}),
        Object.freeze({id:'C',label:'24²+23²',equation:'(3·2³)² + 23² = 24² + 23² = 1105',value:1105,factorization:'5 · 13 · 17',carrierStatus:'INSIDE_1111',base11:'915',addressBase11:'914',cube:cubeAddress(1105),role:'CARRIER_INSERT'}),
        Object.freeze({id:'D',label:'1728+1',equation:'1728 + 1 = 1729 = 12³ + 1³ = 10³ + 9³',value:1729,factorization:'7 · 13 · 19',carrierStatus:'OUTSIDE_1111',role:'UNIT_CUBE_RETURN_CROSSWALK'})
      ]),
      qctrl:Object.freeze({role:'DECLARED_VIEW_CONTROLLER',defaultInsert:'C',operators:Object.freeze(['SELECT_INSERT','HIGHLIGHT_SAIL','RETURN_TO_SOURCE'])}),
      return:'RETAINED_ROOT_AND_SOURCE_NUMBER',
      boundary:'LOKI CHASSIS is a local Owner view label and is not the existing LOKI-Q4 identity. The boundary is a non-regular C6 drawn as a triangulated 2x3 ladder; its four sails are screen faces, not a proved 3D body. QCTRL selects a declared display state and does not create a mathematical identity.'
    });
  }

  function centeredPlateWindowRecord(){
    const windowSizes=Object.freeze([3,5,7,25].map(m=>Object.freeze({
      m,
      plateArea:m*m,
      fourPlates:4*m*m,
      center:1,
      count:4*m*m+1,
      pairedCount:2*(4*m*m+1)
    })));
    const axisPairs=Object.freeze([[1,7],[2,8],[3,9],[4,10],[5,11],[6,0]].map(pair=>Object.freeze(pair)));
    return Object.freeze({
      id:'PRIMECUBE_CENTERED_PLATE_WINDOW_VIEW',
      role:'BOUNDED_COUNT_AND_MOTION_VIEW',
      formula:'C(m)=4m^2+1',
      windowSizes,
      axisPairs,
      rounds:2,
      stepsPerRound:12,
      inspectionWindow:Object.freeze({side:5,addresses:25,role:'VISIBLE_ADDRESS_WINDOW_NOT_ADDED_TO_COUNT'}),
      slashCube:Object.freeze({role:'NUMBERMAGICK_TILT_ADAPTER_VIEW',source:'A0_NUMBERMAGICK_GRID_RESEARCH.html#pascal-bracket-tilt-projection',sourceContract:'0deg -> +60deg -> 0deg',localPhase:'theta_s=2*pi*s/12',return:'s=24 -> theta=4*pi -> DISPLAY_RETURN'}),
      sourceReuse:Object.freeze({
        mathfield:Object.freeze({route:'A0_MATHEMATICAL_JOINTS.html#ramanujan-pentagon-comparator',roles:Object.freeze(['CIKADA_CURTAIN','SCARAB_HULL','DRAGONFLY_010'])}),
        familyAtlas:Object.freeze({route:'A0_FAMILY_CONNECTION_ATLAS.html#start',role:'EXISTING_FAMILY_ELEVATOR',plate:'THETA_ORIENTATION_VIEW',phase:'F4_PHASE_DRIFT',topology:'F5_CONNECTIVITY_TOPOLOGY',boundary:'F5_TO_F4_IS_TYPED_NON_IDENTITY'}),
        caro:Object.freeze({route:'A0_ORIENTATION_CONTROLLER_BENCH.html#caroControlBench',role:'EXISTING_CARO_GREEN_MIRROR_CONTROLLER',plateRoute:'A0_ORIENTATION_CONTROLLER_BENCH.html#plateMirrorBench',boundary:'CARO_CHANNEL_AND_PLATE_VIEW_REMAIN_SEPARATE_SOURCE_ROLES'}),
        tilt:Object.freeze({route:'A0_NUMBERMAGICK_GRID_RESEARCH.html#pascal-bracket-tilt-projection',role:'EXISTING_TILT_OPERATOR_SOURCE'}),
        primeThread:Object.freeze({route:'A0_NUMBERMAGICK_GRID_RESEARCH.html#prime-torus-thread-demonstrator',rawTransitions:167,endpointWitnesses:2,reading:'167 RAW TRANSITIONS + ROOT/TARGET',root7:Object.freeze({thread:4,from:Object.freeze({prime:7,r7:0,r11:7}),to:Object.freeze({prime:11,r7:4,r11:0}),rawDelta:Object.freeze([4,-7]),wrappedDelta:Object.freeze([-3,4])})})
      }),
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE']),
      navigatorEffect:'NONE',
      boundary:'C(m) counts four m by m plates plus one shared center address. The visible 5 by 5 inspection window is a view into the selected plate family and is not added again. The paired channel doubles the selected count but does not merge two carriers. The Family Elevator supplies distinct source, orientation and boundary read positions; F4 phase/drift is not F5 topology. CARO/Green Mirror and the plate mirror remain separate existing controller roles. The slash body adapts the existing NumberMagick tilt connector; its 24-step phase is local display sampling, not a new operator. The Prime Thread contributes 167 transitions plus two visible endpoint witnesses, not 169 mathematical threads. No Cube, LOKI or Prime Family identity and no physical mechanism are asserted.'
    });
  }

  function splinterBookFoldRecord(angle=90,diagonalMode='SOURCE'){
    if(!Number.isFinite(angle)||angle<0||angle>180)throw new RangeError('angle must be finite and within 0..180 degrees');
    const modes=Object.freeze(['SOURCE','TRANSPORT','SYMMETRIC']);
    if(!modes.includes(diagonalMode))throw new RangeError(`diagonalMode must be one of ${modes.join(', ')}`);
    const halfOpeningDegrees=angle/2,radians=halfOpeningDegrees*Math.PI/180,s=Math.sin(radians),c=Math.cos(radians);
    const point=(x,y,z)=>Object.freeze({x,y,z});
    const coordinates=Object.freeze({
      1:point(-s,1,c),8:point(0,1,0),11:point(s,1,c),
      33:point(-s,-1,c),27:point(0,-1,0),22:point(s,-1,c)
    });
    const pair=(a,b)=>Object.freeze([a,b]);
    const diagonalSets=Object.freeze({
      SOURCE:Object.freeze([pair(8,33),pair(11,27)]),
      TRANSPORT:Object.freeze([pair(8,22),pair(1,27)]),
      SYMMETRIC:Object.freeze([pair(8,33),pair(8,22)])
    });
    return Object.freeze({
      name:'SPLINTER_BOOK_FOLD_PROBE',angleDegrees:angle,halfOpeningDegrees,
      preset:angle===180?'FLAT':angle===90?'ISO45':angle===0?'GLUE':'FREE',
      axis:Object.freeze([8,27]),coordinates,diagonalMode,diagonals:diagonalSets[diagonalMode],diagonalSets,
      closure:Object.freeze({map:Object.freeze({1:11,11:1,33:22,22:33,8:8,27:27}),cycles:'(1 11)(22 33)(8)(27)',involution:true,gluePairs:Object.freeze([pair(1,11),pair(33,22)]),glueDistance:2*s,axisDrift:0}),
      invariance:Object.freeze({source:false,sourceImage:'{8↔22, 1↔27}',sourceSymmetricDifference:4,symmetric:true}),
      return:Object.freeze({route:'FLAT → ACTIVE → FLAT',exact:true,maxCoordinateError:0}),
      arithmeticOverlay:Object.freeze({elevenRail:'11→22→33→44',iso45:'44+1=45',cornerFold:'33+45=78',triangular:'T12=78',diskReadings:Object.freeze(['78=7·10+8','78=6·12+6']),status:'OWNER_ARITHMETIC_OVERLAY_NOT_GEOMETRIC_DERIVATION'}),
      boundary:'This is a reversible screen-space book fold around the retained 8–27 rung. ISO45 names the 90-degree book opening with leaves at ±45 degrees. It does not prove a physical suspension, energy channel, LOKI identity or a derivation of 45 and 78 from the chassis.'
    });
  }

  function mathfieldCouplingDeckRecord(){
    const adapter=(id,label,status,operator,returnContract,identityReuse,href,boundary,extra={})=>Object.freeze({
      id,label,status,operator,returnContract,identityReuse:Object.freeze(identityReuse),href,boundary,...extra
    });
    return Object.freeze({
      name:'MATHFIELD_COUPLING_DECK',carrier:'SPLINTER_SAIL_GRID',defaultAdapter:'PENTAGON',
      adapters:Object.freeze([
        adapter('PENTAGON','Pentagon / Fold','BOUND_VIEW','PENT_UI:FOLD → COUPLING:TRIANGLES','UI_STATE_RETURN',['A0OE:PASCAL_PENTAGON_D5_TEST','ART:A0:MATHEMATICAL_JOINTS'],'A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html','Fivefold screen overlay on the retained six-anchor chassis; it does not identify the carriers.'),
        adapter('PENTAGON_CURTAIN','Pentagon / Gradient Curtain','SOURCE_BOUND_STATE_ADAPTER','C=(theta,gamma,phi,yaw,t) → GEOMETRY + VIEW + ILAU_AUDIT','PHI_TO_ZERO_REFERENCE_RETURN',['A0OE:PASCAL_PENTAGON_D5_TEST','ART:A0:MATHEMATICAL_JOINTS','MOD:NUMBER_VIEW_SUITE'],'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/lantern/NEXAH_PENTAGON_GELENKLATERNE_LAB.html#cockpitTitle','The adapter synchronizes a declared view state only. Theta is the relative frame rotation, gamma the hinge interior angle and phi the additional local curtain fold. Radix changes the address label, not the geometry. The red cap is a normalized residual envelope, not an added body or physical mushroom.',{stateSchema:'C=(theta,gamma,phi,yaw,t)',defaults:Object.freeze({theta:12.5,gamma:137,phi:0,yaw:10,t:1,radix:2}),radices:Object.freeze([2,3,4,5]),auditGrammar:'ILAU',redCapRole:'ABS_PHI_OVER_180_DISPLAY_ENVELOPE'}),
        adapter('ISO45_FOLD','ISO45 / ζ Fold','BOUNDED_FOLD_PROBE','BOOK_FOLD_AROUND_8_27','EXACT_VIEW_RETURN',['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS'],'DRAFTS/IOI_PRINCIPLE_90_DEGREE_FOLD_CANDIDATE.html','The 8–27 rung remains fixed while the two ladder cells open and close as a reversible book view. SOURCE, TRANSPORT and SYMMETRIC diagonals are separate tests; the arithmetic 45/78 overlay is not a geometric or physical derivation.',{defaultAngle:90,angleRange:Object.freeze([0,180]),presets:Object.freeze([180,90,0]),diagonalModes:Object.freeze(['SOURCE','TRANSPORT','SYMMETRIC'])}),
        adapter('SCARAB','Scarab / Hinge','BOUND_VIEW_OPEN_CROSS_MODE','SOURCE_BOUND_SIX_STATE_DISPLAY','SOURCE_CAMERA_RETURN',['ART:A0:MATHEMATICAL_JOINTS','MOD:ORIENTATION_DEMONSTRATORS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'],'A0_SCARAB_ORIGIN_MOBIUS_RAMANUJAN.html','The Scarab hinge is a display adapter. Its cross-mode kinematic map remains open and is not a physical mechanism.'),
        adapter('LOKI','LOKI / Tessarec','BOUNDED_DISPLAY_TEST','C7 × C8','EXACT_56_STEP_RETURN',['MOD:TESSAREC','ART:A0:MATHEMATICAL_JOINTS'],'A0_WERKBANK.html','Seven stations by eight orientations close after 56 display steps; the local Splinter Sail label does not become the LOKI identity.',{stations:7,orientations:8,period:56,returnState:Object.freeze([0,0])}),
        adapter('MIWA','MIWA / Observer','ROUTE_ONLY','NONE_ASSIGNED','EXPLICIT_NAV_RETURN',['ART:MIWA:MAIN','MOD:OBSERVATORY_MIWA'],'../../../SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html?a0BenchPreset=miwa-uranus','MIWA remains a separate observer and Uranus/Moons source view with its own controls; no shared operator or clock is asserted.'),
        adapter('FRACTAL','F / Mandelbrot ↔ Julia ↔ αβ','BOUND_STANDARD_AND_MEMORY_ITERATION','z(n+1) = z(n)² + c','RETAIN_c_PARAMETERS_AND_ITERATION_WINDOW',['MOD:NUMBER_VIEW_SUITE','A0_BLUE_PINK_DODECA_CELL_RETURN'],'A0_BLUE_PINK_DODECA_CELL_RETURN.html#formation','The standard quadratic family, the two-step alpha/beta memory recurrence and the Base-11 address crosswalk are separate readings. Same c does not identify parameter and dynamical planes; P=alpha+beta is a partition coordinate, not a conserved energy or stability bound. Non-escape through finite N is not proof of membership or interior, and no identity with Prime, Root or chassis registers is asserted.',{planes:Object.freeze(['C_PARAMETER_PLANE','Z_DYNAMICAL_PLANE']),escapeRadius:2,defaultIterations:100,presets:Object.freeze([Object.freeze({id:'interior',c:Object.freeze([-0.1087,0]),classification:'EXACT_INTERIOR'}),Object.freeze({id:'boundary',c:Object.freeze([-0.75,0]),classification:'EXACT_BOUNDARY'}),Object.freeze({id:'exterior',c:Object.freeze([0.26,0]),classification:'EXACT_EXTERIOR',escapeIteration:30})]),memory:Object.freeze({source:'DRAFTS/A0_BETA_RETURN_MANDELBROT_JULIA_DEMONSTRATOR_2026-11-14.html',operator:'z(n+1)=z(n)²+c+αz(n)+β(z(n)−z(n−1))',expanded:'z(n+1)=z(n)²+c+Pz(n)−βz(n−1)',partition:'P=α+β',state:'S(n)=(z(n),z(n−1))',classification:'COMPLEX_QUADRATIC_HENON_TYPE',traceLens:Object.freeze({visibleSteps:Object.freeze([0,39]),nodeCount:40,transient:Object.freeze([0,1,2,3]),primeSteps:Object.freeze([2,3,5,7,11,13,17,19,23,29,31,37]),superprimeSteps:Object.freeze([3,5,11,17,31]),shadowPair:Object.freeze([17,71]),shadowPairRecords:Object.freeze([Object.freeze({step:17,primeRank:7,superprime:true,cube:Object.freeze([5,1,0])}),Object.freeze({step:71,primeRank:20,superprime:false,cube:Object.freeze([4,6,0])})]),shadowOperator:'z_shadow(n)=2*z_axis-z(n)',axis:'ATTRACTING_FIXED_POINT_OR_TERMINAL_TRACE_ESTIMATE',addressBoundary:'Cube coordinates label the integer step index only; orbit values are generally non-integer and receive no Primecube address.',boundary:'The 3+1 transient, L shape, straight tail, 17|71 pair and shadow axis are declared trace readings. They do not define a 33- or 42-body, prime family, pyramid or cube identity.'}),boundary:'P is a coordinate on parameter space. Fixing P does not conserve energy, bound the orbit, or fix stability. Fixed points depend on alpha because the beta difference vanishes at a fixed point.'}),cubeCrosswalk:Object.freeze({selected:661,numberBase11:'551',addressBase11:'550',cube:Object.freeze([0,5,5]),numberDigitSum:11,columnWall:'x=10 => n=11(1+y+11z); only n=11 can be prime',externalDoubling:Object.freeze([Object.freeze({n:2501,base11:'1974',mod11:4}),Object.freeze({n:5002,base11:'3838',mod11:8}),Object.freeze({n:10004,base11:'7575',mod11:5})]),boundary:'The cube address is computed from retained integer n only. It is synchronized with the fractal controls as a comparison view, not derived from c, alpha, beta or orbit geometry.'})}),
        adapter('URANUS_SPOOL','Uranus Moons / Spool','HOLD_UNBOUND_OPERATOR','UNDEFINED','OPEN',[],'','The coil is a schematic intake only. Moon order, winding function, direction, period and return predicate must be declared before binding.',{requirements:Object.freeze(['ORDERED_MOON_SET','WINDING_FUNCTION w(i)','DIRECTION_AND_ORIENTATION','PERIOD','RETURN_PREDICATE'])})
      ]),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'This deck is a typed view switch over one retained screen chassis. It neither merges Pentagon, ISO45/zeta fold, Scarab, LOKI, MIWA and lunar-source identities nor asserts one shared mechanism, topology, carrier, clock, physical suspension or astronomical law.'
    });
  }

  function pentagonCurtainControlRecord(theta=12.5,gamma=137,phi=0,yaw=10,t=1,radix=2){
    theta=Number(theta);gamma=Number(gamma);phi=Number(phi);yaw=Number(yaw);t=Number(t);radix=Math.trunc(Number(radix));
    if(![theta,gamma,phi,yaw,t].every(Number.isFinite)||Math.abs(theta)>85||gamma<0||gamma>180||Math.abs(phi)>180||t<0||t>1||![2,3,4,5].includes(radix))throw new RangeError('Curtain state outside declared control bounds');
    const toRad=degrees=>degrees*Math.PI/180,side=1,length=1,beta=180-gamma;
    const circumradius=side/(2*Math.sin(toRad(36))),chord=length*Math.cos(toRad(beta)/2),heightSquared=chord*chord-4*circumradius*circumradius*Math.sin(toRad(theta)/2)**2;
    const valid=heightSquared>=-1e-10,height=valid?Math.sqrt(Math.max(0,heightSquared)):null,limit=2*Math.asin(Math.min(1,chord/(2*circumradius)))*180/Math.PI;
    const capAmplitude=Math.abs(phi)/180,returned=Math.abs(phi)<1e-12;
    const quantized=Math.round(t*(radix**5-1)),address=quantized.toString(radix).padStart(5,'0');
    return Object.freeze({
      name:'PENTAGON_GRADIENT_CURTAIN_CONTROL',schema:'nexah.a0.pentagon-curtain-control/1.0.0',
      state:Object.freeze({theta,gamma,phi,yaw,t,radix}),geometry:Object.freeze({valid,side,length,beta,circumradius,chord,height,heightSquared,thetaLimit:limit,parallelCoaxialModel:true}),
      timeline:Object.freeze({phase:t,foldApplied:phi*t,yawApplied:yaw*t,frameAndHingeAnimated:false}),
      addressCodec:Object.freeze({radix,digits:5,value:quantized,address,role:'VIEW_ADDRESS_ONLY_NOT_GEOMETRY'}),
      residual:Object.freeze({redCapAmplitude:capAmplitude,blueCapAmplitude:-capAmplitude,zeroLine:0,role:'NORMALIZED_DISPLAY_ENVELOPE',seamMetric:'MEASURED_ONLY_IN_SOURCE_COCKPIT'}),
      ilau:Object.freeze({I:valid?'DECLARED_STATE_RETAINED':'INVALID_GEOMETRY',L:'NO_SOURCE_GEOMETRY_REMOVED',A:capAmplitude>0?'RED_BLUE_CAP_OVERLAY':'NONE',U:valid?'LOCAL_SEAM_AND_COLLISION_REQUIRE_SOURCE_COCKPIT':'GEOMETRY_UNRESOLVED'}),
      return:Object.freeze({predicate:'phi=0 relative to captured reference',returned,route:'REFERENCE → FOLD → REFERENCE',exactViewReturn:returned}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'This record couples controls and audit roles, not identities or mechanisms. Radix 2/3/4/5 is a representation codec. Red and blue caps visualize a normalized fold envelope; source seam gaps, rigidity errors and collisions must be measured in the full Pentagon cockpit.'
    });
  }

  function alphaBetaFixedPointRecord(alpha=.125,beta=.125,c=-.5){
    for(const [name,value] of Object.entries({alpha,beta,c}))if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);
    const discriminant=(1-alpha)*(1-alpha)-4*c;
    const real=discriminant>=0;
    const roots=real?Object.freeze([(1-alpha-Math.sqrt(discriminant))/2,(1-alpha+Math.sqrt(discriminant))/2]):Object.freeze([]);
    const selected=real?roots[0]:null,magnitude=selected===null?null:Math.abs(selected),p=alpha+beta;
    const localState=(fixedPoint,index)=>{
      const A=2*fixedPoint+p,determinant=beta,eigenDiscriminant=A*A-4*determinant;
      const eigenvalues=eigenDiscriminant>=0
        ?Object.freeze([(A+Math.sqrt(eigenDiscriminant))/2,(A-Math.sqrt(eigenDiscriminant))/2])
        :Object.freeze([{real:A/2,imaginary:Math.sqrt(-eigenDiscriminant)/2},{real:A/2,imaginary:-Math.sqrt(-eigenDiscriminant)/2}].map(Object.freeze));
      const spectralRadius=eigenDiscriminant>=0?Math.max(...eigenvalues.map(Math.abs)):Math.sqrt(Math.abs(determinant));
      const eigenvectors=eigenDiscriminant>=0?Object.freeze(eigenvalues.map(lambda=>{
        const norm=Math.hypot(lambda,1);
        return Object.freeze({lambda,x:lambda/norm,y:1/norm,u:(lambda+1)/(Math.SQRT2*norm),v:(lambda-1)/(Math.SQRT2*norm)});
      })):Object.freeze([]);
      return Object.freeze({index,fixedPoint,A,jacobian:Object.freeze([[A,-beta],[1,0]].map(Object.freeze)),trace:A,determinant,eigenDiscriminant,eigenvalues,eigenvectors,spectralRadius,classification:spectralRadius<1?'ATTRACTING':'NOT_ATTRACTING',eigenType:eigenDiscriminant>=0?'REAL_SPLIT':'COMPLEX_PAIR',commonDifferenceMatrix:Object.freeze([[A-beta+1,A+beta+1],[A-beta-1,A+beta-1]].map(row=>Object.freeze(row.map(value=>value/2))))});
    };
    const localStates=real?Object.freeze(roots.map(localState)):Object.freeze([]),selectedState=real?localStates[0]:null;
    const bandValues=Object.freeze([.429,.456,.487]);
    const bands=Object.freeze(bandValues.map(value=>Object.freeze({
      id:`BAND_0.${String(value).split('.')[1]}`,value,positive:value,negative:-value,
      deltaFromFixedMagnitude:magnitude===null?null:value-magnitude,
      deltaFromNegativeFixedPoint:selected===null?null:Math.abs(selected+value)
    })));
    const defaultSlice=Math.abs(alpha-.125)<1e-12&&Math.abs(beta-.125)<1e-12&&Math.abs(c+.5)<1e-12;
    return Object.freeze({
      name:'ALPHA_BETA_FIXED_POINT_BAND_COMPARATOR',operator:'z(n+1)=z(n)^2+c+alpha*z(n)+beta*(z(n)-z(n-1))',
      parameters:Object.freeze({alpha,beta,c,p}),equation:'z*² + (alpha−1)z* + c = 0',
      betaCancellation:'At z(n)=z(n−1)=z*, beta*(z(n)−z(n−1))=0; beta changes stability, not fixed-point location.',
      discriminant,real,roots,selected,magnitude,
      exact:defaultSlice?Object.freeze({negative:'(7−√177)/16',positive:'(7+√177)/16',field:'Q(√177)',minimalPolynomial:'8z²−7z−4=0'}):null,
      transforms:selected===null?null:Object.freeze({square:selected*selected,squareExact:defaultSlice?'(113−7√177)/128':null,squareRootOfMagnitude:Math.sqrt(magnitude),mirror:-selected}),
      stability:selectedState?Object.freeze({jacobian:'[[2z*+alpha+beta, −beta],[1,0]]',trace:selectedState.trace,determinant:selectedState.determinant,eigenDiscriminant:selectedState.eigenDiscriminant,eigenvalues:selectedState.eigenvalues,spectralRadius:selectedState.spectralRadius,classification:selectedState.classification}):Object.freeze({jacobian:'[[2z*+alpha+beta, −beta],[1,0]]',trace:null,determinant:beta,eigenDiscriminant:null,eigenvalues:Object.freeze([]),spectralRadius:null,classification:'NOT_EVALUATED'}),
      stateSpace:Object.freeze({coordinates:Object.freeze({memory:Object.freeze(['delta_z_n','delta_z_(n-1)']),commonDifference:Object.freeze(['u=(delta_z_n+delta_z_(n-1))/sqrt(2)','v=(delta_z_n-delta_z_(n-1))/sqrt(2)'])}),localStates,role:'REAL_LOCAL_LINEARIZATION',complexBoundary:'The full complex two-step recurrence is four-dimensional over R. This two-axis view is a real local slice, not the imaginary plane or a global basin.'}),
      bands,declared478:Object.freeze({value:.478,status:'NEGATIVE_CONTROL_NOT_A_BOUND_BAND',nearestBoundBand:.487,delta:.009}),
      sourceBoundary:'BAND_0.429, BAND_0.456 and BAND_0.487 are retained Breathing Crystal display nodes. Their symmetric +/- placement is a comparator view, not an identity with the alpha/beta fixed point. BAND_0.478 is not present in the bound source.'
    });
  }

  function transversalPlaneScienceReturnRecord(){
    const classify=(zBefore,zAfter,normalVelocity)=>{
      if(![zBefore,zAfter,normalVelocity].every(Number.isFinite))return 'UNDEFINED_INPUT';
      if(zBefore*zAfter<0&&normalVelocity!==0)return 'TRANSVERSAL_CROSSING';
      if(zBefore===0||zAfter===0)return normalVelocity===0?'NONTRANSVERSAL_CONTACT':'BOUNDARY_SAMPLE_REQUIRES_TWO_SIDED_SIGN';
      return 'NO_CROSSING';
    };
    return Object.freeze({
      id:'PRIMECUBE_BOUNDARY_TRANSVERSAL_PLANE_RETURN',
      plane:Object.freeze({symbol:'Pi_T',equation:'z=0',normal:Object.freeze([0,0,1]),role:'DECLARED_TYPE_AND_RETURN_CROSS_SECTION'}),
      crossingPredicate:'z_before*z_after<0 AND dz/dt!=0',
      controls:Object.freeze({crossing:classify(-1,1,2),tangent:classify(0,0,0),sameSide:classify(1,2,1)}),
      registers:Object.freeze(['EXACT','BUILT','READING','HOLD','NEXT_TEST']),
      routes:Object.freeze({scienceDesk:'A0_RESEARCH_DESK.html#primecube-boundary-series-return-20261123',sourceNote:'A0_PRIMECUBE_BOUNDARY_SERIES_SCIENCE_DESK_RETURN_2026-11-23.md',receipt:'results/a0-primecube-boundary-series-science-desk-return-2026-11-23.json'}),
      distinction:'TRANSVERSAL_PLANE_NOT_RIEMANN_CRITICAL_LINE_NOT_ROOT_AXIS_LINE',
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,aliases:0,studies:0,findings:0}),
      classify
    });
  }

  function wheelGate13Record(step=0){
    const displayStep=Math.max(0,Math.min(729,Math.trunc(Number(step)||0)));
    const operatorStep=displayStep===729?728:displayStep;
    const goldbachPairs=Object.freeze([[23,197],[29,191],[41,179],[47,173],[53,167],[71,149],[83,137],[89,131],[107,113]].map(pair=>Object.freeze(pair)));
    const classification=displayStep===729?'CLOSURE_PLUS_ONE_TO_729':operatorStep===728?'TRIPLE_RETURN':operatorStep===56?'PAIR_RETURN_GATE13_OPEN':'IN_FLIGHT';
    return Object.freeze({
      id:'PRIMECUBE_W7_W8_G13_TRIPLE_RETURN',
      carrier:'Z7 x Z8 x Z13',cardinality:728,displayStep,operatorStep,classification,
      operators:Object.freeze({wheel7:'n -> n+1 mod 7',wheel8:'n -> n-1 mod 8',gate13:'n -> n+1 mod 13'}),
      periods:Object.freeze({wheel7:7,wheel8:8,gate13:13,pairReturn:56,tripleReturn:728}),
      state:Object.freeze({wheel7:operatorStep%7,wheel8:mod(-operatorStep,8),gate13:operatorStep%13}),
      projections:Object.freeze({
        top:Object.freeze({id:'TOP_IJ',role:'REGISTER_PLAN_VIEW',axes:Object.freeze(['i','j'])}),
        side:Object.freeze({id:'SIDE_IK',role:'CARRIER_DEPTH_VIEW',axes:Object.freeze(['i','k'])}),
        transversal:Object.freeze({id:'TRANSVERSAL_PI_T',role:'DECLARED_SAMPLING_RETURN_PLANE',equation:'z=0'})
      }),
      observerMarker:Object.freeze({id:'RED_BALLOON',role:'SELECTED_SOURCE_OBSERVER_MARKER',changesState:false,changesOperator:false,evidence:'DISPLAY_ONLY'}),
      partialReturn:Object.freeze({step:56,state:Object.freeze({wheel7:0,wheel8:0,gate13:4}),status:'PAIR_CLOSED_GATE13_OPEN'}),
      closure729:Object.freeze({value:729,equalities:Object.freeze(['728+1','9^3','27^2','3^6']),role:'EXTERNAL_CLOSURE_MARKER_NOT_OPERATOR_PERIOD'}),
      factor1729:Object.freeze({value:1729,factors:Object.freeze([7,13,19]),wheel8IsFactor:false,status:'WHEEL7_AND_GATE13_FACTOR_CROSSWALK_ONLY'}),
      shadow220:Object.freeze({left:83,right:137,sum:220,envelope:'1331-1111',primePairCount:goldbachPairs.length,unique:false,pairs:goldbachPairs,status:'EXACT_NON_UNIQUE_COMPARATOR'}),
      historicalLabels:Object.freeze({wheel7:'Wheel 7 (1729-Kreis)',wheel8:'Wheel 8 (1836-Kreis)',gate13:'Quaternion Gate',status:'SOURCE_LABEL_HOLD'}),
      sourceBinding:Object.freeze({family:'FAM-002',role:'OBSERVED_3D_ASSET_UNREVIEWED',existingSurface:'A0_GAME_OF_WORLDS_PLAY.html#hexaptychon'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,aliases:0,studies:0,findings:0}),
      boundary:'Finite product-state adapter only. Historical labels do not establish quaternion algebra, a Riemann/Zeta mechanism, physical resonance or a unique 83+137 pairing.'
    });
  }

  function contractDemoCoverageRecord(){
    const item=(id,label,target,action)=>Object.freeze({id,label,target,action:Object.freeze(action),status:'DEMO_BOUND'});
    const items=Object.freeze([
      item('Q_CRT','Q / T20± CRT cuboid','primecube-workbench',{view:'qcube'}),
      item('UNIT_ROOT_SHEAR','Unit / Root / Shear','primecube-workbench',{view:'measure'}),
      item('PRIME_LASSO','60-Prime-Lasso + decimal crosswalk','primecube-workbench',{view:'qcube'}),
      item('V_PEAK_496','V-peak 496|12','primecube-workbench',{view:'qcube',source:496}),
      item('ORBIT_BARCODE','Coupled grids / barcode','coupled-orbit-demonstrator',{anchor:true}),
      item('SPLINTER_SAIL','Splinter Sail / local Loki view','loki-chassis',{anchor:true}),
      item('CARRIER','Frozen carrier','primecube-workbench',{view:'cube'}),
      item('SHADOW_ENVELOPE','Shadow Cube / full 11^3 envelope','shadow-cube-envelope',{anchor:true}),
      item('PACKING_VIEWS','Z-slices / 101-20 mask extrusion / full envelope','shadow-cube-envelope',{anchor:true}),
      item('ROOT_TOPOLOGY_GATE','Critical line / Root topology gate','critical-line-root-topology-gate',{anchor:true}),
      item('THOTH_AUA_KNOT','THOTH / AUA axis-knot gate','thoth-aua-khipu-ledger',{anchor:true,mode:'OVER'}),
      item('KHIPU_LEDGER','Khipu generation ledger','thoth-aua-khipu-ledger',{anchor:true,generation:'G2'}),
      item('SZ_CHIRALITY','S/Z polar and alpha-beta chirality lab','sz-chirality-invariant-lab',{anchor:true,mode:'POLAR'}),
      item('REVIEWER_PACKET','Paper C/E/F figures + five-stage reviewer receipt','primecube-reviewer-packet',{anchor:true,figure:'PC-RF-C-01',stage:1}),
      item('BIG_BIRD_25_13','25/13 Big Bird owner window','sz-chirality-invariant-lab',{anchor:true,mode:'WINDOW_25_13'}),
      item('ADDRESS_RETURN','Address / exact Return','primecube-workbench',{view:'grid'}),
      item('SEAMS','11² layer closures + shadow','primecube-workbench',{view:'cube',filter:'seam'}),
      item('RDMH','RDMH provenance lane','primecube-workbench',{view:'grid',filter:'seam'}),
      item('GAP_FOLD','Distributed gap fold','primecube-workbench',{view:'fold',filter:'gap'}),
      item('HINGE_661','Transition + rigid 661 hinge','primecube-workbench',{view:'hinge',source:661}),
      item('DUAL_GRID','Dual-grid orientation','primecube-workbench',{view:'orientation'}),
      item('ROOT_RULER','Root Ruler','primecube-workbench',{view:'root'}),
      item('ROOT_GEOMETRY','Square–Seam–Triangle','primecube-workbench',{view:'geometry',source:121}),
      item('SLICE_ATLAS','Base-11 Slice Atlas','primecube-workbench',{view:'slice'}),
      item('EULER_COMPASS','Euler Compass','primecube-workbench',{view:'euler'}),
      item('H_RECORD','Typed H-Record','hrecord-crosswalk',{anchor:true}),
      item('MATHFIELD','Mathfield Coupling Deck','mathfield-coupling-deck',{adapter:'PENTAGON'}),
      item('W11_W12_W13','W11 / W12 seam / W13 sequence','primecube-window-11-12-13-sequence',{anchor:true,step:0}),
      item('TRANSVERSAL_RETURN','Primecube Boundary Series / transversal plane return','primecube-boundary-transversal-plane-return',{anchor:true}),
      item('W7_W8_G13','Wheel 7 / Wheel 8 / Gate 13 triple return','primecube-wheel-7-8-gate13-demonstrator',{anchor:true,step:728}),
      item('SCARAB_CONTROL','Scarab control lens / Fold 108','scarab-control-lens',{anchor:true}),
      item('DIRECT_FIELD','Direct Mandelbrot / alpha-beta field','mandelbrot-memory-field',{anchor:true}),
      item('AL_JABR_DOT','Al-Jabr lens / typed dot operators','al-jabr-dot-lens',{anchor:true}),
      item('VIEW_INVARIANCE_AUDIT','View-invariance audit / ILAU matrix','view-invariance-audit',{anchor:true,control:'BASELINE'}),
      item('MEMORY_TRACE','Memory trace + shadow lens','mathfield-coupling-deck',{adapter:'FRACTAL',fractalMode:'memory'}),
      item('FIXED_POINT_BANDS','Fixed point / +/- N-band comparator','fixed-point-nband-demonstrator',{anchor:true})
    ]);
    return Object.freeze({name:'PRIMECUBE_CONTRACT_DEMO_COVERAGE',contract:'A0_PRIMECUBE_GAP_FOLD_CONTRACT_2026-11-21.md',items,count:items.length,boundCount:items.filter(entry=>entry.status==='DEMO_BOUND').length,gate:'EVERY_CONTRACT_MODULE_HAS_AN_INSPECTABLE_DEMO',navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0})});
  }

  function fullCubeAddress(n){
    if(!Number.isInteger(n)||n<1||n>CUBE_SIZE**3)throw new RangeError(`n must be 1..${CUBE_SIZE**3}`);
    const i=n-1;
    return Object.freeze({x:i%CUBE_SIZE,y:Math.floor(i/CUBE_SIZE)%CUBE_SIZE,z:Math.floor(i/LAYER_AREA)});
  }

  function shadowCubeEnvelopeRecord(reach=220){
    const capacity=CUBE_SIZE**3,carrierLast=MAX_N,shadowFirst=carrierLast+1,shadowCount=capacity-carrierLast;
    const revealed=Math.max(0,Math.min(shadowCount,Math.trunc(Number(reach)||0)));
    const shadow=Object.freeze(Array.from({length:shadowCount},(_,index)=>{
      const n=shadowFirst+index,address=fullCubeAddress(n);
      return Object.freeze({n,address,base11:toBase11(n),addressBase11:toBase11(n-1),segment:n<=1210?'LAYER_10_REMAINDER':'LAYER_11_FULL',recordStatus:'ADDRESS_ONLY_RECORD_ABSENT'});
    }));
    return Object.freeze({
      name:'PRIMECUBE_SHADOW_ENVELOPE_VIEW',
      cube:Object.freeze({shape:Object.freeze([11,11,11]),capacity,carrierCount:carrierLast,shadowCount}),
      split:Object.freeze({carrier:Object.freeze([1,carrierLast]),shadow:Object.freeze([shadowFirst,capacity]),layer10Remainder:Object.freeze([shadowFirst,1210]),layer10RemainderCount:99,layer11:Object.freeze([1211,capacity]),layer11Count:121}),
      checkpoints:Object.freeze([
        Object.freeze({n:1111,address:fullCubeAddress(1111),role:'CARRIER_LAST'}),
        Object.freeze({n:1112,address:fullCubeAddress(1112),role:'SHADOW_FIRST'}),
        Object.freeze({n:1210,address:fullCubeAddress(1210),role:'SHADOW_CLOSURE_10x121'}),
        Object.freeze({n:1211,address:fullCubeAddress(1211),role:'ELEVENTH_LAYER_FIRST'}),
        Object.freeze({n:1331,address:fullCubeAddress(1331),role:'FULL_11_CUBED_CLOSURE'})
      ]),
      shadow,revealed,visibleShadow:Object.freeze(shadow.slice(0,revealed)),
      volumeBalance:Object.freeze({
        full:Object.freeze({equation:'1331=11*121',value:1331}),
        carrier:Object.freeze({equation:'1111=11*101',value:1111,ratio:1111/1331,reducedRatio:'101/121'}),
        shadow:Object.freeze({equation:'220=11*20',value:220,ratio:220/1331,reducedRatio:'20/121'}),
        mask:Object.freeze({selected:101,crossArm:20,total:121,depth:11,equation:'(101+20)*11=1331'}),
        cosineComparator:Object.freeze({value:-.834,absoluteGap:Math.abs(101/121-.834),status:'SEPARATE_TRIGONOMETRIC_INPUT_NOT_EQUAL'})
      }),
      packingViews:Object.freeze([
        Object.freeze({id:'z-slices',label:'Z-SLICES',carrier:'9*121+22',shadow:'99+121',equation:'9*121+22+99+121=1331',addressing:'NATIVE_BASE11_ORDER'}),
        Object.freeze({id:'mask-extrusion',label:'101/20 MASK EXTRUSION',carrier:'101*11',shadow:'20*11',equation:'101*11+20*11=1331',addressing:'DECLARED_REPACKING_VIEW_NOT_NATIVE_ADDRESS_OCCUPANCY'}),
        Object.freeze({id:'full-envelope',label:'FULL ENVELOPE',carrier:'1111',shadow:'220',equation:'1111+220=1331',addressing:'NATIVE_ADDRESS_ENVELOPE'})
      ]),
      reach:Object.freeze({operator:'.',notation:'1111 . 1112',meaning:'DECLARED_CARRIER_TO_ADDRESS_ONLY_VIEW_TRANSITION',step:11,max:220}),
      fingers:Object.freeze({notation:'5 + . + 5 = 11',left:Object.freeze([0,1,2,3,4]),dot:5,right:Object.freeze([6,7,8,9,10]),role:'DISPLAY_AXIS_PARTITION'}),
      cikada:Object.freeze({tokens:Object.freeze(['CI','KA','DA']),states:Object.freeze(['INSIDE_CARRIER','OUTSIDE_CARRIER_INSIDE_ENVELOPE','INSIDE_PRIME_PROJECTION']),addresses:Object.freeze([1111,1112,1331]),return:'ENVELOPE_PROJECTION_RETURN_NOT_CARRIER_REENTRY'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'Addresses 1112..1331 exist only in the completed 11x11x11 display envelope. They are not Primecube carrier records and receive no primality, constellation, measurement, Family or evidence state. The growing path is a sequential address trace, not a biological, physical or topological object.'
    });
  }

  function criticalLineRootTopologyRecord(options={}){
    const radius=Math.max(0,Math.min(5,Number(options.radius??2)));
    const height=Math.max(-3,Math.min(3,Number(options.height??.75)));
    const turns=Math.max(-3,Math.min(3,Math.trunc(Number(options.turns??1))))||1;
    const slice=Math.max(1,Math.min(12,Math.trunc(Number(options.slice??5))||5));
    const crossing=Boolean(options.crossing);
    const samples=Object.freeze(Array.from({length:97},(_,index)=>{
      const t=2*Math.PI*index/96,radial=crossing?radius*Math.abs(Math.sin(t/2)):radius;
      return Object.freeze({t,x:radial*Math.cos(turns*t),y:radial*Math.sin(turns*t),h:height*Math.sin(t),rho:radial,phiDefined:radial>1e-12});
    }));
    const rootRadius=Math.sqrt(slice),nextRootRadius=Math.sqrt(slice+1),delta=nextRootRadius-rootRadius;
    return Object.freeze({
      name:'CRITICAL_LINE_ROOT_TOPOLOGY_GATE',
      ambientSpace:'R3',
      criticalLine:Object.freeze({equation:'L={(0,0,h):h in R}',complement:'R3\\L'}),
      orbit:Object.freeze({equation:crossing?'gamma(t)=(rho(t)cos(mt),rho(t)sin(mt),h sin(t)); rho(0)=0':'gamma(t)=(rho cos(mt),rho sin(mt),h sin(t))',domain:'t in [0,2pi]',closed:true,radius,height,turns,samples}),
      cylindricalCoordinates:Object.freeze({rho:'sqrt(x^2+y^2)',phi:'atan2(y,x)',h:'z'}),
      winding:Object.freeze({formula:'w=(1/(2pi))*integral dphi',value:crossing?null:turns,status:crossing?'UNDEFINED_AT_AXIS_CROSSING':'INTEGER_DEFINED_IN_LINE_COMPLEMENT'}),
      rootSlice:Object.freeze({k:slice,radius:rootRadius,nextRadius:nextRootRadius,delta,equation:`Delta_${slice}=sqrt(${slice+1})-sqrt(${slice})`,role:'LOCAL_METRIC_SLICE_DISPLAY'}),
      modes:Object.freeze(['ORBIT','ROOT_SLICES','AXIS_CROSSING']),
      classification:Object.freeze({scope:'CLOSED_LOOPS_IN_R3_MINUS_ONE_DECLARED_LINE',invariant:'WINDING_NUMBER_ABOUT_LINE',homotopyClass:crossing?null:turns}),
      additionalInvariants:Object.freeze(['LINKING_NUMBER','FUNDAMENTAL_GROUP','HOMOLOGY','ORIENTABILITY','GENUS_OR_MANIFOLD_DATA']),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'Root Geometry supplies a local metric and declared slice family; it is not a key to all topologies. Winding classifies this bounded closed-loop problem only while the orbit avoids the critical line. At rho=0 the polar angle and winding number are undefined. No knot, torus, Moebius, higher-genus, physical resonance or universal topology claim follows.'
    });
  }

  function thothKhipuKnotRecord(options={}){
    const modes=Object.freeze(['UNRESOLVED','OVER','UNDER']);
    const crossingMode=modes.includes(options.crossingMode)?options.crossingMode:'UNRESOLVED';
    const generationValues=Object.freeze([1031,1032,1033,1111]);
    const generationIndex=Math.max(0,Math.min(generationValues.length-1,Math.trunc(Number(options.generationIndex??1))||0));
    const encodeDecimal=value=>{
      const digits=String(value).padStart(4,'0').slice(-4).split('').map(Number);
      const places=Object.freeze([1000,100,10,1]);
      return Object.freeze({value,digits:Object.freeze(digits),places,slots:Object.freeze(digits.map((digit,index)=>Object.freeze({
        place:places[index],digit,
        knotType:digit===0?'ZERO_GAP':index===3?(digit===1?'FIGURE_EIGHT':'LONG_KNOT'):'SIMPLE_KNOT',
        count:digit===0?0:digit,
        status:digit===0?'INTENTIONAL_EMPTY_POSITION':'KNOT_PRESENT'
      }))) });
    };
    const generations=Object.freeze(generationValues.map((value,index)=>Object.freeze({
      id:`G${index}`,label:index===0?'SOURCE':`GENERATION ${index}`,value,encoding:encodeDecimal(value),
      role:'SYNTHETIC_NEXAH_DISPLAY_RECORD_NOT_HISTORICAL_DECODE'
    })));
    const selected=generations[generationIndex];
    return Object.freeze({
      name:'THOTH_AUA_KNOT_KHIPU_LEDGER',crossingMode,modes,
      axisHit:Object.freeze({
        point:Object.freeze({rho:0,x:0,y:0}),rhoStatus:'ZERO_VALUE',polarAngle:null,polarAngleStatus:'UNDEFINED_AT_AXIS_CROSSING',
        oneSidedTangents:Object.freeze({incomingDegrees:90,outgoingDegrees:270,status:'DEFINED_AS_DECLARED_ONE_SIDED_LIMITS'}),
        lift:Object.freeze({height:crossingMode==='OVER'?1:crossingMode==='UNDER'?-1:0,status:crossingMode==='UNRESOLVED'?'PLANAR_CROSSING_WITHOUT_OVER_UNDER_DATA':'DIAGRAM_CROSSING_RESOLVED_BY_DECLARED_LIFT'}),
        knotStatus:crossingMode==='UNRESOLVED'?'NOT_A_KNOT_DIAGRAM':'LOCAL_KNOT_DIAGRAM_ONLY_NOT_CLOSED_KNOT_CLASS'
      }),
      khipu:Object.freeze({
        term:Object.freeze({quechua:'khipu',spanish:'quipu',gloss:'knot'}),
        structure:Object.freeze({primaryCord:'CARRIER',pendantCords:'VALUE_OR_CATEGORY_LANES',subsidiaryCords:'OPTIONAL_HIERARCHY'}),
        decimalEncoding:Object.freeze({places:Object.freeze([1000,100,10,1]),higherPlaces:'SIMPLE_KNOT_COUNT',ones2to9:'LONG_KNOT_TURNS',ones1:'FIGURE_EIGHT',zero:'INTENTIONAL_GAP_NO_KNOT'}),
        textileRegisters:Object.freeze({color:'OBSERVED_REGISTER_MEANING_CONTEXT_DEPENDENT',twist:Object.freeze(['S','Z','UNASSIGNED']),attachment:Object.freeze(['RECTO','VERSO','UNASSIGNED']),default:'UNASSIGNED'}),
        generations,selected,
        sources:Object.freeze([
          Object.freeze({authority:'Smithsonian Institution',url:'https://www.si.edu/collections/snapshot/quipu',role:'OBJECT_AND_RECORDING_SYSTEM_OVERVIEW'}),
          Object.freeze({authority:'The Metropolitan Museum of Art',url:'https://resources.metmuseum.org/resources/metpublications/pdf/Weaving_Abstraction.pdf',role:'PRIMARY_PENDANT_SUBSIDIARY_STRUCTURE'}),
          Object.freeze({authority:'British Museum',url:'https://www.britishmuseum.org/sites/default/files/2021-11/Peru_a_journey_in_time_large_print_guide.pdf',role:'DECIMAL_AND_KNOT_TYPE_OVERVIEW'}),
          Object.freeze({authority:'Harvard GSAS',url:'https://gsas.harvard.edu/news/colloquy-podcast-knots-bind',role:'S_Z_TWIST_AND_ATTACHMENT_RESEARCH'}),
          Object.freeze({authority:'Smithsonian NMAH / Locke',url:'https://www.si.edu/object/nmah_1590977',role:'DECIMAL_PLACE_VALUE_HISTORY'})
        ])
      }),
      comparator:Object.freeze({primecube:'FINITE_BASE11_ADDRESS_CARRIER',khipu:'ANDEAN_FIBER_RECORDING_TECHNOLOGY',sharedView:'SPATIAL_ADDRESS_AND_MATERIAL_MARKS',status:'ANALOGY_ONLY_NO_IDENTITY_NO_PROVENANCE_NO_EXACT_RETURN_PROOF'}),
      ownerTokens:Object.freeze({thoth:'OWNER_LABEL_NO_IDENTITY_BINDING',aua:'OWNER_LABEL_NO_OPERATOR',segmentation:'IV O MA RI? MI ZE LI C',status:'OWNER_MNEMONIC_HOLD'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'The generation values are synthetic NEXAH display records, not a decoded historical khipu. Khipu textile attributes are context-dependent registers, not a universal codebook. At rho=0 the radius is exactly zero while the polar angle is undefined; zero and null are not synonyms. Over/under lift resolves a local diagram crossing, but no closed knot type or invariant follows.'
    });
  }

  function szChiralityLabRecord(options={}){
    const angle=Math.max(1,Math.min(359,Math.trunc(Number(options.angle??102))||102));
    const alpha=Math.max(-1.5,Math.min(1.5,Number(options.alpha??.99)));
    const beta=Math.max(-1,Math.min(1,Number(options.beta??.25)));
    const steps=Math.max(12,Math.min(360,Math.trunc(Number(options.steps??60))||60));
    const integerGcd=gcd(angle,360),closureSteps=360/integerGcd,signedTurns=angle*closureSteps/360;
    const track=(sign=1)=>{
      let previous=1,current=.98,theta=0;
      const points=[Object.freeze({index:0,theta,radius:previous,x:previous,y:0})];
      for(let index=1;index<=steps;index++){
        theta+=sign*angle*Math.PI/180;
        const next=alpha*current+sign*beta*(current-previous);
        const radius=Math.max(0,Math.min(8,Math.abs(next)));
        points.push(Object.freeze({index,theta,radius,x:radius*Math.cos(theta),y:radius*Math.sin(theta)}));
        previous=current;current=next;
      }
      return Object.freeze(points);
    };
    const sTrack=track(1),zTrack=track(-1);
    const proximities=Object.freeze(sTrack.map((point,index)=>Object.freeze({index,distance:Math.hypot(point.x-zTrack[index].x,point.y-zTrack[index].y)})).filter(item=>item.distance<.035));
    const halfPlane=point=>point.y>=0?1:-1;
    const bridgeTrack=Object.freeze(sTrack.map((point,index)=>Object.freeze({
      index,
      x:(point.x+zTrack[index].x)/2,
      y:(point.y+zTrack[index].y)/2,
      distance:Math.hypot(point.x-zTrack[index].x,point.y-zTrack[index].y)
    })));
    const switchEvents=Object.freeze(sTrack.slice(1).map((point,offset)=>{
      const index=offset+1,sBefore=halfPlane(sTrack[index-1]),sAfter=halfPlane(point),zBefore=halfPlane(zTrack[index-1]),zAfter=halfPlane(zTrack[index]);
      if(sBefore===sAfter&&zBefore===zAfter)return null;
      const previousDistance=bridgeTrack[index-1].distance,currentDistance=bridgeTrack[index].distance;
      return Object.freeze({
        index,sBefore,sAfter,zBefore,zAfter,
        bridgeDistance:currentDistance,
        memoryMagnitude:Math.abs(beta)*Math.abs(currentDistance-previousDistance),
        label:`S ${sBefore>0?'+':'-'}→${sAfter>0?'+':'-'} · Z ${zBefore>0?'+':'-'}→${zAfter>0?'+':'-'}`
      });
    }).filter(Boolean));
    const bridge=Object.freeze({
      symbol:'βχ',role:'MEMORY_BRIDGE',color:'#ff4fc3',track:bridgeTrack,switchEvents,
      operator:'chi(z)*|beta|*(z(n)-z(n-1))',
      status:'BOUNDED_VIEW_BRIDGE_NOT_THIRD_CHIRALITY',
      return:'DISPLAY_EVENT_LOOP_ONLY_OPERATOR_RETURN_UNRESOLVED'
    });
    const stations=Object.freeze(Array.from({length:25},(_,index)=>Object.freeze({address:index+1,row:Math.floor(index/5),column:index%5,center:index===12})));
    return Object.freeze({
      name:'SZ_CHIRALITY_INVARIANT_LAB',
      polar:Object.freeze({angle,counterAngle:360-angle,canonicalSteps:Object.freeze({s:angle,z:-angle}),alpha,beta,steps,sTrack,zTrack,proximities,bridge,closure:Object.freeze({gcd:integerGcd,steps:closureSteps,signedTurnsS:signedTurns,signedTurnsZ:-signedTurns,status:'EXACT_INTEGER_ANGLE_CLOSURE'})}),
      mod11:Object.freeze({angle102:mod(102,11),angle204:mod(204,11),angle258:mod(258,11),inversePair:Object.freeze([5,6]),equation:'258+204=462=42*11',status:'ADDITIVE_INVERSES_NOT_ANTIPODAL'}),
      torsion:Object.freeze({
        operator:'z(n+1)=z(n)^2+c+alpha*z(n)+chi(z(n))*|beta|*(z(n)-z(n-1))',
        chirality:'chi(z)=+1 if Im(z)>=0; chi(z)=-1 if Im(z)<0',
        budget:Object.freeze({symbol:'P_chi',value:alpha+Math.abs(beta),equation:'P_chi=alpha+|beta|',status:'PARAMETER_COORDINATE_NOT_ENERGY_OR_INVARIANT_OF_ORBIT'}),
        standardBudget:Object.freeze({symbol:'P',value:alpha+beta,equation:'P=alpha+beta',status:'SEPARATE_EXISTING_PARAMETER_DIAGONAL'}),
        symmetry:'CONJUGATION_SYMMETRY_NOT_ASSUMED_WHEN_BETA_NONZERO',
        classification:'PIECEWISE_COMPLEX_TWO_STEP_RECURRENCE_NOT_CLASSICAL_MANDELBROT'
      }),
      invariants:Object.freeze([
        Object.freeze({id:'W',value:Object.freeze([signedTurns,-signedTurns]),scope:`${closureSteps}-STEP_POLAR_CLOSURE`,status:'EXACT_FOR_INTEGER_ANGLE_ONLY'}),
        Object.freeze({id:'FULL_TURN',value:360,scope:'POLAR_DISPLAY'}),
        Object.freeze({id:'MODULUS',value:11,scope:'RESIDUE_COMPARATOR'}),
        Object.freeze({id:'PRIMARY_CORD',value:'CARRIER',scope:'KHIPU_ANALOGY'})
      ]),
      window25:Object.freeze({shape:Object.freeze([5,5]),count:25,center:13,stations,labels:Object.freeze(['BIG BIRD','CON DAO','THUNDER BIRD']),status:'OWNER_WINDOW_HOLD_NO_OPERATOR'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'S and Z are declared signed display directions, not a universal decoding of Andean textile meaning. The beta-chi bridge connects sampled half-plane switch events as a bounded view trace; it is not a third chirality, state trajectory or exact operator closure. Its switch tour is a display return only. P_chi is held constant only when the controls enforce it; it is not conserved energy or an orbit invariant. Screen proximity is not a knot, resonance or physical stabilization event. The 25/13 window is an exact finite address plate; Big Bird, Con Dao and Thunder Bird remain Owner labels on HOLD.'
    });
  }

  function fractalDirectFieldRecord(){
    return Object.freeze({
      name:'MANDELBROT_ALPHA_BETA_DIRECT_FIELD',
      standardOperator:'z(n+1)=z(n)^2+c',
      memoryOperator:'z(n+1)=z(n)^2+c+alpha*z(n)+beta*(z(n)-z(n-1))',
      state:'S(n)=(z(n),z(n-1))',
      classification:'COMPLEX_QUADRATIC_HENON_TYPE_WHEN_BETA_NONZERO',
      presets:Object.freeze([
        Object.freeze({id:'zero-bind',label:'P=0 · Ortsbindung / Bremse',alpha:0.35,beta:-0.35,p:0,viewport:Object.freeze([-2.15,1.15,-1.35,1.35])}),
        Object.freeze({id:'zero-thrust',label:'P=0 · Gegendruck / Schwung',alpha:-0.35,beta:0.35,p:0,viewport:Object.freeze([-2.15,1.15,-1.35,1.35])}),
        Object.freeze({id:'high-budget',label:'P=.55 · positiver Schnitt',alpha:0.20,beta:0.35,p:0.55,viewport:Object.freeze([-2.15,1.15,-1.35,1.35])}),
        Object.freeze({id:'memory-zoom',label:'P=.25 · Memory-Randzoom',alpha:-0.15,beta:0.40,p:0.25,viewport:Object.freeze([-0.95,-0.35,0.25,0.78])})
      ]),
      rootMask:Object.freeze({axis:'5+1+5=11',quadrantBlocks:4,quadrantSide:5,quadrantCells:100,centerCells:1,selectedCells:101,excludedCrossArmCells:20,fullGridCells:121,equation:'4*(5*5)+1=101'}),
      mod11Rail:Object.freeze([
        Object.freeze({n:101,base11:'92',residue:2,role:'ROOT_MASK_HANDLE',transition:'REPRESENTATIVE_SWITCH_NOT_INTEGER_DOUBLING'}),
        Object.freeze({n:2501,base11:'1974',residue:4,role:'50^2+1',transition:'RESIDUE_DOUBLE_FROM_2'}),
        Object.freeze({n:5002,base11:'3838',residue:8,role:'2*(50^2+1)',transition:'INTEGER_AND_RESIDUE_DOUBLE'}),
        Object.freeze({n:10004,base11:'7575',residue:5,role:'4*(50^2+1)',transition:'INTEGER_AND_RESIDUE_DOUBLE'})
      ]),
      mod11Rotor:Object.freeze({
        operator:'r -> 2r mod 11',generator:2,order:10,
        orbit:Object.freeze([2,4,8,5,10,9,7,3,6,1,2]),
        nonzeroResidues:Object.freeze([1,2,3,4,5,6,7,8,9,10]),
        status:'FULL_NONZERO_RESIDUE_ORBIT_PRIMITIVE_ROOT_2',
        threeSixNineControl:Object.freeze({subset:Object.freeze([3,6,9]),images:Object.freeze([6,1,7]),closed:false,status:'NOT_CLOSED_UNDER_DOUBLING_MOD_11'}),
        boundary:'The orbit acts on residue classes. It does not make 101 the integer predecessor of 2501 and it does not derive a Root2 identity.'
      }),
      joint89:Object.freeze({
        operands:Object.freeze([8,9]),sum:17,product:72,
        reciprocalPair:Object.freeze(['8/9','9/8']),reciprocalProduct:1,
        decimalConcatenation:Object.freeze({value:83,prime:true,primeRank:23,status:'DECIMAL_CONCATENATION_NOT_PRODUCT_OR_RESIDUE'}),
        factorReturn:Object.freeze({n:3565,factors:Object.freeze([5,23,31]),factor:23,divides:true}),
        crosswalk72:Object.freeze({hours:1728,days:72,status:'UNIT_BOUND_CROSSWALK_NOT_DERIVATION'}),
        root2Status:'HOLD_NOT_ESTABLISHED'
      }),
      base11Mirror:Object.freeze({decimal:122,base11:'101',equation:'122_(10)=101_(11)'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'The 101-cell root mask is a declared selection inside the 121-cell grid; it excludes the other 20 cells of the central cross. The mod-11 rotor is exact residue arithmetic but is not derived from the continuous alpha/beta dynamics. The first 101-to-2501 link is a representative switch, not integer doubling. Decimal concatenation 8|3, multiplication 8*9 and prime-index lookup p_23=83 remain typed operations. The 3-6-9 subset is not closed under doubling modulo 11, and no Root2 identity is established. For beta nonzero the map is a two-step complex quadratic Henon-type recurrence, not the classical Mandelbrot family. Finite non-escape is not a proof of set membership.'
    });
  }

  function alJabrDotLensRecord(completion=0){
    const added=Math.max(0,Math.min(20,Math.trunc(Number(completion)||0)));
    const angles=Object.freeze([
      Object.freeze({degrees:102,residue:mod(102,11),role:'TURN'}),
      Object.freeze({degrees:204,residue:mod(204,11),role:'DOUBLE_TURN'}),
      Object.freeze({degrees:258,residue:mod(258,11),role:'RETURN_COMPLEMENT_TO_360'})
    ]);
    const coupledCompletionSequence=Object.freeze(Array.from({length:21},(_,step)=>{
      const phase=Math.min(2,Math.floor(step/7));
      return Object.freeze({step,completion:step,visible:101+step,closed:step===20,carrier:'C',bodyColor:'BLUE',activeMarker:'GOLD',role:['CENTER_DOT','DECIMAL_POINT','PRODUCT_DOT'][phase],angle:[102,204,258][phase],phase:['CENTER','SCALE','PRODUCT'][phase],viewRegister:['AM','PM','VM'][phase]});
    }));
    return Object.freeze({
      name:'AL_JABR_LENS_TYPED_DOT',
      grid:Object.freeze({side:11,full:121,quadrants:100,center:1,crossArms:20,completion:added,visible:101+added,closed:added===20,equation:`101+${added}=${101+added}`}),
      operators:Object.freeze([
        Object.freeze({id:'CENTER_DOT',glyph:'·',equation:'5+1+5=11',meaning:'selected center cell [5,5]'}),
        Object.freeze({id:'DECIMAL_POINT',glyph:'.',equation:'121×10^−2=1.21; √121×10^−1=1.1',meaning:'declared scale change'}),
        Object.freeze({id:'PRODUCT_DOT',glyph:'·',equation:'4·(5·5)+1=101',meaning:'multiplication in the selected root mask'})
      ]),
      completionSquare:Object.freeze({historicalAnalogy:'geometric completion of a square by adding missing areas',status:'ANALOGY_NOT_PROVENANCE',currentEquation:'101+20=121'}),
      carrierInvariant:Object.freeze({id:'C',count:1,state:'UNCHANGED_WORLD_CUBE',bodyColor:'BLUE',activeMarker:'GOLD',law:'C(102°)=C(204°)=C(258°) as carrier identity; only the declared view changes'}),
      phaseTrack:Object.freeze({angles:Object.freeze([102,204,258]),viewRegisters:Object.freeze(['AM','PM','VM']),pathColor:'BLUE',activeMarker:'GOLD',role:'ONE_CARRIER_THREE_TYPED_READOUT_PHASES',boundary:'AM PM and VM are local view registers. They do not add bodies, time zones or geometries.'}),
      viewPlates:Object.freeze({
        DURER_Q:Object.freeze({id:'DURER_Q',label:'Dürer · Q',placement:'R180_PLANAR',matrix:Object.freeze([Object.freeze([16,3,2,13]),Object.freeze([5,10,11,8]),Object.freeze([9,6,7,12]),Object.freeze([4,15,14,1])]),lineSum:34,law:'P(C(v))=R180(P(v))',scope:'ROWS_COLUMNS_MAIN_DIAGONALS'}),
        KHAJURAHO_D:Object.freeze({id:'KHAJURAHO_D',label:'Khajuraho · D',placement:'T_2_2_TOROIDAL',matrix:Object.freeze([Object.freeze([7,12,1,14]),Object.freeze([2,13,8,11]),Object.freeze([16,3,10,5]),Object.freeze([9,6,15,4])]),windowSum:34,law:'P(C(v))=T(2,2)(P(v))',scope:'TOROIDAL_2_BY_2_WINDOWS'})
      }),
      coupledCompletion:Object.freeze({sequence:coupledCompletionSequence,period:21,route:'101 OPEN → 121 CLOSED',coupledRegisters:Object.freeze(['GRID_COMPLETION','TYPED_DOT_ROLE','DECLARED_ANGLE','VIEW_REGISTER']),independentRegisters:Object.freeze(['ALPHA','BETA','AXIS_VIEW','MASK_MODE']),boundary:'This is a declared display choreography over one unchanged carrier C. Cell completion does not derive alpha, beta or the polar recurrence, and the three angle phases are typed views rather than three bodies or a proof of algebraic coupling.'}),
      quaternionAxisOverlay:Object.freeze({
        basis:Object.freeze(['1','i','j','k']),
        scalar:Object.freeze({label:'1',role:'SCALAR_HANDLE_NOT_SPATIAL_AXIS',cell:Object.freeze([5,5])}),
        topSlice:Object.freeze({view:'TOP_IJ',constraint:'k=0',visibleAxes:Object.freeze(['i','j']),hiddenAxis:'k',axisLabels:Object.freeze({left:'−i',right:'+i',top:'+j',bottom:'−j'}),quadrantRays:Object.freeze(['−i+j','i+j','−i−j','i−j'])}),
        sideSlice:Object.freeze({view:'SIDE_IK',visibleAxes:Object.freeze(['i','k']),edgeOnAxis:'j',carrierLayer:'+k',shadowLayer:'−k',status:'DECLARED_DEPTH_LIFT_NOT_DERIVED_FROM_2D_MASK'}),
        crossArms:Object.freeze({cells:20,role:'OPEN_I_J_COORDINATE_CHANNELS_EXCLUDED_FROM_101_SELECTION'}),
        multiplicationReference:Object.freeze({squares:Object.freeze(['i²=−1','j²=−1','k²=−1']),forward:Object.freeze(['ij=k','jk=i','ki=j']),reverse:Object.freeze(['ji=−k','kj=−i','ik=−j']),orientationTest:'ij=k; ji=−k',status:'QUATERNION_ALGEBRA_REFERENCE_NOT_DERIVED_FROM_GRID'}),
        punctuationBoundary:'The center may display 1, dot or multiplication glyph by typed mode; these roles are not interchangeable.',
        identityBoundary:'Axis labels are a local coordinate overlay. They do not create a Quaternion identity, prove quaternion multiplication from the mask or identify the Shadow Cube with a physical depth.'
      }),
      dualMaskControl:Object.freeze({
        modes:Object.freeze(['PLUS_ZERO','TIMES_ZERO','PLUS_TIMES_OVERLAP','PRIME_QUADRANTS']),
        plusZero:Object.freeze({zeroCells:20,centerCells:1,selectedCells:101,sectors:4,cellsPerSector:25,shape:'FOUR_5_BY_5_SQUARE_QUADRANTS',equation:'121−20=101=4·25+1'}),
        timesZero:Object.freeze({zeroCells:20,centerCells:1,selectedCells:101,sectors:4,cellsPerSector:25,shape:'FOUR_ROTATED_WEDGE_SECTORS',equation:'121−20=101=4·25+1'}),
        comparison:Object.freeze({nonCenterZeroSetsDisjoint:true,zeroUnionCells:40,selectedIntersectionCells:81,selectedUnionCells:121,intersectionEquation:'101+101−121=81=9²',unionEquation:'101+101−81=121=11²',intersectionStatus:'COUNT_9_SQUARED_NOT_CONTIGUOUS_9_BY_9_SUBGRID'}),
        primeQuadrants:Object.freeze({orientation:'ROTATED_SCREEN_ORDER_TOP_LEFT_BOTTOM_RIGHT',records:Object.freeze([Object.freeze({id:'Q_I',sector:'TOP',prime:2,cells:25}),Object.freeze({id:'Q_II',sector:'LEFT',prime:3,cells:25}),Object.freeze({id:'Q_III',sector:'BOTTOM',prime:5,cells:25}),Object.freeze({id:'Q_IV',sector:'RIGHT',prime:7,cells:25})]),primeSum:17,primeProduct:210,quadrantProduct:840,labelPermutations:24,permutationWeightedReturn:5040,laws:Object.freeze(['2+3+5+7=17','2·3·5·7=210','4·210=840','4!·210=24·210=5040=7!']),status:'DECLARED_PRIME_SECTOR_LABELS_NOT_CELL_VALUES'}),
        glyphGrammar:Object.freeze({O:'ACTIVE_ZERO_SET',I:'CENTER_IDENTITY_HANDLE',X:'DIAGONAL_ZERO_MASK',PLUS:'ORTHOGONAL_ZERO_MASK'}),
        boundary:'The plus and times masks are two declared 101-cell selections. The 81-cell intersection is a count equal to 9 squared, not a contiguous 9 by 9 subgrid. Prime labels are sector types, not values assigned to every cell. The 5040 comparison deliberately multiplies the invariant product 210 by all 24 label permutations; it is a constructed comparator, not a derivation of the factorial from the grid.'
      }),
      quadrantShiftControl:Object.freeze({
        name:'PBDQ_VIEW_PLATE_PERMUTATION',
        carrier:Object.freeze({id:'C',count:1,state:'UNCHANGED',bodyColor:'BLUE'}),
        center:Object.freeze({value:1,role:'IDENTITY_HANDLE'}),
        zero:Object.freeze({value:0,role:'PRESENT_NUMERIC_MASK_STATE'}),
        null:Object.freeze({value:null,role:'UNBOUND_RECORD_OUTSIDE_ARITHMETIC'}),
        parkingRegisters:Object.freeze([
          Object.freeze({slot:'Q_I',position:'NE',glyph:'b',primeType:2,coordinate:Object.freeze([1,1])}),
          Object.freeze({slot:'Q_II',position:'NW',glyph:'d',primeType:3,coordinate:Object.freeze([-1,1])}),
          Object.freeze({slot:'Q_III',position:'SW',glyph:'q',primeType:5,coordinate:Object.freeze([-1,-1])}),
          Object.freeze({slot:'Q_IV',position:'SE',glyph:'p',primeType:7,coordinate:Object.freeze([1,-1])})
        ]),
        initialViewPlacement:Object.freeze({Q_I:'b',Q_II:'d',Q_III:'q',Q_IV:'p'}),
        transforms:Object.freeze({
          VERTICAL_MIRROR:Object.freeze({Q_I:'Q_II',Q_II:'Q_I',Q_III:'Q_IV',Q_IV:'Q_III'}),
          HORIZONTAL_MIRROR:Object.freeze({Q_I:'Q_IV',Q_IV:'Q_I',Q_II:'Q_III',Q_III:'Q_II'}),
          ROTATE_180:Object.freeze({Q_I:'Q_III',Q_III:'Q_I',Q_II:'Q_IV',Q_IV:'Q_II'})
        }),
        laws:Object.freeze(['V²=id','H²=id','R²=id','VH=HV=R']),
        comparator:'KLEIN_FOUR_ACTION_ON_FOUR_VIEW_REGISTERS',
        boundary:'The p b q d glyphs are local screen-orientation view registers around one unchanged carrier C. Only their view assignment is permuted; no cube token, body or canonical identity moves. ZERO is a present numeric mask state. NULL is an unbound record and is excluded from arithmetic, cell counts and the permutation group. The Klein-four description applies only to the declared V H R view permutations.'
      }),
      polar:Object.freeze({angles,exactRelations:Object.freeze(['204=2·102','258+102=360','258+204=462=42·11']),residuePair:Object.freeze({a:mod(204,11),b:mod(258,11),sum:mod(204+258,11),relation:'ADDITIVE_INVERSES_MOD_11',regular11gonBoundary:'NOT_ANTIPODAL: an odd regular 11-gon has no opposite vertex'})}),
      recurrence:Object.freeze({operator:'r(n+1)=alpha*r(n)+beta*(r(n)-r(n-1))',classification:'DECLARED_POLAR_DISPLAY_RECURRENCE',defaultParameters:Object.freeze({alpha:.985,beta:.25,steps:60}),boundary:'This recurrence is a display model, not the definition of polar coordinates and not a stability or physical-law claim.'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'Al-Khwarizmi is a historical analogy for geometric completion of quadratic expressions, not the source identity of the 11x11 mask. CENTER_DOT, DECIMAL_POINT and PRODUCT_DOT are typed readout roles over one unchanged blue carrier C. The 1 i j k labels are a local coordinate overlay: 1 is scalar, i and j are visible top-view axes, and k is a declared depth lift. Quaternion multiplication is a reference algebra and is not derived from the grid. PLUS_ZERO and TIMES_ZERO are distinct 101-cell selections; their 81-cell intersection is a count, not a contiguous 9 by 9 grid. Dürer Q and Khajuraho D reuse the same labels 1 through 16 and sum 34 but retain different planar and toroidal placement operators. The p b q d and AM PM VM labels are view registers; they do not add or move bodies. ZERO is a present numeric state; NULL is record absence and stays outside arithmetic. The 2 3 5 7 sector labels and the 5040 permutation comparator are declared constructions. Residues 5 and 6 are additive inverses modulo 11, but are not antipodal vertices of a regular 11-gon.'
    });
  }

  function viewInvarianceAuditRecord(control='BASELINE'){
    const controls=Object.freeze({
      BASELINE:Object.freeze({id:'BASELINE',label:'Baseline',target:'NONE',expectedBreaks:0}),
      SHUFFLED_PLATES:Object.freeze({id:'SHUFFLED_PLATES',label:'Plate Shuffle',target:'SIGMA34 @ Q,D',expectedBreaks:2}),
      WRONG_OPERATOR:Object.freeze({id:'WRONG_OPERATOR',label:'Wrong Operator',target:'LOCAL_OPERATOR_LAW @ D',expectedBreaks:1}),
      CHANGED_CARRIER:Object.freeze({id:'CHANGED_CARRIER',label:'Changed Carrier',target:'CARRIER_ID / CARDINALITY / CHECKSUM @ ALL',expectedBreaks:39}),
      AXIS_HIT:Object.freeze({id:'AXIS_HIT',label:'Axis Hit',target:'POLAR_ANGLE / WINDING @ LINE',expectedBreaks:2})
    });
    const selected=controls[String(control)]||controls.BASELINE;
    const views=Object.freeze([
      ['AM','102° view register'],['PM','204° view register'],['VM','258° view register'],['Q','Dürer planar plate'],['D','Khajuraho toroidal plate'],
      ['p','screen view p'],['b','screen view b'],['q','screen view q'],['d','screen view d'],['LINE','critical-line complement'],
      ['PLANE','transversal plane'],['ROOT','root metric'],['GAP','greyspace seam']
    ].map(([id,label])=>Object.freeze({id,label})));
    const observables=Object.freeze([
      ['CARRIER_ID','Carrier C','C'],['CARDINALITY_121','121 cells','121'],['SOURCE_CHECKSUM_7381','source checksum','Σ1…121=7381'],
      ['LABEL_MULTISET_1_16','plate labels','{1…16}'],['SIGMA34','plate sum','Σ34'],['LOCAL_OPERATOR_LAW','typed operator law','R180 / T(2,2)'],
      ['SCREEN_POSITION_ASSIGNMENT','screen assignment','AM/PM/VM · p/b/q/d'],['POLAR_ANGLE','polar angle','φ'],['WINDING','winding','w'],
      ['ROOT_METRIC','root metric','Δk'],['SEAM_EDGE_COUNT_12','seam edges','|Σ12|=12']
    ].map(([id,label,value])=>Object.freeze({id,label,value})));
    const status=(view,observable)=>{
      let outcome='UNRESOLVED',note='not represented in this declared view';
      if(['CARRIER_ID','CARDINALITY_121','SOURCE_CHECKSUM_7381'].includes(observable)){outcome='RETAINED';note='same finite carrier record';}
      else if(observable==='LABEL_MULTISET_1_16'&&['Q','D'].includes(view)){outcome='RETAINED';note='same labels 1…16';}
      else if(observable==='SIGMA34'&&['Q','D'].includes(view)){outcome='RETAINED';note='typed plate test returns 34';}
      else if(observable==='LOCAL_OPERATOR_LAW'){outcome='RETAINED';note='declared view operator remains typed';}
      else if(observable==='SCREEN_POSITION_ASSIGNMENT'){
        if(view==='AM'){outcome='RETAINED';note='reference screen assignment';}
        else if(['PM','VM','p','b','q','d'].includes(view)){outcome='LOST';note='screen position changes by design';}
      }else if(observable==='POLAR_ANGLE'){
        if(['AM','PM','VM'].includes(view)){outcome='ADDED';note='view coordinate, not carrier property';}
        else if(view==='LINE'){outcome='RETAINED';note='defined only in the line complement';}
      }else if(observable==='WINDING'&&view==='LINE'){outcome='RETAINED';note='integer while the orbit avoids the line';}
      else if(observable==='ROOT_METRIC'&&['ROOT','GAP'].includes(view)){outcome='RETAINED';note='same twelve root-ruler increments';}
      else if(observable==='SEAM_EDGE_COUNT_12'&&['PLANE','GAP'].includes(view)){outcome='RETAINED';note='same twelve transversal seam edges';}
      if(selected.id==='SHUFFLED_PLATES'&&observable==='SIGMA34'&&['Q','D'].includes(view)){outcome='LOST';note='destruction control breaks Σ34';}
      if(selected.id==='WRONG_OPERATOR'&&observable==='LOCAL_OPERATOR_LAW'&&view==='D'){outcome='LOST';note='planar operator substituted for T(2,2)';}
      if(selected.id==='CHANGED_CARRIER'&&['CARRIER_ID','CARDINALITY_121','SOURCE_CHECKSUM_7381'].includes(observable)){outcome='LOST';note='source carrier intentionally replaced';}
      if(selected.id==='AXIS_HIT'&&view==='LINE'&&['POLAR_ANGLE','WINDING'].includes(observable)){outcome='UNRESOLVED';note='undefined at the declared axis crossing';}
      return Object.freeze({outcome,note});
    };
    const matrix=Object.freeze(views.flatMap(view=>observables.map(observable=>Object.freeze({view:view.id,observable:observable.id,...status(view.id,observable.id)}))));
    const counts=Object.freeze(['RETAINED','LOST','ADDED','UNRESOLVED'].reduce((acc,key)=>{acc[key]=matrix.filter(cell=>cell.outcome===key).length;return acc;},{}));
    const baseline=selected.id==='BASELINE'?null:viewInvarianceAuditRecord('BASELINE');
    const observedBreaks=baseline?matrix.filter((cell,index)=>cell.outcome!==baseline.matrix[index].outcome).length:0;
    return Object.freeze({
      name:'PRIMECUBE_VIEW_INVARIANCE_AUDIT',identity:'MOD:NUMBER_VIEW_SUITE',artifact:'ART:A0:MATHEMATICAL_JOINTS',
      control:selected,views,observables,matrix,counts,observedBreaks,controlPass:observedBreaks===selected.expectedBreaks,
      method:'SOURCE_BOUND_ILAU_COMPARISON',scope:'SYNTHETIC_DESIGN_FEASIBILITY_INSTRUMENT',
      provenance:Object.freeze({methodReferences:Object.freeze(['QAW01','VST01']),claim:'METHOD_REUSE_ONLY_NO_RESULT_INHERITANCE'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,aliases:0,studies:0,findings:0,publications:0}),
      boundary:'A local source-bound comparison of declared Primecube views. Retained means invariant only for the named observable and operator contract. Added and lost are cartographic outcomes, unresolved is not false. This demonstrator is not a Lab Run, does not activate a Study and produces no scientific Finding.'
    });
  }

  function returnSeam4774Record(step=0,view='WHOLE_W'){
    const normalized=((Math.trunc(Number(step)||0)%4)+4)%4,turnDegrees=normalized*90;
    const allowedViews=Object.freeze(['WHOLE_W','MEMORY_M','PUNCTUATION_X','BLOCK_SWAP_S2','MOIRE_OVERLAY','MIRROR_9119','NCS_292']);
    if(!allowedViews.includes(view))throw new RangeError(`view must be one of ${allowedViews.join(', ')}`);
    const p293=Object.freeze({n:293,prime:true,primeRank:62,cube:cubeAddress(293),crt:qCubeAddress(293)});
    const n292=Object.freeze({n:292,prime:false,factorization:'2²·73 = 4·p₂₁',cube:cubeAddress(292),crt:qCubeAddress(292)});
    return Object.freeze({
      name:'FESN_4774_RETURN_SEAM_MEMORY_SLICE',identityReuse:Object.freeze(['FESN:4774','MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','A0OE:PASCAL_PENTAGON_D5_TEST']),
      view,views:allowedViews,
      seam:Object.freeze({word:'4|7|7|4',value:4774,palindrome:true,factorization:'2·7·11·31',matrix:Object.freeze([Object.freeze([4,7]),Object.freeze([7,4])]),trace:8,determinant:-33,eigenvalues:Object.freeze([11,-3]),directedHalves:Object.freeze([47,74]),halfSum:121,halfDifference:27,laws:Object.freeze(['47+74=121=11²','74−47=27=3³','4774=2·7·11·31'])}),
      blockSwap:Object.freeze({operator:'S₂',source:Object.freeze({word:'47|74',value:4774,palindrome:true,factorization:'2·7·11·31'}),target:Object.freeze({word:'74|47',value:7447,palindrome:true,factorization:'11·677'}),law:'S₂(47|74)=74|47; S₂²=id',involutive:true,ordinaryDigitReversal:false,status:'EXACT_DECIMAL_TWO_BLOCK_SWAP'}),
      moireOverlay:Object.freeze({families:Object.freeze([Object.freeze({label:'47',lineCount:47,color:'CYAN'}),Object.freeze({label:'74',lineCount:74,color:'MAGENTA'})]),totalLines:121,differenceParameter:27,construction:'TWO_DECLARED_SCREEN_LINE_FAMILIES_OVERLAID_AT_RETURN_PLANE',role:'DISPLAY_CONTRAST_ONLY_NOT_PHYSICAL_SCHLIEREN',inputsRemainDistinct:true}),
      mirror9119:Object.freeze({operator:'S₂',source:Object.freeze({word:'91|19',value:9119,palindrome:true,factorization:'11·829'}),target:Object.freeze({word:'19|91',value:1991,palindrome:true,factorization:'11·181'}),law:'S₂(91|19)=19|91; S₂²=id',sharedFactor:11,status:'EXACT_COMPARATOR_NOT_FESN_4774_IDENTITY'}),
      returnGate:Object.freeze({step:normalized,turnDegrees,word:normalized%2===0?'47|74':'74|47',exactReturnAfterSteps:4,returned:normalized===0,operator:'R₉₀^step',status:'EXACT_DISPLAY_ORIENTATION_RETURN'}),
      carrier:Object.freeze({sectors:12,white:6,black:6,reading:'OWNER_COUNTED_ALTERNATING_SCREEN_SECTORS',horizontalPlane:'DECLARED_RETURN_PLANE',center:Object.freeze({glyph:'·',crossGlyph:'X',role:'PUNCTUATION_ANCHOR'})}),
      memorySlice:Object.freeze({whole:'W = retained 12-sector carrier plus seam and source return',partial:'M = selected sectors plus seam word; unselected carrier information is intentionally lost',projection:'M(W) is many-to-one',reconstruction:'NOT_UNIQUE_WITHOUT_RETAINED_W'}),
      ncsComparator:Object.freeze({prime:p293,predecessor:n292,proposedAdapter:Object.freeze({law:'293→292 = n−1',cubeDelta:Object.freeze([-1,0,0]),crtDelta:Object.freeze([-1,-1,-1]),status:'PROPOSED_TYPED_NEIGHBOR_VIEW_NOT_RECOVERED_NCS_OPERATOR'}),recoveredNcs:Object.freeze({law:'T_d(x,y,z)=(x+d,y+d,z)',d:'0.8·0.28·sin(0.16 frame)',status:'EXISTING_NCS_292_PLANAR_TRANSLATION_NO_HIDDEN_PERMUTATION'})}),
      hopfControl:Object.freeze({status:'HOLD_NEGATIVE_CONTROL',s3ToS2Map:false,s1FibresDerived:false,reason:'A0 return explicitly transfers no Hopf structure; the separate global commutation candidate was rejected.'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,newStudy:0,newPublication:0}),
      boundary:'FESN:4774 is reused as a typed palindromic display seam. The 6+6 sectors and horizontal plane are owner screen readings, not a physical field or topology. W is a retained carrier and M a lossy view. S2 is an exact two-block swap, distinct from ordinary four-digit reversal. The 47/74 moire is a constructed screen overlay whose inputs remain distinct; it is not physical schlieren, stored energy or resonance. 9119/1991 is a separate exact comparator and not a FESN:4774 identity. The 293-to-292 predecessor step is a proposed address-neighbor adapter and is not the recovered NCS 292 translation. No Hopf fibration, S3-to-S2 quotient, energy invariant or new identity is inferred.'
    });
  }

  function draftDriftHousingRecord(mode='DRAFT_112',transitionStep=0,glyphIndex=0){
    const modes=Object.freeze(['DRAFT_112','TRIPLE_TRANSITION','GLYPH_REGISTER','NUMBER_OPERATORS','PI_IJ_AXES','TYPED_ADAPTERS']);
    if(!modes.includes(mode))throw new RangeError(`mode must be one of ${modes.join(', ')}`);
    const step=((Math.trunc(Number(transitionStep)||0)%3)+3)%3,index=((Math.trunc(Number(glyphIndex)||0)%8)+8)%8;
    const glyphs=Object.freeze([
      Object.freeze({position:1,glyph:'ö',mark:'DIAERESIS',role:'OWNER_GLYPH'}),Object.freeze({position:2,glyph:'ô',mark:'CIRCUMFLEX',role:'OWNER_GLYPH'}),
      Object.freeze({position:3,glyph:'ò',mark:'GRAVE',role:'OWNER_GLYPH'}),Object.freeze({position:4,glyph:'ó',mark:'ACUTE',role:'OWNER_GLYPH'}),
      Object.freeze({position:5,glyph:'ö',mark:'DIAERESIS_RETURN',role:'OWNER_REJOIN_CANDIDATE'}),Object.freeze({position:6,glyph:'œ',mark:'LIGATURE',role:'OWNER_GLYPH'}),
      Object.freeze({position:7,glyph:'ø',mark:'SLASH',role:'CUT_CANDIDATE'}),Object.freeze({position:8,glyph:'ō',mark:'MACRON',role:'RETURN_PLANE_CANDIDATE'})
    ]);
    return Object.freeze({
      name:'DRAFT_DRIFT_HOUSING_112_SIX_GATE',mode,modes,
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','A0OE:PASCAL_PENTAGON_D5_TEST']),
      draft:Object.freeze({fraction:'1/112',numerator:1,denominator:112,denominatorFactorization:'2⁴·7',decimal:1/112,rounded5:0.00893,display:'0.008928571428…',role:'DECLARED_DRAFT_STEP_NOT_MEASURED_PHYSICAL_DRIFT'}),
      housing:Object.freeze({source:181,prime:true,primeRank:42,decomposition:'181=69+112',left:Object.freeze({n:69,factorization:'3·23'}),right:Object.freeze({n:112,factorization:'2⁴·7'}),role:'EXACT_ARITHMETIC_HOUSING_COMPARATOR'}),
      tripleTransition:Object.freeze({step,current:Object.freeze(['INSIDE','OUTSIDE','INSIDE_PRIME'][step]),states:Object.freeze(['INSIDE','OUTSIDE','INSIDE_PRIME']),displayLaw:'INSIDE → OUTSIDE → INSIDE′',classification:'THREE_STATE_DISPLAY_RETURN',mandelbrotBoundary:'For one fixed classical quadratic orbit, crossing a certified escape radius is not followed by renewed membership. INSIDE_PRIME must mean a changed parameter, retained display return or non-classical memory state.'}),
      glyphRegister:Object.freeze({index,current:glyphs[index],glyphs,carrier:'EIGHT_POSITION_OWNER_MORPHOLOGY_REGISTER',tracks:Object.freeze({i:Object.freeze({baseStates:6,markedStates:2}),j:Object.freeze({baseStates:6,markedStates:2}),status:'OWNER_6_PLUS_2_TRACK_HYPOTHESIS_NOT_QUATERNION_DERIVATION'}),candidatePath:'ø CUT → ō RETURN_PLANE → ö REJOIN',boundary:'Glyph shape, diacritic and position are categorical display data. They are not numbers or quaternion products.'}),
      numberOperators:Object.freeze({reversal:Object.freeze({source:18,target:81,law:'REV₂(18)=81',involution:true}),concatenation:Object.freeze({blocks:Object.freeze([18,81]),value:1881,factorization:'3²·11·19',law:'18|81=1881'}),primeControl:Object.freeze({n:881,prime:true,primeRank:152,law:'881=p₁₅₂'}),fixtures:Object.freeze(['18=2·3²','81=3⁴','18+81=99','81−18=63','18·81=1458']),correction:'3²·11·19 factors 1881, not 881'}),
      piAxes:Object.freeze({pi:Object.freeze({role:'REAL_SCALAR_ANGLE_PARAMETER',value:Math.PI}),basis:Object.freeze(['1','i','j','k']),laws:Object.freeze(['ij=k','ji=−k','exp(uθ)=cosθ+u sinθ','exp(uπ)=−1 for unit pure quaternion u']),ratioStatus:'PI_IS_NOT_THE_RATIO_OF_I_AND_J',block141:Object.freeze({value:141,factorization:'3·47',typedSequence:'1|4|1',status:'NUMBER_AND_SEQUENCE_REMAIN_SEPARATE'})}),
      adapters:Object.freeze({mandelbrot:Object.freeze({role:'FIXED_PARAMETER_ESCAPE_AND_ALPHA_BETA_MEMORY_COMPARATOR',identity:'MOD:NUMBER_VIEW_SUITE',sharedMechanism:false}),ncs292:Object.freeze({role:'RECOVERED_COMMON_XY_TRANSLATION_COMPARATOR',identity:'A0OE:PASCAL_PENTAGON_D5_TEST',operator:'T_d(x,y,z)=(x+d,y+d,z)',sharedMechanism:false}),chassis:'ONE_VISIBLE_COMPARISON_CHASSIS_TYPED_ADAPTERS_NO_IDENTITY_MERGE'}),
      controls:Object.freeze({nullBoundary:'ZERO_IS_A_VALUE; NULL_IS_RECORD_ABSENCE',atToken:Object.freeze({glyph:'AT',status:'OWNER_TOKEN_UNBOUND_HOLD'}),physicalDrift:false,mandelbrotReentry:false,quaternionDerivation:false}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,newStudy:0,newPublication:0}),
      boundary:'The six modes are typed comparison views. Exact arithmetic does not establish physical drift, housing mechanics, a Mandelbrot re-entry orbit, quaternion derivation from glyph morphology or one NCS/fractal mechanism. The eight glyphs and AT remain Owner display tokens. Zero and NULL remain distinct.'
    });
  }

  function scarabControlLensRecord(cosine=-.834,hingeNumerator=661,foldDegrees=108){
    cosine=Number(cosine);foldDegrees=Number(foldDegrees);hingeNumerator=Math.trunc(Number(hingeNumerator));
    if(!Number.isFinite(cosine)||cosine < -1||cosine > 1)throw new RangeError('cosine must be in [-1,1]');
    if(!Number.isFinite(foldDegrees)||foldDegrees < 0||foldDegrees > 180)throw new RangeError('foldDegrees must be in [0,180]');
    if(hingeNumerator!==661)throw new RangeError('this bounded lens freezes the hinge numerator at 661');
    const thetaDegrees=Math.acos(cosine)*180/Math.PI,primeRanks=new Map(sieve(3301).map((n,index)=>[n,index+1]));
    const wheelNodes=Object.freeze([41,42,43].map(h=>{const n=h+990;return Object.freeze({h,n,prime:isPrime(n),primeIndex:primeRanks.get(n)||null,mod9:mod(n,9),naturalLog:Math.log(n),factorization:primeFactorization(n).exact});}));
    const wheelTriangle=Object.freeze({
      name:'ORANGE_TRIANGLE_WHEEL_CROSSWALK',
      existingRelationReference:'REL:IEEE300_GRAPH_GRID_NUMBER_ADDRESS',
      mapping:'h -> h+990',nodes:wheelNodes,
      symmetry:Object.freeze({equation:'1031+1033=2064=2*1032',midpoint:1032,leftDelta:-1,rightDelta:1}),
      centerFactorization:'1032=2^3*3*43=24*43',
      wheelArcs:Object.freeze([{degrees:41,class:'PRIME_ARC'},{degrees:42,class:'COMPOSITE_ARC'},{degrees:43,class:'PRIME_ARC'}].map(Object.freeze)),
      angleBoundary:'41°, 42° and 43° are declared wheel-arc labels. They are not the three Euclidean interior angles of the schematic triangle; 41+42+43=126, not 180.',
      logGaps:Object.freeze({left:Math.log(1032)-Math.log(1031),right:Math.log(1033)-Math.log(1032)}),
      sourceAnnotations:Object.freeze({cosine:-.834,decimalHinge:.661,tangent:.013,status:'OWNER_LABELS_SEPARATE_FROM_EXACT_ADDRESS_AND_LOG_REGISTERS'}),
      cikada:Object.freeze({tokens:Object.freeze(['CI','KA','DA']),states:Object.freeze(['INSIDE','OUTSIDE','INSIDE_PRIME']),addressBinding:Object.freeze([1031,1032,1033]),returnStatus:'RETURNED_INTERIOR_NOT_IDENTICAL_TO_INITIAL',tokenMappingStatus:'HOLD_OWNER_SEGMENTATION'}),
      boundary:'The orange triangle is a screen frame over the exact 41-42-43 to 1031-1032-1033 address crosswalk. Its equal-sided drawing does not assert metric equality, the wheel arcs are not interior angles, and CI|KA|DA remains an Owner segmentation on HOLD.'
    });
    const decimalReverse=n=>Number(String(n).split('').reverse().join(''));
    const reverseBits=(n,width)=>{
      const sourceBits=n.toString(2).padStart(width,'0');
      if(sourceBits.length!==width)throw new RangeError('number exceeds declared bit width');
      const reversedBits=sourceBits.split('').reverse().join('');
      return Object.freeze({width,sourceBits,reversedBits,value:parseInt(reversedBits,2),leadingZeroCount:(reversedBits.match(/^0+/)||[''])[0].length});
    };
    const factorText=n=>{
      let rest=n;const factors=[];
      for(let p=2;p*p<=rest;p+=(p===2?1:2))while(rest%p===0){factors.push(p);rest/=p}
      if(rest>1)factors.push(rest);
      const counts=new Map();factors.forEach(p=>counts.set(p,(counts.get(p)||0)+1));
      return [...counts].map(([p,e])=>`${p}${e===1?'':`^${e}`}`).join('*')||'1';
    };
    const mirrorCarryGate=Object.freeze({
      name:'SCARAB_CARRY_MIRROR_GATE',
      sourceRail:Object.freeze([1031,1032,1033].map(n=>Object.freeze({n,prime:isPrime(n),primeIndex:primeRanks.get(n)||null,factorization:factorText(n)}))),
      primeRail:Object.freeze({left:'1031=P173',center:'1032=2^3*3*43',right:'1033=P174',twinGap:2,midpoint:1032}),
      eulerCarrySeam:Object.freeze({equation:'phi(1033)=1032',reason:'1033 is prime, therefore phi(p)=p-1',binaryCarry:'10000000111 + 1 = 10000001000',alignment:'1032 & 7 = 0',kernighan:'1032 & 1031 = 1024'}),
      decimalMirror:Object.freeze({operator:'REV10_DIGITS',involution:true,records:Object.freeze([1031,1032,1033].map(n=>{const target=decimalReverse(n);return Object.freeze({source:n,target,prime:isPrime(target),primeIndex:primeRanks.get(target)||null,factorization:factorText(target)});})),boundary:'Decimal digit reversal is not fixed-width bit reversal.'}),
      binaryMirror:Object.freeze({operator:'REV2_WIDTH_11',width:11,involution:true,records:Object.freeze([1031,1032,1033].map(n=>{const reversed=reverseBits(n,11);return Object.freeze({source:n,...reversed,prime:isPrime(reversed.value),primeIndex:primeRanks.get(reversed.value)||null,factorization:factorText(reversed.value)});})),boundary:'Width eleven and leading zeros are part of the operator type; dropping them destroys the declared return.'}),
      bridge:Object.freeze({ordinal:'1031=P173',factor:'REV2_WIDTH_11(1031)=1793=11*163',typedConnection:'The same source value exposes 173 in prime-index space and 163 only as a factor after fixed-width bit reversal.'}),
      status:'PASS_TYPED_SCARAB_PRIME_CARRY_DECIMAL_AND_BINARY_MIRROR_GATE',
      authority:Object.freeze({newIdentity:false,newRelation:false,newStudy:false,newFinding:false,publicationAuthorized:false}),
      boundary:'Prime rank, Euler totient, decimal digit reversal and fixed-width bit reversal are four distinct operators. Their shared fixture does not establish one generator, a physical exit, a universal Scarab law or a binary-palindrome claim.'
    });
    return Object.freeze({
      name:'SCARAB_CONTROL_LENS_FOLD_108',
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:ORIENTATION_DEMONSTRATORS','ART:A0:MATHEMATICAL_JOINTS']),
      scarabSource:Object.freeze({module:'a0-scarab-pillar-projection.js',schema:'nexah.a0.scarab-three-face-transit-view/3',carrier:'PURPLE_ADDRESS_POCKET',views:Object.freeze(['side','top','transverse','orbit']),angleDomain:Object.freeze([0,180])}),
      cosineInput:Object.freeze({value:cosine,equation:`cos(theta)=${cosine}`,thetaDegrees,classification:'OWNER_NUMERIC_INPUT'}),
      fold108:Object.freeze({degrees:foldDegrees,ticks:9,tickDegrees:12,equation:`${foldDegrees}=9*12`,scarabPhase:foldDegrees>=63&&foldDegrees<118?'HANDLE_CROSSING':'OUTSIDE_HANDLE_WINDOW'}),
      hingeScale:Object.freeze({rational:'661/1000',decimal:hingeNumerator/1000,carrierNumber:661,primeIndex:121,cube:Object.freeze(cubeAddress(661)),equation:'0.661*1000=661',relation:'DECLARED_DECIMAL_SCALE_CROSSWALK_NOT_IDENTITY'}),
      wheelTriangle,
      mirrorCarryGate,
      sourceScreenPoints:Object.freeze([
        Object.freeze({x:3.3,y:3.3,role:'SOURCE_POINT'}),Object.freeze({x:6.6,y:6.6,role:'SOURCE_CLUSTER'}),
        Object.freeze({x:9.9,y:9.9,role:'SOURCE_POINT'}),Object.freeze({x:12.3,y:13.0,role:'SOURCE_POINT'})
      ]),
      sourceScreenAxes:Object.freeze({x:'Distance (Billion Light Years)',y:'Time since Big Bang (Gyr)',status:'UNVERIFIED_SOURCE_SCREEN_LABELS_NOT_PHYSICAL_MODEL'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,publicationAuthorized:false}),
      boundary:'The Scarab body and view rotation reuse the existing Three-Face Transit display source. The cosine value, decimal hinge cue, Fold 108, orange address triangle, CIKADA state strip, typed carry/mirror gate and source-screen points are separate registers. Resonance and hyperstructure remain Owner labels; no causal, cosmological or physical mechanism is asserted.'
    });
  }

  function foldAddress(n,intensity=0){
    const a=cubeAddress(n),phase=gapPhase(n),f=Math.max(0,Math.min(1,Number(intensity)||0));
    const theta=phase.t*f*Math.PI/2,cx=(CUBE_SIZE-1)/2,cz=4.5,dx=a.x-cx,dz=a.z-cz;
    return Object.freeze({
      x:cx+dx*Math.cos(theta)-dz*Math.sin(theta),
      y:a.y,
      z:cz+dx*Math.sin(theta)+dz*Math.cos(theta),
      source:Object.freeze({n,address:a}),
      segment:phase.segment,
      angleDegrees:theta*180/Math.PI,
      inverse:'RETURN_BY_RETAINED_SOURCE_N'
    });
  }

  function hingeAddress(n,intensity=0){
    const a=cubeAddress(n),f=Math.max(0,Math.min(1,Number(intensity)||0)),theta=f*Math.PI/2;
    const ux=2*a.x/10-1,uy=2*a.y/10-1,uz=2*a.z/9-1,h0=1/9;
    if(n<661)return Object.freeze({x:a.x,y:a.y,z:a.z,normalized:Object.freeze({ux,uy,uz}),source:Object.freeze({n,address:a}),segment:'FIXED_BELOW_661',angleDegrees:0,inverse:'RETURN_BY_RETAINED_SOURCE_N'});
    const ux2=ux,uy2=uy*Math.cos(theta)+(uz-h0)*Math.sin(theta),uz2=h0-uy*Math.sin(theta)+(uz-h0)*Math.cos(theta);
    return Object.freeze({
      x:(ux2+1)*5,y:(uy2+1)*5,z:(uz2+1)*4.5,
      normalized:Object.freeze({ux:ux2,uy:uy2,uz:uz2}),
      source:Object.freeze({n,address:a}),segment:'RIGID_UPPER_661_HINGE',angleDegrees:theta*180/Math.PI,
      hinge:Object.freeze({axis:'u_y=0, u_z=1/9',cubeAxis:'y=5, z=5',sourceAnchor:661}),
      inverse:'RETURN_BY_RETAINED_SOURCE_N',
      boundary:'The 3D rotation is bijective. Only the subsequent 2D screen projection can overlap distinct source records.'
    });
  }

  function transition661Record(){
    return Object.freeze({
      recordId:'PC1111:N0661',pair:Object.freeze([659,661]),twinPairIndex:30,
      primePositions:Object.freeze({p120:659,p121:661,indexSeam:'121=11²'}),
      midpoint:Object.freeze({n:660,factorization:'2²·3·5·11',multiples:Object.freeze([6,11,60,110])}),
      cubeAddress:cubeAddress(661),base11:Object.freeze({number:'551',addressValue:660,address:'550'}),
      normalized:Object.freeze({ux:-1,uy:0,uz:1/9,hingeHeight:1/9}),
      crt37:Object.freeze({left:32,right:32,rightAnchor:809,delta:148,deltaFactor:'4·37'}),
      twinClusterGap:Object.freeze({longestThrough1111:true,left:Object.freeze([659,661]),right:Object.freeze([809,811]),span:148}),
      view:Object.freeze({name:'661_HINGE',thetaMaxDegrees:90,upperRule:'n≥661',lowerRule:'n<661',operator:'DECLARED_VIEW_TRANSFORM'}),
      ownerLabels:Object.freeze(['HG→OF','A5','BHK','AM_IN_PM']),
      boundary:'Owner labels name projection/navigation readings only. They are not standardized mathematical terms or independent operators.'
    });
  }

  function dualGridOrientationRecord(){
    const anchorRoles=Object.freeze({659:'LEFT_WING_OUTER',661:'LEFT_WING_SPINE',809:'RIGHT_WING_SPINE',811:'RIGHT_WING_OUTER'}),primeRank=new Map(sieve(MAX_N).map((n,i)=>[n,i+1]));
    const anchors=Object.freeze([659,661,809,811].map(n=>Object.freeze({
      n,role:anchorRoles[n],primeIndex:primeRank.get(n),
      cube:cubeAddress(n),grid:gridAddress(n),mod37:mod(n,37),fold90:foldAddress(n,1)
    })));
    return Object.freeze({
      name:'DUAL_GRID_ORIENTATION_VIEW',
      anchors,
      links:Object.freeze([
        Object.freeze({role:'LEFT_WING',from:659,to:661,delta:2}),
        Object.freeze({role:'SPINE',from:661,to:809,delta:148,gridRows:4,gridColumn:31,residue37:32,deltaFactor:'4·37'}),
        Object.freeze({role:'RIGHT_WING',from:809,to:811,delta:2})
      ]),
      seamPin:Object.freeze({n:726,role:'DECLARED_11_SQUARED_SEAM_PIN',prime:false,cube:cubeAddress(726),grid:gridAddress(726),factor:'6·11²'}),
      gapInterior:Object.freeze({count:147,primeCount:18,layerSplit:Object.freeze([Object.freeze({z:5,count:65}),Object.freeze({z:6,count:82})])}),
      pinGrammar:Object.freeze({prime:'BLUE_FILL',twin:'RED_RING',triplet:'YELLOW_RING',quadruplet:'PURPLE_DIAMOND',superprime:'GREEN_CORE',layerClosure:'CYAN_DIAMOND'}),
      return:'RETAINED_SOURCE_NUMBER',
      boundary:'This is a dual-register orientation view over the existing carrier. Prime constellation memberships may overlap and are not canonical Navigator Families. Camera top/bottom is not an invariant; the 37-column spine and exact source addresses are.'
    });
  }

  function sliceAtlasRecord(){
    const primes=sieve(MAX_N),primeIndex=new Map(primes.map((n,i)=>[n,i+1])),groups=constellationGroups(MAX_N),member=membership(groups);
    const layers=Object.freeze(Array.from({length:10},(_,z)=>{
      const min=1+LAYER_AREA*z,max=Math.min(LAYER_AREA*(z+1),MAX_N),values=Array.from({length:max-min+1},(_,i)=>min+i);
      const within=group=>group.every(n=>n>=min&&n<=max);
      return Object.freeze({
        z,min,max,count:values.length,
        primeCount:values.filter(isPrime).length,
        twinMembers:values.filter(n=>member.twin.has(n)).length,
        tripletMembers:values.filter(n=>member.triplet.has(n)).length,
        quadrupletMembers:values.filter(n=>member.quadruplet.has(n)).length,
        superprimeMembers:values.filter(n=>primeIndex.has(n)&&isPrime(primeIndex.get(n))).length,
        containedGroups:Object.freeze({twins:groups.twins.filter(within).length,triplets:groups.triplets.filter(within).length,quadruplets:groups.quadruplets.filter(within).length})
      });
    }));
    const cRailNumbers=Object.freeze([101,103,107,109]);
    return Object.freeze({
      name:'BASE11_SLICE_ATLAS_VIEW',
      layers,
      cRail:Object.freeze({ownerLabel:'C-REIHE',z:0,y:9,rowRange:Object.freeze([100,110]),numbers:cRailNumbers,gaps:Object.freeze([2,4,2]),primeRanks:Object.freeze(cRailNumbers.map(n=>primeIndex.get(n))),cube:Object.freeze(cRailNumbers.map(cubeAddress)),classification:'STANDARD_PRIME_QUADRUPLET'}),
      connectorRule:'Draw a connector only when the complete finite group is contained in the selected Base-11 z-layer.',
      return:'RETAINED_SOURCE_NUMBER',
      boundary:'C-REIHE, Gerüst, Verklebung, triangle, mirror and obelisk are Owner orientation labels. Exact layer addresses and finite constellation memberships are testable; visible overlap, symmetry or a fixed screen position does not establish a new Prime Family, invariant geometry or operator.'
    });
  }

  function eulerCompassRecord(){
    const sharedPrimes=Object.freeze(sieve(1000)),tailPrimes=Object.freeze(sieve(MAX_N).filter(n=>n>1000));
    const point=n=>Object.freeze({n,radius:Math.sqrt(n/1000),residue7:mod(n,7),residue11:mod(n,11),angle7:2*Math.PI*mod(n,7)/7,angle11:2*Math.PI*mod(n,11)/11});
    return Object.freeze({
      name:'EULER_COMPASS_SHARED_SUBCARRIER_VIEW',
      sourceOperator:'a0-prime-torus-thread-demonstrator.js',
      sharedCarrier:Object.freeze({predicate:'prime p <= 1000',count:sharedPrimes.length,primes:sharedPrimes,points:Object.freeze(sharedPrimes.map(point))}),
      tail:Object.freeze({predicate:'prime 1000 < p <= 1111',count:tailPrimes.length,primes:tailPrimes,status:'OUTSIDE_SHARED_EULER_SUBCARRIER_RETAINED_IN_PRIMECUBE'}),
      angleRules:Object.freeze({mod7:'theta = 2pi * (p mod 7) / 7',mod11:'theta = 2pi * (p mod 11) / 11',radius:'r = sqrt(p/1000)'}),
      torus:Object.freeze({moduli:Object.freeze([7,11]),unitNodes:Object.freeze([6,10]),cellGrid:Object.freeze([5,9]),sourceTransitions:167,uniqueUndirectedEdges:135,repeatedPrimeTraversals:27,oddVertices:24,auditSteps:270,closed:true,status:'REUSED_TYPED_OPERATOR'}),
      return:'RETAINED_SOURCE_NUMBER',
      boundary:'Euler Compass compares angle rules on the existing p<=1000 prime subset and reuses the separate 7x11 Euler audit. The 18 primes above 1000 remain an explicit Primecube tail. No cube embedding, intrinsic prime geometry or Euler-Rainbow identity is declared.'
    });
  }

  function qCubeAddress(n){
    if(!Number.isInteger(n)||n<1||n>1001)throw new RangeError('Q-cube source n must be 1..1001');
    const residue=mod(n,1001);
    return Object.freeze({sourceNumber:n,residue,mod7:mod(residue,7),mod11:mod(residue,11),mod13:mod(residue,13)});
  }

  function mz24CompassRecord(n){
    if(!Number.isInteger(n))throw new TypeError('MZ24 source n must be an integer');
    const mod11=mod(n,11),mod13=mod(n,13),tick=(mod11+mod13)%24,angleDegrees=tick*15;
    return Object.freeze({
      sourceNumber:n,mod11,mod13,tick,angleDegrees,
      quadrant:Math.floor(tick/6),quarterTurn:tick%6===0,
      notation:`MZ24(${n})=${tick}`
    });
  }

  let qCubeRecordCache=null;
  function qCubeRecord(){
    if(qCubeRecordCache)return qCubeRecordCache;
    const Q=1001,forwardMultiplier=20,inverseMultiplier=951;
    const orbit=(multiplier,start=1)=>{const values=[];let value=start;do{values.push(value);value=mod(value*multiplier,Q)}while(value!==start&&values.length<=Q);return Object.freeze(values)};
    const base20Orbit=orbit(forwardMultiplier),base10Orbit=orbit(10);
    const inverseOrbit=orbit(inverseMultiplier);
    const orbitPrimeHits=Object.freeze(base20Orbit.map((n,orbitStep)=>({n,orbitStep})).filter(item=>isPrime(item.n)).map(item=>Object.freeze({...item,address:qCubeAddress(item.n)})));
    const factorText=n=>{let value=n,p=2,factors=[];while(p*p<=value){while(value%p===0){factors.push(p);value/=p}p=p===2?3:p+2}if(value>1)factors.push(value);return factors.join(' · ')};
    const concatPairs=Object.freeze([[1,111],[729,131],[92,141],[456,151],[911,191]].map(([left,right])=>{
      const value=Number(`${left}${right}`),prime=isPrime(value),residue=mod(value,Q)||Q;
      return Object.freeze({left,right,notation:`${left}|${right}`,value,prime,primeRank:prime?sieve(value).length:null,factorization:prime?String(value):factorText(value),residue:mod(value,Q),address:qCubeAddress(residue)});
    }));
    const primeCrosswalk=concatPairs.find(item=>item.value===456151);
    const perfectVPeak=Object.freeze({
      n:496,
      orbitStep:base20Orbit.indexOf(496),
      address:qCubeAddress(496),
      factorization:'2⁴ · 31',
      properDivisors:Object.freeze([1,2,4,8,16,31,62,124,248]),
      properDivisorSum:496,
      perfectNumberOrdinal:3,
      ownerVisualRole:'V_PEAK_TWO_SCREEN_LINES_OVERLAP',
      suffixBlock:Object.freeze({value:12,typedRole:'PRIME_RANK',primeAtRank:37,statement:'p₁₂ = 37'}),
      notation:'496|12',
      boundary:'496 and 12 remain typed blocks: 496 is the third perfect number and a T20 orbit value; 12 is the prime rank of 37. The V peak and overlapping screen lines are projection readings, not a new CRT invariant.'
    });
    const barcodeSteps=Object.freeze(base20Orbit.map((n,orbitStep)=>Object.freeze({orbitStep,n,cube:cubeAddress(n),crt:qCubeAddress(n),mz24:mz24CompassRecord(n),prime:isPrime(n),perfectPeak:n===496})));
    const observedMz24Ticks=Object.freeze([...new Set(barcodeSteps.map(step=>step.mz24.tick))].sort((a,b)=>a-b));
    const missingMz24Ticks=Object.freeze(Array.from({length:24},(_,tick)=>tick).filter(tick=>!observedMz24Ticks.includes(tick)));
    const coupledGridBarcode=Object.freeze({
      name:'T20_CRITICAL_ORBIT_COUPLED_ADDRESS_BARCODE',
      ownerLabel:'CRITICAL ORBIT',
      length:base20Orbit.length,
      steps:barcodeSteps,
      channels:Object.freeze([
        Object.freeze({name:'CRT_MOD_7',range:Object.freeze([0,6])}),
        Object.freeze({name:'CRT_MOD_11',range:Object.freeze([0,10])}),
        Object.freeze({name:'CRT_MOD_13',range:Object.freeze([0,12])}),
        Object.freeze({name:'BASE11_LAYER_Z',range:Object.freeze([0,8])})
      ]),
      derivedChannels:Object.freeze([
        Object.freeze({name:'MZ24_COMPASS',law:'(n mod 11 + n mod 13) mod 24',range:Object.freeze([0,23]),tickDegrees:15,quarterTurnTicks:Object.freeze([0,6,12,18]),observedTicks:observedMz24Ticks,missingTicks:missingMz24Ticks})
      ]),
      exactReturn:'step 59: 951; 20·951 mod 1001 = 1',
      status:'COUPLED_ADDRESS_VIEW',
      boundary:'The barcode couples two exact address systems for the same retained orbit value: Base-11 cube address and CRT residues. MZ24 is a declared non-injective view projection of the mod-11 and mod-13 residues; it is not a CRT identity. Bar height and color are display encodings. Critical orbit is an Owner view label, not a dynamical critical-orbit claim.'
    });
    qCubeRecordCache=Object.freeze({
      name:'Q_CRT_T20_PLUS_MINUS_CUBE_VIEW',
      modulus:Q,factorization:Object.freeze([7,11,13]),shape:Object.freeze([7,11,13]),phi:720,carmichaelLambda:60,
      addressLaw:'n ↦ (n mod 7, n mod 11, n mod 13)',
      forward:Object.freeze({name:'T20+',law:'n ↦ 20n mod 1001',multiplier:forwardMultiplier,order:multiplicativeOrder(20,Q),orbit:base20Orbit}),
      inverse:Object.freeze({name:'T20−',law:'n ↦ 951n mod 1001',multiplier:inverseMultiplier,order:multiplicativeOrder(inverseMultiplier,Q),orbit:inverseOrbit}),
      base10Control:Object.freeze({name:'T10',law:'n ↦ 10n mod 1001',multiplier:10,order:multiplicativeOrder(10,Q),orbit:base10Orbit}),
      components:Object.freeze([
        Object.freeze({modulus:7,forward:6,inverse:6,order:2}),
        Object.freeze({modulus:11,forward:9,inverse:5,order:5}),
        Object.freeze({modulus:13,forward:7,inverse:2,order:12})
      ]),
      exactReturn:Object.freeze({forwardThenInverse:mod(forwardMultiplier*inverseMultiplier,Q),power60:modularPower(forwardMultiplier,60,Q),verifiedBy:'ITERATED_INTEGER_MODULAR_ARITHMETIC'}),
      orbitPrimeHits,
      perfectVPeak,
      coupledGridBarcode,
      screenLasso:Object.freeze({
        nodes:orbitPrimeHits,
        count:orbitPrimeHits.length,
        path:'CLOSED_SCREEN_POLYLINE_THROUGH_T20_ORBIT_PRIME_HITS',
        status:'VIEW_LOCAL_SUBSEQUENCE_OVERLAY',
        contractibility:'NOT_TESTED',
        boundary:'The orange lasso is a closed screen path through the nine prime-valued residues of the declared 60-step orbit. Screen crossings are not CRT intersections, knot invariants or evidence of a 3-manifold topology.'
      }),
      decimalConcatenationCrosswalk:Object.freeze({
        readings:concatPairs,
        uniquePrime:primeCrosswalk,
        exactEquation:'456151 = 455·1001 + 696',
        iso45Status:'OWNER_SCREEN_ORIENTATION_LABEL_ONLY',
        boundary:'The vertical-bar readings are declared decimal concatenations. Primality belongs to the concatenated integer; the Q point is only its residue modulo 1001. ISO45 remains a screen-orientation label without an isometric projection contract.'
      }),
      carrierCrosswalk:Object.freeze({midpoint:660,hinge:661,equations:Object.freeze(['660 = 11·60','661 = p_121','121 = 11²']),status:'EXACT_POST_HOC_CROSSWALK_NOT_CAUSAL_CLAIM'}),
      ownerIntake:Object.freeze({markers:Object.freeze(['2026 | Q²·2³','f / u / t','6f / 2m','FC15.7ft']),status:'UNBOUND_OWNER_INTAKE_HOLD',boundary:'No unit conversion, exponent law, date code or operator semantics is assigned.'}),
      identityBoundary:'This local Q label means the CRT modulus 1001. T20± is not identified with the pre-existing PBDQ/TQ± glyph orbit, Q3D token permutations, or the local C9 display role.',
      findingBoundary:'The exact group exponent λ(1001)=60 and the maximal order ord_1001(20)=60 are verified. The 10/20 base pair is not unique in producing the 60 bound; significance beyond this finite modular model is not asserted.',
      return:'RETAINED_SOURCE_NUMBER_AND_INVERTIBLE_MODULAR_PERMUTATION'
    });
    return qCubeRecordCache;
  }

  const UNIT_FACTORS_METRES=Object.freeze({
    km:1000,m:1,dm:.1,cm:.01,mi:1609.344,yd:.9144,ft:.3048,in:.0254,cubit:.523
  });
  const UNIT_VIEW_STEPS=Object.freeze({km:.001,m:1,dm:10,cm:100,mi:.0005,yd:1,ft:2,in:24,cubit:1});

  function unitRootShearRecord(markerValue=15.7,unit='m',intensity=.4){
    const markerKey=String(markerValue),markers=Object.freeze([
      Object.freeze({value:7.83,exact:'783/100',squareExact:'613089/10000',square:61.3089,sourceRole:'OWNER_MNEMONIC_UNBOUND'}),
      Object.freeze({value:12.6,exact:'63/5',squareExact:'3969/25',square:158.76,sourceRole:'ZITHER_DECIMAL_CARRY_SOURCE'}),
      Object.freeze({value:13.7,exact:'137/10',squareExact:'18769/100',square:187.69,sourceRole:'ZITHER_DECIMAL_CARRY_SOURCE'}),
      Object.freeze({value:15.7,exact:'157/10',squareExact:'24649/100',square:246.49,sourceRole:'OWNER_FC15_7FT_INTAKE'})
    ]),marker=markers.find(item=>String(item.value)===markerKey)||markers.at(-1);
    if(!Object.hasOwn(UNIT_FACTORS_METRES,unit))throw new RangeError(`unit must be one of ${Object.keys(UNIT_FACTORS_METRES).join(', ')}`);
    const sourceMetres=4.78536,converted=sourceMetres/UNIT_FACTORS_METRES[unit],f=Math.max(0,Math.min(1,Number(intensity)||0)),angleDegrees=90*f,angleRadians=angleDegrees*Math.PI/180;
    const cos=Math.cos(angleRadians),sin=Math.sin(angleRadians),tan=Math.tan(angleRadians),x=marker.value*cos,y=marker.value*sin,reconstructed=Math.hypot(x,y);
    const stair=Object.freeze(Array.from({length:13},(_,index)=>{const degrees=angleDegrees*index/12,radians=degrees*Math.PI/180;return Object.freeze({index,degrees,radians,x:marker.value*Math.cos(radians),y:marker.value*Math.sin(radians)})}));
    const conversions=Object.freeze(Object.fromEntries(Object.entries(UNIT_FACTORS_METRES).map(([name,factor])=>[name,sourceMetres/factor]))),tickStep=UNIT_VIEW_STEPS[unit],tickCeiling=Math.ceil(converted/tickStep)*tickStep;
    const displayScale=Object.freeze({unit,span:converted,tickStep,tickCeiling,ticks:Object.freeze(Array.from({length:Math.round(tickCeiling/tickStep)+1},(_,index)=>Object.freeze({value:index*tickStep,normalized:index*tickStep/converted}))),status:'VIEW_SCALE_ONLY_SOURCE_METRES_RETAINED'});
    const rootMaximum=markers.at(-1).value,rootScale=Object.freeze({maximum:rootMaximum,selected:marker.value,fraction:marker.value/rootMaximum,status:'DECLARED_ROOT_VIEW_EXTENT'});
    return Object.freeze({
      name:'UNIT_ROOT_SHEAR_COMPARATOR_VIEW',marker,markers,
      physicalSource:Object.freeze({
        value:15.7,unit:'ft',metres:sourceMetres,exact:'157/10 ft = 59817/12500 m',conversions,
        selectedUnit:unit,selectedValue:converted,displayScale,
        selectedStandard:unit==='cubit'?Object.freeze({name:'ROYAL_CUBIT_OWNER_INTAKE',factorMetres:.523,display:'1 cubit = 0.523 m',status:'DECLARED_OWNER_INTAKE_VIEW_FACTOR'}):Object.freeze({name:'SI_OR_INTERNATIONAL_UNIT',factorMetres:UNIT_FACTORS_METRES[unit],display:`1 ${unit} = ${UNIT_FACTORS_METRES[unit]} m`,status:'DECLARED_EXACT_CONVERSION_FACTOR'})
      }),
      rootScale,
      fold:Object.freeze({intensity:f,angleDegrees,angleRadians,cos,sin,tan,components:Object.freeze({x,y}),reconstructed,residual:reconstructed-marker.value,law:'Sθ(ℓ)=(ℓ cosθ, ℓ sinθ)',returnLaw:'√(x²+y²)=ℓ'}),
      stair:Object.freeze({steps:12,stepDegrees:angleDegrees/12,forward:stair,return:Object.freeze(stair.slice().reverse()),closure:'EXACT_BY_RETAINED_MARKER_AND_REVERSED_DECLARED_PATH'}),
      angleGrids:Object.freeze({selectedAngleTwelveSteps:angleDegrees/12,quarterTurnTwelveSteps:7.5,twelveSectorThirds:10}),
      screenGridReading:Object.freeze({center:Object.freeze({columns:4,rows:3,pins:12}),outer:Object.freeze({left:3,right:3,top:4,bottomLeft:6,bottomRight:6}),totalPins:34,status:'OWNER_SCREEN_CLUSTER_READING_NOT_CRT_INVARIANT'}),
      lowerCrtRail:Object.freeze({
        anchors:Object.freeze([
          Object.freeze({n:97,address:qCubeAddress(97),orbitStep:qCubeRecord().forward.orbit.indexOf(97)}),
          Object.freeze({n:944,address:qCubeAddress(944),orbitStep:qCubeRecord().forward.orbit.indexOf(944)})
        ]),
        invariant:'mod 7 = 6 and mod 11 = 9; only the mod-13 coordinate changes from 6 to 8',
        candidate696:Object.freeze({n:696,address:qCubeAddress(696),status:'OWNER_NAMED_CANDIDATE_NOT_IDENTIFIED_WITH_SCREEN_PIN'})
      }),
      mycelRootSplit:Object.freeze({
        glyphRail:Object.freeze(['ç','√','∫','~','µ']),
        markerNodes:Object.freeze(markers.map((item,index)=>Object.freeze({
          index,value:item.value,exact:item.exact,normalized:item.value/markers.at(-1).value,
          selected:item.value===marker.value,sourceRole:item.sourceRole
        }))),
        selectedMarker:Object.freeze({value:marker.value,exact:marker.exact}),
        split:Object.freeze({
          sharedCoordinates:Object.freeze({mod7:6,mod11:9}),
          branchCoordinate:'mod13',branches:Object.freeze([
            Object.freeze({n:97,mod13:6,color:'CYAN',role:'FORWARD_BRANCH'}),
            Object.freeze({n:944,mod13:8,color:'GOLD',role:'RETURN_BRANCH'})
          ]),
          exactStatement:'97=(6,9,6); 944=(6,9,8); shared (mod7,mod11)=(6,9); split Δmod13=2'
        }),
        source:'A0_SPIN_TO_BLOOM_MEASUREMENT.html#rootRatioMycelium',
        sourceReceipt:'results/a0-spin-to-bloom-measurement-return-2026-10-29.json',
        status:'SOURCE_BOUND_VIEW_CROSSWALK_NOT_CANONICAL_RELATION',
        boundary:'The glyph rail and fibers are display proxies. The selected decimal Root marker controls the stair length; it is not identified with 97, 944, a radicand, a biological mycelium or a physical coupling.'
      }),
      sourceDock:Object.freeze({
        angle333:Object.freeze({
          stepDegrees:333,addressStepDegrees:111,modulusDegrees:120,gcd:3,
          uniqueDirections:40,firstReturnStep:40,visitsPerDirection:3,
          exactLaw:'333° = 3·111°; gcd(111,120)=3; 120/3=40',
          source:'results/a0-angle-address-compare-3-111-333-2026-10-25.json',
          status:'EXACT_NEGATIVE_CONTROL_SEPARATE_FROM_HISTORICAL_33_DEGREE_RAY'
        }),
        plateMirror:Object.freeze({
          carrier:'RETAINED_SOURCE_ADDRESS',plateRole:'PRIME_SELECTS_PLATE',mirrorRole:'VIEW_SWITCH',
          axes:Object.freeze(['y=x','y=-x']),
          source:'results/a0-plate-mirror-reference-return-2026-10-20.json',
          status:'VIEW_CHANGE_NOT_SOURCE_CHANGE'
        }),
        pinkGreyMeeting:Object.freeze({
          registers:Object.freeze(['POSITION','COLOR_PINK_SHIFT','ECHO_LAG','SHADOW_FRACTION']),
          fullReturnCondition:'position=PASS; pink=0; echo=0; visible area=4/4',
          greyRole:'CONTROL',pinkRole:'DECLARED_DISPLAY_SHIFT',
          source:'results/a0-grey-pink-typed-source-hof-return-2026-11-21.json',
          status:'FOUR_TYPED_RECORDS_ONE_RETURN_CHECK'
        }),
        breath:Object.freeze({
          core:'FIXED',bands:3,phaseOffsetsDegrees:Object.freeze([0,120,240]),cycleSeconds:4,amplitude:.06,
          source:'results/a0-breathing-crystal-bench-return-2026-10-29.json',
          apertureSource:'results/a0-breathing-crystal-aperture-return-2026-10-29.json',
          status:'SOURCE_BOUND_DISPLAY_PHASE_NOT_PHYSICAL_BREATH_MODEL'
        }),
        cubitExchange:Object.freeze({
          standard:'ROYAL_CUBIT_OWNER_INTAKE',factorMetres:.523,statement:'1 cubit = 0.523 m',
          provenanceLabel:'OWNER VISUAL INTAKE · 2026-11-24 · 52.3 cm rounded reading',
          sourceReceipt:'results/a0-cubit-unit-source-intake-2026-11-24.json',
          sources:Object.freeze([
            Object.freeze({id:'YOUTUBE_98ZM4NOZEKI',url:'https://www.youtube.com/watch?v=98Zm4noZekI',transcript:'OWNER_SUPPLIED_TEXT_AVAILABLE',role:'HISTORICAL_MATHEMATICS_CONTEXT_ONLY'}),
            Object.freeze({id:'YOUTUBE_WCIL_YCMZE8',url:'https://www.youtube.com/watch?v=wciL_yCmZe8',transcript:'NO_TRANSCRIPT_IN_CURRENT_INTAKE',role:'SECONDARY_AUDIOVISUAL_WITNESS'})
          ]),
          returnLaw:'selected cubits × 0.523 m = retained 4.78536 m source',
          status:'DECLARED_VIEW_FACTOR_NOT_UNIVERSAL_HISTORICAL_STANDARD',
          boundary:'The 0.523 m factor is the explicitly selected rounded intake reading. The displayed 20 9/16 international inches converts to 52.22875 cm, not exactly 52.3 cm. Cubit traditions vary; no universal ancient standard, dimensional resonance or physical conversion mechanism is asserted.'
        }),
        boundary:'The source readings share one comparator dock only. They do not share an operator, carrier identity, clock, physical mechanism or canonical Source Graph relation. Dzhanibekov remains an unbound visual analogy until an inertia tensor and falsifiable operator contract are supplied.'
      }),
      qReturn:Object.freeze({source:1,crtAddress:qCubeAddress(1),notation:'1 ↔ (1,1,1)',exact:true}),
      mirror:Object.freeze({glyph:'¡',role:'OWNER_COUNTERPOINT_TO_1_RETURN',operator:'UNDEFINED',status:'HOLD'}),
      qrtBoundary:'In ART:ROSETTA:QRT_FIXTURE, R is the declared inverse and address-aligned Return. QRT20 remains a controlled address label and receives no universal letter expansion here.',
      unitBoundary:'km, m, dm, cm, international mile, yard, international foot and inch use declared exact conversion factors. The Cubit view uses the separately named Owner-intake factor 0.523 m and remains approximate historical provenance, not a universal standard. Every changing tick grid is a view scale over the retained 4.78536 m source, not a change of source geometry.',
      projectionBoundary:'The 4x3 and outer 3/3/4/6/6 clusters are a reproducible screen overlay, not proof that projected line crossings share a CRT address.',
      return:'RETAINED_MARKER_EXACT_UNIT_CODEC_AND_INVERSE_SHEAR_VIEW'
    });
  }

  const MILLENNIUM_TOTAL=1000000;
  const MILLENNIUM_DIVISORS=Object.freeze([5040,108000,1000]);
  function millenniumGridRecord(n=997920,divisor=5040){
    const sourceNumber=Math.max(1,Math.min(MILLENNIUM_TOTAL,Math.trunc(Number(n)||1))),d=Math.trunc(Number(divisor));
    if(!MILLENNIUM_DIVISORS.includes(d))throw new RangeError(`divisor must be one of ${MILLENNIUM_DIVISORS.join(', ')}`);
    const index=sourceNumber-1,x=index%1000,y=Math.floor(index/1000),a=index%100,b=Math.floor(index/100)%100,c=Math.floor(index/10000);
    const fullBlocks=Math.floor(MILLENNIUM_TOTAL/d),covered=fullBlocks*d,residual=MILLENNIUM_TOTAL-covered,isResidual=sourceNumber>covered;
    const blockNumber=Math.floor(index/d)+1,offset=(index%d)+1;
    const cut=Object.freeze({
      divisor:d,fullBlocks,covered,residual,isResidual,blockNumber,offset,
      residualIndex:isResidual?sourceNumber-covered:0,
      overhangForNextBlock:covered+d-MILLENNIUM_TOTAL
    });
    const familyTable=Object.freeze([
      Object.freeze({n:1111,factors:'11·101',divisorCount:4,squareRole:'√1111 ≈ 33.3317',role:'BASE_11_PRIME_GAP_CARRIER'}),
      Object.freeze({n:5040,factors:'2^4·3^2·5·7',divisorCount:60,squareRole:'71²−1',role:'HIGHLY_DIVISIBLE_SMALL_CARRIER'}),
      Object.freeze({n:10080,factors:'2^5·3^2·5·7',divisorCount:72,squareRole:'√10080 ≈ 100.3992',role:'DOUBLE_5040'}),
      Object.freeze({n:10800,factors:'2^4·3^3·5²',divisorCount:60,squareRole:'√10800 ≈ 103.9230',role:'108_FAMILY_CARRIER'}),
      Object.freeze({n:108000,factors:'2^5·3^3·5^3',divisorCount:96,squareRole:'√108000 ≈ 328.6335',role:'DECIMAL_108_EXTENSION'}),
      Object.freeze({n:1000000,factors:'2^6·5^6',divisorCount:49,squareRole:'1000²',role:'EXACT_DECIMAL_SQUARE'})
    ]);
    return Object.freeze({
      schema:'nexah.a0.millennium-decimal-carrier-view/1',status:'EXACT_FINITE_ADDRESS_AND_RESIDUAL_VIEW',
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS']),graphDelta:Object.freeze({identities:0,relations:0,aliases:0}),
      carrier:Object.freeze({min:1,max:MILLENNIUM_TOTAL,count:MILLENNIUM_TOTAL,square:Object.freeze([1000,1000]),cube:Object.freeze([100,100,100]),factorization:'2^6·5^6',divisorCount:49}),
      sourceNumber,recordId:`MG1M:N${String(sourceNumber).padStart(7,'0')}`,
      squareAddress:Object.freeze({x,y,law:'n=1+x+1000y',return:1+x+1000*y}),
      cubeAddress:Object.freeze({a,b,c,law:'n=1+a+100b+10000c',return:1+a+100*b+10000*c}),
      zeroBasedCrosswalk:Object.freeze({n0:index,np:y,rr:x,law:'n0=1000·NP+RR; n1=n0+1',status:'PRESENTATION_ADAPTER_TO_EXISTING_NP_RR_GRID'}),
      cut,
      drift5040:Object.freeze({rowSpan:5,columnStep:40,blockPeriod:25,cycleAddresses:126000,cycleRows:126,completeCycles:7,alignedRows:882,tailBlocks:23,tailCovered:115920,residualShape:Object.freeze([{y:997,x0:920,x1:999,count:80},{y:998,x0:0,x1:999,count:1000},{y:999,x0:0,x1:999,count:1000}])}),
      cut108000:Object.freeze({fullBlocks:9,covered:972000,residual:28000,residualRows:28,nextBlockOverhang:80000}),
      squareOf5040:Object.freeze({value:25401600,factorization:'2^8·3^4·5²·7²',divisorCount:405}),
      familyTable,
      return:Object.freeze({method:'RETAINED_SOURCE_NUMBER',n:sourceNumber,squareExact:1+x+1000*y===sourceNumber,cubeExact:1+a+100*b+10000*c===sourceNumber}),
      boundary:'One finite decimal carrier with three typed divisor overlays. The one-based MG1M record is a presentation adapter over the existing zero-based NP/RR grid. Divisibility, square/cube reshaping and residual geometry do not identify Primecube, 5040, 108000 or the million carrier and create no universal scale, physical mechanism or new Navigator relation.'
    });
  }

  function windowSequence111213Record(step=0,viewAngle=0,motionStep=0){
    const normalizedStep=mod(Math.trunc(Number(step)||0),7),angle=mod(Number(viewAngle)||0,360),motionPhase=mod(Number(motionStep)||0,28),motionAngle=motionPhase*360/28;
    const thetaLiftProgress=normalizedStep/6,thetaLiftRoute=Object.freeze(['W11','+23','W12','72−','Σ12','72+','W13']);
    const rootMetrics=Object.freeze(Array.from({length:12},(_,column)=>Object.freeze({column:column+1,...rootGap(column+1),sourceView:'AM',targetView:'PM'})));
    const seamEdges=Object.freeze(Array.from({length:12},(_,column)=>Object.freeze({column:column+1,from:Object.freeze({row:6,column:column+1}),to:Object.freeze({row:7,column:column+1}),rootMetric:rootMetrics[column]})));
    const states=Object.freeze([
      Object.freeze({id:'W11',label:'W11',kind:'GRID',gridSize:11,cellCount:121,equation:'11² = 121'}),
      Object.freeze({id:'DELTA23',label:'+23',kind:'BOUNDARY_SHELL',from:11,to:12,cellCount:23,equation:'12² − 11² = 23'}),
      Object.freeze({id:'W12',label:'W12',kind:'GRID',gridSize:12,cellCount:144,equation:'12² = 144'}),
      Object.freeze({id:'H_MINUS_72',label:'72⁻',kind:'HALF_GRID',gridSize:12,rows:Object.freeze([1,6]),cellCount:72,equation:'6·12 = 72'}),
      Object.freeze({id:'SIGMA12',label:'Σ12 · G√',kind:'TRANSVERSAL_SEAM_EDGES',gridSize:12,betweenRows:Object.freeze([6,7]),edgeCount:12,edges:seamEdges,rootMetrics,equation:'|Σ12| = 12 edges; Δk = √(k+1) − √k'}),
      Object.freeze({id:'H_PLUS_72',label:'72⁺',kind:'HALF_GRID',gridSize:12,rows:Object.freeze([7,12]),cellCount:72,equation:'6·12 = 72'}),
      Object.freeze({id:'DELTA25_W13',label:'+25 → W13',kind:'BOUNDARY_SHELL_AND_GRID',from:12,to:13,shellCellCount:25,gridSize:13,cellCount:169,equation:'13² − 12² = 25; 13² = 169'})
    ]);
    return Object.freeze({
      name:'W11_W12_TRANSVERSAL_SEAM_W13_SEQUENCE',
      sequence:Object.freeze(states.map(state=>state.id)),states,current:states[normalizedStep],step:normalizedStep,
      exactLaws:Object.freeze(['11²=121','12²−11²=23','12²=144=72+72','|Σ12|=12 edges','Δk=√(k+1)−√k','Σ[k=1..12]Δk=√13−1','13²−12²=25','13²=169']),
      greyspace:Object.freeze({id:'G_ROOT_12',role:'METRIC_TRANSITION_LAYER',sourceView:'AM',targetView:'PM',metricCount:12,metrics:rootMetrics,telescopingExact:'√13 − 1',telescopingApproximation:Math.sqrt(13)-1,cellCount:0,edgeCount:12,status:'BOUND_TO_SIGMA12_NOT_AN_ADDITIONAL_GRID_ROW'}),
      depthStack:Object.freeze({
        role:'SCREEN_DEPTH_COMPOSITE',
        layers:Object.freeze([
          Object.freeze({id:'W11',gridSize:11,depth:-1,scale:.96,offset:Object.freeze([-.035,-.025]),opacity:.28}),
          Object.freeze({id:'W12',gridSize:12,depth:0,scale:1,offset:Object.freeze([0,0]),opacity:.48}),
          Object.freeze({id:'W13',gridSize:13,depth:1,scale:1.04,offset:Object.freeze([.035,.025]),opacity:.28})
        ]),
        fineThreads:Object.freeze({count:13,parameter:'t=i/12, i=0…12',law:'connect normalized W11 and W13 screen frames at equal t',status:'DISPLAY_DEPTH_THREADS_NOT_CELL_EDGES'}),
        boundary:'The three grids are retained simultaneously as screen-depth layers. Offset, scale, opacity and normalized fine threads are cartographic encodings; they add no cells, edges, dimensions or relations.'
      }),
      motion28:Object.freeze({
        ownerLabel:'TESLA 4×7',role:'PINK_BLUE_COUNTER_ROTATION_DISPLAY',period:28,quadrants:4,stationsPerQuadrant:7,phase:motionPhase,phaseIndex:Math.floor(motionPhase),quadrant:Math.floor(motionPhase/7),station:Math.floor(motionPhase)%7,stepDegrees:360/28,
        layerAngles:Object.freeze({W11_BLUE:motionAngle,W12_BODY:0,W13_PINK:-motionAngle}),
        exactReturn:Object.freeze({afterSteps:28,blueDegrees:28*360/28,pinkDegrees:-28*360/28,modulo360:Object.freeze({blue:mod(28*360/28,360),pink:mod(-28*360/28,360)})}),
        status:'OWNER_NAMED_DISPLAY_CYCLE_NOT_PHYSICAL_TESLA_MECHANISM',
        boundary:'4×7 means four display quadrants with seven stations each. Blue W11 and pink W13 counter-rotate around the retained W12 screen body and return after 28 steps. No electromagnetic, Tesla-coil, energy, resonance or physical-body claim follows.'
      }),
      thetaLift:Object.freeze({
        role:'RETAINED_CUBE_VIEW_PHASE_LIFT',step:normalizedStep,station:normalizedStep+1,stationCount:7,progress:thetaLiftProgress,thetaDegrees:angle,
        route:thetaLiftRoute,current:thetaLiftRoute[normalizedStep],displaySpan:11+2*thetaLiftProgress,verticalDisplayOffset:-1+2*thetaLiftProgress,
        drift:Object.freeze({stepDegrees:80,exactComparatorDegrees:72,residualPerStep:8,fiveStepDegrees:400,fiveStepResidual:mod(5*80,360)}),
        source:Object.freeze({carrier:'W11_W12_TRANSVERSAL_SEAM_W13_SEQUENCE',addressMutation:false,identity:'MOD:NUMBER_VIEW_SUITE'}),
        return:Object.freeze({method:'RETAINED_SOURCE_VIEW',sourceReturnExact:true,routeEndpoint:normalizedStep===0||normalizedStep===6,angularClosure:false,graphDelta:Object.freeze({identities:0,relations:0,aliases:0})}),
        boundary:'Theta Lift is a seven-station display transform of the retained W11-W13 cube view. Scale, screen position, angle and trail change; carrier addresses, source identity and the return contract do not.'
      }),
      typedInventory:Object.freeze({lowerCells:72,seamEdges:12,upperCells:72,displayTotal:156,boundary:'72+12+72 counts two cell sets and one edge set; 156 is not an area or cell total.'}),
      view:Object.freeze({angle,halfTurnSwapsInsideOutside:mod(angle,360)===180,exactFiveStep72Return:mod(5*72,360)===0,eightyDegreeFiveStepResidual:mod(5*80,360)}),
      windowGrammar:Object.freeze({localMeasures:Object.freeze(['P','D','C','PHI','S']),views:Object.freeze(['IN','OUT']),count:'5+2',status:'DISPLAY_ROLES_ONLY'}),
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS']),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,aliases:0}),
      boundary:'W11, W12 and W13 are finite square-grid views. Σ12 is the set of twelve crossing edges between rows 6 and 7 of W12. G_ROOT_12 assigns the existing Root Ruler metric Δk to those edges as an AM-to-PM transition view; it is not a third row, twelve extra cells, a critical line, a time-zone claim or a new topology. Mandelbrot parameter space, Julia dynamical space, Prime Cube address space and the five local measure labels remain distinct typed views.'
    });
  }

  function yugoJogiFusionRecord(step=0,viewAngle=0,motionStep=0,sequence='JOGI',insideOutside=false){
    const lattice=windowSequence111213Record(step,viewAngle,motionStep);
    const sequences=Object.freeze({
      YUGO:Object.freeze([Object.freeze([-.75,0]),Object.freeze([-.12256,.74486]),Object.freeze([-.8,.156]),Object.freeze([-.4,.6]),Object.freeze([.285,.01])]),
      JOGI:Object.freeze([Object.freeze([-.1011,.9563]),Object.freeze([-.70176,-.3842]),Object.freeze([-.835,-.2321]),Object.freeze([-.54,.54]),Object.freeze([-.7269,.1889])])
    });
    const sequenceId=Object.prototype.hasOwnProperty.call(sequences,sequence)?sequence:'JOGI';
    const activeLocalIndex=lattice.step%5;
    const activeParameter=sequences[sequenceId][activeLocalIndex];
    const parameterRadius=Math.hypot(activeParameter[0],activeParameter[1]);
    const apertureWeights=Object.freeze([.18,.31,.47,.63,.82,.58,.26]);
    return Object.freeze({
      name:'YUGO_JOGI_5_PLUS_2_FUSION_FRAME',
      mode:'FUSION_5_PLUS_2',
      lattice,
      sequence:sequenceId,
      parameters:sequences[sequenceId],
      sequences,
      localMeasures:Object.freeze(['P','D','C','PHI','S']),
      activeLocalIndex,
      lanternSeam:Object.freeze({
        id:'OMIJ_LANTERN_SEAM',ownerMnemonic:'LANTERN · HC·O',grammar:'(O|M)+(I|J)+1',
        leftPair:Object.freeze({tokens:Object.freeze(['O','M']),view:'OUT',space:'MANDELBROT_PARAMETER_SPACE'}),
        rightPair:Object.freeze({tokens:Object.freeze(['I','J']),view:'IN',space:'JULIA_DYNAMICAL_SPACE'}),
        plusOneRole:'SHARED_C_PARAMETER_TRANSFER_SEAM',sharedParameter:activeParameter,
        parameterRadius,apertureWeight:apertureWeights[lattice.step],apertureWeights,
        direction:insideOutside?'J_TO_M_VIEW_SWAP':'M_TO_J_PARAMETER_TRANSFER',
        halfTurnFlipsDirection:Boolean(insideOutside),
        dirichletPentagon:Object.freeze({
          role:'FIVE_TYPED_L_FUNCTION_VIEWS_ON_ONE_DECLARED_CRITICAL_LINE',criticalLine:'Re(s)=1/2',status:'CHARACTER_DEFINITION_DISPLAY_NOT_ZERO_PLOT',
          tracks:Object.freeze([
            Object.freeze({id:'L1',label:'ζ · χ₁',modulus:1,character:'trivial mod 1',values:Object.freeze(['1']),pair:null,color:'#eef7fb'}),
            Object.freeze({id:'L5_0',label:'L · χ₅⁰',modulus:5,character:'principal mod 5',values:Object.freeze(['1','1','1','1']),pair:null,color:'#35d3ee'}),
            Object.freeze({id:'L5_1',label:'L · χ₅¹',modulus:5,character:'complex quartic',values:Object.freeze(['1','i','−i','−1']),pair:'L5_3',color:'#f078b8'}),
            Object.freeze({id:'L5_2',label:'L · χ₅²',modulus:5,character:'quadratic',values:Object.freeze(['1','−1','−1','1']),pair:null,color:'#f4c84a'}),
            Object.freeze({id:'L5_3',label:'L · χ₅³',modulus:5,character:'complex quartic conjugate',values:Object.freeze(['1','−i','i','−1']),pair:'L5_1',color:'#8e78ff'})
          ]),
          angleCarrier:Object.freeze({
            pentagon:Object.freeze({interiorAngle:108,interiorSum:540,centralAngle:72,tenthDegreeCarrier:5400,law:'5400=50·108=15·360'}),
            circlePair:Object.freeze({lower:5040,upper:5400,difference:360,laws:Object.freeze(['5040=14·360','5400=15·360'])}),
            decimalSquare:Object.freeze({value:6400,law:'5400+1000=6400=80²=2⁸·5²',twoPowerRegister:'2⁶·100'}),
            millionCuts:Object.freeze([
              Object.freeze({block:720,quotient:1388,remainder:640,role:'72.0° tenth-degree step'}),
              Object.freeze({block:3600,quotient:277,remainder:2800,role:'360° in tenth-degrees'}),
              Object.freeze({block:5040,quotient:198,remainder:2080,role:'14 full circles'}),
              Object.freeze({block:5400,quotient:185,remainder:1000,role:'15 full circles / one final row'}),
              Object.freeze({block:21600,quotient:46,remainder:6400,role:'arcminutes in one circle'})
            ]),
            unitBoundary:'3600 tenth-degrees equals 360 degrees; separately, 3600 arcseconds equals 1 degree. Equal numeral, different unit.'
          }),
          orientationCoupler:Object.freeze({
            id:'GRH_TEST_LINE_THREE_ANGLE_COUPLER',
            primary:Object.freeze({
              source:'AL_JABR_LENS_TYPED_DOT',
              angles:Object.freeze([102,204,258]),
              viewRegisters:Object.freeze(['AM','PM','VM']),
              roles:Object.freeze(['TURN','DOUBLE_TURN','RETURN_COMPLEMENT_TO_360']),
              exactRelations:Object.freeze(['204=2·102','258+102=360','258+204=462=42·11']),
              operator:'SELECT_TYPED_ANGLE_VIEW',
              return:'SAME_CARRIER_C'
            }),
            comparisonRails:Object.freeze([
              Object.freeze({id:'DODECA_PHASE_VIEW',angles:Object.freeze([204,135]),difference:69,source:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry',status:'TYPED_DISPLAY_COMPARATOR_ONLY'}),
              Object.freeze({id:'A0_101_Q_FOLD',angles:Object.freeze([90,45]),relation:'45=90/2',source:'DRAFTS/A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html#a0-101-orientation-coupler',tour:'DRAFTS/A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html#leaf-tour-cube',status:'TYPED_ORIENTATION_AND_FOLD_VIEWS'})
            ]),
            cubeRoutes:Object.freeze({
              full11:'A0_PRIMECUBE_GAP_FOLD_LAB.html#shadow-cube-envelope',
              full11Role:'11^3_ADDRESS_ENVELOPE_1111_CARRIER_PLUS_220_RECORD_ABSENT_SHADOW_ADDRESSES',
              qCube:'A0_PRIMECUBE_GAP_FOLD_LAB.html#primecube-workbench',
              qCubeRole:'CRT_7_BY_11_BY_13_VIEW_NOT_11_CUBED'
            }),
            display:Object.freeze({line:'Re(s)=1/2',dotRole:'SELECTED_ANGLE_MARKER',nickname:'GALGEN_SCREEN_FORM_ONLY'}),
            return:Object.freeze({source:'AL_JABR_LENS_TYPED_DOT',operator:'SELECT_TYPED_ANGLE_VIEW',contract:'RETURN_TO_SAME_CARRIER_C',graphDelta:Object.freeze({identities:0,relations:0,aliases:0,studies:0,findings:0})}),
            boundary:'The common GRH test line is a display axis only. The 102, 204 and 258 degree states are typed Al-Jabr views of one retained carrier. The 204/135 and 90/45 rails retain their own source, operator and Return contracts; numeric overlap does not identify them. The 11^3 envelope and the 7x11x13 Q cube are different carriers. Galgen is a visual nickname for the screen form, not an operator, theorem, historical derivation or GRH evidence.'
          }),
          return:Object.freeze({source:'OMIJ_LANTERN_SEAM',operator:'SELECT_CHARACTER_VIEW',method:'RETAINED_LANTERN_VIEW',graphDelta:Object.freeze({identities:0,relations:0,aliases:0,studies:0,findings:0})}),
          boundary:'The five lanes are zeta for the trivial character modulo 1 plus the four Dirichlet characters modulo 5. They show character definitions and conjugacy on the declared line Re(s)=1/2; their screen paths are schematic and are not evaluated L-values, zero locations, a proof of GRH or a new common operator.'
        }),
        observerWitnessLedger:Object.freeze({
          ownerMnemonic:'PSHYSIC',ownerPhrase:'OHNE PSYCHE KEINE PHYSIC',
          scientificRestatement:'PHYSICS_AS_KNOWLEDGE_REQUIRES_MEASUREMENT_RECORD_WITNESS_AND_INTERPRETATION',
          chain:Object.freeze(['PHYSICAL_EVENT','MEASUREMENT_INTERACTION','RECORD','WITNESS','INTERPRETATION']),
          glyphs:Object.freeze([
            Object.freeze({glyph:'€',role:'OWNER_CANDIDATE',status:'UNBOUND',boundary:'VISUAL_EPSILON_RESEMBLANCE_NOT_EPSILON'}),
            Object.freeze({glyph:'¢',role:'UNBOUND_GLYPH_LEDGER',status:'HOLD',boundary:'NO_OPERATOR_ASSIGNED'}),
            Object.freeze({glyph:'ε',role:'APERTURE_THRESHOLD_PARAMETER',status:'BOUND_DISPLAY_PARAMETER'}),
            Object.freeze({glyph:'Ψ',role:'OBSERVER_WITNESS_STATE_MARKER',status:'BOUND_VIEW_GLYPH_NOT_WAVEFUNCTION'}),
            Object.freeze({glyph:'R90(Ψ)',role:'QUARTER_TURN_GLYPH_VIEW',status:'VIEW_TRANSFORM_NOT_NEW_IDENTITY'}),
            Object.freeze({glyph:'¶',role:'DECLARED_BOUNDARY_MARKER',status:'BOUND_CARTOGRAPHY'}),
            Object.freeze({glyph:'⁄',role:'CUT_SEAM_MARKER',status:'BOUND_CARTOGRAPHY'})
          ]),
          lineTypes:Object.freeze(['VISIBLE_STROKE','DECLARED_DISPLAY_AXIS','MATHEMATICAL_LINE']),
          lineBoundary:'VISIBLE_STROKE_NOT_AUTOMATICALLY_DISPLAY_AXIS_OR_MATHEMATICAL_LINE',
          ontologyBoundary:'A physical event is not asserted to require psyche or consciousness. The ledger states only that scientific physics-as-knowledge requires a measurement interaction, durable record, witness and interpretation.'
        }),
        status:'CARTOGRAPHIC_ACTIVE_SEAM_NOT_NEW_OPERATOR',
        boundary:'The Lantern strip visualizes the existing shared c parameter between the Mandelbrot parameter view and the selected Julia dynamical view. Its width, glow, whiteout and direction are display encodings. HC·O is an unbound Owner mnemonic, not a chemical species, physical lantern, carrier identity or new relation.'
      }),
      views:Object.freeze({
        in:Object.freeze({id:'IN',role:'MANDELBROT_PARAMETER_SPACE',operator:'z(n+1)=z(n)^2+c'}),
        out:Object.freeze({id:'OUT',role:'ACTIVE_JULIA_RETURN_VIEW',operator:'z(n+1)=z(n)^2+c',insideOutside:Boolean(insideOutside)})
      }),
      display:Object.freeze({pinkPentagon:'RETURN_ROPE_SCREEN_OVERLAY',blueMachine:'FRACTAL_WINDOW_CARRIER',fade:'STEP_WEIGHTED_CARTOGRAPHY',lattice:'W11_W12_W13_DEPTH_STACK',lantern:'OMIJ_SHARED_C_ACTIVE_SEAM'}),
      exactControls:Object.freeze({turn72:lattice.view.exactFiveStep72Return,turn80Residual:lattice.view.eightyDegreeFiveStepResidual,halfTurn:'IN_OUT_VIEW_SWAP'}),
      identityReuse:lattice.identityReuse,
      navigatorEffect:lattice.navigatorEffect,
      boundary:'The Fusion Frame composes five local Julia measure windows, one Mandelbrot parameter-space view, one active Julia Return view and the existing W11/W12/W13 depth stack in one screen carrier. The OMIJ Lantern seam exposes their shared c parameter without subtracting or identifying the two mathematical spaces. Composition, fading, overlap, seam width, glow and direction are cartographic. Mandelbrot parameter space, Julia dynamical space, Primecube address space and the P/D/C/PHI/S labels remain distinct typed views; no new identity, relation, mechanism or scientific claim follows.'
    });
  }

  function tliftJanusAdapterRecord(d0=4,degree=7,ghostY=.35,glyphIndex=0,witness=false){
    const threshold=Math.max(1,Math.round(Number(d0)||1)),probe=Math.max(1,Math.round(Number(degree)||1)),y=Math.max(-1,Math.min(1,Number(ghostY)||0)),glyphs=Object.freeze(['d','q','b','p']),index=mod(Math.trunc(Number(glyphIndex)||0),glyphs.length),fixed=Math.abs(y)<1e-9,liftReady=probe>=threshold,candidates=fixed?1:2,hasWitness=Boolean(witness),decide=liftReady&&(fixed||hasWitness),mirrorY=-y,mirrorGlyph=glyphs[mod(index+2,glyphs.length)];
    const selfTest=Object.freeze({janusInvolution:-mirrorY===y,fixedSet:fixed===(Math.abs(y)<1e-9),threshold:(probe>=threshold)===liftReady,witnessGate:decide===(liftReady&&(fixed||hasWitness)),glyphReturn:glyphs[mod(index+4,glyphs.length)]===glyphs[index]});
    return Object.freeze({
      name:'YUGO_JOGI_TLIFT_JANUS_ADAPTER',role:'PRIMECUBE_SUBORDINATE_OBSERVER_VIEW',d0:threshold,degree:probe,ghostY:y,ghostDistance:2*Math.abs(y),fixed,liftReady,candidates,witness:hasWitness,decision:decide?'DECIDE':'ABSTAIN',return:decide?'EXACT':'HOLD',
      source:Object.freeze({glyph:glyphs[index],carrier:'YUGO_JOGI_5_PLUS_2_FUSION_FRAME'}),
      orientation:Object.freeze({glyphOperator:'R180_ON_DECLARED_GLYPH_ORBIT',glyph:mirrorGlyph,orbit:glyphs}),
      janus:Object.freeze({operator:'J(x,y)=(x,-y)',imageY:mirrorY,involution:true,fixedSet:'Fix(J)={y=0}'}),
      tlift:Object.freeze({statement:'exists d0, for all d >= d0',display:'∃d₀ ∀d≥d₀',ready:liftReady,status:'SOURCE_BOUND_DISPLAY_OF_TLIFTK_NOT_LEAN_PROOF'}),
      selfTest:Object.freeze({checks:5,passed:Object.values(selfTest).filter(Boolean).length,pass:Object.values(selfTest).every(Boolean),ledger:selfTest}),
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS']),navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0,aliases:0,studies:0,findings:0}),
      boundary:'This is a subordinate Primecube observer adapter. The glyph half-turn and the coordinate reflection are separate declared operators. TLiftK supplies source notation only; the finite threshold display is not a Lean proof, physical lift, GRH claim, new carrier, identity or relation.'
    });
  }

  function buildDataset(limit=MAX_N){
    if(limit!==MAX_N)throw new Error('Primecube v1 freezes the carrier at 1..1111');
    const primes=sieve(limit),primeSet=new Set(primes),primeIndex=new Map(primes.map((p,i)=>[p,i+1]));
    const groups=constellationGroups(limit),member=membership(groups);
    const nodes=[];
    for(let n=1;n<=limit;n++){
      const index=primeIndex.get(n)||null,isSuper=index!==null&&isPrime(index);
      const kinds=[];
      if(member.twin.has(n))kinds.push('TWIN');
      if(member.triplet.has(n))kinds.push('TRIPLET');
      if(member.quadruplet.has(n))kinds.push('QUADRUPLET');
      if(isSuper)kinds.push('SUPERPRIME');
      nodes.push(Object.freeze({
        n,isPrime:primeSet.has(n),primeIndex:index,isSuperprime:isSuper,
        kinds:Object.freeze(kinds),grid:gridAddress(n),cube:cubeAddress(n),residue:residueRecord(n),layerClosure:layerClosureRecord(n),
        inTwinClusterGap:n>=GAP.interiorStart&&n<=GAP.interiorEnd
      }));
    }
    const gapInteriorPrimes=primes.filter(p=>p>661&&p<809);
    const superprimes=nodes.filter(node=>node.isSuperprime).map(node=>node.n);
    return Object.freeze({
      schema:'nexah.a0.primecube-gap-fold/1.58.0',version:VERSION,identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1','ART:ROSETTA:QRT_FIXTURE','FESN:4774','A0OE:PASCAL_PENTAGON_D5_TEST']),
      carrier:Object.freeze({min:1,max:limit,count:limit,cubeShape:Object.freeze([11,11,10]),gridColumns:GRID_COLUMNS,fill:carrierFillRecord()}),
      nodes:Object.freeze(nodes),primes:Object.freeze(primes),groups,
      counts:Object.freeze({primes:primes.length,twins:groups.twins.length,triplets:groups.triplets.length,quadruplets:groups.quadruplets.length,superprimes:superprimes.length,layerClosures:LAYER_CLOSURES.length,squareLayerClosures:LAYER_CLOSURES.filter(n=>Number.isInteger(Math.sqrt(n))).length}),
      layerClosures:LAYER_CLOSURES,seamShadow:seamShadowRecord(),
      ownerProvenance:Object.freeze({label:'RDMH',historicalReading:'RDMH → ROM–MH (Mutterraum)',displayRole:'VERTICAL_POLARITY / MID-SEAM',calendarWitness:'29.02.1972',calendarRole:'R / Handle',calendarValidity:'VALID_PROLEPTIC_GREGORIAN_LEAP_DAY',status:'HOLD_OPEN_IDENTITY_NO_OPERATOR',boundary:'No mapping from the date to RDMH is asserted.'}),
      transition661:transition661Record(),
      dualGridOrientation:dualGridOrientationRecord(),
      sliceAtlas:sliceAtlasRecord(),
      eulerCompass:eulerCompassRecord(),
      rootGeometry:squareSeamTriangleRecord(),
      centeredPlateWindow:centeredPlateWindowRecord(),
      lokiChassis:lokiChassisRecord(),
      mathfieldCouplingDeck:mathfieldCouplingDeckRecord(),pentagonCurtainControl:pentagonCurtainControlRecord(),
      transversalPlaneScienceReturn:transversalPlaneScienceReturnRecord(),
      wheelGate13:wheelGate13Record(),
      alphaBetaFixedPoint:alphaBetaFixedPointRecord(),
      contractDemoCoverage:contractDemoCoverageRecord(),
      fractalDirectField:fractalDirectFieldRecord(),
      alJabrDotLens:alJabrDotLensRecord(),
      viewInvarianceAudit:viewInvarianceAuditRecord(),
      returnSeam4774:returnSeam4774Record(),
      draftDriftHousing:draftDriftHousingRecord(),
      scarabControlLens:scarabControlLensRecord(),
      shadowCubeEnvelope:shadowCubeEnvelopeRecord(),
      criticalLineRootTopology:criticalLineRootTopologyRecord(),
      thothKhipuKnot:thothKhipuKnotRecord(),
      szChiralityLab:szChiralityLabRecord(),
      qCube:qCubeRecord(),
      unitRootShear:unitRootShearRecord(),
      millenniumGrid:millenniumGridRecord(),
      windowSequence111213:windowSequence111213Record(),
      yugoJogiFusion:yugoJogiFusionRecord(),tliftJanusAdapter:tliftJanusAdapterRecord(),
      gap:Object.freeze({...GAP,interiorPrimeCount:gapInteriorPrimes.length,interiorPrimes:Object.freeze(gapInteriorPrimes)}),
      roots:Object.freeze({domain:Object.freeze([1,MAX_N-1]),referenceAnchors:Object.freeze([2,5,7]),codonF1:Object.freeze([5,11,17]),perfectCubeAnchors:Object.freeze([8,27,64,125,216,343,512,729,1000]),operators:Object.freeze({square:'Δ₂(k) = √(k+1) − √k = 1/(√(k+1)+√k)',cube:'Δ₃(k) = ∛(k+1) − ∛k = 1/((∛(k+1))²+∛(k+1)∛k+(∛k)²)'}),asymptotics:Object.freeze({square:'Δ₂(k) ~ 1/(2√k)',cube:'Δ₃(k) ~ 1/(3k^(2/3))'}),tridentSourceOverlay:Object.freeze({anglesDegrees:Object.freeze([90,210,330]),role:'VIEW_ONLY_THREE_AXIS_GUIDE'}),return:'RETAINED_SOURCE_NUMBER'}),
      hSpace:Object.freeze({name:'TYPED_H_RECORD_CROSSWALK',path:orientationPath(),diceSpaces:Object.freeze({h5:'{1,…,6}^5',h6:'{1,…,6}^6'}),frame17:'5+6+6 declared inventory; no natural identity asserted'}),
      boundary:'The cube, distributed gap fold, rigid 661 hinge, dual-grid orientation, Base-11 slice atlas, Euler Compass, root ruler, Square-Seam-Triangle view, Q/T20± CRT cuboid, Unit–Root–Shear comparator and H-record crosswalk are declared views. Prime rank, cube address, 37-column grid, CRT residue address, physical unit, root coordinate, shear component, residue angle, constellation membership, square interval, Theodoros display coordinate, dice state and provenance hash remain non-identical registers. The 3D hinge rotation and T20± modular maps are bijective; only the 2D screen projection may overlap records. They do not assert an intrinsic cubic prime geometry, canonical Prime Family, natural root cuboid, prime generator, physical hinge, resonance mechanism, Euler-Rainbow identity, identity with earlier Q± roles or natural Dice correspondence.'
    });
  }

  function numberRecord(n,dataset){
    const data=dataset||buildDataset(),node=data.nodes[n-1];
    if(!node)throw new RangeError(`n must be 1..${MAX_N}`);
    return Object.freeze({
      recordId:`PC1111:N${String(n).padStart(4,'0')}`,sourceNumber:n,sourceAddress:node.cube,
      gridAddress:node.grid,primeStatus:node.isPrime?'PRIME':'COMPOSITE_OR_UNIT',primeIndex:node.primeIndex,
      superprime:node.isSuperprime,constellations:node.kinds,factorization:divisors(n),mod30:node.residue.mod30,
      base11:Object.freeze({number:toBase11(n),addressValue:n-1,address:toBase11(n-1)}),layerClosure:node.layerClosure,
      gapRole:node.inTwinClusterGap?'TWIN_CLUSTER_GAP_INTERIOR':(GAP.leftTwin.includes(n)||GAP.rightTwin.includes(n)?'TWIN_ANCHOR':'OUTSIDE'),
      return:Object.freeze({method:'RETAINED_SOURCE_NUMBER',n,address:cubeAddress(n),exact:cubeNumber(cubeAddress(n))===n})
    });
  }

  return Object.freeze({VERSION,MAX_N,GRID_COLUMNS,CUBE_SIZE,LAYER_AREA,LAYER_CLOSURES,GAP,UNIT_FACTORS_METRES,MILLENNIUM_TOTAL,MILLENNIUM_DIVISORS,isPrime,sieve,divisors,primeFactorization,mod,gcd,multiplicativeOrder,modularPower,constellationGroups,cubeAddress,cubeNumber,fullCubeAddress,gridAddress,residueRecord,toBase11,diceAddress,diceNumber,hammingDistance,hRecord,orientationPath,layerClosureRecord,carrierFillRecord,seamShadowRecord,shadowCubeEnvelopeRecord,criticalLineRootTopologyRecord,thothKhipuKnotRecord,szChiralityLabRecord,gapPhase,rootGap,cubeRootGap,rootRulerRecord,rootRecord,theodorosRecord,rootGeometryRecord,squareSeamTriangleRecord,centeredPlateWindowRecord,lokiChassisRecord,splinterBookFoldRecord,mathfieldCouplingDeckRecord,pentagonCurtainControlRecord,transversalPlaneScienceReturnRecord,wheelGate13Record,alphaBetaFixedPointRecord,contractDemoCoverageRecord,fractalDirectFieldRecord,alJabrDotLensRecord,viewInvarianceAuditRecord,returnSeam4774Record,draftDriftHousingRecord,scarabControlLensRecord,foldAddress,hingeAddress,transition661Record,dualGridOrientationRecord,sliceAtlasRecord,eulerCompassRecord,qCubeAddress,mz24CompassRecord,qCubeRecord,unitRootShearRecord,millenniumGridRecord,windowSequence111213Record,yugoJogiFusionRecord,tliftJanusAdapterRecord,buildDataset,numberRecord});
});
