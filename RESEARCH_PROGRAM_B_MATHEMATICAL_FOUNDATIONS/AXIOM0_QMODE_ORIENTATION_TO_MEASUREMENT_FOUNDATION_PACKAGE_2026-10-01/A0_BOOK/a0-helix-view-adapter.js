(function(root,factory){
  const api=factory(root&&root.A0PrimecubeModel);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0HelixViewAdapter=api;
})(typeof window!=='undefined'?window:globalThis,function(primecube){
  'use strict';

  const VERSION='1.6.0';
  const LIMIT=1111;
  const TAU=Math.PI*2;
  const PHI=(1+Math.sqrt(5))/2;
  const EULER_STEP=TAU/10;
  const GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5));
  const FIBONACCI_INDICES=Object.freeze([1,2,3,5,8,13,21,34]);
  const STRAND_MODES=Object.freeze(['single','double']);
  const REGISTER_MODES=Object.freeze(['pair','fh14','triad21','z37frame']);
  const ZETA_ZERO_ORDINATES=Object.freeze([
    14.134725141734693,21.022039638771555,25.01085758014569,30.424876125859513,
    32.93506158773919,37.58617815882567,40.9187190121475,43.327073280914999,
    48.00515088116716,49.7738324776723,52.97032147771446,56.44624769706339,
    59.34704400260235,60.83177852460981,65.11254404808161,67.07981052949417,
    69.54640171117398,72.06715767448191,75.70469069908393,77.1448400688748
  ]);
  const ZETA_LENS_MODES=Object.freeze(['smooth','trace','seam']);
  const TRACE_WORDS=Object.freeze(['RLLR','LRRL']);
  const RESIDUE_ANGLE_MODES=Object.freeze(['mod7','mod11','paired']);

  function isPrime(n){
    if(primecube&&typeof primecube.isPrime==='function')return primecube.isPrime(n);
    if(!Number.isInteger(n)||n<2)return false;
    if(n%2===0)return n===2;
    for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;
    return true;
  }

  function twinRungs(limit=LIMIT){
    const pairs=[];
    for(let p=3;p+2<=limit;p+=2)if(isPrime(p)&&isPrime(p+2))pairs.push(Object.freeze({
      index:pairs.length+1,a:p,b:p+2,kind:'TWIN_PRIME',sourceIds:Object.freeze([
        `PC1111:N${String(p).padStart(4,'0')}`,
        `PC1111:N${String(p+2).padStart(4,'0')}`
      ])
    }));
    return Object.freeze(pairs);
  }

  function primeResidueRecords(limit=1000){
    const records=[];
    for(let prime=2;prime<=limit;prime++)if(isPrime(prime))records.push(Object.freeze({
      index:records.length+1,prime,a:prime,b:prime,kind:'PRIME_RESIDUE_HELIX_RECORD',
      residue7:prime%7,residue11:prime%11,
      sourceIds:Object.freeze([`PC1111:N${String(prime).padStart(4,'0')}`])
    }));
    return Object.freeze(records);
  }

  function sliceFourierBasis(size){
    return Array.from({length:Math.floor(size/2)},(_,index)=>{
      const bin=index+1;
      const angles=Array.from({length:size},(_,offset)=>TAU*bin*offset/size);
      return {bin,cosines:angles.map(Math.cos),sines:angles.map(Math.sin),scale:(2*bin===size?1:2)/size};
    });
  }

  function sliceSpectrum(samples,basis=sliceFourierBasis(samples.length)){
    const mean=samples.reduce((sum,value)=>sum+value,0)/samples.length;
    // Subtracting any constant changes only bin zero. Use a baseline that keeps the 0/1 inputs sparse.
    const baseline=samples.includes(0)?0:samples[0];
    const weights=samples.flatMap((value,offset)=>value===baseline?[]:[{offset,value:value-baseline}]);
    const bins=basis.map(({bin,cosines,sines,scale})=>{
      let real=0,imag=0;
      for(const {offset,value} of weights){
        real+=value*cosines[offset];
        imag-=value*sines[offset];
      }
      return {bin,amplitude:scale*Math.hypot(real,imag)};
    });
    return {mean,bins};
  }

  function mod7FourierComparison(){
    const size=168,windowCount=4,seed=20261126,trials=999;
    const primes=primecube?.sieve?.(6000)??primeResidueRecords(6000).map(record=>record.prime);
    const basis=sliceFourierBasis(size);
    const definitions=[{hit:'green',residue:2,reference:64},{hit:'pink',residue:6,reference:71}];
    // Fixed seed so re-opening the same comparison gives the same controls.
    let state=seed;
    const random=()=>{
      state^=state<<13;
      state^=state>>>17;
      state^=state<<5;
      return (state>>>0)/4294967296;
    };
    const percentile95=values=>values.sort((a,b)=>a-b)[Math.ceil(.95*values.length)-1];
    const getBins=(labels,residue)=>sliceSpectrum(labels.map(label=>Number(label===residue)),basis).bins;
    return Array.from({length:windowCount},(_,index)=>{
      const start=index*size;
      const window=primes.slice(start,start+size);
      const labels=window.map(prime=>prime%7);
      const tracks=definitions.map(track=>{
        const bins=getBins(labels,track.residue);
        const peak=bins.reduce((best,bin)=>bin.amplitude>best.amplitude?bin:best);
        return {...track,bins,peak,hits:labels.filter(label=>label===track.residue).length,
          mixedBins:bins.map(()=>[]),mixedMaxima:[]};
      });
      for(let trial=0;trial<trials;trial++){
        const mixed=labels.slice();
        for(let i=mixed.length-1;i>0;i--){
          const j=Math.floor(random()*(i+1));
          [mixed[i],mixed[j]]=[mixed[j],mixed[i]];
        }
        for(const track of tracks){
          const bins=getBins(mixed,track.residue);
          bins.forEach(({amplitude},index)=>track.mixedBins[index].push(amplitude));
          track.mixedMaxima.push(Math.max(...bins.map(bin=>bin.amplitude)));
        }
      }
      return {start:start+1,end:start+size,first:window[0],last:window.at(-1),trials,seed,
        tracks:tracks.map(({mixedBins,mixedMaxima,...track})=>({
          ...track,mixed95:mixedBins.map(percentile95),max95:percentile95(mixedMaxima)
        }))};
    });
  }

  function primeTailRecords(lower=1000,upper=LIMIT){
    const records=[];
    for(let prime=lower+1;prime<=upper;prime++)if(isPrime(prime))records.push(prime);
    return Object.freeze(records);
  }

  function residueAngleMode(value='paired'){
    if(!RESIDUE_ANGLE_MODES.includes(value))throw new RangeError('residue angle mode must be mod7, mod11 or paired');
    return value;
  }

  function buildPrimeResidueGeometry(records,options={}){
    const angleMode=residueAngleMode(options.residueAngle||'paired');
    const innerRadius=Number.isFinite(options.innerRadius)?options.innerRadius:0.72;
    const height=Number.isFinite(options.height)?options.height:3.05;
    const center=(records.length-1)/2;
    const rungs=records.map((record,i)=>{
      const angle7=TAU*record.residue7/7,angle11=TAU*record.residue11/11;
      const y=records.length===1?0:(i-center)*height/(records.length-1);
      const point7=Object.freeze({x:Math.cos(angle7)*innerRadius,y,z:Math.sin(angle7)*innerRadius});
      const point11=Object.freeze({x:Math.cos(angle11)*innerRadius,y,z:Math.sin(angle11)*innerRadius});
      const strandA=angleMode==='mod11'?point11:point7;
      const strandB=angleMode==='paired'?point11:strandA;
      const midpoint=Object.freeze({x:(strandA.x+strandB.x)/2,y,z:(strandA.z+strandB.z)/2});
      return Object.freeze({...record,angle7,angle11,angleMode,angleDegrees7:degrees(angle7),angleDegrees11:degrees(angle11),point7,point11,codon:false,fibonacci:false,kink:false,strandA,strandB,midpoint,rail:strandA,railA:strandA,railB:strandB,axisIntersection:null});
    });
    const stack51=Object.freeze(rungs.filter(rung=>rung.residue7===5&&rung.residue11===1));
    return Object.freeze({kind:'prime-residue-helix',angleMode,strandMode:angleMode==='paired'?'double':'single',step:null,stepDegrees:null,innerRadius,railRadius:null,railRatio:null,height,measures:null,rungs:Object.freeze(rungs),stack51,tail:primeTailRecords()});
  }

  function z37Orbits(){
    const seen=new Set(),orbits=[];
    for(let r=0;r<37;r++){
      if(seen.has(r))continue;
      const inverse=(37-r)%37;
      seen.add(r);seen.add(inverse);
      orbits.push(Object.freeze({index:orbits.length+1,a:r,b:inverse,kind:'Z37_INVOLUTION',fixed:r===inverse}));
    }
    return Object.freeze(orbits);
  }

  function zetaZeroRecords(){
    return Object.freeze(ZETA_ZERO_ORDINATES.map((gamma,index)=>Object.freeze({
      index:index+1,a:`1/2+${gamma.toFixed(12)}i`,b:`1/2-${gamma.toFixed(12)}i`,
      beta:0.5,gamma,kind:'ZETA_ZERO_CONJUGATE_PAIR',finiteSample:true,
      sourceIds:Object.freeze([`ZETA:ZERO:${String(index+1).padStart(4,'0')}:+`,`ZETA:ZERO:${String(index+1).padStart(4,'0')}:-`])
    })));
  }

  function explicitFormulaPair(record,logX,betaOverride=record.beta){
    if(!record||!Number.isFinite(record.gamma))throw new TypeError('record must contain a finite gamma ordinate');
    if(!Number.isFinite(logX))throw new TypeError('logX must be finite');
    if(!Number.isFinite(betaOverride))throw new TypeError('beta must be finite');
    const theta=record.gamma*logX;
    const normalizedAmplitude=Math.exp((betaOverride-0.5)*logX);
    const squareRootEnvelope=Math.exp(0.5*logX);
    const denominator=betaOverride*betaOverride+record.gamma*record.gamma;
    const normalizedContribution=-2*normalizedAmplitude*(betaOverride*Math.cos(theta)+record.gamma*Math.sin(theta))/denominator;
    return Object.freeze({
      beta:betaOverride,sourceBeta:record.beta,gamma:record.gamma,logX,x:Math.exp(logX),theta,
      thetaDegrees:degrees(theta%TAU),normalizedAmplitude,squareRootEnvelope,
      rawAmplitude:normalizedAmplitude*squareRootEnvelope,normalizedContribution,
      rawContribution:normalizedContribution*squareRootEnvelope,
      formula:'-(x^rho/rho + x^conj(rho)/conj(rho))'
    });
  }

  function comparePrimeRepeat(record,p,r){
    if(!isPrime(p)||!Number.isInteger(r)||r<1)throw new RangeError('Expected a prime and a positive integer repetition');
    const logPrime=Math.log(p);
    const pair=explicitFormulaPair(record,r*logPrime);
    const helixShift=Math.atan2(pair.gamma,pair.beta);
    const primeWeight=logPrime/(Math.PI*p**(r/2));
    const withoutMinus=primeWeight*Math.cos(pair.theta);
    return {
      x:p**r,phase:pair.theta,helixShift,helixPhase:pair.theta-helixShift,
      helixWeight:2*pair.normalizedAmplitude/Math.hypot(pair.beta,pair.gamma),
      helixTerm:pair.normalizedContribution,primeWeight,primeTerm:-withoutMinus,withoutMinus
    };
  }

  function iharaTriangleTerm(phase,r,returnRoute){
    if(returnRoute==='same')return null;
    const length=3;
    const weight=length*.5**(r*length);
    return {phase,weight,realTerm:weight*Math.cos(phase)};
  }

  function zetaLensMode(value='smooth'){
    if(!ZETA_LENS_MODES.includes(value))throw new RangeError('zeta lens mode must be smooth, trace or seam');
    return value;
  }

  function traceWordData(word='RLLR'){
    if(!TRACE_WORDS.includes(word))throw new RangeError('trace word must be RLLR or LRRL');
    const symbols=Object.freeze([...word]),signs=Object.freeze(symbols.map(symbol=>symbol==='R'?1:-1));
    const kinkPositions=Object.freeze(symbols.map((symbol,index)=>index>0&&symbol!==symbols[index-1]?index:null).filter(index=>index!==null));
    const complement=symbols.map(symbol=>symbol==='R'?'L':'R').join('');
    return Object.freeze({word,symbols,signs,kinkPositions,kinkCount:kinkPositions.length,balance:signs.reduce((sum,value)=>sum+value,0),complement,palindrome:word===[...word].reverse().join(''),operatorStatus:'TRACE_WORD_NOT_DIRICHLET_CHARACTER'});
  }

  function phaseSeamData(){
    const shadow=-1/12,visible=11/12;
    return Object.freeze({shadow,visible,liftDelta:visible-shadow,shadowRadians:TAU*shadow,visibleRadians:TAU*visible,equivalentModuloOne:Math.abs((((shadow%1)+1)%1)-visible)<1e-12,role:'VIEW_CUT_WITH_RETAINED_LIFT_WITNESS'});
  }

  function buildZetaGeometry(records,options={}){
    const viewMode=strandMode(options.strandMode||'double');
    const lensMode=zetaLensMode(options.zetaLens||'smooth'),trace=traceWordData(options.traceWord||'RLLR'),seam=phaseSeamData();
    const logX=Number.isFinite(options.logX)?options.logX:Math.log(1000);
    const betaOffset=Number.isFinite(options.betaOffset)?options.betaOffset:0;
    const innerRadius=Number.isFinite(options.innerRadius)?options.innerRadius:0.56;
    const height=Number.isFinite(options.height)?options.height:2.35;
    const center=(records.length-1)/2;
    const rungs=records.map((record,i)=>{
      const wave=explicitFormulaPair(record,logX,record.beta+betaOffset);
      const traceSlot=i%trace.symbols.length,traceSymbol=trace.symbols[traceSlot],traceSign=trace.signs[traceSlot];
      const angle=lensMode==='trace'?traceSign*wave.theta:lensMode==='seam'?wave.theta+seam.shadowRadians:wave.theta;
      const companionAngle=lensMode==='trace'?-traceSign*wave.theta:lensMode==='seam'?wave.theta+seam.visibleRadians:-wave.theta;
      const y=records.length===1?0:(i-center)*height/(records.length-1);
      const radius=innerRadius*wave.normalizedAmplitude;
      const strandA=Object.freeze({x:Math.cos(angle)*radius,y,z:Math.sin(angle)*radius});
      const strandB=Object.freeze({x:Math.cos(companionAngle)*radius,y,z:Math.sin(companionAngle)*radius});
      const midpoint=Object.freeze({x:(strandA.x+strandB.x)/2,y,z:0});
      const previousSymbol=i?trace.symbols[(i-1)%trace.symbols.length]:traceSymbol;
      return Object.freeze({...record,...wave,lensMode,traceWord:trace.word,traceSlot:traceSlot+1,traceSymbol,traceSign,kink:lensMode==='trace'&&i>0&&traceSymbol!==previousSymbol,angle,companionAngle,angleDegrees:degrees(angle%TAU),codon:false,codonIndex:null,codonSlot:null,fibonacci:false,strandA,strandB,midpoint,rail:strandA,railA:strandA,railB:strandB,axisIntersection:null,conjugateMirror:lensMode!=='seam',phaseLift:lensMode==='seam'?seam:null});
    });
    return Object.freeze({kind:'zeta-explicit-formula',lensMode,trace,seam,strandMode:viewMode,logX,betaOffset,step:null,stepDegrees:null,innerRadius,railRadius:null,railRatio:null,height,measures:null,rungs:Object.freeze(rungs)});
  }

  function clamp01(value){return Math.max(0,Math.min(1,Number(value)||0))}
  function phaseStep(mix=0){return EULER_STEP+(GOLDEN_ANGLE-EULER_STEP)*clamp01(mix)}
  function degrees(radians){return radians*180/Math.PI}

  function strandMode(value='double'){
    if(!STRAND_MODES.includes(value))throw new RangeError('strand mode must be single or double');
    return value;
  }

  function registerMode(value='pair'){
    if(!REGISTER_MODES.includes(value))throw new RangeError('register mode must be pair, fh14, triad21 or z37frame');
    return value;
  }

  function helixMeasures(count,options={}){
    if(!Number.isInteger(count)||count<1)throw new RangeError('count must be a positive integer');
    const step=Number.isFinite(options.step)?options.step:phaseStep(options.mix);
    const radius=Number.isFinite(options.radius)?options.radius:0.56;
    const height=Number.isFinite(options.height)?options.height:2.35;
    if(!(step>0)||!(radius>0)||height<0)throw new RangeError('step and radius must be positive; height must be non-negative');
    const intervals=Math.max(0,count-1),verticalStep=intervals?height/intervals:0;
    const pitchPerRadian=verticalStep/step,pitchPerTurn=TAU*pitchPerRadian;
    const denominator=radius*radius+pitchPerRadian*pitchPerRadian;
    return Object.freeze({
      count,intervals,radius,height,step,stepDegrees:degrees(step),verticalStep,
      spanRadians:intervals*step,spanDegrees:intervals*degrees(step),turns:intervals*step/TAU,
      twistDensity:verticalStep?step/verticalStep:0,pitchPerRadian,pitchPerTurn,
      theta:step,thetaDegrees:degrees(step),iota:pitchPerRadian,dao:denominator,
      curvature:radius/denominator,torsionMagnitude:Math.abs(pitchPerRadian)/denominator,
      torsionConvention:'MAGNITUDE_IN_NORMALIZED_VIEW_UNITS',
      equations:Object.freeze({curve:'gamma(t)=(R cos t, b t + y0, R sin t)',theta:'Theta=Delta theta',iota:'iota=b=Delta z / Delta theta',dao:'DAO=R^2+iota^2',curvature:'kappa=R/DAO',torsionMagnitude:'|tau|=|iota|/DAO'})
    });
  }

  function bundleStrand(count,phase,options={}){
    if(!Number.isInteger(count)||count<1)throw new RangeError('count must be a positive integer');
    const step=Number.isFinite(options.step)?options.step:phaseStep(options.mix);
    const radius=Number.isFinite(options.radius)?options.radius:0.66;
    const height=Number.isFinite(options.height)?options.height:2.35;
    const center=(count-1)/2;
    return Object.freeze(Array.from({length:count},(_,k)=>{
      const angle=k*step+phase,y=count===1?0:(k-center)*height/(count-1);
      return Object.freeze({k,angle,x:radius*Math.cos(angle),y,z:radius*Math.sin(angle)});
    }));
  }

  function fhBundle(count,options={}){
    const strands=[];
    for(let j=0;j<7;j++){
      const phase=TAU*j/7;
      strands.push(Object.freeze({id:`F${j+1}`,family:'F',index:j+1,phase,points:bundleStrand(count,phase,options)}));
      strands.push(Object.freeze({id:`H${j+1}`,family:'H',index:j+1,phase:phase+Math.PI,points:bundleStrand(count,phase+Math.PI,options)}));
    }
    return Object.freeze({mode:'fh14',formula:'7+7',strandCount:14,strands:Object.freeze(strands)});
  }

  function triadBundle(count,options={}){
    const strands=[];
    for(let triad=0;triad<3;triad++)for(let j=0;j<7;j++){
      const phase=TAU*triad/3+TAU*j/7;
      strands.push(Object.freeze({id:`T${triad+1}.${j+1}`,family:`T${triad+1}`,triad:triad+1,index:j+1,phase,points:bundleStrand(count,phase,options)}));
    }
    return Object.freeze({mode:'triad21',formula:'3x7',strandCount:21,strands:Object.freeze(strands)});
  }

  function z37Frame(options={}){
    const radius=Number.isFinite(options.radius)?options.radius:0.72,y=Number.isFinite(options.y)?options.y:0;
    const points=Object.freeze(Array.from({length:37},(_,residue)=>{
      const angle=TAU*residue/37;
      return Object.freeze({residue,angle,x:radius*Math.cos(angle),y,z:radius*Math.sin(angle)});
    }));
    const orbits=z37Orbits();
    const pairs=Object.freeze(orbits.filter(o=>!o.fixed).map(o=>Object.freeze({...o,pointA:points[o.a],pointB:points[o.b]})));
    const seam=Object.freeze([18,19]);
    const seamMidpoint=Object.freeze({x:(points[18].x+points[19].x)/2,y,z:(points[18].z+points[19].z)/2});
    return Object.freeze({mode:'z37frame',formula:'1+18',radius,y,points,orbits,fixedPoint:points[0],pairs,seam,axis:Object.freeze([points[0],seamMidpoint]),seamMidpoint});
  }

  function registerGeometry(mode,count,options={}){
    const normalized=registerMode(mode);
    if(normalized==='fh14')return fhBundle(count,options);
    if(normalized==='triad21')return triadBundle(count,options);
    if(normalized==='z37frame')return z37Frame(options);
    return Object.freeze({mode:'pair',formula:'1+1',strandCount:2});
  }

  function buildGeometry(records,options={}){
    if(records[0]&&records[0].kind==='ZETA_ZERO_CONJUGATE_PAIR')return buildZetaGeometry(records,options);
    if(records[0]&&records[0].kind==='PRIME_RESIDUE_HELIX_RECORD')return buildPrimeResidueGeometry(records,options);
    const mix=clamp01(options.mix),step=phaseStep(mix),count=records.length,viewMode=strandMode(options.strandMode||'double');
    const innerRadius=Number.isFinite(options.innerRadius)?options.innerRadius:0.56;
    const railRadius=innerRadius*PHI;
    const height=Number.isFinite(options.height)?options.height:2.35;
    const measures=helixMeasures(count,{step,radius:innerRadius,height});
    const center=(count-1)/2;
    const rungs=records.map((record,i)=>{
      const angle=i*step,y=count===1?0:(i-center)*height/(count-1);
      const codonIndex=Math.floor(i/3)+1,codonSlot=i%3+1,codon=codonSlot===3;
      const fibonacci=FIBONACCI_INDICES.includes(i+1);
      const strandA=Object.freeze({x:Math.cos(angle)*innerRadius,y,z:Math.sin(angle)*innerRadius});
      const strandB=Object.freeze({x:Math.cos(angle+Math.PI)*innerRadius,y,z:Math.sin(angle+Math.PI)*innerRadius});
      const midpoint=Object.freeze({x:(strandA.x+strandB.x)/2,y:(strandA.y+strandB.y)/2,z:(strandA.z+strandB.z)/2});
      const railA=Object.freeze({x:Math.cos(angle)*railRadius,y,z:Math.sin(angle)*railRadius});
      const railB=Object.freeze({x:Math.cos(angle+Math.PI)*railRadius,y,z:Math.sin(angle+Math.PI)*railRadius});
      return Object.freeze({...record,angle,angleDegrees:degrees(angle%TAU),codon,codonIndex,codonSlot,fibonacci,strandA,strandB,midpoint,rail:railA,railA,railB});
    });
    return Object.freeze({strandMode:viewMode,mix,step,stepDegrees:degrees(step),innerRadius,railRadius,railRatio:railRadius/innerRadius,height,measures,rungs:Object.freeze(rungs)});
  }

  function modeRecords(mode){
    if(mode==='z37')return z37Orbits();
    if(mode==='twins')return twinRungs();
    if(mode==='zeta')return zetaZeroRecords();
    if(mode==='residue')return primeResidueRecords();
    throw new RangeError('mode must be twins, z37, zeta or residue');
  }

  function inspection(mode,index,mix=0,viewMode='double',options={}){
    const records=modeRecords(mode),geometry=buildGeometry(records,{mix,strandMode:viewMode,...options}),rung=geometry.rungs[index];
    if(!rung)throw new RangeError('rung index outside mode');
    if(mode==='residue')return Object.freeze({
      recordId:rung.sourceIds[0],mode,strandMode:geometry.strandMode,index:rung.index,prime:rung.prime,
      pair:Object.freeze([rung.prime,rung.prime]),single:Object.freeze([rung.prime]),sourceIds:rung.sourceIds,
      residue7:rung.residue7,residue11:rung.residue11,angleDegrees7:rung.angleDegrees7,angleDegrees11:rung.angleDegrees11,
      angleMode:rung.angleMode,axisIntersection:null,measures:null,tail:geometry.tail,
      return:Object.freeze({method:'RETAINED_PRIME_RECORD',values:Object.freeze([rung.prime]),exact:true})
    });
    if(mode==='zeta')return Object.freeze({
      recordId:`HELIX:ZETA:${String(rung.index).padStart(2,'0')}`,mode,strandMode:geometry.strandMode,index:rung.index,
      pair:Object.freeze([rung.a,rung.b]),single:Object.freeze([rung.a]),sourceIds:rung.sourceIds,
      sourceBeta:rung.sourceBeta,beta:rung.beta,gamma:rung.gamma,logX:rung.logX,x:rung.x,theta:rung.theta,
      thetaDegrees:rung.thetaDegrees,normalizedAmplitude:rung.normalizedAmplitude,normalizedContribution:rung.normalizedContribution,
      rawContribution:rung.rawContribution,axisIntersection:null,measures:null,conjugateMirror:rung.conjugateMirror,
      lensMode:rung.lensMode,traceWord:rung.traceWord,traceSlot:rung.traceSlot,traceSymbol:rung.traceSymbol,kink:rung.kink,phaseLift:rung.phaseLift,
      return:Object.freeze({method:geometry.strandMode==='double'?'RETAINED_ZERO_CONJUGATE_PAIR':'RETAINED_POSITIVE_ZERO',values:geometry.strandMode==='double'?Object.freeze([rung.a,rung.b]):Object.freeze([rung.a]),exact:true})
    });
    return Object.freeze({
      recordId:mode==='twins'?`HELIX:TWIN:${String(rung.index).padStart(2,'0')}`:`HELIX:Z37:${String(rung.index).padStart(2,'0')}`,
      mode,strandMode:geometry.strandMode,index:rung.index,pair:Object.freeze([rung.a,rung.b]),single:Object.freeze([rung.a]),fixed:Boolean(rung.fixed),codon:rung.codon,codonIndex:rung.codonIndex,codonSlot:rung.codonSlot,
      fibonacciMarker:rung.fibonacci,phaseDegrees:geometry.stepDegrees,sourceIds:rung.sourceIds||null,
      axisIntersection:geometry.strandMode==='double'?rung.midpoint:null,
      measures:geometry.measures,
      return:Object.freeze({method:geometry.strandMode==='double'?'RETAINED_SOURCE_PAIR':'RETAINED_SOURCE_A',values:geometry.strandMode==='double'?Object.freeze([rung.a,rung.b]):Object.freeze([rung.a]),exact:true})
    });
  }

  function rosslerDerivative({x,y,z}){
    return {x:-y-z,y:x+0.2*y,z:0.2+z*(x-5.7)};
  }

  function rosslerRk4(state,h){
    const advance=(point,rate,dt)=>({x:point.x+dt*rate.x,y:point.y+dt*rate.y,z:point.z+dt*rate.z});
    const a=rosslerDerivative(state);
    const b=rosslerDerivative(advance(state,a,h/2));
    const c=rosslerDerivative(advance(state,b,h/2));
    const d=rosslerDerivative(advance(state,c,h));
    return {
      x:state.x+h*(a.x+2*b.x+2*c.x+d.x)/6,
      y:state.y+h*(a.y+2*b.y+2*c.y+d.y)/6,
      z:state.z+h*(a.z+2*b.z+2*c.z+d.z)/6
    };
  }

  function rosslerLiftCycles({step=0.005}={}){
    if(!Number.isFinite(step)||step<0.001||step>0.01)throw new RangeError('Rössler integration step outside replay range');
    const cycles=[];
    let state={x:1,y:0,z:0},samples=null,peakZ=0,nextSampleTime=0;
    for(let i=0;i*step<100&&cycles.length<5;i++){
      const next=rosslerRk4(state,step);
      const time=(i+1)*step;
      // Count the positive crossing of the negative y half-axis only.
      if(state.x<0&&next.x>=0){
        const fraction=-state.x/(next.x-state.x);
        const y=state.y+fraction*(next.y-state.y);
        const z=state.z+fraction*(next.z-state.z);
        const t=(i+fraction)*step;
        if(y<0&&-y-z>0&&t>=40){
          const crossing={x:0,y,z,t};
          if(samples){
            samples.push({...crossing,peakZ:Math.max(peakZ,z)});
            cycles.push({samples,returnRadius:Math.hypot(crossing.x,crossing.y)});
          }
          samples=[{...crossing,peakZ:z}];
          peakZ=z;
          nextSampleTime=t+0.15;
        }
      }
      if(samples){
        peakZ=Math.max(peakZ,next.z);
        if(time+1e-9>=nextSampleTime){
          samples.push({...next,t:time,peakZ});
          nextSampleTime+=0.15;
        }
      }
      state=next;
    }
    return cycles;
  }

  function rosslerJanusOverlap(cycles){
    const epsilon=1e-8;
    const difference=(a,b)=>[a.x-b.x,a.y-b.y,a.z-b.z];
    // JANUS and curvature share the middle point of each playback triple.
    const records=cycles.map(({samples})=>samples.map((point,index)=>{
      if(index===0||index===samples.length-1)return null;
      const previous=samples[index-1],next=samples[index+1];
      const incoming=difference(point,previous),outgoing=difference(next,point);
      const backward=incoming.map(value=>value/(point.t-previous.t));
      const forward=outgoing.map(value=>value/(next.t-point.t));
      const overlap=forward.map((value,axis)=>value*backward[axis]);
      const [ax,ay,az]=incoming,[bx,by,bz]=outgoing;
      const cross=Math.hypot(ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx);
      return {
        point,index,
        janus:Math.hypot(...overlap)/(Math.hypot(...forward)*Math.hypot(...backward)+epsilon),
        curvature:cross/(Math.hypot(...incoming)**3+epsilon)
      };
    }));
    const interior=records.flat().filter(Boolean);
    function quantile(key,fraction){
      const values=interior.map(record=>record[key]).sort((a,b)=>a-b);
      const position=(values.length-1)*fraction;
      const low=Math.floor(position);
      return values[low]+(values[Math.ceil(position)]-values[low])*(position-low);
    }
    const lowJanus=quantile('janus',0.08),highCurvature=quantile('curvature',0.92);
    return records.map((entries,cycleIndex)=>entries.map(record=>record&&{
      ...record,cycleIndex,overlap:record.janus<=lowJanus&&record.curvature>=highCurvature
    }));
  }

  function matchSampleClusters(xy,xyz,clusterCount){
    const overlap=Array.from({length:clusterCount},()=>Array(clusterCount).fill(0));
    xyz.forEach((label,i)=>overlap[label][xy[i]]++);
    let mapping=[],matched=-1;
    // Six clusters allow an exact one-to-one assignment across all 720 permutations.
    function assign(candidate,available,score){
      if(available.length===0){
        if(score>matched){matched=score;mapping=candidate;}
        return;
      }
      for(const label of available){
        assign([...candidate,label],available.filter(other=>other!==label),score+overlap[candidate.length][label]);
      }
    }
    assign([],Array.from({length:clusterCount},(_,index)=>index),0);
    return {mapping,matched};
  }

  function rosslerClusterComparison(cycles){
    const clusterCount=6;
    // A shared crossing belongs to the start of the following cycle.
    const samples=cycles.flatMap(({samples},cycle)=>samples
      .slice(0,cycle===cycles.length-1?samples.length:-1)
      .map((point,index)=>({point,cycle:cycle+1,index})));
    const points=samples.map(({point})=>[point.x,point.y,point.z]);
    const distance=(a,b,dimensions)=>{
      let total=0;
      for(let axis=0;axis<dimensions;axis++)total+=(a[axis]-b[axis])**2;
      return total;
    };
    // Offer the same deterministic initializations in both coordinate spaces.
    const starts=Array.from({length:clusterCount},(_,index)=>Math.floor(index*points.length/clusterCount));
    const seedsByStart=starts.map(start=>{
      const seeds=[start];
      while(seeds.length<clusterCount){
        let best=-1,bestDistance=-1;
        for(let i=0;i<points.length;i++){
          const nearest=Math.min(...seeds.map(index=>distance(points[i],points[index],2)));
          if(nearest>bestDistance){best=i;bestDistance=nearest;}
        }
        seeds.push(best);
      }
      return seeds;
    });
    function fit(dimensions,seeds){
      let centers=seeds.map(index=>points[index].slice(0,dimensions));
      let previous=[];
      for(let iteration=0;iteration<200;iteration++){
        const labels=points.map(point=>{
          let closest=0;
          for(let index=1;index<clusterCount;index++){
            if(distance(point,centers[index],dimensions)<distance(point,centers[closest],dimensions))closest=index;
          }
          return closest;
        });
        if(labels.every((label,i)=>label===previous[i])){
          const error=labels.reduce((sum,label,i)=>sum+distance(points[i],centers[label],dimensions),0);
          return {labels,error};
        }
        const sums=centers.map(()=>Array(dimensions).fill(0)),counts=centers.map(()=>0);
        labels.forEach((label,i)=>{
          counts[label]++;
          for(let axis=0;axis<dimensions;axis++)sums[label][axis]+=points[i][axis];
        });
        centers=sums.map((row,label)=>counts[label]?row.map(sum=>sum/counts[label]):centers[label]);
        previous=labels;
      }
      throw new Error('Rössler clustering did not converge');
    }
    const bestFit=dimensions=>seedsByStart.map(seeds=>fit(dimensions,seeds))
      .reduce((best,candidate)=>candidate.error<best.error?candidate:best).labels;
    const xy=bestFit(2),xyz=bestFit(3);
    const matrix=()=>Array.from({length:clusterCount},()=>Array(clusterCount).fill(0));
    const {mapping,matched}=matchSampleClusters(xy,xyz,clusterCount);
    const aligned=xyz.map(label=>mapping[label]);
    function transitions(labels){
      const counts=matrix();
      for(let i=1;i<labels.length;i++)counts[labels[i-1]][labels[i]]++;
      const probabilities=counts.map(row=>{
        const size=row.reduce((sum,count)=>sum+count,0);
        return row.map(count=>size?count/size:0);
      });
      return {counts,probabilities};
    }
    const reference=transitions(xy),before=transitions(xyz),after=transitions(aligned);
    const meanDifference=other=>reference.probabilities.reduce((sum,row,from)=>sum+
      row.reduce((subtotal,value,to)=>subtotal+Math.abs(value-other.probabilities[from][to]),0),0)/clusterCount**2;
    let largest={from:0,to:0,delta:0};
    after.probabilities.forEach((row,from)=>row.forEach((value,to)=>{
      const delta=value-reference.probabilities[from][to];
      if(Math.abs(delta)>Math.abs(largest.delta))largest={from,to,delta};
    }));
    return {samples,xy,xyz,aligned,mapping,matched,reference,before,after,
      meanBefore:meanDifference(before),meanAfter:meanDifference(after),largest};
  }

  function audit(){
    const twins=twinRungs(),orbits=z37Orbits(),residuePrimes=primeResidueRecords(),tail=primeTailRecords();
    return Object.freeze({
      schema:'nexah.a0.helix-view-adapter/1.0.0',version:VERSION,
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS']),
      carrier:Object.freeze({limit:LIMIT,twinRungs:twins.length,z37Orbits:orbits.length,z37FixedPoints:orbits.filter(x=>x.fixed).length,zetaZeroPairs:ZETA_ZERO_ORDINATES.length,primeResidueSharedCarrier:residuePrimes.length,primeResidueTail:tail.length}),
      phase:Object.freeze({eulerTenStepRadians:EULER_STEP,eulerTenStepDegrees:degrees(EULER_STEP),goldenAngleRadians:GOLDEN_ANGLE,goldenAngleDegrees:degrees(GOLDEN_ANGLE),interpolation:'DECLARED_LINEAR_VIEW_PARAMETER'}),
      rail:Object.freeze({radiusRatio:'φ',phi:PHI,fibonacciIndices:FIBONACCI_INDICES,role:'INDEX_MARKERS_ON_GOLDEN_ANGLE_RAIL'}),
      strands:Object.freeze({single:'RN\\A_DECLARED_VIEW_LABEL',double:'(c)D|⁄|A_DECLARED_VIEW_LABEL',doublePhaseOffset:'π',midpoint:'L_k(1/2)=(0,z_k,0)'}),
      registers:Object.freeze({pair:'1+1_SOURCE_CARRIER',fh14:'F1..F7 + H1..H7_ANTIPODAL_PHASE_BUNDLE',triad21:'3x7_PHASE_BUNDLE',z37frame:'1_FIXED_POINT + 18_INVERSION_PAIRS',z37Axis:'RESIDUE_0_TO_SEAM_18|19'}),
      differentialGeometry:Object.freeze({curve:'gamma(t)=(R cos t, b t + y0, R sin t)',theta:'Theta=Delta theta',iota:'iota=b=Delta z/Delta theta',dao:'DAO=R^2+iota^2',curvature:'kappa=R/DAO',torsionMagnitude:'|tau|=|iota|/DAO',role:'DERIVED_NORMALIZED_VIEW_METRICS'}),
      explicitFormula:Object.freeze({sample:'FIRST_20_POSITIVE_NONTRIVIAL_ZERO_ORDINATES',sourceBeta:0.5,phase:'theta=gamma log x',normalizedEnvelope:'x^(beta-1/2)',pairTerm:'-(x^rho/rho + x^conj(rho)/conj(rho))',betaProbe:'COUNTERFACTUAL_VIEW_PARAMETER_ONLY',claim:'FINITE_NUMERICAL_LENS_NOT_RH_PROOF'}),
      traceSeam:Object.freeze({words:TRACE_WORDS,kinksPerWord:2,shadow:'-1/12',visible:'11/12',equivalence:'-1/12 == 11/12 (mod 1)',liftWitness:'1',dirichletCharacter:false,missingTests:Object.freeze(['PERIOD_MOD_Q','COMPLETELY_MULTIPLICATIVE','ZERO_ON_NON_UNITS']),role:'TRACE_AND_VIEW_SEAM_COMPARATOR'}),
      residueHelix:Object.freeze({sharedCarrier:'168_PRIMES_P_LE_1000',tail:'18_PRIMES_1000_LT_P_LE_1111_OUTSIDE_SHARED_VIEW',verticalOrder:'PRIME_INDEX_ASCENDING',angleRules:Object.freeze({mod7:'2pi*(p mod 7)/7',mod11:'2pi*(p mod 11)/11',paired:'SAME_PRIME_RECORD_ON_TWO_VIEW_RAILS'}),naturalHelixClaim:false,eulerAuditIdentity:false}),
      boundary:'Finite source pairs, Z37 involution orbits, sampled zeta-zero conjugate pairs, strand labels, phase steps and markers are visual encodings. RN\\A is not inferred as a set difference without separately declared sets. RLLR and LRRL remain trace words, not Dirichlet characters. The -1/12 and 11/12 records are the same phase modulo one but retain different lift histories. The explicit-formula lens is a finite numerical visualization, not a proof of RH, an evaluation of the complete explicit formula or a new zero computation. The prime-residue helix orders the shared finite prime carrier by index and assigns declared modulo angles; it is neither a natural prime helix nor identical to the separate Euler 7x11 edge audit. No biological RNA/DNA law, physical resonance, prime generator or Fibonacci control mechanism is asserted.'
    });
  }

  return Object.freeze({VERSION,LIMIT,TAU,PHI,EULER_STEP,GOLDEN_ANGLE,FIBONACCI_INDICES,STRAND_MODES,REGISTER_MODES,ZETA_ZERO_ORDINATES,ZETA_LENS_MODES,TRACE_WORDS,RESIDUE_ANGLE_MODES,isPrime,twinRungs,primeResidueRecords,sliceSpectrum,mod7FourierComparison,primeTailRecords,residueAngleMode,buildPrimeResidueGeometry,z37Orbits,zetaZeroRecords,explicitFormulaPair,comparePrimeRepeat,iharaTriangleTerm,zetaLensMode,traceWordData,phaseSeamData,buildZetaGeometry,phaseStep,degrees,strandMode,registerMode,helixMeasures,bundleStrand,fhBundle,triadBundle,z37Frame,registerGeometry,buildGeometry,modeRecords,inspection,rosslerLiftCycles,rosslerJanusOverlap,rosslerClusterComparison,matchSampleClusters,audit});
});
