const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const digest = (relative) => crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, relative)))
  .digest("hex");

const science = read("A0_RESEARCH_DESK.html");
const builder = read("A0_BUILDER_LOG.html");
const receipt = JSON.parse(read("results/a0-observer-lens-iota-return-closeout-2026-11-19.json"));
const manifest = JSON.parse(read("assets/observer-lens/MANIFEST.json"));

assert.match(science, /id="observer-lens-iota-return-closeout-20261119"/);
assert.match(science, /A0_BUILDER_LOG\.html#observer-lens-iota-return-builder-20261119/);
assert.match(builder, /id="observer-lens-iota-return-builder-20261119"/);
assert.match(builder, /A0_RESEARCH_DESK\.html#observer-lens-iota-return-closeout-20261119/);
assert.equal(receipt.owner_view, "A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS");
assert.equal(receipt.navigator_delta.identities, 0);
assert.equal(receipt.navigator_delta.relations, 0);
assert.equal(receipt.navigator_delta.nodes_after, 332);
assert.equal(receipt.navigator_delta.relations_after, 32);
assert.equal(receipt.authorization.commit, true);
assert.equal(receipt.authorization.push, true);
assert.equal(receipt.authorization.deployment, false);
assert.equal(receipt.authorization.publication, false);
assert.equal(receipt.authorization.nexah_de_integration, false);
assert.equal(receipt.authorization.english_localization, false);
assert.equal(manifest.owner_view, receipt.owner_view);
assert.equal(manifest.new_navigator_identities.length, 0);
assert.equal(manifest.new_navigator_relations.length, 0);

for (const asset of manifest.assets) {
  assert.equal(digest(`assets/observer-lens/${asset.file}`), asset.sha256);
}

assert.ok(fs.existsSync(path.join(root, "A0_NEWTON_GOETHE_OBSERVER_LENS.html")));
assert.ok(fs.existsSync(path.join(root, "underwindows/double-pentagon-book/index.html")));

console.log("A0 Observer Lens return closeout: 22 assertions PASS");
