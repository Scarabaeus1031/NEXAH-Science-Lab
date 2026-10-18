(() => {
  'use strict';

  const canvas = document.getElementById('topologyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const modeInput = document.getElementById('topologyMode');
  const scaleInput = document.getElementById('topologyScale');
  const playButton = document.getElementById('topologyPlay');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = {bg:'#01070b',rest:'#173743',rest2:'#244b59',cyan:'#39d5ef',gold:'#ffc94d',pink:'#f35fa7',white:'#f5fbfd',violet:'#a987ff'};
  const modes = [
    {short:'Rund', title:'Runde Hülle', window:'Körperansicht', address:'Hülle / außen', status:'VIEW · keine Carrier-Mutation'},
    {short:'Naht', title:'16+1 Übergangsfliese', window:'lokale Inspektion', address:'Fliese 16 + Naht 17', status:'VIEW · Kopplung offen'},
    {short:'Raster', title:'Lokales Pixelraster', window:'16 × 16 Sichtfenster', address:'lokal 08 / 08', status:'VIEW · größerer Raum verborgen'}
  ];
  const scales = ['Körper','Hülle','Fliese','Zelle'];
  const el = id => document.getElementById(id);
  let mode = Number(modeInput.value);
  let scale = Number(scaleInput.value);
  let playing = false;
  let phase = 0;
  let last = performance.now();
  let raf = 0;

  function line(points, color, width = 2, close = false) {
    ctx.beginPath();
    points.forEach(([x,y], index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    if (close) ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function polygon(cx, cy, radius, sides, rotation, color, width = 3) {
    const points = Array.from({length:sides}, (_,i) => {
      const a = rotation + i * Math.PI * 2 / sides;
      return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
    });
    line(points, color, width, true);
    return points;
  }

  function pixel(x, y, size, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(size), Math.ceil(size));
    ctx.globalAlpha = 1;
  }

  function label(text, x, y, color = colors.white, align = 'left', size = 12) {
    ctx.fillStyle = color;
    ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  function drawShell() {
    const cx = 360, cy = 260;
    const zoom = [1,.86,.68,.5][scale];
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(1/zoom,1/zoom);
    ctx.translate(-cx,-cy);
    [188,148,108].forEach((radius,index) => {
      ctx.beginPath();
      ctx.arc(cx,cy,radius,0,Math.PI*2);
      ctx.strokeStyle = index === 0 ? colors.cyan : colors.rest;
      ctx.lineWidth = index === 0 ? 5 : 2;
      ctx.stroke();
    });
    const count = 16;
    for (let i=0;i<count;i++) {
      const a = i/count*Math.PI*2 + phase;
      const r = 188 + Math.sin(a*4-phase)*8;
      pixel(cx+Math.cos(a)*r-4,cy+Math.sin(a)*r-4,8,i===0?colors.white:(i%2?colors.cyan:colors.violet),.95);
    }
    const opposing = phase + Math.PI/2;
    for (let i=0;i<6;i++) {
      const a = i/6*Math.PI*2 - opposing;
      pixel(cx+Math.cos(a)*108-3,cy+Math.sin(a)*108-3,7,i===0?colors.gold:colors.pink,.9);
    }
    polygon(cx,cy,82,5,-Math.PI/2+phase*.12,colors.gold,3);
    ctx.restore();
    label('BODY / SHELL',28,38,colors.cyan);
    label('CONTINUOUS PHASE VIEW',28,57,colors.rest2);
  }

  function drawSeam() {
    const cx = 360, cy = 258;
    const zoom = [1,.9,.76,.62][scale];
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(1/zoom,1/zoom);
    ctx.translate(-cx,-cy);
    ctx.beginPath();ctx.arc(cx,cy,192,0,Math.PI*2);ctx.strokeStyle=colors.rest;ctx.lineWidth=2;ctx.stroke();
    polygon(cx,cy,150,6,-Math.PI/2,colors.cyan,5);
    polygon(cx,cy,105,5,-Math.PI/2+phase*.08,colors.gold,5);
    const seam = polygon(cx,cy,150,6,-Math.PI/2,colors.rest2,1);
    seam.forEach(([x,y],i) => {
      pixel(x-5,y-5,10,i===0?colors.white:colors.pink,.95);
      line([[cx,cy],[x,y]],i%2?colors.rest:colors.rest2,1);
    });
    const tile = 26;
    for(let i=0;i<16;i++) {
      const col=i%4,row=Math.floor(i/4);
      const x=cx-2*tile+col*tile+1,y=cy-2*tile+row*tile+1;
      pixel(x,y,tile-3,i===Math.floor((phase%(Math.PI*2))/(Math.PI*2)*16)?colors.cyan:colors.rest2,.9);
    }
    pixel(cx+58,cy-7,14,colors.gold);
    label('17',cx+82,cy+4,colors.gold);
    ctx.restore();
    label('16 ADDRESSES + 1 INSPECTION SEAM',28,38,colors.gold);
    label('COUPLED VIEW · NOT A NEW CARRIER',28,57,colors.rest2);
  }

  function drawGrid() {
    const cells = 16;
    const baseSize = [25,29,34,42][scale];
    const size = baseSize;
    const visible = Math.min(cells,Math.floor(500/size));
    const start = Math.floor((cells-visible)/2);
    const ox = Math.round((720-visible*size)/2);
    const oy = Math.round((520-visible*size)/2)+6;
    const active = Math.floor((phase%(Math.PI*2))/(Math.PI*2)*Math.max(1,visible*visible));
    for(let r=0;r<visible;r++) for(let c=0;c<visible;c++) {
      const globalR=r+start,globalC=c+start;
      const idx=r*visible+c;
      let color=(globalR+globalC)%2?colors.rest:colors.rest2;
      if(idx===active) color=colors.cyan;
      if(globalR===7&&globalC===7) color=colors.white;
      if((globalR===7||globalC===7)&&idx!==active&&color!==colors.white) color='#1b4650';
      pixel(ox+c*size+1,oy+r*size+1,size-2,color,.92);
    }
    const markerX=ox+(7-start)*size,markerY=oy+(7-start)*size;
    if(markerX>=ox&&markerY>=oy&&markerX<ox+visible*size) {
      ctx.strokeStyle=colors.pink;ctx.lineWidth=3;ctx.strokeRect(markerX-2,markerY-2,size+4,size+4);
    }
    label(`${visible} × ${visible} WINDOW / 16 × 16 LOCAL FIELD`,28,38,colors.cyan);
    label(`ADDRESS ${String(7).padStart(2,'0')} / ${String(7).padStart(2,'0')} · LOD ${scale+1}`,28,57,colors.rest2);
    label('LARGER ADDRESS SPACE NOT DRAWN',692,540,colors.gold,'right',10);
  }

  function draw() {
    ctx.fillStyle=colors.bg;ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let x=0;x<canvas.width;x+=8) for(let y=0;y<canvas.height;y+=8) {
      if(((x+y)/8)%7===0) pixel(x,y,1,'#0a202a',.55);
    }
    if(mode===0) drawShell();
    else if(mode===1) drawSeam();
    else drawGrid();
    label('BLUE BODY TOPOLOGY ATLAS · VIEW ONLY',28,538,colors.rest2);
  }

  function updateReadout() {
    const current=modes[mode];
    el('topologyModeLabel').textContent=current.title;
    el('topologyScaleLabel').textContent=`Maßstab ${String(scale+1).padStart(2,'0')} · ${scales[scale]}`;
    el('topologyModeValue').textContent=current.short;
    el('topologyScaleValue').textContent=scales[scale];
    el('topologyWindow').textContent=current.window;
    el('topologyAddress').textContent=mode===2&&scale===3?'Zelle 07 / 07':current.address;
    el('topologyStatus').textContent=current.status;
  }

  function setMode(value) { mode=Number(value); updateReadout(); draw(); }
  function setScale(value) { scale=Number(value); updateReadout(); draw(); }
  function stop() { playing=false;playButton.textContent='▶ Strömung starten';playButton.setAttribute('aria-pressed','false');cancelAnimationFrame(raf); }
  function tick(now) {
    if(!playing) return;
    const delta=Math.min(40,now-last);last=now;phase=(phase+delta*.0012)%(Math.PI*2);draw();raf=requestAnimationFrame(tick);
  }
  function toggle() {
    if(playing) return stop();
    playing=true;last=performance.now();playButton.textContent='Ⅱ Strömung halten';playButton.setAttribute('aria-pressed','true');raf=requestAnimationFrame(tick);
  }

  modeInput.addEventListener('input',event=>setMode(event.target.value));
  scaleInput.addEventListener('input',event=>setScale(event.target.value));
  playButton.addEventListener('click',toggle);
  updateReadout();draw();
  if(!reducedMotion) toggle();

  window.A0BlueBodyTopologyAtlas={setMode,setScale,toggle,stop,get state(){return{mode,scale,playing}}};
})();
