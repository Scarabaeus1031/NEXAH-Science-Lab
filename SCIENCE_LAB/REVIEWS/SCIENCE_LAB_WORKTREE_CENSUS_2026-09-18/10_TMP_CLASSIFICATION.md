# `tmp` Classification — Pass 2 / Step 3

Status: `READ_ONLY_CLASSIFICATION / NO MOVE OR DELETE EXECUTED`

## Headline

- files: `105`
- size: about `19 MB`
- immediate children: `24`
- root-level Python migration/edit scripts: `13`
- Mission Control staging/snapshot objects: `9`
- Math Matrix work package: `17 files`, about `13 MB`
- PDF/render holding area: `46 files`, about `5.1 MB`

The directory is not one disposable cache. It contains four custody classes
that must be separated before cleanup.

## Class A — completed Mission Control migration tooling

Thirteen root-level Python scripts were used for Mission Control archive,
currentness, outreach, experience-works and scientific-assets cutovers. They
contain hard-coded local paths and several perform state-changing file moves
or rewrites. They are operation-specific migration provenance, not reusable
Science Lab runtime tools.

Recommended disposition:

1. preserve one sealed copy with the Mission Control cutover/cleanup receipt;
2. label the scripts `HISTORICAL_ONE_SHOT_TOOLING`;
3. do not expose them through the Builder Atlas as currently runnable tools;
4. only generalize a script later if a real recurring operation requires it;
5. remove the temporary copies after the archive copy and hashes are verified.

## Class B — obsolete Mission Control staging snapshots

Nine immediate children hold staged `CURRENT` trees or loose staged copies
from 2026-09-17. Mission Control has since advanced to a later synchronized
branch state. A hash comparison against the present Mission Control repository
found only three exact file duplicates:

- `OUTREACH_CHANNELS.csv`
- `RESEARCH_ATLAS.md`
- `build_transparency_indexes.py`

The remaining staging files are not proof of uniqueness; most are simply
earlier versions of named currentness surfaces. Their proper authority is the
Mission Control repository history, not `tmp`.

Recommended disposition:

- record one aggregate staging manifest and comparison receipt;
- retain no second `CURRENT` authority inside Science Lab;
- mark all nine roots `DELETE_AFTER_RECEIPT` once the receipt is reviewed.

## Class C — Math Asset Matrix edit provenance

`tmp/math_matrix_edit` is not ordinary temporary output. It contains:

- six JavaScript modules that inspect, update and verify the Math Asset Matrix;
- before/after/holdout preview images;
- an empty `node_modules` directory;
- exact record additions and claim-boundary text for number/glyph, palindrome
  and holdout entries.

These scripts are currently bound to one absolute workbook path and therefore
are not reusable tools as written. They nevertheless provide useful mutation
and verification provenance for the workbook.

Recommended disposition:

1. move the six scripts and selected before/after previews into the Math Asset
   Matrix evidence package;
2. add a short execution-order receipt and the workbook SHA-256 before and
   after each mutation if those hashes can still be reconstructed;
3. replace absolute paths with parameters only if future reuse is intended;
4. discard the empty `node_modules` directory;
5. treat redundant previews as generated output after the retained evidence
   views are selected.

## Class D — PDF/render holding area

`tmp/pdfs` contains three different groups:

1. `oy-metals-review`: generated scientific-review page images;
2. `property_compare`: contact sheets and 34 rendered pages;
3. three loose PDFs with potentially private or legal subject matter.

The latter two groups may contain private, legal or otherwise unrelated
material. They must not be committed, copied into a public archive or treated
as Science Lab evidence merely because they are present under `tmp`.

Recommended disposition:

- `oy-metals-review`: link to its originating review, then keep only the
  minimum required render evidence or regenerate on demand;
- `property_compare` and loose PDFs: `PRIVATE_REVIEW_REQUIRED`; move only to
  explicitly private custody after owner confirmation;
- never publish filenames, rendered pages or document contents in Mission
  Control inventories beyond a generic private-custody count.

## Deletion candidates — not yet authorized

- empty `tmp/math_matrix_edit/node_modules`;
- Mission Control staged `CURRENT` copies after a comparison receipt;
- redundant generated previews after evidence selection;
- temporary PDF page renders after private custody and source confirmation.

No deletion should occur in the same step as classification. The next action
is a move/delete allowlist with exact paths, hashes, destinations and recovery
method.

## Prevention rule for `tmp`

Future temporary work must begin inside a dated task directory containing a
small `TMP_RECEIPT.md` with:

`owner, task, created_at, source, expected_outputs, retention_class,
review_by, final_destination`

Allowed retention classes:

- `EPHEMERAL_REGENERABLE`
- `WORKING_COPY_PENDING_REVIEW`
- `PROVENANCE_TO_PROMOTE`
- `PRIVATE_LOCAL_ONLY`

Anything still in `tmp` after `review_by` must appear in the active cleanup
queue. This prevents temporary working material from silently becoming a
second archive or authority surface.
