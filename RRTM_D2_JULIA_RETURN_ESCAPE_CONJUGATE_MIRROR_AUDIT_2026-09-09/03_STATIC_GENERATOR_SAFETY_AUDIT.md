# Static Generator Safety Audit

No legacy generator was executed.

## RRTM V1 `run_test.py`

The file implements `c=-0.75+0.10i`, critical orbit, escape arrays, masks, a Matplotlib render, and JSON/Markdown outputs. It has no network, subprocess, external encoder, randomness, or undeclared input. It writes and overwrites `results.json`, `test_summary.png`, and `REPORT.md` beside itself. Execution was therefore prohibited in-place despite otherwise deterministic logic.

Three byte-identical copies of the script were found: the Science Lab case-study copy and two Desktop download-review copies. They are one evidence item, not three independent implementations.

## EXP-31 `exp_31_julia_navigation_coupling.py`

The generator implements the fixed Julia parameter and an escape field but adds Gaussian-gradient and heuristic navigation overlays. It imports NumPy, Matplotlib, and SciPy, writes a relative output path, and calls `plt.show()`, which can block on GUI. It was not executed. Its output is not `julia_c(1).png`.

## Other Julia candidates

`janus_julia_aperture_coupling.py` maps Lorenz-derived values into Julia parameters and writes several relative outputs. `EXP_09_mandelbrot_julia_phases.py` uses the fixed parameter but a different viewport, 500 iterations, a two-panel render, relative output, and `plt.show()`. Neither binds the intake `julia_c(1).png`; neither was executed.

## Audit-only implementation

`04_D2_REFERENCE_IMPLEMENTATION.py` passed syntax inspection. It uses only Python’s standard library; reads only its declared JSON; writes only generated CSV, JSON, and PNG files inside the new audit folder; and has no deletion, network, subprocess, external encoder, GUI, or randomness.
