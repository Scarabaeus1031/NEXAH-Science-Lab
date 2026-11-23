# A0 Half-Line / Theta / Prime Residual Return — bounded contract

**Date:** 2026-11-21
**Status:** internal owner-staging comparator
**Identity disposition:** reuse only — `MOD:NUMBER_VIEW_SUITE`, `ART:A0:MATHEMATICAL_JOINTS`, `NEXAH_ORION_REF02_Q_MIRROR_2026_10_01`
**Navigator delta:** 0 identities, 0 relations, 0 aliases, 0 studies, 0 findings

## Purpose

This instrument keeps four carriers visibly separate: a finite residue orbit, the positive reciprocal involution with the Jacobi theta transformation, the affine anti-holomorphic mirror involution of the critical line, and finite prime-counting residuals. It is an explanatory and falsification-oriented A0 view, not a Riemann-Hypothesis study or proof claim.

## Typed carriers

1. **Exact finite return:** `q_M(n)=n mod M`, therefore `q_M(n+M)=q_M(n)`.
2. **Exact reciprocal return:** `I(t)=1/t`, `I²=id`, with fixed seam `t=1`.
3. **Numerical theta audit:** `ϑ(1/t)=√t ϑ(t)` evaluated with truncated Gaussian sums for `10^-2≤t≤10^2`.
4. **Finite prime residual:** `E(x)=π(x)-li(x)` evaluated by sieve and the convergent positive-argument series for `Ei(log x)` through `x=100000`.
5. **Conditional reference:** under RH, Schoenfeld's 1976 bound `|π(x)-li(x)|<√x log(x)/(8π)` for `x≥2657`.
6. **Exact critical-line mirror:** `W(s)=1-conj(s)`, `W²=id`, and `Fix(W)={s∈C: Re(s)=1/2}`. This map is affine anti-holomorphic, not anti-linear, because `W(0)=1`.

## Mirror-claim separation

1. **Set invariance:** a set can be preserved by `W` while containing distinct partner points `s` and `W(s)`.
2. **Pointwise fixation:** `W(s)=s` holds exactly when `Re(s)=1/2`.
3. **No-crossing:** no such dynamic or spectral statement follows from the first two items without a separately defined family and proof.

For nontrivial zeta zeros, functional-equation symmetry and complex conjugation produce the familiar orbit `ρ`, `conj(ρ)`, `1−ρ`, `1−conj(ρ)`, with possible collapses on symmetry loci. RH is the stronger assertion that every nontrivial zero belongs to `Fix(W)`.

## Required non-identities

- The half exponent in `1/(2√k)` is not the Riemann critical line.
- `±√x` is an illustrative envelope, not an RH-equivalent bound.
- The reciprocal involution is not a Möbius band; non-orientability requires an explicit gluing rule.
- A circle or lemniscate is a display embedding, not an intrinsic consequence of modulo arithmetic.
- A finite audit through `100000` cannot establish an asymptotic theorem, a zeta-zero location, or RH.
- Mirror invariance of the zero set does not establish pointwise fixation of every zero and does not establish a no-crossing theorem.
- The local twin-prime-anchor interval `661–809` is not attributed to a zeta wave.
- The Euler product is used directly only for `Re(s)>1`; analytic continuation is a distinct operation.

## Verification

```bash
node a0-riemann-halfline-theta-return-tests.cjs
```

The suite verifies modulo closure, reciprocal return, seven critical-line mirror fixtures with exact double return and the `σ=1/2` fixed-set predicate, five theta-transform fixtures, `π(1111)=186`, `π(100000)=9592`, the theorem-domain gate at `2657`, negative sampled residuals in the finite range, visible claim boundaries, and the Science Desk return.

## Primary references

- B. Riemann, *Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse* (1859), manuscript preserved by the Niedersächsische Staats- und Universitätsbibliothek Göttingen and digitally hosted by the Clay Mathematics Institute with the library's permission.
- L. Schoenfeld, “Sharper bounds for the Chebyshev functions θ(x) and ψ(x). II,” *Mathematics of Computation* 30 (1976), including the RH-conditional `π(x)-li(x)` bound used by this view.
- L. Guth and J. Maynard, “New large value estimates for Dirichlet polynomials,” *Annals of Mathematics* 203 (2026). This is relevant modern progress, not a proof of RH.
