# PHX-00 — Source Bindings

## Authorized search root

The preflight was limited to the current NEXAH Science Lab checkout. No claim
is made about repositories outside this checkout.

Physical checkout resolved during the audit:

```text
/Users/tho2020/Documents/NEXAH ECOSYSTEM/30 SCIENCE LAB/NEXAH-Science-Lab
```

## Binding 1 — Canonical local admission case

Relative path:

```text
SCIENCE_LAB/CASE_STUDIES/HZ_FZ_01_FREQUENCY_FORCE_ADMISSION_2026-09-15
```

Authority role: local HZ/FZ measurement and admission contract.

The contract requires three real runs (`NULL`, `REFERENCE_A`, `REPLAY_B`) with
ordered samples of elapsed time, measured drive voltage and calibrated axial
force. The current record states:

```text
REAL_DATA       = ABSENT
RUNTIME_PROFILE = FAIL_CLOSED
```

The included `hz_fz_01_synthetic_conformance.csv` contains 1,203 synthetic
software-test observations. It is not empirical evidence and is not used to
justify an empirical phase finding.

## Binding 2 — Eligible external empirical source

Relative path:

```text
SCIENCE_LAB/CASE_STUDIES/HZ_FZ_PUBLIC_01_RWTH_SMA_DAMPER_2026-09-15
```

Authority role: external E2 source case, not a substitute for HZ_FZ_01
admission.

Source identification retained by the case:

```text
Dataset: Dataset of real-time hybrid simulation testing of multiple shape
         memory alloy based structural control devices
Institution: RWTH Aachen University
DOI: 10.5281/zenodo.17296336
License: CC BY-SA 4.0
```

Each selected CSV has the same five columns:

```text
Time,Actuator1_Disp,Actuator1_Force,Actuator2_Disp,Actuator2_Force
```

Units are seconds, millimetres and kilonewtons. `Time` is a relative time axis
shared by all four signal columns within a file. The verified effective sample
rate is approximately 512 Hz, with timestamps rounded to microseconds.

## Bound hashes

| File | Rows | Nominal condition | SHA-256 |
|---|---:|---|---|
| `selected/07_4wires_sin20mm_0p5Hz.csv` | 16,384 | 0.5 Hz, before EQ | `36cf6cc994de28fdc32b609dc9fe4b671d154584c0e69bcb1b93631568bc4b61` |
| `selected/09_4wires_sin20mm_0p5Hz_after_EQ.csv` | 16,384 | 0.5 Hz, after EQ | `b3274aa7a2dceea186394630b93b80a0f7ea6ca2040d0a4faec8dea3b2cefe8b` |
| `selected/08_4wires_sin40mm_1p0Hz.csv` | 8,192 | 1.0 Hz, before EQ | `3e21c2be71089caf4b800c09cb0e7c846772e318791445063bd05e1ee3fd2bae` |
| `selected/10_4wires_sin40mm_1p0Hz_after_EQ.csv` | 8,192 | 1.0 Hz, after EQ | `eae1c973b447653642ef0cb3013ab954bd6bbde172b4017bf4388ba9941f0e36` |
| `source/Data_v1.0.0.zip` | — | frozen source archive | `8f32e7bdddbe2a262ed227df108a6fd05df87a5752ca1574f586b10a7748e929` |
| `source/Load_Protocol_v1.0.0.pdf` | — | source protocol | `7346ffbc5df666dd710088c4765069a3c7e86801410bcc1a73a1c33fb6b17433` |

All six hashes were recomputed during PHX-00 and matched
`SOURCE_MANIFEST_SHA256.txt`.

## Reproduction check

The existing `inspect_public_source.py` was executed with its output directed
to a temporary file. That result was byte-identical to the retained
`SOURCE_INTAKE_RESULT.json`; both had SHA-256:

```text
36a66c91ff54578f04f32afe9675254eb38ae64deccf9755f3d694aab3ac255c
```

## Unresolved source references

The mission-draft reference `Pasted markdown(20260919-221323).md` was not found
in the authorized search root. The previously quoted `O-FLIP` /
`ORDER_SENSITIVITY` markers were also not located there. They are not treated
as repository facts by PHX-00 and are not prerequisites for the bounded
public-data phase extension.

