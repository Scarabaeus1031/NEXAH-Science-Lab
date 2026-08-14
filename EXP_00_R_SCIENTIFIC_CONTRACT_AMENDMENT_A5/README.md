# EXP-00-R Scientific Contract Amendment A5

A5 is an additive, contract-only prospective closure. It resolves A4-R21 and mechanically closes A4-R22–R25. It does not implement V3, authorize execution, access registered data, or generate a Rössler result.

Authority flows from frozen V1 through accepted A1–A4, then A5. Earlier packages remain byte-unchanged. The single new scientific choice is identified in `A5_P4_PROSPECTIVE_CHOICE_JUSTIFICATION.md`; all other changes are encoding/integrity closure.

Validation: `python3 contract_validation/validate_a5_contract.py`, followed by `python3 -m unittest contract_validation/test_a5_contract.py` from this directory. Both are standard-library-only and never import the scientific pipeline.

