#!/usr/bin/env python3
"""Build the bounded EXP-00-R current-authority bundle manifest.

The selection follows SCIENCE_LAB_MASTER_STATUS.md. It preserves the cumulative
scientific contract and the current engineering/export/generator/producer
endpoints while leaving obsolete operational and repair lineages unregistered.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Iterable


AS_OF = "2026-08-14"
SCHEMA = "nexah-exp00r-current-authority-bundle-v1"
LAYERS = {
    "01_scientific_authority": [
        "EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A1",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A1_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A2",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A2_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A3",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A3_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A4",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A4_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5X_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XR",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XR_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XE",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XE_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEF",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEF_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEFR",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEFR_INDEPENDENT_REVIEW",
    ],
    "02_engineering_export": [
        "EXP_00_R_ROSSLER_REPLICATION_V3R6_MATERIAL_CALLABLE_INTEGRITY",
        "EXP_00_R_ROSSLER_REPLICATION_V3R6_FINAL_EVIDENCE_ONLY_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1_INDEPENDENT_REVIEW",
        "EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1_SEAL_RECONCILIATION",
    ],
    "03_generator_producer": [
        "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2",
        "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2_INDEPENDENT_REVIEW",
        "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1",
        "EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1_INDEPENDENT_REVIEW",
    ],
}
TEXT_SUFFIXES = {".json", ".md", ".py", ".txt", ".toml", ".yaml", ".yml"}
ROOT_PATTERN = re.compile(r"EXP_00_R_[A-Z0-9_]+")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tree_hash(records: Iterable[dict[str, object]]) -> str:
    digest = hashlib.sha256()
    for record in sorted(records, key=lambda item: str(item["path"])):
        digest.update(str(record["path"]).encode("utf-8"))
        digest.update(b"\0")
        digest.update(str(record["sha256"]).encode("ascii"))
        digest.update(b"\n")
    return digest.hexdigest()


def package_inventory(repo: Path, root: str) -> dict[str, object]:
    directory = repo / root
    if not directory.is_dir():
        raise RuntimeError(f"missing selected package: {root}")
    records = []
    for path in sorted(directory.rglob("*"), key=lambda item: item.as_posix()):
        relative = path.relative_to(directory)
        transient = (
            path.name == ".DS_Store"
            or "__pycache__" in relative.parts
            or path.suffix.lower() in {".pyc", ".pyo"}
        )
        if path.is_file() and not transient:
            records.append(
                {
                    "path": relative.as_posix(),
                    "bytes": path.stat().st_size,
                    "sha256": sha256_file(path),
                }
            )
    return {
        "root": root,
        "file_count": len(records),
        "bytes": sum(int(record["bytes"]) for record in records),
        "sha256_tree": tree_hash(records),
        "files": records,
    }


def references(repo: Path, root: str, existing_roots: set[str]) -> list[str]:
    found: set[str] = set()
    for path in (repo / root).rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for match in ROOT_PATTERN.findall(text):
            resolved = max(
                (candidate for candidate in existing_roots if match.startswith(candidate)),
                key=len,
                default=None,
            )
            if resolved and resolved != root:
                found.add(resolved)
    return sorted(found)


def human_bytes(size: int) -> str:
    value = float(size)
    for unit in ("B", "KiB", "MiB", "GiB"):
        if value < 1024 or unit == "GiB":
            return f"{value:.1f} {unit}" if unit != "B" else f"{int(value)} B"
        value /= 1024
    raise AssertionError("unreachable")


def build(repo: Path) -> dict[str, object]:
    selected_roots = [root for roots in LAYERS.values() for root in roots]
    if len(selected_roots) != len(set(selected_roots)):
        raise RuntimeError("duplicate selected root")
    existing_roots = {
        path.name
        for path in repo.iterdir()
        if path.is_dir() and path.name.startswith("EXP_00_R_")
    }
    package_records = {root: package_inventory(repo, root) for root in selected_roots}
    dependency_map = {
        root: references(repo, root, existing_roots) for root in selected_roots
    }
    selected_set = set(selected_roots)
    referenced_historical = sorted(
        {ref for refs in dependency_map.values() for ref in refs if ref not in selected_set}
    )

    endpoint_ledger = json.loads(
        (repo / "LAB_DESK" / "ENDPOINT_RECONSTRUCTION.json").read_text(encoding="utf-8")
    )
    ledger_by_root = {item["root"]: item for item in endpoint_ledger["packages"]}
    excluded = []
    for root in sorted(existing_roots - selected_set):
        ledger = ledger_by_root.get(root)
        excluded.append(
            {
                "root": root,
                "reason": "HISTORICAL_PRESERVE_NOT_CURRENT_ENDPOINT",
                "referenced_by_current_bundle": root in referenced_historical,
                "file_count": ledger["file_count"] if ledger else None,
                "bytes": ledger["bytes"] if ledger else None,
                "sha256_tree": ledger["sha256_tree"] if ledger else None,
            }
        )

    layers = []
    all_files = []
    for layer, roots in LAYERS.items():
        packages = [package_records[root] for root in roots]
        layer_files = [
            {**record, "path": f"{package['root']}/{record['path']}"}
            for package in packages
            for record in package["files"]
        ]
        all_files.extend(layer_files)
        layers.append(
            {
                "layer": layer,
                "roots": roots,
                "root_count": len(roots),
                "file_count": len(layer_files),
                "bytes": sum(int(record["bytes"]) for record in layer_files),
                "sha256_tree": tree_hash(layer_files),
            }
        )

    return {
        "schema": SCHEMA,
        "as_of": AS_OF,
        "source_authority": "SCIENCE_LAB_MASTER_STATUS.md sections 1-7",
        "scientific_boundary": {
            "registered_evidence_generated": False,
            "registered_experiment_executed": False,
            "p1_p5_evaluated": False,
            "scientific_result": "UNKNOWN",
            "new_authorization_granted": False,
            "note": "Repository registration preserves the reviewed infrastructure; it does not cross the registered scientific boundary.",
        },
        "selection": {
            "policy": "BOUNDED_CURRENT_AUTHORITY_NOT_FULL_HISTORICAL_LINEAGE",
            "root_count": len(selected_roots),
            "file_count": len(all_files),
            "bytes": sum(int(record["bytes"]) for record in all_files),
            "sha256_tree": tree_hash(all_files),
            "layers": layers,
            "packages": [package_records[root] for root in selected_roots],
        },
        "dependency_map": dependency_map,
        "referenced_historical_roots": referenced_historical,
        "excluded_historical_roots": excluded,
        "next_operational_frontier": "SEPARATE_REGISTERED_EVIDENCE_GENERATION_AUTHORIZATION_RECHECK_NOT_PERFORMED",
    }


def write_outputs(output: Path, manifest: dict[str, object]) -> None:
    output.mkdir(parents=True, exist_ok=True)
    (output / "EXP00R_ENDPOINT_BUNDLE_MANIFEST.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    for layer in manifest["selection"]["layers"]:
        (output / f"{layer['layer']}_ROOTS.txt").write_text(
            "".join(f"{root}\n" for root in layer["roots"]), encoding="utf-8"
        )

    selection = manifest["selection"]
    lines = [
        "# EXP-00-R Current-Authority Endpoint Bundle",
        "",
        f"Status date: {AS_OF}",
        "",
        "Disposition: **BOUNDED_CURRENT_AUTHORITY_BUNDLE**",
        "",
        "Scientific result: **UNKNOWN**",
        "",
        "Registered evidence generated: **NO**",
        "",
        "## Selection",
        "",
        f"- Selected roots: **{selection['root_count']}**",
        f"- Selected files: **{selection['file_count']}**",
        f"- Selected bytes: **{human_bytes(int(selection['bytes']))}**",
        f"- Bundle tree: `{selection['sha256_tree']}`",
        "",
        "| Layer | Roots | Files | Size | Tree SHA-256 |",
        "| --- | ---: | ---: | ---: | --- |",
    ]
    for layer in selection["layers"]:
        lines.append(
            f"| `{layer['layer']}` | {layer['root_count']} | {layer['file_count']} | "
            f"{human_bytes(int(layer['bytes']))} | `{layer['sha256_tree']}` |"
        )
    lines.extend(
        [
            "",
            "## Why this is bounded",
            "",
            "The bundle contains the cumulative scientific authority named by the Master Status, the current V3R6 engineering endpoint, the closed Export R1 line, Generator R2 and Producer R1, together with their current reviews. It does not import obsolete authorizations, failed operations, superseded generators/producers or the full V2/V3 repair history.",
            "",
            f"Excluded historical roots: **{len(manifest['excluded_historical_roots'])}**. "
            f"Of these, **{len(manifest['referenced_historical_roots'])}** are named in current-bundle provenance text and remain hash-recorded in the machine manifest.",
            "",
            "## Authority boundary",
            "",
            "- Registration makes the current reviewed objects remotely durable and navigable.",
            "- It does not authorize evidence generation or experiment execution.",
            "- It does not establish P1-P5 or any scientific classification.",
            "- Historical references remain provenance; their mention does not make them current authority.",
            "- `SCIENCE_LAB_MASTER_STATUS.md` remains the human orientation authority.",
            "",
            "## Next operational frontier",
            "",
            "`SEPARATE_REGISTERED_EVIDENCE_GENERATION_AUTHORIZATION_RECHECK_NOT_PERFORMED`",
        ]
    )
    (output / "EXP00R_ENDPOINT_BUNDLE_DISPOSITION.md").write_text(
        "\n".join(lines) + "\n", encoding="utf-8"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    repo = args.repo.resolve()
    output = (
        args.output or repo / "LAB_DESK" / "ARTIFACTS" / "EXP00R_ENDPOINT_BUNDLE"
    ).resolve()
    manifest = build(repo)
    write_outputs(output, manifest)
    selection = manifest["selection"]
    print(
        f"selected={selection['root_count']} roots/{selection['file_count']} files/"
        f"{human_bytes(int(selection['bytes']))}; "
        f"excluded={len(manifest['excluded_historical_roots'])} roots; "
        f"referenced historical={len(manifest['referenced_historical_roots'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
