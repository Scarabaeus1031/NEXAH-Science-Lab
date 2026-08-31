# Positive Controls

## 1. Same graph / different embedding

The GARC-01 `K_(1,3)` pair preserves graph structure while changing a corresponding angle from `90°` to `45°`. Passed.

## 2. Rotation

An orthogonal rotation preserves inner products, norms and unsigned angles. Passed.

## 3. Uniform positive scaling

Multiplying both direction vectors by one positive scalar cancels in the normalized dot product. Passed.

## 4. Affine shear

The GARC-01 shear sends `(1,0)` and `(0,1)` to `(1,0)` and `(1,1)`, changing `90°` to `45°`. Passed.

## 5. Parameterized embedding path

The family in file `10` fixes the degree sequence while varying `theta=tau`. Passed.

## Neutral relabel

Replacing all type names and IDs by neutral symbols leaves dependencies and results unchanged.

`POSITIVE_CONTROLS=5_OF_5_PASSED`

`NEUTRAL_RELABEL_SURVIVES=YES`
