# Independent seal review

Date: 2026-09-16  
Review mode: read-only, independent recomputation without invoking `--execute`  
Verdict: **COMPUTATIONAL / PROTOCOL PASS WITH QUALIFICATIONS**

## Reproduced result

- Protocol JSON, protocol Markdown and runner hashes match the seal manifest.
- The recorded predecessor JSON and PNG hashes also match the manifest entries.
- Independent recomputation reproduces 1,798 eligible targets, 13 target successes, 3,596 unique controls and 0 control successes.
- Reported rates and 99% Wilson intervals reproduce.
- The frozen PASS rule is satisfied.
- Result SHA-256: `f8a4608bcd87652a2ba1b2aab60ba0b4b1a3d01813e558f9ea654d7e2a02d749`.

## Qualification that changes the wording

The eligible target `10001` uses adjacent control `10000`, which lies inside the previously inspected `1..10000` predecessor range. The full control set is therefore not literally pristine holdout data.

This exception is non-decisive: excluding the complete triplet around `10001` leaves `12/1797` target successes against `0/3594` controls, and the frozen decision rule still passes.

## Additional methodological limits

1. The seal is local and self-attested. There is no Git commit, external timestamp or independent witness proving chronology or prior noninspection.
2. The runner's seal check enforces hashes for the protocol JSON, protocol Markdown and runner, but not the manifest's predecessor receipts. Those predecessor hashes currently match when checked independently.
3. Separate Wilson intervals do not model the matched-triplet design. A paired or exact randomization analysis would be preferable as a supplementary analysis, but was not preregistered.
4. Secondary-base checks reuse roots selected by a base-10 predicate. They show non-reproduction for this base-10 selector, not the absence of analogous enrichment under independently defined base-8, base-12 or base-16 selectors.
5. The identity destruction control follows directly from target selection and validates pipeline plumbing only.

## Permitted Mission-Control claim

> **PASSED — preregistered base-10 representation-level discrimination gate. Independent review: QUALIFIED. One non-decisive boundary exception at control 10000. Theory, universality and physics claims unchanged.**

This is a deterministic integer census over a prespecified interval and selector. It is not an external empirical replication, a universal invariant, or evidence for a physical mechanism.
