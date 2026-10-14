# A0-BL-035 — Admission record

```yaml
STUDY_ID: A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026_10_10
TITLE: Local Splinter extraction on the frozen A0-BL-021 history set
QUESTION: Does a bounded local seam-and-corner signature reduce terminal-class ambiguity beyond the 7x8 address alone without reading the class identifier?
STUDY_OWNER: Human Owner
METHOD_CLASS: THEORETICAL / FINITE COMPUTATIONAL AUDIT
OBJECT: The 100 frozen oriented two-step histories, 56 address cells and 56 typed terminal classes from closed A0-BL-021.
INFORMATION_BOUNDARY: Features may read each history, its two attachment events and its per-history boundary word; class hashes are labels only and may not enter an extractor.
BASELINE: M0 address pair.
PRIMARY_CANDIDATE: M3 SPL_LOCAL at frozen radii 0, 1 and 2.
CONTROLS: Input hash, exact counts, leakage rejection, zero/one address indexing, cyclic boundary reindexing, J involution, feature ablations and deterministic within-address permutation.
RESULTS: SPLINTER_SUFFICIENT_COMPRESSED | SPLINTER_PARTIAL | SPLINTER_NOT_IDENTIFIED | UNDEFINED_CONTRACT | INVALID_EXPERIMENT
REPRODUCIBILITY: R2_LOCAL_REPLAY
STOP: Stop after the three frozen radii, controls, one replay and independent verifier. No feature tuning after result exposure.
CANONICAL_HOME: SCIENCE_LAB/CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10
IDENTITY: New Study identity; reuses the closed A0-BL-021 evidence and existing ART:A0:MATHEMATICAL_JOINTS surface; creates no Family, PENT identity or canonical Splinter operator.
OWNER_DECISION: ADMIT_AND_ACTIVATE_ONE_BOUNDED_CYCLE
OWNER_DECISION_DATE: 2026-10-10
```

The Owner's “machen wir den jetzt?” follows the accepted A0-BL-035 design
discussion and the earlier explicit authorization to lead bounded scientific
runs. It authorizes this Study only. Publication, external contact, physical
inside/outside claims and generalized Splinter vocabulary remain unauthorized.
