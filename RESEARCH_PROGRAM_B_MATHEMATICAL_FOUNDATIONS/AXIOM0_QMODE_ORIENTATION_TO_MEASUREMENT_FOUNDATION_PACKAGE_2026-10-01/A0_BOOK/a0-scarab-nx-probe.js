(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0ScarabNxProbe=api;
  if(root.document){
    const boot=()=>root.document.querySelectorAll('[data-scarab-nx-probe]').forEach(node=>api.mount(node));
    root.document.readyState==='loading'?root.document.addEventListener('DOMContentLoaded',boot):boot();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const CORE_MODULI=[7,11,13,17,19];
  const CONTROL_MODULI=[3,5];
  const DEFAULT_LIMIT=5000;

  function sieve(limit){
    const n=Math.max(3,Math.trunc(Number(limit)||DEFAULT_LIMIT));
    const composite=new Uint8Array(n);
    const primes=[];
    for(let value=2;value<n;value++){
      if(composite[value])continue;
      primes.push(value);
      if(value*value<n)for(let k=value*value;k<n;k+=value)composite[k]=1;
    }
    return {limit:n,composite,primes};
  }

  function isPrime(value){
    const n=Math.trunc(Number(value));
    if(n<2)return false;
    if(n%2===0)return n===2;
    for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;
    return true;
  }

  function factorize(value){
    let n=Math.abs(Math.trunc(Number(value))),d=2;
    const factors=[];
    while(d*d<=n){
      while(n%d===0){factors.push(d);n/=d;}
      d=d===2?3:d+2;
    }
    if(n>1)factors.push(n);
    return factors;
  }

  function edgeSet(primes,modulus){
    const edges=new Set();
    for(let i=0;i<primes.length-1;i++){
      const a=primes[i],b=primes[i+1];
      if(a>modulus&&b>modulus)edges.add(`${a%modulus},${b%modulus}`);
    }
    return edges;
  }

  function neighbors(value,primes){
    let lo=0,hi=primes.length;
    while(lo<hi){const mid=(lo+hi)>>1;if(primes[mid]<value)lo=mid+1;else hi=mid;}
    const at=lo<primes.length&&primes[lo]===value;
    return {
      isCarrierPrime:at,
      lower:primes[at?lo-1:lo-1],
      upper:primes[at?lo+1:lo]
    };
  }

  function sensor(value,lower,upper,modulus,edges){
    const residues=[lower%modulus,value%modulus,upper%modulus];
    const incoming=`${residues[0]},${residues[1]}`;
    const outgoing=`${residues[1]},${residues[2]}`;
    const zeroHit=residues[1]===0;
    const novelIncoming=!edges.has(incoming);
    const novelOutgoing=!edges.has(outgoing);
    return {
      modulus,residues,zeroHit,novelIncoming,novelOutgoing,
      detected:zeroHit||novelIncoming||novelOutgoing,
      edgeCount:edges.size,
      possibleEdges:(modulus-1)*(modulus-1),
      filling:edges.size/((modulus-1)*(modulus-1))
    };
  }

  function analyze(value,options){
    const nx=Math.trunc(Number(value));
    const limit=Math.max(DEFAULT_LIMIT,Math.trunc(Number(options&&options.limit)||DEFAULT_LIMIT),nx+2);
    const includeControls=!!(options&&options.includeControls);
    const data=sieve(limit);
    const around=neighbors(nx,data.primes);
    if(!Number.isFinite(nx)||nx<4||!around.lower||!around.upper)throw new RangeError('nₓ must have prime neighbours inside the carrier');
    const moduli=includeControls?CONTROL_MODULI.concat(CORE_MODULI):CORE_MODULI.slice();
    const sensors=moduli.map(modulus=>sensor(nx,around.lower,around.upper,modulus,edgeSet(data.primes,modulus)));
    const directPrime=isPrime(nx);
    return {
      schema:'nexah.a0.scarab-nx-probe/1',
      nx,limit,directPrime,
      classification:directPrime?'LEGIT_PRIME':'INJECTED_COMPOSITE',
      lower:around.lower,upper:around.upper,
      factors:directPrime?[nx]:factorize(nx),
      sensors,
      detectedBy:sensors.filter(item=>item.detected).map(item=>item.modulus),
      zeroHits:sensors.filter(item=>item.zeroHit).map(item=>item.modulus),
      silentAt:sensors.filter(item=>!item.detected).map(item=>item.modulus)
    };
  }

  function sweep(limit,moduli){
    const data=sieve(limit||DEFAULT_LIMIT);
    const use=(moduli||CORE_MODULI).slice();
    const edges=Object.fromEntries(use.map(m=>[m,edgeSet(data.primes,m)]));
    let tested=0,detected=0;
    for(let nx=20;nx<data.limit;nx++){
      if(!data.composite[nx])continue;
      const around=neighbors(nx,data.primes);
      if(!around.lower||!around.upper)continue;
      tested++;
      if(use.some(m=>sensor(nx,around.lower,around.upper,m,edges[m]).detected))detected++;
    }
    return {limit:data.limit,moduli:use,tested,detected,silent:tested-detected,rate:detected/tested};
  }

  function mount(host){
    if(host.dataset.scarabMounted==='true')return;
    host.dataset.scarabMounted='true';
    const input=host.querySelector('[data-snx-input]');
    const controls=host.querySelector('[data-snx-controls]');
    const status=host.querySelector('[data-snx-status]');
    const route=host.querySelector('[data-snx-route]');
    const sensorsHost=host.querySelector('[data-snx-sensors]');
    const signature=host.querySelector('[data-snx-signature]');
    const factors=host.querySelector('[data-snx-factors]');
    const detected=host.querySelector('[data-snx-detected]');
    const silent=host.querySelector('[data-snx-silent]');

    function render(){
      let result;
      try{result=analyze(input.value,{includeControls:controls.checked});}
      catch(error){status.textContent='OUT OF RANGE';host.dataset.state='error';return;}
      host.dataset.state=result.directPrime?'prime':(result.detectedBy.length?'detected':'silent');
      status.textContent=result.directPrime?'LEGIT PRIME':(result.detectedBy.length?'COMPOSITE · SENSOR HIT':'COMPOSITE · SILENT PASS');
      route.innerHTML=`<span>${result.lower}</span><i>→</i><strong>${result.nx}<small>${result.directPrime?'carrier prime':'injected nₓ'}</small></strong><i>→</i><span>${result.upper}</span>`;
      factors.textContent=result.directPrime?'prime':`${result.nx} = ${result.factors.join(' × ')}`;
      signature.textContent=`(${result.sensors.map(item=>item.residues[1]).join(', ')})`;
      detected.textContent=result.detectedBy.length?result.detectedBy.map(m=>`mod ${m}`).join(' · '):'none';
      silent.textContent=result.silentAt.length?result.silentAt.map(m=>`mod ${m}`).join(' · '):'none';
      sensorsHost.innerHTML=result.sensors.map(item=>{
        const state=result.directPrime?'legit':item.zeroHit?'zero':item.detected?'novel':'silent';
        const label=result.directPrime?'LEGIT EDGE':item.zeroHit?'ZERO HIT':item.detected?'NOVEL EDGE':'SILENT PASS';
        return `<article data-sensor-state="${state}"><header><b>mod ${item.modulus}</b><em>${label}</em></header><strong>${item.residues[0]} → ${item.residues[1]} → ${item.residues[2]}</strong><small>${item.edgeCount}/${item.possibleEdges} legitimate edges · ${(100*item.filling).toFixed(1)}%</small></article>`;
      }).join('');
    }

    host.querySelectorAll('[data-snx-preset]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.snxPreset;render();}));
    input.addEventListener('change',render);
    controls.addEventListener('change',render);
    render();
  }

  return {CORE_MODULI,CONTROL_MODULI,DEFAULT_LIMIT,sieve,isPrime,factorize,edgeSet,neighbors,sensor,analyze,sweep,mount};
});
