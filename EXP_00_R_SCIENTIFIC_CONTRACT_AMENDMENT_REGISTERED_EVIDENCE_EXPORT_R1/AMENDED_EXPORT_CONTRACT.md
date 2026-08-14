# Amended Export Contract R1

This package has precedence over only these two provisions of the rejected amendment:

1. Replace every scientific or RNG use of `ROSSLER_PAIR_*` with the row's frozen physical unsigned seed. Pair IDs remain optional encoding metadata.
2. Replace `ANACONDA_PY3127_NUMPY1264_OPENBLAS0321_ARM64` for registered generation/export with `CODEX_PRIMARY_PY31213_NUMPY235_MACOS2652_ARM64`, as bound by `REGISTERED_RUNTIME_AUTHORITY.json`.

All future registered rows must therefore expose both:

```text
pair_id             # metadata only
physical_seed_id    # authoritative scientific identity
```

The consumer must reject any row where the exact monotone pair registry does not map to the frozen physical seed, where an RNG/cluster/group key contains a pair ID in place of the physical seed, or where the consumed registered-generation runtime does not equal the bound 3.12.13/2.3.5 artifact.

After these substitutions, the complete export object, transformations, types, array orders, abstention rules, populations and provenance remain those of the original amendment. Producer summaries remain non-authoritative. No registered object may be generated until this R1 repair independently passes review and a later generator implementation authority exists.

