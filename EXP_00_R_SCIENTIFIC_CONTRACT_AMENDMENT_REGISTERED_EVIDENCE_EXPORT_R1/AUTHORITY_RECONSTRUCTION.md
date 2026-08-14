# Authority Reconstruction

## Seed authority

`A3_CANONICAL_RNG_AND_ORDERING_CONTRACT.md` fixes ascending integer seeds; canonical row key `(split, seed, index)`; N1/N2 `SEED` as unsigned integer; N3 `ROW` with integer seed; and NumPy PCG64 namespace payloads. `A4_MACHINE_READABLE_RULES.yaml` repeats the integer row/RNG encodings and includes known answers using seeds 5000 and 6000. Therefore pair strings cannot become scientific RNG identities.

## Registered runtime authority

- V1 freeze manifest: bundled Codex Primary Runtime, Python 3.12.13, NumPy 2.3.5, macOS 26.5.2 arm64.
- A3: conforming registered implementation is restricted to that environment; other numerical environments fail preflight.
- A4: exact numeric-environment tuple, binary64, NumPy-2.3.5 PCG64 known answers, phase, quantile and bootstrap semantics.
- A5XEF: NumPy 2.3.5 RNG and linear bootstrap quantile remain frozen.

The currently observed bundled runtime matches that exact tuple and is artifact-bound in `REGISTERED_RUNTIME_AUTHORITY.json`.

## Historical reference authority

V3R5 recovered and sealed Python 3.12.7 / NumPy 1.26.4 / OpenBLAS 0.3.21 to reproduce historical synthetic reference hashes. That later reference-runtime role is preserved. It does not supersede the explicit registered-generation environment.

No scientific authority or outcome was created in this reconstruction.

