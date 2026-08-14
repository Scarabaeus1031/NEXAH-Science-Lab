# Chain and Path Composition

The three legacy summaries allow a reader to list where assumptions and reductions enter, but their endpoints do not yet guarantee composability:

- Case A outputs three candidate lists.
- The partition callable consumes maxima plus `X,Y,Z`, not the complete Case-A target alone.
- Case B's compute consumes only the raster; plotting separately consumes maxima.

Thus extra side inputs and operator splitting must be explicit. `component_edges` is only an unordered string list; it cannot prove target/source compatibility or retain component artifact bindings. Automatic loss or uncertainty composition is correctly disclaimed, but chain provenance is only partial.

No verified artifact set supplies two clean alternative paths with the same source, target, and fully resolved provenance suitable for comparison. `ALTERNATIVE_PATH_TEST = NOT_AVAILABLE`. The schema could store alternate paths, but superiority would still require an independent task/equivalence criterion.

