# Repository Component and Lineage Map

| Component | Evidence | Reusable role | Boundary |
|---|---|---|---|
| OLS operators | MISSION_01_SCIENTIFIC_BACKBONE/01_CANONICAL_OPERATOR_INVENTORY.md:5-22 | OBSERVE, REPRESENT, COMPARE, SELECT, TRANSFORM, VALIDATE, RECORD | semantics are not physics |
| OLS TRANSFORM | same file :120-134 | identity/order/constraint/provenance wrapper | does not execute dynamics |
| Demonstrator dynamics | NEXAH_LAB_OPERATOR_DEMONSTRATOR_AUDIT/EQUATION_OPERATOR_LEDGER.md:15-22,62-73 | controlled dynamics and ablation pattern | toy 2-D ODE, not golf |
| Demonstrator RELEASE | CURRENT_KERNEL_MAP.md:97-110 | typed zero-control policy mode | not disengagement or impact |
| RCB-01 | RCB01.../05_COUNTER_ROTATION_OPERATOR_SPEC.md:5-35 | sign-opposed planar rotations | specified, not executed; no torque claim |
| IJQ-01 | SCIENCE_LAB/.../IJQ01.../03_COMPLEX_AND_QUATERNION_BASELINE.md:7-35 | noncommutative algebra baseline | no forces or dynamics |
| Grip/Gap/Boundary | SCIENCE_LAB/.../LQE01_POST.../02_GRIP_GAP_AND_BOUNDARY_COUPLING_ANNOTATION.md:5-58 | retention/separation/interface mnemonic | explicitly not operator/law/causation |
| ORION core | TITAN00.../15_TITAN00_FINAL_DECISION.md:35-41 | structural representation/relations/provenance | not mechanics engine |
| Transformation planner | TITAN00.../02_TOTAL_COMPONENT_INVENTORY.md:30-38 | route metadata | executes no target operator |
| EYE | NRDL_TAR01_ORION_EYE_TARGET_ARCHITECTURE_REVIEW_2026-09-04 | view/projection separation | projection is not measurement |
| Drift/Gate/Janus | MISSION_01.../01_CANONICAL_OPERATOR_INVENTORY.md:184-214 | optional diagnostics | no momentum transfer; Gate is not event |
| Shadow | LQE-01 | source/body/receiver/view distinction | optics is not mechanics |
| Golf | no local formal golf mechanics component located in bounded search | application motivation; external prior-art baseline | visual origin is not data or implementation |
| Pendulum | no local formal pendulum/coupled-link component located in bounded search | conventional reduced-model family for a future synthetic implementation | an analogy does not supply the specified three-body model |
| EXP20-B | VST01 final decision :3-91 | closed provenance result | source geometry unavailable |

## Candidate crosswalk

| Word | Nearest component | Gap |
|---|---|---|
| BOUNDARY | OLS declarations; Grip/Gap; contact constraints | physical constraint typing |
| ANCHOR | reference / ground constraint | mechanics definition |
| LOAD | action/work and elastic state | applied-load definition |
| COUNTERROTATION | RCB-01 | 3-D relative dynamics |
| BRAKE | HOLD is not braking | negative-power torque |
| TRANSFER | TRANSFORM is not momentum transfer | torque/power ledger |
| RELEASE | existing policy label | torque-off/compliance/disconnect/impact split |
| RESIDUAL | domain-specific residual vocabularies | post-event observable |

No located test jointly supplies three rigid bodies, SO(3) relative rotations, constraints, time-varying compliant torque, braking, momentum, work, energy, events and a fixed-work four-condition comparison.

FULL_EXISTING_COVERAGE=NO

NEAREST_REUSE=OLS_COMPARE_VALIDATE_RECORD_PLUS_RCB_LINEAGE_PLUS_SCIENCE_LAB_CONTROL_DISCIPLINE
