# NEXAH-UTILITY-01 — U2 Pre-execution Integrity Record

Date: `2026-09-22`  
Authorization: `AUTHORIZE_U2_EQUAL_INFORMATION_COMPARISON`  
Decision: `D_INVALID_OR_INSUFFICIENT_TEST`  
Stop: `STOP_BEFORE_EVALUATION_MATERIALIZATION`

## Scope and custody

This is the Phase A integrity result under the frozen
[`UTILITY-00` contract](<../../../../00 EXECUTIVE/NEXAH-Mission-Control/CURRENT/UTILITY_00_SCOPE_AND_BASELINE_FREEZE.md>).
It is a pre-execution invalidity decision, not a measured NEXAH-versus-baseline
utility result. The U1 machine-existence record remains a bounded smoke result.

| Gate | Observation |
|---|---|
| NEXAH Core | exact pinned HEAD `ead4223a9bea103ad2266fc3b71b433974de37dd`; tracked worktree and index clean |
| Science Lab U1 | exact published HEAD `e529c33e44c7a31440ab88d984c60f4d2c428dc9` at preflight; upstream 0/0; tracked worktree and index clean before this record |
| Mission Control U1 | exact published HEAD `aea349e5503a0920a6cdb8d3456b5af0637a8c61`; upstream 0/0 |
| Currentness / custody | `VALID` 62/62; `RELEASE_CUSTODY_VALID` 62/62 before this record |
| U0 / U1 hashes | U0 covered by the valid Mission Control manifest; U1 `verify_package.py` returned `PASS`, and the U1 manifest SHA-256 is `598c4124dce131a820d3d7fd54c843f3a881abc148fd51d56db293d8b809bc39` |
| Evaluation / replay | neither split has fixture files in the U1 package; neither was generated or run in this U2 attempt |
| Adapter / independence | NEXAH adapter invokes pinned Core verifier; baseline imports no NEXAH detector |

## Blocking findings

1. **Hidden label leakage.** The generator forms each critical `fixture_id`
   as `EVA-C<family-number>-<variant>` for evaluation; the public ordered
   `CRITICAL_FAMILIES` tuple maps `C01` through `C15` to the exact hidden
   mutation family. The ID is included in every processor input. Control IDs
   use `K`, revealing control versus critical status. The input also contains
   its `split`. This conflicts with the frozen hidden-label and split-membership
   boundary. Development data confirm that `C01` maps to
   `RESIDUAL_OMITTED_OR_NULL`, `C02` to
   `QUOTIENT_RESIDUAL_SIGN_OR_PAIR_SWAP`, and so on. Source:
   `utility00_machine.py:25-41,265-329`.

2. **Frozen fixture strata are not realized.** The U0 contract requires low,
   medium and high observability surface variants and independently mutated
   instances. In the generator, `observability_variant` is assigned only in
   the gold record from the ID. For development, all eight payloads in each of
   `RESIDUAL_OMITTED_OR_NULL`,
   `RECONSTRUCTION_RULE_OR_TOLERANCE_ALTERED`, and
   `PCA7_EVALUATION_REFIT` are byte-identical to one another at the bundle
   level. The evaluation generator uses the same mutation functions for its
   twelve cases per family. Source: `utility00_machine.py:137-211,265-365`.

3. **Mandatory strong-baseline components are incomplete.** The baseline
   sets a constant determinant of `-1` instead of deriving rank, null space or
   restricted injectivity from each declared transform. It checks PCA7 field
   presence and a basis length but does not fit PCA7 on development and apply
   the fit without evaluation refitting. Its PROV and RO-Crate structures are
   constructed internally from fixed values and then tested against those
   same values; they do not validate a supplied PROV/RO-Crate graph, derivation
   and responsibility edges, or a crate profile from the fixture. These are
   required baseline components in U0 §5, and a missing component forces D
   under U0 §11. Source: `baseline_runner.py:57-115`.

4. **No locked primary scorer exists.** The U1 scorer tests only status and
   detection booleans; it does not check the frozen defect family, accepted
   file/pointer, evidence binding, Wilson interval or the 10,000-resample
   family-cluster paired bootstrap. A mechanical scorer could be written
   before evaluation, but that cannot cure Findings 1–3 without changing the
   frozen generator and baseline. Source: `ground_truth_evaluator.py:12-33`.

The first three findings independently prevent a fair, frozen U2 comparison.
No favorable interpretation of the U1 smoke test repairs these conditions.
The U2 authorization explicitly requires a D decision and a stop before
evaluation materialization when the pre-execution contract is insufficient.

## Execution disposition

```text
U2_DECISION                  = D_INVALID_OR_INSUFFICIENT_TEST
EXECUTION_STAGE              = PHASE_A_PREEXECUTION_INTEGRITY
EVALUATION_MATERIALIZED      = NO
EVALUATION_CASES_EXECUTED    = 0
GROUND_TRUTH_OPENED          = NO_EVALUATION_GOLD_EXISTS
RAW_PROCESSOR_OUTPUTS        = NONE
PRIMARY_ENDPOINT_CALCULATED  = NO
UTILITY_CLAIM                = NONE
EXECUTION_LOCK_COMMIT        = NOT_CREATED_STOPPED_IN_PHASE_A
REPLAY_SPLIT                 = SEALED_NOT_MATERIALIZED
U3                           = NOT_STARTED
ACTIVE_RESEARCH_CYCLES       = 0
```

The next action is one Human Owner decision on whether to authorize a new
preregistration and new unseen fixture family after the generator, baseline,
scorer and cost contract have been independently reviewed. The current U0
freeze is not amended retroactively; this U2 attempt remains D.
