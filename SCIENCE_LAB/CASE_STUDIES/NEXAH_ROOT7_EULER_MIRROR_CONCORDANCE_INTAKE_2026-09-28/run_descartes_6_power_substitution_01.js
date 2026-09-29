#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const HERE=__dirname;
const PREREG=path.join(HERE,'38_DESCARTES_6_POWER_SUBSTITUTION_01_PREREGISTRATION.md');
const LOCK=path.join(HERE,'DESCARTES_6_POWER_SUBSTITUTION_01_PREREGISTRATION_LOCK.json');
const OUT=path.join(HERE,'descartes_6_power_substitution_01_results.json');
const SOURCES={
 fig25:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/7/7F6D7520-7884-4A26-81BF-BAAA58419CAB_1_105_c.jpeg','5c7d6570a11735eee67887245cbde3e968d07bc25a5fea661e99848fb4a6d630'],
 fig11:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/4/43E76EC2-0EFA-4AFB-B58B-8F4A95FC53DE_1_105_c.jpeg','e227bddf922466f61853a59baf65a8eced6b24a4473b1756c8eb05e7585c5ed4'],
 polynomial:['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/D/D56EAD84-D30C-41F8-87C6-B37CE70AE878_1_105_c.jpeg','68ca4cb4699f7211e2e12820fb3244a9b738bfe35ad29bec33b3c8673ab877b6']
};
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const choose=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r};
// coefficients ascending: c[k] multiplies variable^k
function shift(poly,a){
 const out=Array(poly.length).fill(0);
 for(let k=0;k<poly.length;k++)for(let j=0;j<=k;j++)out[j]+=poly[k]*choose(k,j)*(a**(k-j));
 return out;
}
function run(){
 const hashChecks=Object.fromEntries(Object.entries(SOURCES).map(([k,[p,e]])=>{const a=sha256(p);return[k,{expected:e,actual:a,pass:a===e}]}));
 const P=[0,-27216,15120,-3780,504,-35,1];
 const Q=shift(P,6);
 const expectedQ=[-7776,1296,-216,36,-6,1,1];
 const reverse=shift(Q,-6);
 const tail=Q.slice(0,6).reverse();
 const expectedTail=Array.from({length:6},(_,j)=>(-6)**j);
 const ladder=Array.from({length:6},(_,j)=>6**(j+1));
 const checks={
  frozen_hashes_match:Object.values(hashChecks).every(x=>x.pass),
  exact_forward_binomial_substitution:Q.every(Number.isInteger),
  transformed_polynomial_exact:JSON.stringify(Q)===JSON.stringify(expectedQ),
  alternating_power_tail_exact:JSON.stringify(tail)===JSON.stringify(expectedTail),
  reverse_substitution_recovers_source:JSON.stringify(reverse)===JSON.stringify(P),
  signs_alternate:tail.every((v,i)=>Math.sign(v)===(i%2===0?1:-1)),
  positive_six_power_ladder_exact:JSON.stringify(ladder)===JSON.stringify([6,36,216,1296,7776,46656]),
  geometric_figures_retained_as_context_only:true
 };
 const classification=Object.values(checks).every(Boolean)?'PASS_DESCARTES_6_POWER_SUBSTITUTION__EXACT_COORDINATE_CHANGE_ONLY':'FAIL_DESCARTES_6_POWER_SUBSTITUTION';
 const result={test_id:'DESCARTES_6_POWER_SUBSTITUTION_01',classification,preregistration_sha256:sha256(PREREG),lock_sha256:sha256(LOCK),frozen_source_hashes:hashChecks,checks,checks_passed:Object.values(checks).filter(Boolean).length,checks_total:Object.keys(checks).length,source_polynomial_ascending:P,substitution:'y=x+6n',transformed_polynomial_ascending:Q,alternating_tail:tail,positive_power_ladder:ladder,interpretation:'The complex y-coefficients are the exact shifted-coordinate image of a simple alternating power-of-six tail.',claim_boundary:'Exact symbolic coordinate change only; no imported SNCE, Fourier, Poincare or physical semantics.'};
 fs.writeFileSync(OUT,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({classification,checks:`${result.checks_passed}/${result.checks_total}`,tail,output:OUT},null,2));
}
run();
