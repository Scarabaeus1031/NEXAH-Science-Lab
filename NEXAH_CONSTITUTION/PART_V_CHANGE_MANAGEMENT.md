# Part V — Change Management

Status: `MANDATORY CONSTITUTIONAL GATE`

## Review questions

Every future architecture proposal shall first answer:

1. Which authority owns this?
2. Does this duplicate an existing authority?
3. Does this transfer authority?
4. Does this create an authority leak?
5. Is Handlungshoheit preserved?

The proposal shall also identify:

- owner;
- scope;
- exclusions;
- dependencies;
- artifact class.

## STOP rule

If any answer violates the Constitution:

```text
STOP
ARCHITECTURE REVISION REQUIRED
```

No implementation, repository placement, execution order, repeated use or
technical dependency may bypass this gate.

## Change classes

| Change | Constitutional review required? | Reason |
|---|---:|---|
| Editorial correction without changed meaning | No | Authority and scope remain unchanged |
| Artifact format change with complete authority preservation | Bounded review | Fidelity and provenance must be verified |
| Authority scope change | Yes | Constitutional boundary changes |
| Authority owner change | Yes | Custody changes |
| New artifact class | Yes | Ownership must be assigned without duplication |
| Cross-authority handoff change | Yes | Transfer and leak risk |
| Implementation-only change | No constitutional change by default | Implementation cannot create authority |
| Repository move or rename | No authority change by default | Placement does not transfer authority |
| Delegation of Human decision to software | Prohibited | Violates Handlungshoheit |

## Required result

A constitutional review shall return exactly one result:

- `CONFORMING`;
- `CONFORMING WITH EXPLICIT BOUNDARY`;
- `STOP — ARCHITECTURE REVISION REQUIRED`.

Silence, implementation success and absence of objection do not constitute
constitutional adoption.
