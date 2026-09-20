# Glyph Pointer Contract

Status: `STAGE_0_CANDIDATE_CONTRACT_NOT_ADOPTED`

## Purpose

The contract prevents a sign from being mistaken for the thing it denotes. A glyph may function as a pointer, operator token, value mark, state marker or authored annotation. Its meaning is local to a declared field and decoder and may change across region and time.

## Minimal record

```text
GlyphOccurrence = (
  glyph_id,
  mark,
  role,
  carrier_id,
  field_id,
  region,
  time,
  position,
  frame_id,
  decoder_id,
  provenance_id,
  status
)
```

Compact functional form:

```text
meaning = Decode(mark | field, region, time, position, frame, decoder)
```

The visual mark alone is not a stable meaning.

## Required role types

| Role | Meaning | Example | Must not be inferred as |
|---|---|---|---|
| `VALUE_MARK` | denotes a numeric or symbolic value under a decoder | `41`, `π`, `√2` | spatial address or causal force |
| `ADDRESS_POINTER` | points to a cell, node, layer, record or source | prime index, grid coordinate, connector label | equality with the target object |
| `OPERATOR_TOKEN` | requests a declared operation | rotate, reflect, cut, return | action unless implementation and inputs exist |
| `STATE_MARKER` | labels a state or transition stage | `S(t)`, `S'`, sheet 3 | universal system state |
| `RELATION_MARK` | denotes a relation already constructed from records | `Δ(A,B)`, seam, adjacency edge | independent object without its inputs |
| `ANNOTATION` | adds human-authored interpretation or memory aid | CIKADA, crown, Titan, music label | tested mechanism or mathematical result |
| `MEASUREMENT_MARK` | records a measured quantity with units and method | angle, pixel residual, frequency | symbolic resemblance |

## Time and region rule

Two identical marks may decode differently if `field_id`, `region`, `time`, `position`, `frame_id` or `decoder_id` differs. Conversely, two different marks may point to the same source record. Equivalence therefore requires an explicit comparison:

```text
Equivalent(g1, g2 | comparator, tolerance, scope)
```

No equivalence follows from appearance alone.

## Transformation receipt

Every glyph transformation should record:

```text
input occurrence
-> declared operator and parameters
-> output occurrence
-> address map
-> retained / lost / added / unresolved fields
-> return comparator
```

If the transformation changes only display, the underlying value or address may be retained while position, scale or visibility changes. If crop removes a mark, that is `L` in the view record, not destruction of the underlying carrier.

## Number occurrence extension

For numbers, keep at least these fields distinct:

```text
numeric_value
digit_string
base
factorization
index
residue_tuple
grid_address
visual_position
authorial_association
```

Examples: `1032` is a value and a composite integer; `TITAN` is an authored annotation. `11357` is a composite value with factorization `41 * 277`; its historical graph role and a CRT fingerprint are different records.

## Admission rule

A glyph system becomes testable only when:

1. the corpus and decoder predate the held-out target;
2. role, frame, region, time and position are declared;
3. the same rule is applied without post-result switching;
4. a comparator or null and a stop rule are fixed;
5. failures and unresolved mappings remain visible.

Until then, the item remains a valid authored expression or candidate notation, not a predictive encoding.
