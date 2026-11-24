const M=require('./a0-primecube-model.js');

function assert(value,label){if(!value)throw new Error(`FAIL ${label}`)}
function lcm(a,b){return a/M.gcd(a,b)*b}
function jointPeriod(primes,bases=[10,20]){
  return bases.flatMap(base=>primes.map(p=>M.multiplicativeOrder(base,p))).reduce(lcm,1);
}

const Q=7*11*13;
const q=M.qCubeRecord();
assert(Q===1001,'Q modulus');
assert(q.carmichaelLambda===60,'lambda');
assert(q.forward.order===60&&q.base10Control.order===6,'declared base orders');
assert(q.exactReturn.forwardThenInverse===1&&q.exactReturn.power60===1,'exact returns');

const eligible=M.sieve(1111).filter(p=>M.gcd(p,20)===1);
const consecutive=[];
for(let i=0;i<=eligible.length-3;i++)if(jointPeriod(eligible.slice(i,i+3))===60)consecutive.push(eligible.slice(i,i+3));
assert(consecutive.length===1&&consecutive[0].join(',')==='7,11,13','unique consecutive prime triple');

const subsetCensus=limit=>{
  const ps=M.sieve(limit).filter(p=>M.gcd(p,20)===1);let total=0,hits=0;
  for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++)for(let k=j+1;k<ps.length;k++){total++;if(jointPeriod([ps[i],ps[j],ps[k]])===60)hits++}
  return{limit,total,hits};
};
const basePairs=[];
for(let b=2;b<=60;b++)if(M.gcd(b,Q)===1&&M.gcd(2*b,Q)===1)basePairs.push({b,twice:2*b,joint:jointPeriod([7,11,13],[b,2*b])});
assert(basePairs.length===42&&basePairs.every(item=>item.joint===60),'base-pair negative control');

const result={
  suite:'a0-cross-base-qcube-null-test',status:'PASS',classification:'ENGINEERING_FINDING_CANDIDATE_NOT_ADMITTED_FINDING',
  exact:{Q,factors:[7,11,13],phi:720,carmichaelLambda:60,order10:q.base10Control.order,order20:q.forward.order,inverse20:q.inverse.multiplier,power60:q.exactReturn.power60},
  controls:{eligiblePrimesThrough1111:eligible.length,consecutiveTriples:eligible.length-2,consecutiveHits:consecutive,subsetCensus:[subsetCensus(43),subsetCensus(111)],basePairsTested:basePairs.length,basePairsWithJoint60:basePairs.filter(item=>item.joint===60).length},
  conclusion:'Q=1001 supplies the exponent-60 CRT cuboid and T20 has maximal order 60. The 10/20 pair is not unique: every eligible (b,2b) control tested inherits the same joint 60 bound.',
  boundary:'Exact finite modular arithmetic only. No historical, physical, metrological, causal or canonical Q± identity claim.'
};
console.log(JSON.stringify(result,null,2));
