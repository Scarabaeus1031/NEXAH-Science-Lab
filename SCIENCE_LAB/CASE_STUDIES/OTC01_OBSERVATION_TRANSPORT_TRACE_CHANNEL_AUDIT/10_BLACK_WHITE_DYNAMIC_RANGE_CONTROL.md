# Black / White / Dynamic-Range Control

## Black is non-unique

A black pixel can arise from no incident signal, low source radiance, absorption,
occlusion, cutoff, destructive/subtractive channel effects, underexposure, sensor
floor, processing threshold or display mapping. It can therefore mark a real
boundary/occlusion event while still being non-unique.

## White is non-unique

A white pixel can arise from large admitted signal, gain, saturation, clipping,
tone mapping or display convention. At saturation, a range of larger inputs maps
to the same maximum value; information above the clipping point is lost.

## Findings

```text
BLACK_EQUALS_ABSENCE=NO
WHITE_EQUALS_MAX_INFORMATION=NO
SATURATION_CAN_DESTROY_INFORMATION=YES
UNDEREXPOSURE_CAN_DESTROY_INFORMATION=YES
```

Dynamic range is the bounded distinguishable response interval for a specified
configuration and criterion. It is not the full physical range of the source.
Contrast is a readout relation and can be increased while provenance or quantitative
information decreases.
