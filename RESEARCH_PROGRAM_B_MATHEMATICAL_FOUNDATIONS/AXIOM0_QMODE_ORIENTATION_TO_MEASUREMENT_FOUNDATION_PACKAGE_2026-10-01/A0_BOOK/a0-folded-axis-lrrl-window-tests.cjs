'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('./a0-folded-axis-lrrl-window.js');
let checks=0;
function check(value,message){assert.ok(value,message);checks+=1;}
function equal(a,b,message){assert.equal(a,b,message);checks+=1;}
equal(api.VERSION,'1.0.0','version');
equal(api.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','reuses identity');
equal(api.MODES.length,4,'four modes');
equal(api.LRRL.map(x=>x.token).join(''),'LRRL','token order');
equal(api.LRRL[0].color,'ORANGE','left outer orange');
equal(api.LRRL[1].color,'PURPLE_PINK','left inner purple/pink');
equal(api.LRRL[2].color,'PURPLE_PINK','right inner purple/pink');
equal(api.LRRL[3].color,'ORANGE','right outer orange');
const gates=api.gatePoints();
equal(gates.length,99,'exact gate count');
equal(new Set(gates.map(p=>`${p.row}:${p.col}`)).size,99,'unique grid addresses');
equal(new Set(gates.map(p=>p.index)).size,99,'unique indices');
check(gates.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),'finite coordinates');
const x=api.exact();
check(api.isPrime(97)&&api.isPrime(101),'white pins prime');
check(!api.isPrime(99),'red midpoint composite');
equal(x.pinLeft+x.pinRight,2*x.midpoint,'midpoint sum');
equal(x.pinLeft*x.pinRight,x.midpoint*x.midpoint-4,'product identity');
equal(x.factor99[0]*x.factor99[1],99,'99 factorization');
equal(96*102,9792,'negative product control one');
equal(98*100,9800,'negative product control two');
api.TOKENS.forEach(token=>{equal(token.status,'UNBOUND_OWNER_TOKEN',`${token.token} status`);equal(token.resolvedIdentity,null,`${token.token} unresolved`);});
check(!JSON.stringify(api.contract()).toLowerCase().includes('4869586'), 'no silent Arrokoth object alias');
check(Object.values(api.AUTHORITY).every(v=>v===false),'all authority flags false');
equal(api.contract().gateCount,99,'contract gate count');
const root=__dirname;
for(const file of ['A0_IOTA_BRIDGE_DEMONSTRATOR.html','A0_ORIENTATION_CONTROLLER_BENCH.html']){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  check(html.includes('id="foldedAxisLrrlWindow"'),`${file} contains window`);
  check(html.includes('a0-folded-axis-lrrl-window.js'),`${file} loads module`);
  check(html.includes('a0-folded-axis-lrrl-window.css'),`${file} loads style`);
}
const source=fs.readFileSync(path.join(root,'a0-folded-axis-lrrl-window.js'),'utf8');
check(source.includes('NO IMAGE-DERIVED COUNT'),'count boundary');
check(source.includes('NO ARROKOTH ALIAS'),'alias boundary');
console.log(`PASS · ${checks}/${checks} folded-axis LRRL checks`);
