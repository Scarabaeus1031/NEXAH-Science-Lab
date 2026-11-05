const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const here = __dirname;
const state = JSON.parse(fs.readFileSync(path.join(here, "A0_CURRENT_STATE.json"), "utf8"));
const desk = fs.readFileSync(path.join(here, "A0_RESEARCH_DESK.html"), "utf8");
const runtime = fs.readFileSync(path.join(here, "a0-current-state-desk.js"), "utf8");
const navigation = fs.readFileSync(path.join(here, "a0-context-navigation.js"), "utf8");
const humanView = fs.readFileSync(path.join(here, "A0_NEXAH_APERTURE_JOURNEY.html"), "utf8");

assert.equal(state.schema, "nexah.a0.current-state-read-lens/1.0.0");
assert.equal(state.status, "INTERNAL_READ_ONLY_ORIENTATION_LENS");
assert.equal(state.records.length, 6);
assert.deepEqual(state.new_canonical_ids, []);
assert.deepEqual(state.relation_changes, []);
assert.equal(state.summary.active_research_cycles, 0);
assert.equal(state.summary.active_builds, 0);
assert.equal(state.summary.publication_authorized, false);
assert.equal(state.summary.outreach_authorized, false);
assert.equal(state.records.find(record => record.key === "the-machina").human_delta.readiness, "STRONGEST_NEXAHEDRON_CANDIDATE");
assert.equal(state.records.find(record => record.key === "a0-human-view").object_class, "EXISTING_SOURCE_BOUND_ORIENTATION_LENS");
assert.deepEqual(state.nexahedron_exit_rule.not_authorized, ["CONTACT", "OUTREACH", "PUBLICATION", "DEPLOYMENT"]);
assert.equal(state.nexahedron_exit_rule.required_sequence.length, 6);

for (const record of state.records) {
  assert.ok(record.object_class && record.status && record.authority && record.claim_ceiling && record.next_gate);
  for (const source of record.sources) {
    const localPath = decodeURIComponent(source.split("#")[0]);
    assert.ok(fs.existsSync(path.resolve(here, localPath)), `${record.key}: missing ${localPath}`);
  }
}

assert.match(desk, /a0-current-state-desk\.js\?rev=20261103-r1/);
assert.match(desk, /"a0-current-state"/);
assert.match(runtime, /Was ist draußen\. Was ist Staging\./);
assert.match(runtime, /Nicht hineinholen\. Kontrolliert hinausgeben\./);
new vm.Script(runtime, { filename: "a0-current-state-desk.js" });

for (const channel of ["science", "builder", "machina"]) {
  assert.match(navigation, new RegExp(`channel=${channel}#a0-current-state`));
}
assert.match(navigation, /"label": "A0 · Human View"/);
assert.match(navigation, /"entry": "A0_NEXAH_APERTURE_JOURNEY\.html#a0-human-overview"/);
assert.match(navigation, /readerLanes\.forEach\(\(lane\) =>/);
assert.doesNotMatch(navigation, /channel=human#a0-current-state/);
assert.match(navigation, /\["A0_GAME_OF_WORLDS\.html", "GAME OF WORLDS"/);
assert.doesNotMatch(runtime, /data-current-filter="human"/);
assert.match(runtime, /initialChannel === "human"/);
assert.match(runtime, /searchParams\.delete\("channel"\)/);
assert.match(runtime, /A0_NEXAH_APERTURE_JOURNEY\.html#a0-human-overview/);
assert.match(humanView, /id="a0-human-overview"/);
assert.match(humanView, /A0 \/ NEXAHEDRON Delta/);
assert.match(humanView, /id="human-view"/);

console.log(JSON.stringify({
  status: "PASS",
  records: state.records.length,
  channels: ["science", "builder", "machina"],
  canonical_changes: 0,
  relation_changes: 0
}, null, 2));
