(function(root,factory){const api=factory(typeof module==='object'?require('./a0-cathedral-parts.js'):root.A0CathedralParts);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0CathedralWorldProjection=api;})(typeof globalThis==='undefined'?this:globalThis,function(parts){
 'use strict';
 function life(s){
  if(s?.schema!=='nexah.life-crystal.observatory-projection.v1'||!Number.isInteger(s.generation)||!Array.isArray(s.source)||!Array.isArray(s.braid))throw Error('Kein LIFE-Quellsnapshot');
  const first=Math.max(0,s.generation-32,s.firstGeneration-1),frames=[];
  for(let g=first;g<=s.generation;g++){
   const events=s.braid.filter(e=>e.generation===(g<s.firstGeneration?g+1:g));
   const points=g===s.generation?s.source:events.filter(e=>g<s.firstGeneration?['survivals','deaths'].includes(e.type):['births','survivals'].includes(e.type));
   frames.push({generation:g,points:points.map(p=>({x:(p.x/(s.size-1)-.5)*8.25,z:-10+(p.y/(s.size-1)-.5)*8.25,address:[p.x,p.y]}))});
  }
  return{kind:'LIFE_NATIVE_SNAPSHOT_VIEW',runId:s.runId,generation:s.generation,rule:s.rule,boundary:s.boundary,size:s.size,frames,source:s.source,semantics:'X/Z = normalized cell address; Y = relative generation in visible window; no change to source dynamics'};
 }
 function integers(value,prefix='',out=[]){if(value&&typeof value==='object'){for(const key of Object.keys(value).sort())integers(value[key],prefix?prefix+'.'+key:key,out);}else if(/^-?\d+$/.test(String(value)))out.push({path:prefix,exact:String(value)});return out;}
 function numbers(session){
  if(!session?.config||!Number.isInteger(session.cursor)||!Array.isArray(session.frames)||!session.frames[session.cursor])throw Error('Kein Numbers-Quelllauf');
  const frames=session.frames.slice(Math.max(0,session.cursor-32),session.cursor+1).map(f=>({generation:f.generation,state:f.state,identity:f.identity,points:integers(f.state).map((c,i)=>{const r=Number((BigInt(c.exact)%97n+97n)%97n),a=2*Math.PI*r/97,radius=1+i*.15;return{x:radius*Math.cos(a),z:-10+radius*Math.sin(a),address:c.path,exact:c.exact};})}));
  return{kind:'NUMBER_NATIVE_STATE_VIEW_NOT_LIFE',generation:session.frames[session.cursor].generation,rule:session.config.world,config:session.config,frames,semantics:'integer state channels: angle = positive residue mod 97; radius = sorted channel index; Y = relative iteration. Lossy display; exact states retained. No LIFE operator.'};
 }
 function render(input,source,mode='body'){
  if(!['body','scaffold','exploded'].includes(mode)||!source.frames.length)throw Error('Ungültige Projektion');
  const {doc,tail}=parts.parse(parts.derive(input,{part:mode==='scaffold'?'nave':'all',explode:mode==='exploded'?.35:0}).bytes);
  let frames=source.frames.slice(),count=frames.reduce((n,f)=>n+f.points.length,0);while(count>6000&&frames.length>1)count-=frames.shift().points.length;
  for(const m of doc.materials){m.alphaMode='BLEND';m.doubleSided=true;m.emissiveFactor=[0,0,0];m.pbrMetallicRoughness??={};m.pbrMetallicRoughness.baseColorFactor=[...(m.pbrMetallicRoughness.baseColorFactor||[1,1,1]).slice(0,3),mode==='scaffold'?.035:.1];}
  const mesh=color=>{const material=doc.materials.length;doc.materials.push({pbrMetallicRoughness:{baseColorFactor:[...color,1],roughnessFactor:.6},emissiveFactor:color.map(v=>v*.4)});const i=doc.meshes.length;doc.meshes.push({primitives:[{...doc.meshes[0].primitives[0],material}]});return i;},past=mesh([1,.55,.16]),now=mesh([.08,.85,1]),root=doc.nodes.length;doc.nodes.push({name:'SOURCE_WORLD_VIEW_ONLY',children:[]});doc.scenes[doc.scene||0].nodes.push(root);
  frames.forEach((f,index)=>f.points.forEach(p=>{const i=doc.nodes.length;doc.nodes.push({name:'world_g'+f.generation,mesh:f.generation===source.generation?now:past,translation:[p.x,.3+index*(mode==='exploded'?.78:.38),p.z],scale:[source.kind.startsWith('LIFE')?.13:.3,.13,source.kind.startsWith('LIFE')?.13:.3],extras:{source_generation:f.generation,address:p.address,exact:p.exact}});doc.nodes[root].children.push(i);}));
  delete doc.extras.a0_view.not_simulation;doc.extras.a0_world_projection={...source,frames,mode,visible_first:frames[0].generation,visible_last:source.generation,display_window_only:true,source_glb_sha256:'ddff799102ac7a40f98ee125c6d4a76f17a869786d182da0e9859023b6584443'};doc.asset.generator='A0 Cathedral projection of native world snapshot';
  return{bytes:parts.encode(doc,tail),first:frames[0].generation,last:source.generation,count};
 }
 return{life,numbers,integers,render};
});
