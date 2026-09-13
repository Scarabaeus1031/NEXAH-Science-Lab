# Claim and Nonclaim Ledger

| Statement | Status / ceiling |
|---|---|
| Quaternions represent orientation/relative rotations | SUPPORTED_STANDARD_MATH; coordinates only |
| Quaternion composition is noncommutative | SUPPORTED_STANDARD_MATH; no new algebra |
| Dynamics quantities require more than orientation | SUPPORTED_STANDARD_MECHANICS |
| Time-varying spring-damper coupling is conventional | SUPPORTED_FORMALIZATION; not golfer-validated |
| Stiffness change can exchange control-port energy | SUPPORTED_STANDARD_MECHANICS; count P_K |
| Proximal-distal sequencing is a research topic | SUPPORTED_LITERATURE; not universal |
| Timing raises distal peak speed at fixed work | TESTABLE_HYPOTHESIS; unanswered |
| Four controlled conditions are justified | SPECIFICATION_ONLY |
| Existing NEXAH fully implements the candidate | REJECTED |
| OLS/ORION provide experiment infrastructure | SUPPORTED_ONLY_WITHOUT_PHYSICS_TRANSFER |
| RCB-01 proves counter-torque | REJECTED |
| Existing RELEASE equals disengagement/impact | REJECTED |
| Proximal deceleration proves transfer | REJECTED |
| Equal nominal actuator work is fair with varying K | REJECTED; stiffness port omitted |
| Glyph resemblance establishes identity | REJECTED; mnemonic only |
| EXP20 marks are computed/statistically distinct | NOT_ESTABLISHED; source/null absent |
| A new law or quaternion element was found | REJECTED |
| Review authorizes implementation/publication/commit/push | REJECTED |

Safe wording: NEXAH now has an additive specification for testing a conventional time-dependent coupling hypothesis in a synthetic three-body model, subject to a separate implementation gate.

Unsafe wording: NEXAH discovered that constraint timing selects momentum's destination.
