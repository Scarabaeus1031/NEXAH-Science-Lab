(function(){
  'use strict';
  const root=document.querySelector('[data-pc-fractal-field]');
  const M=window.A0PrimecubeModel;
  if(!root||!M)return;
  const record=M.fractalDirectFieldRecord();
  const panelHost=root.querySelector('[data-pc-fractal-panels]');
  const input=root.querySelector('[data-pc-fractal-iterations-input]');
  const output=root.querySelector('[data-pc-fractal-iterations]');
  const button=root.querySelector('[data-pc-fractal-render]');
  let token=0;

  function panel(preset){
    const card=document.createElement('article');
    card.className='pc-fractal-card';
    card.innerHTML=`<header><div><h3>${preset.label}</h3><code>α=${preset.alpha.toFixed(2)} · β=${preset.beta.toFixed(2)} · P=${preset.p.toFixed(2)}</code></div><span>${preset.id==='memory-zoom'?'DETAIL ZOOM':'c-PARAMETER PLANE'}</span></header><canvas width="420" height="260" aria-label="${preset.label}"></canvas>`;
    panelHost.append(card);
    return {preset,canvas:card.querySelector('canvas')};
  }
  const panels=record.presets.map(panel);

  function colour(iter,max,zr,zi){
    if(iter>=max)return [1,3,8];
    const mag=Math.max(2,Math.hypot(zr,zi));
    const smooth=iter+1-Math.log2(Math.log2(mag));
    const t=Math.max(0,Math.min(1,smooth/max));
    const glow=Math.pow(1-t,.45);
    return [Math.round(28+225*glow),Math.round(9+105*glow+95*Math.sin(t*Math.PI)),Math.round(55+190*(1-t))];
  }
  function drawOne(item,max,runToken){
    const {canvas,preset}=item,ctx=canvas.getContext('2d',{alpha:false}),w=canvas.width,h=canvas.height;
    const image=ctx.createImageData(w,h),d=image.data,[xmin,xmax,ymin,ymax]=preset.viewport;
    let y=0;
    function rows(){
      if(runToken!==token)return;
      const stop=Math.min(h,y+14);
      for(;y<stop;y++)for(let x=0;x<w;x++){
        const cr=xmin+(x/(w-1))*(xmax-xmin),ci=ymax-(y/(h-1))*(ymax-ymin);
        let zr=0,zi=0,pr=0,pi=0,iter=0;
        for(;iter<max;iter++){
          const nr=zr*zr-zi*zi+cr+preset.alpha*zr+preset.beta*(zr-pr);
          const ni=2*zr*zi+ci+preset.alpha*zi+preset.beta*(zi-pi);
          pr=zr;pi=zi;zr=nr;zi=ni;
          if(zr*zr+zi*zi>64)break;
        }
        const [r,g,b]=colour(iter,max,zr,zi),i=(y*w+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;
      }
      if(y<h)requestAnimationFrame(rows);else ctx.putImageData(image,0,0);
    }
    rows();
  }
  function render(){token++;const runToken=token,max=Number(input.value);output.value=String(max);panels.forEach(item=>drawOne(item,max,runToken))}
  input.addEventListener('input',()=>{output.value=input.value});
  button.addEventListener('click',render);

  function rootMaskSvg(){
    const size=308,pad=25,cell=23,cells=[];
    const quadrants=['#40564d','#50625b','#4b5f56','#5a6961'];
    for(let y=0;y<11;y++)for(let x=0;x<11;x++){
      const center=x===5&&y===5,cross=x===5||y===5;
      const quadrant=(y>5?2:0)+(x>5?1:0);
      const included=center||!cross;
      const fill=center?'#f3a51c':included?quadrants[quadrant]:'#111c2c';
      const tile=`<rect data-pc-root-cell="${included?'included':'excluded'}"${center?' data-pc-root-center':''} x="${pad+x*cell}" y="${pad+y*cell}" width="${cell-2}" height="${cell-2}" rx="2" fill="${fill}" stroke="#43536a"/>`;
      cells.push(center?`<a class="pc-root-center-return" href="assets/game-of-worlds-play/ioi-world-cube/index.html?focus=euler-center#worldModel" tabindex="0" aria-label="Mittelzelle · Euler-Stein im 101-Cube zeigen">${tile}</a>`:tile);
    }
    const first=pad+(cell-2)/2,last=first+10*cell,mid=(first+last)/2;
    const corners=[[first,first],[last,last],[last,first],[first,last]];
    const anchors=corners.map(([x,y])=>`<circle class="pc-root-mask-anchor" cx="${x}" cy="${y}" r="4"/>`).join('');
    return `<svg viewBox="0 0 ${size} ${size}" role="group" aria-label="Root Mask mit vier 5-mal-5-Feldern, einem Zentrum und zwei Diagonalen">${cells.join('')}<path class="pc-root-mask-diagonals" pointer-events="none" d="M${first},${first} L${last},${last} M${last},${first} L${first},${last}"/>${anchors}<text x="${mid}" y="${mid+5}" fill="#17202a" font-size="15" text-anchor="middle" pointer-events="none">×</text><text x="154" y="298" fill="#a0aebf" font-size="9" text-anchor="middle">100 FELDER + 1 ZENTRUM · 20 FELDER IN DEN MITTELARMEN</text></svg>`;
  }
  function modRailSvg(){
    const cx=160,cy=155,r=105,nodes=[],labels=[],positions=[];
    const orbit=record.mod11Rotor.orbit;
    for(let n=0;n<11;n++){const a=-Math.PI/2+n*Math.PI*2/11,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;positions[n]=[x,y];const active=n!==0,initial=[2,4,8,5].includes(n);nodes.push(`<circle cx="${x}" cy="${y}" r="${initial?9:active?6:4}" fill="${n===2?'#35c8ff':n===4?'#23d39b':n===8?'#b755ef':n===5?'#ffae23':active?'#647895':'#26354a'}" stroke="${active?'#e7efff':'#526177'}" stroke-width="${initial?2:1}"/>`);labels.push(`<text x="${cx+Math.cos(a)*(r+22)}" y="${cy+Math.sin(a)*(r+22)+4}" fill="#aab7ca" font-size="11" text-anchor="middle">${n}</text>`)}
    const arrows=[];for(let i=0;i<orbit.length-1;i++){const [x1,y1]=positions[orbit[i]],[x2,y2]=positions[orbit[i+1]];arrows.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d9e5f7" stroke-width="1.25" opacity=".74" marker-end="url(#arrow)"/>`)}
    return `<svg viewBox="0 0 320 310" role="img" aria-label="Complete multiplication by two orbit modulo 11"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#d9e5f7"/></marker></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#334760" stroke-dasharray="2 4"/>${arrows.join('')}${nodes.join('')}${labels.join('')}<text x="160" y="148" fill="#dce8f7" font-size="12" text-anchor="middle">r ↦ 2r mod 11</text><text x="160" y="166" fill="#8ee7f7" font-size="10" text-anchor="middle">period 10 · all nonzero residues</text><text x="160" y="184" fill="#aeb7c8" font-size="9" text-anchor="middle">101₁₀ ≡ 2 · HANDLE</text></svg>`;
  }
  const rootMask=root.querySelector('[data-pc-root-mask]');
  const diagonalToggle=root.querySelector('[data-pc-root-mask-tension]');
  rootMask.innerHTML=rootMaskSvg();
  if(new URLSearchParams(window.location.search).get('focus')==='euler-center'){
    rootMask.classList.add('is-euler-center');
    root.querySelector('[data-pc-root-center-status]').hidden=false;
  }
  diagonalToggle.addEventListener('click',()=>{
    const tensioned=diagonalToggle.getAttribute('aria-pressed')!=='true';
    diagonalToggle.setAttribute('aria-pressed',String(tensioned));
    rootMask.classList.toggle('is-tensioned',tensioned);
  });
  root.querySelector('[data-pc-mod11-rail]').innerHTML=modRailSvg();
  render();
})();
