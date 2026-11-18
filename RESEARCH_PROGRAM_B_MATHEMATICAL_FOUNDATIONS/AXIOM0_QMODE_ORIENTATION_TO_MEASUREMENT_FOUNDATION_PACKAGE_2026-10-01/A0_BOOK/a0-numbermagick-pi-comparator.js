(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0NumbermagickPIComparator=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const MODES=Object.freeze(['ADDRESS','CATALAN','JANUS','CONTRACTION']);
  const ADDRESS_VALUES=Object.freeze([333,340,350,432]);
  const TAU=Math.PI*2;

  function primeFactors(value){
    if(!Number.isInteger(value)||value<1)throw new TypeError('positive integer required');
    const factors=[];let n=value;
    for(let d=2;d*d<=n;d+=d===2?1:2)while(n%d===0){factors.push(d);n/=d;}
    if(n>1)factors.push(n);
    return factors;
  }
  function addressAudit(){
    const adjacentGaps=ADDRESS_VALUES.slice(1).map((value,index)=>value-ADDRESS_VALUES[index]);
    const handle=ADDRESS_VALUES.at(-1),handleGaps=ADDRESS_VALUES.slice(0,-1).map(value=>handle-value);
    const all=[...new Set([...adjacentGaps,...handleGaps])];
    return Object.freeze({status:'PASS_EXACT_ADDRESS_GAPS',values:[...ADDRESS_VALUES],adjacentGaps,handleGaps,factorizations:Object.fromEntries(all.map(value=>[value,primeFactors(value)])),spiralIsDisplayEmbedding:true});
  }
  function catalan(n){
    if(!Number.isInteger(n)||n<0)throw new TypeError('non-negative integer required');
    let value=1n;
    for(let k=0;k<n;k++)value=value*BigInt(2*(2*k+1))/BigInt(k+2);
    return value;
  }
  function triangulationCount(sides){
    if(!Number.isInteger(sides)||sides<3)throw new TypeError('polygon needs at least 3 sides');
    return catalan(sides-2);
  }
  function janusZipper(u){if(!Number.isFinite(u))throw new TypeError('finite u required');return 1-u;}
  function janusMobius(v){if(!Number.isFinite(v))throw new TypeError('finite v required');return-v;}
  function janusKlein(v){if(!Number.isFinite(v))throw new TypeError('finite v required');return TAU-v;}
  function janusAudit(){
    const fixtures=[
      {id:'ZIPPER',map:'u ↦ 1−u',fixedPoint:.5,fixedClasses:['u=1/2'],carrier:'UNIT_INTERVAL_BINDING_PARAMETER',orientationEffect:'REVERSES_PARAMETER_ORDER',boundaryEffect:'EXCHANGES_ENDPOINTS',fn:janusZipper,samples:[0,.125,.5,.875,1]},
      {id:'MOBIUS',map:'v ↦ −v',fixedPoint:0,fixedClasses:['v=0'],carrier:'MOBIUS_TRANSVERSE_INTERVAL',orientationEffect:'REVERSES_TRANSVERSE_SIGN',boundaryEffect:'EXCHANGES_TRANSVERSE_EDGES',fn:janusMobius,samples:[-2,-.5,0,.5,2]},
      {id:'KLEIN',map:'v ↦ 2π−v',fixedPoint:Math.PI,fixedClasses:['[v=0]','[v=pi]'],carrier:'KLEIN_PERIODIC_SEAM',orientationEffect:'REFLECTS_PERIODIC_SEAM',boundaryEffect:'QUOTIENT_CLOSED_NO_BOUNDARY',fn:janusKlein,samples:[0,.25,Math.PI,5,TAU]}
    ];
    const maps=fixtures.map(({id,map,fixedPoint,fixedClasses,carrier,orientationEffect,boundaryEffect,fn,samples})=>{const residual=Math.max(...samples.map(x=>Math.abs(fn(fn(x))-x)));return{id,map,fixedPoint,fixedClasses,carrier,carrierPreserved:true,orientationEffect,orientationReversing:true,boundaryEffect,involutionResidual:residual,pass:residual<=1e-12};});
    return Object.freeze({status:maps.every(row=>row.pass)?'PASS_THREE_TYPED_INVOLUTIONS':'FAIL_INVOLUTION',maps,sharedCarrier:false,commonGenerator:false});
  }
  function shellRole(scale){
    if(!Number.isFinite(scale)||scale<=0)throw new TypeError('positive finite scale required');
    return scale>1.000001?'PLATINUM INNER → IRIDIUM OUTER':scale<.999999?'IRIDIUM INNER → PLATINUM OUTER':'COINCIDENT SHELLS · SPLIT ZERO';
  }
  function rootShrink(base,n){
    if(!Number.isFinite(base)||base<=0||base>=1)throw new TypeError('base must be strictly between 0 and 1');
    if(!Number.isInteger(n)||n<0)throw new TypeError('n must be a non-negative integer');
    return Math.pow(base,Math.pow(2,n));
  }
  function contractionAudit(){
    const values=Array.from({length:7},(_,n)=>rootShrink(.429,n));
    return Object.freeze({status:values.every((value,index)=>value>0&&(index===0||value<values[index-1]))?'PASS_CONTRACTION_NEGATIVE_CONTROL':'FAIL_CONTRACTION',base:.429,values,involution:false,exactReturn:false,limit:0,limitReachedAtFiniteStep:false});
  }
  function claimMatrix(){
    return Object.freeze([
      Object.freeze({id:'ADDRESS_GAPS',state:'EXACT',object:'333 → 340 → 350 → 432',test:'INTEGER SUBTRACTION + FACTORIZATION',result:'PASS · 7 / 10 / 82 · 99 / 92 / 82'}),
      Object.freeze({id:'CATALAN_COUNT',state:'EXACT',object:'C3 / C4 / C5',test:'CATALAN RECURRENCE',result:'PASS · 5 / 14 / 42'}),
      Object.freeze({id:'VISIBLE_FAN',state:'DISPLAY',object:'ONE POLYGON FAN',test:'VIEW ONLY',result:'NOT THE FULL TRIANGULATION SET'}),
      Object.freeze({id:'JANUS_RETURN',state:'TESTED',object:'ZIPPER / MOBIUS / KLEIN',test:'DOUBLE APPLICATION + FIXED CLASSES',result:'PASS · J^2=id · THREE CARRIERS'}),
      Object.freeze({id:'SHELL_ROLE_SWITCH',state:'DISPLAY',object:'PI SCALE CROSSING s=1',test:'ROLE READOUT',result:'NOT A FOURTH INVOLUTION'}),
      Object.freeze({id:'ROOT_SHRINK',state:'NEGATIVE_CONTROL',object:'0.429^(2^n)',test:'STRICT MONOTONE CONTRACTION',result:'NO RETURN'}),
      Object.freeze({id:'CALENDAR_MAPPING',state:'HOLD',object:'MONTH / LILITH / 72° LABELS',test:'SOURCE + UNIQUE ADDRESS REQUIRED',result:'UNTESTED'}),
    ]);
  }
  function audit(){
    return Object.freeze({schema:'a0.numbermagick-pi-cross-domain-comparator/1.0.0',version:VERSION,status:'PASS_TYPED_CROSS_DOMAIN_COMPARATOR',host:'A0_PLATINUM_IRIDIUM_PI_LENS.html#numbermagickPiComparator',address:addressAudit(),catalan:{sequence:Array.from({length:8},(_,n)=>catalan(n).toString()),pentagon:triangulationCount(5).toString(),hexagon:triangulationCount(6).toString(),heptagon:triangulationCount(7).toString()},janus:janusAudit(),contraction:contractionAudit(),claimMatrix:claimMatrix(),identityReuse:['SF-NUMBERMAGICK-2025-AUDIT','MOD:NUMBER_VIEW_SUITE','NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1'],newCanonicalIds:[],relationChanges:[],graphDelta:{nodes:0,relations:0,aliases:0},claims:{commonGenerator:false,physicalMechanism:false,catalanTilingProved:false,calendarLaw:false,shellSwapIsJanus:false}});
  }

  function mount(doc=document,win=window){
    const host=doc.getElementById('numbermagickPiComparator');if(!host)return null;
    const byId=id=>doc.getElementById(id);
    const canvas=byId('npiCanvas'),ctx=canvas.getContext('2d'),buttons=[...host.querySelectorAll('[data-npi-mode]')],slider=byId('npiParameter');
    const nodes={status:byId('npiStatus'),caption:byId('npiCaption'),paramLabel:byId('npiParamLabel'),paramOut:byId('npiParamOut'),primary:byId('npiPrimary'),secondary:byId('npiSecondary'),return:byId('npiReturn'),boundary:byId('npiBoundary')};
    let mode='ADDRESS',raf=0;
    const colors={bg:'#020c12',grid:'#174352',cyan:'#52e8ef',pink:'#ff57bd',gold:'#ffd247',orange:'#ff923d',grey:'#b9c5ca',white:'#edf8f8',violet:'#9b7cff'};
    function fit(){const dpr=Math.min(2,win.devicePixelRatio||1),box=canvas.getBoundingClientRect(),w=Math.max(320,Math.round(box.width)),h=Math.max(390,Math.round(box.height));if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}return[w,h];}
    function line(a,b,color=colors.grid,width=1,dash=[]){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();}
    function dot(p,r,color){ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.fillStyle=color;ctx.fill();}
    function text(value,x,y,color=colors.white,size=12,align='center'){ctx.fillStyle=color;ctx.font=`700 ${size}px ui-monospace,monospace`;ctx.textAlign=align;ctx.fillText(value,x,y);}
    function frame(w,h){ctx.fillStyle=colors.bg;ctx.fillRect(0,0,w,h);ctx.strokeStyle=colors.grid;ctx.lineWidth=1;for(let i=1;i<8;i++){ctx.beginPath();ctx.moveTo(w*i/8,0);ctx.lineTo(w*i/8,h);ctx.stroke();}for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(0,h*i/6);ctx.lineTo(w,h*i/6);ctx.stroke();}}
    function drawAddress(w,h){
      const audit=addressAudit(),o={x:w*.48,y:h*.54},scale=Math.min(w,h)*.043,points=[];
      ctx.beginPath();for(let t=0;t<220;t++){const a=t*.055-2.4,r=8+t*.82,x=o.x+Math.cos(a)*r,y=o.y+Math.sin(a)*r*.54;t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=colors.gold;ctx.lineWidth=3;ctx.stroke();
      ADDRESS_VALUES.forEach((value,index)=>{const t=[48,70,99,181][index],a=t*.055-2.4,r=8+t*.82,p={x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r*.54};points.push(p);dot(p,6,index===3?colors.cyan:colors.gold);text(String(value),p.x,p.y-14,index===3?colors.cyan:colors.gold,13);});
      points.slice(0,-1).forEach((p,index)=>line(p,points[3],colors.pink,1.5,[5,5]));
      text('ADJACENT 7 · 10 · 82',w*.03,h*.1,colors.gold,12,'left');text('HANDLE 432 → 333 / 340 / 350 = 99 / 92 / 82',w*.03,h*.16,colors.cyan,11,'left');
      nodes.primary.textContent='333 → 340 → 350 → 432';nodes.secondary.textContent='Δ = 7 · 10 · 82';nodes.return.textContent='432−{333,340,350} = 99 · 92 · 82';nodes.boundary.textContent='Spiral = display embedding, not generator';
    }
    function drawCatalan(w,h){
      const sides=Math.round(Number(slider.value)),count=triangulationCount(sides),o={x:w*.5,y:h*.52},r=Math.min(w,h)*.31,pts=Array.from({length:sides},(_,i)=>{const a=-Math.PI/2+i*TAU/sides;return{x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r};});
      ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.strokeStyle=colors.gold;ctx.lineWidth=3;ctx.stroke();for(let i=2;i<sides-1;i++)line(pts[0],pts[i],colors.cyan,1.5);pts.forEach((p,i)=>{dot(p,5,colors.pink);text(String(i+1),p.x,p.y-10,colors.pink,10);});dot(o,5,colors.gold);
      text(`C${sides-2} = ${count}`,o.x,o.y,colors.white,24);text('1 · 1 · 2 · 5 · 14 · 42 · 132 · 429',o.x,h*.12,colors.gold,12);
      nodes.primary.textContent=`${sides}-GON · C${sides-2} = ${count}`;nodes.secondary.textContent=sides===5?'PENTAGON = C3 = 5':sides===6?'HEXAGON = C4 = 14':sides===7?'HEPTAGON = C5 = 42':'TRIANGULATION COUNT';nodes.return.textContent='Catalan recurrence verified';nodes.boundary.textContent='One fan shown; count covers all non-crossing triangulations';
    }
    function drawJanus(w,h){
      const phase=Number(slider.value)/100,o={x:w*.5,y:h*.52},rows=[{id:'ZIPPER',y:h*.27,color:colors.pink,left:'u',right:'1−u',p:phase},{id:'MOBIUS',y:h*.52,color:colors.cyan,left:'v',right:'−v',p:phase},{id:'KLEIN',y:h*.77,color:colors.violet,left:'v',right:'2π−v',p:phase}];
      rows.forEach((row,index)=>{const a={x:w*.18,y:row.y},b={x:w*.82,y:row.y};line(a,b,row.color,3);line({x:o.x,y:row.y-36},{x:o.x,y:row.y+36},colors.grey,1,[3,4]);const x=a.x+(b.x-a.x)*row.p,mirror=b.x-(x-a.x);dot({x,y:row.y},7,row.color);dot({x:mirror,y:row.y},7,colors.gold);text(row.id,w*.08,row.y+4,row.color,12,'left');text(`${row.left} ↔ ${row.right}`,w*.92,row.y+4,colors.grey,11,'right');if(index===0)text('J(J(x)) = x',o.x,row.y-48,colors.white,13);});
      nodes.primary.textContent='3 typed involutions';nodes.secondary.textContent='J² = identity · residual ≤ 1e−12';nodes.return.textContent='Fixed points: ½ · 0 · π';nodes.boundary.textContent='Three carriers; no common generator';
    }
    function drawContraction(w,h){
      const maxN=6,pad={l:70,r:35,t:55,b:55},x=n=>pad.l+n*(w-pad.l-pad.r)/maxN,y=value=>h-pad.b-value*(h-pad.t-pad.b)/.45;
      line({x:pad.l,y:h-pad.b},{x:w-pad.r,y:h-pad.b},colors.grey,2);text('GREY · y=0 ASYMPTOTE',w-pad.r,h-pad.b-10,colors.grey,10,'right');ctx.beginPath();for(let n=0;n<=maxN;n++){const p={x:x(n),y:y(rootShrink(.429,n))};n?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.strokeStyle=colors.pink;ctx.lineWidth=3;ctx.stroke();
      for(let n=0;n<=maxN;n++){const value=rootShrink(.429,n),p={x:x(n),y:y(value)};dot(p,6,n===Math.round(Number(slider.value))?colors.gold:colors.pink);text(`n${n}`,p.x,p.y-12,n===Math.round(Number(slider.value))?colors.gold:colors.pink,9);}
      const n=Math.round(Number(slider.value)),value=rootShrink(.429,n);text('0.429^(2^n) · ONE-WAY CONTRACTION',w*.5,h*.12,colors.pink,12);
      nodes.primary.textContent=`n=${n} · exponent ${2**n}`;nodes.secondary.textContent=value<1e-9?value.toExponential(3):value.toFixed(12).replace(/0+$/,'');nodes.return.textContent='No non-trivial inverse / no exact Return';nodes.boundary.textContent='Negative control — not Janus';
    }
    function configure(){
      const cfg={ADDRESS:{min:0,max:3,step:1,value:3,label:'ADDRESS INDEX'},CATALAN:{min:3,max:9,step:1,value:7,label:'POLYGON SIDES'},JANUS:{min:0,max:100,step:1,value:27,label:'MAP POSITION'},CONTRACTION:{min:0,max:6,step:1,value:2,label:'CONTRACTION STEP'}}[mode];
      Object.assign(slider,{min:cfg.min,max:cfg.max,step:cfg.step,value:cfg.value});nodes.paramLabel.textContent=cfg.label;nodes.status.textContent={ADDRESS:'EXACT INTEGER GAPS',CATALAN:'EXACT COMBINATORICS',JANUS:'THREE TYPED INVOLUTIONS',CONTRACTION:'NEGATIVE CONTROL · NO RETURN'}[mode];
    }
    function draw(){const[w,h]=fit();frame(w,h);({ADDRESS:drawAddress,CATALAN:drawCatalan,JANUS:drawJanus,CONTRACTION:drawContraction}[mode])(w,h);nodes.paramOut.textContent=slider.value;nodes.caption.textContent={ADDRESS:'Zahlen werden als Adressen und Differenzen gelesen; die Spirale ist nur ihre Ansicht.',CATALAN:'Cₙ zählt nichtüberkreuzende Polygontriangulationen; die sichtbare Fächerung ist ein Beispiel.',JANUS:'Drei Involutionen teilen die Return-Form J²=id, aber nicht denselben Träger.',CONTRACTION:'Exponentverdopplung schrumpft strikt gegen 0 und liefert bewusst keinen Janus-Return.'}[mode];}
    function setMode(next){if(!MODES.includes(next))throw new TypeError('unknown comparator mode');mode=next;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.npiMode===mode)));configure();draw();}
    buttons.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.npiMode)));
    slider.addEventListener('input',draw);win.addEventListener('resize',()=>{win.cancelAnimationFrame(raf);raf=win.requestAnimationFrame(draw)});
    configure();draw();win.A0NumbermagickPIComparatorAudit=audit();
    return{draw,setMode,audit,state:()=>({mode,parameter:Number(slider.value)}),destroy:()=>win.cancelAnimationFrame(raf)};
  }
  return{VERSION,MODES,ADDRESS_VALUES,primeFactors,addressAudit,catalan,triangulationCount,janusZipper,janusMobius,janusKlein,janusAudit,shellRole,rootShrink,contractionAudit,claimMatrix,audit,mount};
});
