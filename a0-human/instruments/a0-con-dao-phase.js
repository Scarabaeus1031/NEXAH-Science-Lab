(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0ConDaoPhase=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function reading(model,tick,blend=1){
    if(model?.model_id!=='NEXAH:CON_DAO_BREATH:V1'||model.states.length!==13)throw Error('CON-DAO source model unavailable');
    if(!Number.isInteger(tick)||tick<0||!Number.isFinite(blend)||blend<0||blend>1)throw Error('invalid display tick/blend');
    const sequence=model.states.flatMap((s,i)=>Array.from({length:s.dwell||1},()=>i)),slot=tick%sequence.length,index=sequence[slot],state=model.states[index],previous=model.states[sequence[(slot+sequence.length-1)%sequence.length]],phase=s=>(6-s.depth)/6,u=blend*blend*(3-2*blend);
    return {model_id:model.model_id,tick,slot,tickCount:sequence.length,stateId:state.id,side:state.side,janusPartner:model.states[12-index].id,phase:phase(state),displayPhase:tick===0?phase(state):phase(previous)+(phase(state)-phase(previous))*u,blend,boundary:'source order and STILL dwell only; game step timing is a declared display coupling, not native 620ms time; Janus partner is not a Beta or AM/VM/PM assignment'};
  }
  return {reading};
});
