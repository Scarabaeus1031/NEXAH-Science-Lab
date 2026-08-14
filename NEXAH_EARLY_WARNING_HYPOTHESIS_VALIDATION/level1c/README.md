# Level-1C sealed held-out evaluation

Status: `LEVEL1C_COMPLETE_INCONCLUSIVE`. This package records the first and
only authorized opening of the frozen Level-1 evaluation partition.

The original simulator and evaluator were used byte-identically. Frozen
thresholds remained `tau_R=0.50` and `tau_V=1.00`. No calibration, retuning,
plotting, smoothing, clipping, replacement, exclusion, or canonical component
change occurred.

- `raw/`: 2,613 primary evaluation trajectories and 13 deterministic
  timestep-sensitivity trajectories;
- `LEVEL1C_RUN_MANIFEST.json`: per-raw-file hashes and identities;
- `LEVEL1C_RUN_LEVEL_RESULTS.json`: every fixed-threshold endpoint and
  detection result;
- `LEVEL1C_AGGREGATE_RESULTS.json`: counts, preregistered metrics, strata,
  sensitivity, bootstrap, and seven gates;
- `LEVEL1C_SCIENTIFIC_OUTCOME.json`: formal frozen outcome;
- `verification/`: pre-opening and full replay audits;
- `derived/`: reserved separation boundary; authoritative derived artifacts
  remain at the required top-level names above.

No terminal event occurred in 2,613 valid evaluation runs. Therefore recall,
actionable lead, paired Delta_L, and bootstrap interval are undefined. The
formal outcome is INCONCLUSIVE because the frozen minimum of 30 event runs is
not met. This neither confirms nor refutes candidate advantage.
