(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0PowerPitchPolygonMod9=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const POWER_VALUES=Object.freeze([32,64,128,256,512,1024,2048]);
  const POLYGON_FREQUENCIES=Object.freeze([111,174,285,396,417,528,639,741,852,963,1024,1176,1236,1368,1440,1836]);
  const POLYGON_MIN=3, NULL_SHIFT=5;
  const MOD9_POWER_CYCLE=Object.freeze([1,2,4,8,7,5]);
  const mod=(x,n)=>((x%n)+n)%n;
  const digitalRoot=n=>{const x=Math.abs(Math.trunc(Number(n)));return x===0?0:1+((x-1)%9);};
  const equalTemperament=(f0,semitones)=>Number(f0)*2**(Number(semitones)/12);
  const cents=(f,reference)=>1200*Math.log2(Number(f)/Number(reference));
  const polygonAngle=n=>360/Number(n);
  const polygonSpectrum=n=>Array.from({length:Number(n)},(_,k)=>2-2*Math.cos(2*Math.PI*k/Number(n)));
  const atlasFrequency=n=>POLYGON_FREQUENCIES[Number(n)-POLYGON_MIN];
  const nullFrequency=n=>POLYGON_FREQUENCIES[mod(Number(n)-POLYGON_MIN+NULL_SHIFT,POLYGON_FREQUENCIES.length)];
  function pitchReference(){
    const displayBase=32,standardC1=32.70319566257483;
    const displayFiveOctaves=equalTemperament(displayBase,60);
    const standardFiveOctaves=equalTemperament(standardC1,60);
    return Object.freeze({display_base:displayBase,display_five_octaves:displayFiveOctaves,standard_c1:standardC1,standard_five_octaves:standardFiveOctaves,difference_hz:standardFiveOctaves-displayFiveOctaves,difference_cents:cents(displayFiveOctaves,standardFiveOctaves)});
  }
  function receipt(mode='POWER'){
    const p=pitchReference(),n=13,spectrum=polygonSpectrum(n);
    return Object.freeze({
      mode:String(mode).toUpperCase(),powers:POWER_VALUES,pitch:p,polygon:Object.freeze({n,central_angle:polygonAngle(n),symmetry:'D13',spectrum,atlas_frequency:atlasFrequency(n),sample_quotient:Math.floor(1024/n),sample_remainder:1024%n}),
      mod9:Object.freeze({power_cycle:MOD9_POWER_CYCLE,secondary_cycle:Object.freeze([3,6]),fixed:Object.freeze([0,9]),root_1024:digitalRoot(1024),root_2048:digitalRoot(2048)}),
      null:Object.freeze({shift:NULL_SHIFT,source_13:atlasFrequency(13),permuted_13:nullFrequency(13),status:'DETERMINISTIC_PERMUTATION_EXAMPLE_NO_P_VALUE'}),
      type_boundary:'POWER_NOT_PITCH_NOT_POLYGON_NOT_MOD9',graph_delta:Object.freeze({entities:0,relations:0,aliases:0})
    });
  }
  function verify(){
    const r=receipt(),s=r.polygon.spectrum;
    const checks={
      power_ladder:POWER_VALUES.every((v,i)=>v===2**(i+5)),square_bridge:32**2===1024,power_1024:2**10===1024,power_2048:2**11===2048,
      display_octaves_close:r.pitch.display_five_octaves===1024,standard_c1_five_octaves_close:Math.abs(r.pitch.standard_five_octaves-1046.5022612023945)<1e-9,pitch_assignment_not_identity:Math.abs(r.pitch.difference_hz)>22,
      polygon_angle:Math.abs(r.polygon.central_angle-360/13)<1e-12,spectrum_count:s.length===13,spectrum_zero:Math.abs(s[0])<1e-12,spectrum_symmetry:s.every((v,k)=>Math.abs(v-s[mod(13-k,13)])<1e-12),
      sample_division:r.polygon.sample_quotient===78&&r.polygon.sample_remainder===10,atlas_assignment:r.polygon.atlas_frequency===1024,
      mod9_power_cycle:MOD9_POWER_CYCLE.every((v,i)=>digitalRoot(2**i)===v),mod9_1024:r.mod9.root_1024===7,mod9_2048:r.mod9.root_2048===5,
      null_changes_assignment:r.null.permuted_13===1836&&r.null.permuted_13!==r.null.source_13,graph_delta_zero:Object.values(r.graph_delta).every(v=>v===0)
    };
    return Object.freeze({ok:Object.values(checks).every(Boolean),checks});
  }
  const esc=s=>String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function circlePoint(cx,cy,r,i,n,offset=-Math.PI/2){const a=offset+2*Math.PI*i/n;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];}
  function renderPower(){
    const max=Math.log2(2048),left=110,right=810,base=420;
    const lines=POWER_VALUES.map((v,i)=>{const x=left+(right-left)*i/(POWER_VALUES.length-1),h=45+250*(Math.log2(v)-5)/(max-5);return `<line x1="${x}" y1="${base}" x2="${x}" y2="${base-h}" class="ppm-power-bar"/><circle cx="${x}" cy="${base-h}" r="8" class="ppm-power-node"/><text x="${x}" y="${base+28}" class="ppm-axis" text-anchor="middle">2^${i+5}</text><text x="${x}" y="${base-h-15}" class="ppm-value" text-anchor="middle">${v}</text>`;}).join('');
    return `<text x="50" y="55" class="ppm-kicker">POWER LENS · EXACT DYADIC LADDER</text><text x="50" y="92" class="ppm-title">32² = 1024 = 2¹⁰</text>${lines}<path d="M110 108 Q460 24 693 108" class="ppm-guide"/><text x="430" y="124" class="ppm-note" text-anchor="middle">five doublings: 32 → 1024</text>`;
  }
  function renderPitch(){
    const p=pitchReference(),left=90,right=820,y=270;
    const marks=Array.from({length:6},(_,i)=>{const f=32*2**i,x=left+(right-left)*i/5;return `<line x1="${x}" y1="${y-65}" x2="${x}" y2="${y+65}" class="ppm-pitch-tick"/><circle cx="${x}" cy="${y}" r="9" class="ppm-pitch-node"/><text x="${x}" y="${y+92}" class="ppm-value" text-anchor="middle">${f}</text><text x="${x}" y="${y+114}" class="ppm-axis" text-anchor="middle">+${i*12} st</text>`;}).join('');
    const sx=right+Math.min(50,Math.abs(p.difference_cents));
    return `<text x="50" y="55" class="ppm-kicker">PITCH LENS · LOG₂ FREQUENCY RATIO</text><text x="50" y="92" class="ppm-title">fₙ = f₀ · 2^(n/12)</text><line x1="${left}" y1="${y}" x2="${right}" y2="${y}" class="ppm-pitch-rail"/>${marks}<circle cx="${sx}" cy="${y-52}" r="7" class="ppm-standard-node"/><text x="${sx}" y="${y-78}" class="ppm-note" text-anchor="middle">C1@A440 × 2⁵ = ${p.standard_five_octaves.toFixed(3)} Hz</text><text x="450" y="450" class="ppm-warning" text-anchor="middle">1024 Hz is exact only for the declared 32 Hz reference · offset ${p.difference_cents.toFixed(2)} cents from standard C6</text>`;
  }
  function renderPolygon(nullMode=false){
    const n=13,cx=330,cy=270,rad=168,pts=Array.from({length:n},(_,i)=>circlePoint(cx,cy,rad,i,n)),poly=pts.map(p=>p.map(v=>v.toFixed(2)).join(',')).join(' '),freq=nullMode?nullFrequency(n):atlasFrequency(n),spec=polygonSpectrum(n),max=Math.max(...spec);
    const nodes=pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" class="ppm-poly-node"/><text x="${p[0]}" y="${p[1]-14}" class="ppm-axis" text-anchor="middle">${i}</text>`).join('');
    const bars=spec.map((v,i)=>{const x=570+i*20,h=130*v/max;return `<rect x="${x}" y="${390-h}" width="12" height="${h}" class="ppm-spectrum-bar"/><text x="${x+6}" y="410" class="ppm-mini" text-anchor="middle">${i}</text>`;}).join('');
    const head=nullMode?'NULL LENS · DETERMINISTIC ROTATION +5':'N-GON LENS · INTRINSIC GEOMETRY VS ATLAS LABEL';
    return `<text x="50" y="55" class="ppm-kicker">${head}</text><text x="50" y="92" class="ppm-title">13-gon · D₁₃ · 360/13 = ${(360/13).toFixed(4)}°</text><polygon points="${poly}" class="ppm-polygon"/>${nodes}<text x="330" y="260" class="ppm-big" text-anchor="middle">13</text><text x="330" y="290" class="ppm-note" text-anchor="middle">atlas label: ${freq} Hz</text><text x="630" y="205" class="ppm-value">cycle spectrum λₖ</text>${bars}<text x="630" y="455" class="ppm-warning" text-anchor="middle">1024 = 13·78 + 10 · frequency is not derived from D₁₃</text>${nullMode?'<text x="450" y="485" class="ppm-null" text-anchor="middle">SOURCE 13→1024 · NULL 13→1836 · NO P-VALUE</text>':''}`;
  }
  function renderMod9(){
    const cx=450,cy=270,rad=170,pts=Array.from({length:9},(_,i)=>circlePoint(cx,cy,rad,i,9));
    const nodes=pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="17" class="ppm-mod-node ${i===6||i===4?'is-hit':''}"/><text x="${p[0]}" y="${p[1]+5}" class="ppm-mod-label" text-anchor="middle">${i+1}</text>`).join('');
    const path=MOD9_POWER_CYCLE.map(v=>pts[v-1].map(x=>x.toFixed(2)).join(',')).join(' ');
    const secondary=[3,6,3].map(v=>pts[v-1].map(x=>x.toFixed(2)).join(',')).join(' ');
    return `<text x="50" y="55" class="ppm-kicker">MOD 9 LENS · RESIDUE / DIGITAL-ROOT VIEW</text><text x="50" y="92" class="ppm-title">1 → 2 → 4 → 8 → 7 → 5 → 1</text><polyline points="${path}" class="ppm-mod-path"/><polyline points="${secondary}" class="ppm-secondary-path"/>${nodes}<text x="450" y="265" class="ppm-big" text-anchor="middle">6</text><text x="450" y="292" class="ppm-note" text-anchor="middle">period of 2^k mod 9</text><text x="450" y="482" class="ppm-warning" text-anchor="middle">dr(1024)=7 · dr(2048)=5 · 3↔6 and 9/0 remain separate</text>`;
  }
  function renderSvg(mode='POWER'){
    const m=String(mode).toUpperCase(),body=m==='PITCH'?renderPitch():m==='N-GON'?renderPolygon(false):m==='MOD 9'?renderMod9():m==='NULL'?renderPolygon(true):renderPower();
    return `<svg viewBox="0 0 900 520" role="img" aria-label="Power, pitch, polygon and modulo nine typed comparator"><rect x="20" y="20" width="860" height="480" rx="22" class="ppm-frame"/>${body}</svg>`;
  }
  function mount(doc){
    const host=doc&&doc.getElementById('power-pitch-polygon-mod9');if(!host)return null;
    const svg=doc.getElementById('ppmSvg'),status=doc.getElementById('ppmStatus'),atlas=doc.getElementById('ppmAtlas'),intrinsic=doc.getElementById('ppmIntrinsic'),nullOut=doc.getElementById('ppmNull');let mode='POWER';
    function render(){svg.innerHTML=renderSvg(mode).replace(/^<svg[^>]*>|<\/svg>$/g,'');status.textContent=mode==='NULL'?'NULL ROTATION · NO P-VALUE':`${mode} LENS · TYPED`;atlas.textContent=mode==='NULL'?'13 → 1836 Hz':'13 → 1024 Hz';intrinsic.textContent='D₁₃ · 360/13 · λₖ';nullOut.textContent='rotate +5 · 13→1836';doc.querySelectorAll('[data-ppm-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ppmMode===mode)));}
    doc.querySelectorAll('[data-ppm-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.ppmMode;render();}));render();return Object.freeze({render,get state(){return receipt(mode);}});
  }
  return Object.freeze({POWER_VALUES,POLYGON_FREQUENCIES,MOD9_POWER_CYCLE,NULL_SHIFT,mod,digitalRoot,equalTemperament,cents,polygonAngle,polygonSpectrum,atlasFrequency,nullFrequency,pitchReference,receipt,verify,renderSvg,mount});
});
