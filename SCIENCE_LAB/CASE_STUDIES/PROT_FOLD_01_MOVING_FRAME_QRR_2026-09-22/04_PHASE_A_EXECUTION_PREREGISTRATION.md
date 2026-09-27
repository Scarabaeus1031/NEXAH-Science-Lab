# Phase A execution preregistration

Freeze time: `2026-09-22T00:56:22Z`  
Status: `FROZEN_BEFORE_NUMERICAL_EXECUTION`

## Question

Can a fixed C-alpha carrier from the bound 1XQQ native-state conformer
ensemble be translated into centered and proper-Kabsch body frames without
changing rigid-motion invariants, while the retained centroid and rotation
reconstruct the source-file coordinates?

This is a representation-fidelity experiment. Model index is not time, and
the experiment does not observe a folding trajectory.

## Frozen carrier

- source: `SOURCE_DATA/1XQQ.pdb`, SHA-256
  `88182fc83c2c5081f993ccdad6f4b628c1b52d39b3aea601bf568a0b6f4d45c1`;
- chain: `A`;
- atom: `CA`;
- residue addresses: integer PDB sequence identifiers `1..76` present in every
  included model;
- expected model addresses: `1..128`;
- reference: model `1`, selected before comparative outcomes;
- alternate-location policy: blank or `A`, with duplicate selected addresses
  rejected;
- missing-address policy: fail closed; no imputation.

## Frozen transformations

For model `m` with row-vector coordinates `X_m`:

```text
c_m = mean(X_m)
C_m = X_m - c_m
R_m = proper Kabsch rotation from C_m to centered model 1
B_m = C_m R_m
X_hat_m = B_m R_m^T + c_m
```

The SVD determinant correction enforces `det(R_m)=+1`. Reflection is never an
admissible alignment.

## Frozen intrinsic records

- complete C-alpha pair-distance matrix;
- contact matrix with threshold `8.0 Å` and sequence separation at least `3`;
- proper-superposition RMSD to model 1;
- chirality scalar from frozen addresses `(1,19,38,76)`:
  `(x19-x1) dot ((x38-x1) cross (x76-x1))`;
- per-residue body-frame displacement from model 1;
- ensemble contact occupancy;
- pairwise body-frame RMSD between all unordered conformer pairs.

## Frozen controls

1. translation: add `(10,-7,3.5) Å` to model 1;
2. proper rotation: axis `(1,2,3)` normalized, angle `0.7 rad`;
3. reflection: multiply x coordinate by `-1`;
4. identity corruption: reverse the mapping of the 76 selected coordinates
   while retaining the original residue addresses.

## Primary gates

- exactly 128 model records and exactly 76 common C-alpha addresses;
- source SHA-256 exact match;
- maximum pair-distance change under centering/body framing `<=1e-10 Å`;
- maximum source-frame reconstruction coordinate error `<=1e-10 Å`;
- every fitted rotation has determinant within `1e-12` of `+1`;
- source/body contact matrices agree exactly for every model;
- translation and proper-rotation controls reconstruct with maximum error
  `<=1e-10 Å` and align to reference with RMSD `<=1e-10 Å`;
- reflection changes the frozen chirality sign, receives only a proper
  rotation, and cannot align with RMSD below `1e-3 Å`;
- reversed identity mapping has aligned RMSD above `0.1 Å` and contact
  agreement below `0.99`.

Any failed primary gate makes the run `FAIL`. Ensemble variability summaries
are descriptive and cannot rescue a failed representation-fidelity gate.

## Claim ceiling

Permitted: rigid-frame invariance, source reconstruction, descriptive
native-state conformer variability and contact occupancy for the bound carrier.

Not permitted: temporal transition, folding kinetics, causal mechanism,
protein prediction, AXIS08 natural-pair result, E8/Hopf/Mod-7/11 identity or
new NEXAH capability.
