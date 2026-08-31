# I–L–A–U winding ledger

WNI-01 uses the protocol's explicit application codebook: I = retained, L = lost, A = introduced, U = unresolved. This assignment is not derived from the letters and does not modify ILAU-SRA01.

| Step | I — retained | L — lost | A — introduced | U — unresolved |
|---|---|---|---|---|
| Identity | Signed/absolute W; contract | None | Copy record | None |
| Translation/rotation/scale | W under rule | Original coordinates | Transform/frame parameters | None when recorded |
| Reflection | |W| and sign rule | Original handedness | Reflected frame | Sign if convention omitted |
| Q about 0 | |W| and sign rule | Original radial scale | Reciprocal representation/singularity | Cases touching 0 |
| Q with finite p | Difference-rule inputs | Simple same-W expectation | Infinity/reference handling | Missing W(C,0) |
| Q7/Q11/Q13/Q17 | W for C0–C5; order/closure | Continuous phase precision | Sector centers/corners | Aliasing if transition too large |
| Reconstruction | Ordered representative path | Exact coordinates | Representative coordinates | Non-unique preimage |
| Tested roundtrip | Source W for valid cases | Coordinate identity | Quantized history | Singular inputs |
| Coarse N=1 | None of C0 W | +1 becomes 0 | Degenerate representative | External recovery |
| Shuffle/unordered | Membership | Path, orientation, W | Arbitrary adjacency | W |
| Broken closure/crop | Partial points | Closed path | Artificial endpoint | W |
| Reference on curve | Curve samples | Valid observable | Singularity | Undefined, not merely unresolved |
| Provenance deletion | Bare number may remain | Source/transform authority | None | Documentary validity |

The ledger separates the invariant of the declared continuous curve from representation recoverability.
