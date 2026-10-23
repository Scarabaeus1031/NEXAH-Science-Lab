# A0 Typed-170 Source Audit

**Date:** 2026-10-23

**Status:** `PASS / TYPED_170_LOCATED_ROLE_AND_GENERATOR_MISMATCH`

**Scope:** read-only source audit for the existing A0 Channel Census

**Authority effect:** none; no Study, run, finding, relation, identity or publication state changes

## Frozen admission contract

A numeric occurrence of `170` is admitted as a sequence rung only if it has all
of the following properties:

1. exact value `170`;
2. an explicit semantic type;
3. a named source and generator;
4. a reproducible record;
5. the same role as the compared `252` and `332` counters;
6. the same generating contract as those counters;
7. compatible currentness.

Coordinates, marker sizes, DPI values, hash fragments, dates, filename
fragments and untyped prose do not pass this contract.

## Located typed record

The Navigator Internal v1 freeze contains a real typed record:

```text
internal_entities       = 170
fail_closed_rejections  = 170
typed_relations         = 23
state                   = FROZEN / INTERNAL / NOT PUBLIC
```

The second `170` is not independent. The registry adapter emits exactly one
fail-closed rejection for every internal entity when no public allowlist
exists. Both values therefore describe the same frozen population.

Sources:

- `SCIENCE_LAB/NAVIGATION/FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07/FREEZE_SNAPSHOT.json`
- `SCIENCE_LAB/NAVIGATION/FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07/FREEZE_RECORD.md`
- `SCIENCE_LAB/NAVIGATION/BUILD/build_registry_exports.mjs`

## Type comparison

| Value | Semantic type | Generator/currentness |
|---:|---|---|
| 170 | Navigator internal entities; derived fail-closed rejections | frozen v1 registry adapter output |
| 252 | Navigator app audit predicates | current app audit |
| 252 | covered HTML artifacts | current catalog/coverage ledger |
| 332 | Coupled Window test assertions | current A0 test runner |

These are not like-for-like channel records. `170` counts registry objects;
`252` counts predicates or artifacts; `332` counts assertions. Their
generators and currentness also differ.

The frozen value is not the current output cardinality of the same Navigator
adapter. At audit time the checked-in registry projection held `266` entities,
while a fresh deterministic adapter verification produced `283` entities and
`29` relations. The exact delta is `+17 / -0`: all seventeen additions are
`supporting` A0 HTML surfaces already present in the current HTML registry;
none is an independently admitted sequence rung. This pending projection
delta is recorded, not admitted or rebuilt by this A0 audit.

## Decision

```text
TYPED 170:       LOCATED
LIKE-FOR-LIKE:   NO
SEQUENCE:        NOT ESTABLISHED
CLASSIFICATION:  CANDIDATE_PATTERN_TYPED_170_ROLE_MISMATCH
```

The arithmetic ladder `a(k)=k(87-k)` remains exact as a cross-ledger
resonance. The source audit strengthens the description—from “170 absent” to
“170 present but differently typed”—but does not supply a shared generator.
The next permitted action is to keep the relation visible as a candidate until
a pre-existing like-for-like `170` channel record is found. No new data is to
be generated merely to fill the rung.

## Verification

```sh
node a0-typed-170-source-audit.cjs
node a0-channel-census-tests.cjs
```
