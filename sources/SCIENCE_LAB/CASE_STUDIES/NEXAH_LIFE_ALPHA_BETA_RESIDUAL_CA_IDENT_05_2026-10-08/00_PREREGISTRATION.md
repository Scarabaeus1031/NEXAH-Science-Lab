# CA-IDENT-05 preregistration · alpha/beta residual

Status: `LOCKED_BEFORE_EXECUTION`

This experiment tests the recurring relation `P = A + B` as a declared metric
mixture, not as a physical identity:

```text
A = 63/64 · radial Fourier
B =  1/64 · Shadow Memory
P = A + B
```

After each view is standardized on training rows, its squared Euclidean
contribution is normalized by view dimension. Coordinate multipliers are
therefore `sqrt(weight / dimension)`. This makes the squared metric contribution
exactly `63/64` versus `1/64` rather than merely concatenating 4 and 18 values.

Controls are Fourier alone, equal `1/2 + 1/2`, and the reversed assignment
`1/64 + 63/64`.

Training is `R00-R24`. The untouched holdout is `R25-R124`, producing 2,000
rows before any class-coverage decision. Every behavior class seen in training
must receive at least ten holdout rows or utility interpretation stops.

No resonance, radiance, quantum, biological or universal-mechanism claim is in
scope.
