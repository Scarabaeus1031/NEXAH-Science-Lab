'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),a=require('node:assert/strict'),{verify}=require('./a0-pentagon-browser-run-verify.cjs');
const file=path.join(__dirname,'results/a0-pentagon-joint-browser-run-2026-10-17.json'),r=JSON.parse(fs.readFileSync(file,'utf8'));let checks=0;
a.equal(verify(r).status,'PASS');checks++;
for(const mutate of [
 x=>x.run.status='PAUSED',x=>x.run.confirmed=6,x=>x.run.acceptance.confirmedCues.reverse(),
 x=>x.pentagon.pending={seq:999},x=>x.run.acceptance.baseline.state.dRegister=4,
 x=>x.pentagon.history.at(-2).witness.revision--,x=>x.pentagon.history.push({kind:'HOLD'}),
 x=>x.run.acceptance.receipt.anchor.kind='EXPLICIT_UI_ANCHOR',
 x=>x.pentagon.currentWitness.rendered.mode='d30',
 x=>x.pentagon.history.splice(x.pentagon.history.length-3,1),
 x=>x.pentagon.history.at(-2).action='SET',x=>x.run.acceptance.receipt.full106NodeAddressProvided=true
]){
 const bad=structuredClone(r);mutate(bad);a.throws(()=>verify(bad));checks++;
}
const report=JSON.parse(fs.readFileSync(path.join(__dirname,'results/a0-pentagon-joint-browser-acceptance-2026-10-17.json'),'utf8'));
a.equal(report.export.sha256,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));checks++;
a.deepEqual(report.result,verify(r));checks++;
const bench=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(const target of ['results/a0-pentagon-joint-browser-run-2026-10-17.json','results/a0-pentagon-joint-browser-acceptance-2026-10-17.json','a0-pentagon-browser-run-verify.cjs','a0-pentagon-browser-run-tests.cjs']){
 a.ok(bench.includes('href="'+target+'"'));a.ok(fs.existsSync(path.join(__dirname,target)));checks+=2;
}
a.ok(bench.includes('PASS · Master–PENT'));a.ok(bench.includes('Gesamtverschaltung offen'));checks+=2;
console.log('PASS '+checks+' browser-export integrity, contract, negative-control and acceptance-link checks. No new browser run.');
