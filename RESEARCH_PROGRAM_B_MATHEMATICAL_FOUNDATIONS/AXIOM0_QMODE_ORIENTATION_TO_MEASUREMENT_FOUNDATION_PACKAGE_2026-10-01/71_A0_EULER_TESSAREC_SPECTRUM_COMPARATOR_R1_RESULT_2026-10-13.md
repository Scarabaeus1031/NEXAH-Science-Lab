# Check 71 — Euler / Tessarec Spectrum Comparator R1 Result

Date: `2026-10-13`  
Study: `A0_EULER_TESSAREC_SPECTRUM_COMPARATOR_2026_10_13`  
Run: `A0_EULER_TESSAREC_SPECTRUM_COMPARATOR_RUN_001`  
Status: `VALIDATED_NEGATIVE_RESULT / EXECUTION_STOPPED / OWNER_ACCEPTED_BOUNDED_NEGATIVE_2026-10-13`

## Result

```text
NO_EULER_SPECIFIC_SPECTRAL_SUPPORT
```

The registered Euler shape `n²+n` does not improve held-out prediction over
the affine rank curve. It also falls far outside the registered five-percent
proximity to the unrestricted quadratic control. Although its `A_E` value is
higher than every matched null value, that fact cannot rescue the failed
directional effect and quadratic-gap gates.

## Registered model errors

| Model | Pooled held-out CV_NRMSE |
|---|---:|
| `M0` intercept | `1.1399954805010974` |
| `M1` affine | `0.13822681058289338` |
| `ME` Euler shape | `0.41822709594553964` |
| `M2` free quadratic | `0.17252636661028473` |

```text
A_E = -2.0256582943779393
G_Q =  1.4241343752996423
```

`A_E<0` means the Euler model's held-out error is more than three times the
affine model's error. `G_Q=1.4241` means the Euler error is about 142.4% above
the unrestricted quadratic error, not within the registered five-percent
gap.

## Decision gates

| Gate | Result |
|---|---|
| `A_E >= 0.05` | `FAIL` |
| `A_E > matched-null q95` | `PASS` |
| `G_Q <= 0.05` | `FAIL` |
| all gates | `FAIL` |

The positive label required all gates. The maintained result is therefore the
registered negative label, not an ambiguous or post-hoc interpretation.

## Matched null population

- accepted graphs: `10,000`;
- seed: `20261013`;
- proposals: `77,971`;
- rejected self-loop: `39,707`;
- rejected parallel-edge: `28,262`;
- rejected disconnected: `2`;
- null `A_E` mean: `-5.150782197937101`;
- null `A_E` q95: `-3.8414341842112982`;
- observed exceedances: `0`;
- upper Monte Carlo p-value: `1/10001 = 0.00009999000099990002`.

The observed shape is less poor than the matched random-cubic population, but
it is still substantially worse than the registered affine baseline. The
null percentile therefore describes relative rank among generally unsuitable
Euler fits; it is not positive Euler support.

## Integrity and audit

- best-`c` search: `NO`;
- source rank: `descending`, corrected before execution;
- result JSON SHA-256:
  `4fa1ce4d38824e9c0be8e10eb6aa669163659305a2d4bc4bb18a6fc3b6faf534`;
- SVG SHA-256:
  `3765b78dd7debeb58f76e84beac1e6650ad3d255ba56580a5d0ee40aa1c823c4`;
- independent result-ledger validator: `PASS` after execution;
- immutable result files were created once and not overwritten.

## Claim boundary

This negative result concerns one registered rank-shape comparator on one
frozen finite graph spectrum. It does not reject every Euler-related graph
question, alter the prior Ramanujan–Ihara result, establish a common generator,
or support prime, physical, optimality or novelty claims.

The Human Owner accepted this bounded negative disposition on `2026-10-13`.
Replay, publication and successor design remain separately gated.
