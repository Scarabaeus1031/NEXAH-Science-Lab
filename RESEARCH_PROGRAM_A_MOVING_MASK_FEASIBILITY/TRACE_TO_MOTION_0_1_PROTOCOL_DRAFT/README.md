# Trace-to-Motion 0.1 — Protocol Draft

Status: `DRAFT — OWNER APPROVAL REQUIRED`

Mode: protocol design and synthetic integrity validation only

Operational effect: `NONE`

## Purpose

Freeze a proposed acquisition and analysis contract for the twelve-sample
paired-reversal Trace-to-Motion 0.1 experiment. The protocol separates:

- a time-indexed planar trajectory;
- its direction-free trace representation;
- static and moving masked observations;
- deterministic reconstruction;
- evidence from interpretation.

## Authority boundary

This draft does not authorize:

- collection of Human data;
- scientific execution;
- a numbered Lab;
- a scientific result;
- a canonical operator;
- OLS modification;
- LANIF, ZERO, Fugenformel, handwriting-meaning, golf, body-motion or energy
  interpretation;
- publication, commit, push or deployment.

## Contents

1. [Acquisition and Analysis Protocol](01_ACQUISITION_AND_ANALYSIS_PROTOCOL.md)
2. [Data and Provenance Contract](02_DATA_AND_PROVENANCE_CONTRACT.md)
3. [Synthetic Dry-Run Validation](03_SYNTHETIC_DRY_RUN_VALIDATION.md)
4. [Independent Review Checklist](04_INDEPENDENT_REVIEW_CHECKLIST.md)
5. [Owner Approval Gate](05_OWNER_APPROVAL_GATE.md)
6. `dry_run/validate_protocol.py` — deterministic synthetic integrity validator
7. `dry_run/DRY_RUN_REPORT.json` — generated validation record

## Current disposition

The twelve-sample design, path definitions, coordinate frame, masks,
reconstruction rule, metrics and tolerances are frozen as a proposal inside
this draft. They acquire no execution authority until every item in
`05_OWNER_APPROVAL_GATE.md` is explicitly accepted.

## Next gate

`OWNER REVIEW OF SCIENTIFIC CHOICES`
