# Case A Reconstruction

## Independent record

The input is same-shaped in-memory arrays `X,Y,Z`. One callable recomputes first and second finite differences, thresholds interior grid samples at gradient magnitude `<0.02`, classifies by Hessian determinant and `Zxx` sign, and returns maxima/minima/saddle coordinate lists. It is appropriately exposed as a composite boundary.

The only exact preservation is coordinate copying from selected `X[i,j],Y[i,j]` positions. The output omits field values, derivatives, confidence, and nonselected cells. Discretization, implicit sample spacing, thresholding, and boundary exclusion remain unquantified. The implementation is located; historical arrays/results and RNG state are unavailable; continuous critical-set completeness is rejected.

## Comparison

V2 states substantially the same source/target contracts, components, criteria, provenance limits, and scientific boundary. `MANY_TO_ONE` is defensible for the declared full-array domain, although its criterion could be strengthened by an explicit collision construction rather than omission alone.

`CASE_A_AGREEMENT = SUBSTANTIVE_AGREEMENT`

