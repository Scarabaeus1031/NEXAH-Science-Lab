import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function filesUnder(current = packageRoot) {
  const out = [];
  for (const entry of (await readdir(current, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) out.push(...await filesUnder(full));
    else if (entry.isFile() && path.relative(packageRoot, full) !== "MANIFEST_SHA256.txt") out.push(full);
  }
  return out;
}

const files = await filesUnder();
const lines = [];
for (const file of files) {
  const hash = createHash("sha256").update(await readFile(file)).digest("hex");
  lines.push(`${hash}  ${path.relative(packageRoot, file)}`);
}
await writeFile(path.join(packageRoot, "MANIFEST_SHA256.txt"), lines.join("\n") + "\n");
console.log(JSON.stringify({ manifest_entries: lines.length, result: "CREATED" }));
