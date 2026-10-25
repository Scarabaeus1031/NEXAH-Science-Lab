# D1–D2 clamp engineering return

Date: `2026-10-25`  
Classification: `BOUNDED_SOURCE_BOUND_ENGINEERING_TEST / NO SCIENCE RUN`  
Identity reuse: `NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1`, `MOD:TESSAREC`, `NEXAH_A0_ORIENTATION_CONTROLLER_BENCH`  
New canonical IDs / relations / Studies / Findings: `0 / 0 / 0 / 0`

## Answer

Within the declared geometric model, **yes**: the received D1–D2 axis is now attached to the fixed lower frame by two finite C-open bearing candidates and remains movable through the complete tested path from `−34°` to `+34°`. The crown remains fixed at its half-contact state, the lid remains fixed and is not given a new body, and no second motion axis is introduced.

This remains an assumption-bound engineering result, not a fabrication release. The same candidate now includes relieved POM-C radial liners, two POM-C thrust washers, two external split shaft collars, four M1.4 rail fasteners, a dimensional tolerance stack, declared service/proof loads, shaft deflection and bearing-pressure checks, dry-friction torque and an assembly/proof sequence. Supplier evidence, tightening torque, wear/fatigue and physical prototype proof remain open.

## Current inventory

| Requested object | Status | Source / implementation | Existing or added test |
|---|---|---|---|
| Pentagon Gelenklaterne | present as a separate five-plane iris; rigid curtain skin remains a negative result | `A0_BOOK/downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/lantern/NEXAH_PENTAGON_GELENKLATERNE_LAB.html`, report and tested-geometry visual in the same intake | received JavaScript/Python comparison over 101 states; 362 discrete pin-clearance positions; rigid-skin rank result 30/30 |
| Fünflaschenkrone | present as source package and received GLB; source rebuild and physical housing remain partial | Crown ZIP/GLB in `A0_BOOK/downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/`; `A0_BOOK/A0_CROWN_SHADOW_CONTACT_BENCH.html` | GLB structure check and Contact Bench contract/tests; independent glTF validator and physical prototype remain open |
| Shadow Triangle 3+2 | present as PNG, source package, GLB and Contact Bench | `A0_BOOK/downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/sources/shadow-triangle-3plus2/`, GLB and `A0_BOOK/A0_CROWN_SHADOW_CONTACT_BENCH.html` | five source coordinates and source→GLB transform reproduced; finite-thickness mechanics were partial until this local D1–D2 test |
| “The One”, D1–D2 fold and opposite direction | present as received source package, two GLBs, notes and source test; formerly zero-thickness only | this intake's `sources/the-one-d1-d2-package-v1/` and `deliverables/received/` | received `test_one_hinge.py`; this return adds finite-thickness full-path sampling and a negative baseline |
| Clamp, bearing attachment, axis and panel thickness | **bounded constructive candidate** | `d1_d2_clamp_test.mjs`, generated result/visual/GLB in this directory | 1,361 angle samples plus analytic between-sample motion bound; liners, washers, collars and four rail screws; 52-check independent verifier |
| YUGO/IOTA and `°_⁄` adapter | present, but deliberately separate from the 3D mechanism | received `NEXAH_Yugo_One_Loop_Offline.html`; A0 Bench `#aeYugoIotaPivotTest`, `a0-yugo-iota-pivot.js` | existing `a0-yugo-iota-pivot-tests.cjs`; the game remains a simplified 2D roles adapter, not a mechanical validation |

An animation or mention was not counted as a verified mechanical coupling. Public book visibility and the internal Science Desk were also treated as different projections of the same local custody state.

## Source custody comparison

All named Downloads and restored Desktop GLBs from this work thread now have repository copies. The D1–D2 package ZIP, original and updated notes, both received GLBs, received PNG and the YUGO offline HTML are retained here. Crown and Shadow ZIP/PNG/GLB plus the body and lantern reports are retained in the adjacent Pentagon intake. Hashes are recorded in each intake.

The body-due-diligence TXT in the earlier intake differed from the received file by a leading tab only; an exact received-byte copy is additionally retained under `reports/body-due-diligence/received/`.

## Chosen construction parameters

The D1/D2 coordinates and requested path are received values. Every other dimension below is a **chosen candidate parameter**, not a recovered measurement or manufacturing recommendation. The visual scale uses `1 u = 100 mm` only to make the candidate dimensions readable.

| Parameter | Source units | Scale rendering |
|---|---:|---:|
| D1 / D2 centre | `x = −0.16 / +0.16`, `y = 0`, `z = 0.19` | `−16 / +16 mm`, `z = 19 mm` |
| Tested angle path | `−34° … +34°` | same |
| Moving and fixed panel thickness | `0.008 u` | `0.8 mm` |
| Shaft diameter | `0.016 u` | `1.6 mm` |
| Bearing bore diameter | `0.022 u` | `2.2 mm` |
| C-housing outside diameter | `0.048 u` | `4.8 mm` |
| Each housing width along axis | `0.05 u` | `5.0 mm` |
| Housing opening | `±60°` toward `+y` | `120°` total |
| Moving sleeve length / outside diameter | `0.24 u / 0.028 u` | `24.0 / 2.8 mm` |
| Fixed rail length / width / thickness | `0.44 / 0.036 / 0.016 u` | `44.0 / 3.6 / 1.6 mm` |
| Shaft-to-bore radial clearance | `0.003 u` | `0.3 mm` |
| Shaft-to-POM-liner radial clearance | `0.0003 u` | `0.03 mm` nominal |
| Relieved liner opening | `±68°` toward `+y` | `136°` total |
| Sleeve-to-bearing axial gap per side | `0.015 u` | `1.5 mm` |
| POM thrust washer width per side | `0.013 u` | `1.3 mm` |
| Remaining nominal axial float | `0.004 u` | `0.4 mm` |
| Split collar width / outside diameter | `0.018 / 0.028 u` | `1.8 / 2.8 mm` |
| Rail fasteners | — | `4 × M1.4`, two per pedestal |
| Intentional hinge contact/exclusion strip | `0.02 u` | `2.0 mm` |

Intended contacts are: shaft↔moving sleeve, shaft inside the D1/D2 bores, pedestals/rail↔fixed lower panel, and moving↔fixed panels inside the declared hinge strip. All contact outside those sets is treated as an unwanted collision.

### Visual reading note: the folded-in “tooth”

The short downward web drawn below each C-housing is the **fixed mounting neck / pedestal** that connects the bearing housing to the transverse rail. It is not contact `1`, not the numeral `1`, not a moving tine and not a latch. In a later fabrication candidate this neck still needs an explicit screw, bond or integral-joint specification; this bounded model only declares it as rigidly fixed to the rail.

## Method and result

`d1_d2_clamp_test.mjs` reads the received `models.json` and `native_contact_results.json`. It uses segment–triangle, triangle–triangle and capsule-envelope distances, subtracts finite half-thicknesses from mid-surface distances and checks the C-opening analytically by angular envelope.

- sample set: 1,361 positions at `0.05°`, including both endpoints and every negative angle;
- floating-point comparison tolerance: `1e−9 u`;
- conservative maximum point motion between neighbouring samples: `0.000283616 u`;
- formal interval certification: no;
- crown: fixed at received half-contact fold;
- lid: fixed / no added lid body;
- additional movement axes: none.

Continuous lower bounds after subtracting the between-sample motion bound:

| Unwanted target | Minimum lower bound | Location |
|---|---:|---:|
| central pin | `0.116403815 u` | near `+34°` |
| 25 frame bars | `0.075341101 u` | near `−14.9°` |
| fixed crown | `0.272731303 u` | near `+34°` |
| fixed lower panel outside hinge strip | `0.011716383 u` | near `+32°` |
| holder base / rail | `0.021479611 u` | near `±34°` |
| all added hardware vs pin/frame/crown | `0.139824064 u` | moving sleeve envelope |

The C-opening retains `4.676314°` sampled angular margin at both path ends. The relieved liner retains `5.188620°`. Both split collars and all four rail screws were additionally checked against the moving leaf at every one of the 1,361 positions; their smallest continuous lower bound is `0.011438708 u`. The combined result is `PASS_BOUNDED_CONSTRUCTIVE_CANDIDATE` for this assumption-bound model.

## Retention, load, friction and tolerance assumptions

These values are selected design assumptions that make the next engineering gate executable; they are not recovered source measurements or supplier-certified properties.

| Check | Declared input | Calculated result |
|---|---:|---:|
| proof radial / axial load | `1.5 N / 0.3 N` | full motion rechecked with retention envelopes |
| shaft bending, Ø1.6 mm, 32 mm bearing span | yield floor `800 MPa` | `29.842 MPa`, factor `26.81` |
| shaft midspan deflection | `E = 193 GPa` | `0.01649 mm`; `0.00851 mm` reserve to minimum clearance |
| POM-C projected bearing pressure | allowable assumption `8 MPa` | `0.09375 MPa`, factor `85.33` |
| dry radial + thrust friction | `μ = 0.15 / 0.12` | `0.2196 N·mm` |
| actuator design torque | `1.0 N·mm` | factor `4.55` over estimated dry friction |
| four rail-fastener slip resistance | `20 N` assumed preload each, `μ = 0.20` | `16 N`, factor `10.67` against proof radial load |
| axial tolerance stack | bearing span, sleeve and two washers | `0.21 … 0.59 mm` positive float |

Assembly order is explicit in the generated result: rail/pedestals, relieved liners, shaft, D1 washer, moving sleeve, D2 washer, second bearing, external collars, axial/free-rotation verification, unloaded sweep, then service and proof-load sweeps. Set-screw torque, thread stripping, preload verification and witness-mark inspection criteria still require supplier data or prototype evidence.

## Preserved negative result and smallest repair

The first candidate used a closed 360° bearing ring. Its annulus intersects the unnotched finite-thickness moving leaf at D1 and D2 at **all 1,361 samples**. That variant is retained as `COLLISION` in the result JSON.

The smallest justified change was to open the same two housings toward `+y`. Axis, centres, shaft, panel thickness, bore, housing diameter, fixed rail and movement range remain unchanged. The C-opening is therefore a geometric repair of the identified collision, not a different mechanism.

## 3+2 force boundary

The received scaling still gives zero resultant vertical force for `3×1 − 2×1.5`. It does not give zero hinge moment after folding: the calculated model moment is `−0.061119068` at both `−34°` and `+34°`, and `0` at `0°`. The clamp clearance result therefore makes no equilibrium, stability or actuator claim.

## Reproduction

From this directory:

```sh
node d1_d2_clamp_test.mjs
node d1_d2_clamp_verify.mjs
```

The first command regenerates the JSON, SVG and GLB. The committed PNG is a raster rendering of the generated SVG. The second command verifies scope, identities, angle coverage, negative and positive results, all continuous lower bounds, six retention motion checks, tolerance/load/friction factors, the fixed crown/lid contract and the generated GLB container (`52/52`).

## Remaining uncertainty

The candidate now specifies one bounded retention and fastening arrangement, but it has no supplier certificates, tightening-torque or thread-strip evidence, wear/temperature/contamination/cycle-life result, selected actuator or sensor, prototype metrology, physical proof-load test or independent CAD/mesh replay. The declared `0.1 m/u` scale remains an assumption. `+78°` remains outside this test and is not a release condition.
