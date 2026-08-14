# Level-1 frozen raw-state substrate

Status: `NOT_ADOPTED`. This directory implements only the frozen synthetic
four-node raw-state experiment substrate. It does not calculate phase
coherence, comparator values, warning/alarm/event times, leads, rates, or a
scientific PASS/FAIL/INCONCLUSIVE outcome.

## Files

- `preregistration_level1_v1.json`: complete machine-readable protocol V1.0.0;
- `simulate_level1.py`: equilibrium initialization and raw RK4 / stochastic
  mechanical-power-diffusion integration;
- `verify_level1_simulator.py`: A–K numerical and software checks only;
- `raw/`: four immutable development artifacts used for verification;
- `verification/verification_result.json`: deterministic verification record;
- `LEVEL1_FREEZE_RECORD.md` and `LEVEL1_NUMERICAL_VERIFICATION.md`: human audit
  records;
- `HASH_MANIFEST.json`: SHA-256 inventory of finalized bytes.

The runtime requires Python 3 and NumPy. No dependency was installed by this
pass; verification used Python 3.12.13 and NumPy 2.3.5 from the existing Codex
workspace runtime.

## Simulator use

```bash
python3 simulate_level1.py \
  --manifest preregistration_level1_v1.json \
  --partition development \
  --path-id dev-r0.04-c0.4 \
  --mode deterministic \
  --output-dir raw
```

Stochastic mode requires an explicit registered `--seed`. Evaluation
configuration is structurally available through `--partition evaluation`, but
no evaluation trajectory was generated or inspected in this pass.

Outputs use canonical JSON. Exclusive creation prevents overwrite. Identical
existing bytes return `ALREADY_PRESENT_IDENTICAL`; different bytes for the
same run ID raise `RAW_OUTPUT_COLLISION`.

## Scientific firewall

The historical demonstrator remains `SYNTHETIC_CONCEPT_DEMONSTRATOR`,
`NOT_VALIDATION_EVIDENCE`, and `NOT_ADOPTED`. Its Cubit-shifted magnitude is
recorded only as algebraically equivalent to ordinary phase coherence. This
package makes no IEEE, stability, early-warning, predictive, risk, control,
architecture, or product claim. `APPLICATION_001_CHANGED = NO`.
