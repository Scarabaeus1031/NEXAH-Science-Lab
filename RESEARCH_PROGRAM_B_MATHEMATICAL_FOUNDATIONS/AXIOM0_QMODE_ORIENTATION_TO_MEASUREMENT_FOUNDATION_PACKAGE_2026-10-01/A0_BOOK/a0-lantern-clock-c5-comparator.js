(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0LanternClockC5Comparator=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const mod=(n,m)=>((n%m)+m)%m;
  const clockDegrees=hour=>mod(Number(hour),12)*30;
  const circularDistance=(a,b)=>Math.min(mod(a-b,360),mod(b-a,360));
  const c5Degrees=Object.freeze(Array.from({length:5},(_,i)=>i*72));
  const toClock=degrees=>mod(degrees,360)/30;
  const clockLabel=hour=>{const h=mod(hour,12),whole=Math.floor(h)||12,minutes=Math.round((h-Math.floor(h))*60);return `${whole}:${String(minutes).padStart(2,'0')}`;};
  const nearestC5=hour=>{const degrees=clockDegrees(hour),angle=c5Degrees.reduce((best,x)=>circularDistance(degrees,x)<circularDistance(degrees,best)?x:best,c5Degrees[0]);return Object.freeze({hour,clockDegrees:degrees,c5Degrees:angle,c5Clock:toClock(angle),residualDegrees:circularDistance(degrees,angle)});};
  function model(){
    const clock5=clockDegrees(5),clock10=clockDegrees(10),c5a=nearestC5(5),c5b=nearestC5(10);
    return Object.freeze({
      schema:'nexah.a0.lantern-clock-c5-light-shadow-comparator/1',
      clock:Object.freeze({a:5,b:10,aDegrees:clock5,bDegrees:clock10,separationDegrees:circularDistance(clock5,clock10),bisectorDegrees:225,bisectorClock:7.5,antipodeControl:Object.freeze({a:5,b:11,separationDegrees:180})}),
      c5:Object.freeze({stepDegrees:72,positionsDegrees:c5Degrees,nearFive:c5a,nearTen:c5b,separationDegrees:circularDistance(c5a.c5Degrees,c5b.c5Degrees),bisectorDegrees:216,bisectorClock:7.2}),
      residual:Object.freeze({pairDegrees:6,axisDegrees:9}),
      fold:Object.freeze({balanced:Object.freeze({left:5.5,right:5.5,sum:11,imbalance:0}),control:Object.freeze({left:5,right:6,sum:11,imbalance:1})}),
      sourceBinding:Object.freeze({identity:'ART:A0:MATHEMATICAL_JOINTS',authority:'I-46S.2',channels:5,viewSequence:'LEAF_CLOSED→SLIT_RELEASE→POCKET_OPEN→EXACT_RETURN'}),
      identityReuse:Object.freeze(['ART:A0:MATHEMATICAL_JOINTS','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1','A0_LANTERN_PANEL_V_CONTROL_LENS']),newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),
      boundary:'Clock coordinates, C5 display coordinates and fold balance are exact comparators. Body and shadow remain separate views. No calibrated light source, physical clock, new mechanism, Study, identity or graph relation is established.'
    });
  }
  function verify(){const m=model();let checks=0;
    if(m.clock.separationDegrees!==150)throw new Error('clock 5/10 separation');checks++;
    if(m.c5.stepDegrees!==72||m.c5.separationDegrees!==144)throw new Error('C5 separation');checks++;
    if(m.residual.pairDegrees!==m.clock.separationDegrees-m.c5.separationDegrees)throw new Error('pair residual');checks++;
    if(m.c5.nearFive.residualDegrees!==6||m.c5.nearTen.residualDegrees!==12)throw new Error('nearest gates');checks++;
    if(clockLabel(m.c5.nearFive.c5Clock)!=='4:48'||clockLabel(m.c5.nearTen.c5Clock)!=='9:36')throw new Error('C5 clock labels');checks++;
    if(m.clock.bisectorDegrees-m.c5.bisectorDegrees!==9||clockLabel(m.clock.bisectorClock)!=='7:30'||clockLabel(m.c5.bisectorClock)!=='7:12')throw new Error('axis residual');checks++;
    if(m.clock.antipodeControl.separationDegrees!==180)throw new Error('antipode control');checks++;
    if(m.fold.balanced.sum!==m.fold.control.sum||m.fold.balanced.imbalance!==0||m.fold.control.imbalance!==1)throw new Error('fold balance control');checks++;
    if(m.newCanonicalIds.length||m.relationChanges.length)throw new Error('governance boundary');checks++;
    return Object.freeze({status:'PASS_WITH_LIGHT_PHYSICS_HOLD',checks,exact:['clock 5↔10 = 150°','C5 nearest pair = 144°','pair residual = 6°','axis 7:30↔7:12 = 9°','clock 5↔11 = 180°','5.5+5.5 = 5+6 = 11','imbalance 0 ≠ 1'],holds:['calibrated light','physical shadow law'],newCanonicalIds:[],relationChanges:[]});
  }
  const svg=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));return node;};
  const polar=(cx,cy,r,degrees)=>{const a=(degrees-90)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  function render(stage,view='OVERLAY'){
    stage.replaceChildren();const m=model(),cx=330,cy=210,r=142;
    const text=(x,y,value,klass='lc5-label')=>{const t=svg('text',{x,y,'text-anchor':'middle',class:klass});t.textContent=value;stage.append(t);};
    stage.append(svg('circle',{cx,cy,r,class:'lc5-ring'}));
    if(view==='OVERLAY'||view==='CLOCK'){
      for(let h=0;h<12;h++){const p1=polar(cx,cy,r-7,h*30),p2=polar(cx,cy,r+7,h*30);stage.append(svg('line',{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],class:'lc5-clock-tick'}));}
      [[5,'5:00'],[10,'10:00']].forEach(([h,label])=>{const p=polar(cx,cy,r,h*30);stage.append(svg('circle',{cx:p[0],cy:p[1],r:9,class:'lc5-clock-node'}));text(p[0],p[1]+24,label,'lc5-clock-text');});
      const a=polar(cx,cy,r,150),b=polar(cx,cy,r,300);stage.append(svg('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:'lc5-clock-chord'}));
    }
    if(view==='OVERLAY'||view==='C5'){
      m.c5.positionsDegrees.forEach((degrees,i)=>{const p=polar(cx,cy,r,degrees),tip=polar(cx,cy,r-58,degrees-24),tip2=polar(cx,cy,r-58,degrees+24);stage.append(svg('path',{d:`M${cx} ${cy} L${tip[0]} ${tip[1]} L${p[0]} ${p[1]} L${tip2[0]} ${tip2[1]} Z`,class:'lc5-leaf'}));stage.append(svg('circle',{cx:p[0],cy:p[1],r:6,class:'lc5-c5-node'}));});
      const a=polar(cx,cy,r,144),b=polar(cx,cy,r,288);stage.append(svg('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:'lc5-c5-chord'}));text(a[0],a[1]+24,'4:48','lc5-c5-text');text(b[0],b[1]+24,'9:36','lc5-c5-text');
    }
    if(view==='FOLD'){
      const top=polar(cx,cy,r-12,216),left=polar(cx,cy,r-32,216-36),right=polar(cx,cy,r-32,216+36),axis=polar(cx,cy,r+18,216);stage.append(svg('line',{x1:cx,y1:cy,x2:axis[0],y2:axis[1],class:'lc5-fold-axis'}));stage.append(svg('path',{d:`M${left[0]} ${left[1]} L${cx} ${cy} L${right[0]} ${right[1]}`,class:'lc5-vfold'}));text(left[0],left[1]-12,'5.5');text(right[0],right[1]-12,'5.5');text(top[0],top[1]-12,'AXIS 7:12','lc5-proof');
    }
    if(view==='OVERLAY'){text(cx,cy-12,'150° − 144°','lc5-proof');text(cx,cy+15,'= 6° RESIDUAL','lc5-residual');}
    if(view==='CONTROL'){const a=polar(cx,cy,r,150),b=polar(cx,cy,r,330);stage.append(svg('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],class:'lc5-antipode'}));stage.append(svg('circle',{cx:a[0],cy:a[1],r:9,class:'lc5-clock-node'}),svg('circle',{cx:b[0],cy:b[1],r:9,class:'lc5-clock-node'}));text(cx,cy-8,'5 ↔ 11','lc5-proof');text(cx,cy+18,'180° TRUE ANTIPODE','lc5-residual');}
  }
  function mount(scope=document){const root=scope.querySelector?.('#lanternClockC5Comparator');if(!root)return null;const stage=root.querySelector('[data-lc5-stage]'),output=root.querySelector('[data-lc5-output]');let view='OVERLAY';const messages={OVERLAY:'PASS · CLOCK 150° · C5 144° · RESIDUAL 6°',CLOCK:'CLOCK · 5:00 ↔ 10:00 · 150° · NOT ANTIPODAL',C5:'C5 · 4:48 ↔ 9:36 · 144° · STEP 72°',FOLD:'V-FOLD · 5.5 | 5.5 · SUM 11 · IMBALANCE 0',CONTROL:'CONTROL · 5:00 ↔ 11:00 · 180° TRUE ANTIPODE'};const paint=()=>{render(stage,view);output.textContent=messages[view];root.querySelectorAll('[data-lc5-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lc5View===view)));};root.querySelectorAll('[data-lc5-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.lc5View;paint();}));paint();return{paint,verify};}
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document));
  return Object.freeze({clockDegrees,circularDistance,c5Degrees,clockLabel,nearestC5,model,verify,render,mount});
});
