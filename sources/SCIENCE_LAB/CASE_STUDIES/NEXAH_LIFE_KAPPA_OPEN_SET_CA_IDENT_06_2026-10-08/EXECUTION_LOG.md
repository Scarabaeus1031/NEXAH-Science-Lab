# CA-IDENT-06 execution log

Preregistration lock:
`f98949089031183c8b035328fcd2cd56ff698b93a6ac66cfda1cec4407c9ed41`.

The lock was verified before executing against untouched seeds `R125-R224`.

## Registered outcome

- discovery rows: `2,500`
- registered-unknown discovery rows excluded from training: `18`
- evaluation rows: `2,000`
- registered-unknown evaluation support: `0`
- coverage gate: `FAIL`
- primary gate: not interpretable / `FAIL`
- verdict: `COVERAGE_GATE_FAIL`

The Kappa threshold was frozen at the training-only leave-one-seed-out 99th
percentile, `0.09728865549241666`. Among all 2,000 known evaluation rows, 13
were rejected, giving known specificity `0.9935`. Accepted known-class accuracy
was `0.9502`.

Because `constant-count motion` did not occur in the untouched evaluation bank,
unknown recall and abstain precision cannot be scientifically interpreted. A
numeric zero in the machine record denotes zero support, not demonstrated
detector failure.

## New lesson

The registered unknown occurred in R25-R124 and in the broader discovery bank,
but not in R125-R224. Behavior-class availability is itself seed-range
dependent. Open-set validation therefore requires a frozen sampling plan that
guarantees event acquisition without selecting model thresholds on evaluation
features.
