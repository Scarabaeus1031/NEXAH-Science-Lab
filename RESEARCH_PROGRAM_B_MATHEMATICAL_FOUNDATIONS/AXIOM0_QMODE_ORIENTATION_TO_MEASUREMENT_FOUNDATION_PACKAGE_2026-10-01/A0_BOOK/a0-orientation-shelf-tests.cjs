const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const model = require('./a0-orientation-shelf.js');
const html = fs.readFileSync(path.join(__dirname,'A0_LIVING_BLUEPRINT.html'),'utf8');
const record = require('./assets/a0-living-blueprint-v1.json');
assert.equal(model.rows.length,6);
assert.deepEqual(model.rows.map(row=>row.title),record.orientation_shelf.rows);
assert.equal(record.orientation_shelf.new_graph_relation,false);
assert.equal(model.rows.flatMap(row=>row.tools).length,18);
assert.equal(model.rows.flatMap(row=>row.snapshots).length,7);
assert.deepEqual(new Set(model.rows.flatMap(row=>row.snapshots).map(snapshot=>snapshot.family)),new Set(['F1','F2','F3','F4','F5','F6','F7']));
for(const snapshot of model.rows.flatMap(row=>row.snapshots)){
  assert.ok(fs.existsSync(path.resolve(__dirname,decodeURIComponent(snapshot.src))),`Missing snapshot ${snapshot.src}`);
  const [file]=snapshot.href.split('#');
  assert.ok(fs.existsSync(path.resolve(__dirname,decodeURIComponent(file))),`Missing snapshot target ${snapshot.href}`);
}
for(const m of model.moduli)for(let n=0;n<60;n++)assert.equal(model.remainder(n,m),n%m);
assert.equal(model.remainder(-1,5),4);
const titles=new Set();
for(const row of model.rows)for(const tool of row.tools){
  assert.ok(!titles.has(tool.title),`Duplicate tool ${tool.title}`);titles.add(tool.title);
  for(const key of ['input','output','use','state'])assert.ok(tool[key]);
  for(const href of [tool.href,...tool.links.map(link=>link[1])]){
    const [file,anchor]=href.split('#');
    const target=file?path.resolve(__dirname,decodeURIComponent(file)):path.join(__dirname,'A0_LIVING_BLUEPRINT.html');
    assert.ok(fs.existsSync(target),`Missing source ${href}`);
    if(!file&&anchor)assert.ok(html.includes(`id="${anchor}"`),`Missing local anchor ${anchor}`);
  }
}
assert.ok(titles.has('NEON · Cartography ≠ Ontology'));
assert.ok(html.includes('BASE ≠ MOD ≠ GRID ≠ MODE'));
assert.ok(html.includes('a0-orientation-shelf.js'));
assert.ok(html.includes('id="shelfSearch"'));
console.log('PASS: 6 task shelves, 18 tool places, modular readouts and all source targets');
