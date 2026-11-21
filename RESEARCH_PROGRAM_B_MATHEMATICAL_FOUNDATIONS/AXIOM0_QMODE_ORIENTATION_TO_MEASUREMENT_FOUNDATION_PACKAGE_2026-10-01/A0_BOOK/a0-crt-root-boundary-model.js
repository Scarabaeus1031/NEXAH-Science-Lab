(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0CrtRootBoundaryModel=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const VERSION='1.1.0';
  const CRT_MODULI=Object.freeze([7,11,37]);
  const CRT_PERIOD=7*11*37;
  const RING_CENTER=637;
  const RING_VALUES=Object.freeze([237,337,537,637,737,937]);
  const HEATMAP_COLUMNS=RING_VALUES;
  const LAYER_ANCHORS=Object.freeze([
    Object.freeze({residue37:0,label:'Fix',note:'additive fixed class'}),
    Object.freeze({residue37:4,label:'337',note:'ring marker 337'}),
    Object.freeze({residue37:8,label:'637',note:'ring marker 637; mod 7 = 0'}),
    Object.freeze({residue37:12,label:'937',note:'ring marker 937'}),
    Object.freeze({residue37:15,label:'237',note:'ring marker 237'}),
    Object.freeze({residue37:18,label:'N37',note:'additive inverse class of 19'}),
    Object.freeze({residue37:19,label:'537',note:'ring marker 537; inverse class 18'}),
    Object.freeze({residue37:32,label:'661/809',note:'boundary anchors; delta 148 = 4 × 37'}),
    Object.freeze({residue37:34,label:'737',note:'ring marker 737; mod 11 = 0'})
  ]);
  const CRT_ANCHORS=Object.freeze([
    Object.freeze({n:180,label:'P13:C'}),Object.freeze({n:237,label:'S0:237'}),Object.freeze({n:337,label:'S1:337'}),
    Object.freeze({n:537,label:'S2:537'}),Object.freeze({n:637,label:'S3:637'}),Object.freeze({n:661,label:'P30:R'}),
    Object.freeze({n:737,label:'S4:737'}),Object.freeze({n:809,label:'P31:L'}),Object.freeze({n:883,label:'P35:R'}),
    Object.freeze({n:937,label:'S5:937'}),Object.freeze({n:1031,label:'P37:L'})
  ]);
  const HEATMAP_ROWS=Object.freeze([
    Object.freeze({name:'Ceres',scores:Object.freeze([.38,.44,.35,.32,.38,.40])}),
    Object.freeze({name:'Earth',scores:Object.freeze([.40,.40,.40,.40,.40,.40])}),
    Object.freeze({name:'Eris',scores:Object.freeze([.39,.38,.31,.28,.26,.32])}),
    Object.freeze({name:'Jupiter',scores:Object.freeze([.33,.28,.30,.31,.38,.34])}),
    Object.freeze({name:'Mars',scores:Object.freeze([.29,.30,.32,.27,.36,.26])}),
    Object.freeze({name:'Mercury',scores:Object.freeze([.31,.38,.28,.29,.36,.31])}),
    Object.freeze({name:'Neptune',scores:Object.freeze([.43,.50,.38,.40,.46,.41])}),
    Object.freeze({name:'Pluto',scores:Object.freeze([.30,.40,.32,.37,.26,.35])}),
    Object.freeze({name:'Saturn',scores:Object.freeze([.53,.58,.64,.59,.55,.54])}),
    Object.freeze({name:'Uranus',scores:Object.freeze([.36,.26,.36,.26,.34,.26])}),
    Object.freeze({name:'Venus',scores:Object.freeze([.28,.26,.29,.32,.34,.40])})
  ]);

  function mod(n,m){return((n%m)+m)%m}
  function isPrime(n){if(!Number.isInteger(n)||n<2)return false;if(n%2===0)return n===2;for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;return true}
  function factorization(n){const out=[];let q=n;for(let p=2;p*p<=q;p+=(p===2?1:2)){let e=0;while(q%p===0){q/=p;e++}if(e)out.push([p,e])}if(q>1)out.push([q,1]);return Object.freeze(out.map(x=>Object.freeze(x)))}
  function formatFactorization(n){return factorization(n).map(([p,e])=>e===1?String(p):`${p}^${e}`).join(' × ')}
  function residues(n){return Object.freeze({mod3:mod(n,3),mod5:mod(n,5),mod7:mod(n,7),mod11:mod(n,11),mod37:mod(n,37)})}

  function ringRecord(slot){
    if(!Number.isInteger(slot)||slot<0||slot>=RING_VALUES.length)throw new RangeError('slot must be 0..5');
    const n=RING_VALUES[slot];
    return Object.freeze({slot,n,isPrime:isPrime(n),factorization:formatFactorization(n),residues:residues(n)});
  }

  function ringOperator(slot,operator='SOURCE'){
    const source=ringRecord(slot);
    if(operator==='SOURCE')return Object.freeze({operator,source,target:Object.freeze({slot,n:source.n}),closed:true,type:'NUMBER_AND_SLOT'});
    if(operator==='J6'){
      const targetSlot=mod(-slot,6);
      return Object.freeze({operator,source,target:Object.freeze({slot:targetSlot,n:RING_VALUES[targetSlot]}),closed:true,type:'SLOT_PERMUTATION'});
    }
    if(operator==='R637'){
      const n=2*RING_CENTER-source.n,targetSlot=RING_VALUES.indexOf(n);
      return Object.freeze({operator,source,target:Object.freeze({slot:targetSlot<0?null:targetSlot,n}),closed:targetSlot>=0,type:'INTEGER_REFLECTION'});
    }
    if(operator==='N37'){
      const r=source.residues.mod37;
      return Object.freeze({operator,source,target:Object.freeze({residue37:mod(-r,37)}),closed:true,type:'RESIDUE_NEGATION_ONLY'});
    }
    throw new RangeError('unknown operator');
  }

  function primesThroughIndex(maxIndex=150){
    const primes=[null];
    for(let n=2;primes.length<=maxIndex;n++)if(isPrime(n))primes.push(n);
    return Object.freeze(primes);
  }
  const PRIME_INDEX=primesThroughIndex(150);

  function seamRecord(k){
    if(!Number.isInteger(k)||k<1||k>=PRIME_INDEX.length)throw new RangeError(`k must be 1..${PRIME_INDEX.length-1}`);
    const p=PRIME_INDEX[k],sqrt=Math.sqrt(k),floor=Math.floor(sqrt),fraction=sqrt-floor,delta=Math.sqrt(k+1)-sqrt;
    return Object.freeze({k,p,sqrt,floor,fraction,delta,r37:mod(p,37),squareSeam:Number.isInteger(sqrt),twinClusterRole:k===120?'LEFT_TWIN_MEMBER':k===121?'LEFT_TWIN_ANCHOR':k===140?'RIGHT_TWIN_ANCHOR':(k>121&&k<140?'INTERIOR_INDEX':'OUTSIDE')});
  }

  function crtSlice(residue37=32){
    const cells=[];
    for(let n=mod(residue37,37);n<CRT_PERIOD;n+=37)cells.push(Object.freeze({n,mod7:mod(n,7),mod11:mod(n,11),mod37:mod(n,37),isPrime:isPrime(n),factorization:n>1?formatFactorization(n):String(n)}));
    return Object.freeze(cells);
  }
  function crtCell(mod7,mod11,residue37=32){return crtSlice(residue37).find(c=>c.mod7===mod(mod7,7)&&c.mod11===mod(mod11,11))||null}
  function crtLayerSummary(residue37=32){
    const r=mod(residue37,37),cells=crtSlice(r),ringMarkers=RING_VALUES.filter(n=>mod(n,37)===r),anchors=CRT_ANCHORS.filter(a=>mod(a.n,37)===r),anchor=LAYER_ANCHORS.find(a=>a.residue37===r)||null;
    return Object.freeze({residue37:r,inverse37:mod(-r,37),cellCount:cells.length,primeCount:cells.filter(c=>c.isPrime).length,ringMarkers:Object.freeze(ringMarkers),anchors:Object.freeze(anchors),label:anchor?anchor.label:null,note:anchor?anchor.note:null});
  }

  function heatmapRecord(row,column){
    if(!Number.isInteger(row)||row<0||row>=HEATMAP_ROWS.length||!Number.isInteger(column)||column<0||column>=HEATMAP_COLUMNS.length)throw new RangeError('heatmap index out of range');
    return Object.freeze({row,column,label:HEATMAP_ROWS[row].name,sourceMarker:HEATMAP_COLUMNS[column],score:HEATMAP_ROWS[row].scores[column],operatorPolicy:'FIXED_TO_SOURCE_MARKER_NOT_TRANSFORMED'});
  }

  function buildDataset(){
    return Object.freeze({
      schema:'nexah.a0.crt-root-boundary-audit/1.1.0',version:VERSION,
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','NN:CRT_QRT_37_CARRIER_LADDER','A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1']),
      ring:Object.freeze({center:RING_CENTER,records:Object.freeze(RING_VALUES.map((_,i)=>ringRecord(i))),operators:Object.freeze(['SOURCE','J6','R637','N37'])}),
      root:Object.freeze({domain:Object.freeze([115,142]),seamIndex:121,seamSquare:11,leftPrimeIndex:120,leftPrime:659,rightPrimeIndex:140,rightPrime:809,sharedResidue37:32}),
      crt:Object.freeze({moduli:CRT_MODULI,period:CRT_PERIOD,layerCount:37,cellsPerLayer:77,nodeCount:CRT_PERIOD,defaultResidue37:32,layerAnchors:LAYER_ANCHORS,anchors:CRT_ANCHORS}),
      heatmap:Object.freeze({columns:HEATMAP_COLUMNS,rows:HEATMAP_ROWS,authority:'OWNER_SUPPLIED_OBSERVATION_LAYER_NOT_OPERATOR_OUTPUT'}),
      corrections:Object.freeze(['Square roots of non-square integers are algebraic irrational, not transcendental.','R637 is not closed on the six supplied markers because 237 maps to 1037.','N37 negates residue classes only; it does not define a unique integer image.']),
      boundary:'The CRT register, root metric and observation scores remain separate typed layers. Shared coordinates or selected coincidences create no common mechanism, identity, physical law or scientific admission.'
    });
  }

  return Object.freeze({VERSION,CRT_MODULI,CRT_PERIOD,RING_CENTER,RING_VALUES,LAYER_ANCHORS,CRT_ANCHORS,HEATMAP_COLUMNS,HEATMAP_ROWS,mod,isPrime,factorization,formatFactorization,residues,ringRecord,ringOperator,primesThroughIndex,seamRecord,crtSlice,crtCell,crtLayerSummary,heatmapRecord,buildDataset});
});
