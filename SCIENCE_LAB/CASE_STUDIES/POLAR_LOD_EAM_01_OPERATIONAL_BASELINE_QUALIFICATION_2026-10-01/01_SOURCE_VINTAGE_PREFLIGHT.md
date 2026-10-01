# GFZ ESMGFZ source-vintage preflight

Status: `CONDITIONAL / SOURCE_LABELS_VERIFIED / UTC_AVAILABILITY_UNPROVEN`

## Bound source

- provider: GFZ ESMGFZ;
- product: archived daily EAM 90-day prediction, 3-hour cadence;
- archive: `https://rz-vm480.gfz.de/files/ESMGFZ/EAM/archive_90d_prediction/`;
- audited archive-index SHA-256:
  `5d1dd745fb27653b3c5eddd2f6e56a8e3a33b981d1ba2c2b21064d2defc7cad2`;
- requested set: `ESMGFZ_EAM-90d_03h_2025_001F.asc` through
  `ESMGFZ_EAM-90d_03h_2025_365F.asc`.

The committed ledger, rather than redistributed raw content, is the custody
record. Each row records URL, SHA-256, byte count, filename label, embedded
Issue Date, declared and actual row counts, prediction boundary and admission.

## Findings

1. All 365 named files were retrievable.
2. Every file declares 1,440 records. A complete file actually contains 1,448
   unique 3-hour records: 181 inclusive days times eight. This systematic
   header discrepancy is preserved in the ledger and not silently repaired.
3. File `ESMGFZ_EAM-90d_03h_2025_108F.asc` has only 1,399 parsed records and
   excitation magnitudes above `1e-3`; it is rejected without repair.
4. Some label dates share an embedded Issue Date, including an April backfill.
   Filename count is therefore not forecast-origin count.
5. One structurally valid file is selected per Issue Date. Selection minimizes
   absolute label-to-issue distance, then chooses the later label. This prefers
   a same-day archive label and never averages or repairs values.
6. The result is 344 independent valid Issue Dates, 94.2% of a 365-day year.
7. All evaluated target rows carry source state `P`.
8. The independent review found no direct target-value leakage, but the
   date-level Issue Date and archive label do not prove provider availability
   before an exact operational UTC cutoff. The sampled public archive objects
   also carry current server modification times of 2026-05-28, after the 2025
   outcomes, so those timestamps cannot supply historical first-seen proof.
9. The committed ledger records the retrieved hashes, but the current runner
   does not compare cached inputs against it before parsing and scoring.

## Frozen admission rules

- reject a file if actual unique rows are not 1,448;
- reject a file if any excitation component exceeds absolute `1e-3`;
- reject a file missing either `C` or `P` states;
- group remaining files by embedded Issue Date;
- admit exactly one file per Issue Date using the deterministic rule above;
- never interpolate, average, repair or relabel a source value.

## Licence and custody boundary

Public retrieval is documented. No explicit redistribution permission was
assumed. Raw files remain outside Git. The URL/hash ledger permits manual
identity checking but is not yet an enforced replay input contract. A future
prospective run must capture the then-current licence or terms position,
retain raw files in authorized private custody, bind exact UTC publication or
first-seen evidence, and reject every ledger mismatch before scoring.
