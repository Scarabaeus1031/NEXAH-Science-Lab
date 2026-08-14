# A5XE Raw-Evidence Reconstruction Audit

## What reconstructs correctly

The canonical synthetic fixture reconstructs observed agreement, five null families at 200 repetitions, 500 seed-cluster resamples, N5 rank comparisons, row losses, exact dominance and P1–P5. Summary-only and direct-decision bundles are rejected.

## Smallest accepted counterexample

Starting from the canonical bundle:

1. mark the 100 TEST rows of `SYNTH_00` and `SYNTH_01` unsupported for both representations, leaving joint coverage valid at `1400/1500`;
2. update every null population hash and the raw provenance hashes;
3. replace `model_spec` by an unregistered model;
4. delete all score/margin-control evidence and empty all three report-only diagnostics;
5. corrupt one amplitude sensitivity's path, primary/alternate values, P5 flag, config hashes and required outputs;
6. recompute all affected raw-ledger hashes.

Both derivations return exactly equal normalized records with `VALID_SCIENTIFIC_RESULT`, `REPLICATED`, and all P1–P5 true.

The result is wrong under the accepted contract: the 100 unsupported rows remain in observed/null models; missing P4 controls and diagnostics do not invalidate; corrupted sensitivity identity is ignored; supplied sensitivity coherence arrays remain authoritative; and `model_spec` has no operative effect.

This is a semantic counterexample with internally refreshed provenance, not a hash-mismatch attack. R34 and R36 remain open.
