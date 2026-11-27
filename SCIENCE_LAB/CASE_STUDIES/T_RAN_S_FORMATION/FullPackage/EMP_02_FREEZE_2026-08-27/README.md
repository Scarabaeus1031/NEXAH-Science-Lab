# EMP-02 — Cosine Projection / Observer Reconstruction

Status: **CLOSED — CONDITIONAL PASS / DOMAIN IDENTIFIED**
Freeze date: 2026-08-27

## Purpose
Bounded empirical/synthetic case study of reconstruction from a projected circular disk. The project tests an explicit observation chain: known tilt angle -> rendered/projected ellipse -> image measurement -> inverse reconstruction -> DECIDE/ABSTAIN.

## Frozen result
- The ideal orthographic circular-disk model follows q = |cos(theta)|; on the restricted 0–90° domain this is invertible by theta = arccos(q).
- Blind image measurement recovers the known angle with low error at adequate pixel support.
- Finite resolution introduces two distinct failure modes: weak frontal sensitivity and edge-on minor-axis pixel collapse.
- Observation extraction matters: moderate blur/noise can be tolerated, but a bad segmentation rule can catastrophically corrupt the inferred state.
- Model mismatch matters independently of measurement precision: perspective projection reconstructed with an orthographic inverse yields systematic bias.
- On the full 0–360° domain, q = |cos(theta)| is structurally non-injective; perfect measurement still leaves 2 or 4 compatible states.
- Independent directional cues can split the ambiguity class; redundant channels do not.

## Files
- run01_ground_truth.csv
- run02_image_measurements.csv
- run03_resolution_measurements.csv / run03_resolution_summary.csv
- run04_observation_robustness.csv / run04_robustness_summary.csv
- run05_model_mismatch.csv
- run06_full_domain_ambiguity.csv
- run07_active_disambiguation.csv
- run_summary.csv
- images/ — representative renderings, stress cases, charts, and final marker
- reproduce_emp02.py — bounded reproducer for formula-based Runs 01, 05, 06, 07
- SHA256SUMS.txt

## Claim boundary
EMP-02 validates the method architecture only within explicitly modeled synthetic/renderer domains. It does not validate a physical instrument, a natural-scene vision system, or a universal observer law.

## Parking lane
“OASIS” remains a mnemonic/control candidate only. It was not adopted as a formal variable or law in EMP-02.
