# Landing 02C — Closed-Trace Representation Requirement Gate

Status: `REQUIREMENT REVIEW COMPLETE — OWNER DECISION UNCHANGED`

Baseline: `f995810dd7d3aecc7dd7b38901268f8824ea3514`

Scope: documented downstream requirements for P05/P06 closed-trace
representation only.

```text
GATE_OUTCOME: BOTH_REQUIRED_FOR_DISTINCT_CONSUMERS
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```

## 1. Requirement distinction

The current protocol uses the word `canonical` for
`derived/<sample_uuid>/trace_canonical.csv`, but its downstream requirements
separate into two different contracts:

1. a byte-stable stored serialization for custody, hashing and replay;
2. representative-independent comparison for geometric equality, equivalence
   and metrics.

A byte-stable file does not require a geometrically intrinsic start point. It
may preserve a declared external index or source-derived parameterization. A
quotient comparison does not produce one unique file ordering.

## 2. Downstream-consumer inventory

Legend:

- `REQUIRED`: explicitly required by the current documents;
- `CONDITIONAL`: required only if that consumer uses an ordered sequence;
- `NOT REQUIRED`: the consumer can satisfy its documented purpose without it;
- `UNRESOLVED`: the current documents do not fix the choice.

| Consumer | Byte-stable serialization | Representative-independent comparison | Intrinsic start point | External index / marker | Evidence |
|---|---|---|---|---|---|
| Storage and hashing | `REQUIRED` | `NOT REQUIRED` | `NOT REQUIRED` | `CONDITIONAL` for ordered rows | Data Contract §§1, 3, 6 requires exact CSV rules, derived-file hashes and sorted manifests. |
| Deterministic replay | `REQUIRED` | `CONDITIONAL` for equivalence checks | `NOT REQUIRED` | `REQUIRED` if replay must reproduce ordered `trace_index` rows | Protocol §5 and Track A require deterministic transformations, identity propagation, hashes and replayable artifacts; Owner Gate O-19 remains pending. |
| Equality / equivalence comparison | `NOT REQUIRED` | `REQUIRED` | `NOT REQUIRED` | `NOT REQUIRED` for quotient-level equality | Protocol §8 requires an order-sensitive comparison minimized over forward/reverse traversal in addition to unordered and topology checks. |
| Metric evaluation | `REQUIRED` for recorded outputs | `REQUIRED` for metrics intended to ignore traversal representative | `NOT REQUIRED` | `CONDITIONAL` for order-, parameter- or marker-dependent metrics | Protocol §§7–9 separates unordered, order-sensitive, topology, support and marker quantities; Analysis Specification requires explicit status and support. |
| Reconstruction | `REQUIRED` for reproducible inputs and outputs | `NOT REQUIRED` for the declared time-domain interpolator | `NOT REQUIRED` | `REQUIRED`: reconstruction is indexed by declared `tau`, not an intrinsic closed-curve origin | Protocol §10 and Data Contract reconstruction schema use `tau`; unbounded or absent support becomes `UNKNOWN`. |
| Provenance and audit | `REQUIRED` | `NOT REQUIRED` | `NOT REQUIRED` | `REQUIRED` for traceability to source, derivation and event records | Data Contract §§4–6 requires UUIDs, software hashes, derivation events, file hashes and append-only corrections. |
| Marker / sampling-origin consumers | `CONDITIONAL` | `UNRESOLVED` | `NOT ESTABLISHED` | `REQUIRED` under the current design | Protocol §9 requires a separately frozen source-to-curve mapping for P06; mapping between `u`, curve position and `tau` remains unaccepted. No P05 intrinsic marker is declared. |

## 3. Required invariances

| Consumer class | Required invariance | Not implied |
|---|---|---|
| Stored artifact | identical bytes under replay of the same frozen source, indexing rule, software and environment | identical bytes for every equivalent sampling origin |
| Hash manifest | sensitivity to any byte or path change | geometric equivalence |
| Equality / equivalence | invariance to each explicitly quotiented transformation, including reversal or cyclic origin only when declared | a preferred representative |
| Metrics | invariance matching the metric's declared estimand | universal invariance across unordered, ordered, topological and marker metrics |
| Reconstruction | deterministic result for the same visible `tau` support and frozen estimator | intrinsic curve-origin identification |
| Provenance / audit | stable identity and complete derivation chain | scientific validity or geometric uniqueness |
| Marker mapping | preservation of the declared external mapping | discovery of an intrinsic origin from the trace alone |

## 4. Is uniqueness mathematically necessary?

No documented downstream consumer establishes a mathematical need for one
geometrically unique serialized representative.

- Storage and hashes require one exact recorded byte sequence, not proof that
  all equivalent traces generate that sequence.
- Replay requires frozen inputs and deterministic derivation, not an intrinsic
  origin.
- Equality and relevant metrics require an explicitly defined equivalence
  comparison, not a preferred representative.
- Reconstruction is currently parameterized by `tau` and therefore already
  uses external structure.
- Audit requires identity and lineage, not canonical geometry.

The existing `trace_canonical.csv` name therefore exceeds what is presently
demonstrated if it is read as claiming sampling-origin-independent geometric
uniqueness. It remains a documented output location; this gate does not rename
or modify it.

## 5. P05 identifiability

P05 is an ideal circle. Under the declared geometry, rotations along the curve
leave the unmarked trace unchanged. An intrinsic unique start point is therefore
not identifiable.

If a consumer requires one ordered P05 serialization, it must receive external
structure such as a frozen source index, acquisition start, declared marker or
source-to-curve mapping. That structure must remain provenance and must not be
presented as intrinsic to the circle.

```text
P05_INTRINSIC_START_POINT: BLOCKED_BY_ROTATIONAL_SYMMETRY
P05_UNIQUE_SEQUENCE_WITHOUT_EXTERNAL_STRUCTURE: NOT_IDENTIFIABLE
```

## 6. Gate outcome

`BOTH_REQUIRED_FOR_DISTINCT_CONSUMERS`

- An operationally byte-stable serialization is required for storage, hashing,
  deterministic replay and audit.
- Representative-independent comparison is separately required for geometric
  equivalence and those metrics whose estimand excludes traversal direction or
  sampling origin.
- A geometrically intrinsic unique serialized representative is not established
  as necessary.
- When a unique sequence is operationally required, external indexing or marker
  information is required for symmetric P05.

This outcome does not select a canonicalization or quotient method. It does not
close Owner decision O-06.

## 7. Evidence basis

- `01_ACQUISITION_AND_ANALYSIS_PROTOCOL.md` §§5, 8–10, 13–14;
- `02_DATA_AND_PROVENANCE_CONTRACT.md` §§1–7;
- `05_OWNER_APPROVAL_GATE.md`, decisions O-06, O-09, O-10, O-13 and O-19;
- `06_TRACK_A_PIPELINE_CONFORMANCE.md`;
- `10_ANALYSIS_AND_EVALUABILITY_SPECIFICATION.md`;
- `15_CLOSED_TRACE_CANONICALIZATION_ROBUSTNESS_REVIEW.md`.

## 8. Unresolved questions

1. Must equivalent traces with different sampling origins serialize to identical
   bytes, or is deterministic serialization per frozen source/index sufficient?
2. Which downstream metrics explicitly quotient cyclic origin, reversal, both,
   or neither?
3. Which external index or mapping, if any, may be retained in a direction-free
   trace packet without violating its leakage boundary?
4. Does P06 require a branch-labelled crossing map, or only topology and
   representative-independent comparison?
5. Should `trace_canonical.csv` remain the operational filename if geometric
   uniqueness is not required? No rename is authorized here.

All five remain pending. No tolerance, algorithm, fixture, Owner decision or
acquisition authority is created or changed.

## 9. Protected boundaries

```text
CANDIDATE_RULE_SELECTED: NONE
REPRESENTATION_IMPLEMENTED: NO
COMPARISON_METHOD_IMPLEMENTED: NO
TOLERANCE_CREATED_OR_MODIFIED: NO
TRACK_B_MODIFIED: NO
TRACK_C_MODIFIED: NO
MASK_PLANS_MODIFIED: NO
OWNER_DECISIONS_MODIFIED: NO
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```
