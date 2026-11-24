const fs=require('fs');
const path=require('path');
const rail=require('./a0-numbermagick-plug-rail.js');
let checks=0;
function ok(condition,label){if(!condition)throw new Error(`FAIL: ${label}`);checks++;console.log(`ok ${checks} - ${label}`)}
const verified=rail.verify();
ok(verified.status==='PASS_NUMBERMAGICK_PLUG_RAIL','model verification');
ok(verified.checks===52,'all model branches verified');
for(const value of rail.CARRIERS){
  ok(rail.model(value,'DEC').result==='EXACT',`${value} decimal return`);
  ok(rail.model(value,'CRT105').result==='AMBIGUOUS',`${value} CRT partial boundary`);
}
ok(rail.model(1031,'ANTIPODE').reading.decoded===1031,'1031 antipode double return');
ok(rail.model(2037,'ANTIPODE').result==='AMBIGUOUS','2037 antipode stays domain-gated');
ok(rail.model(137,'QRT60',false).result==='WRONG_KEY','wrong key remains visible');
ok(rail.returnKey(137)===rail.returnKey(137),'return key deterministic');
ok(rail.returnKey(137)!==rail.returnKey(937),'return key binds held source');
const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'a0-numbermagick-plug-rail.css'),'utf8');
ok(html.includes('id="numbermagick-plug-rail"')&&html.includes('data-nmp-port="CRT105"')&&html.includes('data-nmp-port="ILAU"'),'rail markup installed');
ok(html.includes('a0-number-representation-plug.js?rev=numbermagick-plug-rail-r1-20261121'),'existing typed bus loaded');
ok(html.includes('a0.return-gate.v1</code> bleibt separat'),'angle receipt boundary explicit');
ok(css.includes('.nmp-rail')&&css.includes('[data-result=WRONG_KEY]'),'scoped visual states installed');
ok(rail.model().newCanonicalIds.length===0&&rail.model().relationChanges.length===0,'no graph identity or relation change');
console.log(JSON.stringify({status:'PASS',checks,modelChecks:verified.checks,newCanonicalIds:[],relationChanges:[]},null,2));
