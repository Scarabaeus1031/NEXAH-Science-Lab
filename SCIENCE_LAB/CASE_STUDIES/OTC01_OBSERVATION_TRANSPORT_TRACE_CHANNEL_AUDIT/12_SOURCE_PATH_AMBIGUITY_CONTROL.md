# Source / Path Ambiguity Control

## Direct-imaging ambiguity

Within a bounded linear, unsaturated approximation, a pixel response can depend
on a product of source radiance, path transmission, aperture/exposure and sensor
response. Therefore a dimmer source with higher transmission can match a brighter
source with lower transmission. Likewise, changed exposure or gain can reproduce
a similar readout. This illustrative dependency is not asserted as universal.

## Schlieren ambiguity

Similar intensity can result from different refractive-index fields, path depths,
cutoff positions/orientations or sensor mappings. A single directional projection
does not uniquely locate a three-dimensional gradient field.

## Explicit counterexample

Configuration A: unchanged candle, neutral path, exposure `t`.

Configuration B: brighter candle, attenuating filter/path, adjusted exposure so
the recorded pixel values match A within readout resolution.

The causes differ while the readout is identical under the declared comparison.
Provenance distinguishes the events; pixels alone do not.

```text
DIFFERENT_CAUSES -> SIMILAR_OR_IDENTICAL_READOUT
READOUT_UNIQUELY_IDENTIFIES_SOURCE_STATE=NO
PATH_EFFECTS_CAN_CHANGE_READOUT=YES
```
