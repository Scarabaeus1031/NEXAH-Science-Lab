(function(win){
  'use strict';
  const M=win.A0PrimecubeModel,T=win.A0PrimeTorusThreadDemonstrator;if(!M)return;
  const data=M.buildDataset(),orientation=data.dualGridOrientation,colors={prime:'#4f8df7',twin:'#f05549',triplet:'#ffc21a',quadruplet:'#ae50ef',super:'#3fbd72',gap:'#9c8126',seam:'#19c99a',composite:'#333947',unit:'#525866'};

  function mount(root){
    const canvas=root.querySelector('.pc-workbench canvas'),ctx=canvas.getContext('2d'),detail=root.querySelector('[data-pc-detail]'),summary=root.querySelector('[data-pc-summary]'),foldOut=root.querySelector('[data-pc-fold-out]'),foldInput=root.querySelector('[data-pc-fold]'),foldPlay=root.querySelector('[data-pc-fold-play]'),hrecord=root.querySelector('[data-pc-hrecord]'),hpath=root.querySelector('[data-pc-hpath]'),sliceRail=root.querySelector('[data-pc-slice-rail]'),eulerRail=root.querySelector('[data-pc-euler-rail]'),measureRail=root.querySelector('[data-pc-measure-rail]'),measureSourceNote=root.querySelector('[data-pc-measure-source-note]'),measureContractPanel=root.querySelector('[data-pc-measure-contract-panel]'),measureContractTitle=root.querySelector('[data-pc-measure-contract-title]'),measureContractSource=root.querySelector('[data-pc-measure-contract-source]'),measureContractOperator=root.querySelector('[data-pc-measure-contract-operator]'),measureContractReturn=root.querySelector('[data-pc-measure-contract-return]'),measureContractBoundary=root.querySelector('[data-pc-measure-contract-boundary]'),measureContractStatus=root.querySelector('[data-pc-measure-contract-status]'),measureContractLink=root.querySelector('[data-pc-measure-contract-link]'),plateRail=root.querySelector('[data-pc-plate-rail]'),plateCountInput=root.querySelector('[data-pc-plate-count]'),plateOut=root.querySelector('[data-pc-plate-out]'),centeredRail=root.querySelector('[data-pc-centered-rail]'),centeredAxisInput=root.querySelector('[data-pc-centered-axis]'),centeredRoot7Button=root.querySelector('[data-pc-centered-root7]'),centeredPlay=root.querySelector('[data-pc-centered-play]'),centeredOut=root.querySelector('[data-pc-centered-out]'),demoCanvas=root.querySelector('[data-pc-orbit-demo]'),demoCtx=demoCanvas&&demoCanvas.getContext('2d'),demoDetail=root.querySelector('[data-pc-orbit-detail]'),contractGrid=root.querySelector('[data-pc-contract-grid]'),contractCount=root.querySelector('[data-pc-contract-count]');
    let view='grid',filter='all',sliceZ=0,selectedDeck=null,deckLabelMode='all',plateBase=11,plateCount=10,plateCoupling='open',centeredSize=5,centeredChannel='single',centeredAxis='3:9',centeredRoot7=true,centeredStep=0,centeredTimer=null,eulerMode='mod7',measureMarker=15.7,measureUnit='ft',measureContract='mycel',fold=.4,foldTimer=null,foldDirection=1,rotX=.56,rotY=-.68,drag=false,last={x:0,y:0},hover=null,points=[];
    const dpr=()=>Math.max(1,Math.min(2,win.devicePixelRatio||1));

    function resize(){const r=canvas.getBoundingClientRect(),p=dpr();canvas.width=Math.max(1,Math.round(r.width*p));canvas.height=Math.max(1,Math.round(r.height*p));ctx.setTransform(p,0,0,p,0,0);draw()}
    function activeKind(node){if(node.kinds.includes('QUADRUPLET'))return'quadruplet';if(node.kinds.includes('TRIPLET'))return'triplet';if(node.kinds.includes('TWIN'))return'twin';if(node.isSuperprime)return'super';if(node.isPrime)return'prime';return node.n===1?'unit':'composite'}
    function visible(node){if(filter==='all')return true;if(filter==='prime')return node.isPrime;if(filter==='twin')return node.kinds.includes('TWIN');if(filter==='triplet')return node.kinds.includes('TRIPLET');if(filter==='quadruplet')return node.kinds.includes('QUADRUPLET');if(filter==='super')return node.isSuperprime;if(filter==='gap')return node.inTwinClusterGap||M.GAP.leftTwin.includes(node.n)||M.GAP.rightTwin.includes(node.n);if(filter==='seam')return node.layerClosure.isClosure;return true}
    function color(node){if(node.layerClosure.isClosure&&filter==='seam')return colors.seam;return node.inTwinClusterGap&&filter==='gap'?colors.gap:colors[activeKind(node)]}
    function project3(x,y,z,w,h){
      const X=x-5,Y=y-5,Z=z-4.5,x1=X*Math.cos(rotY)-Z*Math.sin(rotY),z1=X*Math.sin(rotY)+Z*Math.cos(rotY),y1=Y*Math.cos(rotX)-z1*Math.sin(rotX),z2=Y*Math.sin(rotX)+z1*Math.cos(rotX),scale=Math.min(w,h)*.061,persp=18/(18+z2);
      return{x:w/2+x1*scale*persp,y:h/2+y1*scale*persp,z:z2,r:Math.max(1.5,3.1*persp)};
    }
    function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
    function label(text,x,y,align='left',fill='#aab4c8',font='11px ui-monospace, monospace'){ctx.fillStyle=fill;ctx.font=font;ctx.textAlign=align;ctx.fillText(text,x,y)}

    const demoSteps=data.qCube.coupledGridBarcode.steps;
    let demoSelected=demoSteps.find(step=>step.perfectPeak)||demoSteps[0],demoPoints=[];
    function renderDemoDetail(step){
      if(!demoDetail)return;
      const node=data.nodes[step.n-1],previous=demoSteps[(step.orbitStep+59)%60],next=demoSteps[(step.orbitStep+1)%60],roles=[step.prime?`PRIME #${node.primeIndex}`:null,step.perfectPeak?'PERFECT NUMBER #3':null].filter(Boolean).join(' · ')||'UNIT ORBIT RECORD';
      demoDetail.innerHTML=`<small>COUPLED ORBIT RECORD · STEP ${step.orbitStep}/60</small><h3>${step.n}</h3><p><b>${roles}</b></p><dl><dt>Source n</dt><dd>${step.n}</dd><dt>Cube</dt><dd>[${step.cube.x}, ${step.cube.y}, ${step.cube.z}]</dd><dt>CRT</dt><dd>(${step.crt.mod7}, ${step.crt.mod11}, ${step.crt.mod13})</dd><dt>MZ24</dt><dd>${step.mz24.tick} / 23</dd><dt>Angle</dt><dd>${step.mz24.angleDegrees}° · Q${step.mz24.quadrant}${step.mz24.quarterTurn?' · 90° AXIS':''}</dd><dt>Previous</dt><dd>${previous.n}</dd><dt>T₂₀+</dt><dd>${step.n} → ${next.n}</dd><dt>Base 11</dt><dd>${M.toBase11(step.n)}<sub>11</sub></dd><dt>Return</dt><dd>${step.orbitStep===59?'20·951 mod 1001 = 1':'EXACT → '+step.n}</dd></dl><p class="pc-detail-boundary"><b>SAME SOURCE, THREE READINGS.</b><br>Cube and CRT coordinates are computed independently from <code>n=${step.n}</code>. <code>MZ24=(r11+r13) mod 24</code> is a declared, non-injective compass view: 24 ticks, 15° each, six ticks per 90°. Cube z remains a separate vertical trace.</p>`;
    }
    function drawOrbitDemonstrator(){
      if(!demoCanvas||!demoCtx)return;
      const w=demoCanvas.clientWidth,h=demoCanvas.clientHeight,p=dpr();demoCanvas.width=Math.max(1,Math.round(w*p));demoCanvas.height=Math.max(1,Math.round(h*p));demoCtx.setTransform(p,0,0,p,0,0);
      const g=demoCtx.createRadialGradient(w*.55,h*.42,20,w*.55,h*.42,Math.max(w,h)*.72);g.addColorStop(0,'#141d2c');g.addColorStop(1,'#070c14');demoCtx.fillStyle=g;demoCtx.fillRect(0,0,w,h);
      const left=58,right=w-28,top=86,bottom=h-72,width=right-left,column=width/60,laneGap=14,laneH=(bottom-top-laneGap*4)/5,rows=[{key:'mod7',max:6,color:'#55d9f2',label:'n mod 7'},{key:'mod11',max:10,color:'#ae50ef',label:'n mod 11'},{key:'mod13',max:12,color:'#3fbd72',label:'n mod 13'},{key:'mz24',max:23,color:'#ef7ec3',label:'MZ24'},{key:'layer',max:9,color:'#d6b64b',label:'cube z'}];
      const rowValue=(step,key)=>key==='layer'?step.cube.z:key==='mz24'?step.mz24.tick:step.crt[key];
      const xFor=step=>left+(step.orbitStep+.5)*column;demoPoints=[];
      demoCtx.fillStyle='rgba(255,211,90,.07)';demoCtx.fillRect(xFor(demoSelected)-column*.52,42,column*1.04,bottom-30);demoCtx.strokeStyle='#ffd35a';demoCtx.lineWidth=1.2;demoCtx.beginPath();demoCtx.moveTo(xFor(demoSelected),42);demoCtx.lineTo(xFor(demoSelected),bottom);demoCtx.stroke();
      demoCtx.font='700 11px ui-monospace, monospace';demoCtx.textAlign='left';demoCtx.fillStyle='#dbe6ff';demoCtx.fillText('60 COLUMNS · T₂₀+(n)=20n mod 1001 · SAME SOURCE n',left,24);demoCtx.font='700 10px ui-monospace, monospace';demoCtx.fillStyle='#ef7ec3';demoCtx.fillText('MZ24 · 24 TICKS · 15°/TICK · 6 TICKS = 90°',left,43);demoCtx.textAlign='right';demoCtx.fillStyle='#8d9bb1';demoCtx.fillText('click a column',right,24);
      for(const step of demoSteps){const x=xFor(step);if(step.prime){demoCtx.beginPath();demoCtx.arc(x,48,3,0,Math.PI*2);demoCtx.fillStyle='#ff9f43';demoCtx.fill()}if(step.perfectPeak){demoCtx.strokeStyle='#ffd35a';demoCtx.lineWidth=2;demoCtx.strokeRect(x-column*.42,39,column*.84,18)}}
      rows.forEach((row,index)=>{const y=top+index*(laneH+laneGap),base=y+laneH;demoCtx.fillStyle='rgba(7,13,23,.56)';demoCtx.fillRect(left,y,width,laneH);demoCtx.strokeStyle='rgba(140,165,193,.16)';demoCtx.strokeRect(left+.5,y+.5,width-1,laneH-1);if(row.key==='mz24'){for(const tick of [0,6,12,18]){const gy=base-8-(tick/row.max)*(laneH-22);demoCtx.beginPath();demoCtx.moveTo(left,gy);demoCtx.lineTo(right,gy);demoCtx.strokeStyle='rgba(239,126,195,.22)';demoCtx.setLineDash([3,4]);demoCtx.stroke();demoCtx.setLineDash([])}}demoCtx.textAlign='right';demoCtx.font='700 10px ui-monospace, monospace';demoCtx.fillStyle=row.color;demoCtx.fillText(row.label,left-8,y+12);demoCtx.beginPath();demoSteps.forEach((step,i)=>{const value=rowValue(step,row.key),x=xFor(step),py=base-8-(value/row.max)*(laneH-22);i?demoCtx.lineTo(x,py):demoCtx.moveTo(x,py)});demoCtx.strokeStyle=row.color;demoCtx.globalAlpha=.38;demoCtx.lineWidth=1;demoCtx.stroke();demoCtx.globalAlpha=1;for(const step of demoSteps){const value=rowValue(step,row.key),x=xFor(step),bar=Math.max(2,(value/row.max)*(laneH-22));demoCtx.beginPath();demoCtx.moveTo(x,base-8);demoCtx.lineTo(x,base-8-bar);demoCtx.strokeStyle=row.color;demoCtx.globalAlpha=.35+.65*(value/row.max);demoCtx.lineWidth=Math.max(2,column*.55);demoCtx.stroke();demoCtx.globalAlpha=1;demoCtx.beginPath();demoCtx.arc(x,base-8-bar,2.2,0,Math.PI*2);demoCtx.fillStyle=row.color;demoCtx.fill()}});
      demoCtx.textAlign='center';demoCtx.font='9px ui-monospace, monospace';for(const tick of [0,10,20,30,40,50,59]){const x=left+(tick+.5)*column;demoCtx.fillStyle='#748198';demoCtx.fillText(String(tick),x,bottom+18)}
      demoCtx.font='700 10px ui-monospace, monospace';demoCtx.fillStyle='#e7c64d';demoCtx.fillText('n₀=1  →  n₅₉=951  →  20·951 mod 1001 = 1 / EXACT RETURN',w/2,h-24);
      for(const step of demoSteps)demoPoints.push({step,x:xFor(step),r:Math.max(7,column*.7)});
      renderDemoDetail(demoSelected);
    }

    function drawGrid(w,h){
      const cols=M.GRID_COLUMNS,shadow=data.seamShadow,rows=filter==='seam'?shadow.grid.row+1:Math.ceil(M.MAX_N/cols),pad=24,gap=2,cw=Math.max(4,(w-pad*2-gap*(cols-1))/cols),ch=Math.max(4,Math.min(cw,(h-pad*2-gap*(rows-1))/rows)),gridW=cols*cw+(cols-1)*gap,gridH=rows*ch+(rows-1)*gap,ox=(w-gridW)/2,oy=(h-gridH)/2;
      points=[];
      for(const node of data.nodes){const {column,row}=node.grid,x=ox+column*(cw+gap),y=oy+row*(ch+gap),on=visible(node),kind=activeKind(node);rounded(x,y,cw,ch,Math.min(2,cw*.18));ctx.fillStyle=on?color(node):(node.isPrime?'rgba(79,141,247,.12)':'rgba(51,57,71,.35)');ctx.fill();if(node.inTwinClusterGap){ctx.strokeStyle=filter==='gap'?'#e7c64d':'rgba(156,129,38,.42)';ctx.lineWidth=filter==='gap'?1.2:.6;ctx.stroke()}if(node.layerClosure.isClosure){ctx.strokeStyle=filter==='seam'?colors.seam:'rgba(25,201,154,.45)';ctx.lineWidth=filter==='seam'?1.8:.7;ctx.stroke()}if(cw>13&&on&&(kind!=='composite'||filter==='seam'))label(String(node.n),x+cw/2,y+ch*.68,'center',filter==='seam'?'#051510':kind==='triplet'?'#15191f':'#fff',`${Math.max(6,Math.min(9,cw*.42))}px ui-monospace, monospace`);points.push({node,x:x+cw/2,y:y+ch/2,r:Math.max(4,cw*.6)});}
      if(filter==='seam'){
        const center=address=>({x:ox+address.column*(cw+gap)+cw/2,y:oy+address.row*(ch+gap)+ch/2}),rail=data.layerClosures.map(n=>center(data.nodes[n-1].grid)),ghost=center(shadow.grid);
        ctx.save();ctx.beginPath();rail.forEach((p,index)=>index?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineTo(ghost.x,ghost.y);ctx.strokeStyle='rgba(25,201,154,.7)';ctx.lineWidth=1.35;ctx.setLineDash([5,4]);ctx.stroke();ctx.setLineDash([3,3]);diamond(ghost.x,ghost.y,Math.max(5,cw*.6),'#ffd35a','rgba(255,211,90,.09)',1.8);ctx.restore();
        label('1210',ghost.x,ghost.y+3,'center','#ffd35a',`${Math.max(7,Math.min(9,cw*.46))}px ui-monospace, monospace`);
        label('SHADOW CLOSURE · 10×121 · OUTSIDE CARRIER',ghost.x,Math.min(h-5,ghost.y+ch+13),'center','#d5b34f','700 9px ui-monospace, monospace');
      }
      label('37 columns · sequential address · 1..1111',ox,Math.max(14,oy-8));
    }
    function edge(a,b,w,h,stroke='rgba(140,165,193,.28)',width=1){const p=project3(a.x,a.y,a.z,w,h),q=project3(b.x,b.y,b.z,w,h);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
    function cubeFrame(w,h){const xs=[0,10],ys=[0,10],zs=[0,9];for(const x of xs)for(const y of ys)edge({x,y,z:0},{x,y,z:9},w,h);for(const x of xs)for(const z of zs)edge({x,y:0,z},{x,y:10,z},w,h);for(const y of ys)for(const z of zs)edge({x:0,y,z},{x:10,y,z},w,h)}
    function layerPlane(z,w,h,strong=false){const stroke=strong?'rgba(25,201,154,.9)':'rgba(25,201,154,.22)',width=strong?2:1;edge({x:0,y:0,z},{x:10,y:0,z},w,h,stroke,width);edge({x:10,y:0,z},{x:10,y:10,z},w,h,stroke,width);edge({x:10,y:10,z},{x:0,y:10,z},w,h,stroke,width);edge({x:0,y:10,z},{x:0,y:0,z},w,h,stroke,width)}
    function fillLayerDeck(z,w,h){
      const corners=[{x:0,y:0,z},{x:10,y:0,z},{x:10,y:10,z},{x:0,y:10,z}].map(point=>project3(point.x,point.y,point.z,w,h));
      ctx.save();ctx.beginPath();corners.forEach((p,index)=>index?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
      const gradient=ctx.createLinearGradient(corners[0].x,corners[0].y,corners[2].x,corners[2].y);gradient.addColorStop(0,'rgba(25,201,154,.16)');gradient.addColorStop(.55,'rgba(79,141,247,.075)');gradient.addColorStop(1,'rgba(25,201,154,.035)');ctx.fillStyle=gradient;ctx.fill();ctx.restore();
    }
    function drawPlateTriad(w,h){
      const base=plateBase,max=base-1,index=plateCount-1,area=base*base,closure=plateCount*area,volume=base*base*base,remaining=volume-closure;
      const project=(x,y,z)=>{const X=(x/max-.5)*10,Y=(y/max-.5)*10,Z=(z/max-.5)*10,x1=X*Math.cos(rotY)-Z*Math.sin(rotY),z1=X*Math.sin(rotY)+Z*Math.cos(rotY),y1=Y*Math.cos(rotX)-z1*Math.sin(rotX),z2=Y*Math.sin(rotX)+z1*Math.cos(rotX),scale=Math.min(w,h)*.056,persp=18/(18+z2);return{x:w/2+x1*scale*persp,y:h/2+y1*scale*persp,z:z2}};
      const line=(a,b,stroke='rgba(140,165,193,.25)',width=1)=>{const p=project(a.x,a.y,a.z),q=project(b.x,b.y,b.z);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()};
      const plane=(family,corners,stroke,fill)=>{const pts=corners.map(p=>project(p.x,p.y,p.z));ctx.save();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();ctx.restore();label(family,pts[2].x+8,pts[2].y-6,'left',stroke,'800 11px ui-monospace, monospace')};
      points=[];
      for(const x of [0,max])for(const y of [0,max])line({x,y,z:0},{x,y,z:max});
      for(const x of [0,max])for(const z of [0,max])line({x,y:0,z},{x,y:max,z});
      for(const y of [0,max])for(const z of [0,max])line({x:0,y,z},{x:max,y,z});
      const gridAlpha='rgba(140,165,193,.105)';
      for(let i=0;i<base;i++){
        line({x:i,y:0,z:index},{x:i,y:max,z:index},gridAlpha);line({x:0,y:i,z:index},{x:max,y:i,z:index},gridAlpha);
        line({x:i,y:index,z:0},{x:i,y:index,z:max},gridAlpha);line({x:0,y:index,z:i},{x:max,y:index,z:i},gridAlpha);
        line({x:index,y:i,z:0},{x:index,y:i,z:max},gridAlpha);line({x:index,y:0,z:i},{x:index,y:max,z:i},gridAlpha);
      }
      plane('XY · z', [{x:0,y:0,z:index},{x:max,y:0,z:index},{x:max,y:max,z:index},{x:0,y:max,z:index}],'#57d6ef','rgba(87,214,239,.09)');
      plane('XZ · y', [{x:0,y:index,z:0},{x:max,y:index,z:0},{x:max,y:index,z:max},{x:0,y:index,z:max}],'#cf73ef','rgba(207,115,239,.085)');
      plane('YZ · x', [{x:index,y:0,z:0},{x:index,y:max,z:0},{x:index,y:max,z:max},{x:index,y:0,z:max}],'#e7c64d','rgba(231,198,77,.075)');
      const joint=project(index,index,index);ctx.beginPath();ctx.arc(joint.x,joint.y,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#19c99a';ctx.lineWidth=2;ctx.stroke();
      if(plateCoupling!=='open'){
        const green='#55ef86',active=plateCoupling==='tablet';
        ctx.save();ctx.setLineDash([7,5]);
        if(active){
          line({x:0,y:0,z:index},{x:max,y:0,z:index},green,2.4);line({x:max,y:0,z:index},{x:max,y:max,z:index},green,2.4);line({x:max,y:max,z:index},{x:0,y:max,z:index},green,2.4);
          line({x:0,y:index,z:0},{x:max,y:index,z:0},green,2.4);line({x:max,y:index,z:0},{x:max,y:index,z:max},green,2.4);line({x:max,y:index,z:max},{x:0,y:index,z:max},green,2.4);
          ctx.setLineDash([10,6]);line({x:0,y:index,z:index},{x:max,y:index,z:index},'#66efff',3.2);
          const hinge=project(max*.48,index,index);label(`TABLET HINGE · ${base} ADDRESSES`,hinge.x+8,hinge.y-9,'left','#66efff','800 9px ui-monospace, monospace');
          label('ACTIVE L / TABLET · XY + XZ',joint.x+10,joint.y+20,'left',green,'800 9px ui-monospace, monospace');
        }else{
          line({x:index,y:0,z:0},{x:index,y:max,z:0},green,2.4);line({x:index,y:max,z:0},{x:index,y:max,z:max},green,2.4);line({x:index,y:max,z:max},{x:index,y:0,z:max},green,2.4);line({x:index,y:0,z:max},{x:index,y:0,z:0},green,2.4);
          const tag=project(index,max,max);label('SHADOW PLATE · YZ',tag.x+8,tag.y-7,'left',green,'800 9px ui-monospace, monospace');
        }
        ctx.restore();
      }
      label(`PLATE TRIAD · BASE ${base} · ${plateCount}/${base} COMPLETED`,22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
      label(`${plateCount} × ${area} = ${closure} · ${remaining?`${remaining} TO ${volume}`:`FULL ${base}³ = ${volume}`}`,22,45,'left','#9be8d2','700 10px ui-monospace, monospace');
      label('three orthogonal leaf families · one address volume',w/2,h-20,'center','#8d9bb1','9px ui-monospace, monospace');label('drag to rotate',w-22,25,'right','#6f7b91');
      const coupling=plateCoupling==='open'?'OPEN · THREE SEPARATE LEAVES':plateCoupling==='tablet'?'ACTIVE L / TABLET · XY + XZ':`SHADOW PLATE · YZ`;
      detail.innerHTML=`<small>ORTHOGONAL PLATE COMPARATOR · GRAPH Δ0</small><h3>${closure}</h3><p><b>${plateCount} × ${base}² · ${plateCount===base?'FULL VOLUME':'PRE-CLOSURE'}</b></p><dl><dt>Base</dt><dd>${base}</dd><dt>Plate area</dt><dd>${base}² = ${area}</dd><dt>Completed</dt><dd>${plateCount} / ${base}</dd><dt>Volume</dt><dd>${base}³ = ${volume}</dd><dt>Remaining</dt><dd>${remaining}</dd><dt>Leaf XY</dt><dd>z = ${index} · TABLET ARM</dd><dt>Leaf XZ</dt><dd>y = ${index} · TABLET ARM</dd><dt>Tablet hinge</dt><dd>y=z=${index} · ${base} ADDRESSES</dd><dt>Leaf YZ</dt><dd>x = ${index} · SHADOW</dd><dt>Reading</dt><dd>${coupling}</dd><dt>Return</dt><dd>EXACT COUNT → ${closure}</dd></dl><p class="pc-detail-boundary"><b>ONE VOLUME, ACTIVE L, ONE SHADOW.</b><br>XY and XZ are read together as the active L / tablet; their exact intersection is the ${base}-address hinge line. YZ stays visible as the separate shadow plate. A projected hourglass may be laid over this carrier, but it remains a view. <code>G77</code> is the separate 7×11 CRT / Rath-grid adapter (77 cells), not the identity of this line. Cyan, magenta and gold are display roles only; green marks the selected reading. No new Cube identity is introduced. The separate 2501/5002 arithmetic is not assigned to this plate view. Base 12 does not extend or rename the Base‑11 Primecube.</p>`;
    }
    function drawCenteredPlateWindow(w,h){
      const record=data.centeredPlateWindow,entry=record.windowSizes.find(item=>item.m===centeredSize),paired=centeredChannel==='paired',total=paired?entry.pairedCount:entry.count,[axisA,axisB]=centeredAxis.split(':').map(Number),theta=centeredStep/12*Math.PI*2,cx=w*.5,cy=h*.52,plate=Math.min(w*.23,h*.25),gap=Math.max(8,plate*.09),sample=Math.min(9,centeredSize),cell=plate/sample,threadModel=T&&T.model?T.model():null,root7=threadModel&&threadModel.transitions.find(item=>item.from.prime===7&&item.to.prime===11);
      points=[];
      const plateAt=(x,y,color,tag)=>{ctx.save();ctx.fillStyle=`${color}14`;ctx.strokeStyle=color;ctx.lineWidth=1.8;ctx.fillRect(x,y,plate,plate);ctx.strokeRect(x,y,plate,plate);ctx.strokeStyle=`${color}42`;ctx.lineWidth=.75;for(let i=1;i<sample;i++){ctx.beginPath();ctx.moveTo(x+i*cell,y);ctx.lineTo(x+i*cell,y+plate);ctx.moveTo(x,y+i*cell);ctx.lineTo(x+plate,y+i*cell);ctx.stroke()}label(tag,x+7,y+15,'left',color,'800 9px ui-monospace, monospace');ctx.restore()};
      plateAt(cx-plate/2,cy-plate-gap,'#55d9f2',`${centeredSize}² · NORTH`);
      plateAt(cx+gap,cy-plate/2,'#ffd35a',`${centeredSize}² · EAST`);
      plateAt(cx-plate/2,cy+gap,'#ae50ef',`${centeredSize}² · SOUTH`);
      plateAt(cx-plate-gap,cy-plate/2,'#19c99a',`${centeredSize}² · WEST`);
      ctx.save();ctx.translate(cx,cy);ctx.rotate(axisA/12*Math.PI*2);ctx.strokeStyle='rgba(255,255,255,.34)';ctx.lineWidth=1;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(-plate*1.45,0);ctx.lineTo(plate*1.45,0);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      const mini=Math.min(78,plate*.47),miniCell=mini/5,mx=cx-mini/2,my=cy-mini/2;ctx.fillStyle='rgba(7,13,23,.92)';ctx.fillRect(mx-4,my-4,mini+8,mini+8);for(let row=0;row<5;row++)for(let col=0;col<5;col++){ctx.fillStyle=(row===2&&col===2)?'#fff':'rgba(79,141,247,.28)';ctx.fillRect(mx+col*miniCell+1,my+row*miniCell+1,miniCell-2,miniCell-2)}ctx.strokeStyle='#8ce7f8';ctx.lineWidth=1.4;ctx.strokeRect(mx,my,mini,mini);
      const drawSlashCube=(offset,alpha)=>{const tilt=-.42+Math.sin(theta)*.5,size=plate*.58,depth=size*.24;ctx.save();ctx.translate(cx+offset,cy-plate*.02);ctx.rotate(tilt);ctx.globalAlpha=alpha;ctx.fillStyle='rgba(79,141,247,.08)';ctx.strokeStyle='#9fc5ff';ctx.lineWidth=2;ctx.strokeRect(-size/2,-size/2,size,size);ctx.strokeRect(-size/2+depth,-size/2-depth,size,size);for(const [x,y] of [[-size/2,-size/2],[size/2,-size/2],[size/2,size/2],[-size/2,size/2]]){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+depth,y-depth);ctx.stroke()}ctx.beginPath();ctx.moveTo(-size*.66,size*.66);ctx.lineTo(size*.66,-size*.66);ctx.strokeStyle='#ffd35a';ctx.lineWidth=2.4;ctx.stroke();ctx.restore()};
      if(paired)drawSlashCube(13,.34);drawSlashCube(0,1);
      if(centeredRoot7&&root7){const gw=Math.min(126,w*.2),gh=Math.min(86,h*.19),gx=w-gw-24,gy=h-gh-34,dx=gw/6,dy=gh/10,pointFor=state=>({x:gx+state.r7*dx,y:gy+gh-state.r11*dy});ctx.save();ctx.fillStyle='rgba(5,12,24,.88)';ctx.fillRect(gx-10,gy-24,gw+20,gh+34);ctx.strokeStyle='rgba(85,217,242,.2)';ctx.lineWidth=.7;for(let col=0;col<7;col++){ctx.beginPath();ctx.moveTo(gx+col*dx,gy);ctx.lineTo(gx+col*dx,gy+gh);ctx.stroke()}for(let row=0;row<11;row++){ctx.beginPath();ctx.moveTo(gx,gy+row*dy);ctx.lineTo(gx+gw,gy+row*dy);ctx.stroke()}const a=pointFor(root7.from),b=pointFor(root7.to);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='#55d9f2';ctx.lineWidth=2.4;ctx.stroke();for(const [p,text,color] of [[a,'7 · ROOT','#cf91ff'],[b,'11 · TARGET','#ffd35a']]){ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();label(text,p.x+7,p.y-7,'left',color,'800 8px ui-monospace, monospace')}label('THREAD 4 / 167 · 7×11',gx,gy-10,'left','#dbe6ff','700 9px ui-monospace, monospace');ctx.restore()}
      ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fillStyle='#fff';ctx.shadowColor='#55d9f2';ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#19c99a';ctx.lineWidth=2;ctx.stroke();
      label(`CENTERED PLATE WINDOW · C(${centeredSize}) = 4·${entry.plateArea}+1 = ${entry.count}`,22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
      label(`${paired?'PAIRED CHANNEL':'SINGLE CHANNEL'} · ${total} · AXIS ${axisA}↔${axisB} · STEP ${centeredStep}/24`,22,45,'left','#ffd35a','700 10px ui-monospace, monospace');
      label('5×5 inspection window · existing tilt adapter · 167 transitions + root/target witnesses',w/2,h-18,'center','#8d9bb1','9px ui-monospace, monospace');
      const round=centeredStep===0?0:Math.ceil(centeredStep/12),phase=centeredStep%12;
      detail.innerHTML=`<small>CENTERED PLATE / REUSE VIEW · GRAPH Δ0</small><h3>${total}</h3><p><b>${paired?'2 × ':''}(4 × ${centeredSize}² + 1)</b></p><dl><dt>Plate side</dt><dd>${centeredSize}</dd><dt>One plate</dt><dd>${entry.plateArea}</dd><dt>Four plates</dt><dd>${entry.fourPlates}</dd><dt>Shared center</dt><dd>+1</dd><dt>Single count</dt><dd>${entry.count}</dd><dt>Channel</dt><dd>${paired?'PAIRED · '+entry.pairedCount:'SINGLE · '+entry.count}</dd><dt>Inspection</dt><dd>5×5 · 25 visible cells</dd><dt>Axis</dt><dd>${axisA} ↔ ${axisB} · mod 12</dd><dt>View phase</dt><dd>round ${round}/2 · phase ${phase}/12</dd><dt>Prime thread</dt><dd>${threadModel?threadModel.transitions.length:'—'} transitions + root/target</dd><dt>Root 7</dt><dd>${root7?`${root7.from.prime} (${root7.from.r7},${root7.from.r11}) → ${root7.to.prime} (${root7.to.r7},${root7.to.r11})`:'source unavailable'}</dd><dt>Δ raw / wrapped</dt><dd>${root7?`(${root7.raw7},${root7.raw11}) / (${root7.wrapped7},${root7.wrapped11})`:'—'}</dd><dt>Return</dt><dd>${centeredStep===24?'DISPLAY RETURN · 4π':'SOURCE COUNT RETAINED'}</dd></dl><p class="pc-detail-boundary"><b>COUNT, WINDOW AND REUSED OPERATORS STAY TYPED.</b><br><code>C(m)=4m²+1</code> counts four square plates and one shared center address: <code>37, 101, 197, 2501</code>. The 5×5 inspection window is not added again; paired mode yields <code>5002</code> at m=25 without merging carriers. The slash body adapts the existing NumberMagick tilt connector; the 24-step phase is local display sampling, not a new operator. The Prime Torus source supplies <code>167</code> transitions; Root 7 and Target 11 are the two visible endpoint witnesses, not two extra threads. Cikada Curtain, Scarab Hull and Dragonfly 010 remain linked Mathfield source roles. No new Cube, LOKI or Prime Family identity is introduced.</p>`;
    }
    function lineBetweenNumbers(from,to,addressFor,w,h,stroke,width=1.5,dash=[]){const aa=addressFor(from),bb=addressFor(to),a=project3(aa.x,aa.y,aa.z,w,h),b=project3(bb.x,bb.y,bb.z,w,h);ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.restore()}
    function diamond(x,y,r,stroke,fill='transparent',width=1.5){ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
    function familyPin(node,p,scale=1){
      const base=Math.max(2.2,p.r*1.08*scale),isClosure=node.layerClosure.isClosure;
      if(isClosure){diamond(p.x,p.y,base*1.75,colors.seam,'rgba(25,201,154,.13)',node.n===726?2.4:1.4);return}
      ctx.beginPath();ctx.arc(p.x,p.y,base,0,Math.PI*2);ctx.fillStyle=colors.prime;ctx.fill();
      let ring=base+2.2;
      if(node.kinds.includes('TWIN')){ctx.beginPath();ctx.arc(p.x,p.y,ring,0,Math.PI*2);ctx.strokeStyle=colors.twin;ctx.lineWidth=2;ctx.stroke();ring+=2.8}
      if(node.kinds.includes('TRIPLET')){ctx.beginPath();ctx.arc(p.x,p.y,ring,0,Math.PI*2);ctx.strokeStyle=colors.triplet;ctx.lineWidth=1.7;ctx.stroke();ring+=2.7}
      if(node.kinds.includes('QUADRUPLET'))diamond(p.x,p.y,ring+1.4,colors.quadruplet,'transparent',1.7);
      if(node.isSuperprime){ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.2,base*.43),0,Math.PI*2);ctx.fillStyle=colors.super;ctx.fill()}
    }
    function drawCoupledOrbitBarcode(w,h){
      const barcode=data.qCube.coupledGridBarcode,steps=barcode.steps,left=42,right=w-42,top=h-103,bottom=h-18,width=right-left,column=width/steps.length,rowHeight=13,rowGap=3,rows=[
        {key:'mod7',max:6,color:'#55d9f2',label:'r7'},
        {key:'mod11',max:10,color:'#ae50ef',label:'r11'},
        {key:'mod13',max:12,color:'#3fbd72',label:'r13'},
        {key:'layer',max:8,color:'#d6b64b',label:'z11'}
      ];
      ctx.save();
      rounded(left-12,top-16,width+24,bottom-top+22,8);ctx.fillStyle='rgba(5,12,24,.87)';ctx.fill();ctx.strokeStyle='rgba(140,165,193,.24)';ctx.lineWidth=1;ctx.stroke();
      label('CRITICAL ORBIT / OWNER VIEW · 60-STEP COUPLED ADDRESS BARCODE',left,top-5,'left','#dbe6ff','700 9px ui-monospace, monospace');
      for(let r=0;r<rows.length;r++){
        const row=rows[r],base=top+12+r*(rowHeight+rowGap)+rowHeight;
        ctx.beginPath();ctx.moveTo(left,base+.5);ctx.lineTo(right,base+.5);ctx.strokeStyle='rgba(140,165,193,.13)';ctx.lineWidth=1;ctx.stroke();
        label(row.label,left-5,base-2,'right',row.color,'700 8px ui-monospace, monospace');
        for(const step of steps){
          const x=left+(step.orbitStep+.5)*column,value=row.key==='layer'?step.cube.z:step.crt[row.key],bar=Math.max(1,(value/row.max)*rowHeight);
          ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x,base-bar);ctx.strokeStyle=row.color;ctx.globalAlpha=.38+.55*(value/row.max);ctx.lineWidth=Math.max(1,column*.55);ctx.stroke();
        }
      }
      ctx.globalAlpha=1;
      for(const step of steps){
        const x=left+(step.orbitStep+.5)*column;
        if(step.prime){ctx.beginPath();ctx.arc(x,top+4,1.8,0,Math.PI*2);ctx.fillStyle='#ff9f43';ctx.fill()}
        if(step.perfectPeak){ctx.strokeStyle='#ffd35a';ctx.lineWidth=1.6;ctx.strokeRect(x-column*.5,top-1,column,4*(rowHeight+rowGap)+8)}
        points.push({node:data.nodes[step.n-1],x,y:top+32,r:Math.max(5,column*.65),z:99,priority:1});
      }
      label('same n · cube [x,y,z] ↔ CRT (r7,r11,r13) · orange = prime · gold = 496 · step 59 returns 951 → 1',right,bottom+1,'right','#738198','8px ui-monospace, monospace');
      ctx.restore();
    }
    function draw3D(w,h,mode){
      const isFold=mode==='fold',isHinge=mode==='hinge',isTransform=isFold||isHinge,addressFor=n=>isFold?M.foldAddress(n,fold):isHinge?M.hingeAddress(n,fold):M.cubeAddress(n);
      cubeFrame(w,h);points=[];const projected=[];
      if(selectedDeck!==null&&mode==='cube'){
        fillLayerDeck(selectedDeck,w,h);
        for(let z=0;z<9;z++)layerPlane(z,w,h,z===selectedDeck);
      }else if(filter==='seam'){
        for(let z=0;z<9;z++)layerPlane(z,w,h,Boolean(hover&&hover.layerClosure.isClosure&&hover.layerClosure.layerIndex===z));
        edge({x:10,y:10,z:0},{x:10,y:10,z:8},w,h,'rgba(25,201,154,.95)',2.2);
        const mid=project3(5,5,4,w,h);label('RDMH',mid.x,mid.y-5,'center','#ecfff9','700 16px ui-monospace, monospace');label('29.02.1972 · R / Handle',mid.x,mid.y+13,'center','#73dfc1','10px ui-monospace, monospace');label('OPEN PROVENANCE · NO DATE↔RDMH MAP',mid.x,mid.y+28,'center','#6f7b91','9px ui-monospace, monospace');
      }
      if(isHinge){edge({x:0,y:5,z:5},{x:10,y:5,z:5},w,h,'rgba(240,85,73,.96)',2.6);const hp=project3(5,5,5,w,h);label('661 HINGE · y=5 · z=5',hp.x,hp.y-10,'center','#ff8d82','700 11px ui-monospace, monospace')}
      for(const node of data.nodes){const a=addressFor(node.n),p=project3(a.x,a.y,a.z,w,h);projected.push({node,p})}
      projected.sort((a,b)=>b.p.z-a.p.z);
      const deckLabels=[];
      for(const {node,p} of projected){
        const inDeck=selectedDeck===null||node.cube.z===selectedDeck,on=visible(node)&&inDeck,kind=activeKind(node),deckFocused=selectedDeck!==null&&node.cube.z===selectedDeck;
        ctx.beginPath();ctx.arc(p.x,p.y,on?(deckFocused?(kind==='composite'?Math.max(1.8,p.r*.85):Math.max(2.5,p.r*1.55)):(kind==='composite'?p.r*.62:p.r*1.35)):p.r*(selectedDeck===null?.42:.24),0,Math.PI*2);
        ctx.fillStyle=on?color(node):(node.isPrime?'rgba(79,141,247,.055)':'rgba(51,57,71,.085)');ctx.fill();
        if(deckFocused&&node.isPrime){ctx.strokeStyle='rgba(219,235,255,.58)';ctx.lineWidth=.65;ctx.stroke()}
        if(node.inTwinClusterGap&&(filter==='gap'||isTransform)){ctx.strokeStyle='rgba(231,198,77,.72)';ctx.lineWidth=.8;ctx.stroke()}
        if(isHinge&&[659,661,809].includes(node.n)){ctx.strokeStyle=node.n===661?'#fff':'#ff8d82';ctx.lineWidth=node.n===661?2.2:1.3;ctx.stroke()}
        if(on)points.push({node,x:p.x,y:p.y,r:deckFocused?11:9,z:p.z});
        if(deckFocused&&(deckLabelMode==='all'||(deckLabelMode==='primes'&&node.isPrime)||node.layerClosure.isClosure))deckLabels.push({node,p});
      }
      if(selectedDeck!==null&&mode==='cube'){
        for(const {node,p} of deckLabels){const isClosure=node.layerClosure.isClosure,fill=isClosure?'#9bf1d7':node.isPrime?'#f4f8ff':'#7f8ca2',font=isClosure||node.isPrime?'700 7px ui-monospace, monospace':'600 6px ui-monospace, monospace';label(String(node.n),p.x,p.y-4,'center',fill,font)}
        const first=selectedDeck*121+1,last=Math.min((selectedDeck+1)*121,M.MAX_N);label(`DECK z${selectedDeck} · ${first}…${last} · ${last-first+1} ADDRESSES · NUMBERS ${deckLabelMode.toUpperCase()}`,22,48,'left','#9be8d2','700 10px ui-monospace, monospace');
      }
      if(filter==='quadruplet'||filter==='all')for(const group of data.groups.quadruplets){ctx.beginPath();group.forEach((n,i)=>{const a=addressFor(n),p=project3(a.x,a.y,a.z,w,h);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.strokeStyle='rgba(174,80,239,.78)';ctx.lineWidth=1.5;ctx.stroke()}
      if(mode==='cube')drawCoupledOrbitBarcode(w,h);
      label(isFold?`distributed gap fold · θmax ${(fold*90).toFixed(0)}°`:isHinge?`rigid 661 hinge · θ ${(fold*90).toFixed(0)}° · upper n≥661`:selectedDeck===null?'11 × 11 × 10 address carrier':`11 × 11 DECK ${selectedDeck+1}/9 · closure ${(selectedDeck+1)*121}`,22,25);
      label('drag to rotate',w-22,25,'right','#6f7b91');
    }
    function drawOrientation(w,h){
      const addressFor=n=>M.foldAddress(n,fold),anchorSet=new Set(orientation.anchors.map(item=>item.n));
      cubeFrame(w,h);layerPlane(5,w,h);layerPlane(6,w,h,true);points=[];
      lineBetweenNumbers(659,661,addressFor,w,h,'rgba(240,85,73,.92)',3);
      lineBetweenNumbers(661,809,addressFor,w,h,'rgba(255,255,255,.78)',2,[7,5]);
      lineBetweenNumbers(809,811,addressFor,w,h,'rgba(240,85,73,.92)',3);
      const projected=[];
      for(const node of data.nodes){
        const scaffold=anchorSet.has(node.n)||node.n===726,eligible=node.isPrime||node.layerClosure.isClosure;
        if(!scaffold&&(!eligible||!visible(node)))continue;
        const a=addressFor(node.n),p=project3(a.x,a.y,a.z,w,h);projected.push({node,p,scaffold});
      }
      projected.sort((a,b)=>b.p.z-a.p.z);
      for(const {node,p,scaffold} of projected){
        if(node.isPrime||node.layerClosure.isClosure)familyPin(node,p,scaffold?1.3:.78);
        points.push({node,x:p.x,y:p.y,r:scaffold?13:9,z:p.z});
      }
      for(const anchor of orientation.anchors){const a=addressFor(anchor.n),p=project3(a.x,a.y,a.z,w,h),side=anchor.n===659||anchor.n===661?'left':'right',role=anchor.role.replaceAll('_',' ');label(`${anchor.n} · ${role}`,p.x+(side==='left'?-12:12),p.y-13,side==='left'?'right':'left','#ffd0cb','700 10px ui-monospace, monospace')}
      const seam=addressFor(726),sp=project3(seam.x,seam.y,seam.z,w,h);label('726 · 6×11² SEAM PIN',sp.x+14,sp.y-12,'left','#75e2c4','700 10px ui-monospace, monospace');
      label('DUAL GRID ORIENTATION · SAME SOURCE n',22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
      label('37-GRID  (17,29) → (17,31) ↓ (21,31) → (21,33)',22,45,'left','#ffb0a8','10px ui-monospace, monospace');
      label(`BASE-11  z5:65 · z6:82 · fold ${(fold*90).toFixed(0)}°`,22,62,'left','#73dfc1','10px ui-monospace, monospace');
      label('blue prime · red twin · yellow triplet · purple quadruplet · green superprime · cyan 11² closure',w/2,h-18,'center','#8d9bb1','9px ui-monospace, monospace');
      label('drag to rotate',w-22,25,'right','#6f7b91');
    }
    function drawSlice(w,h){
      const padX=64,padTop=72,padBottom=48,side=Math.min(w-padX*2,h-padTop-padBottom),cell=side/11,ox=(w-side)/2,oy=padTop+(h-padTop-padBottom-side)/2,layer=data.sliceAtlas.layers[sliceZ];
      const xy=node=>({x:ox+(node.cube.x+.5)*cell,y:oy+(10-node.cube.y+.5)*cell,r:Math.max(3,cell*.105)});
      points=[];
      ctx.save();
      if(sliceZ===0){ctx.fillStyle='rgba(214,182,75,.075)';ctx.fillRect(ox,oy+cell,side,cell);ctx.strokeStyle='rgba(214,182,75,.7)';ctx.lineWidth=1.4;ctx.strokeRect(ox,oy+cell,side,cell)}
      for(let y=0;y<11;y++)for(let x=0;x<11;x++){
        const sy=10-y,px=ox+x*cell,py=oy+sy*cell,n=M.cubeNumber({x,y,z:sliceZ});
        ctx.strokeStyle='rgba(140,165,193,.16)';ctx.lineWidth=1;ctx.strokeRect(px,py,cell,cell);
        if(n===null){ctx.fillStyle='rgba(51,57,71,.23)';ctx.fillRect(px,py,cell,cell)}
      }
      const drawGroups=(groups,stroke,width)=>{
        for(const group of groups){const nodes=group.map(n=>data.nodes[n-1]);if(!nodes.every(node=>node&&node.cube.z===sliceZ))continue;ctx.beginPath();nodes.forEach((node,i)=>{const p=xy(node);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
      };
      if(filter==='all'||filter==='twin')drawGroups(data.groups.twins,'rgba(240,85,73,.5)',1.4);
      if(filter==='all'||filter==='triplet')drawGroups(data.groups.triplets,'rgba(255,194,26,.62)',2);
      if(filter==='all'||filter==='quadruplet')drawGroups(data.groups.quadruplets,'rgba(174,80,239,.9)',3);
      const layerNodes=data.nodes.filter(node=>node.cube.z===sliceZ);
      for(const node of layerNodes){
        const p=xy(node),on=visible(node);
        if(node.isPrime&&on)familyPin(node,p,.86);
        else{ctx.beginPath();ctx.arc(p.x,p.y,on?2.2:1.25,0,Math.PI*2);ctx.fillStyle=on?'rgba(145,155,174,.55)':'rgba(75,84,102,.23)';ctx.fill()}
        const showNumber=on&&(node.isPrime||filter==='all'||node.layerClosure.isClosure);
        if(showNumber)label(String(node.n),p.x,p.y+cell*.33,'center',node.isPrime?'#e8edf7':'#78849a',`${Math.max(7,Math.min(10,cell*.18))}px ui-monospace, monospace`);
        if(on)points.push({node,x:p.x,y:p.y,r:Math.max(8,cell*.32),z:0});
      }
      for(let x=0;x<11;x++)label(String(x),ox+(x+.5)*cell,oy+side+20,'center','#68768b','10px ui-monospace, monospace');
      for(let y=0;y<11;y++)label(String(y),ox-16,oy+(10-y+.57)*cell,'right','#68768b','10px ui-monospace, monospace');
      label(`BASE-11 SLICE ATLAS · z=${sliceZ} · n=1+x+11y+121z`,22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
      label(`n ${layer.min}…${layer.max} · ${layer.primeCount} primes · ${layer.containedGroups.twins} twin groups · ${layer.containedGroups.triplets} triplets · ${layer.containedGroups.quadruplets} quadruplets`,22,45,'left','#8d9bb1','10px ui-monospace, monospace');
      if(sliceZ===0)label('C-REIHE · OWNER LABEL · y=9 · 101→103→107→109 · Δ 2|4|2',w-22,25,'right','#e7c64d','700 10px ui-monospace, monospace');
      label('x →',ox+side+8,oy+side+20,'left','#68768b','10px ui-monospace, monospace');label('y ↑',ox-16,oy-12,'right','#68768b','10px ui-monospace, monospace');
      label('connectors require the complete finite group inside this z-layer',w/2,h-14,'center','#68768b','9px ui-monospace, monospace');
      ctx.restore();
    }
    function rainbow(t){return`hsl(${Math.round(310-290*t)} 82% 62%)`}
    function drawEuler(w,h){
      const compass=data.eulerCompass,shared=compass.sharedCarrier.primes,tail=compass.tail.primes,selected=hover&&hover.isPrime?hover:null;
      points=[];
      if(eulerMode==='torus'){
        const left=76,top=72,right=Math.min(w-210,w*.73),bottom=h-66,x=r=>left+r/6*(right-left),y=r=>bottom-r/10*(bottom-top),analysis=T&&T.eulerAnalysis(T.model(1000));
        ctx.strokeStyle='rgba(119,211,190,.2)';ctx.lineWidth=1;
        for(let r=0;r<7;r++){ctx.beginPath();ctx.moveTo(x(r),top);ctx.lineTo(x(r),bottom);ctx.stroke();label(String(r),x(r),bottom+18,'center','#738096','9px ui-monospace, monospace')}
        for(let r=0;r<11;r++){ctx.beginPath();ctx.moveTo(left,y(r));ctx.lineTo(right,y(r));ctx.stroke();label(String(r),left-12,y(r)+3,'right','#738096','9px ui-monospace, monospace')}
        if(analysis){const route=analysis.audit.transitions;route.forEach((step,i)=>{ctx.beginPath();ctx.moveTo(x(step.from.r7),y(step.from.r11));ctx.lineTo(x(step.to.r7),y(step.to.r11));ctx.strokeStyle=rainbow(i/Math.max(1,route.length-1));ctx.globalAlpha=.32;ctx.lineWidth=1.1;ctx.stroke()});ctx.globalAlpha=1}
        for(const n of shared){const node=data.nodes[n-1],px=x(M.mod(n,7)),py=y(M.mod(n,11));ctx.beginPath();ctx.arc(px,py,2.15,0,Math.PI*2);ctx.fillStyle=rainbow((node.primeIndex-1)/167);ctx.fill();points.push({node,x:px,y:py,r:9})}
        if(selected&&selected.n<=1000){const px=x(M.mod(selected.n,7)),py=y(M.mod(selected.n,11));ctx.beginPath();ctx.arc(px,py,10,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=2.2;ctx.stroke()}
        label('EULER 7×11 · REUSED PRIME TORUS OPERATOR',22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
        label('135 unique edges × 2 · 270 steps · closed · non-minimal audit',22,45,'left','#f0bf4c','10px ui-monospace, monospace');
        label('NO CUBE EMBEDDING DECLARED',w-22,25,'right','#ff8d82','700 10px ui-monospace, monospace');
      }else{
        const modulus=eulerMode==='mod11'?11:7,cx=w*.48,cy=h*.53,R=Math.min(w*.35,h*.39),angle=n=>2*Math.PI*M.mod(n,modulus)/modulus-Math.PI/2;
        ctx.strokeStyle='rgba(79,141,247,.2)';ctx.lineWidth=1;
        for(let ring=1;ring<=4;ring++){ctx.beginPath();ctx.arc(cx,cy,R*ring/4,0,Math.PI*2);ctx.stroke()}
        for(let r=0;r<modulus;r++){const a=2*Math.PI*r/modulus-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.stroke();label(String(r),cx+Math.cos(a)*(R+17),cy+Math.sin(a)*(R+17)+3,'center','#7d8ba1','9px ui-monospace, monospace')}
        ctx.beginPath();shared.forEach((n,i)=>{const rr=Math.sqrt(n/1000)*R,a=angle(n),px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.strokeStyle='rgba(164,99,238,.25)';ctx.lineWidth=1;ctx.stroke();
        for(const n of shared){const node=data.nodes[n-1],rr=Math.sqrt(n/1000)*R,a=angle(n),px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;ctx.beginPath();ctx.arc(px,py,node.isSuperprime?3.4:2.2,0,Math.PI*2);ctx.fillStyle=rainbow((node.primeIndex-1)/167);ctx.fill();points.push({node,x:px,y:py,r:9})}
        label(`RESIDUE COMPASS · mod ${modulus} · r=√(p/1000)`,22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
        label('ANGLE RULE CHANGES · PRIME CARRIER DOES NOT',22,45,'left','#f0bf4c','10px ui-monospace, monospace');
      }
      const tx=w-25,ty=h-110;label('SHARED SUBCARRIER',tx,ty,'right','#73dfc1','700 10px ui-monospace, monospace');label('168 primes · p≤1000',tx,ty+20,'right','#e8edf7','700 12px ui-monospace, monospace');label('TAIL RETAINED',tx,ty+47,'right','#ff8d82','700 10px ui-monospace, monospace');label(`18 primes · ${tail[0]}…${tail[tail.length-1]}`,tx,ty+67,'right','#e8edf7','700 12px ui-monospace, monospace');
      if(selected&&selected.n>1000)label(`${selected.n} · OUTSIDE SHARED EULER SUBCARRIER`,w/2,h-18,'center','#ff8d82','700 10px ui-monospace, monospace');else label('same PC1111 record · exact return by retained source n',w/2,h-18,'center','#718097','9px ui-monospace, monospace');
    }
    function drawRoots(w,h){
      const left=62,right=Math.min(190,Math.max(130,w*.2)),top=54,bottom=95,pw=w-left-right,ph=h-top-bottom,minLog=Math.log10(M.cubeRootGap(M.MAX_N-1).direct),maxLog=Math.log10(M.rootGap(1).direct);
      const px=k=>left+(k-1)/(M.MAX_N-2)*pw,py=v=>top+(maxLog-Math.log10(v))/(maxLog-minLog)*ph;
      points=[];ctx.strokeStyle='rgba(140,165,193,.18)';ctx.lineWidth=1;
      for(const k of [1,100,500,1000]){const x=px(k);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,top+ph);ctx.stroke();label(String(k),x,top+ph+22,'center')}
      for(const v of [.4,.2,.1,.05,.02,.01,.005]){const y=py(v);ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(left+pw,y);ctx.stroke();label(v.toFixed(v<.1?3:1),left-10,y+4,'right')}
      const trace=(getter,color,dash,width)=>{ctx.beginPath();for(let k=1;k<M.MAX_N;k++){const v=getter(k),x=px(k),y=py(v);k===1?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();ctx.setLineDash([])};
      trace(k=>1/(2*Math.sqrt(k)),'rgba(103,184,255,.5)',[6,5],1.2);
      trace(k=>1/(3*Math.cbrt(k*k)),'rgba(255,194,26,.48)',[6,5],1.2);
      trace(k=>M.rootGap(k).direct,'#67b8ff',[],2.2);
      trace(k=>M.cubeRootGap(k).direct,'#ffc21a',[],2.2);
      for(let k=1;k<M.MAX_N;k++){const x=px(k),y=py(M.rootGap(k).direct);points.push({node:data.nodes[k-1],x,y,r:7})}
      for(const k of [2,5,7]){const g=M.rootGap(k),x=px(k),y=py(g.direct);ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='#d6b64b';ctx.fill();label(`√${k}`,x+8,y-8,'left','#e7c64d')}
      for(const k of data.roots.perfectCubeAnchors){const x=px(k),y=py(M.cubeRootGap(k).direct);ctx.beginPath();ctx.arc(x,y,3.4,0,Math.PI*2);ctx.fillStyle='#ffc21a';ctx.fill()}
      for(const [i,k] of data.roots.codonF1.entries()){const x=px(k),y=top+ph+38;ctx.beginPath();ctx.moveTo(x,top+ph+28);ctx.lineTo(x,y);ctx.strokeStyle='#ef7ec3';ctx.lineWidth=2;ctx.stroke();label(String(k),x,y+13,'center','#ef7ec3','8px ui-monospace, monospace');if(i===0)label('CODON F1 · source rail',left,top+ph+50,'left','#ef7ec3','8px ui-monospace, monospace')}
      const cx=w-right/2+8,cy=145,R=Math.min(54,right*.32);ctx.strokeStyle='rgba(140,165,193,.32)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
      for(let deg=0;deg<360;deg+=30){const a=(deg-90)*Math.PI/180,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.fillStyle='rgba(219,230,255,.55)';ctx.fill()}
      data.roots.tridentSourceOverlay.anglesDegrees.forEach((deg,index)=>{const a=(deg-90)*Math.PI/180,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.strokeStyle=['#57d6ef','#ffc21a','#ef7ec3'][index];ctx.lineWidth=2.4;ctx.stroke();label(`T${index+1}`,x+Math.cos(a)*10,y+Math.sin(a)*10+3,'center',['#57d6ef','#ffc21a','#ef7ec3'][index],'700 9px ui-monospace, monospace')});
      label('TRIDENT SOURCE GUIDE',cx,cy-R-24,'center','#dbe6ff','700 9px ui-monospace, monospace');label('3×120° · no numeric map',cx,cy+R+22,'center','#718097','8px ui-monospace, monospace');
      label('Δ₂ square root · exact',left,20,'left','#67b8ff','700 10px ui-monospace, monospace');label('Δ₃ cube root · exact',left+175,20,'left','#ffc21a','700 10px ui-monospace, monospace');label('dashed = asymptote',left+338,20,'left','#8d9bb1','9px ui-monospace, monospace');
      label('Root Ruler · logarithmic adjacent-root gaps',left,40,'left','#dbe6ff','12px ui-monospace, monospace');label('k · source carrier 1…1110',left+pw/2,h-12,'center');label('Δᵣ(k)',14,top+ph/2,'left','#aab4c8');label('Prime filters inactive',w-18,22,'right','#6f7b91','8px ui-monospace, monospace');
    }
    function drawRootGeometry(w,h){
      const geo=data.rootGeometry,left=42,right=Math.max(left+300,w*.64),axisY=116,rootMin=1,rootMax=Math.sqrt(M.MAX_N),rx=n=>left+(Math.sqrt(n)-rootMin)/(rootMax-rootMin)*(right-left),selected=hover||data.nodes[120];
      points=[];
      label('SQUARE–SEAM–TRIANGLE · ROOT COORDINATE',left,24,'left','#dbe6ff','700 12px ui-monospace, monospace');
      label('33 square anchors · 3 seam squares · 3 sixth-power bridges · 2 prime-rank rails',left,43,'left','#8d9bb1','10px ui-monospace, monospace');
      for(const interval of geo.intervals){
        const x0=rx(interval.start),x1=rx(interval.carrierEnd);ctx.fillStyle=interval.m%2?'rgba(79,141,247,.055)':'rgba(174,80,239,.045)';ctx.fillRect(x0,66,Math.max(1,x1-x0),70);
      }
      ctx.beginPath();ctx.moveTo(left,axisY);ctx.lineTo(right,axisY);ctx.strokeStyle='rgba(219,230,255,.52)';ctx.lineWidth=1.5;ctx.stroke();
      for(const square of geo.squares){
        const x=rx(square.n),major=square.doubleAnchor||square.cubeBridge||square.root%5===0;ctx.beginPath();ctx.moveTo(x,major?75:92);ctx.lineTo(x,138);ctx.strokeStyle=square.doubleAnchor?'#19c99a':square.cubeBridge?'#ffc21a':'rgba(140,165,193,.38)';ctx.lineWidth=square.doubleAnchor||square.cubeBridge?2.4:1;ctx.stroke();
        if(major)label(String(square.root),x,61,'center',square.doubleAnchor?'#73dfc1':square.cubeBridge?'#ffd35a':'#aab4c8','9px ui-monospace, monospace');
        points.push({node:data.nodes[square.n-1],x,y:axisY,r:8});
      }
      label('√k',right+8,axisY+4,'left','#aab4c8','10px ui-monospace, monospace');label('equal root-length intervals · ΣΔk = 1',left,154,'left','#718097','9px ui-monospace, monospace');
      const rail=(items,y,color,title)=>{label(title,left,y-13,'left',color,'700 10px ui-monospace, monospace');ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.strokeStyle='rgba(140,165,193,.18)';ctx.stroke();for(const item of items){const x=rx(item.n);ctx.beginPath();ctx.arc(x,y,item.n===661?4.7:2.2,0,Math.PI*2);ctx.fillStyle=item.n===661?'#fff':color;ctx.fill();if(item.n===661){ctx.strokeStyle='#f05549';ctx.lineWidth=2;ctx.stroke()}points.push({node:data.nodes[item.n-1],x,y,r:7})}};
      rail(geo.primeRails.oddRank,205,'#57d6ef','ODD PRIME RANK · 93');rail(geo.primeRails.evenRank,255,'#ef7ec3','EVEN PRIME RANK · 93');
      const record=M.rootGeometryRecord(selected.n),interval=record.squareInterval,bandY=320,x0=left,x1=right;
      label(`SELECTED ROOT INTERVAL · m=${interval.m} · ${interval.start}…${interval.carrierEnd}`,x0,bandY-18,'left','#e7c64d','700 10px ui-monospace, monospace');
      ctx.fillStyle='rgba(214,182,75,.09)';ctx.fillRect(x0,bandY,x1-x0,58);ctx.strokeStyle='rgba(214,182,75,.6)';ctx.strokeRect(x0,bandY,x1-x0,58);
      const selectedX=x0+(selected.n-interval.start)/Math.max(1,interval.carrierEnd-interval.start)*(x1-x0);ctx.beginPath();ctx.moveTo(selectedX,bandY);ctx.lineTo(selectedX,bandY+58);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
      label(`${interval.steps} steps · ${interval.complete?'complete unit interval':'partial carrier interval'} · root length ${interval.rootLength.toFixed(6)}`,x0+12,bandY+24,'left','#e8edf7','10px ui-monospace, monospace');label(interval.telescoping,x0+12,bandY+45,'left','#d6b64b','10px ui-monospace, monospace');
      const triLeft=Math.min(w-238,right+54),triBaseY=450,triWidth=Math.max(110,w-triLeft-36),scale=Math.min((triWidth-20)/Math.max(1,record.triangle.legA),108),ax=triLeft,ay=triBaseY,bx=ax+record.triangle.legA*scale,by=ay;
      if(record.triangle.hypotenuse!==null){const unit=Math.max(6,scale);ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(bx,by-unit);ctx.closePath();ctx.strokeStyle='#dbe6ff';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='#19c99a';ctx.strokeRect(bx-7,by-unit,7,7);label(`√${selected.n}`,ax+(bx-ax)/2,ay+20,'center','#67b8ff','10px ui-monospace, monospace');label('1',bx+9,by-unit/2,'left','#73dfc1','10px ui-monospace, monospace');label(`√${selected.n+1}`,ax+(bx-ax)*.54,ay-unit*.57,'center','#e7c64d','10px ui-monospace, monospace');}
      else label('1111 · NO INTERNAL FORWARD EDGE',triLeft,triBaseY-20,'left','#ff8d82','700 10px ui-monospace, monospace');
      label('L-TRIANGLE · (√k)² + 1² = (√(k+1))²',triLeft,bandY-18,'left','#dbe6ff','700 10px ui-monospace, monospace');
      label('green = 121/484/1089 seam squares · gold = 1/64/729 square∩cube · rails use prime-rank parity',w/2,h-18,'center','#718097','9px ui-monospace, monospace');
    }
    function drawQCube(w,h){
      const q=data.qCube,toPoint=n=>{const a=M.qCubeAddress(n);return{x:a.mod7/6*10,y:a.mod11/10*10,z:a.mod13/12*9}},forward=q.forward.orbit,control=q.base10Control.orbit;
      cubeFrame(w,h);points=[];
      const drawOrbit=(orbit,stroke,width,dash=[])=>{ctx.save();ctx.beginPath();orbit.concat(orbit[0]).forEach((n,i)=>{const a=toPoint(n),p=project3(a.x,a.y,a.z,w,h);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.restore()};
      drawOrbit(forward,'rgba(87,214,239,.72)',2);drawOrbit(control,'rgba(255,194,26,.95)',3,[7,4]);drawOrbit(q.screenLasso.nodes.map(item=>item.n),'rgba(255,126,72,.96)',2.5,[3,4]);
      const projected=forward.map((n,index)=>{const a=toPoint(n),p=project3(a.x,a.y,a.z,w,h);return{n,index,p}}).sort((a,b)=>b.p.z-a.p.z);
      for(const item of projected){const node=data.nodes[item.n-1];ctx.beginPath();ctx.arc(item.p.x,item.p.y,item.n===1?6:3.4,0,Math.PI*2);ctx.fillStyle=item.n===1?'#fff':'#57d6ef';ctx.fill();if(control.includes(item.n)){ctx.strokeStyle='#ffc21a';ctx.lineWidth=2;ctx.stroke()}points.push({node,x:item.p.x,y:item.p.y,r:10,z:item.p.z})}
      const primeCrosswalk=q.decimalConcatenationCrosswalk.uniquePrime,crossPoint=project3(...Object.values(toPoint(primeCrosswalk.residue)),w,h);ctx.beginPath();ctx.arc(crossPoint.x,crossPoint.y,10,0,Math.PI*2);ctx.strokeStyle='#ff7e48';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.arc(crossPoint.x,crossPoint.y,3.5,0,Math.PI*2);ctx.fillStyle='#ff7e48';ctx.fill();label('456|151 → p₃₈₁₇₇ → 696',crossPoint.x+13,crossPoint.y-9,'left','#ff9a70','700 10px ui-monospace, monospace');points.push({node:data.nodes[primeCrosswalk.residue-1],x:crossPoint.x,y:crossPoint.y,r:14,z:crossPoint.z});
      const peak=q.perfectVPeak,peakPoint=project3(...Object.values(toPoint(peak.n)),w,h);ctx.beginPath();ctx.arc(peakPoint.x,peakPoint.y,11,0,Math.PI*2);ctx.strokeStyle='#ffd35a';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.arc(peakPoint.x,peakPoint.y,4,0,Math.PI*2);ctx.fillStyle='#ffd35a';ctx.fill();label('V-PEAK · 496 perfect #3 · |12 → p₁₂=37',peakPoint.x+13,peakPoint.y-12,'left','#ffe08a','700 10px ui-monospace, monospace');points.push({node:data.nodes[peak.n-1],x:peakPoint.x,y:peakPoint.y,r:15,z:peakPoint.z});
      const p1=project3(...Object.values(toPoint(1)),w,h);label('1 / RETURN',p1.x+10,p1.y-10,'left','#fff','700 10px ui-monospace, monospace');
      label('Q / T₂₀± CRT CUBOID · Q=7·11·13=1001',22,25,'left','#dbe6ff','700 12px ui-monospace, monospace');
      label('T₂₀+ : n↦20n mod 1001 · T₂₀− : n↦951n mod 1001',22,45,'left','#57d6ef','10px ui-monospace, monospace');
      label('λ(Q)=60 · ordQ(20)=60 · gold control ordQ(10)=6',22,62,'left','#ffc21a','10px ui-monospace, monospace');
      label(`orange lasso · ${q.screenLasso.count} prime-valued residues / 60 · screen path only`,22,79,'left','#ff8d62','10px ui-monospace, monospace');
      label('axes: n mod 7 · n mod 11 · n mod 13',w-22,25,'right','#8d9bb1','10px ui-monospace, monospace');
      label('CRT cuboid ≠ Euclidean cube · local Q/T₂₀± ≠ earlier Q± identities',w/2,h-18,'center','#ff8d82','9px ui-monospace, monospace');
    }
    function drawMeasure(w,h){
      const r=M.unitRootShearRecord(measureMarker,measureUnit,fold),left=70,right=w-254,top=105,bottom=h-82,pw=right-left,ph=bottom-top,dockX=w-218,dockW=190;
      points=[];
      const gx=i=>left+i/3*pw,gy=i=>top+i/2*ph*.55;
      const scale=r.physicalSource.displayScale,formatTick=value=>Math.abs(value)>=100?value.toFixed(0):Math.abs(value)>=1?value.toFixed(2).replace(/0+$/,'').replace(/\.$/,''):value.toPrecision(2);
      ctx.save();ctx.fillStyle='rgba(255,194,26,.025)';ctx.fillRect(left,top-18,pw,ph*.76);ctx.strokeStyle='rgba(255,194,26,.13)';ctx.fillStyle='rgba(255,194,26,.72)';ctx.lineWidth=1;
      scale.ticks.forEach((tick,index)=>{const x=left+tick.normalized*pw;if(x>right+.5)return;ctx.beginPath();ctx.moveTo(x,top-18);ctx.lineTo(x,bottom);ctx.stroke();if(index===0||index===scale.ticks.length-1||index%2===0)label(formatTick(tick.value),x,bottom+17,'center','#b89b4b','8px ui-monospace, monospace')});
      for(let index=0;index<=4;index++){const y=top-18+index*ph*.76/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke()}
      label(`UNIT GRID · 0…${formatTick(scale.span)} ${scale.unit} · Δ${formatTick(scale.tickStep)} ${scale.unit}`,left,top-29,'left','#ffc21a','700 9px ui-monospace, monospace');ctx.restore();
      ctx.save();ctx.strokeStyle='rgba(87,214,239,.16)';ctx.fillStyle='rgba(87,214,239,.65)';ctx.lineWidth=1;
      for(let y=0;y<3;y++)for(let x=0;x<4;x++){const px=gx(x),py=gy(y);ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();if(x<3){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(gx(x+1),py);ctx.stroke()}if(y<2){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,gy(y+1));ctx.stroke()}}
      const outer=(count,x0,y0,x1,y1)=>{for(let i=0;i<count;i++){const t=count===1?0:i/(count-1),x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;ctx.beginPath();ctx.arc(x,y,2.7,0,Math.PI*2);ctx.fill()}};
      outer(3,left-28,top,left-28,top+ph*.55);outer(3,right+28,top,right+28,top+ph*.55);outer(4,left,top-28,right,top-28);outer(6,left,bottom,right*.49,bottom);outer(6,left+pw*.51,bottom,right,bottom);
      const samples=r.stair.forward.map(s=>({x:left+s.x/r.rootScale.maximum*pw,y:bottom-s.y/r.rootScale.maximum*ph})),stairPath=[samples[0]];
      const rootExtentX=left+r.rootScale.fraction*pw;ctx.save();ctx.fillStyle='rgba(239,126,195,.035)';ctx.fillRect(left,top-18,rootExtentX-left,ph*.76);ctx.strokeStyle='rgba(239,126,195,.55)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(rootExtentX,top-18);ctx.lineTo(rootExtentX,bottom);ctx.stroke();ctx.setLineDash([]);label(`ROOT ℓ=${r.marker.value} / ${r.rootScale.maximum}`,rootExtentX-6,top-4,'right','#ef7ec3','700 9px ui-monospace, monospace');ctx.restore();
      for(let i=1;i<samples.length;i++)stairPath.push({x:samples[i].x,y:samples[i-1].y},samples[i]);
      const trace=(path,stroke,width,dash=[])=>{ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke()};
      trace(stairPath,'#57d6ef',2.4);trace(stairPath.slice().reverse(),'#ffc21a',2,[7,5]);ctx.setLineDash([]);
      const lowerY=bottom-8,railX=n=>left+(M.mod(n,13)/12)*pw*.34,railPoints=r.lowerCrtRail.anchors.map((a,i)=>({a,x:railX(a.n)+pw*.31,y:lowerY-i*22,color:i?'#ffc21a':'#57d6ef'}));
      const splitHub={x:samples[0].x,y:samples[0].y},rootBaseY=bottom-ph*.18,rootSpan=Math.min(pw*.52,300),rootNodes=r.mycelRootSplit.markerNodes.map((item,index)=>({item,x:left+index*rootSpan/3,y:rootBaseY-(item.normalized-.45)*ph*.13}));
      label(`MYCEL ROOTS · ${r.mycelRootSplit.glyphRail.join('  ')}`,left,top+ph*.59,'left','#ef7ec3','700 10px ui-monospace, monospace');
      rootNodes.forEach(({item,x,y})=>{ctx.save();ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+splitHub.x)/2,splitHub.y-ph*.08,splitHub.x,splitHub.y);ctx.strokeStyle=item.selected?'rgba(239,126,195,.95)':'rgba(239,126,195,.28)';ctx.lineWidth=item.selected?2.8:1.1;ctx.setLineDash(item.selected?[]:[3,5]);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,item.selected?7:4.5,0,Math.PI*2);ctx.fillStyle=item.selected?'#ef7ec3':'#6f7890';ctx.fill();ctx.strokeStyle=item.selected?'#fff':'#aeb6c4';ctx.lineWidth=1.2;ctx.stroke();label(`${item.value}`,x,y-10,'center',item.selected?'#ffd5ef':'#8d9bb1','700 9px ui-monospace, monospace');ctx.restore()});
      railPoints.forEach((p,index)=>{ctx.save();ctx.beginPath();ctx.moveTo(splitHub.x,splitHub.y);ctx.quadraticCurveTo(splitHub.x-pw*.12,p.y-(index?28:-28),p.x,p.y);ctx.strokeStyle=p.color;ctx.lineWidth=2.8;ctx.setLineDash(index?[8,5]:[]);ctx.stroke();ctx.restore()});
      ctx.beginPath();ctx.arc(splitHub.x,splitHub.y,9,0,Math.PI*2);ctx.fillStyle='#0c1522';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(splitHub.x-5,splitHub.y);ctx.lineTo(splitHub.x+6,splitHub.y);ctx.moveTo(splitHub.x,splitHub.y-5);ctx.lineTo(splitHub.x,splitHub.y+6);ctx.strokeStyle='#ef7ec3';ctx.stroke();label('SPLIT · shared (6,9) · Δmod13',splitHub.x-8,splitHub.y-14,'right','#ef7ec3','700 9px ui-monospace, monospace');
      railPoints.forEach(({a,x,y,color})=>{ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();label(`${a.n} · (${a.address.mod7},${a.address.mod11},${a.address.mod13})`,x+12,y+4,'left','#e8edf7','700 10px ui-monospace, monospace');points.push({node:data.nodes[a.n-1],x,y,r:12})});
      const box=(id,y,height,title,lines,color)=>{const active=measureContract===id;ctx.fillStyle=active?'rgba(47,24,45,.94)':'rgba(8,14,24,.78)';ctx.strokeStyle=active?'#fff':color;ctx.lineWidth=active?2.4:1;ctx.fillRect(dockX,y,dockW,height);ctx.strokeRect(dockX,y,dockW,height);label(active?'ACTIVE CONTRACT':title,dockX+10,y+16,'left',active?'#fff':color,'700 9px ui-monospace, monospace');if(active)label(title,dockX+10,y+29,'left',color,'700 8px ui-monospace, monospace');lines.forEach((line,index)=>label(line,dockX+10,y+(active?43:32)+index*13,'left','#c8d3e6','8px ui-monospace, monospace'))};
      box('angle333',94,74,'333° · ADDRESS CONTROL',['40 directions · return 40','3 visits / direction'],'#ffc21a');
      box('plate',176,74,'PLATE / MIRROR',['prime → plate · X/O → view','carrier address retained'],'#57d6ef');
      box('pinkGrey',258,86,'PINK ∩ GREY',['grey = control','position · color · echo · shadow','full return requires 4/4'],'#ef7ec3');
      box('breath',352,86,'BREATH · SOURCE VIEW',['CORE fixed · 3 bands','0° / 120° / 240° · 4 s','display phase · not physiology'],'#73dfc1');
      if(measureContract==='mycel'){ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.strokeRect(left-14,rootBaseY-ph*.18,Math.min(pw*.72,430),ph*.42);ctx.setLineDash([]);label('ACTIVE CONTRACT · MYCEL / CRT SPLIT',left,rootBaseY-ph*.18-8,'left','#fff','700 9px ui-monospace, monospace');ctx.restore()}
      const meetY=301;ctx.beginPath();ctx.arc(dockX+dockW-18,meetY,6,0,Math.PI*2);ctx.fillStyle='#aeb6c4';ctx.fill();ctx.strokeStyle='#ef7ec3';ctx.lineWidth=2;ctx.stroke();
      const unitValue=r.physicalSource.selectedValue,unitText=Math.abs(unitValue)>=1000?unitValue.toFixed(2):Math.abs(unitValue)>=1?unitValue.toFixed(6).replace(/0+$/,'').replace(/\.$/,''):unitValue.toPrecision(6);
      label('¡ / OWNER MIRROR · HOLD',22,25,'left','#ef7ec3','700 11px ui-monospace, monospace');label('1 ↔ (1,1,1) / RETURN',w-22,25,'right','#fff','700 11px ui-monospace, monospace');
      label(`UNIT / ROOT / SHEAR · ${r.marker.value} · θ ${(r.fold.angleDegrees).toFixed(0)}° · 12×${r.stair.stepDegrees.toFixed(2)}°`,22,50,'left','#dbe6ff','700 12px ui-monospace, monospace');label(`UNIT VIEW · 15.7 ft → ${unitText} ${r.physicalSource.selectedUnit}`,w-22,50,'right','#ffc21a','700 11px ui-monospace, monospace');
      label('OWNER SCREEN GRID · 4×3 + 3/3 + 4 + 6/6 = 34 PINS',w/2,77,'center','#73dfc1','10px ui-monospace, monospace');
      label('root marker → Mycel trunk → split → 97 / 944 · cyan/gold retain separate CRT branches',w/2,h-18,'center','#8d9bb1','9px ui-monospace, monospace');ctx.restore();
    }

    function renderMeasureContract(){
      if(!measureContractPanel)return;
      const r=M.unitRootShearRecord(measureMarker,measureUnit,fold),a=r.lowerCrtRail.anchors,contracts={
        angle333:{title:'333° / ADDRESS CONTROL',source:'a0-angle-address-compare-3-111-333 · declared angle-address record',operator:'333° mod 120° · gcd(111,120)=3 · finite direction counter',return:`step ${r.sourceDock.angle333.firstReturnStep} / ${r.sourceDock.angle333.uniqueDirections} directions · ×${r.sourceDock.angle333.visitsPerDirection} visits`,boundary:'control orbit only; no shared Root, Plate or Breath operator',status:'EXACT FINITE CONTROL',href:'results/a0-angle-address-compare-3-111-333-2026-10-25.json'},
        plate:{title:'PLATE / MIRROR',source:'a0-plate-mirror-reference-return · retained source address',operator:'prime → plate selection; X / O switches the declared view',return:'EXACT · source address retained after view switch',boundary:'view change only; no new carrier or mirror mechanism',status:'VIEW SWITCH · SOURCE RETAINED',href:'results/a0-plate-mirror-reference-return-2026-10-20.json'},
        pinkGrey:{title:'PINK / GREY FOUR-REGISTER CHECK',source:'a0-grey-pink-typed-source-hof-return · four typed records',operator:'compare position, pink shift, echo lag and shadow fraction; Grey is control',return:'FULL only when position, color, echo and shadow all return',boundary:'four records remain separate; display meeting is not operator identity',status:'TYPED COMPARATOR · GREY CONTROL',href:'results/a0-grey-pink-typed-source-hof-return-2026-11-21.json'},
        breath:{title:'BREATH / SOURCE VIEW',source:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',operator:'fixed CORE with three display bands at 0° / 120° / 240° over 4 s',return:'CORE invariant; phase display returns under its own receipt',boundary:'display clock only; no physiology or common Shear mechanism',status:'SOURCE VIEW · CORE FIXED',href:'results/a0-breathing-crystal-bench-return-2026-10-29.json'},
        mycel:{title:'MYCEL / CRT SPLIT',source:`Root marker ${r.marker.value} · Spin-to-Bloom Mycel source · CRT rail`,operator:`Sθ(ℓ) with θ=${r.fold.angleDegrees.toFixed(2)}°; display trunk splits on shared (mod 7, mod 11)`,return:`${a[0].n}=(${a[0].address.mod7},${a[0].address.mod11},${a[0].address.mod13}) ↔ ${a[1].n}=(${a[1].address.mod7},${a[1].address.mod11},${a[1].address.mod13}); retained marker`,boundary:'only mod 13 changes; 696 remains separate; no physical shear or root mechanism',status:'EXACT CRT RAIL · VIEW CONTRACT',href:'results/a0-spin-to-bloom-measurement-return-2026-10-29.json'}
      },contract=contracts[measureContract]||contracts.mycel;
      measureContractTitle.textContent=contract.title;measureContractSource.textContent=contract.source;measureContractOperator.textContent=contract.operator;measureContractReturn.textContent=contract.return;measureContractBoundary.textContent=contract.boundary;measureContractStatus.textContent=contract.status;measureContractLink.href=contract.href;
      root.querySelectorAll('[data-pc-measure-contract]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcMeasureContract===measureContract)));
    }
    function draw(){
      const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.5,h*.48,10,w*.5,h*.48,Math.max(w,h)*.65);g.addColorStop(0,'#141b2a');g.addColorStop(1,'#080c14');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      if(view==='grid')drawGrid(w,h);else if(view==='root')drawRoots(w,h);else if(view==='geometry')drawRootGeometry(w,h);else if(view==='qcube')drawQCube(w,h);else if(view==='plates')drawPlateTriad(w,h);else if(view==='centered')drawCenteredPlateWindow(w,h);else if(view==='measure')drawMeasure(w,h);else if(view==='slice')drawSlice(w,h);else if(view==='euler')drawEuler(w,h);else if(view==='orientation')drawOrientation(w,h);else draw3D(w,h,view);
      if(hover){const p=points.find(q=>q.node.n===hover.n);if(p){ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()}}
    }

    function diceMarkup(state){return `<span class="pc-dice">${state.map(value=>`<i class="pc-die">${value}</i>`).join('')}</span>`}
    function renderH(node){
      if(!hrecord)return;
      const r=M.hRecord(node.n,data),cube=r.registers.cube;
      hrecord.innerHTML=`<div class="pc-hcell"><b>Source / Prime rank</b><strong>${r.source.recordId}<br>${r.registers.primeRank?'#'+r.registers.primeRank:'not prime'}</strong><small>Rang ist Ordnungsadresse, kein geometrischer Raum.</small></div><div class="pc-hcell"><b>Base-11 Cube</b><strong>[${cube.x}, ${cube.y}, ${cube.z}] · ${r.registers.base11.number}<sub>11</sub></strong><small>Adresse n−1: ${r.registers.base11.address}<sub>11</sub> · exact return ${r.return.n}</small></div><div class="pc-hcell"><b>H₅ · 6⁵=${r.dice.h5.orderedCapacity}</b><strong>${diceMarkup(r.dice.h5.state)}</strong><small>Exact decode → ${r.dice.h5.return}</small></div><div class="pc-hcell"><b>H₆ · 6⁶=${r.dice.h6.orderedCapacity}</b><strong>${diceMarkup(r.dice.h6.state)}</strong><small>Exact decode → ${r.dice.h6.return}</small></div><div class="pc-hcell"><b>Provenance</b><strong>SHA‑256 witness</strong><small>Binding: ${r.provenance.binding}<br>Hash ≠ Koordinate</small></div>`;
      root.querySelectorAll('[data-pc-hnode]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pcHnode)===node.n)));
    }
    function renderHPath(){
      if(!hpath)return;
      hpath.innerHTML=M.orientationPath().map(step=>`<div class="pc-hstep"><b>${step.n} · #${step.primeRank}</b><br>cube [${step.cube.x},${step.cube.y},${step.cube.z}]${step.deltaValue===null?'':' · Δn +'+step.deltaValue}<br>${step.h5Distance===null?'PATH START':`dH₅=${step.h5Distance} · dH₆=${step.h6Distance}`}</div>`).join('');
    }

    function show(node){
      hover=node;
      renderH(node);
      if(view==='root'){
        const rr=node.n<M.MAX_N?M.rootRulerRecord(node.n):null,r=M.rootRecord(node.n),flags=[r.referenceAnchor?'ROOTROOM ANCHOR':null,data.roots.codonF1.includes(node.n)?'CODON F1 SOURCE':null,data.roots.perfectCubeAnchors.includes(node.n)?'PERFECT-CUBE ANCHOR':null].filter(Boolean).join(' · ')||'ROOT RULER';
        detail.innerHTML=`<small>ROOT RECORD ${r.recordId}</small><h3>${r.exact}</h3><p><b>${flags}</b> · source n=${r.sourceNumber}</p><dl><dt>√n Float64</dt><dd>${r.approximation.toPrecision(16)}</dd><dt>Δ₂ exact</dt><dd>${rr?rr.square.exact:'domain end'}</dd><dt>Δ₂ rationalized</dt><dd>${rr?rr.square.rationalizedExact:'domain end'}</dd><dt>Δ₂ / asymptote</dt><dd>${rr?rr.square.asymptoticRatio.toPrecision(10):'—'}</dd><dt>Δ₃ exact</dt><dd>${rr?rr.cube.exact:'domain end'}</dd><dt>Δ₃ rationalized</dt><dd>${rr?rr.cube.rationalizedExact:'domain end'}</dd><dt>Δ₃ / asymptote</dt><dd>${rr?rr.cube.asymptoticRatio.toPrecision(10):'—'}</dd><dt>Return</dt><dd>EXACT → ${r.return.n}</dd></dl><p class="pc-detail-boundary">${rr?rr.boundary:'Carrier endpoint: no internal adjacent gap.'}</p>`;
      }else if(view==='geometry'){
        const r=M.rootGeometryRecord(node.n),i=r.squareInterval,t=r.triangle,flags=[r.root.isIntegerAnchor?'SQUARE ANCHOR':null,r.registers.doubleAnchor?'11² DOUBLE ANCHOR':null,r.registers.cubeBridge?'SQUARE ∩ CUBE':null,r.registers.primeRail].filter(Boolean).join(' · ')||'ROOT INTERVAL';
        detail.innerHTML=`<small>${r.recordId}</small><h3>${node.n} · ${r.root.exact}</h3><p><b>${flags}</b></p><dl><dt>Cube</dt><dd>[${r.cube.x}, ${r.cube.y}, ${r.cube.z}]</dd><dt>Factors</dt><dd>${r.factorization.exact}</dd><dt>ω / Ω</dt><dd>${r.factorization.omegaDistinct} / ${r.factorization.bigOmegaTotal}</dd><dt>7-smooth</dt><dd>${r.factorization.is7Smooth?'YES':'NO'}</dd><dt>Interval</dt><dd>${i.start}…${i.carrierEnd} · m=${i.m}</dd><dt>Steps</dt><dd>${i.steps} · ${i.complete?'COMPLETE':'PARTIAL'}</dd><dt>Root length</dt><dd>${i.rootLength.toPrecision(12)}</dd><dt>Δk</dt><dd>${t.hypotenuse===null?'NO INTERNAL FORWARD EDGE':(t.hypotenuse-t.legA).toPrecision(12)}</dd><dt>Step angle</dt><dd>${t.stepAngle===null?'—':(t.stepAngle*180/Math.PI).toFixed(6)+'°'}</dd><dt>Prime rail</dt><dd>${r.registers.primeRail||'—'}</dd><dt>Return</dt><dd>EXACT → ${r.return.n}</dd></dl><p class="pc-detail-boundary">${r.boundary} ${t.boundary}</p>`;
      }else if(view==='qcube'){
        const q=data.qCube,a=M.qCubeAddress(Math.min(node.n,1001)),forward=M.mod(a.residue*q.forward.multiplier,q.modulus),inverse=M.mod(a.residue*q.inverse.multiplier,q.modulus),fi=q.forward.orbit.indexOf(a.residue),cross=q.decimalConcatenationCrosswalk,peak=q.perfectVPeak,special=node.n===cross.uniquePrime.residue?`<p class="pc-detail-boundary"><b>DECIMAL CONCATENATION CROSSWALK</b><br><code>${cross.uniquePrime.notation} = ${cross.uniquePrime.value}</code> · PRIME #${cross.uniquePrime.primeRank}<br><code>${cross.exactEquation}</code> · CRT (${cross.uniquePrime.address.mod7},${cross.uniquePrime.address.mod11},${cross.uniquePrime.address.mod13}). The large prime and the Q residue remain distinct typed records.</p>`:node.n===peak.n?`<p class="pc-detail-boundary"><b>V-PEAK · PERFECT NUMBER</b><br><code>${peak.n}=2⁴·31</code> · PERFECT #${peak.perfectNumberOrdinal} · Σ proper divisors = ${peak.properDivisorSum}<br><code>${peak.notation}</code>: ${peak.suffixBlock.statement}. ${peak.boundary}</p>`:'';
        detail.innerHTML=`<small>Q CRT RECORD · PC1001:N${String(node.n).padStart(4,'0')}</small><h3>${node.n} · (${a.mod7}, ${a.mod11}, ${a.mod13})</h3><p><b>${fi>=0?`T₂₀ ORBIT STEP ${fi}/60`:'OUTSIDE UNIT ORBIT OF 1'}</b></p><dl><dt>Q</dt><dd>7·11·13 = 1001</dd><dt>φ(Q) / λ(Q)</dt><dd>${q.phi} / ${q.carmichaelLambda}</dd><dt>T₂₀+</dt><dd>${a.residue} → ${forward}</dd><dt>T₂₀−</dt><dd>${a.residue} → ${inverse}</dd><dt>Orbit primes</dt><dd>${q.screenLasso.count} / 60</dd><dt>Inverse check</dt><dd>20·951 mod 1001 = ${q.exactReturn.forwardThenInverse}</dd><dt>60-return</dt><dd>20⁶⁰ mod 1001 = ${q.exactReturn.power60}</dd><dt>Base-10 control</dt><dd>order ${q.base10Control.order}</dd><dt>Return</dt><dd>EXACT → ${node.n}</dd></dl>${special}<p class="pc-detail-boundary">${q.screenLasso.boundary} ${cross.boundary}</p><p class="pc-detail-boundary">${q.identityBoundary} ${q.findingBoundary}</p><p class="pc-detail-boundary"><b>OWNER INTAKE · HOLD:</b> ${q.ownerIntake.markers.join(' · ')}. ${q.ownerIntake.boundary}</p>`;
      }else if(view==='measure'){
        const r=M.unitRootShearRecord(measureMarker,measureUnit,fold),a=r.lowerCrtRail.anchors;
        renderMeasureContract();
        detail.innerHTML=`<small>UNIT–ROOT–SHEAR · SOURCE DOCK</small><h3>${r.marker.value} · ${r.marker.exact}</h3><p><b>${r.marker.sourceRole.replaceAll('_',' ')}</b></p><dl><dt>Square</dt><dd>${r.marker.squareExact} = ${r.marker.square}</dd><dt>15.7 ft</dt><dd>${r.physicalSource.metres} m</dd><dt>Selected unit</dt><dd>${r.physicalSource.selectedValue.toPrecision(12)} ${r.physicalSource.selectedUnit}</dd><dt>Shear</dt><dd>${(r.fold.intensity*100).toFixed(0)}% · ${r.fold.angleDegrees.toFixed(2)}°</dd><dt>cos / sin</dt><dd>${r.fold.cos.toFixed(9)} / ${r.fold.sin.toFixed(9)}</dd><dt>Return residual</dt><dd>${r.fold.residual.toExponential(2)}</dd><dt>333 control</dt><dd>${r.sourceDock.angle333.uniqueDirections} directions · return ${r.sourceDock.angle333.firstReturnStep} · ×${r.sourceDock.angle333.visitsPerDirection}</dd><dt>Plate / mirror</dt><dd>source retained · view switched</dd><dt>Pink / grey</dt><dd>${r.sourceDock.pinkGreyMeeting.registers.length} typed records · grey control</dd><dt>Breath</dt><dd>CORE fixed · ${r.sourceDock.breath.bands} bands · ${r.sourceDock.breath.phaseOffsetsDegrees.join('° / ')}°</dd><dt>Lower rail</dt><dd>${a[0].n} (${a[0].address.mod7},${a[0].address.mod11},${a[0].address.mod13}) ↔ ${a[1].n} (${a[1].address.mod7},${a[1].address.mod11},${a[1].address.mod13})</dd></dl><p class="pc-detail-boundary"><b>EXACT RAIL:</b> ${r.lowerCrtRail.invariant}. <b>696</b> remains a named candidate at (${r.lowerCrtRail.candidate696.address.mod7},${r.lowerCrtRail.candidate696.address.mod11},${r.lowerCrtRail.candidate696.address.mod13}), not identified with the photographed pin.</p><p class="pc-detail-boundary">${r.sourceDock.boundary}</p><p class="pc-detail-boundary">${r.projectionBoundary} ${r.unitBoundary} ${r.mirror.glyph} remains ${r.mirror.status}; ${r.qrtBoundary}</p>`;
      }else{
        const r=M.numberRecord(node.n,data),constellationTags=r.constellations.filter(kind=>kind!=='SUPERPRIME'),tags=constellationTags.length?constellationTags.join(' · '):(node.isPrime?'PRIME':'NO CONSTELLATION'),seam=r.layerClosure.isClosure?`<p><b>11² CLOSURE · ${r.layerClosure.multiplier}×121 · layer z=${r.layerClosure.layerIndex}</b></p>`:'';
        const transition=node.n===661?'<p class="pc-detail-boundary"><b>TRANSITION 661</b> · twin pair #30 · p<sub>121</sub> · index seam 121=11² · 551<sub>11</sub> / address 550<sub>11</sub> · r<sub>37</sub>=32 ↔ 809. The rigid 3D hinge is invertible; only screen projection may overlap.</p>':'';
        const anchor=orientation.anchors.find(item=>item.n===node.n),orientationContext=view==='orientation'?`<p class="pc-detail-boundary"><b>DUAL GRID ORIENTATION</b> · ${anchor?anchor.role.replaceAll('_',' '):node.n===726?'DECLARED 11² SEAM PIN':'CONSTELLATION PIN'}<br>37-grid <code>(${node.grid.row},${node.grid.column})</code> ↔ cube <code>[${node.cube.x},${node.cube.y},${node.cube.z}]</code>. Rings show overlapping memberships; they are not canonical Navigator Families. Camera top/bottom is display-only.</p>`:'',sliceContext=view==='slice'?`<p class="pc-detail-boundary"><b>SLICE z=${sliceZ}</b> · fixed Base-11 address <code>[${node.cube.x},${node.cube.y},${node.cube.z}]</code>${sliceZ===0&&node.cube.y===9?' · C-REIHE OWNER LABEL':''}. Connectors require a complete finite group in this layer. Visible symmetry or overlap is not a new Prime Family or invariant geometry.</p>`:'',eulerContext=view==='euler'?`<p class="pc-detail-boundary"><b>EULER COMPASS · ${node.isPrime&&node.n<=1000?'SHARED 168':'OUTSIDE SHARED SUBCARRIER'}</b><br>Residues <code>mod 7=${M.mod(node.n,7)}</code> · <code>mod 11=${M.mod(node.n,11)}</code>. The angle rule is a view; the retained <code>${r.recordId}</code> supplies exact return. No cube embedding or Euler-Rainbow identity is declared.</p>`:'',orbitStep=view==='cube'?data.qCube.coupledGridBarcode.steps.find(item=>item.n===node.n):null,orbitContext=orbitStep?`<p class="pc-detail-boundary"><b>CRITICAL ORBIT BARCODE · STEP ${orbitStep.orbitStep}/60</b><br>same source <code>n=${node.n}</code>: cube <code>[${orbitStep.cube.x},${orbitStep.cube.y},${orbitStep.cube.z}]</code> ↔ CRT <code>(${orbitStep.crt.mod7},${orbitStep.crt.mod11},${orbitStep.crt.mod13})</code>${orbitStep.prime?' · PRIME':''}${orbitStep.perfectPeak?' · PERFECT #3':''}. “Critical orbit” is the Owner view label; bar height and color are display encodings.</p>`:'';
        detail.innerHTML=`<small>RECORD ${r.recordId}</small><h3>${node.n}${node.isPrime?` · prime #${node.primeIndex}`:''}</h3><p><b>${tags}</b>${node.isSuperprime?' · SUPERPRIME':''}</p>${seam}<dl><dt>Cube</dt><dd>[${node.cube.x}, ${node.cube.y}, ${node.cube.z}]</dd><dt>Grid (37)</dt><dd>row ${node.grid.row}, col ${node.grid.column}</dd><dt>mod 30 / 37</dt><dd>${node.residue.mod30} / ${M.mod(node.n,37)}</dd><dt>Prime index</dt><dd>${node.primeIndex||'—'}</dd><dt>Base 11 n</dt><dd>${r.base11.number}<sub>11</sub></dd><dt>Address n−1</dt><dd>${r.base11.address}<sub>11</sub></dd><dt>11² seam</dt><dd>${r.layerClosure.isClosure?(r.layerClosure.squareClosure?'YES · SQUARE CLOSURE':'YES · COMPOSITE CONTROL'):'NO'}</dd><dt>Gap role</dt><dd>${r.gapRole}</dd><dt>Divisors</dt><dd>${r.factorization.join(', ')}</dd><dt>Return</dt><dd>${r.return.exact?'EXACT → '+r.return.n:'FAIL'}</dd></dl>${transition}${orientationContext}${sliceContext}${eulerContext}${orbitContext}${filter==='seam'?'<p class="pc-detail-boundary"><b>RDMH</b> → ROM–MH (Mutterraum), historical vertical-polarity provenance. <b>29.02.1972</b> is a valid leap day with source role “R / Handle”. Their identity remains OPEN; no operator is asserted.</p>':''}`;
      }draw();
    }

    function nearest(e){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;let best=null,dist=14,priority=-1;for(const p of points){const d=Math.hypot(p.x-x,p.y-y),nextPriority=p.priority||0;if(d<14&&(nextPriority>priority||(nextPriority===priority&&d<dist))){dist=d;priority=nextPriority;best=p.node}}return best}
    canvas.addEventListener('pointerdown',e=>{if(view==='grid'||view==='root'||view==='geometry'||view==='slice'||view==='euler'||view==='measure'||view==='centered')return;drag=true;last={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
    canvas.addEventListener('pointerup',e=>{drag=false;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}});
    canvas.addEventListener('pointermove',e=>{if(drag){rotY+=(e.clientX-last.x)*.009;rotX+=(e.clientY-last.y)*.009;last={x:e.clientX,y:e.clientY};draw();return}const node=nearest(e);if(node&&(!hover||node.n!==hover.n))show(node)});
    canvas.addEventListener('click',e=>{const node=nearest(e);if(node)show(node)});
    function setFilter(next){if(next==='seam'){selectedDeck=null;root.querySelectorAll('[data-pc-seam]').forEach(x=>x.setAttribute('aria-pressed','false'))}filter=next;root.querySelectorAll('[data-pc-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcFilter===next)));draw()}
    function selectDeck(n){
      stopFoldMotion();
      selectedDeck=data.nodes[n-1].cube.z;filter='all';view='cube';
      root.querySelectorAll('[data-pc-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcFilter==='all')));
      root.querySelectorAll('[data-pc-view]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcView==='cube')));
      root.querySelectorAll('[data-pc-seam]').forEach(x=>x.setAttribute('aria-pressed',String(Number(x.dataset.pcSeam)===n)));
      foldInput.disabled=true;if(foldPlay)foldPlay.disabled=true;show(data.nodes[n-1]);
    }
    function updateCenteredOut(){const entry=data.centeredPlateWindow.windowSizes.find(item=>item.m===centeredSize),total=centeredChannel==='paired'?entry.pairedCount:entry.count;if(centeredOut)centeredOut.textContent=`${total} · step ${centeredStep}/24 · 167 + root/target`}
    function stopCenteredMotion(){if(centeredTimer){win.clearInterval(centeredTimer);centeredTimer=null}if(centeredPlay){centeredPlay.setAttribute('aria-pressed','false');centeredPlay.textContent='▶ view phase · 2×12'}}
    function toggleCenteredMotion(){if(centeredTimer){stopCenteredMotion();return}if(centeredStep>=24)centeredStep=0;centeredPlay?.setAttribute('aria-pressed','true');if(centeredPlay)centeredPlay.textContent='Ⅱ pause';centeredTimer=win.setInterval(()=>{centeredStep+=1;updateCenteredOut();draw();if(centeredStep>=24)stopCenteredMotion()},180)}
    function stopFoldMotion(){if(foldTimer){win.clearInterval(foldTimer);foldTimer=null}if(foldPlay){foldPlay.setAttribute('aria-pressed','false');foldPlay.textContent='▶ Faltung'}}
    function renderFold(){foldInput.value=String(Math.round(fold*100));foldOut.textContent=`${Math.round(fold*100)}% · ${(fold*90).toFixed(0)}°`;view==='measure'?show(data.nodes[96]):draw()}
    function toggleFoldMotion(){if(foldTimer){stopFoldMotion();return}foldDirection=fold>=1?-1:fold<=0?1:foldDirection;if(foldPlay){foldPlay.setAttribute('aria-pressed','true');foldPlay.textContent='Ⅱ Pause'}foldTimer=win.setInterval(()=>{fold=Math.max(0,Math.min(1,fold+foldDirection*.02));if(fold<=0||fold>=1)foldDirection*=-1;renderFold()},70)}
    function setView(next){if(next!=='centered')stopCenteredMotion();const foldEnabled=['fold','hinge','orientation','measure'].includes(next);if(!foldEnabled)stopFoldMotion();view=next;root.querySelectorAll('[data-pc-view]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcView===next)));foldInput.disabled=!foldEnabled;if(foldPlay)foldPlay.disabled=!foldEnabled;if(sliceRail)sliceRail.hidden=view!=='slice';if(eulerRail)eulerRail.hidden=view!=='euler';if(measureRail)measureRail.hidden=view!=='measure';if(measureSourceNote)measureSourceNote.hidden=view!=='measure';if(measureContractPanel)measureContractPanel.hidden=view!=='measure';if(plateRail)plateRail.hidden=view!=='plates';if(centeredRail)centeredRail.hidden=view!=='centered';if(view==='plates'||view==='centered'){hover=null;draw()}else if(view==='slice'){const retained=hover&&hover.cube.z===sliceZ?hover:data.nodes[sliceZ===0?100:data.sliceAtlas.layers[sliceZ].min-1];show(retained)}else if(view==='euler')show(hover&&hover.isPrime?hover:data.nodes[660]);else if(view==='geometry')show(data.nodes[120]);else if(view==='qcube')show(data.nodes[0]);else if(view==='measure')show(data.nodes[96]);else show(view==='hinge'||view==='orientation'?data.nodes[660]:(hover||data.nodes[1]))}
    function showSeamShadow(){
      const s=data.seamShadow;hover=null;detail.innerHTML=`<small>EXTENDED ADDRESS · NO CARRIER RECORD</small><h3>${s.n} · shadow closure</h3><p><b>${s.role.replaceAll('_',' ')}</b></p><dl><dt>Value</dt><dd>${s.multiplier}×11²</dd><dt>37-grid</dt><dd>row ${s.grid.row}, col ${s.grid.column}</dd><dt>Extended cube</dt><dd>[${s.extendedCube.x}, ${s.extendedCube.y}, ${s.extendedCube.z}]</dd><dt>Base 11 n</dt><dd>${s.base11.number}<sub>11</sub></dd><dt>Address n−1</dt><dd>${s.base11.address}<sub>11</sub></dd><dt>Factors</dt><dd>${s.factorization}</dd><dt>Carrier end</dt><dd>${s.carrierMax}</dd><dt>Missing nodes</dt><dd>${s.missingFromCarrier}</dd><dt>Next full cube</dt><dd>${s.nextFullCubeClosure}=11³</dd></dl><p class="pc-detail-boundary"><b>SHADOW, NOT HIDDEN DATA.</b><br>${s.boundary}</p>`;draw();
    }
    function renderContractAudit(){
      if(!contractGrid||!contractCount)return;
      const coverage=data.contractDemoCoverage,checks=coverage.items.map(item=>({...item,available:Boolean(document.getElementById(item.target))})),passed=checks.filter(item=>item.available).length;
      contractCount.textContent=`${passed}/${coverage.count} · ${passed===coverage.count?'ALL DEMOS BOUND':'FAIL'}`;
      contractCount.classList.toggle('is-fail',passed!==coverage.count);
      contractGrid.innerHTML=checks.map(item=>`<button type="button" data-pc-contract-demo="${item.id}" class="${item.available?'is-bound':'is-fail'}" ${item.available?'':'disabled'}><span>${item.label}</span><b>${item.available?'DEMO_BOUND':'TARGET_MISSING'}</b><small>#${item.target}</small></button>`).join('');
      contractGrid.querySelectorAll('[data-pc-contract-demo]').forEach(button=>button.addEventListener('click',()=>{
        const item=coverage.items.find(entry=>entry.id===button.dataset.pcContractDemo),action=item.action,target=document.getElementById(item.target);if(!target)return;
        if(action.filter)setFilter(action.filter);
        if(action.view){setView(action.view);if(action.source&&data.nodes[action.source-1])show(data.nodes[action.source-1])}
        if(action.adapter){document.querySelector(`[data-pc-mathfield-mode="${action.adapter}"]`)?.click();if(action.fractalMode)setTimeout(()=>document.querySelector(`[data-pc-mf-mode="${action.fractalMode}"]`)?.click(),0)}
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }));
    }
    root.querySelectorAll('[data-pc-view]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.pcView)));
    root.querySelectorAll('[data-pc-filter]').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.pcFilter)));
    root.querySelectorAll('[data-pc-seam]').forEach(btn=>btn.addEventListener('click',()=>selectDeck(Number(btn.dataset.pcSeam))));
    root.querySelector('[data-pc-deck-labels]')?.addEventListener('click',event=>{deckLabelMode=deckLabelMode==='all'?'primes':deckLabelMode==='primes'?'off':'all';event.currentTarget.textContent=`Numbers · ${deckLabelMode}`;event.currentTarget.setAttribute('aria-pressed',String(deckLabelMode!=='off'));draw()});
    root.querySelectorAll('[data-pc-plate-base]').forEach(btn=>btn.addEventListener('click',()=>{plateBase=Number(btn.dataset.pcPlateBase);plateCount=plateBase===11?10:12;plateCountInput.max=String(plateBase);plateCountInput.value=String(plateCount);root.querySelectorAll('[data-pc-plate-base]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));plateOut.textContent=`${plateCount} × ${plateBase*plateBase} = ${plateCount*plateBase*plateBase}`;draw()}));
    plateCountInput?.addEventListener('input',()=>{plateCount=Number(plateCountInput.value);plateOut.textContent=`${plateCount} × ${plateBase*plateBase} = ${plateCount*plateBase*plateBase}`;draw()});
    root.querySelectorAll('[data-pc-plate-coupling]').forEach(btn=>btn.addEventListener('click',()=>{plateCoupling=btn.dataset.pcPlateCoupling;root.querySelectorAll('[data-pc-plate-coupling]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));draw()}));
    root.querySelectorAll('[data-pc-centered-size]').forEach(btn=>btn.addEventListener('click',()=>{centeredSize=Number(btn.dataset.pcCenteredSize);root.querySelectorAll('[data-pc-centered-size]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));centeredStep=0;updateCenteredOut();draw()}));
    root.querySelectorAll('[data-pc-centered-channel]').forEach(btn=>btn.addEventListener('click',()=>{centeredChannel=btn.dataset.pcCenteredChannel;root.querySelectorAll('[data-pc-centered-channel]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));updateCenteredOut();draw()}));
    centeredAxisInput?.addEventListener('change',()=>{centeredAxis=centeredAxisInput.value;centeredStep=0;updateCenteredOut();draw()});
    centeredRoot7Button?.addEventListener('click',()=>{centeredRoot7=!centeredRoot7;centeredRoot7Button.setAttribute('aria-pressed',String(centeredRoot7));draw()});
    centeredPlay?.addEventListener('click',toggleCenteredMotion);
    root.querySelector('[data-pc-seam-shadow]')?.addEventListener('click',()=>{stopFoldMotion();selectedDeck=null;root.querySelectorAll('[data-pc-seam]').forEach(x=>x.setAttribute('aria-pressed','false'));setFilter('seam');view='grid';root.querySelectorAll('[data-pc-view]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcView==='grid')));foldInput.disabled=true;if(foldPlay)foldPlay.disabled=true;showSeamShadow()});
    root.querySelectorAll('[data-pc-slice]').forEach(btn=>btn.addEventListener('click',()=>{sliceZ=Number(btn.dataset.pcSlice);root.querySelectorAll('[data-pc-slice]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));setView('slice')}));
    root.querySelectorAll('[data-pc-euler]').forEach(btn=>btn.addEventListener('click',()=>{eulerMode=btn.dataset.pcEuler;root.querySelectorAll('[data-pc-euler]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));setView('euler')}));
    root.querySelectorAll('[data-pc-measure-marker]').forEach(btn=>btn.addEventListener('click',()=>{measureMarker=Number(btn.dataset.pcMeasureMarker);root.querySelectorAll('[data-pc-measure-marker]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));show(data.nodes[96])}));
    root.querySelectorAll('[data-pc-measure-unit]').forEach(btn=>btn.addEventListener('click',()=>{measureUnit=btn.dataset.pcMeasureUnit;root.querySelectorAll('[data-pc-measure-unit]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));show(data.nodes[96])}));
    root.querySelectorAll('[data-pc-measure-contract]').forEach(btn=>btn.addEventListener('click',()=>{measureContract=btn.dataset.pcMeasureContract;show(data.nodes[96])}));
    root.querySelectorAll('[data-pc-hnode]').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.pcHnode);setFilter('prime');setView('cube');show(data.nodes[n-1]);root.querySelector('.pc-workbench').scrollIntoView({behavior:'smooth',block:'start'})}));
    root.querySelector('[data-pc-demo-jump]')?.addEventListener('click',()=>root.querySelector('#coupled-orbit-demonstrator')?.scrollIntoView({behavior:'smooth',block:'start'}));
    if(demoCanvas){
      const demoNearest=e=>{const rect=demoCanvas.getBoundingClientRect(),x=e.clientX-rect.left;let best=null,dist=Infinity;for(const point of demoPoints){const d=Math.abs(point.x-x);if(d<point.r&&d<dist){dist=d;best=point.step}}return best};
      demoCanvas.addEventListener('pointermove',e=>{const step=demoNearest(e);if(step&&step.orbitStep!==demoSelected.orbitStep){demoSelected=step;drawOrbitDemonstrator()}});
      demoCanvas.addEventListener('click',e=>{const step=demoNearest(e);if(step){demoSelected=step;drawOrbitDemonstrator()}});
    }
    foldInput.addEventListener('input',()=>{stopFoldMotion();fold=Number(foldInput.value)/100;renderFold()});
    foldPlay?.addEventListener('click',toggleFoldMotion);
    root.querySelector('[data-pc-reset]').addEventListener('click',()=>{stopFoldMotion();rotX=.56;rotY=-.68;fold=.4;foldInput.value='40';foldOut.textContent='40% · 36°';if(view==='centered'){stopCenteredMotion();centeredStep=0;updateCenteredOut();draw()}else if(view==='slice'){sliceZ=0;root.querySelectorAll('[data-pc-slice]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcSlice==='0')));show(data.nodes[100])}else if(view==='measure')show(data.nodes[96]);else draw()});
    summary.innerHTML=`<b>${data.counts.primes}</b> primes · <b>${data.counts.twins}</b> twins · <b>${data.counts.triplets}</b> triplets · <b>${data.counts.quadruplets}</b> quadruplets · <b>${data.counts.superprimes}</b> superprimes · <b>${data.counts.layerClosures}</b> 11² seams`;
    renderContractAudit();renderHPath();show(data.nodes[786]);foldInput.disabled=true;new ResizeObserver(resize).observe(canvas);resize();if(demoCanvas){new ResizeObserver(drawOrbitDemonstrator).observe(demoCanvas);drawOrbitDemonstrator()}
    root.primecube={data,draw,show,snapshot:()=>({view,filter,sliceZ,selectedDeck,deckLabelMode,plateBase,plateCount,plateCoupling,centeredSize,centeredChannel,centeredAxis,centeredRoot7,centeredStep,eulerMode,measureMarker,measureUnit,measureContract,fold,hover:hover&&hover.n})};
  }
  win.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-primecube]').forEach(mount));
})(window);
