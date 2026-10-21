/* Read-only archaeology. Generated reports do not modify archived GLBs. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const archive='/Users/tho2020/Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules';
const folder=fs.readdirSync(archive).find(n=>n.startsWith('⚧ Fusion Resonance Codex'));
if(!folder)throw Error('Fusion archive missing');
const base=path.join(archive,folder);
function parse(file){
 const bytes=fs.readFileSync(file);
 if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length)throw Error('Invalid GLB header');
 const size=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+size).toString()),off=20+size;
 const bin=bytes.subarray(off+8,off+8+bytes.readUInt32LE(off));
 function values(index){
  const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],width={SCALAR:1,VEC3:3,VEC4:4}[a.type];
  if(a.componentType!==5126||!width||a.sparse||v.buffer!==0)throw Error('Unsupported accessor');
  return Array.from({length:a.count},(_,i)=>Array.from({length:width},(_,j)=>bin.readFloatLE((v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||width*4)+j*4)));
 }
 return{bytes,doc,values};
}
function audit(name){
 const file=path.join(base,name),{bytes,doc,values}=parse(file);
 const phiLayers=(doc.nodes||[]).filter(n=>/^Phi_Layer_/.test(n.name||'')).map(n=>{
  const positions=doc.meshes[n.mesh]?.primitives.flatMap(p=>values(p.attributes.POSITION))||[];
  const ranges=[0,1,2].map(k=>positions.length?[Math.min(...positions.map(p=>p[k])),Math.max(...positions.map(p=>p[k]))]:null);
  return{name:n.name,mesh:n.mesh,vertices:positions.length,localBounds:ranges,translation:n.translation||null,scale:n.scale||null,matrix:n.matrix||null};
 });
 const animations=(doc.animations||[]).map(a=>({name:a.name,channels:a.channels.map(c=>{
  const s=a.samplers[c.sampler],times=values(s.input).flat(),output=values(s.output),q=output;
  const equivalentRotationEndpoints=c.target.path==='rotation'&&q.length===2&&Math.abs(q[0].reduce((sum,v,k)=>sum+v*q[1][k],0))>1-1e-6;
  return{target:doc.nodes[c.target.node].name,path:c.target.path,interpolation:s.interpolation||'LINEAR',times,values:output,equivalentRotationEndpoints};
 })}));
 return{file,href:path.relative(__dirname,file).split(path.sep).join('/'),sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,nodes:doc.nodes.length,meshes:doc.meshes.length,phiLayers,animations};
}
function report(){return{schema:'a0.bench-fusion-glb-audit/1',scope:'ARCHIVE_BINARY_INSPECTION_NOT_SCIENTIFIC_RUN',models:['Fusion_Architecture_v3_3_full_HUD.glb','Fusion_Architecture_v3_4_animated.glb','Euler_Bridges_3D.glb'].map(audit),boundaries:['Five named Phi layers are not five states of phi or a Q4/P3 mapping.','Quaternion q and -q describe the same orientation; a two-key shortest-path clip does not encode a full turn.','Phi_Pulse is a uniform 3% group scale pulse, not a five-stage sequence.','Euler_Bridges_3D and the historical Rath/Cathedral graph are not identified.']};}
if(require.main===module){
 const r=report(),dir=path.join(__dirname,'results'),json=JSON.stringify(r,null,2);
 fs.writeFileSync(path.join(dir,'a0-bench-fusion-glb-audit-2026-10-21.json'),json+'\n');
 fs.writeFileSync(path.join(__dirname,'assets/a0-bench-fusion-glb-audit.js'),'window.A0BenchFusionGLBAudit='+json+';\n');
 console.log(JSON.stringify(r,null,2));
}
module.exports={parse,audit,report};
