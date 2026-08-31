# 05 — Provenance Graph

## Recorded derivation graph

```text
O (generation 0)
└── S (generation 1)
    ├── I1 (generation 2)
    ├── I2 (generation 2)
    └── I3 (generation 2)

I4  no recorded provenance root
I5  no recorded provenance root
```

All I1–I3 conform to S and are commonly described as “the same model,” meaning
same specification/class, while their unique IDs prove `I1 != I2 != I3`.

I5 has the same observable specification fields as I1. Therefore
`observationally_equivalent(I1,I5)=TRUE`, yet
`provenance_equivalent(I1,I5)=FALSE` because only I1 has the recorded edge
`S→I1`. Observable properties do not infer a missing history.

Likewise, `source_of(I1)=source_of(I2)=O` does not imply `I1=I2`.
