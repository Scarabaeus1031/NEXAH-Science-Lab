# Second Verified Test Case

## T01-CLASS-E3: recovery output → primary classification

This edge differs from the spatial legacy chain: it translates registered experiment records into a deterministic recovery classification.

- Source: `SIMULATION_OUTPUT/recovery_comparison_record` containing source, recovered state, family, certificates, tolerance, and bound.
- Operator: `recovery_record` in `NEXAH_TRANSLATION_RECOVERY_EXP_T01/run_exp_t01.py`, SHA-256 `e602071c3d294001f4e3c2076478d3f1c56a730fea0e5f8758e36011c9fbe7b1`.
- Target: `CLASSIFICATION/t01_primary_recovery_status` plus recovery error and certificate comparisons.
- Parameters: exact tolerance `1e-12`; E3 rotation `+pi/3` and inverse `-pi/3`.
- Preserved: run, family, fixture, recovered state, error, and certificate comparisons remain explicit in the output record.
- Introduced: categorical status under the frozen rule.
- Loss: the primary label collapses detailed certificate outcomes; the record retains them, but a label-only consumer would lose them.
- Uncertainty: floating numerical error; observed maximum E3 round-trip error `2.220446049250313e-16`, within tolerance.
- Invertibility: record→label is `MANY_TO_ONE`.
- Task relevance: `UNDEFINED` (synthetic software check, no external decision task).
- Evidence: frozen protocol bundle hash `6f0b807d1d18c9db3825dbaa98dd413cba0d52ea5f8e9bc319aa137865119b53`; T01-A result/replay hash `0f860a7986476f63125d7832187e3b02367485ecbd10b1820173eabc647b8aac`; byte-identical replay.
- Status: `VERIFIED` for the bounded deterministic software classification, not for physical validity or novel recovery mathematics.

The case shows the vocabulary and claims model work outside field/graph transformations.

