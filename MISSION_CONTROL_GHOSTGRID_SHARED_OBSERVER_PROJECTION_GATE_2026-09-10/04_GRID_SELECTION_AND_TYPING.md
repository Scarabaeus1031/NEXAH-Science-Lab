# Grid selection and typing

G11 may serve as a coarse 11-class residue overview or an 11-cell axis, but an 11-vertex interpretation would instead define 10 intervals. The type must be explicit.

G111 is the exact refinement layer only when it means 111 sample points defining 110 intervals. Boundaries 0,10,...,110 give 11 coarse cells with 10 fine intervals each. Treating 111 as cells yields a noninteger 111/11 refinement.

G1000 is the demonstrated 1000x1000 sampled-cell/pixel array. It is suitable for high-resolution views, raster comparison, and entropy controls. It is not silently a vertex grid.

The three are not one exact nested hierarchy. Register cardinality, mathematical state count, sampled cell count, vertex count, interval count, and rendered pixel count remain distinct. A demonstrator may choose the smallest view that represents its declared state and comparison metric; display resolution does not change kernel cardinality.
