# Execution Plan

This document is a future plan, not an execution record.

1. Reviewer verifies `HASH_MANIFEST.json`, bundle SHA and frozen status.
2. Reviewer confirms no `results/` directory or result file exists.
3. Invoke only with both explicit gates:
   `python3 run_exp_t02.py --execute --acknowledge-frozen-protocol`.
4. Runner verifies every manifested file, including itself, before computation.
5. Generate BASE and the three exact paired fields.
6. Compute R0–R4 and serialize all correspondence-bearing objects.
7. Fail closed on construction/correspondence preconditions.
8. Compute C0–C6, B0–B7, collision ledger and descriptive R/D.
9. Execute only the frozen sensitivity controls.
10. Apply falsification and decision rules mechanically.
11. Write results atomically to a newly created `results/` directory, including
    runtime/environment metadata and hashes. Never overwrite an existing result.
12. Independent reviewer verifies output schema and protocol hash before any
    interpretation.

No plotting is necessary. No network, canonical NEXAH import, historical image,
random number, parameter optimization or interactive choice is allowed.
