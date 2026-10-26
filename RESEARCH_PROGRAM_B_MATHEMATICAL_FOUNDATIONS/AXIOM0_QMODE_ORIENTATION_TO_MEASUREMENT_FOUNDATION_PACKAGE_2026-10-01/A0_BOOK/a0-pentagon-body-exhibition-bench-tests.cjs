const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'A0_ORIENTATION_CONTROLLER_BENCH.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'a0-pentagon-body-exhibition-bench.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'a0-pentagon-body-exhibition-bench.css'), 'utf8');
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const deskReturn = fs.readFileSync(path.join(root, 'a0-pentagon-body-science-return.js'), 'utf8');

assert.match(html, /id="pentagonBodyExhibitionBench"/);
assert.match(html, /id="pentagonExhibitionOpen"/);
assert.match(html, /id="pentagonExhibitionClose" disabled/);
assert.match(html, /A0_PENTAGON_BODY_EXHIBITION\.html#science-deck/);
assert.match(html, /A0_PENTAGON_BODY_RETURN_GUIDED\.html/);
assert.match(html, /A0_RESEARCH_DESK\.html#pentagon-lantern-finding-candidate-20261025/);
assert.match(html, /a0-pentagon-body-exhibition-bench\.css\?rev=20261025-r1/);
assert.match(html, /a0-pentagon-body-exhibition-bench\.js\?rev=20261025-r1/);
assert.match(js, /const source = 'A0_PENTAGON_BODY_EXHIBITION\.html#science-deck'/);
assert.match(js, /host\.replaceChildren\(frame\)/);
assert.match(js, /host\.replaceChildren\(\)/);
assert.match(css, /\.pentagon-exhibition-bench/);
assert.match(css, /\.peb-frame-host iframe/);
assert.match(desk, /a0-pentagon-body-science-return\.js\?rev=20261025-r1/);
assert.match(deskReturn, /pentagon-lantern-finding-candidate-20261025/);
assert.match(deskReturn, /A0_PENTAGON_BODY_EXHIBITION\.html#science-deck/);
assert.match(deskReturn, /A0_ORIENTATION_CONTROLLER_BENCH\.html#pentagonBodyExhibitionBench/);
assert.match(deskReturn, /keinen neuen wissenschaftlichen Status/);

console.log('A0 Pentagon Body Exhibition Bench tests: PASS');
