# REE-G9-D1-R1 Review

## Registered-generation authority

R1 binds registered generation/export to:

- Python `3.12.13`
- NumPy `2.3.5`
- macOS `arm64`
- runtime ID `CODEX_PRIMARY_PY31213_NUMPY235_MACOS2652_ARM64`

The exact R1 artifact binding was checked against the present bound artifacts:

| Artifact | Frozen SHA-256 / tree value | Result |
|---|---|---|
| Python executable | `eb9d74b9c7cfdfb2c9b91614edb2c3607360ba46c5aa7fc4557b3a4a23e97cff` | MATCH |
| NumPy `__init__.py` | `93924ac4b793328947dfd9eb9355e54eccdfd26a92c8dd52188aed2e52c7eb38` | MATCH |
| NumPy distribution tree, 1,310 members | `e7b6bdc49c04f759be1bd16020b8b987d5b9f44e9f14ace04a4648287c52b084` | MATCH |

The authority is supported by the upstream frozen registered-generation lineage and is not an R1-selected scientific runtime.

## Runtime-role separation

The historical Python `3.12.7` / NumPy `1.26.4` / OpenBLAS `0.3.21` runtime remains restricted to reference reproduction. R1 explicitly excludes it from registered generation/export. The registered-generation and historical-reference roles are not conflated.

## Decision

`REE-G9-D1-R1`: **PASS**  
Registered generation runtime authority: **PASS**  
Historical reference runtime separation: **PASS**

IR-A2 is closed. No new scientific runtime choice was introduced.
