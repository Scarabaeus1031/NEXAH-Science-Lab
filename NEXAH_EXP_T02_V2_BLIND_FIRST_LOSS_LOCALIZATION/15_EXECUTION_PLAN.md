# Draft Execution Plan — Not Authorized

This plan is preserved for design review only. There is no authorized execution.
Had the protocol passed self-review, the intended sequence was:

1. Create a new output directory and durable `RUN_STATE.json`.
2. Verify every protocol hash and static diagnostic leakage constraints.
3. Generate or resume one sealed 256-bit seed; record its commitment.
4. Generate controls, 84 held-out public cases and sealed truth.
5. Validate public/truth separation and all fixture preconditions.
6. Pass only deep-copied public cases to independently imported diagnostics.
7. Serialize and hash all B/N0–N4 outputs.
8. Only then pass sealed truth and frozen output hash to scorer.
9. Compute E1–E8, all F1–F10, hypotheses and total precedence.
10. Write `FINAL_RESULT.json` and result manifest for success or failure.
11. Reveal seed in final artifact and support exact replay into a distinct empty
    output directory.

Runner invocation requires `--execute --acknowledge-frozen-protocol`. No network,
plotting, canonical NEXAH import, interactive choice, output overwrite or silent
stderr-only result is permitted.
