# Phase A — Evidence Consolidation

Status: `COMPLETE — SOURCE LOCATED; FREEZE INCOMPLETE`

Authority: `Thomas — Phase A documentation authorized`

Mode: `READ-ONLY EVIDENCE AUDIT`

Operational effect: `NONE`

Audit date: `2026-08-01`

## Purpose

Establish provenance, replay readiness and the bounded mathematical object
before any theorem, experiment or publication claim.

This audit did not execute Lab 0.4, export scientific data, create a replay
package, appoint reviewers or freeze a source snapshot.

## Result

```text
SOURCE_OBJECT: LOCATED
PROVENANCE_CHAIN: PARTIAL
OBSERVED_FILE_HASHES: RECORDED
CANONICAL_SOURCE_SNAPSHOT: NOT FROZEN
CANONICAL_INPUT_CSV: ABSENT
PROTOCOL_DEFINITIONS: COMPLETE AS DOCUMENTATION
REPLAY_PACKAGE: ABSENT
INDEPENDENT_REPLAY: NOT RUN
REPLAY_READINESS: NOT READY
THEOREM_READINESS: NOT READY
PUBLICATION_READINESS: NOT READY
```

## Source trace

The finite object originates in the adjacent Control Desk bundle:

```text
NEXAH_CONTROL_DESK/
└── ROEDELHEIM_OBSERVATORY_BUNDLE/
    ├── ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.md
    ├── ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_MODEL_0_4.js
    ├── ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.test.js
    └── ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.html
```

The bundle index identifies these four files as the controlled Lab 0.4 sidecar.
The provenance bridge records the bounded result and states that Lab 0.4 is not
extended by the later editorial project.

Scientific reduction proceeds through:

```text
Lab 0.4 source bundle
↓
Program C claim C-46
↓
Program B mathematical question
↓
Program E inverse-problems positioning
↓
Program F finite-chain specification
↓
Program G Protocol 1.0
↓
current Research Position
```

## Repository-state finding

### Control Desk source

Observed repository state:

```text
BRANCH: main
HEAD: 30bd819e2c36a97e4985d513eb7130afbea7fcbf
WORKTREE: DIRTY
LAB_0_4_FILES: UNTRACKED
```

The Control Desk commit does not identify the Lab 0.4 bytes. No Git history was
found for the four source files. The recorded SHA-256 values therefore describe
only the observed working-copy files on the audit date.

### Science Lab protocol

Observed repository state:

```text
BRANCH: main
HEAD: UNBORN
PROGRAM_G_FILES: UNTRACKED
```

Program G is complete as documentation but has no Git-backed revision identity
in this workspace. Its observed hashes are recorded separately and are not an
adopted freeze manifest.

See [`PHASE_A_PROVISIONAL_HASH_INVENTORY.md`](PHASE_A_PROVISIONAL_HASH_INVENTORY.md).

## Bounded mathematical object

Program G defines the intended object:

```text
O = (S, J, X, Θ, H, τ_sci)
```

| Component | Current definition | Phase A finding |
|---|---|---|
| `S` | `{A,B,C,D}` | present in model, test, Lab note and protocol |
| `J` | `{0,…,120}` | present in the 121-sample test fixture and protocol |
| `X` | 484 labeled samples in `R³` | generative source exists; canonical table absent |
| `Θ` | `{0,90,180,270}` | present in source and protocol |
| `H` | four fixed `2×3` matrices | frozen by Program G; original source computes the same named views through trigonometric evaluation |
| `τ_sci` | `1×10^-9` | frozen by Program G for whole-record displayed-coordinate equivalence |

The source model defines four deterministic coordinate formulas. The existing
test invokes `generateFamily(121)`, assigns sample index `0…120`, computes phase
as `index/120`, and rounds phase and source coordinates to twelve decimal
places.

This is sufficient to locate the intended source family. It is not sufficient
to establish canonical input bytes because the export procedure, decimal text
format and source-to-CSV review have not been adopted.

## Evidence located

| Evidence | Located? | Authority and limitation |
|---|---:|---|
| Lab 0.4 scientific note | yes | bounded source statement; untracked working-copy file |
| deterministic source model | yes | originating implementation; not the canonical scientific input |
| nineteen-check test source | yes | test specification located; not executed in Phase A |
| HTML interface | yes | presentation and boundary statements; not scientific input |
| bundle index | yes | identifies Lab files; no file-level Lab 0.4 freeze manifest |
| provenance bridge | yes | historical source route; not independent scientific evidence |
| C-46 claim record | yes | internally supported simulation claim; no independent source |
| Program F finite specification | yes | scientific reduction and missing-evidence record |
| Program G Protocol 1.0 | yes | complete protocol documentation; execution unauthorized |
| saved Lab 0.4 test result | no | passing result is stated in documentation; no hashed run record located |
| independent derivation | no | required by Program F; not located |
| independent replay | no | not authorized or performed |

## Replay-readiness matrix

| Requirement | State | Evidence or blocker |
|---|---|---|
| scientific question | `READY` | Program G Protocol 1.0 |
| finite scope | `READY` | four sources, 121 matched samples, four views |
| source formulas | `LOCATED` | Lab 0.4 model |
| observation matrices | `READY` | Program G frozen matrices |
| equivalence norm and tolerance | `READY` | maximum norm, `≤ 1×10^-9` |
| result classes and STOP rules | `READY` | Program G protocol and validation documents |
| canonical source revision | `BLOCKED` | originating files are untracked |
| canonical `source_samples.csv` | `BLOCKED` | file does not exist |
| coordinate semantics | `BLOCKED` | units or dimensionless status not formally declared |
| canonical decimal serialization | `BLOCKED` | twelve-place model rounding observed; export format not adopted |
| source export method | `BLOCKED` | absent |
| export reviewer | `BLOCKED` | unnamed |
| protocol adoption signature | `BLOCKED` | research position adopted; Protocol 1.0 execution freeze not signed |
| scientific owner | `BLOCKED` | no accountable inverse-problems owner named |
| freeze owner and input custodian | `BLOCKED` | unnamed |
| protocol reviewer | `BLOCKED` | unnamed |
| execution owner | `BLOCKED` | unnamed; execution not authorized |
| validation reviewer | `BLOCKED` | unnamed and must be independent of implementation |
| input and replay manifests | `BLOCKED` | not created |
| output boundary | `BLOCKED` | no permitted later execution location named |
| independent replay group | `BLOCKED` | not selected |

## Provenance assessment

`PARTIAL`

The conceptual chain is traceable from Lab 0.4 through Programs C–G. The
byte-level chain is not yet canonical because:

- the originating files are untracked;
- no adopted source manifest binds their hashes;
- the canonical CSV has not been exported;
- no reviewed export connects model output to CSV bytes;
- no signed freeze record binds Program G to those inputs.

Observed working-copy hashes improve inspectability. They do not establish
authority, adoption or immutability.

## Reproducibility assessment

`NOT READY`

The protocol is sufficiently specified for package preparation. It is not
replayable by an independent group because the required self-contained replay
archive does not exist and its primary scientific input is absent.

The existing JavaScript model is the originating implementation. It may be used
to establish source provenance under an approved export process. It must not be
included in the pre-execution independent replay package.

## Interpretation boundary

Phase A establishes only:

- source files exist;
- their current bytes are observable and hashable;
- their formulas and test fixture align with the intended finite object;
- Program G defines a bounded protocol;
- the canonical freeze and replay package remain incomplete.

Phase A does not establish:

- that the documented nineteen tests currently pass;
- that Program G reproduces the historical result;
- that the source export is canonical;
- that the experiment is independently reproducible;
- a theorem;
- novelty;
- publication readiness.

## Required next gate

Owner review is required before any freeze preparation.

If Phase A is accepted, the next separately authorized action should remain
non-executing:

1. name the scientific owner, freeze owner, input custodian and independent
   protocol reviewer;
2. decide whether the four observed Lab 0.4 files are the source-freeze
   candidates;
3. approve one deterministic export specification for the 484-row CSV;
4. declare coordinate semantics and decimal serialization;
5. create, hash and review the canonical input and replay packages without
   running the protocol;
6. return for a separate execution decision.

```text
PHASE_A_RESULT: SOURCE LOCATED; FREEZE INCOMPLETE
NEXT_PERMITTED_ACTION: OWNER REVIEW
OPERATIONAL_EFFECT: NONE
```
