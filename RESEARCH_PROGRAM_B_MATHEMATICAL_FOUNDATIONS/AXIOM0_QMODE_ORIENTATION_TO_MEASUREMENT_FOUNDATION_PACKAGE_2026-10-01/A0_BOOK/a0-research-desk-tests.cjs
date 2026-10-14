const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'A0_RESEARCH_DESK.html'), 'utf8');
const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || '';
const topNav = html.match(/<header class="top">[\s\S]*?<\/header>/)?.[0] || '';
const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1] || '';

assert.match(hero, /Tests &amp; Lücken/);
assert.match(hero, /Backlog prüfen/);
assert.match(hero, /Verlauf lesen/);
assert.doesNotMatch(hero, /Tessarec Validation/);
assert.doesNotMatch(hero, /A0 Science Einstieg/);
assert.doesNotMatch(hero, /Achievements ansehen/);
assert.doesNotMatch(hero, />Arbeitsstand<|href="#flagships"/);
assert.match(topNav, /#tests/);
assert.match(topNav, /#workbench/);
assert.match(topNav, /#backlog/);
assert.doesNotMatch(topNav, /Laboratory/);
assert.doesNotMatch(topNav, /#method/);
assert.match(html, /id="workbench"/);
assert.match(html, /Papers sagen, was behauptet wird/);
assert.equal((html.match(/<details class="family-tools"/g) || []).length, 7);
assert.match(html, /F1–F7 sind funktionale Lesefamilien, keine Naturklassen/);
assert.match(html, /\["method", "lenses", "achievements", "flagships", "fields", "foundation", "protocols", "findings"\]/);
assert.match(html, /backlogSection\.before\(workbench\)/);
assert.match(html, /Active research cycles/);
assert.match(html, /Structure freeze/);
assert.match(html, /Not authorized/);
assert.doesNotThrow(() => new Function(inlineScript));

console.log(JSON.stringify({
  status: 'PASS',
  assertions: 22,
  surface: 'A0_RESEARCH_DESK',
  firstWorkSection: '02 · Tests & Lücken',
  families: 7,
  identity: 'existing Research Desk and tool identities reused; no new route or relation'
}, null, 2));
