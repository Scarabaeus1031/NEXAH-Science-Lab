# Landing 02E — Byte-Stable Trace Serialization Boundary

Status: `SERIALIZATION BOUNDARY FROZEN — OWNER DECISIONS UNCHANGED`

Baseline: `f1ef8de872a3628573814752b9dc06ed3758b929`

Scope: byte serialization of one already-frozen operational P05/P06 trace
order and derivation context.

```text
GATE_OUTCOME: BOTH_REQUIRED_FOR_DISTINCT_CONSUMERS
P05_INTRINSIC_START_POINT: BLOCKED_BY_ROTATIONAL_SYMMETRY
P05_UNIQUE_SEQUENCE_WITHOUT_EXTERNAL_STRUCTURE: NOT_IDENTIFIABLE
P06_BRANCH_LABELLED_MAPPING: CONDITIONALLY_REQUIRED
TRACE_CANONICAL_FILENAME: ACCEPTABLE_WITH_OPERATIONAL_QUALIFICATION
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```

## 1. Boundary

This contract begins after the following inputs already exist and are frozen:

- the ordered trace rows;
- the derivation context;
- every field value;
- the operational local `trace_index` and `s_norm` values;
- the file path relative to the run root.

It maps those inputs to one byte sequence. It does not choose, sort, rotate,
reverse, resample, align or geometrically compare trace rows.

## 2. Proposed byte-serialization contract

### 2.1 Encoding and line endings

| Property | Contract |
|---|---|
| text encoding | UTF-8 |
| byte-order mark | prohibited |
| permitted character repertoire | ASCII subset of UTF-8 for this schema |
| record separator | one LF byte (`0A`) |
| CR byte | prohibited |
| final newline | exactly one LF after the final data row |
| blank lines | prohibited |
| trailing bytes | prohibited after the final LF |

### 2.2 CSV grammar

| Property | Contract |
|---|---|
| delimiter | one comma byte (`2C`) |
| field quoting | prohibited for `trace_canonical.csv` |
| escaping | none; a field requiring escaping is `INVALID` |
| comma, quote, CR or LF inside a field | prohibited |
| whitespace around fields or delimiters | prohibited |
| header count | exactly one |
| comments | prohibited |

The exact header, including order, is:

```text
sample_uuid,trace_index,s_norm,x_mm,y_mm,closure_status
```

The header is followed immediately by LF. Every data row contains exactly six
fields in the same order.

### 2.3 Row order

Rows are serialized in the already-frozen operational order. No sorting,
deduplication, cyclic shift, reversal, marker anchoring or geometric
canonicalization occurs inside serialization.

`trace_index` must be consecutive, begin at `0` and match the serialized row
position. A mismatch is `INVALID`; the serializer must not repair or reindex
the input.

This row order is operational provenance. It is not an intrinsic P05 origin and
does not establish direction.

### 2.4 Numeric lexical representation

The numeric input domain for `s_norm`, `x_mm` and `y_mm` is a finite IEEE 754
binary64 value supplied by the frozen derivation context.

Each value is serialized as its exact mathematical binary64 value in minimal
base-10 fixed-point notation:

1. decimal separator is `.`;
2. exponent notation is prohibited;
3. leading `+` is prohibited;
4. leading zeros are prohibited except the single zero before a fractional
   value;
5. a decimal point appears only when a non-zero fractional part exists;
6. trailing fractional zeros are removed;
7. no rounding or decimal quantization is applied;
8. precision is the complete exact terminating decimal expansion of the
   binary64 value;
9. both positive and negative binary zero serialize as `0`;
10. `NaN`, positive infinity and negative infinity are `INVALID` and are never
    serialized.

Because this is exact lexical conversion, it creates no geometric tolerance.
It may produce long decimal strings. Display formatting is outside the hash
boundary and must not replace this representation.

`trace_index` is an unsigned base-10 integer with no leading zeros except `0`.
Signs, decimal points and exponents are prohibited for `trace_index`.

### 2.5 Identifiers, statuses and missing values

| Field class | Contract |
|---|---|
| `sample_uuid` | lowercase hyphenated UUID text; no braces, spaces or case variation |
| status token | exact uppercase ASCII token declared by its governing schema; pattern `[A-Z][A-Z0-9_]*` |
| missing identifier | prohibited |
| missing status | prohibited |
| missing canonical-trace numeric field | prohibited |
| empty field | prohibited in `trace_canonical.csv` |

This boundary does not select the semantic vocabulary for `closure_status`.
That vocabulary must be frozen by its governing schema before replay. A token
outside that frozen vocabulary is `INVALID` even if it satisfies the lexical
pattern.

The wider Data Contract permits an empty numeric field only with an explicit
`UNKNOWN` status. The canonical-trace schema has no such numeric/status pair;
therefore that exception does not apply to this file.

### 2.6 Locale independence

Serialization must not consult process, user or operating-system locale.
Decimal comma, grouping separators, localized digits, localized status text,
date formatting and platform-native newline conversion are prohibited.

## 3. Byte-hash boundary

The content hash input is the complete file byte sequence:

```text
first byte of the exact header
through
the final LF after the final data row
```

The content hash excludes:

- filesystem metadata;
- filename and path;
- directory entries;
- creation and modification times;
- extended attributes;
- resource forks;
- transport wrappers.

The existing package manifest separately binds the lowercase SHA-256 digest to
the relative POSIX path. Content-hash equality establishes byte identity only;
it does not establish geometric equivalence.

## 4. Replay contract and failure behavior

Replay claims byte identity only when all of the following are the same:

- frozen source and source hash;
- operational row order and field values;
- derivation identity and version;
- numeric input domain;
- this serialization contract;
- relative output path.

Successful replay requires equality of the complete resulting byte sequence
and therefore equality of its SHA-256 digest.

If byte identity is not reproduced:

1. replay status is `BLOCKED` with reason `BYTE_IDENTITY_MISMATCH`;
2. the produced file must not replace the frozen artifact;
3. both hashes, environments and derivation identities are preserved;
4. the first differing byte offset may be reported as a diagnostic;
5. the mismatch is not converted into a geometric failure, tolerance result or
   scientific finding;
6. downstream review requiring byte identity remains blocked.

No retry may silently change precision, row order, newline, locale or field
content.

## 5. Included and excluded boundaries

### Included

- exact mapping from frozen field values and row order to bytes;
- lexical validation;
- file-content hash boundary;
- replay byte-identity meaning;
- explicit `INVALID` and `BLOCKED` behavior.

### Excluded

- choice or modification of geometric canonicalization;
- cyclic-origin or reversal comparison;
- geometric equality or equivalence;
- geometric tolerance;
- fixture selection or creation;
- operational trace-order selection or modification;
- intrinsic P05 start-point inference;
- P06 branch-map selection;
- direction-free packet construction;
- metric selection;
- Human acquisition.

## 6. Direction-free information boundary

This serialization contract does not expand the direction-free packet schema.
Time, direction, source order, marker, branch, derivation and Owner-derived
information remain prohibited from such packets.

The stored `trace_index` and `s_norm` are local operational indices only. They
may be included in the stored trace schema but must not encode or reveal
protected source order or traversal direction in a direction-free packet.

## 7. Unresolved decisions

1. The semantic allowed values for `closure_status` are not frozen by the
   current Data Contract.
2. The derivation stage that supplies binary64 field values remains pending
   O-06; this document only freezes their lexical serialization.
3. Cross-language independent implementation of the exact binary64 conversion
   remains unverified.
4. Replay environment and identity remain pending O-19.
5. Direction-free leakage validation remains absent.
6. No geometric representation or quotient-comparison method is selected.

Owner decisions O-06, O-09, O-10, O-11, O-13, O-19 and O-21 remain open.

## 8. Authority and non-effects

```text
GATE_OUTCOME: BOTH_REQUIRED_FOR_DISTINCT_CONSUMERS
P05_INTRINSIC_START_POINT: BLOCKED_BY_ROTATIONAL_SYMMETRY
P05_UNIQUE_SEQUENCE_WITHOUT_EXTERNAL_STRUCTURE: NOT_IDENTIFIABLE
P06_BRANCH_LABELLED_MAPPING: CONDITIONALLY_REQUIRED
TRACE_CANONICAL_FILENAME: ACCEPTABLE_WITH_OPERATIONAL_QUALIFICATION
GEOMETRIC_CANONICALIZATION_SELECTED_OR_CHANGED: NO
CYCLIC_OR_REVERSAL_COMPARISON_SELECTED: NO
GEOMETRIC_TOLERANCE_CREATED_OR_MODIFIED: NO
FIXTURE_SELECTED_OR_CREATED: NO
OPERATIONAL_TRACE_ORDER_CHANGED: NO
TRACK_B_MODIFIED: NO
TRACK_C_MODIFIED: NO
MASK_PLANS_MODIFIED: NO
OWNER_DECISIONS_MODIFIED: NO
ACQUISITION_AUTHORITY_MODIFIED: NO
HUMAN_ACQUISITION: PROHIBITED
SCIENTIFIC_RESULT: NONE
```
