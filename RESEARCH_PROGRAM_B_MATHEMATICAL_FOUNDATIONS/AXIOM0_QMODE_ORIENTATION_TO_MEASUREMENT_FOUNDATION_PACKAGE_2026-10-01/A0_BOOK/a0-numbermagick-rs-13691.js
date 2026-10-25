/* Exact bounded witness for the 13691 / 37 / angle-address bridge. */
'use strict';

function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a}
function isPrime(n){if(!Number.isSafeInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true}
function factor(n){if(!Number.isSafeInteger(n)||n<2)throw Error('factor expects an integer >= 2');const out=[];let rest=n;for(let d=2;d*d<=rest;d++)while(rest%d===0){out.push(d);rest/=d}if(rest>1)out.push(rest);return out}
function nthPrime(index){if(!Number.isSafeInteger(index)||index<1)throw Error('prime index must be >= 1');let count=0;for(let n=2;;n++)if(isPrime(n)&&++count===index)return n}
function result(){
  const n=13691;
  return {
    schema:'nexah.a0.numbermagick-research-snapshot/1.0.0',
    status:'PASS_EXACT_FINITE_NUMBER_RELATIONS',
    scope:'Exact integer, prime-index, factor and finite angle-address relations only',
    identityReuse:['MOD:NUMBER_VIEW_SUITE','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'],
    core:{n,prime:isPrime(n),primeIndex:1618,primeAtIndex:nthPrime(1618),decimalFrame:'1|369|1'},
    exactRelations:{
      predecessor:'13691-1=13690=10*1369=10*37^2',
      center:'1369=37^2',
      framedMiddle:'369=9*41=3^2*41',
      angleCarrier:'111=3*37',
      angleControl:'333=9*37=3*111'
    },
    outlets:[
      {offset:-1,value:13690,prime:false,factors:factor(13690)},
      {offset:0,value:13691,prime:true,factors:factor(13691)},
      {offset:1,value:13692,prime:false,factors:factor(13692)}
    ],
    angleAddress:{modulus:120,gcd37:gcd(37,120),inverse37:13,gcd111:gcd(111,120),unique111:120,unique333:40},
    ownerNotes:['369-1','0','2-9','-1 41','outlets'],
    ownerNoteBoundary:'retained reading tokens only; source normalization and operator meaning remain open',
    provenanceBoundary:'The arithmetic is independently reproducible; the historical source for the 13691 notation remains open under A0-BL-037.',
    claimBoundary:'No number mysticism, universal code, physical mechanism, new canonical operator, Study, Finding or publication claim.'
  };
}

const api={gcd,isPrime,factor,nthPrime,result};
if(typeof module==='object'&&module.exports)module.exports=api;
