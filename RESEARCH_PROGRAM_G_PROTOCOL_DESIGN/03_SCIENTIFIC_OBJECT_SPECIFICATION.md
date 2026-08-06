# Scientific Object Specification

## Object boundary

The scientific object is a finite labelled dataset and four linear observation maps. It is not the historical model, visualization, interface, mask, or software implementation.

## Object tuple

```text
O = (S, J, X, Θ, H, τ_sci)
```

| Component | Frozen meaning |
|---|---|
| `S` | source identities `{A,B,C,D}` |
| `J` | sample indices `{0,…,120}` |
| `X` | 484 labelled source samples in `R³` |
| `Θ` | view labels `{0,90,180,270}` degrees |
| `H` | four fixed observation matrices |
| `τ_sci` | scientific equivalence tolerance `1×10^-9` displayed-coordinate units |

## Required cardinalities

| Object | Count |
|---|---:|
| sources | 4 |
| samples per source | 121 |
| source rows | 484 |
| views | 4 |
| unordered source pairs | 6 |
| pair-view comparisons | 24 |
| view partitions | 4 |
| terminal result classes | 4 |

## Pair order

The machine-readable output order is fixed:

```text
A:B
A:C
A:D
B:C
B:D
C:D
```

## Observation domain and codomain

Each `H_θ:R³→R²` acts independently on each input row. No temporal interpolation, curve fitting, smoothing, registration, normalization, centering, scaling, or missing-value replacement is permitted.

## Scientific invariants

- source label and sample index survive every map;
- row count remains 484;
- each displayed record contains 121 samples;
- every source pair is evaluated exactly once per view;
- every source belongs to exactly one class in each view partition;
- equivalent-pair decisions must be reflexive, symmetric, and transitive after tolerance application;
- the final result is determined only from validated partitions.

## Excluded objects

- continuous source functions;
- unlisted samples or view angles;
- depth coordinate;
- post-projection mask;
- source reconstruction;
- probability distribution or mutual information;
- visual rendering;
- physical or domain interpretation;
- existing implementation output used as hidden ground truth.

## Required freeze objects

Before execution, freeze:

1. this protocol version;
2. all Program G documents;
3. authority record;
4. canonical input CSV;
5. input data dictionary;
6. scientific-object manifest;
7. observation matrices;
8. equality and tolerance rules;
9. output schemas;
10. validation checklist;
11. result-class decision table;
12. independent replay package manifest;
13. permitted software-independent assumptions;
14. STOP conditions;
15. SHA-256 hashes for every frozen file.

No item may be substituted after execution begins.
