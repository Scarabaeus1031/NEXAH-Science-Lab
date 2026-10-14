import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const contractPath = path.join(here, "assets/a0-euler-spectrum-comparator-r0-preregistration.json");
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const sourcePath = path.join(repositoryRoot, contract.source.path);
const sourceBytes = fs.readFileSync(sourcePath);
const sourceHash = crypto.createHash("sha256").update(sourceBytes).digest("hex");
const source = JSON.parse(sourceBytes.toString("utf8"));
const values = source.spectrum?.eigenvalues;
const errors = [];

if (contract.status !== "PREREGISTERED_DESIGN_R0_1_AMENDED_BEFORE_EXECUTION_NOT_EXECUTED") errors.push("status must remain R0.1 amended before execution and not executed");
if (contract.execution_authorized !== false) errors.push("execution must remain unauthorized");
if (contract.lab_state !== "STRUCTURE_FREEZE") errors.push("Lab state must remain STRUCTURE_FREEZE");
if (sourceHash !== contract.source.sha256) errors.push("source spectrum hash mismatch");
if (!Array.isArray(values) || values.length !== contract.source.expected_count) errors.push("expected exactly 48 eigenvalues");
if (contract.source.rank_direction !== "descending") errors.push("rank direction must match stored descending order");
if (Array.isArray(values) && !values.every((value, index) => index === 0 || values[index - 1] >= value)) errors.push("source eigenvalues must be descending");
if (contract.models?.map((model) => model.id).join(",") !== "M0,M1,ME,M2") errors.push("frozen model set changed");
if (contract.cross_validation?.folds * contract.cross_validation?.values_per_fold !== 48) errors.push("cross-validation partition must cover 48 ranks");
if (contract.null_population?.accepted_graphs !== 10000 || contract.null_population?.vertices !== 48 || contract.null_population?.degree !== 3) errors.push("matched null contract changed");
if (contract.euler_family?.best_c_search_allowed !== false) errors.push("best-c search must remain prohibited");

const standardize = (items) => {
  const mean = items.reduce((sum, value) => sum + value, 0) / items.length;
  const variance = items.reduce((sum, value) => sum + (value - mean) ** 2, 0) / items.length;
  const sd = Math.sqrt(variance);
  return items.map((value) => (value - mean) / sd);
};
const base = Array.from({ length: 48 }, (_, n) => n * n + n);
const shifted = base.map((value) => value + 1459);
const a = standardize(base);
const b = standardize(shifted);
if (Math.max(...a.map((value, index) => Math.abs(value - b[index]))) > 1e-12) errors.push("Euler offset-collapse guard failed");

if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join("\n"));
  process.exit(1);
}

console.log(`PASS Euler/Tessarec Comparator R0.1 · ${values.length} hash-bound descending eigenvalues · execution=false · 1 primary statistic · 10000 matched nulls`);

