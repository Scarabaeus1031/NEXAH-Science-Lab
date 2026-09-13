# Shared Ghostgrid interface specification

This is a minimal architectural contract, not an implementation.

## GridSpec

width, height, cells_or_vertices, coordinate_origin, indexing_policy, boundary_policy.

## StateSpec

state_domain, scalar_or_tuple, exact_or_float, units_if_any. Julia uses float escape results; CRT and reversal use exact states. No units are inferred.

## OperatorSpec

operator_name, input_type, output_type, parameters, invertible, involutive, lossless_on_declared_domain. The mathematical kernel remains an external frozen function; Ghostgrid does not alter it.

## ViewSpec

color_mapping, projection, interpolation, normalization, labels. Exact views must use no interpolation. Raster interpolation must be visibly labeled and cannot feed exact reconstruction unless the contract permits tolerance.

## ReturnSpec

reference_state, reconstructed_state, comparison_metric, tolerance, exact_match_count, mismatch_count.

## Compatibility decision

The contract serves all three kernels without changing them:

- Julia maps grid coordinates to complex samples and displays escape values; return is conjugate-array comparison.
- CRT maps integer addresses to displayed cells and residue tuples; return is exact CRT reconstruction.
- Reversal maps fixed-width words to addressed states and displays operator/composition classes; return is involution or commutation comparison.

State types are not merged. Shared means one interface envelope, not one common mathematical state space. Human authority owns view selection, tolerance, claim ceiling, and acceptance.
