# A0 `D + E + F → G` relation/view engineering result

Date: 2026-10-23  
Status: `PASS_RELATION_VIEW_SEPARATED / FINITE ENGINEERING FIXTURE ONLY / SCIENTIFIC NOT_ADMITTED`

## Result

The executable Q3 fixture passed `108/108` deterministic controls with zero
failures.

| Contract | Result |
|---|---|
| Carrier | `Q₃ = {0,1}³`, all eight `D/E/F` records |
| Relation operator | pairwise XOR, ternary parity and Hamming weight |
| Views | exact, permuted `F-D-E`, lossy weight, look shuffle |
| Exact / permuted / look Return | exact registered `G` recovered |
| Lossy weight without residual | typed `HOLD` |
| Lossy weight with bound residual | exact registered `G` recovered |
| Foreign residual | `FAIL CLOSED` |
| Missing D, E or F | typed `HOLD` |
| Same lossy view, different source/relation | collision detected; identity rejected |
| Outcome | `PASS_RELATION_VIEW_SEPARATED` |

The positive statement is narrow: for this implementation and exhaustive
finite carrier, view-only changes did not change the registered relation, and
lossy views could not Return without their typed residual.

## Reproduction

```bash
cd A0_BOOK
node a0-def-g-relation-view-tests.cjs
```

- [Interactive Lab](A0_BOOK/assets/a0-def-g-relation-view-lab/index.html)
- [Frozen design boundary](112_A0_DEF_G_RELATION_VIEW_NONIDENTITY_TEST_DESIGN_2026-10-23.md)
- [Machine-readable summary](A0_BOOK/results/a0-def-g-relation-view-engineering-result-2026-10-23.json)

## Source lock

| File | SHA-256 |
|---|---|
| `assets/a0-def-g-relation-view-fixture-v1.js` | `c2cc94c18042da0cbdf5dfbcd7f17159e4304e74f0065bc2a4302f6c5b9a3365` |
| `a0-def-g-relation-view-tests.cjs` | `4f961aef94a564e4ffec8e34c0aefff3a8e91fd27249a7b528e58f5c04168e45` |
| `assets/a0-def-g-relation-view-lab/index.html` at this 108-control result | `04dad2b2efc7402dd80ee0f20e5b969a7c7b56581b67f7117a743d3383f81dbb` |

The shared interactive shell was subsequently extended by the independent
24-control glyph/double-cover fixture. Its current HTML hash and separate
boundary are recorded in
[`114_A0_G_GLYPH_TRANSVERSAL_DOUBLE_COVER_ENGINEERING_RESULT_2026-10-23.md`](114_A0_G_GLYPH_TRANSVERSAL_DOUBLE_COVER_ENGINEERING_RESULT_2026-10-23.md); the DEF→G fixture and test hashes above are unchanged.

## Claim and governance boundary

This is software QA under the existing `ART:A0:MATHEMATICAL_JOINTS` identity.
It does not establish a universal ternary algebra, natural `G`, physical field,
GURT/THOTH bridge, causal mechanism or publication claim. The Lab remains in
`STRUCTURE_FREEZE`; `LAB_REGISTER.md`, canonical Source Graph counts and
Mission Control activation state are unchanged.
