# Unit and Reference-Time Audit

## Type register

| Quantity | Type | Definition used |
|---|---|---|
| YEAR | TIME | Julian year only: 365.25 d |
| DAY | TIME | 86,400 SI s |
| AU | LENGTH | exactly 149,597,870,700 m |
| LIGHT_YEAR | LENGTH | c × Julian year |
| c | SPEED | exactly 299,792,458 m/s in SI |
| P | TIME | period |
| f | FREQUENCY | f = 1/P |
| φ | ANGLE | φ(t) = 2πt/P + φ0, dimensionless radians |

## Exact and derived register

- Julian year: 365.25 × 86,400 s = **31,557,600 s exactly** under the adopted convention.
- Astronomical unit: **149,597,870,700 m exactly**.
- Vacuum speed of light: **299,792,458 m/s exactly**.
- AU/c: **499.0047838361564… s**. This is the exact-length conversion divided by exact c, not a claim that the varying Earth–Sun range always has this light-time.
- Light-year: 299,792,458 × 31,557,600 = **9,460,730,472,580,800 m exactly** for this definition.
- Light-year/AU: **63,241.07708426628… au**.

## Nonidentities

YEAR ≠ LENGTH. AU ≠ TIME. LIGHT_YEAR ≠ TIME. c ≠ AU/YEAR as an identity. A period is not a distance; frequency is not speed; phase is not elapsed time without a bound period and phase-unwrapping rule.

No tropical, sidereal, anomalistic, Gregorian, or civil year is substituted for the Julian year. “One AU of light-time” is shorthand for AU/c only when the conversion and frame assumptions are stated.

## Metrological interpretation

In the current SI, c is a defining exact constant and the metre is realized through it. A local apparatus therefore does not improve or replace the exact SI value of c. It estimates an effective propagation speed, validates a time/length realization, or exposes systematic delays. In air, group velocity is approximately c/n_g; a vacuum value requires a justified group-index correction.

## Pattern audit

- “31 + 23” is an untyped arithmetic pattern; without units, mechanism, and independent observables it has no physical force.
- 365.54 d differs from the Julian year by 0.29 d = 25,056 s. It is not interchangeable with 365.25 d.
- A three-zone or three-sun graphic is not a three-source physical model unless three independently specified sources, geometries, emissions, and observables are supplied.

