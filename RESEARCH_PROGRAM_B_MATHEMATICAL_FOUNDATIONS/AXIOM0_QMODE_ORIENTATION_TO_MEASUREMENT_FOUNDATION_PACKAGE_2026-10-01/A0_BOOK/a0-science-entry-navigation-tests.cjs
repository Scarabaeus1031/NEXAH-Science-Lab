const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = __dirname;
const navigation = fs.readFileSync(path.join(root, "a0-context-navigation.js"), "utf8");
const science = fs.readFileSync(path.join(root, "A0_SCIENCE.html"), "utf8");
const connect = fs.readFileSync(path.join(root, "NEXAH_C_CONNECT.html"), "utf8");

assert.match(navigation, /summary\.setAttribute\("aria-label", laneIsCurrent \? `\$\{lane\.label\} Navigation öffnen`/,
  "the current Science house opens its integrated navigation");
assert.match(navigation, /if \(!laneIsCurrent && lane\.key !== "builder"\) \{[\s\S]*?if \(lane\.key !== "human"\) window\.location\.href = lane\.entry;/,
  "an inactive Science house first enters the declared Science start page while Builder keeps its integrated menu");
assert.match(navigation, /A0 NSNavigator · finden und zuordnen/,
  "Science navigation contains the source-bound data and register section");
assert.match(navigation, /"entry": "A0_SCIENCE\.html"/,
  "the declared Science entry is the actual document start of A0_SCIENCE");
assert.doesNotMatch(navigation, /"entry": "A0_SCIENCE\.html#top"/,
  "the Science entry does not skip its own navigation by targeting the hero anchor");
assert.doesNotMatch(navigation, /nexah-public-connect|connectDot/,
  "the global A0 header does not expose the former ambiguous pink Connect point");
assert.match(navigation, /header\.replaceChildren\(brand, laneNav, workspaceOverview, overview\)/,
  "the compact header contains no global Connect control");
assert.match(navigation, /a0-workspace-monogram[^>]*>[\s\S]*?TH[\s\S]*?Mission Control/,
  "Mission Control is represented by the compact TH owner signet");
assert.match(science, /href="A0_SCIENCE\.html" aria-current="page"/,
  "the local Science start control also returns to the full document start");
assert.doesNotMatch(science, /science-connect-dot|NEXAH_C_CONNECT\.html#scientific-review/,
  "the Science start page no longer duplicates the dedicated C Connect review route");
assert.match(connect, /class="route route-review" href="#scientific-review"/,
  "the dedicated C Connect surface retains the bounded scientific-review entrance");
assert.match(connect, /id="scientific-review"/,
  "the Science Connect entry resolves to an existing bounded section");

console.log(JSON.stringify({ status: "PASS", assertions: 12, surface: "NEXAH Science navigation" }, null, 2));
