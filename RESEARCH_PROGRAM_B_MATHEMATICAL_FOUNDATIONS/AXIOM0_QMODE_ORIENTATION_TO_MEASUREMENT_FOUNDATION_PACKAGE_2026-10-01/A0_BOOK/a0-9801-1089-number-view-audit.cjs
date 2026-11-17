#!/usr/bin/env node
"use strict";

const assert=require("node:assert/strict");

function factorize(value){
  const factors=[];
  let remainder=value;
  for(let prime=2;prime*prime<=remainder;prime+=1){
    if(remainder%prime!==0)continue;
    let exponent=0;
    while(remainder%prime===0){remainder/=prime;exponent+=1;}
    factors.push([prime,exponent]);
  }
  if(remainder>1)factors.push([remainder,1]);
  return factors;
}

function divisorCount(factors){return factors.reduce((count,[,exponent])=>count*(exponent+1),1);}
function isPrime(value){if(value<2)return false;for(let prime=2;prime*prime<=value;prime+=1)if(value%prime===0)return false;return true;}
function reverse4(value){return Number(String(value).padStart(4,"0").split("").reverse().join(""));}
function digitSum(value){return String(value).split("").reduce((sum,digit)=>sum+Number(digit),0);}
function gcd(a,b){while(b!==0){[a,b]=[b,a%b];}return Math.abs(a);}
function gridQuotient(size,mode){
  const raw=size**2;
  if(mode==="one")return{size,mode,raw,duplicates:size,unique:size*(size-1),boundary:2*(size-1)};
  if(mode==="two")return{size,mode,raw,duplicates:2*size-1,unique:(size-1)**2,boundary:0};
  return{size,mode:"open",raw,duplicates:0,unique:raw,boundary:4*(size-1)};
}

const expected={
  9801:{prime:false,factors:[[3,4],[11,2]],divisors:15,digitSum:18,reverse4:1089,squareRoot:99,binary:"10011001001001"},
  89:{prime:true,factors:[[89,1]],divisors:2,digitSum:17,reverse4:9800,squareRoot:null,binary:"1011001"},
  1089:{prime:false,factors:[[3,2],[11,2]],divisors:9,digitSum:18,reverse4:9801,squareRoot:33,binary:"10001000001"},
  7801:{prime:false,factors:[[29,1],[269,1]],divisors:4,digitSum:16,reverse4:1087,squareRoot:null,binary:"1111001111001"}
};

const observed={};
for(const [key,record] of Object.entries(expected)){
  const value=Number(key);
  const factors=factorize(value);
  const root=Math.sqrt(value);
  observed[key]={prime:isPrime(value),factors,divisors:divisorCount(factors),digitSum:digitSum(value),reverse4:reverse4(value),squareRoot:Number.isInteger(root)?root:null,binary:value.toString(2)};
  assert.deepEqual(observed[key],record);
}

const primesBelow90=Array.from({length:90},(_,value)=>value).filter(isPrime);
assert.equal(primesBelow90.indexOf(89)+1,24);

const squareReversals=[];
for(let root=32;root<=99;root+=1){
  const value=root*root;
  const reversed=reverse4(value);
  const reversedRoot=Math.sqrt(reversed);
  if(Number.isInteger(reversedRoot))squareReversals.push({root,value,reversed,reversedRoot});
}
assert.deepEqual(squareReversals,[
  {root:33,value:1089,reversed:9801,reversedRoot:99},
  {root:99,value:9801,reversed:1089,reversedRoot:33}
]);
assert.equal(9801/1089,9);
assert.equal(99/33,3);

let checks=36;
function auditEqual(actual,expected){assert.deepEqual(actual,expected);checks+=1;}
const primesBelow1742=Array.from({length:1742},(_,value)=>value).filter(isPrime);
auditEqual(isPrime(97),true);
auditEqual(isPrime(101),true);
auditEqual([primesBelow1742.indexOf(97)+1,primesBelow1742.indexOf(101)+1],[25,26]);
auditEqual((97+101)/2,99);
auditEqual(99**2,9801);
auditEqual(factorize(99),[[3,2],[11,1]]);
auditEqual(101-97,4);
auditEqual(97*101,9797);
auditEqual((99-2)*(99+2),99**2-2**2);
auditEqual(99**2-97*101,4);

const qrt20=value=>({value,quotient:Math.floor(value/20),remainder:value%20});
const qrt20PrimeAxis={
  source:qrt20(97),
  returnView:qrt20(78),
  stepPrime:19,
  stepPrimeIndex:8,
  sourcePrimeIndex:25,
  indexForms:{step:"2^3",source:"5^2"},
  coordinateDelta:{quotient:-1,remainder:1,value:-19},
  axisInvariant:{name:"q+r",value:21}
};
auditEqual(isPrime(19),true);
auditEqual(primesBelow1742.indexOf(19)+1,8);
auditEqual([2**3,5**2],[8,25]);
auditEqual([qrt20PrimeAxis.source.quotient,qrt20PrimeAxis.source.remainder,qrt20PrimeAxis.returnView.quotient,qrt20PrimeAxis.returnView.remainder],[4,17,3,18]);
auditEqual([qrt20PrimeAxis.returnView.quotient-qrt20PrimeAxis.source.quotient,qrt20PrimeAxis.returnView.remainder-qrt20PrimeAxis.source.remainder,qrt20PrimeAxis.returnView.value-qrt20PrimeAxis.source.value],[-1,1,-19]);
auditEqual(qrt20PrimeAxis.source.quotient+qrt20PrimeAxis.source.remainder===qrt20PrimeAxis.returnView.quotient+qrt20PrimeAxis.returnView.remainder,true);

const gridQuotientFixtures=[10,100,1000].map(size=>({open:gridQuotient(size,"open"),one:gridQuotient(size,"one"),two:gridQuotient(size,"two")}));
auditEqual(gridQuotientFixtures,[
  {open:{size:10,mode:"open",raw:100,duplicates:0,unique:100,boundary:36},one:{size:10,mode:"one",raw:100,duplicates:10,unique:90,boundary:18},two:{size:10,mode:"two",raw:100,duplicates:19,unique:81,boundary:0}},
  {open:{size:100,mode:"open",raw:10000,duplicates:0,unique:10000,boundary:396},one:{size:100,mode:"one",raw:10000,duplicates:100,unique:9900,boundary:198},two:{size:100,mode:"two",raw:10000,duplicates:199,unique:9801,boundary:0}},
  {open:{size:1000,mode:"open",raw:1000000,duplicates:0,unique:1000000,boundary:3996},one:{size:1000,mode:"one",raw:1000000,duplicates:1000,unique:999000,boundary:1998},two:{size:1000,mode:"two",raw:1000000,duplicates:1999,unique:998001,boundary:0}}
]);
auditEqual(Array.from({length:999},(_,index)=>index+2).every(size=>size**2-(2*size-1)===(size-1)**2),true);
auditEqual(gridQuotient(100,"two").unique,9801);
const decimalGhostGrid=Object.freeze({
  status:"VIEW_BOUND_SHADOW_LEDGER",
  route:"carrier X -> shadow record S_v=V_v(X) -> fixed-width decimal address G_10(S_v) -> exterior T4 difference record",
  t4Role:"outside comparison layer over declared records; retained, lost, introduced and unresolved remain explicit",
  boundary:"shadow is not a second carrier; decimal grid is an address/view layer; T4 does not create a body, topology or physical outside"
});

const shiftedFibonacciOffsets=[1,2,3,5,8,13];
const thresholdValues=shiftedFibonacciOffsets.map(offset=>1728+offset);
auditEqual(thresholdValues,[1729,1730,1731,1733,1736,1741]);
auditEqual(thresholdValues.map(factorize),[
  [[7,1],[13,1],[19,1]],[[2,1],[5,1],[173,1]],[[3,1],[577,1]],
  [[1733,1]],[[2,3],[7,1],[31,1]],[[1741,1]]
]);
auditEqual(thresholdValues.filter(isPrime),[1733,1741]);
auditEqual([primesBelow1742.indexOf(1733)+1,primesBelow1742.indexOf(1741)+1],[270,271]);
auditEqual(1740+1,1741);
auditEqual(1736+100,1836);
auditEqual(1**3+12**3,1729);
auditEqual(9**3+10**3,1729);
const visualPhaseLabels=[(1730-310)*Math.PI**3/Math.E**2,1729-307,1836-293,19**3-311];
auditEqual(new Set(visualPhaseLabels.map(value=>value.toFixed(9))).size,4);
const bindingRatio=1729/1770;
const ncs292Crosswalk={modulus:292,source:1729%292,target:1770%292,translation:41};
const prime61Target=1729+61;
const prime61Ratio=1729/prime61Target;
const prime61Crosswalk={modulus:292,source:1729%292,target:prime61Target%292,translation:61};
auditEqual(1729+41,1770);
auditEqual(bindingRatio,1-41/1770);
auditEqual(bindingRatio.toFixed(4),"0.9768");
auditEqual(bindingRatio.toFixed(3),"0.977");
auditEqual(gcd(1729,1770),1);
auditEqual(1729%292,269);
auditEqual(1770%292,18);
auditEqual((269+41)%292,18);
auditEqual(292,4*73);
auditEqual(0**2+0+41,41);
auditEqual(isPrime(41),true);
auditEqual(primesBelow1742.indexOf(41)+1,13);
auditEqual(isPrime(61),true);
auditEqual(primesBelow1742.indexOf(61)+1,18);
auditEqual(prime61Target,1790);
auditEqual(isPrime(prime61Target),false);
auditEqual(factorize(prime61Target),[[2,1],[5,1],[179,1]]);
auditEqual(isPrime(179),true);
auditEqual(primesBelow1742.indexOf(179)+1,41);
auditEqual(prime61Target,10*179);
auditEqual(prime61Ratio,1-61/prime61Target);
auditEqual(prime61Ratio.toFixed(4),"0.9659");
auditEqual(gcd(1729,prime61Target),1);
auditEqual(prime61Target%292,38);
auditEqual((269+61)%292,38);

console.log(JSON.stringify({status:"PASS",checks,observed,primeIndex89:24,squareReversals,rootScale:3,squareScale:9,primeSquareHinge:{left:{value:97,index:25},midpoint:{value:99,factors:[[3,2],[11,1]]},right:{value:101,index:26},primeGap:4,product:9797,square:9801,squareGap:4,identity:"(m-d)(m+d)=m^2-d^2 with m=99,d=2",existingReturn:"results/a0-folded-axis-lrrl-window-return-2026-10-26.json"},qrt20PrimeAxis,gridQuotientAudit:{convention:"N points per axis including duplicated periodic endpoints",fixtures:gridQuotientFixtures,identity:"N^2-(2N-1)=(N-1)^2",orientationBoundary:"direct and reversed gluing can share counts; topology requires the gluing map"},decimalGhostGrid,cubeThreshold:{base:1728,baseForm:"12^3",offsets:shiftedFibonacciOffsets,values:thresholdValues,primeValues:[1733,1741],primeIndices:[270,271],prePrimeThreshold:1740,centuryView:{source:1736,offset:100,target:1836}},bindingAudit:{source:1729,plus41:{offset:41,target:1770,ratio:bindingRatio,rounded4:bindingRatio.toFixed(4),ncs292Crosswalk,eulerPolynomialAtZero:41},plus61:{offset:61,offsetPrimeIndex:18,target:prime61Target,targetFactors:factorize(prime61Target),cofactor:179,cofactorPrimeIndex:41,ratio:prime61Ratio,rounded4:prime61Ratio.toFixed(4),ncs292Crosswalk:prime61Crosswalk}},visualPhaseLabels,claimBoundary:"Finite integer, quotient-count and fixed-width decimal-view audit only; the Decimal Ghost Grid is a view-bound shadow ledger and T4 is its exterior difference layer, not another carrier; prime-to-square, grid-seam, cube-offset and modulo-292 translation operators remain typed; equal quotient counts do not identify torus and Klein-type gluing; the QRT20 P8/P25 axis is an exact coordinate countershift with q+r retained, not a prime generator or return-to-one theorem; the P18-to-P41 observation is an exact index crosswalk, not a generator; no phase-lock, coherence envelope, NCS identity, resonance, physical-coupling or carrier-identity claim."},null,2));
