const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(`${__dirname}/A0_ORIENTATION_CONTROLLER_BENCH.html`, 'utf8');
const code = html.slice(html.indexOf('  function interruptMasterAutoTour()'), html.indexOf("  qsa('#carrier"));
const calls = [];
const context = {
  masterAutoTour: false,
  masterDemoState: {running: true, phaseIndex: 3, history: [{from: 'EDGE'}]},
  rootEngineState: {running: true}, pascalLensTimer: 1,
  C: {createMasterDemonstratorState: state => ({...state})},
  stopMasterDemo: () => calls.push('master'),
  renderMasterDemo: (scroll, execute) => {assert.equal(execute, false); calls.push('render');},
  holdPxaJourney: () => calls.push('pxa'),
  setRootEngineRunning: running => {assert.equal(running, false); calls.push('root');},
  stopPascalLensMotion: () => calls.push('lens'),
  document: {querySelector: () => ({classList: {remove: () => calls.push('fold')}})}
};
vm.createContext(context);
vm.runInContext(code, context);
context.pauseForHumanInteraction({isTrusted: true, target: {closest: () => ({id: 'pxaAperture'})}});
assert.equal(context.masterDemoState.running, false, 'Manual and auto demonstrations both pause');
assert.equal(context.masterDemoState.phaseIndex, 3, 'Current phase is retained');
assert.equal(context.masterDemoState.history.length, 1, 'History is retained');
for (const name of ['master', 'pxa', 'root', 'lens']) assert.ok(calls.includes(name));
calls.length = 0;
context.masterDemoState.running = true;
context.pauseForHumanInteraction({isTrusted: true, target: {closest: () => ({id: 'masterDemoStart'})}});
assert.equal(context.masterDemoState.running, true, 'Play/pause click keeps the current state for its own toggle handler');
assert.ok(!calls.includes('master'));
calls.length = 0;
context.pauseForHumanInteraction({isTrusted: false, target: {closest: () => null}});
assert.deepEqual(calls, [], 'Programmatic events do not interrupt the demonstration');
assert.ok(!html.includes('masterAutoTimer=setTimeout(startMasterAutoTour'), 'No automatic startup');
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
assert.doesNotThrow(() => new Function(script));
console.log('PASS: manual takeover, play toggle, state retention, no automatic startup');
