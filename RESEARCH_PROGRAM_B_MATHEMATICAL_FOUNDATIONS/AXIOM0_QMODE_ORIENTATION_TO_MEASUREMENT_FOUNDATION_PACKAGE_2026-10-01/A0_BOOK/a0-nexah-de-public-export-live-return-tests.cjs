const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const here = __dirname;
const science = fs.readFileSync(path.join(here, "A0_RESEARCH_DESK.html"), "utf8");
const builder = fs.readFileSync(path.join(here, "A0_BUILDER_TOY_STORE.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(here, "a0-public-export-manifest.json"), "utf8"));
const receipt = JSON.parse(fs.readFileSync(path.join(here, "results/a0-nexah-de-public-export-live-return-2026-11-19.json"), "utf8"));

assert.equal(receipt.status, "DEPLOYED_AND_LIVE_VERIFIED");
assert.equal(receipt.source_authority.revision, "5d5e64f4746d559c83a2122160174f2d6aee3899");
assert.equal(receipt.channel_implementation.commit, "b01e8db2817429a942d35991107f27133c5d5a5d");
assert.equal(receipt.public_export.pages, manifest.pages.length);
assert.deepEqual(receipt.public_export.page_allowlist, manifest.pages);
assert.equal(receipt.live_smoke.status, "PASS_7_OF_7_HTTP_200");
assert.equal(receipt.navigator_effect.canonical_count_delta, 0);
assert.equal(receipt.desk_rebinding.science_desk.sha256, "fc45c11c78a4555d191f0ff6ed8b17731754845780ca5ba55a816ca3360dc193");
assert.equal(receipt.desk_rebinding.builder_desk.sha256, "a06321a5e373f04bb21f47c7c0d88bae13d825f79e457768be66e4d4f65b6f4f");
assert.equal(receipt.desk_rebinding.navigator_validation, "PASS_BASE_329_29_COMPOSED_332_32");
assert.equal(receipt.desk_rebinding.app_audit, "PASS_253_OF_253");

for (const [name, html] of [["Science Desk", science], ["Builder Desk", builder]]) {
  assert.match(html, /id="nexah-de-public-release-return-20261119"/, `${name} has the live return`);
  assert.match(html, /14 Seiten · 192 Dateien/, `${name} shows the exact allowlist count`);
  assert.match(html, /b01e8db/, `${name} shows the deployed channel commit`);
  assert.match(html, /a0-nexah-de-public-export-live-return-2026-11-19\.json/, `${name} links the receipt`);
  assert.match(html, /A0_NEWTON_GOETHE_OBSERVER_LENS\.html/, `${name} lists the Observer Lens`);
}

console.log("A0 nexah.de public export live return: PASS");
