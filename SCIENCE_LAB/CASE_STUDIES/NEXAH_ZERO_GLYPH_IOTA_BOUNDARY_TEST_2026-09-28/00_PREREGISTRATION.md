# NEXAH Zero/Glyph/Iota Boundary Test — preregistration

Date: `2026-09-28`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Question

Can the proposed `99 -> 100/C`, `o/°`, `6/9`, angle and `IO | Tα`
relationships be separated into reproducible numerical, Unicode, visual and
directed-boundary rules without treating glyph resemblance as mathematical or
physical identity?

## Scope and authority

This is a bounded representation test. It may establish a typed symbolic
grammar or a finite cut-classification rule. It cannot establish a natural
law, physical bubble dynamics, Tesla/vortex physics, privileged numbers,
linguistic ancestry or universal glyph semantics.

Existing bindings retained:

- `0-6-9` was previously `ASSOCIATIVE_OR_DOCUMENTARY_LABEL_ONLY`.
- In the registered Tessarec fixture, `Q°` selects/displaces a layer and Iota
  defines a directed cut with an IN/OUT reading.
- The Relational Description Language requires glyph, carrier, frame,
  aperture, operator, scale and provenance before a visible form is assigned
  an operational meaning.

`IO | Tα` is introduced here only as a test notation for **IN/OUT under a
declared angular transform**. It is not asserted to be the historical or
linguistic derivation of the word Iota.

## Frozen tests

### T1 — positional rollover

For bases `b=2..16` and widths `k=1..4`, verify:

```text
B(b,k) = b^k - 1
digits_b(B) = k
digits_b(B+1) = k+1
B+1 = b^k
```

`99 -> 100` is the decimal `b=10,k=2` instance. Pass requires all 60 cases.

### T2 — decimal/Roman transport

Use one frozen deterministic Roman encoder on integers `1..3999`. Verify
`99 <-> XCIX` and `100 <-> C` by round trip. Pass requires value preservation
and an explicit finding that digit width is not representation invariant.

### T3 — Unicode state separation

Inspect these exact strings:

```text
0 o ° º ◦ ˚ ö ô ò ó õ ō ø œ
```

Record code points, Unicode names, categories and NFC/NFD/NFKC/NFKD forms.
Pass requires:

1. `0`, `o` and `°` remain distinct under all four normalizations;
2. `ö ô ò ó õ ō` decompose under NFD to base `o` plus at least one combining
   mark;
3. no non-equivalent code point is silently classified as numerical zero;
4. `ø` and `œ` are reported from observed normalization, not assumed to be
   ordinary diacritics.

### T4 — `6/9` half-turn morphology

Render `6` and `9` at fixed size using these installed fonts:

- Menlo
- Helvetica
- Avenir
- Times New Roman
- Courier New

Crop to foreground, fit without distortion to a `192×192` canvas, rotate the
`6` image by `180°`, then compare it with `9` using foreground intersection
over union (IoU). Classify each font:

- `STRONG`: IoU `>= 0.90`
- `PARTIAL`: `0.75 <= IoU < 0.90`
- `WEAK`: IoU `< 0.75`

This test is descriptive. The preregistered generality requirement is that
`6↔9` may be called a font-independent orientation rule only if all five fonts
are `STRONG`. Otherwise it is font-dependent morphology.

### T5 — angular information of an unmarked ring

Apply the finite rotation group `C4={0°,90°,180°,270°}` to:

1. an ideal unmarked circle;
2. the same circle with one radial marker.

Pass requires confirmation that the unmarked circle has one rotational orbit
state while the marked carrier has four distinguishable orientation states.
Thus `°` alone cannot encode an angle without a marker, cut, frame or external
reference.

### T6 — directed Iota boundary / `IO | Tα`

For angles `α={0°,45°,90°,135°}` define the directed normal
`nα=(cos α,sin α)` and classify the 16 unit-circle sample points:

```text
I  when nα·x >  ε
O  when nα·x < -ε
M  when |nα·x| <= ε
ε = 10^-12
```

Verify:

1. joint rotation equivariance: `c_(α+β)(Rβ x)=c_α(x)`;
2. direction reversal: `c_(α+180°)` swaps `I/O` and retains `M`;
3. the boundary class belongs to neither exclusive interior but to the
   closures of both sides;
4. counts are reported, not forced to 50/50 when boundary samples occur.

Pass requires all finite checks.

## Decision rule

`SUPPORTED_AS_TYPED_REPRESENTATION_GRAMMAR` only if T1, T2, T3, T5 and T6
pass, no Unicode identity is fabricated, and T4 is reported at its observed
font-dependence level.

`PARTIAL` if exact positional and Iota rules pass but Unicode or angular state
typing fails. `FAILED` if positional rollover or directed-cut equivariance
fails. No result may be promoted to a physical mechanism.

## Reproducibility

Primary and clean replay run in separate directories from the locked protocol
and implementation. Scientific JSON is serialized with sorted keys and compact
separators. The two SHA-256 result hashes must match.
