#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),R=require('./a0-machina-ac-carrier-router.js');
let n=0;const test=(value)=>{assert.ok(value);n+=1};
test(R.RECEIPTS.length===8);test(new Set(R.RECEIPTS).size===8);
test(R.sourceResidue(0)===0);test(R.sourceResidue(Math.PI)===14);test(R.sourceResidue(Math.PI*2)===0);test(R.sourceResidue(-Math.PI/2)===21);
const base=R.state();test(base.receipt==='P60');test(base.residue===0);test(base.krPort.id==='T0');test(base.tdPartner.id==='D3');test(base.returnMarker==='21');test(base.locatorMode==='TIP');test(base.locator.outside.address==='P60:OUTSIDE');test(base.followSource===true);
const q=R.state({source:27,quarter:1,krIndex:4,marker:'21',receipt:'Z28',followSource:false});test(q.residue===6);test(q.krPort.id==='D3');test(q.tdPartner.id==='T0');test(q.returnMarker==='06');test(q.receipt==='Z28');test(q.followSource===false);
for(let i=0;i<8;i++){const s=R.state({krIndex:i});test(s.tdPartner.id===require('./a0-machina-ac-carrier-contract.js').tdJanus(s.krPort).id)}
assert.throws(()=>R.sourceResidue(NaN));n+=1;
const html=fs.readFileSync('A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8');test(html.includes('id="machinaAcCarrierRouter"'));test(html.includes('a0-machina-ac-carrier-contract.js'));test(html.includes('a0-machina-ac-carrier-router.js'));test(html.includes('a0-machina-ac-carrier-router.css'));test(html.includes('data-ac-receipt="P60"'));test(html.includes('data-ac-receipt="K8"'));
test(html.includes('id="acLocatorDiagram"'));test(html.includes('data-ac-locator="OUTSIDE"'));test(html.includes('WHERE AM I?'));
console.log(`PASS · ${n} AC/TD-Janus router assertions · one source clock, read-only receipts`);
