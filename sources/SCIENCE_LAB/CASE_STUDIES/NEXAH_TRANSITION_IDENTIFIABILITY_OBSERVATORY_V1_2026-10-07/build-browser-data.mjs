#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = JSON.parse(fs.readFileSync(path.join(here, "FAMILY_RELATIONS_MATRIX.json"), "utf8"));
const multiGrid = JSON.parse(fs.readFileSync(path.join(here, "MULTI_GRID_RELATION_LEDGER.json"), "utf8"));
fs.writeFileSync(path.join(here, "matrix.data.js"), `window.NEXAH_OBSERVATORY_MATRIX=${JSON.stringify(source)};\n`);
fs.writeFileSync(path.join(here, "multi-grid.data.js"), `window.NEXAH_MULTI_GRID_LEDGER=${JSON.stringify(multiGrid)};\n`);
console.log(`matrix.data.js: ${source.instruments.length} instruments, ${source.relations.length} relations`);
console.log(`multi-grid.data.js: ${multiGrid.nodes.length} nodes, ${multiGrid.edges.length} edges`);
