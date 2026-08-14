# EXP-00-R Registered Evidence Generator R2

Status: **IMPLEMENTED — READY FOR INDEPENDENT R2 NULL-NAMESPACE CONFORMANCE REVIEW**

This additive package repairs one interface defect in Generator R1. The former gate required every null namespace to end in a bare integer seed. R2 instead validates the exact frozen A3 grammar for N1, N2, N3, N4_T and N4_F.

The authority precedence is resolved. A3 fixes family-specific suffixes; Export R1/G1 makes physical seed IDs authoritative. N3 carries that ID inside `ROW=SPLIT.SEED.INDEX`. N4 has no `SEED` suffix: its physical-seed authority is the complete canonical row population from which its stored strata are reconstructed.

R2 does not append, remove, reorder, rename or normalize namespace components. It does not change serialization, SHA-256, the first-eight-byte big-endian seed derivation, PCG64, seed registries or null semantics.

```text
FROZEN SCIENTIFIC SEMANTICS MODIFIED: NO
CANONICAL NULL NAMESPACE MODIFIED: NO
NULL RNG STREAM MODIFIED: NO
VALIDATION LOGIC MODIFIED: YES — NARROW FAMILY-SPECIFIC REPAIR
```

Only synthetic fixtures were used. No producer was resumed, no authorization was consumed, no registered input or result was accessed, and no scientific classification was generated.

Next permitted object: `INDEPENDENT GENERATOR R2 NULL-NAMESPACE CONFORMANCE REVIEW`.
