# 08 — Coupling, Shaft, and Clutch Control

Bounded standard chain:

`rotation source → coupling element → shaft → wheel rotation → contact → vehicle translation`.

| role | minimum meaning | noncollapse |
|---|---|---|
| rotation source | supplies torque/angular motion | not shaft or wheel |
| coupling | connects/modulates transfer between members | not the shaft or total transmission |
| shaft | physical rotating member carrying torque | not its geometric axis |
| wheel | rotating body with radius/contact geometry | not translation itself |
| contact | interaction constraint/force interface | not coupling or transport |
| translation | change of body position in declared frame | not rotation |

A simplified clutch permits, interrupts, or modulates transmission between input and output members. It is a controlled coupling component in this model.

```text
COUPLING_EQUALS_SHAFT=NO
COUPLING_EQUALS_TRANSMISSION=NO
SHAFT_EQUALS_WHEEL=NO
CLUTCH_EQUALS_GATE=NO
CLUTCH_EQUALS_SWITCH=NO
CLUTCH_EQUALS_RETURN=NO
CLUTCH_EQUALS_TRANSPORT=NO
CONTACT_EQUALS_ROTATION=NO
CONTACT_EQUALS_COUPLING=NO
```

No NEXAH terminology is imposed on these standard roles.

