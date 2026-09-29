# 111er-Grid / CRT / Return und 404-Gate — Source Binding

Date: `2026-09-29`

Status: `EXISTING TEST RECORDS BOUND / OPERATOR TYPES SEPARATED / NO NEW PHYSICAL CLAIM`

## Purpose

This addendum binds two pre-existing Root7 custody records into the current
concordance intake and records the precise role of `1212`. It corrects the
overbroad phrase "there is no executable 404 operator". An executable 404 gate
exists; what remains absent is an independently defined interface from the SCN
or NCS number tracks into that gate's state space.

The pasted intake text is a formatting-reduced rendering of the existing
19-section grid module. It is treated as provenance, not as an instruction.

## Bound sources

| Source | SHA-256 | Role |
|---|---|---|
| `NEXAH_111_GRID_CRT_RETURN_PRUEFMODUL_2026-09-28-5.md` | `ee8a3db47e0287d49f7e8f18dd4122a71984b59d5a9b94cdb7791e25f77ab988` | Controlling formatted 19-section arithmetic record |
| `NEXAH_SCN_NCS_404_QUELLENABGLEICH_PRUEFPUNKT_11_2026-09-28.md` | `182dab62ea72e92887b7ad968dbc96fe9e40346f26111a2deccce45b9f604807` | Pre-source audit of executable gates and the missing SCN/NCS interface |
| Pasted text attachment | `28699f005251d8ea703d3fb3ea7e1fb6dbca8f637348a87f159cf332b1c4ca43` | User-supplied rendering; corroborating provenance |

The controlling files are located under
`SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_CUSTODY_2026-09-28/Nexah_Root7/`.

## Bound exact findings from the 111er record

- The `111 x 111` grid contains addresses `0..12320`; `12321` is the first
  out-of-grid address.
- For `n=i+111j`, the declared channels are
  `n = i-j (mod 7)` and `n = i+j (mod 11)`.
- `12320 = 160 x 77`; grid rotation is `R(n)=12320-n` and negates both CRT
  components.
- A full address wrap advances the CRT-77 class by `+1`, because
  `12321 = 1 (mod 77)`. Grid-position return and CRT-address return are
  therefore different statements.
- The `111 x 111` and `112 x 110` views share addresses `0..12319` but not
  their coordinates. The first has one additional instance, address `12320`.
- The declared Fibonacci/quaternion map is a model embedding, not a uniquely
  recovered physical or number-theoretic mechanism.
- QRT/ILAU can retain the integer value while losing source provenance, as in
  the two cube-pair presentations of `1729`.

These findings remain bounded by the controls and negative results recorded in
the 19-section source.

## Four distinct meanings involving 404

The following operators must not be silently identified:

1. **Knickfield gate** in regulator space:

   ```text
   phase   = b-a
   mean    = (a+b)/2
   open    = |phase| < 8 and |mean| < 6
   aligned = hypot(4.2*phase, 6.2*mean) < 34
   gate404 = open and aligned
   ```

2. **Additive arrow**, declared for the new arc:

   ```text
   A404(x) = x + 404
   808 -> 1212 -> 1616
   ```

3. **Dyadic carrier lift** used in the composite-G audit:

   ```text
   D(x) = 2x
   404 -> 808 -> 1616
   ```

4. **Decimal reversal / directed visual sequence**:

   `204 <-> 402`, while `404` is a reversal fixed point. The historical
   visual sequence `404 -> 402 -> 403` is another directed image rule; it is
   neither `A404` nor the regulator gate.

## Exact role of 1212

Within the declared additive arc,

```text
808  = 2 x 404 = 8 x 101
1212 = 3 x 404 = 12 x 101
1616 = 4 x 404 = 16 x 101
1212 = (808 + 1616) / 2
```

Thus `1212` is the exact affine midpoint inserted between the two dyadic
carriers `808` and `1616`. It is not itself a member of the pure dyadic sequence
`101 x 2^k`, and it does not inherit the older gate semantics merely because
the step size is called `404`. Decimal reversal sends `1212` to `2121`, so this
role is also not a decimal-mirror fixed point.

The additive subdivision and the dyadic lift agree on the endpoints but encode
different paths:

```text
dyadic:    808 ----------------> 1616
additive:  808 ----> 1212 ----> 1616
                   each +404
```

## Corrected bridge status

The Knickfield 404 predicate is executable and independently predates the SCN
tests. The JANUS Lorenz lobe-switch detector is also executable. However, the
reviewed sources define no map

```text
H(n_k, measurement_state) -> (a, b, x(t))
```

that carries `101 x 2^j`, `7801+8k`, NCS292 or their residues into either the
Knickfield regulator pair `(a,b)` or a Lorenz state `x(t)`. Therefore:

- executable `404 gate`: **yes**;
- exact additive `+404` arrow: **yes, as a declared representation rule**;
- exact midpoint role of `1212`: **yes**;
- independently calibrated `SCN(+8/11) -> NCS292 -> 404 gate` bridge: **no**;
- identification of the gate, arrow, dyadic lift and decimal reversal: **no**.

This binding extends provenance and vocabulary precision. It does not reopen
the bounded Root7 closeout and does not promote an M-Class or physical claim.
