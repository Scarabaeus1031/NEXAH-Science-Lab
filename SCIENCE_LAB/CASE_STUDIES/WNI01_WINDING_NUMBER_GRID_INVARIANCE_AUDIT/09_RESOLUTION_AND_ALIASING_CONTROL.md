# Resolution and aliasing control

Direct polygonal samples were evaluated at 512, 128, 64, 32, 16, 8, 6, and 4 ordered samples.

| Curve | Lowest successful level in this ladder | First failure observed |
|---|---:|---|
| C0 | 4 | None in ladder |
| C1 | 4 | None in ladder |
| C2 | 6 | 4 → unresolved (π phase-step alias) |
| C3 | 4 | None in ladder |
| C4 | 6 | 4 → unresolved |
| C5 | 4 | None in ladder |

These are curve- and sampling-scheme-specific thresholds, not universal minima. C2 needs more points because it winds twice; C4 needs enough order to distinguish its self-intersecting traversal.

Aliasing control is based on accumulated ordered phase increments, not on how circular or loop-like the polygon looks. Repeated sector occupancy is harmless when order remains adequate; skipped transitions can be fatal.
