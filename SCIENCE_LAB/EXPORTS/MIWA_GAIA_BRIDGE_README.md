# MIWA Gaia DR3 Bridge

Status: `INTERNAL SOURCE ADAPTER / NOT PUBLIC`

Identity reuse: `MOD:OBSERVATORY_MIWA` · `ART:MIWA:MAIN`
Source Graph delta: `0`
Authority: `false`

## Human Owner editorial priority · 2026-11-13

MIWA is the current **top editorial refinement TODO** for this connected A0
surface. This means reading order, onboarding, microcopy, responsive behavior
and source-bound explanation — not a new scientific priority or Study.

- [x] Three local Gaia DR3 entry presets with preserved provenance.
- [x] First-glance route: `FIELD → APERTURE → RECORD`.
- [x] Preset boundary text at the point of use.
- [x] Harmonize German/English microcopy and empty states throughout.
- [x] Preserve the core preset → node → light-time route on smaller screens.
- [x] Specify a separate bounded gate before larger catalogs, proper motion or
  epoch animation are implemented: [Scale + Epoch Design Gate](MIWA_SCALE_EPOCH_DESIGN_GATE.md).

This dependency-free Python bridge queries the official ESA Gaia TAP service
and writes bounded CSV presets that the existing MIWA star-map importer can
open directly.

## Run

From `SCIENCE_LAB/EXPORTS`:

```bash
python3 miwa_gaia_bridge.py --preset all --limit 240
```

Individual presets:

```bash
python3 miwa_gaia_bridge.py --preset bright-nearby
python3 miwa_gaia_bridge.py --preset sirius-neighborhood
python3 miwa_gaia_bridge.py --preset andromeda-field
```

The bridge uses only the Python standard library. Network access to
`https://gea.esac.esa.int/tap-server/tap/sync` is required while exporting.

## Outputs

- `MIWA_GAIA_BRIGHT_NEARBY.csv`
- `MIWA_GAIA_SIRIUS_NEIGHBORHOOD.csv`
- `MIWA_GAIA_ANDROMEDA_FIELD.csv`
- `MIWA_GAIA_PRESETS.js` — local one-click browser bundle
- `MIWA_GAIA_PRESET_MANIFEST.json`

In `MIWA_PINEAP_AN_DROMEDA.html`, use one of the three **Gaia DR3 Presets**
for direct local loading. Alternatively use **Sternkarte einlesen** to select
one CSV manually. Both routes activate Catalog-backed node mode.

## Preset boundaries

### Bright Nearby

Bright Gaia DR3 sources with positive parallax, declared
`parallax_over_error`, magnitude and RUWE quality cuts. It is a bounded display
selection, not a complete nearby-star census.

### Sirius Neighborhood

A five-degree Gaia cone around the Sirius direction plus one separately marked
Sirius reference anchor. Screen proximity does not imply physical association.
The anchor reuses the rounded 8.6-light-year NASA reference already used by
the A0 Light-Time bridge; it is not represented as a Gaia row.

### Andromeda Field

A two-degree Gaia cone around M31. Gaia rows in this sightline remain labeled
as **Milky Way foreground**. Only the separate NASA M31 core reference uses
the Andromeda carrier. The adapter does not silently turn foreground stars
into Andromeda members.

## Field semantics

- `distance_pc`: `1000 / parallax_mas` for quality-cut Gaia rows.
- `uncertainty`: first-order propagated inverse-parallax uncertainty in pc.
- `epoch`: Gaia `ref_epoch`; reference anchors state `REFERENCE_NO_EPOCH`.
- `spectral_class`: a BP-RP display-color proxy, not spectroscopy.
- `source_catalog`, `source_release`, `source_url`, `query_id`: provenance.
- `distance_method`, `field_role`, `claim_boundary`: transformation boundary.

The generated manifest preserves the exact ADQL, query fingerprint, row counts,
source release and all non-authority boundaries.

## Validation

```bash
python3 -m unittest -v test_miwa_gaia_bridge.py
node --test miwa-pineap-lantern-node-keeper-tests.cjs
```
