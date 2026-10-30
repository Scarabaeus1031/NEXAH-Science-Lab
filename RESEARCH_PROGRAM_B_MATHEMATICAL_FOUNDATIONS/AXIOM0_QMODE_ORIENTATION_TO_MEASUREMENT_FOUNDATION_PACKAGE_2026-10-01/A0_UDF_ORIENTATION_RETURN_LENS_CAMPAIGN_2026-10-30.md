# A0 UDF Orientation Return — seven-part lens campaign

**Date:** `2026-10-30`
**State:** `ENGINEERING EVIDENCE + GAP LOCALIZATION / NOT ACTIVE`
**Reproducibility:** local deterministic replay; Human protocol ready, not run
**Identity effect:** reuse only; no new canonical ID or Source Graph relation

## Question

Does the experimental Crystal Orientation Return profile gain a useful,
testable distinction from a strong PROV / RO-Crate-style baseline through its
size, lens separation, error localization, cross-lens consistency,
cross-instrument portability, incomplete-state handling or Human
reconstruction utility?

## Reproduction

From `A0_BOOK/`:

```sh
node a0-udf-orientation-return-proof-tests.cjs
node a0-udf-orientation-return-baseline-benchmark.cjs
node a0-udf-orientation-return-lens-campaign-tests.cjs
```

Primary machine return:
`results/a0-udf-orientation-return-lens-campaign-2026-10-30.json`.

## 1 · Compression

| Encoding | UDF-A0 | PROV / RO-Crate baseline | UDF as % of baseline |
|---|---:|---:|---:|
| raw JSON | 2030 B | 4485 B | 45.26% |
| gzip level 9 | 992 B | 1399 B | 70.91% |
| Brotli quality 11 | 828 B | 1195 B | 69.29% |

The raw record is roughly 55% smaller. Under transport compression the UDF
advantage is about 29–31%. This is a useful engineering property, not a
scientific novelty or utility result.

## 2 · Lens ablation

Seven implemented lenses pass isolated ablation:

1. Source;
2. Carrier;
3. Orientation;
4. Comparator;
5. Transformation;
6. Return;
7. Claim Boundary.

Removing one lens makes exactly its declared questions unanswerable and leaves
the remaining questions answerable. `7/7 PASS`. The explicit Loss lens is not
yet implemented: the current profile has rejection and non-mutation
boundaries, but no first-class `retained / lost / added / unresolved` record.

## 3 · Error localization

Twenty-two matched corruptions were injected into UDF and baseline records:
schema/profile, source and target identity/contract, hash, pair, PIN, both
axes, theta, radius, winding, direction, both comparator addresses, Return,
mutation, new identity, relation change and malformed JSON.

Both validators rejected all `22/22` with localized error classes. Result:
`TIE / NO ERROR-LOCALIZATION ADVANTAGE ESTABLISHED`.

## 4 · Cross-lens consistency

Seven consistency relations pass for both encodings:

- Source equals Carrier source;
- Carrier and Transformation name the declared target;
- horizontal and vertical nodes remain distinct;
- winding and direction agree;
- comparator roles remain distinct;
- Return and Transformation remain non-mutating;
- no identity or relation promotion occurs.

Result: `7/7 PASS` for both encodings.

## 5 · Second instrument

Panel V is a genuinely different source shape: five channels, seven declared
events, a `147.5°` stop and exact outbound/return closure. The current Crystal
profile rejects it with `UDF_ORIENTATION_LEDGER_REQUIRED`.

Disposition:
`FAIL_CLOSED / CURRENT PROFILE NOT CROSS-INSTRUMENT PORTABLE`.

This is the correct result. Treating a five-channel event sequence as a
two-axis plane-orientation frame would be a semantic collapse. A reusable
profile family would need a minimal common core plus distinct
`plane-orientation` and `event-sequence` profiles. No such vocabulary or
profile is authorized or frozen here.

## 6 · Incomplete states

Five incomplete cases were tested: unknown vertical node, unobserved theta,
unresolved winding, unknown Return target and unobserved source hash. Both
validators reject all five and therefore fail closed.

However, neither current profile preserves why the value is absent. It cannot
yet distinguish `UNKNOWN`, `UNOBSERVED`, `UNRESOLVED` and `NOT_APPLICABLE` as
first-class values. This is a concrete design gap, not a passed capability.

## 7 · Human reconstruction

A counterbalanced within-subject protocol is ready with two equal-information
fixtures, eight scored questions, timing, false-identity, false-release,
unnecessary-STOP and confidence measures.

- two neutral fixtures; their A/B mapping is withheld from participants;
- custody mapping: `A0_BOOK/results/a0-udf-human-reconstruction-custody-key-2026-10-30.json`;
- protocol state: `READY_NOT_RUN_NO_HUMAN_RESULT`;
- minimum claim gate: eight completed participants;
- STOP on tie, worse UDF result, unequal instructions, unblinding or missing
  timing.

Protocol:
`A0_BOOK/results/a0-udf-orientation-return-human-reconstruction-protocol-2026-10-30.json`.

No Human utility or superiority result exists yet.

Operational return: `PARKED_AWAITING_SEPARATE_HUMAN_PARTICIPANT_GATE`. No
recruitment, participant exposure or response collection is authorized by this
engineering campaign. Mission Control retains the later go/no-go decision.

## Overall disposition

```text
COMPACTNESS ADVANTAGE                 YES · ENGINEERING ONLY
SEVEN QUERY-SEPARABLE LENSES          YES · ONE CRYSTAL PROFILE
ERROR LOCALIZATION ADVANTAGE          NO · 22/22 TIE
CROSS-LENS CONSISTENCY                YES · 7/7 BOTH
CROSS-INSTRUMENT PORTABILITY          NO · CORRECT FAIL-CLOSED
INCOMPLETE-STATE VOCABULARY           NO · CONCRETE GAP
INDEPENDENT HUMAN UTILITY             NOT TESTED
NOVELTY / CAPABILITY / FINDING        NOT ESTABLISHED
```

## Next permitted design question

The evidence supports one narrow design question:

> Can a minimal, unfrozen profile-family core carry Source, Return and Claim
> Boundary while instrument-specific profiles separately carry Crystal plane
> orientation or Panel V event-sequence semantics?

That question may be prepared as a Builder design note. It is not activated,
admitted, frozen or promoted by this campaign.

## Later scientific sequence — proposed, not active

If the Structure Freeze is separately reopened for this object, the smallest
responsible sequence is:

1. independently run the prepared Human reconstruction protocol;
2. test first-class `UNKNOWN / UNOBSERVED / UNRESOLVED / NOT_APPLICABLE`
   states against matched baseline semantics;
3. preregister one minimal common-core comparison across Crystal
   plane-orientation and Panel V event-sequence profiles.

No additional mathematical, physical, universal-format or novelty question is
opened by this sequence.
