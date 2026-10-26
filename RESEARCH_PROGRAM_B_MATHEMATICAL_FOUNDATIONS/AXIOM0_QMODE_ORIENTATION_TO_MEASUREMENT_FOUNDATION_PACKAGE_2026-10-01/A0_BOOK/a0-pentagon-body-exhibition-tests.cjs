'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const html=fs.readFileSync(path.join(root,'A0_PENTAGON_BODY_EXHIBITION.html'),'utf8');
const assets=[
  'assets/vendor/model-viewer.min.js',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/visuals/candidates/NEXAH_PENTAGON_GELENKLATERNE_TESTED_GEOMETRY_OPEN_MECHANISM_2026-10-25.png',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/visuals/candidates/NEXAH_PENTAGON_CURTAIN_CONSTRUCTION_STUDY.png',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/visuals/direct/01-central-ring-five-windows.png',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/visuals/direct/04-ten-fields-rgb-route.png',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/visuals/context/02-counterrotation-diagonals.png',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb',
  'downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb'
];
for(const asset of assets){assert.ok(fs.existsSync(path.join(root,asset)),`missing asset: ${asset}`);assert.ok(html.includes(path.basename(asset)),`asset not linked: ${asset}`)}
for(const phrase of ['DIRECT','CONTEXT','CANDIDATE','MECHANISM OPEN','STRUCTURAL PASS','Neue kanonische Identität, Relation, Study, Finding oder Publikationsfreigabe','View ≠ Evidence'])assert.match(html,new RegExp(phrase));
assert.equal([...html.matchAll(/class="science-card"/g)].length,3);
assert.equal([...html.matchAll(/src:base\+'visuals\//g)].length,5);
for(const file of assets.filter(asset=>asset.endsWith('.glb'))){const data=fs.readFileSync(path.join(root,file));assert.equal(data.subarray(0,4).toString('ascii'),'glTF');assert.equal(data.readUInt32LE(4),2)}
console.log('PASS · Pentagon Body Exhibition · 5 curated slides · 3 science lenses · 2 GLB candidates · source-bound boundaries');
