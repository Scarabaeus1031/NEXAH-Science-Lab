# Source Freeze Manifest

Status: `TEMPLATE — FREEZE NOT PERFORMED`

## Manifest identity

| Field | Prepared value |
|---|---|
| freeze manifest ID | `UNASSIGNED` |
| source object name | `Lab 0.4 finite source family` |
| scientific title | `Finite Identifiability Classification Under Four Orthographic Projections` |
| freeze version | `UNASSIGNED` |
| adoption date | `UNASSIGNED` |
| freeze status | `NOT FROZEN` |
| source-freeze authority record | `ABSENT` |

No value in this template establishes adoption.

## Repository identity

### Observed repository

| Field | Phase A observation |
|---|---|
| repository label | `NEXAH_CONTROL_DESK` |
| local root | `../NEXAH_CONTROL_DESK` relative to the Science Lab workspace |
| configured remote | `NONE OBSERVED` |
| observed branch | `main` |
| observed HEAD | `30bd819e2c36a97e4985d513eb7130afbea7fcbf` |
| observed worktree | `DIRTY` |
| Lab 0.4 source state | `UNTRACKED` |

The observed HEAD does not identify the Lab 0.4 files. It is not eligible as
the canonical source commit.

### Required canonical identity

The future freeze record must identify:

- the exact repository root;
- repository owner;
- configured remote or an explicit local-only designation;
- clean branch;
- tracked source files;
- exact commit hash containing every frozen source file;
- proof that the commit resolves to the declared bytes;
- any signed tag or release identifier, if required by the owner.

All fields remain `UNASSIGNED` until owner-approved freeze execution.

## Candidate file inventory

Base candidate path:

```text
ROEDELHEIM_OBSERVATORY_BUNDLE/
```

| Candidate file | Candidate role | Scientific status |
|---|---|---|
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_MODEL_0_4.js` | originating deterministic source generator | source-freeze candidate; not scientific input |
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.test.js` | originating invariant checks | validation provenance; not expected-result authority |
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.md` | source boundary and non-claims | provenance and interpretation boundary |
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.html` | originating interface | presentation provenance; excluded from scientific object |

The owner must accept or reject this candidate set as one bounded decision. No
file is frozen by being listed here.

## Candidate SHA-256 inventory

The observed hashes are recorded in
[`../PHASE_A_PROVISIONAL_HASH_INVENTORY.md`](../PHASE_A_PROVISIONAL_HASH_INVENTORY.md).

Future manifest fields:

| Field | Value |
|---|---|
| candidate hashes independently recomputed | `NOT RUN` |
| candidate hashes matched to tracked commit | `NOT RUN` |
| canonical hash inventory | `ABSENT` |
| hash inventory reviewer | `UNASSIGNED` |
| owner adoption | `NOT GRANTED` |

Observed hashes must be recomputed from the clean tracked candidate commit. The
future freeze record must not copy them without verification.

## Provenance references

Required provenance chain:

1. Control Desk Rödelheim bundle index;
2. Lab 0.4 source note, model, test and interface;
3. How a World Is Held provenance bridge;
4. Program C claim C-46;
5. Program B mathematical foundations;
6. Program E scientific position;
7. Program F primary-chain specification;
8. Program G Protocol 1.0;
9. adopted Research Position;
10. adopted Phase A evidence consolidation.

The future manifest shall record exact paths, commit identities and SHA-256
values for every source required to establish the byte-level chain.

## Source snapshot content

The future canonical source snapshot shall contain only:

- the owner-approved candidate files;
- a canonical file inventory;
- SHA-256 values derived from the tracked commit;
- repository and commit identity;
- adoption and role records;
- provenance references;
- explicit exclusions.

It shall not contain generated scientific results.

## Exclusions

Excluded from source authority unless separately approved:

- images and posters;
- other Rödelheim Labs;
- astronomy and cosmology material;
- mask classifications as primary identifiability evidence;
- historical expected partitions;
- generated CSV or result files;
- originating execution outputs;
- OLS, ORION, IRIS or SIRIUS artifacts;
- application and publication material.

## Freeze condition

This template may become a freeze manifest only after every item in
[`06_FREEZE_CHECKLIST.md`](06_FREEZE_CHECKLIST.md) passes and an identified
Human records an explicit owner decision.
