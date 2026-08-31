# Roundtrip control

The tested bounded pattern is

    X → Q(X) → R_N representation → D_N reconstruction → Q → X_hat.

D_N reconstructs sector-center representatives; it is not a true inverse of lossy quantization. Tests include Q-singularity-free C0, C1, C2, C3, and C5.

| Grid | Returned winding | Normalized coordinate RMS range |
|---|---|---|
| Q7 | Preserved for all five | 0.258–0.304 |
| Q11 | Preserved for all five | 0.153–0.168 |
| Q13 | Preserved for all five | 0.118–0.142 |
| Q17 | Preserved for all five | 0.084–0.108 |

C4 is excluded because its curve contains the Q singularity. C6 is invalid at its reference.

The result demonstrates both boundaries:

- Winding can return while coordinates differ materially.
- Small coordinate distance alone would not prove winding preservation.

A roundtrip record must retain winding comparison and coordinate-distance metric separately. Return of an observable does not identify path, event, history, or provenance.
