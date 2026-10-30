(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0CPinIOI=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SAMPLE_COUNT=101;
  function stateAt(index){
    const k=Math.max(0,Math.min(SAMPLE_COUNT-1,Math.round(Number(index)||0)));
    const phase=k/(SAMPLE_COUNT-1);
    const signedClearance=Math.cos(phase*Math.PI*2);
    const zone=signedClearance>1e-9?'INSIDE':signedClearance<-1e-9?'OUTSIDE':'BOUNDARY';
    return Object.freeze({index:k,phase,signedClearance,zone});
  }
  function sequence(){return Object.freeze(Array.from({length:SAMPLE_COUNT},(_,index)=>stateAt(index)))}
  function returned(state){return state.index===SAMPLE_COUNT-1&&state.zone==='INSIDE'&&Math.abs(state.signedClearance-1)<1e-12}
  return Object.freeze({SAMPLE_COUNT,stateAt,sequence,returned});
});
