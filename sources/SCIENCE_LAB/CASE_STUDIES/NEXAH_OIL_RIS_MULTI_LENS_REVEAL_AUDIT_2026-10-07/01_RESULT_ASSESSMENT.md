# Result assessment

> **Qualification added 2026-10-07:** the implementation tested here uses
> `Q_C=(b1,b3)`, whereas the frozen preregistration states `Q_C=(b2,b3)`.
> The implemented star-lens fixture passes its executable gates; the original
> preregistration is not fully conformant. The unqualified decision line below
> is retained as execution history, not as the current conformance decision.
> The controlling correction is recorded in
> `../NEXAH_OIL_RIS_VERTICAL_UTILITY_PILOT_2026-10-07/01_CONFORMANCE_AND_REVIEW_CONTRACT.md`.

Date: `2026-10-07`

Decision: `PASS / 12 OF 12 FROZEN GATES / BYTE-IDENTICAL REPLAY`

## Result

The preregistered finite scanner fixture supports a bounded
`MULTI_CHANNEL_REVEAL` claim:

- each of `Q_A`, `Q_B` and `Q_C` is lossy;
- any two-channel subset leaves at least one relation bit ambiguous;
- an aligned three-channel seam reconstructs all sixteen four-bit relation
  states;
- the complete source is still not recovered because both provenance records
  remain in every reconstructed source fiber;
- shifted addresses and contradictory overlap values both return `ABSTAIN`;
- the package-local `ø` cut reconstructs exactly when both complete branches
  are retained; and
- the declared `AE` closure returns the same carrier state while `A'` retains
  the ordered history `R,I,S,AE`.

The unit suite passed `9/9`; the frozen decision gates passed `12/12`. A second
execution produced byte-identical JSON:

```text
sha256 = dbf38889707b7dc6e638be53146ec8ce4755de236bdd36b2748cce849a53c5cb
```

## Interpretation

The scanner is useful as an alignment and information-boundary instrument.
Its strongest supported statement is:

```text
registered multi-view alignment
  -> relation-state visibility recovery
  -> residual source ambiguity retained.
```

In this package, `ø` is a split/cut record and `œ` is a registered seam across
three views. These roles are now operationally tested for the declared finite
fixture. They are not meanings derived from Unicode and are not automatically
transferred to Primegrid Block 02B or another carrier.

The declared `R`, `I`, `S` formulas and composition order are also operationally
valid as a finite candidate. The order-control proves that composition order
matters. Because the repository still lacks a source-defined historical
composition, the test does not recover historical OIL/RIS semantics.

## Claim boundary

The result does not establish:

- full source recovery;
- a bijection between the O-glyph lane and an algebraic O8 carrier;
- intrinsic meanings for `ø`, `œ` or `AE` outside the declared fixture;
- the historical OIL/RIS function or its composition order;
- orbital physics, one physical machine or a cross-domain mechanism.

It authorizes only a bounded Lab/Navigator/Mission-Control reference to this
tested representation contract. It does not authorize public release,
activation or promotion of the historical interpretation.
