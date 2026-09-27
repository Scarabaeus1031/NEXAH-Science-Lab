# Catalan Exit and Open-Return Navigation

Date: `2026-09-15`

Status: `OWNER_SYNTHESIS_WITH_EXACT_COMBINATORIAL_CORE_AND_OPEN_DECODER`

## Result in one line

The Kepler double pass is the smallest local return pattern, not the whole
navigation architecture. Repeated, properly nested openings and returns form a
Catalan path family; an explicit `EXIT` turns that closed family into an open
path system with an absorbing outside state.

```text
PAIR -> CUT -> RETURN
            -> HINGE / CONTINUE
            -> EXIT
```

This is a NEXAH path grammar. It is not a new mechanics law and it does not
promote `Q°`, the supplied glyph equation or the astronomical analogies to
canonical operators.

## Double pass as the local cell

The existing shell-crossing model distinguishes the two oriented states

```text
(r,+1) = outward crossing
(r,-1) = return crossing.
```

One outward/return pair is a **double pass**. It establishes the local rule

```text
return of position != return of state.
```

Longer histories can contain several openings before earlier openings close.
The double pass is therefore the depth-one cell of a nested path, not a claim
that the complete system contains only two passages.

## Exact Catalan core

Let `h` be the number of currently open relations. Encode

```text
OPEN / PAIR     h -> h+1
RETURN          h -> h-1, permitted only when h>0.
```

A closed history starts at `h=0`, never visits `h<0`, and ends at `h=0`. The
number of histories with `n` openings and `n` returns is the Catalan number

```text
C_n = (1/(n+1)) * binomial(2n,n).
```

Thus the Catalan structure counts admissible nested histories. It does not by
itself say what a physical opening, relation or return is.

A convenient Catalan-triangle recurrence counts nonnegative path prefixes.
Let `A(t,h)` be the number of length-`t` histories at open depth `h`:

```text
A(0,0) = 1
A(0,h>0) = 0
A(t+1,h) = A(t,h-1) + A(t,h+1)
A(t,-1) = 0.
```

Then `A(2n,0)=C_n`. This gives the proposed triangle an auditable combinatorial
meaning without assigning a mechanism to the drawing.

## The exit changes closure

Introduce an outside state `E_out` and a declared exit predicate
`chi_exit(t,h,state)`. When it is true,

```text
(t,h,state) -> E_out
E_out -> E_out.
```

`E_out` is absorbing for the current run. An exited history is no longer
required to return to `h=0`; the ordinary Catalan count applies only to the
closed subset. Depending on the chosen boundary and endpoint rule, the
remaining prefix counts may be represented by a ballot/Catalan triangle.
The exact triangle must therefore declare:

1. the two counted step types;
2. the nonnegative-boundary rule;
3. the exit predicate;
4. whether `EXIT` is absorbing or permits re-entry;
5. the comparison horizon.

The red exterior witness from the preceding module supplies the visual address
for `E_out`:

```text
p_red in F \ G_N.
```

The crack becomes an aperture when it has a pass/reject rule and orientation;
it becomes an exit when an accepted passage is routed to `E_out` rather than
back into the closed path family.

## Pair, cut and hinge

The three-part owner sequence is retained as a navigation grammar:

```text
PAIR    creates or selects a related two-side configuration
CUT     produces an oriented comparison or passage decision
HINGE   carries the relation into another local configuration
RETURN  closes one declared open relation
EXIT    leaves the current comparison domain
```

`PAIR`, `CUT` and `HINGE` are not automatically the up/down steps counted by
the Catalan recurrence. A decoder must state which event increments `h`, which
event decrements it, and which events preserve depth. This prevents a visual
three-branch motif from being mistaken for a proved Catalan mechanism.

## Owner glyph: `3|E=mcßk“`

The string is preserved verbatim as an owner-supplied mnemonic:

```text
3|E=mcßk“
```

At present it has no unique mathematical parse. `3`, `|`, `E`, `m`, `c`, `ß`,
`k` and the closing mark may be indexed in the glyph ledger, but no Einstein,
Planck, energy, mass, light, charge or beta identity follows from their visual
proximity. A later formalization must provide a token table, types, domains,
operator meanings and an equality rule before the string can be evaluated.

A safe current reading is only:

```text
three-way gate | declared expression | path level k
```

This paraphrase is documentary, not an equation.

## Navigation contract

The proposed open-return navigator records

```text
N_t = (frame, aperture, h_t, direction, branch, exterior_status, trace_id)
```

with

```text
direction       in {OUTWARD, RETURN, TRANSVERSE}
branch          in {PAIR, CUT, HINGE, CONTINUE, EXIT}
exterior_status in {INSIDE_GRID, OUTSIDE_GRID, RETURNED, UNRESOLVED}.
```

Two records at the same displayed point remain different when any of
`direction`, `h_t`, `branch` or `exterior_status` differs. This extends the
double-pass distinction into a traceable navigation state while preserving the
existing NEXAH frame/aperture/return grammar.

## Status ledger

| Claim | Status |
|---|---|
| one outward/return pair is a depth-one double pass | `DECLARED_LOCAL_MODEL` |
| balanced nonnegative open/return histories are counted by `C_n` | `EXACT_COMBINATORICS` |
| the supplied full visual system is necessarily Catalan | `NOT_ESTABLISHED_DECODER_REQUIRED` |
| `EXIT` as an absorbing outside state | `PROPOSED_TYPED_EXTENSION` |
| exited paths remain ordinary closed Catalan paths | `FALSE` |
| ballot/Catalan triangle after a declared endpoint rule | `AVAILABLE_FORMAL_MODEL` |
| `3|E=mcßk“` is a validated physical equation | `NOT_ESTABLISHED` |
| the glyph string as owner mnemonic | `DOCUMENTED_OWNER_EXPRESSION` |
| `Q°` becomes a canonical operator through this extension | `FALSE_NONCANONICAL_OBSERVER_STATE` |

## Source locators

- current owner-supplied Kepler double-pass, Catalan/number-field,
  dual-charge rotor and fundamental-equations plates
- `15_TRINITY_MASK_ZERO_ANCHOR_APERTURE.md`
- `16_EXTERNAL_DOT_ARROKOTH_G_BALL_JOVIAN_SORTER.md`
- `NEXAH_RELATIONAL_DESCRIPTION_LANGUAGE_CANDIDATE_2026-09-04/15_VALID_SENTENCE_FORMS.md`
- `NEXAH_RELATIONAL_DESCRIPTION_LANGUAGE_CANDIDATE_2026-09-04/04_ALPHABET_AND_PRIMITIVES.md`
