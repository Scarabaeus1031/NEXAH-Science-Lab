'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=__dirname,html=fs.readFileSync(path.join(root,'A0_PRIMECUBE_GAP_FOLD_LAB.html'),'utf8');
const R=require('./a0-primecube-reviewer-packet.js');
let pass=0;const ok=(condition,label)=>{if(!condition)throw new Error(`FAIL: ${label}`);pass++;console.log(`PASS ${pass}: ${label}`)};
ok(R.VERSION==='1.0.0'&&R.SOURCE===496,'reviewer packet freezes version and source');
const figures=R.figureSpecs();
ok(Object.keys(figures).join('')==='CEF','three paper figures are exposed in C E F order');
ok(figures.C.id==='PC-RF-C-01'&&figures.C.ledger['Base 11']==='[0,1,4] · 411₁₁'&&figures.C.ledger['CRT 1001']==='(6,1,2)','Paper C carries exact independent addresses');
ok(figures.E.id==='PC-RF-E-01'&&figures.E.ledger.Closure==='102°·60=17·360°','Paper E carries exact finite W closure');
ok(figures.F.id==='PC-RF-F-01'&&figures.F.ledger.Carrier==='1111 = 101×11'&&figures.F.ledger.Shadow==='220 = 20×11','Paper F carries exact volume split');
ok(R.STAGES.map(item=>item.name).join('>')==='SOURCE>ADDRESS>VIEW>BOUNDARY>RETURN','reviewer demo has five ordered stages');
const receipt=R.buildReceipt(4,'C');
ok(receipt.complete&&receipt.source.return_exact&&receipt.source.n===496,'final receipt closes exact return');
ok(receipt.source.cube.x===0&&receipt.source.cube.y===1&&receipt.source.cube.z===4,'receipt retains exact Base-11 cube address');
ok(receipt.source.crt.mod7===6&&receipt.source.crt.mod11===1&&receipt.source.crt.mod13===2,'receipt retains exact CRT address');
ok(receipt.coverage.contracts_total===32&&receipt.coverage.demonstrators_bound===32,'contract/demo audit is complete at 32 of 32');
ok(Object.values(receipt.authority).every(value=>value===0||value===false),'receipt grants no identity research or publication authority');
ok(html.includes('id="primecube-reviewer-packet"')&&html.includes('data-pc-review-download-receipt'),'instrument binds reviewer packet and downloadable receipt');
ok(html.includes('a0-primecube-reviewer-packet.css')&&html.includes('a0-primecube-reviewer-packet.js'),'instrument loads reviewer packet assets');
const staticReceipt=JSON.parse(fs.readFileSync(path.join(root,'results/a0-primecube-reviewer-packet-2026-11-22.json'),'utf8'));
ok(staticReceipt.reviewer_demo.count===5&&staticReceipt.verified_register.contracts_total===32,'static receipt records five stages and 32 contracts');
for(const source of Object.values(staticReceipt.source_hashes)){
  const digest=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,source.path))).digest('hex');
  ok(digest===source.sha256,`static receipt hash ${source.path}`);
}
console.log(`\n${pass}/${pass} reviewer packet checks passed.`);
