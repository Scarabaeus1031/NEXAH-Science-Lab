#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const machine = JSON.parse(fs.readFileSync(path.join(root, "assets/a0-axial-carrier-adapter-v1.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "A0_AXIAL_CARRIER_ADAPTER_SUITE.html"), "utf8");
const renderer = fs.readFileSync(path.join(root, "assets/a0-axial-carrier-adapter-v1.js"), "utf8");
const adapters = machine.adapters || [];
const axes = new Set(adapters.map((item) => item.axis_kind));
const checks = [
  [machine.schema === "nexah.a0.axial-carrier-adapter.v1", "schema id"],
  [adapters.length === 6, "six flagship adapters"],
  [["time", "sequence", "layer", "pipeline"].every((kind) => axes.has(kind)), "four typed axis kinds"],
  [machine.projection_only === true, "projection-only boundary"],
  [adapters.every((item) => item.identity && item.id && item.z) && Boolean(machine.claim_boundary), "identity and shared boundary contract"],
  [html.includes("a0-axial-carrier-adapter-v1.js"), "HTML binds renderer"],
  [renderer.includes("window.A0AxialCarrier"), "renderer exports stable namespace"],
  [renderer.includes("axis_kind"), "renderer exposes axis typing"]
];
const failed = checks.filter(([ok]) => !ok).map(([, label]) => label);
console.log(JSON.stringify({ pass: failed.length === 0, checks: checks.length, failed }, null, 2));
process.exitCode = failed.length ? 1 : 0;
