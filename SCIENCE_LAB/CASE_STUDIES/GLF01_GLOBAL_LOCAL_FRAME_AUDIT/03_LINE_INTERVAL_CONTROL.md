# 03 — Line / Interval Control

## Objects

- A Euclidean line is unbounded in both directions.
- A ray has an endpoint and one unbounded direction.
- A line segment has two endpoints.
- An interval is a subset of `R` whose endpoint inclusion and boundedness must be stated.
- A parameterized interval is a domain together with a map.
- A coordinate value is a number assigned after selecting coordinates.

Therefore `LINE != INTERVAL` without a specified identification. The real line is modeled by `R`, while a bounded closed interval `[a,b]` is not homeomorphic to `R` (among other differences, it is compact and has boundary endpoints).

## Origin and scale control

With old coordinate `x`, choose a new origin displaced by `a`:

```text
x' = x - a
```

For a scale factor `s != 0`, one may use `x'' = s(x-a)`. The coordinate of each geometric point changes. Incidence, ordering when `s>0`, equality of geometric points and affine ratios are preserved; distances expressed numerically scale by `|s|`. If `s<0`, orientation reverses.

```text
POINT_EQUALS_COORDINATE=NO
COORDINATE_IS_INTRINSIC_IDENTITY=NO
PASSIVE_COORDINATE_CHANGE_TRANSFORMS_OBJECT=NO
```

A line can be given a distinguished origin and unit, but those are additional structure.

