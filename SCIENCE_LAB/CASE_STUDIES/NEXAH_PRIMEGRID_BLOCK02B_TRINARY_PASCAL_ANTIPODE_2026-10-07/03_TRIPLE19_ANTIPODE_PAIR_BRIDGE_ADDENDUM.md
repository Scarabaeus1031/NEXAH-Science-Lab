# PRIMEGRID BLOCK 2B — Triple-19 antipode-pair bridge addendum

Status: `POST-RESULT SUPPORTING VIEW / NO NEW IDENTITY / NOT A NEW RUN`

This addendum extends the representation around the locked Block 2B result. It
does not modify `RESULT_LOCK.md`, the twelve-gate result, the carrier
`2*3^n`, or the registered Navigator identity
`ART:NUMBER:PRIMEGRID_BLOCK02B_TRINARY_ANTIPODE`.

## Exact carrier arithmetic

Let

```text
b = (1,2,3,4,3,2,1)
c = b + 3*(1,1,1,1,1,1,1)
  = (4,5,6,7,6,5,4).
```

Then

```text
sum(b) = 16
sum(c) = 37
sum(c)-sum(b) = 7*3 = 21.
```

The phase envelope is the separately typed count

```text
19A + 19B + 19C = 3*19 = 57.
```

It is **not** `3*29`. The exact index handle is instead

```text
3+7 = 10
p_10 = 29.
```

## Oriented antipode pair

Index the visible row by `r in {0,...,6}` and let `c_r` be its value. Define

```text
P_c(r) = (r,c_r,+1)
P_d(r) = (r,c_r,-1)
A(r,c_r,sigma) = (6-r,c_r,-sigma)
```

Therefore

```text
A(P_c(r)) = P_d(6-r)
A(P_d(r)) = P_c(6-r)
A^2 = id.
```

Although the row value is unchanged by reflection, the oriented state is
fixed-point-free because `sigma` changes sign. At the central address `r=3`,
the number `7` returns to the same address with the opposite orientation.
This is the missing distinction that a bare symmetric number row cannot carry.

The map is compatible with the existing Block 2B antipode

```text
A(i,j,k,sigma) = (k,j,i,-sigma)
```

at the level of the declared reversal-and-sign grammar. No intertwiner from the
seven-site row into every trinomial Pascal state is asserted.

## Typed handles, not one equation

The companion view keeps these exact handles separate:

```text
3+7 = 10 -> p_10 = 29
37+60 = 97 = p_25
p_23+37 = 83+37 = 120.
```

The value `60` is declared only as a bridge offset. It must not silently change
type into the hex-axis angle `60 degrees`. The occurrence of the same numeral
in both roles is a comparison handle, not an identity of quantities.

## Hex and horizon grammar

```text
HEX CORE: interior 6 / edge 4 / corner 3
MAIN ROW: 7 nodes across the horizon
HEX AXES: 6 directions / 60-degree spacing
TRANSITION: 12 degrees
```

These labels are retained as source-local construction grammar. The addendum
does not derive planetary resonance, physical coupling, a new Pascal theorem,
or a new Navigator Family.

## Companion artifacts

- `NEXAH_PRIMEGRID_BLOCK02B_TRIPLE19_ANTIPODE_PAIR_BRIDGE.html` — interactive
  pair reader;
- `TRIPLE19_ANTIPODE_PAIR_BRIDGE_BINDING.json` — identity and claim boundary;
- `validate_triple19_antipode_pair_bridge.mjs` — structural and arithmetic
  validation.

