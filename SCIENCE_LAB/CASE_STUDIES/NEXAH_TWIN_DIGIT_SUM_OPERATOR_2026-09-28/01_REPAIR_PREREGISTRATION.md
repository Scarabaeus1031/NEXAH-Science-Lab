# R1 repair preregistration — congruence-preserving pairing null

Date: `2026-09-28`

Status: `FROZEN_AFTER_R0_CONTROL_INVALIDATION_BEFORE_R1_EXECUTION`

## Why one repair is required

R0 used prime-pair gaps 4/6/8/10 as controls for an image-gap-2 event. This is
not admissible because `s_b(n) = n (mod b-1)`. In bases 8, 10 and 12 the
control source gaps made an exact image difference of 2 structurally
impossible. R0's Fisher enrichment is therefore `INVALID_CONTROL`, regardless
of its automatic decision field. R0 outputs remain retained and unchanged.

This R1 is the only repair cycle. It changes the null, not the observed
population, operator, bases or finite bound.

## Frozen population and statistic

- all twin-prime pairs `(p,p+2)` with `p+2<=1_000_000`
- bases `{2,8,10,12}`
- observed event unchanged: both component digit sums prime and their ordered
  difference exactly 2
- statistic: total event count

## Congruence- and scale-preserving permutation null

For each base separately, partition source records by:

```text
(number of base-b digits of p, p mod (b-1))
```

Within every stratum, retain the lower digit sums in place and independently
permute the upper digit sums. This preserves:

- the twin-prime source population;
- lower and upper digit-sum marginals;
- numeral-base length;
- the required mod-`b-1` congruence classes;
- sample size.

It destroys only the observed lower/upper pairing.

Use exactly 2000 permutations with Python `random.Random(20260928+base)`.
The Monte Carlo upper-tail p-value is `(1 + count(null>=observed))/2001`.

## Acceptance

A base has `PAIRING_ASSOCIATION` only if:

- upper-tail `p<0.01`; and
- `observed/null_mean >= 1.5`.

The overall result is:

- `FINITE_DECIMAL_PAIRING_ASSOCIATION_REPRESENTATION_BOUND` if base 10 passes;
- `LOCAL_FINITE_PATTERN_NO_PAIRING_ENRICHMENT` if base 10 fails;
- append `CROSS_BASE` only if at least three of four bases, including base 10,
  pass and every base has a nonzero observed event count.

No infinite, generative, physical or base-independent claim is permitted.

