# Case A — Final Blind Reconstruction

## Evidence-first reconstruction

`StabilityCriticalPoints.compute` consumes same-shaped in-memory `X`, `Y`, and `Z` arrays. It recomputes finite differences with implicit unit spacing, excludes the outer grid cells, selects interior samples with gradient magnitude below `0.02`, and classifies them from the Hessian determinant and `Zxx` sign. It returns three lists of copied coordinate pairs.

The output preserves the selected grid coordinates and class grouping under the coded rule. It omits the scalar field, derivatives, confidence, nonselected cells, and any continuous critical-set guarantee. Resolution, spacing, threshold, stencil, and boundary effects are unquantified. The implementation exists, but historical arrays and outputs are unavailable.

## Comparison with V3

V3 identifies the same source, composite callable boundary, output contract, preservation criterion, losses, uncertainty, many-to-one character, provenance limitation, and rejection of a complete continuous critical-set interpretation. The coordinate-copy claim is scoped specifically to the selection/classification component.

Minor terminology choices do not change the scientific account.

`CASE_A_AGREEMENT = SUBSTANTIVE_AGREEMENT`
