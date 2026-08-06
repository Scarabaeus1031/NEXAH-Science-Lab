# Recommendations for Repository Simplification

## Target architecture

```text
OPERATORS/
├── README.md                     one current entry point
├── OLS_PRIMITIVES.md             links only; OLS remains authority
├── RESEARCH_MEASURES.md          Gate and Janus DCO status
├── APPLICATION_MEASUREMENTS.md   IEEE and other scoped suites
└── HISTORICAL_CROSSWALK.md       old labels → current destinations
```

This is an index proposal, not a new subsystem. It may instead live under an existing documentation index if Architecture review rejects a top-level directory.

## Immediate simplifications

### 1. One operator front door

Add one page linking to:

- OLS 1.0 primitive contracts;
- Library controlled visual concepts;
- research numerical measures;
- application measurement suites;
- historical vocabularies.

The page must state that these categories do not share authority.

### 2. Reclassify without deleting

Add semantic-kind metadata or documentation:

```text
primitive_semantic_operator
controlled_visual_concept
research_measure
application_measurement
historical_work_vocabulary
```

Keep existing IDs and files. Do not mass-rename the Registry or rewrite historical Works.

### 3. One current Gate definition

Make the current Architecture/System State correction the entry point. Link historical “transition detector” text from it with a supersession note. Do not silently edit experimental logs.

### 4. One JANUS identity page

Define:

- JANUS principle;
- Janus Bridge candidate;
- Janus DCO research measure.

Route Atlas `J`, Rope, Aperture, and other historical usages through a crosswalk.

### 5. Demote the Atlas operator chain

Retitle or banner the Q–S–P–J–H–N document as a historical conceptual reconstruction pipeline. Link forward to the current mathematical framework note and OLS operator contracts.

### 6. Keep application measurements local

The IEEE Geometry v1 IDs should remain in their manifest and code. Add them to the operator index by reference; do not clone their definitions into global documentation.

### 7. Separate nouns from verbs

Operator indexes should not list state, transition, relation, field, boundary, scale, observer, evidence, or uncertainty as operations. Link these to their concept/declaration/record definitions.

### 8. One canonical visual per retained layer

- universal OLS process;
- profile ownership;
- Gate instability;
- Janus DCO after contract freeze.

All galleries remain available as provenance. Current indexes show only canonical visuals.

## Navigation changes

### Current problem

Search results mix:

- normative OLS contracts;
- Library concepts;
- book titles;
- scientific measures;
- application functions;
- speculative theory;
- historical scripts.

### Proposed metadata displayed in indexes

| Field | Meaning |
|---|---|
| canonical_name | one preferred label |
| semantic_kind | one of the five categories above |
| authority | exact owning subsystem/file |
| scope | universal, profile, research, or application |
| maturity | FOUNDATION / WORKING / SPECULATIVE / DUPLICATE / OBSOLETE |
| supersedes | earlier current-facing label, if any |
| related_not_equivalent | adjacent labels that must not be merged |
| evidence | validation or source references |
| last_reviewed | review date |

## Files to preserve unchanged

- OLS 1.0 release tree.
- Library Registry IDs and source Work links.
- historical experimental logs and visuals.
- completed orientation studies and their counterexamples.
- validation manifests and canonical outputs.

## Files to update first

1. `LIBRARY/README.md` — add the vocabulary boundary.
2. `LIBRARY/architecture/LIBRARY_ARCHITECTURE_V1.md` — define controlled visual concept semantics.
3. `ARCHITECTURE/README.md` — link the current operator index and JANUS identities.
4. `ARCHITECTURE/SYSTEM_STATE.md` — use Gate Instability Measure as preferred current name.
5. `RESEARCH/FOUNDATION/STATE_TRANSITION_ORIENTATION_FRAMEWORK_V0_1.md` — link record-definition work.
6. Atlas Operator Framework — add historical/conceptual banner and current crosswalk.
7. Repository Map — add one operator-navigation row.

## Do not do

- Do not create 17 new OLS operators from Registry concepts.
- Do not import every visual Move into metadata.
- Do not delete or rewrite historical experiments.
- Do not normalize every old mention in one bulk commit.
- Do not create a universal glossary that duplicates OLS, Library, and Architecture definitions.
- Do not promote biology or chemistry process names because they recur visually.
- Do not call a scalar measure an operator unless its domain, codomain, parameters, and failure behavior are explicit.

## Success criteria

A newcomer should answer these in under two minutes:

1. What are the canonical primitive operators?
2. Who owns each definition?
3. Is this label a visual concept, semantic operator, research measure, or application function?
4. Which current visual and experiment support it?
5. What does it not establish?
6. Where is its historical provenance?
