# NEXAH-GEN02 — result assessment

Date: `2026-09-30`

Final status:

```text
SUPPORTED_AS_BOUNDED_HETEROGENEOUS_RELATION_FAMILY_TRANSFER
```

Scientific-result hash:

```text
02317b749d8c9a7abe6b9cdd74310fee99fda4ebd954d7140457c9d3f895ed50
```

Frozen preregistration:

```text
8c734f8ada7c83c1d8d4779fabfc7ce4f0f1a1cc84b0fe4576cdf0e182fb66a1
```

Shared contract hash:

```text
925993c8c84f6ecb5a54267e3c3a03c14bf87a9a635cab7a4e9d970c4a39d99b
```

## Pre-execution integrity

- the preregistration was locked before implementation and execution;
- a pre-run validator audit found and repaired adjacency and alternative-history
  validation weaknesses before any scientific run;
- the locked scientific contract and preregistration hash did not change;
- `12/12` integrity and adversarial unit tests passed after hardening.

No append-only scientific repair was required because no frozen fixture, gate,
threshold, schema or decision rule changed.

## Gate results

| Gate | Result | Measured value |
|---|---|---|
| `G01_RECORD_COUNTS` | PASS | `675` G0; `400` G1; `300` G2 with exact family counts |
| `G02_SHARED_SCHEMA` | PASS | one exact G0, G1 and G2 field set across all four families |
| `G03_SEMANTIC_VALIDITY` | PASS | `400/400` G1 relations plus all G0 references and payloads valid |
| `G04_T7_RETURN` | PASS | G1 `1200/1200`; G2 `900/900` exact base returns |
| `G05_T6_META` | PASS | `300/300` stored adjacent G2 relations independently recomputed |
| `G06_DESTRUCTIVE_CONTROLS` | PASS | G1 `2000/2000`; G2 `900/900` corruptions rejected |
| `G07_HOLDOUT_TRANSFER` | PASS | ternary holdout `100` G1 and `75` G2 records under unchanged shared schemas and generic T7/T6 checks |
| `G08_LOSSY_BASELINES` | PASS | B1 `50/50`; B2 `200/200`; B3 `400/400` registered losses |
| `G09_LEVEL_CEILING` | PASS | stored levels exactly `0,1,2`; adversarial Level-3 and recursive-G2 tests rejected |
| `G10_REPLAY` | PASS | primary and replay JSON, report and result-hash files byte-identical |

## Family panel

| Family | Role | G0 | G1 | G2 |
|---|---|---:|---:|---:|
| `DIRECTED_SUCCESSOR` | development | 125 | 100 | 75 |
| `SYMMETRIC_EQUIVALENCE` | development | 150 | 100 | 75 |
| `INCIDENCE` | development | 150 | 100 | 75 |
| `TERNARY_INTERSECTION` | frozen holdout | 250 | 100 | 75 |

## Persisted replay evidence

```text
scientific_result.json  2e88c71d39da16b65c590b22d8d88af786a9203e902c6343a64141a4a02521b1
REPORT.md                4b4f714ecde10b2c8aa5a3b8dcaf4aafb5bd1ff1a197f00d50ccc51ad7457f58
result_hash.txt          d775d6e72a5c8caf55975ba75e33209b7c7fa04d75163990dba3cbab14b5d1db
```

Each digest is identical for `primary/` and `replay/`.

## What was established

One exact G0/G1/G2 field contract represented four frozen heterogeneous
relation families without adding family-specific fields. Complete G1 and G2
records returned exactly through the common T7 encoder/decoder. Stored
adjacent G2 relations were independently recomputable from their referenced
G1 records. The ternary holdout used the same structural contract and generic
return/meta checks.

The registered lossy projections demonstrated complementary failure modes:

- endpoint-only output collapsed distinct equivalence and incidence records;
- untyped participant bags lost direction or role in directed and incidence
  records;
- a generic provenance shell could not reconstruct relation type, arity,
  orderedness, roles, payload or parent-relation fields.

## Scientific boundary

The result is a bounded structural transfer result, not a universal ontology.
Family semantics were still recomputed by an explicit frozen semantic registry;
only the record contract, T7 return and T6 adjacent-link machinery were shared.
The holdout was preregistered but authored, not externally sampled or
statistically independent.

GEN02 does not establish arbitrary-family transfer, optimality, compression,
prediction, unlimited recursion, a physical mechanism, the `n+1` Binder, a
global G-level notation, Builder capability or production readiness.

## Next evidential question

The strongest remaining step is no longer another authored relation family.
It is an independently sourced real multi-record case in which the same frozen
contract must ingest projections or relations not designed for GEN02, with an
equal-information typed graph/database baseline and no schema repair.
