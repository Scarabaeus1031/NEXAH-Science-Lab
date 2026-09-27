# HZ_FZ_01 — Frequency-to-Force Admission Gate

Date: `2026-09-15`

Status: `ADMISSION_GATE_READY_MEASUREMENT_PENDING`

This case freezes the smallest admissible bridge from a periodic electrical
drive to a calibrated axial force record. It does not claim that frequency is
force. It asks whether two controlled runs recover the same measured transfer
relation within declared tolerances.

```text
NULL RUN
  establishes detector floor

REFERENCE_A
  freezes the first calibrated drive/force cut

REPLAY_B
  repeats the declared operating point

Gz(f) = force fundamental / drive fundamental
  magnitude: N/V
  phase: degrees
```

## Files

- `01_ADMISSION_CONTRACT.md` — frozen measurement and decision contract;
- `measurement.schema.json` — machine-readable record shape;
- `measurement.pending.json` — explicit non-measurement placeholder;
- `hz_fz_01_synthetic_conformance.csv` — flat generated software-test data;
- `validate_hz_fz_01.js` — dependency-free validator and comparator;
- `validate_hz_fz_01_csv.js` — CSV importer into the frozen measurement record;
- `ADMISSION_RESULT.json` — current gate state.
- `MANIFEST_SHA256.txt` — frozen hashes for contract, schema, placeholder,
  validator and gate result.

Step-1 apparatus intake is additive to the frozen v0.1 measurement contract:

- `02_APPARATUS_IDENTITY_INTAKE.md` — operator checklist and stop rule;
- `apparatus.identity.pending.json` — explicit fail-closed apparatus template;
- `validate_apparatus_identity.js` — apparatus identity preflight validator.
- `03_KERNEL_V07_INTEGRATION_RECORD.md` — authorized non-activating E2
  connection to the existing source and v0.7 backend adapters.

## Commands

```text
node validate_hz_fz_01.js --self-test
node validate_hz_fz_01.js path/to/measurement.json
node validate_hz_fz_01_csv.js path/to/measurement.csv
node validate_apparatus_identity.js --self-test
node validate_apparatus_identity.js path/to/apparatus.identity.json
```

The self-test uses generated synthetic signals only to test the validator. It
cannot admit the runtime profile. Admission requires an independently acquired
measurement file conforming to the frozen contract.

Kernel v0.7 composition is implemented in the Common Runtime package. Its
synthetic conformance test proves software wiring only; the emitted attachment
explicitly retains `SUPPLEMENT_ONLY_NO_PROFILE_ACTIVATION`.

## Current decision

```text
CONTRACT        = FROZEN_V0_1
VALIDATOR       = SELF_TESTED
CORE_MANIFEST   = FROZEN_SHA256
REAL_DATA       = ABSENT
RUNTIME_PROFILE = FAIL_CLOSED
```
