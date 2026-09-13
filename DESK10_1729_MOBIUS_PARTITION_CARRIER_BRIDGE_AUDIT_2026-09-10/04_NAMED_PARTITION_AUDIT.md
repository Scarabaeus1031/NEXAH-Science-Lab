# Named Partition Audit

The enumerator uses internal IDs A0–A7 and B0–B7 in the required cut order. The prompt's named A1/A2/B1/B2 labels map to internal rows A2/A5/B2/B5 respectively.

## A1: `1729 → 17 | 29`

Both 17 and 29 are prime and squarefree, with μ=-1 each. This is the only one of all 16 partitions whose every segment is prime. Under the prospectively declared property `all_segments_prime`, it is unique: `EXHAUSTIVE_PARTITION_RESULT`.

The cut itself remains `DECIMAL_BASE_DEPENDENT`.

## A2: `1729 → 1 | 72 | 9`

- 1 is a UNIT, neither prime nor composite; μ(1)=+1.
- `72=2^3×3^2`, composite, μ=0, and `sqrt(72)=6 sqrt(2)`.
- `9=3^2`, a nontrivial perfect square/power, μ=0.

This partition has two segments with nontrivial square extraction. Its highlighted profile is not unique among the enumerated properties: `SELECTED_PARTITION_ONLY`, `PROPERTY_NOT_UNIQUE`.

## B1: `9271 → 92 | 71`

- `92=2^2×23`, composite, μ=0, and `sqrt(92)=2 sqrt(23)`.
- 71 is prime, squarefree, and μ=-1.

Exactly two partitions are a two-segment prime-plus-composite pair and alternating composite/prime sequence: `9|271` and `92|71`. Therefore B1 is `PROPERTY_NOT_UNIQUE`.

The radical reduction is exact: `ROOT_CARRIER_CONFIRMED`.

## B2: `9271 → 9 | 27 | 1`

`9|27|1 = 3^2|3^3|1^3`. The first two are nontrivial perfect powers; 1 is a trivial unit power and is neither prime nor composite. “All non-unit segments are perfect powers” is shared with `1|729`, so the property is not unique.

`j^3` is not used: for quaternion unit j, `j^3=-j`, not integer `1^3`.

## Cube identities

- `1729=1^3+12^3=9^3+10^3`.
- For 9271, the exhaustive positive search `1≤a≤b≤floor(cuberoot(9271))=21` found no representation `a^3+b^3=9271`.

The latter is a complete search for positive integer pairs, not a statement about other domains.
