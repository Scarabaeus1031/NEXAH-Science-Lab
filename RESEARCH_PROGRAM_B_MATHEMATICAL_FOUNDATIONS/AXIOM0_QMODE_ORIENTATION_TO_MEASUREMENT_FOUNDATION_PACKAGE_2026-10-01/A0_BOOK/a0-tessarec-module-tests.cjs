const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = __dirname;
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const html = read('A0_LIVING_BLUEPRINT.html');
const section = html.match(/<section class="rooms" id="tessarec-module"[\s\S]*?<\/section>/)[0];
assert.equal((html.match(/id="tessarec-module"/g)||[]).length,1);
assert.equal((section.match(/<article class="room">/g)||[]).length,4);
assert.equal((section.match(/<li><h3>/g)||[]).length,6,'six reverse-history stages');
assert.match(section,/id="tessarec-development" open/);
assert.match(section,/id="tessarec-visual-provenance"/);
assert.match(section,/Noch keine vollständige bildweise Zuordnung/);
for(const [,src] of section.matchAll(/<img[^>]*src="([^"]+)"/g)) assert.ok(fs.existsSync(path.resolve(root,src)),src);
function localVisualCount(file) {
  let count=0;
  function walk(o) {
    if(!o || typeof o!=='object') return;
    if(typeof o.path==='string' && o.path.startsWith('/Users/') && o.sha256) count++;
    Object.values(o).forEach(walk);
  }
  walk(JSON.parse(read(file)));
  return count;
}
assert.equal(localVisualCount('assets/a0-root7-wing-sequence-v1.json'),6);
assert.equal(localVisualCount('assets/a0-layered-pentagon-scene-v1.json'),3);
let links=0;
for (const [,href] of section.matchAll(/href="([^"]+)"/g)) {
  const [file,anchor] = href.split('#');
  const target = path.resolve(root,decodeURIComponent(file));
  assert.ok(fs.existsSync(target),href);
  if (anchor && target.endsWith('.html') && !anchor.startsWith('entity=')) {
    const source = fs.readFileSync(target,'utf8');
    const routedTessarec = file === 'A0_FAMILY_CONNECTION_ATLAS.html' && anchor === 'tessarec' && source.includes("location.hash==='#tessarec'");
    assert.ok(source.includes('id="'+anchor+'"') || routedTessarec,href);
  }
  links++;
}
const registry = fs.readFileSync(path.resolve(root,'../../../SCIENCE_LAB/NAVIGATION/NEXAH_MODULE_REGISTRY_V2_2026-10-05.json'),'utf8');
const moduleRecord = registry.slice(registry.indexOf('"module_id": "MOD:TESSAREC"')).split('\n    },')[0];
assert.match(moduleRecord,/"current_master_surface": "ART:TESSAREC:Q_IOTA_PEARL"/);
assert.match(section,/NEXAH_TESSAREC_Q_IOTA_PEARL\.html/);
assert.match(section,/G1–G4 als Engineering-PASS und G5–G8 als offen/);
const nav=read('a0-context-navigation.js');
assert.match(nav,/Tessarec Modulkontext/);
assert.match(nav,/tessarecPages\.includes\(file\)/);
assert.match(nav,/Tessarec · Modulüberblick/);
assert.match(read('A0_RESEARCH_DESK.html'),/id="tessarec-module-return"/);
console.log(JSON.stringify({status:'PASS',cards:4,localLinks:links,identity:'MOD:TESSAREC reused',masterUnchanged:true,browserAcceptance:false}));
