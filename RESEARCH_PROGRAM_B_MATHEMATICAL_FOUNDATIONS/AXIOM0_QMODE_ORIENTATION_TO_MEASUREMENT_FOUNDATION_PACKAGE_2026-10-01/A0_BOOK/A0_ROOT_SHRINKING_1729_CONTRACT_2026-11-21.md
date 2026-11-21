# A0 Root Shrinking · 1729 Return — bounded contract

**Date:** 2026-11-21
**Status:** internal owner-staging engineering instrument
**Identity disposition:** reuse only; `MOD:NUMBER_VIEW_SUITE`, `ART:A0:MATHEMATICAL_JOINTS`, `A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1`
**Navigator delta:** 0 identities, 0 relations, 0 aliases, 0 studies, 0 findings

## Purpose

The instrument extends the existing Primecube Root Ruler beyond `1…1111` as a scale audit. It compares the direct and rationalized Float64 evaluations of adjacent square-root gaps, solves the declared epsilon threshold, and places the exact `1728→1729` arithmetic joint beside that root record without equating their operators.

## Exact mathematical carrier

For integer `k≥1`,

```text
Δ_k = √(k+1) − √k
    = 1 / (√(k+1)+√k)
    ~ 1 / (2√k).
```

Thus `Δ_k` is positive, strictly decreasing, and exhibits algebraic power-law decay. A log plot is a coordinate choice, not a logarithmic decay law.

For `0<ε≤1`,

```text
Δ_k ≤ ε  iff  k ≥ ((ε^-1 − ε)/2)^2.
```

The smallest integer is the ceiling of the right-hand side, with domain floor `k=1`. Once the threshold exceeds `Number.MAX_SAFE_INTEGER`, the implementation reports a scale rather than pretending that Float64 resolves adjacent integers.

## 1729 joint

```text
1728 = 12³
1729 = 1³+12³ = 9³+10³ = 7·13·19.
```

The taxicab identity and `Δ_1728` share an address seam. They remain different records and different operators.

## View boundary

- The curve uses double-logarithmic coordinates.
- The spiral encodes epsilon decades only.
- Neither view is an intrinsic orbit of square roots.
- The tool makes no prime-generator, physical-resonance, natural-root-cuboid, or whole-system closure claim.
- Higher prime-tuple counts from the conversation remain held until their offset families and census domains are declared.

## Verification

Run:

```bash
node a0-root-shrinking-1729-tests.cjs
```

The suite verifies stable gaps, monotonicity, asymptotic behavior, epsilon thresholds through the exactly addressable range, Float64 scale-only behavior, the two cube paths for 1729, HTML claim boundaries, and the Science Desk intake.
