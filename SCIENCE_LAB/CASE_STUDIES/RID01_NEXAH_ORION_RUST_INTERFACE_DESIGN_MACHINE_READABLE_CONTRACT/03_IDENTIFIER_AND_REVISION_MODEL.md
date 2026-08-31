# Identifier and Revision Model

## Global IDs

Every registered object uses:

```text
urn:nexah:rid01:<namespace>:<KIND>:<token>
```

The namespace provides administrative scope; the full URN must be unique in the registry. Provenance, rules, events, results, executions and histories therefore have independent identities even when their payloads compare equal.

## Local IDs

Vertices, edges, relations, constraints, anchors, rays and junctions use compact local IDs unique within one graph revision. Moving a local member between graphs requires an explicit correspondence; the spelling alone does not preserve identity.

## Revisions

`RevisionRef = { object_id, revision_id }`. Revisions are positive decimal integers represented as strings. A published revision is immutable. Any semantic, structural or required-field change creates a new revision; prior bytes and provenance remain addressable.

Schema versions use semantic versioning. Object revision and schema version are independent. Same object ID with different revision does not mean equal state; equality still requires a criterion.

