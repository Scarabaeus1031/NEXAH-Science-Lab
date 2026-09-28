# NEXAHEDRON Integration and UX Review

**Date:** 2026-09-28  
**Decision:** `RECORDED / NOT AUTHORIZED FOR BUILD`  
**WP5 relation:** future presentation candidate only  
**Owner instruction:** aufnehmen, aber noch nicht bauen

## Short decision

NEXAHEDRON is a plausible future Human-facing surface for one bounded NEXAH
Compare case. No integration is authorized now. WP5 remains scientifically on
HOLD and operationally PARKED because the independent equal-information
baseline and blinded adjudication were not run. The frozen Gate-1 stop rule
therefore continues to prohibit UI work following from WP5.

The future Compare view and the already-started Guided Orientation prototype
are two different objects and must remain separate.

## Candidate A — future NEXAH Compare case view

The smallest honest future shape is one allowlisted, read-only case page, for
example `/cases/family-office-refinancing`:

```text
Science Lab evidence and result status
  -> verified NEXAH Compare record, report and replay receipt
  -> read-only presentation adapter
  -> NEXAHEDRON curated case view
  -> Human inspection and STOP
```

Authority remains separated:

- Science Lab owns the evidence package and scientific status.
- NEXAH Core owns the ComparisonRecord, deterministic comparison, report and
  replay verification.
- A later adapter may project already-verified fields for presentation but may
  not calculate, reinterpret or repair them.
- NEXAHEDRON may own presentation and interaction only.
- The Human retains interpretation, decision, abstention and STOP.

This candidate must not be inserted as a seventh THE EYE demonstration. THE
EYE's current A2/A5/A6 path is a closed six-demo projection with a different
contract and authority boundary. A NEXAH Compare view requires its own bounded
presentation contract and separate authorization.

The future view may present the question, the two normalized analyses, the
five seeded issue classes, the retained invariant, abstentions, integrity and
replay information, the claim ceiling and the Human disposition. Historical
multi-AI returns may appear only as unscored lineage because their original
transcripts and equivalent execution metadata are incomplete.

## Candidate B — existing Guided Orientation PATH A prototype

Repository review found an already-started local, untracked prototype at
`/guided`. Its local registry contains fourteen fixed operators:

```text
OPEN -> SOURCE -> ASSUMPTION -> FEELING -> MISSING
-> SELF_VIEW -> OTHER_VIEW -> SYSTEM_VIEW
-> CHANGE -> REMAIN -> MOVE -> BOUNDARY -> REVERSIBILITY -> RETURN
```

The implementation is intentionally browser-memory-only, Human-authored and
deterministic. It calls neither ORION nor the Gateway, creates no evidence and
does not interpret or recommend. These are appropriate technical boundaries.

The current UX, however, has an unresolved value-and-effort problem:

- the visitor must pass an entrance, an opening statement, an opening reason
  and a separate confirmation before the main sequence;
- twelve subsequent free-text questions are then presented one at a time;
- most questions are skippable, but the visible progress still announces a
  fourteen-step path;
- the useful Terrain Map appears only at the end;
- repeated boundary and nonclaim language protects authority but increases
  cognitive load before the visitor experiences a concrete benefit;
- no independent comprehension or completion evidence establishes that a new
  visitor understands the purpose, reaches Rest or finds the result useful.

The present prototype is therefore classified as:

`IMPLEMENTED_LOCAL_PROTOTYPE / UX_NOT_VALIDATED / NOT_ACTIVE / NOT_PUBLICLY_ADOPTED`

The observed problem is not that the questions are conceptually wrong. It is
that the interface asks for substantial work before demonstrating why that
work is useful. Any later UX repair should begin with an observed first-use
test and test whether a much shorter first return can expose value before the
full optional depth is offered. This review does not select or authorize such
a redesign.

## Separation rule

| Object | Present state | Main unresolved gate |
|---|---|---|
| Guided Orientation PATH A | local prototype exists | first-use comprehension, effort and value are unvalidated |
| NEXAH Compare Family Office view | architecture candidate only | WP5 lacks the frozen overall pass required before UI |
| THE EYE six-demo result view | implemented bounded path | closed A2-specific catalog; not a general Compare host |

No code, route, catalog, public claim, deployment or active workstream is
authorized by this record. A later Owner decision must select exactly one
bounded outcome and define its acceptance test before implementation begins.
