# HZ/FZ — SMA Damper and Phase Experiment Family

Date: `2026-09-20`

Status: `CURRENT_FAMILY_INDEX / EVIDENCE_REMAINS_WITH_OWNING_PACKAGES`

Primary subject: `PHYSICS / MECHANICS / STRUCTURAL DYNAMICS`

Secondary methods: `SIGNAL PROCESSING / APPLIED MATHEMATICS / STATISTICS`

## Current state

The family contains a pending local frequency-to-force admission protocol and
a completed external-data force-displacement phase analysis whose ordinal
Before/After contrast tends toward zero. It does not establish a causal
relaxation mechanism or a local admitted measurement profile. POLARPASS is
retained as a related, on-hold application branch of the same experimental
record architecture; it is not an admitted HZ/FZ result or a shared-physics
claim.

## Package map

| Order | Package | Role and state |
|---:|---|---|
| 1 | `../../CASE_STUDIES/HZ_FZ_01_FREQUENCY_FORCE_ADMISSION_2026-09-15/` | local contract; real measurement absent, fail closed |
| 2 | `../../CASE_STUDIES/HZ_FZ_PUBLIC_01_RWTH_SMA_DAMPER_2026-09-15/` | external RWTH evidence; E2 only |
| 3 | `../../CASE_STUDIES/PHX_00_PHASE_RECOVERABILITY_GATE_2026-09-20/` | source/shared-time eligibility gate |
| 4 | `../../CASE_STUDIES/PHX_01_EXTERNAL_E2_PHASE_ANALYSIS_2026-09-20/` | completed force-displacement phase result |
| 5 | `../../CASE_STUDIES/KAPPA_02_WITHIN_RUN_PHASE_PATH_AUDIT_2026-09-20/` | completed ordinal path result |
| 6 | `../../CASE_STUDIES/PQR_01_PHASE_QUANTIZATION_RESIDUAL_SEAM_AUDIT_2026-09-20/` | representation control |
| 7 | `../../CASE_STUDIES/E11_01_DECIMAL_ELEVATOR_AUDIT_2026-09-20/` | negative 11-specificity result |
| 8 | `../../REVIEWS/HZ_PHASE_KAPPA_E11_SHADOW_CUBE_THREAD_RETURN_2026-09-20/FINAL_RETURN.md` | closed thread synthesis |

`KAPPA_01_PROSPECTIVE_SHARED_CLOCK_CAMPAIGN_2026-09-20` is an optional
future gate, not an active research cycle.

## Related application branch — POLARPASS

POLARPASS and the HZ/FZ Compass-Binder share a bounded experiment pattern:

```text
declared excitation or reference
  -> measured response or multiple views
  -> declared transfer operator or estimator
  -> reference/replay comparison
  -> phase or axis estimate plus uncertainty
  -> typed residual and return
```

The roles remain physically distinct. HZ/FZ measures an apparatus-bound
dynamic transfer from recorded drive voltage to calibrated axial force and
reports `Gz(f)` in magnitude and phase. A future instrumented POLARPASS profile
would estimate a latent orientation axis from independently measured sensor or
projection views. Existing POLARPASS slider and visual models are expression
or design records; they are not sensors, independent observations or admitted
orientation estimators.

The branch is therefore classified
`RELATED_APPLICATION_PROFILE / ON_HOLD / NO_PROFILE_ACTIVATION`. It may be
reopened only through a prospective apparatus contract that declares the
reference axis, independent sensors, estimator, calibration, uncertainty,
NULL/reference/replay records and residual stop rule. One possible bounded
bridge is to excite a flexible middle stage at fixed frequencies, measure both
`F_z(t)` and encoder/camera axis error, and test whether measured transfer
phase predicts out-of-sample orientation correction rather than added
hysteresis or noise.

Custody and prior claim boundaries remain with
`../../CASE_STUDIES/INTAKE_REPORT_GEMINI_POLARPASS_SUITE_2026-08-22.md`.
That intake retains the suite as archived evidence, does not adopt its
scientific or release claims and authorizes no research activation.

## Subject split

| Result | Subject |
|---|---|
| force-displacement phase and Before/After contrast | Physics plus statistics |
| ordinal path tending toward zero | Physics/dynamics, descriptive only |
| decimal, palindrome and 11-family readings | representation audit |
| `12^3 - 1`, `12^3`, `12^3 + 1` | Mathematics |

Allowed: stable external-data phase and bounded ordinal structure under the
frozen methods. Not allowed: earthquake causation, isolated frequency effect,
universal relaxation, number mechanism or local profile admission.

Start here for the family overview; use package files for evidence, the
subject glossaries for terminology and Mission Control for live status.
