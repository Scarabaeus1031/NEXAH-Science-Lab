# CURVE01 V7 formal production resource preflight

Date: `2026-09-30`

Status: `PASS`

## Authorization basis

The formal preflight was executed only after the independent V7
runtime/implementation-lock audit returned `PASS`:

```text
Audit report:
53_CURVE01_V7_FINAL_INDEPENDENT_RUNTIME_IMPLEMENTATION_LOCK_AUDIT.md

Audit report SHA-256:
53ef4f865efc3498eca9ac11721784fd7543b53030b2434d20e974638832485a
```

Before measurement, the process:

1. enforced the exact CPython/NumPy/Numba version and build-tree lock;
2. parsed the V7 implementation manifest using the fail-closed manifest
   reader;
3. compared the exact runner bytes with the manifest-bound runner SHA-256;
4. invoked only the locked `resource_preflight()` path.

```text
V0.10 design-manifest SHA-256:
6373d9f0a47e7bdb665fdf4217dd74b3040c62976a26e30cdaaf20633dc43fd9

V7 implementation-manifest SHA-256:
fc684a294af07a9befc4bd91569e0b7a1a2ca4dd0481dce94a4baebdacd2c8e8
```

## Measured result

The preflight exercised the exact production permutation path on the frozen
worst-case synthetic dimensions. It did not build or inspect the registered
production population and did not execute the scientific production run.

```text
records:                    49,992
possible shells:            15,914
origins:                    32
draws per timing trial:     100
warmups:                    1

elapsed trial 1:            1,166,121,291 ns
elapsed trial 2:            1,154,073,875 ns
elapsed trial 3:            1,187,440,916 ns
median:                     1,166,121,291 ns

projected 200,000 draws:    2,332.242582 s
projected duration:         38.87 min
time limit:                 21,600 s (6 h)

peak RSS:                   250,281,984 bytes
peak memory:                0.23309326171875 GiB
memory limit:               8.0 GiB
```

Strict predicate:

```text
projected_seconds <= 21,600  true
peak_gib <= 8.0              true
status                       PASS
```

Compared with the failed V5 preflight, projected runtime decreased from
`66,985.213 s` to `2,332.243 s` while the independently verified scientific
bytes remained unchanged.

## Gate consequence

The V7 locked implementation satisfies the registered resource predicate.
This closes the optimization/re-audit/preflight phase. The 200,000-draw
production scientific execution remains a separate action and was not started
by this preflight.
