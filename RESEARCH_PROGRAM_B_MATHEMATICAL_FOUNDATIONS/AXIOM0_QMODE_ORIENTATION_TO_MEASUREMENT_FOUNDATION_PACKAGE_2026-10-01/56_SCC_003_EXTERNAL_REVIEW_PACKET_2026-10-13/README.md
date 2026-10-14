# SCC-003 External Review Packet

Status: `OWNER_AUTHORIZED / FROZEN REVIEW OBJECT / NOT SENT / NOT PUBLIC`  
Date: `2026-10-13`  
Identity reused: `SCC-003 / A0OE:PASCAL_PENTAGON_D5_TEST`  
Authority: Human Owner decision of 2026-10-13  
Packet purpose: independent mathematical and prior-art review

## The claim under review

> A cyclic five-face quotient of depth-six binomially weighted Pascal carriers
> with explicit typed `D5` automorphisms and the open-to-closed node sequence
> `28,49,70,91,112 -> 106`.

This is a candidate contribution statement. The packet does not call the
construction new, first, unique or worldwide novel.

## Reading order

1. [`REVIEWER_BRIEF.md`](REVIEWER_BRIEF.md)
2. [`CLAIM_TABLE.csv`](CLAIM_TABLE.csv)
3. [`paper/PAPER_A_SCC_003.md`](paper/PAPER_A_SCC_003.md)
4. [`reference/FORMAL_SPECIFICATION.md`](reference/FORMAL_SPECIFICATION.md)
5. [`reference/PROPOSITIONS_AND_PROOFS.md`](reference/PROPOSITIONS_AND_PROOFS.md)
6. [`reference/README.md`](reference/README.md) and its reproducibility commands
7. [`reference/PRIOR_ART_AUDIT_2026-10-10.md`](reference/PRIOR_ART_AUDIT_2026-10-10.md)
8. [`REVIEW_FORM.md`](REVIEW_FORM.md)

The HTML paper in `paper/` is a reader projection. The Markdown paper,
specification, proofs, exported tables and verifier are the controlling review
materials.

## Reproduction

From `reference/`:

```sh
python3 generate_reference.py
python3 verify_reference.py
```

Expected summaries:

```text
{"artifacts": 11, "edges": 180, "nodes": 106, "status": "PASS"}
{"checks": 177, "failures": [], "status": "PASS"}
```

Then validate this handoff from the packet root:

```sh
python3 validate_review_packet.py
```

## Independence rule

The verifier is implementation-independent relative to the generator: it does
not import the generator and reconstructs the quotient by a separate union-find
implementation. This is local implementation independence, not yet external
review or external replication.

## Reviewer return contract

A usable return must include:

- reviewer name, field and relevant qualification;
- conflict-of-interest statement;
- date and exact packet-manifest hash;
- whether the reproduction commands were executed and in what environment;
- answers to all questions in `REVIEW_FORM.md`;
- citations and precise structural mapping for any alleged predecessor;
- one recommended disposition.

## Allowed dispositions

- `ACCEPT_MATHEMATICAL_CORRECTNESS_ONLY`
- `REVISION_REQUIRED`
- `REJECT_FORMAL_CLAIM`
- `EQUIVALENT_OR_CONTROLLING_PRIOR_ART_FOUND`
- `NO_EQUIVALENCE_FOUND_WITHIN_REVIEW_SCOPE`
- `REVIEW_INCOMPLETE`

No disposition automatically authorizes publication or changes the SCC-003
status. The Human Owner makes the post-review decision.
