# A0-BL-045 — Result assessment

Date: `2026-10-10`

Classification: `RETURN_TYPE_UNDERDETERMINED`

Reproducibility: `R2_LOCAL_REPLAY / PRIMARY_REPLAY_BYTE_IDENTICAL / VERIFIER_PASS`

## Exact result

The Pascal source fixture contains five cyclic midpoint positions with

```text
C(6,3)=20, displayed orbit total=5*20=100.
```

The five-step Fibonacci transfer is

```text
Q^5 = [[8,5],
       [5,3]],
trace(Q^5)=11,
det(Q^5)=-1.
```

The same matrix and invariants were attached to two finite strip quotients.
Their topology differs as expected:

| Seam | Identification | Boundary components | Nonzero rational fixed state |
|---|---|---:|---|
| untwisted | `(5,v)~(0,v)` | 2 | no; `det(Q^5-I)=-11` |
| twisted | `(5,v)~(0,1-v)` | 1 | no; `det(JQ^5-I)=-3` |

Thus the topology fork is real, but `Q^5`, its trace and its determinant do
not choose a branch. Both branches carry the same numerical monodromy.

The compensating control is

```text
Q^-5 = [[-3, 5],
        [ 5,-8]],
Q^-5 Q^5 = I.
```

It proves that exact state closure can be manufactured by specifying a
tailored inverse seam. It does not show that the Möbius quotient supplies that
seam, and it is not an independently derived return law.

## Decision

The proposed implication

```text
det(Q^5)=-1  =>  twisted/Möbius return
```

fails. The determinant describes orientation reversal of the two-dimensional
linear state map. The Möbius/cylinder distinction describes the gluing of a
separate strip carrier. An explicit coupling map is required before one can
determine a joint return.

## What remains open

1. a non-arbitrary map `phi` from the Pascal weight/orbit record to a
   two-component Fibonacci state;
2. a seam operator derived from the geometric quotient rather than chosen to
   invert `Q^5`;
3. a declared meaning of Return: state equality, oriented-frame equality,
   projective equality, orbit closure or information reconstruction.

## Claim boundary

This is a bounded negative separation result. It establishes no physical
Möbius mechanism, canonical Pascal/Fibonacci intertwiner, universal five-step
law, PENT-08, Family or publication claim.
