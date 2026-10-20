#!/usr/bin/env node
const assert = require("node:assert/strict");
const api = require("./assets/a0-blue-body-interior-crt16-v1.js");

let assertions = 0;
const check = (condition, message) => { assertions += 1; assert.ok(condition, message); };
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };

const validation = api.validateAdapter();
equal(validation.records, 48, "adapter must expose 48 records");
equal(validation.sourceKeys, 48, "all source keys must be unique");
equal(validation.displayKeys, 48, "all display keys must be unique");
equal(validation.collisionFree, true, "16 x 3 adapter must be collision-free");
equal(validation.roundTrips, true, "all addresses must round-trip");
equal(validation.moduliAreLabelsOnly, true, "prime moduli must remain labels only");

const q4Values = new Set();
for (let channel = 0; channel < 16; channel += 1) {
  const q4 = api.ringGray(channel);
  q4Values.add(q4);
  equal(api.inverseRingGray(q4), channel, `Gray-ring inverse failed for channel ${channel}`);
}
equal(q4Values.size, 16, "Gray-ring channel map must be bijective");

for (let layer = 0; layer < 3; layer += 1) {
  for (let channel = 0; channel < 16; channel += 1) {
    const bound = api.bind(layer, channel);
    const returned = api.unbind(bound.sourceKey);
    equal(returned.sourceKey, bound.sourceKey, `source-key return failed for ${bound.sourceKey}`);
    equal(returned.channel, channel, `channel return failed for ${bound.sourceKey}`);
    equal(returned.layer, layer, `layer return failed for ${bound.sourceKey}`);
    equal(returned.modulusLabel, api.MODULI[channel], `modulus label drifted for channel ${channel}`);
  }
}

const base = api.frame(2, 7, 0, 1);
const changedView = api.frame(2, 7, 5, 0.2);
const basePoint = base.projections.front.find((entry) => entry.sourceKey === base.source.sourceKey);
const changedPoint = changedView.projections.front.find((entry) => entry.sourceKey === changedView.source.sourceKey);
check(
  base.source.sourceKey === changedView.source.sourceKey
    && (basePoint.x !== changedPoint.x || basePoint.y !== changedPoint.y),
  "phase must animate display geometry without mutating the source address"
);
for (const view of api.VIEWS) {
  equal(base.projections[view].length, 48, `${view} must project all 48 addresses`);
  equal(base.projections[view].filter((entry) => entry.selected).length, 1, `${view} must select exactly one address`);
  equal(base.projections[view].find((entry) => entry.selected).sourceKey, base.source.sourceKey, `${view} must retain source key`);
  check(base.projections[view].every(entry => Number.isInteger(entry.channel) && Number.isInteger(entry.layer)), `${view} must preserve channel/layer renderer metadata`);
}

const pass = api.receipt({ sourceKey: base.source.sourceKey, viewKeys: api.VIEWS.map(() => base.source.sourceKey), witness: true });
equal(pass.status, "PASS_EXACT_ADDRESS_RETURN", "complete witness must pass");
equal(pass.residual, 0, "exact address return must have zero residual");
const missing = api.receipt({ sourceKey: base.source.sourceKey, viewKeys: api.VIEWS.map(() => base.source.sourceKey), witness: false });
equal(missing.status, "HOLD_MISSING_WITNESS", "withheld witness must fail closed");
const divergent = api.receipt({ sourceKey: base.source.sourceKey, viewKeys: [base.source.sourceKey, base.source.sourceKey, "P0:0000", base.source.sourceKey], witness: true });
equal(divergent.status, "HOLD_VIEW_DIVERGENCE", "view-key divergence must fail closed");
equal(api.receipt({ sourceKey: "bad", viewKeys: [], witness: true }).status, "HOLD_INVALID_ADDRESS", "invalid address must fail closed");

for (const view of api.VIEWS) {
  const p = api.project({ x: 1, y: 2, z: 0 }, view);
  check(Number.isFinite(p.x) && Number.isFinite(p.y), `${view} projection must remain finite`);
}

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  adapter: "I16 x P3 -> Q4 x P3",
  addresses: validation.records,
  views: api.VIEWS,
  return: { pass: pass.status, withheld: missing.status, divergence: divergent.status },
  boundary: api.CLAIM_BOUNDARY
}, null, 2));

// Exercise the actual mounted renderer: the prior model-only checks missed NaN labels.
const fs=require('node:fs');
class El { constructor(value=''){this.value=value;this.checked=false;this.events={};this.dataset={};this.innerHTML='';this.textContent='';}addEventListener(k,f){this.events[k]=f;}setAttribute(){}fire(k){this.events[k]?.();} }
const els=Object.fromEntries(['interiorChannel','interiorLayer','interiorAperture','interiorPhaseBack','interiorPhaseForward','interiorPlay','interiorWitness','interiorReadout','interiorReceipt','interiorChannelValue','interiorLayerValue','interiorApertureValue','interiorPhase','interiorFieldStrength','interiorFieldLabels','interiorFieldValue'].map(id=>[id,new El()]));
els.interiorChannel.value='11';els.interiorLayer.value='1';els.interiorAperture.value='.25';els.interiorWitness.checked=true;els.interiorFieldStrength.value='.65';
const svgs=Object.fromEntries(api.VIEWS.map(view=>[view,new El()])),root={querySelector(selector){if(selector.startsWith('#'))return els[selector.slice(1)];return svgs[/data-interior-view="([^"]+)"/.exec(selector)[1]];}};
const previousDocument=global.document;global.document={};const mounted=api.mount(root);global.document=previousDocument;
for(let i=0;i<5;i++)els.interiorPhaseForward.fire('click');
const sourceBefore=JSON.stringify(global.A0BlueBodyInteriorView.frame),receiptBefore=JSON.stringify(global.A0BlueBodyInteriorView.receipt),captures={};
equal(global.A0BlueBodyInteriorView.frame.source.sourceKey,'P1:1010','owner reference channel/layer must retain key');
for(const strength of ['0','.65','1']){
  els.interiorFieldStrength.value=strength;els.interiorFieldStrength.fire('input');captures[strength]=Object.fromEntries(api.VIEWS.map(view=>[view,svgs[view].innerHTML]));
  equal(JSON.stringify(global.A0BlueBodyInteriorView.frame),sourceBefore,'contrast must not mutate frame, phase, coordinates or aperture');equal(JSON.stringify(global.A0BlueBodyInteriorView.receipt),receiptBefore,'contrast must not mutate receipt');
  equal(global.A0BlueBodyInteriorView.field.historySamples,0,'spatial contrast must not invent time history');
  for(const view of api.VIEWS){const svg=svgs[view].innerHTML;check(!/NaN|undefined|Infinity/.test(svg),'rendered SVG must contain only finite labels/coordinates');equal((svg.match(/data-source-key=/g)||[]).length,48,'all source keys remain in renderer');equal((svg.match(/<text /g)||[]).length,1,'quiet view retains selected label only');equal((svg.match(/<line /g)||[]).length,strength==='0'?128:256,'soft pass duplicates exactly the 128 current edges');check(svg.includes('>12</text>'),'selected label must be channel 12, not NaN');}
}
els.interiorFieldLabels.checked=true;els.interiorFieldLabels.fire('change');for(const view of api.VIEWS)equal((svgs[view].innerHTML.match(/<text /g)||[]).length,48,'all channel labels can be restored');
els.interiorWitness.checked=false;els.interiorWitness.fire('input');equal(global.A0BlueBodyInteriorView.receipt.status,'HOLD_MISSING_WITNESS','field view must preserve fail-closed witness');mounted.stop();
console.log('PASS: actual four-view mount; finite channel/layer labels, 128 exact spatial edges plus optional same-frame soft pass, quiet/all labels, 0/65/100% contrast, unchanged source/receipt and missing-witness HOLD');
if(process.argv.includes('--preview')){
  const sharp=require(require.resolve('sharp',{paths:[process.env.A0_RUNTIME_MODULES]})),html=fs.readFileSync('./A0_TESSAREC_BLUE_BODY_LAB.html','utf8'),css=html.split('\n').find(line=>line.includes('.interior-lab{')).replaceAll('var(--gold)','#e5b340').replaceAll('var(--cyan)','#29c7ef').replaceAll('var(--mono)','monospace');
  (async()=>{for(const[strength,views]of Object.entries(captures)){const panels=api.VIEWS.map((view,i)=>`<svg x="${i%2*480}" y="${60+Math.floor(i/2)*330}" width="480" height="330" viewBox="0 0 320 220"><rect width="320" height="220" fill="#03101a"/><text x="12" y="16" fill="#cbe2ea" font-size="8">${view.toUpperCase()}</text>${views[view]}</svg>`).join('');await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720"><style>:root{--cyan:#29c7ef;--gold:#e5b340;--mono:monospace}${css}</style><rect width="960" height="720" fill="#061722"/><text x="20" y="32" fill="#ffe397" font-family="monospace" font-size="16">SPATIAL FIELD · ${Number(strength)*100}% · 12/16 · P1 · PHASE 5/12 · APERTURE .25</text>${panels}</svg>`)).png().toFile(`/private/tmp/a0-interior-field-${Number(strength)*100}.png`);}})().catch(error=>{console.error(error);process.exitCode=1;});
}
