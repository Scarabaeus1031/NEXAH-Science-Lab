# Deterministic replay record

Date: 2026-08-06  
Status: `TWO-RUN BYTE REPLAY — PASS`

Command:

```bash
/opt/anaconda3/bin/python FIELD_NOTES/C3_PROFILE_2026-08-06/C3_TO_C2_TRANSITION_2026-08-06/run_transition_experiment.py
```

Two consecutive complete executions produced identical bytes for all four
result artifacts:

```text
b4def10880060cfba92e24ae0bb67c61d95f5c9b91aa510b68b3038d819dd35e  c3_to_c2_transition_full.json
df03e306e09f44833ad7ba1ba055f4e400eb8c51b573bdf46a56cff6a2a5c0a3  c3_to_c2_transition_trials.csv
46ad89e6613c930c62d79de9fc16b3739412ab2c0fe5c6f786488f8c49bed7ad  c3_to_c2_transition_summary.csv
193b5596419d21b35a4d6ee1405e80401ed61c640d238672c565c31a9e7d4925  c3_to_c2_transition_sensitivity.csv
```

The JSON contains no timestamp, NaN or infinity token. Random records are
derived from the declared base seed, noise-seed index and offset ID. Each
condition reuses the same paired noise array for the same trial identity.

This replay establishes deterministic instrument output in the recorded local
runtime. It is not independent validation and does not strengthen the model's
scientific scope.
