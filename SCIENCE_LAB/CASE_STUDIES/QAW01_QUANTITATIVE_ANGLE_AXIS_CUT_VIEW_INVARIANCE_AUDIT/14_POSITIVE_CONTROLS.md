# Positive Controls

| # | Standard control | Result |
|---:|---|---|
| 1 | Euclidean in-plane rotation preserves angle | `PASSED` |
| 2 | Reflection preserves undirected angle magnitude | `PASSED` |
| 3 | Uniform scaling preserves angle | `PASSED` |
| 4 | Perspective/general affine projection need not preserve arbitrary angle | `PASSED` |
| 5 | common-origin equal-radius rays plus chord yield isosceles/chord relation | `PASSED` |

Control 4 can be demonstrated algebraically by nonuniformly scaling one coordinate: slopes and their included angle generally change. Control 5 was additionally checked numerically for six declared angles without using those angles as historical candidates.

`POSITIVE_CONTROLS=5_OF_5_PASSED`

No synthetic visual was required.

