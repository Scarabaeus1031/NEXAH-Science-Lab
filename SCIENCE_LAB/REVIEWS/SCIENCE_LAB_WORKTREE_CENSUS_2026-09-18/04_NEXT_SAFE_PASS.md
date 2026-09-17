# Next Safe Pass

The next pass should be narrow and reversible.

## Pass 2 — delta triage

1. Establish a per-file baseline for `00_INCOMING` and classify each child
   package. The existing root-count inventory cannot reconstruct exact file
   arrival identity retrospectively.
2. Review `Orion ≠ Labreport` as intake; do not let its current folder location
   imply admission.
3. Split `tmp` into reproducible build output, reusable scripts, working copies
   and unrelated/private material. Propose deletions separately.
4. Assign each loose root document to one of: Mission Control current,
   Mission Control archive, Science Lab review, Outreach, Builder/Engineering,
   or private custody.
5. Classify each untracked export as source, release asset, demonstrator or
   generated output.

## Prevention rule

After Pass 2, maintain one delta register rather than repeating archaeology:

```text
NEW LOCAL OBJECT
→ NAMED INTAKE ID
→ ROLE + AUTHORITY + CUSTODY
→ CANONICAL DESTINATION OR PRESERVE-IN-PLACE
→ INVENTORY UPDATE
→ ONLY THEN CLOSE INTAKE
```

Recommended minimum fields:

`intake_id, discovered_at, path, role, authority, owner, canonical_destination,
inventory_status, disposition_status, decision_reference`

No cleanup action should be considered complete until Mission Control's corpus
inventory or archive locator reflects the resulting custody state.
