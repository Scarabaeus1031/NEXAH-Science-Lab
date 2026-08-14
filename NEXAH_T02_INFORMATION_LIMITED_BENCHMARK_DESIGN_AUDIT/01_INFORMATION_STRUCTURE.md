# Information Structure

## Surviving candidate setting

A hidden finite-state Markov process `X_t` generates a binary externally defined
decision target `Y_t` (for example, whether a specified event occurs within the
next `H` transitions). A frozen sequence of deterministic many-to-one maps yields
stages `X0...Xn`. Diagnostics observe only finite sequences
`O_i=h_i(X_i)`—not transition kernels, hidden-state identities or aggregation
maps.

```text
hidden X, maps, population law, true risks
        -> finite common observation packet
        -> diagnostic method
        -> ACCEPT_STAGE_i / REQUEST_SOURCE / UNKNOWN
        -> external decision cost
```

## Common observation packet

Every method receives exactly:

- the same `m_train` independent trajectories at every stage;
- the same timestamps/trajectory boundaries;
- training task labels `Y` attached to times, not hidden-state identities;
- the same `m_validation` labeled trajectories for frozen calibration;
- the same unlabeled deployment/held-out stage trajectories;
- stage order and task definition `(Y,H)`;
- the same CPU-time, memory and query budget;
- no cross-stage state correspondence beyond common trajectory/time index.

## Hidden from every diagnostic

- hidden states and state count;
- exact transition kernel and aggregation maps;
- source-to-stage state correspondence;
- population Bayes risks, conditional information and true first-loss stage;
- test labels and future outcomes;
- generator family/case parameter labels.

## Scorer-only information

The scorer holds an independently generated, effectively exact evaluation sample
and the sealed generative law. It computes population-level task risk for each
stage, the optimal permitted action and realized downstream loss. Diagnostics
never see these quantities.

This restriction is operationally justified: finite logged trajectories with
outcomes and anonymous/aggregated state labels are common in monitoring and model
selection, whereas oracle aggregation maps and population risks are not.

