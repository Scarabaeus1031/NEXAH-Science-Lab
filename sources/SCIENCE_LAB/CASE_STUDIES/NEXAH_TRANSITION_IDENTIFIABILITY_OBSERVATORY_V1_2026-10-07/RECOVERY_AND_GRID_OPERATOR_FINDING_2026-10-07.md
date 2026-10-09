# Recovery and Multi-Grid Operator Finding

Date: `2026-10-07`  
Status: `PASS — BOUNDED RECONSTRUCTION / HISTORICAL SEMANTICS OPEN`

## 1. USDZ recovery

An exact-name search across `[local path omitted in public preview]` found none of the five
screenshot-visible USDZ binaries. It did recover a matching GLB source-format
counterpart for every visible name:

| Screenshot-visible USDZ | Recovered GLB | SHA-256 status |
|---|---|---|
| `trinity_enhanced_patch.usdz` | `trinity_enhanced_patch.glb` | bound |
| `cathedral_with_trinity_frankfurt.usdz` | `cathedral_with_trinity_frankfurt.glb` | bound |
| `ullinirium_patch_planes_v3_rosette_sky.usdz` | `ullinirium_patch_planes_v3_rosette_sky.glb` | bound |
| `diptych_window_scientific.usdz` | `diptych_window_scientific.glb` | bound |
| `Quaternion_Playground.usdz` | `Quaternion_Playground.glb` | bound |

The uncertain screenshot transcription is resolved by the retained filename:
`ullinirium`, `rosette`, not `ulinirium`, `rosetta`. Matching basenames and
session context recover source-format lineage; they do not prove the exact
GLB-to-USDZ conversion or byte identity.

## 2. Generator reconstruction

No historical authoring script was recovered. The retained `6x6`, `7x7` and
`10x10` GLBs nevertheless determine one reproducible square line-mesh family:

```text
G(n):
  n+1 equidistant line centres on x
  n+1 equidistant line centres on y
  16(n+1) vertices
  72(n+1) triangle indices
  two z levels
  two named nodes
  one triangle mesh
```

All binary template checks pass for all three retained GLBs. Sizes `8` and `9`
are generated only as declared synthetic controls; no missing historical GLB
is implied.

## 3. Operator tests

The declared comparison operator is normalized nearest-lattice resampling:

```text
R(n -> m): (i,j) -> (round(i*m/n), round(j*m/n))
```

Six tests cover `6→7`, `7→8`, `8→9`, `9→10`, `7→10` and `6→10`.
Every forward map is injective and every source-address roundtrip is exact.
Coordinate residual is non-zero unless an address is shared exactly. This
supports a bounded resampling operator, not cell identity across resolutions.

Examples:

| Path | Exact shared vertices | Max 2D coordinate residual |
|---|---:|---:|
| `6x6 -> 7x7` | 4 | 0.101015254455 |
| `7x7 -> 10x10` | 4 | 0.060609152673 |
| `6x6 -> 10x10` | 9 | 0.047140452079 |

## 4. Rath 49 / 51 disposition

Exact under the declared involution:

```text
{0,...,100} / J(k)=100-k
= 49 interior pairs + one boundary pair + one fixed hinge
= 51 quotient classes.
```

The sealed owner visual independently labels a Rath centre `49` and resonance
`51`. The numerical concordance is strong, but no source-local semantic
operator equating those labels with boundary and hinge was recovered.

Disposition: `CARDINALITY CONCORDANCE / SEMANTIC IDENTITY OPEN`.

## 5. Mission Control binding

The actual Mission Control Navigator now contains a reciprocal Observatory
return section with direct links to the Observatory, this finding and the
Mission-Control return record.

## Claim ceiling

Established: hashed GLB counterparts, a common retained mesh template, a
declared reproducible resampling operator and exact source-address roundtrip.

Not established: the missing USDZ bytes, conversion receipts, the historical
generator source, historical Rath semantics, one universal grid or physical
meaning.

Machine record:
`RECOVERY_AND_GRID_OPERATOR_RESULTS_2026-10-07.json`.
