(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0LanternPanelVControlLens=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const profiles=Object.freeze({
    CERTIFIED_147_5:Object.freeze({label:'147,5° · CERTIFIED STOP',degrees:147.5,authority:'CERTIFIED'}),
    COMPARE_137_5:Object.freeze({label:'137,5° · −X COMPARISON',degrees:137.5,authority:'COMPARISON'}),
    DRIFT_MINUS_1_12:Object.freeze({label:'147,5° − 1/12°',degrees:147.5-1/12,authority:'COMPARISON'}),
    DRIFT_PLUS_1_12:Object.freeze({label:'147,5° + 1/12°',degrees:147.5+1/12,authority:'COMPARISON'})
  });
  const clamp=value=>Math.max(0,Math.min(1,Number(value)||0));
  function sample(profileKey,progress){
    const profile=profiles[profileKey]||profiles.CERTIFIED_147_5;
    const p=clamp(progress),phase=p<=0.5?'OUTBOUND':'RETURN';
    const travel=p<=0.5?p*2:(1-p)*2;
    const angle=profile.degrees*travel;
    const event=p===0?'OPEN':p===0.5?'STOP':p===1?'EXACT_RETURN':(p<0.25||p>0.75)?'SPLIT':'CONTACT';
    return Object.freeze({profileKey,profile,progress:p,phase,event,angle,channels:Object.freeze([1,2,3,4,5].map((n)=>Object.freeze({id:'θ'+n,angle})))});
  }
  function receipt(profileKey,history){
    const profile=profiles[profileKey]||profiles.CERTIFIED_147_5;
    const events=(history||[]).map(item=>({event:item.event,phase:item.phase,angle:Number(item.angle.toFixed(6))}));
    const returned=events.some(item=>item.event==='EXACT_RETURN'&&item.angle===0);
    return Object.freeze({schema:'A0_PANEL_V_CONTROL_LENS_RETURN_V1',identity:'ART:A0:MATHEMATICAL_JOINTS',profile:profileKey,authority:profile.authority,targetDegrees:profile.degrees,channels:['θ1','θ2','θ3','θ4','θ5'],events,exactReturn:returned,boundary:'VIEW/CONTROL COMPARISON ONLY · NO PHYSICAL CALIBRATION · NO NEW ID · NO NEW RELATION'});
  }
  return Object.freeze({profiles,sample,receipt});
});
