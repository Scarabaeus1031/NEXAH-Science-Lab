(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-aperture-stack-calibration.js'):root.A0ApertureStackCalibration);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0RotatingCylinder=api;
})(typeof globalThis==='undefined'?this:globalThis,function(Stack){
  'use strict';
  const TAU=2*Math.PI,colors=['#f15d70','#f1f7ff','#54baff'];
  const mod1=x=>((x%1)+1)%1;
  function snapshot(phase,{direction=1,copies=true}={}){
    if(!Number.isFinite(phase)||phase<0||phase>360||![1,-1].includes(direction)||typeof copies!=='boolean')throw Error('invalid cylinder view');
    const theta=direction*phase*Math.PI/180,pitch=1,radius=.32;
    const point=(z,offset)=>{const a=TAU*z/pitch+offset+theta;return[radius*Math.cos(a),radius*Math.sin(a),z];};
    const plates=Stack.stackFixture('source').plates.map((p,i)=>({...p,z:.4-i*.16,group:i<3?'UPPER_3':'LOWER_3'}));
    const bands=colors.map((color,band)=>{
      const offset=TAU*band/3,points=Array.from({length:121},(_,i)=>point(-.5+i/120,offset));
      const frontCrossings=Array.from({length:7},(_,i)=>i-3).map(k=>pitch*(k-band/3-direction*phase/360)).filter(z=>z>=-.5-1e-12&&z<=.5+1e-12);
      return {band,color,offset,points,frontCrossings,plateContacts:plates.map(p=>point(p.z,offset))};
    });
    return {schema:'a0.rotating-cylinder-view/1',phase,direction,copies,pitch,radius,theta,
      axialTranslation:0,plates,bands,materialProbe:[radius*Math.cos(theta),radius*Math.sin(theta),.15],
      seam:{left:0,right:1,map:'(0,z) ~ (1,z)',twist:0,copies:copies?2:1},
      apparentAxialShift:-pitch*direction*phase/360,
      boundary:'Declared barber-pole view: fixed plates, pure rigid rotation, no axial material transport; apparent crossings are not material trajectories. Pitch=1 and evenly spaced plate heights are display choices. Source nominal angles are metadata, not helix pitch or physical calibration.'};
  }
  function verify(record){try{return {status:JSON.stringify(snapshot(record.phase,{direction:record.direction,copies:record.copies}))===JSON.stringify(record)?'PASS':'INVALID'};}catch{return {status:'INVALID'};}}
  const f=n=>Number(n).toFixed(2),screen=([x,y,z])=>[225+x*300,250-z*340-y*70];
  const path=points=>points.map((p,i)=>{const[x,y]=screen(p);return (i?'L':'M')+f(x)+' '+f(y);}).join(' ');
  function drawing(r){
    if(verify(r).status!=='PASS')throw Error('invalid cylinder record');
    let s='<svg viewBox="0 0 1000 540" role="img" aria-label="Rotierender Zylinder mit sechs festen Tellern und periodischer Abwicklung"><title>Rotation ohne axialen Materialtransport</title><rect width="1000" height="540" fill="#05141e"/>';
    const text=(x,y,t,color='#c7dbe6')=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="13">'+t+'</text>';
    s+=text(24,28,'ZYLINDER ROTIERT · TELLER FEST')+text(24,49,'2 × 3 · geometrische Ansichtsbelegung, keine neue Potenzregel');
    s+='<path d="M225 65V435" stroke="#507284" stroke-dasharray="5 5"/>';
    for(const p of r.plates){
      const cy=250-p.z*340;
      s+='<ellipse data-fixed-plate="'+p.index+'" cx="225" cy="'+f(cy)+'" rx="164" ry="39" fill="none" stroke="'+(p.index<3?'#54d7ef':'#b78aef')+'" opacity=".65"/>';
      s+='<ellipse cx="225" cy="'+f(cy)+'" rx="108" ry="25" fill="none" stroke="#507284"/>';
      s+=text(22,f(cy-15),p.plate+' · '+p.nominalAngleDeg.toFixed(2)+'°');
    }
    s+='<path d="M129 80V420M321 80V420" stroke="#557485"/>';
    for(const b of r.bands){
      s+='<path data-band="'+b.band+'" d="'+path(b.points)+'" fill="none" stroke="'+b.color+'" stroke-width="5"/>';
      for(const p of b.plateContacts){const[x,y]=screen(p);s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="3" fill="#efbd55"/>';}
    }
    s+='<path d="M321 80V420" stroke="#f15d70" stroke-dasharray="5 4"/>';
    for(const b of r.bands)for(const z of b.frontCrossings){
      const[x,y]=screen([r.radius,0,z]);
      s+='<circle data-apparent-crossing="'+b.band+'" cx="'+f(x)+'" cy="'+f(y)+'" r="5" fill="'+b.color+'" stroke="#f15d70"/>';
    }
    const [mx,my]=screen(r.materialProbe);
    s+='<circle data-material-probe="true" cx="'+f(mx)+'" cy="'+f(my)+'" r="7" fill="#efbd55" stroke="#05141e"/>';
    s+=text(24,462,'GOLD · Materialprobe bleibt auf z=0.15')+text(24,484,'Obere / untere halbe Höhe: je 0.5 · keine Einfahrbewegung')+text(24,506,'ROT · feste Blicklinie mit wandernden Bandkreuzungen');
    s+=text(505,28,'ABWICKLUNG · ROTATION ALS HORIZONTALE VERSCHIEBUNG');
    const count=r.seam.copies,w=210;
    for(let cell=0;cell<count;cell++){
      const left=520+cell*w;
      s+='<rect x="'+left+'" y="80" width="'+w+'" height="340" fill="none" stroke="#efbd55"/>';
      for(const b of r.bands)for(let winding=-2;winding<=3;winding++){
        // Clip algebraically at the cell boundary; no SVG IDs shared across renderers.
        const a=directionOffset(r,b.band,winding),lo=Math.max(-.5,-a),hi=Math.min(.5,1-a);
        if(lo>hi)continue;
        s+='<path d="M'+f(left+w*(lo+a))+' '+f(250-340*lo)+'L'+f(left+w*(hi+a))+' '+f(250-340*hi)+'" stroke="'+b.color+'" stroke-width="4"/>';
      }
      const u=mod1(r.direction*r.phase/360);
      s+='<circle cx="'+f(left+w*u)+'" cy="199" r="6" fill="#efbd55"/>';
      s+=text(left,445,'u='+cell+' … '+(cell+1));
    }
    s+='<path d="M520 80V420" stroke="#f15d70" stroke-width="2" stroke-dasharray="5 4"/>';
    s+=text(505,474,'NAHT: (0,z) ~ (1,z) · ohne Verdrehung')+text(505,496,'Bandkreuzung wandert; Materialhöhe bleibt gleich.');
    return s+'</svg>';
  }
  function directionOffset(r,band,winding){return band/3+r.direction*r.phase/360+winding;}
  return {snapshot,verify,drawing};
});
