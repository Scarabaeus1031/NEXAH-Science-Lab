# Certificate Registry

| ID | Exact certificate | Equality / distance | Intended detail |
|---|---|---|---|
| C0 `SOURCE_NUMERIC` | full R0 field | exact canonical bytes plus relative L2 and max-absolute difference | source values |
| C1 `DERIVATIVE_FIELD` | five R1 rasters | exact canonical bytes plus combined relative L2 | local differential values |
| C2 `CRITICAL_STRUCTURE` | ordered `(ID,class,row,col,x,y)` records and count/class multiset | exact after fixed ID mapping | detected critical identity/geometry |
| C3 `PARTITION_RASTER` | full seed-ID raster | exact aligned equality; mismatch fraction | metric partition geometry |
| C4 `BOUNDARY_WEIGHTED` | edge→four-neighbor contact count | exact canonical mapping; normalized L1 | weighted boundary structure |
| C5 `BINARY_ADJACENCY` | canonical edge set under seed IDs | exact equality; symmetric difference/Jaccard | unweighted support |
| C6 `CONNECTIVITY` | sorted component partition | exact equality | coarsest graph connectivity |

Numeric equality uses `atol=1e-12`, `rtol=1e-12`; discrete certificates use exact
canonical equality. A collision is `Ck(X)=Ck(X')` while the counterfactual
registry declares a relevant distinction changed at or above that detail level.
Every collision record retains its pair; counts alone are prohibited.

R and D are descriptive:

```text
R_k = preserved / applicable among relations registered PRESERVE for Ck
D_k = changed / applicable among relations registered CHANGE for Ck
```

No scalar combination, threshold optimization, universal trade-off, confidence
interval or population inference is permitted for three pairs.

