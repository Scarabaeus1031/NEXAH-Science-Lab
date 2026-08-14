# EXP-ORION-L2-001 — Immutable Preregistration Lock

UTC lock timestamp: 2026-08-10T17:17:32Z

## Identity and review binding

```text
EXPERIMENT ID: EXP-ORION-L2-001
SYSTEM: Lorenz-63
PREREGISTRATION VERSION: 1.0
PREREGISTRATION: ../ORION_LEVEL_2_NONLINEAR_DYNAMICS_PREREGISTRATION/07_ORION_L2_PREREGISTRATION.md
PREREGISTRATION SHA-256: ad28dbd77611a3e04852d47d5f031eac01705548a1e7f9fd2770aac3091c3c87
REVIEW: PASS
CRITICAL FINDINGS: 0
MAJOR FINDINGS: 0
MINOR FINDINGS: 1
CANDIDATE COUNT: 13
CONTROL COUNT: 6
EXECUTION AUTHORIZED: YES
RESULT KNOWN AT LOCK TIME: NO
```

The remaining MINOR limitation is preserved: several exact transport claims are conformance tests of correct coordinate transport and classification, not discoveries of new Lorenz mathematics. This limitation may not be silently removed or upgraded into a stronger claim.

## Frozen source

```text
dx/dt = 10(y-x)
dy/dt = x(28-z)-y
dz/dt = xy-(8/3)z
s(0) = (1,1,1)
```

Parameters are `sigma=10`, `rho=28`, `beta=8/3`. Exact fixtures are `O=(0,0,0)`, `a=sqrt(72)`, `C+=(a,a,27)`, and `C-=(-a,-a,27)`.

## Frozen integration, transient, and sampling

- Classical simultaneous fixed-step RK4 in IEEE-754 binary64.
- Production step `h=0.001`, duration 20, exactly 20,000 steps.
- Saved sampling every 0.01, including endpoints.
- Transient boundary `t=5`.
- Coordinate comparison window `[5,7]`.
- Source convergence window `[0,2]`.
- Independent reference step `h=0.0005`.
- No adaptive stepping and no stochastic operation or seed.
- Algebraic checkpoints are saved indices `500,505,...,660` only.

## Frozen representations and observation boundaries

- R0 native `(x,y,z)`.
- R1 orthogonal `Q(x,y,z)=(y,z,x)` with inverse `(u3,u1,u2)`.
- R2 non-orthogonal `S(x,y,z)=(2x,0.5y,1.5z)` with inverse `(v1/2,2v2,v3/1.5)`.
- R3 nonlinear global diffeomorphism `(x,y,z+0.01x^2)` with inverse `(w1,w2,w3-0.01w1^2)`.
- R4 lossy projection `z` only. Its claimant receives no time, step, source ID, neighbors, history/future, derivatives, equations, hidden coordinates, or correspondence metadata.
- R5 uses the seven locked z bins and palettes A `(L0,...,L6)` and B `(L6,...,L0)`.

All maps, inverses, domains, information loss, undefined conditions, transport laws, raw schemas, and generation-path labels are frozen exactly as in the reviewed preregistration.

## Frozen candidate classes and thresholds

| ID | Expected class | Frozen rule |
|---|---|---|
| L2-C01 | ROBUST | source/half-step maximum defect on `[0,2]` `<=1e-5` |
| L2-C02 | EQUIVARIANT | R1 trajectory defect `<=1e-9` |
| L2-C03 | EQUIVARIANT | R1 field residual `<=1e-11` |
| L2-C04 | EQUIVARIANT | R2 trajectory defect `<=2e-9` |
| L2-C05 | EQUIVARIANT | R2 field residual `<=1e-10` |
| L2-C06 | EQUIVARIANT | R3 fine defect `<=1e-3` and fine defect `<=0.35` times coarse defect |
| L2-C07 | EQUIVARIANT | R3 field residual `<=1e-9` |
| L2-C08 | EQUIVARIANT | mapped-equilibrium field norm `<=1e-10` |
| L2-C09 | INVARIANT | relative characteristic-coefficient defect `<=1e-9` |
| L2-C10 | INVARIANT | divergence defect `<=1e-10` |
| L2-C11 | REPRESENTATION_DEPENDENT | relative raw R2 distance change `>=0.25` |
| L2-C12 | UNDEFINED | exact C+/C− same-z collision and z-only claimant returns UNDEFINED |
| L2-C13 | REPRESENTATION_DEPENDENT | bins identical and at least one fixture color changes |

## Frozen destructive controls

- D1: `rho=27` in purported R1 field; residual at `(1,1,1) >=0.5`.
- D2: wrong R2 law `S f(v)`; maximum residual `>=1`.
- D3: raw Euclidean R2 metric; C+/C− relative distance change `>=0.25`.
- D4: request sign(x) from common z=27; claimant returns UNDEFINED.
- D5: reverse `[0,2]` time orientation; endpoint forward-law residual `>=1.9`.
- D6: reverse palette; bins identical and at least one color changes.

## Frozen architecture, software, and authorization

The required stage order is generator, blind observer/classifier, canonical sealed observation, then comparator. Generator and observer cannot read expected classes. Observer uses only the class-free rules. Comparator receives expected classes only after seal verification. Independent paths and observer algebra cannot share generator intermediates or helpers.

Software requirement is CPython 3.9.6 standard library on macOS arm64, binary64 mantissa 53/radix 2. A clean replay must regenerate every output in a new directory and may not read primary generated outputs.

After this lock there are no threshold, category, control, representation, observation-boundary, horizon, or interpretation changes. Any required scientific change invalidates this experiment version.

```text
LOCKED: YES
EXECUTION AUTHORIZED: YES
EXECUTED AT LOCK TIME: NO
RESULT KNOWN AT LOCK TIME: NO
```

