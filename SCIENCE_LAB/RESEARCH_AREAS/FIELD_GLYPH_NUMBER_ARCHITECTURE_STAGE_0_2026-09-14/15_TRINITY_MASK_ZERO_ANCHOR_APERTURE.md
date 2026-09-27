# Trinity Mask, Zero Anchor and Aperture

Date: `2026-09-14`

Status: `OWNER_SYNTHESIS_WITH_EXACT_LINEAR_ALGEBRA_AND_OPEN_DECODER_FIELDS`

## Result in one line

The current plates support one coherent representational contract:

```text
carrier -> cut -> three declared view operators A/B/C
        -> emergent XYZ record -> top/bottom handles
        -> aperture test -> retained relation / return
```

Here `XYZ` names output coordinates. `A/B/C` names the three masks, views or
operators that produce them. The common zero is a valid anchor only for an
origin-preserving transformation.

## The Trinity Mask: `ABC -> XYZ`

Let `v` be a state on a carrier `V`. A minimal three-view decoder is

```text
M = (A,B,C)
F_M(v) = (A(v), B(v), C(v)) = (X,Y,Z).
```

For scalar linear views this becomes

```text
A,B,C in V*
Pi(v) = [A(v), B(v), C(v)]^T
Pi: V -> R^3.
```

This is the precise form of the owner phrase “ABC is the answer”: the three
operators are the decoder; `XYZ` is the resulting coordinate record. The
colors may label the three channels, but color is representation metadata
unless a numeric color map is explicitly declared.

The supplied `XYZ/FOLD` plate already uses this architecture visually: three
colored face operators meet at one centre and re-express the same vectors as
oriented areas. It does not yet specify numeric matrices for `A`, `B` and `C`.

## Five dimensions projected to three

For the `P1,...,P10` projection plates, a reproducible linear projection needs
an explicit matrix

```text
Pi in R^(3 x 5)
y = Pi x,       x in R^5, y=(X,Y,Z) in R^3.
```

If `rank(Pi)=3`, then the rank-nullity theorem gives

```text
dim ker(Pi) = 5-3 = 2.
```

So at least two independent input directions are invisible in the 3D record.
The drawing can display the projection, but it cannot by itself reconstruct
the lost coordinates. Recovery requires side information, a restricted input
class or another view.

## Hanging from zero

For every linear operator `Pi`,

```text
Pi(0) = 0.
```

This gives the common zero anchor visible in the vector and fold plates. An
affine transformation has the form

```text
F(x) = Pi x + b,
F(0) = b.
```

It therefore hangs from the same zero only when `b=0`. “We hang at zero” is
an exact invariant for the linear case, not for every transformation.

## `P9` and `P19`: bottom and top handles

There are two parsers that must remain distinct.

### Point-label parser

```text
H_bottom = point P9
H_top    = point P19
```

Under this parser the labels are identifiers only. Their coordinates must be
supplied before a distance, angle or connection can be computed.

### Prime-index parser

With standard one-based prime indexing:

```text
P9  = 23
P19 = 67
P9 + P19 = 90
P19 - P9 = 44.
```

Thus the prime-valued top/bottom pair has an exact right-angle sum. This is a
strong candidate for the `90 degrees` orientation shown in the neighbouring
base/axis plate, but it becomes part of the mechanism only when the model
declares the prime-index parser. The picture alone does not decide between
the two parsers.

The phrase `19-root17` is also ambiguous:

```text
19 - sqrt(17)       = 14.876894374382339...
sqrt(19)-sqrt(17)   =  0.235793317923013...
```

Neither expression is automatically the `P19/P9` handle relation.

## From crack to aperture

A crack is only a geometric discontinuity or candidate opening `K`. An
aperture needs two additional fields:

```text
Q = (K, chi, n)

K    opening geometry
chi  pass/reject mask or transmission rule
n    orientation / chosen side
```

For a field `f`, a simple masked aperture operator is

```text
A_Q[f](x) = chi_K(x) f(x),
```

with `n` retained as orientation metadata. This formalizes

```text
CLOSE -> CUT -> APERTURE -> RETURN.
```

The “crack becomes an aperture” exactly when the cut is promoted from a shape
to an oriented, rule-bearing interface. A return additionally needs either an
inverse on the retained subspace or sufficient side information.

## Chalk, perforation, fabric and algae

The current plates use solid, dashed and perforated lines in different roles.
A safe drawing grammar is:

```text
solid line       retained boundary or observed relation
dashed line      construction, hidden continuation or candidate path
perforated line  sampled seam / incomplete support
filled region    selected face or visible slice
```

The chalk/helper lines record how a construction was made. They should not be
counted as additional state variables unless promoted by an explicit rule.
“Fabric divides” and “algae” are useful material metaphors for branching,
porosity or flow, but no material or biological law follows from the images.

## The open `11` claim

Read literally,

```text
1/2 + 3 + 3 = 6.5,
```

not `11`. The oval plate also does not supply a unique sum rule: internal
labels, outer braces, mirrored regions and multiplicities can be counted in
several ways. Therefore the claimed `11` needs a declared weighted decoder,
for example

```text
D_11(labels, regions, multiplicities) = 11,
```

with every term and weight listed. Until then, `11` is an owner-recognized
target, not a verified arithmetic result.

## Base-7 and base-17 correction

The displayed finite base strings are close truncations of decimal `0.17`,
not exact equalities:

```text
0.11221_7  = 2857/16807
           = 0.169988695186529...
error      = 0.0000113048134706...

0.2F239_17 = 241375/1419857
           = 0.169999514035568...
error      = 0.000000485964431629...
```

Here `F=15`. Since `0.17=17/100` and the reduced denominator contains factors
`2` and `5`, its expansions in bases `7` and `17` are non-terminating. A finite
string can only be an approximation unless an interval/rounding contract is
declared.

## Status ledger

| Claim | Status |
|---|---|
| `ABC` as three declared view operators and `XYZ` as output | `PROPOSED_TYPED_DECODER` |
| linear zero anchor `Pi(0)=0` | `EXACT_LINEAR_ALGEBRA` |
| generic affine zero anchor | `FALSE_UNLESS_B_EQUALS_ZERO` |
| 5D-to-3D kernel dimension at least two at rank three | `EXACT_LINEAR_ALGEBRA` |
| `P9=23`, `P19=67`, sum `90`, difference `44` | `EXACT_PRIME_INDEX_LEDGER` |
| P9/P19 labels necessarily mean prime indices | `NOT_ESTABLISHED` |
| crack plus pass rule and orientation is an aperture | `PROPOSED_INTERFACE_CONTRACT` |
| dashed/perforated lines as provenance grammar | `REPRESENTATION_CONVENTION` |
| `1/2+3+3=11` | `FALSE_LITERAL_READING_DECODER_OPEN` |
| finite base-7/base-17 strings equal decimal `0.17` | `FALSE_EXACTLY_CLOSE_TRUNCATIONS` |
| material or biological mechanism from fabric/algae analogy | `NOT_ESTABLISHED` |

## Source locators

- current owner-supplied pentagon, oval, `P1...P10`, `P9/P19`, base-split,
  splinter-mirror and aperture plates
- `SCIENCE_LAB/CASE_STUDIES/NEXAH_OPEN_SHELL_DOCUMENT_FAMILY_2026-09-14/SOURCE_SNAPSHOT/blatt-vektoren-master.svg`
- `SCIENCE_LAB/CASE_STUDIES/NEXAH_OPEN_SHELL_DOCUMENT_FAMILY_2026-09-14/SOURCE_SNAPSHOT/02-xyz-fold.png`
- `SCIENCE_LAB/CASE_STUDIES/NEXAH_OPEN_SHELL_DOCUMENT_FAMILY_2026-09-14/SOURCE_SNAPSHOT/01-polar-cut.png`
- `SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/13_12321_COUPLING_KEY_JANUS_AXIS.md`
- `SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/14_CLOSURE_LIGHT_SHADOW_ARITHMETIC_AUDIT.md`
