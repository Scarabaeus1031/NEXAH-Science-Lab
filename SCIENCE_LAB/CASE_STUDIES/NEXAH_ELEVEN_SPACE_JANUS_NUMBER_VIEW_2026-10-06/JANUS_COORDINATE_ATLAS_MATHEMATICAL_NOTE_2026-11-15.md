# Janus Coordinate Atlas — mathematical note

**Status:** `CURRENT_BOUNDED / EXACT_ARITHMETIC_AND_GEOMETRY / INTERNAL_ONLY`

**Canonical instrument:** `ART:NUMBER:JANUS_LADDER`

This note records the coordinate grammar added to the existing Janus Arithmetic
Ladder. It does not create a new Navigator identity or relation.

## 1. Affine carrier and centered address

For a declared midpoint `m`, define

```text
κ_m(x) = x - m = d
J_m(x) = 2m - x
κ_m(J_m(x)) = -d
J_m(J_m(x)) = x
```

The Janus pairs are therefore exact sign reversals only after the midpoint has
been declared. Different midpoints define different relations.

| relation | midpoint `m` | radius `r` | pair |
|---|---:|---:|---|
| outer | 12555 | 1198 | 11357 ↔ 13753 |
| inner | 11947 | 590 | 11357 ↔ 12537 |
| local ladder | 12555 | 18 | 12537 ↔ 12573 |

The normalized address is

```text
u = d/r ∈ [-1,1],   J: u ↦ -u.
```

## 2. Line, circle and oval are coordinate charts

The same normalized address may be displayed on a circle or ellipse:

```text
C(u,σ)     = (u, σ sqrt(1-u²))
E_a,b(u,σ) = (a u, b σ sqrt(1-u²)),   σ ∈ {-1,+1}.
```

The affine oval changes the chart, not the arithmetic involution. Curvature is
an encoding choice. It is not evidence of a physical orbit or common dynamics.

## 3. Chord, segment height and rotated measurement T

For a normalized half-chord `q ∈ [0,1]`,

```text
β_g = sqrt(1-q²)
c   = 2q
δ   = 1-β_g = q²/(1+β_g)
```

Using the chord midpoint as local origin gives the exact local T-frame

```text
L=(-q,0),  R=(q,0),  A=(0,δ).
```

A pose angle `α` rotates the complete frame. It changes orientation only;
`q`, `c` and `δ` are invariant. The `204°` setting is therefore a declared
pose, not a consequence of the decimal digits of `δ(0.2)`.

At `q=0.2`,

```text
δ = 1-sqrt(1-0.2²)
  = 1-2sqrt(6)/5
  = 0.0202041028867288...
```

## 4. Optional physics adapter — conditional only

Only after an external experiment explicitly declares

```text
q = Δτ/Δt = 1/γ
```

may the same scalar be read as

```text
γ = 1/q
v/c = sqrt(1-q²).
```

This adapter is `HOLD / CONDITIONAL`. No map from the Janus arithmetic radii
`18`, `590` or `1198` to `q` has been established, and no speed-of-light claim
is inferred from the oval, chord or T display.

## 5. `204²` path ledger

The fifth view reuses an already verified exact output:

```text
23³ + 24³ + 25³ = 41,616 = 204² = (12·17)².
```

The displayed radial allocation also closes exactly:

```text
10,350 + 31,250 + 16 = 41,616
31,250 = 15,625 + 15,625
15,625 = 25³ = 5⁶.
```

Its integer factors provide a useful typed register:

```text
TOTAL  = 41,616 = 2⁴·3²·17²
SHELL  = 10,350 = 2·3²·5²·23
RING   = 31,250 = 2·5⁶
ECHO±  = 15,625 = 5⁶
CORE   = 16 = 2⁴.
```

These values may be used as **addresses inside this declared ledger** because
the ledger supplies the typing map `role -> count`. Without that map they are
integers, not universal coordinates. In particular the current exact total is
`41616` (not `41416`), and no digit-substring relation to the numerical value
of the speed of light is asserted.

These equalities validate the integer bookkeeping only. The two generators
`(12·17)²` and `23³+24³+25³` retain distinct provenance. The labels
`Ramanujan shield`, `Ihara ring`, `Riemann wave`, `5er joint` and the proposed
`2501` coupling are typed model addresses; no common operator, trace formula,
zeta-energy law or physical resonator follows from the partition.

The same boundary applies to the visual port language: `Janus` names the
affine involution, `Ihara` the declared ring/return role, and `Riemann` the
declared flow role. A `Rosetta` view may translate these records into adjacent
Mandelbrot, Julia, Hofmann or other displays, but translation is not operator
identity. The translated record must retain its source type and provenance.

## 6. Packaging / nexus return

The seventh view treats `41,616` as an exact payload with two distinct
generator records:

```text
23³ + 24³ + 25³ = 41,616 = 204² = (12·17)²
41,616 = 2⁴·3²·17²
206² - 204² = 820 = 41·20
41,616 + 26³ = 59,192.
```

Equal output values do not identify their histories. The consecutive-cube
record and the product-then-square record therefore keep separate provenance
through packaging and return.

`204` has three exact local roles here: the positive square root of `41,616`,
the declared cut index, and the numerator in the normalized cut `.204` when
the room has size `1000`. It is not the exact residue exit angle:

```text
41,616 mod 360 = 216
59,192 mod 360 = 152
100,808 mod 360 = 8.
```

Thus `204°` remains a selectable pose, while `216°` is the exact mod-360 exit
of the payload. These types must not be collapsed.

The scale lift preserves the normalized cut only when room and cut are scaled
together:

```text
204/1000 = 2040/10000 = .204
204/300 = .68                         (different frame)
```

The local package channel

```text
P_k = 101·2^k,  0 <= k <= 5
101 -> 202 -> 404 -> 808 -> 1616 -> 3232
```

is a declared address rail. `C808` is a channel marker in this view, not a
physical constant or a universal code.

`Ihara nexus` denotes the typed return/packaging port: a place where the
payload is rebound to its retained provenance after a view or scale change.
It does not import an Ihara trace formula, zeta operator or common dynamics.
Likewise `SC` may name a source/carrier port only where that vocabulary is
locally declared. Both remain `TYPED MODEL / HOLD` with respect to operator
identity.

## 6.1 Existing Galileo packing grammar

This is a binding to the existing A0 story **From Landmarks to Packages**, not
a new package theory. A0 remains the source authority; the Experience version
is its published mirror. The exact arithmetic is the power-landmark family

```text
P_k(n) = n^k
Delta_3(n) = n^3 - (n-1)^3 = 3n^2 - 3n + 1
sum_{j=1}^n Delta_3(j) = n^3.
```

The first four cubic shell increments are therefore

```text
Delta_3(1..4) = 1, 7, 19, 37
1 + 7 + 19 + 37 = 64 = 4^3.
```

The overlapping landmark addresses are explicit: `16=2^4=4^2`, `25=5^2`,
`27=3^3`, `36=6^2`, `49=7^2`, and `64=2^6=4^3`. A `7+1` or octave
reading is retained only as a declared view address; no acoustic law is
inferred.

This explains the nested-cube count exactly: each coloured layer is the new
unit-cube shell added when the side length grows by one. The palette
`gold / green / blue / red` is a view code, not a prime-family theorem. The
boundary is visible already at the ends: `1` is not prime and
`Delta_3(6)=91` is composite.

The package view exposes three typed projection ports:

```text
spatial: XY / YZ / ZX
field:   bits / declared 33-degree--45-degree lens / ternary 3+1 view
carrier: T^4 -> T^3(q) projected state
```

They are representations of a retained package record. They do not add a
fourth carrier, turn the overlay angles into operators, or identify the
projection with a physical field. The binding extends the existing Janus view;
it creates no Navigator identity or relation.

## 6.2 Typed connector: cubic shells, octave and fifths

The connector does not introduce another number object. It gives the existing
cubic-shell carrier a declared pitch-frequency view. Its exact arithmetic is

```text
Delta_3(1..4) = 1, 7, 19, 37
1 + 7 + 19 + 37 = 64 = 2^6 = 4^3 = 8^2.
```

In a pitch-frequency chart an octave is the declared map `f -> 2f`. This
explains the role of a `7+1` display only after a tonal convention has been
chosen; it is not an arithmetic consequence of the shell sequence. Likewise,
`2^5` and `2^7` are absent only from the displayed intersection of selected
power landmarks. They are not missing powers.

The prime-index alignment is real but bounded:

```text
7  = p_4
19 = p_8
37 = p_12
61 = p_18       (the step-by-four reading has already broken)
91 = 7 * 13     (the next displayed shell endpoint is composite).
```

Consequently the first three matches are addresses in this view, not a general
prime-to-tone theorem. The exact return seam for twelve pure fifths against
seven octaves is instead

```text
(3/2)^12 / 2^7 = 3^12 / 2^19
                = 531441 / 524288
                != 1
                ~= 23.460010384649 cents.
```

The non-zero Pythagorean comma is the useful finding: the fifths view nearly
returns, but it does not close exactly. Chinese twelve-lü traditions may be
compared as a separately declared twelve-pitch view; ancient Egyptian tonal
orders remain reconstruction-dependent. Solmization such as *do–re–mi* is not
used here as evidence of Egyptian provenance. These contexts are not evidence
for one genealogy, one universal scale or a shared NEXAH operator. Their status
here is `CONTEXT / HOLD`.

This section reuses the existing Janus identity and the existing A0
Octave/Successor/Fifths bridge. Navigator effect: `0` new IDs and `0` new
relations.

## 7. Layer-model gallery

The sixth view keeps the supplied Pancake, Rolled Sheet and tube/membrane
visuals inside the canonical instrument, but below the mathematical claim
ceiling. They support questions about chart, layer, boundary, fold and return.
They are not used as proofs.

In particular:

```text
0.02° != delta(0.2) = 0.0202041028867288...
```

The first quantity is an angle and the second is a dimensionless segment
height. A bridge would require an explicit map and units. The displayed
`51.84°`, horseshoe, expansion and contraction labels remain visual-model
parameters until such a contract is supplied.

## Claim boundary

- exact: affine reflection, centered address, normalization, ellipse chart,
  chord identity, segment height and rigid rotation;
- conditional: the proper-time / Lorentz adapter when its premise is declared;
- not established: a physical Janus mechanism, orbit, clock, carrier speed,
  `204°` derivation, a `2501` coupling, a physical meaning for `C808`, or one
  operator shared by Janus, Ramanujan, Ihara, Riemann, Hofmann, Mandelbrot,
  Julia and physics;
- Navigator effect: `0` new IDs, `0` new relations; existing
  `ART:NUMBER:JANUS_LADDER` is reused.
