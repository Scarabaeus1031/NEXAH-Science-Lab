# Landing 02D — Closed-Trace Consumer Contract Freeze

Status: `CONSUMER CONTRACTS FROZEN — OWNER DECISIONS UNCHANGED`

Baseline: `294a22199f49c4ea1ae2fb088db363b536ccea60`

Scope: downstream consumer contracts for P05/P06 closed traces only.

```text
GATE_OUTCOME: BOTH_REQUIRED_FOR_DISTINCT_CONSUMERS
P05_INTRINSIC_START_POINT: BLOCKED_BY_ROTATIONAL_SYMMETRY
P05_UNIQUE_SEQUENCE_WITHOUT_EXTERNAL_STRUCTURE: NOT_IDENTIFIABLE
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```

## 1. Identity classes

The contracts distinguish three identities:

1. **file identity** — exact bytes and path within one frozen derivation;
2. **geometric equivalence** — equality after only the transformations declared
   irrelevant by a consumer;
3. **external correspondence** — source index, `tau`, marker, branch or
   source-to-curve information supplied outside the unmarked geometry.

File identity does not establish geometric equivalence. Geometric equivalence
does not select a file representation. External correspondence does not become
an intrinsic property of the curve.

## 2. Frozen consumer-contract matrix

`CYCLIC` means cyclic sampling origin is quotiented. `REVERSAL` means traversal
reversal is quotiented. `BOTH` means both are quotiented. `NEITHER` means both
remain observable to that consumer.

| ID | Consumer | Byte identity | Representative-independent equivalence | Quotient | Sequence-order contract | External structure |
|---|---|---|---|---|---|---|
| CC-01 | Stored closed-trace artifact | `REQUIRED` for the same frozen derivation | `NOT PROVIDED BY BYTE IDENTITY` | `NEITHER` for file comparison | exact serialized row order preserved | only fields allowed by the trace schema |
| CC-02 | Hash manifest and audit | `REQUIRED` | `NOT REQUIRED` | `NEITHER` | exact bytes and relative path preserved | UUID, source hash, software hash and derivation event retained in provenance |
| CC-03 | Deterministic replay | `REQUIRED` for the same source, index contract, software and environment | `REQUIRED` only as a separate geometry check | `NEITHER` for replay-byte identity; `BOTH` for unmarked closed-geometry equivalence | replay reproduces the frozen operational order | source and derivation information may be used inside the replay boundary |
| CC-04 | Unordered proximity metric | `NOT REQUIRED` | `REQUIRED` | `BOTH` | sequence order ignored | no source index, `tau`, direction or marker required |
| CC-05 | Closed cyclic-order metric | `NOT REQUIRED` | `REQUIRED` | `BOTH` | cyclic adjacency/order preserved; absolute origin and traversal orientation ignored | no external origin or direction retained |
| CC-06 | Closure, connectivity and self-intersection metrics | `NOT REQUIRED` | `REQUIRED` | `BOTH` | topology preserved; serialized row origin is not a result | branch labels absent unless separately declared |
| CC-07 | Time-domain reconstruction | `REQUIRED` for reproducible input/output artifacts | `NOT REQUIRED` for the declared interpolator | `NEITHER` | `tau` order preserved | visible `tau` support and status retained under the reconstruction contract |
| CC-08 | Direction-free review packet | `REQUIRED` for packet custody | `REQUIRED` for its unmarked geometric content | `BOTH` | local packet indexing may serialize coordinates but may not encode source order or traversal direction | opaque packet ID only; protected source/marker information prohibited |
| CC-09 | Marker-, branch- or source-correspondence metric | `REQUIRED` for its recorded artifacts | `CONDITIONAL` and metric-specific | `NEITHER` unless a later contract explicitly declares otherwise | declared source/marker order preserved | explicit frozen mapping required; otherwise `UNKNOWN` or `BLOCKED` |

No row specifies a comparison algorithm.

## 3. Permitted and prohibited information

| Consumer artifact or boundary | Permitted | Prohibited |
|---|---|---|
| `trace_canonical.csv` | `sample_uuid`, `trace_index`, `s_norm`, `x_mm`, `y_mm`, `closure_status` | `tau`, time, direction, speed, raw row index, source order, marker, branch label, semantic filename |
| Storage and hash layer | exact serialized bytes, relative path, file hash | treating hash equality as proof of geometric equivalence |
| Provenance and replay layer | source identity, raw/normalized source hash, derivation software hash, environment identity, derivation events, frozen indexing contract | exposing protected lineage through a direction-free packet |
| Geometry-equivalence consumer | closed-trace coordinates and the consumer's declared quotient contract | undeclared source, time, direction, marker or Owner semantics |
| Direction-free packet | frozen trace coordinates or rendering, opaque packet ID, response schema | time, direction, velocity, source order, template, pairing, derivation order, markers and class-encoding metadata |
| Reconstruction consumer | visible normalized-time samples, `tau`, mask status, frozen estimator identity | templates, pairs, trace packets, future samples and withheld coordinates |
| Marker/correspondence consumer | an explicitly frozen source-to-curve mapping within its authorized analysis boundary | inferred correspondence, expected-answer search or silent transfer into a direction-free packet |

`trace_index` and `s_norm` in the stored trace are operational local indices.
They must not be interpreted as an intrinsic P05 origin, acquisition time or
traversal direction.

## 4. Metric order and invariance contracts

| Metric class | Preserves | Ignores / quotients |
|---|---|---|
| unordered nearest-neighbour proximity | coordinate set | sequence order, cyclic origin and reversal |
| closed cyclic-order comparison | cyclic adjacency and local sequence order | absolute cyclic origin and reversal |
| closure/connectivity | endpoint relation and connectivity | absolute cyclic origin and reversal |
| self-intersection count/connectivity | intersection topology | absolute cyclic origin and reversal |
| reconstruction error | declared `tau` correspondence and visible support | no source/time reindexing is permitted |
| marker or branch metric | the accepted marker, branch and source mapping | nothing beyond an explicitly declared later equivalence contract |

Metrics from different rows are not interchangeable. A quotient applicable to
one metric does not silently apply to another.

## 5. External structure

### P05

P05 has no intrinsic start point. A consumer requiring a unique ordered
serialization must use a frozen external index. That index may support storage
and replay provenance but is prohibited from a direction-free packet when it
encodes source order or direction.

```text
P05_INTRINSIC_START_POINT: BLOCKED_BY_ROTATIONAL_SYMMETRY
P05_UNIQUE_SEQUENCE_WITHOUT_EXTERNAL_STRUCTURE: NOT_IDENTIFIABLE
```

### P06

```text
P06_BRANCH_LABELLED_MAPPING: CONDITIONALLY_REQUIRED
```

An explicit branch-labelled source-to-curve mapping is required only for a
consumer that reports branch identity, a marker correspondence or a mapping to
`u` or `tau`. It is not required for unlabelled geometric equivalence,
closure/connectivity or self-intersection count/connectivity.

Until the mapping is frozen and accepted, branch-specific or temporal marker
quantities remain `UNKNOWN` and their comparisons remain `BLOCKED`. The mapping
is prohibited from the direction-free review packet.

## 6. Operational interpretation of `trace_canonical.csv`

```text
TRACE_CANONICAL_FILENAME: ACCEPTABLE_WITH_OPERATIONAL_QUALIFICATION
```

The filename may remain as the existing operational filename. Within this
protocol, it means:

> the deterministic direction-free trace serialization produced from one
> frozen source and one frozen derivation context.

It does not mean:

- an intrinsically unique geometric representative;
- identical bytes for all cyclic sampling origins;
- an intrinsic P05 start point;
- proof of geometric equality;
- an accepted canonicalization algorithm.

Hash comparison applies to file identity. A separately declared quotient
contract applies to geometric equivalence.

## 7. Remaining Owner decisions

This freeze closes none of the existing decisions.

| Decision | Remaining requirement |
|---|---|
| O-06 | normalization, operational serialization and equivalence contracts require an accepted method and validation basis |
| O-09 | P06 marker, branch labels and source-to-curve mapping remain unaccepted |
| O-10 | final metric inventory and capability rationale remain unaccepted |
| O-11 | direction-test evaluator and decision rule remain absent |
| O-13 | metric tolerances remain unsupported and unselected |
| O-19 | replay environment and identity remain unassigned |
| O-21 | Human acquisition requires a separate later authorization |

## 8. Unresolved requirements

1. Exact decimal precision and numeric serialization needed for cross-environment
   byte replay are not fully frozen.
2. No operational serialization or quotient-comparison algorithm is selected.
3. The final metric inventory and each metric's estimand remain pending O-10.
4. The P06 branch-label schema and source-to-curve mapping remain pending O-09.
5. Independent validation of file replay, quotient behavior and leakage
   boundaries remains absent.
6. The relation between an operational external origin and direction-free
   packet construction requires leakage validation before use.

## 9. Authority and non-effects

```text
GATE_OUTCOME: BOTH_REQUIRED_FOR_DISTINCT_CONSUMERS
CANDIDATE_RULE_SELECTED: NONE
ALGORITHM_SELECTED_OR_IMPLEMENTED: NO
COMPARISON_IMPLEMENTED: NO
TOLERANCE_CREATED_OR_MODIFIED: NO
FIXTURE_SELECTED_OR_CREATED: NO
TRACK_B_MODIFIED: NO
TRACK_C_MODIFIED: NO
MASK_PLANS_MODIFIED: NO
OWNER_DECISIONS_MODIFIED: NO
ACQUISITION_AUTHORITY_MODIFIED: NO
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```
