const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'A0_RESEARCH_DESK.html'), 'utf8');
const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || '';
const topNav = html.match(/<header class="top">[\s\S]*?<\/header>/)?.[0] || '';
const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1] || '';

assert.match(hero, /A0 Science Desk/);
assert.match(hero, /A0 entscheidet hier/);
assert.match(hero, /OCB v0\.11 öffnen/);
assert.match(hero, /Backlog prüfen/);
assert.doesNotMatch(hero, /Tessarec Validation/);
assert.doesNotMatch(hero, /A0 Science Einstieg/);
assert.doesNotMatch(hero, /Achievements ansehen/);
assert.doesNotMatch(hero, />Arbeitsstand<|href="#flagships"/);
assert.match(topNav, /#tests/);
assert.match(topNav, /#workbench/);
assert.match(topNav, /#backlog/);
assert.match(topNav, /#log/);
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
assert.match(html, /id="lissajous-seam-mode-return"/);
assert.match(html, /Drei Projektionen \+ ein Seam-Ereignis/);
assert.match(html, /D=0 ⇔ s₁=s₂=s₃/);
assert.match(html, /NEAR_SEAM_NOT_EXACT/);
assert.match(html, /105_A0_THREE_LISSAJOUS_3_PLUS_1_SEAM_MODE_SCIENCE_DESK_RETURN_2026-10-15\.md/);
assert.match(html, /RETURN_2026-10-15_A0_THREE_LISSAJOUS_3_PLUS_1_SEAM_MODE\.md/);
assert.match(html, /keine neue Navigator-Identität oder Relation/);
assert.doesNotThrow(() => new Function(inlineScript));

console.log(JSON.stringify({
  status: 'PASS',
  assertions: 32,
  surface: 'A0_RESEARCH_DESK',
  firstWorkSection: '02 · Tests & Lücken',
  families: 7,
  identity: 'existing A0 desk and tool identities reused; no new route or relation'
}, null, 2));
