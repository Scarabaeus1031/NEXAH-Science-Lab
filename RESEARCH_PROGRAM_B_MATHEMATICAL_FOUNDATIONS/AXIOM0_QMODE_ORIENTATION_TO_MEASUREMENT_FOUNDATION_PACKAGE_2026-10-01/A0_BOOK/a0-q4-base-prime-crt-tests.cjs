const fs=require('fs'),path=require('path'),api=require('./a0-q4-base-prime-crt.js');let passed=0,total=0;function check(ok,msg){total++;if(!ok)throw new Error(msg);passed++}
const v=api.verify();check(v.ok&&v.passed===218&&v.total===218,'module verification');
for(let x=0;x<210;x++)check(api.crt210(x%15,x%14)===x,`class ${x}`);
for(const [n,a,b,x] of [[1221,6,3,171],[123321,6,9,51],[1514,14,2,44],[34,4,6,34]]){const r=api.audit(n);check(r.r15===a&&r.r14===b,`residues ${n}`);check(r.result===x,`result ${n}`)}
const html=fs.readFileSync(path.join(__dirname,'A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html'),'utf8');for(const token of ['basePrimeCrtStage','base-prime-crt','15 = 3 × 5','14 = 2 × 7','2 × 3 × 5 × 7 = 210','CRT₍15,14₎'])check(html.includes(token),`HTML ${token}`);
const css=fs.readFileSync(path.join(__dirname,'a0-q4-base-prime-crt.css'),'utf8');for(const token of ['q4-crt-stage','q4-prime-seam','q4-crt-form','q4-crt-presets','q4-crt-output','q4-crt-boundary'])check(css.includes(token),`CSS ${token}`);
check(html.includes('a0-q4-base-prime-crt.js'),'script binding');check(!html.includes('29.02.1972')&&!html.includes('12.03.1974'),'no personal dates');
console.log(`PASS ${passed}/${total} · module ${v.passed}/${v.total} · identity delta 0`);
