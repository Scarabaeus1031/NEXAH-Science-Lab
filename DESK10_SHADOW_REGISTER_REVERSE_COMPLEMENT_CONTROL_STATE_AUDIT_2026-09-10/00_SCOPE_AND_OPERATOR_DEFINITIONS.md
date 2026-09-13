# Scope and operator definitions

New bounded additive deterministic audit, 2026-09-10. Prior audits, ORION Core, sources, and indexes remain untouched. No commit or push.

- S_N(x)=(-x) mod N in canonical residues.
- C_N(x)=N-x only for 0<=x<=N.
- R_10 reverses a declared base-10 string.
- Canonical spelling has no leading zeros and normalizes reversal.
- Fixed width pads to register width, reverses, then normalizes numerically.
- Empty and negative strings are outside this test.
- Perfect power means n=a^b with a>=2,b>=2; 0 and 1 are excluded.

Complete commutation domains are 0<=x<N. Controls use Node.js v24.19.0; raw control bytes were inspected, not emitted.
