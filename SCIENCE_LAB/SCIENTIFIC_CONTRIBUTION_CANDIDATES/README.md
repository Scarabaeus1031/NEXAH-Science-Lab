# Scientific Contribution Candidates

Maintained through: `2026-09-30`

Status: `CANDIDATE_REGISTER / NO_NOVELTY_PRESUMPTION / NO_ACTIVATION`

This register tracks bounded work that may become a scientific contribution
after the relevant evidence and prior-art gates close. A candidate is not a
result, publication claim, discovery or active research cycle.

Scientific contribution is broader than new physics. It may eventually take
the form of a validated method, measurement protocol, dataset, benchmark,
negative result, reproducibility asset or empirical finding. Novelty and
scientific authority remain separate questions.

## Current candidates

| ID | Candidate contribution type | Present evidence | Current verdict | Missing gates | Owning assessment |
|---|---|---|---|---|---|
| `SCC-001 / TOP-BOUNDARY-01` | optical/imaging measurement protocol and interaction-residual benchmark | preregistered synthetic operator; 24/24 records; 12/12 tests; linear null and coherent positive controls; eight-orientation return analysis | `PLAUSIBLE_METHOD_CONTRIBUTION_CANDIDATE / NOT_YET_A_PHYSICAL_OR_NOVEL_RESULT` | targeted prior-art review; bound apparatus and uncertainty budget; physical positive control; baseline comparison; repeated/independent execution; contribution decision | [Assessment](../CASE_STUDIES/TOP_BOUNDARY_01_ORIENTATION_COMPLEMENT_INTERACTION_2026-09-26/16_SCIENTIFIC_CONTRIBUTION_ASSESSMENT.md) |
| `SCC-002 / NEXAH n+1 RELATIONAL STACK` | relation-preserving representation method and Builder architecture benchmark | R0 design record; 92-file provenance-bound historical source intake; formal `n+1` object; predecessor crosswalk; claim ledger; minimum test specification | `SCIENTIFIC_BUILDER_CONTRIBUTION_CANDIDATE / NOT_VALIDATED` | targeted prior-art and nearest-baseline review; Structure Freeze; executable reference fixture; single-master-frame comparison; cycle-consistency, loss-localization and Human-inspectability evaluation; contribution decision | [Assessment](../CASE_STUDIES/NEXAH_N_PLUS_ONE_RELATIONAL_STACK_CONTRIBUTION_2026-09-30/03_CONTRIBUTION_CANDIDATE.md) |

The machine-readable companion is
[`SCIENTIFIC_CONTRIBUTION_CANDIDATES.csv`](SCIENTIFIC_CONTRIBUTION_CANDIDATES.csv).

## Admission rule

A row requires all of the following:

1. an owning evidence package;
2. a precise candidate contribution type;
3. a statement of what is already established and what is standard prior art;
4. explicit evidence, novelty, external-validity and claim gates;
5. a stop or downgrade condition;
6. no automatic transfer into the result register, publication queue or active
   research queue.

## Status ladder

```text
IDEA
  -> CONTRIBUTION_CANDIDATE
  -> EVIDENCE_READY_CANDIDATE
  -> EXTERNAL_REVIEW_CANDIDATE
  -> CONTRIBUTION_SUPPORTED or CONTRIBUTION_NOT_SUPPORTED
```

Movement between states requires an explicit Human Owner decision and a bound
assessment. A useful but standard replication may become a reproducibility or
teaching contribution without becoming a novelty claim.

## Promotion criteria

Promotion is evidence-class movement, not praise or activation. Every step
requires all criteria of the target state.

| Target state | Required evidence |
|---|---|
| `EVIDENCE_READY_CANDIDATE` | nearest prior art and strong baseline identified; distinct contribution hypothesis stated; protocol, inputs/apparatus, endpoints, uncertainty, controls and stop rules frozen; package is executable without filling scientific blanks after seeing results |
| `EXTERNAL_REVIEW_CANDIDATE` | valid primary execution completed; positive and null controls pass; data, code, deviations and uncertainty are reproducible; comparison with the strong baseline shows either bounded incremental value or a clearly useful negative, dataset or reproducibility contribution |
| `CONTRIBUTION_SUPPORTED` | result repeats in a new block and preferably by an independent apparatus or analyst; domain review accepts the method and claim ceiling; prior-art review leaves a precise contribution; evidence package is complete enough to audit |
| `CONTRIBUTION_NOT_SUPPORTED` | the frozen contribution question is answered negatively, or the required value, robustness, novelty or reproducibility does not survive its gates |

Novelty is a separate sub-gate. A candidate may support a reproducibility,
benchmark, dataset, teaching or negative-result contribution while its novelty
claim is stopped.

## Stop, abort and downgrade criteria

`STOP` blocks interpretation or execution at the failed level. It preserves
the record; it does not turn a failed gate into positive evidence.

- **Integrity stop:** missing provenance, changed post-hoc thresholds,
  incomplete manifests or mixed experimental arms invalidate the affected run.
- **Control stop:** failed positive control blocks sensitivity claims; an
  unexplained nonzero null control blocks interaction interpretation.
- **Apparatus stop:** unbound equipment/safety, excessive drift, clipping,
  calibration failure, unverified orientation or uncontrolled processing stop
  physical acquisition or invalidate the block.
- **Uncertainty stop:** if the uncertainty interval cannot distinguish the
  target effect from drift, registration or detector error, the outcome is
  `INCONCLUSIVE`, not support.
- **Baseline downgrade:** no distinct advantage or insight over established
  analysis downgrades the work to a reproducibility, teaching or internal
  fixture when it remains useful.
- **Prior-art downgrade:** an already-equivalent protocol stops the novelty
  lane; other bounded contribution types may remain open.
- **Replication stop:** failure to repeat the primary effect prevents
  `CONTRIBUTION_SUPPORTED` and returns the candidate to investigation or
  `CONTRIBUTION_NOT_SUPPORTED`.
- **Claim stop:** any interpretation above the registered evidence or domain
  authority is removed even when the underlying run remains valid.

## SCC-001 application

For `TOP-BOUNDARY-01`, promotion beyond the present candidate state requires:

1. a targeted prior-art and nearest-baseline assessment;
2. complete source, mask, geometry, orientation, detector, safety and
   calibration bindings;
3. recovery of the known coherent finite-slit interaction as the physical
   positive control;
4. a valid additive/null arm and independent sampling/registration controls;
5. a preregistered uncertainty budget that separates the target residual from
   drift and apparatus effects;
6. a comparison with ordinary Fourier/MTF and metrology workflow;
7. repeated blocks and preferably independent reproduction.

The lower-level localization order is binding: integrity → calibration and
detector linearity → source stability → registration/interpolation → mask
geometry → alignment → polarization/coherence → established optical model →
independent replication. Failure at a lower level blocks every higher physical
or novelty interpretation.

## SCC-002 application

For `NEXAH n+1 RELATIONAL STACK`, the candidate is presently admitted only at
the documented design-feasibility level. It does not add a Builder capability,
research result, adopted format or active workstream. Promotion requires:

1. a targeted comparison with local coordinate frames, scene graphs, map
   synchronization, cycle consistency, provenance graphs and redundant residue
   systems;
2. a frozen relation schema that keeps local records and the Binder distinct;
3. a minimal `3+1` executable fixture plus a strong single-master-frame
   baseline using the same information;
4. preregistered measures for closure, representation loss, discrepancy
   localization, provenance retention and Human inspection cost;
5. positive, null and deliberately inconsistent mapping controls;
6. deterministic replay and an explicit assessment of whether the additional
   contract provides value beyond established tools.

If ordinary scene-graph, provenance or map-synchronization practice provides
the same diagnosis without additional value, the candidate is downgraded to an
internal architecture pattern, teaching model or historical design record.
