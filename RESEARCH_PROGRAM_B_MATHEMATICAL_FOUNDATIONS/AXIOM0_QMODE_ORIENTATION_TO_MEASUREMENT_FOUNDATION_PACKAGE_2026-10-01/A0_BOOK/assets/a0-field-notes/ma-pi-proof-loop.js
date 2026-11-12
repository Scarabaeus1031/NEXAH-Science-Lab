(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0MaPiProof=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function state(value=137,limit=1000){
  const N=Math.max(0,Math.round(Number(limit)||0));
  const n=Math.max(0,Math.min(N,Math.round(Number(value)||0)));
  const midpoint=N/2;
  const mirror=N-n;
  const residual=n-midpoint;
  const mirrorResidual=mirror-midpoint;
  const returnAddress=N-mirror;
  return{limit:N,n,mirror,midpoint,residual,mirrorResidual,pairSum:residual+mirrorResidual,returnAddress,involutionPass:returnAddress===n,fixed:n===mirror,hasIntegerFixed:Number.isInteger(midpoint),progress:N?n/N:0,mirrorProgress:N?mirror/N:0};
 }
 function audit(limit=1000){
  const N=Math.max(0,Math.round(Number(limit)||0));
  const midpoint=N/2;
  let involutionCount=0,pairCancellationCount=0,totalBalance=0;
  const fixedPoints=[];
  for(let n=0;n<=N;n++){
   const item=state(n,N);
   if(item.involutionPass)involutionCount++;
   if(n<midpoint&&item.pairSum===0)pairCancellationCount++;
   if(item.fixed)fixedPoints.push(n);
   totalBalance+=item.residual;
  }
  const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return Math.abs(a);};
  const angleStep=137,angleModulus=360,angleOrder=angleModulus/gcd(angleStep,angleModulus);
  return{
   limit:N,
   addresses:N+1,
   involutionCount,
   pairCancellationCount,
   fixedPoints,
   totalBalance,
   integralBalance:0,
   allInvolutions:involutionCount===N+1,
   allPairsCancel:pairCancellationCount===Math.floor((N+1)/2),
   uniqueIntegerFixedPoint:fixedPoints.length===1&&fixedPoints[0]===midpoint,
   negativeControls:{
    oddLimit999HasIntegerFixed:state(0,999).hasIntegerFixed,
    shiftedCenter499Balance:(N+1)*(N/2-499),
    incomplete0to999Balance:-500
   },
   angleWitness:{value:66069137,remainder:66069137%angleModulus,step:angleStep,order:angleOrder,fullReturnDegrees:angleOrder*angleStep}
  };
 }
 function gyroState(modulus=12){
  const allowed=[7,11,12,13];
  const requested=Math.round(Number(modulus)||12);
  const mode=allowed.includes(requested)?requested:12;
  const addresses=[1031,1032,1033];
  const residues=addresses.map(value=>value%mode);
  const controlValues=[100,121];
  const controlResidues=controlValues.map(value=>value%mode);
  const mirror=value=>2064-value;
  return{
   mode,
   addresses,
   residues,
   mirrors:addresses.map(mirror),
   midpoint:1032,
   centerOnZeroSeam:residues[1]===0,
   mirrorPass:addresses.every((value,index)=>mirror(mirror(value))===value&&mirror(value)===addresses[2-index]),
   controlValues,
   controlResidues,
   controlsShareResidue:controlResidues[0]===controlResidues[1],
   angle360:{
    j1000Pair:[137%360,863%360],
    j1000Constant:1000%360,
    r1032Triplet:addresses.map(value=>value%360),
    r1032Constant:2064%360
   }
  };
 }
 function groupingAudit(){
  const pairAddress=[2**4,7*(2**3)];
  const modes=[7,11,12,13];
  return{
   residueRail:[2,3,4],
   firstThreePrimes:[2,3,5],
   pairAddress,
   concatenatedValue:1656,
   concatenatedFactors:[2,2,2,3,3,23],
   equalEighteen:{left:7+11,right:12+6,pass:7+11===12+6},
   thirteenGate:{value:1+12,pass:1+12===13},
   residues:Object.fromEntries(modes.map(modulus=>[modulus,pairAddress.map(value=>value%modulus)])),
   hold:{token:'165 / 135 / 2·3',status:'UNPARSED_OWNER_TOKEN'}
  };
 }
 function scarabAudit(){
  const reverse10=value=>Number(String(Math.abs(Number(value))).split('').reverse().join(''));
  const orbit=[1031,1032,1033,3201,3301,7801];
  const crownSum=orbit.reduce((sum,value)=>sum+value,0);
  const shadowDiff=-6867;
  const carrier264=264;
  return{
   decimalMirrors:[[1033,3301],[1087,7801]],
   mirrorPass:reverse10(1033)===3301&&reverse10(3301)===1033&&reverse10(1087)===7801&&reverse10(7801)===1087,
   negativeControls:{reverse1032:reverse10(1032),reverse1031:reverse10(1031),unresolved3201:true},
   orbit,
   crownSum,
   crownFactors:[127,137],
   crownPass:crownSum===127*137,
   cipherHandle:{pair:['1033','3301'],joined:'10333301',type:'DECIMAL_STRING_CONCATENATION'},
   axisLedger:{crownSum,shadowDiff,axisNode:crownSum+shadowDiff,pass:crownSum+shadowDiff===10532},
   insideOutside:{inside:0,outside:1,distinct:0!==1,type:'STATE_BOUNDARY'},
   tesa:{mod42:[1033%42,3301%42],mod9:[1033%9,3301%9]},
   fullTurn:{degrees:360,start:0,return:360,samePoint:true,orientation:'COUNTERCLOCKWISE_VIEW'},
   angleProjection:{scarab:1033%360,cikada:3301%360,crown:crownSum%360,carrier264},
   carrier264:{value:carrier264,factors:[2,2,2,3,11],mod64:carrier264%64,quotient64:Math.floor(carrier264/64),mod32:carrier264%32,quotient32:Math.floor(carrier264/32),binary:carrier264.toString(2),hex:carrier264.toString(16).toUpperCase(),sharedResidue:carrier264%64===carrier264%32},
   hold:['3201_TRANSFORM_RULE','STONE_KITE_OPERATOR','C64_B32_SEMANTICS']
  };
 }
 function kubrikAudit(){
  const reverse10=value=>Number(String(Math.abs(Number(value))).split('').reverse().join(''));
  const factor=n=>{const factors=[];let value=n;for(let d=2;d*d<=value;d++)while(value%d===0){factors.push(d);value/=d;}if(value>1)factors.push(value);return factors;};
  const word=seed=>Number(String(seed)+String(reverse10(seed)));
  const swap=seed=>Number(String(reverse10(seed))+String(seed));
  const glyphMap=Object.freeze({'6':'9','1':'1','9':'6'});
  const halfTurnGlyph=value=>String(value).split('').reverse().map(glyph=>glyphMap[glyph]??'?').join('');
  return{
   primeWindow:{values:[37,41,43],sum:37+41+43,square:11**2,pass:37+41+43===11**2},
   source141:{value:141,divisor:3,quotient:141/3,pass:141/3===47},
   families:{
    seed31:{seed:31,reverse:reverse10(31),word:word(31),swapped:swap(31),wordFactors:factor(word(31)),swappedFactors:factor(swap(31)),cubePass:swap(31)===11**3},
    seed47:{seed:47,reverse:reverse10(47),word:word(47),swapped:swap(47),wordFactors:factor(word(47)),swappedFactors:factor(swap(47))}
   },
   blockSwapInvolution:swap(reverse10(31))===word(31)&&swap(reverse10(47))===word(47),
   glyph619:{value:619,decimalReverse:reverse10(619),halfTurn:halfTurnGlyph(619),glyphReturn:halfTurnGlyph(619)==='619',decimalIdentity:reverse10(619)===619},
   breathingView:{movingBands:3,fixedCore:1,totalChannels:4,status:'EXISTING_3_PLUS_1_VIEW'},
   seamToken:{token:'31|i|13',status:'ORIENTATION_SEAM_VIEW_NOT_IMAGINARY_MULTIPLICATION'},
   hopf:{status:'HOLD_NO_TRANSFER',existingComparator:'NEXAH_PCA_HOPF_C4_REQUANTIZATION_TEST',globalCommutation:'REJECTED',activeCapability:false},
   graphDelta:{newNodes:0,newRelations:0,newAliases:0}
  };
 }
 function harmonicAudit(){
  const factor=n=>{const factors=[];let value=n;for(let d=2;d*d<=value;d++)while(value%d===0){factors.push(d);value/=d;}if(value>1)factors.push(value);return factors;};
  const rail=[432,440,456,487,529];
  const increments=rail.slice(1).map((value,index)=>value-rail[index]);
  const rootAddresses=[429,439,456];
  const rootAddressIncrements=rootAddresses.slice(1).map((value,index)=>value-rootAddresses[index]);
  const phi=(1+Math.sqrt(5))/2;
  const phiAngleDegrees=Math.atan(Math.sqrt(phi))*180/Math.PI;
  return{
   rail,
   increments,
   railPass:increments.join('|')==='8|16|31|42'&&rail.at(-1)-rail[0]===97,
   foundation:{values:[142,143,144],factors:{142:factor(142),143:factor(143),144:factor(144)},squarePass:144===12**2,fibonacciIndex:12},
   connector:{left:529,right:531,midpoint:(529+531)/2,separation:531-529,leftFactors:factor(529),rightFactors:factor(531),pass:529===23**2&&(529+531)/2===530},
   phase:{degrees:144,pentagonalIndex:2,phaseRail:[0,72,144,216,288],root432Pass:432===3*144},
   scaleView:{operator:'S_1000(x)=1000x',bands:[.429,.456,.487],addresses:[429,456,487],declaredViewOnly:true},
   rootChamber:{
    radicands:rootAddresses,
    roots:rootAddresses.map(Math.sqrt),
    addressIncrements:rootAddressIncrements,
    totalAddressDelta:rootAddresses.at(-1)-rootAddresses[0],
    factors:Object.fromEntries(rootAddresses.map(value=>[value,factor(value)])),
    split439Status:'LOCAL_SPLIT_ADDRESS_NOT_CRYSTAL_BAND',
    pass:rootAddressIncrements.join('|')==='10|17'&&rootAddresses.at(-1)-rootAddresses[0]===3**3
   },
   phiGate:{
    phi,
    angleDegrees:phiAngleDegrees,
    complementDegrees:90-phiAngleDegrees,
    tangent:Math.tan(phiAngleDegrees*Math.PI/180),
    sine:Math.sin(phiAngleDegrees*Math.PI/180),
    cosine:Math.cos(phiAngleDegrees*Math.PI/180),
    roundedPosterAngles:[51.83,38.17],
    exactPass:Math.abs(Math.tan(phiAngleDegrees*Math.PI/180)-Math.sqrt(phi))<1e-12&&Math.abs(Math.sin(phiAngleDegrees*Math.PI/180)-1/Math.sqrt(phi))<1e-12&&Math.abs(Math.cos(phiAngleDegrees*Math.PI/180)-1/phi)<1e-12,
    rootCoupling:'HOLD_NO_DECLARED_OPERATOR'
   },
   typedSources:{crystalBands:['BAND_0.429','BAND_0.456','BAND_0.487'],plate:'PLATE_ROOT432',frequencySeedsHz:[432,440,444]},
   complexGate:{unitCircle:'exp(i*theta)',realGrowth:'exp(x)',equalityCondition:'t-x in 2*pi*Z',sameOperatorWithoutCondition:false},
   negativeControls:{square144:144**2,poster456Equals144Squared:false,fibonacci144:true,fibonacci432:false,unparsedVoltageToken:'230/400V'},
   hold:['HARMONIC_MECHANISM','VOLTAGE_ADAPTER','EXPONENTIAL_RAIL_COUPLING','ROOT_PHI_COUPLING','POSTER_48_17_1_83_27_17_MINUS_11_X87_X33_232'],
   graphDelta:{newNodes:0,newRelations:0,newAliases:0}
  };
 }
 function rathAudit(value=51,unit='percent'){
  const percent=Math.max(0,Math.min(100,Number(value)||0));
  const mirrorPercent=100-percent;
  const toMinutes=input=>input*60/100;
  const selectedUnit=unit==='minute'?'minute':'percent';
  const atlas=selectedUnit==='minute'?toMinutes(percent):percent;
  const hektor=selectedUnit==='minute'?toMinutes(mirrorPercent):mirrorPercent;
  return{
   operator:'J_100(p)=100-p',
   percent,
   mirrorPercent,
   midpoint:50,
   fixed:percent===50,
   unit:selectedUnit,
   atlas,
   hektor,
   sum:atlas+hektor,
   expectedSum:selectedUnit==='minute'?60:100,
   delta:Math.abs(atlas-hektor),
   involutionPass:100-mirrorPercent===percent,
   minuteMap:{operator:'M(p)=0.6p',atlas:toMinutes(percent),hektor:toMinutes(mirrorPercent),sum:toMinutes(percent)+toMinutes(mirrorPercent)},
   addressRail:{pair:[227,773],sum:227+773,mirrorPass:1000-227===773&&1000-773===227},
   spanControls:{minute:[773,833],minuteDelta:833-773,percent:[377,477],percentDelta:477-377},
   angles:{
    degrees204:{source:'204°',degrees:204,arcminutes:204*60,arcseconds:204*3600},
    arcminutes400:{source:'400′',degrees:400/60,arcminutes:400,arcseconds:400*60},
    arcseconds420:{source:'420″',degrees:420/3600,arcminutes:420/60,arcseconds:420},
    typedDistinct:true
   },
   hold:['LUX_PHYSICAL_UNIT_WITHOUT_MEASUREMENT','PI_DAO_UNDECLARED_OPERATOR','RATH_SEMANTIC_MECHANISM_OPEN'],
   graphDelta:{newNodes:0,newRelations:0,newAliases:0}
  };
 }
 function mount(doc=globalThis.document,timers=globalThis){
  const shell=doc?.getElementById?.('ma-pi-proof-loop');
  if(!shell)return null;
  const range=shell.querySelector('[data-jmp-range]');
  const red=shell.querySelector('[data-jmp-red]');
  const cyan=shell.querySelector('[data-jmp-cyan]');
  const negative=shell.querySelector('[data-jmp-negative]');
  const positive=shell.querySelector('[data-jmp-positive]');
  const buttons=[...shell.querySelectorAll('[data-jmp-value]')];
  const play=shell.querySelector('[data-jmp-play]');
  const gyroButtons=[...shell.querySelectorAll('[data-jmp-gyro-mode]')];
  const gyroResidues=[...shell.querySelectorAll('[data-jmp-gyro-residue]')];
  const scarabTurn=shell.querySelector('[data-jmp-scarab-turn]');
  const scarabReturn=shell.querySelector('#gyro-scarab-return');
  const kubrikSwap=shell.querySelector('[data-jmp-kubrik-swap]');
  const kubrikReturn=shell.querySelector('#kubrik-block-return');
  const harmonicStep=shell.querySelector('[data-jmp-harmonic-step]');
  const harmonicNodes=[...shell.querySelectorAll('[data-jmp-harmonic-node]')];
  const harmonicOutput=shell.querySelector('[data-jmp-harmonic-output]');
  const rathRange=shell.querySelector('[data-jmp-rath-range]');
  const rathUnitButtons=[...shell.querySelectorAll('[data-jmp-rath-unit]')];
  const rathAtlas=shell.querySelector('[data-jmp-rath-atlas]');
  const rathHektor=shell.querySelector('[data-jmp-rath-hektor]');
  const rathOutputs={};
  for(const key of ['atlas','hektor','sum','delta','unit'])rathOutputs[key]=shell.querySelector('[data-jmp-rath-output="'+key+'"]');
  const gyroOutputs={};
  for(const key of ['mode','seam','control100','control121','controlRelation','angleJ','angleR'])gyroOutputs[key]=shell.querySelector('[data-jmp-gyro-output="'+key+'"]');
  const outputs={};
  for(const key of ['n','mirror','residual','mirrorResidual','pairSum','return'])outputs[key]=shell.querySelector('[data-jmp-output="'+key+'"]');
  let n=137,run=[],harmonicIndex=0,rathUnit='percent';
  const signed=value=>value>0?'+'+value:value<0?'−'+Math.abs(value):'0';
  function stop(){run.forEach(id=>timers.clearTimeout?.(id));run=[];if(play){play.disabled=false;play.setAttribute('aria-pressed','false');}}
  function render(value=n){
   const item=state(value);
   n=item.n;
   if(range)range.value=String(n);
   if(red)red.style.left=(item.progress*100)+'%';
   if(cyan)cyan.style.left=(item.mirrorProgress*100)+'%';
   const scale=Math.abs(item.residual)/500;
   if(negative)negative.style.transform='scaleX('+scale+')';
   if(positive)positive.style.transform='scaleX('+scale+')';
   if(outputs.n)outputs.n.textContent='n='+item.n;
   if(outputs.mirror)outputs.mirror.textContent='J(n)='+item.mirror;
   if(outputs.residual)outputs.residual.textContent='r(n)='+signed(item.residual);
   if(outputs.mirrorResidual)outputs.mirrorResidual.textContent='r(J(n))='+signed(item.mirrorResidual);
   if(outputs.pairSum)outputs.pairSum.textContent=item.pairSum+' · '+(item.pairSum===0?'PASS':'FAIL');
   if(outputs.return)outputs.return.textContent='J²(n)='+item.returnAddress+' · '+(item.involutionPass?'PASS':'FAIL');
   shell.dataset.jmpFixed=String(item.fixed);
   return item;
  }
  function playSequence(){
   stop();
   if(play){play.disabled=true;play.setAttribute('aria-pressed','true');}
   [0,137,499,500,501,863,1000].forEach((value,index)=>run.push(timers.setTimeout?.(()=>{render(value);if(index===6)stop();},index*650)));
  }
  function renderGyro(modulus=12){
   const item=gyroState(modulus);
   shell.dataset.jmpGyroMode=String(item.mode);
   gyroButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.jmpGyroMode)===item.mode)));
   gyroResidues.forEach((node,index)=>{node.textContent=String(item.residues[index]);node.dataset.zero=String(item.residues[index]===0);});
   if(gyroOutputs.mode)gyroOutputs.mode.textContent='MOD '+item.mode;
   if(gyroOutputs.seam)gyroOutputs.seam.textContent=item.centerOnZeroSeam?'1032 ≡ 0 · ZERO SEAM':'1032 ≡ '+item.residues[1]+' · OFFSET';
   if(gyroOutputs.control100)gyroOutputs.control100.textContent='100 ≡ '+item.controlResidues[0];
   if(gyroOutputs.control121)gyroOutputs.control121.textContent='121 ≡ '+item.controlResidues[1];
   if(gyroOutputs.controlRelation)gyroOutputs.controlRelation.textContent=item.controlsShareResidue?'SAME RESIDUE · NOT IDENTITY':'DISTINCT RESIDUES';
   if(gyroOutputs.angleJ)gyroOutputs.angleJ.textContent='137 ↔ 143 · c=280';
   if(gyroOutputs.angleR)gyroOutputs.angleR.textContent='311 ↔ 313 · c=264';
   return item;
  }
  range?.addEventListener('input',()=>{stop();render(range.value);});
  buttons.forEach(button=>button.addEventListener('click',()=>{stop();render(button.dataset.jmpValue);}));
  play?.addEventListener('click',playSequence);
  gyroButtons.forEach(button=>button.addEventListener('click',()=>renderGyro(button.dataset.jmpGyroMode)));
  scarabTurn?.addEventListener('click',()=>{
   scarabReturn?.classList.remove('is-turning');
   void scarabReturn?.offsetWidth;
   scarabReturn?.classList.add('is-turning');
   scarabTurn.disabled=true;
   timers.setTimeout?.(()=>{scarabReturn?.classList.remove('is-turning');scarabTurn.disabled=false;},4200);
  });
  kubrikSwap?.addEventListener('click',()=>{
   const swapped=kubrikReturn?.classList.toggle('is-swapped')??false;
   kubrikSwap.setAttribute('aria-pressed',String(swapped));
   kubrikSwap.textContent=swapped?'RETURN · ORIGINAL':'BLOCKS TAUSCHEN ⇄';
  });
  function renderHarmonic(index=harmonicIndex){
   const item=harmonicAudit(),count=item.rail.length;
   harmonicIndex=((Number(index)||0)%count+count)%count;
   harmonicNodes.forEach((node,nodeIndex)=>node.setAttribute('aria-current',String(nodeIndex===harmonicIndex)));
   if(harmonicOutput){
    const value=item.rail[harmonicIndex];
    harmonicOutput.textContent=harmonicIndex?`${item.rail[harmonicIndex-1]} + ${item.increments[harmonicIndex-1]} = ${value}`:`${value} = 3 × 144 · SOURCE PLATE`;
   }
   return{index:harmonicIndex,value:item.rail[harmonicIndex]};
  }
  function renderRath(value=rathRange?.value??51,unit=rathUnit){
   const item=rathAudit(value,unit);
   rathUnit=item.unit;
   if(rathRange)rathRange.value=String(item.percent);
   if(rathAtlas)rathAtlas.style.left=item.percent+'%';
   if(rathHektor)rathHektor.style.left=item.mirrorPercent+'%';
   rathUnitButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.jmpRathUnit===item.unit)));
   const suffix=item.unit==='minute'?' min':'%';
   if(rathOutputs.atlas)rathOutputs.atlas.textContent=item.atlas.toLocaleString('de-DE',{maximumFractionDigits:3})+suffix;
   if(rathOutputs.hektor)rathOutputs.hektor.textContent=item.hektor.toLocaleString('de-DE',{maximumFractionDigits:3})+suffix;
   if(rathOutputs.sum)rathOutputs.sum.textContent=item.sum.toLocaleString('de-DE',{maximumFractionDigits:3})+suffix+' · PASS';
   if(rathOutputs.delta)rathOutputs.delta.textContent=item.delta.toLocaleString('de-DE',{maximumFractionDigits:3})+suffix;
   if(rathOutputs.unit)rathOutputs.unit.textContent=item.unit==='minute'?'M(p)=0,6p':'J₁₀₀(p)=100−p';
   shell.dataset.jmpRathFixed=String(item.fixed);
   return item;
  }
  harmonicStep?.addEventListener('click',()=>renderHarmonic(harmonicIndex+1));
  rathRange?.addEventListener('input',()=>renderRath(rathRange.value,rathUnit));
  rathUnitButtons.forEach(button=>button.addEventListener('click',()=>renderRath(rathRange?.value??51,button.dataset.jmpRathUnit)));
  render();
  renderGyro(12);
  renderHarmonic(0);
  renderRath(51,'percent');
  return{render,renderGyro,renderHarmonic,renderRath,play:playSequence,stop,get state(){return state(n);},get gyro(){return gyroState(Number(shell.dataset.jmpGyroMode)||12);},get harmonic(){return harmonicAudit();},get rath(){return rathAudit(Number(rathRange?.value)||51,rathUnit);}};
 }
 return{state,audit,gyroState,groupingAudit,scarabAudit,kubrikAudit,harmonicAudit,rathAudit,mount};
});
