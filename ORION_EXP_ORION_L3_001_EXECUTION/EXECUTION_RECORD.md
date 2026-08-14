# EXP-ORION-L3-001 — Execution Record

Lock timestamp: 2026-08-10T17:38:06Z  
Valid primary and clean replay completed: 2026-08-10T17:44:17Z

The preregistration hash was independently verified before lock. Review state remained 0 CRITICAL, 0 MAJOR, and two explicitly retained MINOR limitations.

## Stage separation

1. `source_generator.py` generated Lorenz source/reference data only.
2. `representation_generator.py` generated R0–R6 without expected classes. R5 used only state samples and centered sample differences.
3. `observe.py` received raw data and class-free rules, materialized restricted claimant views, independently rebuilt graph/metric relations, and sealed observations.
4. `compare.py` verified the seal before opening expected classes.

## Retained pre-seal failure

Attempt 001 was rejected before primary seal because floating checkpoint-index truncation misaligned seven reference rows. Its INVALID result and all outputs remain under `failed_attempts/attempt_001/`. The frozen 20:1 sampling correspondence was then implemented with integer division, and the valid primary run regenerated from an empty directory. No scientific parameter or result rule changed and no failed-attempt output was reused.

## Primary and replay

The valid primary was sealed before replay. Replay started from a new directory and regenerated source, R0–R6, graph, estimator, restricted correspondence, observations, controls, and classification. No primary generated path was an input to replay.

All 17 corresponding scientific, environment, and restricted-correspondence files are byte-identical.

```text
PRIMARY HASH: b4b042f726f1ab2855328bf27fdced0332a582aa72fe68ab17104ce3ce11f8fb
REPLAY HASH:  b4b042f726f1ab2855328bf27fdced0332a582aa72fe68ab17104ce3ce11f8fb
REPLAY IDENTICAL: YES
```

