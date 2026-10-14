# Breathing / Prime Crystal Instrument Family

Status: `INTERNAL_READ_ONLY_CALIBRATION_FAMILY`

Date: `2026-10-08`

## Decision

The historical Breathing Crystal, Vendessimal Prime Grid, Euler-41, twin-prime,
root-band and 1061–1064 materials are retained as one typed instrument family.
They are not promoted as a new prime theory or as a Prime/LIFE mechanism.

The useful result is a calibration fixture: the carrier `1..3000` and its
arithmetic labels remain fixed while 19-, 20- and 21-column cuts generate very
different apparent topologies. This makes the family a bounded negative control
for LIFE and CA-IDENT.

This role is now executed on the prime fixture rather than merely proposed.
[`CA-IDENT-09 / PBC-01`](../../../CASE_STUDIES/NEXAH_VIEW_INDUCED_TOPOLOGY_CALIBRATION_CA_IDENT_09_2026-10-08/README.md)
was preregistered, hash-locked and run on 8 October 2026. All five gates
passed: `0` identity mismatches, `9,000/9,000` exact returns, stable-channel
prediction disagreement of `0% / 0%`, and view-channel disagreement of
`50.4% / 51.3%` under the two untouched cuts.

The inventory now records its edge convention explicitly: `162` twin-prime
members uses global membership and includes `2999↔3001`; requiring both
partners inside `1..3000` gives `161`. The calibration gates are unaffected.

## Primary result

The same 430 primes produce `1`, `108` and `2` visible prime-neighbour edges in
the 19-, 20- and 21-column cuts respectively. The 20-column view introduces 107
additional vertical prime adjacencies without changing a single integer or
prime label.

The representation therefore separates:

- persistent carrier truth;
- view-local topology;
- introduced overlay structure;
- unresolved cross-domain interpretation.

## Navigator role

The Navigator exposes the family inside `#life-orbit` as:

1. exact arithmetic carrier;
2. three-cut representation control;
3. Breathing comparison-core specification;
4. LIFE / CA-IDENT negative-control bridge.

The fourth layer is therefore split in two: the arithmetic calibration is
complete, and the bounded transfer to one frozen LIFE event carrier is now
also complete. [`CA-IDENT-10 / LIFE-VIEW-01`](../../../CASE_STUDIES/NEXAH_LIFE_THREE_CUT_EVENT_TRANSFER_CA_IDENT_10_2026-10-08/README.md)
retains all 14,132 event identities with `42,396/42,396` exact returns. Stable
predictions remain identical across cuts, while view-only decisions disagree
by `22.66% / 26.88%` and event topology falls to Jaccard `0.338 / 0.347`.

This is a single-fixture method transfer, not a universal LIFE result. Further
run-level replication requires a new preregistration and an explicit decision
that cross-run generality is the next question.

The canonical condensed interpretation is
[`NEXAH Carrier–View–Residual Finding`](../../../LABREPORTS/SYNTHESIS/NEXAH_CARRIER_VIEW_RESIDUAL_FINDING_2026-10-08.md).
Mission Control accepts it as a bounded two-carrier method result and closes
automatic expansion in
[`MISSION_CONTROL_RETURN_CA_IDENT_09_10_CARRIER_VIEW_RESIDUAL_2026-10-08.md`](../../../MISSION_CONTROL_RETURN_CA_IDENT_09_10_CARRIER_VIEW_RESIDUAL_2026-10-08.md).

The section is read-only. It changes neither the seven canonical Connection
Families nor public admission.

## Authority and boundary

The machine-readable controlling record is
[`BREATHING_PRIME_CRYSTAL_BINDER_V1_2026-10-08.json`](BREATHING_PRIME_CRYSTAL_BINDER_V1_2026-10-08.json).

The historical field notes remain provenance. The later forensic audit controls
what may be treated as exact, representation-dependent or unresolved.
