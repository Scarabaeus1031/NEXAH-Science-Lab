/* Reuse only Game of Numbers' self-contained carrier/elevator rail APIs. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.A0ClubCarrierSequence=api;
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function createSequence(model){
  let mode='carrier',seed=11537,session=model.start('carrier'),following=true,loop=false,last=null,cycles=0;
  function snapshot(){
   const f=session.frames[session.cursor],family=model.elevatorFamily(f);
   const n=mode==='manual'?String(seed):mode==='carrier'?f.state.a:family.find(x=>x.seed===String(seed)).decimal;
   return{mode,seed,following,loop,cycles,index:mode==='manual'?0:session.cursor,limit:mode==='manual'?0:model.limit(mode),
    ended:mode!=='manual'&&session.cursor===model.limit(mode),n:Number(n),coordinate:model.codec(n),family,
    source:'a0-game-of-numbers-model.js',clock:'ONE_NATIVE_RAIL_STEP_PER_OBSERVED_PLAYER_ADDRESS_CHANGE'};
  }
  function reset(){session=model.start(mode==='manual'?'carrier':mode);cycles=0;}
  function advance(){
   if(mode==='manual')return false;
   if(session.cursor===model.limit(mode)){if(!loop)return false;session=model.at(session,0);cycles++;return true;}
   session=model.step(session);return true;
  }
  return{snapshot,observe(s,running){
   if(!s){last=null;return false;}
   if(!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15)return false;
   const changed=last!==null&&last!==s.q4Address;last=s.q4Address;
   return !!(changed&&running===true&&following&&advance());
  },mode(value){if(!['manual','carrier','elevator'].includes(value))return false;mode=value;reset();return true;},
   seed(value){if(!model.elevatorFamily(model.start('elevator').frames[0]).some(x=>x.seed===String(value)))return false;seed=value;return true;},
   follow:value=>{following=!!value;},loop:value=>{loop=!!value;},reset,
   step(){following=false;return advance();}};
 }
 return{createSequence};
});
