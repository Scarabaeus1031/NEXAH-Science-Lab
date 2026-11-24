# A0 RDMH Helix Strand Adapter · Source / Operator / Return Contract

**Status:** `SOURCE_BOUND_ENGINEERING_VIEW` · `VISUAL_ENCODING_ONLY` · `NOT_SCIENCE_RUN` · `NOT_PUBLIC`
**Identity reuse:** `MOD:NUMBER_VIEW_SUITE` · `ART:A0:MATHEMATICAL_JOINTS`
**Source surface:** `A0_HELIX_VIEW_ADAPTER.html`

## Source

- Twin carrier: the 40 verified prime pairs `(p,p+2)` with `p+2 ≤ 1111`.
- Finite-ring carrier: the 19 unique orbits of `r ↦ −r mod 37`, namely `{0}` and 18 two-cycles.
- Explicit-formula carrier: a frozen finite table of the first 20 positive ordinates `γₙ` of known nontrivial zeta-zero conjugate pairs `ρₙ=1/2±iγₙ`.
- Prime-residue carrier: the same 168 prime records `p≤1000` used by the Euler Compass view. The 18 primes `1000<p≤1111` remain an explicit tail outside this shared view.
- Every selected rung retains its original pair and returns to it exactly.

## Declared view operators

- `RN\A` is the declared label for the single-strand projection `γA(k)`. It is not treated as a proven set difference unless the compared sets are separately declared.
- `(c)D|⁄|A` is the declared label for the antipodal double-strand projection. Its radial coordinates satisfy `γB(k)=−γA(k)` while both points retain the same height `z_k`.
- Each double-strand rung is the segment `L_k(s)=(1−s)γA(k)+sγB(k)`. Its exact midpoint is `L_k(1/2)=(0,z_k,0)`.
- `θ₁ = 2π/10 = 36°` is a ten-sector phase step written through Euler's circle parametrization.
- `θ₂ = 2π/φ² = π(3−√5) ≈ 137.507764°` is the exact golden angle.
- The slider performs a declared linear interpolation `θ(t)=(1−t)θ₁+tθ₂`; it is not a discovered coupling.
- For the continuous reference helix `γ(t)=(R cos t, bt+y₀,R sin t)`, the adapter derives `b=Δz/Δθ`, curvature `κ=R/(R²+b²)` and torsion magnitude `|τ|=|b|/(R²+b²)` in normalized view units.
- `Δθ` is the discrete twist per carrier step. `|τ|` is not another name for that slider value: with fixed radius and total height, increasing `Δθ` increases the number of turns while decreasing `b` and therefore may decrease `|τ|`.
- Opposed strand points differ by `π` at a shared height.
- The outer rail has radius ratio `φ:1`; Fibonacci indices `1,2,3,5,8,13,21,34` are display markers only.
- The 3-slot register is `c(k)=floor(k/3)+1` with slot `(k mod 3)+1`. “Codon” remains an interface label; no biological equivalence is asserted.

## Register overlays

- `PAIR · 1+1` leaves the tested single/double source carrier unobscured.
- `F/H · 7+7` draws seven phase lanes `F1…F7` and their antipodal companions `H1…H7`. At every shared height, corresponding F/H radial vectors sum to zero.
- `TRIAD · 3×7` draws 21 distinct phase offsets `2πm/3 + 2πj/7`, with `m∈{0,1,2}` and `j∈{0,…,6}`. These are view lanes, not 21 additional arithmetic sources.
- `ℤ₃₇ · 1+18` draws all 37 residues at the active source height, grouped as fixed point `{0}` plus 18 inversion pairs `{r,−r}`. Its displayed axis runs from residue `0` to the midpoint of the adjacent seam residues `18|19`.
- The live differential registers are kept explicit: `Θ=Δθ`, `ι=b=Δz/Δθ`, and `DAO=R²+ι²`. Thus `κ=R/DAO` and `|τ|=|ι|/DAO`.

## Riemann explicit-formula lens

- The lens uses `z=log x` and assigns each sampled zero pair the phase `θₙ=γₙz`.
- The radial envelope is normalized against `√x`: `Aₙ=x^(β−1/2)`. For the frozen source values `β=1/2`, this normalized envelope equals `1`.
- The displayed conjugate-pair contribution is
  `−(x^ρ/ρ+x^ρ̄/ρ̄)`, divided by `√x`. The two displayed strands therefore use the mirror phases `θ` and `−θ`; they are not the `π`-antipodal RDMH pair and no central-axis midpoint is asserted.
- The `β−1/2` slider is a counterfactual comparison view. It never changes the source record, whose `β` remains `1/2`.
- This is one finite numerical lens on one term family in the explicit formula. It does not evaluate the complete explicit formula, establish convergence, compute new zeros, or prove RH/GRH.

## Trace / seam comparator

- `SMOOTH ζ / L-WAVE` retains the conjugate-wave view `θ ↔ −θ` for the sampled zeta pair.
- `RLLR=(+,-,-,+)` and `LRRL=(-,+,+,-)` are complementary palindromic trace words. Each has exactly two internal direction changes at zero-based positions `1` and `3`; the interface marks those changes as `TRACE KINKS`.
- These words are path witnesses, not Dirichlet characters. The adapter does not assert periodicity modulo `q`, complete multiplicativity, or vanishing on non-units.
- `−1/12 ≡ 11/12 (mod 1)` is an exact phase identity. The seam lens overlays the same point on the circle while retaining the integer lift difference `11/12−(−1/12)=1` as a history witness.
- A trace kink and a phase seam are view/combinatorial events. Neither is typed as a zeta zero, a Dirichlet-`L` zero, or a new term in the explicit formula.

## Prime residue helix

- The vertical coordinate is the ascending prime index in the frozen 168-record carrier; it is not a physical or intrinsic prime height.
- `MOD 7` assigns `θ₇(p)=2π(p mod 7)/7`. `MOD 11` assigns `θ₁₁(p)=2π(p mod 11)/11`.
- `7|11` places the same retained `PC1111:Nxxxx` record on both angle rails at the same height. Its connecting segment is a typed view crosswalk, not an antipodal RDMH rung and not a DNA/RNA bond.
- Every selection returns exactly to the retained prime integer and source address.
- This view reuses the finite carrier and residue rules of the Euler Compass. It does not embed, replace or identify itself with the separate 135-edge / 270-step Euler audit.

## Claim boundary

The adapter asserts only finite arithmetic membership, exact involution pairing, exact antipodal or conjugate-mirror geometry as separately typed, exact phase definitions, derived normalized view quantities and reversible source selection. `RN\A`, `(c)D|⁄|A`, `RDMH`, `F/H`, `TRIAD`, `Θ`, `ι` and `DAO` are view labels or explicitly defined normalized quantities. The displayed `|τ|` is not a measured physical torsion. The ζ lens is not an RH/GRH proof or a complete prime-count reconstruction. `RLLR/LRRL` are not asserted to be Dirichlet characters, and the `±1/12` seam is not a zero or singularity. The Prime Residue Helix is a declared coordinate view, not a natural prime helix, a prime generator or the Euler audit itself. The adapter does not assert RNA/DNA validation, biological control by primes, physical resonance, a Fibonacci mechanism for prime formation, or an identity between Twin Primes, `ℤ₃₇`, ζ zeros, Fibonacci and biology.

## Acceptance boundary

This file is an A0 owner-staging contract. It creates no Study, Finding, Family, Source Graph relation, publication authority or deployment instruction.
