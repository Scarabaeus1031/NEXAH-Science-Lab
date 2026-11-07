const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const H=require('./a0-reciprocal-angle-hinge.js');let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};const ok=(v,m)=>{assert.ok(v,m);checks++};const near=(a,b,e=1e-10,m)=>{assert.ok(Math.abs(a-b)<=e,m||`${a} ~= ${b}`);checks++};
eq(H.gcd(12,8),4,'gcd');eq(H.ratio(4,6),{p:2,q:3},'reduce');
assert.throws(()=>H.ratio(0,1));checks++;assert.throws(()=>H.ratio(1,-1));checks++;
const expected=[['1:2',26.56505117707799],['2:3',33.690067525979785],['1:1',45],['3:2',56.309932474020215],['2:1',63.43494882292201]];
eq(H.PRESETS.map(r=>H.presetKey(r.p,r.q)),expected.map(x=>x[0]),'complete five-ray fan');
for(const [key,a] of expected){const [p,q]=key.split(':').map(Number);near(H.angleDeg(p,q),a);near(H.complementError(p,q),0);eq(H.reciprocal(p,q),H.ratio(q,p),'reciprocal');}
const pairs=[[[1,2],[2,1]],[[2,3],[3,2]],[[1,1],[1,1]]];
for(const [[p,q],[u,v]] of pairs){eq(H.reciprocal(p,q),{p:u,q:v});near(H.angleDeg(p,q)+H.angleDeg(u,v),90);}
const s=H.signedState(1,2,3),f=H.flip(s),c=H.cycle(s);
eq({side:s.side,p:s.p,q:s.q},{side:1,p:2,q:3});eq({side:f.side,p:f.p,q:f.q},{side:-1,p:3,q:2});eq({side:c.side,p:c.p,q:c.q},{side:1,p:2,q:3});
assert.throws(()=>H.angleDeg(1,Math.sqrt(3)));checks++;
near(Math.atan2(Math.sqrt(3),1)*180/Math.PI,60,1e-12,'60 degree ratio is sqrt(3):1');
const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
for(const token of ['reciprocal-angle-hinge-return-20261106','data-reciprocal-angle-hinge','1:2','2:3','1:1','3:2','2:1','60° = arctan(√3)','keine physikalische Licht- oder Cube-Mechanik'])ok(html.includes(token),'html token '+token);
ok(html.includes('a0-reciprocal-angle-hinge.css'),'style bound');ok(html.includes('a0-reciprocal-angle-hinge.js'),'runtime bound');
ok(!html.includes('data-reciprocal-angle-hinge data-autoplay'),'no autoplay contract');
console.log(JSON.stringify({status:'PASS',checks,exact:'positive reciprocal ratios mirror around 45 degrees; swap squared returns signed state',boundary:'display adapter only; 60 degrees belongs to sqrt(3):1 and is not one of the rational fan presets'},null,2));
