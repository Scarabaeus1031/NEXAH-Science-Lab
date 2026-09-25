# 04 — Cross-Repository I-L-A-U Audit

## Audit convention

- **I — retained:** survives the handoff and matches the declared source account.
- **L — lost:** absent from the receiving representation or return.
- **A — introduced:** present in the receiving representation but not in the source account.
- **U — unresolved:** cannot yet be assigned without further evidence, definition, or return.

I-L-A-U is accounting, not proof of global identity.

## Ecosystem-level account

### I — Retained

- Distinct repository responsibilities are consistently named.
- Source authority is not automatically transferred to Mission Control or public surfaces.
- The evidence / semantics / processing / interaction / presentation distinction survives across the main overviews.
- Mission Control maintains a central role register and source-bound currentness records.
- Frontstage and backstage are kept separate.
- Bounded return and claim ceilings recur across the method documents.
- Human STOP/ABSTAIN remains available where a claim or decision cannot be supported.

### L — Lost

- Cross-repository transformations are usually summarized rather than recorded per edge.
- Public and interaction surfaces necessarily omit much evidence detail; the omission is legitimate only when its boundary remains visible.
- Local storage indirection for NEXAH Experience is not represented in the role register, reducing location provenance in local reconstruction.
- Dated repository summaries do not retain all live worktree state.

### A — Introduced

- Each overview introduces its own narrative frame and emphasis.
- Interaction and public repositories add presentation, sequencing, navigation, and interface semantics.
- Mission Control adds operational statuses and portfolio-level classifications.
- The TOP label and method-center alignment were added to two Science Lab overviews without yet returning their new hashes to Mission Control.

### U — Unresolved

- There is no common machine-readable cross-repository edge ledger.
- The field `mission_control_truth_surface_active: false` in `PORTFOLIO_TRUTH.json` is semantically ambiguous beside documents that describe the `CURRENT` surface as active; no checked definition was found.
- The exact deployed NEXAH Experience commit remains without a dated deployment receipt in the audited records.
- Some repository statuses are dated snapshots rather than live bindings.
- Cross-repository return success lacks one shared semantic closure test.

## Minimum future edge record

The audit does not implement a schema, but any future test should be able to express at least:

```text
edge_id
source_repository
source_authority
target_repository
consumer_role
artifact_or_record
observer_position
frame_cut_projection
retained
lost
introduced
unresolved
typed_residual
return_path
closure_condition
claim_ceiling
status
evidence_references
```

## Important separation

The edge ledger must not become a central content database that absorbs domain authority. It should bind evidence references and account for transformations while leaving the authoritative object in its owning repository.
