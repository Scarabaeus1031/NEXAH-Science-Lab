# 02 — Object / Representation Schema

The audit uses documentary roles, not ontology types:

```text
OBJECT X
REPRESENTATION r(X)
PARAMETERIZATION p: D -> X
ORIGIN o
CUT_OR_SEAM c
PARTITION P
LABELING l
FRAME f
TESTED_PROPERTY q
```

## Formal distinctions

| Candidate identity | Result | Reason |
|---|---|---|
| `OBJECT = REPRESENTATION` | `NO` | One object can admit many coordinate charts, parameterizations and drawings. |
| `OBJECT = PARAMETERIZATION` | `NO` | A parameterization is a map into the object and can change while the image remains fixed. |
| `ORIGIN = OBJECT PROPERTY` | `DOMAIN_DEPENDENT` | An abstract line or circle has no selected origin; a based/pointed object includes one as added structure. |
| `CUT = OBJECT PROPERTY` | `DOMAIN_DEPENDENT` | Removing a point changes the space; choosing a seam changes a representation; a pre-cut object could include a cut intrinsically. |
| `LABEL = STRUCTURAL PROPERTY` | `NO` | Arbitrary names and indices change under relabeling. |
| `ORDINAL_POSITION = INTRINSIC_IDENTITY` | `NO` | Ordinal position depends on origin, orientation and ordering convention. |

## Transformation discipline

A coordinate change can be passive: the same point receives another coordinate. An active transformation maps object points to object points. The formulas can look similar, so GLF-01 records which interpretation is intended rather than inferring it from notation.

