# Source Plan — Repair R1

Status: `SOURCE_BOUND_FOR_PHASE_A`

The exact RCSB PDB-format source is present at `SOURCE_DATA/1XQQ.pdb` and bound
by `SOURCE_BINDING.json`.

## Bound primary source

- identifier: `1XQQ`
- provider: RCSB Protein Data Bank
- landing page: `https://www.rcsb.org/structure/1XQQ`
- intended source type: Solution-NMR native-state conformer ensemble
- planned metadata: human ubiquitin; 128 submitted conformers; 76 residues
- bound machine-readable format: legacy PDB v3.15
- temporal order: `NONE CLAIMED`

Bound byte count: `12,823,596`. Bound SHA-256:
`88182fc83c2c5081f993ccdad6f4b628c1b52d39b3aea601bf568a0b6f4d45c1`.
The file contains 128 `MODEL`/`ENDMDL` pairs and a 76-residue chain-A SEQRES
record. Phase A selects the common chain-A C-alpha addresses `1..76`.

## Binding record captured

- exact RCSB download URL and UTC retrieval timestamp;
- filename, byte count and SHA-256;
- header revision, experimental method and organism;
- model, chain and selected-address inventory;
- fail-closed alternate-location, missing-coordinate and duplicate policy;
- selected common C-alpha carrier across all included conformers.

The binding authorization and execution are limited to Phase A. AlphaFold
predictions, if ever added, must be separately labelled computed-model
comparators and must not be treated as a conformer trajectory.
