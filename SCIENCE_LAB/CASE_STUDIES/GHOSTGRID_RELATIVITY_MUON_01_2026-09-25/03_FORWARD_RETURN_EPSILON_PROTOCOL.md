# Forward / return / epsilon protocol

Status: `DETERMINISTIC_REPRESENTATION_TEST`

## Fixture

```text
c       = 299792458 m/s
tau_0   = 2.1969811 microseconds
L       = 15000 m
beta    = 0.99
event 0 = (t=0, x=0)
event 1 = (t=L/(beta*c), x=L) in the Earth frame
```

The 15 km and 0.99c pairing is a didactic fixture, not a claim that all ground-
level muons share those values.

## Test F1 — full-record forward and inverse

Apply \(\Lambda_{AB}\), then \(\Lambda_{BA}\):

\[
(t,x)\xrightarrow{\Lambda_{AB}}(t',x')
\xrightarrow{\Lambda_{BA}}(\hat t,\hat x).
\]

Residuals:

\[
\epsilon_t=|\hat t-t|,\qquad
\epsilon_x=|\hat x-x|,
\]

plus the relative invariant-interval discrepancy.

Pass thresholds:

```text
epsilon_t < 1e-15 s
epsilon_x < 1e-8 m
relative interval discrepancy < 1e-12
```

This tests coordinate-return fidelity only.

## Test F2 — time-only lossy projection

Retain only the Earth-frame elapsed time and discard frame velocity and path
length. Multiple source configurations can yield that scalar. The inverse is
therefore set-valued or undefined:

\[
\Pi_{t}^{-1}(\Delta t)=\{X_1,X_2,\ldots\}.
\]

Expected result: `EXACT_RETURN_NOT_IDENTIFIABLE`.

## Test F3 — mirror substitution negative control

Replacing the Lorentz seam with an ordinary Euclidean reflection does not in
general preserve the spacetime interval and does not reproduce time dilation.

Expected result: `REJECT_MIRROR_AS_PHYSICS_TRANSFORM`.

## Test F4 — physical-time-reversal negative control

An inverse coordinate transformation returns a description to its original
frame. It does not reverse decay or erase the trace.

Expected result: `INVERSE_TRANSFORM_NOT_PHYSICAL_TIME_REVERSAL`.

## Record rule

Even when the endpoint residual is zero within tolerance:

```text
RETURN_TO_COORDINATES != RETURN_TO_HISTORY
```

The forward transform, inverse transform, inputs, outputs and tolerances remain
in the trace.

