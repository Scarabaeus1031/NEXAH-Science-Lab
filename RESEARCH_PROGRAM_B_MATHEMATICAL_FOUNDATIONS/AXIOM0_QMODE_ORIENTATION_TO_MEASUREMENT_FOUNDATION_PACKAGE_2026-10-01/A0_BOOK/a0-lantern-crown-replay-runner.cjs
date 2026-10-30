'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const replay=require('./a0-lantern-crown-replay.js');

const root=__dirname;
const sourceDir=path.join(root,'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/five-flap-crown/analysis/koerper_due_diligence');
const glbPath=path.join(root,'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb');
const models=JSON.parse(fs.readFileSync(path.join(sourceDir,'models.json'),'utf8'));
const native=JSON.parse(fs.readFileSync(path.join(sourceDir,'native_contact_results.json'),'utf8'));
const source=replay.sourceFromRecords(models,native);

const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const readGlb=file=>{
  const raw=fs.readFileSync(file);
  assert.equal(raw.readUInt32LE(0),0x46546c67,'GLB magic');
  assert.equal(raw.readUInt32LE(4),2,'GLB version');
  assert.equal(raw.readUInt32LE(8),raw.length,'GLB total length');
  const jsonLength=raw.readUInt32LE(12);
  assert.equal(raw.readUInt32LE(16),0x4e4f534a,'JSON chunk type');
  const json=JSON.parse(raw.subarray(20,20+jsonLength).toString('utf8').trim());
  const binHeader=20+jsonLength;
  const binLength=raw.readUInt32LE(binHeader);
  assert.equal(raw.readUInt32LE(binHeader+4),0x004e4942,'BIN chunk type');
  const bin=raw.subarray(binHeader+8,binHeader+8+binLength);
  return {raw,json,bin};
};
const {raw,json,bin}=readGlb(glbPath);
const accessor=index=>{
  const item=json.accessors[index];
  const view=json.bufferViews[item.bufferView];
  assert.equal(item.componentType,5126,'animation accessor uses float32');
  const width={SCALAR:1,VEC4:4}[item.type];
  assert.ok(width,'supported accessor width');
  const offset=(view.byteOffset||0)+(item.byteOffset||0);
  const result=[];
  for(let row=0;row<item.count;row++){
    const values=[];
    for(let column=0;column<width;column++)values.push(bin.readFloatLE(offset+(row*width+column)*4));
    result.push(width===1?values[0]:values);
  }
  return result;
};
const rotate=(vector,[x,y,z,w])=>{
  const uv=[y*vector[2]-z*vector[1],z*vector[0]-x*vector[2],x*vector[1]-y*vector[0]];
  const uuv=[y*uv[2]-z*uv[1],z*uv[0]-x*uv[2],x*uv[1]-y*uv[0]];
  return vector.map((value,index)=>value+2*(w*uv[index]+uuv[index]));
};
const position=point=>[point[0]*0.1,point[2]*0.1,-point[1]*0.1];
const animation=json.animations[0];
assert.equal(animation.channels.length,5,'five animated flap channels');
assert.equal(animation.samplers.length,5,'five flap samplers');
const glbChecks=[];
let maxQuaternionNormError=0;
let maxAnimationPositionError=0;
let maxAnimationReturnError=0;
animation.channels.forEach((channel,flapIndex)=>{
  const sampler=animation.samplers[channel.sampler];
  const times=accessor(sampler.input);
  const quaternions=accessor(sampler.output);
  assert.equal(times.length,161,'161 animation keys');
  assert.equal(times[0],0,'animation starts at zero');
  assert.equal(times.at(-1),8,'animation returns at eight seconds');
  const node=json.nodes[channel.target.node];
  const localTip=[0,source.flapAltitude*0.1,0];
  times.forEach((time,index)=>{
    const quaternion=quaternions[index];
    const norm=Math.hypot(...quaternion);
    const normError=Math.abs(norm-1);
    maxQuaternionNormError=Math.max(maxQuaternionNormError,normError);
    glbChecks.push(normError<1e-6);
    const folded=source.contactFoldDegrees*(0.5-0.5*Math.cos(time*Math.PI*2/8));
    const actual=rotate(localTip,quaternion).map((value,axis)=>value+node.translation[axis]);
    const expected=position(replay.tipsAt(folded,source)[flapIndex]);
    const error=replay.distance(actual,expected);
    maxAnimationPositionError=Math.max(maxAnimationPositionError,error);
    glbChecks.push(error<1e-6);
  });
  const first=rotate(localTip,quaternions[0]).map((value,axis)=>value+node.translation[axis]);
  const last=rotate(localTip,quaternions.at(-1)).map((value,axis)=>value+node.translation[axis]);
  const returnError=replay.distance(first,last);
  maxAnimationReturnError=Math.max(maxAnimationReturnError,returnError);
  glbChecks.push(returnError<1e-7);
});
json.bufferViews.forEach(view=>assert.ok((view.byteOffset||0)+view.byteLength<=json.buffers[0].byteLength,'bufferView stays inside declared buffer'));

const geometry=replay.runReplay(source);
const constantsMatch=JSON.stringify(source)===JSON.stringify(replay.defaults);
assert.ok(constantsMatch,'browser replay constants match source records');
assert.ok(geometry.pass,'121-frame geometry replay passes');
assert.ok(glbChecks.every(Boolean),'all GLB animation replay checks pass');

const receipt={
  schema:'a0.engineering-result.v1',
  id:'A0_LANTERN_CROWN_SOURCE_REPLAY_RETURN_2026_10_29',
  date:'2026-10-29',
  status:'PASS_WITH_MECHANISM_HOLD',
  classification:'DEPENDENCY_FREE_SOURCE_AND_GLB_REPLAY',
  identity_decision:'REUSE_NEXAH_A0_ORIENTATION_CONTROLLER_BENCH_NO_NEW_IDENTITY',
  sources:{
    models:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/five-flap-crown/analysis/koerper_due_diligence/models.json',
    native_contact:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/five-flap-crown/analysis/koerper_due_diligence/native_contact_results.json',
    glb:'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb'
  },
  geometry,
  glb_replay:{
    status:'PASS',
    animation_channels:animation.channels.length,
    keyframes_per_channel:161,
    deterministic_checks:glbChecks.length,
    max_quaternion_norm_error:maxQuaternionNormError,
    max_animation_position_error:maxAnimationPositionError,
    max_animation_return_error:maxAnimationReturnError,
    byte_length:raw.length
  },
  total_deterministic_checks:geometry.total+glbChecks.length,
  hashes:{models:hash(path.join(sourceDir,'models.json')),native_contact:hash(path.join(sourceDir,'native_contact_results.json')),glb:hash(glbPath)},
  pass:{rigid_flap_lengths:true,central_tip_contact:true,open_contact_open_return:true,glb_structure:true,five_channel_animation_replay:true},
  hold:{finite_thickness_collision:true,guides:true,actuator:true,housing:true,force_and_material:true},
  authority:{new_study:false,new_f_a0_finding:false,publication:false,physical_mechanism_claim:false},
  identity_effect:{new_global_ids:[],new_relations:[],carrier_merge:false}
};

if(process.argv.includes('--write')){
  const target=path.join(root,'results/a0-lantern-crown-source-replay-return-2026-10-29.json');
  fs.writeFileSync(target,JSON.stringify(receipt,null,2)+'\n');
}
console.log(JSON.stringify({status:receipt.status,geometry:`${geometry.passed}/${geometry.total}`,glb:`${glbChecks.filter(Boolean).length}/${glbChecks.length}`,total:receipt.total_deterministic_checks,maxAnimationPositionError},null,2));
