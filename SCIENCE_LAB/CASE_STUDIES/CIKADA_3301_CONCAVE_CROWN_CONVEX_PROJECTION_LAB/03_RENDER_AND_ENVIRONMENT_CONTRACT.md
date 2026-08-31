# Render and Environment Contract

Frozen before numerical execution on 2026-08-23.

```yaml
runtime: local_python
python_expected: 3.12.x
numeric_library: numpy
raster_library: Pillow
external_downloads: NONE
random_seed_primary: 3301
random_seed_null_sequence: 3301..3556
floating_point: IEEE-754 binary64
continuous_samples_per_closed_boundary: 2048
default_raster: 512x512
raster_world_window: [-1.4, 1.4] x [-1.4, 1.4]
background: white
surface_palette: display_only
anti_aliasing: disabled_for_metric_masks
display_image: 1600x900_RGBA
```

## Camera and rendering

Orthographic camera looks along world `-z`; x/y axes map without rescaling. Arm B rotates source points about x by 30°. The concave and convex arms share the same camera and circular seam; their height-field sign is shown only by display shading. Lens distortion is applied only in arm E. Pixel thresholds are measured only in arm F/N3. All continuous metrics use pre-raster coordinates unless marked `raster`.

The visual image is explanatory. Decisions are taken from recorded numeric metrics and preregistered rules, not by visual preference.

## Deterministic repeat

The complete numeric pipeline and PNG construction are run twice in fresh in-process state with the same frozen config. Canonical JSON serialization is hashed with SHA-256. Equality requires identical hashes before insertion of execution timestamps or file paths. The two PNG byte streams must also hash identically.

## Independence limitation

The repeat is computationally independent but uses the same implementation and environment. It establishes deterministic replay, not independent software replication.
