# Static Code and Execution Safety Audit

## zeta_prime_lock_mobius.py

Exact SHA-256: c4ca96fc07fba3cef89aa50d25e89a0c01f7086af71f1af4cfc92e2df65bc3ee

Imports: NumPy, Matplotlib pyplot, mpl_toolkits.mplot3d, Matplotlib FuncAnimation.

Static behavior:

- deterministic; no random source or seed;
- no input files;
- no network calls;
- no explicit shell/subprocess import;
- output filename zeta_prime_lock_mobius.mp4;
- 360 points; θ from 0 to 4π; z from −2 to 2;
- radius r = 1 + 0.3 sin(5θ);
- prime positions produced by an internal sieve;
- 90 animation frames, 24 fps;
- phi = (1+sqrt(5))/2 is assigned and never used.

Safety decision: **NOT EXECUTED**. FuncAnimation.save() for MP4 normally delegates to an external writer such as ffmpeg. That indirect process and its version/configuration were not reviewed. The prompt requires a stop for unresolved subprocess behavior.

## zeta_mobius_overlay_spiral.py

Exact SHA-256: cf639bdece8b2f1f237b2a34554d5019b2ed1644ad517f5c8841351c762786a5

Imports: NumPy, Matplotlib pyplot, mpl_toolkits.mplot3d.

Static behavior:

- deterministic; no random source or seed;
- no filesystem reads or writes;
- no network, shell, subprocess, or dynamic-code calls;
- no declared output filename; ends with plt.show();
- same 360-point analytic spiral and internal prime sieve;
- phi is assigned and never used.

Execution record:

1. Unchanged temporary copy created.
2. System Python attempt with headless backend: exit 1 at line 2, ModuleNotFoundError: No module named numpy; stdout empty; no inputs consumed and no outputs created.
3. Bundled-runtime preflight: Python 3.12.14 and NumPy 2.3.5 available, but ModuleNotFoundError: matplotlib.
4. Dependency installation was not authorized, so execution stopped.

## Semantic ceiling

The code computes a radially modulated helix with prime-indexed points. It does not implement:

- a Möbius strip or typed Möbius topology;
- Riemann ζ(s);
- the Möbius function μ(n);
- FFT/DFT;
- probability or entropy;
- κ_φπ;
- any supplied CSV or observational dataset.

“ZETA,” “Möbius,” “Φ,” “resonance,” and “lock” in labels do not raise that ceiling.

