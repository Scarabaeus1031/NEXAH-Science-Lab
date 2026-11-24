# A0 Primecube Control Plane — Controls and UI

Date: 2026-11-23  
Scope: steps 7–9 of the bounded Primecube Control Plane experiment  
Identity reuse: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`, `ART:A0:MATHEMATICAL_JOINTS`, `MOD:NUMBER_VIEW_SUITE`, `MOD:TESSAREC`, `NEXAH_A0_ORIENTATION_CONTROLLER_BENCH`

## Outcome

The Splinter Sail carrier now has an executable C6/D6 control panel inside the existing Prime Cube page. It exposes the 840-step joint return, the forward and reverse T20 adapters, the transferred fold, the MZ24 readout and the typed line inspector without merging their identities.

The positive result is an exact finite D6 action:

- `R^6 = id`
- `F^2 = id`
- `F R F = R^-1`
- C6 rotation chamber: `π/3 = 60°`
- D6 reflection chamber: `π/6 = 30°`

The `π/6` chamber comes from adjoining the fold reflection to the six-step rotation. It is not an MZ24 phase law and it does not establish a physical `1/S^1` mechanism.

## Step 7 — Exhaustive controls

### Relabeling control

All `6! = 720` linear anchor orders were tested. Forty-eight satisfy the transferred fold relation. Factoring the twelve dihedral presentations per cycle leaves four cyclic classes.

Result: the retained order `[1, 8, 11, 22, 27, 33]` is compatible, but the D6 relation alone does not derive it uniquely. Its selection remains supplied by the retained 2×3 Splinter chassis.

### Generator control

The unit group modulo 1001 contains 720 units and 56 elements of exact order 6. Inside the retained T20 orbit, only strides 10 and 50 have order 6:

- forward: `T20^10 = 771 (mod 1001)`
- reverse: `T20^50 = 309 (mod 1001)`

Result: the two T20 orientations are exact and source-specific, but not the only C6 embeddings in the full CRT unit group.

### Phase control

All 56 order-six generators were tested against the retained MZ24 readout. Only generators 430 and 859 give a uniform result, and both are degenerate: every state stays at tick 2, so the increment is zero. No generator yields a nonzero uniform MZ24 phase step.

The constructed index control `[0, 4, 8, 12, 16, 20]` closes with constant increment 4. It proves that the test can detect a uniform phase when one is deliberately supplied; it is not an MZ24 finding.

Result: `:φ` fails as a global MZ24 phase edge for this experiment.

## Step 8 — Typed glyph decision

| Token | Local role | Decision |
|---|---|---|
| `.:SOURCE` | addressed source point | bound |
| `:` | open typed joint, no edge selected | bound default |
| `:Q+` | `q' = 771q mod 1001` | bound local syntax |
| `:Q−` | `q' = 309q mod 1001` | bound local syntax |
| `:φ` | uniform phase edge | HOLD / rejected for MZ24 |
| `€` | exchange-value view | Owner candidate, unbound |
| `¢` | unassigned glyph port | unbound / HOLD |

These labels are local display syntax. They do not redefine punctuation globally and do not promote `€` or `¢` to mathematical operators.

## Step 9 — Prime Cube interface

The existing `A0_PRIMECUBE_GAP_FOLD_LAB.html` now contains a `C6 / D6 ADAPTER · SPLINTER ↔ T20¹⁰` section with:

- a stepwise and playable 840-return console;
- Q60, LOKI56, Fold2 and MZ24 registers;
- a six-state C6/D6 ring with the `8↔27` fold axis;
- forward `:Q+` and reverse `:Q−` direction controls;
- a fold toggle and typed line inspector;
- visible exhaustive-control counts and claim boundaries.

The interface and model tests pass. Browser visual QA could not be performed because the available in-app browser blocks local `file:` URLs by security policy; no alternate browser or protocol workaround was used. This is a visual-QA limitation, not a model-test failure.

## Claim boundary

This is a bounded exact engineering/formal-design fixture. It establishes no new canonical identity, Source Graph relation, physical carrier, natural clock, causal phase line, energy channel, String-Theory correspondence, Study, Finding or publication state.

Navigator delta: zero identities, zero relations, zero status changes.

## Step 10 — 720/840 window control

The order of the full unit group modulo 1001 supplies a second exact window:

`720 = φ(1001)`, while the independent product return remains `840 = lcm(60,56,2)`.

At every 720-step boundary, Q60, Fold2 and the C8 orientation return. LOKI's C7 station moves backward by one because `720 ≡ 48 ≡ −8 (mod 56)`. The complete station trace is `0,6,5,4,3,2,1,0`, and the two windows reunite at `7·720 = 6·840 = 5040`.

The UI now exposes this eight-node trace, including the arithmetic controls `840−120=720` and `840+600=1440`. The equality `8=2³` is retained only as a typed numeric Cube crosswalk; the recurrence is derived from modular periods, not cube geometry.

## Steps 11–12 — C24 and exact length adapters

The constructed index refinement embeds C6, C8 and the twelve D6 operations into C24:

- C6: `0,4,8,12,16,20`;
- C8: `0,3,6,9,12,15,18,21`;
- D12: every even tick;
- C8∩D12: `0,6,12,18`.

It also retains the exact cross proportion `90/60 = 84/56 = 3/2` and `60·84 = 90·56 = 5040`, with `84=6·7·2`. The constructed C6 ticks match none of the six observed MZ24 ticks. C24 is therefore a valid common index refinement, but it is not the retained MZ24 encoding.

The independent length adapter uses the exact definition `1 inch = 2.54 cm = 127/50 cm`. One integer tick is `0.2 mm`, so one centimeter is 50 ticks and one inch is 127 ticks. The 10-inch and 12-inch fixtures become exactly `25.40 cm / 1270 ticks` and `30.48 cm / 1524 ticks`; their ratio remains `5:6`. The exact unit-lattice return is `50 inch = 127 cm = 6350 ticks`.

## Step 13 — Origami Splinter integer-label transport

The existing Origami Splinter demonstrator is now source-linked to a typed adapter on the retained Prime Cube 2×3 chassis. It is not embedded as a second implementation and its identity is not merged with Prime Cube.

Applying the column vector `[-1,+1,-1]` to both rows gives:

- top: `[1,8,11] → [0,9,10]`;
- bottom: `[33,27,22] → [32,28,21]`;
- fixed axis: `8↔27 → 9↔28`;
- outer pairs: `1↔11 → 0↔10` and `33↔22 → 32↔21`.

The vertical differences remain `[32,19,11]` because both members of each column receive the same delta. The fold pairing remains symmetric because the two outer columns receive the same delta. The six transported labels remain distinct.

This wandering transform is not conservative: the top sum changes `20→19`, the bottom sum `82→81`, and the total `102→100`. The visual intuition that “the 1 wanders” is therefore useful, but the exact operation loses one unit per row.

The zero-sum control `[-1,+2,-1]` preserves both row sums and the total `102`. It also produces top row `[0,10,10]`, so two addresses collide. It is therefore retained as an explicit negative control: conservation alone is insufficient for an injective six-anchor relabeling.

Boundary: the transported numbers are integer display labels. In particular `[0,9,10,32,28,21]` contains no prime anchors. The adapter establishes neither physical motion nor a new Prime carrier, Study, Finding, Navigator identity or typed relation.

## Step 14 — Zirkel split / view / return control

Eight Human Owner visuals are hash-bound as source witnesses. Together they expose a `7+1+3` role field: outer structure addresses `1–7`, pivot `8`, and the three ports `9/10/11`. The activated source visual draws `8→10` and `8→11`; port `9` is visible but unconnected. The Prime Cube comparator adds `8↔9` only as an explicitly declared local polarity control, not as a recovered source edge.

The ports are typed separately:

- `9`: polarity involution `δ↔−δ`, with exact return after two applications;
- `10`: externally sourced zero-containment strip view `1/12≤Re(s)≤11/12`; exact source return requires a retained source receipt;
- `11`: separate Tao/Wal boundary role; it is not an endpoint of the strip merely because its address is `11`.

The `8→10` strip has midpoint `1/2`, total width `5/6`, and half-width `5/12`. It must not be confused with an offset `δ=1/12` from the critical line: `1/2±1/12` gives `5/12` and `7/12`, not `1/12` and `11/12`.

Three separate critical-line offset probes are compared at `x=1000`: `δ=1/11`, `δ=1/12`, and the arbitrary denominator control `δ=1/10`. Every symmetric pair `β±=1/2±δ` has midpoint `1/2`, and the normalized envelopes satisfy `x^δ·x^−δ=1`. This exact mirror law therefore does not distinguish `1/11` from the two controls. The earlier phase seam `−1/12≡11/12 (mod 1)` also remains a separate comparator and is not assigned to port `11`.

The source visuals do not establish equal spacing or a cyclic operator on eleven states. A regular `C11` carrier and phase step `2π/11` remain on HOLD. Separately, the arithmetic labels were checked: `1031` and `1033` are twin primes, but their midpoint is `1032`, not the source-visual center label `1034`.

Navigator effect remains zero identities, zero relations and zero aliases. The visual terms “resonance”, “Black Line”, “Tao” and “Wal” remain source roles and are not promoted to physical or zeta mechanisms.

The attached Basel/Alpha–Beta extension adds a finite coprime-pair grid control for `1/zeta(2)=6/pi^2`, the exact scaling crosswalk `pi^2=6*zeta(2)`, the local split `5/12 | 1/2 | 7/12`, and the non-numeric Owner glyph cuts `73/37 = (p4,p2)/(p2,p4)`. These are four typed registers, not one shared mechanism. The extension reuses the same two identities and creates no Study, Finding, canonical ID or relation.

The Scarab/T11/Shadow extension then isolates `T11(n)=n+11` as the exact shared address operator. It binds `17->28`, the three 90-step Scarab lifts and the `1106->1117` carrier-to-Shadow crossing as separate fixtures. The Owner butterfly contributes the local layer-eight patch, exact row step `1031->1042`, and factor witness `1036=4*259=28*37`. Plus-ten and plus-twelve are explicit failed column-return controls. Scarab, Butterfly, Splinter and Shadow source roles remain non-identical.

The Center-13 / 5040 extension adds a further bounded comparator: `12+1+12=25` is the position count, while `12+13+12=37=p12` is a weighted sum. `12^3+1^3=10^3+9^3=1729=7*13*19` supplies the cubic `+1` return outside the retained cube envelope. The symmetric return neighborhood is `5039|5040|5041 = 7!-1|7!|7!+1`, typed as prime `p675`, factorial return with 60 divisors, and `71^2`. A separate Base-10 cut exposes `39=3*13`, `40=2^3*5`, and `41=p13`; it is not factorization of the four-digit numbers. The negative control `5040 mod 13=9` prevents a false central 13-factor claim. No Study, Finding, identity or relation is added.

The same extension now exposes the exact conserved transfer `(3564,1476)->(3565,1475)` under `(+1,-1)`. Both pairs sum to 5040, while their greatest common divisor changes from 36 to 5. The calendar panel compares the exact residues `364=52*7`, `365=52*7+1`, `366=52*7+2`, the clock identity `10080 minutes=2*5040`, the bounded Julian 28-year comparator and the exact 400-year Gregorian return `146097 days=20871 weeks`. Historical Egyptian, Alexandrian and Maya calendar roles remain separate, and the springing-one reading is classified as analogy rather than derivation.

The `1024->1025` quantization seam is now a separate four-register receipt inside the same lens. The address law is `1025=1024+1=2^10+1`; the exact factorization is `1025=5^2*41=5^2*p13`; and the address sits asymmetrically in the prime gap `1021+4=1025=1031-6`, one step below midpoint 1026. The Owner screenshot string `0.002499999999979167` is retained verbatim while the declared 1/1200 raster comparator normalizes it to `3/1200=1/400=0.0025`. The floating tail is not treated as extra precision. The screenshot is an Owner witness rather than a canonical dataset, and no physical amplitude, Mandelbrot invariant, new identity or relation is inferred.

