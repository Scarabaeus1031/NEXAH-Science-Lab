# Legacy Equation Dimensional Audit

| Expression | Source | Mathematical status | Dimensional/physical status | Code/data/test |
|---|---|---|---|---|
| R(t)=R₀+A sin(ωt) | Breathing Physics Equations | valid sinusoidal parametrization | valid if R₀,A are lengths and ωt dimensionless | not in supplied generators |
| ω=2π/T | same | valid | rad/s for T in seconds | not tested |
| Φ(t)=Φ₀+δΦ sin(ωt) | same | valid angle modulation | valid if all Φ terms are angles | not tested |
| E=½mω²R² | same | kinetic-energy form | joules, not energy density; no volume factor | mislabeled; not implemented |
| ΔE=Σδ(t−t_sacred) | same | distribution skeleton | missing amplitude with energy×time units | incomplete |
| P=R/T | multiple texts | arithmetic ratio | speed if R is radius and T time; not power/energy per time | meaning inconsistent |
| f=1/T | cycle documents | valid | Hz after seconds conversion | arithmetic only |
| B(t)=Σ sin(2πfᵢt) | cycle masterfile | valid dimensionless superposition | phenomenological only; amplitudes/phases absent | not implemented |
| f_galactic for 225 Myr | cycle documents | reciprocal-period calculation | reported 1.409×10⁻15 Hz is factor 10 high | fails independent calculation |
| collapse=1/(1+exp(k(t−t₀))) | reactor equations | valid logistic form | k requires inverse-time units; legacy k=8 is untyped | not implemented |
| parametric x,y,z “Möbius” coordinates | reactor equations | possible surface parametrization | θ/time roles mixed; topology not proven | unrelated to supplied helix code |
| spin rate = speed/880 km/s | tachyon math | dimensionless speed ratio | mislabeled rounds/s unless multiplied by a reference rate | no source/test |
| ρ=T_next/T_current | tachyon math | valid ratio | dimensionless | descriptive only |
| 63/64=1−1/2⁶ | RTFD | valid identity | dimensionless | no physical consequence follows |
| Σ(1/k−1/(k+1))→1 | RTFD | valid telescoping limit | not a zeta-balance law | documentary only |
| e^{iπ}+1=0 | RTFD | Euler identity | dimensionless | subsequent physical interpretation unsupported |
| e^{−iπ}−1=−2 | RTFD | valid arithmetic | label “relue” adds no physics | documentary only |
| φ+(1−√5)/2=1 | RTFD | valid golden-ratio conjugate identity | dimensionless | documentary only |
| N(t,θ,φ,P,T) composite | RTFD | expression can be evaluated after definitions | mixes angles with time in sin(θt), ambiguous P/T, and empirical labels without units | not implemented/bound |
| Q(t) constant sum | RTFD/PDF prose | arithmetic expression | no t dependence despite Q(t); physical interpretation absent | no source/test |

## Surviving equations

The following survive only at their stated ceiling:

1. reciprocal period f=1/T;
2. angular frequency ω=2π/T;
3. sinusoidal radius/angle parametrizations with typed amplitudes;
4. logistic transition after assigning k units;
5. elementary identities 63/64, Euler’s identity, golden-ratio conjugacy, and the telescoping series;
6. ordinary parametric curves/surfaces when their parameters are declared.

No legacy equation survives as a validated new physical, thermodynamic, biological, or information-theoretic law.

## Escape/corruption audit

No literal byte 0x0C from a misinterpreted \f or 0x08 from \b was found in the reviewed text files. The RTF contains 370 literal tab bytes as formatting/content. Original bytes were preserved. Display transcriptions in this review are separate and do not replace source text.

