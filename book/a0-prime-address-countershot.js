(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimeAddressCountershot=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function isPrime(n){
    if(!Number.isInteger(n)||n<2)return false;
    if(n===2)return true;
    if(n%2===0)return false;
    for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;
    return true;
  }

  function primesUpTo(limit){
    const sieve=new Uint8Array(limit+1);
    sieve.fill(1,2);
    for(let p=2;p*p<=limit;p++)if(sieve[p])for(let m=p*p;m<=limit;m+=p)sieve[m]=0;
    const out=[];
    for(let n=2;n<=limit;n++)if(sieve[n])out.push(n);
    return out;
  }

  function nthPrime(index){
    if(!Number.isInteger(index)||index<1)throw new RangeError('prime index must be a positive integer');
    let limit=index<6?15:Math.ceil(index*(Math.log(index)+Math.log(Math.log(index))))+8;
    while(true){
      const list=primesUpTo(limit);
      if(list.length>=index)return list[index-1];
      limit*=2;
    }
  }

  function record(index){
    const prime=nthPrime(index);
    return Object.freeze({
      index,
      prime,
      address:prime-1,
      reverseIndex:index,
      superprime:isPrime(index),
      nestedPrime:nthPrime(prime)
    });
  }

  function stripModel(limit=1000,width=25){
    if(!Number.isInteger(limit)||limit<2)throw new RangeError('limit must be an integer >= 2');
    if(!Number.isInteger(width)||width<2)throw new RangeError('width must be an integer >= 2');
    const primes=primesUpTo(limit);
    const strips=Math.ceil(limit/width);
    const cuts=[Math.floor(strips/3),Math.floor(2*strips/3),strips];
    const starts=[0,cuts[0],cuts[1]];
    const orientations=[90,90,270];
    const zones=starts.map((start,i)=>{
      const end=cuts[i];
      const min=start*width+1;
      const max=Math.min(limit,end*width);
      const values=primes.filter(p=>p>=min&&p<=max);
      const residueCounts=Array.from({length:11},(_,r)=>values.filter(p=>p%11===r).length);
      return Object.freeze({
        id:i+1,
        orientation:orientations[i],
        stripStart:start,
        stripEnd:end,
        stripCount:end-start,
        min,
        max,
        primes:values,
        residueCounts
      });
    });
    return Object.freeze({limit,width,strips,primeCount:primes.length,primes,zones});
  }

  function carrierModel(mode='ceiling',target=1000,width=25){
    if(mode!=='ceiling'&&mode!=='count')throw new RangeError('mode must be ceiling or count');
    if(!Number.isInteger(target)||target<2)throw new RangeError('target must be an integer >= 2');
    const limit=mode==='count'?nthPrime(target):target;
    const model=stripModel(limit,width);
    return Object.freeze({
      ...model,
      mode,
      target,
      primeTarget:mode==='count'?target:model.primeCount
    });
  }

  function dyadicPrimeShells(base=1000,levels=5){
    if(!Number.isInteger(base)||base<2)throw new RangeError('base must be an integer >= 2');
    if(!Number.isInteger(levels)||levels<2)throw new RangeError('levels must be an integer >= 2');
    const thresholds=[];
    for(let exponent=levels-1;exponent>=0;exponent--)thresholds.push(Math.floor(base/(2**exponent)));
    const cumulative=thresholds.map(n=>primesUpTo(n).length);
    const shells=cumulative.map((count,i)=>i===0?count:count-cumulative[i-1]);
    return Object.freeze({
      base,
      levels,
      thresholds:Object.freeze(thresholds),
      cumulative:Object.freeze(cumulative),
      shells:Object.freeze(shells),
      total:shells.reduce((sum,n)=>sum+n,0)
    });
  }

  function dyadicSvgFor(model){
    const W=1000,H=460,centers=[260,740],cy=225,r=150;
    const points=centers.map(cx=>Array.from({length:5},(_,i)=>{
      const angle=(-90+i*72)*Math.PI/180;
      return{x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r};
    }));
    const polygon=pts=>pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const parts=[`<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="dyadicPrimeTitle dyadicPrimeDesc">`,
      '<title id="dyadicPrimeTitle">Dyadischer Prime-Pfad als zwei gekoppelte Sechs-Knoten-Träger</title>',
      `<desc id="dyadicPrimeDesc">Fünf halbierte Zahlengrenzen werden auf fünf disjunkte Primzahl-Schalen abgebildet. Der sechste Knoten summiert die Schalen zu ${model.total}.</desc>`,
      '<text x="260" y="28" class="pa-dyadic-heading">CARRIER LIMITS · ÷2 PATH</text>',
      '<text x="740" y="28" class="pa-dyadic-heading">PRIME SHELLS · Σ JOINT</text>',
      `<polygon points="${polygon(points[0])}" class="pa-dyadic-poly pa-dyadic-carrier"/>`,
      `<polygon points="${polygon(points[1])}" class="pa-dyadic-poly pa-dyadic-prime"/>`];
    points[0].forEach((p,i)=>{
      parts.push(`<line x1="260" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" class="pa-dyadic-spoke"/>`);
      parts.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="27" class="pa-dyadic-node pa-dyadic-carrier-node"/>`);
      parts.push(`<text x="${p.x.toFixed(1)}" y="${(p.y+5).toFixed(1)}" class="pa-dyadic-value">${model.thresholds[i]}</text>`);
    });
    points[1].forEach((p,i)=>{
      parts.push(`<line x1="740" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" class="pa-dyadic-spoke"/>`);
      parts.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="27" class="pa-dyadic-node pa-dyadic-prime-node"/>`);
      parts.push(`<text x="${p.x.toFixed(1)}" y="${(p.y+5).toFixed(1)}" class="pa-dyadic-value">${model.shells[i]}</text>`);
    });
    parts.push('<circle cx="260" cy="225" r="43" class="pa-dyadic-joint pa-dyadic-carrier-joint"/>',
      '<text x="260" y="218" class="pa-dyadic-center">÷2</text>',
      `<text x="260" y="240" class="pa-dyadic-center-small">N=${model.base}</text>`,
      '<circle cx="740" cy="225" r="43" class="pa-dyadic-joint pa-dyadic-prime-joint"/>',
      `<text x="740" y="218" class="pa-dyadic-center">Σ=${model.total}</text>`,
      '<text x="740" y="240" class="pa-dyadic-center-small">5 → 1</text>',
      '<line x1="320" y1="225" x2="680" y2="225" class="pa-dyadic-map"/>',
      '<path d="M680 225 l-14 -8 v16 z" class="pa-dyadic-arrow"/>',
      '<text x="500" y="208" class="pa-dyadic-map-label">Δπ · DISJOINT BANDS</text>',
      `<text x="500" y="428" class="pa-dyadic-return">${model.shells.join(' + ')} = ${model.total} = π(${model.base})</text>`,
      '</svg>');
    return parts.join('');
  }

  function reverseDigits(n){
    if(!Number.isInteger(n)||n<0)throw new RangeError('value must be a non-negative integer');
    return Number(String(n).split('').reverse().join(''));
  }

  function primeFactors(n){
    if(!Number.isInteger(n)||n<2)throw new RangeError('value must be an integer >= 2');
    const factors=[];
    let rest=n;
    for(let d=2;d*d<=rest;d+=(d===2?1:2))while(rest%d===0){factors.push(d);rest/=d;}
    if(rest>1)factors.push(rest);
    return Object.freeze(factors);
  }

  function twinSeamMirrorModel(left=1031,right=1033){
    if(!isPrime(left)||!isPrime(right)||right-left!==2)throw new RangeError('values must be an ordered twin-prime pair');
    const seam=(left+right)/2;
    const leftMirror=reverseDigits(left),rightMirror=reverseDigits(right);
    const shell=dyadicPrimeShells(1000,5);
    const shellBridge=shell.thresholds[0]+shell.total;
    return Object.freeze({
      left,
      seam,
      right,
      gap:right-left,
      seamFactors:primeFactors(seam),
      leftMirror,
      rightMirror,
      leftMirrorPrime:isPrime(leftMirror),
      rightMirrorPrime:isPrime(rightMirror),
      shellBridge,
      shellBase:shell.thresholds[0],
      shellTotal:shell.total,
      bridgePrimeIndex:9,
      bridgePrime:nthPrime(9),
      bridgeMultiplier:shellBridge/nthPrime(9)
    });
  }

  const EULER_HISTORICAL_CONSTANTS=Object.freeze([13,41,137,241,367,487,617,751,883,1031,1171,1303,1459]);

  function primeAddressIntegrationModel(value){
    if(!Number.isInteger(value)||value<0)throw new RangeError('integration value must be a non-negative integer');
    const prime=isPrime(value);
    const primeIndex=prime?primesUpTo(value).length:null;
    const q20=Math.floor(value/20),r20=value%20;
    const crt=Object.freeze({mod3:value%3,mod5:value%5,mod7:value%7});
    let antipode=null;
    if(value>=1031&&value<=1033){
      antipode=Object.freeze({operator:'R₁₀₃₂(n)=2064−n',center:1032,value:2064-value,domain:'TWIN_SEAM'});
    }else if(value<=1000){
      antipode=Object.freeze({operator:'J₁₀₀₀(n)=1000−n',center:500,value:1000-value,domain:'ADDRESS_AXIS'});
    }
    const factors=value>=2?primeFactors(value):Object.freeze([]);
    const eulerConstant=EULER_HISTORICAL_CONSTANTS.includes(value);
    const eulerDirect=value===1033?Object.freeze({constant:41,index:31,equation:'31²+31+41=1033'}):null;
    const crownValues=Object.freeze([1031,1032,1033,3201,3301,7801]);
    const crownSum=crownValues.reduce((sum,n)=>sum+n,0);
    return Object.freeze({
      schema:'a0.numbermagick-prime-address-integration/1.0.0',
      value,
      prime,
      primeIndex,
      factors,
      qrt:Object.freeze({q20,r20,reconstruction:20*q20+r20}),
      crt,
      antipode,
      euler:Object.freeze({
        historicalConstant:eulerConstant,
        directValue:eulerDirect,
        centeredShapeBoundary:'E_c(t)=t²+t+c; after centering every c has the same shape'
      }),
      crown:Object.freeze({values:crownValues,sum:crownSum,factors:Object.freeze([127,137])}),
      ilau:Object.freeze({
        retained:'integer carrier and declared source record',
        lost:'quotient is lost if only a residue address is shown',
        added:'polar position, color and petal are view encodings',
        unresolved:'no common CRT–Euler–ILAU generator is established'
      }),
      identityReuse:Object.freeze(['NN:CRT_QRT_37_CARRIER_LADDER','MOD:NUMBER_VIEW_SUITE','SG:LENS:ILAU_ORIENTATION']),
      newCanonicalIds:Object.freeze([]),
      relationChanges:Object.freeze([])
    });
  }

  function twinSeamSvgFor(model){
    const nodes=[
      {x:90,value:model.leftMirror,label:'REV₁₀(1031)',kind:'mirror'},
      {x:300,value:model.left,label:'PRIME',kind:'prime'},
      {x:500,value:model.seam,label:'SEAM',kind:'seam'},
      {x:700,value:model.right,label:'PRIME',kind:'prime'},
      {x:910,value:model.rightMirror,label:'REV₁₀(1033)',kind:'mirror'}
    ];
    const parts=['<svg viewBox="0 0 1000 390" role="img" aria-labelledby="twinSeamSvgTitle twinSeamSvgDesc">',
      '<title id="twinSeamSvgTitle">Twin, Seam and Decimal Mirror</title>',
      '<desc id="twinSeamSvgDesc">The twin primes 1031 and 1033 surround the composite seam 1032. Decimal reversal maps them separately to the primes 1301 and 3301.</desc>',
      '<line x1="90" y1="150" x2="910" y2="150" class="pa-mirror-axis"/>',
      '<path d="M300 105 Q500 35 700 105" class="pa-twin-bracket"/>',
      '<text x="500" y="53" class="pa-mirror-caption">TWIN GAP = 2</text>'];
    nodes.forEach(n=>{
      parts.push(`<circle cx="${n.x}" cy="150" r="42" class="pa-mirror-node pa-mirror-${n.kind}"/>`);
      parts.push(`<text x="${n.x}" y="155" class="pa-mirror-value">${n.value}</text>`);
      parts.push(`<text x="${n.x}" y="215" class="pa-mirror-label">${n.label}</text>`);
    });
    parts.push('<path d="M270 245 Q180 285 90 245" class="pa-reverse-arc"/>',
      '<path d="M730 245 Q820 285 910 245" class="pa-reverse-arc"/>',
      '<text x="180" y="300" class="pa-mirror-caption">DIGIT REVERSAL · NOT ROTATION</text>',
      '<text x="820" y="300" class="pa-mirror-caption">DIGIT REVERSAL · NOT CIKADA ID</text>',
      `<text x="500" y="260" class="pa-seam-factor">${model.seam} = ${model.seamFactors.join(' × ')}</text>`,
      `<rect x="230" y="325" width="540" height="48" rx="24" class="pa-shell-bridge"/>`,
      `<text x="500" y="355" class="pa-shell-bridge-text">${model.shellBase} + ${model.shellTotal} = ${model.shellBridge} = ${model.bridgeMultiplier} × p${model.bridgePrimeIndex} (${model.bridgePrime})</text>`,
      '</svg>');
    return parts.join('');
  }

  function deterministicUnit(index){
    let x=(index+1)>>>0;
    x=Math.imul(x^(x>>>16),0x7feb352d);
    x=Math.imul(x^(x>>>15),0x846ca68b);
    x=(x^(x>>>16))>>>0;
    return x/4294967296;
  }

  function primeSpiralModel(mode='golden',modulus=7){
    const allowed=['golden','uniform','residue','null'];
    if(!allowed.includes(mode))throw new RangeError('unknown spiral angle mode');
    if(!Number.isInteger(modulus)||modulus<2)throw new RangeError('modulus must be an integer >= 2');
    const primes=primesUpTo(1000),count=primes.length,phi=(1+Math.sqrt(5))/2;
    const goldenAngle=2*Math.PI/(phi*phi);
    const points=primes.map((prime,index)=>{
      let theta;
      if(mode==='golden')theta=index*goldenAngle;
      else if(mode==='uniform')theta=index*2*Math.PI/count;
      else if(mode==='residue')theta=(prime%modulus)*2*Math.PI/modulus;
      else theta=deterministicUnit(index)*2*Math.PI;
      theta=((theta%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
      return Object.freeze({index:index+1,prime,theta,radius:Math.sqrt(prime/1000)});
    });
    const bins=Array(12).fill(0);
    points.forEach(p=>bins[Math.min(11,Math.floor(p.theta/(2*Math.PI)*12))]++);
    const entropy=-bins.reduce((sum,n)=>n?sum+(n/count)*Math.log(n/count):sum,0)/Math.log(12);
    const meanCos=points.reduce((sum,p)=>sum+Math.cos(p.theta),0)/count;
    const meanSin=points.reduce((sum,p)=>sum+Math.sin(p.theta),0)/count;
    const resultant=Math.hypot(meanCos,meanSin);
    const angles=points.map(p=>p.theta).sort((a,b)=>a-b);
    const gaps=angles.map((a,i)=>((i===angles.length-1?angles[0]+2*Math.PI:angles[i+1])-a));
    const gapMean=2*Math.PI/count;
    const gapCv=Math.sqrt(gaps.reduce((sum,g)=>sum+(g-gapMean)**2,0)/count)/gapMean;
    let nearestTotal=0;
    for(let i=0;i<points.length;i++){
      const a=points[i],ax=a.radius*Math.cos(a.theta),ay=a.radius*Math.sin(a.theta);
      let nearest=Infinity;
      for(let j=0;j<points.length;j++)if(i!==j){
        const b=points[j],dx=ax-b.radius*Math.cos(b.theta),dy=ay-b.radius*Math.sin(b.theta);
        nearest=Math.min(nearest,Math.hypot(dx,dy));
      }
      nearestTotal+=nearest;
    }
    return Object.freeze({
      mode,
      modulus,
      limit:1000,
      count,
      goldenAngle,
      angularSeam:Object.freeze({
        fromIndex:count,
        fromPrime:primes[count-1],
        toIndex:1,
        toPrime:primes[0],
        stepRadians:2*Math.PI/count,
        stepDegrees:360/count,
        role:'INDEX_RETURN_NOT_MISSING_PRIME'
      }),
      points:Object.freeze(points),
      bins:Object.freeze(bins),
      entropy,
      resultant,
      gapCv,
      meanNearestDistance:nearestTotal/count
    });
  }

  function primeSpiralGeometryLens(model){
    const angle={
      golden:Object.freeze({equation:'θₖ=(k−1)π(3−√5)',classification:'GOLDEN-ANGLE / FIBONACCI-LIMIT VIEW · QUASIPERIODIC'}),
      uniform:Object.freeze({equation:`θₖ=2π(k−1)/${model.count}`,classification:'PRIME-WEIGHTED FERMAT-LIKE VIEW · ONE INDEX TURN · NOT LOGARITHMIC'}),
      residue:Object.freeze({equation:`θₖ=2π(pₖ mod ${model.modulus})/${model.modulus}`,classification:`RESIDUE-SPOKE VIEW · ${model.modulus} DECLARED DIRECTIONS`}),
      null:Object.freeze({equation:'θₖ=2π·uₖ · uₖ deterministic',classification:'DETERMINISTIC NULL VIEW · CONTROL ONLY'})
    }[model.mode];
    return Object.freeze({
      mapEquation:'zₖ=√(pₖ/1000)·eⁱᶿᵏ',
      radialEquation:'rₖ²=pₖ/1000',
      angleEquation:angle.equation,
      classification:angle.classification,
      innerRing:Object.freeze({radius:.5,primeThreshold:250,previousPrime:241,nextPrime:251}),
      outerRing:Object.freeze({radius:1,normalizationCeiling:1000,lastPrime:997}),
      namedBoundary:'FORM RESEMBLANCE ONLY · NO CANONICAL NAUTILUS IDENTITY'
    });
  }

  const POLAR_CUT_SHELLS=Object.freeze({
    inner:Object.freeze({key:'inner',index:0,label:'S1 · INNER',inner:0,outer:.34}),
    middle:Object.freeze({key:'middle',index:1,label:'S2 · MIDDLE',inner:.34,outer:.68}),
    outer:Object.freeze({key:'outer',index:2,label:'S3 · OUTER',inner:.68,outer:1.0000001})
  });

  function wrapSignedAngle(angle){
    const tau=2*Math.PI;
    return ((angle+Math.PI)%tau+tau)%tau-Math.PI;
  }

  function quarterTurnAxis(angleDegrees){
    if(!Number.isFinite(angleDegrees))throw new TypeError('quarter-turn angle must be finite');
    if(angleDegrees<0||angleDegrees>90)throw new RangeError('quarter-turn angle must be in [0,90]');
    const angle=angleDegrees*Math.PI/180;
    const vector=Object.freeze({x:Math.sin(angle),y:Math.cos(angle)});
    return Object.freeze({
      schema:'a0.orientation-axis-transfer/1.0.0',
      angleDegrees,
      apertureCenterDegrees:90-angleDegrees,
      vector,
      norm:Math.hypot(vector.x,vector.y),
      origin:Object.freeze({x:0,y:0}),
      operation:'EUCLIDEAN_VIEW_ROTATION_ONLY'
    });
  }

  const PHASE_CYCLE=Object.freeze([
    Object.freeze({key:'AM',role:'INSIDE / SOURCE',verb:'admit'}),
    Object.freeze({key:'VM',role:'SEAM / TRANSFER',verb:'cross'}),
    Object.freeze({key:'PM',role:'OUTSIDE / PROJECTION',verb:'project'}),
    Object.freeze({key:'TM',role:'EXCHANGE / RETURN',verb:'return'})
  ]);

  function phaseCycle(progress){
    if(!Number.isFinite(progress))throw new TypeError('phase progress must be finite');
    const turns=((progress%1)+1)%1;
    const phaseIndex=Math.floor(turns*4)%4;
    const outbound=turns<=.5;
    const angleDegrees=outbound?turns*180:(1-turns)*180;
    const transfer=quarterTurnAxis(angleDegrees);
    const phase=PHASE_CYCLE[phaseIndex];
    return Object.freeze({
      schema:'a0.prime-phase-cycle/1.0.0',
      progress:turns,
      cycleDegrees:turns*360,
      phaseIndex,
      phase,
      direction:outbound?'OUTBOUND':'RETURN',
      sourceWheelDegrees:turns*360,
      apertureWheelDegrees:-turns*360,
      angleDegrees:transfer.angleDegrees,
      apertureCenterDegrees:transfer.apertureCenterDegrees,
      norm:transfer.norm,
      origin:transfer.origin,
      operation:'COUNTER_ROTATING_VIEW_CYCLE_ONLY'
    });
  }

  function polarCutTransition(previous,next){
    if(!previous||!next||!Array.isArray(previous.insidePoints)||!Array.isArray(next.insidePoints))throw new TypeError('transition requires two polar cut atlases');
    const before=new Set(previous.insidePoints.map(point=>point.prime));
    const after=new Set(next.insidePoints.map(point=>point.prime));
    const entered=next.insidePoints.filter(point=>!before.has(point.prime)).map(point=>point.prime);
    const exited=previous.insidePoints.filter(point=>!after.has(point.prime)).map(point=>point.prime);
    const retained=next.insidePoints.filter(point=>before.has(point.prime)).map(point=>point.prime);
    return Object.freeze({
      entered:Object.freeze(entered),
      exited:Object.freeze(exited),
      retained:Object.freeze(retained),
      before:before.size,
      after:after.size,
      balance:before.size+entered.length-exited.length-after.size
    });
  }

  function phaseWheelSvgFor(state,transition){
    const polar=(cx,cy,r,degrees)=>{const angle=(degrees-90)*Math.PI/180;return{x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r}};
    const source=polar(225,175,100,state.sourceWheelDegrees);
    const aperture=polar(675,175,100,state.apertureWheelDegrees);
    const phaseNodes=PHASE_CYCLE.map((phase,index)=>{
      const point=polar(450,175,142,index*90);
      return `<g class="${index===state.phaseIndex?'pa-phase-node pa-phase-node-active':'pa-phase-node'}"><circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="24"/><text x="${point.x.toFixed(1)}" y="${(point.y+4).toFixed(1)}">${phase.key}</text></g>`;
    }).join('');
    const entered=transition&&transition.entered.length?`IN +${transition.entered.slice(0,5).join(' · ')}`:'IN +∅';
    const exited=transition&&transition.exited.length?`OUT −${transition.exited.slice(0,5).join(' · ')}`:'OUT −∅';
    return `<svg viewBox="0 0 900 350" role="img" aria-labelledby="primePhaseWheelTitle primePhaseWheelDesc">
      <title id="primePhaseWheelTitle">AM VM PM TM Gegenrotationszyklus</title>
      <desc id="primePhaseWheelDesc">Das Source-Rad dreht positiv, das Apertur-Rad negativ. Die vier View-Phasen schließen über TM wieder zu AM.</desc>
      <g class="pa-phase-wheel pa-phase-wheel-source"><circle cx="225" cy="175" r="112"/><circle cx="225" cy="175" r="78"/><line x1="225" y1="175" x2="${source.x.toFixed(1)}" y2="${source.y.toFixed(1)}"/><circle cx="${source.x.toFixed(1)}" cy="${source.y.toFixed(1)}" r="8"/><text x="225" y="169">SOURCE +θ ↻</text><text x="225" y="193">${state.sourceWheelDegrees.toFixed(0)}°</text></g>
      <g class="pa-phase-wheel pa-phase-wheel-aperture"><circle cx="675" cy="175" r="112"/><circle cx="675" cy="175" r="78"/><line x1="675" y1="175" x2="${aperture.x.toFixed(1)}" y2="${aperture.y.toFixed(1)}"/><circle cx="${aperture.x.toFixed(1)}" cy="${aperture.y.toFixed(1)}" r="8"/><text x="675" y="169">APERTURE −θ ↺</text><text x="675" y="193">${state.apertureWheelDegrees.toFixed(0)}°</text></g>
      <path d="M337 175 C378 108 522 108 563 175 C522 242 378 242 337 175" class="pa-phase-coupling"/>
      ${phaseNodes}
      <text x="450" y="166" class="pa-phase-active">${state.phase.key}</text><text x="450" y="188" class="pa-phase-role">${state.phase.role}</text><text x="450" y="214" class="pa-phase-equation">α ${state.angleDegrees.toFixed(1)}° · β ${state.apertureCenterDegrees.toFixed(1)}°</text>
      <text x="225" y="322" class="pa-phase-event">${entered}</text><text x="675" y="322" class="pa-phase-event">${exited}</text>
    </svg>`;
  }

  function polarCutFrame(shell='middle',centerDegrees=0,widthDegrees=120){
    if(!Object.hasOwn(POLAR_CUT_SHELLS,shell))throw new RangeError('unknown polar cut shell');
    if(!Number.isFinite(centerDegrees))throw new TypeError('aperture center must be finite');
    if(!Number.isFinite(widthDegrees)||widthDegrees<=0||widthDegrees>360)throw new RangeError('aperture width must be in (0,360]');
    const base=POLAR_CUT_SHELLS[shell];
    const center=((centerDegrees%360)+360)%360;
    return Object.freeze({...base,centerDegrees:center,widthDegrees,center:center*Math.PI/180,width:widthDegrees*Math.PI/180});
  }

  function shellMask(radius){
    return radius<POLAR_CUT_SHELLS.inner.outer?'100':radius<POLAR_CUT_SHELLS.middle.outer?'010':'001';
  }

  function pointInPolarFrame(point,frame){
    const radial=point.radius>=frame.inner&&point.radius<frame.outer;
    const angular=frame.widthDegrees>=360-1e-12||Math.abs(wrapSignedAngle(point.theta-frame.center))<=frame.width/2+1e-12;
    return radial&&angular;
  }

  function polarCutAtlasModel(spiral,frame=polarCutFrame(),mirror=true,bins=24){
    if(!spiral||!Array.isArray(spiral.points))throw new TypeError('spiral model required');
    if(!frame||!Object.hasOwn(POLAR_CUT_SHELLS,frame.key))throw new TypeError('declared polar frame required');
    if(!Number.isInteger(bins)||bins<8)throw new RangeError('density bins must be an integer >= 8');
    const points=spiral.points.map(point=>{
      const inside=pointInPolarFrame(point,frame);
      const x=point.radius*Math.cos(point.theta),y=point.radius*Math.sin(point.theta);
      const mirrorTheta=((2*frame.center-point.theta)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
      return Object.freeze({...point,x,y,inside,shellMask:shellMask(point.radius),mirrorTheta,mirrorX:point.radius*Math.cos(mirrorTheta),mirrorY:point.radius*Math.sin(mirrorTheta)});
    });
    const edges=points.slice(0,-1).map((from,index)=>{
      const to=points[index+1];
      const kind=from.inside&&to.inside?'inside':from.inside!==to.inside?'crossing':'outside';
      return Object.freeze({index,from,to,kind});
    });
    const insidePoints=points.filter(point=>point.inside),outsidePoints=points.filter(point=>!point.inside);
    const crossingEdges=edges.filter(edge=>edge.kind==='crossing');
    const centroid=insidePoints.length?insidePoints.reduce((sum,p)=>({x:sum.x+p.x,y:sum.y+p.y}),{x:0,y:0}):{x:0,y:0};
    centroid.x/=Math.max(1,insidePoints.length);centroid.y/=Math.max(1,insidePoints.length);
    const density=Array(bins).fill(0),addAngle=(angle,weight=1)=>{
      const normalized=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
      density[Math.min(bins-1,Math.floor(normalized/(2*Math.PI)*bins))]+=weight;
    };
    insidePoints.forEach(point=>{addAngle(point.theta);if(mirror)addAngle(point.mirrorTheta);});
    crossingEdges.forEach(edge=>{
      const x=edge.from.x+edge.to.x,y=edge.from.y+edge.to.y;
      const angle=Math.abs(x)+Math.abs(y)>1e-12?Math.atan2(y,x):edge.from.theta;
      addAngle(angle,1.5);if(mirror)addAngle(2*frame.center-angle,1.5);
    });
    return Object.freeze({
      schema:'a0.prime-polar-cut-atlas/1.0.0',
      status:'BOUNDED_VIEW_ATLAS_NO_NEW_PRIME_CLAIM',
      spiral,
      frame,
      mirror:Boolean(mirror),
      bins,
      points:Object.freeze(points),
      edges:Object.freeze(edges),
      insidePoints:Object.freeze(insidePoints),
      outsidePoints:Object.freeze(outsidePoints),
      crossingEdges:Object.freeze(crossingEdges),
      density:Object.freeze(density),
      maxDensity:Math.max(0,...density),
      centroid:Object.freeze({...centroid,drift:Math.hypot(centroid.x,centroid.y),count:insidePoints.length}),
      identityReuse:Object.freeze(['NEXAH:PBM:V1','MOD:NUMBER_VIEW_SUITE']),
      newCanonicalIds:Object.freeze([]),
      relationChanges:Object.freeze([])
    });
  }

  function polarCutAtlasSvgFor(atlas,selectedPrime){
    const W=1180,H=700,field={cx:330,cy:350,r:270},leaf={cx:900,cy:350,inner:92,span:130};
    const screen=(point,mirror=false)=>({
      x:field.cx+(mirror?point.mirrorX:point.x)*field.r,
      y:field.cy-(mirror?point.mirrorY:point.y)*field.r
    });
    const polar=(cx,cy,r,angle)=>({x:cx+r*Math.cos(angle),y:cy-r*Math.sin(angle)});
    const sectorPath=(cx,cy,inner,outer,start,end)=>{
      const width=end-start,large=width>Math.PI?1:0;
      if(width>=2*Math.PI-1e-9){
        const oi=inner>0?` M ${cx+inner} ${cy} A ${inner} ${inner} 0 1 0 ${cx-inner} ${cy} A ${inner} ${inner} 0 1 0 ${cx+inner} ${cy} Z`:'';
        return `M ${cx+outer} ${cy} A ${outer} ${outer} 0 1 0 ${cx-outer} ${cy} A ${outer} ${outer} 0 1 0 ${cx+outer} ${cy} Z${oi}`;
      }
      const a=polar(cx,cy,outer,start),b=polar(cx,cy,outer,end),c=polar(cx,cy,inner,end),d=polar(cx,cy,inner,start);
      if(inner<=1e-9)return `M ${cx} ${cy} L ${a.x} ${a.y} A ${outer} ${outer} 0 ${large} 0 ${b.x} ${b.y} Z`;
      return `M ${a.x} ${a.y} A ${outer} ${outer} 0 ${large} 0 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 ${large} 1 ${d.x} ${d.y} Z`;
    };
    const frameStart=atlas.frame.center-atlas.frame.width/2,frameEnd=atlas.frame.center+atlas.frame.width/2;
    const parts=[`<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="primeCutSvgTitle primeCutSvgDesc">`,
      '<title id="primeCutSvgTitle">Polar Cut Atlas with three shells, aperture membership, mirror overlay and angular leaf density</title>',
      `<desc id="primeCutSvgDesc">${atlas.insidePoints.length} of ${atlas.points.length} prime carrier points are inside ${atlas.frame.label}; ${atlas.crossingEdges.length} consecutive edges cross the frame boundary.</desc>`,
      '<text x="330" y="28" class="pa-cut-title">FRAME / MEMBERSHIP · FIXED PRIME CARRIER</text>',
      '<text x="900" y="28" class="pa-cut-title">SECOND RING · ANGULAR LEAF DENSITY</text>',
      `<path d="${sectorPath(field.cx,field.cy,atlas.frame.inner*field.r,atlas.frame.outer*field.r,frameStart,frameEnd)}" class="pa-cut-frame" fill-rule="evenodd"/>`,
      `<line x1="${field.cx-field.r}" y1="${field.cy}" x2="${field.cx+field.r}" y2="${field.cy}" class="pa-cut-axis"/>`,
      `<line x1="${field.cx}" y1="${field.cy-field.r}" x2="${field.cx}" y2="${field.cy+field.r}" class="pa-cut-axis"/>`];
    [.34,.68,1].forEach((scale,index)=>parts.push(`<circle cx="${field.cx}" cy="${field.cy}" r="${field.r*scale}" class="pa-cut-shell pa-cut-shell-${index+1}"/>`));
    const axisEnd=polar(field.cx,field.cy,field.r,atlas.frame.center);
    parts.push(`<line x1="${field.cx}" y1="${field.cy}" x2="${axisEnd.x}" y2="${axisEnd.y}" class="pa-cut-frame-axis"/>`);
    if(atlas.mirror)atlas.edges.forEach(edge=>{
      const a=screen(edge.from,true),b=screen(edge.to,true);
      parts.push(`<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" class="pa-cut-edge pa-cut-edge-mirror"/>`);
    });
    atlas.edges.forEach(edge=>{
      const a=screen(edge.from),b=screen(edge.to);
      parts.push(`<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" class="pa-cut-edge pa-cut-edge-${edge.kind}"/>`);
    });
    if(atlas.mirror)atlas.insidePoints.forEach(point=>{
      const p=screen(point,true);parts.push(`<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="2.1" class="pa-cut-point-mirror"/>`);
    });
    atlas.points.forEach(point=>{
      const p=screen(point),selected=point.prime===selectedPrime;
      parts.push(`<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${selected?5.6:point.inside?3.1:2.1}" class="pa-cut-point ${point.inside?'pa-cut-point-inside':'pa-cut-point-outside'}${selected?' pa-cut-point-selected':''}"><title>p${point.index}=${point.prime} · mask ${point.shellMask} · ${point.inside?'INSIDE':'OUTSIDE'}</title></circle>`);
    });
    const centroid={x:field.cx+atlas.centroid.x*field.r,y:field.cy-atlas.centroid.y*field.r};
    parts.push(`<line x1="${field.cx}" y1="${field.cy}" x2="${centroid.x.toFixed(2)}" y2="${centroid.y.toFixed(2)}" class="pa-cut-centroid-line"/>`,
      `<circle cx="${centroid.x.toFixed(2)}" cy="${centroid.y.toFixed(2)}" r="6" class="pa-cut-centroid"><title>admitted centroid · drift ${atlas.centroid.drift.toFixed(5)}</title></circle>`,
      `<circle cx="${field.cx}" cy="${field.cy}" r="8" class="pa-cut-origin"><title>fixed origin c₀=(0,0)</title></circle>`,
      `<circle cx="${leaf.cx}" cy="${leaf.cy}" r="${leaf.inner}" class="pa-cut-leaf-base"/>`);
    for(let index=0;index<atlas.bins;index++){
      const a0=index*2*Math.PI/atlas.bins+.015,a1=(index+1)*2*Math.PI/atlas.bins-.015;
      const value=atlas.density[index],outer=leaf.inner+(atlas.maxDensity?value/atlas.maxDensity*leaf.span:0);
      parts.push(`<path d="${sectorPath(leaf.cx,leaf.cy,leaf.inner,outer,a0,a1)}" class="pa-cut-leaf" style="--leaf-alpha:${(.18+.72*(atlas.maxDensity?value/atlas.maxDensity:0)).toFixed(3)}"><title>bin ${index+1}: ${value}</title></path>`);
    }
    [leaf.inner,leaf.inner+leaf.span*.5,leaf.inner+leaf.span].forEach(r=>parts.push(`<circle cx="${leaf.cx}" cy="${leaf.cy}" r="${r}" class="pa-cut-leaf-ring"/>`));
    for(let i=0;i<atlas.bins;i+=2){const p=polar(leaf.cx,leaf.cy,leaf.inner+leaf.span,i*2*Math.PI/atlas.bins);parts.push(`<line x1="${leaf.cx}" y1="${leaf.cy}" x2="${p.x.toFixed(2)}" y2="${p.y.toFixed(2)}" class="pa-cut-leaf-spoke"/>`);}
    parts.push(`<circle cx="${leaf.cx}" cy="${leaf.cy}" r="8" class="pa-cut-origin"/>`,
      `<text x="${leaf.cx}" y="${leaf.cy+4}" class="pa-cut-center-label">c₀</text>`,
      `<text x="330" y="674" class="pa-cut-foot">${atlas.frame.label} · r ${atlas.frame.inner.toFixed(2)}–${Math.min(1,atlas.frame.outer).toFixed(2)} · β ${atlas.frame.centerDegrees.toFixed(0)}° · Δ ${atlas.frame.widthDegrees.toFixed(0)}°</text>`,
      `<text x="900" y="674" class="pa-cut-foot">POINT VISITS + FRAME CROSSINGS · NORMALIZED VIEW ONLY</text>`,
      '</svg>');
    return parts.join('');
  }

  function primeSpiralSvgFor(model,selectedPrime){
    const W=760,H=650,cx=380,cy=330,maxR=270;
    const modeLabels={golden:'GOLDEN ANGLE',uniform:'UNIFORM 168',residue:`PRIME MOD ${model.modulus}`,null:'DETERMINISTIC NULL'};
    const parts=[`<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="primeSpiralSvgTitle primeSpiralSvgDesc">`,
      `<title id="primeSpiralSvgTitle">Prime spiral comparator: ${modeLabels[model.mode]}</title>`,
      `<desc id="primeSpiralSvgDesc">The 168 primes at or below 1000 use radius square root of p over 1000 and the selected declared angle rule.</desc>`,
      '<line x1="90" y1="330" x2="670" y2="330" class="pa-spiral-axis"/>',
      '<line x1="380" y1="40" x2="380" y2="620" class="pa-spiral-axis"/>'];
    [0.25,0.5,0.75,1].forEach(scale=>{
      const role=scale===.5?' pa-spiral-ring-inner':scale===1?' pa-spiral-ring-edge':'';
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${maxR*scale}" class="pa-spiral-ring${role}"/>`);
    });
    const path=model.points.map(p=>`${(cx+p.radius*maxR*Math.cos(p.theta)).toFixed(2)},${(cy-p.radius*maxR*Math.sin(p.theta)).toFixed(2)}`).join(' ');
    parts.push(`<polyline points="${path}" class="pa-spiral-path"/>`);
    model.points.forEach(p=>{
      const x=cx+p.radius*maxR*Math.cos(p.theta),y=cy-p.radius*maxR*Math.sin(p.theta),selected=p.prime===selectedPrime;
      parts.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${selected?5.5:2.4}" class="${selected?'pa-spiral-point pa-spiral-selected':'pa-spiral-point'}"><title>p${p.index} = ${p.prime} · θ ${(p.theta*180/Math.PI).toFixed(2)}°</title></circle>`);
    });
    parts.push(`<text x="380" y="28" class="pa-spiral-title">${modeLabels[model.mode]} · π(1000)=168 · r=√(p/1000)</text>`,
      `<text x="${cx+8}" y="${cy-maxR*.5-7}" class="pa-spiral-ring-label">INNER r=½ · p=250 THRESHOLD</text>`,
      `<text x="${cx+8}" y="${cy-maxR+16}" class="pa-spiral-ring-label pa-spiral-ring-label-edge">OUTER r=1 · N=1000</text>`,
      `<text x="380" y="610" class="pa-spiral-foot">SEAM p${model.angularSeam.fromIndex}=${model.angularSeam.fromPrime} → p${model.angularSeam.toIndex}=${model.angularSeam.toPrime} · Δθ=${model.angularSeam.stepDegrees.toFixed(6)}° · NO MISSING PRIME</text>`,
      '<text x="380" y="642" class="pa-spiral-foot">ANGLE RULE CHANGES · PRIME CARRIER DOES NOT</text>',
      '</svg>');
    return parts.join('');
  }

  function svgFor(model,selectedPrime){
    const W=1000,H=500,pad=24,gap=18,zoneW=(W-pad*2-gap*2)/3;
    const colors=['#35c5f0','#36d399','#b78cff'];
    const parts=[`<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="primeStripSvgTitle primeStripSvgDesc">`,
      '<title id="primeStripSvgTitle">Prime-Strips in drei orientierten Bereichen</title>',
      '<desc id="primeStripSvgDesc">Primzahlen bis zur gewählten Grenze werden in 25er-Streifen und drei Zonen mit 90, 90 und 270 Grad Leserichtung gezeigt.</desc>'];
    model.zones.forEach((zone,zi)=>{
      const x0=pad+zi*(zoneW+gap),y0=66,plotH=360,rows=zone.stripCount;
      parts.push(`<g data-zone="${zone.id}"><rect x="${x0}" y="40" width="${zoneW}" height="414" rx="12" class="pa-zone-bg"/>`);
      parts.push(`<text x="${x0+16}" y="28" class="pa-zone-title">ZONE ${zone.id} · ${zone.orientation}°</text>`);
      parts.push(`<text x="${x0+16}" y="476" class="pa-zone-range">${zone.min}–${zone.max} · ${zone.primes.length} primes</text>`);
      for(let r=0;r<rows;r++){
        const y=y0+(r+.5)*(plotH/rows);
        parts.push(`<line x1="${x0+14}" y1="${y.toFixed(2)}" x2="${(x0+zoneW-14).toFixed(2)}" y2="${y.toFixed(2)}" class="pa-strip"/>`);
      }
      const points=zone.primes.map(p=>{
        const globalRow=Math.floor((p-1)/model.width),localRow=globalRow-zone.stripStart;
        const raw=(p-1)%model.width,snake=globalRow%2===0?raw:model.width-1-raw;
        const baseX=x0+14+snake/(model.width-1)*(zoneW-28);
        const baseY=y0+(localRow+.5)*(plotH/rows);
        return{p,x:baseX,y:baseY};
      });
      if(points.length>1)parts.push(`<polyline points="${points.map(q=>`${q.x.toFixed(2)},${q.y.toFixed(2)}`).join(' ')}" class="pa-snake" style="stroke:${colors[zi]}"/>`);
      points.forEach(q=>parts.push(`<circle cx="${q.x.toFixed(2)}" cy="${q.y.toFixed(2)}" r="${q.p===selectedPrime?5.2:2.2}" class="${q.p===selectedPrime?'pa-prime pa-prime-selected':'pa-prime'}" style="fill:${q.p===selectedPrime?'#ffd05a':colors[zi]}"><title>${q.p}</title></circle>`));
      parts.push('</g>');
    });
    parts.push('</svg>');
    return parts.join('');
  }

  function mount(doc){
    const root=doc.querySelector('[data-prime-address-countershot]');
    if(!root)return null;
    const indexInput=root.querySelector('#primeAddressIndex');
    const modeInput=root.querySelector('#primeCarrierMode');
    const limitInput=root.querySelector('#primeStripLimit');
    const spiralModeInput=root.querySelector('#primeSpiralAngleMode');
    const spiralModulusInput=root.querySelector('#primeSpiralModulus');
    const cutShellInput=root.querySelector('#primeCutShell');
    const cutCenterInput=root.querySelector('#primeCutCenter');
    const cutWidthInput=root.querySelector('#primeCutWidth');
    const cutMirrorInput=root.querySelector('#primeCutMirror');
    const axisTiltInput=root.querySelector('#primeAxisTilt');
    const axisPlayButton=root.querySelector('#primeAxisPlay');
    const axisResetButton=root.querySelector('#primeAxisReset');
    const phasePlayButton=root.querySelector('#primePhasePlay');
    const phaseStepButton=root.querySelector('#primePhaseStep');
    const phaseResetButton=root.querySelector('#primePhaseReset');
    const integrationButtons=Array.from(root.querySelectorAll('[data-prime-integration-value]'));
    let integrationValue=137;
    let axisRunning=false,axisFrame=0,axisLast=null;
    let phaseRunning=false,phaseFrame=0,phaseLast=null,phaseProgress=0,previousPhaseAtlas=null;
    const phaseEvents=[];
    const reducedMotion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
    const outputs={
      index:root.querySelector('#primeIndexOut'),
      controlIndex:root.querySelector('#primeIndexControlOut'),
      prime:root.querySelector('#primeValueOut'),
      address:root.querySelector('#primeAddressOut'),
      reverse:root.querySelector('#primeReverseOut'),
      superprime:root.querySelector('#primeSuperprimeOut'),
      nested:root.querySelector('#primeNestedOut'),
      equation:root.querySelector('#primeEquationOut'),
      domain:root.querySelector('#primeCarrierDomainOut'),
      formula:root.querySelector('#primeCarrierFormulaOut'),
      dyadicEquation:root.querySelector('#primeDyadicEquation'),
      dyadicCumulative:root.querySelector('#primeDyadicCumulative'),
      dyadicSvg:root.querySelector('#primeDyadicSvg'),
      twinSeamEquation:root.querySelector('#primeTwinSeamEquation'),
      twinSeamMirror:root.querySelector('#primeTwinSeamMirror'),
      twinSeamBridge:root.querySelector('#primeTwinSeamBridge'),
      twinSeamSvg:root.querySelector('#primeTwinSeamSvg'),
      spiralEntropy:root.querySelector('#primeSpiralEntropy'),
      spiralResultant:root.querySelector('#primeSpiralResultant'),
      spiralGapCv:root.querySelector('#primeSpiralGapCv'),
      spiralNearest:root.querySelector('#primeSpiralNearest'),
      spiralSvg:root.querySelector('#primeSpiralSvg'),
      spiralMapEquation:root.querySelector('#primeSpiralMapEquation'),
      spiralAngleEquation:root.querySelector('#primeSpiralAngleEquation'),
      spiralGeometryClass:root.querySelector('#primeSpiralGeometryClass'),
      spiralRingEquation:root.querySelector('#primeSpiralRingEquation'),
      cutCenter:root.querySelector('#primeCutCenterOut'),
      cutWidth:root.querySelector('#primeCutWidthOut'),
      cutInside:root.querySelector('#primeCutInside'),
      cutOutside:root.querySelector('#primeCutOutside'),
      cutCrossings:root.querySelector('#primeCutCrossings'),
      cutDrift:root.querySelector('#primeCutDrift'),
      cutMembership:root.querySelector('#primeCutMembership'),
      cutFrameEquation:root.querySelector('#primeCutFrameEquation'),
      cutSamples:root.querySelector('#primeCutSamples'),
      cutSvg:root.querySelector('#primeCutSvg'),
      axisTilt:root.querySelector('#primeAxisTiltOut'),
      axisStatus:root.querySelector('#primeAxisStatus'),
      phaseWheel:root.querySelector('#primePhaseWheelSvg'),
      phaseState:root.querySelector('#primePhaseState'),
      phaseSequence:root.querySelector('#primePhaseSequence'),
      phaseEvents:root.querySelector('#primePhaseEvents'),
      integrationValue:root.querySelector('#primeIntegrationValue'),
      integrationPrime:root.querySelector('#primeIntegrationPrime'),
      integrationQrt:root.querySelector('#primeIntegrationQrt'),
      integrationCrt:root.querySelector('#primeIntegrationCrt'),
      integrationAntipode:root.querySelector('#primeIntegrationAntipode'),
      integrationEuler:root.querySelector('#primeIntegrationEuler'),
      integrationIlauI:root.querySelector('#primeIntegrationIlauI'),
      integrationIlauL:root.querySelector('#primeIntegrationIlauL'),
      integrationIlauA:root.querySelector('#primeIntegrationIlauA'),
      integrationIlauU:root.querySelector('#primeIntegrationIlauU'),
      integrationExact:root.querySelector('#primeIntegrationExact'),
      summary:root.querySelector('#primeStripSummary'),
      residues:root.querySelector('#primeResidueSummary'),
      svg:root.querySelector('#primeStripSvg')
    };
    function syncIndexMaximum(){
      const mode=modeInput.value,target=Number(limitInput.value);
      const max=mode==='count'?target:primesUpTo(target).length;
      indexInput.max=String(max);
      if(Number(indexInput.value)>max)indexInput.value=String(max);
      return max;
    }
    function axisLabel(value){return value.toFixed(1).replace('.0','')+'°';}
    function syncAxisOutputs(){
      const transfer=quarterTurnAxis(Number(axisTiltInput.value));
      outputs.axisTilt.textContent=axisLabel(transfer.angleDegrees);
      outputs.axisStatus.textContent=`α ${axisLabel(transfer.angleDegrees)} · β ${axisLabel(transfer.apertureCenterDegrees)} · |Rα(0,1)|=${transfer.norm.toFixed(3)} · ${transfer.angleDegrees===0?'vertical carrier':transfer.angleDegrees===90?'horizontal aperture':'axis transfer'}`;
      return transfer;
    }
    function stopAxis(){
      axisRunning=false;
      if(typeof cancelAnimationFrame==='function')cancelAnimationFrame(axisFrame);
      axisLast=null;
      axisPlayButton.textContent='Drehung abspielen';
      syncAxisOutputs();
    }
    function stopPhase(){
      phaseRunning=false;
      if(typeof cancelAnimationFrame==='function')cancelAnimationFrame(phaseFrame);
      phaseLast=null;
      phasePlayButton.textContent='Loop abspielen';
    }
    function applyAxisTransfer(angle){
      const bounded=Math.max(0,Math.min(90,angle));
      phaseProgress=bounded/180;
      axisTiltInput.value=String(bounded);
      const transfer=syncAxisOutputs();
      cutCenterInput.value=String(transfer.apertureCenterDegrees);
      render();
    }
    function axisTick(time){
      if(!axisRunning)return;
      let angle=Number(axisTiltInput.value);
      if(axisLast!==null)angle=Math.min(90,angle+(time-axisLast)*.012);
      axisLast=time;
      applyAxisTransfer(angle);
      if(angle>=90){stopAxis();return;}
      axisFrame=requestAnimationFrame(axisTick);
    }
    function applyPhaseProgress(progress,trackEvents=true){
      if(trackEvents){
        const previousState=phaseCycle(phaseProgress);
        const previousSpiral=primeSpiralModel(spiralModeInput.value,Number(spiralModulusInput.value));
        const previousFrame=polarCutFrame(cutShellInput.value,previousState.apertureCenterDegrees,Number(cutWidthInput.value));
        previousPhaseAtlas=polarCutAtlasModel(previousSpiral,previousFrame,cutMirrorInput.checked,24);
      }
      phaseProgress=((progress%1)+1)%1;
      const state=phaseCycle(phaseProgress);
      axisTiltInput.value=String(state.angleDegrees);
      cutCenterInput.value=String(state.apertureCenterDegrees);
      syncAxisOutputs();
      render(trackEvents);
      return state;
    }
    function phaseTick(time){
      if(!phaseRunning)return;
      const nextProgress=phaseLast===null?phaseProgress:(phaseProgress+(time-phaseLast)*.00008)%1;
      phaseLast=time;
      applyPhaseProgress(nextProgress,true);
      phaseFrame=requestAnimationFrame(phaseTick);
    }
    function render(trackPhaseEvents=false){
      const index=Number(indexInput.value),mode=modeInput.value,target=Number(limitInput.value);
      const r=record(index),model=carrierModel(mode,target,25);
      outputs.index.textContent=String(r.index);
      outputs.controlIndex.textContent=String(r.index);
      outputs.prime.textContent=String(r.prime);
      outputs.address.textContent=String(r.address);
      outputs.reverse.textContent=`π(${r.prime}) = ${r.reverseIndex}`;
      outputs.superprime.textContent=r.superprime?'YES · index is prime':'NO · index is composite or 1';
      outputs.superprime.dataset.state=r.superprime?'yes':'no';
      outputs.nested.textContent=`pₚₚ = p${r.prime} = ${r.nestedPrime}`;
      outputs.equation.textContent=`${r.index} ↔ p${r.index}=${r.prime} ↔ address ${r.prime}−1=${r.address}`;
      outputs.domain.textContent=mode==='count'
        ?`k ≤ ${target} → p${target}=${model.limit} → carrier 2…${model.limit}`
        :`n ≤ ${target} → π(${target})=${model.primeCount}`;
      outputs.formula.textContent=mode==='count'
        ?`p${target} = min{x ≥ 2 : π(x) = ${target}} = ${model.limit}`
        :`π(${target}) = Σₙ₌₂^${target} χℙ(n) = ${model.primeCount}`;
      const dyadic=dyadicPrimeShells(model.limit,5);
      outputs.dyadicEquation.textContent=`${dyadic.shells.join(' + ')} = ${dyadic.total} = π(${dyadic.base})`;
      outputs.dyadicCumulative.textContent=`limits [${dyadic.thresholds.join(', ')}] · cumulative π [${dyadic.cumulative.join(', ')}]`;
      outputs.dyadicSvg.innerHTML=dyadicSvgFor(dyadic);
      const twin=twinSeamMirrorModel();
      outputs.twinSeamEquation.textContent=`${twin.left} < ${twin.seam} < ${twin.right} · gap ${twin.gap} · ${twin.seam} = ${twin.seamFactors.join(' × ')}`;
      outputs.twinSeamMirror.textContent=`rev₁₀(${twin.left})=${twin.leftMirror} ∈ ℙ · rev₁₀(${twin.right})=${twin.rightMirror} ∈ ℙ`;
      outputs.twinSeamBridge.textContent=`${twin.shellBase} + ${twin.shellTotal} = ${twin.shellBridge} = ${twin.bridgeMultiplier} × p${twin.bridgePrimeIndex}`;
      outputs.twinSeamSvg.innerHTML=twinSeamSvgFor(twin);
      const spiral=primeSpiralModel(spiralModeInput.value,Number(spiralModulusInput.value));
      spiralModulusInput.disabled=spiral.mode!=='residue';
      outputs.spiralEntropy.textContent=spiral.entropy.toFixed(4);
      outputs.spiralResultant.textContent=spiral.resultant.toFixed(4);
      outputs.spiralGapCv.textContent=spiral.gapCv.toFixed(4);
      outputs.spiralNearest.textContent=spiral.meanNearestDistance.toFixed(4);
      outputs.spiralSvg.innerHTML=primeSpiralSvgFor(spiral,r.prime);
      const spiralGeometry=primeSpiralGeometryLens(spiral);
      outputs.spiralMapEquation.textContent=spiralGeometry.mapEquation;
      outputs.spiralAngleEquation.textContent=spiralGeometry.angleEquation;
      outputs.spiralGeometryClass.textContent=spiralGeometry.classification;
      outputs.spiralRingEquation.textContent=`r=½ ↔ p=${spiralGeometry.innerRing.primeThreshold} · r=1 ↔ N=${spiralGeometry.outerRing.normalizationCeiling}`;
      const cutFrame=polarCutFrame(cutShellInput.value,Number(cutCenterInput.value),Number(cutWidthInput.value));
      const cutAtlas=polarCutAtlasModel(spiral,cutFrame,cutMirrorInput.checked,24);
      const phaseState=phaseCycle(phaseProgress);
      const transition=previousPhaseAtlas?polarCutTransition(previousPhaseAtlas,cutAtlas):null;
      if(trackPhaseEvents&&transition&&(transition.entered.length||transition.exited.length)){
        phaseEvents.unshift(`${phaseState.phase.key} · β ${phaseState.apertureCenterDegrees.toFixed(1)}° · +[${transition.entered.join(', ')||'∅'}] −[${transition.exited.join(', ')||'∅'}]`);
        if(phaseEvents.length>6)phaseEvents.length=6;
      }
      if(trackPhaseEvents||!previousPhaseAtlas)previousPhaseAtlas=cutAtlas;
      const selected=cutAtlas.points.find(point=>point.prime===r.prime);
      outputs.cutCenter.textContent=cutFrame.centerDegrees.toFixed(0)+'°';
      outputs.cutWidth.textContent=cutFrame.widthDegrees.toFixed(0)+'°';
      outputs.cutInside.textContent=String(cutAtlas.insidePoints.length);
      outputs.cutOutside.textContent=String(cutAtlas.outsidePoints.length);
      outputs.cutCrossings.textContent=String(cutAtlas.crossingEdges.length);
      outputs.cutDrift.textContent=cutAtlas.centroid.drift.toFixed(5);
      outputs.cutMembership.textContent=selected?`${selected.shellMask} · ${selected.inside?'IN':'OUT'}`:'— · outside fixed base';
      outputs.cutFrameEquation.textContent=`W${cutFrame.index+1}={z:${cutFrame.inner.toFixed(2)}≤|z|<${Math.min(1,cutFrame.outer).toFixed(2)} ∧ |wrap(arg z−${cutFrame.centerDegrees.toFixed(0)}°)|≤${(cutFrame.widthDegrees/2).toFixed(0)}°} · M${cutAtlas.mirror?' ∪ μβ(M)':' only'}`;
      const insideSample=cutAtlas.insidePoints.slice(0,10).map(point=>point.prime).join(', ')||'∅';
      const outsideSample=cutAtlas.outsidePoints.slice(0,10).map(point=>point.prime).join(', ')||'∅';
      outputs.cutSamples.textContent=`IN sample [${insideSample}] · OUT sample [${outsideSample}] · selected ${r.prime}${selected?' mask '+selected.shellMask:' not in p≤1000 carrier'}`;
      outputs.cutSvg.innerHTML=polarCutAtlasSvgFor(cutAtlas,r.prime);
      outputs.phaseWheel.innerHTML=phaseWheelSvgFor(phaseState,trackPhaseEvents?transition:null);
      outputs.phaseState.textContent=`${phaseState.phase.key} · ${phaseState.phase.role} · ${phaseState.direction} · α ${phaseState.angleDegrees.toFixed(1)}° / β ${phaseState.apertureCenterDegrees.toFixed(1)}°`;
      outputs.phaseSequence.textContent=`AM → VM → PM → TM → AM · θ ${phaseState.cycleDegrees.toFixed(1)}° · ω₂=−ω₁`;
      outputs.phaseEvents.textContent=phaseEvents.length?phaseEvents.join('  |  '):'Noch kein Frame-Wechsel · Loop oder Schritt starten.';
      const integration=primeAddressIntegrationModel(integrationValue);
      outputs.integrationValue.textContent=String(integration.value);
      outputs.integrationPrime.textContent=integration.prime?`PRIME · π(${integration.value})=${integration.primeIndex}`:`COMPOSITE · ${integration.factors.join(' × ')}`;
      outputs.integrationQrt.textContent=`${integration.value}=20·${integration.qrt.q20}+${integration.qrt.r20} · QRT (${integration.qrt.q20},${integration.qrt.r20})`;
      outputs.integrationCrt.textContent=`A₁₀₅(${integration.value})=(${integration.crt.mod3},${integration.crt.mod5},${integration.crt.mod7})`;
      outputs.integrationAntipode.textContent=integration.antipode?`${integration.antipode.operator}=${integration.antipode.value} · ${integration.antipode.domain}`:'kein deklarierter Antipodenoperator für diesen Carrier';
      outputs.integrationEuler.textContent=integration.euler.directValue
        ?`DIRECT · ${integration.euler.directValue.equation}`
        :integration.euler.historicalConstant
          ?`HISTORICAL OFFSET · c=${integration.value} · nach Zentrierung keine eigene Kurvenform`
          :'kein historischer Euler-c-Marker in der registrierten Lane';
      outputs.integrationIlauI.textContent=integration.ilau.retained;
      outputs.integrationIlauL.textContent=integration.ilau.lost;
      outputs.integrationIlauA.textContent=integration.ilau.added;
      outputs.integrationIlauU.textContent=integration.ilau.unresolved;
      outputs.integrationExact.textContent=`EXACT BRIDGE · ${integration.crown.values.join(' + ')} = ${integration.crown.sum} = ${integration.crown.factors.join(' × ')} · Verbindung zu 137, aber kein Euler-Generator`;
      integrationButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.primeIntegrationValue)===integrationValue)));
      outputs.summary.textContent=`${model.primeCount} primes · carrier 1–${model.limit} · ${model.strips} strips · width 25 · flips 90° / 90° / 270°`;
      outputs.residues.textContent=model.zones.map(z=>`Z${z.id} mod 11 [${z.residueCounts.join(',')}]`).join(' · ');
      outputs.svg.innerHTML=svgFor(model,r.prime);
    }
    indexInput.addEventListener('input',render);
    modeInput.addEventListener('change',()=>{syncIndexMaximum();render();});
    limitInput.addEventListener('change',()=>{syncIndexMaximum();render();});
    spiralModeInput.addEventListener('change',render);
    spiralModulusInput.addEventListener('change',render);
    cutShellInput.addEventListener('change',render);
    cutCenterInput.addEventListener('input',()=>{
      stopAxis();
      stopPhase();
      const beta=Number(cutCenterInput.value);
      if(beta>=0&&beta<=90){axisTiltInput.value=String(90-beta);phaseProgress=(90-beta)/180;syncAxisOutputs();}
      else outputs.axisStatus.textContent=`manual β ${axisLabel(beta)} · outside source quarter-turn`;
      render();
    });
    cutWidthInput.addEventListener('input',render);
    cutMirrorInput.addEventListener('change',render);
    axisTiltInput.addEventListener('input',()=>{stopAxis();stopPhase();applyAxisTransfer(Number(axisTiltInput.value));});
    axisPlayButton.addEventListener('click',()=>{
      if(axisRunning){stopAxis();return;}
      stopPhase();
      if(Number(axisTiltInput.value)>=90)applyAxisTransfer(0);
      if(reducedMotion&&reducedMotion.matches){applyAxisTransfer(90);return;}
      axisRunning=true;axisLast=null;axisPlayButton.textContent='Pause';axisFrame=requestAnimationFrame(axisTick);
    });
    axisResetButton.addEventListener('click',()=>{stopAxis();stopPhase();applyAxisTransfer(0);});
    phasePlayButton.addEventListener('click',()=>{
      if(phaseRunning){stopPhase();return;}
      stopAxis();
      if(reducedMotion&&reducedMotion.matches){applyPhaseProgress(phaseProgress+.25,true);return;}
      phaseRunning=true;phaseLast=null;phasePlayButton.textContent='Loop pausieren';phaseFrame=requestAnimationFrame(phaseTick);
    });
    phaseStepButton.addEventListener('click',()=>{stopAxis();stopPhase();applyPhaseProgress((Math.floor(phaseProgress*4+1e-9)+1)%4/4,true);});
    phaseResetButton.addEventListener('click',()=>{stopAxis();stopPhase();phaseEvents.length=0;previousPhaseAtlas=null;applyPhaseProgress(0,false);});
    integrationButtons.forEach(button=>button.addEventListener('click',()=>{integrationValue=Number(button.dataset.primeIntegrationValue);render();}));
    if(doc.addEventListener)doc.addEventListener('visibilitychange',()=>{if(doc.hidden){stopAxis();stopPhase();}});
    if(reducedMotion&&reducedMotion.addEventListener)reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){stopAxis();stopPhase();}});
    syncIndexMaximum();
    applyPhaseProgress(0,false);
    return{render};
  }

  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(document),{once:true});
    else mount(document);
  }

  return Object.freeze({isPrime,primesUpTo,nthPrime,record,stripModel,carrierModel,dyadicPrimeShells,dyadicSvgFor,reverseDigits,primeFactors,twinSeamMirrorModel,twinSeamSvgFor,EULER_HISTORICAL_CONSTANTS,primeAddressIntegrationModel,deterministicUnit,primeSpiralModel,primeSpiralGeometryLens,POLAR_CUT_SHELLS,PHASE_CYCLE,wrapSignedAngle,quarterTurnAxis,phaseCycle,polarCutTransition,phaseWheelSvgFor,polarCutFrame,shellMask,pointInPolarFrame,polarCutAtlasModel,polarCutAtlasSvgFor,primeSpiralSvgFor,svgFor,mount});
});
