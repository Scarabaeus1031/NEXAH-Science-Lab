# `00_INCOMING` Breakdown

Snapshot date: `2026-09-18`

## What the number means

The current folder contains `3,255` files in `36` immediate child packages.
Mission Control's previous root-level inventory recorded `2,704` files. The
resulting `+551` is an aggregate count difference, not a proven list of 551
specific arrivals: the earlier inventory did not preserve a per-file baseline.

## Package families

| Family | Packages | Files | Typical contents |
|---|---:|---:|---|
| CRIC D-GATE chain | 25 | 2,894 | contracts, runners, TypeScript/JavaScript, JSON records, fixtures, results, hashes and vendored dependencies |
| Prime Genesis | 9 | 292 | visual source corpus, gate reports, Python scripts, CSV/JSON results, figures and manifests |
| Dual View Rosetta | 1 | 42 | module documentation, visual assets and relation/view material |
| Multi-View | 1 | 27 | method specification, compatibility fixtures, results, figures and validation scripts |

## File types

| Type | Count |
|---|---:|
| JSON | 1,230 |
| MJS | 632 |
| Markdown | 373 |
| TypeScript | 225 |
| CSV | 160 |
| JavaScript | 143 |
| PNG | 117 |
| TXT | 115 |
| source maps | 109 |
| SHA-256 files | 70 |
| Python | 23 |
| SVG | 15 |
| HTML | 14 |
| no extension | 12 |
| YAML | 9 |
| DOCX | 2 |
| PDF | 1 |
| GLB | 1 |
| XML | 1 |
| Swift | 1 |

The counts also include `553` files below `node_modules` and `109` source-map
files. Those are dependency/build material, not 662 separate research objects.

## Largest packages

| Package | Files | Approximate bytes | Reading |
|---|---:|---:|---|
| `NEXAH_D_GATE_07_CRIC01_FIRST_SYNTHETIC_EXECUTION_2026-09-05` | 785 | 4.49 MB | CRIC implementation/execution package including dependencies |
| `NEXAH_D_GATE_10_2R4_1_CRIC01_PRODUCTION_CLOCK_REPAIR_2026-09-06` | 253 | 1.60 MB | late CRIC repair gate |
| `NEXAH_D_GATE_10_2R4_CRIC01_PRODUCTION_ROUTE_READINESS_2026-09-06` | 238 | 2.49 MB | CRIC route-readiness gate |
| `NEXAH_D_GATE_10_2R2_CRIC01_CONTROLLER_INTERFACE_REPAIR_2026-09-06` | 224 | 1.26 MB | controller-interface repair |
| `NEXAH_D_GATE_10_2R3_CRIC01_CUT_INPUT_INGRESS_REPAIR_2026-09-06` | 200 | 2.06 MB | cut-input ingress repair |
| `THe Prime Genesis` | 86 | 191.52 MB | 79 PNGs, 2 HTML, DOCX, PDF, Markdown and macOS metadata |
| `NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05` | 42 | 11.17 MB | dual-view intake |
| `THE_PRIME_GENESIS_DUAL_GENERATOR_RETURN_GATE_01_2026-09-08` | 37 | 7.66 MB | generator/return results; includes a 7.26 MB CSV |

## What should happen next

The safe unit of review is the package, not the individual file. For every one
of the 36 child packages, determine:

1. whether it is already represented by a sealed Desk review or closure;
2. whether its source, result and manifest are unique;
3. whether vendored dependencies can be reconstructed from a lockfile;
4. whether it belongs in evidence custody, canonical source, generated output
   or archive;
5. whether the Research Corpus Inventory already supplies an adequate locator.

Until that classification exists, `00_INCOMING` remains preserved in place.
