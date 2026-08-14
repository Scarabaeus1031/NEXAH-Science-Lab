# EXP-ORION-L1-001 v1.1 — Preregistration Lock

Lock timestamp: 2026-08-10T16:57:44Z  
Review decision: PASS  
Execution authorization: YES

## Bound preregistration artifact

Path: `../ORION_EXP_ORION_L1_001_INDEPENDENT_PREREGISTRATION_REVIEW/02_ORION_L1_PREREGISTRATION_V1_1.md`  
Version: `1.1`  
SHA-256: `b8477914987bdc7a8f870aeaf7ca4e366396e1e645c7c5eda5b006f5980d15bc`

The artifact identified by this exact digest is locked. It must not be modified after this authorization. Any artifact with a different digest is not authorized by this lock.

## Frozen source and numerical protocol

- Source: `dx/dt=y`, `dy/dt=-x`, `s(0)=(1,0)`, analytic `s(t)=(cos(t),-sin(t))`.
- Analytic energy: `E=0.5(x^2+y^2)=0.5`.
- Integrator: classical fixed-step RK4, simultaneous state update.
- Grid: `dt=2π/4096`, `8192` steps, `8193` saved samples, duration `4π`.
- Arithmetic: IEEE-754 binary64; no adaptive steps; no random seed.
- Source gates: maximum analytic trajectory error `<=1e-9`; maximum energy drift `<=1e-9`.

## Frozen representations

- R0: Cartesian identity.
- R1: orthogonal rotation `Q_(π/7)`; mapped source plus independent transformed RK4 under `A1=QAQ^T`.
- R2: `S=diag(2,0.5)`; mapped source plus independent transformed RK4 under `A2=SAS^-1`; transported energy `E2` kept distinct from raw Euclidean scaled-space energy.
- R3: polar radius and signed unwrapped phase, with `theta_forward(t)=-t`; phase undefined for `r<=1e-12`.
- R4: one-state scalar `x` only, with no time, step, history, neighbors, derivatives, source ID, equations, or phase.
- R5: 12 phase bins; palette B is the exact reverse of palette A; bin identity and rendered color remain distinct fields.

## Frozen candidate classes and thresholds

| ID | Frozen expected class | Frozen acceptance rule |
|---|---|---|
| L1-C01 | INVARIANT | exact analytic `E=0.5` |
| L1-C02 | ROBUST | source RK4 energy drift `<=1e-9` |
| L1-C03 | EQUIVARIANT | independent R1 trajectory defect `<=1e-9` |
| L1-C04 | EQUIVARIANT | R1 algebraic field defect `<=1e-12` |
| L1-C05 | INVARIANT | R1 energy defect `<=1e-12` |
| L1-C06 | EQUIVARIANT | R2 trajectory defect `<=1e-9` and field defect `<=1e-12` |
| L1-C07 | INVARIANT | transported-energy defect `<=1e-12` |
| L1-C08 | REPRESENTATION_DEPENDENT | raw scaled-space Euclidean-energy difference `>=0.1` somewhere |
| L1-C09 | ROBUST | maximum numerical `|r-1|<=1e-9` |
| L1-C10 | EQUIVARIANT | maximum signed unwrapped `|theta+t|<=1e-8` |
| L1-C11 | REPRESENTATION_DEPENDENT | exact R1/R2 raw-component counterexample |
| L1-C12 | UNDEFINED | at least `1000` unique R4 opposite-direction collision pairs |
| L1-C13 | REPRESENTATION_DEPENDENT | at least one palette color changes while bin is fixed |
| L1-C14 | ROBUST | deterministic perturbed-energy defect `<=2e-6` |

The deterministic perturbation is frozen as `δx=1e-6 sin(17t)`, `δy=1e-6 cos(19t)`.

## Frozen destructive controls

- D1: independently integrated damping `dy/dt=-x-0.1y`; energy claim fails and final energy drop is at least 50%.
- D2: `s_rev[i]=s[8192-i]` on increasing evaluation time; phase is recomputed, energy is retained, reversed phase slope is positive, and the forward phase law fails.
- D3: the wrong R2 Euclidean metric fails invariance and is representation-dependent.
- D4: use the unique fixed set `P={(i,4096-i): i=1,...,2047}` with the registered collision qualifications; x-only direction is undefined.
- D5: exact palette reversal changes rendered color while phase-bin identity is invariant.

## Frozen architecture and replay condition

1. Generator writes records without expected classes.
2. Observer/classifier receives thresholds but not expected classes and seals its result.
3. Comparator receives the sealed observation and expected classes only afterward.
4. A clean replay must regenerate every primary generated output in a separate location; reuse of primary generated outputs is prohibited.
5. All outputs, including failed outputs, are retained.

```text
VERSION: 1.1
REVIEWED AFTER CORRECTION: YES
LOCKED: YES
EXECUTION AUTHORIZED: YES
EXECUTED AT LOCK TIME: NO
RESULT KNOWN AT LOCK TIME: NO
```

