# A5 RNG and Ordering Audit

The accepted binding reconstructs UTF-8 `CONFIG_ID|family|replicate` plus ordered `|TAG=VALUE` fields; typed closed alphabets; SHA-256; digest bytes `[0:8]`; unsigned 64-bit big-endian seed; fresh NumPy 2.3.5 `Generator(PCG64(seed))`; no preliminary/retry draws. Split, seed, canonical row, action, representation, carrier, null, donor, stratum, sensitivity and global computational orders are fixed.

Draw consumption is one `permutation(5)` for each N1 namespace, one `permutation(n)` per N2 namespace, one `integers(0,n,endpoint=False,dtype=int64)` per N3 recipient, and one `permutation(n)` per N4 stored stratum. A4's four known-answer fixtures remain hash-bound.

Thus two implementations following the full authority stack generate identical worlds under the frozen environment. However, A5's own semantic validator checks only generator and digest slice; it accepts mutations to namespace serialization and row ordering after a coordinated manifest rewrite. This is A5-R29 integrity weakness, not a new RNG scientific ambiguity.

**RNG/ordering scientific contract: PASS. Independent A5 mutation enforcement: FAIL.**

