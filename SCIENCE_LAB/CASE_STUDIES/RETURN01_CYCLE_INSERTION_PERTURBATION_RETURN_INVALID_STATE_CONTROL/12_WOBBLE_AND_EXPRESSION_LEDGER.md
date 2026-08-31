# Wobble and Expression Ledger

| Expression | Possible standard types | Default result |
|---|---|---|
| wobble | deviation, residual, phase offset, oscillation, perturbation, precession, transient response, variance | `EXPRESSION_TERM_REQUIRING_TYPED_REPLACEMENT` |
| stone that makes the system jump | insertion, impulse, discrete transition, boundary crossing, invalid-state request, perturbation | no type selected without a rule |
| diagonal | geometric direction only if geometry/adjacency is declared | expression only otherwise |
| still point / retained rest | state or observation only if criterion is declared | underdefined expression |
| thorn / fall / fly | event/trajectory metaphors | expression only |
| Outerborn / timeshift / portal | historical labels | no formal meaning inferred |

## Off-grid classification control

| Situation | Required type |
|---|---|
| declared edge within valid graph | `IN_GRID_VALID_TRANSITION` |
| rule inserts valid P | `RULE_GOVERNED_INSERTION` |
| valid state visited outside expected sequence | `OFF_SEQUENCE_VALID_STATE` |
| parsed request violates state rules | `INVALID_STATE` |
| no transition rule exists | `UNDEFINED_TRANSITION` |
| only coordinates/rendering move | `REPRESENTATION_ONLY_SHIFT` |

`WOBBLE_STATUS=EXPRESSION_TERM_REQUIRING_TYPED_REPLACEMENT`. No measurable historical wobble quantity was required or recovered.

