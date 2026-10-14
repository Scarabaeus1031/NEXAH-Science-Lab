# Scientific Contribution Candidates

Maintained through: `2026-10-10`

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
| `SCC-002 / NEXAH n+1 RELATIONAL STACK` | relation-preserving representation method and Builder architecture benchmark | R0 design record; 92-file provenance-bound historical source intake; formal `n+1` object; predecessor crosswalk; claim ledger; minimum test specification; targeted primary-source novelty audit; Human Owner disposition | `CONTRIBUTION_NOT_SUPPORTED / CLOSED_NO_SCIENTIFIC_NOVELTY` | original BDL-01 is `NO-GO`; retain only the internal audit/interface profile; any narrow interoperability, Human-factors, research-software or benchmark question requires a new candidate | [Assessment](../CASE_STUDIES/NEXAH_N_PLUS_ONE_RELATIONAL_STACK_CONTRIBUTION_2026-09-30/03_CONTRIBUTION_CANDIDATE.md) · [Novelty audit](../CASE_STUDIES/NEXAH_N_PLUS_ONE_RELATIONAL_STACK_CONTRIBUTION_2026-09-30/08_PRIOR_ART_AND_NOVELTY_AUDIT_2026-10-08.md) |
| `SCC-003 / PASCAL–PENTAGON 106-NODE QUOTIENT` | finite combinatorial construction and reproducible quotient-graph object | bounded PENT-01–PENT-07 replays; explicit five-face seam quotient; `28,49,70,91,112 -> 106`; formal definition and compact proofs; canonical 106-node/180-edge typed reference object; independent union-find verification `177/177`; metric and 3D returns; initial web-level nearest-neighbour search | `POTENTIAL_COMBINATORIAL_CONSTRUCTION_CANDIDATE / PRIOR_ART_CHECK_INCOMPLETE / NOT_ACTIVE` | systematic MathSciNet/zbMATH/Crossref/arXiv audit; strongest-baseline comparison; independent mathematical review | [Assessment](SCC_003_PASCAL_PENTAGON_106_NODE_QUOTIENT_2026-10-10.md) |

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

The targeted primary-source audit completed on `2026-10-08` found strong
overlap with multiary delta lenses, Triple Graph Grammars, transformation
synchronization, sheaf-based heterogeneous consistency, W3C PROV and RO-Crate.
The independent BDL-01 review also found the Candidate and strong baseline
behaviorally equivalent under the fair equal-information contract. The current
recommendation was therefore a downgrade to an internal architecture or
audit-interface pattern. The Human Owner accepted that recommendation on
`2026-10-08`.

`SCC-002` is closed as `CONTRIBUTION_NOT_SUPPORTED` for its registered broad
scientific and machine-utility proposition. It adds no Builder capability,
research result, adopted format or active workstream. The original BDL-01 must
not be executed as a novelty or machine-utility test; it may be preserved only
as a non-promotional equivalence fixture. The I-L-A-U/provenance/residual/claim-
ceiling combination remains an internal audit-interface profile.

A later narrow interoperability, Human-factors, research-software or benchmark
question requires a new candidate record, established-field terminology and a
frozen strongest-baseline comparison. It does not reopen SCC-002.
