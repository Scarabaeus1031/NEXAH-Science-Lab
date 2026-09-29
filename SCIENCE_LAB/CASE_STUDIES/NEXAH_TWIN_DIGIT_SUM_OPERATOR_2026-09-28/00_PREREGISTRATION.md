# NEXAH Twin-Prime Digit-Sum Operator — preregistration

Date: `2026-09-28`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Question

Does componentwise digit summation map twin-prime pairs `(p,p+2)` to twin-prime
pairs more often than comparable finite prime-gap pairs, and is any effect
stable across numeral bases?

The exposed motivating example is known before lock:

```text
(41,43) --base-10 digit sum--> (5,7)
```

Therefore confirmation of this example is a reconstruction test, not a new
discovery.

## Frozen domain and operators

- maximum upper member: `1_000_000`
- primary base: `10`
- representation controls: bases `2, 8, 12`
- secondary descriptive base scan: `2..16`
- source gaps: primary `g=2`; controls `g in {4,6,8,10}`
- a source record is `(p,p+g)` with both values prime and `p+g<=1_000_000`
- `s_b(n)` is the sum of the standard nonnegative base-`b` digits of `n`
- mapped-twin event:
  `s_b(p)` and `s_b(p+g)` are prime and `s_b(p+g)-s_b(p)=2`

No concatenation is part of the primary operator. Concatenation is a separate
representation operation.

## Tests

### T1 — exposed example and namespace audit

Require `s_10(41)=5`, `s_10(43)=7`, and both mapped values prime with gap 2.
Record `57=3*19=p_2*p_8`. Explicitly reject `57=3*29` and
`57=p_2*p_10`; the latter product equals 87.

### T2 — complete finite enumeration

For every base in `{2,8,10,12}`, enumerate all source pairs for gaps
`{2,4,6,8,10}` and report source count, mapped-twin count, rate and unique
mapped images. No deduplication across different source gaps.

### T3 — primary decimal enrichment control

Compare base-10 gap-2 records against the pooled base-10 gap-4/6/8/10 records
using a two-sided Fisher exact test on mapped-twin event/non-event counts.
Classify `FINITE_DECIMAL_ENRICHMENT` only if `p<0.01` and odds ratio `>=1.5`.
Zero cells use the usual infinite/zero odds conventions; no continuity
correction changes the decision.

### T4 — base robustness

Apply the same comparison separately in bases 2, 8 and 12. Classify
`CROSS_BASE_PATTERN` only if at least three of the four preregistered bases,
including base 10, satisfy `p<0.01` and odds ratio `>=1.5`, and the gap-2 event
rate is nonzero in every preregistered base.

### T5 — scale sensitivity

For base 10 report gap-2 counts and rates at upper limits
`1_000, 10_000, 100_000, 1_000_000`. A finite decimal association is called
`SCALE_STABLE` only if its event rate is nonzero at every threshold and the
maximum/minimum nonzero rate ratio is <=3.

### T6 — collision and image concentration

For base-10 twin sources report the ten most frequent mapped images and the
fraction represented by the most frequent image. This identifies whether many
large source pairs collapse onto a small digit-sum image. No injectivity or
information-preservation claim is allowed.

### T7 — secondary base scan

For bases 2..16 report only the gap-2 mapped-twin rate. This is descriptive and
cannot alter the primary decision.

## Decision rule

- `LOCAL_EXAMPLE_ONLY` if T1 passes but T3 fails.
- `FINITE_DECIMAL_ASSOCIATION_REPRESENTATION_BOUND` if T3 passes but T4 fails.
- `FINITE_CROSS_BASE_ASSOCIATION` if T3 and T4 pass.
- `INVALID` if T1 or the exact enumeration fails.

Scale stability is appended as a qualifier and cannot rescue a failed primary
test.

No outcome proves an infinite law, a prime generator, a privileged decimal
code, a physical mechanism, or an identity between prime value, prime index
and decimal glyph.

## Reproducibility

Primary and clean replay use the same locked standard-library implementation
in separate directories. Canonical sorted compact JSON and its SHA-256 must be
identical.
