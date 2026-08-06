# Input Specification

## Canonical scientific input

One UTF-8 CSV file supplies the scientific object:

`source_samples.csv`

The filename is specified here; the file is not created by Program G.

## CSV schema

| Column | Type | Rule |
|---|---|---|
| `source_id` | string | exactly one of `A`, `B`, `C`, `D` |
| `sample_index` | integer | `0` through `120` |
| `t` | decimal string | finite; fixed provenance value; not used to match rows |
| `x` | decimal string | finite source coordinate |
| `y` | decimal string | finite source coordinate |
| `z` | decimal string | finite source coordinate |

Header order is fixed as shown. Decimal separator is `.`. Scientific notation is prohibited in the canonical input. Empty values, `NaN`, infinities, duplicate rows, comments, and additional columns are prohibited.

## Row rules

- exactly 484 data rows;
- exactly 121 rows per source;
- exactly one row for each `(source_id,sample_index)` key;
- rows sorted first by source order `A,B,C,D`, then ascending sample index;
- newline convention and final newline declared in the freeze manifest;
- numeric text precision declared and uniform for `t,x,y,z`;
- byte content fixed by SHA-256.

## Scientific input origin

The freeze owner must export the existing finite 121-sample source family without changing values. The export procedure, originating source snapshot, version, and hashes belong in the provenance manifest. They are not part of the scientific comparison and may not be rerun after protocol execution begins.

## Additional required inputs

| File | Purpose |
|---|---|
| `protocol_manifest.json` | protocol ID, version, file hashes, owners, authority, dates |
| `scientific_object.json` | source labels, sample indices, matrices, norm, tolerances, pair order |
| `input_dictionary.md` | field definitions and units or explicit dimensionless status |
| `result_schema.json` | machine-readable output contract |
| `validation_checklist.md` | frozen gates and STOP rules |
| `provenance.md` | historical source names and source-to-package chain |
| `non_claims.md` | prohibited interpretations |

No implementation source code is a scientific input.

## Input validation

Before transformation, record:

- hash match for every required file;
- exact schema and header match;
- row and per-source counts;
- unique key coverage;
- permitted IDs and index ranges;
- finite numeric parsing;
- declared numeric precision;
- identical `t` value for the same sample index across all sources, or a predeclared failure;
- absence of unauthorized fields or preprocessing.

Any failure produces `invalid protocol` and immediate STOP. Input repair requires a new protocol version and new authorization.

## Remaining undefined input quantities

The following do not yet exist or are not assigned:

- canonical `source_samples.csv` byte sequence;
- coordinate units or explicit dimensionless declaration;
- canonical decimal precision and rounding provenance;
- source snapshot file list and hashes;
- export method and export reviewer;
- scientific owner, freeze owner, and input custodian;
- protocol adoption date and authority signature;
- permitted execution output location.

Execution is prohibited until each item is resolved and frozen.
