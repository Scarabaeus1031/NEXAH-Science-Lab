# Dependency Graph

## Graph

```text
FQ-01 Representation maps and information loss
├── RQ-01 Reconstruction under incomplete and multiple views
├── RQ-02 Estimation under a moving mask
├── RQ-03 Round-trip loss diagnostic
├── RQ-04 Relation-derived encoding invariance
└── RQ-05 Structure-preserving transport compression and independent alignment hypothesis

FQ-02 Typed transitions and path composability
└── RQ-05 Structure-preserving transport compression

FQ-03 Boundary, unavailable information, and failure
├── RQ-01 Reconstruction under incomplete and multiple views
├── RQ-02 Estimation under a moving mask
└── RQ-06 Distinctness of local dynamical diagnostics

FQ-04 Well-posed relational aggregation
├── RQ-02 Estimation under a moving mask
└── RQ-04 Relation-derived observables and encoding invariance
```

The RQ-05 branch includes hypothesis H-06 on agreement with an independent spectral representation; it is not a separate seventh research program.

## Hypothesis links

```text
RQ-02 → H-03
RQ-03 → H-04
RQ-04 → H-01, H-02
RQ-05 → H-05, H-06
RQ-06 → H-07, H-08
```

RQ-01 is initially an identifiability question. Existing Labs 0.3 and 0.4 already supply counterexamples and limiting cases; no extra universal hypothesis is required.

## Dependency rules

1. No reconstruction claim precedes a declared source-to-record map.
2. No moving-mask comparison precedes a stable unknown/underdetermined policy.
3. No encoding-invariance claim precedes a defined output and equivalence class of encodings.
4. No graph-compression result precedes a typed property to preserve.
5. No diagnostic claim precedes a frozen formula, parameters, null, and baseline.
6. No visual family creates an edge in this graph.
