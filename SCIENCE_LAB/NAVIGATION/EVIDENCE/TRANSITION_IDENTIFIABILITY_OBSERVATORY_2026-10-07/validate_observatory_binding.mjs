#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../../..");
const binding = JSON.parse(fs.readFileSync(path.join(here, "OBSERVATORY_NAVIGATOR_BINDING_V1_2026-10-07.json"), "utf8"));
const schema = JSON.parse(fs.readFileSync(path.join(repo, binding.sources.schema), "utf8"));
const matrix = JSON.parse(fs.readFileSync(path.join(repo, binding.sources.matrix), "utf8"));
const grid = JSON.parse(fs.readFileSync(path.join(repo, binding.sources.multi_grid_ledger), "utf8"));

const checks = [];
const check = (name, value) => checks.push({ name, pass: Boolean(value) });
const typedIds = binding.typed_fields.map((field) => field.id);
const typedKeys = binding.typed_fields.map((field) => field.key);
const familyIds = binding.family_bindings.map((family) => family.family_id);
const expectedFamilies = Array.from({ length: 7 }, (_, index) => `CF:F${index + 1}`);
const requiredTypedKeys = ["carrier", "state", "operator", "view", "fiber", "return", "residual", "evidence"];

check("binding schema", binding.schema === "nexah.navigator.observatory-binding");
check("internal read-only status", binding.status === "INTERNAL_READ_ONLY_LENS");
check("typed-field namespace", binding.typed_field_namespace === "TF" && typedIds.every((id) => /^TF:0[1-8]$/.test(id)));
check("eight unique typed fields", typedIds.length === 8 && new Set(typedIds).size === 8);
check("typed keys match canonical schema", JSON.stringify(typedKeys) === JSON.stringify(requiredTypedKeys) && requiredTypedKeys.every((key) => schema.required.includes(key)));
check("seven canonical families", JSON.stringify(familyIds) === JSON.stringify(expectedFamilies));
check("all family bindings resolve fields", binding.family_bindings.every((family) => [...family.primary_fields, ...family.supporting_fields].every((id) => typedIds.includes(id))));
check("primary fields do not repeat", binding.family_bindings.every((family) => new Set(family.primary_fields).size === family.primary_fields.length));
check("matrix baseline", matrix.instruments.length === 11 && matrix.relations.length === 11);
check("multi-grid V1.3 baseline", grid.nodes.length === 15 && grid.edges.length === 15);
check("source files resolve", Object.values(binding.sources).every((sourcePath) => fs.existsSync(path.join(repo, sourcePath))));
check("four residuals retained", binding.open_residuals.length === 4);
check("claim ceiling blocks eighth family", /no eighth Functional Family/i.test(binding.claim_ceiling));

const failed = checks.filter((item) => !item.pass);
const result = { status: failed.length ? "FAIL" : "PASS", checks: checks.length, passed: checks.length - failed.length, failed: failed.map((item) => item.name) };
console.log(JSON.stringify(result, null, 2));
if (failed.length) process.exitCode = 1;
