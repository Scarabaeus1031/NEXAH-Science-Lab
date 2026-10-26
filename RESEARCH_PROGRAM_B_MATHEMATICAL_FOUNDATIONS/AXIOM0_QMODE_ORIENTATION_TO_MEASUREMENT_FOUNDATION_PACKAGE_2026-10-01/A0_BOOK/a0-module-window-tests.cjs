const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,file),'utf8');
const bridge=read('A0_IOTA_BRIDGE_DEMONSTRATOR.html');
const tower=read('A0_TOWER_RETURN_DEMONSTRATOR.html');
const js=read('a0-module-window.js');
const css=read('a0-module-window.css');

for(const html of [bridge,tower]){
  assert.match(html,/a0-module-window\.css\?rev=20261026-r1/);
  assert.match(html,/a0-module-window\.js\?rev=20261026-r1/);
  assert.match(html,/data-a0-window/);
}
assert.match(bridge,/data-a0-window[^>]+href="A0_BLUE_PINK_DODECA_CELL_RETURN\.html[^"']*#coupledChannelBoundaryLens"/);
assert.match(bridge,/data-a0-window[^>]+href="A0_ORIENTATION_CONTROLLER_BENCH\.html#iota23Bridge"/);
assert.match(tower,/data-a0-window[^>]+href="A0_ORIENTATION_CONTROLLER_BENCH\.html#towerShellReturn"/);
assert.match(tower,/data-a0-window[^>]+href="A0_ORIENTATION_CONTROLLER_BENCH\.html#iotaTowerReturnMatrix"/);
assert.match(js,/BENCH WINDOW · AUSGANGSPUNKT BLEIBT ERHALTEN/);
assert.match(js,/IN NEUEM TAB ÖFFNEN ↗/);
assert.match(js,/SCHLIESSEN · ZURÜCK ×/);
assert.match(js,/aria-modal/);
assert.match(js,/showModal/);
assert.match(js,/event\.key==='Escape'/);
assert.match(js,/frame\.src='about:blank'/);
assert.match(js,/win\.scrollTo\(\{left:restore\.x,top:restore\.y,behavior:'instant'\}\)/);
assert.match(js,/restore\.trigger\.focus\(\{preventScroll:true\}\)/);
assert.doesNotMatch(js,/location\.(?:href|assign|replace)\s*=/);
assert.match(css,/\.a0-module-window/);
assert.match(css,/position:fixed/);
assert.match(css,/height:min\(940px,calc\(100dvh - 24px\)\)/);
assert.match(css,/@media\(max-width:800px\)/);
console.log('a0 module window tests: PASS');
