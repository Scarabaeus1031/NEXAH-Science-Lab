(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-pentagon-contract.js'):root.A0PentagonContract);if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0SeedCross=api;root.A0SeedCrossView=api.mount(root.document,root);}})(typeof globalThis!=='undefined'?globalThis:this,function(P){
  'use strict';
  const LIMIT=128;
  function pairAt(index){
    if(!Number.isInteger(index)||index<0||index>LIMIT)throw Error('seed step outside 0..128');
    let a=1n,b=1n;for(let k=0;k<index;k++)[a,b]=[b,a+b];
    return{schema:'a0.seed-cross-view/1',index,pair:[String(a),String(b)],sum:String(a+b),plus:[String(a),String(b)],minus:[String(a),String(-b)],seed:index===0,primeEleven:'11',ownerReading:'pink 2: local reading of the joined seed ones, not decimal eleven or Euclidean length',basis:{I:[1,0],J:[0,1],rule:'a I + b J; a I - b J; declared orthonormal plane'},rule:'(a,b) -> (b,a+b)',wholeMachineReturn:false};
  }
  function pentagon(record){
    if(record?.schema!=='nexah.a0.pentagon-bench-connection/1'||record.status!=='READY'||record.pending)return{status:'HOLD',reason:'Kein aktueller bestätigter PENT-Witness'};
    try{const w=P.witness(record.currentWitness);return{status:'READ_ONLY',revision:w.revision,mode:w.state.mode,register:w.state.dRegister,branchWord:w.state.branchWord,scope:'six-field PENT UI witness; not a Fibonacci or CRT tile identity'};}catch(_){return{status:'HOLD',reason:'PENT-Witness ungültig'};}
  }
  function mount(doc,win){
    const host=doc?.getElementById('seedCrossMonitor');if(!host)return null;
    const el=id=>doc.getElementById(id);let index=0,off=null;
    function snapshot(){return{...pairAt(index),pentagon:pentagon(win.A0PentagonBench?.exportRecord?.()),tile:{href:'A0_PINK_DIAMOND_GRID_ATLAS.html#crt16-tile',status:'DOCUMENTARY_REFERENCE_NOT_LIVE_BOUND',rule:'16 CRT channels begin at modulus 17; declared 15+1 Pentagon display',seedMapping:null}};}
    function render(){
      const r=snapshot(),[a,b]=r.pair;
      el('seedCrossPair').textContent=`(${a}, ${b}) · Schritt ${index}`;
      el('seedCrossReading').textContent=r.seed?'1 | 1 → 1 + 1 = 2 · „pink 2“ (Owner-Lesart)':'Geordnetes Paar erhalten · a + b = '+r.sum;
      el('seedCrossVectors').textContent=`aI + bJ = (${a}, ${b}); aI − bJ = (${a}, −${b}). Bei (1,1): Länge √2, nicht 2.`;
      el('seedCrossPentagon').textContent=r.pentagon.status==='READ_ONLY'?`PENT mitgelesen · rev ${r.pentagon.revision} · ${r.pentagon.mode} · D${r.pentagon.register+1} · ${r.pentagon.branchWord}`:'PENT · HOLD · '+r.pentagon.reason;
      el('seedCrossLedger').textContent=JSON.stringify(r,null,2);el('seedCrossStep').disabled=index===LIMIT;el('seedCrossBack').disabled=index===0;
      // Uniform display scaling only; numeric coordinates remain in the ledger.
      const scale=64/Math.max(Number(a),Number(b)),x=120+Number(a)*scale,y=100-Number(b)*scale;
      el('seedCrossPlus').setAttribute('x2',x);el('seedCrossPlus').setAttribute('y2',y);
      el('seedCrossMinus').setAttribute('x2',x);el('seedCrossMinus').setAttribute('y2',200-y);
      return r;
    }
    el('seedCrossStep').addEventListener('click',()=>{if(index<LIMIT)index++;render();});
    el('seedCrossBack').addEventListener('click',()=>{if(index>0)index--;render();});
    el('seedCrossReset').addEventListener('click',()=>{index=0;render();});
    el('seedCrossRead').addEventListener('click',render);
    if(win.A0PentagonBench?.subscribe)off=win.A0PentagonBench.subscribe(render);
    win.addEventListener?.('pagehide',()=>off?.());render();return Object.freeze({snapshot,render});
  }
  return{LIMIT,pairAt,pentagon,mount};
});
