import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(root, "../../NAVIGATOR_V2_DELTA_LIFE_ORBIT_2026-10-07.json");
const data = JSON.parse(fs.readFileSync(source, "utf8"));
fs.writeFileSync(path.join(root, "candidate.js"), `window.NEXAH_LIFE_ORBIT_ROUTE = ${JSON.stringify(data)};\n`);
process.stdout.write(`${JSON.stringify({ status: "PASS", route: data.candidate.route, source: path.basename(source) })}\n`);
