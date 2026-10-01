# ORION Invariant Ledger

Status: `CALIBRATION LEDGER / CANDIDATES SEPARATED FROM ESTABLISHED INVARIANTS`

## Admission rule

An entry is an invariant only when all of the following are named:

1. object/domain `X`;
2. transformation class `T`;
3. quantity or relation `I`;
4. equality or comparison rule;
5. domain/failure conditions;
6. evidence establishing `I(Tx)=I(x)`.

The words “same structure,” “one field,” “memory,” “closure,” “gate,” or
“orientation” are not invariant definitions.

## A. Established Level-0 invariants in Z_365

| ID | Object | Transformation | Invariant | Scope | Evidence/status |
| --- | --- | --- | --- | --- | --- |
| ORI-INV-001 | `k in Z_365` | `T_64(k)=64k mod 365` | gcd/divisibility class relative to 365 | All 365 states | Exact because 64 is a unit; `PROVED`. |
| ORI-INV-002 | `k in Z_365` | `T_64` | CRT zero/nonzero component class in `Z_5 x Z_73` | All states | Exact componentwise unit action; `PROVED`. |
| ORI-INV-003 | `k in Z_365` | repeated `T_64` | membership in the same generated orbit | All states | Definition of orbit under an invertible map; `PROVED`. |
| ORI-INV-004 | an orbit of `T_64` | change of starting point within the same orbit | orbit length | All 75 orbits | Exact finite enumeration; `PROVED`. |
| ORI-INV-005 | `k` represented on unit circle | `T_64` followed by circle embedding | radius `|z_k|=1` | Chosen embedding only | Exact property of the representation; `PROVED`, but representation-specific. |
| ORI-INV-006 | any state | six applications of `T_64` | return identity `T_64^6(k)=k` | All states; individual minimal periods may divide 6 | Exact modular order; `PROVED`. |
| ORI-INV-007 | five-axis subset `A5` | `T_64` or modular Janus reflection | equality of actions on `A5` | Restricted subset only | `64=-1 mod 5`; `PROVED`. |

Important boundary: `T_64=J` is **not** a global invariant or identity on
`Z_365`. It is a restricted equality of actions on `A5`.

## B. Established arithmetic invariants/identities

| ID | Object | Transformation/comparison | Preserved relation | Scope | Evidence/status |
| --- | --- | --- | --- | --- | --- |
| ORI-INV-008 | `10^m-1`, `10^n-1` | pair of positive exponents | `gcd(10^m-1,10^n-1)=10^gcd(m,n)-1` | Positive integers `m,n` | Standard identity; `PROVED`, not NEXAH-specific. |
| ORI-INV-009 | `10^m+1`, `10^n+1` | pair reduced by `d=gcd(m,n)` | gcd equals `10^d+1` only when both reduced exponents are odd, else 1 | Base 10, positive exponents | Standard parity-gated identity; `PROVED`, not NEXAH-specific. |

These are calibration truths, not discoveries created by the boards.

## C. Exact relations that are not invariants

| Relation | Correct classification |
| --- | --- |
| `365=5*73` | Factorization. |
| `Z_365 ~= Z_5 x Z_73` | Ring isomorphism supplied by CRT. |
| `ord_365(64)=6` | Operator property. |
| `64^(-1)=154 mod 365` | Inverse relation. |
| `33` and `4774` have gcd 11 | Exact arithmetic coincidence with limited scope. |
| `4774=29 mod 365` and `T_64(29)=31` | Exact connector calculation, not a proved invariant. |
| `gamma(FX)=gamma(X)` | Restricted consequence when `F` changes radius only and `gamma` depends only on angle. It does not validate `F` as a physical or empirical fold. |
| `S_s Y = Y S_s` | Exact commutation for isotropic real scaling and multiplication by `i`; an operator identity, not evidence for a field phenomenon. |

## D. Demonstrated non-invariants / negative controls

| ID | Observable/candidate | Transformation | Result |
| --- | --- | --- | --- |
| ORI-NINV-001 | absolute angle `OR°(k)` | `T_64` | Changes in general. |
| ORI-NINV-002 | Cartesian coordinates of circle embedding | `T_64` | Change in general. |
| ORI-NINV-003 | rendered phase/color | state evolution or color map change | Changes; palette is representational. |
| ORI-NINV-004 | exact 180-degree antipode | discrete 365-cycle | Undefined as an integer half-step because 365 is odd. |
| ORI-NINV-005 | global Janus identity `T_64=J` | all `Z_365` | False; only true on `A5`. |
| ORI-NINV-006 | `1/64 ~= 0.015` as privileged constant | precision/interpretation change | No structural status. |
| ORI-NINV-007 | raw transition directionality | null-geometry/matched-population control | Reported to collapse; raw counts do not establish intrinsic aperture. |
| ORI-NINV-008 | static path memory | endpoint-matched control | Reported failed. |
| ORI-NINV-009 | intrinsic outward/inward lip bias | matched reversal | Reported no difference (`21.3%` vs `20.4%`, `p=0.90`). |
| ORI-NINV-010 | accumulate-fire-reset EFC oscillator | EFC control | Reported failed. |
| ORI-NINV-011 | universal exact radial fold | field tests | Demoted in archive summaries. |
| ORI-NINV-012 | universal magic radius/threshold | resolution and shell controls | Demoted in favor of a region/corridor. |

Items ORI-NINV-007–012 are archive-reported failures and cannot be replayed
from supplied data. They should nevertheless remain preserved as negative
research records.

## E. Candidate dynamical invariants not established

| Candidate | Required transformation | Missing test/evidence | Current status |
| --- | --- | --- | --- |
| radial shell identity | coordinate change, resolution change, field shift | raw field labels, matching map, uncertainty, independent replay | `OPEN`. |
| transition class | Cartesian/polar/state-graph representations | common source trajectories and representation registration | `OPEN`. |
| memory ordering | admissible coordinate transforms and time reparameterization | exact `tau_M` definition and equivariance analysis | `OPEN`. |
| gate membership | threshold perturbation, coordinate transform, independent field | raw feature table and frozen gate classifier | `OPEN`. |
| Mobility -> Transfer -> Memory ordering | path reversal, coordinate change, control rescaling | registered event definitions and complete crossings | `HYPOTHESIS`. |
| compressed navigation state | alternative representations and shifted systems | frozen model, row data, external field, intervention benchmark | `OPEN`. |
| “one field, many views” | explicit maps `F_r`, `T_(r->s)` | source identity and commutative/defect tests | `REPRESENTATIONAL`. |

## F. Invariance versus neighboring concepts

| Concept | Required form | Example appropriate to this archive |
| --- | --- | --- |
| exact invariance | `I(Tx)=I(x)` | gcd class under `T_64`. |
| equivariance | `F(Tx)=rho(T)F(x)` | angle or complex representation under modular action, if `rho` is explicitly defined. |
| approximate robustness | `d(I(Tx),I(x)) <= epsilon` | possible shell/gate robustness after metrics and tolerance are frozen. |
| representation dependence | observable changes with representation | phase/color boards. |
| identifiability | observations separate admitted source classes | not yet tested for the JANUS field across representations. |
| predictive sufficiency | reduced features preserve task performance | claimed in EXP-JANUS-19, but only in-sample CV aggregates are supplied. |

## Ledger decision

The archive has a real invariant core only in its finite/arithmetic calibration
material. Its dynamical sections contain candidate structures, robustness
claims, and predictive summaries, but no supplied evidence establishes a
navigation-relevant invariant across declared representation changes.
