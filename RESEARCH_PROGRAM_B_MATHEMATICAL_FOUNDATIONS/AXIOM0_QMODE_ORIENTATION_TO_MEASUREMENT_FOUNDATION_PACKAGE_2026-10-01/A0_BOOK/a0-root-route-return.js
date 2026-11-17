(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0RootRouteReturn=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const IDENTITY='ART:A0:MATHEMATICAL_JOINTS';
  const ROOTS=240,LANES=8,PHASES=30,PERIOD_A=13,PERIOD_B=17,PERIOD_RETURN=221,DUAL_RETURN=53040;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const mod=(value,base)=>((Number(value)%base)+base)%base;
  function gcd(a,b){a=Math.abs(Number(a));b=Math.abs(Number(b));while(b){const t=a%b;a=b;b=t;}return a;}
  function lcm(a,b){return Math.abs(Number(a)*Number(b))/gcd(a,b);}
  function rootAddress(index=0){const normalized=mod(index,ROOTS);return {index:normalized,lane:Math.floor(normalized/PHASES)+1,phase:normalized%PHASES+1};}
  function returnFrame(tick=0,source=1033){
    const t=Math.max(0,Math.trunc(Number(tick)||0)),s=[1031,1032,1033].includes(Number(source))?Number(source):1033,address=rootAddress(t);
    return {tick:t,source:s,difference:s-PERIOD_RETURN,address,residue13:t%PERIOD_A,residue17:t%PERIOD_B,rootClosed:t>0&&t%ROOTS===0,periodClosed:t>0&&t%PERIOD_RETURN===0,dualClosed:t>0&&t%DUAL_RETURN===0,graphDelta:{identities:0,relations:0,aliases:0}};
  }
  function nextReturn(tick,period){const t=Math.max(0,Math.trunc(Number(tick)||0)),r=t%period;return t+(r===0?period:period-r);}
  function originFrame(source=1033){
    const selected=[1031,1032,1033].includes(Number(source))?Number(source):1033,lower=1031+19,upper=1031+29,midpoint=(lower+upper)/2,scarab=108603;
    return {selected,axis:[1031,1032,1033],lower,upper,midpoint,correction:{shown:810+19,target:1000,requiredOffset:1000-810},scarab,factors:[3,3,11,1097],glyphs:['ị','H±','∫±'],redBalloon:{shape:'RED_DROP_IN_WHITE_APERTURE',relation:'EXISTING_LINEAGE_REFERENCE_ONLY'}};
  }
  function polar(cx,cy,r,index,count){const angle=-Math.PI/2+Math.PI*2*index/count;return [cx+r*Math.cos(angle),cy+r*Math.sin(angle)];}
  function svgMarkup(data){
    let out='<rect x="25" y="24" width="1070" height="552" rx="22" class="rrr-frame"/>';
    out+='<text x="52" y="58" class="rrr-title">240 ROOT ADDRESSES · 8 LANES × 30 PHASES</text>';
    const x0=70,y0=96,dx=18.1,dy=41;
    for(let lane=0;lane<LANES;lane+=1){
      const y=y0+lane*dy;out+=`<text x="44" y="${y+4}" class="rrr-lane-label">${lane+1}</text><line x1="${x0-8}" y1="${y}" x2="${x0+29*dx+8}" y2="${y}" class="rrr-lane"/>`;
      for(let phase=0;phase<PHASES;phase+=1){const index=lane*PHASES+phase,active=index===data.address.index;out+=`<circle cx="${(x0+phase*dx).toFixed(1)}" cy="${y}" r="${active?7:2.5}" class="rrr-root${active?' active':''}"/>`;}
    }
    out+=`<text x="70" y="${y0+8*dy+8}" class="rrr-caption">ADDRESS (${data.address.lane}, ${data.address.phase}) · ROOT ${data.address.index+1}/240</text>`;
    const cx=815,cy=203;
    out+='<text x="815" y="58" text-anchor="middle" class="rrr-title">13 / 17 PERIOD RETURN</text>';
    [[118,PERIOD_A,data.residue13,'a'],[164,PERIOD_B,data.residue17,'b']].forEach(([r,count,current,klass])=>{out+=`<circle cx="${cx}" cy="${cy}" r="${r}" class="rrr-cycle ${klass}"/>`;for(let i=0;i<count;i+=1){const [x,y]=polar(cx,cy,r,i,count);out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i===current?7:3}" class="rrr-cycle-dot ${klass}${i===current?' active':''}"/>`;}});
    out+=`<circle cx="${cx}" cy="${cy}" r="48" class="rrr-return-core"/><text x="${cx}" y="${cy-5}" text-anchor="middle" class="rrr-return-number">221</text><text x="${cx}" y="${cy+16}" text-anchor="middle" class="rrr-return-label">13 × 17</text>`;
    out+=`<text x="${cx}" y="${cy+205}" text-anchor="middle" class="rrr-caption">t=${data.tick} · residues ${data.residue13}/${data.residue17}${data.periodClosed?' · RETURN':''}</text>`;
    const pcx=814,pcy=505,pr=88,points=[];for(let i=0;i<5;i+=1)points.push(polar(pcx,pcy,pr,i,5));out+=`<path d="${points.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')} Z" class="rrr-lower-frame"/>`;
    points.forEach(([x,y],i)=>{out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" class="rrr-joint"/><text x="${x.toFixed(1)}" y="${(y+(i===0?-13:20)).toFixed(1)}" text-anchor="middle" class="rrr-token">${['UR','A','N','U','S'][i]}</text>`;});
    out+=`<circle cx="${pcx}" cy="${pcy}" r="23" class="rrr-sun"/><text x="${pcx}" y="${pcy+4}" text-anchor="middle" class="rrr-sun-label">ANU</text><text x="1015" y="478" text-anchor="end" class="rrr-caption">LOWER FRAME</text><text x="1015" y="500" text-anchor="end" class="rrr-hold">UR | ANU | S</text><text x="1015" y="521" text-anchor="end" class="rrr-caption">DOCUMENTARY LABEL · HOLD</text>`;
    out+=`<text x="52" y="558" class="rrr-foot">240-CLOSURE ${data.rootClosed?'YES':'NO'} · 221-CLOSURE ${data.periodClosed?'YES':'NO'} · DUAL 53.040 ${data.dualClosed?'YES':'NO'} · NO CARRIER MERGE</text>`;
    return out;
  }
  function originSvgMarkup(data){
    let out='<rect x="24" y="22" width="712" height="424" rx="22" class="rrr-origin-frame"/><circle cx="380" cy="232" r="180" class="rrr-origin-orbit o3"/><circle cx="380" cy="232" r="132" class="rrr-origin-orbit o2"/><circle cx="380" cy="232" r="82" class="rrr-origin-orbit o1"/><path d="M380 66 V386" class="rrr-origin-axis"/>';
    [[1033,118],[1032,166],[1031,214]].forEach(([value,y])=>{out+=`<circle cx="380" cy="${y}" r="${value===data.selected?9:5}" class="rrr-origin-source${value===data.selected?' active':''}"/><text x="398" y="${y+5}" class="rrr-origin-value">${value}</text>`;});
    out+='<path d="M380 214 Q322 275 278 326" class="rrr-origin-branch lower"/><path d="M380 214 Q438 275 482 326" class="rrr-origin-branch upper"/>';
    out+=`<circle cx="278" cy="326" r="10" class="rrr-origin-node"/><text x="250" y="354" text-anchor="middle" class="rrr-origin-value">${data.lower}</text><circle cx="482" cy="326" r="10" class="rrr-origin-node"/><text x="510" y="354" text-anchor="middle" class="rrr-origin-value">${data.upper}</text>`;
    out+=`<circle cx="380" cy="334" r="32" class="rrr-navel"/><text x="380" y="331" text-anchor="middle" class="rrr-navel-label">NABEL</text><text x="380" y="348" text-anchor="middle" class="rrr-navel-value">${data.midpoint}</text>`;
    out+='<circle cx="150" cy="166" r="54" class="rrr-white-aperture"/><path d="M150 132 C126 155 130 190 150 204 C170 190 174 155 150 132 Z" class="rrr-red-drop"/><text x="150" y="232" text-anchor="middle" class="rrr-origin-caption">RED BALLOON · SOURCE VIEW</text>';
    out+=`<text x="596" y="150" text-anchor="middle" class="rrr-origin-caption">SCARAB GATE</text><text x="596" y="178" text-anchor="middle" class="rrr-origin-scarab">${data.scarab}</text><text x="596" y="198" text-anchor="middle" class="rrr-origin-caption">3² · 11 · 1097</text><text x="596" y="248" text-anchor="middle" class="rrr-origin-glyph">ị</text><text x="596" y="279" text-anchor="middle" class="rrr-origin-glyph">H±</text><text x="596" y="310" text-anchor="middle" class="rrr-origin-glyph">∫±</text><text x="596" y="333" text-anchor="middle" class="rrr-origin-caption">RAW GLYPHS · HOLD</text>`;
    out+='<text x="46" y="424" class="rrr-foot">1050 ↔ 1055 ↔ 1060 · DECLARED MIDPOINT ONLY · 810+19=829 ≠ 1000</text>';return out;
  }
  function receipt(data){const origin=originFrame(data.source);return {schema:'a0.root-route-return.view.v1',identity:IDENTITY,classification:'SOURCE_BOUND_LANE_AND_PERIOD_VIEW / NOT_A_LAB_RUN / NO_NEW_RELATION',rootCarrier:{roots:ROOTS,lanes:LANES,phases:PHASES,address:[data.address.lane,data.address.phase],closure:ROOTS},periodReturn:{periods:[PERIOD_A,PERIOD_B],gcd:gcd(PERIOD_A,PERIOD_B),lcm:PERIOD_RETURN,residues:[data.residue13,data.residue17]},sharedClock:{tick:data.tick,dualClosure:DUAL_RETURN},sourceCut:{source:data.source,return:PERIOD_RETURN,difference:data.difference},viewCuts:{calendar810:['8','10','August','Oktober','A','O'],cubeMinusZero:27,identity:false},originLens:{base:1031,offsets:[19,29],values:[origin.lower,origin.upper],midpoint:origin.midpoint,correction:origin.correction,scarab:{value:origin.scarab,factors:origin.factors},redBalloon:origin.redBalloon,glyphs:origin.glyphs},lowerFrame:{tokens:['UR','ANU','S'],status:'DOCUMENTARY_LABEL_HELD'},graphDelta:data.graphDelta};}
  function verify(){
    const f0=returnFrame(0,1033),f221=returnFrame(221,1033),f240=returnFrame(240,1032),f53040=returnFrame(53040,1031);
    const origin=originFrame(1033),checks=[ROOTS===LANES*PHASES,gcd(13,17)===1,lcm(13,17)===221,lcm(240,221)===53040,f0.address.lane===1,f0.address.phase===1,rootAddress(29).lane===1,rootAddress(29).phase===30,rootAddress(30).lane===2,rootAddress(239).lane===8,rootAddress(239).phase===30,f221.periodClosed,!f221.rootClosed,f240.rootClosed,!f240.periodClosed,f53040.dualClosed,f0.difference===812,returnFrame(0,1032).difference===811,returnFrame(0,1031).difference===810,3**3-0===27,1031!==3**3-0,nextReturn(0,221)===221,nextReturn(1,221)===221,origin.lower===1050,origin.upper===1060,origin.midpoint===1055,origin.correction.shown===829,origin.correction.requiredOffset===190,origin.factors.reduce((a,b)=>a*b,1)===108603,receipt(f221).graphDelta.identities===0,svgMarkup(f221).includes('NO CARRIER MERGE'),originSvgMarkup(origin).includes('RED BALLOON')];
    return {status:checks.every(Boolean)?'PASS_BOUNDED_ROOT_ROUTE_RETURN_VIEW':'FAIL',checkCount:checks.length,newCanonicalIds:[],relationChanges:[]};
  }
  function mount(doc){
    const svg=doc.getElementById('rrrSvg');if(!svg)return null;const originSvg=doc.getElementById('rrrOriginSvg'),state={tick:0,source:1033};
    const render=()=>{const data=returnFrame(state.tick,state.source),origin=originFrame(data.source);svg.innerHTML=svgMarkup(data);if(originSvg)originSvg.innerHTML=originSvgMarkup(origin);const status=doc.getElementById('rrrStatus');if(status)status.textContent=`ROOT ${String(data.address.index+1).padStart(3,'0')} · L${data.address.lane}/P${data.address.phase} · t=${data.tick}`;const address=doc.getElementById('rrrAddress');if(address)address.textContent=`(${data.address.lane}, ${data.address.phase})`;const rootIndex=doc.getElementById('rrrRootIndex');if(rootIndex)rootIndex.textContent=`Root ${data.address.index+1} / 240`;const residues=doc.getElementById('rrrResidues');if(residues)residues.textContent=`t mod 13 = ${data.residue13} · t mod 17 = ${data.residue17}`;const difference=doc.getElementById('rrrDifference');if(difference)difference.textContent=`${data.source} − 221 = ${data.difference}`;const originSource=doc.getElementById('rrrOriginSource');if(originSource)originSource.textContent=String(data.source);doc.querySelectorAll('[data-rrr-source]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.rrrSource)===data.source)));return data;};
    doc.querySelectorAll('[data-rrr-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.rrrAction;if(action==='step')state.tick+=1;if(action==='root-return')state.tick=nextReturn(state.tick,ROOTS);if(action==='period-return')state.tick=nextReturn(state.tick,PERIOD_RETURN);if(action==='reset')state.tick=0;render();}));
    doc.querySelectorAll('[data-rrr-source]').forEach(button=>button.addEventListener('click',()=>{state.source=Number(button.dataset.rrrSource);render();}));
    render();return {render,state,receipt:()=>receipt(returnFrame(state.tick,state.source))};
  }
  return {IDENTITY,ROOTS,LANES,PHASES,PERIOD_A,PERIOD_B,PERIOD_RETURN,DUAL_RETURN,gcd,lcm,rootAddress,returnFrame,nextReturn,originFrame,svgMarkup,originSvgMarkup,receipt,verify,mount};
});
