#!/usr/bin/env python3
"""Build a deterministic, read-only inventory of untracked Lab packages.

The program never mutates a research package. It asks Git for untracked files,
groups them by top-level package, hashes their bytes, identifies likely endpoint
documents, and writes the two Lab Desk ledger views.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from collections import Counter
from pathlib import Path
from typing import Any, Iterable


DESK_ROOT = "LAB_DESK"
TEXT_SUFFIXES = {".json", ".md", ".txt", ".yaml", ".yml"}
TERMINAL_WORDS = ("FINAL", "FREEZE", "FROZEN", "CLOSURE", "CLOSED", "DECISION")
DOCUMENT_WORDS = ("STATUS", "REPORT", "MANIFEST", "README")
RAW_PARTS = {"raw", "data", "datasets", "trajectories"}
SIGNAL_KEYS = {
    "status",
    "outcome",
    "decision",
    "verdict",
    "recommended_route",
    "formal_classifier",
    "final_status",
    "classification",
}
SIGNAL_LINE = re.compile(
    r"^\s*(?:[-*]\s*)?(?:\*\*)?"
    r"(status|final status|outcome|decision|verdict|recommended route|"
    r"formal classifier|classification)(?:\*\*)?\s*[:=]\s*(.+?)\s*$",
    re.IGNORECASE,
)
MACHINE_LINE = re.compile(r"^\s*([A-Z][A-Z0-9_]{2,})\s*=\s*(\S.*?)\s*$")


def git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=repo, check=True, capture_output=True, text=True
    )
    return result.stdout.strip()


def untracked_files(repo: Path) -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard", "-z"],
        cwd=repo,
        check=True,
        capture_output=True,
    )
    paths = []
    for raw in result.stdout.split(b"\0"):
        if not raw:
            continue
        rel = Path(raw.decode("utf-8", errors="surrogateescape"))
        if rel.parts and rel.parts[0] != DESK_ROOT:
            paths.append(rel)
    return sorted(paths, key=lambda item: item.as_posix())


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tree_hash(records: Iterable[tuple[str, str]]) -> str:
    digest = hashlib.sha256()
    for rel_path, file_hash in sorted(records):
        digest.update(rel_path.encode("utf-8", errors="surrogateescape"))
        digest.update(b"\0")
        digest.update(file_hash.encode("ascii"))
        digest.update(b"\n")
    return digest.hexdigest()


def family(name: str) -> str:
    if name.startswith("EXP_00"):
        return "EXP_00"
    if name.startswith("ORION"):
        return "ORION"
    if name.startswith("NEXAH"):
        return "NEXAH"
    return "OTHER"


def marker_class(root: str, paths: Iterable[Path]) -> str:
    # The top-level package name is itself a useful orientation marker (for
    # example, a freeze package whose internal files use only numbered names).
    names = [root.upper(), *(path.name.upper() for path in paths)]
    if any(any(word in name for word in TERMINAL_WORDS) for name in names):
        return "TERMINAL_MARKER"
    if any(any(word in name for word in DOCUMENT_WORDS) for name in names):
        return "DOCUMENTED_MARKER"
    return "NO_MARKER"


def endpoint_score(path: Path) -> tuple[int, int, str]:
    name = path.name.upper()
    score = 0
    weights = (
        ("FINAL", 100),
        ("CLOSURE", 90),
        ("DECISION", 85),
        ("FREEZE", 80),
        ("OUTCOME", 95),
        ("STATUS", 70),
        ("REPORT", 60),
        ("README", 50),
        ("MANIFEST", 40),
    )
    for word, weight in weights:
        if word in name:
            score = max(score, weight)
    return (-score, len(path.parts), path.as_posix())


def endpoint_candidates(paths: Iterable[Path]) -> list[Path]:
    candidates = [
        path
        for path in paths
        if path.suffix.lower() in TEXT_SUFFIXES
        and any(word in path.name.upper() for word in TERMINAL_WORDS + DOCUMENT_WORDS + ("OUTCOME",))
        and not is_raw(path)
    ]
    return sorted(candidates, key=endpoint_score)[:8]


def is_raw(path: Path) -> bool:
    lowered = {part.lower() for part in path.parts}
    return bool(lowered & RAW_PARTS)


def flatten_json_signals(value: Any, prefix: str = "") -> list[str]:
    signals: list[str] = []
    if isinstance(value, dict):
        for key in sorted(value):
            child = value[key]
            normalized = key.lower().replace(" ", "_")
            label = f"{prefix}.{key}" if prefix else key
            if normalized in SIGNAL_KEYS and isinstance(child, (str, int, float, bool)):
                signals.append(f"{label}={child}")
            signals.extend(flatten_json_signals(child, label))
    elif isinstance(value, list):
        for index, child in enumerate(value[:100]):
            signals.extend(flatten_json_signals(child, f"{prefix}[{index}]"))
    return signals


def extract_signals(path: Path, max_bytes: int = 2_000_000) -> list[str]:
    try:
        if path.stat().st_size > max_bytes:
            return []
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []
    if path.suffix.lower() == ".json":
        try:
            return flatten_json_signals(json.loads(text))[:20]
        except json.JSONDecodeError:
            pass
    signals = []
    for line in text.splitlines():
        match = SIGNAL_LINE.match(line) or MACHINE_LINE.match(line)
        if match:
            signal = f"{match.group(1).strip()}={match.group(2).strip()}"
            if signal not in signals:
                signals.append(signal)
        if len(signals) >= 20:
            break
    return signals


def human_bytes(size: int) -> str:
    value = float(size)
    for unit in ("B", "KiB", "MiB", "GiB", "TiB"):
        if value < 1024 or unit == "TiB":
            return f"{value:.1f} {unit}" if unit != "B" else f"{int(value)} B"
        value /= 1024
    raise AssertionError("unreachable")


def build_inventory(repo: Path, as_of: str) -> dict[str, Any]:
    files = untracked_files(repo)
    grouped: dict[str, list[Path]] = {}
    for path in files:
        grouped.setdefault(path.parts[0], []).append(path)

    packages = []
    total_bytes = 0
    raw_total_bytes = 0
    for root, paths in sorted(grouped.items()):
        records: list[tuple[str, str]] = []
        raw_records: list[tuple[str, str]] = []
        package_bytes = 0
        raw_bytes = 0
        extensions: Counter[str] = Counter()
        for rel_path in paths:
            absolute = repo / rel_path
            size = absolute.stat().st_size
            digest = sha256_file(absolute)
            local_path = Path(*rel_path.parts[1:]).as_posix()
            records.append((local_path, digest))
            package_bytes += size
            extensions[rel_path.suffix.lower() or "[none]"] += 1
            if is_raw(Path(*rel_path.parts[1:])):
                raw_records.append((local_path, digest))
                raw_bytes += size

        markers = marker_class(root, paths)
        candidates = endpoint_candidates(paths)
        signals = []
        for candidate in candidates:
            # Preserve breadth across endpoint documents. A long final report
            # must not crowd out a short machine-readable outcome record.
            for signal in extract_signals(repo / candidate)[:10]:
                entry = {"source": candidate.as_posix(), "signal": signal}
                if entry not in signals:
                    signals.append(entry)
                if len(signals) >= 80:
                    break
            if len(signals) >= 80:
                break

        review_class = {
            "TERMINAL_MARKER": "TERMINAL_CANDIDATE",
            "DOCUMENTED_MARKER": "DOCUMENTED_REVIEW",
            "NO_MARKER": "MANUAL_REVIEW",
        }[markers]
        packages.append(
            {
                "root": root,
                "family": family(root),
                "review_class": review_class,
                "marker_class": markers,
                "file_count": len(paths),
                "bytes": package_bytes,
                "raw_file_count": len(raw_records),
                "raw_bytes": raw_bytes,
                "sha256_tree": tree_hash(records),
                "sha256_raw_tree": tree_hash(raw_records) if raw_records else None,
                "extensions": dict(sorted(extensions.items())),
                "endpoint_candidates": [path.as_posix() for path in candidates],
                "status_signals": signals,
            }
        )
        total_bytes += package_bytes
        raw_total_bytes += raw_bytes

    return {
        "schema": "nexah-science-lab-endpoint-reconstruction-v1",
        "as_of": as_of,
        "repository": {
            "head": git(repo, "rev-parse", "HEAD"),
            "branch": git(repo, "branch", "--show-current"),
        },
        "boundary": {
            "scientific_adoption": False,
            "research_files_modified": False,
            "raw_data_publication_authorized": False,
            "note": "Markers and extracted labels locate review candidates; they do not establish scientific authority.",
        },
        "summary": {
            "package_roots": len(packages),
            "untracked_files": len(files),
            "bytes": total_bytes,
            "raw_files": sum(package["raw_file_count"] for package in packages),
            "raw_bytes": raw_total_bytes,
            "families": dict(sorted(Counter(package["family"] for package in packages).items())),
            "review_classes": dict(
                sorted(Counter(package["review_class"] for package in packages).items())
            ),
        },
        "packages": packages,
    }


def markdown(inventory: dict[str, Any]) -> str:
    summary = inventory["summary"]
    packages = inventory["packages"]
    lines = [
        "# Science Lab Endpoint Reconstruction",
        "",
        f"Snapshot: {inventory['as_of']}",
        "",
        f"Repository HEAD: `{inventory['repository']['head']}`",
        "",
        "> This is a repository-review ledger, not a scientific adoption record. "
        "Endpoint markers and extracted labels must be checked against the Master Status and the package's actual authority chain.",
        "",
        "## Inventory",
        "",
        f"- Package roots: **{summary['package_roots']:,}**",
        f"- Untracked files: **{summary['untracked_files']:,}**",
        f"- Total bytes: **{human_bytes(summary['bytes'])}**",
        f"- Raw/data-like files: **{summary['raw_files']:,}** ({human_bytes(summary['raw_bytes'])})",
        "- Review classes: " + ", ".join(
            f"`{key}` {value}" for key, value in summary["review_classes"].items()
        ),
        "",
        "## Largest packages",
        "",
        "| Package | Files | Size | Raw/data-like | Review class |",
        "| --- | ---: | ---: | ---: | --- |",
    ]
    for package in sorted(packages, key=lambda item: item["bytes"], reverse=True)[:20]:
        lines.append(
            f"| `{package['root']}` | {package['file_count']:,} | "
            f"{human_bytes(package['bytes'])} | {human_bytes(package['raw_bytes'])} | "
            f"`{package['review_class']}` |"
        )

    lines.extend(
        [
            "",
            "## Manual-review roots",
            "",
        ]
    )
    manual = [package for package in packages if package["review_class"] == "MANUAL_REVIEW"]
    if manual:
        lines.extend(f"- `{package['root']}`" for package in manual)
    else:
        lines.append("None.")

    lines.extend(
        [
            "",
            "## Package ledger",
            "",
            "| Package | Family | Files | Size | Class | Endpoint candidates | Tree SHA-256 |",
            "| --- | --- | ---: | ---: | --- | ---: | --- |",
        ]
    )
    for package in packages:
        lines.append(
            f"| `{package['root']}` | {package['family']} | {package['file_count']:,} | "
            f"{human_bytes(package['bytes'])} | `{package['review_class']}` | "
            f"{len(package['endpoint_candidates'])} | `{package['sha256_tree']}` |"
        )

    lines.extend(
        [
            "",
            "## Interpretation boundary",
            "",
            "- `TERMINAL_CANDIDATE` means terminal-looking documents exist; it does not mean adopted or scientifically valid.",
            "- `DOCUMENTED_REVIEW` means orientation material exists but a bounded disposition still must be established.",
            "- `MANUAL_REVIEW` means filenames alone do not expose a safe endpoint.",
            "- The JSON ledger contains candidate paths, bounded extracted labels, full package hashes and separate raw-tree hashes.",
            "- Re-run the generator after each approved package disposition; never hand-edit the generated ledgers.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--as-of", default="2026-08-14")
    args = parser.parse_args()
    repo = args.repo.resolve()
    inventory = build_inventory(repo, args.as_of)
    desk = repo / DESK_ROOT
    desk.mkdir(parents=True, exist_ok=True)
    json_path = desk / "ENDPOINT_RECONSTRUCTION.json"
    md_path = desk / "ENDPOINT_RECONSTRUCTION.md"
    json_path.write_text(
        json.dumps(inventory, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    md_path.write_text(markdown(inventory), encoding="utf-8")
    print(
        f"Inventoried {inventory['summary']['package_roots']} roots, "
        f"{inventory['summary']['untracked_files']} files, "
        f"{human_bytes(inventory['summary']['bytes'])}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
