# Independent Replay Package Specification

## Purpose

Permit an independent research group to implement and replay Protocol 1.0 without access to repository history, originating code, visual material, or NEXAH terminology.

## Package boundary

The replay package is a self-contained immutable archive. Program G specifies it but does not create it.

## Required top-level files

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

No originating implementation source code, generated result, expected partition, or visualization belongs in the pre-execution package.

## Independent-group instructions

The package must tell the group to:

1. verify archive and file hashes;
2. read the scientific protocol before implementing;
3. create its own implementation without inspecting originating implementation code;
4. record language, compiler/interpreter, numeric representation, dependencies, and environment;
5. run all validation gates in order;
6. write evidence before interpretation;
7. assign one terminal result mechanically;
8. preserve failures and STOP;
9. return the complete run package without modifying the supplied archive.

## Required replay return package

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

The implementation is required for audit but is not scientific evidence by itself.

## Implementation independence

- no copying or translation of originating code;
- no access to originating outputs before the replay result is frozen;
- no communication of expected partitions or terminal class;
- no shared computational helper supplied by the originating group;
- public general-purpose libraries allowed if declared;
- implementer may ask only protocol-clarification questions; each answer becomes a versioned clarification record distributed to all reviewers.

## Scientific invariants during replay

- supplied package remains read-only;
- input hashes unchanged;
- one run ID per attempt;
- no parameter tuning;
- no data filtering or preprocessing;
- no extra view or diagnostic enters the result;
- no failed run is overwritten;
- no interpretation before evidence freeze;
- no repository-specific term is required to understand the protocol.

## Replay comparison

An authorized comparison reviewer receives the originating conforming result only after the independent result is frozen. Comparison uses exact categorical equality and the fixed numeric replay tolerance.

## Replay outcomes

| Outcome | Meaning |
|---|---|
| `REPRODUCED` | all categorical outputs match and numeric diagnostics satisfy replay tolerance |
| `NOT REPRODUCED` | at least one categorical output differs or numeric replay tolerance fails |
| `REPLAY INVALID` | independent run violates package, implementation, validation, or freeze requirements |
| `REPLAY INCONCLUSIVE` | apparently conforming packages disagree and the cause cannot be classified without protocol change |

Replay outcomes do not replace the scientific terminal result.

## Replay STOP conditions

- archive or file hash mismatch;
- missing protocol clarification needed for implementation;
- access to originating result before replay freeze;
- reused originating implementation;
- mutable input or threshold;
- validation failure;
- comparison performed before both packages are frozen;
- request to broaden the scientific claim.

## Package acceptance gate

Before release, the scientific owner, freeze owner, and validation reviewer must each attest that the archive is self-contained, scientifically complete, history-independent, and free of expected-result leakage.
