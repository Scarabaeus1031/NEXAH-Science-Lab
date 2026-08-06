# Frozen Scientific Definitions

## Definitions fixed by Protocol 1.0

| Term | Definition |
|---|---|
| source identity | one member of the fixed label set `S={A,B,C,D}`; identity is retained independently of observed coordinates |
| sample index | integer `j∈{0,…,120}` used to match records between sources |
| parameter value | frozen input value `t_j`; informative provenance, not a matching rule |
| source sample | vector `x_sj=(x_sj,y_sj,z_sj)∈R³` for source `s` and index `j` |
| observation map | one fixed `2×3` matrix `H_θ` mapping a source sample to displayed coordinates in `R²` |
| displayed sample | `y_θ,sj=H_θ x_sj` |
| displayed record | ordered collection `(y_θ,s0,…,y_θ,s120)` for one source and view |
| pair discrepancy | maximum absolute displayed-coordinate difference over the 121 matched samples |
| observational equivalence | pair discrepancy less than or equal to the frozen scientific tolerance |
| distinguishable pair | pair discrepancy greater than the frozen scientific tolerance |
| view partition | equivalence classes of `S` induced by observational equivalence under one view |
| source distinction | inequality of source labels; coordinate distance is diagnostic and does not define identity |
| valid protocol | all authority, freeze, input, transformation, validation, and output requirements satisfied |
| independent replay | a conforming implementation created without reuse of the originating implementation code and run from the frozen replay package |

## Fixed observation matrices

```text
H_0   = [[ 1, 0,  0],
         [ 0, 1,  0]]

H_90  = [[ 0, 0,  1],
         [ 0, 1,  0]]

H_180 = [[-1, 0,  0],
         [ 0, 1,  0]]

H_270 = [[ 0, 0, -1],
         [ 0, 1,  0]]
```

These matrices replace runtime trigonometric evaluation. No other view is authorized.

## Frozen scope decisions

- finite sampled records, not continuous curves;
- 121 samples per source;
- sample index, not approximate parameter value, matches records;
- displayed coordinates only determine observational equivalence;
- source label remains persistent after projection;
- masks, depth, and availability classes are excluded;
- no noise or missing-data model;
- no inference beyond the frozen table.

## Provenance-only terms

| Repository term | Protocol disposition |
|---|---|
| Thread Loom Projection Test / Lab 0.4 | provenance identifier only |
| projection collapse | observational equivalence under one declared map |
| source thread | source identity represented by a finite sampled record |
| view | fixed orthographic observation map |
| Full-Trace Gate, representation mask, boundary classes | excluded from Protocol 1.0 |
| NEXAH orientation language | excluded from scientific definitions |

## Definitions that may never change during replay

- `S`, sample-index domain, sample count, and pair ordering;
- all four matrices;
- displayed-coordinate order;
- pair discrepancy formula;
- norm and tolerances;
- equivalence decision operator `≤`;
- partition construction;
- outcome definitions;
- invalidation and STOP rules;
- interpretation boundary.
