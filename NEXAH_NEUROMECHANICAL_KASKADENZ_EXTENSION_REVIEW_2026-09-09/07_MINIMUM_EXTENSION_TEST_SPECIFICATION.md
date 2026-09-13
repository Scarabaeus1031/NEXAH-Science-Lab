# Minimum Extension Test Specification

## Authorization and question

Specification only. No implementation, simulation, Human experiment or execution is authorized.

Starting from the hash-locked BODY -> ARMS -> CLUB plant, can a minimal target/controller/observer wrapper distinguish current-movement correction, next-trial revision and NEXAH audit value without a muscle-level Human simulation?

## Frozen manifest

One byte-identical manifest freezes predecessor hash set; masses/inertias/geometry; initial states; coordinate and quaternion conventions; ground/device/impact contact law; target and tolerance in a named frame; `K(t)`/`C(t)` and stiffness port; torque/rate/work bounds; event localization; integration method/tolerances; observer frames; channel noise; every latency component; revision map; seeds; horizon; and evaluation intervals.

No real-person calibration, optimization after observing outcomes, or unregistered parameter rescaling is permitted.

## Minimal added interface

    TARGET r
    FEEDFORWARD INPUT u_ff
    DELAYED FEEDBACK INPUT u_fb
    CONTACT STATE c
    OBSERVATION y
    REVISION R

The plant equations remain unchanged. An abstract torque port is sufficient; EMG, muscle recruitment, tendon, spinal-circuit and brain simulation are excluded.

## Four conditions

| ID | Current trial | Use of result | Purpose |
|---|---|---|---|
| C1_OPEN | fixed `u_ff`; `u_fb=0` | observation logged only | no-feedback reference |
| C2_WITHIN | same initial `u_ff`; causal delayed `u_fb` enabled | current trial where latency permits | Q1 current-release contrast |
| C3_NEXT_ONLY | execution identical to C1 | residual stored; no current correction | separates observation from action |
| C4_REVISED_NEXT | next trial uses preregistered `R(rho)` change to `u_ff` | no hidden current-trial feedback unless factorially declared | Q2 revision contrast |

The phrase `identical mechanical Kaskadenz` means identical plant, initial state and feedforward schedule before allowed feedback divergence—not identical realized trajectory after a corrective torque.

## Fairness and controls

- identical initial, mechanical, target and contact parameters;
- same input bounds and preregistered feedback/revision budgets;
- matched total accounted work within tolerance, including `P_K`, feedback actuator work and brake absorption;
- report signed work and positive supplied work separately; if matching fails, return `INCOMPARABLE_WORK_MATCH_FAILURE`;
- identical observation noise/seeds in paired comparisons;
- documented per-channel latency and observer frame;
- information records never counted as energy;
- negative controls: shuffled/wrong-frame residual, latency beyond release, `R=NO_CHANGE`, `K_dot=0`, neutral BODY/ARMS/CLUB relabeling;
- two step refinements and small preregistered perturbations for numerical sensitivity.

## Outputs

Mechanical states; segment-peak times; all torques; joint power and signed/positive/absorbed work; distal speed; target error; contact/event times; residual; channel latency; next-plan delta; continuous energy-balance error; impact jump residual; stiffness-port power; observer-frame binding; information lineage; and failure state.

## Decision rules

**Q1 — current release.** Primary contrast `C2_WITHIN - C1_OPEN` on preregistered release endpoint/target error. Attribute a current-trial effect only when the causal-arrival record precedes release and the effect exceeds numerical uncertainty under equal-work constraints. Otherwise report `TOO_LATE`, `NO_MATERIAL_EFFECT`, `UNRESOLVED` or `INCOMPARABLE`; do not relabel it next-trial evidence.

**Q2 — next attempt.** Compare `C4_REVISED_NEXT` with `C3_NEXT_ONLY` on a held-out, preregistered set of perturbations/targets. The residual is informative only if revision improves the primary target metric beyond uncertainty without worsening a preregistered safety/work constraint. Return `RESIDUAL_INSUFFICIENT` when improvement does not generalize.

**Q3 — NEXAH audit value.** Ablate only the NEXAH record envelope, not the numerical controller. Audit value passes if independent reconstruction can identify Human authority, source/target frames, causal availability, energy ports, claim status and current-vs-next use more completely while controller outputs remain numerically identical. This supports documentation/provenance utility, not control superiority.

## Stop/failure states

`INPUT_HASH_MISMATCH`, `FRAME_UNBOUND`, `LATENCY_UNBOUND`, `ENERGY_LEDGER_FAILURE`, `CONTACT_UNBOUND`, `WORK_MATCH_FAILURE`, `NUMERICALLY_UNRESOLVED`, `MODEL_SENSITIVE`, `NO_CURRENT_EFFECT`, `NO_NEXT_TRIAL_BENEFIT`, `AUDIT_VALUE_NOT_SHOWN`, `HUMAN_STOP`.

    MINIMUM_EXTENSION_TEST_JUSTIFIED = YES_SPECIFICATION_ONLY
    TEST_IMPLEMENTED = NO
    TEST_EXECUTED = NO

