# A0 Tessarec Zero-Split / Memory-Lift Engineering Check

Date: `2026-10-13`  
Status: `POST-HOC DETERMINISTIC FORMAL AUDIT`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / RELATES TO PBM:MOD77 / NO NEW IDENTITY / NO NEW RELATION`

## 1. Bounded question

Can the historical diagram labelled `Codex-Blasenmechanismus: 1 -> 2 -> 0 -> 3`
be converted into a typed, reproducible operator contract? In particular:

1. does one nonzero source split into two signed branches;
2. do the branches project to an exact scalar zero;
3. can that zero uniquely reconstruct the source and branches;
4. does a three-entry lift become deterministic when the full split record is
   retained;
5. do asymmetric and perturbed controls reject the exact null gate?

The source diagram's `7.83 Hz`, `Schumann`, `Earth as bubble`, `Base 20/30/50`
and `Tesla 3-6-9` captions are not premises or pass conditions.

## 2. Existing provenance boundary

The sequence was already classified in section 10 of
`NEXAH_111_GRID_CRT_RETURN_PRUEFMODUL_2026-09-28-4.md` as a drawn state
sequence without a declared transition function. That negative boundary is
retained. This check supplies one minimal candidate function; it does not
retroactively validate the source image or its physical captions.

## 3. Frozen typed construction

For a nonzero scalar source `x`, define

```text
source record:       R0(x) = {source:x}
signed split:        S(x)  = [(plus,x),(minus,-x)]
scalar projection:   P(S)  = x + (-x) = 0
full memory lift:    L(R0,S) = [(source,x),(plus,x),(minus,-x)]
```

The shorthand is therefore heterotypic:

```text
1 source
-> 2 labelled branches
-> 0 scalar projection
-> 3 retained record entries
```

It is not an iteration of one numerical map. In particular, `0 -> 3` is not
ordinary arithmetic and is not a reconstruction from zero alone.

## 4. Information boundary

The projection `P` is many-to-one:

```text
P(x,-x) = 0
```

for every tested nonzero `x`. Hence the scalar zero loses magnitude and source
identity. If branch labels are also removed, the unordered pairs for `x` and
`-x` coincide, so orientation is lost as well.

The three-entry object is deterministic only because the retained record
contains the source and both labelled branches. It is a declared memory lift,
not a zero-only inverse.

## 5. Controls

### 5.1 Asymmetric split

For

```text
S_lambda(x) = (x,-lambda*x)
```

the residual is

```text
P(S_lambda) = (1-lambda)*x.
```

The frozen nonunit factors `0.5, 0.75, 1.25, 2` all reject the null gate for
the nonzero control sources `1,2,7`.

### 5.2 Additive perturbation

For `(x,-x+epsilon)`, the projected residual is exactly `epsilon` within the
declared floating tolerance. The null gate therefore does not hide the
perturbation.

## 6. Declared Tesla-clock junction

The cardinality-three memory record may be used to declare a downstream
step-three clock:

```text
3,6,9,12,15,18,21,24,...
```

This coupling is a construction choice. It is not derived from the scalar
zero and does not establish a historical Tesla claim.

The periods already isolated in the adjacent checks remain typed separately:

```text
phase/contact clock: 18
24-hour ring:        24
affine quotient:     30
```

Their checkpoints are

| tick | mod 18 | mod 24 | mod 30 | bounded reading |
|---:|---:|---:|---:|---|
| 36 | 0 | 12 | 6 | phase return; day antipode; affine intermediate |
| 72 | 0 | 0 | 12 | phase/day return; affine intermediate |
| 360 | 0 | 0 | 0 | first common closure |

Thus `lcm(18,24,30)=360`. Equal numeral labels do not identify the clocks.

## 7. Binding to the existing line

This check reuses the existing `MOD:TESSAREC` representation family as a
bounded operator lens:

```text
carrier/source
-> signed split
-> lossy observation
-> retained-record lift
```

It relates to, but does not merge with, `PBM:MOD77`:

- the Mod-77 check separates quotient state from lifted winding/history;
- this check separates scalar projection from retained split history;
- both demonstrate that equal visible readouts need not imply identical full
  records;
- neither establishes a carrier identity between the constructions.

The four-rung `3+1` path and this `1->2->0->3` typed pipeline are also kept
distinct: the former counts four states and three transitions; the latter
changes object type at every stage.

## 8. Result vocabulary

- `PASS_EXACT_SPLIT_CARDINALITY`
- `PASS_EXACT_CANCELLATION`
- `PASS_NONINJECTIVE_NULL_PROJECTION`
- `PASS_DECLARED_MEMORY_LIFT_CARDINALITY_THREE`
- `PASS_ORIENTATION_REQUIRES_LABELLED_SOURCE`
- `PASS_ASYMMETRY_REJECTS_NULL`
- `PASS_RESIDUAL_PRESERVED`
- `PASS_DECLARED_COUPLING_ONLY`
- `OPEN_NO_ZERO_ONLY_LIFT`

No visual similarity, physical frequency or historical attribution is a pass
condition.

## 9. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_ZERO_SPLIT_MEMORY_LIFT_ENGINEERING_CHECK_001
PURPOSE: TEST_TYPED_ONE_TWO_ZERO_THREE_MEMORY_LIFT
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-zero-split-memory-lift.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-zero-split-memory-lift.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: finite labelled split, scalar projection, record retention, local controls and typed clock residues only
AUTHORIZED_SCIENCE_RUN: false
```

## 10. Source junctions

- `SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_CUSTODY_2026-09-28/Nexah_Root7/NEXAH_111_GRID_CRT_RETURN_PRUEFMODUL_2026-09-28-4.md` owns the prior undefined-function boundary.
- `36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md` owns Paper F's carrier/frame/projection/record separation.
- `43_A0_TESSAREC_AFFINE_PLUS4_FOUR_RUNG_ENGINEERING_CHECK_2026-10-13.md` owns the distinct four-state/three-transition reading.
- `44_A0_MOD77_TORUS_LIFT_THREE_TURN_ENGINEERING_CHECK_2026-10-13.md` owns the quotient-state versus lifted-history distinction and the period-30 clock.
- `MOD:TESSAREC` is reused; `PBM:MOD77` remains a related comparator only.

## 11. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `75087f954a042c6d3f4971fbf1650e90cc904baa3aafc491c1bdab2f9fe0d963`  
Repeated stdout SHA-256: `ed1e8d6a68f514b3210c281cc3d0dcfa1edc0fdd0370b91752dc0ae85632efbd`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_EXACT_SPLIT_AND_MEMORY_DEPENDENCE_WITH_NO_ZERO_ONLY_LIFT`

| Check | Receipt | Bounded reading |
|---|---|---|
| `C1_ONE_TO_TWO_SPLIT` | `PASS_EXACT_SPLIT_CARDINALITY` | each frozen nonzero source produces two labelled signed branches |
| `C2_TWO_TO_ZERO_PROJECTION` | `PASS_EXACT_CANCELLATION` | every symmetric pair projects to the same scalar zero |
| `C3_ZERO_ONLY_INVERSION` | `PASS_NONINJECTIVE_NULL_PROJECTION` | seven distinct sources share zero; zero alone cannot select a unique preimage |
| `C4_MEMORY_LIFT_TO_THREE` | `PASS_DECLARED_MEMORY_LIFT_CARDINALITY_THREE` | source plus labelled branches yields a deterministic three-entry record |
| `C5_UNLABELLED_ORIENTATION` | `PASS_ORIENTATION_REQUIRES_LABELLED_SOURCE` | the unordered pairs for `x` and `-x` coincide |
| `C6_ASYMMETRIC_CONTROLS` | `PASS_ASYMMETRY_REJECTS_NULL` | all 12 nonunit-factor controls retain a nonzero residual |
| `C7_PERTURBATION_CONTROLS` | `PASS_RESIDUAL_PRESERVED` | all four perturbations pass through as measured residuals |
| `C8_THREE_ARITY_CLOCK` | `PASS_DECLARED_COUPLING_ONLY` | step-three ticks are a downstream convention, not a zero-derived law |
| `C9_THREE_CLOCK_BOUNDARY` | `PASS_EXACT_CHECKPOINT_CLASSIFICATION` | `36`, `72`, `360` have distinct typed residues; first common closure is `360` |

### Disposition

```text
ONE SOURCE -> TWO LABELLED BRANCHES: SUPPORTED / EXACT
TWO BRANCHES -> ZERO PROJECTION: SUPPORTED / EXACT
UNIQUE RECONSTRUCTION FROM ZERO ALONE: REFUTED / MANY-TO-ONE
THREE-ENTRY RETAINED MEMORY LIFT: SUPPORTED UNDER DECLARED RECORD CONTRACT
ASYMMETRIC / PERTURBED CONTROLS: PASS
TESLA STEP-THREE CLOCK: DECLARED COUPLING ONLY
PHYSICAL OR HISTORICAL MECHANISM: NOT TESTED
NEW FINDING: NO
```

The next admissible question after this audit is whether a frozen geometric
embedding can produce a projection crossing while the complete memory record
remains unchanged. That requires an explicit embedding, crossing functional,
tolerance and rotated/null controls before execution.
