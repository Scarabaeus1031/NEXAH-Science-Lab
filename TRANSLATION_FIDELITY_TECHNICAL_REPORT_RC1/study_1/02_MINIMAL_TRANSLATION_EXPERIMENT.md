# Minimal Translation Experiment

Status: prospective and frozen before result generation.  
Disposition: `RESEARCH / NOT_ADOPTED`.

## Fixture

A deterministic scalar trajectory visits three analytically declared plateaus
in order `A → B → C → B → A`, with fixed short linear connectors. Plateaus are
`-2`, `0`, `2`; dwell counts are 24, 20, 24, 20, 24 and each connector has 6
interior points. These declared states are fixture provenance, not cluster
truth.

Canonical adapter configuration is frozen:

```text
n_clusters = 3
window = 6
random_state = 7
normalize = true
```

## Representations

1. `baseline_scalar`: `x`.
2. `affine_redundant_2d`: `[x, 2x+1]` — software/known-property control.
3. `nonlinear_injective_2d`: `[x, x^3]` — H1.
4. `delay_2d`: `[x_t, x_(t-1)]`, first predecessor repeated — H2.
5. `small_noise`: `x + N(0,10^-6)` using `Generator(PCG64(20260813))` — H5.
6. `coarsened`: every second scalar sample — H6.
7. `lossy_square`: `x²` — C1.
8. `structural_shortcut`: a separately declared sequence `A → C → B → A`
   with an instantaneous A→C jump — C2.

## Frozen decisions

- No parameter changes after any output is inspected.
- No cluster-label comparison; only label-free graph certificates/summaries.
- Binary support includes self-loops exactly as emitted.
- Probability comparison uses values rounded to 12 decimals only for the
  certificate; raw binary64 values remain in output.
- A candidate requires H1 and H2 support-isomorphism plus preserved H3
  summaries, H5 noise stability and a structural-control response. H4 and H6
  may fail without invalidating H1/H2, but failures must be reported.
- If H1 or H2 fails, no nontrivial candidate is declared.
- C1 need not fail; it is an adversarial falsification probe.
- Exact output is canonical JSON with finite floats, sorted keys, compact
  separators and trailing newline.
- Deterministic replay must be byte-identical.

The experiment does not test physical regimes, prediction, stability, early
warning, risk, control, IEEE or PEGASE behavior.
