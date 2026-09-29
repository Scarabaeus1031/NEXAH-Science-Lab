# NEXAH Mod-6 Prime-Window State Operator — preregistration

Date: `2026-09-28`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Question

Does the exact carrier `(6k-1,6k+1)` support a reproducible four-state
occupancy and transition record, and is either lane materially associated with
odd/even or prime/composite **prime index** after value, index and residue are
kept separate?

## Prior evidence and incremental scope

The existing registered result `M-025` reports four `6k±1` classification
counts `5330/19242/19194/56234` for `1<=k<=100000`. Existing controls already
reject both "all `6k±1` candidates are prime" and "prime value equals prime
index".

This experiment does not claim discovery of `6k±1`. It uses `M-025` as an
exact reproduction target and adds:

1. the ordered four-state sequence and transition matrix;
2. a directional-asymmetry test;
3. a density-preserving left/right alignment null;
4. separate tests of lane versus index parity and lane versus index primality.

## Frozen population

```text
k = 1..100000
L_k = 6k-1
R_k = 6k+1
limit = 600001
```

Primality is determined by one deterministic Eratosthenes sieve. Prime index
is one-based in the ascending prime sequence.

## Frozen state operator

```text
B_k = (is_prime(L_k), is_prime(R_k))
states = 11, 10, 01, 00
```

`11` means both candidate positions are prime, `10` left only, `01` right
only and `00` neither. These are occupancy states, not ILAU classes and not a
prime generator.

## Tests

### T1 — exact reproduction and exhaustiveness

Reproduce the `M-025` counts in state order `11/10/01/00` and require their
sum to equal `100000`. Pass requires exact equality with
`5330/19242/19194/56234`.

### T2 — first asymmetry

Require the beginning:

```text
k=1: (5,7)   -> 11
k=2: (11,13) -> 11
k=3: (17,19) -> 11
k=4: (23,25) -> 10
```

Pass requires `k=4` to be the first non-`11` state.

### T3 — ordered transition matrix

Compute the complete `4×4` transition matrix for `B_k -> B_(k+1)` and row
conditional probabilities. This result is descriptive; no Markov, causal or
stationary-process claim is allowed.

### T4 — directional singleton asymmetry

Condition on singleton states `10` and `01`. Under the null, their orientation
is Bernoulli `p=0.5`. Compute the exact two-sided binomial p-value and

```text
direction_effect = (count(10)-count(01))/(count(10)+count(01)).
```

Classify `MATERIAL_DIRECTIONAL_ASYMMETRY` only if `p<0.01` and absolute effect
is at least `0.01`. Otherwise report `NO_MATERIAL_DIRECTIONAL_ASYMMETRY`.

### T5 — density-preserving lane-alignment null

Partition the `100000` windows into 100 consecutive blocks of 1000. Within
each block, preserve the observed left and right prime counts but treat their
alignment as hypergeometric. Sum the exact block means and variances for the
expected `11` count. Compute a normal two-sided p-value from the resulting z
score. Classify `LANE_DEPENDENCE_DETECTED` only if `p<0.01` and the observed
count differs from expectation by at least 1% of expectation.

This null tests alignment beyond local lane density. It does not test the
Hardy–Littlewood conjecture or establish novelty.

### T6 — index parity is not value parity

For every prime value `p_n>3` up to the limit, cross-tabulate:

```text
lane(p_n) in {-1,+1 mod 6}
index_parity(n) in {odd,even}
```

All prime values except 2 are already odd; value parity is therefore not used
as a predictor. Report chi-square, p-value and phi. A material association
requires `p<0.01` and `|phi|>=0.05`.

### T7 — prime-index status

Cross-tabulate lane against whether the one-based index `n` is itself prime.
This is the standard prime-indexed-prime distinction. Report chi-square,
p-value and phi. A material association requires `p<0.01` and `|phi|>=0.05`.

For T6 and T7, also report phi in ten consecutive equal-count index blocks.
A stable association additionally requires the same nonzero sign in all ten
blocks and minimum absolute block phi at least `0.02`.

## Decision rule

`VALIDATED_STANDARD_MOD6_OCCUPANCY_OPERATOR` if T1 and T2 pass, all four states
occur, the transition matrix is complete, and index/value namespaces remain
separate. T4–T7 are reported exactly and may be positive or negative without
changing the validity of the finite operator.

No outcome establishes a prime generator, physical mechanism, privileged
number family, universal resonance or proof about infinitely many twin primes.

## Reproducibility

Primary and clean replay run in separate directories. Scientific JSON uses
sorted keys and compact separators. Result hashes must match exactly.
