(function(root,factory){const api=factory(typeof module==='object'?require('./assets/game-of-worlds-play/cylinder-engine.js'):root.LifeCylinder,typeof module==='object'?require('./a0-cathedral-parts.js'):root.A0CathedralParts);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0CathedralLife=api;})(typeof globalThis==='undefined'?this:globalThis,function(life,parts){
 'use strict';
 const LIMIT=32,PATTERNS=['glider','blinker','rPentomino'],MODES=['body','scaffold','exploded'];
 function start(pattern='glider'){if(!PATTERNS.includes(pattern))throw Error('Unbekanntes Startmuster');return{schema:'a0.cathedral-life-history/1',pattern,rule:life.RULE,boundary:'finite-dead',frames:[life.initial({kind:'pattern',pattern,size:16},'finite-dead')]};}
 function step(session){if(session.frames.length>LIMIT)throw Error('32 Generationen erreicht');return{...session,frames:[...session.frames,life.step(session.frames.at(-1))]};}
 function position(x,y,g,mode){return[(x-7.5)*.55,.3+g*(mode==='exploded'?.78:.38),-10+(y-7.5)*.55];}
 function render(input,session,mode='body'){
  if(!MODES.includes(mode)||session.frames.length<1||session.frames.length>LIMIT+1)throw Error('Ungültige Ansicht');
  const base=parts.derive(input,{part:mode==='scaffold'?'nave':'all',explode:mode==='exploded'?.35:0}),{doc,tail}=parts.parse(base.bytes),current=session.frames.length-1;
  // Ghost only this derived copy; the source GLB/materials remain untouched.
  for(const m of doc.materials){m.alphaMode='BLEND';m.doubleSided=true;m.pbrMetallicRoughness??={};const color=m.pbrMetallicRoughness.baseColorFactor||[1,1,1,1];m.pbrMetallicRoughness.baseColorFactor=[...color.slice(0,3),mode==='scaffold'?.035:.1];m.emissiveFactor=[0,0,0];}
  const material=(name,color)=>{const i=doc.materials.length;doc.materials.push({name,pbrMetallicRoughness:{baseColorFactor:[...color,1],metallicFactor:0,roughnessFactor:.65},emissiveFactor:color.map(v=>v*.45)});return i;};
  const now=material('LIFE current generation cyan',[.08,.85,1]),past=material('LIFE recorded history gold',[1,.55,.16]),rail=material('LIFE level frame',[.18,.3,.4]);
  const cellMesh=mat=>{const i=doc.meshes.length;doc.meshes.push({name:'LIFE display cube',primitives:[{...doc.meshes[0].primitives[0],material:mat}]});return i;};
  const meshes=[cellMesh(past),cellMesh(now)],railMesh=cellMesh(rail),root=doc.nodes.length;doc.nodes.push({name:'LIFE_HISTORY_VIEW_ONLY',children:[]});doc.scenes[doc.scene||0].nodes.push(root);
  const add=n=>{const i=doc.nodes.length;doc.nodes.push(n);doc.nodes[root].children.push(i);};let cells=0;
  session.frames.forEach((frame,g)=>{
   for(const [x,y] of frame.live){add({name:'LIFE_g'+g+'_'+x+'_'+y,mesh:meshes[g===current?1:0],translation:position(x,y,g,mode),scale:[.34,.14,.34],extras:{generation:g,cell:[x,y],view_only:true}});cells++;}
   const h=position(0,0,g,mode)[1];for(const [x,z,sx,sz] of [[-4.5,-10,.025,9],[4.5,-10,.025,9],[0,-14.5,9,.025],[0,-5.5,9,.025]])add({name:'LIFE_layer_'+g,mesh:railMesh,translation:[x,h,z],scale:[sx,.025,sz]});
  });
  doc.asset.generator='A0 Cathedral LIFE history view';delete doc.extras.a0_view.not_simulation;doc.extras.a0_view.scope='architecture view only; separate LIFE history in a0_life';doc.extras.a0_life={schema:session.schema,pattern:session.pattern,rule:session.rule,boundary:session.boundary,frames:session.frames,mode,generation:current,mapping:'X=(cellX−7.5)*0.55; Z=−10+(cellY−7.5)*0.55; Y=0.3+generation*(exploded?0.78:0.38)',scope:'recorded LIFE generations displayed in source architecture; not dynamics on Cathedral nodes',source_glb_sha256:'ddff799102ac7a40f98ee125c6d4a76f17a869786d182da0e9859023b6584443'};
  return{bytes:parts.encode(doc,tail),generation:current,cells,live:session.frames[current].live.length};
 }
 return{LIMIT,PATTERNS,MODES,start,step,position,render};
});
