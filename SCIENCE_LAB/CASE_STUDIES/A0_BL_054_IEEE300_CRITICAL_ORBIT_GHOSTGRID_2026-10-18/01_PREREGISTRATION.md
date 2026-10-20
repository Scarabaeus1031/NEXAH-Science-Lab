# A0-BL-054 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN / ADMITTED_OPEN / NOT_ACTIVE / NOT_EXECUTED`

## Question

Can a finite, non-trivially exposed complex-orbit signature retain the
ordering of changes in the label-independent IEEE-300 relation record across
declared Ghostgrid views, while distinguishing load, topology and synthetic
state changes and remaining exactly invariant to bus relabeling?

## Frozen source campaign

- IEEE-300 continuation scales:
  `1.000, 1.005, 1.010, 1.015, 1.020, 1.025, 1.030`;
- fixed topology control: line `228` out of service;
- fixed bus-relabel control: seed `20261008`;
- fixed synthetic control: the existing uniform analytic ablation;
- all states pass through the existing six-column label-independent relation
  encoder from `MOD:IEEE300_GRAPH_GRID`.

No failed state is imputed. Solver or source divergence fails closed.

## Frozen adapter

Let each relation row be normalized with the fixed scales

```text
(1, 1, 0.35, 0.10, 30, 100).
```

Define

```text
s = clip(mean(abs(columns 3..6)), 0, 1)
h = clip(mean(std(all six normalized columns)), 0, 1)
c = (-0.82 + 0.34 s) + i(0.08 + 0.28 h).
```

This adapter is declared before execution. It uses no bus label, target class,
Ghostgrid output or post-result fit.

## Leakage boundary and orbit

```text
z0 = 0
z(n+1) = z(n)^2 + c
N = 32
```

The result does not emit `z1=c`, `z2`, `z3` or `z4`, nor any raw complex
iterate. Only iterates `z5..z32` contribute the following 8-bit features:

- clipped radius `|z|/2`;
- wrapped phase `(arg(z)+pi)/(2pi)`;
- clipped radial increment `(delta|z|+0.5)`.

Any non-finite value or `|z|>2` is `INVALID_ADAPTER`; escaped paths are not
clipped into apparent stability.

## Frozen Ghostgrid views

For each late-orbit signature produce normalized histograms:

1. ordered time × radius;
2. phase × radius;
3. radial-increment × phase.

The registered view stress uses resolutions `8,16,32`, phase offsets
`0, pi/8, pi/4`, and viewport radial scales `0.75,1.0,1.25`. View stability is
not pixel identity: for each configuration, pairwise L1 distances among the
seven load states must preserve the complete-relation distance ordering with
Spearman `rho >= 0.80`.

## Controls and gates

- bus relabel: adapter, quantized signature and every view must be identical;
- load: distance from `1.000` must have Spearman `rho >= 0.80` with load scale
  and the final primary-view L1 must exceed `0.01`;
- topology: stress-state primary-view L1 must exceed `1e-4`;
- synthetic ablation: stress-state primary-view L1 must exceed `0.10`;
- collision: all seven load signatures, topology and synthetic signatures must
  be distinct; relabel must intentionally equal the stress signature;
- order control: a fixed seed-20261018 shuffle must change the ordered view;
- random baseline: 32 fixed Gaussian two-dimensional projections of the
  twelve-number relation mean/std summary. Their ordering correlations are
  reported; superiority is diagnostic, not a primary gate.

## Result vocabulary

- `PASS_BOUNDED_REPRESENTATION_STRESS`;
- `MIXED_NEGATIVE`;
- `INFORMATION_LOST`;
- `UNINFORMATIVE_NO_ADVANTAGE_OVER_DIRECT_SIGNATURE`;
- `INVALID_ADAPTER`;
- `INVALID_EXPERIMENT`.

## STOP and claim ceiling

The experiment stops after one Primary, one Replay and verification. It tests
representation behavior only. It does not test or authorize early warning,
prediction, grid control, causal mechanism, resonance, physical Critical
Orbit, preferred geometry, operational utility, public release or publication.
