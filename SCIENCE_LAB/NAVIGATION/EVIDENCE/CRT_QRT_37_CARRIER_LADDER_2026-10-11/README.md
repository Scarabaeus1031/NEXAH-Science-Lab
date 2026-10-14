# CRT/QRT · 37 Carrier Ladder · NEXAH Science Navigator binding

Status: `INTERNAL_SOURCE_BOUND_EVIDENCE_LENS`

Date: `2026-10-11`

This NEXAH Science Navigator (NN) binding separates three structures that were
visually combined in earlier material:

1. the exact `r = 17` carrier column in the QRT elevator, `n = 20q + r`;
2. the historical graph connector `i -> 37i (mod N)`;
3. the proposed `1461 Core Node / AI-HU Fibonacci Expansion` attachment.

The exact carrier ladder is:

```text
37    = 20*1   + 17
137   = 20*6   + 17
237   = 20*11  + 17
537   = 20*26  + 17
11357 = 20*567 + 17
11537 = 20*576 + 17
```

These are distinct integer carriers sharing one grid column. The common suffix
`37` explains the shared residue modulo `20`; it does not establish common
factorization, generator history or identity.

## Connector classification

The recovered historical plot code created one undirected graph edge per node:

```text
{i, 37i mod N}
```

Those lines are therefore best called **modular multiplier connectors**. The
code did not define a Möbius strip, a twisted boundary identification, a seam
or an orientation-reversing gluing map. “Möbius” was a historical plot label,
not a demonstrated topology.

At `N = 37`, multiplication by `37` maps every node to `0`, producing a
degenerate hub/star picture. For `N = 137, 237, 537, 11357, 11537`,
`gcd(37,N)=1`, so multiplication by `37` is a permutation of the residue
classes. This difference must remain visible in any future comparison.

## 11357 and 11537

Both numbers are retained. They are not spelling variants:

- `11357 = 41*277`, QRT address `(q=567,r=17)`, CRT fingerprint
  `(3,5,8,14)` modulo `(7,11,13,19)`;
- `11537 = 83*139`, QRT address `(q=576,r=17)`, CRT fingerprint
  `(1,9,6,4)` modulo `(7,11,13,19)`.

They occupy the same `r=17` column but differ by `180 = 9*20` and remain
separate carriers.

## 1461 / AI-HU / Fibonacci boundary

The owner-declared decimal cut `14|61` has an exact arithmetic reading:

```text
1461 = 100*14 + 61
14   = 7 + 7 = 2*7
61   = p_18
18   = 2*3^2
1461 = 3*487, with 487 prime
```

Here `p_18` uses one-based prime indexing (`p_1=2`). This gives `1461` a
reproducible seed decomposition with a doubled-seven left field and a
prime-indexed right field. It does not yet specify a transition, recurrence or
return operator.

The historical `1461 Core Node` plot places the marker at the origin, while
the number `1461` does not enter the plotted equations. Its curve labelled
`AI-HU Fibonacci Expansion` uses trigonometric functions with exponential
factors; it is not a Fibonacci recurrence. The current controlled corpus also
states that the Fibonacci-adjacent digit lens is documentary until an explicit
edit-distance or substitution rule is declared.

Consequently the NN retains `1461 + AI-HU Fibonacci` as an
`OPEN_OPERATOR_ATTACHMENT`, not as an exact Core identity. A future executable
test must declare:

- how `1461` enters the state or operator;
- whether the typed seed is the integer `1461`, the decimal pair `(14,61)` or
  the nested record `(2*7, p_18)`;
- a true Fibonacci recurrence or Q-matrix;
- the carrier domain and return map;
- a falsifiable invariant and failure condition;
- whether any Möbius seam/twist is actually present.

## Evidence hierarchy: test first

This binding uses the following order of scientific weight:

1. reproducible tests or exact derivations;
2. executable implementations with declared parameters;
3. historical conceptual text and visuals.

`NEXAH-CODEX` is authoritative only for the provenance of the historical
artifact stored there. It is not scientific evidence authority for the
artifact's mathematical or physical claims. Its ULLINIRIUM prose and visuals
are retained as conceptual and symbolic language: they may suggest hypotheses,
variables and candidate tests, but they may not support a result by themselves.
A test may falsify or support a declared mechanism; a mathematical proof still
requires an explicit derivation or exhaustive verification over a declared
finite domain.

## Historical `0.1461` concept-visual provenance

The older files shown by the owner were located in the tracked
`NEXAH-CODEX` checkout, under the ULLINIRIUM module. Three corresponding
Desktop PNGs are byte-identical to their tracked repository copies. The
Desktop copies therefore remain duplicate discovery surfaces, not sources.

The rendered `Bogenanalyse - Kreis vs. Ellipse + Krümmung` panel contains the
annotation `Ellipse-Krümmung (rechts): k ≈ 0.1461`. This is relevant historical
context, but it currently establishes only a rounded plotted parameter:

- no generator, notebook or equation source for this panel was located;
- the ULLINIRIUM prose describes the Golden Bridge symbolically and does not
  derive `0.1461` from the integer `1461`;
- a four-decimal display match is not a numeric identity or mechanism;
- the image is therefore bound as
  `HISTORICAL_CONCEPT_VISUAL_PROVENANCE_ONLY`.

The primary next evidence path is the formal test
`CURVATURE_1461_ORIGIN_01`, a source-recovery or reconstruction test with
competing hypotheses:

```text
H0: 0.1461 is ordinary four-decimal rounding of an ellipse-curvature value.
H1: the unrounded curvature is generated by an explicit 1461 seed/operator.
```

The test must recover or restate the ellipse parameters, curvature location and
formula; compute the unrounded value; declare the rounding interval and
tolerance; compare a null parameterization and neighboring precisions; and
fail H1 unless `1461` enters the generator before rounding. A numerical replay
can support or reject a mechanism. A mathematical proof would additionally
require an explicit derivation, or an exhaustive proof over a declared finite
domain. The test is designed but remains `FORMAL_DESIGN_ONLY_NOT_ACTIVATED`;
its execution status is `NOT_RUN_STRUCTURE_FREEZE`.

## Identity reuse

The binding reuses:

- `MOD:NUMBER_VIEW_SUITE`;
- `ART:NUMBER:ELEVEN_SPACE`;
- `ART:NUMBER:H_Q_FORMAT`.

It creates one source-bound NN evidence identity,
`NN:CRT_QRT_37_CARRIER_LADDER`, without changing canonical module or Connection
Family counts.

## Claim boundary

Exact modular arithmetic, source lineage and representation typing only. The
binding establishes no Möbius topology, new number-theory result, Fibonacci
mechanism, AI/HU mechanism, physical mechanism, Core promotion or public
admission.

