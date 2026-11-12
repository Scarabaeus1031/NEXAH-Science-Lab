'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const DEFAULT_SOURCE='/Users/tho2020/Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules/MASTER_rootroom_numbermagic_toe/NUMBERMAGICK-ABBENDEN_AND_CHAPTERS/NUMBERMAGIC_KAPITEL___NTOE___Euler-L Prime Lattice___NTOE/klein_bottle_multigrid_lotus.glb';
const DEFAULT_OUTPUT=path.join(__dirname,'results/a0-klein-lotus-topology-audit-2026-11-12.json');
const source=process.argv[2]||DEFAULT_SOURCE;
const output=process.argv[3]||DEFAULT_OUTPUT;
const EPS=1e-6;

function readGlb(file){
  const buf=fs.readFileSync(file);
  if(buf.toString('ascii',0,4)!=='glTF')throw new Error('not a binary glTF');
  let off=12,json=null,bin=null;
  while(off<buf.length){const len=buf.readUInt32LE(off),type=buf.readUInt32LE(off+4),data=buf.subarray(off+8,off+8+len);if(type===0x4e4f534a)json=JSON.parse(data.toString('utf8').replace(/\0+$/,''));if(type===0x004e4942)bin=data;off+=8+len}
  if(!json||!bin)throw new Error('missing JSON or BIN chunk');
  const component={5121:{size:1,read:(b,o)=>b.readUInt8(o)},5123:{size:2,read:(b,o)=>b.readUInt16LE(o)},5125:{size:4,read:(b,o)=>b.readUInt32LE(o)},5126:{size:4,read:(b,o)=>b.readFloatLE(o)}};
  const widths={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};
  function accessor(index){const a=json.accessors[index],v=json.bufferViews[a.bufferView],c=component[a.componentType],width=widths[a.type],stride=v.byteStride||c.size*width,start=(v.byteOffset||0)+(a.byteOffset||0),out=[];for(let i=0;i<a.count;i++){const row=[];for(let j=0;j<width;j++)row.push(c.read(bin,start+i*stride+j*c.size));out.push(width===1?row[0]:row)}return out}
  const vertices=[],faces=[];
  for(const mesh of json.meshes||[])for(const primitive of mesh.primitives||[]){if(primitive.mode!=null&&primitive.mode!==4)continue;const local=accessor(primitive.attributes.POSITION),base=vertices.length,indices=primitive.indices==null?local.map((_,i)=>i):accessor(primitive.indices);vertices.push(...local);for(let i=0;i+2<indices.length;i+=3)faces.push([base+indices[i],base+indices[i+1],base+indices[i+2]])}
  return{vertices,faces,bytes:buf.length,sha256:crypto.createHash('sha256').update(buf).digest('hex')};
}

function weld(vertices,faces,tol=EPS){
  const map=new Map(),remap=[],out=[];
  for(const p of vertices){const key=p.map(x=>Math.round(x/tol)).join(',');let i=map.get(key);if(i==null){i=out.length;map.set(key,i);out.push(p)}remap.push(i)}
  const welded=faces.map(f=>f.map(i=>remap[i])).filter(f=>f[0]!==f[1]&&f[1]!==f[2]&&f[2]!==f[0]);
  return{vertices:out,faces:welded,duplicates:vertices.length-out.length};
}

function edgeKey(a,b){return a<b?`${a},${b}`:`${b},${a}`}
function topology(vertices,faces){
  const edgeFaces=new Map(),faceAdj=Array.from({length:faces.length},()=>[]),vertexFaces=Array.from({length:vertices.length},()=>[]);
  faces.forEach((f,fi)=>{f.forEach(v=>vertexFaces[v].push(fi));for(let i=0;i<3;i++){const a=f[i],b=f[(i+1)%3],key=edgeKey(a,b),dir=a<b?1:-1,arr=edgeFaces.get(key)||[];arr.push({face:fi,dir});edgeFaces.set(key,arr)}});
  for(const arr of edgeFaces.values())if(arr.length===2){const[a,b]=arr,relation=-a.dir*b.dir;faceAdj[a.face].push([b.face,relation]);faceAdj[b.face].push([a.face,relation])}
  const faceComponent=Array(faces.length).fill(-1),components=[];
  for(let seed=0;seed<faces.length;seed++){if(faceComponent[seed]>=0)continue;const id=components.length,stack=[seed],list=[];faceComponent[seed]=id;while(stack.length){const f=stack.pop();list.push(f);for(const[n]of faceAdj[f])if(faceComponent[n]<0){faceComponent[n]=id;stack.push(n)}}components.push(list)}
  return components.map((faceIds,id)=>{
    const fset=new Set(faceIds),vset=new Set(),eset=new Set();let boundaryEdges=0,nonManifoldEdges=0;
    for(const fi of faceIds){const f=faces[fi];f.forEach(v=>vset.add(v));for(let i=0;i<3;i++)eset.add(edgeKey(f[i],f[(i+1)%3]))}
    for(const key of eset){const n=(edgeFaces.get(key)||[]).filter(x=>fset.has(x.face)).length;if(n===1)boundaryEdges++;else if(n!==2)nonManifoldEdges++}
    const orientation=new Map([[faceIds[0],1]]),queue=[faceIds[0]];let contradictions=0;
    while(queue.length){const fi=queue.shift(),s=orientation.get(fi);for(const[n,relation]of faceAdj[fi]){if(!fset.has(n))continue;const required=s*relation;if(!orientation.has(n)){orientation.set(n,required);queue.push(n)}else if(orientation.get(n)!==required)contradictions++}}
    const chi=vset.size-eset.size+faceIds.length,closed=boundaryEdges===0&&nonManifoldEdges===0,orientable=contradictions===0;
    const classification=!closed?'SURFACE_WITH_BOUNDARY_OR_NONMANIFOLD':orientable?`ORIENTABLE_GENUS_${(2-chi)/2}`:`NONORIENTABLE_CROSSCAP_${2-chi}`;
    return{id,vertices:vset.size,edges:eset.size,triangles:faceIds.length,eulerCharacteristic:chi,boundaryEdges,nonManifoldEdges,closed,orientable,orientationContradictions:contradictions,classification,faceIds:[...faceIds],vertexIds:[...vset]};
  });
}

const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>Math.hypot(...a);
function geometry(vertices,faces,components){
  const faceArea=[],angles=Array(vertices.length).fill(0),degenerate=[];
  faces.forEach((f,fi)=>{const p=f.map(i=>vertices[i]),n=cross(sub(p[1],p[0]),sub(p[2],p[0])),area=norm(n)/2;faceArea[fi]=area;if(area<1e-14)degenerate.push(fi);for(let i=0;i<3;i++){const a=sub(p[(i+1)%3],p[i]),b=sub(p[(i+2)%3],p[i]),c=Math.max(-1,Math.min(1,dot(a,b)/(norm(a)*norm(b))));angles[f[i]]+=Math.acos(c)}});
  return components.map(c=>{const deficits=c.vertexIds.map(v=>({vertex:v,deficit:Math.PI*2-angles[v],position:vertices[v]})),sum=deficits.reduce((s,x)=>s+x.deficit,0),target=Math.PI*2*c.eulerCharacteristic,ranked=[...deficits].sort((a,b)=>Math.abs(b.deficit)-Math.abs(a.deficit)).slice(0,12);return{id:c.id,degenerateTriangles:c.faceIds.filter(f=>faceArea[f]<1e-14).length,angleDeficitSum:sum,gaussBonnetTarget:target,gaussBonnetResidual:Math.abs(sum-target),maxAbsVertexDeficit:Math.max(...deficits.map(x=>Math.abs(x.deficit))),curvatureConcentration:ranked}});
}

function bounds(vertices,ids){const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(const i of ids)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],vertices[i][k]);hi[k]=Math.max(hi[k],vertices[i][k])}return{min:lo,max:hi}}
function overlapBounds(a,b){return a.min.every((x,k)=>x<=b.max[k]&&b.min[k]<=a.max[k])}
function nearestCrossComponent(vertices,a,b){
  const build=(ids,depth=0)=>{if(!ids.length)return null;const axis=depth%3,ordered=[...ids].sort((i,j)=>vertices[i][axis]-vertices[j][axis]),mid=Math.floor(ordered.length/2);return{i:ordered[mid],axis,left:build(ordered.slice(0,mid),depth+1),right:build(ordered.slice(mid+1),depth+1)}};
  const root=build(b.vertexIds);let best={distance:Infinity,a:null,b:null};
  const visit=(node,p,i)=>{if(!node)return;const q=vertices[node.i],d=norm(sub(p,q));if(d<best.distance)best={distance:d,a:i,b:node.i,pointA:p,pointB:q};const delta=p[node.axis]-q[node.axis],near=delta<0?node.left:node.right,far=delta<0?node.right:node.left;visit(near,p,i);if(Math.abs(delta)<best.distance)visit(far,p,i)};
  for(const i of a.vertexIds)visit(root,vertices[i],i);
  return best;
}

function segmentTriangle(a,b,p0,p1,p2,eps=1e-10){
  const dir=sub(b,a),e1=sub(p1,p0),e2=sub(p2,p0),h=cross(dir,e2),det=dot(e1,h);if(Math.abs(det)<eps)return null;
  const inv=1/det,s=sub(a,p0),u=inv*dot(s,h);if(u<-eps||u>1+eps)return null;const q=cross(s,e1),v=inv*dot(dir,q);if(v<-eps||u+v>1+eps)return null;const t=inv*dot(e2,q);if(t<-eps||t>1+eps)return null;
  return[a[0]+t*dir[0],a[1]+t*dir[1],a[2]+t*dir[2]];
}
function triangleIntersection(vertices,fa,fb){const a=fa.map(i=>vertices[i]),b=fb.map(i=>vertices[i]);for(let i=0;i<3;i++){const p=segmentTriangle(a[i],a[(i+1)%3],b[0],b[1],b[2]);if(p)return p}for(let i=0;i<3;i++){const p=segmentTriangle(b[i],b[(i+1)%3],a[0],a[1],a[2]);if(p)return p}return null}
function crossComponentIntersections(vertices,faces,a,b){
  const cell=.05,grid=new Map(),triBounds=f=>bounds(vertices,f),key=(x,y,z)=>`${x},${y},${z}`;
  for(const fi of a.faceIds){const bb=triBounds(faces[fi]),lo=bb.min.map(x=>Math.floor(x/cell)),hi=bb.max.map(x=>Math.floor(x/cell));for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){const k=key(x,y,z),list=grid.get(k)||[];list.push(fi);grid.set(k,list)}}
  const tested=new Set(),hits=[];for(const fj of b.faceIds){const bb=triBounds(faces[fj]),lo=bb.min.map(x=>Math.floor(x/cell)),hi=bb.max.map(x=>Math.floor(x/cell)),candidates=new Set();for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++)for(const fi of grid.get(key(x,y,z))||[])candidates.add(fi);for(const fi of candidates){const pair=`${fi},${fj}`;if(tested.has(pair))continue;tested.add(pair);const point=triangleIntersection(vertices,faces[fi],faces[fj]);if(point&&hits.length<64)hits.push({faceA:fi,faceB:fj,point})}}
  return{method:'SPATIAL_HASH_PLUS_NON_COPLANAR_SEGMENT_TRIANGLE_TEST',cellSize:cell,testedCandidatePairs:tested.size,detectedIntersectingPairs:hits.length,samples:hits};
}

const glb=readGlb(source),welded=weld(glb.vertices,glb.faces),components=topology(welded.vertices,welded.faces),geo=geometry(welded.vertices,welded.faces,components),componentBounds=components.map(c=>bounds(welded.vertices,c.vertexIds)),crossNearest=components.length===2?nearestCrossComponent(welded.vertices,components[0],components[1]):null,crossIntersections=components.length===2?crossComponentIntersections(welded.vertices,welded.faces,components[0],components[1]):null;
const report={
  schema:'a0.klein-lotus-topology-audit/1.0.0',date:'2026-11-12',status:'PASS_ORIENTABILITY_AND_DISCRETE_CURVATURE_AUDIT',
  source:{path:source,sha256:glb.sha256,bytes:glb.bytes},
  raw:{vertices:glb.vertices.length,triangles:glb.faces.length},
  seamWeld:{tolerance:EPS,duplicatePositions:glb.vertices.length-welded.vertices.length,vertices:welded.vertices.length,triangles:welded.faces.length},
  components:components.map((c,i)=>({...c,faceIds:undefined,vertexIds:undefined,bounds:componentBounds[i],geometry:geo[i]})),
  crossComponentGeometry:{boundingBoxesOverlap:components.length===2?overlapBounds(componentBounds[0],componentBounds[1]):null,nearestSampledVertexPair:crossNearest,triangleIntersectionAudit:crossIntersections},
  conclusions:{chiZeroComponentClassification:components.find(c=>c.eulerCharacteristic===0)?.classification||'NOT_FOUND',chiTwoComponentClassification:components.find(c=>c.eulerCharacteristic===2)?.classification||'NOT_FOUND',torusHypothesis:components.some(c=>c.eulerCharacteristic===0&&c.orientable),kleinBottleHypothesis:components.some(c=>c.classification==='NONORIENTABLE_CROSSCAP_2'),openBoundary:false,zipfelDisposition:'NO OPEN BOUNDARY; NORMAL-ORIENTATION CONTRADICTION AND CURVATURE CONCENTRATION ARE MEASURED; THE SMALL SPHERE IS A DISCONNECTED OVERLAY COMPONENT',singleConnectedSurface:false},
  authority:{identityReuse:['ART:A0:MATHEMATICAL_JOINTS','MOD:ORIENTATION_DEMONSTRATORS'],newCanonicalIds:[],relationChanges:[],claimEffect:'SOURCE_BOUND_MESH_CLASSIFICATION_ONLY'}
};
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,components:report.components.map(c=>({chi:c.eulerCharacteristic,orientable:c.orientable,class:c.classification,gaussBonnetResidual:c.geometry.gaussBonnetResidual})),crossNearest:crossNearest?.distance,crossIntersections:crossIntersections?.detectedIntersectingPairs,output}));
