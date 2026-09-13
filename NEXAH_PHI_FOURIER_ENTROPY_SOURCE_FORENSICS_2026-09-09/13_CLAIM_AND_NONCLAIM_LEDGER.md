# Claim and Nonclaim Ledger

| ID | Statement | Disposition | Basis |
|---|---|---|---|
| C1 | Both scripts generate their own 360-point analytic spiral and prime indices. | ALLOWED | static code |
| C2 | Neither script reads any CSV. | ALLOWED | AST and source inspection |
| C3 | phi is assigned but unused in both scripts. | ALLOWED | source lines and data flow |
| C4 | The 8×8 table is nonnegative, symmetric, and undocumented. | ALLOWED | numeric audit and missing metadata |
| C5 | Its independent normalized Shannon entropy is 3.983066194892531 nats. | ALLOWED WITH AUDIT-ONLY LABEL | review calculation |
| C6 | Its independent FFT satisfies Parseval within 3.55×10⁻15. | ALLOWED WITH CONTROL LABEL | review calculation |
| C7 | κ_φπ equals 0.4292034214696825386… | ALLOWED | high-precision arithmetic |
| C8 | The cycle-file 1.409×10⁻15 Hz value is a factor-of-ten error. | ALLOWED | reciprocal-period calculation |
| C9 | No common source array is demonstrated for the Fourier and entropy visuals. | ALLOWED | provenance graph |
| N1 | The 8×8 table is observed cosmic microwave background data. | PROHIBITED | no citation, units, instrument, coordinates, preprocessing, or license |
| N2 | The entropy visual equals −p ln p or −k_Bp ln p. | PROHIBITED | no bound functional or source |
| N3 | Fourier amplitude is energy density. | PROHIBITED | no definition and units differ |
| N4 | Gaussian resemblance is a new harmonic law. | PROHIBITED | established transform behavior |
| N5 | κ_φπ is k_B, temperature, or entropy. | PROHIBITED | dimensionless nonidentity |
| N6 | A 10⁻15 colored pattern is a physical signal. | PROHIBITED | missing numerical-noise controls |
| N7 | “Möbius” establishes topology. | PROHIBITED | scripts make a modulated helix |
| N8 | “ZETA” establishes ζ(s) computation. | PROHIBITED | scripts implement only a prime sieve |
| N9 | “DNA” establishes biological relevance. | PROHIBITED | no biological data/model |
| N10 | “QED” establishes quantum-electrodynamic validation. | PROHIBITED | title/prose only |
| N11 | “reactor” establishes a physical reactor. | PROHIBITED | no apparatus, energy balance, or test |
| N12 | A dependency failure is a scientific reproduction failure. | PROHIBITED | execution environment incomplete |
| N13 | Located variants prove exact requested historical files absent. | PROHIBITED | use UNRESOLVED_NOT_ABSENT |

No new physics, thermodynamics, information theory, or biology is claimed.

