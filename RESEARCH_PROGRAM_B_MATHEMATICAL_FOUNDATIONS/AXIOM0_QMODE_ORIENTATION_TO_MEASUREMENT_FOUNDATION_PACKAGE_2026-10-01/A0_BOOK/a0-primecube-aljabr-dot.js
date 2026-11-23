(function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=v=>(Math.round(v*1000)/1000).toFixed(3);

  function svgEl(name,attrs={}){const el=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;}
  function orderedArms(){
    const cells=[];
    for(let d=1;d<=5;d++)[[5-d,5],[5+d,5],[5,5-d],[5,5+d]].forEach(([x,y])=>cells.push({x,y}));
    return cells;
  }
  function drawMask(host,record,role){
    host.textContent='';
    const svg=svgEl('svg',{viewBox:'0 0 420 450',role:'img','aria-label':`${record.grid.visible} of 121 grid cells selected`});
    const arms=orderedArms(),filled=new Set(arms.slice(0,record.grid.completion).map(p=>`${p.x},${p.y}`));
    for(let y=0;y<11;y++)for(let x=0;x<11;x++){
      const center=x===5&&y===5,cross=(x===5||y===5)&&!center,quadrant=!center&&!cross;
      let fill=quadrant?'#24487d':center?'#f0a51b':filled.has(`${x},${y}`)?'#42d5b1':'#0b1727';
      if(role==='DECIMAL_POINT'&&center)fill='#f05da8';
      if(role==='PRODUCT_DOT'&&quadrant)fill='#7356c7';
      svg.appendChild(svgEl('rect',{x:20+x*35,y:20+y*35,width:30,height:30,rx:3,fill,stroke:cross&&!filled.has(`${x},${y}`)?'#293c56':'#566c88','stroke-width':1}));
    }
    svg.appendChild(svgEl('line',{x1:20,y1:20,x2:400,y2:400,stroke:'#f4bf32','stroke-dasharray':'6 5',opacity:.8}));
    svg.appendChild(svgEl('line',{x1:400,y1:20,x2:20,y2:400,stroke:'#f4bf32','stroke-dasharray':'6 5',opacity:.8}));
    const dot=svgEl('text',{x:210,y:218,'text-anchor':'middle',fill:'#fff','font-size':28,'font-weight':900});dot.textContent=role==='DECIMAL_POINT'?'.':'×';svg.appendChild(dot);
    const label=svgEl('text',{x:210,y:435,'text-anchor':'middle',fill:'#aab8cd','font-size':14,'font-family':'ui-monospace, monospace'});label.textContent=`101 + ${record.grid.completion} = ${record.grid.visible} / 121`;svg.appendChild(label);
    host.appendChild(svg);
  }
  function recurrence(alpha,beta,steps){
    const out=[1,.98];
    for(let i=2;i<steps;i++){
      let next=alpha*out[i-1]+beta*(out[i-1]-out[i-2]);
      if(!Number.isFinite(next))next=0;
      out.push(clamp(next,-1e6,1e6));
    }
    const peak=Math.max(1,...out.map(Math.abs));
    return out.map(v=>v/peak);
  }
  function drawPolar(canvas,angle,alpha,beta,steps){
    const dpr=Math.min(window.devicePixelRatio||1,2),rect=canvas.getBoundingClientRect(),w=Math.max(320,rect.width),h=440;
    canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);
    const cx=w*.36,cy=h*.52,R=Math.min(w*.3,h*.37);c.strokeStyle='#233751';c.lineWidth=1;
    for(const q of [.33,.66,1]){c.beginPath();c.arc(cx,cy,R*q,0,Math.PI*2);c.stroke();}
    const vals=recurrence(alpha,beta,steps),turn=angle*Math.PI/180;c.strokeStyle='#3b83ff';c.lineWidth=1.6;c.beginPath();
    vals.forEach((r,i)=>{const a=-Math.PI/2+i*turn,x=cx+Math.abs(r)*R*Math.cos(a),y=cy+Math.abs(r)*R*Math.sin(a);i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();
    c.fillStyle='#dce8fa';c.font='700 12px ui-monospace, monospace';c.fillText(`${angle}° · mod 11 = ${angle%11}`,18,24);c.fillStyle='#7f93ae';c.fillText(`rₙ₊₁=αrₙ+β(rₙ−rₙ₋₁)`,18,h-18);
    const ix=w*.79,iy=h*.25,ir=Math.min(70,w*.14);c.strokeStyle='#3a4e69';c.beginPath();c.arc(ix,iy,ir,0,Math.PI*2);c.stroke();
    for(let k=0;k<11;k++){const a=-Math.PI/2+k*2*Math.PI/11,x=ix+ir*Math.cos(a),y=iy+ir*Math.sin(a);c.fillStyle=k===5?'#f4bf32':k===6?'#42d5b1':k===angle%11?'#59ddf5':'#71829a';c.beginPath();c.arc(x,y,k===5||k===6?5:3,0,Math.PI*2);c.fill();c.fillStyle='#9fafc4';c.fillText(String(k),x-4,y-8);}
    const pt=k=>({x:ix+ir*Math.cos(-Math.PI/2+k*2*Math.PI/11),y:iy+ir*Math.sin(-Math.PI/2+k*2*Math.PI/11)}),p5=pt(5),p6=pt(6);c.strokeStyle='#f4bf32';c.setLineDash([5,4]);c.beginPath();c.moveTo(p5.x,p5.y);c.lineTo(p6.x,p6.y);c.stroke();c.setLineDash([]);c.fillStyle='#d9c879';c.fillText('5+6≡0',ix-27,iy+ir+30);
  }
  function boot(){
    const root=document.querySelector('[data-pc-aljabr-dot]'),M=window.A0PrimecubeModel;if(!root||!M)return;
    const state={role:'CENTER_DOT',completion:0,angle:102,alpha:.985,beta:.25,steps:60};
    const mask=root.querySelector('[data-pc-dot-mask]'),canvas=root.querySelector('[data-pc-dot-polar]'),detail=root.querySelector('[data-pc-dot-detail]');
    function render(){
      const rec=M.alJabrDotLensRecord(state.completion),op=rec.operators.find(x=>x.id===state.role),angle=rec.polar.angles.find(x=>x.degrees===state.angle);
      drawMask(mask,rec,state.role);drawPolar(canvas,state.angle,state.alpha,state.beta,state.steps);
      root.querySelector('[data-pc-dot-completion-out]').textContent=String(state.completion);
      root.querySelector('[data-pc-dot-alpha-out]').textContent=fmt(state.alpha);root.querySelector('[data-pc-dot-beta-out]').textContent=fmt(state.beta);
      detail.innerHTML=`<div class="pc-eyebrow">Typed operator · ${op.id}</div><h3>${op.glyph} · ${op.meaning}</h3><dl class="pc-dot-readout"><dt>Equation</dt><dd>${op.equation}</dd><dt>Grid</dt><dd>${rec.grid.equation} · ${rec.grid.closed?'CLOSED':'OPEN'}</dd><dt>Angle</dt><dd>${angle.degrees}° → residue ${angle.residue} mod 11</dd><dt>Exact</dt><dd>${rec.polar.exactRelations.join(' · ')}</dd><dt>5 / 6</dt><dd>additive inverses mod 11; not antipodal</dd><dt>α / β</dt><dd>${fmt(state.alpha)} / ${fmt(state.beta)}</dd></dl><div class="pc-dot-callout">Die geometrische Quadrat-Ergänzung ist die historische Analogie. Das 11×11-Raster, seine 101-Zellen-Maske und die drei Punktrollen sind deklarierte Architektur dieses Instruments. <a class="pc-dot-link" href="#mandelbrot-memory-field">Zum α/β-Fraktalfeld ↑</a></div>`;
      root.querySelectorAll('[data-pc-dot-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pcDotRole===state.role)));root.querySelectorAll('[data-pc-dot-angle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pcDotAngle)===state.angle)));
    }
    root.addEventListener('click',e=>{const r=e.target.closest('[data-pc-dot-role]'),a=e.target.closest('[data-pc-dot-angle]');if(r)state.role=r.dataset.pcDotRole;if(a)state.angle=Number(a.dataset.pcDotAngle);if(r||a)render();});
    root.querySelector('[data-pc-dot-completion]').addEventListener('input',e=>{state.completion=Number(e.target.value);render();});
    root.querySelector('[data-pc-dot-alpha]').addEventListener('input',e=>{state.alpha=Number(e.target.value);render();});
    root.querySelector('[data-pc-dot-beta]').addEventListener('input',e=>{state.beta=Number(e.target.value);render();});
    window.addEventListener('resize',render,{passive:true});render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
