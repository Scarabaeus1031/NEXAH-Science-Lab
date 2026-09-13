#!/usr/bin/env python3
import csv
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def rows(name):
    return list(csv.DictReader((ROOT / name).open(encoding="utf-8-sig")))


repo = rows("02_REPOSITORY_36_ALLOWLIST_CURRENTNESS.csv")
desktop = rows("03_DESKTOP_PACKAGE_PIPELINE_MATRIX.csv")
gb = rows("04_GB_SHADOW_PART_COVERAGE.csv")
post = rows("05_POST49_DESK10_RETURN_REGISTER.csv")

checks = {
    "REPOSITORY_PACKAGES_36": len(repo) == 36,
    "REPOSITORY_CURRENTNESS_36_OF_36": all(row["currentness"] == "PASS_BYTE_IDENTICAL" for row in repo),
    "REPOSITORY_FILES_3257_OF_3257": sum(int(row["file_hash_matches"]) for row in repo) == 3257,
    "REPOSITORY_PATH_DELTAS_ZERO": sum(int(row["path_deltas"]) for row in repo) == 0,
    "DESKTOP_DIRECTORIES_12": len(desktop) == 12,
    "GB_SUBSTANTIVE_FILES_42": sum(row["relative_path"] != ".DS_Store" for row in gb) == 42,
    "GB_ALL_SUBSTANTIVE_BOUND": all(row["bound_audit"] != "UNBOUND" for row in gb if row["relative_path"] != ".DS_Store"),
    "POST49_PACKAGES_19": len(post) == 19,
    "POST49_MANIFEST_PASS_14": sum(row["root_manifest_status"] == "PASS" for row in post) == 14,
    "POST49_MANIFEST_MISSING_4": sum(row["root_manifest_status"] == "MISSING" for row in post) == 4,
    "POST49_MANIFEST_FAIL_1": sum(row["root_manifest_status"] == "FAIL" for row in post) == 1,
    "POST49_MC_REFERENCES_ABSENT_19": all(row["mission_control_reference"] == "ABSENT" for row in post),
    "FINAL_DECISION_PRESENT": "B — CURRENT_COVERAGE_ESTABLISHED_WITH_THREE_BOUNDED_CUSTODY_GAPS" in (ROOT / "FINAL_RETURN.md").read_text(),
}

if not all(checks.values()):
    raise SystemExit("VALIDATION_FAILED: " + repr(checks))

report = ["# Validation Report", "", "Deterministic validation: **PASS**.", ""]
for key, value in checks.items():
    report.append(f"- `{key}` = `{'PASS' if value else 'FAIL'}`")
report += [
    "",
    "The validator performs no source or Control Desk mutation. The package manifest excludes itself to avoid recursive hashing.",
]
(ROOT / "VALIDATION_REPORT.md").write_text("\n".join(report) + "\n", encoding="utf-8")

manifest = []
for item in sorted(path for path in ROOT.rglob("*") if path.is_file() and path.name != "SHA256_MANIFEST.txt"):
    manifest.append(f"{hashlib.sha256(item.read_bytes()).hexdigest()}  {item.relative_to(ROOT).as_posix()}")
(ROOT / "SHA256_MANIFEST.txt").write_text("\n".join(manifest) + "\n", encoding="utf-8")

print(f"PASS checks={len(checks)} manifest_entries={len(manifest)}")
