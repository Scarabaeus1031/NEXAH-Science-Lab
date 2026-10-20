# A0-BL-054 — IEEE-300 Critical-Orbit / Ghostgrid result

Date: `2026-10-18`  
Status: `RESULT_READY / EXECUTION_STOPPED / AWAITING_OWNER_DISPOSITION`

## Registered result

`MIXED_NEGATIVE`

Primary and Replay are byte-identical. The registered scientific result hash
is `796afaabe7c0c2168b959120ae53c5520c18141a61130a3f5909425076a798ac`;
the artifact-file SHA-256 is
`ad3d4f3ea96054a15fd3be87d9c132977934763c51760e2c80a967013cf83d57`.
The independent verifier passes.

## What passed

- no orbit escaped;
- bus relabeling is exactly invariant (`max_abs = 0`);
- all seven load signatures are distinct;
- load ordering is retained (`rho = 0.991031`);
- endpoint load separation is `L1 = 0.642857`;
- topology sensitivity is `L1 = 0.142857`;
- synthetic-ablation sensitivity is `L1 = 1.071429`;
- the fixed order-control changes the ordered view (`L1 = 1.285714`);
- collision accounting passes;
- `z1..z4` and raw complex iterates remain unexposed.

## What failed

The preregistered `ALL_VIEW_STRESS` gate fails. Of 81 declared
resolution/phase/viewport configurations, 60 pass and 21 fail. Every 16-bin
and 32-bin configuration passes. At 8 bins:

- ordered time × radius fails `9/9`;
- phase × radius fails `6/9`;
- radial-delta × phase fails `6/9`.

The minimum ordering correlation is `rho = 0.731126`, below the frozen
`0.80` threshold. The view is therefore resolution-sensitive at the coarse
8-bin setting and cannot support the registered all-view stability claim.

## Comparator boundary

The primary 16-bin ordered view has `rho = 0.958546`. The 32 registered random
two-dimensional projections have q95 `rho = 1.0`; the orbit representation
does not establish an advantage over those direct summary projections. This is
diagnostic under the frozen protocol and does not override the primary
`MIXED_NEGATIVE` result class.

## Interpretation

The adapter is deterministic, replayable, label-invariant and responsive to
the declared state controls, but the Ghostgrid view family is not stable under
all preregistered coarse-resolution changes. The result preserves a useful
engineering representation boundary rather than a robust representation
advantage.

## Claim boundary

Not established: early warning, prediction, physical Critical Orbit, causal
mechanism, preferred geometry, operational grid utility, universal Ghostgrid
stability, public release or publication readiness.

The result awaits Human Owner acceptance, revision request or rejection. No
successor is activated automatically.

