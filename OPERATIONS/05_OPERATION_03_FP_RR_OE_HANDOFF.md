# Operation 03 — FP/RR/OE Handoff

## Purpose

Route the accepted FP/RR/OE experiment package into one unnumbered research
handoff. Do not recreate Lab 0.2.

## Authority

- Mission 03 routing manifest rows F002–F007 and F024
- Mission 03 Book Dossier C
- Mission 01 experiment and maturity findings
- Research owner

## Input

- 7 Landing Pad files identified below
- approved `FP_HANDOFF_HOME`

## Output

One unnumbered directory:
`RESEARCH/NOTES/FP_RR_OE_RELATIONAL_ORIENTATION_EXPERIMENT_HANDOFF/`, containing
the primary handoff and six supporting plates.

## Files affected

| Row | Source | Destination filename |
|---|---|---|
| F002 | `NEXAH LAB 0.2 • THE EXIT EQUATIONS/7b933bca-05db-4a74-9c23-e0edb028e7be.png` | `FP_RR_OE_EXPERIMENT_FRAMEWORK_01.png` |
| F003 | `NEXAH LAB 0.2 • THE EXIT EQUATIONS/HANDOFF_LAB 0.2 Report.txt.rtf` | `FP_RR_OE_RELATIONAL_ORIENTATION_EXPERIMENT_HANDOFF.rtf` |
| F004 | `NEXAH LAB 0.2 • THE EXIT EQUATIONS/aa4fbf5e-c79d-4477-8308-5c2ef83a99f7.png` | `FP_RR_OE_EXPERIMENT_FRAMEWORK_02.png` |
| F005 | `NEXAH LAB 0.2 • THE EXIT EQUATIONS/b5ceb7ec-6c2b-49fe-a121-cbc37a3a84f2.png` | `FP_RR_OE_GOAL_OVERVIEW.png` |
| F006 | `NEXAH LAB 0.2 • THE EXIT EQUATIONS/db2d5192-bd98-4c76-a715-b3fc9c559b19.png` | `FP_RR_OE_EQUATION_HYPOTHESIS_PLATE.png` |
| F007 | `NEXAH LAB 0.2 • THE EXIT EQUATIONS/fd00febc-b175-4b22-839c-1704c5c1153a.png` | `FP_RR_OE_EXPERIMENT_HANDOFF_VISUAL.png` |
| F024 | `NEXAH_ORIENTATION_VISUALS/10_LAB_Exit_Equations.png` | `FP_RR_OE_EXIT_EQUATIONS_SUMMARY.png` |

## Atomic actions

1. Confirm the destination is an unnumbered Research Note.
2. Verify all seven source paths and Mission 03 hashes.
3. Create `FP_HANDOFF_HOME` only after approval.
4. Copy each file to the exact canonical filename.
5. Verify byte identity for all seven files.
6. Preserve the original Lab 0.2 wording inside source files as provenance;
   do not use it as the destination identity.
7. Add a minimal handoff index only if existing Research Note convention
   requires one. State that equations and application claims are unvalidated.
8. Move the seven verified source copies out of the Landing Pad.
9. Commit only the FP/RR/OE handoff.

## Rollback

Revert the Operation 03 commit. Restore all seven files to their exact Landing
Pad paths and verify hashes.

## Validation

- 7/7 source and destination hashes match.
- destination path contains no Lab number.
- no Lab Registry entry, mission, Book, Work, Operator, or OLS change exists.
- the RTF remains the primary handoff; plates remain supporting evidence.
- no unvalidated equation is relabeled as validated.

## Stop gate

Stop on any hash mismatch, destination collision, numbered Lab identity,
canonical claim, or required content rewrite.

## Human approval

Required before action: Control Desk owner and Research owner.

## Estimated duration

45–60 minutes.

## Risk

Medium. Primary risk is restoration of an obsolete numbered Lab identity.

