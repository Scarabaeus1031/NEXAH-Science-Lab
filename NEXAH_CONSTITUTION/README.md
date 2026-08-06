# NEXAH Constitution

Status: `CONSTITUTION ADOPTED`

Architecture: `FROZEN`

Authority: `Owner decision`

Operational effect: `NONE`

## Purpose

This package is the constitutional layer above OLS, ORION, IRIS, Translation,
SIRIUS and Applications.

It governs authority. It does not define implementation, runtime order,
repository placement or scientific truth.

## Constitutional documents

- **Ecosystem Constitution** — this README and Parts I–VI below govern
  organizational authority, responsibilities, lifecycle and repository-level
  governance.
- [Scientific Constitution](SCIENTIFIC_CONSTITUTION.md) — defines the enduring
  scientific direction of NEXAH: orientation across representations, typed
  translation, structural identity, evidence discipline, provenance and
  bounded claims.

The Ecosystem Constitution governs authority and organization. The Scientific
Constitution governs scientific interpretation and methodological discipline.
They are complementary documents with different scopes; neither scope is
transferred by reference to the other.

The Scientific Constitution does not modify governance authority, OLS, program
status or repository permissions.

## Constitutional hierarchy

```text
HANDLUNGSHOHEIT
        │
Constitution
        │
Authorities
        │
OLS
        │
ORION
        │
IRIS
        │
Translation
        │
SIRIUS
        │
Applications
```

This is a constitutional responsibility hierarchy. It is not an execution
graph. No software component acquires authority through its position in this
sequence.

## Constitutional invariant

Authority is bounded.

Authority is explicit.

Authority is never inferred.

Authority is never transferred by use.

Authority is never created by implementation.

Authority always identifies:

- owner;
- scope;
- exclusions;
- dependencies;
- artifact class.

## Package

1. [`PART_I_PRINCIPLES.md`](PART_I_PRINCIPLES.md) — adopted Articles 1–14.
2. [`PART_II_AUTHORITIES.md`](PART_II_AUTHORITIES.md) — bounded authority
   classes and Authority Map.
3. [`PART_III_RESPONSIBILITIES.md`](PART_III_RESPONSIBILITIES.md) — authority
   ownership by architectural responsibility.
4. [`PART_IV_GOVERNANCE.md`](PART_IV_GOVERNANCE.md) — constitutional custody
   and decision boundaries.
5. [`PART_V_CHANGE_MANAGEMENT.md`](PART_V_CHANGE_MANAGEMENT.md) — mandatory
   review questions and STOP rule.
6. [`PART_VI_GLOSSARY.md`](PART_VI_GLOSSARY.md) — canonical constitutional
   terms.

## Boundary

This freeze does not:

- rename a repository;
- move an implementation;
- modify certified ORION;
- modify OLS;
- implement IRIS;
- implement SIRIUS;
- authorize Phase 2 implementation.

## Phase result

```text
STATUS: CONSTITUTION ADOPTED
ARCHITECTURE: FROZEN
IMPLEMENTATION: UNCHANGED
NEW CODE: NONE
FILES MOVED: 0
REPOSITORIES RENAMED: 0
CERTIFIED ORION MODIFIED: NO
OLS MODIFIED: NO
NEXT PHASE: Phase 2 — Canonical Integration Planning
```
