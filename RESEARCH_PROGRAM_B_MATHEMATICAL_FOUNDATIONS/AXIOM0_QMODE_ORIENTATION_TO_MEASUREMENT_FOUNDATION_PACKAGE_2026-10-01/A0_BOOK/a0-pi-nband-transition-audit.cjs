'use strict';

const assert=require('node:assert/strict');
let checks=0;
const equal=(actual,expected)=>{assert.deepEqual(actual,expected);checks+=1;};
const close=(actual,expected,tolerance=1e-12)=>{assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);checks+=1;};
const mod=(value,base)=>((value%base)+base)%base;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const phase=(index,count)=>{const d=gcd(index,count);return[index/d,count/d];};

// One carrier path, two aligned discrete readers.
const platinum=Array.from({length:24},(_,index)=>phase(index,24));
const iridium=Array.from({length:12},(_,index)=>phase(index,12));
const decimate2=platinum.filter((_,index)=>index%2===0);
equal(decimate2,iridium);
equal(decimate2.length,12);
equal(platinum.length-iridium.length,12);

// Zipper / Janus involution commutes with the aligned even-sample decimation.
const j24=index=>mod(-index,24);
const j12=index=>mod(-index,12);
equal(Array.from({length:12},(_,index)=>j24(2*index)/2),Array.from({length:12},(_,index)=>j12(index)));
equal(Array.from({length:24},(_,index)=>j24(j24(index))),Array.from({length:24},(_,index)=>index));

// Exact N-band integer shadow behind the 1029 window.
const nBand={numerator:3,denominator:7};
const source=7**4;
const target=nBand.numerator*source/nBand.denominator;
equal(source,2401);
equal(target,1029);
equal(target,3*7**3);
equal([target%3,target%5],[0,4]);
equal(Array.from({length:12},(_,offset)=>({value:1029+offset,mod3:(1029+offset)%3,mod5:(1029+offset)%5})).filter(item=>item.mod3===0&&item.mod5===0).map(item=>item.value),[1035]);

// Decimal bands and nearby source labels remain typed apart.
const bandMilli=[429,456,487];
equal(bandMilli.reduce((sum,value)=>sum+value,0),1372);
close(3/7,0.42857142857142855);
const kappa=(1+Math.sqrt(5))**3/8/Math.PI**2;
close(kappa,0.4292034214696826);
close(kappa-3/7,0.0006319928982540,1e-15);
equal([432,439,456,487].map(value=>value/1000),[0.432,0.439,0.456,0.487]);

console.log(JSON.stringify({
  status:'PASS',
  checks,
  transitionConvention:'T_[i<-k] = T_[i<-j] o T_[j<-k]',
  dualSampling:{carrier:'same parametric oval',platinumSamples:24,iridiumSamples:12,operator:'Pi_Ir = D2 o Pi_Pt',sharedSamples:12,platinumOnly:12,zipperNaturality:'D2 o J24 = J12 o D2 on aligned even samples'},
  nBandIntegerShadow:{operator:'N(x)=3x/7',source:2401,sourceForm:'7^4',target:1029,targetForm:'3*7^3',window:'1029..1040',mod3Mod5Joint:[1035]},
  comparators:{bandMilli,bandSumMilli:1372,threeSevenths:3/7,kappaPhi3OverPi2:kappa,difference:kappa-3/7,decimalViewOnly:[432,439,456,487],held:['432/487 horizon','-992 Silver','0.439 label']},
  claimBoundary:'Exact finite sampling, involution, composition and N-band arithmetic only. PIT/TJP remain owner mnemonics until domains and codomains are declared. 432/487, -992 and 0.439 are not promoted from view labels to a common operator, physical spectrum or material law.'
},null,2));
