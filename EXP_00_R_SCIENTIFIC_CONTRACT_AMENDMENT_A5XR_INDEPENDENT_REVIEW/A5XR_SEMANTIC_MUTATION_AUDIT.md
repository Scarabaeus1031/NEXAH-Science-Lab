# A5XR Semantic Mutation Audit

## Review-owned attacks

| Mutation/attack | A5XR behavior | Review finding |
|---|---|---|
| N1 direction/N2 unit/N3 direction or donor/N4 distance metadata | rejected | labels are sealed, but no transformation is reconstructed |
| RNG or action-order metadata | rejected | exact draws/order are not executed |
| bin-boundary assignment | only embedded in N3 rule string | no boundary record exists |
| support T/F fractions changed to another passing value | accepted | fractions not raw-derived |
| arbitrary unique row prefixes | accepted | row identity not canonical |
| dominance exact half/above/below | arithmetic correct | failed boundary is mistyped as abort |
| N5 count/order/aggregation metadata | rejected | one supplied comparison per transform still accepted |
| Monte Carlo denominator/tie direction | absent from machine | implementation code happens to use `>=` and `k<=4` |
| P2 diagnostic/gate status | coefficient-null diagnostics absent | omission accepted |
| P4 report-only registry name | rejected | missing diagnostic values accepted |
| P5 interval semantics | sealed in machine | no primary bootstrap provenance |
| validity precedence | direct classifier returns invalid first | raw runner never returns invalid state |
| classifier partial branch | formula correct | negative dominance cannot reach it |
| Lorenz ceiling | strict label unreachable | invalid Rössler→INCONCLUSIVE not implemented |

The A5XR root detects byte mutation when the external root digest is trusted. That is integrity, not semantic coverage. The canonical machine omits P1–P3 and several mandatory raw schemas, while `validate_machine` checks only its byte hash and four top-level values. A mutable manifest cannot repair missing meaning.

**Independent adversarial semantic validation: FAIL.**
