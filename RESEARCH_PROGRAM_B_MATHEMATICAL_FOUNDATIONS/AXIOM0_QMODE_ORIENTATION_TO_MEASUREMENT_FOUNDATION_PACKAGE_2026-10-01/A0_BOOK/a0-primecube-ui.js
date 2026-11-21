(function(win){
  'use strict';
  const M=win.A0PrimecubeModel;if(!M)return;
  const data=M.buildDataset(),colors={prime:'#4f8df7',twin:'#f05549',triplet:'#ffc21a',quadruplet:'#ae50ef',super:'#3fbd72',gap:'#9c8126',seam:'#19c99a',composite:'#333947',unit:'#525866'};

  function mount(root){
    const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),detail=root.querySelector('[data-pc-detail]'),summary=root.querySelector('[data-pc-summary]'),foldOut=root.querySelector('[data-pc-fold-out]'),foldInput=root.querySelector('[data-pc-fold]'),hrecord=root.querySelector('[data-pc-hrecord]'),hpath=root.querySelector('[data-pc-hpath]');
    let view='grid',filter='all',fold=.4,rotX=.56,rotY=-.68,drag=false,last={x:0,y:0},hover=null,points=[];
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

    function drawGrid(w,h){
      const cols=M.GRID_COLUMNS,rows=Math.ceil(M.MAX_N/cols),pad=24,gap=2,cw=Math.max(4,(w-pad*2-gap*(cols-1))/cols),ch=Math.max(4,Math.min(cw,(h-pad*2-gap*(rows-1))/rows)),gridW=cols*cw+(cols-1)*gap,gridH=rows*ch+(rows-1)*gap,ox=(w-gridW)/2,oy=(h-gridH)/2;
      points=[];
      for(const node of data.nodes){const {column,row}=node.grid,x=ox+column*(cw+gap),y=oy+row*(ch+gap),on=visible(node),kind=activeKind(node);rounded(x,y,cw,ch,Math.min(2,cw*.18));ctx.fillStyle=on?color(node):(node.isPrime?'rgba(79,141,247,.12)':'rgba(51,57,71,.35)');ctx.fill();if(node.inTwinClusterGap){ctx.strokeStyle=filter==='gap'?'#e7c64d':'rgba(156,129,38,.42)';ctx.lineWidth=filter==='gap'?1.2:.6;ctx.stroke()}if(node.layerClosure.isClosure){ctx.strokeStyle=filter==='seam'?colors.seam:'rgba(25,201,154,.45)';ctx.lineWidth=filter==='seam'?1.8:.7;ctx.stroke()}if(cw>13&&on&&(kind!=='composite'||filter==='seam'))label(String(node.n),x+cw/2,y+ch*.68,'center',filter==='seam'?'#051510':kind==='triplet'?'#15191f':'#fff',`${Math.max(6,Math.min(9,cw*.42))}px ui-monospace, monospace`);points.push({node,x:x+cw/2,y:y+ch/2,r:Math.max(4,cw*.6)});}
      label('37 columns · sequential address · 1..1111',ox,Math.max(14,oy-8));
    }
    function edge(a,b,w,h,stroke='rgba(140,165,193,.28)',width=1){const p=project3(a.x,a.y,a.z,w,h),q=project3(b.x,b.y,b.z,w,h);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
    function cubeFrame(w,h){const xs=[0,10],ys=[0,10],zs=[0,9];for(const x of xs)for(const y of ys)edge({x,y,z:0},{x,y,z:9},w,h);for(const x of xs)for(const z of zs)edge({x,y:0,z},{x,y:10,z},w,h);for(const y of ys)for(const z of zs)edge({x:0,y,z},{x:10,y,z},w,h)}
    function layerPlane(z,w,h,strong=false){const stroke=strong?'rgba(25,201,154,.9)':'rgba(25,201,154,.22)',width=strong?2:1;edge({x:0,y:0,z},{x:10,y:0,z},w,h,stroke,width);edge({x:10,y:0,z},{x:10,y:10,z},w,h,stroke,width);edge({x:10,y:10,z},{x:0,y:10,z},w,h,stroke,width);edge({x:0,y:10,z},{x:0,y:0,z},w,h,stroke,width)}
    function draw3D(w,h,mode){
      const isFold=mode==='fold',isHinge=mode==='hinge',isTransform=isFold||isHinge,addressFor=n=>isFold?M.foldAddress(n,fold):isHinge?M.hingeAddress(n,fold):M.cubeAddress(n);
      cubeFrame(w,h);points=[];const projected=[];
      if(filter==='seam'){
        for(let z=0;z<9;z++)layerPlane(z,w,h,Boolean(hover&&hover.layerClosure.isClosure&&hover.layerClosure.layerIndex===z));
        edge({x:10,y:10,z:0},{x:10,y:10,z:8},w,h,'rgba(25,201,154,.95)',2.2);
        const mid=project3(5,5,4,w,h);label('RDMH',mid.x,mid.y-5,'center','#ecfff9','700 16px ui-monospace, monospace');label('29.02.1972 · R / Handle',mid.x,mid.y+13,'center','#73dfc1','10px ui-monospace, monospace');label('OPEN PROVENANCE · NO DATE↔RDMH MAP',mid.x,mid.y+28,'center','#6f7b91','9px ui-monospace, monospace');
      }
      if(isHinge){edge({x:0,y:5,z:5},{x:10,y:5,z:5},w,h,'rgba(240,85,73,.96)',2.6);const hp=project3(5,5,5,w,h);label('661 HINGE · y=5 · z=5',hp.x,hp.y-10,'center','#ff8d82','700 11px ui-monospace, monospace')}
      for(const node of data.nodes){const a=addressFor(node.n),p=project3(a.x,a.y,a.z,w,h);projected.push({node,p})}
      projected.sort((a,b)=>b.p.z-a.p.z);
      for(const {node,p} of projected){const on=visible(node),kind=activeKind(node);ctx.beginPath();ctx.arc(p.x,p.y,on?(kind==='composite'?p.r*.62:p.r*1.35):p.r*.42,0,Math.PI*2);ctx.fillStyle=on?color(node):(node.isPrime?'rgba(79,141,247,.09)':'rgba(51,57,71,.14)');ctx.fill();if(node.inTwinClusterGap&&(filter==='gap'||isTransform)){ctx.strokeStyle='rgba(231,198,77,.72)';ctx.lineWidth=.8;ctx.stroke()}if(isHinge&&[659,661,809].includes(node.n)){ctx.strokeStyle=node.n===661?'#fff':'#ff8d82';ctx.lineWidth=node.n===661?2.2:1.3;ctx.stroke()}points.push({node,x:p.x,y:p.y,r:on?9:5})}
      if(filter==='quadruplet'||filter==='all')for(const group of data.groups.quadruplets){ctx.beginPath();group.forEach((n,i)=>{const a=addressFor(n),p=project3(a.x,a.y,a.z,w,h);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.strokeStyle='rgba(174,80,239,.78)';ctx.lineWidth=1.5;ctx.stroke()}
      label(isFold?`distributed gap fold · θmax ${(fold*90).toFixed(0)}°`:isHinge?`rigid 661 hinge · θ ${(fold*90).toFixed(0)}° · upper n≥661`:'11 × 11 × 10 address carrier',22,25);
      label('drag to rotate',w-22,25,'right','#6f7b91');
    }
    function drawRoots(w,h){
      const left=62,right=24,top=38,bottom=50,pw=w-left-right,ph=h-top-bottom,minLog=Math.log10(M.rootGap(M.MAX_N-1).direct),maxLog=Math.log10(M.rootGap(1).direct);
      const px=k=>left+(k-1)/(M.MAX_N-2)*pw,py=v=>top+(maxLog-Math.log10(v))/(maxLog-minLog)*ph;
      points=[];ctx.strokeStyle='rgba(140,165,193,.18)';ctx.lineWidth=1;
      for(const k of [1,100,500,1000]){const x=px(k);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,top+ph);ctx.stroke();label(String(k),x,top+ph+22,'center')}
      for(const v of [.4,.2,.1,.05,.02]){const y=py(v);ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(left+pw,y);ctx.stroke();label(v.toFixed(v<.1?2:1),left-10,y+4,'right')}
      ctx.beginPath();
      for(let k=1;k<M.MAX_N;k++){const g=M.rootGap(k),x=px(k),y=py(g.direct);k===1?ctx.moveTo(x,y):ctx.lineTo(x,y);points.push({node:data.nodes[k-1],x,y,r:7})}
      ctx.strokeStyle='#67b8ff';ctx.lineWidth=2;ctx.stroke();
      for(const k of [2,5,7]){const g=M.rootGap(k),x=px(k),y=py(g.direct);ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='#d6b64b';ctx.fill();label(`√${k}`,x+8,y-8,'left','#e7c64d')}
      label('Root Ruler · logarithmische Δk-Skala',left,22,'left','#dbe6ff','12px ui-monospace, monospace');label('k · source carrier 1…1110',left+pw/2,h-12,'center');label('Δk',14,top+ph/2,'left','#aab4c8');label('Prime-Filter sind in dieser Linse nicht wirksam',w-22,22,'right','#6f7b91');
    }
    function draw(){
      const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.5,h*.48,10,w*.5,h*.48,Math.max(w,h)*.65);g.addColorStop(0,'#141b2a');g.addColorStop(1,'#080c14');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      if(view==='grid')drawGrid(w,h);else if(view==='root')drawRoots(w,h);else draw3D(w,h,view);
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
        const r=M.rootRecord(node.n),g=r.nextGap;
        detail.innerHTML=`<small>ROOT RECORD ${r.recordId}</small><h3>${r.exact}</h3><p><b>${r.referenceAnchor?'REFERENCE ANCHOR':'ROOT RULER'}</b> · source n=${r.sourceNumber}</p><dl><dt>Float64</dt><dd>${r.approximation.toPrecision(16)}</dd><dt>Δk exact</dt><dd>${g?g.exact:'domain end'}</dd><dt>Rationalized</dt><dd>${g?g.rationalizedExact:'domain end'}</dd><dt>Δk Float64</dt><dd>${g?g.direct.toPrecision(16):'—'}</dd><dt>Residual</dt><dd>${g?g.residual.toExponential(3):'—'}</dd><dt>Return</dt><dd>EXACT → ${r.return.n}</dd></dl><p class="pc-detail-boundary">Symbolischer Radikand exakt; Dezimalwert nur Anzeige.</p>`;
      }else{
        const r=M.numberRecord(node.n,data),tags=r.constellations.length?r.constellations.join(' · '):(node.isPrime?'PRIME':'NO CONSTELLATION'),seam=r.layerClosure.isClosure?`<p><b>11² CLOSURE · ${r.layerClosure.multiplier}×121 · layer z=${r.layerClosure.layerIndex}</b></p>`:'';
        const transition=node.n===661?'<p class="pc-detail-boundary"><b>TRANSITION 661</b> · twin pair #30 · p<sub>121</sub> · index seam 121=11² · 551<sub>11</sub> / address 550<sub>11</sub> · r<sub>37</sub>=32 ↔ 809. The rigid 3D hinge is invertible; only screen projection may overlap.</p>':'';
        detail.innerHTML=`<small>RECORD ${r.recordId}</small><h3>${node.n}${node.isPrime?` · prime #${node.primeIndex}`:''}</h3><p><b>${tags}</b>${node.isSuperprime?' · SUPERPRIME':''}</p>${seam}<dl><dt>Cube</dt><dd>[${node.cube.x}, ${node.cube.y}, ${node.cube.z}]</dd><dt>Grid (37)</dt><dd>row ${node.grid.row}, col ${node.grid.column}</dd><dt>mod 30 / 37</dt><dd>${node.residue.mod30} / ${M.mod(node.n,37)}</dd><dt>Prime index</dt><dd>${node.primeIndex||'—'}</dd><dt>Base 11 n</dt><dd>${r.base11.number}<sub>11</sub></dd><dt>Address n−1</dt><dd>${r.base11.address}<sub>11</sub></dd><dt>11² seam</dt><dd>${r.layerClosure.isClosure?(r.layerClosure.squareClosure?'YES · SQUARE CLOSURE':'YES · COMPOSITE CONTROL'):'NO'}</dd><dt>Gap role</dt><dd>${r.gapRole}</dd><dt>Divisors</dt><dd>${r.factorization.join(', ')}</dd><dt>Return</dt><dd>${r.return.exact?'EXACT → '+r.return.n:'FAIL'}</dd></dl>${transition}${filter==='seam'?'<p class="pc-detail-boundary"><b>RDMH</b> → ROM–MH (Mutterraum), historical vertical-polarity provenance. <b>29.02.1972</b> is a valid leap day with source role “R / Handle”. Their identity remains OPEN; no operator is asserted.</p>':''}`;
      }draw();
    }

    function nearest(e){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;let best=null,dist=14;for(const p of points){const d=Math.hypot(p.x-x,p.y-y);if(d<dist){dist=d;best=p.node}}return best}
    canvas.addEventListener('pointerdown',e=>{if(view==='grid'||view==='root')return;drag=true;last={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
    canvas.addEventListener('pointerup',e=>{drag=false;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}});
    canvas.addEventListener('pointermove',e=>{if(drag){rotY+=(e.clientX-last.x)*.009;rotX+=(e.clientY-last.y)*.009;last={x:e.clientX,y:e.clientY};draw();return}const node=nearest(e);if(node&&(!hover||node.n!==hover.n))show(node)});
    canvas.addEventListener('click',e=>{const node=nearest(e);if(node)show(node)});
    root.querySelectorAll('[data-pc-view]').forEach(btn=>btn.addEventListener('click',()=>{view=btn.dataset.pcView;root.querySelectorAll('[data-pc-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));foldInput.disabled=!['fold','hinge'].includes(view);if(view==='hinge'){fold=1;foldInput.value='100';foldOut.textContent='100% · 90°';show(data.nodes[660])}else show(hover||data.nodes[1])}));
    function setFilter(next){filter=next;root.querySelectorAll('[data-pc-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcFilter===next)));draw()}
    function setView(next){view=next;root.querySelectorAll('[data-pc-view]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.pcView===next)));foldInput.disabled=!['fold','hinge'].includes(view);show(view==='hinge'?data.nodes[660]:(hover||data.nodes[1]))}
    root.querySelectorAll('[data-pc-filter]').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.pcFilter)));
    root.querySelectorAll('[data-pc-seam]').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.pcSeam);setFilter('seam');setView('cube');show(data.nodes[n-1])}));
    root.querySelectorAll('[data-pc-hnode]').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.pcHnode);setFilter('prime');setView('cube');show(data.nodes[n-1]);root.querySelector('.pc-workbench').scrollIntoView({behavior:'smooth',block:'start'})}));
    foldInput.addEventListener('input',()=>{fold=Number(foldInput.value)/100;foldOut.textContent=`${foldInput.value}% · ${(fold*90).toFixed(0)}°`;draw()});
    root.querySelector('[data-pc-reset]').addEventListener('click',()=>{rotX=.56;rotY=-.68;fold=.4;foldInput.value='40';foldOut.textContent='40% · 36°';draw()});
    summary.innerHTML=`<b>${data.counts.primes}</b> primes · <b>${data.counts.twins}</b> twins · <b>${data.counts.triplets}</b> triplets · <b>${data.counts.quadruplets}</b> quadruplets · <b>${data.counts.superprimes}</b> superprimes · <b>${data.counts.layerClosures}</b> 11² seams`;
    renderHPath();show(data.nodes[786]);foldInput.disabled=true;new ResizeObserver(resize).observe(canvas);resize();
    root.primecube={data,draw,show,snapshot:()=>({view,filter,fold,hover:hover&&hover.n})};
  }
  win.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-primecube]').forEach(mount));
})(window);
