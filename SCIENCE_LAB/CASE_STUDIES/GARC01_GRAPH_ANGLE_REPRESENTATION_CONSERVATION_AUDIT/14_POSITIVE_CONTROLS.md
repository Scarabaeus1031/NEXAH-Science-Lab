# Positive Controls

## Control A — Same graph, changed angles

The two `K_(1,3)` embeddings preserve adjacency, valence, paths and cycles while changing local angles. Passed.

## Control B — Rigid motion

Translation and rotation preserve lengths and angles; reflection preserves lengths and unsigned angles while reversing chirality. Passed.

## Control C — Uniform scale

Positive uniform scaling preserves angles and graph relations while scaling lengths. Passed.

## Control D — Affine shear

The explicit shear maps a right angle to `45°` while preserving the carried graph, collinearity and parallelism. Passed.

## Control E — Neutral relabel

Replace `o,a,b,c` by `X,Q,M,Z`. All formal relations and conclusions remain unchanged. Passed.

`POSITIVE_CONTROLS=5_OF_5_PASSED`

`NEUTRAL_RELABEL_SURVIVES=YES`
