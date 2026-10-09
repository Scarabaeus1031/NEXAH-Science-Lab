const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const here = __dirname;
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");
const engine = read("engine.js");
const record = JSON.parse(read("results/CA_IDENT_01_RESULT.json"));

const checks = [
  ["semantic main", /<main>/.test(html)],
  ["eight declared tabs", (html.match(/data-view=/g) || []).length === 8],
  ["polygon controls", /17/.test(html) && /19/.test(html) && /29/.test(html)],
  ["Descartes and Poincare kept as charts", /Descartes ↔ Poincaré/.test(html) && /reversible Cayley view/.test(html)],
  ["E8 nonidentity boundary", /not an E8 identity/.test(html) && /no LIFE\/E8 carrier identity/.test(app)],
  ["translated holdout", /Translated holdout/.test(html) && /SHIFTS/.test(engine)],
  ["future target", /futureClass/.test(engine) && /8-generation behavior class/.test(record.target)],
  ["frozen mixed result", record.verdict === "LIMITED_VIEW_SIGNAL" && record.results.length === 7],
  ["negative E8 control retained", record.results.find((item) => item.family === "e8_adapter")?.correct === 36],
  ["responsive layout", /@media\(max-width:/.test(css)],
  ["no remote runtime", !/https?:\/\//.test(html)],
  ["claim ceiling", /does not establish external utility/.test(record.claim_ceiling)]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
assert.equal(failed.length, 0, `Failed: ${failed.join(", ")}`);
console.log(JSON.stringify({ status: "PASS", checks: checks.length, failed }, null, 2));
