# ELINE_FOURIER_RECONSTRUCTION_01 result report

Date: `2026-09-29`

## Result

```text
PASS_ELINE_FOURIER_RECONSTRUCTION__FINITE_VIEW_EQUIVALENCE
```

All `10/10` checks passed. The frozen pixel tracer recovered the preregistered
eleven y positions exactly:

```text
212, 103, 55, 82, 164, 260, 327, 334, 286, 209, 142.
```

The full eleven-component DFT reconstructs the normalized samples to numerical
precision and satisfies Parseval and conjugate symmetry. The DC plus first
harmonic pair carries `0.8332598611` of spectral energy, but its reconstruction
RMSE is `0.2711241682`: the signal is strongly wave-like, not an exact single
sine. Harmonics through `k=2` carry more than `94%` of the energy.

Thus eLinie and full finite Fourier coordinates are lossless views of the same
eleven-sample carrier. This does not identify a unique continuous curve or a
physical spectrum.

Machine-result SHA-256:

```text
189e5b7b83ba42d2b1764960c3208c031c1fbffcbbe09418a909f849454c592d
```
