# Candle Direct-Imaging Control

## Typed object split

```text
candle/fuel system ≠ combustion process ≠ flame state ≠ flame geometry
flame state ≠ emitted light ≠ observed light ≠ sensor response ≠ image
flame geometry ≠ surrounding flow field ≠ Schlieren trace ≠ direct image
```

Direct imaging primarily records radiance admitted and transformed by the optical
channel. It does not by itself recover fuel chemistry, complete flame state or
the surrounding three-dimensional flow field.

## Independent settings

| Variation | Source/state | Frame/view/channel effect | Readout effect |
|---|---|---|---|
| Camera position | Unchanged in passive bounded case | Changes path, perspective and view; may change frame | Yes |
| Focal length | Unchanged | Changes field of view, magnification and transfer | Yes |
| Focus distance | Unchanged | Changes point-spread/transfer and resolved depth | Yes |
| Aperture | Unchanged | Changes opening, throughput, diffraction and depth response | Yes |
| Exposure time | Unchanged | Changes temporal integration window | Yes |
| Sensor gain/ISO | Unchanged | Changes sensor/readout response and noise/clipping behavior | Yes |
| Spatial resolution | Unchanged | Changes sampling/aggregation | Yes |
| Dynamic range | Unchanged | Changes distinguishable response interval | Yes |

These are not one operator. A real intervention that heats, shades or disturbs
the flame would require a separate source-state record; that is outside this
passive control.
