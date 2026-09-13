#!/usr/bin/env python3
import csv
import hashlib
import json
import os
import re
from pathlib import Path

LAB = Path("/Users/tho2020/Documents/NEXAH ECOSYSTEM/30 SCIENCE LAB/NEXAH-Science-Lab")
DESKTOP = Path("/Users/tho2020/Desktop/00_INCOMING")
CONTROL = Path("/Users/tho2020/Documents/NEXAH_CONTROL_DESK")
OUT = LAB / "MISSION_CONTROL_DESK10_INTAKE_PIPELINE_COVERAGE_AUDIT_2026-09-10"
ORIENTATION = CONTROL / "REVIEWS/DESK10_FIVE_WORKSTREAM_ORIENTATION_PASS_2026-09-08"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def files(root):
    out = []
    for base, dirs, names in os.walk(root, followlinks=False):
        dirs.sort()
        names.sort()
        for name in names:
            out.append(Path(base) / name)
    return out


def write_csv(name, fields, rows):
    with (OUT / name).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


# Repository 00_INCOMING: compare every file against the sealed Desk-10 ledger.
allow = list(csv.DictReader((ORIENTATION / "02_IMMUTABLE_PACKAGE_ALLOWLIST.csv").open(encoding="utf-8-sig")))
allow = [row for row in allow if row["science_lab_relative_path"].startswith("00_INCOMING/")]
ledger = {}
for line in (ORIENTATION / "results/FILE_HASH_LEDGER.jsonl").open(encoding="utf-8"):
    row = json.loads(line)
    if any(row["package"] == item["package_name"] for item in allow):
        ledger[(row["package"], row["relative_path"])] = row

repo_rows = []
for row in allow:
    root = Path(row["absolute_path"])
    current = files(root)
    matched = 0
    path_delta = 0
    current_keys = set()
    for item in current:
        rel = item.relative_to(root).as_posix()
        key = (row["package_name"], rel)
        current_keys.add(key)
        expected = ledger.get(key)
        if expected is None:
            path_delta += 1
            continue
        payload = os.readlink(item).encode("utf-8") if item.is_symlink() else item.read_bytes()
        if len(payload) == expected["size"] and sha(payload) == expected["sha256"]:
            matched += 1
    path_delta += len({key for key in ledger if key[0] == row["package_name"]} - current_keys)
    current_bytes = sum((len(os.readlink(item).encode("utf-8")) if item.is_symlink() else item.stat().st_size) for item in current)
    package_pass = matched == int(row["file_count"]) and path_delta == 0 and current_bytes == int(row["byte_count"])
    repo_rows.append({
        "allowlist_id": row["allowlist_id"],
        "package_name": row["package_name"],
        "workstream_id": row["workstream_id"],
        "expected_files": row["file_count"],
        "current_files": len(current),
        "expected_bytes": row["byte_count"],
        "current_bytes": current_bytes,
        "file_hash_matches": matched,
        "path_deltas": path_delta,
        "currentness": "PASS_BYTE_IDENTICAL" if package_pass else "FAIL_DRIFT",
        "pipeline_state": "CLOSED_NO_MANDATORY_FOLLOW_ON",
    })

write_csv("02_REPOSITORY_36_ALLOWLIST_CURRENTNESS.csv", list(repo_rows[0]), repo_rows)


desktop_specs = {
    "ACR 27-45+ Testing": ("DESK10_MULTI_INTAKE_2026-09-02", "HOLD_PENDING_REPAIR", "BYTE_IDENTICAL_70_OF_70"),
    "CLOCKWORK ORANGE": ("DESK10_MULTI_INTAKE_2026-09-02", "HOLD_PENDING_REPAIR", "BYTE_IDENTICAL_150_OF_150"),
    "CRT 11357": ("DESK10_MULTI_INTAKE_2026-09-02", "CLOSED_FORENSIC_SOURCE_CORPUS_LEAVE_IN_PLACE", "BYTE_IDENTICAL_31_OF_31"),
    "CRT 11357 GEMINI": ("DESK10_MULTI_INTAKE_2026-09-02", "SOURCE_CORPUS_LEAVE_IN_PLACE", "BYTE_IDENTICAL_35_OF_35"),
    "DESK10_MULTI_INTAKE_ORIENTATION_AUDIT_2026-09-02": ("SELF_DESCRIBED_DESK10_OUTPUT", "PARTIAL_REORGANIZATION_READY_PHYSICAL_MOVE_GATED", "PIPELINE_RESULT_NOT_RAW_SOURCE"),
    "G-R°T^ ROSETTA": ("D10-FW-001_WS05", "CLOSED_NO_MANDATORY_FOLLOW_ON", "BYTE_IDENTICAL_20_OF_20_TO_MODULE_II"),
    "GB_Shadow  Geometry LQE 01": ("POST_49_DESK10_AUDIT_CLUSTER", "LOCAL_AUDITS_COMPLETE_MC_RETURN_PENDING", "42_OF_42_CONTENT_FILES_EXPLICITLY_BOUND"),
    "MRB TESTSERIE": ("DESK10_MULTI_INTAKE_2026-09-02", "HOLD_PENDING_REPAIR", "BYTE_IDENTICAL_138_OF_138"),
    "OEIS LOGIK": ("ILAU_FIELD_LAB_NEON_NBAND_INTAKE_2026-09-04", "DELTA_ORIENTATION_REQUIRED", "78_UNCHANGED_2_MISSING_1_NEW"),
    "SCx33_BBi_aka_BOKI_review": ("DESK10_MULTI_INTAKE_2026-09-02", "SOURCE_CORPUS_LEAVE_IN_PLACE", "BYTE_IDENTICAL_164_OF_164"),
    "THe Prime Genesis": ("D10-FW-036_WS04", "CLOSED_DOCUMENTED_DESKTOP_DELTA_NOT_IMPORTED", "91_FILES_200978686_BYTES"),
    "TRAnsVerSUM GEO Weather VIEW": ("D10-FW-001_WS05", "CLOSED_NO_MANDATORY_FOLLOW_ON", "BYTE_IDENTICAL_13_OF_13_TO_MODULE_I"),
}

desktop_rows = []
for name in sorted(desktop_specs):
    root = DESKTOP / name
    current = files(root)
    route, state, verification = desktop_specs[name]
    desktop_rows.append({
        "package_name": name,
        "current_files": len(current),
        "current_bytes": sum(item.stat().st_size for item in current),
        "desk_route": route,
        "pipeline_state": state,
        "currentness_verification": verification,
        "source_mutation_authority": "NONE",
    })

write_csv("03_DESKTOP_PACKAGE_PIPELINE_MATRIX.csv", list(desktop_rows[0]), desktop_rows)


# GB Shadow part-level binding. Finder metadata is excluded from substantive coverage.
gb = DESKTOP / "GB_Shadow  Geometry LQE 01"
gb_rows = []
for item in files(gb):
    rel = item.relative_to(gb).as_posix()
    if rel == ".DS_Store":
        route = "FINDER_METADATA"
        state = "NON_SUBSTANTIVE_METADATA"
    elif rel.startswith("DESK10_1729_MOBIUS_VISUAL_INTAKE_7_FILES/"):
        route = "DESK10_1729_MOBIUS_PARTITION_CARRIER_BRIDGE_AUDIT_2026-09-10"
        state = "EXPLICIT_SOURCE_BINDING"
    elif rel.startswith("RRTM_D2_JULIA_VISUAL_INTAKE_2026-09-09/"):
        route = "RRTM_D2_JULIA_RETURN_ESCAPE_CONJUGATE_MIRROR_AUDIT_2026-09-09"
        state = "EXPLICIT_SOURCE_BINDING"
    elif rel == "CAT IN THE BASKET.png":
        route = "CAT_IN_THE_BASKET_PRESERVATION_AND_FORMALIZATION_REVIEW_2026-09-09"
        state = "HASH_BOUND_BYTE_PRESERVED"
    elif rel in {
        "065b8a65-f9e5-42d4-95ba-c32a64bc8979.png",
        "2d6051d3-aa6e-460c-9d9f-78b4e82c6248-1.png",
        "30456fe1-4e20-4c4e-ab19-e9f43b256089.png",
        "3b06a4ac-72f4-442b-b7f7-1496b7e071f8.png",
        "90c21043-6916-402f-a60b-e2a26d1466dc.png",
        "9b9975d4-f082-4136-817c-44b86dc5e3a7.png",
        "e9df4bc7-0cb3-4966-adda-b00ad24983e4 2.png",
        "ffa2f1e6-b9f4-4930-9398-b7202402bcaa.png",
    }:
        route = "LQE01_POST_CLOSEOUT_VISUAL_SUPPLEMENT_AND_GRIP_GAP_ANNOTATION_2026-09-09"
        state = "HASH_BOUND_BYTE_PRESERVED"
    else:
        route = "LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_2026-09-09"
        state = "HASH_BOUND_BYTE_PRESERVED"
    gb_rows.append({
        "relative_path": rel,
        "bytes": item.stat().st_size,
        "sha256": sha(item.read_bytes()),
        "bound_audit": route,
        "binding_status": state,
    })

write_csv("04_GB_SHADOW_PART_COVERAGE.csv", list(gb_rows[0]), gb_rows)


outcome = {
    "CAT_IN_THE_BASKET_PRESERVATION_AND_FORMALIZATION_REVIEW_2026-09-09": "COMPLETE_BOUNDED_ADDITIVE_REVIEW",
    "DESK10_1729_MOBIUS_PARTITION_CARRIER_BRIDGE_AUDIT_2026-09-10": "COMPLETE_EXACT_ARITHMETIC_PHYSICAL_MECHANISM_NOT_TESTED",
    "DESK10_FIXED_WIDTH_REVERSAL_SHADOW_REGISTER_COMMUTATION_AUDIT_2026-09-10": "COMPLETE_BOUNDED_MATHEMATICAL_AUDIT",
    "DESK10_LQE01_DATELINE_AND_REPOSITORY_EVIDENCE_RECOVERY_AUDIT_2026-09-09": "COMPLETE_READ_ONLY_EVIDENCE_RECOVERY",
    "DESK10_OPERATOR_LOOP_CLOSURE_MACHINE_MIDDLE_LAGRANGE_GATE_2026-09-10": "MECHANICAL_PLANT_REQUIRED_FIRST",
    "DESK10_SHADOW_REGISTER_REVERSE_COMPLEMENT_CONTROL_STATE_AUDIT_2026-09-10": "COMPLETE_CONTROL_TYPES_DISTINCT",
    "GHOSTGRID_ALPHABET_ROTATION_RECONSTRUCTION_AUDIT_2026-09-10": "COMPLETE_NUMERICAL_RESULT_VISUAL_BINDING_UNRESOLVED",
    "MISSION_CONTROL_GHOSTGRID_SHARED_OBSERVER_PROJECTION_GATE_2026-09-10": "SHARED_OBSERVER_PROJECTION_LAYER_CONFIRMED_ARCHITECTURE_ONLY",
    "NEXAH_CURTAIN_CROSSING_STRIP_RESIDUAL_RETURN_REVIEW_2026-09-09": "INSUFFICIENT_PHYSICAL_SOURCE_BINDING_STOP",
    "NEXAH_LIGHT_TIME_AU_YEAR_REGISTER_REVIEW_2026-09-09": "NEW_BOUNDED_TEST_SPEC_JUSTIFIED_NOT_AUTHORIZED",
    "NEXAH_NEUROMECHANICAL_KASKADENZ_EXTENSION_REVIEW_2026-09-09": "COMPLETE_EXP20_INSUFFICIENT_SOURCE_BINDING",
    "NEXAH_PHI_FOURIER_ENTROPY_SOURCE_FORENSICS_2026-09-09": "INSUFFICIENT_SOURCE_BINDING_STOP",
    "NEXAH_SELF_NONSELF_DUAL_AXIS_BOUNDARY_REVIEW_2026-09-09": "COMPLETE_BOUNDED_INTEGRATION_CANDIDATE_ONLY",
    "NEXAH_TIME_DEPENDENT_COUPLING_FORMALIZATION_REVIEW_2026-09-09": "COMPLETE_EXP20_BINDING_STOP",
    "RRTM_D2_JULIA_RETURN_ESCAPE_CONJUGATE_MIRROR_AUDIT_2026-09-09": "COMPLETE_JULIA_C_GENERATOR_UNRESOLVED",
    "DESK10_CRT_CIRCLE_DUAL_STEP_ORBIT_AUDIT_2026-09-09": "COMPLETE_NEW_EXACT_FORMALIZATION_NO_COMMON_ORIGIN",
    "DESK10_CRT_SHADOW_OTHER_SIDE_INVOLUTION_AUDIT_2026-09-09": "COMPLETE_MATHEMATICAL_EXAMPLE_VISUAL_UNLOCATED",
    "LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_2026-09-09": "CLOSED_NO_MANDATORY_FOLLOW_ON",
    "LQE01_POST_CLOSEOUT_VISUAL_SUPPLEMENT_AND_GRIP_GAP_ANNOTATION_2026-09-09": "COMPLETE_CLOSED_STATE_PRESERVED",
}

post_rows = []
post_packages = []
for item in list(LAB.iterdir()) + list((LAB / "SCIENCE_LAB/CASE_STUDIES").iterdir()):
    if item.is_dir() and ("2026-09-09" in item.name or "2026-09-10" in item.name) and item.name in outcome:
        post_packages.append(item)

for root in sorted(post_packages):
    current = files(root)
    manifests = [item for item in root.iterdir() if item.is_file() and "MANIFEST" in item.name.upper() and "SHA256" in item.name.upper()]
    manifest_status = "MISSING"
    errors = []
    entries = 0
    if manifests:
        manifest_status = "PASS"
        for manifest in manifests:
            for line in manifest.read_text(errors="replace").splitlines():
                if not line.strip() or line.lstrip().startswith("#"):
                    continue
                match = re.match(r"^([0-9a-fA-F]{64})\s+\*?(.+)$", line)
                if not match:
                    errors.append("MALFORMED")
                    continue
                entries += 1
                target = root / match.group(2).removeprefix("./")
                if not target.is_file():
                    errors.append("MISSING:" + match.group(2))
                elif sha(target.read_bytes()) != match.group(1).lower():
                    errors.append("MISMATCH:" + match.group(2))
        if errors:
            manifest_status = "FAIL"
    post_rows.append({
        "package_path": root.relative_to(LAB).as_posix(),
        "files": len(current),
        "bytes": sum(item.stat().st_size for item in current),
        "local_outcome": outcome[root.name],
        "root_manifest_status": manifest_status,
        "manifest_entries": entries,
        "manifest_errors": ";".join(errors),
        "mission_control_reference": "ABSENT",
        "desk10_route": "POST_49_CURRENTNESS_RETURN_REQUIRED",
    })

write_csv("05_POST49_DESK10_RETURN_REGISTER.csv", list(post_rows[0]), post_rows)

print(json.dumps({
    "repository_packages": len(repo_rows),
    "repository_currentness_pass": sum(row["currentness"] == "PASS_BYTE_IDENTICAL" for row in repo_rows),
    "desktop_packages": len(desktop_rows),
    "gb_content_files_bound": sum(row["relative_path"] != ".DS_Store" for row in gb_rows),
    "post49_packages": len(post_rows),
    "post49_manifest_pass": sum(row["root_manifest_status"] == "PASS" for row in post_rows),
    "post49_manifest_missing": sum(row["root_manifest_status"] == "MISSING" for row in post_rows),
    "post49_manifest_fail": sum(row["root_manifest_status"] == "FAIL" for row in post_rows),
}, indent=2))
