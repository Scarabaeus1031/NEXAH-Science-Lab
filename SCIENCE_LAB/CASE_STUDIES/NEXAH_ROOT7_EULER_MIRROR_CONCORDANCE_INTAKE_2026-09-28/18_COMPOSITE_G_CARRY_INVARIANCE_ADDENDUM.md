# Composite G / carry-invariance addendum

**Status:** `24/24 PASS / REPRESENTATION BOUNDARY / NO STRUCTURAL FAILURE`

## Question answered

For the already bound operators

```text
F(3,1;9)=97
C4(n)=n+4
D^k(n)=2^k*n
G_k=D^k(C4(F))=101*2^k,
```

the paired carrier is

```text
(A_k,B_k)=(97*2^k,101*2^k),  k=0..20.
```

The end-to-end composition had not previously been tested as one object.  Its
components and short joins had been tested, but this explicit invariant ledger
across and beyond the carry boundary was missing.

## What survives `808 -> 1616`

The following invariants pass at every tested scale:

- provenance quotients and odd cores: `A_k/2^k=97`, `B_k/2^k=101`;
- pair ratio: `A_k/B_k=97/101`;
- scale-covariant midpoint: `m_k=99*2^k`;
- affine mirror `M_k(x)=2m_k-x`, which swaps A and B and commutes with the
  dyadic lift;
- normalized gap `(B_k-A_k)/(A_k+B_k)=2/99`;
- centered positions `(-1,0,+1)` and interval positions `(0,1/2,1)`;
- typed trace `F -> C4 -> D^k`.

The absolute gap is not constant.  It scales as `4*2^k`.  Thus “gap
invariance” is true only after typing it as a scale-covariant or normalized
quantity.

## What does not survive

The following are representation-dependent and fail as invariants:

- decimal palindrome status: `101,202,404,808` pass; `1616` fails;
- membership in the three-digit palindrome carrier;
- the fixed-axis complement `J_1100`, which sends the first four states to
  `999,898,696,292` but sends `1616` to `-516`;
- primality, which holds only for the unlifted 101 state;
- raw residues modulo 11, which cycle and return only after ten lifts;
- a constant raw gap of four.

Therefore the carry is a **representation boundary**, not a failure of the
typed scale structure.

## Operator order

The composition order is essential:

```text
D^k(C4(F)) = 101*2^k
C4(D^k(F)) = 97*2^k+4
difference   = 4*(2^k-1).
```

The two orders agree only at `k=0`.  A visual that writes “Fibonacci, cut,
lift” therefore needs to retain that trace; the same three labels in another
order do not define the same carrier.

## Coverage audit of the eleven supplied visuals

| Visual family | Existing status before this test | Remaining status |
|---|---|---|
| XI hinge / 101 channel / 404 subdivisions | arithmetic and counting corrected in Delta-19 | composite `F -> C4 -> D^k` now closed; 404 factor remains a declared scale rule |
| 12 x 1008 generator | exact finite arithmetic captured in its own intake | historical generator recovery and 2+3 counter-rotation remain parked |
| Root7 fourth-axis / tesseract bridge | Euclidean 4D construction tested | long-axis choice remains non-identifiable; no automatic E8 or SCN bridge |
| SCN rule / two starts | residue rule and counterexample tested | source-bound SCN-to-404 input/output bridge remains not identified |
| QRT x CRT | addresses, provenance requirement and 111/112 raster distinction tested | same value does not preserve origin without a typed provenance record |
| 96 -> 101 adjacent axes | exact 99/100 axis comparison tested in Delta-19 | no state rule selecting an axis or generating a gate |
| E8 / H4 / Coxeter visuals | E8-REP-03 passed the later full 8D->4D->2D benchmark | calibration benchmark only; modular graphs remain a different object class |

Thus one material test was skipped: the composite G invariant test now closed
here.  The remaining items are not accidental omissions; they are explicitly
parked or non-identified tests requiring new source-bound rules or independent
evidence.

## Decision

Classification:

`TYPED_SCALE_INVARIANTS_PRESERVED_REPRESENTATION_BOUNDARY_AT_1616`

This strengthens the M-lift description: the structural object survives carry
when carrier, mirror, gap and position are normalized and typed.  It does not
promote the historical M-Class and does not establish a physical transition,
SCN/NCS switch, 404 mechanism, E8 identity or recovered historical generator.

## Reproducibility

- checks: `24/24`;
- tested domain: `k=0..20`;
- repetitions: `3`, byte-identical;
- scientific hash:
  `e42f2bb1c3937fba7e537a26c2d861f7a32d89c27a02d4c932a40a3385f1b9f9`;
- result-file SHA-256:
  `8ed8457d77d062f2ea237c3df4d0ddd3e3eb8c3903e25d2fcabae04893c6df0f`.
