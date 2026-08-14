# Case A — Field to Critical Candidates

## Evidence-derived reconstruction

Input is an in-memory triplet of same-shaped coordinate arrays `X,Y` and scalar grid `Z`. `StabilityCriticalPoints.compute(grad_threshold=0.02)` is a composite deterministic callable: NumPy finite differences, second differences, Hessian determinant, interior-cell iteration, thresholding, and sign classification. Output is three ordered coordinate lists labeled maxima, minima, and saddles.

The narrow target is **grid-level heuristic critical candidates**, not a continuous critical set. Unit sample spacing, NumPy boundary stencils, excluded boundary cells, fixed threshold, determinant/sign rules, and array/library behavior matter. Historical `X,Y,Z` instances are not reproducible because the upstream random generator was unseeded.

Objective source-target correspondence: every emitted coordinate is copied from `X[i,j],Y[i,j]` at a selected interior index. The previous “preservation” statement is therefore a coordinate-copy property, not preservation of critical structure. Nonselected field values and derivatives are absent from the target; global many-to-one behavior is strongly implied, but no explicit collision witness for the historical instance is recorded.

## Review classifications

- Operator: `EDGE_TOO_COARSE`; one callable hides scientifically relevant differentiation, thresholding, and classification steps.
- Provenance: `PARTIAL_BUT_SUFFICIENT` for the algorithmic claim; `PARTIAL_AND_CONSEQUENTIAL` for historical output reproduction.
- Preservation: coordinate-copy claim `OBJECTIVE`; any “critical structure survives” claim `UNSUPPORTED`.
- Loss: omitted arrays/values are structurally absent; instance-specific collision `NOT_DETERMINABLE`.
- Uncertainty: discretization/classification `NOT_QUANTIFIED`; upstream realization `UNKNOWN`.
- Existing-record agreement: `INTERPRETIVE_DIFFERENCE`. Core code and limitations agree, but the edge boundary and preservation framing are reviewer-dependent.

