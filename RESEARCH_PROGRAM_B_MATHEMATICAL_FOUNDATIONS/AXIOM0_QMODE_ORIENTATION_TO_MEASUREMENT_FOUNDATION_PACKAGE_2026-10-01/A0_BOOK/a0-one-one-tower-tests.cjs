const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const A=require('./a0-one-one-bench.js'),M=require('./a0-game-of-numbers-model.js'),S=require('./a0-layered-pentagon-scene.js'),Stack=require('./a0-aperture-stack-calibration.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=v=>{assert.ok(v);checks++};
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),legend=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-muindi-tower-legend-v1.json','utf8'));
function labels(id){const list=html.match(new RegExp('<ol id="'+id+'">([\\s\\S]*?)</ol>'))[1];return[...list.matchAll(/<li>(.*?)<\/li>/g)].map(m=>m[1]);}
eq(labels('oneOnePlateLabels'),legend.aperture_plates_labels);
eq(labels('oneOneGlyphLabels'),legend.glyph_trace_labels);
eq(labels('oneOnePlateLabels').length,6);eq(labels('oneOneGlyphLabels').length,7);
eq(legend.row_correspondence,null);eq(legend.label_expansions,null);
eq(crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/assets/'+legend.source_asset)).digest('hex'),legend.source_sha256);
eq(crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/assets/a0-muindi-tower-legend-v1.json')).digest('hex'),'708a5cbe497159b56ad2fdb4597bd850fd682063e1a0373a945d13a7526f0563');
let record=Stack.buildRecord({plateIndex:0});const c=A.create(M,S,()=>record);
for(let n=0;n<6;n++){
 record=Stack.buildRecord({plateIndex:n});const s=c.snapshot();eq(s.stack.activePlate.index,n);eq(s.towerLegend.rowCorrespondence,null);eq(s.towerLegend.ownerProposal.collectedResidual,null);eq(s.towerLegend.ownerProposal.transportRule,null);eq(s.stack.return.residual,0);
}
const before=JSON.stringify(record);c.connect();c.station(180);c.check();c.returnCursor();eq(JSON.stringify(record),before);
eq(c.snapshot().towerLegend.binding,'DOCUMENTARY_ONLY');
for(const phrase of ['nicht bestimmt — nicht 0','keine Spaltenzuordnung','row_correspondence = null','5 Plate-Labels + RETURN','Orion/POLAR'])ok(html.includes(phrase));
const region=html.split('id="oneOneTower"')[1].split('</section>')[0];
for(const m of region.matchAll(/(?:href|src)="([^"]+)"/g)){
 const p=path.resolve(__dirname,m[1].split('#')[0]);ok(fs.existsSync(p));
}
const fake=id=>({id,textContent:'',innerHTML:'',dataset:{},addEventListener(){},querySelectorAll:()=>[]});
const ids=['oneOneTest','oneOneStatus','oneOneMixer','oneOneUpperAddress','oneOneStack','oneOneLowerAddress','oneOneReturn','oneOneResult','oneOneLedger','oneOneConnect','oneOneStep','oneOneCheck','oneOneReset','oneOneTowerPosition','oneOneTowerResidual'];
const nodes=Object.fromEntries(ids.map(id=>[id,fake(id)]));
const view=A.mount({getElementById:id=>nodes[id]},{A0GameOfNumbers:M,A0LayeredPentagonScene:S,A0ApertureStackController:{get record(){return record}}});
ok(nodes.oneOneTowerPosition.textContent.includes('n=5'));ok(nodes.oneOneTowerResidual.textContent.includes('residual 0'));ok(nodes.oneOneTowerResidual.textContent.includes('nicht bestimmt'));
eq(view.snapshot().towerLegend.ownerProposal.collectedResidual,null);
console.log(JSON.stringify({status:'PASS',checks,scope:'exact documentary label columns and immutable source hashes; six adapter positions kept separate; unknown collector residual never coerced to zero; existing source links and monitor readouts; browser pixels OPEN'}));
