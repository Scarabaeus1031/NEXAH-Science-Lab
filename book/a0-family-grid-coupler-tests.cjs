'use strict';
const assert=require('node:assert/strict');const C=require('./a0-family-grid-coupler.js');let n=0;const ok=(value,message)=>{assert.ok(value,message);n++};
ok(C.VERSION==='1.1.0','version');ok(C.SIZE===11,'size');ok(C.VIEWS.length===3,'three coupled view windows');
for(let q=-22;q<=33;q++){const a=C.qAngle(q);ok(a.q>=0&&a.q<11,'normalized q');ok(Math.abs(a.radians-Math.PI*2*a.q/11)<1e-12,'radians');ok(Math.abs(a.degrees-360*a.q/11)<1e-12,'degrees')}
for(const mode of ['5+2x3','5+3x2']){const d=C.decomposeEleven(mode);ok(d.total===11,'eleven');ok(d.head+d.groups*d.width===11,'decomposition')}
for(const branch of ['c','d']){const f=C.cubicIharaFork(branch);ok(f.degree===3,'cubic');ok(f.allowedCount===2,'two forward turns');ok(f.blockedCount===1,'one reverse blocked');ok(f.directedEdgeStates===60,'source state count')}
let s=C.createState();for(let i=0;i<22;i++)s=C.step(s);ok(s.tick===0,'22-step closure');ok(s.ghost===10,'ghost retains previous pulse');ok(C.FLAVORS.length===5,'five lenses');ok(C.HANDLES.length===4,'four source roles');ok(C.GLB_CHANNELS.length===2,'two GLB export channels');ok(C.GLB_CHANNELS[0].id==='crystal'&&C.GLB_CHANNELS[1].id==='temporal-z','GLB roles retained');
ok(C.glbChannelForView('life')==='crystal','life reads crystal channel');ok(C.glbChannelForView('plate')==='temporal-z'&&C.glbChannelForView('cylinder')==='temporal-z','plate and cylinder read temporal-z relation channel');
const bench={carrierId:'A0.CRT.CHANNEL/5x73',familyRole:'F7',address:[1,0,-1,2,0],orientation:72,iotaTick:73,iotaDrift:1,history:[{operatorId:'J'},{operatorId:'R'}]};
const projected=C.projectBenchState(bench),replay=C.projectBenchState(bench),changed=C.projectBenchState({...bench,address:[1,1,-1,2,0]});
ok(projected.bits.length===11&&projected.bits.every(bit=>bit===0||bit===1),'prime address projects to eleven binary view cells');
ok(projected.tick>=0&&projected.tick<11,'bound tick normalized');ok(projected.invertible===false,'projection remains explicitly non-invertible');
ok(JSON.stringify(projected)===JSON.stringify(replay),'same bench record replays deterministically');
ok(JSON.stringify(projected.bits)!==JSON.stringify(changed.bits)||projected.tick!==changed.tick,'prime-address change reaches coupled view');
ok(projected.bench.lastOperator==='R'&&projected.bench.historyLength===2,'operator chain reaches controller ledger');
console.log(`family-grid-coupler: ${n}/${n} PASS`);
