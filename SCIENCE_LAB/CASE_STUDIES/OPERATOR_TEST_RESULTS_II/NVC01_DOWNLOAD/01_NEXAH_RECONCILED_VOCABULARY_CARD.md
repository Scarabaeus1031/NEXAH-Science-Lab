# NEXAH — RECONCILED VOCABULARY

## WHAT SURVIVED — WHAT IT IS — WHAT WE NEED

> **SEE THE RELATION. KEEP THE DIFFERENCE.**

> TYPES DEFINE. OPERATORS ACT. EXECUTIONS HAPPEN. TRACES ATTEST.

## I. TYPES / THINGS

| Term | One-line function | Must not be confused with |
|---|---|---|
| OBJECT / ID | Identifies the particular object or instance. | STATE; same state does not imply same identity. |
| STATE / OBS | STATE is the registered condition; OBS is the observed state record. | Identity; OBSERVE; complete history. |
| ORIENTATION | Describes directed placement relative to a reference. | Motion or execution. |
| PROVENANCE | Records attested origin/lineage relations. | TRACE; reconstructed but unattested history. |
| GENERATION | Registers a derivational level or successor instance. | Transformation alone. |
| EXECUTION | A particular occurrence of applying an operator. | The reusable operator rule or its result. |
| TRACE | Attested record of executions/states. | Provenance or an operator. |

## II. OPERATORS

The group labels below are presentation aids, not new formal operator types.

### Distinguish / differentiate

| Operator | Minimal action | Input → output | Primary effect |
|---|---|---|---|
| BRANCH | Produce separately addressable descendants/views. | object/state → indexed descendants | Distinguish; derivational only if declared. |
| COPY | Produce a content-related instance. | object → copy candidate | May add an instance; identity/provenance require declaration. |

### Preserve / reorient

| Operator | Minimal action | Input → output | Primary effect |
|---|---|---|---|
| REFLECT | Apply a declared reflection/involution. | carrier/state → same carrier/state type | Reorient; may be self-inverse. |
| ROTATE | Apply a declared rotation. | oriented carrier → reoriented carrier | Reorient. |
| TRANSLATE | Apply a fixed displacement. | positioned state → displaced state | Transport position. |
| SCALE | Apply a declared scale/resolution map. | magnitude/representation → scaled output | Rescale; information effect depends on map. |

### Relate / bind

| Operator | Minimal action | Input → output | Primary effect |
|---|---|---|---|
| BIND | Make a relation explicitly addressable. | relation → addressable relation object | Relate; derivational only if declared. |
| CONVERGE | Direct multiple registered paths toward a shared target. | indexed inputs/paths → target relation | Relate; source distinction requires trace. |

### Represent / observe

| Operator | Minimal action | Input → output | Primary effect |
|---|---|---|---|
| PROJECT | Map a carrier into a representation. | carrier/state → representation | May reduce information. |
| OBSERVE | Apply a measurement/observation map. | state → observation/OBS | May reduce information; produces a recordable observation. |

### Context-dependent effect

| Operator | Minimal action | Input → output | Primary effect |
|---|---|---|---|
| TRANSFORM | Apply a declared typed map. | typed input → typed output | Generic schema; effect follows the concrete map. |
| REPEAT | Apply a declared operation again. | operator/execution state → next execution state | Iterative control; not automatically return. |
| NORMALIZE | Express a value/residual in a registered frame. | residual/value → normalized value | Reframe or bound. |
| CORRECT | Apply a registered feedback update. | estimate/state + error rule → updated estimate/state | Correction; record effect depends on execution. |

**Canonical operator count: 14. `BREAK` is not an operator in this card.**

## III. RELATIONS / CONDITIONS / RESULTS

These terms are not automatically operators.

| Term | Function | Required boundary |
|---|---|---|
| CONSTRAINT | Predicate or admissibility condition. | CONSTRAINT ≠ filtering execution. |
| PROJECTION | Representation/result or projection relation. | PROJECT ≠ PROJECTION. |
| EQUIVALENCE | Declared relation under a specified criterion. | Equivalence ≠ identity. |
| DERIVATION | Attested relation from source to successor. | DERIVATION ≠ TRANSFORMATION. |
| RETURN_RELATION | Relates a later endpoint/path to a registered prior state. | Return to state ≠ return to history. |
| INVERSE_RELATION | States that an inverse rule/relation exists where defined. | INVERSE_RELATION ≠ executed return. |
| OBSERVATION | Result of an observation map. | Observation ≠ full underlying state. |

### Records

- `TRACE`: records what execution/state sequence was attested.
- `OBS`: records what was observed.

Neither proves an unrecorded history.

```text
OPERATOR != EXECUTION != RESULT != TRACE
```

## IV. CONTEXT-DEPENDENT TERMS

| Term | Why explicit typing is required |
|---|---|
| RETURN | May denote a rule, path, execution event, or endpoint relation. |
| GATE | May denote an intersection, filter, transition, or identifiability boundary. |
| FILTER | May denote a predicate, selection operator, or observation restriction. |
| INVERSE | May denote an inverse rule or inverse relation; existence does not imply execution. |

> **RETURN != INVERSE**

## Four-question coverage

| Question | Minimum vocabulary |
|---|---|
| WHAT IS IT? | OBJECT / ID / STATE |
| HOW IS IT ORIENTED? | ORIENTATION plus executed orientation-relevant operators where needed |
| WHAT HAPPENED? | OPERATOR → EXECUTION → RESULT / OBSERVATION → TRACE |
| WHERE DID IT COME FROM? | PROVENANCE → DERIVATION → GENERATION |

`FOUR-QUESTION COVERAGE = COMPLETE`

## Critical non-collapse rules

```text
SAME STATE != SAME IDENTITY
SAME STATE != SAME HISTORY
ORIENTATION != MOTION
OPERATOR != EXECUTION
OPERATOR != RESULT
OPERATOR != TRACE
TRACE != PROVENANCE
TRANSFORMATION != GENERATION
PROJECT != PROJECTION
RETURN != INVERSE
RETURN TO STATE != RETURN TO HISTORY
RECONSTRUCTABLE != ATTESTED
```

## V. EXPRESSION / HISTORICAL QUARANTINE

### Historical / expression — preserved without formal promotion

`water`, `tree`, `beak`, `bridge`, `mirror`, `stream`, `island`, `flow`, `Scarab`, `Cicada`, `Janus`, `Elevator`, `resonance`, `golden ratio`, `Möbius`

`mirror` is expression vocabulary; `REFLECT` is the formal operator.

### Quarantined syllables

`NO`, `NA`, `BEL`, `NABEL`, `CON`, `ZE`, `ZO`, `EI`, `EU`, `DAO`, `THETA`, `PHI`

```text
HISTORICAL TOKENS
FORMAL MAPPING = NONE
RETAIN AS PROVENANCE / EXPRESSION

NO GRAMMAR INFERRED
NO ETYMOLOGY INFERRED
NO OPERATOR MAPPING INFERRED
```

## Status panel

| Measure | Status |
|---|---:|
| OVI tokens | 113 |
| OVI formal survivors | 21 |
| Typed operators | 14 |
| Formal non-operators | 3 |
| Context-dependent terms | 4 |
| Underdefined formal tokens | 0 |
| Quarantined syllables | 12 |
| Four-question model | COMPLETE |
| Neutral relabel | PASSED |
| New semantics | NONE |
| Architecture delta | NONE |
| ORION delta | NONE |
| Research activation | NO |

## Source note

**SOURCE BASIS:** OVI-01 closed historical inventory; OVR-01 closed vocabulary reconciliation; IOTB-01 closed typed binder.

**SCOPE:** Bounded reference card.

This card does not establish new mathematics, physics, ontology, operator semantics, or a universal language.

> **EXPRESSION IS PRESERVED. FORMAL MEANING IS EARNED.**

```text
NVC01_SOURCE_OVI01=PRESERVED
NVC01_SOURCE_OVR01=PRESERVED
NVC01_SOURCE_IOTB01=PRESERVED

CORE_TYPES=7
CORE_OPERATORS=14
CORE_RELATIONS_CONDITIONS_RESULTS=7
CORE_RECORDS=2
CONTEXT_DEPENDENT_TERMS=4
QUARANTINED_SYLLABLES=12

NEW_VOCABULARY=NO
NEW_SEMANTICS=NO
NEW_GRAMMAR=NO
NEW_ONTOLOGY=NO
NEW_MATHEMATICS=NO
NEW_PHYSICS=NO

NEXAH_ARCHITECTURE_CHANGED=NO
ORION_CAPABILITY_DELTA=NONE
NEW_RESEARCH_ACTIVATION=NO

NVC01_STATUS=CLOSED_REFERENCE_ARTIFACT
NEXT_ACTION=STOP
```
