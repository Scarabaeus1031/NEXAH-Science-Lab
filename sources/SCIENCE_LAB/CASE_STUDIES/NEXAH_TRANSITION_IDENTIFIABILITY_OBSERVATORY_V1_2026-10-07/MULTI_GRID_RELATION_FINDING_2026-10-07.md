# NEXAH Multi-Grid Relation Finding

Date: `2026-10-07`

Status: `STRONG_ARCHITECTURAL_FINDING / OPERATOR RECOVERY OPEN`

## Finding

The reviewed NEXAH visuals do not describe one universal grid. They describe a
typed family of carriers, views and resolution layers, together with relations
between them.

The clearest source statement is the sequence:

```text
FIELD -> GRID -> NUMBER -> PROJECTION -> TRANSITIONS -> PASCAL
      -> AXES -> COLOR -> OPERATORS -> APPLICATIONS
```

`GRID` is therefore one layer of the architecture, not the whole architecture.
Numbers address or encode grids; projections produce views; transitions and
operators relate states or carriers; Pascal structures multiplicity and layer
growth; axes orient the resulting record.

## Recurrent grid family

| Grid or view | Exact size | Source-local role | Current status |
|---|---:|---|---|
| small square family | `2x2`, `3x3`, `5x5` | local packages / encodings | documented recurrence |
| Rath payload | `7x7 = 49` | bridge / payload / center field | cardinality exact; operator identity open |
| Rosetta frame | `8x8 = 64` | `7x7` payload plus frame and corner | bounded documented representation |
| Prime index | `9x9 = 81` | indexed state view | cardinality exact; semantics bounded |
| relation / observer grid | `11x11 = 121` | cross, diagonals, observer lattice | exact finite fixtures exist |
| macro / elevator grid | `111x111 = 12321` | macro carrier / coupling-key view | cardinality exact; lift operator open |
| Pascal family | variable | multiplicity, fibers and layer growth | exact recurrence, typed projection required |
| polar / compass family | variable | orientation and coordinate view | bounded projection |

## New exact bridge record

For the inclusive carrier

```text
X_100 = {0,...,100},  J(k) = 100-k
```

the quotient has exactly 51 classes:

```text
49 interior mirror pairs + {0,100} boundary pair + {50} fixed hinge.
```

Therefore:

```text
51 = 49 + 1 + 1 = 7x7 + boundary + hinge.
```

The reviewed `7x7 RATH MATRIX` visual independently distinguishes `Zentrum 49`
and `Resonanz 51`. This is strong architectural concordance. It does not yet
identify the two additional quotient classes with the source-local meaning of
the Rath resonance channels.

## Consequence

The correct object of study is a typed directed graph:

```text
G_i --T_ij--> G_j
```

Every edge must record domain, codomain, operator, invariant, fiber,
return key, residual and evidence. Equal cardinalities, nested pictures or
recurring numbers create candidate edges only; they do not establish identity.

## V1.2 model-lineage addendum

The Geometria Nova archaeology adds retained `6x6`, `7x7` and `10x10` GLB
platforms plus distinct Cathedral, Prime Web and Quaternion model carriers.
The strongest measured edge is:

```text
Cathedral 0.8 --named-node inheritance--> Cathedral 8.8 fusion
494 source names                              492 retained
                                              2 absent
```

The absent names are `CameraProxy` and `LightBurst`; the target adds 17,588
named nodes. This is exact identifier-level inheritance, not a claim that all
target geometry was generated from the earlier binary.

The supplied May 2, 2026 visuals connect compass, window grids, Alpha–Omega
folds and 3D previews as a documented owner work session. Their co-occurrence
does not recover the plotting operator or the GLB-to-USDZ export chain.

## V1.3 recovery and operator addendum

An exact-name home-folder search found no retained USDZ binaries. Matching GLB
source-format counterparts were recovered and hash-bound for all five visible
USDZ basenames. This resolves the uncertain `ullinirium ... rosette_sky`
transcription but not the conversion chain.

Binary inspection of `grid_6x6.glb`, `grid_7x7.glb` and `grid_10x10.glb`
establishes a common parameterized mesh contract. A declared normalized
nearest-lattice resampling operator passes six injectivity and source-address
roundtrip tests. Coordinate residual remains non-zero, so the result is a
bounded cross-resolution map rather than cell identity.

The Rath `49/51` result remains split correctly: quotient arithmetic is exact,
the source visual supplies concordant labels, and historical semantic identity
is still open.

## Claim boundary

Established:

- the listed square cardinalities;
- the `0..100` involution and its 51 quotient classes;
- the existence of multiple grid and projection roles in the reviewed corpus;
- the need to type relations between grids.

Not established:

- one universal grid;
- one universal operator connecting all grid sizes;
- a recovered historical Rath operator;
- identity of Life, E8, CRT, QRT, Pascal, Prime and compass carriers;
- physical or causal meaning from visual recurrence alone;
- a direct GLB-to-USDZ derivation or complete mesh genealogy.

## Next bounded action

Maintain a machine-readable grid-relation ledger and test composed paths. A
path is promoted only when its operator is declared and its return behavior is
reproducible against alternative mappings and holdouts.
