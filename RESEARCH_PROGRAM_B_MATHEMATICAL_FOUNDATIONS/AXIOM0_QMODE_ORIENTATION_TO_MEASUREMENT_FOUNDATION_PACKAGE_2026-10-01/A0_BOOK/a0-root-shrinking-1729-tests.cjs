const fs=require('node:fs');
const M=require('./a0-root-shrinking-1729.js');
let passed=0;
function ok(value,label){if(!value)throw new Error(`FAIL ${label}`);passed++;console.log(`PASS ${label}`)}
function near(a,b,t,label){ok(Math.abs(a-b)<=t,label)}

const g1=M.rootGap(1),g2=M.rootGap(2),g10=M.rootGap(10),g1728=M.rootGap(1728);
near(g1.stable,Math.sqrt(2)-1,1e-15,'rationalized gap k=1');
near(g2.stable,Math.sqrt(3)-Math.sqrt(2),1e-15,'rationalized gap k=2');
ok(g1.stable>g2.stable&&g2.stable>g10.stable&&g10.stable>g1728.stable,'root gaps shrink across fixtures');
ok(g1728.ratioToAsymptotic<1&&g1728.ratioToAsymptotic>.999,'asymptotic ratio approaches one from below');
ok(g1728.exact==='1 / (√1729 + √1728)','exact adjacent-root label at 1728');
ok(g1728.adjacentIntegerResolved,'1728 adjacency resolved');
const huge=M.rootGap(1e30);
ok(!huge.adjacentIntegerResolved&&huge.boundary==='SCALE_ONLY_FLOAT64_ADJACENCY_NOT_RESOLVED','huge k is scale-only');
ok(huge.direct===0&&huge.stable>0,'stable form survives direct cancellation at 1e30');

for(let m=0;m<=8;m++){
  const t=M.thresholdForDecade(m),k=t.minimumK,eps=t.epsilon;
  ok(k!==null&&M.rootGap(k).stable<=eps,`threshold decade ${m} reaches epsilon`);
  if(k>1)ok(M.rootGap(k-1).stable>eps,`threshold decade ${m} is minimal`);
}
const t15=M.thresholdForDecade(15);
ok(t15.minimumK===null&&!t15.safeInteger,'10^-15 threshold exceeds safe integer range');
near(t15.kStar,2.5e29,2e14,'10^-15 threshold scale');

const joint=M.taxicabJoint();
ok(12**3===joint.n-1,'1728 equals 12 cubed');
ok(1**3+12**3===joint.n&&9**3+10**3===joint.n,'1729 has both declared cube paths');
ok(joint.factorization.reduce((a,b)=>a*b,1)===1729,'1729 factorization 7*13*19');
ok(/not the same operator/i.test(joint.boundary),'joint keeps root and cube operators separate');

const samples=M.curveSamples();
ok(samples.length===181,'default curve sample count');
ok(samples.every((p,i)=>i===0||p.logGap<samples[i-1].logGap),'sampled log gap is strictly decreasing');
const record=M.buildRecord(30,15);
ok(record.navigatorEffect.newIdentities===0&&record.navigatorEffect.newRelations===0,'zero graph delta');
ok(/algebraic power-law decay/i.test(record.boundary),'record rejects intrinsic logarithmic law');

const html=fs.readFileSync('./A0_ROOT_SHRINKING_1729_RETURN.html','utf8');
for(const marker of ['data-root-shrinking','data-rs-logk','data-rs-decade','data-rs-gap','data-rs-threshold','a0-root-shrinking-1729.js','1729 = 12³+1³ = 10³+9³'])ok(html.includes(marker),`HTML marker ${marker}`);
ok(/Spirale codiert nur Größenordnungen/i.test(html),'spiral is visibly typed as encoding');
ok(/Nicht behauptet werden eine intrinsische Root-Spirale/i.test(html),'claim boundary rejects intrinsic root spiral');
const desk=fs.readFileSync('./A0_RESEARCH_DESK.html','utf8');
ok(desk.includes('primecube-root-shrinking-intake-20261121'),'Science Desk intake recorded');
ok(desk.includes('Algebraisch, nicht logarithmisch'),'Science Desk records corrected decay type');

console.log(JSON.stringify({suite:'a0-root-shrinking-1729',passed,status:'PASS',scope:'stable adjacent-root gaps, epsilon thresholds, Float64 boundary, exact 1729 cube joint, Science Desk intake'},null,2));
