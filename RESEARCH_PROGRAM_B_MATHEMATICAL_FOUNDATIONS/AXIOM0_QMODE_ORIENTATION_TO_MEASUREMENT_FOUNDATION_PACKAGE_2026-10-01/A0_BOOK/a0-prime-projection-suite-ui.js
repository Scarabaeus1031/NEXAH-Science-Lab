(function(){
  'use strict';
  const root=document.querySelector('[data-prime-projection-suite]');
  const model=window.A0PrimeProjectionSuite,source=window.A0PrimeAddressCountershot;
  if(!root||!model||!source)return;
  const ns='http://www.w3.org/2000/svg';
  const clear=node=>{while(node.firstChild)node.removeChild(node.firstChild)};
  const el=(name,attrs={},text)=>{const node=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));if(text!=null)node.textContent=text;return node};
  const metric=(label,value,note='')=>`<div class="pps-metric"><small>${label}</small><strong>${value}</strong>${note?`<span>${note}</span>`:''}</div>`;
  const escape=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  root.querySelectorAll('[data-pps-tab]').forEach(button=>button.addEventListener('click',()=>{
    const active=button.dataset.ppsTab;
    root.querySelectorAll('[data-pps-tab]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    root.querySelectorAll('[data-pps-panel]').forEach(panel=>panel.hidden=panel.dataset.ppsPanel!==active);
  }));

  const stripSvg=root.querySelector('[data-pps-strip]'),stripMetrics=root.querySelector('[data-pps-strip-metrics]'),stripReadout=root.querySelector('[data-pps-strip-readout]'),widthSelect=root.querySelector('[data-pps-width]');
  function renderStrip(){
    const width=Number(widthSelect.value),audit=model.stripAudit(1000,width),primes=source.primesUpTo(1000),rows=Math.ceil(1000/width),pad=42,W=1000,H=470,cellW=(W-pad*2)/width,cellH=(H-pad*2)/rows;
    clear(stripSvg);
    const zoneEnds=[Math.floor(rows/3),Math.floor(2*rows/3),rows];let start=0;
    zoneEnds.forEach((end,i)=>{stripSvg.appendChild(el('rect',{x:pad,y:pad+start*cellH,width:W-pad*2,height:(end-start)*cellH,class:`pps-svg-zone-${i+1}`,opacity:.18}));start=end});
    for(let r=0;r<=rows;r++)stripSvg.appendChild(el('line',{x1:pad,y1:pad+r*cellH,x2:W-pad,y2:pad+r*cellH,class:'pps-svg-grid'}));
    for(let c=0;c<=width;c++)stripSvg.appendChild(el('line',{x1:pad+c*cellW,y1:pad,x2:pad+c*cellW,y2:H-pad,class:'pps-svg-grid'}));
    primes.forEach(p=>{const a=model.snakeAddress(p,width),cx=pad+(a.col+.5)*cellW,cy=pad+(a.row+.5)*cellH,r=Math.max(1.8,Math.min(5.5,cellW*.23,cellH*.32));const dot=el('circle',{cx,cy,r,class:'pps-svg-prime'});dot.appendChild(el('title',{},`${p} · row ${a.row+1} · col ${a.col+1}`));stripSvg.appendChild(dot)});
    audit.zones.forEach((z,i)=>stripSvg.appendChild(el('text',{x:W-5,y:pad+(i===0?zoneEnds[0]/2:i===1?(zoneEnds[0]+zoneEnds[1])/2:(zoneEnds[1]+rows)/2)*cellH,class:'pps-svg-label','text-anchor':'end'},`Z${z.id} · ${z.orientation}°`)));
    stripMetrics.innerHTML=metric('Primes ≤ 1000',audit.primeCount,'exact membership')+metric('Density',(audit.density*100).toFixed(1)+'%','168 / 1000')+metric('Rows',rows,`${width} cells / strip`)+metric('Orientation residual',audit.orientationResidual+'°','declared view transform');
    stripReadout.textContent=`100er-Fenster: ${audit.counts.join(' · ')}. Zonen: ${audit.zones.map(z=>`Z${z.id} ${z.range[0]}–${z.range[1]} / ${z.primeCount} primes / mean projected jump ${z.meanJump.toFixed(2)}`).join(' | ')}. Der Sprungwert ändert sich mit der Streifenbreite.`;
  }
  widthSelect.addEventListener('change',renderStrip);renderStrip();

  const polar=root.querySelector('[data-pps-polar]'),heat=root.querySelector('[data-pps-heat]'),zoneMetrics=root.querySelector('[data-pps-zone-metrics]'),zoneReadout=root.querySelector('[data-pps-zone-readout]'),addressSelect=root.querySelector('[data-pps-address]');
  function renderZones(){
    const audit=model.zoneAudit(addressSelect.value),primes=source.primesUpTo(1000),cx=310,cy=310,radii=[78,158,238],zoneOf=p=>p<=325?0:p<=650?1:2,address=p=>audit.mode==='cell'?model.mod(p-1,11):model.mod(p,11);
    clear(polar);clear(heat);
    [0,1,2].forEach(i=>polar.appendChild(el('circle',{cx,cy,r:radii[i],class:'pps-svg-line'})));
    for(let r=0;r<11;r++){const a=-Math.PI/2+r*2*Math.PI/11;polar.appendChild(el('line',{x1:cx,y1:cy,x2:cx+Math.cos(a)*255,y2:cy+Math.sin(a)*255,class:'pps-svg-grid'}));polar.appendChild(el('text',{x:cx+Math.cos(a)*274,y:cy+Math.sin(a)*274+4,class:'pps-svg-text'},r))}
    primes.forEach(p=>{const z=zoneOf(p),a=-Math.PI/2+address(p)*2*Math.PI/11,jitter=((p%23)/22-.5)*52,rr=radii[z]+jitter,c=el('circle',{cx:cx+Math.cos(a)*rr,cy:cy+Math.sin(a)*rr,r:2.4,class:'pps-svg-prime',opacity:.78});c.appendChild(el('title',{},`${p} · Z${z+1} · address ${address(p)}`));polar.appendChild(c)});
    polar.appendChild(el('circle',{cx,cy,r:33,class:'pps-svg-center'}));polar.appendChild(el('text',{x:cx,y:cy-3,class:'pps-svg-text'},audit.mode==='cell'?'p−1':'p'));polar.appendChild(el('text',{x:cx,y:cy+15,class:'pps-svg-small'},'mod 11'));
    const hp=34,top=34,left=56,cw=31,ch=58,max=Math.max(...audit.table.flat());
    audit.table.forEach((row,i)=>row.forEach((value,r)=>{const opacity=.12+.8*value/max;heat.appendChild(el('rect',{x:left+r*cw,y:top+i*ch,width:cw-3,height:ch-3,class:`pps-svg-zone-${i+1}`,opacity}));heat.appendChild(el('text',{x:left+r*cw+(cw-3)/2,y:top+i*ch+34,class:'pps-svg-text'},value))}));
    audit.table.forEach((_,i)=>heat.appendChild(el('text',{x:16,y:top+i*ch+34,class:'pps-svg-label'},`Z${i+1}`)));for(let r=0;r<11;r++)heat.appendChild(el('text',{x:left+r*cw+(cw-3)/2,y:top+3*ch+20,class:'pps-svg-small'},r));heat.appendChild(el('text',{x:225,y:245,class:'pps-svg-label','text-anchor':'middle'},audit.mode==='cell'?'cell = (p−1) mod 11':'r = p mod 11'));
    zoneMetrics.innerHTML=metric('χ² descriptive',audit.chiSquare.toFixed(4),'finite table')+metric('Degrees of freedom',audit.degreesOfFreedom,'3 × 10 admissible')+metric('Primes',primes.length,'≤ 1000')+metric('Result','NO COUPLING','visible audit only');
    zoneReadout.textContent=`Exact table, mode ${audit.mode}. χ²=${audit.chiSquare.toFixed(6)}, df=${audit.degreesOfFreedom}. ${audit.boundary}`;
  }
  addressSelect.addEventListener('change',renderZones);renderZones();

  const orbit=model.crtOrbit(),wheel=root.querySelector('[data-pps-wheel]'),detail=root.querySelector('[data-pps-crt-detail]'),crtMetrics=root.querySelector('[data-pps-crt-metrics]'),grid=root.querySelector('[data-pps-number-grid]'),step=root.querySelector('[data-pps-step]'),kOut=root.querySelector('[data-pps-k]');
  let selected=20;
  orbit.rows.forEach(row=>{const b=document.createElement('button');b.type='button';b.textContent=row.n;b.dataset.k=row.k;b.dataset.prime=row.prime;b.setAttribute('aria-label',`Schritt ${row.k}, Zahl ${row.n}${row.prime?', Primzahl':''}`);b.addEventListener('click',()=>{selected=row.k;step.value=row.k;renderOrbit()});grid.appendChild(b)});
  function renderOrbit(){
    const row=orbit.rows[selected],cx=310,cy=310,R=235;clear(wheel);
    wheel.appendChild(el('circle',{cx,cy,r:R,class:'pps-svg-line'}));
    orbit.rows.forEach((item,i)=>{const a=-Math.PI/2+i*2*Math.PI/21,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;wheel.appendChild(el('line',{x1:cx,y1:cy,x2:x,y2:y,class:'pps-svg-grid',opacity:.4}));const cls=i===selected?'pps-svg-selected':item.cousinUp?'pps-svg-cousin':item.prime?'pps-svg-prime':'pps-svg-composite',dot=el('circle',{cx:x,cy:y,r:i===selected?10:item.prime?7:5,class:cls});dot.appendChild(el('title',{},`${item.n} · [${item.address.join(', ')}]${item.prime?' · prime':''}`));wheel.appendChild(dot);if(item.prime||i===selected)wheel.appendChild(el('text',{x,y:y-15,class:'pps-svg-small'},item.n))});
    wheel.appendChild(el('circle',{cx,cy,r:68,class:'pps-svg-center'}));wheel.appendChild(el('text',{x:cx,y:cy-13,class:'pps-svg-text'},`k=${row.k}`));wheel.appendChild(el('text',{x:cx,y:cy+9,class:'pps-svg-text'},`[${row.address.join('·')}]`));wheel.appendChild(el('text',{x:cx,y:cy+30,class:'pps-svg-small'},row.n));
    kOut.value=row.k;kOut.textContent=row.k;
    root.querySelectorAll('[data-pps-number-grid] button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.k)===selected)));
    const state=row.prime?(row.cousinUp||row.cousinDown?'PRIME · COUSIN EVENT':'PRIME CARRIER'):'COMPOSITE CARRIER';
    detail.innerHTML=`<div class="pps-kicker">CRT record · step ${row.k}/20</div><h3>${row.n}</h3><div class="pps-state">${state}</div><dl><dt>Address</dt><dd>[${row.address.join(', ')}] in ℤ₃×ℤ₅×ℤ₇</dd><dt>Factors</dt><dd>${escape(row.factors.join(' × '))}</dd><dt>Prime rank</dt><dd>${row.primeRank==null?'—':'#'+row.primeRank}</dd><dt>Cousin −4</dt><dd>${row.cousinDown?'yes':'no'}</dd><dt>Cousin +4</dt><dd>${row.cousinUp?'yes':'no'}</dd><dt>Return</dt><dd>k=21 → [1,2,2], same address as k=0</dd></dl>`;
  }
  crtMetrics.innerHTML=metric('Address period',orbit.period,'exact CRT return')+metric('Prime carriers',orbit.rows.filter(r=>r.prime).length,'within 21 states')+metric('Cousin +4 events',orbit.rows.filter(r=>r.cousinUp).length,'directed audit')+metric('Step vector','[1,0,2]','mod 3 · 5 · 7');
  step.addEventListener('input',()=>{selected=Number(step.value);renderOrbit()});renderOrbit();
})();
