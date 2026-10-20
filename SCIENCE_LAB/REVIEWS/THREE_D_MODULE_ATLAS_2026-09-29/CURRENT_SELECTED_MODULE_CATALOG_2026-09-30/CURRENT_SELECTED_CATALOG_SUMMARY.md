# Current and selected module catalog — summary

Date: `2026-10-08`

Status: `CURRENT_PERIOD_AND_SELECTED_LEGACY_REFERENCE_CATALOG`

## What this catalog does

This package separates three questions:

1. **Inventory:** what HTML and 3D files are observed from `2026-03-01` onward?
2. **Selection:** which current families are relevant to Science or Builder work?
3. **Bridge:** which few older modules remain legitimate entrances into the current work?

The sources stay where they are. This package stores references and hashes; it
does not create another asset warehouse.

## Counts

- Current-period 3D records: **53**
- Current-period HTML records: **215**
- Logical families after cross-copy grouping: **28**
- Current 3D rows identified as exact duplicate copies: **27**
- Current HTML rows identified as exact duplicate copies: **33**
- Curated current Science/Builder families: **16**
- Selected older bridges: **8**

## 3D source zones

- `CURRENT_INCOMING`: 27
- `DESKTOP_WORKING`: 13
- `CURRENT_SCIENCE_LAB`: 7
- `CURRENT_BUILDER`: 4
- `CURRENT_SCIENCE_INCOMING`: 1
- `LOOSE_DOWNLOADS`: 1

## HTML source zones

- `CURRENT_ECOSYSTEM`: 59
- `CURRENT_SCIENCE_LAB`: 52
- `OTHER`: 44
- `DESKTOP_WORKING`: 21
- `CURRENT_BUILDER`: 20
- `LOOSE_DOWNLOADS`: 15
- `CURRENT_INCOMING`: 2
- `CURRENT_SCIENCE_INCOMING`: 2

## Interpretation

The current estate is not a set of hundreds of independent discoveries. It is
primarily a smaller number of families expressed through multiple versions,
working copies, exported surfaces and custody locations. The catalog therefore
keeps both levels: every observed file and the family-level reading layer.

`modified_at >= 2026-03-01` is an operational cutoff. It does not prove that a
file was first created after that date.

## Scientific boundary

```text
CATALOGED FILE
!= CANONICAL MASTER
!= TESTED MECHANISM
!= SCIENTIFIC CONTRIBUTION
```

Science relevance means that an artifact can support a declared comparison,
instrument or reproducible transformation. Admission still requires a named
question, variables, test, result ledger and claim boundary.

The navigation compression rule is maintained in
[`CURRENT_USEFULNESS_AND_COMPRESSION_GATE_2026-10-08.md`](CURRENT_USEFULNESS_AND_COMPRESSION_GATE_2026-10-08.md).
Catalog growth alone does not create a new Navigator route.
