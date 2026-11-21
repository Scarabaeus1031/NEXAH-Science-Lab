(function(root,factory){
  const api=factory(root&&root.A0PrimeAddressCountershot);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimeProjectionSuite=api;
})(typeof window!=='undefined'?window:globalThis,function(countershot){
  'use strict';
  if(!countershot&&typeof require==='function')countershot=require('./a0-prime-address-countershot.js');
  const VERSION='1.0.0',LIMIT=1000,MODULUS=11;
  const mod=(n,m)=>((n%m)+m)%m;
  function factors(n){const out=[];let value=n;for(let d=2;d*d<=value;d+=d===2?1:2)while(value%d===0){out.push(d);value/=d}if(value>1)out.push(value);return Object.freeze(out)}
  function primeRank(n){return countershot.primesUpTo(n).length}
  function crtOrbit(){
    const rows=Array.from({length:21},(_,k)=>{const n=37+100*k,prime=countershot.isPrime(n);return Object.freeze({k,n,address:Object.freeze([mod(n,3),mod(n,5),mod(n,7)]),prime,primeRank:prime?primeRank(n):null,factors:prime?Object.freeze([n]):factors(n),cousinUp:prime&&countershot.isPrime(n+4),cousinDown:prime&&countershot.isPrime(n-4)})});
    return Object.freeze({sequence:'n=37+100k',period:21,step:Object.freeze([1,0,2]),rows:Object.freeze(rows),return:Object.freeze({next:2137,address:Object.freeze([1,2,2]),sameAsStart:true}),boundary:'The CRT address returns after 21 steps; the integer does not return.'});
  }
  function zoneAudit(mode='residue'){
    if(!['residue','cell'].includes(mode))throw new RangeError('mode must be residue or cell');
    const primes=countershot.primesUpTo(LIMIT),cuts=[[1,325],[326,650],[651,1000]],address=p=>mode==='cell'?mod(p-1,MODULUS):mod(p,MODULUS);
    const table=cuts.map(([lo,hi])=>Object.freeze(Array.from({length:MODULUS},(_,r)=>primes.filter(p=>p>=lo&&p<=hi&&address(p)===r).length)));
    const admissible=mode==='residue'?[1,2,3,4,5,6,7,8,9,10]:[0,1,2,3,4,5,6,7,8,9];
    const observed=table.map(row=>admissible.map(r=>row[r])),rowTotals=observed.map(row=>row.reduce((a,b)=>a+b,0)),colTotals=admissible.map((_,j)=>observed.reduce((a,row)=>a+row[j],0)),total=rowTotals.reduce((a,b)=>a+b,0);
    let chiSquare=0;observed.forEach((row,i)=>row.forEach((value,j)=>{const expected=rowTotals[i]*colTotals[j]/total;chiSquare+=(value-expected)**2/expected}));
    return Object.freeze({limit:LIMIT,mode,cuts:Object.freeze(cuts.map(x=>Object.freeze(x))),table:Object.freeze(table),admissible:Object.freeze(admissible),chiSquare,degreesOfFreedom:18,conclusion:'NO_VISIBLE_ZONE_ADDRESS_COUPLING',boundary:'Descriptive finite chi-square statistic; no preregistered inferential claim or prime law.'});
  }
  function snakeAddress(n,width){const index=n-1,row=Math.floor(index/width),offset=index%width,col=row%2===0?offset:width-1-offset;return Object.freeze({row,col})}
  function stripAudit(limit=LIMIT,width=25){
    const model=countershot.stripModel(limit,width),counts=Array.from({length:Math.ceil(limit/100)},(_,i)=>countershot.primesUpTo(Math.min(limit,(i+1)*100)).length-countershot.primesUpTo(i*100).length);
    const zones=model.zones.map(zone=>{const jumps=[];for(let i=1;i<zone.primes.length;i++){const a=snakeAddress(zone.primes[i-1],width),b=snakeAddress(zone.primes[i],width);jumps.push(Math.hypot(b.col-a.col,b.row-a.row))}return Object.freeze({id:zone.id,orientation:zone.orientation,range:Object.freeze([zone.min,zone.max]),primeCount:zone.primes.length,density:zone.primes.length/(zone.max-zone.min+1),meanJump:jumps.reduce((a,b)=>a+b,0)/Math.max(1,jumps.length)})});
    return Object.freeze({limit,width,primeCount:model.primeCount,density:model.primeCount/limit,counts:Object.freeze(counts),zones:Object.freeze(zones),flipAddress:Object.freeze([90,90,270]),orientationResidual:90,boundary:'Snake order and zone flips are declared projections. Density is arithmetic; mean projected jump changes with strip width.'});
  }
  function audit(){const crt=crtOrbit(),zone=zoneAudit(),strip=stripAudit();return Object.freeze({schema:'nexah.a0.prime-projection-suite/1.0.0',version:VERSION,identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','NN:CRT_QRT_37_CARRIER_LADDER','NEXAH:PBM:V1']),checks:Object.freeze({crtPeriod:crt.period,crtPrimeCarriers:crt.rows.filter(r=>r.prime).length,crtCousinEvents:crt.rows.filter(r=>r.cousinUp).length,zoneChiSquare:zone.chiSquare,zoneDf:zone.degreesOfFreedom,primeCount:strip.primeCount}),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),boundary:'Finite visual audit suite only; no new prime theory, coupling, mechanism, Study, Finding or publication authority.'})}
  return Object.freeze({VERSION,LIMIT,MODULUS,mod,factors,crtOrbit,zoneAudit,snakeAddress,stripAudit,audit});
});
