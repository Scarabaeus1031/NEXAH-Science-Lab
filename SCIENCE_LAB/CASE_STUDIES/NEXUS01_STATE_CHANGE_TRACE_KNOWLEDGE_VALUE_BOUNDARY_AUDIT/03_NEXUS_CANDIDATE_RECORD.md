# Nexus Candidate Record

## Neutral candidate

```text
NexusRecord {
  nexus_id,
  entity_ref,
  state_ref,
  time_ref,
  frame_ref,
  representation_ref,
  observation_refs[],
  provenance_ref
}
```

Each field already resolves to an existing identity, state, frame,
representation/observation and provenance record. The new ID binds a reviewable
association at a declared scope; it does not add a new physical fact merely by
collecting references.

`NEXUS_STATUS=DERIVED_RECORD_USEFUL`

## Invariants and validation

- referenced state must belong to or be explicitly related to the entity;
- time/revision and representation domain must be compatible;
- frame and coordinate interpretation must be declared;
- observations cite their own events and lineage;
- missing or unresolved references remain explicit;
- correction creates a new revision rather than rewriting provenance.

Nexus does not mean center, origin, zero, truth, observer, consciousness,
singularity or cause. Removing the word “Nexus” leaves an ordinary typed binding
record with the same content.
