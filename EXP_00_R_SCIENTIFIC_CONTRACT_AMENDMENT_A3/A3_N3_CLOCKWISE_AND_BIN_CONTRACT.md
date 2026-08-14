# A3 N3 Clockwise and Exact-Bin Contract

## Phase convention

Inputs `x,y` are finite binary64. Compute `theta0 = numpy.arctan2(y,x)` under NumPy 2.3.5. Use binary64 `PI = 0x1.921fb54442d18p+1`. If `theta0` is exactly `+PI`, set `theta=-PI`; otherwise `theta=theta0`. Thus phase is uniquely normalized to `[-PI,PI)` and both signed-zero forms at the negative x-axis map to bin 0 after normalization.

The nine boundaries are the explicit binary64 hex values in the machine contract, from `-PI` through `+PI` in steps of `PI/4`. Bin `b` is `[edge[b],edge[b+1])`. Equivalently, use right insertion among the seven internal boundaries. Equality with an internal boundary enters the higher-index bin. Indices `0..7` increase counterclockwise.

## Frozen clockwise map

Clockwise means decreasing angle and therefore decreasing bin index. For an empty phase bin `b` inside target-distance quintile `q`, search exactly:

`(b-1) mod 8, (b-2) mod 8, ..., (b-7) mod 8`.

Map to the first bin in that sequence containing at least one row in the complete original training decision-state table assigned to `q`. A nonempty bin maps to itself. Successive empty bins are skipped, wraparound is mandatory, and no counterclockwise fallback exists. If all eight bins in a quintile are empty, its map entries are `UNMAPPED`; any recipient assigned there makes the null construction invalid before repetitions.

## Empirical quantile bins

For N3 target quintiles and N4 target quintiles/support deciles:

1. source population is the complete original training decision-state table before OOF splitting;
2. values must be finite binary64 and are presented in canonical training-row order;
3. calculate cutpoints with NumPy 2.3.5 `quantile(..., method="linear")` at the frozen probabilities;
4. store each cutpoint by exact binary64 hex string;
5. assign with right insertion: bin `0` is `[-inf,c0)`, internal bin `j` is `[c[j-1],c[j])`, final bin is `[c[-1],+inf)`;
6. equality enters the higher bin; repeated cutpoints create deterministic empty intermediate bins because insertion is to the right of all equal cutpoints;
7. cutpoints remain in nondecreasing order; nonfinite input/cutpoint is invalid.

N4 merging then applies A2's accepted higher-support-decile-first, lower-only-if-no-higher algorithm. Canonical group labels list their original support deciles ascending.

## Direction fixtures

- If bins 7 and 2 are occupied and bin 0 is empty, bin 0 maps clockwise to 7, never 2.
- If only bin 5 is occupied, empty bin 1 searches `0,7,6,5` and maps to 5.
- Empty bin 7 with occupied bins 6 and 0 maps to 6.

These fixtures fail under the rejected A2 counterclockwise rule.
