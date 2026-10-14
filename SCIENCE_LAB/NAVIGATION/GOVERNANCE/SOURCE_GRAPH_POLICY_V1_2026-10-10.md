# Source Graph Policy V1

Status: `ACTIVE / CONSTITUTIONAL IMPLEMENTATION POLICY`  
Date: `2026-10-10`

## Layers

| Layer | Purpose | Authority boundary |
|---|---|---|
| canonical base | validated entities and typed relations | changes require admission and governance |
| admitted overlay | separately accepted internal graph extension | does not rewrite the base |
| source-bound lens | joins sources for inspection and comparison | changes no canonical count unless separately admitted |
| Source Field | broad Mission Control locator and custody catalog | discovery is not graph admission |
| Lab Register lens | read-only window over maintained study identities and lifecycle | `LAB_REGISTER.md` remains authoritative |
| Mission Control projection | generated status and governance view | may control lifecycle; may not rewrite evidence |

## Identity decision

Use this order before creating an ID:

1. exact stable ID match;
2. exact canonical path or SHA-256 match;
3. declared predecessor, successor or representation-group match;
4. unique title/filename match as a review candidate only;
5. new identity with written necessity and authority.

If steps 2–4 conflict, record `DUPLICATE_REVIEW_REQUIRED`; do not silently
merge or admit.

## Required source classes

`book`, `paper`, `study`, `dataset`, `code`, `html-instrument`, `image`,
`3d-object`, `governance-record`, `collection`, `application`, `concept`.

## Required evidence classes

`exact`, `empirical`, `bounded`, `negative`, `null`, `open`, `historical`,
`provenance-only`, `unresolved`.

## Edge discipline

Prefer the existing Navigator relation vocabulary. Every relation must include
an explanation, evidence pointer, preserved information and non-implications.
Use `non-identity` when shared numbers, geometry, vocabulary or visual form
could otherwise be mistaken for sameness.

## Book and work binding

A book or paper is one graph node plus typed relations to its sources,
chapters, evidence records, instruments and later editions. Chapters do not
automatically become canonical nodes. Promote a chapter only when it has an
independent stable identity or evidence role.

An interactive HTML or GLB remains a representation or instrument unless its
own contract establishes another role. Attractive presentation does not
increase evidence state.

## Currentness and return

Every material graph change must refresh:

1. the owning binder or registry;
2. the Source Graph component index;
3. validation receipts;
4. the generated Mission Control control projection;
5. the visible Navigator only when a Human-facing route changed.

When `LAB_REGISTER.md` changes, rebuild the Navigator's read-only register lens
with `node GOVERNANCE/build_lab_register_lens.mjs` and validate the application.
The generated lens must retain the register hash and may not infer a new study
status.

Mission Control controls `active`, `current`, `parked`, `closed`, `selected`
and `public`. Package-local scientific result language remains with the source.
