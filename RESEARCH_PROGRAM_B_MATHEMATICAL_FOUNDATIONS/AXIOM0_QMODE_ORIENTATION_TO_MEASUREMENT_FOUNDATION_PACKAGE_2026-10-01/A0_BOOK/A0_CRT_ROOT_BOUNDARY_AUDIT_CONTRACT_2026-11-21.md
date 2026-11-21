# A0 CRT–Root Boundary Audit Contract

Status: `SOURCE_BOUND_ENGINEERING_VIEW / NOT_ACTIVE / NO_ADMISSION`
Date: `2026-11-21`
Surface: `A0_CRT_ROOT_BOUNDARY_AUDIT.html`
Reuses: `MOD:NUMBER_VIEW_SUITE`, `NN:CRT_QRT_37_CARRIER_LADDER`,
`A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1`

## Question

Can a finite six-slot marker ring, a root metric over prime indices, one exact
CRT slice and one supplied score table be inspected in one surface while
preserving their distinct carriers, operators and evidence authority?

## Layer 1 — supplied marker ring

The frozen source sequence is

```text
[237, 337, 537, 637, 737, 937].
```

Exact factorization gives two primes (`337`, `937`) and four composites:
`237=3×79`, `537=3×179`, `637=7²×13`, `737=11×67`.

The operators are typed separately:

- `J6(i)=−i mod 6` is a closed slot permutation;
- `R637(n)=1274−n` is an integer reflection and is not closed on the supplied
  marker set because `237→1037`;
- `N37(r)=−r mod 37` acts only on a residue class and does not determine a
  unique integer image.

## Layer 2 — prime-index Root Seam

The view scans `k=115..142` and keeps the prime value `p_k` distinct from the
root metric `√k`. Exact fixtures are:

```text
p120 = 659
p121 = 661
p140 = 809
√121 = 11
661 mod 37 = 809 mod 37 = 32
809 − 661 = 148 = 4×37.
```

The coincidence of the square index seam with the left twin-cluster anchor is
recorded as a coordinate coincidence only. Roots of non-square integers are
algebraic irrational numbers, not transcendental numbers.

## Layer 3 — complete 37-layer CRT carrier

The product carrier has period `7×11×37=2849`. Each of the 37 fixed `r37`
layers contains exactly `7×11=77` addresses, and the layers partition all
2849 representatives exactly once. Each `(mod 7, mod 11, mod 37)` address
returns one representative in `0..2848`.

The six supplied ring markers occur on layers `15, 4, 19, 8, 34, 12` in
source order. `18↔19` is an additive inverse-class pair in `Z37`. On layer 32,
661 and 809 remain distinct cells. Exact enumeration finds 13 prime nodes on
that layer; the supplied extension's display value of 14 is not retained.

## Layer 4 — supplied score table

The 11×6 score table is retained exactly as an owner-supplied observation
layer. It is not generated, permuted or validated by the ring operators. Its
row labels do not establish astronomical, physical or causal interpretation.

## Return and loss

- Ring Return uses source slot and source integer.
- Root Return uses the retained prime index `k` and prime value `p_k`.
- CRT Return uses the full residue address `(r7,r11,r37)`.
- Score Return uses its fixed row label and source marker column.

Screen coordinates and rounded decimals are display-only and never serve as
Return keys.

## Claim boundary

This is finite arithmetic, typed projection and source-bound documentation.
It creates no shared CRT/root mechanism, physical seam, resonance law, new
Navigator identity, relation, Study, Finding, admission or publication state.
