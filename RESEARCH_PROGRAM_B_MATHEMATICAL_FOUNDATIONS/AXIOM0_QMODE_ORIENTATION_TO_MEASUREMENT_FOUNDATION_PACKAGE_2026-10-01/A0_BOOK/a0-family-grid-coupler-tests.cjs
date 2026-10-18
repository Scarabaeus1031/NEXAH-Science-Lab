'use strict';
const assert=require('node:assert/strict');const C=require('./a0-family-grid-coupler.js');let n=0;const ok=(value,message)=>{assert.ok(value,message);n++};
ok(C.VERSION==='1.0.0','version');ok(C.SIZE===11,'size');
for(let q=-22;q<=33;q++){const a=C.qAngle(q);ok(a.q>=0&&a.q<11,'normalized q');ok(Math.abs(a.radians-Math.PI*2*a.q/11)<1e-12,'radians');ok(Math.abs(a.degrees-360*a.q/11)<1e-12,'degrees')}
for(const mode of ['5+2x3','5+3x2']){const d=C.decomposeEleven(mode);ok(d.total===11,'eleven');ok(d.head+d.groups*d.width===11,'decomposition')}
for(const branch of ['c','d']){const f=C.cubicIharaFork(branch);ok(f.degree===3,'cubic');ok(f.allowedCount===2,'two forward turns');ok(f.blockedCount===1,'one reverse blocked');ok(f.directedEdgeStates===60,'source state count')}
let s=C.createState();for(let i=0;i<22;i++)s=C.step(s);ok(s.tick===0,'22-step closure');ok(s.ghost===10,'ghost retains previous pulse');ok(C.FLAVORS.length===5,'five lenses');ok(C.HANDLES.length===4,'four source roles');ok(C.GLB_CHANNELS.length===2,'two GLB export channels');ok(C.GLB_CHANNELS[0].id==='crystal'&&C.GLB_CHANNELS[1].id==='temporal-z','GLB roles retained');
ok(C.glbChannelForView('life')==='crystal','life reads crystal channel');ok(C.glbChannelForView('plate')==='temporal-z'&&C.glbChannelForView('cylinder')==='temporal-z','plate and cylinder read temporal-z relation channel');
console.log(`family-grid-coupler: ${n}/${n} PASS`);
