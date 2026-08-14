# Post-failure closeout boundary

The frozen primary implementation stopped in the blind observer before an observed-metrics seal because at least one jointly supported rank vector had a zero Kendall-tau-b denominator. This is the exact fail-closed condition registered in `05_L4_PRIMARY_CLAIM.md`: an all-tied vector is invalid and may not be assigned agreement or removed after rank inspection.

This note and `src/failure_closeout.py` were created **after the primary failure was known**. They are not part of candidate extraction, metric computation, thresholding or classification discretion. They may only:

1. verify that the frozen source and three frozen candidate artifacts exist;
2. count support and fully tied rank vectors;
3. require at least one jointly supported fully tied vector;
4. serialize the already-forced result `INVALID_EXPERIMENT / KENDALL_TAU_B_ZERO_DENOMINATOR`;
5. mark every downstream baseline, destructive-control and OFAT gate `NOT_REACHED`;
6. produce a canonical scientific-failure hash for primary/replay comparison.

It cannot calculate an alternative tau, delete a query, change a tie, alter support, continue secondary analyses, or promote the candidate. The original primary directory and observer traceback remain retained.

