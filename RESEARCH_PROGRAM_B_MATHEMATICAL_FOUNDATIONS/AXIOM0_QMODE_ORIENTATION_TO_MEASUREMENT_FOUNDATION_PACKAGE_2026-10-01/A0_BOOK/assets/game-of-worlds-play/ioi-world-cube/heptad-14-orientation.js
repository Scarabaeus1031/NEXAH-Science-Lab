(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0Heptad14=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const archetypes=['EULER','RIEMANN','RAMANUJAN','GAUSS','GÖDEL','PENROSE','WEIL'];
  const colors=['#f4c64e','#85c8ff','#ff79bc','#f3a083','#81e2b0','#d8d7e6','#c890f2'];
  const starOrder=[0,3,6,2,5,1,4,0];
  const referenceModes={
    17:{button:'17 · HMA REF',sector:'HMA · VISUAL',name:'SEPARATE CONTROL'},
    19:{button:'19 · KⅠ?',sector:'KⅠ · REFERENCE',name:'DB? · OPEN'},
    29:{button:'29 · KⅡ?',sector:'KⅡ · REFERENCE',name:'WWK? · OPEN'}
  };
  const mod=(value,base)=>((value%base)+base)%base;
  const primaryIndex=n=>mod(n,14)%2===0?mod(n,14)/2:mod(n+7,14)/2;
  const state14=value=>{
    const step=mod(Number(value)||0,14);
    const pair=mod(step+7,14);
    const index=primaryIndex(step);
    return {step,pair,sector:step%7,side:step%2===0?'PRIMARY':'ANTIPODE',angleDegrees:step*180/7,archetype:archetypes[index],color:colors[index]};
  };
  const point=(index,count,radius,cx=250,cy=250,start=0)=>{
    const angle=start+(index*Math.PI*2/count);
    return {x:cx+Math.cos(angle)*radius,y:cy-Math.sin(angle)*radius};
  };
  const svgNode=(name,attrs,text)=>{
    const node=document.createElementNS('http://www.w3.org/2000/svg',name);
    Object.entries(attrs||{}).forEach(([key,value])=>node.setAttribute(key,String(value)));
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const createHost=()=>{
    const rail=document.querySelector('.cube-nav-rail');
    if(!rail)return null;
    const host=document.createElement('section');
    host.className='heptad14';
    host.id='heptad14Orientation';
    host.setAttribute('aria-labelledby','heptad14Title');
    host.innerHTML='<header><div><span class="eyebrow">ORIENTATION ADAPTER · SAME CARRIER</span><h3 id="heptad14Title">Heptad 14 · N-Stick im World Cube</h3><p>Sieben dokumentierte Heptad-Positionen plus sieben Gegenpunkte. Der Adapter liest Orientierung; er ersetzt weder die acht Cube-Corner-Adressen noch mutiert er das GLB.</p></div><span class="heptad14-status">SOURCE-BOUND VIEW<br>NO NEW IDENTITY</span></header><div class="heptad14-grid"><div class="heptad14-figure"><svg viewBox="0 0 500 500" role="img" aria-label="Interaktiver 14er Orientierungsring mit Nadir O Null Zenith Achse"></svg></div><div class="heptad14-panel"><div class="heptad14-modes" role="group" aria-label="Orientierungsregister wählen"><button type="button" data-h14-mode="7" aria-pressed="false">7 · PRIMARY</button><button type="button" data-h14-mode="14" aria-pressed="true">14 · ± PAIRS</button><button type="button" data-h14-mode="17" aria-pressed="false">17 · HMA REF</button></div><div class="heptad14-readout" aria-live="polite"><div><small>STEP</small><b data-h14-readout="step">00 / 14</b></div><div><small>Z₇ SECTOR</small><b data-h14-readout="sector">0 / 7</b></div><div><small>SIDE</small><b data-h14-readout="side">PRIMARY</b></div><div><small>ANGLE</small><b data-h14-readout="angle">0.000°</b></div><div><small>ANTIPODAL PAIR</small><b data-h14-readout="pair">0 ↔ 7</b></div><div><small>HEPTAD NODE</small><b data-h14-readout="name">EULER</b></div></div><div class="heptad14-controls"><button type="button" data-h14-step="prev">−1 STEP</button><button type="button" data-h14-step="zero">RETURN O₀</button><button type="button" data-h14-step="next">+1 STEP</button></div><p class="heptad14-boundary"><b>Adressvertrag:</b> θₙ=nπ/7 und Z₁₄ ≅ Z₇×Z₂. Primärpunkt und Gegenpunkt teilen ihren Z₇-Sektor. Die 17er-HMA-Ansicht bleibt ein separater Kontrollring; es wird keine 14↔17-Abbildung behauptet. Die GLB-Links verweisen nur auf bereits hashgebundene Bench-Quellen.</p><div class="heptad14-links"><a href="../../../A0_ORIENTATION_CONTROLLER_BENCH.html#benchIntegration">A0 Bench · GLB Viewer ↗</a><a href="../../../results/a0-bench-fusion-glb-audit-2026-10-21.json">GLB Audit ↗</a><a href="../../../results/a0-ioi-heptad14-orientation-adapter-return-2026-11-05.json">Adapter Receipt ↗</a></div><span class="h14-hidden">NO 14↔17 MAP</span></div></div>';
    rail.insertAdjacentElement('afterend',host);
    return host;
  };
  const mount=()=>{
    const host=document.getElementById('heptad14Orientation')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';
    const modes=host.querySelector('.heptad14-modes');
    const starButton=document.createElement('button');
    starButton.type='button';
    starButton.className='heptad14-star-toggle';
    starButton.dataset.h14Star='';
    starButton.setAttribute('aria-pressed','true');
    starButton.textContent='★ INNER STAR · {7/3} · VIEW RELATIONS';
    modes.insertAdjacentElement('afterend',starButton);
    [19,29].forEach(order=>{
      const button=document.createElement('button');
      button.type='button';
      button.dataset.h14Mode=String(order);
      button.setAttribute('aria-pressed','false');
      button.textContent=referenceModes[order].button;
      modes.append(button);
    });
    host.querySelector('.heptad14-boundary').innerHTML='<b>Adressvertrag:</b> θₙ=nπ/7 und Z₁₄ ≅ Z₇×Z₂. Der große Stern ist die innere {7/3}-Traversierung 0→3→6→2→5→1→4→0. Die 17/19/29-Ringe sind getrennte Shadow-gon-Kontrollen; es wird keine Abbildung zwischen ihnen oder zum 14er-Register behauptet. KⅠ/KⅡ sowie DB?/WWK? bleiben offene Lesemarker.';
    const svg=host.querySelector('svg');
    const modeButtons=[...host.querySelectorAll('[data-h14-mode]')];
    let mode=14;
    let step=0;
    let starVisible=true;
    const draw=()=>{
      const reference=referenceModes[mode]||null;
      const state=reference?null:state14(step);
      svg.replaceChildren();
      svg.append(svgNode('circle',{cx:250,cy:250,r:174,class:'h14-ring'}));
      svg.append(svgNode('line',{x1:250,y1:36,x2:250,y2:464,class:'h14-axis'}));
      svg.append(svgNode('text',{x:260,y:48,class:'h14-axis-label'},'ZENITH · N+'));
      svg.append(svgNode('text',{x:260,y:462,class:'h14-axis-label'},'NADIR · N−'));
      svg.append(svgNode('circle',{cx:250,cy:250,r:7,class:'h14-zero'}));
      svg.append(svgNode('text',{x:263,y:254,class:'h14-axis-label'},'O₀'));
      if(reference){
        svg.append(svgNode('circle',{cx:250,cy:250,r:188,class:'h14-reference'}));
        for(let i=0;i<mode;i++){
          const p=point(i,mode,188,250,250,Math.PI/2);
          svg.append(svgNode('circle',{cx:p.x,cy:p.y,r:i===mod(step,mode)?6:3,class:i===mod(step,mode)?'h14-active':'h14-reference-dot'}));
        }
      }else{
        if(starVisible){
          const points=starOrder.map(index=>{
            const p=point(index*2,14,174,250,250,0);
            return p.x+','+p.y;
          }).join(' ');
          svg.append(svgNode('polyline',{points,class:'h14-star'}));
        }
        const active=point(state.step,14,174,250,250,0);
        const paired=point(state.pair,14,174,250,250,0);
        svg.append(svgNode('line',{x1:active.x,y1:active.y,x2:paired.x,y2:paired.y,class:'h14-pair'}));
        for(let i=0;i<14;i++){
          const p=point(i,14,174,250,250,0);
          const isPrimary=i%2===0;
          if(mode===7&&!isPrimary)continue;
          const node=svgNode('circle',{cx:p.x,cy:p.y,r:isPrimary?9:6,class:(isPrimary?'h14-primary':'h14-antipode')+(i===state.step?' h14-active':'')});
          if(isPrimary)node.style.fill=colors[i/2]+'22';
          svg.append(node);
          if(isPrimary){
            const lp=point(i,14,204,250,250,0);
            svg.append(svgNode('text',{x:lp.x,y:lp.y+3,'text-anchor':'middle',class:'h14-label h14-label-primary'},archetypes[i/2]));
          }
        }
      }
      host.querySelector('[data-h14-readout="step"]').textContent=reference?String(mod(step,mode)).padStart(2,'0')+' / '+mode:String(state.step).padStart(2,'0')+' / 14';
      host.querySelector('[data-h14-readout="sector"]').textContent=reference?reference.sector:state.sector+' / 7';
      host.querySelector('[data-h14-readout="side"]').textContent=reference?'REFERENCE':state.side;
      host.querySelector('[data-h14-readout="angle"]').textContent=reference?(mod(step,mode)*360/mode).toFixed(3)+'°':state.angleDegrees.toFixed(3)+'°';
      host.querySelector('[data-h14-readout="pair"]').textContent=reference?'NO 14↔'+mode+' MAP':state.step+' ↔ '+state.pair;
      host.querySelector('[data-h14-readout="name"]').textContent=reference?reference.name:state.archetype;
    };
    modeButtons.forEach(button=>button.addEventListener('click',()=>{
      mode=Number(button.dataset.h14Mode);
      step=0;
      modeButtons.forEach(peer=>peer.setAttribute('aria-pressed',String(peer===button)));
      starButton.disabled=Boolean(referenceModes[mode]);
      draw();
    }));
    starButton.addEventListener('click',()=>{
      starVisible=!starVisible;
      starButton.setAttribute('aria-pressed',String(starVisible));
      draw();
    });
    host.querySelector('[data-h14-step="prev"]').addEventListener('click',()=>{step=mod(step-1,referenceModes[mode]?mode:14);draw();});
    host.querySelector('[data-h14-step="next"]').addEventListener('click',()=>{step=mod(step+1,referenceModes[mode]?mode:14);draw();});
    host.querySelector('[data-h14-step="zero"]').addEventListener('click',()=>{step=0;draw();});
    document.addEventListener('a0:heptad14-select',event=>{
      const requested=Number(event.detail&&event.detail.step);
      if(!Number.isInteger(requested)||requested<0||requested>13)return;
      mode=14;
      step=mod(requested,14);
      modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.h14Mode)===14)));
      starButton.disabled=false;
      draw();
    });
    draw();
  };
  return {archetypes,colors,starOrder,referenceModes,mod,primaryIndex,state14,point,createHost,mount};
});
