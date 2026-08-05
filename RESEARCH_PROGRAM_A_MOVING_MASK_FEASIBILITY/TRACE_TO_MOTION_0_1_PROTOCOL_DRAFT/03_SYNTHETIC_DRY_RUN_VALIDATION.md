# Synthetic Dry-Run Validation

Status: `PROTOCOL VALIDATION ONLY — NOT A SCIENTIFIC RESULT`

## Purpose

Validate internal mechanics of the draft before Owner review. The dry run uses
only the six analytic paths and their exact reversals. It collects no Human
data and does not evaluate the scientific hypotheses.

## Validator

Run:

```text
python3 dry_run/validate_protocol.py
```

The validator uses the Python standard library only and writes no dataset. It
checks in memory:

1. six declared path IDs and twelve F/R samples;
2. `1001` samples per synthetic trajectory;
3. exact F/R reversal identity within floating-point tolerance;
4. direction-free canonical-trace equality for each exact F/R pair;
5. synthetic P03, P04 and P06 transition-marker recovery;
6. path bounds inside the `200 x 200 mm` domain;
7. exact static and moving masked-area exposure of `0.20`;
8. exact static/moving masked-sample count per sample;
9. mask application after source construction;
10. interpolation behavior for bounded gaps;
11. `UNKNOWN` behavior for unbounded gaps;
12. zero false reconstructions;
13. absence of excluded interpretation keys;
14. rejection of synthetic direction leakage;
15. rejection of a tampered hash fixture.

## Frozen output

`dry_run/DRY_RUN_REPORT.json` records the validator version, script SHA-256,
check results and per-sample diagnostics. Per-sample reconstruction errors are
synthetic implementation diagnostics. They are not observations and must not
be cited as evidence for H1, H2 or H3.

## Valid outcomes

- `PASS`: protocol mechanics are internally executable for the synthetic
  fixtures;
- `FAIL`: one or more frozen mechanics are inconsistent;
- `ERROR`: validator did not complete.

No dry-run outcome authorizes acquisition.

## Design correction recorded during validation

An earlier draft used a moving center that traversed most of the full domain.
For several forward synthetic paths the strip followed the trajectory and
masked the complete record. That draft was rejected before this protocol was
frozen for Owner review.

The current draft uses `c(tau)=20+55 tau mm` and selects one fixed static center
per sample by the declared exact-count rule. The final dry run confirms that:

- no synthetic record is completely masked;
- both mask conditions cover exactly `20%` of the field area;
- static and moving masked-sample counts are identical for every sample;
- differences in temporal and geometric arrangement remain available for the
  bounded comparison.

This is a protocol-design correction, not a scientific finding.
