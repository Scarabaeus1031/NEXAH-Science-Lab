'use strict';
const assert=require('node:assert/strict'),api=require('./a0-riemann-halfline-theta-return.js'),fs=require('node:fs');
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++};
const equal=(actual,expected,message)=>{assert.equal(actual,expected,message);checks++};
const deepEqual=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++};
const near=(a,b,t=1e-12)=>ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(a),Math.abs(b)),`${a} !~= ${b}`);
for(const m of [30,210,637,2849])for(const n of [-1,0,121,661,809,1729])equal(api.moduloReturn(n,m).exact,true);
for(const t of [.01,.1,1,10,100]){near(api.reciprocalReturn(t).returned,t);ok(api.thetaReturn(t).relativeResidual<1e-12)}
for(const sigma of [0,.1,.4,.5,.6,.9,1]){const r=api.mirrorReturn(sigma,14.134725);near(r.returned.re,sigma);near(r.mirror.re,1-sigma);equal(r.exact,true);equal(r.fixed,sigma===.5);near(r.sourceDistance,-r.mirrorDistance)}
equal(api.mirrorReturn(.4,7).mirror.re,.6);equal(api.mirrorReturn(.5,7).operatorType,'AFFINE_ANTI_HOLOMORPHIC_INVOLUTION');
equal(api.sieve(1111).count,186);equal(api.sieve(100000).count,9592);
near(api.logarithmicIntegral(2),1.0451637801174928,1e-13);
equal(api.schoenfeldBound(2656).inTheoremDomain,false);equal(api.schoenfeldBound(2657).inTheoremDomain,true);
const series=api.primeResidualSeries(100000,720);equal(series.primeCount,9592);equal(series.allSampledResidualsNegative,true);
const rec=api.buildRecord();deepEqual(rec.navigatorEffect,{newIdentities:0,newRelations:0,newStudies:0,newFindings:0});
const html=fs.readFileSync('./A0_RIEMANN_HALFLINE_THETA_RETURN.html','utf8'),desk=fs.readFileSync('./A0_RESEARCH_DESK.html','utf8');
for(const token of ['NO RIEMANN PROOF','DISPLAY EMBEDDING ONLY','IF RH','x ≥ 2657','EULER PRODUCT DOMAIN','a0-riemann-halfline-theta-return.js','AFFINE ANTI-HOLOMORPHE INVOLUTION','W²=id','Fix(W)','No-crossing','data-rht-mirror'])ok(html.toUpperCase().includes(token.toUpperCase()),token);
ok(desk.includes('riemann-halfline-theta-return-20261121'),'Science Desk return is linked');
console.log(JSON.stringify({status:'PASS',checks,mirrorFixtures:7,pi1111:186,pi100000:9592,thetaAudits:5,navigatorDelta:0},null,2));
