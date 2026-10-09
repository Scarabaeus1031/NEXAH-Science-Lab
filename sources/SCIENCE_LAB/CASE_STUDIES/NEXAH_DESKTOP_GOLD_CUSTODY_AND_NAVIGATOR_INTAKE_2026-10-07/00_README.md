# NEXAH Desktop Gold Custody & Navigator Intake

**Date:** 2026-10-07  
**Status:** pre-promotion custody package; promotion is allowed only after `run_intake_audit.py` reports `PASS`.

This package recovers the strongest material found in `Desktop/00_INCOMING` without turning the Desktop folder into a second, uncontrolled repository.

## Canonical intake

- `sources/mrb/` preserves the complete MRB test series found in the incoming folder. The recovered sequence is MRB-01, 02, 04, 05, 06, 07, 08, 09 and 10; no MRB-03 package was present.
- `sources/clockwork/` preserves one canonical reference GLB for each version V1–V7, the dependency-free builders, the V1/V2 snapshot chunks and the verification scripts. Redundant `output/` and `reproduced/` copies were not imported; the latter are rebuilt by the audit.
- `sources/acr/` preserves the named ACR-27–45+ markers, reports, result ledgers, executable runners and multimodal ACR-45 evidence. Anonymous UUID images and `.DS_Store` metadata were excluded.

## Key recovery

The original MRB-10 package is present at
`sources/mrb/MRB10_YT_PASCAL_THREAD_GRID/`. Its executable test returns
`PASS_WITH_REPRESENTATION_BOUNDARY`. This corrects the earlier repository-only
assessment that the original canonical source had not been recovered. It does
not invalidate the later Block02A reconstruction; the two records now form a
source/reconstruction comparison pair.

## Scientific boundary

The package establishes custody, reproducibility and typed representation
boundaries. It does **not** establish new physical laws. In particular:

- V1–V2 are exact snapshot reassemblies, not recovered historical geometry code.
- V3–V7 are reproducible from retained current builders; historical originality is not proven.
- ACR markers distinguish verified arithmetic/kinematics from representation-only and open semantic links.
- ACR-42's Unicode normalization results are preserved and independently checkable, but its four-font contour rerun remains quarantined until `Latin Modern Math` is available; no fallback font is substituted.
- `ø` is treated as a split/cut state and `œ` as a bound transition/ligature state only inside the declared local grammar; neither glyph has an automatic universal meaning.

## Run

```bash
python3 run_intake_audit.py
```

Outputs are written to `results/`. A `PASS` may include a named quarantine only
when the quarantined component is excluded from executable promotion and its
unavailable dependency is recorded explicitly.

The family-by-family Desktop decision is recorded in
[`02_DESKTOP_ARCHAEOLOGY_REGISTER.md`](02_DESKTOP_ARCHAEOLOGY_REGISTER.md).
