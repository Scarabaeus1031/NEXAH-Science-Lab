# Independent Review Checklist

Status: `DRAFT — NOT YET REVIEWED`

Reviewer: `UNASSIGNED`

The reviewer must not be the protocol author, acquisition operator or analysis
operator.

## A. Scope

- [ ] The question is bounded to planar trajectories, traces and masks.
- [ ] No excluded domain or symbolic interpretation appears.
- [ ] The protocol creates no operator, Lab number or general theory.
- [ ] Synthetic dry-run diagnostics are not presented as scientific evidence.

## B. Acquisition

- [ ] Twelve samples and six F/R pairs are exact and unambiguous.
- [ ] All six path formulas fit the declared coordinate domain.
- [ ] Diagnostic roles do not function as assumed results.
- [ ] Device requirements are achievable and testable.
- [ ] Calibration thresholds and reset behavior are explicit.
- [ ] Invalid-sample and replacement rules prevent silent exclusion.
- [ ] Human-data, consent and retention decisions remain gated.

## C. Representation

- [ ] Raw, normalized source and canonical trace are distinct objects.
- [ ] Trace canonicalization removes direction and time fields.
- [ ] Source/trace identity depends on provenance, not visual similarity.
- [ ] Identity registration is justified by the shared calibrated frame.
- [ ] QC registration cannot enter scoring.

## D. Masks

- [ ] Static and moving masks are fully defined.
- [ ] Mask boundary convention is explicit.
- [ ] Masked-area exposure equality is mathematically exact.
- [ ] The deterministic static-center rule matches moving-mask sample count
      exactly without using reconstruction results.
- [ ] Temporal and geometric exposure arrangements remain declared differences.
- [ ] The moving-mask interpretation cannot exceed the matching rule.

## E. Analysis

- [ ] Reconstruction is deterministic and uses visible data only.
- [ ] Prefix and suffix gaps remain `UNKNOWN`.
- [ ] Segmentation rules are executable without Owner interpretation.
- [ ] Metrics, units, tolerances and terminal states are explicit.
- [ ] Six pairs are not used for population inference.
- [ ] False reconstruction is a blocking failure.

## F. Data and replay

- [ ] Every schema field has one meaning.
- [ ] Filenames do not leak template or direction identity.
- [ ] Sealed truth is isolated.
- [ ] Hash rules are deterministic.
- [ ] Environment, software and event provenance are sufficient for replay.
- [ ] Corrections are append-only.

## G. Leakage and controls

- [ ] All prohibited fields are enumerated.
- [ ] F/R reversal, line, circle, figure-eight and unbounded-gap controls are
      present.
- [ ] Tampered hashes and direction leaks are rejected.
- [ ] Contamination requires a new packet, not an edited response.

## H. Decision

Select exactly one:

```text
ACCEPTABLE FOR OWNER FREEZE
REVISION REQUIRED
REJECT
```

Required rationale:

```text
Reviewer identity:
Review date:
Protocol hash:
Decision:
Critical findings:
Required revisions:
Residual limitations:
Signature or authenticated approval reference:
```

Completion of this checklist does not authorize acquisition. Owner approval is
still required.
