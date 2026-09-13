# Uncertainty, Calibration, and Drift Ledger

## Measurement model

Let (d=Delta L=L_2-L_1), (	au=Deltaar t=ar t_2-ar t_1), and (n=n_g).
[
hat c_0 = g(d,	au,n)=rac{2nd}{	au}.
]

For input vector (x=(d,	au,n)) and covariance matrix (Sigma),
[
u_c^2(hat c_0)=JSigma J^mathsf{T},
quad
J=left(rac{2n}{	au},-rac{2nd}{	au^2},rac{2d}{	au}ight).
]
The covariance form is mandatory when quantities share instruments, environmental data, fits, or drift corrections. If independence is justified, the relative approximation is
[
left(rac{u_c}{hat c_0}ight)^2=
left(rac{u_d}{d}ight)^2+
left(rac{u_	au}{	au}ight)^2+
left(rac{u_n}{n}ight)^2.
]

For one-way timing, add synchronization uncertainty and covariance. For a single-position round trip, fixed electronics latency enters directly. The differential design removes only common, stable latency; it does not remove position-dependent latency or drift.

## Ledger

| Source | Type | Calibration/evidence required | Correlation/drift treatment | Failure consequence |
|---|---|---|---|---|
| L1 and L2 survey | length | traceable instrument, reflector reference plane, repeat survey | retain covariance from same instrument and alignment | biased ΔL |
| digitizer timebase | time scale | calibrated reference or manufacturer certificate plus check | common scale error across all pulses | multiplicative speed bias |
| trigger-return channel skew | time | loopback/short-path before and after blocks | model common offset and drift | residual timing bias |
| pulse/detector waveform | time pickoff | bandwidth and impulse-response record | threshold walk may covary with amplitude | biased return time |
| block drift | time | ABBA order, timing reference, block plots | random/fixed effect declared | false distance dependence |
| atmosphere | group index | wavelength, T, p, RH, CO₂ basis; valid n_g model | spatial/temporal sampling along path | air-to-vacuum correction bias |
| geometry/alignment | length/path | surveyed optical reference planes and alignment log | position-dependent, not common | path differs from assumed 2L |
| multipath/background | signal | no-reflector/dark runs, waveform inspection | correlated with position and environment | wrong echo selected |
| event selection | analysis | frozen inclusion/exclusion rule | sensitivity analysis | selection bias |
| numerical analysis | computation | versioned equations and test vectors if later authorized | deterministic | reproducibility failure |

## Reporting

Report standard uncertainties, distributions, degrees of freedom where relevant, covariance assumptions, sensitivity coefficients, combined standard uncertainty, coverage method, and expanded uncertainty. A nominal match without this ledger is not a validated result.

