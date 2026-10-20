(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers,()=>typeof module==='object'&&module.exports?require('./a0-plate-mirror-reference.js'):root.A0PlateMirrorReference);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0BenchFoldGuide=api;
})(typeof globalThis==='undefined'?this:globalThis,function(M,getReference){
  'use strict';
  function drawing(phase){
    const f=M.mixerFold(phase),rad=Math.PI/180,cx=160,cy=105,r=64;
    let s='<svg viewBox="0 0 660 240" style="display:block;width:100%;height:auto" role="img" aria-label="Fold Guide, gleiche lokale Phase wie die Linsen"><title>Numbers Mixer Fold Guide · source-owned phase law</title>';
    s+='<text x="25" y="24" fill="#ffca55" font-size="14">FOLD GUIDE · SAME CLOCK</text><text x="25" y="45" fill="#bcd0d9" font-size="12">AXIS '+f.axis+' · '+f.angle+'° · CROWN '+String(f.crownTick).padStart(2,'0')+'/19</text>';
    s+='<ellipse cx="160" cy="105" rx="64" ry="27" fill="none" stroke="#d9bd7a"/>';
    for(let i=0;i<20;i++){const a=2*Math.PI*i/20,active=i===f.crownTick;s+='<line data-crown="'+i+'" x1="'+(cx+68*Math.cos(a))+'" y1="'+(cy+28*Math.sin(a))+'" x2="'+(cx+(active?80:74)*Math.cos(a))+'" y2="'+(cy+(active?33:31)*Math.sin(a))+'" stroke="'+(active?'#ffca55':'#507284')+'" stroke-width="'+(active?3:1)+'"/>';}
    for(let i=0;i<3;i++){const a=(-90+i*120)*rad,sq=Math.cos(f.angle*rad),lift=Math.sin(f.angle*rad),ex=cx+r*Math.cos(a),ey=cy+r*Math.sin(a)*sq*.58-lift*(i-1)*12,px=cx+r*.58*Math.cos(a+.46),py=cy+r*.58*Math.sin(a+.46)*sq*.58-lift*(i-1)*7;
      s+='<path data-guide-axis="'+i+'" d="M160 105L'+ex+' '+ey+'L'+px+' '+py+'Z" fill="'+['#54d7ef','#65e7a4','#f34c6e'][i]+'" fill-opacity=".2" stroke="'+['#54d7ef','#65e7a4','#f34c6e'][i]+'"/>';
    }
    s+='<circle cx="160" cy="105" r="5" fill="white"/><path d="M310 100H620" stroke="#507284"/>';
    M.MIXER_FOLD_STOPS.forEach((stop,i)=>{const x=310+i*77.5,active=f.stopIndex===i;s+='<circle cx="'+x+'" cy="100" r="'+(active?7:4)+'" stroke="#ffca55" fill="'+(active?'#ffca55':'#18303d')+'"/><text x="'+x+'" y="126" text-anchor="middle" fill="#ffca55">'+stop.angle+'°</text><text x="'+x+'" y="146" text-anchor="middle" fill="#bcd0d9" font-size="10">φ '+stop.phase+'°</text>';});
    s+='<path d="M'+(310+310*phase/360)+' 82V115" stroke="#e2b5ff" stroke-width="2"/>';
    const existing=s+'<text x="25" y="195" fill="#bcd0d9" font-size="12">'+(f.foldReturn?'VIEW CLOSED · nur Mixer-Ansichtsreturn':'VIEW FOLD · NOT SOURCE / PHYSICS')+'</text><text x="25" y="218" fill="#91aeba" font-size="11">20 Crown-Marken (0–19), Reset bei φ=360° · keine 28/29-Kopplung</text></svg>';
    const reference=getReference();return existing+(reference?reference.referenceDrawing(reference.planar(phase)):'');
  }
  return {drawing};
});
