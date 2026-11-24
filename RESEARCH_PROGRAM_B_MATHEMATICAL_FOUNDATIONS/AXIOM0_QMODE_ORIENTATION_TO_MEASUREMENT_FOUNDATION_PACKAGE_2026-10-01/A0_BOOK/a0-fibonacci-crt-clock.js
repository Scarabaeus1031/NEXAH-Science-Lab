(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0FibonacciCrtClock=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SCHEMA='a0.fibonacci-crt-clock/1.0.0';
  const MODULI=Object.freeze([7,11,37]);
  const PERIODS=Object.freeze({7:16,11:10,37:76,joint:1520});
  const CARRIER=7*11*37;
  const ROLES=Object.freeze(['A','B','SUM']);
  const VIEWS=Object.freeze(['RECURRENCE','GOLDEN','UNIFORM']);
  const PHI=(1+Math.sqrt(5))/2;
  const TAU=2*Math.PI;

  function ensure(condition,code){if(!condition)throw new TypeError(code)}
  function gcd(a,b){while(b){const next=a%b;a=b;b=next}return Math.abs(a)}
  function lcm(a,b){return Math.abs(a*b)/gcd(a,b)}
  function mod(value,modulus){return((value%modulus)+modulus)%modulus}
  function extendedGcd(a,b){if(b===0)return[a,1,0];const[g,x,y]=extendedGcd(b,a%b);return[g,y,x-Math.floor(a/b)*y]}
  function inverse(value,modulus){const[g,x]=extendedGcd(value,modulus);ensure(g===1,'FIB_CRT_INVERSE_MISSING');return mod(x,modulus)}
  function crt(residues,moduli=MODULI){
    ensure(residues.length===moduli.length,'FIB_CRT_ARITY_INVALID');
    const product=moduli.reduce((acc,value)=>acc*value,1);
    let total=0;
    residues.forEach((residue,index)=>{const partial=product/moduli[index];total+=mod(residue,moduli[index])*partial*inverse(partial,moduli[index])});
    return mod(total,product);
  }
  function fibPairMod(index,modulus){
    ensure(Number.isInteger(index)&&index>=0,'FIB_INDEX_INVALID');
    ensure(Number.isInteger(modulus)&&modulus>=2,'FIB_MODULUS_INVALID');
    let a=0,b=1;
    for(let step=0;step<index;step+=1)[a,b]=[b,(a+b)%modulus];
    return Object.freeze([a,b]);
  }
  function fibPairBigInt(index){
    ensure(Number.isInteger(index)&&index>=0,'FIB_INDEX_INVALID');
    let a=0n,b=1n;
    for(let step=0;step<index;step+=1)[a,b]=[b,a+b];
    return Object.freeze([a,b]);
  }
  function pisanoPeriod(modulus){
    ensure(Number.isInteger(modulus)&&modulus>=2,'FIB_MODULUS_INVALID');
    let a=0,b=1;
    for(let step=1;step<=6*modulus*modulus;step+=1){[a,b]=[b,(a+b)%modulus];if(a===0&&b===1)return step}
    throw new RangeError('FIB_PERIOD_NOT_FOUND');
  }
  function abbreviated(value){
    const text=String(value);
    return text.length<=28?text:`${text.slice(0,12)}…${text.slice(-12)} (${text.length} digits)`;
  }
  function taggedAddress(role,residue){
    const index=ROLES.indexOf(role);
    ensure(index>=0,'FIB_ROLE_INVALID');
    return index*37+mod(residue,37);
  }
  function angleFor(view,index,scalar){
    ensure(VIEWS.includes(view),'FIB_VIEW_INVALID');
    if(view==='GOLDEN')return mod(index*TAU/(PHI*PHI),TAU);
    if(view==='UNIFORM')return mod(index*TAU/PERIODS.joint,TAU);
    return scalar/CARRIER*TAU;
  }
  function state(index,view='RECURRENCE'){
    ensure(Number.isInteger(index)&&index>=0&&index<=PERIODS.joint,'FIB_CLOCK_INDEX_INVALID');
    ensure(VIEWS.includes(view),'FIB_VIEW_INVALID');
    const exact=fibPairBigInt(index);
    const byMod=Object.fromEntries(MODULI.map(modulus=>{
      const pair=fibPairMod(index,modulus);
      return[modulus,Object.freeze({a:pair[0],b:pair[1],sum:(pair[0]+pair[1])%modulus,return:pair[0]===0&&pair[1]===1})];
    }));
    const aCrt=crt(MODULI.map(modulus=>byMod[modulus].a));
    const bCrt=crt(MODULI.map(modulus=>byMod[modulus].b));
    const sum37=byMod[37].sum;
    return Object.freeze({
      index,view,
      exact:Object.freeze({a:exact[0],b:exact[1],aLabel:abbreviated(exact[0]),bLabel:abbreviated(exact[1])}),
      residues:Object.freeze(byMod),
      crt:Object.freeze({a:aCrt,b:bCrt,modulus:CARRIER}),
      grid:Object.freeze({a:Object.freeze({x:byMod[7].a,y:byMod[11].a}),b:Object.freeze({x:byMod[7].b,y:byMod[11].b}),layerA:byMod[37].a,layerB:byMod[37].b}),
      register74:Object.freeze([{role:'A',residue:byMod[37].a,address:taggedAddress('A',byMod[37].a)},{role:'B',residue:byMod[37].b,address:37+byMod[37].b}]),
      register111:Object.freeze([{role:'A',residue:byMod[37].a,address:taggedAddress('A',byMod[37].a)},{role:'B',residue:byMod[37].b,address:taggedAddress('B',byMod[37].b)},{role:'SUM',residue:sum37,address:taggedAddress('SUM',sum37)}]),
      angle:angleFor(view,index,aCrt),
      returns:Object.freeze({mod7:byMod[7].return,mod11:byMod[11].return,mod37:byMod[37].return,full:MODULI.every(modulus=>byMod[modulus].return)}),
      boundary:view==='RECURRENCE'?'EXACT_FINITE_RECURRENCE':view==='GOLDEN'?'QUASIPERIODIC_DISPLAY_NO_FINITE_RETURN':'MATCHED_UNIFORM_DISPLAY_CONTROL'
    });
  }
  function buildReceipt(){
    return Object.freeze({
      schema:SCHEMA,
      source_reuse:Object.freeze(['a0-game-of-worlds-model.js','assets/game-of-worlds-play/three-domain-transition-test/fibonacci-view.js','a0-fibonacci-ring-operator-comparator-r1.js']),
      carrier:Object.freeze({moduli:MODULI,product:CARRIER,visible_slice:'Z7×Z11',layer:'Z37'}),
      periods:Object.freeze({...PERIODS,computedJoint:lcm(lcm(PERIODS[7],PERIODS[11]),PERIODS[37])}),
      registers:Object.freeze({two_lane:74,three_lane:111,pair_state_space:37*37}),
      comparator_result:'PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED',
      claim_boundary:'Exact Fibonacci recurrence and Pisano returns; golden angle is display geometry; no Fibonacci-prime law, natural resonance or physical mechanism.',
      authority:Object.freeze({reused_ids:Object.freeze(['MOD:NUMBER_VIEW_SUITE','NN:CRT_QRT_37_CARRIER_LADDER','NEXAH:PBM:V1']),new_canonical_ids:Object.freeze([]),relation_changes:Object.freeze([]),aliases:Object.freeze([]),study_activation:false})
    });
  }
  function validate(receipt=buildReceipt()){
    ensure(receipt.periods[7]===pisanoPeriod(7)&&receipt.periods[11]===pisanoPeriod(11)&&receipt.periods[37]===pisanoPeriod(37),'FIB_PERIOD_INVALID');
    ensure(receipt.periods.joint===1520&&receipt.periods.computedJoint===1520&&pisanoPeriod(CARRIER)===1520,'FIB_JOINT_RETURN_INVALID');
    ensure(receipt.registers.two_lane===74&&receipt.registers.three_lane===111&&receipt.registers.pair_state_space===1369,'FIB_REGISTER_INVALID');
    ensure(receipt.authority.new_canonical_ids.length===0&&receipt.authority.relation_changes.length===0&&!receipt.authority.study_activation,'FIB_AUTHORITY_INVALID');
    return receipt;
  }
  function svgFor(current){
    const W=920,H=430,left={x:54,y:50,w:430,h:330},right={cx:704,cy:214,r:145};
    const dx=left.w/6,dy=left.h/10;
    const nodes=[];
    for(let y=0;y<11;y+=1)for(let x=0;x<7;x+=1)nodes.push(`<circle cx="${(left.x+x*dx).toFixed(2)}" cy="${(left.y+(10-y)*dy).toFixed(2)}" r="2.3"/>`);
    const history=[];
    for(let step=0;step<=current.index;step+=Math.max(1,Math.floor(Math.max(1,current.index)/260))){
      const sample=state(step,current.view),radius=24+right.r*.78*(step/PERIODS.joint),x=right.cx+Math.cos(sample.angle)*radius,y=right.cy-Math.sin(sample.angle)*radius;
      history.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    function gridPoint(point){return{x:left.x+point.x*dx,y:left.y+(10-point.y)*dy}}
    const a=gridPoint(current.grid.a),b=gridPoint(current.grid.b);
    const polarRadius=24+right.r*.78*(current.index/PERIODS.joint),px=right.cx+Math.cos(current.angle)*polarRadius,py=right.cy-Math.sin(current.angle)*polarRadius;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fibonacci CRT clock over Z7 by Z11 with mod37 layer and typed polar comparator"><text class="fib-svg-title" x="54" y="24">EXACT PAIR ADDRESS · Z7 × Z11</text><g class="fib-grid-nodes">${nodes.join('')}</g><path class="fib-pair-line" d="M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}"/><circle class="fib-point fib-point--a" cx="${a.x.toFixed(2)}" cy="${a.y.toFixed(2)}" r="12"/><circle class="fib-point fib-point--b" cx="${b.x.toFixed(2)}" cy="${b.y.toFixed(2)}" r="9"/><text class="fib-point-label" x="${a.x.toFixed(2)}" y="${(a.y-17).toFixed(2)}" text-anchor="middle">A · ${current.grid.a.x},${current.grid.a.y}</text><text class="fib-point-label" x="${b.x.toFixed(2)}" y="${(b.y+25).toFixed(2)}" text-anchor="middle">B · ${current.grid.b.x},${current.grid.b.y}</text><text class="fib-axis-label" x="54" y="412">x = mod 7 · y = mod 11 · layer A/B = ${current.grid.layerA}/${current.grid.layerB} mod 37</text><text class="fib-svg-title" x="704" y="24" text-anchor="middle">${current.view} VIEW</text><circle class="fib-ring" cx="${right.cx}" cy="${right.cy}" r="${right.r}"/><circle class="fib-ring" cx="${right.cx}" cy="${right.cy}" r="${right.r*.5}"/><line class="fib-axis" x1="${right.cx-right.r}" y1="${right.cy}" x2="${right.cx+right.r}" y2="${right.cy}"/><line class="fib-axis" x1="${right.cx}" y1="${right.cy-right.r}" x2="${right.cx}" y2="${right.cy+right.r}"/><polyline class="fib-trace" points="${history.join(' ')}"/><circle class="fib-polar-point" cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="7"/><text class="fib-axis-label" x="704" y="397" text-anchor="middle">θ ${(current.angle*180/Math.PI).toFixed(3)}° · ${current.boundary}</text></svg>`;
  }
  function mount(host){
    if(!host)return null;
    let index=0,view='RECURRENCE',timer=null;
    const q=selector=>host.querySelector(selector);
    function render(){
      const current=state(index,view);
      q('[data-fib-index]').value=String(index);q('[data-fib-index-out]').textContent=String(index);
      q('[data-fib-stage]').innerHTML=svgFor(current);
      q('[data-fib-exact]').textContent=`Fₙ=${current.exact.aLabel} · Fₙ₊₁=${current.exact.bLabel}`;
      q('[data-fib-address]').textContent=`A ${current.crt.a} mod 2849 → (${current.grid.a.x},${current.grid.a.y}|${current.grid.layerA}) · B ${current.crt.b} mod 2849 → (${current.grid.b.x},${current.grid.b.y}|${current.grid.layerB})`;
      q('[data-fib-returns]').innerHTML=[['mod 7',16,current.returns.mod7],['mod 11',10,current.returns.mod11],['mod 37',76,current.returns.mod37],['FULL CRT',1520,current.returns.full]].map(([label,period,on])=>`<span class="${on?'is-return':''}">${label} · π=${period} · ${on?'RETURN':'open'}</span>`).join('');
      q('[data-fib-register74]').textContent=current.register74.map(item=>`${item.role}#${item.address}=r${item.residue}`).join(' · ');
      q('[data-fib-register111]').textContent=current.register111.map(item=>`${item.role}#${item.address}=r${item.residue}`).join(' · ')+` · ${current.register111[0].residue}+${current.register111[1].residue}≡${current.register111[2].residue} (mod 37)`;
      host.querySelectorAll('[data-fib-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.fibView===view)));
      q('[data-fib-mode-boundary]').textContent=current.boundary;
    }
    function stop(){if(timer!==null){clearInterval(timer);timer=null}const button=q('[data-fib-action="play"]');if(button)button.textContent='PLAY'}
    q('[data-fib-index]').addEventListener('input',event=>{stop();index=Number(event.target.value);render()});
    host.addEventListener('click',event=>{
      const viewButton=event.target.closest('[data-fib-view]');if(viewButton){view=viewButton.dataset.fibView;render();return}
      const jump=event.target.closest('[data-fib-jump]');if(jump){stop();index=Number(jump.dataset.fibJump);render();return}
      const action=event.target.closest('[data-fib-action]');if(!action)return;
      if(action.dataset.fibAction==='step'){stop();index=(index+1)% (PERIODS.joint+1);render()}
      else if(action.dataset.fibAction==='reset'){stop();index=0;render()}
      else if(action.dataset.fibAction==='play'){
        if(timer!==null){stop();return}
        action.textContent='PAUSE';timer=setInterval(()=>{index=index>=PERIODS.joint?0:index+1;render()},70);
      }
    });
    render();
    return{receipt:buildReceipt(),state,select(next){stop();index=Number(next);render()},setView(next){view=next;render()},stop,get current(){return state(index,view)}};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-fibonacci-crt-clock]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}
  return{SCHEMA,MODULI,PERIODS,CARRIER,ROLES,VIEWS,gcd,lcm,crt,fibPairMod,fibPairBigInt,pisanoPeriod,taggedAddress,angleFor,state,buildReceipt,validate,svgFor,mount,mountAll};
});
