# A4 Adversarial Mutation Report

The standard-library suite targets every mandated mutation: N3 direction/wrap; N4 priority/distance; RNG serialization/encoding/hash/byte order/seed width/generator/replicate/consumption; row/action/donor order; N1 inverse mapping; equality/+π/repeated cuts; support/carrier outcome/invalid slot; 199/201 repetitions; `k<=5`; N5 count/order/support/aggregation; signed/float/equal-seed dominance; omitted P4/P5/gate; classification precedence/overlap/missing label; Lorenz ceiling removal.

Validation is two-layered: explicit structural assertions reject central semantic drift, and the sealed canonical-object digest rejects any unlisted change. External authority paths are independently resolved and hashed. Tests import no Rössler pipeline and have no registered-data capability.

## Result

`python3 -m unittest discover -s contract_validation -p 'test_a4_*.py' -v` executed 12 tests. All canonical, boundary, mutation, and exhaustive classification tests passed. Every named material mutation was rejected. The separate package validator passed and resolved all nine external authority hashes.

**ADVERSARIAL MUTATION VALIDATION: PASS.**
