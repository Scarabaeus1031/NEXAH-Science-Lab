# NEXAH Compass-Binder v0.1

Date: `2026-09-15`

Status: `DESCRIPTIVE_E2_SUPPLEMENT_NO_PROFILE_ACTIVATION`

Binder ID: `hz-fz-contrast-compass:paired-median-contrast-v1`

## Purpose

The Compass-Binder connects two declared contrasts from the same three Hz/Fz
source runs without changing their units or claiming a new physical mechanism.
It makes the Cartesian contrast view, polar view and cycle path traceable to
the same frozen source record.

## Inputs and cuts

The source scope is the 40 mm, eight-wire cycle set at 0.1, 0.5 and 1.0 Hz.
The source CSV and its SHA-256 digest are mandatory.

- Cut A / left contrast: `ΔL = median(0.5 Hz) − median(0.1 Hz)` in J/cycle.
- Cut B / return contrast: `ΔR = median(0.5 Hz) − median(1.0 Hz)` in J/cycle.
- Connected state: `(ΔL, ΔR)`, its radius and its angle.

## Alignment rule

The binder must declare one of two cycle pairing rules:

1. `active_order` pairs the first active cycle of each accepted run, then the
   second, and so on.
2. `nominal_cycle_label` pairs only identical source cycle labels shared by all
   three runs.

The default display is `active_order`, but every report must retain the
`nominal_cycle_label` sensitivity view. The binder may not silently relabel a
cycle or treat the two paths as interchangeable.

## Required record

Every binder record contains:

- immutable source identity and digest;
- cut definitions, quantity and unit;
- pairing rule and per-node source labels;
- path coordinates, crossings and interpolation rule;
- joint moving-block bootstrap settings and uncertainty summaries;
- all screened reference rays, including their residuals;
- a classification and explicit claim boundary.

## Reference policy

`sqrt(2)`, `phi`, `2:1`, `2*sqrt(2)`, `gamma^-2` and `pi` are exploratory
coordinate references. They are screened together. A visually close point or
ray is not promoted to a constant identification, law or mechanism. Post-hoc
reference selection is forbidden as evidence.

## Invariants and prohibitions

The binder preserves source identity, units, nominal cycle label and active
order. It may rotate or re-express coordinates, but it may not average unlike
units, manufacture missing cycles, convert E2 to E3, activate the fail-closed
Hz/Fz runtime profile, or create an independent observation from a second view
of the same data.

## Decision rule

The output is a descriptive supplement. Alignment-sensitive crossings,
bootstrap lattice bands, reflection candidates and reference-ray proximity are
reported as structure to test. They remain inconclusive until a source-bound
measurement or independent replication supplies new evidence.
