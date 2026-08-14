# Epistemic and Negative-History Review

## Epistemic dimensions

The top-level five dimensions are genuinely conceptually independent. D proves the needed combination: implementation `PARTIAL`, execution `REPRODUCED`, reproducibility `REPRODUCIBLE`, provenance `PARTIAL`, and claim support `MIXED`, with an individual scientific claim `REJECTED`. Execution does not promote interpretation.

However, each dimension is duplicated under `dimensions.<name>.value`, where the schema accepts any nonempty string and does not require equality with the controlled top-level enum. A schema-valid record can say `execution_status: REPRODUCED` and `dimensions.execution.value: FAILED`. This is a blocking internal-consistency defect, not a scientific-truth problem.

## Negative history

Within C and D, rejected claims remain addressable beside replacements or partial claims. But append preservation is normative prose plus self-declared metadata. A later record can use a new `record_id`, set `supersedes_record_id: null`, and leave `prior_claim_ids: []`; it remains schema-valid. Even within an asserted revision chain, the author controls the list against which retention would be checked.

One bounded revision must add a stable series/edge-history identity and a required prior-record reference for revision `>1`; cross-record review must derive prior claim IDs from that referenced record rather than trust the new record's declaration. No cryptographic immutability is required.

