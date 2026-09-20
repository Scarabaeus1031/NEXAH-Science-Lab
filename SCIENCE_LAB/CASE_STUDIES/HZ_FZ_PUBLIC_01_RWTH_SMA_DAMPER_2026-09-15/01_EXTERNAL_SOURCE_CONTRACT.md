# HZ_FZ_PUBLIC_01 — External Source Contract

Date: `2026-09-15`

Status: `SOURCE_SNAPSHOT_ACQUIRED_AND_VERIFIED`

## Source

- Dataset: *Dataset of real-time hybrid simulation testing of multiple shape
  memory alloy based structural control devices*
- Authors: Florian Kolisch, Selin Oflazgil and Sven Klinkel
- Institution: RWTH Aachen University, Chair of Structural Analysis and Dynamics
- DOI: `10.5281/zenodo.17296336`
- Version: Zenodo v1, published `2025-12-31`
- License: `CC BY-SA 4.0`

## Frozen source snapshot

The original archive and load protocol are retained without modification in
`source/`. Four byte-identical CSV members are extracted into `selected/` for
inspection. Their hashes are recorded in `SOURCE_MANIFEST_SHA256.txt`.

## Selected relations

| Pair | Cut A | Cut B | Declared condition |
|---|---|---|---|
| `P05_BEFORE_AFTER_EQ` | `07_4wires_sin20mm_0p5Hz.csv` | `09_4wires_sin20mm_0p5Hz_after_EQ.csv` | four wires, 20 mm, 0.5 Hz, before/after EQ |
| `P10_BEFORE_AFTER_EQ` | `08_4wires_sin40mm_1p0Hz.csv` | `10_4wires_sin40mm_1p0Hz_after_EQ.csv` | four wires, 40 mm, 1.0 Hz, before/after EQ |

Each CSV contains time, displacement and force for two actuators. Time is in
seconds, displacement in millimetres and force in kilonewtons. The effective
sample rate is 512 Hz; exported timestamps are rounded to microseconds.

## Claim boundary

These are real laboratory observations and valid external E2 evidence. Cut B
was recorded after an earthquake campaign, so the pair is a before/after
relation, not an independent same-condition replay. The dataset does not expose
the measured electrical drive voltage, a separate zero-drive NULL run or the
calibration uncertainty required by the frozen HZ_FZ_01 admission contract.

Therefore this source must not activate `hz-fz-transfer`, must not be relabelled
as HZ_FZ_01, and must not support a causal earthquake-effect claim. It may be
used for a separately identified public-source Kernel 0.7 attachment.
