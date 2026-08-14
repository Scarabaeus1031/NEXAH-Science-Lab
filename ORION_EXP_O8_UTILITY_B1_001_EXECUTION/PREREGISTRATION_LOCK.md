# PREREGISTRATION LOCK — EXP-ORION-O8-B1-001

UTC lock timestamp: `2026-08-10T21:42:51Z`

Reviewed preregistration: `ORION_O8_UTILITY_B1_PREREGISTRATION/`

Reviewed canonical preregistration SHA-256:
`ead9f410fe2361284d3ff46d3df216f033e1c6f3b63e7b1dce845594ba51184c`

Controlling O8 scientific SHA-256:
`cfea693c746c0ab16515b7ee716ba5d2ebe6f15ec84fdbd9e41f7b0585e5f0e5`

Review state: `CRITICAL 0 / MAJOR 0 / MINOR 3`.

RESULT KNOWN AT LOCK TIME: NO.

EXECUTED AT LOCK TIME: NO.

## Primary question

Given held-out typed `x` and `y=g_b(x)`, with `b in F_2^3` hidden, can ORION
identify the applied O8 transformation and use that committed identification
to recover the exact canonical source state?

## Frozen strata and population

IDENTIFIABLE iff all eight canonical O8 orbit outputs are pairwise distinct
and `Stab(x)={000}`; both tests must agree. Otherwise the source is AMBIGUOUS,
is retained, is excluded from the primary endpoint and requires exactly
`UNIDENTIFIABLE`.

TRAIN `0`; DEVELOPMENT `96`; TEST-FRAME `1024`. Sources use the registered
SHA-256 counter contract, alphabet `0..9`, length 12, phase `Z6`, both tagged
orientations and scales `{-2,-1,0,1,2}`. Duplicates and cross-split overlaps
are audited and replaced before observation. Primary population is the first
`8*floor(N_I/8)` identifiable states in frozen order and requires
`N_PRIMARY>=512` for an informative benchmark.

Within every consecutive block of eight primary sources, every registry state
`000,100,010,001,110,101,011,111` is assigned exactly once by the frozen
domain-separated SHA-256 rule. Exact operator balance is mandatory.

## Frozen arms and budget

Both arms receive byte-identical authoritative `x/y`, schema and safe
provenance inputs, the same canonical serializer, exact matcher, output
protocol and exactly eight candidate materializations/comparisons.

BASELINE receives identity plus seven blindly scheduled candidates from the
frozen generic 48-action typed affine family. It receives no O8 registry,
generator labels, O8 signatures, hidden `b` or equivalent lookup table.

PLUS_O8 receives the validated OperatorRegistry, OperatorState, XOR
Composition and exact Transport interfaces for all and only the eight frozen
O8 states. It receives no hidden `b`, threshold or case lookup.

## Endpoint, margin and inference

The sole primary endpoint on IDENTIFIABLE primary cases is exact joint
identification and canonical recovery. A success requires `b_hat=b`,
`canonical_bytes(x_hat)=canonical_bytes(x)` and equality of every registered
authoritative/derived field. The recovery evaluator alone applies the inverse
of the committed action to `y`; observers cannot copy `x` as recovery.

Frozen practical margin: `Delta_hat=p_PLUS-p_BASELINE >= 0.20`.

Single inference: one-sided exact paired McNemar, alternative PLUS greater
than BASELINE, `alpha=0.01`; no secondary inferential rescue or multiplicity
search.

## Leakage and exactness gates

Frozen SOURCE_INPUT, TRANSFORMED_INPUT, BASELINE_INPUT, O8_INPUT,
OBSERVER_OUTPUT and RECOVERY_OUTPUT schemas apply. Hidden `b` is forbidden in
paths, IDs, ordering, positions, hashes, provenance labels, serialization,
operator metadata, RNG state, expected fields, thresholds, logs and timing
feedback. Shared payload byte equality, metadata-only decoding,
constant-payload, length/key, contamination, schedule independence and
commit-before-unseal audits are mandatory. Equality is canonical and exact;
there is no tolerance or approximate recovery.

## Mandatory controls

- D1 truth-label XOR `001`: joint exact success exactly zero for both arms.
- D2 PLUS registry-binding XOR `001`: PLUS joint success exactly zero.
- D3 next-source transformed mismatch: at least 99% UNIDENTIFIABLE and zero
  accepted exact recovery.
- D4 strip nonauthoritative metadata: byte-identical actions/equality vectors.
- D5 natural ambiguous plus 96 stabilizer fixtures: 100% UNIDENTIFIABLE and
  zero confident actions.
- D6 information loss by source sorting: 100% UNIDENTIFIABLE and zero false
  O8 recovery.

## Frozen result classes in precedence order

1. `INVALID_EXPERIMENT` for any protocol, provenance, population, schema,
   fairness, budget, leakage, canonicalization, mandatory-control or replay
   failure, or any post-lock scientific/algorithmic change.
2. `UNINFORMATIVE_BENCHMARK` if valid but a frozen ceiling/triviality trigger
   fires, including `N_PRIMARY<512`, BASELINE joint success `>=0.95`, a shared
   within-budget shortcut, a case lookup, or unaccounted free enumeration.
3. `O8_UTILITY_DEMONSTRATED` only if every validity/control/replay gate passes,
   the benchmark is informative, `Delta_hat>=0.20` and exact McNemar
   `p<=0.01`.
4. `NO_DEMONSTRATED_UTILITY` if valid and informative but a practical or
   inferential utility criterion fails.

## Replay

After primary sealing, a clean replay in a new directory may receive only this
lock, the frozen implementation, controlling O8 interfaces and seed contracts.
It must independently regenerate population, fixtures, strata, schedules,
observations, predictions, recovery, D1–D6 and decision without reading primary
generated artifacts. Canonical scientific-result hashes and population,
strata, schedules, predictions, recovery, controls and decision stage hashes
must be byte-identical.

No population, rule, baseline family, candidate budget, registry, margin,
test, alpha, control, recovery contract, class or replay contract may change
after this timestamp.
