# Machine-Checkability Boundary

## Syntactic checks

JSON Schema can check required fields, enums, patterns, basic conditional fields, artifact locator presence, and a verified edge's presence of at least one typed evidence item/implementation reference.

## Referential checks requiring an ordinary validator

Evidence-ID resolution and uniqueness, file existence/hash, component-edge order, artifact connection, and negative-result non-deletion across revisions are not enforced by the schema.

## Scientific checks

Whether an operator is correctly bounded, an equivalence relation is appropriate, a preservation/loss assertion is true, uncertainty is complete, or an interpretation is warranted requires code execution, proof, data analysis, or expert review. Format validation cannot establish these.

The preceding audit states this distinction in prose, so `SYNTACTIC_VS_SCIENTIFIC_VALIDATION_SEPARATED = YES`. Nevertheless the enum `VERIFIED` and permissive evidence scoping create validation-theater risk: a syntactically valid record can appear scientifically certified.

