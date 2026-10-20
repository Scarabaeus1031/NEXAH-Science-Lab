# Check 91 — Pentagon Double-Cover / Tube-Gate Engineering Test Package

Date: `2026-10-15`  
Status: `ENGINEERING TEST PACKAGE / NOT A LAB STUDY`  
Identity: reuses `A0`, `SCC-003`, `PENT-01..07`, `C5`, `D5` and the existing `C30` phase view  
New Navigator identity or relation: `NO`

## 1. Purpose

This package tests the Owner's two-sided pentagon/tube proposal without promoting it into a Lab, a new `PENT-08`, a geometric tiling result or a physical mechanism.

> Can one pentagonal cycle be lifted to a connected two-sheet carrier with two explicit gate edges, a one-bit exact Return, a separately typed phase coordinate and a measurable non-backtracking cycle change?

The package is a deterministic finite engineering check inside the existing A0 workspace. A later Lab decision would require a stable candidate, an external usefulness question and a separate Owner action.

## 2. Notation correction

The current Pascal explorer uses the standard `D5` presentation:

```text
r^5 = e
m^2 = e
m r m = r^-1
```

Here `e` is the identity map, not Euler, and `m` is reflection, not full Return. Therefore `r^5` and `r^6` cannot be new states of the existing `C5` action: `r^5=e` and `r^6=r`.

## 3. Declared finite model

```text
base position         k in Z5
sheet                 epsilon in Z2
lifted state          (k,epsilon), 10 states
projection            pi(k,epsilon)=k
```

The lifted step `t` advances one position and toggles the sheet at the `4 -> 0` seam. Consequently:

```text
t^5  = tau       side/deck switch
tau^2 = e
t^10 = e         full lifted Return
```

The two lifted copies of the toggling seam are the two tube gates. Removing both must split the carrier into two five-vertex paths. The lifted mirror `mu(s)=-s mod 10` remains distinct from the deck switch and satisfies `mu^2=e`, `mu t mu=t^-1`.

The two sheets receive the explicit view aliases

```text
sheet 0: D1 D2 D3 D4 D5
sheet 1: E1 E2 E3 E4 E5
tau: Di <-> Ei
```

The connected route is `D1 -> ... -> D5 -> E1 -> ... -> E5 -> D1`; its two
cross-sheet gates are therefore `D5-E1` and `E5-D1`. `E1..E5` is a local
engineering-view alias, not a new canonical register family.

### 3.1 The five `20` anchors and the ten-spoke umbrella

The existing PENT carrier contains exactly five middle coefficients at

```text
(face,n,k) = (f,6,3),  f=0,...,4
C(6,3)=20.
```

They are the midpoints of the five exterior pentagon sides. Consequently they
form a second regular pentagon, rotated by `36 degrees` and scaled in radius
by `cos(pi/5)=phi/2`. They are one exact `C5` orbit.

Lifting every `20` anchor to two sheets produces ten addressed rim positions:

```text
5 twenty-anchors x 2 sheets = 10 rim addresses = 10 spokes.
```

There are two distinct umbrella topologies:

1. **Shared hub:** one centre plus the `C10` rim gives eleven vertices, ten
   rim edges and ten spokes. The centre has degree ten. This matches one
   visible umbrella handle, but the projection is branched at the hub.
2. **Doubled hub:** two centre copies plus the `C10` rim give twelve vertices,
   ten rim edges and ten spokes. Each hub has degree five. This is the genuine
   unbranched two-fold graph cover of the five-spoke base wheel.

The screenshot visually favors a shared hub; the current source mathematics
does not yet select between these topologies.

The existing `C30` phase address remains independent. A constant phase increment `delta` may be tested, but it must be declared. Spatial closure after ten lifted steps does not automatically imply phase closure.

## 4. Test matrix

| Family | Checks | Decides |
|---|---:|---|
| Group/core | `G-01..G-05` | `C5`, `D5`, lifted `C10`, projection and lifted reflection laws |
| Return | `R-01` | every projection fibre has size two; one side bit is minimal |
| Sheet registers | `S-01..S-02` | paired `D1..D5` / `E1..E5` view and the two cross-bank gates |
| Aperture/gates | `A-01..A-04` | two gates, connectedness, cut behavior and complete 32-case voltage null |
| Umbrella | `U-01..U-06` | five `20` anchors, regular midpoint pentagon, ten spokes and shared/doubled-hub control |
| Cross-carrier | `C-01..C-04` | `12+12=24` dodecahedral faces versus the exact Blue Body `48=2x24` vertex count |
| Number ladder | `N-01..N-02` | existing `12/13 -> 24/25` doubling step and typed `23/24/25` arithmetic window |
| Ihara/Hashimoto | `I-01..I-03` | primitive non-backtracking cycle moves from length five to length ten |
| Euler | `E-01` | graph Euler characteristic remains `V-E=0` |
| Metric | `M-01..M-02` | exact pentagon `phi` versus Fibonacci approximation schedule |
| Phase | `P-01..P-05` | D30 independence, signed L/R law, closure candidates and 150-to-300 display lift |

## 5. Controls

`C5 disjoint-union C5` has ten states and a side bit but no tube. It must keep the length-five non-backtracking signature. All `2^5=32` binary voltage assignments on the base edges are enumerated: odd parity produces a connected double cover; even parity produces two components. Therefore graph topology alone cannot select a unique visible gate location.

All thirty constant increments on `C30` are also enumerated. Ten-step closure is compatible with
`delta in {0,3,6,9,12,15,18,21,24,27}`. `delta=3` is the smallest positive candidate but is not uniquely selected. The existing unit `L/R` view remains separate: ten `R` steps end at phase `10`, not `0`.

## 6. Ihara/Hashimoto decision

```text
base C5:                tr(B^5)=10
connected C10 lift:    tr(B^5)=0, tr(B^10)=20
disconnected control:  tr(B^5)=20
```

The primitive five-cycle returns only after the second sheet in the connected lift. This is a finite graph-zeta statement only; it is not a Riemann-zeta identity.

## 7. Euler, phi and Fibonacci roles

- Euler graph characteristic checks carrier bookkeeping: both cycles have `V-E=0`.
- The regular-pentagon diagonal/side ratio is exactly `2 cos(pi/5)=phi`.
- Fibonacci ratios approximate `phi`; they neither generate nor select the double cover.
- Any Fibonacci weighting of gates or phases remains an undeclared future comparator.

## 8. Execution

```bash
node A0_BOOK/a0-pentagon-double-cover-tube-gate-tests.cjs --write
```

Machine contract: `A0_BOOK/assets/a0-pentagon-double-cover-tube-gate-test-package-v1.json`  
Result: `A0_BOOK/results/a0-pentagon-double-cover-tube-gate-result-2026-10-15.json`

## 9. Executed engineering result

```text
ENGINEERING_CHECK_PASS_WITH_OPEN_SELECTION_BOUNDARIES
35 / 35 checks PASS
```

Established on the declared finite carriers:

1. `t^5=tau` changes sheet and `t^10=e` returns exactly;
2. the quotient to `C5` has fibres of size two, so one side bit is necessary
   and sufficient for exact source Return;
3. the side bit supports the paired view `D1..D5 / E1..E5`, and the connected
   route exposes exactly the gates `D5-E1` and `E5-D1`;
4. the connected lift has exactly two cross-sheet gate edges;
5. removing those gates produces two five-vertex paths;
6. the primitive non-backtracking signature moves from length five to length
   ten;
7. the disconnected two-sheet control retains length-five cycles;
8. all sixteen odd-parity voltage assignments are connected, so the abstract
   graph does not select a unique gate position;
9. ten D30 increments close after ten spatial steps, so the phase increment
   is not selected by closure alone.
10. the five `20=C(6,3)` anchors form an exact regular midpoint pentagon;
11. their two-sheet lift produces ten addressed spoke endpoints;
12. shared-hub and doubled-hub umbrellas both have ten spokes but are
    distinguished by degree sequence and Hashimoto traces.
13. two dodecahedra supply exactly `12+12=24` pentagonal faces;
14. the Blue Body supplies `48=3x16=6x8=2x24` vertices, while its face vector
    remains `O2-P16-H8` — therefore the common `24` is a cardinality junction,
    not a carrier identity;
15. the independently established A0 ladder already contains
    `12/13 -> 24/25`, with `12=2^2*3`, `24=2^3*3`, `23` prime and `25=5^2`.
16. the frozen D30 law remains `p=2k-n mod30`, with `L:-1` and `R:+1`;
17. adjoining the D/E sheet to `C5_D x C30_P` doubles the display carrier from
    `150` to `300`, but does not select whether phase drives, follows or is
    independent of the sheet switch.

Disposition: the two-sided Return construction is algebraically and
graph-theoretically viable. Gate placement, phase law, geometric realization
and external usefulness remain open selection problems.

## 10. STOP and claim boundary

STOP if an interpretation calls `m` the full Return, drops the sheet residual, infers an undeclared phase update, identifies Ihara with Riemann or Fibonacci with `phi`, promotes the graph cover into a physical tube or new tiling family, or creates a new Study, Lab, `PENT-08`, Navigator identity or publication status.

This package can establish finite algebraic and graph-theoretic reliability. It cannot establish novelty, physical meaning, geometric realizability or external usefulness.

