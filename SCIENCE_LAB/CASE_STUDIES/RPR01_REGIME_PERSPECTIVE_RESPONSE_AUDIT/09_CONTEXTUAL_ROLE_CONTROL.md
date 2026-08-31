# Contextual Role Control

One entity can have different registered roles without identity change:

| Entity | Context | Role |
|---|---|---|
| Earth-based station | clock comparison | reference/source/observer apparatus |
| astronaut | mission procedure | actor and observed subject |
| sensor | measurement pipeline | observation source |
| Earth | orbit model | reference body/environment member |

OLS already defines observer as a situated role and supplies context, perspective, position and relation. RID can bind one entity ID to context/provenance and relations. Therefore:

```text
ENTITY_IDENTITY ≠ CONTEXTUAL_ROLE
ROLE_CHANGE ≠ ENTITY_CHANGE
```

A dedicated `ContextualRole` record would be useful for interface clarity, but it is not a new primitive and not a genuine schema blocker. Minimal record fields would be entity ref, role vocabulary/source, context ref, valid interval, relation refs, provenance and uncertainty. SUBJECT/OBJECT/PREDICATE are not required canonical types.

