# Dependencies

## Necessary scientific dependencies

| Dependency | Why necessary | Current state |
|---|---|---|
| frozen state model | supplies reproducible reference state | model family defined; exact benchmark absent |
| frozen observation model | defines what each channel can record | contract defined; exact matrices absent |
| mask contract | separates static from temporal information loss | family defined; exact schedules absent |
| one history-dependent estimator | temporal effect is not meaningful without declared history behavior | estimator families listed; exact estimator absent |
| fixed weights and translation maps | makes the weighted estimate reproducible | formal roles defined; exact values/maps absent |
| information-matching rule | prevents motion from being confounded with removed sample count/exposure | required by existing falsification rule; not yet frozen |
| error metric and reacquisition rule | makes the primary hypothesis decidable | metrics defined; thresholds/persistence absent |
| simple baselines | tests whether added structure has explanatory value | specified in handoff and Mission 03 |
| epistemic record classes | prevents masked, reconstructed, underdetermined, and unknown from collapsing | established as an architectural precedent in Labs 0.2–0.4 |
| provenance and fixed seeds | permits replay and exposes tuning | required; no run package exists |

## Governance dependencies

- Thomas must authorize a design mission.
- A canonical Research/Validation owner must accept the protocol.
- A repository and protocol-review gate must be named.
- Implementation requires a separate later authorization.

These are activation dependencies, not evidence for the hypothesis.

## Dependency removal tests

### Without Q°

`SURVIVES.`

The experiment can refer to the same declared weighted estimator without relying on Q° as a scientific object. Removing the label changes provenance and terminology, not the input/output test.

### Without Pattern of Orientation

`SURVIVES.`

Pattern explains how the question was reached. It supplies no required variable, metric, baseline, or validity criterion.

### Without Moving Mask visuals

`SURVIVES.`

The handoff's equations and protocol contracts are sufficient. Visuals are secondary outputs or explanatory evidence and cannot validate the effect.

### Without Rödelheim Labs 0.2–0.4

`SURVIVES WITH REDECLARATION.`

The numerical question remains viable, but the protocol must restate the source/record distinction, unknown-state policy, reconstruction boundary, and provenance preservation. The earlier Labs are strong methodological precedent, not empirical support for Moving Mask.

## Non-dependencies

- OLS extension;
- new operator status;
- Library or Are.na publication;
- Lab numbering;
- biological or chemical application;
- JANUS, Gate, Hopf, Binder, Whip, or control architecture;
- proof of a general representation theory.
