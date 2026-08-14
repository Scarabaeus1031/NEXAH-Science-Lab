# Level-1B hash-frozen evaluator

Status: `NOT_ADOPTED`. This package implements the V1.0.1-amended evaluator
for frozen Level-1 raw states. It is a development-calibration artifact, not
evidence that the hypothesis passes.

The evaluator verifies the original Level-1 manifest, machine amendment,
evaluator specification, its own source hash, raw manifest identity, finite
arrays, canonical raw bytes, and partition consistency before calculation. It
does not mutate raw input and contains no plotting logic or evaluation-derived
path/seed constants.

## Contents

- `LEVEL1_PROTOCOL_AMENDMENT_V1.0.1.md` and
  `protocol_amendment_v1_0_1.json`: prospective Owner clarification;
- `evaluator_spec_v1.json`: exact machine evaluator contract;
- `evaluate_level1b.py`: R, V, persistence, endpoint, calibration, bootstrap,
  missing-value, lead, and future sealed-outcome gates;
- `verify_level1b_evaluator.py`: independent A–S tests;
- `generate_development_raw.py`: development-only orchestration through the
  unchanged frozen simulator;
- `evaluate_level1b_sensitivity.py`: deterministic timestep comparison at the
  primary-frozen thresholds;
- `development/`: immutable generation, calibration, and sensitivity results;
- `verification/`: immutable A–S machine result;
- `HASH_MANIFEST.json`: final SHA-256 inventory.

Development produced no terminal events. This is preserved rather than
repaired. Evaluation was neither generated nor inspected. The exact evaluator
may touch evaluation only in a separately authorized Level-1C operation.

```text
EVALUATION_PARTITION_OPENED = NO
EVALUATION_PERFORMANCE_INSPECTED = NO
APPLICATION_001_CHANGED = NO
```
