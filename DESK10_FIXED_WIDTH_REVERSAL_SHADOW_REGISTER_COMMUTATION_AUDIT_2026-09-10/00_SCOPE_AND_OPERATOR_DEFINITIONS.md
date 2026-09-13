# Scope and operator definitions

New bounded additive mathematical audit, 2026-09-10. No prior audit, source artifact, ORION Core file, or repository index was modified. No commit or push.

D_4 is the 10,000 four-character words 0000 through 9999. R_4 reverses all four characters and preserves leading zeros. S_N(x)=(-x) mod N returns the canonical residue 0 through N-1. An S comparison is valid only when both S_N(x) and S_N(R_4(x)) are at most 9999. T_N(x)=(N-x) mod 10000 is a separate four-digit-register operation and is always representable.

Primary sweep: every N=1,...,10000 and every x in D_4. External registers 10033, 31000, 33000, 33001 are comparison rows only. Multi-base controls use four base-b digits and T_N modulo b^4.
