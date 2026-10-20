# Return Economy demonstrator — source-bound specification

Status: `IMPLEMENTED IN OCB V0.15.0 / ENGINEERING DEMONSTRATOR / NOT RESULT EVIDENCE`

The demonstrator shall present three independent carrier lanes without merging
their identities.

| Lane | Visible sequence | Required controls |
|---|---|---|
| Q106/O16 | source → O16 view → collision fibre → residual → exact Return | matched shuffled map with equal cost but different assignments |
| Typed Seam | 140 incidences → 106 addresses → lost distinctions → typed residual → 140/140 Return | raw C0 and invalid-glue C3 |
| Decimal D4 | 4-digit source → either deletion view → collision → second view or removed digit → exact Return | single views, paired view and bijective swap |

The common meter may show source count, image/address count, collision count,
exact Return count, raw bits, record bits and saving. It must never label the
carriers identical or infer Iota/THOOTH operator identity.

Tour sequence: single-view loss → reveal residual → exact Return → matched
control → cross-carrier comparison → claim-boundary card.

Implementation return: the six-phase sequence is live at
`A0_ORIENTATION_CONTROLLER_BENCH.html#returnEconomyDemonstrator`. Its pure
model exhaustively returns all `106 + 140 + 9000 = 9246` source samples, binds
the three closed source artifacts by SHA-256 and retains the frozen `3/3`
Return versus `1/3` Economy classification. Manual rendered-browser acceptance
remains open because governed automation rejects local `file://` inspection.

