# CA-IDENT-05 · Alpha/Beta Residual Audit

Status: `EXECUTED AGAINST LOCK / ALPHA-BETA NO GAIN / COVERAGE PASS / INTERNAL`

## The exact test

The recurring relation was translated into a normalized squared-distance
mixture:

```text
dP² = (63/64) dFourier² + (1/64) dMemory²
```

This is an exact declared weighting after per-view standardization and
dimension normalization. It is not treated as a physical constant.

## Outcome

| Model | Fourier weight | Memory weight | Accuracy | Macro-F1 |
|---|---:|---:|---:|---:|
| Fourier A | 1 | 0 | 0.8835 | 0.5307 |
| P 63/1 | 63/64 | 1/64 | 0.8870 | 0.5277 |
| P equal | 1/2 | 1/2 | 0.9270 | 0.5853 |
| Reverse control | 1/64 | 63/64 | **0.9325** | **0.6084** |

The proposed 63/64 Fourier-dominant orientation does not improve macro-F1 and
fails both registered gates. The reversed control is strongest. Therefore the
equation is a valid normalization scheme, but the historical role assignment
is not supported on this task.

## The more important discovery

The large holdout fixes the earlier one-row transient problem: it contains 49
transient cases and at least 30 examples of every class seen in training.
However, it also contains 19 `constant-count motion` rows, while training
contains none. All four classifiers necessarily obtain zero recall on this
unseen class.

So the next gap is now sharper:

```text
P = A + B cannot reconstruct a behavior class absent from both A and B's
training support.
```

The next experiment must distinguish a closed-set classifier from an open-set
detector. It should freeze class discovery on one seed bank, train only after
all discovered classes have minimum support, and reserve a later untouched
bank for evaluation.

## Claim ceiling

No physical resonance, radiance, biological mechanism, Life/E8 identity,
quantum link, universal ratio law or external utility is established.
