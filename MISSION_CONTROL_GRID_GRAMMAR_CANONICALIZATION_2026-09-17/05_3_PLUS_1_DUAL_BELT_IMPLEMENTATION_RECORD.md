# 3+1 Dual-Belt HTML5 — Implementation Record

Date: 2026-09-17  
Record ID: `NEXAH-ERITH-SOURCE-SEED-HTML5-02`  
Status: `G2_EXECUTABLE_VISUAL_FIXTURE / NO_RUNTIME_ADOPTION`

## Artifacts

- [`NEXAH_3_PLUS_1_DUAL_BELT.html`](../SCIENCE_LAB/EXPORTS/NEXAH_3_PLUS_1_DUAL_BELT.html)
- [`NEXAH_3_PLUS_1_DUAL_BELT_RECORD.json`](../SCIENCE_LAB/EXPORTS/NEXAH_3_PLUS_1_DUAL_BELT_RECORD.json)

## Bounded representation

```text
one declared SOURCE_0
  -> C_ERITH / 1-to-3 unfolding
  -> three ERITH elevators with four stations each
  -> typed seam C_ERITH <-> C_NEXAH
  -> three NEXAH elevators with four stations each
  -> C_NEXAH / 3-to-1 binding
  -> outward belt B+
  -> return belt B-
  -> observer-relative mask
  -> exportable state record
```

The Inside view moves the observer inside the active wireframe Seed. The
resulting "sky" is therefore a view of that Seed raster from an internal
camera frame, not an additional physical dome.

The two belts are distinct curves with separate identifiers and styles. Mask
states select front, back, full or split visibility relative to the observer.

The directional grammar is:

```text
source:  SOURCE_0 -> C_ERITH and C_NEXAH
ERITH:   C_ERITH -> 3_ERITH
seam:    C_ERITH <-> C_NEXAH
NEXAH:   3_NEXAH -> C_NEXAH
breath:  SOURCE_0 -> 1+3 -> seam -> 3+1 -> return
```

`3 -> C` is convergence and return notation. It is not the arithmetic claim
`3 - 1 = 1`.

## Controls

- orbit, pan and zoom;
- explicit `OUTSIDE` and `INSIDE` camera frames;
- focus on Seed, each elevator or both belts;
- front/back mask modes;
- pulse rate, pause, grid and address-label controls;
- `BREATH`, `OUTWARD` and `RETURN` flow selection;
- `WHOLE`, `ERITH`, `SEAM` and `NEXAH` observer views;
- JSON export of the current observer record.

## Claim boundary

- `3+1` means three directed channels plus one shared carrier.
- The artifact does not solve the physical three-body problem.
- `SOURCE_0` is a declared source address in this model, not a cosmological or
  physical origin claim.
- View-dependent shear is not automatically intrinsic shear.
- Animated frame rotation is not automatically geometric torsion.
- Rendered pulses are not empirical pulse measurements.
- A `1 x 1 x 1` cell is a cube or voxel unless a fourth coordinate is
  declared.

The fixture demonstrates the documentary Grid Grammar at G2. It does not
activate a common runtime profile or raise any empirical claim.
