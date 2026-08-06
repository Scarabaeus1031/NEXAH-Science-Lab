# Execution Gate

Status: `CLOSED — EXECUTION PROHIBITED`

## Purpose

Define the conditions that must exist before a Human may consider authorizing
one execution of Program G Protocol 1.0.

This document grants no execution authority.

## Required prior states

Every state must be established by evidence:

```text
CANONICAL SOURCE FREEZE: COMPLETE
CANONICAL INPUT: COMPLETE
SCIENTIFIC OBJECT: ADOPTED
PROTOCOL 1.0: ADOPTED BY HASH
REPLAY PACKAGE: SEALED
SCIENTIFIC ROLES: ASSIGNED
PROTOCOL REVIEW: PASS
FREEZE VALIDATION: PASS
EXECUTION ENVIRONMENT: PINNED
OUTPUT BOUNDARY: APPROVED
```

Any missing state keeps the gate closed.

## Required execution authority record

A separate future Human decision must identify:

- execution ID;
- scientific object ID and hash;
- protocol version and hash inventory;
- canonical input hash;
- execution owner;
- validation reviewer;
- permitted implementation repository or bounded workspace;
- pinned environment;
- read-only input location;
- permitted output location;
- start condition;
- STOP conditions;
- failure-preservation rule;
- return destination;
- explicit prohibition on follow-on analysis.

The source-freeze decision may not substitute for this record.

## Pre-execution validation

Before access to the canonical input:

1. verify every source, input, protocol and package hash;
2. verify role assignments and independence;
3. verify clean execution workspace;
4. verify pinned implementation and environment;
5. verify output boundary is empty or assigned to a new run ID;
6. verify no expected result is available to the executor;
7. verify all STOP rules are machine- and reviewer-visible;
8. return to the Human decision owner for final authorization.

## Prohibited actions while gate is closed

- run the originating test;
- generate `source_samples.csv`;
- implement the Program G calculation;
- calculate projections or partitions;
- create an originating result;
- create or release a replay archive;
- provide expected results to a replay team;
- contact external reviewers;
- publish;
- alter thresholds, matrices, maps or source values;
- infer authorization from preparation completeness.

## STOP conditions

STOP when:

- any canonical artifact is missing or mutable;
- a hash differs;
- a role is unassigned or independence fails;
- the source or protocol changed after review;
- the execution environment is not pinned;
- the output boundary is ambiguous;
- expected-result leakage occurred;
- scope expansion is requested;
- a Human execution decision is absent.

## Human authority

Only an identified Human exercising Handlungshoheit may open the execution
gate. Software, documentation completeness, a passing checklist or repository
state cannot authorize execution.

## Current decision

```text
EXECUTION_GATE: CLOSED
EXECUTION_AUTHORIZED: NO
NEXT_PERMITTED_ACTION: OWNER REVIEW OF PHASE B
```

A future owner review may approve freeze preparation, return defects or
authorize a distinct freeze operation. It may not silently authorize execution.
