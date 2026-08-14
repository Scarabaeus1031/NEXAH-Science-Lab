# A5XR N5 Audit

A5XR reproduces the current A4 matrix list and checks twelve ordered IDs, tier names/stages, a metadata dictionary, nonempty supplied comparisons and `comparison>=.99`.

It does not derive or verify:

- determinant/order independently from matrix values;
- transformed training/query/path coordinates;
- `B'=QB`, standardizer and target metadata transformations;
- action-conditioned path generation;
- T/F refits and support decisions;
- inverse registration of state-valued outputs;
- original versus transformed five-action weak ranks;
- two representations across at least 20 comparison queries;
- Kendall tau-b and undefined-tau convention;
- the minimum over the complete comparison universe.

The canonical fixture contains one supplied comparison per transform, only 12 per tier, and A5XR accepts it. Accepted N5 needs at least both representations across the required query population for every transform.

Changing one SYNTH comparison to `.98` and changing one RUN comparison to `.98` produce the same untyped `ValueError("N5 transform record")`. The required mappings—SYNTH to `IMPLEMENTATION_FAILURE` and RUN to `INVALID_EXPERIMENT`—are not derived. **N5 reconstruction: FAIL.**
