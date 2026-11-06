(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0CPMRSpiralCube=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const roles=[
    {key:'C',position:'LEFT',scale:'10',face:'FRONT',progress:.18,color:'#f0b52b'},
    {key:'P',position:'TOP',scale:'100',face:'TOP',progress:.42,color:'#ffca55'},
    {key:'M',position:'RIGHT / INNER',scale:'100',face:'RIGHT',progress:.68,color:'#ef75ef'},
    {key:'R',position:'RIGHT / OUTER',scale:'10⁶',face:'BACK',progress:1,color:'#b65cff'}
  ];
  const mod=(value,base)=>((value%base)+base)%base;
  const state=value=>roles[mod(Number(value)||0,roles.length)];
  const spiralPoints=(count=220,turns=3.35)=>{
    const total=Math.max(2,Math.floor(count));
    return Array.from({length:total},(_,index)=>{
      const u=index/(total-1);
      const angle=-Math.PI/2+u*turns*Math.PI*2;
      const radius=7+u*188;
      return {x:300+Math.cos(angle)*radius,y:220+Math.sin(angle)*radius,u,radius};
    });
  };
  const starOrder=(order=17,step=5)=>{
    const route=[0];
    let cursor=0;
    for(let i=0;i<order;i++){
      cursor=mod(cursor+step,order);
      route.push(cursor);
      if(cursor===0)break;
    }
    return route;
  };
  const svgNode=(name,attrs,text)=>{
    const node=document.createElementNS('http://www.w3.org/2000/svg',name);
    Object.entries(attrs||{}).forEach(([key,value])=>node.setAttribute(key,String(value)));
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const createHost=()=>{
    const anchor=document.getElementById('algoEightFloorRegister')||document.getElementById('heptad14Orientation')||document.querySelector('.cube-nav-rail');
    if(!anchor)return null;
    const host=document.createElement('section');
    host.className='cpmr';
    host.id='cpmrSpiralCube';
    host.setAttribute('aria-labelledby','cpmrTitle');
    host.innerHTML='<header><div><span class="eyebrow">CPMR ORIENTATION · SAME CARRIER</span><h3 id="cpmrTitle">C · P · M · R — Spiral über Cube</h3><p>Die Owner-Visuals werden als rekonstruierte Lesefolge umgesetzt: Triad-Bänder, 17er Innenchord und 19|29-Grid führen zur CPMR-Adresse. Der Cube darunter zeigt dieselbe Auswahl als Flächenansicht.</p></div><span class="cpmr-status">CODE-NATIVE VIEW<br>NO IMAGE COPY</span></header><div class="cpmr-grid"><div class="cpmr-visual"><div class="cpmr-spiral-wrap"><svg viewBox="0 0 600 420" role="img" aria-label="Interaktive CPMR Spirale mit Triad-Bändern und optionalem 17 durch 5 Innenstern"></svg></div><div class="cpmr-cube-stage" aria-label="CPMR Cube unter der Spirale"><div class="cpmr-cube" data-cpmr-cube="C"><span class="cpmr-face cpmr-front">C</span><span class="cpmr-face cpmr-back">R</span><span class="cpmr-face cpmr-right">M</span><span class="cpmr-face cpmr-left">W</span><span class="cpmr-face cpmr-top">P</span><span class="cpmr-face cpmr-bottom">O₀</span></div><span class="cpmr-cube-caption">SAME CARRIER · ACTIVE FACE <b data-cpmr-readout="cube">FRONT</b></span></div></div><div class="cpmr-panel"><div class="cpmr-route" role="group" aria-label="CPMR Adresse wählen"><button type="button" data-cpmr-role="0" aria-pressed="true">C<small>LEFT</small></button><button type="button" data-cpmr-role="1" aria-pressed="false">P<small>TOP</small></button><button type="button" data-cpmr-role="2" aria-pressed="false">M<small>RIGHT</small></button><button type="button" data-cpmr-role="3" aria-pressed="false">R<small>OUTER</small></button></div><div class="cpmr-readout" aria-live="polite"><div><small>ORDER</small><b data-cpmr-readout="order">01 / 04</b></div><div><small>MARKER</small><b data-cpmr-readout="marker">C</b></div><div><small>POSITION</small><b data-cpmr-readout="position">LEFT</b></div><div><small>SCALE GLYPH</small><b data-cpmr-readout="scale">10</b></div><div><small>CUBE FACE</small><b data-cpmr-readout="face">FRONT</b></div><div><small>MODE</small><b>OWNER VIEW</b></div></div><div class="cpmr-overlays"><button type="button" data-cpmr-overlay="bands" aria-pressed="true">TRIAD BANDS</button><button type="button" data-cpmr-overlay="star" aria-pressed="true">{17/5} CHORD</button></div><div class="cpmr-controls"><button type="button" data-cpmr-step="prev">← PREV</button><button type="button" data-cpmr-step="zero">RETURN C</button><button type="button" data-cpmr-step="next">NEXT →</button></div><div class="cpmr-trail" aria-label="Rekonstruierte visuelle Herkunft"><span>TRIAD</span><i>→</i><span>7 / 17</span><i>→</i><span>19 | 29</span><i>→</i><b>CPMR</b></div><p class="cpmr-boundary"><b>Vertrag:</b> C, P, M und R bleiben Owner-Adressmarker; ihre ausgeschriebenen Bedeutungen sind nicht kanonisiert. <code>10 · 100 · 100 · 10⁶</code> sind sichtbare Skalen-Glyphen des Referenzbilds, keine abgeleitete Messreihe. Triad-Bänder, {17/5}-Chord und der Cube sind schaltbare Projektionshilfen. Es wird weder eine physikalische Resonanz noch eine 17↔19↔29-Abbildung behauptet.</p><div class="cpmr-links"><a href="../../../assets/a0-field-notes/index.html#note-54">Field Note · 17/5 ↗</a><a href="../../../results/a0-ioi-cpmr-spiral-cube-return-2026-11-05.json">CPMR Receipt ↗</a></div></div></div>';
    anchor.insertAdjacentElement('afterend',host);
    return host;
  };
  const mount=()=>{
    const host=document.getElementById('cpmrSpiralCube')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';
    const svg=host.querySelector('svg');
    const cube=host.querySelector('[data-cpmr-cube]');
    const roleButtons=[...host.querySelectorAll('[data-cpmr-role]')];
    const overlays={bands:true,star:true};
    let active=0;
    const draw=()=>{
      const current=state(active);
      const points=spiralPoints();
      svg.replaceChildren();
      const defs=svgNode('defs');
      const gradient=svgNode('linearGradient',{id:'cpmr-gradient',x1:'0%',y1:'0%',x2:'100%',y2:'0%'});
      gradient.append(svgNode('stop',{offset:'0%','stop-color':'#f0b52b'}),svgNode('stop',{offset:'58%','stop-color':'#f0814d'}),svgNode('stop',{offset:'100%','stop-color':'#b65cff'}));
      defs.append(gradient);svg.append(defs);
      if(overlays.bands){
        [58,77,96].forEach((radius,index)=>svg.append(svgNode('circle',{cx:300,cy:220,r:radius,class:'cpmr-band cpmr-band-'+index})));
      }
      svg.append(svgNode('line',{x1:54,y1:220,x2:566,y2:220,class:'cpmr-axis'}),svgNode('line',{x1:300,y1:24,x2:300,y2:396,class:'cpmr-axis'}));
      if(overlays.star){
        const route=starOrder();
        const chordPoints=route.map(index=>{
          const angle=-Math.PI/2+index*Math.PI*2/17;
          return (300+Math.cos(angle)*88)+','+(220+Math.sin(angle)*88);
        }).join(' ');
        svg.append(svgNode('polyline',{points:chordPoints,class:'cpmr-star'}));
      }
      const pathData=points.map((point,index)=>(index?'L':'M')+point.x.toFixed(2)+' '+point.y.toFixed(2)).join(' ');
      svg.append(svgNode('path',{d:pathData,class:'cpmr-spiral'}));
      const marker=points[Math.round(current.progress*(points.length-1))];
      svg.append(svgNode('line',{x1:marker.x,y1:marker.y,x2:current.key==='P'?300:current.key==='C'?54:566,y2:current.key==='P'?24:220,class:'cpmr-pointer'}));
      svg.append(svgNode('circle',{cx:marker.x,cy:marker.y,r:8,class:'cpmr-active-marker',style:'--marker:'+current.color}));
      const labels=[['C',54,220],['P',300,24],['M',505,220],['R',566,220]];
      labels.forEach(([label,x,y])=>{
        svg.append(svgNode('circle',{cx:x,cy:y,r:label===current.key?9:5,class:'cpmr-address-dot'+(label===current.key?' is-active':'')}));
        svg.append(svgNode('text',{x,y:y-14,'text-anchor':'middle',class:'cpmr-address-label'+(label===current.key?' is-active':'')},label));
      });
      [['10',300,72],['100',300,150],['100',300,306],['10⁶',300,386]].forEach(([label,x,y])=>svg.append(svgNode('text',{x,y,'text-anchor':'middle',class:'cpmr-scale'},label)));
      roleButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.cpmrRole)===active)));
      host.dataset.cpmr=current.key.toLowerCase();
      cube.dataset.cpmrCube=current.key;
      host.querySelector('[data-cpmr-readout="order"]').textContent=String(active+1).padStart(2,'0')+' / 04';
      host.querySelector('[data-cpmr-readout="marker"]').textContent=current.key;
      host.querySelector('[data-cpmr-readout="position"]').textContent=current.position;
      host.querySelector('[data-cpmr-readout="scale"]').textContent=current.scale;
      host.querySelector('[data-cpmr-readout="face"]').textContent=current.face;
      host.querySelector('[data-cpmr-readout="cube"]').textContent=current.face;
    };
    roleButtons.forEach(button=>button.addEventListener('click',()=>{active=Number(button.dataset.cpmrRole);draw();}));
    host.querySelector('[data-cpmr-step="prev"]').addEventListener('click',()=>{active=mod(active-1,4);draw();});
    host.querySelector('[data-cpmr-step="next"]').addEventListener('click',()=>{active=mod(active+1,4);draw();});
    host.querySelector('[data-cpmr-step="zero"]').addEventListener('click',()=>{active=0;draw();});
    host.querySelectorAll('[data-cpmr-overlay]').forEach(button=>button.addEventListener('click',()=>{
      const key=button.dataset.cpmrOverlay;
      overlays[key]=!overlays[key];
      button.setAttribute('aria-pressed',String(overlays[key]));
      draw();
    }));
    draw();
  };
  return {roles,mod,state,spiralPoints,starOrder,createHost,mount};
});
