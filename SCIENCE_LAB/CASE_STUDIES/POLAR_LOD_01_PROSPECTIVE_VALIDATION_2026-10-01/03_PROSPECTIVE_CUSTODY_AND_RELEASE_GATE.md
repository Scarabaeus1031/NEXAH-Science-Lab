# POLAR-LOD-01 — prospective custody and release gate

Date: 2026-10-02
Status: `IMPLEMENTED / COLLECTION_RELEASE_NOT_GRANTED / NO OUTCOME ACCESS`

## Purpose

This package prepares the R1/R2 evidence chain without opening the prospective
C04 target values or running a model. It does not close the 180-day R3 window
and does not grant R6 execution authority.

## Frozen collection boundary

`CUSTODY_CONTRACT.json` fixes the one C04 URL, the GFZ EAM archive index and
the EAM vintage filename grammar. `run_prospective_custody.py` is the sole
documented entrypoint and resolves the bound interpreter. The underlying
`prospective_custody.py` verifies the
contract hash compiled into the collector, the reviewed runtime receipt and
actual interpreter binary hash, and requires the canonical Human Owner
release record, fetches opaque bytes, and records:

- requested and final URL;
- retrieval start and finish in UTC;
- selected HTTP response metadata;
- byte count and SHA-256;
- private raw-file path;
- release-record SHA-256;
- previous and current ledger-entry hashes;
- filename-derived EAM Issue Date and provisional cutoff admissibility where
  applicable. Final admission additionally requires the later frozen parser to
  confirm that the embedded Issue Date matches the filename-derived date.

The collector does not parse C04 rows, inspect LOD values or evaluate any
model. Raw responses and receipts live in a private custody root outside Git.
The acquisition process opens the JSONL ledger append-only, hash-chains and
fsyncs every entry, and never overwrites existing raw or receipt paths. A local
hash chain alone is not independent timestamp evidence: every capture must
also export a content-free ledger-head anchor. A receipt becomes admissible
only after that anchor is committed and pushed to the remote Git repository
before outcome inspection. Rewriting the private ledger would then conflict
with the externally anchored head.

Ledger verification uses:

```text
./run_prospective_custody.py verify-ledger --custody-root <private-root>
```

## Release separation

`HUMAN_OWNER_RELEASE.json` is deliberately `NOT_GRANTED`. Collection is
blocked unless the Human Owner explicitly changes and commits it to:

- `status: COLLECTION_AUTHORIZED`;
- `collection_authorized: true`;
- `execution_authorized: false`;
- a named owner and UTC authorization time;
- exact scope `c04`, `eam_index`, `eam_vintage`.

This collection release would authorize only byte custody. It would not permit
content inspection, feature construction, scoring or prospective execution.
A later execution release remains a separate decision after R1–R5 close.

## Verification

The local test suite covers contract/runtime identity, wrong-interpreter and
fail-closed release rejection, strict requested/final URL allowlisting,
allowlisted redirects, filename-derived Issue Dates, two-entry hash chaining,
ledger and raw-byte
tamper detection, external anchor contents, EAM cutoff admission and
late-vintage rejection. Full capture additionally requires HTTP 200,
non-empty bytes and a matching Content-Length when supplied. No network
request is made by the tests.

## Current decision

The custody implementation is ready for independent review. Collection has
not started because Human Owner authority is absent. R2 chronology and R3
minimum-window accumulation therefore remain open. No prospective values were
accessed and no Research Result was created.
