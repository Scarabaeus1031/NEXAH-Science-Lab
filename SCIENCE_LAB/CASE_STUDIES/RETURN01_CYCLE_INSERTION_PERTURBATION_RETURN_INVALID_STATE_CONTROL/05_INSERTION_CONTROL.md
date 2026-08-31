# Insertion Control

## Sequences

- Base: `X0 -> X1 -> X2 -> X3 -> X4`
- With insertion: `X0 -> X1 -> P -> X2 -> X3 -> X4`

| Property | Base | With insertion | Changed? |
|---|---|---|---|
| state order among X states | X0,X1,X2,X3,X4 | X0,X1,X2,X3,X4 | no |
| event/state count | 5 | 6 | yes |
| index of X2, zero-based | 2 | 3 | yes |
| elapsed transitions to X4 | 4 | 5 | yes |
| endpoint state | X4 | X4 | not necessarily |
| history | base path | includes P and two extra transition incidences | yes |

Insertion adds a registered element/event to a sequence. It does not necessarily alter the intrinsic identity or values of later objects. It can change their sequence index, time position and history.

Perturbation, by contrast, modifies state evolution or values under a declared rule. An insertion can also cause a perturbation, but this requires an explicit causal rule; the types are not synonyms.

- later `X2` identity: unchanged under this declared model;
- later `X2` index: changed;
- final `X4` state equality: yes under this model;
- history equality: no.

