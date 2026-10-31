'use strict';
const assert=require('node:assert'),fs=require('node:fs'),path=require('node:path'),M=require('./a0-number-representation-plug.js');let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++};
const root=__dirname,html=fs.readFileSync(path.join(root,'A0_WERKBANK.html'),'utf8'),css=fs.readFileSync(path.join(root,'a0-number-representation-plug.css'),'utf8'),desk=fs.readFileSync(path.join(root,'A0_RESEARCH_DESK.html'),'utf8'),builder=fs.readFileSync(path.join(root,'A0_BUILDER_LOG.html'),'utf8'),binder=JSON.parse(fs.readFileSync(path.join(root,'../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json'),'utf8')),receipt=JSON.parse(fs.readFileSync(path.join(root,'results/a0-number-representation-plug-return-2026-10-31.json'),'utf8'));
for(const step of [0,8,16])for(const port of ['DEC','BIN','QRT20']){const r=M.model(step,port);ok(r.receipt.status==='EXACT_RETURN'&&r.receipt.decoded===r.integer,`${port} n${step}`)}
const terrace=M.model(8,'TERRACE'),verified=M.verify();
ok(terrace.terrace.address==='b1 / s0'&&terrace.receipt.status==='RESIDUAL','terrace is cursor projection');
ok(terrace.reading.value==='b1 / s0 · k8','terrace active address');
ok(terrace.receipt.witness==='SOURCE_INTEGER_REQUIRED','terrace requires source witness');
ok(M.model(0).lantern.event==='OPEN'&&M.model(8).lantern.event==='STOP'&&M.model(16).lantern.event==='EXACT_RETURN','lantern is local output');
ok(verified.status==='PASS_TYPED_REPRESENTATION_BUS'&&verified.checks===13,'model verifier');
ok(html.includes('id="numberRepresentationPlug"')&&html.includes('data-nrp-stage'),'Workbench assembly');
ok(html.includes('a0-number-representation-plug.js?rev=number-plug-r3-20261031'),'runtime binding');
ok(css.includes('.nrp-plug')&&css.includes('.nrp-port.is-residual'),'visual contract');
ok(receipt.status==='PASS_TYPED_REPRESENTATION_BUS_BROWSER_ACCEPTED','receipt status');
ok(receipt.identity.new_ids===0&&receipt.identity.new_relations===0,'governance');
ok(desk.includes('id="number-representation-plug-return-20261031"'),'science return binding');
ok(builder.includes('id="number-representation-plug-builder-return-20261031"'),'builder return binding');
ok(binder.number_representation_plug_return_20261031?.representation_contract?.exact_ports?.length===3,'evidence lineage binding');
console.log(JSON.stringify({status:'PASS',checks,scope:'Number Plug typed representation bus with exact DEC/BIN/QRT20 return, Terrace residual, and Lantern view output'}));
