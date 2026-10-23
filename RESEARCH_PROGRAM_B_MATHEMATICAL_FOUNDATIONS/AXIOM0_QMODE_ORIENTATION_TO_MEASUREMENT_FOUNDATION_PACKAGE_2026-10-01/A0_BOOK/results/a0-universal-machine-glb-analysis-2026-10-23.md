# Universal Machine · GLB collection analysis

Date: `2026-10-23`

Scope: read-only structural census of the current local `⚙️ URQUEST · Universal Machine Build Briefing` folder

Identity: reuses historical family `FAM-009` (`HISTORICAL_STAGING`)

Authority: engineering/source analysis only; no canonical promotion, scientific run, identity merge or deletion decision

## Main finding

This is not one Universal Machine with a linear version history. It is a source family containing assemblies, components, display variants, grids, posters and viewer surfaces. The meaningful unit is therefore a **series plus role**, not merely the newest or largest filename.

The historical register contains `75` FAM-009 rows: `51` GLB paths and `24` STL paths. The current working folder contains `224` files recursively. Its additional `149` files are predominantly PNG/PDF/GIF/PLY/SVG/viewer material; the GLB set itself has not gained a new basename since that census.

## GLB census

- `51` GLB paths are present recursively.
- `50` are valid GLB 2.0 payloads; one nested file is a 28-byte placeholder.
- The 50 valid top-level GLBs occupy `42,361,700` bytes.
- Exact hashing reduces them to `45` unique valid payloads.
- Together the valid top-level files contain `14,152` nodes, `14,102` meshes and `14,102` primitives.
- All were exported by `trimesh`.
- None contains native GLTF animation, cameras, skins or compression extensions.
- `37/50` use vertex colours; `8/50` declare materials; only `1/50` embeds textures.
- None declares normal attributes. Lighting and surface interpretation therefore belong to the viewer/material treatment rather than to a fully authored shaded asset.

## Functional series

| Series | GLBs | Reading role |
| --- | ---: | --- |
| Clockwork / orbit | 12 | Large assembly, dual-observer, volume and orbit variants |
| Wheels / nested / Matroschka | 9 | Separate wheel components, labelled assemblies and delta views |
| Flip / breath / wobble | 7 | Static geometry variants intended for view-side movement |
| Resonance / cross | 5 | Cross, helix and sorting-wheel constructions |
| Spiral | 4 | Dense spiral and hybrid/x-ray constructions |
| Portal / gate | 3 | Arrokoth gate treatments |
| Field / Tessarec | 2 | Field-art and fold assembly |
| Grid / panel | 2 | Numbermagic panels and component packs |
| Other / museum | 6 | Gallery, crystal, lock, colour and DNA studies |

These counts are filename-based working groups, not new Navigator families.

## Structural anchors

| File | Nodes | Meshes | Approx. triangles | Interpretation |
| --- | ---: | ---: | ---: | --- |
| `clockwork_static_monogold.glb` | 4,921 | 4,920 | 297,744 | Largest assembly by node count; many individually addressable pieces |
| `numbermagic_panel_fieldart_pack.glb` | 241 | 240 | 298,812 | Densest sampled panel in triangle count; component/grid pack |
| `universal_spiral_field_art.glb` | 1,402 | 1,401 | 189,600 | Dense ring/spiral component field |
| `universal_spiral_hybrid_xray.glb` | 1,381 | 1,380 | — | Related but distinct spiral payload |
| `atomic_matroschka_triplewheel_helix_words.glb` | 500 | 499 | 110,552 | Named nested-wheel assembly with semantic labels |
| `Universal_FieldArt_TessarecFold_v3.glb` | 708 | 707 | 29,496 | Explicitly named fold/field parts; two materials |
| `universal_clockwork_codex_orbit_dual_codex.glb` | 8 | 7 | 52,224 | Compact assembled orbit with named Q-Space and two planet roles |
| `universal_flip_breath_wobble_static.glb` | 2 | 1 | 87,088 | Baked single-mesh surface; movement must be supplied by the viewer |

## Clockwork Monogold deep structure

`clockwork_static_monogold.glb` is one flat scene graph with a single
non-rendering root named `world` and `4,920` direct mesh-bearing children.
Every child has identity transform; placement is baked into its own vertex
coordinates. The source and Bench presentation copy are byte-identical at
SHA-256 `793ed2c3abfd50df2ca26663b2f734dae932e5c26a1b910025a88a93c83db134`.

All `4,920` primitives are indexed triangles with only `POSITION` and
normalized `COLOR_0` attributes. There are no normals, materials, textures,
cameras, lights, skins, extensions or animations. The visible surface and
motion therefore remain viewer interpretations over static source geometry.

The file has six exact topology/colour groups:

| Mesh interval | Count | Vertices / indices | Embedded colour | Spatial reading |
| --- | ---: | ---: | --- | --- |
| `0–767` | 768 | 34 / 192 | gold `#FFD700` | planar outer ring field, radius about `0.97–2.25` |
| `768–2687` | 1,920 | 34 / 192 | pale blue-white `#F0F0FF` | dense planar inner annulus, radius about `0.34–0.51` |
| `2688–3401` | 714 | 26 / 144 | pale blue-white `#F0F0FF` | compact three-dimensional inner body around the origin |
| interleaved from `3402–4681` | 628 | 34 / 192 | gold `#FFD700` | first outer three-dimensional shell family |
| interleaved from `3405–4677` | 652 | 34 / 192 | gold `#FFD700` | second outer three-dimensional shell family |
| `4682–4919` | 238 | 22 / 120 | pale blue-white `#F0F0FF` | offset lower-side body at positive x and negative z |

The global coordinate envelope is approximately
`[-2.412, 2.412] × [-2.384, 2.384] × [-1.044, 1.079]`. The embedded colour
split is `2,048` gold meshes and `2,872` pale meshes. The recurring index
templates show repeated component topology, while the `4,920` unique position
accessors preserve every piece as separately addressable baked geometry.

This supports a bounded mechanical reading: **ring field → inner annulus →
inner volume → paired outer shells → offset side body**. It does not establish
that the pieces are physical wires, generators or a native mechanism. Orange,
glow, apparent flow and moiré movement belong to the view/operator layer unless
a separate source record demonstrates otherwise.

## Exact duplicate payloads

The following are naming aliases, not geometric revisions:

- `universal_clockwork_codex_orbit_dual.glb` = `universal_clockwork_codex_orbit_dual_Observers.glb`
- `universal_clockwork_codex_orbit_dual_codex.glb` = `universal_clockwork_codex_orbit_dual_codex2.glb`
- `universal_clockwork_codex_orbit_dual_cosmic.glb` = `universal_clockwork_codex_orbit_dual_cosmic_Observers 9X.glb`
- `universal_clockwork_with_volume.glb` = `universal_clockwork_with_volume2.glb`
- `universal_spiral_field_art.glb` = `universal_spiral_field_art copy.glb`

No deletion or merge follows from this observation. Filename intent and historical placement remain provenance.

## Viewer and assembly findings

- `sorting_wheel_animated_viewer.html` supplies animation in JavaScript to a static GLB. This confirms the recurring split: **geometry in the GLB, movement in the view operator**.
- `numbermagic_panel_fieldart.html` and `numbermagic_panel_neutral.html` are procedural Three.js views rather than GLB playback surfaces.
- `view_orbit.html` references `Universal_FieldArt_Orbit.glb`, which is not present in this folder.
- `view_tessarec_fold_v2.html` references `Universal_FieldArt_TessarecFold_v2.glb`, which is not present in this folder.
- The nested `sorting_wheel_fixed_viewer.html` references a local 28-byte placeholder instead of a valid GLB; the valid payload exists one directory above.
- `museum_navigation_manifest.json` already describes an intended component assembly: one of two center Clockwork objects plus north/south/east/west wall slots. Several suggested wall GLBs are not present in this folder and remain unresolved rather than inferred.

## Recommended working model

Use three orthogonal labels for every asset:

1. **Series** — Clockwork, Wheel, Spiral, Flip/Breath, Cross, Portal, Tessarec, Panel or Museum.
2. **Role** — complete assembly, component, grid/panel, label layer, observer layer, view-only colourway or poster/reference.
3. **Payload status** — unique geometry, exact alias, placeholder, unresolved reference or valid viewer entry.

This preserves the collection's variations without pretending that filename suffixes encode a reliable chronological version sequence.

## Next safe build step

Create a read-only **Universal Machine Parts Shelf** in the Bench with one representative per series and optional toggles for exact aliases, components and grids. The shelf should load assets on demand, keep the 45 unique payloads distinct, and expose viewer-owned motion separately from GLB-owned geometry.
