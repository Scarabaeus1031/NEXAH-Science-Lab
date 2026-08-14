# L4.003 final report

## Decision

Primary candidate classification: **INVALID_EXPERIMENT**  
Overall L4.003 status: **INVALID**  
Registered `ROBUST` classification: **NOT REACHED**

Two independent reasons prevent `ROBUST`:

1. R0-R2 and R1-R2 each produce TNSPA `0.3345246605`, below the frozen `0.60` threshold, despite passing their mismatch-null tests.
2. R3's historical z-only file contains readable query IDs encoding seed/state correspondence, violating the locked no-correspondence-metadata requirement. Although it emits `UNDEFINED` and zero ranks, the leakage gate fails and makes the complete experiment invalid.

The outcome is not upgraded to `REPRESENTATION_DEPENDENT`, because invalidity precedes scientific classification. It is not called `FAILED`, because the registered protocol itself fails an information-boundary gate.

## What L4.003 establishes

As a deterministic diagnostic on the authentic fixed artifacts, TNSPA is well-defined on every full-tie state, all informativeness gates pass, all exact controls pass, and primary/replay results are identical. R0/R1 exhibit near-maximal absolute signed strict-relation support. Both graph pairs show positive state-specific structure far above their mismatch nulls, but their absolute signed support remains only `0.3345`, below the preregistered criterion. The run also exposes a real R3 metadata-boundary defect.

## What L4.003 does not establish

It does not establish `ROBUST`, `INVARIANT`, `EQUIVARIANT`, or a valid `REPRESENTATION_DEPENDENT` classification; universal NEXAH validity; navigation, control or intervention utility; physical truth; score calibration; generality beyond `NEXAH-L4-C001`, these representations and this fixed support; or correctness of historical JANUS/Gate claims. Secondary Jaccard has no decision authority. The three preregistered MINOR limitations remain unchanged.

