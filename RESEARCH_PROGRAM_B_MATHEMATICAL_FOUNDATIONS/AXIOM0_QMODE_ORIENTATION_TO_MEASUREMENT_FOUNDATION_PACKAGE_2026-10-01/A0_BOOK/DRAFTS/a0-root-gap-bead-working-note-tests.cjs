const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'A0_ROOT_GAP_BEAD_25_31_WORKING_NOTE_2026-11-09.html'),'utf8');
let failures=0;
function ok(condition,label){if(condition)console.log('PASS',label);else{console.error('FAIL',label);failures++}}
function prime(n){if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true}
ok(/NOT_A_FINDING/.test(html)&&/NO_ROOT7_REOPEN/.test(html)&&/NO_SCC_CLAIM_EFFECT/.test(html),'claim boundaries are visible');
ok(/id="fold"/.test(html)&&/id="transfer"/.test(html)&&/id="gap"/.test(html),'three working views exist');
ok(28+28===56&&25+31===56&&7*8===56,'count invariant 56');
ok(prime(1429),'1429 is prime');
ok(31*211===6541,'6541 factorization');
ok(13*23===299&&1429+299===12**3&&12**3+1===1729,'1429 bridge to 1729');
ok(7*13*19===1729&&1**3+12**3===1729&&9**3+10**3===1729,'1729 identities');
ok(/B\(t\)=γ\(t\)/.test(html)&&/G\(t\)=n<sub>W<\/sub>·\(B\(t\)−W₀\)/.test(html)&&/g\(t\*\)=0/.test(html),'curved gap equations are present');
ok(/no node, relation, alias or semantic binding change/i.test(html),'Source Graph semantic non-effect is explicit');
ok(!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/i.test(html),'artifact is self-contained');
if(failures)process.exit(1);
