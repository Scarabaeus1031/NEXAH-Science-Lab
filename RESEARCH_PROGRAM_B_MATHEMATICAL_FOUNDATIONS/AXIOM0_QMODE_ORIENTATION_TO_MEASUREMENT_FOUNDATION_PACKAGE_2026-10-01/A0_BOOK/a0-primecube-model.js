(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeModel=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const VERSION='1.4.0';
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

  function mod(n,m){return((n%m)+m)%m}
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
      schema:'nexah.a0.primecube-gap-fold/1.4.0',version:VERSION,identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1']),
      carrier:Object.freeze({min:1,max:limit,count:limit,cubeShape:Object.freeze([11,11,10]),gridColumns:GRID_COLUMNS,fill:carrierFillRecord()}),
      nodes:Object.freeze(nodes),primes:Object.freeze(primes),groups,
      counts:Object.freeze({primes:primes.length,twins:groups.twins.length,triplets:groups.triplets.length,quadruplets:groups.quadruplets.length,superprimes:superprimes.length,layerClosures:LAYER_CLOSURES.length,squareLayerClosures:LAYER_CLOSURES.filter(n=>Number.isInteger(Math.sqrt(n))).length}),
      layerClosures:LAYER_CLOSURES,
      ownerProvenance:Object.freeze({label:'RDMH',historicalReading:'RDMH → ROM–MH (Mutterraum)',displayRole:'VERTICAL_POLARITY / MID-SEAM',calendarWitness:'29.02.1972',calendarRole:'R / Handle',calendarValidity:'VALID_PROLEPTIC_GREGORIAN_LEAP_DAY',status:'HOLD_OPEN_IDENTITY_NO_OPERATOR',boundary:'No mapping from the date to RDMH is asserted.'}),
      transition661:transition661Record(),
      gap:Object.freeze({...GAP,interiorPrimeCount:gapInteriorPrimes.length,interiorPrimes:Object.freeze(gapInteriorPrimes)}),
      roots:Object.freeze({domain:Object.freeze([1,MAX_N-1]),referenceAnchors:Object.freeze([2,5,7]),operator:'Δk = √(k+1) − √k = 1/(√(k+1)+√k)',return:'RETAINED_SOURCE_NUMBER'}),
      hSpace:Object.freeze({name:'TYPED_H_RECORD_CROSSWALK',path:orientationPath(),diceSpaces:Object.freeze({h5:'{1,…,6}^5',h6:'{1,…,6}^6'}),frame17:'5+6+6 declared inventory; no natural identity asserted'}),
      boundary:'The cube, distributed gap fold, rigid 661 hinge, root ruler and H-record crosswalk are declared views. Prime rank, cube address, dice state and provenance hash remain non-identical registers. The 3D hinge rotation is bijective; only the 2D screen projection may overlap records. They do not assert an intrinsic cubic prime geometry, natural root cuboid, prime generator, physical hinge, resonance mechanism or natural Dice correspondence.'
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

  return Object.freeze({VERSION,MAX_N,GRID_COLUMNS,CUBE_SIZE,LAYER_AREA,LAYER_CLOSURES,GAP,isPrime,sieve,divisors,mod,constellationGroups,cubeAddress,cubeNumber,gridAddress,residueRecord,toBase11,diceAddress,diceNumber,hammingDistance,hRecord,orientationPath,layerClosureRecord,carrierFillRecord,gapPhase,rootGap,rootRecord,foldAddress,hingeAddress,transition661Record,buildDataset,numberRecord});
});
