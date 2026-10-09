const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const engine = fs.readFileSync(path.join(root, "life-browser.js"), "utf8");

const checks = [
  ["direct-file scripts", /<script src="life-browser\.js"><\/script>[\s\S]*<script src="app\.js"><\/script>/],
  ["field canvas", /id="field-canvas"/],
  ["space-time canvas", /id="time-canvas"/],
  ["slice control", /id="slice-range"/],
  ["causal inspector", /V6 · CAUSAL INSPECTOR/],
  ["return display", /id="return-type"/],
  ["scope boundary", /NO GLB · NO E8 · NO CLAIM PROMOTION/],
  ["B3/S23 engine", /const RULE = "B3\/S23"/],
  ["finite-dead engine", /const BOUNDARY = "finite-dead"/],
  ["no remote resources", /^(?![\s\S]*(https?:\/\/|fetch\(|XMLHttpRequest|WebSocket))[\s\S]*$/],
];

checks.forEach(([name, pattern]) => {
  const source = name.includes("engine") ? engine : name === "no remote resources" ? `${html}\n${app}\n${engine}` : html;
  assert.match(source, pattern, name);
});

assert.match(app, /Engine\.inspectTransition/, "app uses causal inspector");
assert.match(app, /Engine\.classifyLatest/, "app uses return classifier");
assert.match(app, /drawTimeBody/, "app renders space-time body");

process.stdout.write(`${JSON.stringify({ status: "PASS", checks: 13, offline: true, p1_parity_required: true })}\n`);
