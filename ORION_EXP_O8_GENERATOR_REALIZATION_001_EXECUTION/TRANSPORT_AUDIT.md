# Transport audit

- F8 closure: **PASS** (`864/864` composition-fixture outputs valid)
- F9 transport consistency: **FAIL**
- Composition-fixture comparisons: `864`
- Recorded F9 mismatches: `378`
- Affected nonidentity compositions: all seven, `54` fixtures each
- Mismatch class: `FRESH_VS_STEPWISE`
- Direct-versus-stepwise content mismatches: `0`

All failed cases have equal typed-record multisets. They differ only because
fresh grid lists are ordered by numeric index tuples while transported grid
lists are ordered lexicographically by serialized JSON bytes. For example,
lexicographic ordering places the string beginning `[10,11]` before `[2,3]`.

Because canonical byte equality was frozen and mandatory, the observed bytes
are unequal and F9 remains FAIL. Because the implementation applies two
incompatible meanings of canonical order, the final protocol-conformance
adjudication is `INVALID_EXPERIMENT`; no algebraic failure is inferred.

