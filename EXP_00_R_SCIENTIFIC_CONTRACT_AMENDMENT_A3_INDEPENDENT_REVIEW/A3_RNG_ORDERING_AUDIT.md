# A3 RNG and Ordering Audit

## RNG verdict

The stochastic stream contract itself is uniquely specified:

- V1-compatible raw prefix and ordered typed suffix fields;
- injective closed alphabets and explicit separators, no length field/terminator;
- UTF-8/ASCII encoding;
- SHA-256 bytes 0–7;
- unsigned 64-bit big-endian seed;
- `Generator(PCG64(seed))`, NumPy 2.3.5 on the frozen platform;
- fresh per-object generator;
- exact `permutation`/`integers` call and zero preliminary draws;
- replicate IDs 0–199;
- invalid-before-draw and no retry/replacement.

Identical namespaces produce identical draws in the frozen environment. N1/N2/N3/N4 streams cannot shift one another.

## Ordering verdict

Randomized scientific objects are mostly canonical: family, representation, carrier, split, replicate, seed, action, row, donor, stratum, phase/target/support bin, and exact-distance neighbor ties.

Remaining defects:

1. no closed ordering is given for the six sensitivity axes and their values;
2. the canonical row key is not explicitly imposed on every regression-standardization, model-fit, bootstrap, per-seed reduction, and reporting reduction, leaving binary64 accumulation/order behavior to implementation;
3. N4's support-distance input is undefined before ordering can be applied.

**RNG: PASS. COMPLETE RNG/ORDERING CONTRACT: FAIL.**
