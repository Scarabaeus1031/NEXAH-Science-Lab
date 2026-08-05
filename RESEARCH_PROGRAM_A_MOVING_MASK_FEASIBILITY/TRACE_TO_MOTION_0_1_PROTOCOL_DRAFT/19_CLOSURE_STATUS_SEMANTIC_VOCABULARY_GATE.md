# Landing 02F — `closure_status` Semantic Contract Freeze

Status: `OWNER DECISION APPLIED — SEMANTIC CONTRACT FROZEN`

Decision basis:
`19_CLOSURE_STATUS_SEMANTIC_VOCABULARY_GATE.md`

Reviewed basis SHA-256:
`a48f00d069c1e9359ee4ebb16bfa1aa1c51248ad4556bbef034df6120be0b6c8`

Baseline commit: `c8fb5b3361270888804444fcacc2ad8e5302ce1c`

Scope: semantic meaning, permitted tokens, granularity and assignment authority
for the existing `closure_status` field only.

## 1. Owner decision

```text
CLOSURE_STATUS_VOCABULARY: FROZEN
ASSESSED_PROPERTY: TRACE_LEVEL_CLOSED_CYCLE_CONNECTIVITY
AUTHORIZED_TOKENS: CLOSED, NOT_CLOSED
GRANULARITY: TRACE_LEVEL_REPEATED_IDENTICALLY_ON_EVERY_ROW
ASSIGNMENT_AUTHORITY: CANONICAL_TRACE_CONFORMANCE_VALIDATOR
ASSIGNMENT_POINT: AFTER_TRACE_DERIVATION_BEFORE_BYTE_SERIALIZATION
SERIALIZER_AUTHORITY: VALIDATE_AND_SERIALIZE_ONLY
SERIALIZER_ASSIGNMENT: NO_ASSIGNMENT
SERIALIZER_GEOMETRIC_INFERENCE: NO_GEOMETRIC_INFERENCE
```

No other `closure_status` token is authorized.

## 2. Assessed property

`closure_status` records one property only:

```text
TRACE_LEVEL_CLOSED_CYCLE_CONNECTIVITY
```

It is a geometric connectivity assessment of the complete operational trace.
It is not:

- computation state;
- data-validity state;
- authority state;
- simple-closedness evaluation;
- self-intersection evaluation;
- branch identity;
- geometric equivalence;
- metric result.

## 3. Authorized vocabulary

| Token | Exact semantic meaning |
|---|---|
| `CLOSED` | The complete operational trace has closed cyclic connectivity under its governing trace-connectivity contract. This does not imply simple closedness and does not exclude self-intersection. |
| `NOT_CLOSED` | The complete operational trace does not have closed cyclic connectivity under the same governing trace-connectivity contract. |

Tokens are uppercase ASCII and serialize exactly as written.

```text
CLOSED_DOES_NOT_IMPLY_SIMPLE_CLOSED: YES
SELF_INTERSECTION_DOES_NOT_IMPLY_NOT_CLOSED: YES
P05_AND_P06_MAY_BOTH_BE_CLOSED: YES
```

The vocabulary does not predetermine the actual assessment of any artifact.

## 4. Granularity and row consistency

The assessment belongs to the complete operational trace. The assigned token
is repeated identically in `closure_status` on every row of that trace's
`trace_canonical.csv`.

The following are artifact-level contract failures:

- a missing `closure_status` value;
- an unauthorized token;
- different `closure_status` values within one trace;
- a token assigned by an unauthorized component;
- assignment outside the authorized assignment point.

Such an artifact is `INVALID`. The serializer must not repair, replace, infer
or normalize its closure value.

## 5. Assignment boundary

The `CANONICAL_TRACE_CONFORMANCE_VALIDATOR` is the only component authorized to
assign `CLOSED` or `NOT_CLOSED`.

Assignment occurs:

```text
trace derivation complete
↓
governing trace-connectivity assessment
↓
closure_status assigned once at trace level
↓
same token repeated on every trace row
↓
byte serializer validates and serializes
```

The assignment authority must apply a separately governed
trace-connectivity contract. This semantic freeze does not define that
contract's algorithm, endpoint convention or numerical decision boundary.

## 6. Serializer boundary

The byte serializer may:

- verify that the token is exactly `CLOSED` or `NOT_CLOSED`;
- verify that the same token appears on every row;
- serialize the already assigned token according to Landing 02E.

The byte serializer may not:

- assign a token;
- inspect geometry to infer a token;
- repair a missing or inconsistent token;
- substitute a non-valid state;
- change token case or spelling.

Landing 02E byte serialization remains unchanged.

## 7. Non-valid states remain outside `closure_status`

`INVALID`, `UNKNOWN` and `BLOCKED` are not authorized values of
`closure_status`.

| State | Meaning and required behavior |
|---|---|
| `INVALID` | Artifact-level contract failure. No `closure_status` assignment and no complete canonical-trace artifact. |
| `UNKNOWN` | Closure assessment unavailable. No complete canonical-trace artifact. |
| `BLOCKED` | Required vocabulary, authority or assessment contract absent. No complete canonical-trace artifact. |

No non-valid state may be converted into `CLOSED` or `NOT_CLOSED`.

## 8. Explicit non-decisions

This semantic contract does not define or select:

- a closure algorithm;
- endpoint coincidence rules;
- duplicated-endpoint policy;
- explicit or implicit closing-edge representation;
- a threshold or tolerance;
- a fixture;
- simple-closedness evaluation;
- self-intersection evaluation;
- branch mapping;
- geometric equivalence;
- a metric inventory.

It does not infer closure from sample geometry and does not assign a token to
P05, P06 or any future trace.

## 9. Exact effects

The Owner decision resolves only the prior semantic-vocabulary block:

```text
ASSESSED_PROPERTY_DEFINED: YES
AUTHORIZED_TOKENS_DEFINED: YES
GRANULARITY_DEFINED: YES
ASSIGNMENT_AUTHORITY_DEFINED: YES
ASSIGNMENT_POINT_DEFINED: YES
NON_VALID_STATE_BOUNDARY_DEFINED: YES
```

The six-column schema is unchanged. The byte-serialization contract is
unchanged. The geometric assessment remains unimplemented and cannot execute
until its separately governed trace-connectivity contract exists.

Owner decisions O-06, O-09, O-10, O-11, O-13, O-19 and O-21 remain open.

## 10. Protected boundaries

```text
SIX_COLUMN_SCHEMA_CHANGED: NO
BYTE_SERIALIZATION_CHANGED: NO
CLOSURE_CLASSIFIER_IMPLEMENTED: NO
GEOMETRIC_CLOSURE_ALGORITHM_DEFINED: NO
ENDPOINT_COINCIDENCE_RULE_DEFINED: NO
DUPLICATED_ENDPOINT_POLICY_DEFINED: NO
CLOSING_EDGE_REPRESENTATION_DEFINED: NO
THRESHOLD_OR_TOLERANCE_SELECTED: NO
FIXTURE_SELECTED_OR_CREATED: NO
SIMPLE_CLOSEDNESS_EVALUATION_DEFINED: NO
SELF_INTERSECTION_EVALUATION_DEFINED: NO
BRANCH_MAPPING_SELECTED: NO
GEOMETRIC_EQUIVALENCE_DEFINED: NO
METRIC_INVENTORY_SELECTED: NO
OPERATIONAL_ORDER_CHANGED: NO
DIRECTION_FREE_PACKET_SCHEMA_EXPANDED: NO
IMPLEMENTATION_MODIFIED: NO
TRACK_B_MODIFIED: NO
TRACK_C_MODIFIED: NO
MASK_PLANS_MODIFIED: NO
ACQUISITION_AUTHORITY_MODIFIED: NO
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```
