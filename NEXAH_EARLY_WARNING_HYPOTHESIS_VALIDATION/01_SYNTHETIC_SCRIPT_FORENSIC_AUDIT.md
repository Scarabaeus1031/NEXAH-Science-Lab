# Synthetic Script Forensic Audit

Line numbers refer to the supplied `ieee_simulation_proof.py` hash recorded in
`00_SOURCE_AND_PROVENANCE_AUDIT.md`.

## Implemented dynamics

For four nodes, the raw loop implements the discrete updates

```text
theta_i[k+1] = theta_i[k] + omega_i[k] dt + epsilon_i[k]

omega_i[k+1] = omega_i[k]
  + dt/M_i * (r[k] Pm_i
              - sum_j B_ij sin(theta_i[k]-theta_j[k])
              - D_i omega_i[k])
```

where `epsilon_i ~ Normal(0, 0.005)` is added directly to angle. This is a
stochastic, all-to-all coupled phase/swing-like toy model. Calling it
Euler–Maruyama is incomplete: no SDE/diffusion model or `sqrt(dt)` scaling is
declared, and noise is injected into angle rather than accelerating power.

## Line-level audit

| Lines | Operation | Classification | Finding |
|---|---|---|---|
| 8–10 | 120 steps, 4 generators, `dt=0.1` | manually assigned | No physical units/time base beyond labels |
| 13–14 | inertia `[1,1.2,.8,1.1]`, damping `[.15,.20,.10,.18]` | manually assigned | No IEEE dynamic-data provenance |
| 18–23 | dense symmetric coupling matrix | manually assigned | All four nodes coupled; not an IEEE bus/branch admittance model |
| 26–30 | initial angles/velocities and `Pm` | manually assigned | Not solved from a power-flow equilibrium; negative “mechanical” inputs are unexplained |
| 39–43 | thresholds `0.85`, `0.15`, Cubit constant `0.355` | manually assigned | No development/evaluation calibration or domain basis |
| 47–52 | ramp after step 30 at slope `0.053` | manually assigned to force result | Comment targets bifurcation near 110 without measuring one |
| 54–72 | raw dynamics and angle noise | measured from synthetic simulation | No seed; each execution differs |
| 76–80 | `S_NEXAH` | calculated from raw angles | It is the standard phase-coherence/order-parameter magnitude |
| 82–83 | classical metric | calculated from raw speeds | Maximum absolute deviation from arithmetic mean speed |
| 95–97 | first raw threshold crossings | measured from simulation | Can raise `IndexError` if a threshold never crosses; results are immediately discarded |
| 98 | `step_collapse = 110` | manually assigned | No event detector or state criterion |
| 100–102 | replace warning/alarm with 65/105 | overwritten / desired-result dependent | Explicitly “for visual consistency”; destroys raw timing result |
| 104–109 | replace all post-65 coherence values | post-processed / visually adjusted | Line 105 is then superseded by deterministic shaped curve; clipping follows |
| 111–116 | replace entire comparator curve | post-processed / visually adjusted | Pre-105 linear trace and post-105 power-law runaway plus fresh unseeded noise |
| 117 | add runaway to all angle suffixes repeatedly | post-processed / visually adjusted | Later samples receive cumulative additions from every earlier loop iteration |
| 125–129 | plot fixed event markers and IEEE/collapse title | manually labeled | Labels exceed model/evidence identity |
| 147–148 | shaded “actionable” window | circular by construction | Bounds are the imposed 65 and 105; label says 40–50 although exact width is 40 |
| 162 | fixed output path | manually assigned | No run manifest or raw output preservation |
| 167–170 | print 65/105/110 and 40-step advantage | derived from imposed constants | Not an empirical result |

## Parameter and randomness inventory

Manually chosen: node count, step count, timestep, inertia, damping, coupling,
initial states, base inputs, ramp onset/slope, both thresholds, Cubit constant,
collapse step, overwritten warning/alarm steps, both curve-shaping formulas and
plot labels.

Randomness occurs twice:

1. line 69: angle noise during raw simulation;
2. lines 114/116: new noise in the replacement comparator curve.

There is no seed, seed log or repeat-run distribution.

## Indicator algebra

The script defines

```text
psi_i = theta_i - mean(theta) - 2*pi*x_cubit
S = |mean(exp(i*psi_i))|
```

But a common phase shift has unit magnitude, so

```text
S = |exp(-i(mean(theta)+2*pi*x_cubit)) mean(exp(i theta_i))|
  = |mean(exp(i theta_i))|.
```

Therefore `x_cubit=0.355` and mean subtraction do not affect `S`; the indicator
is the ordinary Kuramoto phase order parameter. Calling it a distinct Cubit or
manifold projection is unsupported by this implementation.

## Timing verdict

| Displayed item | Verdict |
|---|---|
| NEXAH warning 65 | imposed, not emergent |
| Classical alarm 105 | imposed, not emergent |
| Collapse 110 | imposed label, not measured |
| +40 step advantage | arithmetic difference of two imposed values |
| +40–50 label | visually asserted; only 40 follows from plotted markers |

