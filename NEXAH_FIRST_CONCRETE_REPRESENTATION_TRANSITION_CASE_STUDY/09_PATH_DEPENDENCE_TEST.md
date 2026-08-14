# Path-Dependence Test

## Compared paths

```text
Baseline path: R1 → R2 → R4 → R6 → R8
Delay path:    R1 → R3 → R5 → R7 → R9
```

Both begin from the same current observations, latent labels and indices. Both use the same normalization formula, deterministic k-medoids decoder, supplied `k=4`, alignment rule, transition-count function, and certificate definitions. The only intended feature-path difference is baseline `x_t` versus delay `[x_t, x_(t-1)]`.

## Material comparison

| Quantity | Baseline path | Delay path |
|---|---:|---:|
| current observation recoverable from feature representation | yes | yes, first two columns |
| mean aligned-state accuracy | 1.0000 | 0.7896 |
| dominant collision pairs | 0 | 20 |
| mean edge recall | 1.0000 | 0.6081 |
| mean edge precision | 1.0000 | 0.7321 |
| mean probability MAE | 0.0000 | 0.1356 |
| C1 support exact equality to baseline | reference | 0/20 |
| C2–C6 exact equality to baseline | reference | 0/20 at every level |
| C0 component-summary equality | reference | 19/20 |

## Interpretation

The final decoded transition representation depends materially on the path. Crucially, this is not because T03 discards the current observation: T03 is exactly invertible by projection. It is because appending predecessor coordinates changes the Euclidean geometry consumed by normalization and k-medoids. The downstream many-to-one decoder then produces state collisions and altered transitions that oracle label alignment cannot undo.

Coarse C0 often remains equal because it discards the distinctions that changed. That equality is not evidence that richer transition structure survived.

This localization is bounded to the frozen synthetic fixtures, decoder, state-count oracle, alignment, and one-step delay convention. It is not a theorem about delay embeddings.

`PATH_DEPENDENCE_TEST = PASS`
