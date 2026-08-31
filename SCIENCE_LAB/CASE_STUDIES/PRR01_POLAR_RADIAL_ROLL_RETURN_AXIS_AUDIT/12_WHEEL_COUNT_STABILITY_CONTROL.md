# 12 — Wheel-Count and Control-Implementation Control

| example | contact/support observation | stability/control boundary |
|---|---|---|
| four-wheel vehicle | commonly provides a support polygon with several contacts | static stability depends on center-of-mass projection, geometry, loads, terrain, and contact—not count alone |
| two-wheel bicycle/motorcycle | contacts are approximately collinear | upright equilibrium generally requires steering/dynamic balance or support |
| one-wheel unicycle | minimal rolling contact arrangement | requires active rider/controller balance in relevant directions |

The sequence 4–2–1 is not dimensional reduction or a universal hierarchy.

`FOUR_TWO_ONE_WHEEL_COUNT_HAS_DIMENSIONAL_MEANING=NO`

Manual clutch/transmission and automatic transmission are examples of different actuation/control implementations. They do not alter the underlying distinctions among control policy, coupling state, gear ratio, rotation, contact, and translation. `AUTO`, `MANUAL`, `DRIVE`, and `REVERSE` may be actual mechanism labels only in their declared machine context; they supply no abstract semantics.

