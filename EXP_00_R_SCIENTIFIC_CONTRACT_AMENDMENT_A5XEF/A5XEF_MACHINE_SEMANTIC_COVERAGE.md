# A5XEF Machine Semantic Coverage

| Field family | Authority | Raw source | Consumer | Validator invariant | Downstream |
|---|---|---|---|---|---|
| identity/actions/order | V1/A3 | manifest/rows | row expansion | exact types, registry, relational IDs, action/split order | all |
| support/populations | V1/A4/A5 | distances/thresholds | partition | exact thresholds/gates and named populations | validity/models |
| model/observed | V1/A4/A5 | model spec, scores/outcomes | every fit | full spec equality; spec passed and output-bound | P2–P5 |
| N1–N4/RNG | A2–A4 | rows/null descriptors | independent null engines | exact families, 200 IDs, namespace/order/PCG64 rules | P1/P3 |
| Monte Carlo | A1/A4 | derived null statistics | proposition engine | adverse `>=`, `(1+k)/201`, `k<=4` | P1/P3 |
| bootstrap | V1/A4 | joint TEST + registry | independent resamplers | 500 IDs, TEST-seed clusters, seed 20260808, linear CI | P2/classifier |
| N5 | A1/A3/A4 | matrices/query/rank/terminal objects | N5 engines | exact 12, Q transform/inverse, min tau and typed failures | validity |
| P4/diagnostics | A4/A5 | scores/outcomes/joint TEST | model/attribution engines | exact control columns, three derived diagnostics, rational dominance | P4/validity |
| sensitivities | A4/A5 | config + variant rows | variant engines | exact registry/one-leaf hashes/populations/outputs | validity/P5 |
| P1–P5/classifier | A4/A5 | all derived objects | independent proposition engines | exact conjunctions, strict boundaries, invalid-first precedence | label |
| provenance | A5 | all raw sections | pre-derivation gate | exact set/hash/ordered parents | validity |
| Lorenz-v2 ceiling | A4/A5 | P1–P3 + label | classifier | strict label unreachable; partial ceiling | cross-system label |

`validate_machine_object` checks every table family semantically from an in-memory object; file hashes are an additional integrity layer, not the semantic test.
