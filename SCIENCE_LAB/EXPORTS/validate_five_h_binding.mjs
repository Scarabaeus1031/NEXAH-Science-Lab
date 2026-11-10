import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const bindingUrl = new URL("NEXAH_FIVE_H_ONE_Q_CUT_BINDING.json", import.meta.url);
const binding = JSON.parse(await readFile(bindingUrl, "utf8"));
const sourceUrl = new URL(binding.canonical_surface.path, root);
const source = await readFile(sourceUrl, "utf8");
const sha256 = createHash("sha256").update(source).digest("hex");

assert.equal(binding.identity_effect, "REUSES_EXISTING_IDENTITIES_ONLY");
assert.equal(binding.canonical_surface.entity_id, "ART:FIVE_H:ONE_Q_CUT");
assert.equal(binding.canonical_surface.module_id, "MOD:FIVE_H_PHASE_CUT");
assert.equal(binding.related_identity, "SCC-003 / A0OE:PASCAL_PENTAGON_D5_TEST");
assert.equal(sha256, binding.canonical_surface.sha256);
assert.deepEqual(binding.contract, ["Hⱼ", "Q°", "ΠQ", "TRACE", "MASK", "T³(q)"]);
assert.equal(binding.navigator_effect.new_entities, 0);
assert.equal(binding.navigator_effect.new_relations, 0);
assert.equal(binding.navigator_effect.new_aliases, 0);

for (const token of ["Hⱼ", "Q°", "ΠQ", "TRACE", "MASK", "T³(q)"]) {
  assert.ok(source.includes(token), `canonical surface is missing ${token}`);
}

for (const token of ["ι · IOTA CUT", "CODED ROLES · OPERATOR LAYER", "HELD READING · reader aliases, no operator identity"]) {
  assert.ok(source.includes(token), `canonical surface is missing reading boundary ${token}`);
}

for (const token of ["5-STRING LOOP · OFF", "FIVE-STRING SCORE · 5 SAITEN · Q° = TAKTSTRICH", "½ NODE · 24 h HINGE"]) {
  assert.ok(source.includes(token), `canonical surface is missing score-loop token ${token}`);
}

for (const path of Object.values(binding.bindings).filter((value) => !value.includes(":"))) {
  await readFile(new URL(path, root));
}

console.log(JSON.stringify({
  status: "PASS",
  binding_id: binding.binding_id,
  canonical_sha256: sha256,
  identity_effect: binding.identity_effect,
  navigator_effect: binding.navigator_effect
}, null, 2));
