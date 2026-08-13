# Architecture continuity invariant

Status: governance/maintenance design  
Effective baseline date: 2026-08-11  
Automatic authority transfer: prohibited

## Core invariant

> **Every CLOSED Labreport and every material architecture change must receive
> an explicit architecture-impact disposition. Until an Owner decision and
> verified canonical synchronization exist, the default is `NOT_ADOPTED`.**

This invariant creates a review obligation, not adoption. A ledger entry,
impact label, queue item, reference, visual, hash or automated check can never
grant semantic, scientific, product, interface or release authority.

## Architecture-impact dispositions

Exactly one primary disposition is required; secondary flags may be added:

- `NO_ARCHITECTURE_IMPACT`
- `ARCHITECTURE_CANDIDATE`
- `CAPABILITY_CANDIDATE`
- `INTERFACE_IMPACT`
- `CONTRADICTION_OR_REVISION_CANDIDATE`
- `NEGATIVE_EVIDENCE`
- `REQUIRES_OWNER_REVIEW`

Default adoption state: `NOT_ADOPTED`.

## Direction A — Lab to architecture

When a Labreport becomes `CLOSED`, its closer must create or update one ledger
row:

1. record immutable Labreport ID, source path/URI and hash;
2. select the architecture-impact disposition;
3. name affected authorities/systems, or `NONE`;
4. record conflicts and dependencies by reference, not copied evidence;
5. set whether Owner review is required;
6. leave adoption at `NOT_ADOPTED` unless an explicit Owner decision exists;
7. if adopted, list exact canonical targets and add/update one queue item;
8. verify target hashes after authorized changes and then mark `CURRENT`.

`CLOSED` does not mean `ADOPTED`. Most reports should end at
`NO_ARCHITECTURE_IMPACT / NOT_ADOPTED / NOT_APPLICABLE`.

## Direction B — Architecture to ecosystem

Every adopted material architecture change triggers a downstream assessment
against:

- ORION Master Architecture, ADRs, indexes and Ownership;
- NEXAH architecture/governance;
- NEXAHEDRON / Experience architecture;
- interface and membrane records;
- Library / Living Atlas relationships;
- architecture plates;
- the Master Ecosystem Visual;
- public explanatory documentation.

Affected targets enter the single update queue inside the status ledger. The
assessment does not write to another repository. Only separately authorized
changes may satisfy a queue item.

## Event and review cadence

The event-level disposition is sufficient after each Labreport; a full
reconciliation is not required. Run the drift check:

- after an Owner architecture decision;
- before a major release, public architecture publication or Master Visual
  refresh;
- after a material interface/ownership change;
- once per active quarter as a lightweight hygiene check.

At those gates, reconcile only findings, freeze a new baseline when necessary,
and refresh derived visuals only if their baseline changed.

## Minimal operating loop

```text
CLOSED LABREPORT OR MATERIAL ARCHITECTURE CHANGE
  -> ONE LEDGER ROW / DISPOSITION
  -> OWNER REVIEW ONLY IF REQUIRED
  -> ONE UPDATE QUEUE ITEM PER COHERENT CHANGESET
  -> AUTHORIZED TARGET UPDATE
  -> DRIFT CHECK
  -> CURRENT OR EXACT FINDING
```

