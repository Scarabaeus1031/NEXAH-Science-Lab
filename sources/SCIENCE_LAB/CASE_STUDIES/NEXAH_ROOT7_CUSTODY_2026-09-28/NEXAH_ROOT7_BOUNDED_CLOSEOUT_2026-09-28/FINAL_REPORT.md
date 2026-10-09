# NEXAH Root7 — bounded closeout final report

## Execution status

- Preregistration locked before implementation: `YES`
- Prior component results disclosed at lock: `YES`
- Frozen source files verified: `13/13`
- Valid execution: `PRIMARY_R1`
- Clean replay: `REPLAY_R1`
- Replay byte-identical: `YES`
- Overall closeout: `CLOSED_BOUNDED`
- NEXAH Core promotion: `NO`

The original `PRIMARY/` and `REPLAY/` directories are retained as an invalidated
implementation trace. Their gate decisions were correct, but two negative gate
fixtures did not preserve the separate `open_gap` and `slow` inputs. The frozen
rules were repaired without changing a threshold, domain or decision rule; the
valid results are the `R1` directories. See `IMPLEMENTATION_REPAIR_01.md`.

## Test 1 — axis/313 identifiability

**Decision: `NON_IDENTIFIABLE`.**

Every long-axis choice has four radial `3|1|3` paths. Preserving the existing
fourth-channel endpoint code excludes a stretched `w/sqrt7` axis, but three
candidates survive:

- `sqrt2/x`;
- `sqrt3/y`;
- `sqrt5/z`.

Therefore the Root7 constraints do not uniquely select the current `sqrt5/z`
working convention. That convention remains internally consistent and useful,
but it is a declared model choice rather than a source-forced deduction.

## Test 2 — route and 404 information boundary

**Decision: `ENDPOINT_INSUFFICIENT_HISTORY_REQUIRED`.**

The sequences `SL` and `LS` end at the same point `(1,1,2,1)`. They are also
indistinguishable from static `4774` and initial/final `47 -> 74` alone. They are
distinguished by ordered 3D projections, ordered `47/74` histories and typed
operator records.

All five frozen synthetic gate scenarios behaved as specified. Their outcomes
depend on whether the gate is attached to the tip or inner hinge; the source
does not independently bind either location. Status:
`MODEL_DEPENDENT_NOT_SOURCE_BOUND`.

For payloads `-1000..1000`, `7m^2 mod 11` produces only the six records with
residues `{0,2,6,7,8,10}`. The largest fiber contains 364 payloads. In
particular `-947` and `947` both map to `(residue=7,k=2)`. Decision:
`MANY_TO_ONE_CLASSIFIER`, not routing reconstruction or encryption.

## Test 3 — source-bound bridge identification

**Decision: `NOT_IDENTIFIED`.**

The two source-admitted SCN adapters disagree materially:

- `F_centered_1` opens the existing 404 predicate for residues
  `{0,1,2,3,8,9,10}`;
- `F_shifted_4` opens it only for residue `{5}`.

There is no unique, unit-bearing selection rule between them. The source set
also contains no typed map from SCN/regulator state to the Root7 4D state and
no typed map to the `7/6/13` angle state. No independent held-out prediction is
defined. No replacement map was fitted after seeing the data.

## Reproduction and hashes

- Preregistration SHA-256:
  `92fa0913d151b11457bdbc78b4a544e2eee27a32259eb2d3559c3d49e8c2e360`
- Source manifest SHA-256:
  `1cb1c385775ba99e696ebee2b1e3b3fa7e460dbfdaff2d0bcea5290ce3d82a72`
- Valid implementation SHA-256:
  `137554fdf9bf18f9ef45e9dd247bf6ddd8c41f514e54c8fe21a0e3012704425a`
- Scientific-result SHA-256, Primary R1:
  `fe045109e751691068e90fa5b2b262858137adc96e0ed4737b4b667b9e34864a`
- Scientific-result SHA-256, Replay R1:
  `fe045109e751691068e90fa5b2b262858137adc96e0ed4737b4b667b9e34864a`
- Full `results.json` SHA-256, Primary R1:
  `fcfa9caf5865a2f4a87b73e109eaf9ddb2332640645dcdb4c18f63ea41c4690e`
- Full `results.json` SHA-256, Replay R1:
  `fcfa9caf5865a2f4a87b73e109eaf9ddb2332640645dcdb4c18f63ea41c4690e`

## Scientific conclusion

Root7 contains valid bounded mathematics: the Euclidean 4D `sqrt(7)`
construction, enumerated `3|1|3` radial paths, exact modular classifications and
typed histories. The tested evidence does not uniquely bind the stretched axis,
does not allow endpoints or SCN residues to reconstruct route history, and does
not identify a single SCN–Root7–angle–404 transformation contract.

This closes the present package without erasing its useful parts. It does not
establish a spacetime metric, navigation or routing capability, encryption,
physical mechanism, E8 identity, or NEXAH Core readiness.
