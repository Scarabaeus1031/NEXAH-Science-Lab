# NEXAH Vendessimal Prime Grid & Trail — forensic preregistration

Date: `2026-09-28`

Status: `FORENSIC_PROTOCOL_FROZEN_BEFORE_NEW_COMPUTATION`

## Scope and exposure state

This is a reconstruction and falsification audit of an already exposed visual
family. It is not a blind discovery experiment. At lock time the supplied
visuals and the local `vendessimal_prime_toolkit.py` / readmes had been read.
The following static code observations were therefore already known:

- the display is 20 columns wide;
- the color index is `29*(n mod 19) + (n mod 29)`;
- the source defines Euler-41 as `n^2+n+41`;
- the default rail tolerance is `tau=0.55`, while its circular distance is at
  most `0.5`;
- the CLI contains a suspicious `argparse.Namespace` subscript expression.

No numerical outputs from the tests below were computed before this protocol
was frozen. Static findings known at lock are not eligible as confirmatory
discoveries; they are checked for exact reproducibility.

## Frozen source

Primary source family:

`SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/CIKADA 3301 LATER MARKER CORPUS/.../Breathing_Crystal_Package_v0_3/`

Files bound by SHA-256 in the execution result:

- `vendessimal_prime_toolkit.py`
- `vendessimal_readme.md`
- `README_EXTENDED.md`

## Frozen population and definitions

- integer field: `1 <= n <= 3000`
- primary grid widths: `w in {19,20,21}`
- display coordinate: `row=(n-1)//w`, `col=(n-1)%w`
- primality: deterministic trial division
- twin membership: `p` belongs to a pair iff `p` and `p-2` or `p+2` are prime
- Euler polynomial: `E_c(k)=k^2+k+c`, `k>=0`
- tested constants: `13,41,137,241,367,487,617,751,883,1031,1171,1303,1459`
- prime-index lane `r`: `L_r(j)=p_(r+20j)`, one-based prime index

## Tests

### T1 — source reconstruction and executability

Independently reconstruct the residue field, twin set, Euler-41 values and
grid coordinates. Invoke the registered CLI with default arguments in a
temporary output directory. Report `EXECUTABLE` only on exit code zero and a
nonempty output image. Source files themselves are not modified.

### T2 — rail selectivity and tolerance controls

Reimplement the exact registered rail formula. For `tau` in
`{0.05,0.10,0.25,0.50,0.55}`, report selected-cell fraction. The registered
default is selective only if its fraction is strictly below `1.0`. A full
field at the default is `DEGENERATE_FULL_SUPPORT`.

### T3 — triad-definition consistency

The implemented centers `(3,10,17)` are compared with the readme ratios
`(0.429,0.456,0.487)` under both normalizations `c/19` and `(c+0.5)/20`.
Consistency requires a one-to-one maximum absolute error <= `0.025` without
reordering or tuning. Separately report the support induced by Gaussian
`sigma=2.4`; this overlay is descriptive, not evidence of resonance.

### T4 — Euler-41 and constant-family specificity

For every frozen `c`, count the initial consecutive prime run of `E_c(k)`
starting at `k=0`, and the number of prime values before the polynomial first
exceeds 3000. Verify exactly that `E_41(k)` is prime for `k=0..39` and
`E_41(40)=41^2` is composite. The plotted family is classified
`VERTICAL_TRANSLATIONS` because `E_c(k)-E_d(k)=c-d` identically; visual
parallelism is not independent evidence.

### T5 — prime-index ladder identity

Generate primes and verify the supplied `+13` ladder against
`p_(13+20j)`. Report every mismatch. Specifically test the exposed terminal
`1459` against the expected index-233 value. Also verify the `+10` prefix
against `p_(10+20j)`. Passing establishes only a prime-index residue lane.

### T6 — width sensitivity of prime/twin patterns

For widths 19, 20 and 21, compute prime and twin-member counts by column,
Pearson dispersion `sum((x-mean)^2/mean)` and normalized Shannon entropy.
If the pattern changes with width, classify it as representation-dependent.
No p-value is interpreted because modular exclusions violate an iid-uniform
cell null.

### T7 — 1061–1064 micro-window

Verify primality/factorization exactly. Scan all `p<=3000` such that `p` and
`p+2` are prime and record the intervening composite `p+1`. Report how many
twin windows exist and whether “prime–composite–prime” is unique. Also scan
endpoints divisible by `2^3*7*19`; the factor-aligned claim is descriptive and
cannot by itself establish a threshold mechanism.

### T8 — geometric trail provenance boundary

Search the admitted local CIKADA marker corpus for executable/text source
containing the exact labels `Euler-Free Paths`, `12 x 1008`, `Zodiac Trail`,
or `Euler-Lattice Seeds with 7-Arc`. A visual is `RECONSTRUCTIBLE` only if a
generator or complete coordinate/data contract is found. Image-only evidence
is `VISUAL_ONLY_UNVERIFIED`. Static 2D/3D images cannot establish motion,
stationarity or a dynamically fixed center.

## Decision rule

The package may be classified:

- `VALIDATED_REPRESENTATION_TOOL` if T1 executes, T2 is selective, T3 is
  consistent and the represented arithmetic is exact;
- `PARTIALLY_RECONSTRUCTED_WITH_REPRESENTATION_ARTIFACTS` if arithmetic
  overlays are reproducible but one or more rail/triad/executability or width
  controls fail;
- `INVALID` if core arithmetic data cannot be reconstructed.

No result establishes new prime theory, a prime generator, physical
resonance, cosmic/zodiac causation, navigation, or a dynamical Möbius field.

## Reproducibility

Primary and clean replay run in separate directories from the locked script.
The canonical scientific JSON is serialized with sorted keys and compact
separators. Its SHA-256 must match exactly.
