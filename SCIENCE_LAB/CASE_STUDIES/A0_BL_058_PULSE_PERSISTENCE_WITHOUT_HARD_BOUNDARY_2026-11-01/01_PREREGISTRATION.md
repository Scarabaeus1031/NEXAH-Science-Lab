# A0-BL-058 — preregistration

Date frozen: `2026-11-01`

## Primary question

Does the strongest local curvature event remain at one carrier time when the
center and width of a smooth logistic boundary change?

## Frozen signal

```text
b(t) = 1 - 0.002 t - 0.0005 t^2
e(t) = 0.015 exp((t-16)/4)
p(t) = 0.01 sin(0.8 t)
W(t;t0,sigma) = 1 / (1 + exp((t-t0)/sigma))
c(t) = b(t) + W(t;t0,sigma) [e(t)+p(t)]
```

No hard indicator is permitted anywhere in the Primary construction.

## Frozen parameter grid

- `t=0..50`;
- reference `dt=0.02`;
- boundary centers `t0={23,25,27}`;
- boundary widths `sigma={0.5,1,2,4}`;
- sampling controls `dt={0.01,0.02,0.04}` at `t0=25`, `sigma=2`;
- event-search window `18<=t<=32`;
- Fourier analysis domain `0<=t<=50`, after endpoint-chord detrending;
- Fourier truncations `K={16,32,64,128}`;
- representation windows `Hann` and `Tukey(alpha=0.5)`;
- deterministic phase control at `K=128` using a frozen coefficient-phase
  rotation that preserves each harmonic amplitude.

The event coordinate `t*` is the earliest sample attaining the maximum planar
curvature magnitude

```text
kappa(t) = |c''(t)| / (1 + c'(t)^2)^(3/2)
```

inside the event-search window.

## Frozen tests

1. **Smooth-only contract:** no hard boundary occurs in the executable path.
2. **Boundary tracking:** for each `sigma`, regress `t*` on `t0`; median slope
   at least `0.75` means the event tracks the translated boundary.
3. **Carrier persistence:** total `t*` span across the 12 smooth-boundary
   variants at most `0.50` means carrier-time persistence.
4. **Sampling stability:** reference `t*` span across the three `dt` values at
   most `0.10`.
5. **Fourier stability:** for both windows and `K>=64`, reconstructed `t*`
   differs from its correspondingly windowed direct target by at most `0.25`.
6. **Phase control:** at fixed amplitudes, phase rotation changes event time by
   more than `0.50` or event amplitude by more than `20%`.
7. **Alpha/Beta readout:** centered `63/64 : 1/64` reciprocal-product error is
   at most `1e-12`; this is a readout check, not evidence for pulse existence.
8. **Ablations:** removing exponential, sinusoid or quadratic drift is reported
   descriptively and cannot repair a failed primary classification.

## Classification

- boundary tracking true and carrier persistence false →
  `BOUNDARY_LOCKED_SMOOTH_EVENT`;
- carrier persistence true and boundary tracking false →
  `CARRIER_PERSISTENT_EVENT`;
- both true → `MIXED_BOUNDARY_AND_CARRIER_PERSISTENCE`;
- sampling or Fourier stability false → `REPRESENTATION_SENSITIVE_EVENT`;
- otherwise → `INDETERMINATE_EVENT_ORIGIN`;
- lock, source, schema or contract mismatch → `INVALID_SOURCE_OR_CONTRACT`.

`PHASE_COHERENT_ONLY` is an additional qualifier when the phase control passes;
it never upgrades the primary classification.

## Claim boundary

The run can classify a deterministic local event inside this declared model.
It cannot establish physical breathing, expansion, energy, resonance,
consciousness, biological function, universal Alpha/Beta semantics, a
privileged Fourier basis, predictive utility or cross-domain mechanism.
