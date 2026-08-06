# C3 profile under the v39 capture protocol

Date: 2026-08-06  
Status: controlled-model measurement; no transfer claim

## Question

Does C3 retain ring seeds under the same numerical protocol used for the C2
return test in `navigator_v39_fixpoint_extraction.py`?

## Declared protocol

- Model equations, cluster positions, capture hook and target bias: v39.
- Deterministic seed: 42.
- Controlled trajectory: 260 steps, step size 0.06, no noise.
- Fixpoint estimate: mean of 100 endpoints from paired uniform offsets in
  `[-0.9, 0.9]^2` around each declared center.
- Ring test: 40 evenly spaced seeds at each radius
  `r = {0.2, 0.4, 0.6, 0.8, 1.0, 1.2}`.
- Return: endpoint distance from the controlled fixpoint estimate `<= 0.16`.
- Reported radius: largest tested radius with return fraction `>= 0.90`.

The same offset cloud is used for C2 and C3. This is a paired comparison.

## Results

| Metric | C2 | C3 |
|---|---:|---:|
| Declared center `(alpha, beta)` | `(13.5, 26.0)` | `(11.0, 28.5)` |
| Controlled fixpoint estimate | `(13.500288, 25.997661)` | `(11.004513, 28.498835)` |
| Mean endpoint-cloud spread | `0.033539` | `0.034365` |
| Largest tested `r` with controlled return `>= 0.90` | `>= 1.2` | `1.0` |
| Scalar-field value at declared center | `3.217325` | `-1.944585` |
| Combined-field norm at declared center | `0.390965` | `0.190136` |

Controlled return fractions:

| Radius | C2 | C3 |
|---:|---:|---:|
| 0.2 | 1.00 | 1.00 |
| 0.4 | 1.00 | 1.00 |
| 0.6 | 1.00 | 1.00 |
| 0.8 | 1.00 | 1.00 |
| 1.0 | 1.00 | 1.00 |
| 1.2 | 1.00 | 0.75 |

At `r=1.2`, 10 of 40 C3 seeds fail the declared return criterion. The scan
does not locate the boundary more finely than the declared radius grid.

## Interpretation limit

This is a **controlled capture rate**, not a free-field basin measurement.
The v39 update contains target bias and a capture hook, then normalizes the
resulting direction before applying a constant step. Consequently, the
endpoint cloud and its mean are controller-dependent finite-horizon records;
they do not establish a mathematical fixed point of the free vector field.

As a separate diagnostic, the runner integrates
`dx/dt = combined_field(x)` without target bias, hook or direction
normalization. None of the tested C2 or C3 ring endpoints finish within 0.16 of
the declared centers. This does not contradict the controlled result: the
declared centers are not zeros of the combined field. The local Jacobian real
parts at the declared centers are approximately `-1.921` for C2 and `+1.523`
for C3, but these are local derivative diagnostics at non-equilibrium points,
not fixed-point stability certificates.

The scalar-field values also require a sign convention. The implemented free
dynamics uses `+grad(scalar_field)`. Under that implementation, a lower scalar
value is not automatically an attracting potential well.

## Reproduction

```bash
/opt/anaconda3/bin/python FIELD_NOTES/C3_PROFILE_2026-08-06/measure_c3_profile.py
```

Machine-readable outputs:

- `results/c2_c3_return_scan.csv`
- `results/c2_c3_profile.json`

Method boundary:

- [V39 — Controlled Return ist kein freies Basin](V39_CONTROLLED_RETURN_METHOD_NOTE_DE.md)
- [Terminology consistency audit](TERMINOLOGY_CONSISTENCY_AUDIT_2026-08-06.md)

Transition experiment:

- [C3 to C2 transition experiment](C3_TO_C2_TRANSITION_2026-08-06/README.md)

Stop rule: the deterministic controlled metrics reproduce; the instrument is
usable for this declared comparison only. No stronger physical or ontological
claim follows.
