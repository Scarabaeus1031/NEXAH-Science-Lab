# NEXAH-UTILITY-01 — U1 Minimum Machine

Status: `A_U1_MINIMUM_MACHINE_EXISTS`

This package implements only the minimum executable machine authorized by U1
for the frozen `UTILITY00-RFLC-FIXTURE-V1` comparison. It demonstrates that the
pinned NEXAH path and one independent integrated baseline can consume the same
label-free input, emit the common result contract, express typed failure states
and replay deterministically on development smoke fixtures.

It does **not** calculate an endpoint, compare utility, unseal evaluation or
replay cases, start U2, or create a scientific/product/novelty claim.

## Architecture

```text
development fixture bytes (labels absent)
        ├── nexah_adapter.py -> pinned Core evidence verifier
        └── baseline_runner.py -> independent integrated audit
                       ↓
              neutral_result_schema.json
                       ↓
        ground_truth_evaluator.py (separate; per-record only)
```

The NEXAH adapter performs syntax and status normalization only. It loads the
exact frozen evidence-verifier module without executing the broad package front
door; this avoids an unrelated optional `scikit-learn` dependency and does not
copy or add a detector. The baseline imports no NEXAH module and combines the
frozen linear-algebra, reconstruction, PCA7, provenance, RO-Crate and checklist
checks in one path.

## Frozen boundaries

- Core commit: `ead4223a9bea103ad2266fc3b71b433974de37dd`
- Plan: 432 cases (`140 / 216 / 76`)
- Materialized in U1: development `140`; evaluation `0`; replay `0`
- Evaluation/replay: `SEALED_NOT_MATERIALIZED_U1`
- Processor inputs contain no mutation family, severity, expected decision,
  observability class or accepted location.
- Gold is held separately in `fixtures/development_ground_truth.jsonl`.
- Runtime, memory, record size and contemporaneous authoring effort are
  capturable. No cost comparison is made.

## Replay

Use the Python executable declared in `RUN_CONTRACT.md`:

```bash
python3 -B generate_fixtures.py \
  --core-root "/Users/tho2020/Documents/NEXAH ECOSYSTEM/10 NEXAH CORE/NEXAH" \
  --out fixtures
python3 -B run_u1_smoke.py \
  --core-root "/Users/tho2020/Documents/NEXAH ECOSYSTEM/10 NEXAH CORE/NEXAH" \
  --fixtures fixtures \
  --out results/u1_smoke_result.json
python3 -B -m unittest discover -s tests -v
```

`verify_package.py` is the non-regenerating integrity check. The generated
evidence and gate disposition are recorded in `U1_VALIDATION_REPORT.md`.

## Known limitations

- U1 exercises exactly three development smoke classes, not all development
  fixtures and never evaluation/replay.
- The Core verifier returns contract/integrity errors rather than the sealed
  mutation-family vocabulary; family scoring remains a U2 concern.
- Resource ceilings are declared and measurements are captured. U1 smoke does
  not perform the five-run cost comparison or authoring-cost comparison.
- This is local replay evidence, not independent replication.

Next permitted action: `U2_EQUAL_INFORMATION_COMPARISON`, only under a new
explicit Human Owner authorization.
