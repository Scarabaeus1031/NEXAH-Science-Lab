# Canonical Input Specification

Status: `CANDIDATE SPECIFICATION — NO CSV GENERATED`

## Intended artifact

Future filename:

```text
source_samples.csv
```

The file does not currently exist. This specification does not create it.

## Scientific content

The future CSV shall contain the finite source family only:

- four source identities: `A`, `B`, `C`, `D`;
- 121 matched samples per source;
- 484 data rows;
- normalized parameter and source coordinates;
- no projections, depth, masks, classifications or results.

## Candidate coordinate semantics

Subject to owner and protocol-review approval:

| Field | Candidate semantics |
|---|---|
| `t` | dimensionless normalized source parameter in `[0,1]`; `t=sample_index/120` before source-model rounding |
| `x` | dimensionless synthetic source coordinate |
| `y` | dimensionless synthetic source coordinate |
| `z` | dimensionless synthetic source coordinate |

The coordinates shall not be described as physical distance, time, angle,
astronomy or measured data.

If the owner does not approve dimensionless status, STOP. No unit may be
inferred.

## CSV schema

Exact header:

```text
source_id,sample_index,t,x,y,z
```

| Column | Type | Rule |
|---|---|---|
| `source_id` | ASCII string | exactly `A`, `B`, `C` or `D` |
| `sample_index` | base-10 integer | `0` through `120`; no leading sign |
| `t` | fixed decimal | exactly twelve digits after the decimal point |
| `x` | fixed decimal | exactly twelve digits after the decimal point |
| `y` | fixed decimal | exactly twelve digits after the decimal point |
| `z` | fixed decimal | exactly twelve digits after the decimal point |

## Candidate deterministic export procedure

The future export operation shall:

1. start from the owner-approved clean tracked source commit;
2. verify the canonical source-model hash before loading it;
3. use an export runtime and environment recorded in an approved
   `export_environment.json`;
4. load only the tracked Lab 0.4 source model;
5. invoke `generateFamily(121)` exactly once;
6. reject any result other than 484 records;
7. map fields without recomputation:
   - `id` → `source_id`;
   - `index` → `sample_index`;
   - `phase` → `t`;
   - `x`, `y`, `z` → identically named coordinate columns;
8. serialize rows in canonical order;
9. write the exact canonical byte format;
10. validate the completed file before any hash is proposed;
11. preserve the export log and environment record;
12. stop without running a projection or scientific comparison.

The export runtime, version, platform, command and export implementation remain
`UNASSIGNED`. They must be frozen before export.

## Decimal serialization

Candidate rule:

- UTF-8 without byte-order mark;
- comma delimiter;
- LF line endings;
- one final LF;
- no spaces;
- no comments;
- no quoted fields;
- no scientific notation;
- exactly twelve digits after the decimal point for `t,x,y,z`;
- trailing zeros retained;
- negative zero serialized as `0.000000000000`;
- no numeric rounding before the originating model's declared twelve-place
  output;
- fixed-decimal serialization may add trailing zeros but may not change the
  returned numeric value.

The future export reviewer must verify that serialization does not introduce a
second scientific rounding operation.

## Ordering

Rows shall be ordered by:

1. source order `A`, `B`, `C`, `D`;
2. ascending `sample_index` from `0` through `120`.

Each `(source_id,sample_index)` key shall appear exactly once.

## Validation rules

Before the CSV can be proposed for freeze, verify:

- exact header and column order;
- exactly 484 data rows;
- exactly 121 rows per source;
- permitted source identifiers only;
- complete index range for every source;
- unique keys;
- canonical row ordering;
- fixed twelve-place decimal syntax;
- finite values;
- `t` equal across sources for every matching index;
- `t=0.000000000000` at index `0`;
- `t=1.000000000000` at index `120`;
- no projection, depth, mask or classification fields;
- exact byte hash recorded only after validation;
- independent export review completed before owner adoption.

## Export evidence required

The future export shall produce, separately from the CSV:

```text
export_manifest.json
export_environment.json
export_log.txt
export_validation.json
source_samples.csv.sha256
```

These names describe future evidence. No such files are created in Phase B.

## STOP conditions

STOP before export if:

- the source commit or model hash is not canonical;
- the worktree is dirty;
- the export environment is not frozen;
- coordinate semantics are unapproved;
- serialization is ambiguous;
- an assigned role is missing;
- source code modification would be required;
- expected scientific results are introduced into the export process.
