# Aperture / Boundary Control

An aperture is a parameterized opening in a declared optical boundary. The
boundary and opening are distinct: the boundary includes the surrounding
non-transmitting/limiting structure; the opening is the admitted region.

```text
opening_size ≠ signal
signal_admitted ≠ signal_generated
aperture ≠ lens
aperture_change ≠ source_change
```

## Machine-readable composition

```text
ApertureRecord {
  boundary_geometry_ref,
  opening_geometry_ref,
  frame_ref,
  size_or_shape_parameters,
  transmission_condition,
  applicable_wavelength_or_mode,
  valid_time,
  provenance_ref
}
```

This is a useful derived record, not a new primitive. In an idealized passive
camera, changing the aperture changes admitted flux and optical transfer. It need
not change the candle or the light already generated upstream. Diffraction,
vignetting and wavelength dependence show why “how much light through the gate”
is explanatory shorthand, not a complete physical definition.
