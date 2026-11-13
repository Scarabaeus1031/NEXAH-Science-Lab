#!/usr/bin/env python3
"""Export bounded Gaia DR3 presets into the existing MIWA star-map schema.

This is a source adapter for ART:MIWA:MAIN, not a new astronomical catalogue,
Source Graph identity, research activation, or publication pipeline.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import math
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Mapping


TAP_URL = "https://gea.esac.esa.int/tap-server/tap/sync"
GAIA_RELEASE = "Gaia DR3 / gaiadr3.gaia_source"
GAIA_DOC_URL = "https://www.cosmos.esa.int/web/gaia-users/archive"
NASA_SIRIUS_URL = "https://science.nasa.gov/asset/hubble/the-dog-star-sirius-and-its-tiny-companion/"
NASA_M31_URL = "https://science.nasa.gov/asset/hubble/andromeda-galaxy-m31-wide-field-image/"

BASE_SELECT = """source_id, ra, dec, parallax, parallax_error,
parallax_over_error, phot_g_mean_mag, bp_rp, ruwe, ref_epoch,
phot_variable_flag, non_single_star"""

CSV_FIELDS = [
    "source_id", "carrier", "ra_deg", "dec_deg", "distance_pc",
    "magnitude", "bp_rp", "spectral_class", "variable", "multiple",
    "uncertainty", "epoch", "source_catalog", "source_release",
    "source_url", "query_id", "distance_method", "parallax_mas",
    "parallax_error_mas", "ruwe", "field_role", "claim_boundary",
]

PRESETS = {
    "bright-nearby": {
        "filename": "MIWA_GAIA_BRIGHT_NEARBY.csv",
        "carrier": "Milky Way",
        "where": """parallax > 10
AND parallax_over_error >= 10
AND phot_g_mean_mag IS NOT NULL
AND phot_g_mean_mag <= 8
AND ruwe < 1.4""",
        "order": "phot_g_mean_mag ASC",
        "field_role": "BRIGHT_NEARBY_QUALITY_CUT",
        "boundary": "Inverse-parallax display distance after declared quality cuts; not a complete nearby-star census.",
    },
    "sirius-neighborhood": {
        "filename": "MIWA_GAIA_SIRIUS_NEIGHBORHOOD.csv",
        "carrier": "Milky Way",
        "where": """1 = CONTAINS(
  POINT('ICRS', ra, dec),
  CIRCLE('ICRS', 101.28715533, -16.71611586, 5.0)
)
AND parallax > 0
AND parallax_over_error >= 10
AND phot_g_mean_mag IS NOT NULL
AND phot_g_mean_mag <= 15
AND ruwe < 1.4""",
        "order": None,
        "field_role": "SIRIUS_5_DEGREE_FIELD",
        "boundary": "Gaia quality-cut field around the Sirius direction; proximity on screen is not physical association.",
    },
    "andromeda-field": {
        "filename": "MIWA_GAIA_ANDROMEDA_FIELD.csv",
        "carrier": "Milky Way",
        "where": """1 = CONTAINS(
  POINT('ICRS', ra, dec),
  CIRCLE('ICRS', 10.6847083, 41.26875, 2.0)
)
AND parallax > 0
AND parallax_over_error >= 5
AND phot_g_mean_mag IS NOT NULL
AND phot_g_mean_mag <= 18
AND ruwe < 1.4""",
        "order": None,
        "field_role": "M31_DIRECTION_FOREGROUND",
        "boundary": "Gaia sources in the M31 sightline are retained as Milky Way foreground unless a separate membership source says otherwise.",
    },
}


def finite_number(value: object) -> float | None:
    try:
        number = float(str(value).strip())
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def format_number(value: float | None, digits: int = 8) -> str:
    if value is None:
        return ""
    return f"{value:.{digits}g}"


def spectral_proxy(bp_rp: float | None) -> str:
    """Return a color-class proxy, explicitly not a spectroscopic type."""
    if bp_rp is None:
        return "G"
    if bp_rp < -0.1:
        return "O"
    if bp_rp < 0.1:
        return "B"
    if bp_rp < 0.3:
        return "A"
    if bp_rp < 0.55:
        return "F"
    if bp_rp < 0.85:
        return "G"
    if bp_rp < 1.35:
        return "K"
    return "M"


def make_adql(preset: str, limit: int) -> str:
    spec = PRESETS[preset]
    query = (
        f"SELECT TOP {limit} {BASE_SELECT}\n"
        "FROM gaiadr3.gaia_source\n"
        f"WHERE {spec['where']}"
    )
    if spec["order"]:
        query += f"\nORDER BY {spec['order']}"
    return query


def query_gaia(adql: str, timeout: int = 240) -> List[Dict[str, str]]:
    payload = urllib.parse.urlencode({
        "REQUEST": "doQuery",
        "LANG": "ADQL",
        "FORMAT": "csv",
        "QUERY": adql,
    }).encode("utf-8")
    request = urllib.request.Request(
        TAP_URL,
        data=payload,
        headers={"User-Agent": "NEXAH-MIWA-Gaia-Bridge/1.0"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        text = response.read().decode("utf-8-sig")
    rows = list(csv.DictReader(io.StringIO(text)))
    if not rows:
        raise RuntimeError("Gaia TAP returned no rows for the selected preset")
    return rows


def gaia_row_to_miwa(
    row: Mapping[str, object], preset: str, query_id: str
) -> Dict[str, str]:
    parallax = finite_number(row.get("parallax"))
    parallax_error = finite_number(row.get("parallax_error"))
    distance_pc = 1000.0 / parallax if parallax and parallax > 0 else None
    distance_error_pc = (
        1000.0 * parallax_error / (parallax * parallax)
        if distance_pc is not None and parallax_error is not None
        else None
    )
    bp_rp = finite_number(row.get("bp_rp"))
    variable_flag = str(row.get("phot_variable_flag") or "").upper()
    non_single = finite_number(row.get("non_single_star")) or 0
    spec = PRESETS[preset]
    return {
        "source_id": f"GAIA_DR3_{row.get('source_id', '')}",
        "carrier": str(spec["carrier"]),
        "ra_deg": format_number(finite_number(row.get("ra")), 12),
        "dec_deg": format_number(finite_number(row.get("dec")), 12),
        "distance_pc": format_number(distance_pc, 10),
        "magnitude": format_number(finite_number(row.get("phot_g_mean_mag")), 7),
        "bp_rp": format_number(bp_rp, 7),
        "spectral_class": spectral_proxy(bp_rp),
        "variable": "true" if variable_flag == "VARIABLE" else "false",
        "multiple": "true" if non_single > 0 else "false",
        "uncertainty": format_number(distance_error_pc, 8),
        "epoch": format_number(finite_number(row.get("ref_epoch")), 7),
        "source_catalog": "GAIA",
        "source_release": "DR3",
        "source_url": TAP_URL,
        "query_id": query_id,
        "distance_method": "INVERSE_PARALLAX_1000_OVER_MAS_QUALITY_CUT",
        "parallax_mas": format_number(parallax, 9),
        "parallax_error_mas": format_number(parallax_error, 8),
        "ruwe": format_number(finite_number(row.get("ruwe")), 7),
        "field_role": str(spec["field_role"]),
        "claim_boundary": str(spec["boundary"]),
    }


def anchor_rows(preset: str, query_id: str) -> List[Dict[str, str]]:
    if preset == "sirius-neighborhood":
        return [{
            "source_id": "SIRIUS",
            "carrier": "Milky Way",
            "ra_deg": "101.28715533",
            "dec_deg": "-16.71611586",
            "distance_pc": format_number(8.6 / 3.26156, 9),
            "magnitude": "-1.46",
            "bp_rp": "",
            "spectral_class": "A",
            "variable": "false",
            "multiple": "true",
            "uncertainty": "",
            "epoch": "REFERENCE_NO_EPOCH",
            "source_catalog": "NEXAH_A0_BOUND_REFERENCE",
            "source_release": "NASA_8.6_LIGHT_YEARS_ROUNDED",
            "source_url": NASA_SIRIUS_URL,
            "query_id": query_id,
            "distance_method": "NASA_ROUNDED_LIGHT_YEAR_REFERENCE",
            "parallax_mas": "",
            "parallax_error_mas": "",
            "ruwe": "",
            "field_role": "FIELD_ANCHOR_NOT_GAIA_ROW",
            "claim_boundary": "Rounded Sirius reference anchor; not silently represented as a Gaia measurement.",
        }]
    if preset == "andromeda-field":
        return [{
            "source_id": "M31_CORE_REFERENCE",
            "carrier": "Andromeda",
            "ra_deg": "10.6847083",
            "dec_deg": "41.26875",
            "distance_pc": "800000",
            "magnitude": "3.1",
            "bp_rp": "",
            "spectral_class": "G",
            "variable": "false",
            "multiple": "false",
            "uncertainty": "",
            "epoch": "REFERENCE_NO_EPOCH",
            "source_catalog": "NASA_HUBBLE_MESSIER_REFERENCE",
            "source_release": "ABOUT_0.8_MPC",
            "source_url": NASA_M31_URL,
            "query_id": query_id,
            "distance_method": "NASA_APPROXIMATE_0.8_MPC_REFERENCE",
            "parallax_mas": "",
            "parallax_error_mas": "",
            "ruwe": "",
            "field_role": "M31_CORE_ANCHOR_NOT_GAIA_ROW",
            "claim_boundary": "Approximate M31 core reference; surrounding Gaia rows remain Milky Way foreground.",
        }]
    return []


def write_csv(path: Path, rows: Iterable[Mapping[str, str]]) -> int:
    materialized = list(rows)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(materialized)
    return len(materialized)


def write_js_bundle(output_dir: Path, results: Iterable[Mapping[str, object]], generated_at: str) -> Path:
    presets = {}
    for result in results:
        csv_path = output_dir / str(result["file"])
        with csv_path.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle))
        presets[str(result["preset"])] = {
            "filename": csv_path.name,
            "query_id": result["query_id"],
            "boundary": result["boundary"],
            "rows": rows,
        }
    bundle = {
        "schema": "nexah.miwa.gaia-preset-bundle/1",
        "generated_at": generated_at,
        "authority": False,
        "graph_delta": 0,
        "presets": presets,
    }
    target = output_dir / "MIWA_GAIA_PRESETS.js"
    target.write_text(
        "window.MIWA_GAIA_PRESETS = " + json.dumps(bundle, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    return target


def run_preset(preset: str, limit: int, output_dir: Path) -> Dict[str, object]:
    adql = make_adql(preset, limit)
    query_id = "GAIA_DR3_" + hashlib.sha256(adql.encode("utf-8")).hexdigest()[:16].upper()
    gaia_rows = query_gaia(adql)
    rows = anchor_rows(preset, query_id) + [
        gaia_row_to_miwa(row, preset, query_id) for row in gaia_rows
    ]
    target = output_dir / str(PRESETS[preset]["filename"])
    row_count = write_csv(target, rows)
    return {
        "preset": preset,
        "file": target.name,
        "row_count": row_count,
        "gaia_row_count": len(gaia_rows),
        "anchor_row_count": len(rows) - len(gaia_rows),
        "query_id": query_id,
        "adql": adql,
        "boundary": PRESETS[preset]["boundary"],
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--preset",
        choices=["all", *PRESETS.keys()],
        default="all",
        help="Preset to export (default: all)",
    )
    parser.add_argument("--limit", type=int, default=240, help="Maximum Gaia rows per preset")
    parser.add_argument(
        "--output-dir", type=Path, default=Path(__file__).resolve().parent,
        help="Directory for CSV files and the manifest",
    )
    return parser


def main(argv: List[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if not 1 <= args.limit <= 5000:
        raise SystemExit("--limit must be between 1 and 5000")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    selected = list(PRESETS) if args.preset == "all" else [args.preset]
    results = [run_preset(name, args.limit, args.output_dir) for name in selected]
    generated_at = datetime.now(timezone.utc).isoformat()
    bundle_path = write_js_bundle(args.output_dir, results, generated_at)
    manifest = {
        "schema": "nexah.miwa.gaia-preset-manifest/1",
        "generated_at": generated_at,
        "identity_reuse": ["MOD:OBSERVATORY_MIWA", "ART:MIWA:MAIN"],
        "authority": False,
        "graph_delta": 0,
        "publication_authorized": False,
        "source_endpoint": TAP_URL,
        "source_release": GAIA_RELEASE,
        "source_documentation": GAIA_DOC_URL,
        "distance_rule": "distance_pc = 1000 / parallax_mas after each preset's declared quality cuts",
        "spectral_rule": "spectral_class is a BP-RP display-color proxy, not a spectroscopic classification",
        "andromeda_boundary": "Gaia cone rows in the M31 direction remain Milky Way foreground; only the separately sourced M31 core reference uses the Andromeda carrier.",
        "browser_bundle": bundle_path.name,
        "presets": results,
    }
    manifest_path = args.output_dir / "MIWA_GAIA_PRESET_MANIFEST.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "manifest": str(manifest_path), "presets": results}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # explicit CLI failure surface
        print(json.dumps({"status": "ERROR", "error": str(exc)}), file=sys.stderr)
        raise
