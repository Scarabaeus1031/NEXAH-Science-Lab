# NEXAH Navigator — contract review v1

Date: `2026-10-06`

Status: `DRAFT 2020-12 FORMAL VALIDATION PASS / WP1 TECHNICAL FREEZE READY`

## Review result

The five JSON contracts parse and compile successfully under strict Draft
2020-12 validation with formats enabled and local `$ref` resolution. The local
integrity runner checks
the valid and deliberately invalid public-manifest fixtures and currently
returns `PASS`:

```text
schemas checked                 5
internal fixture accepted       yes
valid fixture entities         3
valid fixture relations        1
invalid rejection signals      3
failures                        0
```

Run:

```sh
node validate_navigator_contracts.mjs
NODE_PATH=/path/to/ajv/node_modules node validate_navigator_jsonschema_2020.cjs
```

## Corrections made during review

1. `record` and `release` entities no longer need to invent a controlling
   record for themselves. All content-bearing entity types still require at
   least one controlling record.
2. The public manifest no longer contains a hash of the complete file inside
   that same file. `payload_sha256` binds the canonical exported payload;
   whole-file identity belongs in a detached release receipt.
3. A valid preview fixture proves the intended entity → relation → evidence
   shape.
4. An invalid released fixture contains an internal block, absolute local path
   and missing publication authorization. The integrity runner must detect all
   three conditions.
5. Internal manifest and reusable release-receipt contracts now complete the
   five-schema family required by the build plan.
6. Strict compilation exposed and corrected missing local type declarations in
   conditional subschemas; `$ref` resolution now passes for Entity, Relation
   and Release Receipt.

## Boundary of this pass

The dependency-free runner checks NEXAH cross-record and publication
invariants. AJV 8 provides the separate standards-engine validation. The AJV
packages were used from a pinned temporary review environment and have not
been added as runtime or application dependencies.

WP1 is technically freeze-ready. This review does not authorize publication.
