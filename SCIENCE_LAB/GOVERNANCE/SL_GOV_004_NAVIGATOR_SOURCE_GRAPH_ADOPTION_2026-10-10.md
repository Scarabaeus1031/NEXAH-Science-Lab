# SL-GOV-004 — Science Navigator Source Graph Adoption

Decision date: `2026-10-10`

Decision owner: **Human Owner**

Decision: `ADOPT_NAVIGATOR_AS_SCIENCE_LAB_SOURCE_AND_RELATION_GRAPH`

## Problem

The Science Lab already had a Constitution, Study Register, validated Navigator
registry, evidence binders and Mission Control Source Field. Their relationship
was not yet constitutionally explicit. This allowed old material to remain
hard to find and made duplicate books, registries, routes or research objects
more likely.

## Adopted resolution

- Amend the Lab Constitution from `1.0.0` to `1.1.0`.
- Keep `LAB_REGISTER.md` as the Study and lifecycle register.
- Adopt `SCIENCE_LAB/NAVIGATION` as the Lab's central Source and Relation Graph.
- Adopt the subordinate Navigator Constitutional Charter, Source Graph Policy,
  Workflow, component index and validator.
- Require `SEARCH -> MATCH -> BIND -> BUILD -> RETURN -> GOVERN` for material
  Navigator-connected work.
- Require a graph and Source Field search before creating a new identity,
  registry or database.
- Generate Mission Control's Navigator control state from the Science Lab
  component index instead of maintaining a second scientific graph.

## Authority split

- Science Lab owns research records, evidence boundaries and Source Graph
  custody.
- Mission Control owns currentness, priority, activation, lifecycle and release.
- Original repositories retain content, implementation and evidence authority.
- The Human Owner retains adoption, publication and STOP.

## Non-effects

This decision does not activate research, add a Functional Family, change a
scientific result, admit a public entity, authorize publication, merge source
objects or change the canonical `173 / 29` base counts.

## Verification

Run from `SCIENCE_LAB/NAVIGATION`:

```bash
node GOVERNANCE/validate_source_graph.mjs
node GOVERNANCE/build_mission_control_projection.mjs
node APP/audit_app.mjs
```
