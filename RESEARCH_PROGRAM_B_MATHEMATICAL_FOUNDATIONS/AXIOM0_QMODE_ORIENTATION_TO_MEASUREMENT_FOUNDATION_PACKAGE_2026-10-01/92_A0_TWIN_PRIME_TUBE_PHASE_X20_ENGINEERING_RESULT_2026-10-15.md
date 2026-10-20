# A0 Twin-Prime Tube / Phase / X20 Engineering Result

Date: `2026-10-15`  
Authority: `OWNER_AUTHORIZED_A0_ENGINEERING_DERIVATION`  
Identity: reuses `A0-BL-023`, `A0-BL-025` and `A0-BL-051`  
Lab status: `NOT_A_LAB_RUN / NO_STUDY_ACTIVATION`  
Publication: `NOT_AUTHORIZED`

## Question

Can the existing Zither, Pascal/Pentagon, D30, T60, MOD2501 and NCS/Q106
records support one finite test chain containing:

1. two width-two prime-centred tubes around `17` and `19`;
2. the balanced branch word `LRRL` and one static return point;
3. a `12+12 -> 20` four-identification quotient;
4. the `4:3:2:1` schedules on `C30` and `C60`;
5. the exact `41 <-> 61` width-20 CRT channel;
6. a typed `6 outside + 1 centre` graph;
7. a source-bound route to the open `X20 -> Q106` intertwiner question?

The package tests exact finite consequences and preserves undefined contracts
as `HOLD`. It does not treat a visual, equal numeral or shared cardinality as
an identity.

## Execution

```bash
node A0_BOOK/a0-pentagon-double-cover-tube-gate-tests.cjs --write
node A0_BOOK/a0-twin-prime-tube-phase-x20-tests.cjs --write
```

Baseline result:

```text
ENGINEERING_CHECK_PASS_WITH_OPEN_SELECTION_BOUNDARIES
35 / 35 PASS
```

Extension result:

```text
PASS_BOUNDED_FORMAL_WITH_NEGATIVE_CONTROLS_AND_OPEN_GATES
31 PASS / 0 FAIL / 5 HOLD
```

Runner: `A0_BOOK/a0-twin-prime-tube-phase-x20-tests.cjs`  
Machine result:
`A0_BOOK/results/a0-twin-prime-tube-phase-x20-result-2026-10-15.json`

Deterministic replay: two independent executions were byte-identical to the
written machine result.

```text
SHA-256  5ae16ed55d35be6b104e4547d680accacdc96a2f42792b6274123f78c4e0fc77
```

## Regression sweep

The complete current A0 JavaScript runner set was also executed from its
declared working directory:

```text
24 / 25 runners returned PASS
1 / 25 existing integration assertion failed
```

The failing runner is `a0-nexah-aperture-journey-tests.cjs`. Its expected
two-branch navigation label predates the added `livingBlueprintActive` return
branch in `a0-context-navigation.js`. This is a stale navigation assertion,
not a failed mathematical check.

Nine directly connected existing result/binder validators were executed for
Zither, MOD2501/CRT, Fibonacci, Euler, Joint/Return, ORION, Prime-Base,
CRT/QRT and NCS/Q106. Eight pass. The NCS/Q106 crosswalk validator reports one
source-hash mismatch for
`10 NEXAH CORE/NEXAH/APPLICATIONS/game4life_plus1/SOURCE_BINDING.json`:

```text
recorded  584cc72d8e205a4bb7ca3eb74e821d1b7d314e8a65a11e0736de5c30f4fb843c
current   9ec08a8f09d3090c68dbd2934c9345f2ebc770ca46edc370d3017b5c77f21dc3
```

The canonical Source Graph validator remains `PASS` at `269/32`. Neither
existing mismatch was auto-repaired because both touch pre-existing working
state outside this test result.

## Result A — the full Zither row exposes the twin-prime corridor

The existing affine operator extends exactly to

```text
11.5 + 4.5 = 16.0  -> 160
12.6 + 5.5 = 18.1  -> 181
13.7 + 6.5 = 20.2  -> 202
14.8 + 7.5 = 22.3  -> 223
```

with `Y_n=21n+76`. The declared lossy projection `I(x)=floor(x)` gives

```text
16, 18, 20, 22.
```

Their consecutive midpoints are

```text
17 prime, 19 prime, 21 composite.
```

Therefore the finite interval construction

```text
T17 = {16,17,18}
T19 = {18,19,20}
```

has one exact shared seam, `T17 intersect T19 = {18}`. The equal-width next
interval `{20,21,22}` is the required non-prime control. This supports a
bounded twin-prime tube fixture; it does not establish a general theorem about
twin primes or a physical tube.

## Result B — `LRRL` returns, but Return does not select it

On `C30`:

```text
LRRL: 0 -> 29 -> 0 -> 1 -> 0
signed: 0 -> -1 -> 0 -> +1 -> 0.
```

The decomposition `LR | RL` consists of two closed opposite excursions.
However, all six length-four words with two `L` and two `R` return. `LRRL` is
therefore compatible with the proposed four active seams but requires a
source or selection rule beyond endpoint Return.

## Result C — four independent identifications give twenty

For two twelve-address sets:

```text
24 - 3 identifications = 21
24 - 4 identifications = 20
24 - 5 identifications = 19.
```

Any one of five candidate anchors may remain open while the other four are
identified; all five choices yield twenty classes. Cardinality therefore does
not select the static gate.

A marked open anchor also breaks full `C5` rotation symmetry. Its stabilizer
inside `D5` has order two: identity plus one reflection. The proposed object
may be a gated/reflection-stabilized carrier, but not an unmarked `C5`-symmetric
quotient.

There is a second obstruction: a literal cycle on twelve positions has
automorphism orders `1,2,3,4,6,12`, not `5`. Consequently `D1..D12` and
`E1..E12` may be address sets or dodecahedral face carriers, but cannot be
silently treated as two `C12` rings while retaining an order-five rotation.

## Result D — phase scaling is exact; the selected prime pairs are not a lift

The normalized `4:3:2:1` partitions are exact:

```text
C30: 12, 9, 6, 3
C60: 24,18,12,6
angles: 144,108,72,36 degrees on both carriers.
```

The pairs are exact additive inverses:

```text
17 + 13 = 30
29 + 31 = 60.
```

But neither the canonical doubling map nor any affine map modulo `60` sends
the ordered pair `(17,13)` to `(29,31)`:

```text
x -> 2x mod 60 gives (34,26)
all 3600 affine maps ax+b mod 60 give zero solutions.
```

The component increments `(12,18)` occur in the `C60` schedule, while `24`
and `6` remain unaccounted. Thus the arithmetic alignment is real but no
carrier map has been established.

## Result E — `61`, the width-20 channel and decimal controls

The exact typed facts are

```text
19=p8, 29=p10, 31=p11, 41=p13, 61=p18, 71=p20
29=30-1, 31=30+1, 61=60+1
2501=41*61
61-41=20.
```

The width-20 prime pair is not unique: there are `48` prime pairs `(p,p+20)`
with `p+20 <= 1000`. The decimal reading `61 -> 6+1=7` is also not invariant:
`16` has the same decimal digit sum, while binary `61=111101` has digit sum
five. The `41/61` carrier remains a valid exact CRT example but is not selected
as the Pentagon seam by these facts alone.

## Result F — `6 outside + 1 centre` requires edges

The same seven vertices admit at least three non-identical graphs:

| Candidate | Edges | Degree sequence | Components |
|---|---:|---|---|
| `C6 disjoint K1` | 6 | `2,2,2,2,2,2,0` | `6+1` |
| `K1,6` star | 6 | `6,1,1,1,1,1,1` | connected |
| `W7` wheel | 12 | `6,3,3,3,3,3,3` | connected |

Therefore `6+1=7` is a valid count, not a graph selection.

Likewise, additive `2+3=5` and nested `C2 x C3 ~= C6` are different typed
operators. The former supplies five visible roles; the latter supplies six
product states. A `1+1` phase channel requires an explicit orientation bit,
because signed `-1/+1` labels collapse modulo two if the sign is discarded.

## Result G — D/E phase laws remain distinguishable but unselected

Three candidate sheet traces all return after four events:

```text
independent: 0 0 0 0 0
gate-only:   0 1 1 1 0
every-step:  0 1 0 1 0
```

Their intermediate histories differ. Endpoint Return cannot choose among
them. The existing `C5 x C2 x C30` display contains `300` addresses; an
independent `X20 x C30` product would contain `600`. These are bookkeeping
counts, not admitted coupling laws.

## Result H — X20/Q106 remains correctly blocked

The canonical Navigator binder still records

```text
x20_edge_set = null
typed_x20_to_q106_intertwiner = null
```

while the target Q106 interface has twenty nodes and twenty undirected
internal edges. The proposed `24 -> 20` quotient supplies a cardinality and a
candidate seam grammar, but not the missing X20 edge set. The intertwiner test
therefore remains `HOLD`, not negative.

## Open gates

| Gate | Status | Required input |
|---|---|---|
| D/E-to-phase coupling | `HOLD` | independent semantics or preregistered selection rule |
| X20-to-Q106 intertwiner | `HOLD` | source X20 adjacency and typed edge semantics |
| D12/E12 geometric realization | `HOLD` | face/address bijection, incidence table and orientation rule |
| external usefulness | `HOLD` | frozen task, comparator, metrics and STOP threshold |
| privileged `61` or `41/61` seam | `HOLD` | selection rule beating prime-gap and digit-sum comparison classes |

## Disposition

The finite twin-prime tube fixture, LRRL phase return, four-identification
`24 -> 20` count, C30/C60 schedule and CRT width-20 channel are internally
consistent when kept typed. The same run rejects simple doubling and every
affine `C30 -> C60` explanation of the selected prime pairs, demonstrates
that LRRL and the static gate are not uniquely selected by Return/cardinality,
and confirms that the X20 adjacency contract is still absent.

This result extends existing A0 engineering evidence. It creates no new
Navigator identity or relation, activates no Lab Study, changes no canonical
count and authorizes no physical, novelty, Riemann/Ihara, E8, geometric or
publication claim.
