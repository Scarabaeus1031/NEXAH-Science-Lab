# Final Decision

Primary decision:

`A — SOURCE_BOUND_REPRODUCIBLE_D2_CHAIN`

The existing RRTM V1 artifact set binds `c=-0.75+0.10i`, `f_c(z)=z²+c`, Julia iteration, escape arrays, and a rendered RRTM result. The independent scalar replay reproduced the stored 512×384 little-endian `uint16` escape array byte-exactly by SHA-256.

This decision does not bind the separate intake file `julia_c(1).png` to that generator. Its visible contract differs and its exact generator remains unresolved. It also does not validate physical or higher-dimensional labels.

- `JULIA_STATE_SPACE = R2`
- `F_C_MEANS_FREQUENCY = NO`
- `PRIME_INDEX_7 = 4`
- `PRIME_INDEX_97 = 25`
- `CONJUGATE_MIRROR = CONFIRMED`
- `EXACT_PERIODIC_RETURN = NOT_DEMONSTRATED`
- `LEGACY_JULIA_RENDER_REPRODUCED = PARTIAL`
- `PHYSICAL_INTERPRETATION = NOT_DEMONSTRATED`
- `TESSERACT_INTERPRETATION = NOT_DEMONSTRATED`
- `SOURCE_FILES_MODIFIED = NO`
- `ORION_CORE_CHANGED = NO`
- `CLOSED_WORKSTREAMS_REOPENED = NO`
- `COMMIT_OR_PUSH = NO`

“PARTIAL” means: a source-bound RRTM render chain and its numerical array were reproduced, and an audit-only render for the intake image’s visible c/viewport/horizon was generated; the exact bytes/pixels of `julia_c(1).png` were not reproduced because its generator and hidden render conventions remain unresolved.
