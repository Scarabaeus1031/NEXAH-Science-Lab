# Contradiction Replay

The sealed blocker tree `5b60a0653020d26529024bbfc5e645ae0d58ba7f87ca57ae6911b1901b2e3d17` was rehashed unchanged before R2 validation.

| Synthetic case | R2 outcome |
| --- | --- |
| canonical N3 ending in `ROW=TEST.6000.0` | PASS |
| canonical N4_T ending in `STRATUM=Q0;M000;D0` | PASS |
| canonical N4_F ending in `STRATUM=Q0;M000;D0` | PASS |
| terminal integer appended to N3 | REJECTED |
| terminal integer appended to N4_T/N4_F | REJECTED |
| wrong N3 physical seed | REJECTED |
| malformed N3 ROW | REJECTED |
| malformed N4 STRATUM | REJECTED |
| wrong N4 component order | REJECTED |
| corrupted canonical N4 physical-row population | REJECTED |

The prior third counterexample—an appended integer passing Generator R1 while changing bytes—is now closed because the extra component violates the exact family length.

These are synthetic contract fixtures only. No registered seed was executed.
