# Preregistration

Status: design ready for Owner review; `NOT_ADOPTED`; no run authorized.

## Frozen Level-1 protocol

| Item | Preregistered rule |
|---|---|
| Dynamical system | Four-node normalized swing-equation system with the supplied symmetric `B`, `M`, `D`, and balanced base `P`; explicitly named synthetic, never IEEE |
| Initial condition | Solve the base equilibrium `P_i - sum_j B_ij sin(delta_i-delta_j)=0`, with `sum(delta)=0`; `omega_i=0`; reject unsolved initializations |
| State coordinates | Unwrapped relative rotor angles `delta_i-delta_COI` and center-of-inertia-relative speeds `omega_i-omega_COI` |
| Deterministic integrator | Fixed-step RK4, `dt=0.01` normalized time units, 30-unit horizon; convergence check repeated at `dt=0.005` |
| Stochastic secondary | Mechanical-power diffusion only, Euler–Maruyama with `sqrt(dt)` scaling, fixed `sigma=0.01`; primary result remains deterministic/stress-path evaluation |
| Stress onset | time 5.0; no warning scored during a 5.0-unit pre-stress burn-in |
| Stress form | balanced direction `q=(0.5,-0.5,0.5,-0.5)` with `P(t)=P0+lambda(t)q`; `lambda` is ramped then held; total injected power remains zero |
| Development paths | ramp rates `0.04, 0.08`, caps `0.4, 0.8, 1.2`; stochastic seeds 1000–1049 plus deterministic run |
| Evaluation paths | unseen ramp rates `0.02, 0.06, 0.10`, caps `0.2, 0.6, 1.0, 1.4`; seeds 0–199 plus deterministic run; lock before evaluation |
| Non-event controls | zero-stress and subcritical capped paths retained even if they never reach an event |
| Candidate | `R(t)=abs(mean(exp(i delta_i(t))))`; warning when `R(t)<tau_R` for 10 consecutive samples |
| Comparator | `V(t)=max_i abs(omega_i(t)-omega_COI(t))`; alarm when `V(t)>tau_V` for 10 consecutive samples |
| Terminal event | first time maximum pairwise unwrapped angle separation exceeds `pi` continuously for 0.2 time units; call it a synthetic loss-of-synchronism proxy, not collapse |
| Actionable horizon | warning must occur after stress onset and within `[0.2, 5.0]` time units before the terminal event |
| Numerical failure | non-finite state, equilibrium failure or timestep nonconvergence is `INCONCLUSIVE/INVALID`, never a terminal event |

Exact numeric parameters may be revised only during public Owner review before
any development run. Once development starts, changes require a new protocol
version. Evaluation paths and seeds may not be inspected during calibration.

## Threshold calibration

Candidate and comparator receive the same development-only procedure:

1. evaluate thresholds on grids `tau_R=0.50..0.95` in steps of `0.01` and
   `tau_V=0.02..1.00` in steps of `0.01`;
2. require development non-event false-positive rate ≤ 0.10;
3. among eligible thresholds maximize event recall, then median actionable lead;
4. break ties conservatively: lower false-positive rate, then shorter lead;
5. freeze both thresholds, persistence and all code before evaluation.

If no threshold satisfies the false-positive constraint, the corresponding
indicator is unavailable and cannot pass.

## Exclusions and missingness

- exclude no run because its result is unfavorable;
- invalid only for preregistered numerical/identity failures;
- event-free runs remain in false-positive analysis;
- missing warning on an event run is a false negative;
- warning outside the actionable horizon is not credited as actionable;
- preserve every seed, state trace, event record and error.

## Freeze artifacts required before execution

Machine-readable manifest; source hash; environment lock; equations; parameter
arrays; all paths/seeds; integrator; candidate/comparator code; thresholds
procedure; event detector; metrics; pass/fail rules; output schema and analysis
script hashes.

