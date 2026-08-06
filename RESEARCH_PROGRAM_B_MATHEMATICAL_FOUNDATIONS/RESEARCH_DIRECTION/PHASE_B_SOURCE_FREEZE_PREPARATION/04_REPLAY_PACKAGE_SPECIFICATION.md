# Replay Package Specification

Status: `TEMPLATE — REPLAY PACKAGE NOT CREATED`

## Purpose

Prepare the future self-contained package through which an independent team may
implement and replay Program G Protocol 1.0 without repository history,
originating code, NEXAH terminology or expected results.

This document does not create, release or execute that package.

## Replay manifest template

| Field | Value |
|---|---|
| replay package ID | `UNASSIGNED` |
| package version | `UNASSIGNED` |
| protocol version | `1.0 — not yet canonically bound` |
| scientific object ID | `UNASSIGNED` |
| canonical archive hash | `ABSENT` |
| release date | `UNASSIGNED` |
| release authority | `UNASSIGNED` |
| independent replay team | `UNASSIGNED` |
| review state | `NOT OPEN` |

## Required package artifacts

The future immutable archive shall contain:

```text
README.md
AUTHORITY.md
PROTOCOL.md
protocol_manifest.json
scientific_object.json
source_samples.csv
input_dictionary.md
result_schema.json
validation_checklist.md
non_claims.md
provenance_appendix.md
SHA256SUMS
```

Every file must be canonically frozen before release.

## Required content

### README

- bounded scientific question;
- package verification order;
- implementation independence rule;
- STOP conditions;
- return-package instructions.

### Authority

- signed release authorization;
- named scientific and freeze owners;
- named protocol and validation reviewers;
- explicit execution and output boundary;
- Human decision owner.

### Protocol and scientific object

- complete Program G Protocol 1.0 in ordinary scientific language;
- exact source identities, samples, matrices, norm and tolerances;
- output schemas and terminal decision table;
- exclusions and non-claims.

### Integrity

- complete SHA-256 inventory;
- immutable archive identity;
- no mutable external dependency;
- no expected-result leakage.

## Excluded artifacts

The pre-execution replay package shall exclude:

- originating Lab 0.4 JavaScript implementation;
- originating tests;
- originating HTML interface;
- originating execution outputs;
- expected pair classifications;
- expected partitions;
- expected terminal result;
- masks, depth diagnostics and visualizations;
- repository history not required for provenance verification;
- OLS, ORION, IRIS or application artifacts;
- publication graphics or narrative.

The source-file hashes may appear in the provenance appendix. The source code
itself must not be supplied to the independent implementation team before its
result is frozen.

## Replay instructions

The future independent team shall:

1. verify the archive and every file hash;
2. review the protocol before implementation;
3. record conflicts and clarification requests;
4. implement independently without access to originating code or outputs;
5. freeze its implementation and environment;
6. validate input before transformation;
7. write evidence before interpretation;
8. apply the terminal decision mechanically;
9. preserve failures and deviations;
10. freeze its return package before comparison;
11. return the complete package to the named comparison reviewer.

No step is performed in Phase B.

## Future return package

```text
implementation_manifest.json
implementation_source/
environment_lock/
run_manifest.json
projected_samples.csv
pair_discrepancies.csv
view_partitions.json
validation_results.json
terminal_result.json
bounded_result.md
deviation_log.md
file_hashes.sha256
```

## Reviewer expectations

The Protocol Reviewer shall confirm before release that:

- the package is scientifically complete;
- the question is implementable without repository history;
- definitions and schemas are unambiguous;
- no expected result is exposed.

The Validation Reviewer shall confirm after a later run that:

- implementation and evidence conform;
- all gates ran in order;
- no threshold or source changed;
- the terminal class follows mechanically.

The comparison reviewer shall compare packages only after both results are
frozen.

## Package-creation gate

Do not create the replay archive until the source freeze, scientific object,
roles and freeze checklist are all approved.
