(function(root,factory){const api=factory(()=>typeof module==='object'&&module.exports?require('./a0-one-flow.js'):root.A0OneFlowModel);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0PlateMirrorReference=api;})(typeof globalThis==='undefined'?this:globalThis,function(flow){
  'use strict';
  function planar(phase=0){
    if(!Number.isFinite(phase)||phase<0||phase>360)throw Error('phase 0..360');
    const a=phase*Math.PI/180,u=Math.SQRT1_2,p=[Math.cos(a),Math.sin(a)],mirror=[p[0],-p[1]];
    return {phase,origin:[0,0],nodes:[[u,u],[u,-u]],point:p,mirror,referenceAngle:45,nodeAngle:90,
      lines:['y=x','y=-x'],mirrorAxis:'horizontal y=0',mirrorRule:'H(x,y)=(x,-y)',diagonalMirrorRule:'S45(x,y)=(y,x)',
      boundary:'Auxiliary unit-circle reference nodes; not recovered historical node addresses. H and S45 are distinct reflections. Reference does not alter mixer fold stops.'};
  }
  function snapshot(phase=0){
    const p=planar(phase),O=flow();if(!O)throw Error('One Flow source unavailable');
    return {...p,plates:{source:'a0-one-flow.js',equation:'plate(sign,r,a)=[r cos a,r sin a,sign(0.18+0.55r²)]',
      curves:O.curves('plates'),nodes:[O.plate(1,1,phase*Math.PI/180),O.plate(-1,1,phase*Math.PI/180)],
      mirrorRule:'z -> -z; distinct from planar y -> -y',projection:'existing One Flow project; perspective display, not an angle metric'},wholeMachineReturn:false};
  }
  function referenceDrawing(p,options={}){
    const show=options.reference!==false,mirror=options.mirror!==false,at=([x,y])=>[155+95*x,145-95*y],pts=points=>points.map(q=>at(q).join(',')).join(' '),line=(points,color,extra='')=>'<polyline points="'+pts(points)+'" fill="none" stroke="'+color+'" '+extra+'/>';
    let s='<svg viewBox="0 0 660 310" style="display:block;width:100%;height:auto" role="img" aria-label="Feste 45-Grad-Referenz, zwei Nodes, horizontale Spiegelung und L-Diagonalstrebe"><title>45° reference · y=x / y=-x · not a fold stop</title><circle cx="155" cy="145" r="95" fill="none" stroke="#efbd55"/><path d="M35 145H275M155 25V265" stroke="#527281"/>';
    if(show){
      s+=line([[-1,-1],[1,1]],'#f06483','data-ref="plus45"');
      if(mirror)s+=line([[-1,1],[1,-1]],'#f06483','stroke-dasharray="5 3" data-ref="minus45"');
      p.nodes.slice(0,mirror?2:1).forEach((n,i)=>{const q=at(n);s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="6" fill="'+(i?'#b78aef':'#efbd55')+'" data-ref-node="'+i+'"/><text x="'+(q[0]+9)+'" y="'+(q[1]+(i?17:-7))+'" fill="#e7f4fa" font-size="12">N'+(i+1)+' · '+(i?'−45°':'+45°')+'</text>';});
      if(mirror)s+=line([[.16,.16],[.32,0],[.16,-.16]],'#fff','data-ref="right-angle"');
    }
    s+=line([[0,0],p.point],'#54d7ef','stroke-width="2"');if(mirror)s+=line([[0,0],p.mirror],'#b78aef','stroke-width="2" stroke-dasharray="4 3"');
    for(const [q,color] of [[p.point,'#54d7ef'],...(mirror?[[p.mirror,'#b78aef']]:[])]){const v=at(q);s+='<circle cx="'+v[0]+'" cy="'+v[1]+'" r="4" fill="'+color+'"/>';}
    return s+'<circle cx="155" cy="145" r="4" fill="#fff"/><text x="20" y="292" fill="#bcd0d9" font-size="12">Gleicher Achsenmaßstab · feste Referenz / bewegte Phase '+p.phase+'°</text><text x="330" y="35" fill="#efbd55">45° · REFERENZ, KEINE NEUE FALTSTATION</text><text x="330" y="66" fill="#e6f3fa">y = x → H → y = −x</text><text x="330" y="91" fill="#e6f3fa">'+(mirror?'N1 · N2 am Einheitskreis: 90°':'Spiegelansicht ausgeschaltet')+'</text><path d="M350 240H470V120M350 240L470 120" fill="none" stroke="#efbd55" stroke-width="2"/><path d="M455 240V225H470" fill="none" stroke="#fff"/><text x="490" y="145" fill="#e6f3fa">L · 90°</text><text x="490" y="176" fill="#e6f3fa">Diagonale · 45°</text><text x="330" y="276" fill="#bcd0d9" font-size="12">Bildstrebe, kein mechanischer Verstärkungsnachweis</text></svg>';
  }
  function plateDrawing(r,mirror=true){
    const O=flow(),at=p=>{const q=O.project(p,0);return[270+125*q[0],170+125*q[1]];},path=points=>points.map((p,i)=>(i?'L':'M')+at(p).join(',')).join(' ');
    let s='<svg viewBox="0 0 560 360" style="display:block;width:100%;height:auto" role="img" aria-label="Originale One-Flow-Teller, oberer und unterer Node"><title>Native One Flow plate geometry · read-only</title><text x="15" y="24" fill="#efbd55">TELLER · ORIGINALE ONE-FLOW-GEOMETRIE</text>';
    for(const c of r.plates.curves){if(!mirror&&c.index===2)continue;s+='<path d="'+path(c.points)+'" fill="none" stroke="'+['#efbd55','#65dfa8','#b78aef'][c.index]+'" opacity=".45"/>';}
    const nodes=r.plates.nodes.slice(0,mirror?2:1);if(mirror)s+='<path d="'+path(nodes)+'" stroke="#e2f2fa" stroke-dasharray="4 4"/>';
    nodes.forEach((p,i)=>{const q=at(p);s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="6" fill="'+(i?'#b78aef':'#54d7ef')+'"/>';});
    return s+'<circle cx="270" cy="170" r="4" fill="#fff"/><text x="15" y="330" fill="#bcd0d9" font-size="12">Teller-Spiegel: z ↦ −z · perspektivische Projektion</text><text x="15" y="350" fill="#bcd0d9" font-size="12">Die 90°-Messung gilt im ebenen Referenzbild, nicht in diesem Bild.</text></svg>';
  }
  return {planar,snapshot,referenceDrawing,plateDrawing};
});
