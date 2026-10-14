(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0Axis08FoldReturnSequencer=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='A0_AXIS08_FOLD_RETURN_SEQUENCER_V1';
  const PHASES=[
    {id:'carrier',label:'Carrier',role:'eight-number source view'},
    {id:'breath',label:'Breath',role:'display radius only'},
    {id:'poles',label:'8 poles',role:'eight source coordinates'},
    {id:'split',label:'Split',role:'select adjacent pair'},
    {id:'fold',label:'Fold',role:'8 to 7 quotient plus residual'},
    {id:'janus',label:'Janus',role:'reverse pair orientation'},
    {id:'third',label:'Third form',role:'relation view, not new source'},
    {id:'return',label:'Return',role:'7 plus residual reconstructs 8'}
  ];
  function assertValues(values){if(!Array.isArray(values)||values.length!==8||!values.every(Number.isFinite))throw new TypeError('eight finite values required')}
  function fold(values,pairStart=3,flip=false){assertValues(values);if(!Number.isInteger(pairStart)||pairStart<0||pairStart>6)throw new RangeError('pairStart must be 0..6');const pair=[pairStart,pairStart+1],left=values[pair[0]],right=values[pair[1]],coupled=(left+right)/2,residual=(left-right)/2*(flip?-1:1),remaining=values.filter((_,i)=>!pair.includes(i)),quotient=remaining.concat([coupled]),reconstructedPair=flip?[coupled-residual,coupled+residual]:[coupled+residual,coupled-residual],reconstructed=values.slice();reconstructed[pair[0]]=reconstructedPair[0];reconstructed[pair[1]]=reconstructedPair[1];const error=Math.max(...values.map((value,i)=>Math.abs(value-reconstructed[i])));return{pair,pairDisplay:pair.map(i=>i+1),coupled,residual,quotient,reconstructed,error,flip}}
  function phase(index){if(!Number.isInteger(index)||index<0||index>=PHASES.length)throw new RangeError('phase index');return PHASES[index]}
  return{SCHEMA,PHASES,fold,phase};
});
