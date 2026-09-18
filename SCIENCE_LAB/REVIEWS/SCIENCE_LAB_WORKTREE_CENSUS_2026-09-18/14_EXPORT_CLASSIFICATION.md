# Export Classification — Pass 2 / Step 5

Status: `READ_ONLY_CLASSIFICATION / NO MOVE OR DELETE EXECUTED`

## Scope

This pass covers the `12` untracked files currently visible below
`SCIENCE_LAB/EXPORTS/`, totalling `9,156,332` bytes. Already tracked exports
and all source packages outside `EXPORTS` are used as references but are not
reclassified here.

## Result

| Disposition family | Files | Reading |
| --- | ---: | --- |
| Remove after exact verification | 3 | unpacked byte-identical copies of the tracked MIWA / Pineal Aperture / Andromeda release |
| Canonical interactive demonstrator | 3 | operator views for the common runtime, Five-H/Q and HZ/FZ case study |
| Generated demonstrator data bundle | 1 | browser-ready HZ/FZ data derived from the case-study result |
| Dated status source and render | 2 | one authored SVG and its PNG presentation render from the 2026-09-15 freeze |
| Curated concept-art release asset | 3 | Rainbow Loom I–III visual design records |

No file in this set is classified as empirical evidence or as an independent
scientific result.

## A. Exact unpacked release duplicate

The directory `MIWA_PINEAP_AN_DROMEDA_DOWNLOAD/` contains three files. Each is
byte-identical to its already tracked top-level counterpart:

- `MIWA_PINEAP_AN_DROMEDA.html`;
- `MIWA_PINEAP_AN_DROMEDA_RECORD.json`;
- `MIWA_PINEAP_STAR_MAP_TEMPLATE.csv`.

The tracked `MIWA_PINEAP_AN_DROMEDA_DOWNLOAD.zip` contains exactly those same
three names. The unpacked directory therefore creates no new source,
release, fixture or custody surface.

Recommended disposition: `REMOVE_AFTER_VERIFY`. The tracked top-level files
and tracked ZIP remain the recoverable release authority. Removal is a later,
explicitly allowlisted destructive step.

## B. Canonical interactive demonstrators

### Common runtime operator view

`NEXAH_COMMON_RUNTIME_ADAPTER.html` is the browser operator view for the
prototype common runtime. It loads:

- `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-runtime-adapter.js`;
- `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-profiles.js`.

The runtime package, not the HTML shell, owns the executable contract. The
view is correctly retained as a demonstrator at its existing export path.
Its current SHA-256 is also already recorded by the 2026-09-15 system-review
freeze manifest.

### Five-H / One-Q cut

`NEXAH_FIVE_H_ONE_Q_CUT.html` is the interactive Readout, Webstuhl and
Triptychon demonstrator named by the Field/Glyph/Number synthesis. It is an
expression and navigation artifact, not evidence of a built mechanism. Its
embedded wrapper permits external presentation libraries, so offline
portability is not yet guaranteed.

### HZ/FZ Mission Control

`NEXAH_HZ_FZ_COMPASS_MISSION_CONTROL.html` is the interactive view named by
the public HZ/FZ case study. It depends on the sibling
`NEXAH_HZ_FZ_MISSION_DATA.js`. The view transforms one declared dataset into
source, Cartesian and polar presentations; it does not create new
measurements or activate a profile.

Recommended disposition for all three: keep at their referenced export paths
and track them together with their controlling source packages.

## C. Generated HZ/FZ data bundle

`NEXAH_HZ_FZ_MISSION_DATA.js` is a browser-oriented generated bundle. It
declares schema `nexah-hz-fz-mission-data/0.1.0` and names
`CYCLE_PATH_SEQUENCE_RESULT.json` as its generator input. Scientific source
authority remains with the case-study data and result files, not the JS
wrapper.

The exact generator script was not located in this pass. Until provenance is
closed, the bundle should be retained beside its HTML consumer with class
`GENERATED_DEMONSTRATOR_DATA_BUNDLE` and with the missing builder recorded.

## D. Dated status source and derivative

`NEXAH_CURRENT_STATUS_2026-09-15.svg` is the authored vector source for a
dated system-status plate. `NEXAH_CURRENT_STATUS_2026-09-15.png` is its
presentation render. The content describes the 2026-09-15 freeze, including
the evidence ladder, six profiles, runtime conformance and the then-current
HZ/FZ gate.

These are useful historical orientation assets, but they must not appear as
the undated current Mission Control surface.

Recommended destination:

`SCIENCE_LAB/REVIEWS/NEXAH_SYSTEM_REVIEW_FREEZE_2026-09-15/visuals/`

The later move should preserve both hashes, register the SVG as source and
the PNG as generated render, and add a locator from the freeze review.

## E. Rainbow Loom I–III

The three PNG files form one curated triptych:

1. `NEXAH_RAINBOW_LOOM_I_FIELD_WEAVE.png` — source, weave, cut, record and
   return overview;
2. `NEXAH_RAINBOW_LOOM_II_SHADOW_CUT.png` — optical side cut with controlled
   shadow;
3. `NEXAH_RAINBOW_LOOM_III_RECORD_RETURN.png` — rear record, mask/audit and
   re-feed view.

The controlling synthesis explicitly identifies them as generated concept
illustrations: visual design records, not apparatus photographs and not
evidence that the depicted machine was built. Mission Control already names
the triptych as implemented expression and navigation while keeping external
utility, scientific novelty and product readiness open.

Recommended disposition: retain and track at the existing export paths as
`CURATED_CONCEPT_ART_RELEASE_ASSET`. No prompt, editable scene or other
builder source was located in this pass; that missing provenance should be
recorded rather than inferred.

## Dependency and authority boundary

Several controlling documents referenced above are themselves part of the
larger untracked worktree. Classification here does not silently promote
those documents. Adoption should therefore be atomic by family:

- runtime package plus operator view;
- Field/Glyph/Number synthesis plus Five-H/Q and Rainbow Loom assets;
- HZ/FZ case-study package plus HTML and JS bundle;
- system-review freeze plus dated SVG/PNG pair.

This avoids tracking a polished export while leaving its source authority,
claim boundary or runtime dependency outside version control.

## Next action

Build an exact execution allowlist from the completed classifications:

1. remove only the three verified MIWA unpacked duplicates;
2. adopt each demonstrator together with its controlling package;
3. archive the dated status pair under the freeze review;
4. adopt the Rainbow Loom triptych with its explicit concept-art boundary;
5. update Mission Control locators only after final paths are stable.

No execution is authorized by this classification alone.
