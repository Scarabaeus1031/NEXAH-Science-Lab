# LABREPORT — NEXAH Twin-Prime Digit-Sum Operator 001

Date: `2026-09-28`

Status: `CLOSED`

Final class: `FINITE_DECIMAL_PAIRING_ASSOCIATION_REPRESENTATION_BOUND`

## Question

Does componentwise digit summation map finite twin-prime pairs to twin-prime
pairs more often than a representation-matched pairing null, and is that
relation base-independent?

## Result

The motivating decimal example `(41,43)->(5,7)` is exact. Among 8169 twin
pairs up to one million, 1541 (18.864%) map to twin-prime digit sums in base
10. Only six distinct images occur, so the map is highly many-to-one.

The original gap-based control was invalidated because digit sums preserve
value modulo `b-1`. A single preregistered repair permuted upper digit sums
within matched base-digit-length and mod-`b-1` strata. Base 10 retained a
pairing effect: observed 1541 versus null mean 733.0495, ratio 2.102 and
Monte Carlo `p=0.00049975`. Base 8 also passed; base 12 missed the frozen
effect-size gate and base 2 had zero events. The cross-base criterion failed.

The finite effect is explained as a conjunction of base-dependent carry
behavior and primality of the resulting digit sums. It is a valid
representation-bound association, not a universal prime law or generator.

## Reproducibility

- R0 scientific hash:
  `6149e1220b34cbf6e2d11b965636527cc69ac6b68c8ebe7cd77a03ef30816a49`
- R1 scientific hash:
  `853acefa1ac64ac6df4ff538044238e000d04f5d49e2dd66f91a3104802430fd`
- both clean replays: `IDENTICAL`

Canonical evidence:

`SCIENCE_LAB/CASE_STUDIES/NEXAH_TWIN_DIGIT_SUM_OPERATOR_2026-09-28/FINAL_REPORT.md`

## Boundary

No infinite, base-independent, physical, causal, navigational, Core or product
claim follows. No architecture or capability change.
