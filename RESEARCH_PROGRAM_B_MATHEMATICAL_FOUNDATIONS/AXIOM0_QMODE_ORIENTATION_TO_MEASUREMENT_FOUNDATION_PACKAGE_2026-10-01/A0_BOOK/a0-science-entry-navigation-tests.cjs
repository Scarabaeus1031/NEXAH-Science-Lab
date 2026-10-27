const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = __dirname;
const navigation = fs.readFileSync(path.join(root, "a0-context-navigation.js"), "utf8");
const science = fs.readFileSync(path.join(root, "A0_SCIENCE.html"), "utf8");
const connect = fs.readFileSync(path.join(root, "NEXAH_C_CONNECT.html"), "utf8");

assert.match(navigation, /summary\.setAttribute\("aria-label", laneIsCurrent \? `\$\{lane\.label\} Navigation öffnen`/,
  "the current Science house opens its integrated navigation");
assert.match(navigation, /if \(!laneIsCurrent\) \{[\s\S]*?window\.location\.href = lane\.entry;/,
  "an inactive Science house first enters the declared Science start page");
assert.match(navigation, /Daten & Register · finden und zuordnen/,
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
assert.match(science, /class="science-connect-dot"[^>]*href="NEXAH_C_CONNECT\.html#scientific-review"[^>]*aria-label="NEXAH Science Connect · Review oder Forschungsfrage"/,
  "NEXAH Science owns a labelled pink Connect point for Review and questions");
assert.match(science, /\.science-connect-dot:before\{[^}]*border-radius:50%[^}]*var\(--pink\)/,
  "the Science-specific Connect point is rendered as a pink circle");
assert.match(connect, /id="scientific-review"/,
  "the Science Connect entry resolves to an existing bounded section");

console.log(JSON.stringify({ status: "PASS", assertions: 12, surface: "NEXAH Science navigation" }, null, 2));
