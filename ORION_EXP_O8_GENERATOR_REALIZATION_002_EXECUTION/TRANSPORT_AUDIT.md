# Transport audit

- F8 closure: **PASS** (`864/864` outputs valid)
- F9 transport consistency: **PASS**
- Composition-fixture comparisons: `864`

| Exact canonical comparison | Mismatches |
|---|---:|
| fresh vs direct | 0 |
| fresh vs stepwise | 0 |
| direct vs stepwise | 0 |

Raw pre-canonical order still differed in 378 fresh/direct and 378
fresh/stepwise cases; direct/stepwise raw order differed in zero. These raw
differences were diagnostic only, and canonical typed-record content matched.

