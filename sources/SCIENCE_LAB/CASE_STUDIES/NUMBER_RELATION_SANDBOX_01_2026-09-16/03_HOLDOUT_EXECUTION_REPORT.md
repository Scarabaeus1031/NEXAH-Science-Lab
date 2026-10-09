# NRS01 Palindrome Holdout 01 — Execution Report

Protocol: `NRS01-PAL-HOLDOUT-01`  
Seal: `NRS01-PAL-HOLDOUT-01-SEAL-2026-09-16`  
Execution count: `1`  
Decision: `PASS`

## Pre-execution controls

- protocol JSON hash: `PASS`
- protocol Markdown hash: `PASS`
- runner hash: `PASS`
- `SEALED_HOLDOUT_RESULT.json` absent before execution: `PASS`
- frozen root range: `10001..999999`

No operator, selector, confidence level, threshold or range was changed after
the seal.

## Primary result

| Group | Successes | Total | Rate | 99% Wilson interval |
|---|---:|---:|---:|---:|
| Decimal-palindromic target roots | 13 | 1,798 | 0.7230% | 0.3595% to 1.4489% |
| Frozen adjacent controls | 0 | 3,596 | 0.0000% | 0.0000% to 0.1842% |

The frozen PASS rule required:

1. at least 500 targets: `1798`, passed;
2. target 99% lower bound greater than control 99% upper bound:
   `0.3595% > 0.1842%`, passed;
3. risk ratio at least 2.0: control rate was zero, so the registered ratio is
   `Infinity`, passed.

The primary decision is therefore `PASS` under the preregistered rule.

## Secondary representation controls

| Base | Target successes | Control successes | Interpretation |
|---:|---:|---:|---|
| 8 | 1 / 1,798 | 0 / 3,596 | weak isolated target event |
| 12 | 0 / 1,798 | 1 / 3,596 | no target enrichment |
| 16 | 0 / 1,798 | 0 / 3,596 | no events |

The strong separation is not stable across bases. The result is therefore
classified as a decimal representation effect, not a base-independent integer
invariant.

## Destruction controls

- The identity-predicate control returned all 1,798 targets as decimal
  palindromes and all 3,596 frozen controls as non-palindromes, as required by
  the selector definition.
- Recounting the adjacent controls returned exactly `2 * 1798 = 3596` records.

## Scientific boundary

This is a successful prospective discrimination test for one decimal
representation property on one held-out integer interval. It does not establish
a universal palindrome law, privileged ontology, physical cycle, causal
mechanism or NEXAH physics claim.

The next methodological question is robustness: whether the result persists
under a second sealed interval and under controls that are not deterministically
adjacent to the selected palindromic roots.

