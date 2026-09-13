# Symbol, Constant, and Unit Ledger

| Symbol/expression | Exact occurrence/use | Assigned legacy meaning | Unit status | Forensic finding |
|---|---|---|---|---|
| φ | both Python files, lines 8/9 | golden ratio | dimensionless | computed then unused |
| θ | both Python files | helix parameter | dimensionless radians implied | implemented |
| r = 1+0.3 sin(5θ) | both Python files | “Möbius + resonance” | dimensionless | ordinary radial modulation; not a Möbius strip |
| prime_indices | both Python files | “ZETA primes” | index | sieve of primes; no ζ(s) |
| κ_φπ = φ³/π² | review computation | proposed ratio | dimensionless | 0.429203421469682538643384974701…; rounded prompt value differs by −4.61×10⁻16 |
| 0.429 | Atrium filename | “ZetaLine” label | none declared | title-only; no stored computed value or downstream use |
| k_B | none in executable candidates | Boltzmann constant | J/K | not present; κ_φπ is not k_B |
| Fourier/FFT | named Fourier visual only; absent from generators | harmonic-space surface | unspecified | no source array or convention bound |
| entropy | visual title and Silver Rain prose | entropy/flow | unspecified | no implemented functional |
| 10⁻15 | cycle texts and broad RTF prose | galactic frequency / scale range | Hz in cycle text; otherwise none | stated galactic frequency is off by factor 10; no bound Fourier field |
| 63/64 | RTFD equation prose and Atrium filename | completeness factor | dimensionless | valid arithmetic identity only |
| 132° | visual filename and legacy tables | docking angle | angle | chosen label; no tested mechanism |
| DNA | visual titles | spiral metaphor | none | no biological data or model |
| reactor | document titles | breathing apparatus metaphor | quantities largely untyped | no physical reactor implementation |
| QED | PDF/title prose | “closure” | none | title does not establish quantum electrodynamics |
| P=R/T | two equation files/RTFD | potential or energy/time | R/T unless defined otherwise | if R is length and T time, unit is speed, not power |
| ω=2π/T | breathing equations | angular frequency | rad/s | dimensionally valid |
| R(t)=R₀+A sin(ωt) | breathing equations | radius oscillation | length | dimensionally valid if R₀,A are lengths |
| E=(1/2)mω²R² | breathing equations | “energy density” | joule | harmonic kinetic-energy scale, not energy density |
| f=1/P | cycle files | frequency | Hz | valid after converting period to seconds |

## High-impact numerical correction

For 225 million Julian years:

1 / (225,000,000 × 365.25 × 86400) = 1.4085×10⁻16 Hz.

The legacy files report approximately 1.409×10⁻15 Hz, a factor-of-ten error. This is a documented arithmetic issue, not a Fourier residual or physical signal.

## Mandatory nonidentities

PROBABILITY_DENSITY != LOCAL_ENTROPY_DENSITY
LOCAL_ENTROPY_DENSITY != TOTAL_ENTROPY
SPATIAL_FIELD != FOURIER_SPECTRUM
FOURIER_AMPLITUDE != ENERGY_DENSITY unless explicitly defined
GAUSSIAN_SELF_SIMILARITY != NEW_HARMONIC_LAW
κ_φπ != k_B
κ_φπ != TEMPERATURE
κ_φπ != ENTROPY
10^-15_PATTERN != PHYSICAL_SIGNAL without numerical-noise controls
MÖBIUS_VISUAL != TOPOLOGICAL_MODEL without a typed construction
“DNA” IN A TITLE != BIOLOGICAL DNA
“QED” IN A TITLE != QUANTUM-ELECTRODYNAMIC VALIDATION
“REACTOR” IN A TITLE != PHYSICAL REACTOR

