# Schlieren Control

## Established physical chain

```text
illumination -> refractive medium -> refractive-index field
             -> path-integrated angular deflection
             -> cutoff/knife-edge transmission
             -> sensor intensity -> Schlieren image
```

Refractive-index gradients deflect rays. In a classical focused system, a
knife edge or other cutoff converts a component of angular deflection into an
intensity change. The cutoff orientation, amount and optical geometry determine
sensitivity. NASA's technical review states that traditional knife-edge
Schlieren records the gradient component perpendicular to the knife edge.

## What the trace does

| Function | Bounded finding |
|---|---|
| Preserves | Projected location/time of contrast and the gradient component to which the configured system is sensitive |
| Transforms | Ray-angle differences into intensity contrast |
| Amplifies | Visibility of small deflections near the cutoff, within its response range |
| Integrates | Refractive effects along the optical path, sensor area and exposure interval |
| Loses | Unmeasured gradient direction, depth localization, absolute phase/density without added constraints, clipped/below-threshold variation |
| Introduces | Optical transfer, cutoff orientation/sign, blur, noise, sampling and display mapping |

Thus:

```text
medium ≠ refractive-index gradient ≠ deflection ≠ sensor intensity
       ≠ Schlieren trace ≠ interpretation
```

A Schlieren image is not a direct density map. Quantitative density recovery
requires a specified model, calibration, geometry and reconstruction assumptions;
none is performed here.
