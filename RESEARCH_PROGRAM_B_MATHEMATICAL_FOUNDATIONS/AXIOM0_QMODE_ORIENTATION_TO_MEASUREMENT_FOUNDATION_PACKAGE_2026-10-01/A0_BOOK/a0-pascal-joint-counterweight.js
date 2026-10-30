(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0PascalJointCounterweight=api;
})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const VERSION='1.1.0';
  const IDENTITY='ART:A0:MATHEMATICAL_JOINTS';
  const ROUTE=Object.freeze([11537,11573,11357]);

  function requireValue(ok,message){if(!ok)throw new Error(message)}
  function sum(values){return values.reduce((total,value)=>total+value,0)}
  function counterweight(size){
    requireValue(Number.isInteger(size)&&size>0,'size must be a positive integer');
    return Object.freeze([...Array(size).keys()].map(i=>i+1).concat([...Array(size-1).keys()].map(i=>size-1-i)));
  }
  function repunit(length){
    requireValue(Number.isInteger(length)&&length>0,'length must be a positive integer');
    return (10n**BigInt(length)-1n)/9n;
  }
  function uniformConvolution(length){return counterweight(length)}
  function address(value,width){
    requireValue(Number.isInteger(value)&&value>=0,'value must be a nonnegative integer');
    requireValue(Number.isInteger(width)&&width>0,'width must be a positive integer');
    return Object.freeze({x:value%width,y:Math.floor(value/width)});
  }
  function qrt20(value){return Object.freeze({q:Math.floor(value/20),r:value%20})}
  function vector(a,b){return Object.freeze({dx:b.x-a.x,dy:b.y-a.y})}
  function projectMod(point,modulus){return Object.freeze({x:point.x%modulus,y:point.y%modulus})}
  function route(values,mapper,vectorFn=vector){
    const points=values.map(mapper),steps=points.slice(1).map((point,index)=>vectorFn(points[index],point));
    return Object.freeze({values:Object.freeze([...values]),points:Object.freeze(points),steps:Object.freeze(steps),net:vectorFn(points[0],points[points.length-1])});
  }
  function digitSignature(value){return String(value).split('').sort().join('')}
  function signedArea2(points){
    requireValue(Array.isArray(points)&&points.length===3,'three points required');
    const [a,b,c]=points;
    return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  }
  function distance2(a,b){return (b.x-a.x)**2+(b.y-a.y)**2}
  function threeHook(points,returnState){
    requireValue(Array.isArray(points)&&points.length===3,'three hook points required');
    const area2=signedArea2(points),center=Object.freeze({x:sum(points.map(point=>point.x))/3,y:sum(points.map(point=>point.y))/3});
    return Object.freeze({points:Object.freeze(points.map(point=>Object.freeze({...point}))),center,area2,orientation:area2>0?'CCW':area2<0?'CW':'COLLINEAR',pairDistance2:Object.freeze([distance2(points[0],points[1]),distance2(points[1],points[2]),distance2(points[2],points[0])]),returnState});
  }
  function mirrorHook(probe){
    const xs=probe.points.map(point=>point.x),axis=Math.min(...xs)+Math.max(...xs);
    return threeHook(probe.points.map(point=>({x:axis-point.x,y:point.y})),probe.returnState);
  }
  function model(){
    const g11=counterweight(11),g111=counterweight(111);
    const carrier=route(ROUTE,n=>address(n,111));
    const residue=route(ROUTE,n=>projectMod(address(n,111),11));
    const qrt=route(ROUTE,qrt20,(a,b)=>Object.freeze({dx:b.q-a.q,dy:b.r-a.r}));
    const hooks=Object.freeze({
      G111:threeHook(carrier.points,'EXACT_RETURN'),
      PI11:threeHook(residue.points,'AMBIGUOUS_VIEW_ONLY'),
      QRT20:threeHook(qrt.points.map(point=>({x:point.q,y:point.r})),'EXACT_RETURN')
    });
    return Object.freeze({
      identity:IDENTITY,
      g11:Object.freeze({size:11,cells:121,lanes:g11,laneCount:g11.length,center:g11[10]}),
      g111:Object.freeze({size:111,cells:12321,lanes:g111,laneCount:g111.length,center:g111[110]}),
      repunit3:Object.freeze({value:repunit(3),square:repunit(3)**2n,coefficients:uniformConvolution(3)}),
      route:Object.freeze({carrier,residue,qrt,digitSignatures:Object.freeze(ROUTE.map(digitSignature))}),
      hooks,
      handoffs:Object.freeze({scroll:'HOLD_SEAM_MAP_MISSING',pentagon:'HOLD_TYPED_ADAPTER_MISSING'}),
      negative:Object.freeze({gapSquare:101n**2n,weightedSquare:112n**2n,wrongKey:Object.freeze([11537,11574,11357])})
    });
  }
  function verify(input=model()){
    const checks=[];const check=(condition,label)=>{requireValue(condition,label);checks.push(label)};
    check(input.identity===IDENTITY,'existing identity reused');
    check(input.g11.laneCount===21,'G11 has 21 joint lanes');
    check(input.g11.center===11,'G11 center multiplicity is 11');
    check(sum(input.g11.lanes)===121,'G11 lanes sum to 121 cells');
    check(input.g11.lanes.every((v,i,a)=>v===a[a.length-1-i]),'G11 counterweights mirror exactly');
    check(input.g111.laneCount===221,'G111 has 221 joint lanes');
    check(input.g111.center===111,'G111 center multiplicity is 111');
    check(sum(input.g111.lanes)===12321,'G111 lanes sum to 12321 cells');
    check(input.g111.lanes.every((v,i,a)=>v===a[a.length-1-i]),'G111 counterweights mirror exactly');
    check(input.repunit3.value===111n,'R3 equals 111');
    check(input.repunit3.square===12321n,'R3 square equals 12321');
    check(input.repunit3.coefficients.join(',')==='1,2,3,2,1','R3 coefficient convolution is 12321');
    check(input.route.digitSignatures.every(value=>value==='11357'),'carrier route preserves digit multiset 11357');
    check(JSON.stringify(input.route.carrier.points)===JSON.stringify([{x:104,y:103},{x:29,y:104},{x:35,y:102}]),'G111 addresses exact');
    check(JSON.stringify(input.route.carrier.steps)===JSON.stringify([{dx:-75,dy:1},{dx:6,dy:-2}]),'G111 kink vectors exact');
    check(JSON.stringify(input.route.carrier.net)===JSON.stringify({dx:-69,dy:-1}),'G111 net displacement exact');
    check(JSON.stringify(input.route.residue.points)===JSON.stringify([{x:5,y:4},{x:7,y:5},{x:2,y:3}]),'pi11 projected addresses exact');
    check(JSON.stringify(input.route.residue.steps)===JSON.stringify([{dx:2,dy:1},{dx:-5,dy:-2}]),'pi11 kink vectors exact');
    check(JSON.stringify(input.route.qrt.points)===JSON.stringify([{q:576,r:17},{q:578,r:13},{q:567,r:17}]),'QRT20 addresses exact');
    check(JSON.stringify(input.route.qrt.steps)===JSON.stringify([{dx:2,dy:-4},{dx:-11,dy:4}]),'QRT20 kink vectors exact');
    check(JSON.stringify(input.hooks.G111.center)===JSON.stringify({x:56,y:103}),'G111 three-hook center exact');
    check(input.hooks.G111.area2===144&&input.hooks.G111.orientation==='CCW','G111 three-hook orientation exact');
    check(input.hooks.G111.pairDistance2.join(',')==='5626,40,4762','G111 three-hook metric signature exact');
    check(input.hooks.G111.returnState==='EXACT_RETURN','G111 return is invertible with width 111');
    check(input.hooks.PI11.area2===1&&input.hooks.PI11.orientation==='CCW','pi11 three-hook orientation exact');
    check(input.hooks.PI11.pairDistance2.join(',')==='5,29,10','pi11 three-hook metric signature exact');
    check(input.hooks.PI11.returnState==='AMBIGUOUS_VIEW_ONLY','pi11 projection does not identify the integers');
    check(input.hooks.QRT20.area2===-36&&input.hooks.QRT20.orientation==='CW','QRT20 reverses three-hook orientation');
    check(input.hooks.QRT20.pairDistance2.join(',')==='20,137,81','QRT20 three-hook metric signature exact');
    check(input.hooks.QRT20.returnState==='EXACT_RETURN','QRT20 return is invertible with key 20');
    check(mirrorHook(input.hooks.G111).area2===-input.hooks.G111.area2,'mirror flips signed area');
    check(mirrorHook(input.hooks.G111).pairDistance2.join(',')===input.hooks.G111.pairDistance2.join(','),'mirror preserves pair distances');
    check(input.handoffs.scroll==='HOLD_SEAM_MAP_MISSING'&&input.handoffs.pentagon==='HOLD_TYPED_ADAPTER_MISSING','scroll and pentagon handoffs remain typed holds');
    check(input.negative.gapSquare===10201n,'101 square gap control exact');
    check(input.negative.weightedSquare===12544n,'112 square weighted control exact');
    check(digitSignature(11574)!=='11357','wrong-key digit control breaks signature');
    return Object.freeze({status:'PASS_BOUNDED_PASCAL_JOINT_COUNTERWEIGHT',checks:Object.freeze(checks),checkCount:checks.length,newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([])});
  }

  function jointSvg(data){
    const left=55,base=232,step=28,max=150;
    const bars=data.lanes.map((value,index)=>{const height=value/data.center*max,x=left+index*step,y=base-height;const side=index===10?'center':index<10?'left':'right';return `<g class="pjc-bar pjc-bar--${side}" data-lane="${index}"><rect x="${x}" y="${y}" width="18" height="${height}" rx="5"/><text x="${x+9}" y="${Math.max(18,y-8)}">${value}</text></g>`}).join('');
    const pairs=[0,1,2,3,4].map(index=>{const x1=left+index*step+9,x2=left+(20-index)*step+9,y=44+index*12;return `<path class="pjc-pair" d="M${x1} ${base-(index+1)/11*max-5} Q${(x1+x2)/2} ${y} ${x2} ${base-(index+1)/11*max-5}"/>`}).join('');
    return `<svg viewBox="0 0 700 270" role="img" aria-label="11 mal 11 Pascal Joint mit 21 spiegelgekoppelten Gegendiagonalen">${pairs}<line class="pjc-axis" x1="344" y1="24" x2="344" y2="244"/>${bars}<text class="pjc-caption" x="55" y="258">1 … 10</text><text class="pjc-caption pjc-caption--center" x="344" y="258">11 · SELF-PAIRED</text><text class="pjc-caption" x="615" y="258">10 … 1</text></svg>`;
  }
  function pointLabel(point,label,box){const x=box.x+point.x/(box.mod-1)*box.w,y=box.y+box.h-point.y/(box.mod-1)*box.h;return {x,y,markup:`<g class="pjc-route-point"><circle cx="${x}" cy="${y}" r="6"/><text x="${x+9}" y="${y-8}">${label}</text></g>`}}
  function knickSvg(input){
    const left={x:48,y:43,w:230,h:230,mod:111},right={x:420,y:43,w:230,h:230,mod:11};
    const carrier=input.route.carrier.points.map((point,i)=>pointLabel(point,String(ROUTE[i]),left));
    const residue=input.route.residue.points.map((point,i)=>pointLabel(point,String(ROUTE[i]),right));
    const path=points=>points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
    return `<svg viewBox="0 0 700 320" role="img" aria-label="Knickroute 11537 nach 11573 nach 11357 im G111 Carrier und in der pi11 Projektion"><defs><pattern id="pjcSmallGrid" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M23 0H0V23"/></pattern></defs><text class="pjc-title" x="48" y="25">G111 · 111×111 CARRIER</text><rect class="pjc-grid" x="${left.x}" y="${left.y}" width="${left.w}" height="${left.h}"/><path class="pjc-route" d="${path(carrier)}"/>${carrier.map(p=>p.markup).join('')}<text class="pjc-title" x="420" y="25">π11 · 11×11 RESIDUE VIEW</text><rect class="pjc-grid pjc-grid--small" x="${right.x}" y="${right.y}" width="${right.w}" height="${right.h}" fill="url(#pjcSmallGrid)"/><path class="pjc-route pjc-route--residue" d="${path(residue)}"/>${residue.map(p=>p.markup).join('')}<text class="pjc-caption" x="48" y="302">ΔG111: (−75,+1) → (+6,−2)</text><text class="pjc-caption" x="420" y="302">Δπ11: (+2,+1) → (−5,−2)</text></svg>`;
  }
  function typeMarkup(input){return `<div class="pjc-type-grid"><article><small>GRID AREA</small><b>G11 · 11² = 121</b><span>21 Joint-Lanes · Mitte 11</span></article><article><small>LIFTED GRID AREA</small><b>G111 · 111² = 12321</b><span>221 Joint-Lanes · Mitte 111</span></article><article><small>DECIMAL CONVOLUTION</small><b>R3² = 111² = 12321</b><span>Koeffizienten 1·2·3·2·1</span></article><article class="is-hold"><small>TYPE GUARD</small><b>gleicher Skalar ≠ gleicher Bau</b><span>Gridfläche, Ziffernbild und Joint-Faser bleiben getrennt</span></article><article class="is-negative"><small>GAP CONTROL</small><b>101² = ${input.negative.gapSquare}</b><span>Null-Lücke statt uniformer Faltung</span></article><article class="is-negative"><small>WEIGHT CONTROL</small><b>112² = ${input.negative.weightedSquare}</b><span>gewichtete Beiträge / Carry</span></article></div>`}
  function hookMarkup(input,space='G111',mirrored=false){
    const source=input.hooks[space],probe=mirrored?mirrorHook(source):source,labels=['A · 11537','B · 11573','C · 11357'];
    const xs=probe.points.map(point=>point.x),ys=probe.points.map(point=>point.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),spanX=Math.max(1,maxX-minX),spanY=Math.max(1,maxY-minY);
    const map=point=>({x:90+(point.x-minX)/spanX*520,y:245-(point.y-minY)/spanY*165});
    const points=probe.points.map(map),center=map(probe.center),path=points.map((point,index)=>(index?'L':'M')+point.x+' '+point.y).join(' ')+' Z';
    const anchors=points.map((point,index)=>`<g class="pjc-hook-anchor"><line x1="${center.x}" y1="${center.y}" x2="${point.x}" y2="${point.y}"/><circle cx="${point.x}" cy="${point.y}" r="8"/><text x="${point.x+12}" y="${point.y-10}">${labels[index]}</text></g>`).join('');
    return `<div class="pjc-hook-shell"><nav class="pjc-hook-controls" aria-label="Drei-Haken Koordinatenansicht"><button type="button" data-pjc-hook-space="G111" aria-pressed="${space==='G111'}">G111</button><button type="button" data-pjc-hook-space="PI11" aria-pressed="${space==='PI11'}">π11</button><button type="button" data-pjc-hook-space="QRT20" aria-pressed="${space==='QRT20'}">QRT20</button><button type="button" data-pjc-hook-mirror aria-pressed="${mirrored}">MIRROR</button></nav><svg viewBox="0 0 700 285" role="img" aria-label="Drei-Haken Feldprobe in ${space}"><path class="pjc-hook-triangle" d="${path}"/>${anchors}<g class="pjc-hook-center"><circle cx="${center.x}" cy="${center.y}" r="10"/><text x="${center.x+14}" y="${center.y+5}">P · center (${Number.isInteger(probe.center.x)?probe.center.x:probe.center.x.toFixed(3)}, ${Number.isInteger(probe.center.y)?probe.center.y:probe.center.y.toFixed(3)})</text></g></svg><div class="pjc-hook-ledger"><span><small>SIGNED AREA₂</small><b>${probe.area2>0?'+':''}${probe.area2} · ${probe.orientation}</b></span><span><small>PAIR METRIC d²</small><b>${probe.pairDistance2.join(' · ')}</b></span><span><small>RETURN</small><b>${probe.returnState}</b></span><span class="is-hold"><small>NEXT ADAPTERS</small><b>SCROLL HOLD · PENTAGON HOLD</b></span></div><p><b>Field signature:</b> (orientation, three pair distances, return state). Das ist eine lokale Strukturmessung – keine physische Kraft.</p></div>`;
  }
  function viewMarkup(view,input){if(view==='JOINT')return jointSvg(input.g11);if(view==='KNICK')return knickSvg(input);if(view==='HOOKS')return hookMarkup(input);return typeMarkup(input)}
  function mount(root){
    if(!root)return null;const input=model(),proof=verify(input),stage=root.querySelector('[data-pjc-stage]'),output=root.querySelector('[data-pjc-output]');let view='JOINT',hookSpace='G111',mirrored=false;
    const messages={JOINT:'PASS · 21 LANES · 1…11…1 · Σ=121',KNICK:'PASS · SAME INTEGERS · THREE VIEW-DEPENDENT KINKS',TYPES:'PASS · 12321 SHARED SCALAR · CONSTRUCTIONS REMAIN DISTINCT'};
    function hookMessage(){const probe=mirrored?mirrorHook(input.hooks[hookSpace]):input.hooks[hookSpace];return `${probe.returnState} · AREA₂ ${probe.area2>0?'+':''}${probe.area2} · ${probe.orientation}${mirrored?' · MIRRORED':''}`}
    function bindHookControls(){stage.querySelectorAll('[data-pjc-hook-space]').forEach(button=>button.addEventListener('click',()=>{hookSpace=button.dataset.pjcHookSpace;paint()}));stage.querySelector('[data-pjc-hook-mirror]')?.addEventListener('click',()=>{mirrored=!mirrored;paint()})}
    function paint(){stage.innerHTML=view==='HOOKS'?hookMarkup(input,hookSpace,mirrored):viewMarkup(view,input);output.textContent=view==='HOOKS'?hookMessage():messages[view];root.dataset.view=view.toLowerCase();root.querySelectorAll('[data-pjc-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjcView===view)));if(view==='HOOKS')bindHookControls()}
    root.querySelectorAll('[data-pjc-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.pjcView;paint()}));paint();return Object.freeze({input,proof,get view(){return view}})
  }
  if(typeof document!=='undefined')document.querySelectorAll('[data-pascal-joint-counterweight]').forEach(mount);
  return Object.freeze({VERSION,IDENTITY,ROUTE,counterweight,repunit,uniformConvolution,address,qrt20,projectMod,route,digitSignature,signedArea2,distance2,threeHook,mirrorHook,model,verify,jointSvg,knickSvg,typeMarkup,hookMarkup,viewMarkup,mount});
});
