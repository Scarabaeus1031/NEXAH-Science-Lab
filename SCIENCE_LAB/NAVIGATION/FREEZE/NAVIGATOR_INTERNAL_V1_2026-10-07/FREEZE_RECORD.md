# Navigator Internal v1 — Freeze Record

Date: `2026-10-07`

Status: `FROZEN / INTERNAL / READ-ONLY / NOT PUBLIC`

Authority: Human Owner decision recorded in the
[Mission Control return](../../../MISSION_CONTROL_RETURN_NAVIGATOR_V1_FREEZE_AND_NEXAH_ASSESSMENT_2026-10-07.md).

## Frozen object

This record freezes the first coherent internal Science Navigator baseline:
the app shell, rendered data projections, governed entry content, controlling
registries, entry architecture records and explanatory Handbook listed in
`MANIFEST_SHA256.txt`.

It does not freeze every Science Lab package, close the NEXAH research
programme or authorize publication.

## Verified state

```text
ENTRY_DATA_BUILD = PASS
DOMAINS = 6
CURRENT_FOCUS_RECORDS = 5
CONTROLLED_TERMS = 12
MODULE_REGISTRY = PASS (15 modules / 42 surfaces / 17 module relations)
HTML_ARTIFACT_REGISTRY = PASS (140 / 140)
INTERNAL_MANIFEST = 170 entities / 23 typed relations
NAVIGATOR_AUDIT = 99 / 99 PASS
PUBLIC_ENTITIES = 0
PUBLICATION_AUTHORIZED = FALSE
```

## Change rule

Assessment is permitted. Evidence-preserving repair is permitted only with a
recorded delta and rerun verification. Expansion, promotion, canonical
terminology changes, new public scope and claim changes require a separate
Human Owner reopen or version decision.

## Verification

From the repository root:

```sh
node SCIENCE_LAB/NAVIGATION/FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07/verify_freeze.mjs
```

A clean result returns the number of matched files and no mismatches. The
verifier does not modify the repository.

