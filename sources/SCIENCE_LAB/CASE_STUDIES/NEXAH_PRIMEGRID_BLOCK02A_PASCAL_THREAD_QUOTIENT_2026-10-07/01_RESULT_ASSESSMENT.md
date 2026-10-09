# PRIMEGRID BLOCK 2A — Result assessment

Date: `2026-10-07`

Decision: `SUPPORTED_AS_PASCAL_WEIGHT_QUOTIENT_WITH_COUNT_BOUNDARIES`

## Repository finding

The supplied MRB-10/Pascal 11x11 visual was already represented in the typed
PCA/transition synthesis, but no matching HTML instrument was found in the
current repository or HTML artifact catalog. This package therefore supplies a
fresh executable and interactive reconstruction rather than claiming recovery
of the original generator.

## Result

All nine preregistered gates passed.

```text
tested Pascal rows:          0..11
Q11 histories:              2048
Pascal row 11 nodes:        12
Q11 weight-1 states:        11
Q11 weight-10 states:       11
W1 x W10 pairs:             121
true complement pairs:      11
non-complement residual:    110
unit tests:                 8/8 PASS
gates:                      9/9 PASS
```

The Hamming-weight histogram of every tested binary carrier equals its Pascal
row exactly. Inter-weight edge counts also satisfy both forms of the binomial
thread identity.

## The 56 result

The following equality is exact:

```text
7 x 8 = C(8,3) = C(8,5) = 56.
```

Its three meanings remain different:

- 56 nonidentity-shift/DFT-bin cells;
- 56 Q8 states of Hamming weight 3;
- 56 Q8 states of Hamming weight 5.

This is a registered count bridge, not an operator identity. A mapping or
coding advantage would require an additional frozen rule and controls.

## The 11x11 / 121 result

The 11x11 field has one exact carrier interpretation:

```text
Q11 weight-1 fiber x Q11 weight-10 fiber = 11 x 11 = 121 pairs.
```

Only the 11 diagonal complement matches are canonical under bitwise
complement. The remaining 110 pairs need a separately declared relation.

The base-ten numeral identity `121=11^2` is also exact, but it is not a Pascal
row-11 coefficient or row total. Pascal row 11 has 12 nodes and sums to 2048.

## Quotient boundary

Weight projection compresses `2^n` addressed states to `n+1` nodes. It is
lossy. Exact return requires the pair `(weight, within-fiber ordinal)`; weight
alone does not preserve the carrier address.

## Next admissible step

The prime-anchor comparison can now use these layers separately:

1. Block 1 carrier address;
2. Block 2 DFT phase address;
3. Block 2A Pascal weight quotient and residual address;
4. prime, composite and random anchor sets under matched size and density.

## Claim ceiling

This result establishes finite combinatorics and explicit quotient boundaries.
It does not establish a physical thread, universal Kappa mechanism, prime
coding gain, resonance or identity between equal counts.

