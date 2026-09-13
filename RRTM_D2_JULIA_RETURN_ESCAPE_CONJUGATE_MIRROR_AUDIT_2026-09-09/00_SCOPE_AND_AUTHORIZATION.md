# RRTM-D2 Scope and Authorization

Date: 2026-09-09  
Mode: bounded forensic provenance audit plus isolated deterministic numerical test.

This is a new additive workstream. The search scope actually inspected was:

- the supplied five-file intake directory;
- `/Users/tho2020/Desktop` and `/Users/tho2020/Documents` for exact names, hashes, textual candidates, and generators;
- relevant NEXAH Science Lab and NEXAH Core source paths returned by that search.

No claim of absence is made outside that scope.

Authorized actions performed: read-only search, hashing, metadata inspection, static generator review, visual inspection, and execution of the new audit-only standard-library implementation. No network call, dependency installation, hardware action, legacy execution, or legacy modification occurred.

The primary mathematical object is the discrete complex dynamical system

`z_(n+1) = z_n^2 + c`, with `c=-0.75+0.10i`.

The system has two real state dimensions. Iteration count is not physical time, and `f_c` is not frequency.
