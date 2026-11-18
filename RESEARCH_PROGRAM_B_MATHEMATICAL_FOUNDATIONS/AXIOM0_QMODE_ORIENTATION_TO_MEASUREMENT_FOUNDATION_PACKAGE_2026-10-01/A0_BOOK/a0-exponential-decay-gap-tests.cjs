'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const api=require('./a0-exponential-decay-gap.js');
let checks=0;
const near=(a,b,e=1e-12)=>{assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);checks++};
const ok=(v,m)=>{assert.ok(v,m);checks++};

assert.deepStrictEqual(api.BASES,[.429,.439,.456]);checks++;
for(const b of api.BASES){
  near(api.decay(b,0),1);
  ok(api.decay(b,1)<1&&api.decay(b,1)>0,`${b} remains in (0,1)`);
  for(let x=0;x<12;x+=.25)ok(api.decay(b,x+.25)<api.decay(b,x),`${b} strictly decreases`);
  ok(api.decay(b,100)>0,`${b} never reaches zero at finite x`);
  ok(api.decay(b,100)<1e-30,`${b} approaches zero`);
}
near(api.decay(.429,2),.184041);
near(api.decay(.429,4),.033871089681);
near(api.squaredExponentDecay(.429,0),.429);
near(api.squaredExponentDecay(.429,1),.184041);
near(api.squaredExponentDecay(.429,2),.033871089681);
near(api.squaredExponentDecay(.429,3),Math.pow(.429,8));
near(api.thresholdCrossing(.429,.1),Math.log(.1)/Math.log(.429));
ok(api.thresholdCrossing(.429,.1)>2&&api.thresholdCrossing(.429,.1)<3,'0.1 crossing is between x=2 and x=3');
const audit=api.audit();
ok(audit.status==='PASS_EXPONENTIAL_DECAY_BOUNDARY','audit pass');
ok(audit.simpleAndSquaredAreDistinct===true,'sequence types separated');
ok(audit.claims.specialTriangleRelation===false,'no triangle relation');
ok(audit.claims.reachesZeroAtFiniteExponent===false,'no finite zero');
ok(audit.newCanonicalIds.length===0&&audit.relationChanges.length===0,'graph delta zero');
const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'a0-exponential-decay-gap.css'),'utf8');
['id="grey-pink-decay-gap"','id="decayGapCanvas"','data-decay-mode="SQUARED"','0,429 → 0,184041 → 0,033871','SF-NUMBERMAGICK-2025-AUDIT','a0-exponential-decay-gap.js','a0-exponential-decay-gap.css'].forEach(token=>ok(html.includes(token),`HTML token ${token}`));
ok(css.includes('@media(max-width:820px)'),'responsive breakpoint');
ok(css.includes('--dg-pink:#ff54b9'),'pink role');
console.log(JSON.stringify({status:'PASS',checks,values:audit.values,threshold:audit.thresholds[0]},null,2));
