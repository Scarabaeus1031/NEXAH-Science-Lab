const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = __dirname;
const navigation = fs.readFileSync(path.join(root, "a0-context-navigation.js"), "utf8");
const science = fs.readFileSync(path.join(root, "A0_SCIENCE.html"), "utf8");
const connect = fs.readFileSync(path.join(root, "NEXAH_C_CONNECT.html"), "utf8");

assert.match(navigation, /summary\.setAttribute\("aria-label", laneIsCurrent \? `\$\{lane\.label\} Navigation öffnen`/,
  "the current Science house opens its integrated navigation");
assert.match(navigation, /readerLanes\.forEach\(\(lane\) => \{[\s\S]*?const panel = document\.createElement\("div"\);/,
  "each Reader house exposes its bounded navigation drawer without an implicit redirect");
assert.match(navigation, /A0 NSNavigator · finden und zuordnen/,
  "Science navigation contains the source-bound data and register section");
assert.match(navigation, /"entry": "A0_SCIENCE\.html#top"/,
  "the declared primary Science entry is the internal A0 Science Reader");
assert.match(navigation, /Intern · Arbeitsbereich[\s\S]*?A0_RESEARCH_DESK\.html/,
  "the Science Desk remains explicitly separated as an internal work area");
assert.match(navigation, /A0_SCIENCE\.html#contributions[\s\S]*?Konkrete Beiträge · Reader/,
  "the compact A0 Science edition remains explicitly available as a Reader");
assert.doesNotMatch(navigation, /nexah-public-connect|connectDot/,
  "the global A0 header does not expose the former ambiguous pink Connect point");
assert.match(navigation, /header\.replaceChildren\(brand, laneNav, workspaceOverview, overview\)/,
  "the compact header contains no global Connect control");
assert.match(navigation, /a0-workspace-monogram[^>]*>TH<[\s\S]*?Mission Control/,
  "the local Owner workspace keeps a clearly labelled Mission Control return");
assert.match(science, /id="top"[\s\S]*?href="#overview">Mit dem Überblick beginnen<\/a>/,
  "the internal Science Reader begins at its document start and leads into the overview");
assert.doesNotMatch(science, /science-connect-dot|NEXAH_C_CONNECT\.html#scientific-review/,
  "the Science start page no longer duplicates the dedicated C Connect review route");
assert.match(connect, /class="route route-review" href="#scientific-review"/,
  "the dedicated C Connect surface retains the bounded scientific-review entrance");
assert.match(connect, /id="scientific-review"/,
  "the Science Connect entry resolves to an existing bounded section");

console.log(JSON.stringify({ status: "PASS", assertions: 13, surface: "NEXAH Science navigation" }, null, 2));
