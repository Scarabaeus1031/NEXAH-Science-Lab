# Source and Provenance Audit

Date: 2026-08-13 (Europe/Berlin)

Status of every finding: `NOT_ADOPTED`

## Historical inputs

| Input | SHA-256 | Observed form | Classification |
|---|---|---|---|
| `/Users/tho2020/Desktop/ieee_simulation_proof.py` | `91161d0e6705c0ffe9fe1f294752bb28f486e8ab8bf3786cda9a72101a32c775` | 173-line Python script | `SYNTHETIC_CONCEPT_DEMONSTRATOR` |
| `/Users/tho2020/Desktop/ieee_early_warning_plot.png` | `876f526d080cdb7c734ed3b25176b924913ae6b809b1a3df7fa3a7d7f888c6d9` | 1486×1182 RGB PNG | rendered output of a shaped demonstration |

Disposition:

```text
SYNTHETIC_CONCEPT_DEMONSTRATOR
NOT_VALIDATION_EVIDENCE
NOT_ADOPTED
```

The files were read but not edited, moved or replaced. The plot alone has no
embedded run manifest, seed, environment lock, raw-state checksum, IEEE case
identity or event contract.

## Why this classification is mandatory

The script implements a manually parameterized four-oscillator swing-like
model, not a registered IEEE benchmark. It calculates raw traces, then replaces
the reported warning/alarm steps with 65/105, assigns collapse step 110, and
reshapes the indicator, comparator and rotor-angle traces. The plot therefore
illustrates an intended narrative; it does not measure early-warning ability.

## Current repository references independently checked

Current NEXAH checkout and `origin/main` both resolve to
`923362e141170f06f2f0f26992136b5979047c42`.

The canonical IEEE Geometry V1 manifest currently states:

- evidence class `benchmark_model`;
- campaign axis `ordered_load_scale_not_time`;
- IEEE-9 method development and IEEE-14 locked evaluation;
- outcome status `not_observed`;
- episodic update forbidden;
- no stability, causal, prediction, control or operational claim.

The current infrastructure is a steady-state Pandapower geometry/replay path.
It is not a transient rotor-dynamics or early-warning validator.

## Diagnostic-only reconstruction

A temporary, non-repository diagnostic reconstructed only lines 8–93 of the
supplied raw simulation, stopping before all overwrites. It used explicit
legacy-compatible seeds 0–99.

| Observation | Result |
|---|---|
| Raw `S < 0.85` first crossing | steps 50–52 |
| Raw velocity-deviation `> 0.15` first crossing | step 2 in every run |
| Raw lead `alarm - warning` | −50 to −48 steps |
| Raw warning exactly 65 | 0/100 |
| Raw alarm exactly 105 | 0/100 |
| Maximum effect of `x_cubit` on coherence magnitude | `5.6e-16` (roundoff) |

This is a forensic consistency check, not validation of either indicator.

