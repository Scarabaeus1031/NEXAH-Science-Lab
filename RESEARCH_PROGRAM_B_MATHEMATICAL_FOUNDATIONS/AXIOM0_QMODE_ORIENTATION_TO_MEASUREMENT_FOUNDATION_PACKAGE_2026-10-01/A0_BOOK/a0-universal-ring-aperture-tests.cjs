const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const root=__dirname;const api=require('./a0-universal-ring-aperture.js');const html=fs.readFileSync(path.join(root,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
const check=(value,message)=>assert.ok(value,message);
const base=api.metrics({rings:220,phase:.34,scale:1.004,aperture:.86,sample:1,palette:'orange'});
assert.equal(base.rings,220);assert.ok(Math.abs(base.radialBeat-250)<1e-9);assert.equal(base.displaySamples,220);assert.equal(api.normalizeState({rings:999}).rings,520);assert.equal(api.normalizeState({palette:'bogus'}).palette,'orange');
['universalRingAperture','uraRings','uraPhase','uraScale','uraAperture','uraSample','uraStatus'].forEach(id=>check(html.includes(`id="${id}"`),`bench contains ${id}`));
['FAM-009','HISTORICAL_STAGING','Source lines ≠ display samples','a0-universal-ring-aperture.js','a0-universal-ring-aperture.css'].forEach(token=>check(html.includes(token),`bench documents ${token}`));
console.log(JSON.stringify({status:'PASS',checks:14,scope:'FAM-009 source-bound ring aperture, resolution sampling and claim boundary'}));
