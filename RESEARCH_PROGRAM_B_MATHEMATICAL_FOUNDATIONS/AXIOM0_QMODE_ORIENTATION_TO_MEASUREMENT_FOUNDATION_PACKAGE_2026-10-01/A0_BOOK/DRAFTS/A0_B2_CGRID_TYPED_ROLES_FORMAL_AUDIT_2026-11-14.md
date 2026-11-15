# B2 — c-grid + typed roles formal audit

**Date:** 2026-11-14
**Status:** Architecture `PASS` · physical prediction `NO GAIN`
**Authority:** R0/R1 formal model audit; not a scientific replay, claim adoption, or proof of new physics.

## Question

Does B2 add a mathematically coherent typed representation to the B1 causal grid, and does that representation produce a held-out physical prediction beyond B1?

The tested sequence is:

- **B0:** ordinary spacetime coordinates;
- **B1:** a causal grid using `c` as its interval and ordering rule;
- **B2:** the B1 grid plus declared semantic roles `P / M / J / U`.

The interval contract is

\[
q_{ij}=(c\,\Delta t)^2-\lVert\Delta x\rVert^2.
\]

The boost contract is

\[
ct'=\gamma(ct-\beta x),\qquad
x'=\gamma(x-\beta ct).
\]

## Typed roles

| Symbol | Audit meaning | Constraint |
|---|---|---|
| `P_evt` | event carrier | remains an event carrier under the tested transforms |
| `M_hist` | declared retained history | declared sequence and role remain stable |
| `J` | A0 quarter-turn operator | `J^4 = I` |
| `F = J^2` | side/frame flip | `F^2 = I` |
| `U_unres` | unresolved residual | remains explicitly unresolved; it is not converted into a hidden mechanism |

This distinction corrects a possible ambiguity in the informal B2 description: in the existing A0 grammar, `J` is not itself the involutive side flip. `J` is the quarter-turn operator; its square `F = J^2` supplies the flip.

## Results

| Check | Result |
|---|---:|
| Lorentz interval invariant | PASS |
| causal class invariant | PASS |
| future/past ordering for tested timelike cases invariant | PASS |
| A0 quarter-turn `J^4 = I` | PASS |
| side flip `F^2 = I` | PASS |
| semantic role types stable | PASS |
| declared history order stable | PASS |
| `c`-ablation has unique best fit at `k/c = 1` | PASS |
| `k^beta` is separately identifiable from the composite | FAIL, as expected |
| B2 adds a held-out physical prediction beyond B1 | NO |

The operator check uses the existing A0 modulus `2501` and the factor `J = 50`:

\[
50^2\equiv -1\pmod{2501},\qquad
50^4\equiv 1\pmod{2501}.
\]

Therefore

\[
F=J^2\equiv -1\pmod{2501},\qquad F^2=I.
\]

## c-ablation

Null cases were generated with the declared rule `|Delta x| = c Delta t`. The rule was then replaced by `k` while the observations were held fixed.

| `k/c` | mean normalized null residual |
|---:|---:|
| 0.90 | 0.1900 |
| 0.99 | 0.0199 |
| **1.00** | **0.0000** |
| 1.01 | 0.0201 |
| 1.10 | 0.2100 |

Within this contract, `c` is the unique best-fitting rule. This demonstrates internal calibration of the constructed grid. It does **not** independently derive the physical value of `c`, because the null observations were defined using that value.

## k^beta finding

If the proposed rule is written as

\[
c_{\mathrm{eff}}=k^\beta,
\]

then many pairs `(k,beta)` produce the same effective rule. For example, `beta = 0.5`, `1`, and `2` can all be paired with different values of `k` to recover the same `c_eff`.

Therefore B2 can test the **composite** `k^beta`, but it cannot infer `k` and `beta` separately without an additional independent constraint. Treating the two parameters as separately measured would over-identify the model.

## Verdict

**B2 passes as a formal cartographic grammar.** It keeps causal classes, order, operator closure, and semantic roles consistent. It also makes the unresolved remainder visible instead of silently assigning it a mechanism.

**B2 does not yet add physical predictive power beyond B1.** On the held-out causal classification used here, B1 already contains the decisive interval rule. The typed roles improve bookkeeping, interpretation, and auditability, but do not change the prediction.

The appropriate current claim is therefore:

> B2 is a coherent typed map of an existing causal structure. It is not yet evidence for a new causal law.

## Reproduction

Run from any directory with Node.js:

```sh
node "/Users/tho2020/Documents/NEXAH ECOSYSTEM/30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/DRAFTS/A0_B2_CGRID_TYPED_ROLES_FORMAL_AUDIT_2026-11-14.mjs"
```

## Governance return

- **Identity decision:** reuse and relate; no new Navigator identity created.
- **Relation:** bounded audit related to the existing A0/MOD-2501 operator material.
- **Graph effect:** none; no registry, binder, overlay, route, or Mission Control projection changed.
- **Publication effect:** none; this remains a local draft audit.
- **Validator baseline:** the Source Graph validator still reports the pre-existing, unrelated `SG:LENS:A0_ORIENTATION_EVIDENCE` component/hash failures. B2 introduced no additional validator failure.
