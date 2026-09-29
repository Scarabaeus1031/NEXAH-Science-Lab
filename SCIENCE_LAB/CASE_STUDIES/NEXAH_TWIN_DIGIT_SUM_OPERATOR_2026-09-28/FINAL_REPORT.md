# Final report — NEXAH Twin-Prime Digit-Sum Operator

Date: `2026-09-28`

Final classification:
`FINITE_DECIMAL_PAIRING_ASSOCIATION_REPRESENTATION_BOUND`

Lab disposition: `CLOSED_BOUNDED / FILED / NO_ACTIVATION`

## Protocol history

R0 correctly enumerated the finite population but its proposed gap-4/6/8/10
comparison was invalid. Digit sums obey

```text
s_b(n) = n (mod b-1).
```

Consequently, an exact mapped difference of 2 was structurally unavailable to
many R0 controls. The apparently infinite odds ratios were control artifacts
and are not scientific results. All R0 outputs were retained.

One preregistered repair, R1, replaced that control with 2000 deterministic
permutations of upper digit sums within equal base-digit-length and equal
mod-`b-1` strata. This preserved source population, digit-sum marginals, scale
and congruence while breaking only the observed lower/upper pairing. No second
repair was allowed.

## Exact local example

```text
s_10(41)=5
s_10(43)=7
(41,43) -> (5,7)
```

Both source and image are ordered twin-prime pairs. Separately,
`57=3*19=p_2*p_8`; `p_2*p_10=3*29=87`, not 57.

## Complete finite enumeration

There are 8169 twin-prime pairs `(p,p+2)` with `p+2<=1,000,000`.

In base 10:

- mapped-twin events: `1541/8169 = 18.864%`;
- only six distinct mapped images occur;
- cumulative rates are 40.0% at 1,000, 30.24% at 10,000, 22.06% at
  100,000 and 18.86% at 1,000,000;
- the preregistered scale-ratio criterion passes (`2.1204`), while the visible
  declining rate is retained and no asymptotic claim is made.

The mapped images and counts are:

| image | count | share of all mapped events |
|---|---:|---:|
| `(29,31)` | 815 | 52.89% |
| `(17,19)` | 447 | 29.01% |
| `(11,13)` | 141 | 9.15% |
| `(41,43)` | 123 | 7.98% |
| `(5,7)` | 14 | 0.91% |
| `(3,5)` | 1 | 0.06% |

The operator is therefore strongly many-to-one and is not an information-
preserving prime generator.

## R1 pairing test

| base | observed | null mean ± sd | observed/null | upper-tail p | frozen decision |
|---:|---:|---:|---:|---:|---|
| 2 | 0 | 162.249 ± 10.674 | 0.000 | 1.0 | fail |
| 8 | 823 | 314.491 ± 11.929 | 2.617 | 0.00049975 | pass |
| 10 | 1541 | 733.0495 ± 16.303 | 2.102 | 0.00049975 | pass |
| 12 | 434 | 308.2985 ± 9.282 | 1.408 | 0.00049975 | fail effect-size gate |

Base 10 passes the preregistered pairing-association rule. Only two of four
bases pass, and base 2 has no observed events. The cross-base rule therefore
fails.

## Mathematical interpretation

For a twin pair `(p,p+2)`, adding 2 without a base-`b` carry gives
`s_b(p+2)=s_b(p)+2`. A carry changes that difference by a multiple of `b-1`.
The event consequently combines:

1. a base-dependent carry/no-carry condition; and
2. the requirement that `s_b(p)` and `s_b(p)+2` themselves form a twin pair.

The R1 result shows that the true lower/upper pairing produces this conjunction
more often than a congruence- and scale-matched marginal realignment in bases
8 and 10. Its failure in bases 2 and 12 under the frozen rule demonstrates
that it is not a representation-invariant prime law.

## Reproducibility

- R0 preregistration SHA-256:
  `f77f977b6e291b35daed97c93b9fc124546499688cf123deda89a228caf757bd`
- R1 preregistration SHA-256:
  `1506184e9a664645f9b2d7672ecce7378dc0d8e83bdf5a77427210c1a20a929d`
- R0 primary/replay scientific hash:
  `6149e1220b34cbf6e2d11b965636527cc69ac6b68c8ebe7cd77a03ef30816a49`
- R1 primary/replay scientific hash:
  `853acefa1ac64ac6df4ff538044238e000d04f5d49e2dd66f91a3104802430fd`
- R0 replay: `IDENTICAL`
- R1 replay: `IDENTICAL`

## What this establishes

Within the frozen finite range, decimal digit summation maps 1541 twin-prime
pairs to one of six smaller twin-prime images. Their actual component pairing
is enriched relative to the preregistered congruence- and scale-preserving
pairing null. The effect is a valid finite representation result.

## What this does not establish

- an infinite theorem or asymptotic persistence;
- a prime generator or reversible encoding;
- a base-independent operator;
- a privileged meaning of decimal glyphs;
- an identity between prime values and prime indices;
- a physical, resonant, navigational or causal mechanism.

No Core, ORION, product or capability change is authorized.

