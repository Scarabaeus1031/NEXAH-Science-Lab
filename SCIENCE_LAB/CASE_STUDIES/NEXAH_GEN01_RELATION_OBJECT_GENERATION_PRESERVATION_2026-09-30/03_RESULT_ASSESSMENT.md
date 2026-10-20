# NEXAH-GEN01 — result assessment

Date: `2026-09-30`

Final status: `SUPPORTED_AS_BOUNDED_TYPED_GENERATION_CROSSWALK`

Scientific-result hash:

```text
b14595f8b7c798538900de0bdb6b49b9bd715a530a205984c9f01d448f0d3ae6
```

## Governance path

1. the original preregistration was locked;
2. an independent pre-execution review found five blocking defects;
3. no experiment had yet been run;
4. an append-only repair preregistration was written and separately locked;
5. a second independent review returned `EXECUTION_READY`;
6. `10/10` adversarial and integrity unit tests passed;
7. primary and replay were executed separately;
8. scientific JSON, report and result-hash files were byte-identical.

Protocol hashes:

```text
original  c1e35ff3ad21d503354f55f2699be316da120fccb4d5232e86061075aa444011
repair    5b750f35ca7fc2965d6409cf2c920a4d6d5093842ef83e9bb12fd9a6924e1448
```

## Gate result

| Gate | Result | Measured value |
|---|---|---|
| `G01_RECORD_COUNT` | PASS | 900 G0 objects; 400 G1 relations; 300 G2 meta-relations |
| `G02_T5_VALIDITY` | PASS | complete schema, identity, reference and chain audit |
| `G03_T7_RETURN` | PASS | G1 `1200/1200`; G2 `900/900` exact returns |
| `G04_T6_META` | PASS | `300/300` stored meta-relations independently recomputed |
| `G05_CORRUPTION` | PASS | `900/900` stored-meta corruptions rejected |
| `G06_ENDPOINT_LOSS` | PASS | `400/400` endpoints had three valid typed histories under one projection |
| `G07_SEED2_FIXTURE` | PASS | all registered prime-address and arithmetic equalities exact |
| `G08_LEVEL_CEILING` | PASS | stored levels exactly 0, 1, 2; Level 3 and recursive Level-2 fixtures rejected by tests |
| `G09_REPLAY` | PASS | all three primary/replay artifact pairs byte-identical |

## What was established

For the frozen sequential lift

```text
x_(j+1)=x_j(x_j+1), seeds 1..100, four lifts
```

the experiment implements a complete bounded path:

```text
mathcal G_0 typed objects
  -> T5
mathcal G_1 typed relation objects
  -> T6
mathcal G_2 stored relations between adjacent relation objects
  -> T7
exact representation return in bases 2, 10 and 16.
```

Complete records preserve the registered operand, relation, order, result,
parent and generation information. Stored G2 records can be independently
recomputed from their referenced G1 records. Registered corruptions are
detected.

The endpoint projection

```text
pi(history)=result_value
```

is non-injective in the frozen expanded history space: forward multiplication,
reversed multiplication and an additive alternative are distinct valid typed
histories with one endpoint. This is a formal constructed non-identifiability
result, not an observed natural frequency.

## Seed-2 fixture

```text
2 -> 6 -> 42 -> 1806 -> 3263442

W_2=(11,12,13)=(P_5,12,P_6)
W_3=(17,18,19)=(P_7,18,P_8)

12=2*6=2^2*3
18=3*6=2*3^2
17=2^3+3^2
19=3^3-2^3
72=6*12=4*18=2^3*3^2
```

These are deterministic fixture equalities. They did not contribute a p-value,
prime enrichment claim or new number-theory result.

## Scientific boundary

GEN01 validates one bounded sequential instantiation of T5/T6/T7. It does not
validate every `D,E,F,G` relation type or the full Candidate Transformation
Family. It does not establish an unlimited recursive hierarchy, prediction,
compression, a physical mechanism or universal significance of the number
chain.

The notation `mathcal G_0/mathcal G_1/mathcal G_2` is supported here as a
case-local crosswalk. Global canonical adoption remains a separate owner and
architecture decision.

## Persisted G09 evidence

```text
scientific_result.json  9cc4a3419288d65118fdcfa9cc470594ecb7210f15fb2405a8a3333d910f4ee4
REPORT.md                ae69d28afb950b6cd4d423fdb65155eaf7aac9c353d5df7bc5f18fbaf7ddbf32
result_hash.txt          c880f4b83f6b0b974a3bce2561e494401d58fc82287e32f3393339e9e225cae2
```

