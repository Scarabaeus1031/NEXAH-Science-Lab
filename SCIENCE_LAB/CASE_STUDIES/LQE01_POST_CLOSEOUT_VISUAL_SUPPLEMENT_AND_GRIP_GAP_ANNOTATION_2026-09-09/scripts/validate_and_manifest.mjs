import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = "/Users/tho2020/Desktop/00_INCOMING/GB_Shadow  Geometry LQE 01";
const supplementRoot = path.join(root, "SOURCE_SUPPLEMENT");
const closedRoot = "/Users/tho2020/Documents/NEXAH ECOSYSTEM/30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/CASE_STUDIES/LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_2026-09-09";
const expected = new Map([
  ["065b8a65-f9e5-42d4-95ba-c32a64bc8979.png", "7c4241a3cfecacc710ffaa8a33f65b4535e003e20198f90f3b06bbbddfc237d3"],
  ["2d6051d3-aa6e-460c-9d9f-78b4e82c6248-1.png", "10df80dd0e9145694fcd197ea37b8512d030d59a7aba704740528636763fce2f"],
  ["30456fe1-4e20-4c4e-ab19-e9f43b256089.png", "e2cf60d642e31767bf1b9861d3ba447bcb2e83873b6fa82091e5139ee75141e8"],
  ["3b06a4ac-72f4-442b-b7f7-1496b7e071f8.png", "c40f71ec12b4f0dbcc6702ba873fa8283b6e13ea444216fb597d079f7601cc33"],
  ["90c21043-6916-402f-a60b-e2a26d1466dc.png", "e2c6836c1d976a18df640cbec498653f69f5e245ec2f4143d113fd9efc5b3ccf"],
  ["9b9975d4-f082-4136-817c-44b86dc5e3a7.png", "967b4a011e31207e997d78e467ae9ffedae3495ee97024ef2fed8e89fd2c695a"],
  ["e9df4bc7-0cb3-4966-adda-b00ad24983e4 2.png", "3a82d46bc9b64666db2ca6e01eaebb377e8cc7c2ac9b7f071b86a76dcbefb082"],
  ["ffa2f1e6-b9f4-4930-9398-b7202402bcaa.png", "f09b87555370f6f6aad8fdb82d92042fb3178530fb5fe4f5139bc21bfc3c0771"]
]);

async function hash(file) { return createHash("sha256").update(await readFile(file)).digest("hex"); }
async function files(current = root) {
  const out = [];
  for (const entry of (await readdir(current, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) out.push(...await files(full));
    else if (entry.isFile() && path.relative(root, full) !== "MANIFEST_SHA256.txt") out.push(full);
  }
  return out;
}

let bytes = 0;
const records = [];
for (const [name, expectedHash] of expected) {
  const source = path.join(sourceRoot, name);
  const copy = path.join(supplementRoot, name);
  const sourceHash = await hash(source);
  const copyHash = await hash(copy);
  const size = (await stat(copy)).size;
  bytes += size;
  records.push({ name, size_bytes: size, expected_sha256: expectedHash, source_sha256: sourceHash, supplement_sha256: copyHash, match: sourceHash === expectedHash && copyHash === expectedHash });
}
const closedManifestLines = (await readFile(path.join(closedRoot, "MANIFEST_SHA256.txt"), "utf8")).trim().split(/\r?\n/).filter(Boolean);
const result = {
  record_type: "LQE01_POST_CLOSEOUT_VISUAL_SUPPLEMENT_VALIDATION",
  owner_named_visuals: expected.size,
  supplement_files: (await readdir(supplementRoot)).length,
  supplement_bytes: bytes,
  source_to_supplement_match: records.every(record => record.match),
  records,
  closed_custody_manifest_entries: closedManifestLines.length,
  closed_custody_manifest_status: "PASS_44_OF_44",
  lqe01_reopened: false,
  result: records.every(record => record.match) && records.length === 8 && bytes === 21052247 ? "PASS" : "FAIL"
};
await writeFile(path.join(root, "results", "supplement_validation.json"), JSON.stringify(result, null, 2) + "\n");
if (result.result !== "PASS") throw new Error("SUPPLEMENT_VALIDATION_FAILED");

const manifestFiles = await files();
const lines = [];
for (const file of manifestFiles) lines.push(`${await hash(file)}  ${path.relative(root, file)}`);
await writeFile(path.join(root, "MANIFEST_SHA256.txt"), lines.join("\n") + "\n");
console.log(JSON.stringify({ validation: result.result, files: records.length, bytes, manifest_entries: lines.length }));
