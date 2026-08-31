# RSC-01 — Representation / Stroke / Script-Change Boundary Audit

## Status

`CLOSED / BOUNDED_CROSS_DOMAIN_REPRESENTATION_TRANSFER_AND_FALSIFICATION_AUDIT`

RSC-01 stress-tests the closed SFM-01 documentary reduction (`MARK`, `FORM`, `UNIT`, `VALUE`) against three bounded controls:

1. Chinese brush-calligraphy production and its visible trace;
2. Vietnamese use of Chữ Hán, Chữ Nôm and Quốc Ngữ;
3. Vietnamese kinship/address expressions as relationally selected reference forms.

## Decision

`B_SFM_SURVIVES_WITH_DOMAIN_SPECIFIC_PROCESS_AND_RELATION_EXTENSIONS`

The four SFM types remain useful, but they are not a complete model of every tested domain. Brush production requires process, event, temporal-order and provenance fields when the question concerns how a trace was made. Vietnamese address/reference requires an explicit relational context joining speaker, addressee or referent, discourse role and social/kin relation. These are domain extensions and mapping relations, not new NEXAH core types or operators.

## Boundary

The audit is descriptive and source-bounded. It creates no cultural theory, writing-system discovery, linguistic discovery, ontology, operator, architecture change, implementation or activation. All Occident/Orient and holistic/lunar/harmony annotations remain Human provenance with evidential weight zero.

The frozen predecessor packages VOR-01, CUN-01, GRB-01 and SFM-01 were read but not modified.

