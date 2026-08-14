# Structural Family and Counterfactuals

Numeric trajectories are generated from symbolic visit sequences, but no graph
is passed to NEXAH. Each visit becomes a finite scalar plateau and adjacent
plateaus are connected by short linear ramps; the complete numeric trajectory
then enters the canonical sliding-window/KMeans pipeline.

State levels are symmetric and fixed: three-state families use `[-1,0,1]`;
four-state families use `[-1.5,-0.5,0.5,1.5]`. Default dwell is 14 samples,
ramps contain 3 interior samples, and each sequence repeats four times unless
specified. Declared state names are provenance only, never cluster labels.

| ID | Base organization / visit sequence | Matched counterfactual | Adversarial role |
|---|---|---|---|
| F1 | reversible chain `A-B-C-B-A` | add direct shortcut: `A-C-B-A` | replicate previous weakness on a new length/repetition fixture |
| F2 | directed cycle `A-B-C-A` | reverse cycle `A-C-B-A` | direction reversal |
| F3 | branch/return `A-B-A-C-A` | merge branch C into B: `A-B-A-B-A` | regime merge |
| F4 | four-state bottleneck chain `A-B-C-D-C-B-A` | bypass bridge: `A-B-D-C-B-A` | remove ordered bottleneck passage |
| F5 | two regions with rare bridge `A-B-A-B-C-D-C-D-C-B` | frequent bridge `A-B-C-D-C-B-A` | rare versus repeated cross-region transition |
| F6 | repeated-return hub `A-B-A-C-A-D-A` | leaf-to-leaf route `A-B-C-A-D-A` | hub bypass |
| F7 | unequal-dwell chain `A-B-C-B-A` with dwells `[28,7,20,6,24]` | rare shortcut appended once per repeat | unequal dwell / rare event |
| F8 | near-degenerate three levels `[-0.20,0,0.20]`, sequence `A-B-C-B-A`, dwell 10, ramp 2 | merge C toward B at level `0.04` | near-degeneracy / short-lived transitions |

Each family has exactly one preregistered counterfactual. The family differs
from the prior single fixture in lengths, repetitions, ramps, and—with F2–F8—
transition organization.
