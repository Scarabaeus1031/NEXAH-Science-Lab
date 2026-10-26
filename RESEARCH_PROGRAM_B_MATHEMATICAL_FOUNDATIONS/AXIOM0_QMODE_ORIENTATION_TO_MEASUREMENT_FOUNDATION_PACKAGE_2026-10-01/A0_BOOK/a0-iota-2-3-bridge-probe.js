(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0Iota23BridgeProbe=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.3.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const CLASSIFICATION='BOUNDED_ENGINEERING_ARITHMETIC_PROBE';
  const PERIODS=Object.freeze({am:8,pm:12,composite:24});
  const STILL_MNEMONIC=Object.freeze({
    token:'STILL',ownerLabel:'S-HELL',role:'LOCAL_VIEW_MNEMONIC',
    canonicalIdentity:false,openShellBinding:null
  });

  function assertPositiveInteger(value,label='value'){
    if(!Number.isInteger(value)||value<=0)throw new TypeError(`${label} must be a positive integer`);
    return value;
  }

  function gcd(a,b){
    assertPositiveInteger(a,'a');assertPositiveInteger(b,'b');
    let x=a,y=b;
    while(y!==0){const next=x%y;x=y;y=next}
    return x;
  }

  function lcm(a,b){
    return assertPositiveInteger(a,'a')/gcd(a,b)*assertPositiveInteger(b,'b');
  }

  function factorize(value){
    assertPositiveInteger(value);
    const factors=[];let rest=value;
    for(let divisor=2;divisor*divisor<=rest;divisor++){
      while(rest%divisor===0){factors.push(divisor);rest/=divisor}
    }
    if(rest>1)factors.push(rest);
    return Object.freeze(factors);
  }

  function isPrime(value){
    if(!Number.isInteger(value)||value<2)return false;
    return factorize(value).length===1;
  }

  function arithmeticType(value){
    assertPositiveInteger(value);
    const factors=factorize(value);
    if(factors.length===1)return Object.freeze({value,type:'PRIME',factors});
    const unique=[...new Set(factors)];
    if(unique.length===1)return Object.freeze({value,type:'PRIME_POWER',base:unique[0],exponent:factors.length,factors});
    return Object.freeze({value,type:'MIXED_COMPOSITE',factors});
  }

  function step(tick){
    if(!Number.isInteger(tick)||tick<0)throw new TypeError('tick must be a non-negative integer');
    const amPhase=tick%PERIODS.am;
    const pmPhase=(PERIODS.pm-(tick%PERIODS.pm))%PERIODS.pm;
    return Object.freeze({
      tick,
      still:'FIXED',
      am:Object.freeze({direction:'CLOCKWISE',period:PERIODS.am,phase:amPhase,atOrigin:amPhase===0}),
      pm:Object.freeze({direction:'COUNTERCLOCKWISE',period:PERIODS.pm,phase:pmPhase,atOrigin:pmPhase===0}),
      jointReturn:amPhase===0&&pmPhase===0
    });
  }

  function trace(limit=PERIODS.composite){
    if(!Number.isInteger(limit)||limit<0)throw new TypeError('limit must be a non-negative integer');
    return Object.freeze(Array.from({length:limit+1},(_,tick)=>step(tick)));
  }

  function exactArithmetic(){
    const bridge=Object.freeze({
      equality:'3*8=24=2*12',
      left:Object.freeze({period:8,cycles:3,total:3*8}),
      right:Object.freeze({period:12,cycles:2,total:2*12}),
      gcd:gcd(8,12),lcm:lcm(8,12),sixSectorCount:lcm(8,12)/gcd(8,12)
    });
    return Object.freeze({
      bridge,
      pulse24:Object.freeze({threeByEight:3*8,twoByTwelve:2*12,phrasePlusGate:11+13}),
      localWindow:Object.freeze({sixteen:2*8,sixteenPower:2**4,sixteenTower:2**(2**2),sixteenSignature:2+4,seventeen:17,eighteen:3*6,nineteen:18+1,sum16And17:16+17,threeByEleven:3*11}),
      largeValues:Object.freeze({
        factor1836:Object.freeze({factor:17,cofactor:1836/17,reconstructed:17*(1836/17),primeFactors:factorize(1836)}),
        factor1729:Object.freeze({factor:19,cofactor:1729/19,reconstructed:19*(1729/19),primeFactors:factorize(1729)}),
        cofactor108:Object.freeze({sixByEighteen:6*18,threeByThirtySix:3*36,nineByTwelve:9*12})
      })
    });
  }

  function typedAddress(){
    return Object.freeze({
      literal:'0|6|9',
      tokens:Object.freeze([
        Object.freeze({token:'0',role:'STILL_ADDRESS'}),
        Object.freeze({token:'6',role:'LOWER_ORIENTATION_TOKEN'}),
        Object.freeze({token:'9',role:'UPPER_ORIENTATION_TOKEN'})
      ]),
      numericValue:null,
      letterOIdentity:false,
      universalLaw:false,
      operation:'OWNER_DECLARED_ADDRESS_SEGMENTATION'
    });
  }

  function verify(){
    const arithmetic=exactArithmetic(),run=trace(),returns=run.filter(item=>item.jointReturn).map(item=>item.tick);
    const assertions=Object.freeze({
      commonReturnIs24:arithmetic.bridge.lcm===24,
      threeEightsEqualTwoTwelves:arithmetic.bridge.left.total===arithmetic.bridge.right.total,
      sixSectorsOfFour:arithmetic.bridge.gcd===4&&arithmetic.bridge.sixSectorCount===6,
      pulseDecompositionsAgree:new Set(Object.values(arithmetic.pulse24)).size===1,
      local33Agreement:arithmetic.localWindow.sum16And17===arithmetic.localWindow.threeByEleven,
      factor1836Exact:arithmetic.largeValues.factor1836.cofactor===108&&arithmetic.largeValues.factor1836.reconstructed===1836,
      factor1729Exact:arithmetic.largeValues.factor1729.cofactor===91&&arithmetic.largeValues.factor1729.reconstructed===1729,
      cofactor108Agreement:new Set(Object.values(arithmetic.largeValues.cofactor108)).size===1,
      noPrematureJointReturn:returns.length===2&&returns[0]===0&&returns[1]===24,
      stillInvariant:run.every(item=>item.still==='FIXED'),
      shellMnemonicIsNonCanonical:STILL_MNEMONIC.ownerLabel==='S-HELL'&&!STILL_MNEMONIC.canonicalIdentity&&STILL_MNEMONIC.openShellBinding===null
    });
    return Object.freeze({status:Object.values(assertions).every(Boolean)?'PASS':'FAIL',assertions,returns:Object.freeze(returns),arithmetic,address:typedAddress()});
  }

  function buildRecord(){
    const proof=verify();
    return Object.freeze({
      schema:'nexah.a0.iota-2-3-bridge-probe/1',version:VERSION,identity:IDENTITY,
      classification:CLASSIFICATION,status:proof.status,proof,
      readOnlyBindings:Object.freeze({
        pulseGrammar:'11+13=24 from the existing Pulse Grammar Clock',
        orientation:'16|19 and 6|9 remain owned by the separate VA/AV orientation probe'
      }),
      constructedView:Object.freeze({am:'CLOCKWISE_PERIOD_8',pm:'COUNTERCLOCKWISE_PERIOD_12',still:'FIXED_COMMON_PIN',stillMnemonic:STILL_MNEMONIC}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,claimPromotion:false}),
      boundary:'The arithmetic identities and modular return are exact. AM/PM directions, STILL-pin semantics and 0|6|9 roles are a local constructed display contract. S-HELL is an owner mnemonic for that fixed display pin, not the canonical NEXAH Open Shell document family or a physical shell. It is not a physical spin law, a universal number law or a scientific finding.'
    });
  }

  function createViewState(){return Object.freeze({tick:0,layer:'BRIDGE',playing:false})}

  function advance(state=createViewState(),amount=1){
    if(!Number.isInteger(amount))throw new TypeError('amount must be an integer');
    return Object.freeze({...state,tick:(state.tick+amount+25*1000)%25});
  }

  function setLayer(state=createViewState(),layer='BRIDGE'){
    const value=String(layer).toUpperCase();
    if(!['BRIDGE','FACTOR','PULSE'].includes(value))throw new RangeError(`Unknown layer ${layer}`);
    return Object.freeze({...state,layer:value});
  }

  function inspectView(state=createViewState()){
    const schedule=step(state.tick);
    return Object.freeze({
      ...state,schedule,
      returnStatus:schedule.jointReturn?(state.tick===0?'ORIGIN':'JOINT RETURN'):'OPEN',
      factorRail:Object.freeze([16,17,18,19].map(arithmeticType)),
      exact:Object.freeze({sixteen:'2⁴ = 2^(2²) = 2×8 = 16',signature:'2+4=6 · factorization signature only',bridge:'3×8 = 24 = 2×12 = 11+13'})
    });
  }

  function ringFrame(state=createViewState()){
    const view=inspectView(state);
    return Object.freeze({
      schema:'nexah.a0.iota-2-3-ring-frame/1',version:VERSION,identity:IDENTITY,
      source:'IOTA_2_3_BRIDGE_VIEW',tick:state.tick,period:PERIODS.composite,
      am:Object.freeze({phase:view.schedule.am.phase,period:PERIODS.am,direction:view.schedule.am.direction,colour:'VIOLET'}),
      pm:Object.freeze({phase:view.schedule.pm.phase,period:PERIODS.pm,direction:view.schedule.pm.direction,colour:'ORANGE'}),
      jointReturn:view.schedule.jointReturn,returnStatus:view.returnStatus,
      factorRail:Object.freeze([16,17,18,19]),mixOrientation:'PLUS_MINUS_VIEW',
      stillMnemonic:STILL_MNEMONIC,receiveOnly:true,sourceMutation:false,newIdentity:false,newRelation:false,sharedMasterClock:false
    });
  }

  function polar(cx,cy,r,index,total,offset=-Math.PI/2){const a=offset+index*Math.PI*2/total;return{x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r}}

  function svgMarkup(state=createViewState()){
    const view=inspectView(state),cx=300,cy=220;
    const ticks=Array.from({length:24},(_,i)=>{const a=polar(cx,cy,180,i,24),b=polar(cx,cy,i%4===0?198:191,i,24);return `<path class="i23-tick${i===state.tick%24?' active':''}" d="M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}"/>`}).join('');
    const am=polar(cx,cy,126,view.schedule.am.phase,8),pm=polar(cx,cy,164,view.schedule.pm.phase,12, -Math.PI/2);
    const nodes=[16,17,18,19].map((value,i)=>{const kind=arithmeticType(value).type.toLowerCase().replace('_','-');return `<g class="i23-number ${kind}" transform="translate(${150+i*100} 480)"><circle r="26"/><text text-anchor="middle" y="6">${value}</text><text class="i23-kind" text-anchor="middle" y="48">${arithmeticType(value).type.replace('_',' ')}</text></g>`}).join('');
    const coupling=`M${am.x.toFixed(2)} ${am.y.toFixed(2)}Q${cx} ${cy} ${pm.x.toFixed(2)} ${pm.y.toFixed(2)}`;
    const railDrops=[150,250,350,450].map(x=>`M${x} 506V520`).join('');
    return `<g class="i23-wheel layer-${state.layer.toLowerCase()}"><circle class="i23-ring master" cx="${cx}" cy="${cy}" r="198"/><circle class="i23-ring pm" cx="${cx}" cy="${cy}" r="164"/><circle class="i23-ring am" cx="${cx}" cy="${cy}" r="126"/>${ticks}<path class="i23-horizon" d="M78 ${cy}H522"/><path class="i23-coupling" d="${coupling}"/><text class="i23-mix-label" x="${cx}" y="${cy-12}" text-anchor="middle">± MIX</text><circle class="i23-marker am" cx="${am.x.toFixed(2)}" cy="${am.y.toFixed(2)}" r="10"/><circle class="i23-marker pm" cx="${pm.x.toFixed(2)}" cy="${pm.y.toFixed(2)}" r="10"/><circle class="i23-still${view.schedule.jointReturn?' return':''}" cx="${cx}" cy="${cy}" r="20"/><text class="i23-still-label" x="${cx}" y="${cy+2}" text-anchor="middle">STILL</text><text class="i23-kind" x="${cx}" y="${cy+36}" text-anchor="middle">S-HELL · OWNER MNEMONIC</text><text class="i23-label" x="${cx}" y="26" text-anchor="middle">2|3 IOTA BRIDGE · TICK ${state.tick}/24</text><text class="i23-label am" x="98" y="72">AM ⟳ · 3×8</text><text class="i23-label pm" x="430" y="72">PM ⟲ · 2×12</text><path class="i23-rail" d="M124 520H476 ${railDrops}"/>${nodes}</g>`;
  }

  function viewRecord(state=createViewState()){
    return Object.freeze({...buildRecord(),schema:'nexah.a0.iota-2-3-bridge-view/1',view:inspectView(state),classification:'BOUNDED_ENGINEERING_VIEW'});
  }

  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const section=doc.getElementById('iota23Bridge');if(!section)return null;
    const svg=doc.getElementById('iota23BridgeSvg'),status=doc.getElementById('iota23Status'),amOut=doc.getElementById('iota23Am'),pmOut=doc.getElementById('iota23Pm'),returnOut=doc.getElementById('iota23Return'),layerOut=doc.getElementById('iota23Layer'),play=doc.getElementById('iota23Play');
    let state=createViewState(),timer=null,lastFrameSignature='',ringChannel=host&&typeof host.BroadcastChannel==='function'?new host.BroadcastChannel('nexah-a0-iota-2-3-ring-v1'):null;
    const emitFrame=()=>{const frame=ringFrame(state),signature=JSON.stringify(frame);if(signature===lastFrameSignature)return;lastFrameSignature=signature;if(host&&typeof host.dispatchEvent==='function'&&typeof host.CustomEvent==='function')host.dispatchEvent(new host.CustomEvent('a0-iota-2-3-ring-frame',{detail:frame}));if(ringChannel)ringChannel.postMessage(frame)};
    const render=()=>{const view=inspectView(state);section.dataset.tick=String(state.tick);section.dataset.layer=state.layer.toLowerCase();if(svg)svg.innerHTML=svgMarkup(state);if(status)status.textContent=`T${String(state.tick).padStart(2,'0')} · ${view.returnStatus} · ${state.layer}`;if(amOut)amOut.textContent=`${view.schedule.am.phase}/8 · ${view.schedule.am.atOrigin?'ORIGIN':'OPEN'}`;if(pmOut)pmOut.textContent=`${view.schedule.pm.phase}/12 · ${view.schedule.pm.atOrigin?'ORIGIN':'OPEN'}`;if(returnOut)returnOut.textContent=view.returnStatus;if(layerOut)layerOut.textContent=state.layer;if(play){play.textContent=timer?'PAUSE':'PLAY';play.setAttribute('aria-pressed',timer?'true':'false')}emitFrame();return state};
    const stop=()=>{if(timer&&host&&host.clearInterval)host.clearInterval(timer);timer=null;state=Object.freeze({...state,playing:false})};
    const run=()=>{if(timer){stop();render();return}if(!host||typeof host.setInterval!=='function')return;state=Object.freeze({...state,playing:true});timer=host.setInterval(()=>{state=advance(state);render();if(state.tick===24){stop();render()}},550);render()};
    const stepButton=doc.getElementById('iota23Step'),reset=doc.getElementById('iota23Reset'),exportButton=doc.getElementById('iota23Export');
    if(stepButton)stepButton.addEventListener('click',()=>{stop();state=advance(state);render()});
    if(reset)reset.addEventListener('click',()=>{stop();state=createViewState();render()});
    if(play)play.addEventListener('click',run);
    Array.from(section.querySelectorAll?section.querySelectorAll('[data-i23-layer]'):[]).forEach(button=>button.addEventListener('click',()=>{state=setLayer(state,button.dataset.i23Layer);render()}));
    if(exportButton)exportButton.addEventListener('click',()=>{const json=JSON.stringify(viewRecord(state),null,2);section.dataset.lastExport=json;if(host&&host.Blob&&host.URL&&doc.createElement){const link=doc.createElement('a');link.href=host.URL.createObjectURL(new host.Blob([json],{type:'application/json'}));link.download='a0-iota-2-3-bridge-view.json';link.click();host.URL.revokeObjectURL(link.href)}});
    render();return Object.freeze({getState:()=>state,step(){stop();state=advance(state);return render()},reset(){stop();state=createViewState();return render()},setLayer(layer){state=setLayer(state,layer);return render()},record:()=>viewRecord(state)});
  }

  return{VERSION,IDENTITY,CLASSIFICATION,PERIODS,STILL_MNEMONIC,gcd,lcm,factorize,isPrime,arithmeticType,step,trace,exactArithmetic,typedAddress,verify,buildRecord,createViewState,advance,setLayer,inspectView,ringFrame,svgMarkup,viewRecord,mount};
});
