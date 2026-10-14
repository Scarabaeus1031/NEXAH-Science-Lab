"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const model = require("./assets/a0-fibonacci-ring-operator-comparator-r1.js");

const root = __dirname;
const resultDir = path.join(root, "results");
const resultPath = path.join(resultDir, "a0-fibonacci-ring-operator-comparator-r1-result-2026-10-14.json");
const figurePath = path.join(resultDir, "a0-fibonacci-ring-operator-comparator-r1-figure-2026-10-14.svg");
const lockPath = path.join(root, "assets", "a0-fibonacci-ring-operator-comparator-r1-result-lock.json");
const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

const result = model.evaluate();
const resultBytes = Buffer.from(JSON.stringify(result, null, 2) + "\n");
const figureBytes = Buffer.from(model.renderSvg(result) + "\n");

fs.mkdirSync(resultDir, { recursive: true });
fs.writeFileSync(resultPath, resultBytes);
fs.writeFileSync(figurePath, figureBytes);

const lock = {
  schema: "nexah.a0.fibonacci-ring-operator-comparator-result-lock/1.0.0",
  date: "2026-10-14",
  status: result.status,
  fixture: "A0_BOOK/assets/a0-fibonacci-ring-operator-comparator-r1.json",
  result_json: "A0_BOOK/results/a0-fibonacci-ring-operator-comparator-r1-result-2026-10-14.json",
  result_json_sha256: sha256(resultBytes),
  figure_svg: "A0_BOOK/results/a0-fibonacci-ring-operator-comparator-r1-figure-2026-10-14.svg",
  figure_svg_sha256: sha256(figureBytes),
  sample_count: result.comparator.sample_count,
  seed: result.comparator.seed,
  fibonacci_privileged: result.comparator.fibonacci_privileged,
  authorized_science_run: false,
  closes_g6: false
};
fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
console.log(JSON.stringify({ status: result.status, result: resultPath, figure: figurePath, lock: lockPath }, null, 2));
