const fs=require('fs');const path=require('path');const assert=require('assert');
const root=__dirname;const html=fs.readFileSync(path.join(root,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');const css=fs.readFileSync(path.join(root,'a0-orientation-controller-bench.css'),'utf8');
const checks=[];function test(name,fn){fn();checks.push(name)}
test('three-way coupler is present',()=>{assert.match(html,/id="blindAdapterCoupler"/);assert.match(html,/J · Rθ · Eₛ/)});
test('source and return remain hidden before verdict',()=>{assert.match(html,/id="blindAdapterSource">HIDDEN/);assert.match(html,/id="blindAdapterReturn">HIDDEN/);assert.match(html,/dataset\.status='blind'/)});
test('verdict reveals the typed operator',()=>{assert.match(html,/function renderBlindVerdict/);assert.match(html,/glyph=\{J:'J',R:'Rθ',E:'Eₛ'\}/);assert.match(html,/challenge\.before\.side/);assert.match(html,/challenge\.after\.side/)});
test('selected wrong and expected correct adapters remain distinct',()=>{assert.match(html,/answer-failed/);assert.match(html,/answer-expected/);assert.match(css,/\.answer-expected/);assert.match(css,/\.answer-failed/)});
test('red source and green return are verdict-only',()=>{assert.match(css,/data-status="pass"/);assert.match(css,/border-color:var\(--red\)/);assert.match(css,/border-color:var\(--green\)/)});
test('blind panel owns a full verify row',()=>{assert.match(css,/\.bench-act-verify \.bench-act-stage>\.blind\{grid-column:1\/-1\}/)});
console.log(`A0 blind adapter coupler ${checks.length}/${checks.length} PASS`);checks.forEach(name=>console.log(`PASS · ${name}`));
