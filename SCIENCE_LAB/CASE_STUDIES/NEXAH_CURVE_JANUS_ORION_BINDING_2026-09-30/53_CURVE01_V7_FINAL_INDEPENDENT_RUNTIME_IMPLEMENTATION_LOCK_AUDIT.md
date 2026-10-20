# CURVE01 V7 — final independent runtime/implementation-lock audit

Date: `2026-09-30`

## Strict disposition

```text
PASS
```

V7 closes the sole blocker from audit 51. The numerical runtime now fails
closed on exact CPython, NumPy and Numba versions and on deterministic content
fingerprints of both installed package trees. The runtime contract, enforcement
module and every executable implementation component are bound by the V7
implementation manifest. Independent mismatch attacks, kernel-equivalence
tests and the full supervised synthetic pipeline all passed.

Production mode executed: **NO**.

Formal production resource preflight executed: **NO**.

Registered production population built or inspected: **NO**.

Controlling design or implementation artifacts modified: **NO**.

## 1. Scope and manifest verification

Audited:

- `CURVE01_V0_10_DESIGN_HASH_MANIFEST.txt`;
- `CURVE01_IMPLEMENTATION_MANIFEST_V7.txt` and all twelve entries;
- `config/curve01_runtime_lock_v1.json`;
- `scripts/curve01_runtime_lock_v1.py`;
- accelerated producer and independent compiled-reference kernels;
- equivalence suite, runner, finalizer, supervisor, reference checker,
  implementation validator and negative suite;
- `52_CURVE01_V7_FAIL_CLOSED_RUNTIME_BUILD_LOCK_REPAIR.md`;
- supplied V7 equivalence output, supervised synthetic bundle and negative
  report;
- fresh equivalence, adversarial, supervised, offline and negative runs.

Every manifest entry passed SHA-256 verification.

```text
V0.10 design-manifest SHA-256
6373d9f0a47e7bdb665fdf4217dd74b3040c62976a26e30cdaaf20633dc43fd9

V7 implementation-manifest SHA-256
fc684a294af07a9befc4bd91569e0b7a1a2ca4dd0481dce94a4baebdacd2c8e8
```

The implementation manifest binds the runtime JSON, enforcement module,
contract, both kernels, equivalence harness and all pipeline entry points.

## 2. Exact runtime and independent package-tree fingerprints

Observed and required runtime:

```text
implementation     CPython
Python             3.12.7
NumPy              1.26.4
Numba              0.60.0
fastmath           false
```

The package-tree algorithm was independently reimplemented without importing
the CURVE01 lock function:

1. recursively enumerate the package directory in sorted path order;
2. keep regular files;
3. exclude paths containing `__pycache__` and suffixes `.pyc`, `.pyo`, `.nbc`
   and `.nbi`;
4. for each retained file hash the exact bytes and append
   `relative_path NUL byte_length NUL file_sha256 LF`;
5. SHA-256 the concatenation of those rows.

Independent results exactly match both the JSON contract and enforcing module:

```text
NumPy files        781
NumPy tree SHA-256 18030874a1e2f551de4b6523e4336ae84d52f5253e47d7ddb29550aa9813199b

Numba files        782
Numba tree SHA-256 b42b08d77e193b84b5228ca10d631ea7ccfe6389cf1a8740de9f2ea82171c5f2
```

The retained trees include Python/source files and compiled `.so` binaries;
mutable Python and Numba cache artifacts are excluded.

## 3. Fail-closed enforcement

Static inspection confirms `runtime_lock.enforce()` is invoked by:

- accelerated producer kernel;
- independent accelerated reference kernel;
- scientific runner;
- pending finalizer;
- online supervisor;
- public implementation validator;
- reference checker;
- kernel-equivalence suite; and
- negative-integrity suite.

Version checks execute on every call. Full tree verification executes once per
process and is then cached only after successful verification.

Independent attacks all failed closed:

```text
observed NumPy version changed       rejected
observed Numba version changed       rejected
observed NumPy tree hash changed     rejected
observed Numba file count changed    rejected
runner-record NumPy version changed  rejected
runner-record Numba tree hash changed rejected
runner-record fastmath=true          rejected
```

The locked negative suite independently exercises mismatches in both versions
and both expected build-tree hashes.

## 4. Runner-record literal validation

The runner writes locked literals from the enforcement module, not dynamic
library values. The public validator compares the complete exact object to the
same locked literals:

```text
engine
NumPy version, file count and tree SHA-256
Numba version, file count and tree SHA-256
fastmath
```

The fresh runner record contains the exact required values. Mutations to three
different fields were rejected with `RUNNER_RECORD_INVALID` or an equivalent
non-valid result.

## 5. Kernel equivalence under the locked runtime

The locked equivalence suite was rerun and passed:

```text
splitmix_vectors_exact          true
synthetic_full_tuple_exact      true
worst_shape_full_tuple_exact    true
producer tuple SHA-256          7548fc11d9656035aff94f7fc638c32358cbeb645b52a56dc039b0d14ffdd4da
reference tuple SHA-256         7548fc11d9656035aff94f7fc638c32358cbeb645b52a56dc039b0d14ffdd4da
```

The fresh equivalence-report file differs from the supplied file only in
runtime timing values.

The prior independent suite was also rerun under V7:

- 9-record, 17-draw variable-shell fixture: complete tuple exact;
- 12-record, 63-draw multi-prime/numeric-edge fixture: complete tuple exact;
- 12-record, 257-draw batch-boundary fixture: complete tuple exact with two
  batches;
- five priority vectors, including production-shape maxima: exact;
- actual-selection violation path: live;
- producer and reference nopython paths: `fastmath=False`;
- `b>1000` reference dispatch: separate compiled reference confirmed.

## 6. Independent worst-shape check

The synthetic 49,992-record / 15,914-shell / 100-draw shape was rerun under the
locked runtime. This did not enumerate or inspect the registered population and
was not the formal resource preflight.

```text
records                    49,992
shells                     15,914
conservation rows          1,591,400
all 32 batch sums exact    true
minimum batch sum exact    true
independent digest exact   true
```

Conservation digest:

```text
782af40068b420206a727a868a90e556fa6af02f36f514a9ae19a38dd7b6358f
```

## 7. Fresh supervised pipeline and negative suite

Fresh supervised synthetic run:

```text
IMPLEMENTATION_VALID
scientific result SHA-256
ff8b855ccc0ea28377a982680901714f73cfe8fa96fc251f947a1fe30a3f0a2b
```

Fresh public offline checker:

```text
ARTIFACT_VALID
```

All 13 locked negative tests passed. The supplied and fresh negative reports
are byte-identical:

```text
49a940a73147fcd634be37890f329a70605861998106d3fbbe0bba3d26cd1177
```

Supplied and fresh V7 bundles differ only in live process/nonce receipts.

## 8. Scientific-byte identity

The following five files are byte-identical:

- V4 supplied synthetic scientific result;
- V5 supplied synthetic scientific result;
- V6 supplied synthetic scientific result;
- V7 supplied synthetic scientific result;
- fresh V7 synthetic scientific result.

All have SHA-256:

```text
ff8b855ccc0ea28377a982680901714f73cfe8fa96fc251f947a1fe30a3f0a2b
```

## 9. Findings

No critical, major or minor lock-blocking finding remains in the audited V7
scope. The package-tree fingerprint is an exact installed-build content lock,
not a claim about upstream package signatures; that distinction does not weaken
the local deterministic runtime gate requested here.

This PASS locks the audited V7 implementation/runtime and synthetic evidence.
It does not constitute a scientific result, a formal resource-preflight pass,
or authorization to run production.

## 10. Final decision

```text
PASS
```

The next permitted gate is the separately authorized formal resource preflight.

Review artifact SHA-256: reported after finalization.
