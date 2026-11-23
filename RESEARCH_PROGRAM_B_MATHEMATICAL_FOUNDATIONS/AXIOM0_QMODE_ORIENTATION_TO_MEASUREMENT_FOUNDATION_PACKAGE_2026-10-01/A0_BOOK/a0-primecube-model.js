(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeModel=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const VERSION='1.30.0';
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

  function mathfieldCouplingDeckRecord(){
    const adapter=(id,label,status,operator,returnContract,identityReuse,href,boundary,extra={})=>Object.freeze({
      id,label,status,operator,returnContract,identityReuse:Object.freeze(identityReuse),href,boundary,...extra
    });
    return Object.freeze({
      name:'MATHFIELD_COUPLING_DECK',carrier:'SPLINTER_SAIL_GRID',defaultAdapter:'PENTAGON',
      adapters:Object.freeze([
        adapter('PENTAGON','Pentagon / Fold','BOUND_VIEW','PENT_UI:FOLD → COUPLING:TRIANGLES','UI_STATE_RETURN',['A0OE:PASCAL_PENTAGON_D5_TEST','ART:A0:MATHEMATICAL_JOINTS'],'A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html','Fivefold screen overlay on the retained six-anchor chassis; it does not identify the carriers.'),
        adapter('SCARAB','Scarab / Hinge','BOUND_VIEW_OPEN_CROSS_MODE','SOURCE_BOUND_SIX_STATE_DISPLAY','SOURCE_CAMERA_RETURN',['ART:A0:MATHEMATICAL_JOINTS','MOD:ORIENTATION_DEMONSTRATORS','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'],'A0_SCARAB_ORIGIN_MOBIUS_RAMANUJAN.html','The Scarab hinge is a display adapter. Its cross-mode kinematic map remains open and is not a physical mechanism.'),
        adapter('LOKI','LOKI / Tessarec','BOUNDED_DISPLAY_TEST','C7 × C8','EXACT_56_STEP_RETURN',['MOD:TESSAREC','ART:A0:MATHEMATICAL_JOINTS'],'A0_WERKBANK.html','Seven stations by eight orientations close after 56 display steps; the local Splinter Sail label does not become the LOKI identity.',{stations:7,orientations:8,period:56,returnState:Object.freeze([0,0])}),
        adapter('MIWA','MIWA / Observer','ROUTE_ONLY','NONE_ASSIGNED','EXPLICIT_NAV_RETURN',['ART:MIWA:MAIN','MOD:OBSERVATORY_MIWA'],'../../../SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html?a0BenchPreset=miwa-uranus','MIWA remains a separate observer and Uranus/Moons source view with its own controls; no shared operator or clock is asserted.'),
        adapter('FRACTAL','F / Mandelbrot ↔ Julia ↔ αβ','BOUND_STANDARD_AND_MEMORY_ITERATION','z(n+1) = z(n)² + c','RETAIN_c_PARAMETERS_AND_ITERATION_WINDOW',['MOD:NUMBER_VIEW_SUITE','A0_BLUE_PINK_DODECA_CELL_RETURN'],'A0_BLUE_PINK_DODECA_CELL_RETURN.html#formation','The standard quadratic family, the two-step alpha/beta memory recurrence and the Base-11 address crosswalk are separate readings. Same c does not identify parameter and dynamical planes; P=alpha+beta is a partition coordinate, not a conserved energy or stability bound. Non-escape through finite N is not proof of membership or interior, and no identity with Prime, Root or chassis registers is asserted.',{planes:Object.freeze(['C_PARAMETER_PLANE','Z_DYNAMICAL_PLANE']),escapeRadius:2,defaultIterations:100,presets:Object.freeze([Object.freeze({id:'interior',c:Object.freeze([-0.1087,0]),classification:'EXACT_INTERIOR'}),Object.freeze({id:'boundary',c:Object.freeze([-0.75,0]),classification:'EXACT_BOUNDARY'}),Object.freeze({id:'exterior',c:Object.freeze([0.26,0]),classification:'EXACT_EXTERIOR',escapeIteration:30})]),memory:Object.freeze({source:'DRAFTS/A0_BETA_RETURN_MANDELBROT_JULIA_DEMONSTRATOR_2026-11-14.html',operator:'z(n+1)=z(n)²+c+αz(n)+β(z(n)−z(n−1))',expanded:'z(n+1)=z(n)²+c+Pz(n)−βz(n−1)',partition:'P=α+β',state:'S(n)=(z(n),z(n−1))',classification:'COMPLEX_QUADRATIC_HENON_TYPE',traceLens:Object.freeze({visibleSteps:Object.freeze([0,39]),nodeCount:40,transient:Object.freeze([0,1,2,3]),primeSteps:Object.freeze([2,3,5,7,11,13,17,19,23,29,31,37]),superprimeSteps:Object.freeze([3,5,11,17,31]),shadowPair:Object.freeze([17,71]),shadowPairRecords:Object.freeze([Object.freeze({step:17,primeRank:7,superprime:true,cube:Object.freeze([5,1,0])}),Object.freeze({step:71,primeRank:20,superprime:false,cube:Object.freeze([4,6,0])})]),shadowOperator:'z_shadow(n)=2*z_axis-z(n)',axis:'ATTRACTING_FIXED_POINT_OR_TERMINAL_TRACE_ESTIMATE',addressBoundary:'Cube coordinates label the integer step index only; orbit values are generally non-integer and receive no Primecube address.',boundary:'The 3+1 transient, L shape, straight tail, 17|71 pair and shadow axis are declared trace readings. They do not define a 33- or 42-body, prime family, pyramid or cube identity.'}),boundary:'P is a coordinate on parameter space. Fixing P does not conserve energy, bound the orbit, or fix stability. Fixed points depend on alpha because the beta difference vanishes at a fixed point.'}),cubeCrosswalk:Object.freeze({selected:661,numberBase11:'551',addressBase11:'550',cube:Object.freeze([0,5,5]),numberDigitSum:11,columnWall:'x=10 => n=11(1+y+11z); only n=11 can be prime',externalDoubling:Object.freeze([Object.freeze({n:2501,base11:'1974',mod11:4}),Object.freeze({n:5002,base11:'3838',mod11:8}),Object.freeze({n:10004,base11:'7575',mod11:5})]),boundary:'The cube address is computed from retained integer n only. It is synchronized with the fractal controls as a comparison view, not derived from c, alpha, beta or orbit geometry.'})}),
        adapter('URANUS_SPOOL','Uranus Moons / Spool','HOLD_UNBOUND_OPERATOR','UNDEFINED','OPEN',[],'','The coil is a schematic intake only. Moon order, winding function, direction, period and return predicate must be declared before binding.',{requirements:Object.freeze(['ORDERED_MOON_SET','WINDING_FUNCTION w(i)','DIRECTION_AND_ORIENTATION','PERIOD','RETURN_PREDICATE'])})
      ]),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'This deck is a typed view switch over one retained screen chassis. It neither merges Pentagon, Scarab, LOKI, MIWA and lunar-source identities nor asserts one shared mechanism, topology, carrier, clock or astronomical law.'
    });
  }

  function alphaBetaFixedPointRecord(alpha=.125,beta=.125,c=-.5){
    for(const [name,value] of Object.entries({alpha,beta,c}))if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);
    const discriminant=(1-alpha)*(1-alpha)-4*c;
    const real=discriminant>=0;
    const roots=real?Object.freeze([(1-alpha-Math.sqrt(discriminant))/2,(1-alpha+Math.sqrt(discriminant))/2]):Object.freeze([]);
    const selected=real?roots[0]:null,magnitude=selected===null?null:Math.abs(selected),p=alpha+beta;
    const jacobianTrace=selected===null?null:2*selected+p,jacobianDeterminant=beta;
    const eigenDiscriminant=jacobianTrace===null?null:jacobianTrace*jacobianTrace-4*jacobianDeterminant;
    const eigenvalues=eigenDiscriminant===null?Object.freeze([]):eigenDiscriminant>=0
      ?Object.freeze([(jacobianTrace+Math.sqrt(eigenDiscriminant))/2,(jacobianTrace-Math.sqrt(eigenDiscriminant))/2])
      :Object.freeze([{real:jacobianTrace/2,imaginary:Math.sqrt(-eigenDiscriminant)/2},{real:jacobianTrace/2,imaginary:-Math.sqrt(-eigenDiscriminant)/2}].map(Object.freeze));
    const spectralRadius=eigenDiscriminant===null?null:eigenDiscriminant>=0?Math.max(...eigenvalues.map(Math.abs)):Math.sqrt(Math.abs(jacobianDeterminant));
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
      stability:Object.freeze({jacobian:'[[2z*+alpha+beta, −beta],[1,0]]',trace:jacobianTrace,determinant:jacobianDeterminant,eigenDiscriminant,eigenvalues,spectralRadius,classification:spectralRadius===null?'NOT_EVALUATED':spectralRadius<1?'ATTRACTING':'NOT_ATTRACTING'}),
      bands,declared478:Object.freeze({value:.478,status:'NEGATIVE_CONTROL_NOT_A_BOUND_BAND',nearestBoundBand:.487,delta:.009}),
      sourceBoundary:'BAND_0.429, BAND_0.456 and BAND_0.487 are retained Breathing Crystal display nodes. Their symmetric +/- placement is a comparator view, not an identity with the alpha/beta fixed point. BAND_0.478 is not present in the bound source.'
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
      item('SCARAB_CONTROL','Scarab control lens / Fold 108','scarab-control-lens',{anchor:true}),
      item('DIRECT_FIELD','Direct Mandelbrot / alpha-beta field','mandelbrot-memory-field',{anchor:true}),
      item('AL_JABR_DOT','Al-Jabr lens / typed dot operators','al-jabr-dot-lens',{anchor:true}),
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
    const stations=Object.freeze(Array.from({length:25},(_,index)=>Object.freeze({address:index+1,row:Math.floor(index/5),column:index%5,center:index===12})));
    return Object.freeze({
      name:'SZ_CHIRALITY_INVARIANT_LAB',
      polar:Object.freeze({angle,counterAngle:360-angle,canonicalSteps:Object.freeze({s:angle,z:-angle}),alpha,beta,steps,sTrack,zTrack,proximities,closure:Object.freeze({gcd:integerGcd,steps:closureSteps,signedTurnsS:signedTurns,signedTurnsZ:-signedTurns,status:'EXACT_INTEGER_ANGLE_CLOSURE'})}),
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
      boundary:'S and Z are declared signed display directions, not a universal decoding of Andean textile meaning. P_chi is held constant only when the controls enforce it; it is not conserved energy or an orbit invariant. Screen proximity is not a knot, resonance or physical stabilization event. The 25/13 window is an exact finite address plate; Big Bird, Con Dao and Thunder Bird remain Owner labels on HOLD.'
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
        Object.freeze({n:101,base11:'92',residue:2,role:'1111/11'}),
        Object.freeze({n:2501,base11:'1974',residue:4,role:'50^2+1'}),
        Object.freeze({n:5002,base11:'3838',residue:8,role:'2*(50^2+1)'}),
        Object.freeze({n:10004,base11:'7575',residue:5,role:'4*(50^2+1)'})
      ]),
      base11Mirror:Object.freeze({decimal:122,base11:'101',equation:'122_(10)=101_(11)'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'The 101-cell root mask is a declared selection inside the 121-cell grid; it excludes the other 20 cells of the central cross. The mod-11 rail is exact integer arithmetic but is not derived from the continuous alpha/beta dynamics. For beta nonzero the map is a two-step complex quadratic Henon-type recurrence, not the classical Mandelbrot family. Finite non-escape is not a proof of set membership.'
    });
  }

  function alJabrDotLensRecord(completion=0){
    const added=Math.max(0,Math.min(20,Math.trunc(Number(completion)||0)));
    const angles=Object.freeze([
      Object.freeze({degrees:102,residue:mod(102,11),role:'TURN'}),
      Object.freeze({degrees:204,residue:mod(204,11),role:'DOUBLE_TURN'}),
      Object.freeze({degrees:258,residue:mod(258,11),role:'RETURN_COMPLEMENT_TO_360'})
    ]);
    return Object.freeze({
      name:'AL_JABR_LENS_TYPED_DOT',
      grid:Object.freeze({side:11,full:121,quadrants:100,center:1,crossArms:20,completion:added,visible:101+added,closed:added===20,equation:`101+${added}=${101+added}`}),
      operators:Object.freeze([
        Object.freeze({id:'CENTER_DOT',glyph:'·',equation:'5+1+5=11',meaning:'selected center cell [5,5]'}),
        Object.freeze({id:'DECIMAL_POINT',glyph:'.',equation:'121×10^−2=1.21; √121×10^−1=1.1',meaning:'declared scale change'}),
        Object.freeze({id:'PRODUCT_DOT',glyph:'·',equation:'4·(5·5)+1=101',meaning:'multiplication in the selected root mask'})
      ]),
      completionSquare:Object.freeze({historicalAnalogy:'geometric completion of a square by adding missing areas',status:'ANALOGY_NOT_PROVENANCE',currentEquation:'101+20=121'}),
      polar:Object.freeze({angles,exactRelations:Object.freeze(['204=2·102','258+102=360','258+204=462=42·11']),residuePair:Object.freeze({a:mod(204,11),b:mod(258,11),sum:mod(204+258,11),relation:'ADDITIVE_INVERSES_MOD_11',regular11gonBoundary:'NOT_ANTIPODAL: an odd regular 11-gon has no opposite vertex'})}),
      recurrence:Object.freeze({operator:'r(n+1)=alpha*r(n)+beta*(r(n)-r(n-1))',classification:'DECLARED_POLAR_DISPLAY_RECURRENCE',defaultParameters:Object.freeze({alpha:.985,beta:.25,steps:60}),boundary:'This recurrence is a display model, not the definition of polar coordinates and not a stability or physical-law claim.'}),
      navigatorEffect:Object.freeze({newCanonicalIds:0,relationChanges:0}),
      boundary:'Al-Khwarizmi is a historical analogy for geometric completion of quadratic expressions, not the source identity of the 11x11 mask. CENTER_DOT, DECIMAL_POINT and PRODUCT_DOT are typed roles and are not interchangeable. Residues 5 and 6 are additive inverses modulo 11, but are not antipodal vertices of a regular 11-gon.'
    });
  }

  function scarabControlLensRecord(cosine=-.834,hingeNumerator=661,foldDegrees=108){
    cosine=Number(cosine);foldDegrees=Number(foldDegrees);hingeNumerator=Math.trunc(Number(hingeNumerator));
    if(!Number.isFinite(cosine)||cosine < -1||cosine > 1)throw new RangeError('cosine must be in [-1,1]');
    if(!Number.isFinite(foldDegrees)||foldDegrees < 0||foldDegrees > 180)throw new RangeError('foldDegrees must be in [0,180]');
    if(hingeNumerator!==661)throw new RangeError('this bounded lens freezes the hinge numerator at 661');
    const thetaDegrees=Math.acos(cosine)*180/Math.PI,primeRanks=new Map(sieve(1033).map((n,index)=>[n,index+1]));
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
    return Object.freeze({
      name:'SCARAB_CONTROL_LENS_FOLD_108',
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:ORIENTATION_DEMONSTRATORS','ART:A0:MATHEMATICAL_JOINTS']),
      scarabSource:Object.freeze({module:'a0-scarab-pillar-projection.js',schema:'nexah.a0.scarab-three-face-transit-view/3',carrier:'PURPLE_ADDRESS_POCKET',views:Object.freeze(['side','top','transverse','orbit']),angleDomain:Object.freeze([0,180])}),
      cosineInput:Object.freeze({value:cosine,equation:`cos(theta)=${cosine}`,thetaDegrees,classification:'OWNER_NUMERIC_INPUT'}),
      fold108:Object.freeze({degrees:foldDegrees,ticks:9,tickDegrees:12,equation:`${foldDegrees}=9*12`,scarabPhase:foldDegrees>=63&&foldDegrees<118?'HANDLE_CROSSING':'OUTSIDE_HANDLE_WINDOW'}),
      hingeScale:Object.freeze({rational:'661/1000',decimal:hingeNumerator/1000,carrierNumber:661,primeIndex:121,cube:Object.freeze(cubeAddress(661)),equation:'0.661*1000=661',relation:'DECLARED_DECIMAL_SCALE_CROSSWALK_NOT_IDENTITY'}),
      wheelTriangle,
      sourceScreenPoints:Object.freeze([
        Object.freeze({x:3.3,y:3.3,role:'SOURCE_POINT'}),Object.freeze({x:6.6,y:6.6,role:'SOURCE_CLUSTER'}),
        Object.freeze({x:9.9,y:9.9,role:'SOURCE_POINT'}),Object.freeze({x:12.3,y:13.0,role:'SOURCE_POINT'})
      ]),
      sourceScreenAxes:Object.freeze({x:'Distance (Billion Light Years)',y:'Time since Big Bang (Gyr)',status:'UNVERIFIED_SOURCE_SCREEN_LABELS_NOT_PHYSICAL_MODEL'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,publicationAuthorized:false}),
      boundary:'The Scarab body and view rotation reuse the existing Three-Face Transit display source. The cosine value, decimal hinge cue, Fold 108, orange address triangle, CIKADA state strip and source-screen points are separate registers. Resonance and hyperstructure remain Owner labels; no causal, cosmological or physical mechanism is asserted.'
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
    km:1000,m:1,dm:.1,cm:.01,mi:1609.344,yd:.9144,ft:.3048,in:.0254
  });

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
    const conversions=Object.freeze(Object.fromEntries(Object.entries(UNIT_FACTORS_METRES).map(([name,factor])=>[name,sourceMetres/factor])));
    return Object.freeze({
      name:'UNIT_ROOT_SHEAR_COMPARATOR_VIEW',marker,markers,
      physicalSource:Object.freeze({value:15.7,unit:'ft',metres:sourceMetres,exact:'157/10 ft = 59817/12500 m',conversions,selectedUnit:unit,selectedValue:converted}),
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
      qReturn:Object.freeze({source:1,crtAddress:qCubeAddress(1),notation:'1 ↔ (1,1,1)',exact:true}),
      mirror:Object.freeze({glyph:'¡',role:'OWNER_COUNTERPOINT_TO_1_RETURN',operator:'UNDEFINED',status:'HOLD'}),
      qrtBoundary:'In ART:ROSETTA:QRT_FIXTURE, R is the declared inverse and address-aligned Return. QRT20 remains a controlled address label and receives no universal letter expansion here.',
      unitBoundary:'km, m, dm, cm, international mile, yard, international foot and inch use declared exact conversion factors. Cubit is excluded until a named historical standard and factor are supplied.',
      projectionBoundary:'The 4x3 and outer 3/3/4/6/6 clusters are a reproducible screen overlay, not proof that projected line crossings share a CRT address.',
      return:'RETAINED_MARKER_EXACT_UNIT_CODEC_AND_INVERSE_SHEAR_VIEW'
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
      schema:'nexah.a0.primecube-gap-fold/1.30.0',version:VERSION,identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1','ART:ROSETTA:QRT_FIXTURE']),
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
      lokiChassis:lokiChassisRecord(),
      mathfieldCouplingDeck:mathfieldCouplingDeckRecord(),
      alphaBetaFixedPoint:alphaBetaFixedPointRecord(),
      contractDemoCoverage:contractDemoCoverageRecord(),
      fractalDirectField:fractalDirectFieldRecord(),
      alJabrDotLens:alJabrDotLensRecord(),
      scarabControlLens:scarabControlLensRecord(),
      shadowCubeEnvelope:shadowCubeEnvelopeRecord(),
      criticalLineRootTopology:criticalLineRootTopologyRecord(),
      thothKhipuKnot:thothKhipuKnotRecord(),
      szChiralityLab:szChiralityLabRecord(),
      qCube:qCubeRecord(),
      unitRootShear:unitRootShearRecord(),
      gap:Object.freeze({...GAP,interiorPrimeCount:gapInteriorPrimes.length,interiorPrimes:Object.freeze(gapInteriorPrimes)}),
      roots:Object.freeze({domain:Object.freeze([1,MAX_N-1]),referenceAnchors:Object.freeze([2,5,7]),operator:'Δk = √(k+1) − √k = 1/(√(k+1)+√k)',return:'RETAINED_SOURCE_NUMBER'}),
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

  return Object.freeze({VERSION,MAX_N,GRID_COLUMNS,CUBE_SIZE,LAYER_AREA,LAYER_CLOSURES,GAP,UNIT_FACTORS_METRES,isPrime,sieve,divisors,primeFactorization,mod,gcd,multiplicativeOrder,modularPower,constellationGroups,cubeAddress,cubeNumber,fullCubeAddress,gridAddress,residueRecord,toBase11,diceAddress,diceNumber,hammingDistance,hRecord,orientationPath,layerClosureRecord,carrierFillRecord,seamShadowRecord,shadowCubeEnvelopeRecord,criticalLineRootTopologyRecord,thothKhipuKnotRecord,szChiralityLabRecord,gapPhase,rootGap,rootRecord,theodorosRecord,rootGeometryRecord,squareSeamTriangleRecord,lokiChassisRecord,mathfieldCouplingDeckRecord,alphaBetaFixedPointRecord,contractDemoCoverageRecord,fractalDirectFieldRecord,alJabrDotLensRecord,scarabControlLensRecord,foldAddress,hingeAddress,transition661Record,dualGridOrientationRecord,sliceAtlasRecord,eulerCompassRecord,qCubeAddress,mz24CompassRecord,qCubeRecord,unitRootShearRecord,buildDataset,numberRecord});
});
