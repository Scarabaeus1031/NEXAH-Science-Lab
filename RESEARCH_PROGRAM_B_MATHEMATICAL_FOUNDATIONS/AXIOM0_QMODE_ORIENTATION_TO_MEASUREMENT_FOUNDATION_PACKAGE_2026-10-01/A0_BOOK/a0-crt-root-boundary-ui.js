(function(win){
  'use strict';
  const M=win.A0CrtRootBoundaryModel;if(!M)return;

  function mount(root){
    const data=M.buildDataset(),ringCanvas=root.querySelector('[data-crb-ring-canvas]'),ringCtx=ringCanvas.getContext('2d'),rootCanvas=root.querySelector('[data-crb-root-canvas]'),rootCtx=rootCanvas.getContext('2d');
    const ringTable=root.querySelector('[data-crb-ring-table]'),ringDetail=root.querySelector('[data-crb-ring-detail]'),rootDetail=root.querySelector('[data-crb-root-detail]'),indexInput=root.querySelector('[data-crb-index]'),indexOut=root.querySelector('[data-crb-index-out]'),layerInput=root.querySelector('[data-crb-layer]'),layerOut=root.querySelector('[data-crb-layer-out]'),layerSummary=root.querySelector('[data-crb-layer-summary]');
    let operator='SOURCE',selectedSlot=4,currentIndex=121,currentLayer=32,ringPoints=[];
    const dpr=()=>Math.max(1,Math.min(2,win.devicePixelRatio||1));
    function setup(canvas,ctx){const rect=canvas.getBoundingClientRect(),p=dpr();canvas.width=Math.max(1,Math.round(rect.width*p));canvas.height=Math.max(1,Math.round(rect.height*p));ctx.setTransform(p,0,0,p,0,0);return rect}
    function text(ctx,s,x,y,align='center',fill='#aeb8ca',font='11px ui-monospace,monospace'){ctx.fillStyle=fill;ctx.font=font;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y)}

    function drawRing(){
      const {width:w,height:h}=setup(ringCanvas,ringCtx),cx=w/2,cy=h/2,R=Math.min(w,h)*.34;ringCtx.clearRect(0,0,w,h);ringPoints=[];
      ringCtx.beginPath();ringCtx.arc(cx,cy,R,0,Math.PI*2);ringCtx.strokeStyle='rgba(160,177,203,.36)';ringCtx.lineWidth=1.4;ringCtx.stroke();
      ringCtx.beginPath();ringCtx.moveTo(cx-R-24,cy);ringCtx.lineTo(cx+R+24,cy);ringCtx.setLineDash([5,5]);ringCtx.strokeStyle='rgba(214,182,75,.28)';ringCtx.stroke();ringCtx.setLineDash([]);
      data.ring.records.forEach(record=>{
        const a=-record.slot*Math.PI/3,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R,result=M.ringOperator(record.slot,operator),selected=record.slot===selectedSlot;
        ringCtx.beginPath();ringCtx.arc(x,y,selected?27:23,0,Math.PI*2);ringCtx.fillStyle=selected?'rgba(103,184,255,.2)':'#121a27';ringCtx.fill();ringCtx.strokeStyle=selected?'#67b8ff':(record.isPrime?'#54c58b':'#586579');ringCtx.lineWidth=selected?2.4:1.2;ringCtx.stroke();
        const label=operator==='N37'?`r${result.target.residue37}`:String(result.target.n);text(ringCtx,label,x,y,'center','#eef3fb',selected?'700 12px ui-monospace,monospace':'11px ui-monospace,monospace');
        text(ringCtx,`S${record.slot}`,cx+Math.cos(a)*(R+40),cy+Math.sin(a)*(R+40));ringPoints.push({slot:record.slot,x,y});
      });
      text(ringCtx,operator==='R637'?'R₆₃₇ may leave supplied set':operator==='N37'?'residue image only':operator==='J6'?'closed slot permutation':'source marker ring',cx,cy,'center','#7f8ca2');
    }

    function updateRing(){
      ringTable.innerHTML='';data.ring.records.forEach(record=>{const tr=document.createElement('tr');tr.dataset.selected=String(record.slot===selectedSlot);tr.innerHTML=`<td>S${record.slot}</td><td>${record.n}</td><td>${record.isPrime?'prime':'composite'}</td><td>${record.factorization}</td><td>${record.residues.mod7}</td><td>${record.residues.mod11}</td><td>${record.residues.mod37}</td>`;tr.addEventListener('click',()=>{selectedSlot=record.slot;updateRing();setLayer(record.residues.mod37)});ringTable.appendChild(tr)});
      const source=M.ringRecord(selectedSlot),result=M.ringOperator(selectedSlot,operator),target=operator==='N37'?`r₃₇=${result.target.residue37}`:`${result.target.n}${result.target.slot===null?' · outside supplied set':''}`;
      ringDetail.innerHTML=`<b>S${source.slot} · ${source.n}</b> → ${target} · ${result.type} · Return ${result.closed?'defined in declared carrier':'requires external source address'}`;drawRing();renderHeatmap();
    }

    function drawRoot(){
      const {width:w,height:h}=setup(rootCanvas,rootCtx),pad={l:42,r:18,t:28,b:38},pw=w-pad.l-pad.r,ph=h-pad.t-pad.b,min=115,max=142,base=pad.t+ph*.7,x=k=>pad.l+(k-min)/(max-min)*pw;
      rootCtx.clearRect(0,0,w,h);rootCtx.fillStyle='rgba(103,184,255,.06)';rootCtx.fillRect(x(121),pad.t,x(140)-x(121),ph);
      rootCtx.beginPath();rootCtx.moveTo(pad.l,base);rootCtx.lineTo(pad.l+pw,base);rootCtx.strokeStyle='rgba(160,177,203,.32)';rootCtx.stroke();
      for(const k of [115,121,130,140,142]){const xx=x(k);rootCtx.beginPath();rootCtx.moveTo(xx,pad.t);rootCtx.lineTo(xx,pad.t+ph);rootCtx.strokeStyle=k===121?'rgba(214,182,75,.48)':'rgba(160,177,203,.12)';rootCtx.stroke();text(rootCtx,String(k),xx,h-15)}
      rootCtx.beginPath();
      for(let k=min;k<=max;k++){const rec=M.seamRecord(k),xx=x(k),yy=base-rec.fraction*ph*.62;k===min?rootCtx.moveTo(xx,yy):rootCtx.lineTo(xx,yy)}rootCtx.strokeStyle='#67b8ff';rootCtx.lineWidth=1.8;rootCtx.stroke();
      for(let k=min;k<=max;k++){const rec=M.seamRecord(k),xx=x(k),yy=base-rec.fraction*ph*.62;rootCtx.beginPath();rootCtx.arc(xx,yy,k===currentIndex?5:2.5,0,Math.PI*2);rootCtx.fillStyle=k===currentIndex?'#f2d56f':(rec.r37===32?'#f06a6a':'#54c58b');rootCtx.fill()}
      text(rootCtx,'fractional part {√k}',pad.l,16,'left','#aeb8ca');text(rootCtx,'k=121 → √k=11 exactly',x(121)+6,pad.t+12,'left','#d6b64b');
    }

    function updateRoot(){
      const r=M.seamRecord(currentIndex);indexOut.textContent=String(currentIndex);
      rootDetail.innerHTML=`<div class="crb-metric"><span>Prime index</span><b>p${r.k} = ${r.p}</b></div><div class="crb-metric"><span>√k / floor</span><b>${r.sqrt.toPrecision(12)} / ${r.floor}</b></div><div class="crb-metric"><span>Fraction / Δk</span><b>${r.fraction.toFixed(9)} / ${r.delta.toFixed(9)}</b></div><div class="crb-metric"><span>CRT / role</span><b>r₃₇=${r.r37} · ${r.twinClusterRole}</b></div>`;drawRoot();
    }

    function setLayer(layer){currentLayer=M.mod(Number(layer),37);layerInput.value=String(currentLayer);renderSlice()}
    function renderSlice(){
      const grid=root.querySelector('[data-crb-slice-grid]'),detail=root.querySelector('[data-crb-slice-detail]'),cells=M.crtSlice(currentLayer),summary=M.crtLayerSummary(currentLayer),lookup=new Map(cells.map(c=>[`${c.mod7}:${c.mod11}`,c])),anchorMap=new Map(data.crt.anchors.map(a=>[a.n,a.label]));grid.innerHTML='';layerOut.textContent=String(currentLayer);
      root.querySelectorAll('[data-crb-layer-jump]').forEach(btn=>btn.setAttribute('aria-pressed',String(Number(btn.dataset.crbLayerJump)===currentLayer)));
      const markerText=summary.ringMarkers.length?` · ring marker ${summary.ringMarkers.join(', ')}`:'',note=summary.note&&!/^ring marker/.test(summary.note)?` · ${summary.note}`:'';
      layerSummary.innerHTML=`<b>r₃₇=${summary.residue37}</b> · inverse class ${summary.inverse37} · ${summary.primeCount} primes / ${summary.cellCount} cells${markerText}${note}`;
      const head=document.createElement('div');head.className='crb-slice-head';head.textContent='7∖11';grid.appendChild(head);
      for(let b=0;b<11;b++){const el=document.createElement('div');el.className='crb-slice-head';el.textContent=String(b);grid.appendChild(el)}
      for(let a=0;a<7;a++){const rh=document.createElement('div');rh.className='crb-slice-head';rh.textContent=String(a);grid.appendChild(rh);for(let b=0;b<11;b++){const c=lookup.get(`${a}:${b}`),el=document.createElement('button'),tag=anchorMap.get(c.n);el.type='button';el.className='crb-slice-cell';el.dataset.anchor=String(Boolean(tag));el.dataset.prime=String(c.isPrime);el.innerHTML=tag?`<span>${c.n}</span><small>${tag}</small>`:String(c.n);el.setAttribute('aria-label',`n ${c.n}, mod 7 ${a}, mod 11 ${b}, mod 37 ${currentLayer}${tag?`, anchor ${tag}`:''}`);el.addEventListener('click',()=>{detail.innerHTML=`<b>n=${c.n}</b> · (${c.mod7}, ${c.mod11}, ${c.mod37}) · inverse layer ${summary.inverse37} · ${c.isPrime?'prime':`composite: ${c.factorization}`}${tag?` · anchor ${tag}`:''} · exact CRT address return`});grid.appendChild(el)}}
    }

    function renderHeatmap(){
      const table=root.querySelector('[data-crb-heatmap-table]');let html='<thead><tr><th>Source</th>';data.heatmap.columns.forEach((n,i)=>{html+=`<th${i===selectedSlot?' data-selected="true"':''}>${n}</th>`});html+='</tr></thead><tbody>';
      data.heatmap.rows.forEach(row=>{html+=`<tr><td>${row.name}</td>`;row.scores.forEach((score,i)=>{const t=Math.max(0,Math.min(1,(score-.25)/.4)),alpha=(.08+t*.34).toFixed(2);html+=`<td${i===selectedSlot?' data-selected="true"':''} style="background:rgba(214,182,75,${alpha})">${score.toFixed(2)}</td>`});html+='</tr>'});table.innerHTML=html+'</tbody>';
    }

    root.querySelectorAll('[data-crb-op]').forEach(btn=>btn.addEventListener('click',()=>{operator=btn.dataset.crbOp;root.querySelectorAll('[data-crb-op]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));updateRing()}));
    ringCanvas.addEventListener('click',e=>{const r=ringCanvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,dist=32;ringPoints.forEach(p=>{const d=Math.hypot(p.x-x,p.y-y);if(d<dist){dist=d;best=p}});if(best){selectedSlot=best.slot;updateRing();setLayer(M.ringRecord(best.slot).residues.mod37)}});
    indexInput.addEventListener('input',()=>{currentIndex=Number(indexInput.value);updateRoot()});
    layerInput.addEventListener('input',()=>setLayer(layerInput.value));
    root.querySelectorAll('[data-crb-layer-jump]').forEach(btn=>btn.addEventListener('click',()=>setLayer(btn.dataset.crbLayerJump)));
    new ResizeObserver(()=>{drawRing();drawRoot()}).observe(root);
    updateRing();updateRoot();renderSlice();renderHeatmap();
    root.crtRootAudit={data,snapshot:()=>({operator,selectedSlot,currentIndex,currentLayer})};
  }
  win.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-crt-root-audit]').forEach(mount));
})(window);
