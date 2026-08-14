# Negative-Result History V2

Claim history is separate from execution status. Every entry has stable ID, claim type, statement, status, evidence, judgment, superseded IDs, and append action.

Record lineage requires:

- monotonically increasing revision;
- prior record ID or `null`;
- `history_policy: APPEND_PRESERVING`;
- explicit `prior_claim_ids`.

Normative cross-revision rule: every ID listed in `prior_claim_ids` must remain in `claim_history` as `CARRIED_FORWARD` or be referenced by a new entry's `supersedes`. A rejected claim cannot disappear or be rewritten in place. Supersession changes current interpretation without deleting history.

JSON Schema validates the required containers and values; comparison with the prior record is a later referential check. No cryptographic immutability is claimed.

