# Cross-Revision Claim Identity

Each record has a stable `ledger_series_id` and `record_id`, plus `record_revision`. Revision 1 requires `previous_record_ref: null`; later revisions require a prior-record reference and at least one known prior record.

Each claim has a stable `claim_id` and `claim_revision`. Claim relations explicitly connect a new claim/revision to a prior claim/revision using `SUPERSEDES`, `REFINES`, `CONTRADICTS`, or `RETRACTS`.

Within a known ledger series, a cross-record consistency check must compare the referenced prior record rather than trusting a self-declared prior-claim list. Changing `record_id` does not change `ledger_series_id`. Starting a genuinely unrelated series or creating an unrelated claim with no relation remains allowed when lineage evidence does not connect it to prior work.

