(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.A0GreyspaceFold=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const GATES=Object.freeze([
    Object.freeze({id:'blue',label:'BLUE LEAF',tone:'#62a6ff',sheet:-1}),
    Object.freeze({id:'white',label:'WHITE GATE',tone:'#f4f7f2',sheet:0}),
    Object.freeze({id:'red',label:'RED LEAF',tone:'#f1747d',sheet:1})
  ]);
  const POSES=Object.freeze([
    Object.freeze({rotation:-18,scaleX:1,scaleY:.72,skew:-7}),
    Object.freeze({rotation:24,scaleX:.78,scaleY:1,skew:5}),
    Object.freeze({rotation:82,scaleX:.92,scaleY:.68,skew:-4}),
    Object.freeze({rotation:146,scaleX:.7,scaleY:.94,skew:7}),
    Object.freeze({rotation:216,scaleX:1,scaleY:.72,skew:-7})
  ]);
  function gate(id){return GATES.find(item=>item.id===id)||GATES[1]}
  function pose(index){const n=((Number(index)%POSES.length)+POSES.length)%POSES.length;return POSES[n]}
  function runAudit(){
    let total=0,passed=0;
    const check=value=>{total++;if(value) passed++};
    check(VERSION==='1.0.0');
    check(GATES.length===3);
    check(new Set(GATES.map(item=>item.id)).size===3);
    GATES.forEach(item=>{check(gate(item.id)===item);check([-1,0,1].includes(item.sheet));check(/^#[0-9a-f]{6}$/i.test(item.tone))});
    check(gate('unknown').id==='white');
    POSES.forEach((item,index)=>{check(pose(index)===item);check(pose(index+POSES.length)===item);check(item.scaleX>0&&item.scaleY>0)});
    check(pose(-1)===POSES[POSES.length-1]);
    return Object.freeze({fixture:'A0_GREYSPACE_FOLD_VISUAL',version:VERSION,assertions:{total,passed,failed:total-passed},outcome:total===passed?'PASS_VISUAL_STATE_LOCK':'FAIL_VISUAL_STATE_LOCK',claimBoundary:'VISUAL_ORIENTATION_ONLY / NO_PHYSICAL_CLAIM'});
  }
  return Object.freeze({VERSION,GATES,POSES,gate,pose,runAudit});
});
