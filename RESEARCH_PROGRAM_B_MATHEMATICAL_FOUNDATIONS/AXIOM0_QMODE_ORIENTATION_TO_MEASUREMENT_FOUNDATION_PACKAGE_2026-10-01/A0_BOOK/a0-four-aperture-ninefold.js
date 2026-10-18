(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0FourApertureNinefold=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',SCHEMA='nexah.a0.four-aperture-ninefold-return/1';
  const PHASES=Object.freeze([
    {id:'OUT-1',face:0,direction:'OUT'},{id:'OUT-2',face:12,direction:'OUT'},{id:'OUT-3',face:24,direction:'OUT'},{id:'OUT-4',face:36,direction:'OUT'},
    {id:'CENTER',face:48,direction:'PIVOT'},
    {id:'IN-4',face:36,direction:'IN'},{id:'IN-3',face:24,direction:'IN'},{id:'IN-2',face:12,direction:'IN'},{id:'IN-1',face:0,direction:'IN'}
  ].map(Object.freeze));
  function createState(overrides={}){return Object.assign({schema:SCHEMA,version:VERSION,index:-1,running:false,completed:false,anchor:null,events:[]},overrides)}
  function next(state){const index=Math.min(PHASES.length-1,state.index+1),phase=PHASES[index];return Object.assign({},state,{index,running:index<PHASES.length-1,completed:index===PHASES.length-1,events:[...state.events,{sequence:state.events.length+1,...phase}].slice(-32)})}
  function angleFor(phase){if(phase.direction==='OUT')return 16+Number(phase.id.at(-1))*7;if(phase.direction==='IN')return 0;return 0}
  function record(state,receipt=null){return{schema:SCHEMA,version:VERSION,status:state.completed?(receipt?.exact?'RETURN_EXACT':'PROGRAM_COMPLETE'):'IN_PROGRESS',grammar:'4×2+1',apertureFaces:[0,12,24,36],centralView:'RETURN-00:F01',views:PHASES.length,index:state.index,events:state.events.slice(),sourceReturn:receipt,authority:{newCarrier:false,newIdentity:false,researchExecution:false}}}
  return{VERSION,SCHEMA,PHASES,createState,next,angleFor,record};
});
