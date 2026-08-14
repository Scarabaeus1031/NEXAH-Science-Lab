# ORION L4 final report

## Decision

`NEXAH-L4-C001` receives no scientific candidate class from `{ROBUST, REPRESENTATION_DEPENDENT, FAILED}` because the registered primary comparison is undefined on its fixed population. Protocol classification: **INVALID_EXPERIMENT**. Overall L4 status: **INVALID**.

This is not a negative robustness estimate. It is a validation-contract failure caused by fully tied weak preorders and the preregistered prohibition against synthesizing Kendall tau-b or altering the query population after rank observation.

## Registered gates

| Gate | Result |
|---|---|
| Reviewed hash | VERIFIED |
| Lock before implementation/result | YES |
| Source/provenance | PASS before observer failure |
| R0/R1/R2 tau-b and kappa | UNDEFINED |
| K_min | UNDEFINED |
| Every pair above 99% mismatch null | NO / NOT REACHED |
| Baselines | 0/2; NOT REACHED |
| Destructive controls | 0/6; NOT REACHED |
| R3 information-loss test | PASS: UNDEFINED, zero ranks |
| OFAT sensitivities | 0/8; NOT REACHED |
| Clean replay | IDENTICAL INVALIDITY |

## What L4 establishes

Within this locked run, the source and three NEXAH candidate extractions are provenance-complete and deterministically replayable. It establishes that the selected candidate/tie/metric contract produces fully tied preorders inside the fixed jointly supported population, making the registered Kendall-tau-b comparison non-identifiable. It also confirms the R3 z-only information boundary without fabricated ranks.

## What L4 does not establish

It does not establish robustness, representation dependence, candidate failure, added value over baselines, control sensitivity, parameter stability, navigation, control, intervention, physical truth, universal NEXAH validity, universal representation invariance, historical JANUS/Gate correctness, or generality beyond this candidate and protocol. The three reviewed MINOR limitations remain unchanged and were not upgraded or removed.

