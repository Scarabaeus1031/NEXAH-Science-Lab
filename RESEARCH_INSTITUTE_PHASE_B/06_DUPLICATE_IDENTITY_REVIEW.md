# Duplicate Identity Review

## Principle

Most duplication is semantic or historical, not byte-identical. Preserve
provenance and solve navigation with pointers.

## Question identities

| Identity cluster | Existing wordings | Assessment | Pointer solution |
|---|---|---|---|
| finite view identifiability | Lab 0.4 projection collapse; Program B RQ-01/FQ-01; Program F chain; Program G protocol | same bounded lineage at increasing precision | one question record pointing to all stages |
| incomplete reconstruction | Lab 0.3 blind window; representation-loss and inverse-problem wording | related, not identical | parent question with Lab 0.3 as negative finite case |
| moving observation loss | Lab 0.2 moving mask classification; Moving Mask estimator question | not duplicates: classification versus estimation effect | reciprocal `related_question` pointer |
| relation-derived orientation | FP/RR/OE; graph invariance; weighted Q° aggregation | shared dependency but different questions | separate question records linked to common definitions |
| directional diagnostics | Gate, JANUS, phase mismatch, aperture/corridor language | competing or overlapping measures, not one operator | namespaced definitions and comparison question |
| reader orientation | pilot reflections, reader modes, meta-review unknowns | repeated open outcome question | one reader-effect question pointing to local prompts |

## Lab identities

| Case | Finding | Required boundary |
|---|---|---|
| `Lab 0.2` versus proposed FP/RR/OE Lab 0.2 | true ID collision | retain Rödelheim identity; no second Lab 0.2 |
| Lab 0.4 versus Program G | same scientific lineage, different artifact classes | Program G is protocol design, not a second Lab |
| Observer Geometry versus Lab 0.4 | overlapping projection theme | retain distinct: broad environment versus finite control case |
| IEEE historical prototypes versus IEEE Geometry V1 | same domain, different maturity and objects | current pointer must identify V1; history remains historical |
| Power Systems experiment copies/shadow paths | historical and partial directory echoes | pointer to current owning path; no automatic deletion |

## Mathematical object identities

| Term | Existing meanings | Risk |
|---|---|---|
| operator | OLS semantic operator; Library editorial Concept; research computation | authority leak |
| boundary | solver failure, mask edge, censoring, structural or epistemic limit | false mathematical unification |
| gate/aperture | visual motif, local-instability region, event or semantic operation | duplicate name hides different objects |
| transition | temporal event, graph edge, parameter step, computed relation or hypothesis | invalid composition |
| orientation | constitutional purpose, semantic output, application report or geometric direction | scope collapse |
| atlas | Library Work, state-space map, collection or application artifact | publication mistaken for validation |

## Report identities

- Copies of canonical summaries under `outputs/` and `validation/` are often
  deliberate derived evidence; source/derived labels are required, not merging.
- Fresh replay payloads may reproduce an application brief intentionally; the
  replay package must point back to the canonical source.
- Research Vision, Research Index, Core Concept Map and Paper Draft repeat one
  transition narrative at different historical roles. A current-status pointer
  is safer than rewriting them into one text.

## Recommended pointer fields

```text
canonical_identity
canonical_home
artifact_class
derived_from
supersedes
superseded_by
historical_name
related_question
current_disposition
```

No automatic merge, rename or deletion is justified.

