# QRO-01 — Neutral Relabel Control

Relabelling:

```text
A = carrier
B = captured representation
C = reference frame
D = orientation state
E = encoded spatial content
F = decoded content
G = execution environment
H = result
J = trace
```

Neutral pipeline:

```text
A → B → (C,D) → E → F → [G + explicit rule?] → H
                                      └──────────→ J if attested
```

The distinctions remain: A is not E/F; C/D are not F; G is not an event; H is not J. Exact and specialized operator boundaries are unchanged when QR, binary, information and NEXAH names are removed.

`NEUTRAL_RELABEL_SURVIVES=YES`
