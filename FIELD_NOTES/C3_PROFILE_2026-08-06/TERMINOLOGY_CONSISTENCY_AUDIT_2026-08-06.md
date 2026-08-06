# Terminology consistency audit

Date: 2026-08-06  
Status: `BOUNDED SEARCH AND DISPOSITION — NO AUTHORITY CHANGE`

## Scope

The local Science Lab repository was searched in Markdown, Python, JavaScript
and JSON source files for:

```text
fixpoint
basin radius
return fraction / return-frac
C3 minimum
C2 stable basin / stable basin
Janus operator
MZ channel
f(M_A)=f(M_B)
```

Generated result directories and existing dry-run payloads were excluded from
the terminology search. The external NEXAH repository was not modified or
included as an edit target.

## Findings and disposition

| Location or class | Finding | Disposition |
| --- | --- | --- |
| `FIELD_NOTES/C3_PROFILE_2026-08-06/README.md` | Uses `controlled fixpoint estimate` and `controlled return fraction` under an explicit interpretation limit | Retain; already bounded and linked to the v39 method note |
| `FIELD_NOTES/C3_PROFILE_2026-08-06/measure_c3_profile.py` | Internal variables and JSON keys retain `fixpoint` for v39-compatible reproduction | Retain machine-facing names; do not silently break result compatibility |
| `V39_CONTROLLED_RETURN_METHOD_NOTE_DE.md` | Contains the searched legacy terms only to state their permitted replacements | Retain corrective context |
| `MISSION_01_SCIENTIFIC_BACKBONE/04_MISSING_DEFINITIONS.md` | `Janus Operator` appears as a documented historical naming collision | Retain; it is not a current identity assertion |
| `MISSION_01_SCIENTIFIC_BACKBONE/01_CANONICAL_OPERATOR_INVENTORY.md` | `JANUS Operator experimental series` is a provenance label for historical experiments | Retain; no renaming of JANUS-DCO or historical sources |
| `11_REFLECTION_INVOLUTION_SPECIFICATION.md` | `MZ channel` and `f(M_A) = f(M_B)` occur only in explicit correction clauses | Retain corrective context |

## Negative findings

No additional live source occurrence was found for:

```text
C3 minimum
C2 stable basin
```

No unqualified active claim that v39 Return-Frac is a free basin measurement
was found outside the already bounded C3 profile context.

## Changes authorized by this audit

No historical file, frozen report, machine-readable field or experiment source
was silently rewritten. The existing v39 method note remains the single local
correction point for `controlled return != free basin`.

## Remaining review boundary

This lexical audit does not prove semantic consistency across images, external
repositories or unindexed historical material. It supports only the listed
local source scope and search expressions.

