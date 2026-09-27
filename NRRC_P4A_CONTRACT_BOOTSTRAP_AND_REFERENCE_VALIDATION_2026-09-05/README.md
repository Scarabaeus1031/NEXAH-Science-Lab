# Neutral Relation-Record Contract — P4A candidate

Version: `0.1-candidate`  
Status: `CANDIDATE · NONPRODUCTION · LOCAL_STAGING`  
Authority: `NRRC-ODR-01` bootstrap only

This staging package tests whether the approved 14-type NRRC minimum contract can stand as a deterministic processor-neutral record contract. It contains one JSON Schema, generated positive and negative synthetic fixtures, a standard-library Python validator, conformance tests, policies and reproducibility evidence.

It is not the approved independent Git home, a production release, an OLS extension, an ORION processor, a THE EYE projection, scientific evidence or a new ontology.

## Local verification

```text
python3 tests/generate_fixtures.py
python3 -m unittest discover -s tests -p 'test_*.py'
python3 validator/nrrc_validate.py fixtures/positive/complete_trace_audit_residual_return.json
shasum -a 256 -c MANIFEST_SHA256.txt
```

Fixture generation is deterministic. The canonical record hash is SHA-256 over UTF-8 canonical JSON of the complete envelope with only its top-level `content_hash` field omitted.

