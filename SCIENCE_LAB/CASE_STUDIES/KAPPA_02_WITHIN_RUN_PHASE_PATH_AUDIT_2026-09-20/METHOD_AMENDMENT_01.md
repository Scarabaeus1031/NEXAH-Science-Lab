# KAPPA-02 — Method Amendment 01

Status: `SEALED_AFTER_SYNTHETIC_FAILURE_BEFORE_EMPIRICAL_OUTPUT`

## Trigger

The first synthetic-only execution stopped before empirical output because the
direct weighted demodulation sum recovered a fixed 23° phase with maximum
error `0.05503965790080656°`, exceeding the frozen `0.05°` tolerance. The same
error appeared under unequal amplitudes. All other synthetic gates passed.

## Diagnosis

With a one-cycle Hann window, the sampled sine and cosine basis vectors are not
perfectly orthogonal under the direct complex sum. The resulting small
short-window bias is algorithmic and deterministic.

## Frozen repair

Window length, Hann weights, frequency, timestamps, advance and all tolerances
remain unchanged. The local complex coefficient is estimated by weighted
least squares on the declared harmonic basis:

```text
x(t) = a cos(2 pi f t) + b sin(2 pi f t) + c
Z_x  = a - i b
```

The fit uses square-root Hann weights. Relative phase remains
`arg(Z_force/Z_displacement)`.

This is an orthogonalized implementation of the frozen weighted local harmonic
demodulation. No empirical record was produced or inspected before this
amendment. The original tolerances are not relaxed.

## Gate

All four original synthetic controls must pass before empirical execution.
