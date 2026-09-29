# E8-REP-03 — Representation Ledger Benchmark

This package is a reproducible NEXAH control case for the rule:

> Observed similarity is not identity. Representation may change; invariants must be tested.

It follows one mathematical object through three representations:

1. the 240 roots of `E8` in eight dimensions;
2. the four-dimensional projection `H4 ∪ φH4`;
3. the two-dimensional Coxeter projection with eight orbits of thirty points.

Two negative controls are included:

- a deterministic generic 8D→2D projection;
- the modular graph family `i → 37i mod N` for `N = 37, 137, 237, 11357`.

The benchmark does **not** claim that the E8/H4 relation is new mathematics. It records a known structure as a reproducible calibration case for NEXAH's Representation Ledger and fail-closed comparison method.

## Run

```bash
python3 -m pip install -r requirements.txt
python3 e8_rep_03.py
```

The script writes all measurements to `outputs/` and regenerates:

- `REPORT.md`
- `REPRESENTATION_LEDGER.md`
- `outputs/results.json`
- `outputs/assertions.csv`
- `outputs/e8_roots_8d.csv`
- `outputs/h4_shells_4d.csv`
- `outputs/coxeter_projection_2d.csv`
- `outputs/negative_controls.csv`

Exit code `0` means every positive assertion passed and both negative controls failed the E8 identity gate as expected.

## Decision boundary

The benchmark confirms a representation chain only when the operator, orbit structure, metric, shell structure, Gram data, and reflection closure agree. A similar-looking radial image is insufficient.
