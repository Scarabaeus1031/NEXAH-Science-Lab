# Freeze Checklist

Status: `MANDATORY — NOT RUN`

## Rule

Every item must pass before a canonical source freeze may occur.

Unchecked means `NOT VERIFIED`, not implied failure or approval.

## A — Authority and scope

- [ ] Human owner decision authorizes one source-freeze transaction.
- [ ] Scientific Owner is assigned and has accepted the mandate.
- [ ] Freeze Owner is assigned and has accepted custody.
- [ ] Input Custodian is assigned and has accepted custody.
- [ ] Protocol Reviewer is assigned and independent.
- [ ] Export Operator and Export Reviewer are assigned.
- [ ] Scope is limited to the finite Lab 0.4 source and Program G Protocol 1.0.
- [ ] Exclusions and non-claims are accepted without expansion.

## B — Repository integrity

- [ ] Repository identity is explicit.
- [ ] Remote identity is recorded or local-only status is explicitly approved.
- [ ] Source-freeze branch is identified.
- [ ] Worktree is clean.
- [ ] All source candidate files are tracked.
- [ ] Commit contains every candidate source file.
- [ ] Commit hash resolves to the reviewed bytes.
- [ ] No unrelated dirty or untracked file is included.

## C — Source candidate

- [ ] Candidate file inventory is owner-approved.
- [ ] Source model is unchanged from reviewed candidate or every change is
      returned for Phase A reassessment.
- [ ] Test, note and interface roles are classified correctly.
- [ ] Presentation artifacts are excluded from scientific input.
- [ ] Masks and depth remain outside the primary scientific object.
- [ ] Source labels and 121-sample fixture are confirmed.

## D — Hash integrity

- [ ] SHA-256 is recomputed from the clean tracked commit.
- [ ] Hash inventory covers every frozen source and protocol file.
- [ ] A second reviewer confirms the inventory.
- [ ] Observed Phase A hashes are not copied as canonical without comparison.
- [ ] Every mismatch is resolved by rejection or a new candidate review.
- [ ] Canonical hash manifest is immutable after adoption.

## E — Export specification

- [ ] Coordinate semantics are approved as dimensionless or replaced by an
      explicit owner-approved declaration.
- [ ] Export runtime and environment are pinned.
- [ ] Export command and implementation are reviewed.
- [ ] Field mapping is exact.
- [ ] Decimal serialization is unambiguous.
- [ ] Ordering and newline rules are frozen.
- [ ] Export produces no projections, masks, depth or results.
- [ ] Deterministic export can be repeated from the same source commit.

## F — Canonical input validation

- [ ] `source_samples.csv` exists only under authorized export.
- [ ] Header and schema match exactly.
- [ ] Row count is 484.
- [ ] Every source has 121 rows.
- [ ] Keys are complete and unique.
- [ ] Rows are canonically ordered.
- [ ] All decimals use the frozen syntax.
- [ ] Values are finite.
- [ ] Matching `t` values agree across sources.
- [ ] CSV hash is independently verified.
- [ ] Export evidence is complete.

## G — Protocol and object manifests

- [ ] Program G Protocol 1.0 files are adopted by exact hash.
- [ ] Scientific-object manifest binds source, input and protocol hashes.
- [ ] Input dictionary is complete.
- [ ] Result schema is complete.
- [ ] Validation checklist and decision table are complete.
- [ ] Provenance appendix is complete.
- [ ] Non-claims are included.
- [ ] No expected result appears in the pre-execution package.

## H — Review

- [ ] Protocol Reviewer reports `PASS` with no unresolved definition defect.
- [ ] Export Reviewer reports source-to-CSV fidelity.
- [ ] Freeze Owner verifies package integrity.
- [ ] Input Custodian accepts the exact bytes.
- [ ] Scientific Owner accepts the bounded object and exclusions.
- [ ] All conflicts and role overlaps are disclosed.
- [ ] Owner reviews the complete freeze candidate.

## I — Freeze decision

- [ ] Identified Human records `APPROVE CANONICAL SOURCE FREEZE`.
- [ ] Adoption record names object, version, date, commit and hashes.
- [ ] Freeze transaction is independently verified.
- [ ] Supersession and rollback boundaries are recorded.
- [ ] Execution remains separately prohibited.

## Terminal checklist result

Current result:

```text
FREEZE_CHECKLIST: NOT RUN
SOURCE_FREEZE: NOT PERFORMED
```

Permitted future results:

- `PASS — READY FOR OWNER FREEZE DECISION`;
- `RETURN — CORRECTION REQUIRED`;
- `STOP — SOURCE CANDIDATE INVALID`.

Checklist completion does not itself perform the freeze.
