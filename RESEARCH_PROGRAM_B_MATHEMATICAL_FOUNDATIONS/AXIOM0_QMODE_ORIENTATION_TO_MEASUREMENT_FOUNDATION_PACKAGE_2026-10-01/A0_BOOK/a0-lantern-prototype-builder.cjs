'use strict';
const fs=require('node:fs');
const path=require('node:path');
const replay=require('./a0-lantern-crown-replay.js');
const envelope=require('./a0-lantern-crown-envelope.js');
const engineering=require('./a0-lantern-hinge-actuator-engineering.js');
const root=__dirname;
const result=engineering.runEngineering();
if(!result.pass)throw new Error('engineering contract must pass before prototype export');
const scale=0.1; // source units -> metres
const groups={housing:{p:[],i:[]},flaps:{p:[],i:[]},pins:{p:[],i:[]},actuators:{p:[],i:[]}};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const n=Math.hypot(...a);return mul(a,1/n);};
const pushVertex=(g,v)=>{g.p.push(v[0],v[1],v[2]);return g.p.length/3-1;};
const quad=(g,a,b,c,d)=>g.i.push(a,b,c,a,c,d);
function prism(g,triangle,thickness){
  const n=norm(cross(sub(triangle[1],triangle[0]),sub(triangle[2],triangle[0]))),h=thickness/2;
  const top=triangle.map(v=>pushVertex(g,add(v,mul(n,h)))),bottom=triangle.map(v=>pushVertex(g,add(v,mul(n,-h))));
  g.i.push(top[0],top[1],top[2],bottom[2],bottom[1],bottom[0]);
  for(let k=0;k<3;k++)quad(g,top[k],top[(k+1)%3],bottom[(k+1)%3],bottom[k]);
}
function cylinder(g,a,b,radius,segments=16){
  const axis=norm(sub(b,a)),helper=Math.abs(axis[2])<.9?[0,0,1]:[1,0,0],u=norm(cross(axis,helper)),v=cross(axis,u);
  const start=[],end=[];
  for(let k=0;k<segments;k++){
    const t=2*Math.PI*k/segments,rad=add(mul(u,Math.cos(t)*radius),mul(v,Math.sin(t)*radius));
    start.push(pushVertex(g,add(a,rad)));end.push(pushVertex(g,add(b,rad)));
  }
  const ca=pushVertex(g,a),cb=pushVertex(g,b);
  for(let k=0;k<segments;k++){const n=(k+1)%segments;quad(g,start[k],start[n],end[n],end[k]);g.i.push(ca,start[n],start[k],cb,end[k],end[n]);}
}
function box(g,center,size){
  const [x,y,z]=center,[sx,sy,sz]=size.map(v=>v/2),vs=[[-sx,-sy,-sz],[sx,-sy,-sz],[sx,sy,-sz],[-sx,sy,-sz],[-sx,-sy,sz],[sx,-sy,sz],[sx,sy,sz],[-sx,sy,sz]].map(v=>pushVertex(g,[x+v[0],y+v[1],z+v[2]]));
  quad(g,vs[0],vs[1],vs[2],vs[3]);quad(g,vs[4],vs[7],vs[6],vs[5]);quad(g,vs[0],vs[4],vs[5],vs[1]);quad(g,vs[1],vs[5],vs[6],vs[2]);quad(g,vs[2],vs[6],vs[7],vs[3]);quad(g,vs[3],vs[7],vs[4],vs[0]);
}
function housing(g,ri,ro,z0,z1,segments=64){
  const in0=[],in1=[],out0=[],out1=[];
  for(let k=0;k<segments;k++){const t=2*Math.PI*k/segments,c=Math.cos(t),s=Math.sin(t);in0.push(pushVertex(g,[ri*c,ri*s,z0]));in1.push(pushVertex(g,[ri*c,ri*s,z1]));out0.push(pushVertex(g,[ro*c,ro*s,z0]));out1.push(pushVertex(g,[ro*c,ro*s,z1]));}
  for(let k=0;k<segments;k++){const n=(k+1)%segments;quad(g,out0[k],out0[n],out1[n],out1[k]);quad(g,in0[n],in0[k],in1[k],in1[n]);quad(g,out0[n],out0[k],in0[k],in0[n]);quad(g,out1[k],out1[n],in1[n],in1[k]);}
}
const triangles=envelope.trimmedTriangles(result.options.operatingStopDegrees);
triangles.forEach(t=>prism(groups.flaps,t.map(v=>mul(v,scale)),0.002));
replay.hinges().forEach((hinge,index)=>{
  const tangent=norm(sub(hinge.right,hinge.left)),a=add(mul(hinge.left,scale),mul(tangent,-0.012)),b=add(mul(hinge.right,scale),mul(tangent,0.012));
  cylinder(groups.pins,a,b,0.002,18);
  const pod=add(b,mul(tangent,0.008));box(groups.actuators,pod,[0.016,0.016,0.012]);
});
housing(groups.housing,0.153,0.157,-0.008,0.122);
const materials=[
  {name:'PETG Housing',pbrMetallicRoughness:{baseColorFactor:[0.04,0.65,0.72,0.26],metallicFactor:0,roughnessFactor:.5},alphaMode:'BLEND',doubleSided:true},
  {name:'Pink Flaps',pbrMetallicRoughness:{baseColorFactor:[0.95,0.22,0.62,1],metallicFactor:0,roughnessFactor:.42},doubleSided:true},
  {name:'316 Pins',pbrMetallicRoughness:{baseColorFactor:[.66,.72,.76,1],metallicFactor:.8,roughnessFactor:.24}},
  {name:'Actuator Pods',pbrMetallicRoughness:{baseColorFactor:[1,.65,.08,1],metallicFactor:.15,roughnessFactor:.46}}
];
const chunks=[],bufferViews=[],accessors=[],primitives=[];
const pad4=b=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);
Object.entries(groups).forEach(([name,g],material)=>{
  const positions=Buffer.from(new Float32Array(g.p).buffer),indices=Buffer.from(new Uint32Array(g.i).buffer);
  const po=chunks.reduce((n,b)=>n+b.length,0);chunks.push(pad4(positions));bufferViews.push({buffer:0,byteOffset:po,byteLength:positions.length,target:34962});const pv=bufferViews.length-1;
  const io=chunks.reduce((n,b)=>n+b.length,0);chunks.push(pad4(indices));bufferViews.push({buffer:0,byteOffset:io,byteLength:indices.length,target:34963});const iv=bufferViews.length-1;
  const points=[];for(let i=0;i<g.p.length;i+=3)points.push(g.p.slice(i,i+3));
  const min=[0,1,2].map(k=>Math.min(...points.map(p=>p[k]))),max=[0,1,2].map(k=>Math.max(...points.map(p=>p[k])));
  accessors.push({bufferView:pv,componentType:5126,count:g.p.length/3,type:'VEC3',min,max});const pa=accessors.length-1;
  accessors.push({bufferView:iv,componentType:5125,count:g.i.length,type:'SCALAR'});const ia=accessors.length-1;
  primitives.push({attributes:{POSITION:pa},indices:ia,material});
});
const bin=Buffer.concat(chunks);
const gltf={asset:{version:'2.0',generator:'NEXAH A0 finite-body prototype builder',extras:{status:'KINEMATIC PROTOTYPE / NOT FABRICATION RELEASE'}},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'Lantern Crown Engineering Prototype',mesh:0}],meshes:[{name:'147.5 degree hinge-actuator-housing assembly',primitives}],materials,buffers:[{byteLength:bin.length}],bufferViews,accessors,extras:{operatingStopDegrees:147.5,continuousPairClearanceMillimetres:result.certificate.certifiedPairClearanceMillimetres,hold:result.hold}};
const json=pad4(Buffer.from(JSON.stringify(gltf)));const header=Buffer.alloc(12),jc=Buffer.alloc(8),bc=Buffer.alloc(8);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+json.length+8+bin.length,8);jc.writeUInt32LE(json.length,0);jc.writeUInt32LE(0x4e4f534a,4);bc.writeUInt32LE(bin.length,0);bc.writeUInt32LE(0x004e4942,4);
const glb=Buffer.concat([header,jc,json,bc,bin]);
const target=path.join(root,'results/a0-lantern-hinge-actuator-housing-prototype-2026-10-29.glb');fs.writeFileSync(target,glb);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480"><rect width="800" height="480" fill="#071c25"/><circle cx="250" cy="240" r="190" fill="none" stroke="#2ecad3" stroke-width="12" opacity=".45"/><circle cx="250" cy="240" r="176" fill="none" stroke="#2ecad3" stroke-width="2"/><g fill="none" stroke="#f06aab" stroke-width="5">${[0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*2*Math.PI/5,b=a+2*Math.PI/5,x1=250+82*Math.cos(a),y1=240+82*Math.sin(a),x2=250+82*Math.cos(b),y2=240+82*Math.sin(b);return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L250 240 L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;}).join('')}</g><g fill="#ffd15c">${[0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*2*Math.PI/5;return `<circle cx="${(250+82*Math.cos(a)).toFixed(1)}" cy="${(240+82*Math.sin(a)).toFixed(1)}" r="8"/>`;}).join('')}</g><text x="480" y="95" fill="#eef8fa" font-family="sans-serif" font-size="30" font-weight="700">HINGE / ACTUATOR / HOUSING</text><text x="480" y="142" fill="#79e3e6" font-family="monospace" font-size="18">STOP 147.5° · APERTURE 5.96 mm</text><text x="480" y="182" fill="#79e3e6" font-family="monospace" font-size="18">CONTINUOUS GAP ≥ 1.469 mm</text><text x="480" y="235" fill="#ffd15c" font-family="sans-serif" font-size="17">5 × 4 mm pin · POM-C liner</text><text x="480" y="267" fill="#ffd15c" font-family="sans-serif" font-size="17">5 × coaxial external actuator</text><text x="480" y="299" fill="#ffd15c" font-family="sans-serif" font-size="17">PETG 4 mm open guard</text><text x="480" y="370" fill="#f06aab" font-family="monospace" font-size="16">KINEMATIC PROTOTYPE</text><text x="480" y="399" fill="#9bb3bd" font-family="monospace" font-size="14">LOAD / FATIGUE / TORQUE HOLD</text></svg>`;
fs.writeFileSync(path.join(root,'results/a0-lantern-hinge-actuator-housing-prototype-2026-10-29.svg'),svg);
console.log(JSON.stringify({status:'PASS',glb:path.relative(root,target),bytes:glb.length,meshes:Object.fromEntries(Object.entries(groups).map(([k,g])=>[k,{vertices:g.p.length/3,triangles:g.i.length/3}]))}));
