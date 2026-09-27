# PHX-00 — Phase Recoverability Decision

## Source-specific decisions

### HZ_FZ_01 local admission case

Classification:

```text
D — MAGNITUDE_OR_FREQUENCY_SUMMARIES_ONLY_PHASE_NOT_RECOVERABLE
```

Reason: the only time-domain samples in the case are explicitly synthetic
conformance data. The required real `NULL`, `REFERENCE_A` and `REPLAY_B`
measurements are absent. No empirical phase value may be inferred for this
local apparatus.

### HZ_FZ_PUBLIC_01 external E2 case

Classification:

```text
A — RAW_SYNCHRONIZED_SIGNALS_PHASE_RECOVERABLE
```

Reason: every selected file contains strictly ordered relative timestamps and
simultaneously represented displacement and force channels at approximately
512 Hz. The retained source inspection reports no missing or non-finite values
and was reproduced byte-for-byte during this gate.

## Exact recoverability boundary

Permitted within each CSV record:

- force phase relative to the corresponding actuator displacement;
- actuator-2 phase relative to actuator-1 for the same physical quantity;
- windowed fundamental or cross-spectral phase at the declared excitation;
- narrowband instantaneous relative phase after a documented suitability and edge-effect check;
- phase-locking, circular dispersion and phase-slip diagnostics with declared windows and uncertainty.

Not permitted from the bound evidence:

- absolute phase without an explicit reference;
- sample-wise phase alignment between separate before/after CSV files;
- a causal earthquake effect;
- electrical-drive-to-force phase, because measured drive voltage is absent;
- HZ_FZ_01 admission or runtime-profile activation;
- prime, morphogenesis, microtubule or consciousness inference.

## Reference convention

For actuator `k` within one record, PHX-01 should use displacement as the
explicit reference:

```text
delta_phi_k(t) = wrap(phi_force,k(t) - phi_disp,k(t))
```

For time-varying frequency, phase must be represented through accumulated
angle rather than `2*pi*f(t)*t`:

```text
theta(t) = theta(t0) + 2*pi*integral[t0..t] f(u) du
```

If an `n:m` relation is ever justified, it must be declared before testing and
use a generalized phase combination such as `wrap(m*phi_i - n*phi_j)`.

## Overall gate result

The overall PHX-00 classification is `A` only for a new, explicitly external
E2 phase analysis of `HZ_FZ_PUBLIC_01`. The local HZ_FZ_01 gate remains at `D`
for empirical phase and `GATE_READY_MEASUREMENT_PENDING` operationally.

