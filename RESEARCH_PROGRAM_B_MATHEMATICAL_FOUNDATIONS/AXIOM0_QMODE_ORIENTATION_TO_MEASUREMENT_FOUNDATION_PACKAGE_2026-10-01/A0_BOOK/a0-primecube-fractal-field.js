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
    const size=308,pad=25,cell=23,lines=[],cells=[];
    for(let y=0;y<11;y++)for(let x=0;x<11;x++){
      const center=x===5&&y===5,cross=x===5||y===5,selected=!cross||center;
      const fill=center?'#f3a51c':selected?'#203a66':'#111c2c';
      cells.push(`<rect x="${pad+x*cell}" y="${pad+y*cell}" width="${cell-2}" height="${cell-2}" rx="2" fill="${fill}" stroke="#43536a"/>`);
    }
    lines.push(`<path d="M${pad},${pad} L${pad+11*cell},${pad+11*cell} M${pad+11*cell},${pad} L${pad},${pad+11*cell}" stroke="#f3a51c" stroke-dasharray="5 5" opacity=".8"/>`);
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="101-cell selection in an 11 by 11 grid">${cells.join('')}${lines.join('')}<text x="${pad+5.5*cell}" y="${pad+5.5*cell+5}" fill="white" font-size="15" text-anchor="middle">×</text><text x="154" y="298" fill="#8291a6" font-size="9" text-anchor="middle">100 QUADRANT CELLS + 1 CENTER · 20 CROSS-ARM CELLS EXCLUDED</text></svg>`;
  }
  function modRailSvg(){
    const cx=160,cy=155,r=105,nodes=[],labels=[],positions=[];
    const orbit=record.mod11Rotor.orbit;
    for(let n=0;n<11;n++){const a=-Math.PI/2+n*Math.PI*2/11,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;positions[n]=[x,y];const active=n!==0,initial=[2,4,8,5].includes(n);nodes.push(`<circle cx="${x}" cy="${y}" r="${initial?9:active?6:4}" fill="${n===2?'#35c8ff':n===4?'#23d39b':n===8?'#b755ef':n===5?'#ffae23':active?'#647895':'#26354a'}" stroke="${active?'#e7efff':'#526177'}" stroke-width="${initial?2:1}"/>`);labels.push(`<text x="${cx+Math.cos(a)*(r+22)}" y="${cy+Math.sin(a)*(r+22)+4}" fill="#aab7ca" font-size="11" text-anchor="middle">${n}</text>`)}
    const arrows=[];for(let i=0;i<orbit.length-1;i++){const [x1,y1]=positions[orbit[i]],[x2,y2]=positions[orbit[i+1]];arrows.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d9e5f7" stroke-width="1.25" opacity=".74" marker-end="url(#arrow)"/>`)}
    return `<svg viewBox="0 0 320 310" role="img" aria-label="Complete multiplication by two orbit modulo 11"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#d9e5f7"/></marker></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#334760" stroke-dasharray="2 4"/>${arrows.join('')}${nodes.join('')}${labels.join('')}<text x="160" y="148" fill="#dce8f7" font-size="12" text-anchor="middle">r ↦ 2r mod 11</text><text x="160" y="166" fill="#8ee7f7" font-size="10" text-anchor="middle">period 10 · all nonzero residues</text><text x="160" y="184" fill="#aeb7c8" font-size="9" text-anchor="middle">101₁₀ ≡ 2 · HANDLE</text></svg>`;
  }
  root.querySelector('[data-pc-root-mask]').innerHTML=rootMaskSvg();
  root.querySelector('[data-pc-mod11-rail]').innerHTML=modRailSvg();
  render();
})();
