(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0DigitPentagon=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const BLOCK_SIZE=5,TRAIL_LENGTH=15;
 const DIGITS=Object.freeze({
  pi:'14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912',
  e:'71828182845904523536028747135266249775724709369995957496696762772407663035354759457138217852516642742746639193200305992181741359662904357290033429526059563073813232862794349076323382988075319525101901157383418793070215408914993488416750924476146066808226480016847741185374234544243710753907774499206955170276183860626133138458300075204493382656029760673711320070932870912744374704723069697720931014169283681902551510865746377211125238978442505695369677078544996996794686445490598793163688923009879312',
  phi:'61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475408807538689175212663386222353693179318006076672635443338908659593958290563832266131992829026788067520876689250171169620703222104321626954862629631361443814975870122034080588795445474924618569536486444924104432077134494704956584678850987433944221254487706647809158846074998871240076521705751797883416625624940758906970400028121042762177111777805315317141011704666599146697987317613560067087480710',
  sqrt2:'41421356237309504880168872420969807856967187537694807317667973799073247846210703885038753432764157273501384623091229702492483605585073721264412149709993583141322266592750559275579995050115278206057147010955997160597027453459686201472851741864088919860955232923048430871432145083976260362799525140798968725339654633180882964062061525835239505474575028775996172983557522033753185701135437460340849884716038689997069900481503054402779031645424782306849293691862158057846311159666871301301561856898723723'
 });
 const META=Object.freeze({
  pi:{symbol:'π',color:'#31d7ff'},e:{symbol:'e',color:'#c77dff'},phi:{symbol:'φ',color:'#ffd23f'},sqrt2:{symbol:'√2',color:'#53e6a5'}
 });
 const ABSOLUTE_NAMES=Object.freeze(['pi','phi','sqrt2']),RELATIVE_NAMES=Object.freeze(['e','phi','sqrt2']),ALL_NAMES=Object.freeze(['pi','e','phi','sqrt2']);
 const vectors=Array.from({length:BLOCK_SIZE},(_,j)=>{const a=-Math.PI/2+2*Math.PI*j/BLOCK_SIZE;return{x:Math.cos(a),y:Math.sin(a),angle:a};});
 const clampOffset=value=>Math.max(0,Math.min(4,Math.round(Number(value)||0)));
 function analyzeBlock(block){
  const digits=Array.from(block,d=>Number(d));
  if(digits.length!==BLOCK_SIZE||digits.some(d=>!Number.isInteger(d)||d<0||d>9))throw new TypeError('block must contain five decimal digits');
  const points=digits.map((digit,j)=>({x:vectors[j].x*digit/9,y:vectors[j].y*digit/9,digit,index:j}));
  const centroid=points.reduce((p,q)=>({x:p.x+q.x/BLOCK_SIZE,y:p.y+q.y/BLOCK_SIZE}),{x:0,y:0});
  const sum=digits.reduce((a,b)=>a+b,0),min=Math.min(...digits),max=Math.max(...digits);
  const iMin=digits.indexOf(min),iMax=digits.indexOf(max);
  const discarded=digits.map((digit,index)=>({index,digit})).filter(item=>item.index!==iMin&&item.index!==iMax);
  return{block:digits.join(''),digits,points,centroid,sum,mean:sum/BLOCK_SIZE,min,max,iMin,iMax,digon:[points[iMin],points[iMax]],discarded,span:max-min};
 }
 function frames(name='pi',offset=0){
  const source=DIGITS[name];if(!source)throw new RangeError('unknown constant');
  const start=clampOffset(offset),count=Math.floor((source.length-start)/BLOCK_SIZE);
  return Array.from({length:count},(_,i)=>analyzeBlock(source.slice(start+i*BLOCK_SIZE,start+(i+1)*BLOCK_SIZE)));
 }
 function statistics(name='pi',offset=0){
  const set=frames(name,offset),digits=DIGITS[name].slice(clampOffset(offset),clampOffset(offset)+set.length*BLOCK_SIZE);
  const meanCentroid=set.reduce((p,f)=>({x:p.x+f.centroid.x/set.length,y:p.y+f.centroid.y/set.length}),{x:0,y:0});
  const sum=Array.from(digits,Number).reduce((a,b)=>a+b,0);
  return{name,offset:clampOffset(offset),digits:digits.length,frames:set.length,sum,digitMean:sum/digits.length,meanCentroid,distance:Math.hypot(meanCentroid.x,meanCentroid.y)};
 }
 function rathAdapter(frame){
  const percent=100*frame.sum/45,mirror=100-percent;
  return{operator:'p_b=100*sum(d_j)/45',percent,mirror,seam:50,pairSum:percent+mirror,type:'DECLARED_DISPLAY_ADAPTER_NOT_CONSTANT_IDENTITY'};
 }
 function snapshot(frameIndex=0,offset=0){
  const start=clampOffset(offset),all=ABSOLUTE_NAMES.map(name=>[name,frames(name,start)]),total=Math.min(...all.map(([,set])=>set.length));
  const index=Math.max(0,Math.min(total-1,Math.round(Number(frameIndex)||0)));
  return{index,offset:start,total,decimalRange:[start+index*5+1,start+(index+1)*5],constants:Object.fromEntries(all.map(([name,set])=>[name,{...set[index],trail:set.slice(Math.max(0,index-TRAIL_LENGTH+1),index+1).map(f=>f.centroid),rath:rathAdapter(set[index])}]))};
 }
 function closestPointToOrigin(a,b){
  const dx=b.x-a.x,dy=b.y-a.y,len2=dx*dx+dy*dy;
  const t=len2===0?0:Math.max(0,Math.min(1,-(a.x*dx+a.y*dy)/len2));
  const point={x:a.x+t*dx,y:a.y+t*dy};
  return{point,t,distance:Math.hypot(point.x,point.y),degenerate:len2===0};
 }
 function barycentricOrigin(e,phi,sqrt2,epsilon=1e-12){
  const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x),origin={x:0,y:0},area2=cross(e,phi,sqrt2),area=Math.abs(area2)/2,tolerance=Math.max(0,Number(epsilon)||0);
  if(Math.abs(area2)<=tolerance)return{area2,area,degenerate:true,weights:{e:null,phi:null,sqrt2:null},weightSum:null,reconstruction:{x:null,y:null,residual:null},strictlyInside:false,onBoundary:false,insideInclusive:false,status:'DEGENERATE'};
  const weights={e:cross(origin,phi,sqrt2)/area2,phi:cross(e,origin,sqrt2)/area2,sqrt2:cross(e,phi,origin)/area2};
  const weightSum=weights.e+weights.phi+weights.sqrt2,reconstruction={x:weights.e*e.x+weights.phi*phi.x+weights.sqrt2*sqrt2.x,y:weights.e*e.y+weights.phi*phi.y+weights.sqrt2*sqrt2.y};
  reconstruction.residual=Math.hypot(reconstruction.x,reconstruction.y);
  const values=Object.values(weights),insideInclusive=values.every(value=>value>=-tolerance&&value<=1+tolerance),onBoundary=insideInclusive&&values.some(value=>Math.abs(value)<=tolerance),strictlyInside=values.every(value=>value>tolerance&&value<1-tolerance);
  return{area2,area,degenerate:false,weights,weightSum,reconstruction,strictlyInside,onBoundary,insideInclusive,status:strictlyInside?'INSIDE':onBoundary?'ON_BOUNDARY':'OUTSIDE'};
 }
 function relativeSnapshot(frameIndex=0,offset=0,threshold=0.05){
  const start=clampOffset(offset),sets=Object.fromEntries(ALL_NAMES.map(name=>[name,frames(name,start)])),total=Math.min(...ALL_NAMES.map(name=>sets[name].length));
  const index=Math.max(0,Math.min(total-1,Math.round(Number(frameIndex)||0))),pi=sets.pi[index],anchor=pi.centroid;
  const constants=Object.fromEntries(RELATIVE_NAMES.map(name=>{const frame=sets[name][index],relativeCentroid={x:frame.centroid.x-anchor.x,y:frame.centroid.y-anchor.y};return[name,{...frame,relativeCentroid,relativePoints:frame.points.map(p=>({...p,x:p.x-anchor.x,y:p.y-anchor.y})),trail:sets[name].slice(Math.max(0,index-9),index+1).map((f,k)=>{const piFrame=sets.pi[Math.max(0,index-9)+k];return{x:f.centroid.x-piFrame.centroid.x,y:f.centroid.y-piFrame.centroid.y};})}];}));
  const bridge=closestPointToOrigin(constants.phi.relativeCentroid,constants.sqrt2.relativeCentroid),triangle=barycentricOrigin(constants.e.relativeCentroid,constants.phi.relativeCentroid,constants.sqrt2.relativeCentroid),limit=Math.max(0,Number(threshold)||0);
  return{index,offset:start,total,threshold:limit,decimalRange:[start+index*5+1,start+(index+1)*5],pi:{...pi,relativeCentroid:{x:0,y:0}},constants,triangle,bridge:{from:constants.phi.relativeCentroid,to:constants.sqrt2.relativeCentroid,...bridge,isTransit:bridge.distance<limit}};
 }
 function relativeStatistics(offset=0,threshold=0.05){
  const total=relativeSnapshot(0,offset,threshold).total,rows=Array.from({length:total},(_,index)=>relativeSnapshot(index,offset,threshold));
  const distances=rows.map(row=>row.bridge.distance),minimum=Math.min(...distances),minIndex=distances.indexOf(minimum),transits=rows.filter(row=>row.bridge.isTransit).length;
  const areas=rows.map(row=>row.triangle.area),maxArea=Math.max(...areas),maxAreaIndex=areas.indexOf(maxArea),insideFrames=rows.filter(row=>row.triangle.strictlyInside).length,boundaryFrames=rows.filter(row=>row.triangle.onBoundary).length,degenerateFrames=rows.filter(row=>row.triangle.degenerate).length;
  return{offset:clampOffset(offset),threshold:Math.max(0,Number(threshold)||0),frames:total,meanDistance:distances.reduce((a,b)=>a+b,0)/total,transits,transitRate:transits/total,minIndex,minDistance:minimum,minBlocks:{pi:rows[minIndex].pi.block,...Object.fromEntries(RELATIVE_NAMES.map(name=>[name,rows[minIndex].constants[name].block]))},insideFrames,insideRate:insideFrames/total,boundaryFrames,degenerateFrames,meanArea:areas.reduce((a,b)=>a+b,0)/total,maxArea,maxAreaIndex,maxAreaBlocks:{pi:rows[maxAreaIndex].pi.block,...Object.fromEntries(RELATIVE_NAMES.map(name=>[name,rows[maxAreaIndex].constants[name].block]))}};
 }
 function audit(){
  const stats=ALL_NAMES.map(name=>statistics(name)),relative=relativeStatistics();
  const first=snapshot(0).constants;
  return{status:ALL_NAMES.every(name=>DIGITS[name].length===500)&&stats.every(s=>s.frames===100)&&first.pi.sum===20&&first.phi.sum===18&&first.sqrt2.sum===12&&relative.frames===100?'PASS':'FAIL',digitsPerConstant:500,frames:100,blockSize:5,trailLength:TRAIL_LENGTH,firstSums:{pi:first.pi.sum,e:analyzeBlock(DIGITS.e.slice(0,5)).sum,phi:first.phi.sum,sqrt2:first.sqrt2.sum},stats,relative,claimBoundary:'FINITE_DECIMAL_DIAGNOSTIC_NOT_NORMALITY_PROOF',relativeClaimBoundary:'COORDINATE_CHANGE_AND_DECLARED_THRESHOLD_NOT_CONSTANT_RELATION',triangleClaimBoundary:'FINITE_BLOCK_BARYCENTRIC_TEST_NOT_CONSTANT_IDENTITY',graphDelta:{newNodes:0,newRelations:0,newAliases:0}};
 }
 function mount(doc=globalThis.document,timers=globalThis){
  const shell=doc?.getElementById?.('digit-pentagon-ticker');if(!shell)return null;
  const svgs=Object.fromEntries(ABSOLUTE_NAMES.map(name=>[name,shell.querySelector('[data-dpt-svg="'+name+'"]')]));
  const cards=Object.fromEntries(ABSOLUTE_NAMES.map(name=>[name,shell.querySelector('[data-dpt-card="'+name+'"]')]));
  const frameInput=shell.querySelector('[data-dpt-frame]'),offsetInput=shell.querySelector('[data-dpt-offset]'),play=shell.querySelector('[data-dpt-play]');
  const modeButtons=[...shell.querySelectorAll('[data-dpt-mode]')],statsBox=shell.querySelector('[data-dpt-stats]'),rangeOut=shell.querySelector('[data-dpt-range]'),rathBox=shell.querySelector('[data-dpt-rath]');
  let index=0,offset=0,mode='all',timer=null;
  const ns='http://www.w3.org/2000/svg';
  const el=(tag,attrs={},text='')=>{const node=doc.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))node.setAttribute(k,String(v));if(text)node.textContent=text;return node;};
  const xy=p=>[150+p.x*108,150+p.y*108];
  function draw(name,data){
   const svg=svgs[name];if(!svg)return;
   while(svg.firstChild)svg.removeChild(svg.firstChild);
   svg.append(el('circle',{cx:150,cy:150,r:108,class:'dpt-unit'}));
   vectors.forEach((v,j)=>{const [x,y]=xy(v);svg.append(el('line',{x1:150,y1:150,x2:x,y2:y,class:'dpt-ray'}));svg.append(el('text',{x:150+v.x*125,y:154+v.y*125,class:'dpt-index'},'j'+j));});
   const trail=data.trail.map(p=>xy(p).join(',')).join(' ');if(trail)svg.append(el('polyline',{points:trail,class:'dpt-trail'}));
   const polygon=data.points.map(p=>xy(p).join(',')).join(' ');svg.append(el('polygon',{points:polygon,class:'dpt-poly',style:'--dpt-color:'+META[name].color}));
   const [a,b]=data.digon.map(xy);svg.append(el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:'dpt-digon'}));
   data.points.forEach(p=>{const [x,y]=xy(p);svg.append(el('circle',{cx:x,cy:y,r:5,class:'dpt-vertex',style:'--dpt-color:'+META[name].color}));svg.append(el('text',{x:x+8,y:y-8,class:'dpt-digit'},String(p.digit)));});
   const [cx,cy]=xy(data.centroid);svg.append(el('circle',{cx,cy,r:5,class:'dpt-centroid'}));svg.append(el('line',{x1:cx-7,y1:cy,x2:cx+7,y2:cy,class:'dpt-centroid'}));svg.append(el('line',{x1:cx,y1:cy-7,x2:cx,y2:cy+7,class:'dpt-centroid'}));
   const card=cards[name];if(card){card.querySelector('[data-dpt-block]').textContent=data.block;card.querySelector('[data-dpt-metrics]').textContent='Σ '+data.sum+' · μ '+data.mean.toFixed(1)+' · span '+data.span;card.querySelector('[data-dpt-receipt]').textContent='D: j'+data.iMin+':'+data.min+' ↔ j'+data.iMax+':'+data.max+'\nLOSS: '+data.discarded.map(x=>'j'+x.index+':'+x.digit).join(' · ');}
  }
  function render(next=index){
   const snap=snapshot(next,offset);index=snap.index;shell.dataset.dptMode=mode;
   if(frameInput){frameInput.max=String(snap.total-1);frameInput.value=String(index);}
   if(rangeOut)rangeOut.textContent='FRAME '+String(index+1).padStart(2,'0')+' / '+snap.total+' · DIGITS '+snap.decimalRange[0]+'–'+snap.decimalRange[1]+' · OFFSET '+offset;
   Object.entries(snap.constants).forEach(([name,data])=>draw(name,data));
   if(statsBox)statsBox.innerHTML=ABSOLUTE_NAMES.map(name=>{const s=statistics(name,offset);return'<article><b>'+META[name].symbol+'</b><span>Σ '+s.sum+' · digit μ '+s.digitMean.toFixed(4)+'</span><code>C̄ ('+signed(s.meanCentroid.x)+', '+signed(s.meanCentroid.y)+') · |C̄| '+s.distance.toFixed(4)+'</code></article>';}).join('');
   if(rathBox)rathBox.innerHTML=Object.entries(snap.constants).map(([name,data])=>'<span><b>'+META[name].symbol+'</b> '+data.rath.percent.toFixed(2)+' ↔ '+data.rath.mirror.toFixed(2)+'</span>').join('')+'<small>p_b=100·Σ/45 · J₁₀₀(p)=100−p · VIEW ADAPTER ≠ CONSTANT IDENTITY</small>';
   return snap;
  }
  function signed(value){return(value>=0?'+':'−')+Math.abs(value).toFixed(4);}
  function stop(){if(timer!==null)timers.clearInterval(timer);timer=null;if(play){play.textContent='PLAY 100';play.setAttribute('aria-pressed','false');}}
  function start(){stop();if(play){play.textContent='PAUSE';play.setAttribute('aria-pressed','true');}timer=timers.setInterval(()=>{const total=snapshot(0,offset).total;render((index+1)%total);},350);}
  frameInput?.addEventListener('input',()=>{stop();render(frameInput.value);});
  offsetInput?.addEventListener('change',()=>{stop();offset=clampOffset(offsetInput.value);render(0);});
  play?.addEventListener('click',()=>timer===null?start():stop());
  modeButtons.forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.dptMode||'all';modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(index);}));
  doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)stop();});
  const initial=render(0),report=audit();
  if(globalThis.console?.table)globalThis.console.table(report.stats.map(s=>({constant:META[s.name].symbol,digits:s.digits,sum:s.sum,digitMean:s.digitMean.toFixed(4),centroidX:s.meanCentroid.x.toFixed(4),centroidY:s.meanCentroid.y.toFixed(4),distance:s.distance.toFixed(4)})));
  return{render,start,stop,get snapshot(){return snapshot(index,offset)},initial,report};
 }
 function mountRelative(doc=globalThis.document,timers=globalThis){
  const shell=doc?.getElementById?.('pi-relative-ticker');if(!shell)return null;
  const svg=shell.querySelector('[data-dpt-relative-svg]'),frameInput=shell.querySelector('[data-dpt-relative-frame]'),play=shell.querySelector('[data-dpt-relative-play]'),range=shell.querySelector('[data-dpt-relative-range]'),readout=shell.querySelector('[data-dpt-relative-readout]'),bary=shell.querySelector('[data-dpt-relative-bary]'),blocks=shell.querySelector('[data-dpt-relative-blocks]');
  let index=0,timer=null;const ns='http://www.w3.org/2000/svg',xy=p=>[210+p.x*145,210+p.y*145];
  const el=(tag,attrs={},text='')=>{const node=doc.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))node.setAttribute(k,String(v));if(text)node.textContent=text;return node;};
  function draw(data){
   if(!svg)return;while(svg.firstChild)svg.removeChild(svg.firstChild);
   [0.05,0.25,0.5,0.75].forEach(r=>svg.append(el('circle',{cx:210,cy:210,r:r*145,class:r===0.05?'dpt-rel-ring core':'dpt-rel-ring'})));
   svg.append(el('line',{x1:35,y1:210,x2:385,y2:210,class:'dpt-rel-axis'}));svg.append(el('line',{x1:210,y1:35,x2:210,y2:385,class:'dpt-rel-axis'}));
   const trianglePoints=RELATIVE_NAMES.map(name=>xy(data.constants[name].relativeCentroid).join(',')).join(' ');svg.append(el('polygon',{points:trianglePoints,class:'dpt-rel-triangle '+data.triangle.status.toLowerCase()}));
   for(const name of RELATIVE_NAMES){const item=data.constants[name],trail=item.trail.map(p=>xy(p).join(',')).join(' '),polygon=item.relativePoints.map(p=>xy(p).join(',')).join(' ');svg.append(el('polyline',{points:trail,class:'dpt-rel-trail',style:'--dpt-color:'+META[name].color}));svg.append(el('polygon',{points:polygon,class:'dpt-rel-poly',style:'--dpt-color:'+META[name].color}));const [x,y]=xy(item.relativeCentroid);svg.append(el('circle',{cx:x,cy:y,r:7,class:'dpt-rel-point',style:'--dpt-color:'+META[name].color}));svg.append(el('text',{x:x+10,y:y-10,class:'dpt-rel-label',style:'--dpt-color:'+META[name].color},META[name].symbol));}
   const a=xy(data.bridge.from),b=xy(data.bridge.to),q=xy(data.bridge.point);svg.append(el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:data.bridge.isTransit?'dpt-rel-bridge transit':'dpt-rel-bridge'}));svg.append(el('line',{x1:210,y1:210,x2:q[0],y2:q[1],class:'dpt-rel-lot'}));svg.append(el('circle',{cx:210,cy:210,r:8,class:'dpt-rel-pi'}));svg.append(el('text',{x:222,y:202,class:'dpt-rel-pi-label'},'π · (0,0)'));
  }
  function render(next=index){const data=relativeSnapshot(next);index=data.index,frameInput.value=String(index);if(range)range.textContent='FRAME '+String(index+1).padStart(2,'0')+' / '+data.total+' · DIGITS '+data.decimalRange[0]+'–'+data.decimalRange[1];draw(data);if(readout){const s=relativeStatistics();readout.innerHTML='<b>d(π, φ↔√2) = '+data.bridge.distance.toFixed(4)+'</b><span>'+(data.bridge.isTransit?'TRANSIT IM r&lt;0.05 KERN':'KEIN TRANSIT')+' · t='+data.bridge.t.toFixed(3)+'</span><small>100 Frames: '+s.transits+' Transite · Mittel '+s.meanDistance.toFixed(4)+' · Minimum '+s.minDistance.toFixed(5)+' in Frame '+(s.minIndex+1)+'</small>';}if(bary){const t=data.triangle,w=t.weights,s=relativeStatistics(),weightText=t.degenerate?'λ nicht definiert':'λe '+w.e.toFixed(4)+' · λφ '+w.phi.toFixed(4)+' · λ√2 '+w.sqrt2.toFixed(4);bary.innerHTML='<b>'+t.status.replace('_',' ')+'</b><span>A△ = '+t.area.toFixed(6)+' · '+weightText+'</span><small>π liegt strikt innen genau dann, wenn alle drei λ &gt; 0 sind. In 100 Frames: '+s.insideFrames+' innen · '+s.boundaryFrames+' Rand · '+s.degenerateFrames+' entartet.</small>';}if(blocks)blocks.innerHTML=['pi',...RELATIVE_NAMES].map(name=>{const f=name==='pi'?data.pi:data.constants[name];return'<span><b>'+META[name].symbol+'</b><code>'+f.block+'</code><small>Σ '+f.sum+'</small></span>';}).join('');return data;}
  function stop(){if(timer!==null)timers.clearInterval(timer);timer=null;play.textContent='PLAY 100';play.setAttribute('aria-pressed','false');}
  function start(){stop();play.textContent='PAUSE';play.setAttribute('aria-pressed','true');timer=timers.setInterval(()=>render((index+1)%100),450);}
  frameInput?.addEventListener('input',()=>{stop();render(frameInput.value);});play?.addEventListener('click',()=>timer===null?start():stop());doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)stop();});
  const initial=render(0);return{render,start,stop,get snapshot(){return relativeSnapshot(index)},initial,stats:relativeStatistics()};
 }
 if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{mount(document,globalThis);mountRelative(document,globalThis);});
 return{BLOCK_SIZE,TRAIL_LENGTH,DIGITS,META,ABSOLUTE_NAMES,RELATIVE_NAMES,analyzeBlock,frames,statistics,rathAdapter,snapshot,closestPointToOrigin,barycentricOrigin,relativeSnapshot,relativeStatistics,audit,mount,mountRelative};
});
