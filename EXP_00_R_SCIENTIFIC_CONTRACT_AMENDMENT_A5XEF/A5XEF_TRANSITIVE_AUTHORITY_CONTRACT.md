# A5XEF Transitive Authority Contract

The ledger includes the V1 scientific composite and complete tree composites for V1, A1, A2, A3, A4, A5, A5X, A5XR, A5XE and the controlling A5XE independent review. It separately binds declared A5/A5X/A5XR/A5XE roots/manifests.

Tree composites enumerate every non-cache member as `sha256  relative/path\n`, sorted by path, then hash the complete record. Temporary-copy mutations at any level therefore change the expected composite. Rewriting a copied ledger cannot change the validator's externally sealed ledger digest; rewriting validator and root requires changing the externally held A5XEF root expectation.

This is a finite integrity boundary, not a claim of cryptographic immutability against replacement of all external trust anchors.
