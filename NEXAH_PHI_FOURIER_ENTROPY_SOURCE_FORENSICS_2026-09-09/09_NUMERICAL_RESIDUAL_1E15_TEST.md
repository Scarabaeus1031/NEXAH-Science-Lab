# Numerical Residual 1E-15 Test

## Bound legacy field

No operation, array, code path, color scale, or stored numeric data is bound to a named 10⁻15 Fourier/residual visual. Its classification is therefore **UNRESOLVED**, not signal.

The legacy cycle documents separately use approximately 1.409×10⁻15 Hz for a 225-million-year period. Direct calculation gives approximately 1.4085×10⁻16 Hz, so that entry is a factor-of-ten arithmetic error, not a residual field.

## Controlled FFT round-trip

Operation: IFFT2(FFT2(M)) − M on the 8×8 candidate.

- float64 maximum absolute residual: 1.6653345369377348×10⁻16.
- float32 maximum absolute residual: 5.960464477539063×10⁻8.
- float64 after a harmless one-row cyclic reindexing: 1.6653345369377348×10⁻16.
- float64 Parseval absolute discrepancy: 3.552713678800501×10⁻15.

These magnitudes scale with floating-point precision and operation order and are consistent with rounding. Classification for this controlled baseline: **EXPECTED_FLOATING_POINT_RESIDUAL**.

## Required distinction

The controlled residual classification cannot be transferred to an unbound screenshot. Conversely, a colorful image at a 10⁻15 color scale cannot be promoted to DATA_DEPENDENT_SIGNAL without:

- exact producing operation and inputs;
- raw numeric array;
- absolute and relative error;
- normalization and array-size scaling;
- float32/float64/high-precision comparison;
- convention/reindexing controls;
- a predeclared signal model and null distribution.

## Decision

Legacy 10⁻15 field: UNRESOLVED.  
Independent FFT residual: EXPECTED_FLOATING_POINT_RESIDUAL.  
Physical-signal claim: NO.

