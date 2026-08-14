# A3 Deterministic Contract Fixtures

All fixtures are contract-only and nonregistered.

## Geometry/binning

- `+PI` and `-PI` normalize to `-PI` and enter phase bin 0.
- Every internal phase edge enters its higher-index bin; a value immediately below remains lower.
- Quantile equality enters the higher bin; duplicated cutpoints skip deterministic empty bins.
- Clockwise: empty 0 with occupied 7/2 maps to 7; empty 1 with only 5 occupied maps to 5; empty 7 with occupied 6/0 maps to 6.

## RNG/order

- same namespace bytes produce the same SHA-256 digest prefix and unsigned big-endian seed;
- changing any tuple field/order/type encoding changes the payload and seed;
- canonical row/candidate reordering before a draw is rejected;
- equal nearest-neighbor distances order by canonical training row key;
- each object-local stream consumes exactly one specified draw call;
- invalid inputs consume no draw and cannot be retried.

## N1

For non-self-inverse `p=[1,2,0,4,3]`, original action index 0 relabels to 1. An inverse-map implementation would produce 2 and must fail.

## N5/reporting

- explicit matrix list equals the first twelve row-major lexicographic determinant-`+1` signed permutations;
- any missing all-action training path, mean-instead-of-minimum tau aggregation, support mutation, or transform substitution fails;
- for 200 ascending values, nearest-rank 97.5th percentile is item 195 (zero-based 194); it remains descriptive;
- Monte Carlo `k=4` passes and `k=5` fails.
