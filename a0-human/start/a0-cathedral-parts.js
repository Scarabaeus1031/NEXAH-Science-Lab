(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0CathedralParts=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const groups=[['nave','Nave · Gerüst'],['scarab','Scarab · Ring & Glyphe'],['qsr','Quantum Spiral'],['sea','Fractal Sea'],['tunnel','Neutrino Tunnel'],['portals','Portale']];
 function group(name){if(/^Nave_/.test(name))return'nave';if(/^Scarab/.test(name))return'scarab';if(/^(QSR_|Runes_QSR)/.test(name))return'qsr';if(/^(FS_|Runes_FS)/.test(name))return'sea';if(/^(NT_|Runes_NT)/.test(name))return'tunnel';if(/^Portal_/.test(name))return'portals';return null;}
 function parse(input){const bytes=new Uint8Array(input),v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);if(bytes.length<20||v.getUint32(0,true)!==0x46546c67||v.getUint32(4,true)!==2||v.getUint32(8,true)!==bytes.length||v.getUint32(16,true)!==0x4e4f534a)throw Error('Ungültiges GLB');const length=v.getUint32(12,true);if(20+length>bytes.length)throw Error('GLB-Länge');return{bytes,doc:JSON.parse(new TextDecoder().decode(bytes.subarray(20,20+length))),tail:bytes.slice(20+length)};}
 function inspect(input){const {doc}=parse(input);if(doc.nodes[0]?.name!=='Root_v0.8_extended')throw Error('Bauteilansicht ist nur für Cathedral 0.8 definiert');const ids=doc.nodes[0].children||[],counts=Object.fromEntries(groups.map(([key])=>[key,0]));for(const id of ids){const key=group(doc.nodes[id].name);if(!key)throw Error('Nicht zugeordnetes Bauteil: '+doc.nodes[id].name);counts[key]++;}return{nodes:doc.nodes.length,attached:ids.length,unattached:doc.nodes.length-ids.length-1,counts,animations:(doc.animations||[]).map(a=>a.name),axis:'Y = GLB-Höhe; Nave schreitet entlang −Z fort',boundary:'Node hierarchy is not a LIFE neighbourhood graph'};}
 function derive(input,{part='all',explode=0,height=100}={}){
  const report=inspect(input);if(!['all',...groups.map(g=>g[0])].includes(part)||!Number.isFinite(explode)||explode<0||explode>1||!Number.isFinite(height)||height<0||height>100)throw Error('Ungültige Ansichtsparameter');
  const {doc,tail}=parse(input),ids=doc.nodes[0].children.slice(),ys=ids.map(i=>(doc.nodes[i].translation||[0,0,0])[1]),min=Math.min(...ys),max=Math.max(...ys),cut=min+(max-min)*height/100;
  const selected=ids.filter(i=>(part==='all'||group(doc.nodes[i].name)===part)&&(doc.nodes[i].translation||[0,0,0])[1]<=cut+1e-10);
  const offsets={nave:[0,0,0],scarab:[0,0,5],qsr:[-7,4,0],sea:[-9,0,-2],tunnel:[9,0,-2],portals:[0,6,0]};
  doc.nodes[0].children=[];
  for(const [key,label] of groups){const children=selected.filter(i=>group(doc.nodes[i].name)===key);if(!children.length)continue;const index=doc.nodes.length;doc.nodes.push({name:'ViewOnly_'+label,translation:offsets[key].map(v=>v*explode),children});doc.nodes[0].children.push(index);}
  // Derived static views deliberately do not retarget source animations.
  delete doc.animations;doc.asset.generator='A0 derived static Cathedral 0.8 parts view';doc.extras={...(doc.extras||{}),a0_view:{part,explode,height,selected:selected.length,source_nodes:selected,not_simulation:true,cut_semantics:'filter by node origin Y, not mesh clipping'}};
  return{bytes:encode(doc,tail),report:{...report,selected:selected.length,part,explode,height}};
 }
 function encode(doc,tail){const json=new TextEncoder().encode(JSON.stringify(doc)),padded=(json.length+3)&~3,out=new Uint8Array(20+padded+tail.length),v=new DataView(out.buffer);out.fill(32,20,20+padded);v.setUint32(0,0x46546c67,true);v.setUint32(4,2,true);v.setUint32(8,out.length,true);v.setUint32(12,padded,true);v.setUint32(16,0x4e4f534a,true);out.set(json,20);out.set(tail,20+padded);return out;}
 return{groups,group,parse,inspect,derive,encode};
});
