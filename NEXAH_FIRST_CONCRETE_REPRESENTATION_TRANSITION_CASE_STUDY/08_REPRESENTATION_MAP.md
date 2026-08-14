# Representation Map

```text
R0  frozen synthetic model instance
 |
 | T01 make_system
 v
R1  observations + latent labels + sample indices
 |\
 | \ T03 one-step delay embedding
 |  v
 |  R3 delay features [x_t, x_(t-1)]
 |   |
T02  | T05 global normalization
 |   v
 v  R5 normalized delay geometry
R2 baseline features                   
 |   |
T04  | T07 deterministic k-medoids + oracle alignment
 |   v
 v  R7 delay decoded/aligned sequence
R4 normalized baseline geometry       |
 |                                    | T09 transition/certificate projection
 | T06 deterministic k-medoids        v
 |     + oracle alignment            R9 delay counts/certificates
 v                                    |
R6 baseline decoded/aligned sequence  | T11 aggregate contribution
 |                                    |
 | T08 transition/certificate         |
 |     projection                     |
 v                                    |
R8 baseline counts/certificates       |
 |                                    |
 | T10 aggregate contribution         |
 +------------------+-----------------+
                    v
                  R10 comparative aggregate
                    |
                    | T12 frozen classification/interpretation
                    v
                  R11 bounded scientific disposition
```

Every arrow is implemented in the frozen runner. The map contains no plot or conceptual shortcut. Latent labels carried with the feature packages are used only after graph-blind clustering for oracle alignment and fidelity evaluation.

The two paths meet at representation type, not at value: R8 and R9 have the same contracts but materially different contents.
