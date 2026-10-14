import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../../..");
const binderPath = path.join(here, "CRT_QRT_37_CARRIER_LADDER_BINDER_V1_2026-10-11.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

check(binder.node_id === "NN:CRT_QRT_37_CARRIER_LADDER", "stable node id");
check(binder.status === "INTERNAL_SOURCE_BOUND_EVIDENCE_LENS", "internal lens status");
check(binder.publication_authorized === false, "publication remains false");
check(binder.changes_canonical_module_count === false, "module count unchanged");
check(binder.changes_canonical_family_count === false, "family count unchanged");
check(binder.identity_reuse?.module_id === "MOD:NUMBER_VIEW_SUITE", "existing module reused");
check(binder.identity_reuse?.artifact_ids?.includes("ART:NUMBER:ELEVEN_SPACE"), "Eleven-Space id reused");
check(binder.identity_reuse?.artifact_ids?.includes("ART:NUMBER:H_Q_FORMAT"), "H_Q format id reused");

const expected = [37, 137, 237, 537, 11357, 11537];
check(JSON.stringify(binder.carrier_ladder.map((row) => row.n)) === JSON.stringify(expected), "carrier ladder exact");
for (const row of binder.carrier_ladder) {
  check(row.n === 20 * row.q20 + row.r20, `QRT reconstruction ${row.n}`);
  check(row.r20 === 17, `r20 invariant ${row.n}`);
  check(row.mod11 === row.n % 11, `mod11 residue ${row.n}`);
}

const n11357 = binder.carrier_ladder.find((row) => row.n === 11357);
const n11537 = binder.carrier_ladder.find((row) => row.n === 11537);
check(n11357.factorization === "41*277", "11357 factorization");
check(n11537.factorization === "83*139", "11537 factorization");
check(n11537.n - n11357.n === 180, "11357/11537 delta");
check(binder.typed_structures?.historical_multiplier_graph?.mobius_topology_established === false, "Möbius topology not asserted");
check(binder.open_operator_attachment?.status === "OPEN_OPERATOR_ATTACHMENT", "1461/Fibonacci remains open");
const seed = binder.open_operator_attachment?.exact_seed_decomposition;
check(seed?.decimal_cut === "14|61", "1461 decimal cut");
check(1461 === 100 * 14 + 61, "1461 decimal reconstruction");
check(seed?.left_field?.value === 14 && 14 === 7 + 7 && 14 === 2 * 7, "14 double-seven structure");
check(seed?.right_field?.value === 61 && seed?.right_field?.prime === true, "61 prime status");
check(seed?.right_field?.prime_index_one_based === 18, "61 is p18");
check(18 === 2 * 3 ** 2, "18 prime factorization");
check(1461 === 3 * 487 && seed?.factor_487_prime === true, "1461 factorization");

const visualProvenance = binder.historical_visual_provenance;
check(visualProvenance?.status === "HISTORICAL_CONCEPT_VISUAL_PROVENANCE_ONLY", "historical concept-visual boundary");
check(visualProvenance?.artifact_provenance_authority === true, "artifact provenance authority retained");
check(visualProvenance?.scientific_evidence_authority === false, "historical repository is not scientific evidence authority");
check(visualProvenance?.conceptual_symbolic_context_only === true, "historical visuals remain conceptual/symbolic context");
check(visualProvenance?.desktop_duplicate_audit?.status === "BYTE_IDENTICAL_DUPLICATES_NOT_SOURCES", "desktop duplicates excluded as sources");
check(visualProvenance?.generator_status === "NOT_LOCATED", "visual generator remains unlocated");
check(visualProvenance?.relation_to_open_attachment === "CONCEPT_CONTEXT_ONLY_NOT_EVIDENCE_OF_1461_IDENTITY", "0.1461 relation bounded");
check(visualProvenance?.evidence_priority?.policy === "TEST_FIRST", "test-first evidence policy");
check(visualProvenance?.evidence_priority?.ranked?.[0] === "reproducible test or exact derivation", "test or derivation has first evidence rank");
check(visualProvenance?.evidence_priority?.next_test_id === "CURVATURE_1461_ORIGIN_01", "next test has stable id");
check(visualProvenance?.evidence_priority?.test_status === "FORMAL_DESIGN_ONLY_NOT_ACTIVATED", "test remains design-only");
check(visualProvenance?.test_gate?.execution_status === "NOT_RUN_STRUCTURE_FREEZE", "historical visual test not activated");

const externalRepo = path.resolve(repo, visualProvenance?.artifact_origin_repository?.local_checkout_relative_to_science_lab_repo ?? "");
for (const source of visualProvenance?.records ?? []) {
  const sourcePath = path.join(externalRepo, source.path);
  check(fs.existsSync(sourcePath), `historical source exists ${source.path}`);
  if (fs.existsSync(sourcePath)) check(sha256(sourcePath) === source.sha256, `historical source hash ${source.path}`);
}

const curvatureRender = visualProvenance?.records?.find((source) => source.observed_value === "0.1461");
check(curvatureRender?.observed_quantity === "right-side ellipse curvature", "0.1461 quantity typed");
check(curvatureRender?.integer_1461_identity_established === false, "0.1461 does not establish integer identity");

for (const source of binder.sources) {
  const sourcePath = path.join(repo, source.path);
  check(fs.existsSync(sourcePath), `source exists ${source.path}`);
  if (fs.existsSync(sourcePath)) check(sha256(sourcePath) === source.sha256, `source hash ${source.path}`);
}

if (failures.length) {
  console.error(JSON.stringify({status: "FAIL", failures}, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  node_id: binder.node_id,
  carrier_count: binder.carrier_ladder.length,
  relations: binder.relations.length,
  source_hashes: binder.sources.length,
  publication_authorized: binder.publication_authorized
}, null, 2));

