# Final report — NEXAH Vendessimal Prime Grid & Trail forensic audit

Date: `2026-09-28`

Overall classification: `PARTIALLY_RECONSTRUCTED_WITH_REPRESENTATION_ARTIFACTS`

Lab disposition: `CLOSED_BOUNDED / FILED / NO_ACTIVATION`

## Reproducibility

- preregistration SHA-256:
  `78de8f0ec78b2e919deea1275184099694a653898540353ac60208264bc45ed8`
- primary scientific-result hash:
  `88ccaf1fd8f9e64a5ad4cd0d0e22adb232abe8ab0f175ad2f48c502cb2fd0c87`
- replay scientific-result hash:
  `88ccaf1fd8f9e64a5ad4cd0d0e22adb232abe8ab0f175ad2f48c502cb2fd0c87`
- byte comparison: `IDENTICAL`

The file SHA-256 of each canonical JSON (including its trailing newline) is
`4c69fe89ff07119f5db87a8214b422fc359db58f0a7365ba00c9f3ae2f0f19b5`.

## Results

### T1 — source and CLI

The arithmetic definitions can be independently reconstructed. The documented
CLI did not execute in the frozen environment because `numpy` was absent; the
bundled runtime also lacked `matplotlib`. Static inspection additionally finds
a latent source error after dependency loading: `argparse.Namespace` is
subscripted as `args["mod-pair"]`. The existing PNGs therefore remain preserved
outputs, but the documented one-command reproduction is not currently valid.

### T2 — square-root rails

The exact registered formula selected these fractions of the 3000-cell field:

| tau | selected fraction |
|---:|---:|
| 0.05 | 0.347333333333 |
| 0.10 | 0.606000000000 |
| 0.25 | 0.933000000000 |
| 0.50 | 1.000000000000 |
| 0.55 (registered default) | 1.000000000000 |

Result: `DEGENERATE_FULL_SUPPORT`. Because the circular distance is at most
0.5, `tau=0.55` cannot distinguish a rail from a non-rail. The default overlay
does not provide evidence of a special square-root trajectory.

### T3 — triad bands

The implemented column centers are `(3,10,17)`. Their normalized locations are
approximately `(0.158,0.526,0.895)` under `c/19`, or
`(0.175,0.525,0.875)` under column-midpoint normalization. Neither matches the
readme ratios `(0.429,0.456,0.487)` within the frozen tolerance.

Result: `UNBOUND_SYMBOLIC_OVERLAY`. The bands are authored display windows;
the package contains no mathematical map binding them to the stated ratios or
to transition probability.

### T4 — Euler-41 and the constant family

`n^2+n+41` is prime for `n=0..39`; at `n=40` it equals `41^2=1681` and is
composite. This familiar finite Euler property is exactly reproduced.

The other displayed curves have the common form `n^2+n+c`. They are exact
vertical translations, since `E_c(n)-E_d(n)=c-d`. Only `c=41` has the 40-value
initial prime run. Most supplied constants fail at `n=1`; `137`, `617` and
`1031` have initial runs of length 2. Parallel plotted curves are therefore a
formula consequence, not independent coupling evidence.

### T5 — prime-index ladders

The `+10` sequence is exactly `p_(10+20j)` for its supplied prefix. The `+13`
sequence is exactly `p_(13+20j)` through 1303. Its next term at prime index 233
is **1471**, not **1459**. The number 1459 is prime but occupies index 232.

Result: the ladders are valid prime-index residue lanes in a 20-wide table,
with one exposed terminal misassignment. They are not distinct Euler
functions, and value, prime index and grid column must remain separate.

### T6 — representation control

The column pattern changes strongly with grid width:

| width | prime dispersion | prime entropy | twin dispersion | twin entropy |
|---:|---:|---:|---:|---:|
| 19 | 23.7907 | 0.9842 | 15.4286 | 0.9793 |
| 20 | 637.9070 | 0.7014 | 279.3727 | 0.6844 |
| 21 | 318.0884 | 0.8226 | 170.4348 | 0.7767 |

The dramatic 20-column striping largely reflects parity and divisibility in
the chosen coordinate system. Width 19 is much more even; width 21 introduces
its own modular exclusions. Result: `REPRESENTATION_DEPENDENT`.

### T7 — 1061–1064

The local arithmetic is correct:

- 1061 prime;
- 1062 = `2 * 3^2 * 59`;
- 1063 prime;
- 1064 = `2^3 * 7 * 19`.

But there are 81 twin-prime windows up to 3000, each necessarily having an
even composite between the two odd primes (apart from the irrelevant lowest
edge case structure). Thus prime–composite–prime is not unique. Within the
frozen scan, this is the only twin window whose `p+3` endpoint is divisible by
1064; that uniqueness follows from the specifically selected factor-aligned
endpoint and is descriptive, not evidence of a threshold mechanism.

### T8 — Zodiac, Euler-free and 7-Arc visuals

No executable or complete textual generator was found in the admitted local
CIKADA marker corpus for the exact labels `Euler-Free Paths`, `12 x 1008`,
`Zodiac Trail`, or `Euler-Lattice Seeds with 7-Arc`.

Result: `VISUAL_ONLY_UNVERIFIED`. The images are useful provenance and pattern
prompts, but their point-selection rule, “Euler-free” predicate, 1008 count,
7-arc construction and motion model cannot be independently reconstructed
from the current bound sources. A static 2D/3D projection also cannot establish
that a center is dynamically stationary while a grid moves.

## What is retained

1. A valid, reproducible finite 20-column representation of integers,
   residues, primes, twin-prime membership and Euler-41 values.
2. Exact prime-index lanes `p_(r+20j)`, with the 1459/1471 correction.
3. The correct local arithmetic of 1061–1064.
4. The visuals as historical/research representations and hypothesis sources.

## What is not established

- selective square-root rails under the registered default;
- a mathematical binding of triad bands to 0.429/0.456/0.487;
- width-invariant prime geometry;
- a unique 1061–1064 threshold mechanism;
- a new Euler-function family or new prime theory;
- reconstructible Zodiac/1008/7-Arc dynamics;
- physical, astronomical, resonant, navigational or causal meaning.

## Closeout

No Core, ORION, product, capability, scientific-contribution or public claim is
activated. A successor is justified only if the missing geometric generator
and complete coordinate contract are supplied, or if a repaired source package
is preregistered for a new representation-invariance test.

