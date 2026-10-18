const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { STEPS, createController } = require('./a0-results-tour.js');

let assertions = 0;
function check(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

check(STEPS.length === 6, 'tour has six readable stations');
check(new Set(STEPS.map(step => step.id)).size === STEPS.length, 'station ids are unique');
for (const step of STEPS) {
  for (const key of ['id', 'status', 'title', 'question', 'result', 'useful', 'boundary', 'href', 'linkLabel']) {
    check(typeof step[key] === 'string' && step[key].trim().length > 0, `${step.id} has ${key}`);
  }
  const [relativeFile, anchor] = step.href.split('#');
  const target = path.resolve(__dirname, decodeURIComponent(relativeFile));
  check(fs.existsSync(target), `${step.id} source exists`);
  if (anchor && path.extname(target).toLowerCase() === '.html') {
    const targetHtml = fs.readFileSync(target, 'utf8');
    check(new RegExp(`(?:id|name)=["']${anchor}["']`).test(targetHtml), `${step.id} anchor exists`);
  }
}

const controller = createController(STEPS.length, 0);
const visited = [];
controller.subscribe(index => visited.push(index));
check(controller.index === 0, 'controller starts at first station');
controller.previous();
check(controller.index === 0, 'previous clamps at first station');
controller.next();
check(controller.index === 1, 'next advances');
controller.goTo(999);
check(controller.index === STEPS.length - 1, 'goTo clamps at last station');
controller.next();
check(controller.index === STEPS.length - 1, 'next clamps at last station');
controller.goTo(2);
check(controller.index === 2, 'direct station selection works');
controller.goTo(Number.NaN);
check(controller.index === 2, 'invalid index is ignored');
check(visited.join(',') === '0,1,5,5,2', 'subscribers receive deterministic bounded transitions');

console.log(JSON.stringify({
  status: 'PASS',
  assertions,
  surface: 'A0_RESULTS_TOUR',
  stations: STEPS.length,
  authority: 'existing Science Desk; no study, finding, family, carrier, route or relation created'
}, null, 2));
