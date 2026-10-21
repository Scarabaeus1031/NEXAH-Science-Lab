(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers,()=>typeof module==='object'&&module.exports?require('./a0-plate-mirror-reference.js'):root.A0PlateMirrorReference);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0BenchFoldGuide=api;
})(typeof globalThis==='undefined'?this:globalThis,function(M,getReference){
  'use strict';
  function comparison(phase){
    const base=M.mixerFold(phase),offset=7,side=140,height=side*Math.sqrt(3)/2;
    return{phase,base,offset,shiftedAngle:base.angle+offset,
      stops:M.MIXER_FOLD_STOPS.map(s=>({phase:s.phase,base:s.angle,shifted:s.angle+offset})),
      triangle:{kind:'EQUILATERAL_GOLD_COLOURED_NOT_GOLDEN_RATIO',points:[[130,45],[60,45+height],[200,45+height]],interiorDegrees:[60,60,60],centralSpacingDegrees:120},
      boundary:'Read-only +7 degree comparison on the existing phase cursor. No new fold station, source deformation, clock, 15-rule, Theta/Alpha/Tao/Dao assignment or Mobius pin connection.'};
  }
  function comparisonDrawing(phase){
    const c=comparison(phase),x=p=>100+p/360*400,point=(value,i,y)=>'<circle cx="'+x(c.stops[i].phase)+'" cy="'+y+'" r="4" fill="none" stroke="currentColor"/><text x="'+x(c.stops[i].phase)+'" y="'+(y+24)+'" text-anchor="middle" fill="currentColor">'+value+'°</text>';
    let rows='<svg viewBox="0 0 550 230" style="display:block;flex:1 1 340px;width:100%;max-width:100%;height:auto" role="img" aria-label="Grundfolge und plus sieben Grad, gleicher Phasencursor"><title>Grundfolge und +7°-Lesart — kein neuer Faltmechanismus</title><text x="15" y="24" fill="currentColor">φ '+phase+'° · Basis '+c.base.angle+'° · +7° '+c.shiftedAngle+'°</text><path d="M100 67H500M100 137H500" fill="none" stroke="#507284"/><text x="15" y="72" fill="#ffca55">Basis</text><text x="15" y="142" fill="#b783ff">+7°</text>';
    c.stops.forEach((s,i)=>{rows+='<g data-fold-stop="'+s.phase+'">'+point(s.base,i,67)+point(s.shifted,i,137)+'<text x="'+x(s.phase)+'" y="201" text-anchor="middle" fill="#bcd0d9" font-size="11">φ '+s.phase+'°</text></g>';});
    rows+='<path d="M'+x(phase)+' 45V173" stroke="#b783ff" stroke-width="2"/><text x="15" y="225" fill="#bcd0d9" font-size="12">Am Phasenende: Basis 0° / Versatz 7° · dieselbe Crown</text></svg>';
    const p=c.triangle.points;
    const tri='<svg viewBox="0 0 260 230" style="display:block;flex:1 1 240px;width:100%;max-width:320px;height:auto" role="img" aria-label="Goldfarbenes gleichseitiges Dreieck mit drei Innenwinkeln von sechzig Grad"><title>60° / 60° / 60° — keine 36° / 72° / 72°-Referenz</title><text x="130" y="24" text-anchor="middle" fill="#ffca55">Gleichseitige Referenz</text><polygon points="'+p.map(q=>q.join(',')).join(' ')+'" fill="none" stroke="#ffca55" stroke-width="2"/><text x="130" y="83" text-anchor="middle" fill="currentColor">60°</text><text x="83" y="154" fill="currentColor">60°</text><text x="154" y="154" fill="currentColor">60°</text><text x="130" y="198" text-anchor="middle" fill="#bcd0d9" font-size="12">Innenwinkel: 3 × 60° = 180°</text><text x="130" y="220" text-anchor="middle" fill="#bcd0d9" font-size="12">Zentralrichtungen: je 120°</text></svg>';
    return '<section class="fold-offset-comparison" aria-label="Faltfolge, Versatz und Dreiecksreferenz"><h4>Grundfolge / +7° · gleicher Cursor</h4><div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center">'+rows+tri+'</div><p>+7° ist eine zusätzliche Winkel-Lesart, kein neuer Faltmechanismus. Das Dreieck ist goldfarben und gleichseitig, nicht das goldene 36°–72°–72°-Dreieck. Die „15“ und Theta / Alpha / Tao / Dao bleiben ohne festgelegten Bezugsraum beziehungsweise Rollenvertrag offen.</p><p><a href="assets/game-of-worlds-play/numbers/index.html">1729 im Numbergame → XIX Wheels / Gegenlauf</a>: 1729 ist dort der benannte zweite Kanal; Gleich-/Gegenlauf und 3:2 / 2:3 sind deklarierte Presets. Keine Zuordnung zu einem Möbius-Pin und keine neue Kopplung durch diese Referenz.</p></section>';
  }
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
    const reference=getReference();return existing+(reference?reference.referenceDrawing(reference.planar(phase)):'')+comparisonDrawing(phase);
  }
  return {drawing,comparison,comparisonDrawing};
});
