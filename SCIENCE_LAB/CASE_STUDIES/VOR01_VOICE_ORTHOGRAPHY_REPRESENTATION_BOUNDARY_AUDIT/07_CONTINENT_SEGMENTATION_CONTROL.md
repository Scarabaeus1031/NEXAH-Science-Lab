# 07 — CONTINENT Segmentation Control

## Starting state

Human exploratory input: `CON | TIN | ENT`

`EVIDENTIAL_WEIGHT=ZERO`

## Independent check

Merriam-Webster documents the land-mass noun through Middle French and Latin `continent-/continens`, short for `terra continens`, from Latin `continēre`, “to hold together.” This supplies an attested lexical history; it does not validate the visible three-part segmentation.

| Question | Decision |
|---|---|
| Is `CON|TIN|ENT` the documented morphological/etymological analysis? | No supporting source in the bounded check. |
| Are the three visible pieces documented units for this word? | Not established. |
| Does the segmentation encode a land/water boundary? | Not supported. |
| Does a linguistic source support an ocean-boundary reading? | Not supported. |
| Does `LM` have documented linguistic relevance here? | Not supported. |

```text
CON_TIN_ENT_STATUS=USER_SUPPLIED_STRING_SEGMENTATION_ONLY
LAND_OCEAN_MAPPING=NOT_SUPPORTED
LM_BOUNDARY=NOT_SUPPORTED
```

No rescue search, hidden segmentation, glyph analysis or alternative symbolic derivation was performed.
