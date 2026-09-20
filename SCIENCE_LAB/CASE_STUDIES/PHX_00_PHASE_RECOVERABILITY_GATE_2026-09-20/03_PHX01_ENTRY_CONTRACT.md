# PHX-01 — Entry Contract Proposed by PHX-00

PHX-01 may proceed only as an additive external E2 analysis of the four bound
`HZ_FZ_PUBLIC_01` CSV files.

## Required first stage

Before interpreting empirical results, validate the selected implementation on
deterministic synthetic controls covering:

1. 0, 90 and 180 degree offsets;
2. unequal amplitudes at fixed phase;
3. slow phase drift and a timestamped phase jump;
4. beating from nearby frequencies;
5. noisy phase locking;
6. spectrum-preserving phase randomization;
7. missing samples and clock jitter.

Tolerances, random seeds, window lengths, filters and edge exclusions must be
frozen before the empirical output is viewed.

## Empirical primary object

The primary relation is actuator-local force relative to displacement at the
declared 0.5 Hz or 1.0 Hz excitation. Analysis must retain the four source
records separately and must not imply continuous synchronization across files.

Primary observables:

- cycle-wise cross-spectral phase at the declared excitation;
- circular mean, circular dispersion and uncertainty across active cycles;
- phase-locking value on a justified narrowband representation;
- phase drift and declared phase-slip events;
- sensitivity to window placement, edge exclusion and amplitude threshold.

The existing source case identifies only active subsets of the nominal cycles.
PHX-01 must reuse or explicitly supersede that declared activity rule; it must
not silently treat inactive tails as driven cycles.

## Claim boundary

The strongest authorized conclusion is a descriptive statement about phase
stability or change in the external before/after records. It cannot establish
local apparatus repeatability, electrical-drive transfer, causal earthquake
effects or a universal invariant.

## Held work

`PMX-01` remains unstarted. No prime-index selection, morphogenesis endpoint or
multiple-testing family has been preregistered for these data.

