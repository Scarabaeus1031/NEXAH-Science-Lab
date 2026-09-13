# Cat, Basket and Corridor Formalization

## Typed spaces

For a declared body/system model `b`, let:

    Q_b                 configuration space
    X_b subseteq TQ_b   state space
    U_b                 admissible control space
    x_dot = f_b(x,u,t)  dynamics, including declared hybrid contact modes
    t in [0,T]          frozen horizon

The cat denotes a moving body/agent/system instance and its trajectory, not a point mass by default. The basket must be split into a state constraint set and a trajectory family:

    K_b(t) = {x in X_b : g_b(x,t) <= 0, h_b(x,t) = 0}

    T_feas(b) = {(x(.),u(.)) :
                 x_dot=f_b(x,u,t), x(0) in X0_b,
                 x(t) in K_b(t), u(t) in U_b,
                 contact/event rules hold,
                 energy, power and load bounds hold}

`T_feas(b)` is a subset of a function space. It is not identical to `K_b`, a configuration-space drawing, a reachable set or a viability kernel.

## Task feasibility

Let the path-functional return be vector-valued:

    F_b[x(.),u(.),c(.)] = y in Y

and let `A_r subseteq Y` be the Human-authorized acceptance set for target `r`. Then:

    T_task(b,r) = {gamma in T_feas(b) : F_b[gamma] in A_r}

This is the formal `family of viable task trajectories` for a fixed model and horizon. The term `viable` here is task-bounded; it must not be confused with an infinite-horizon viability kernel unless that stronger object is explicitly computed.

## Reachability and viability

    Reach_b(X0,T) = {x(T) : exists admissible u(.) and trajectory from X0}

    Viab_b(K) = {x0 in K : exists admissible u(.) with x(t) in K for all declared t}

Feasibility, reachability and viability answer different questions. The visual establishes none of them empirically.

## Corridor

A corridor requires an ambient topology or metric. Two admissible alternatives are:

1. **Trajectory corridor**: a connected subset

       C subseteq T_task(b,r)

   under a declared path metric `d_T` and topology.

2. **State-time tube**:

       C_X subseteq [0,T] x X_b

   such that a specified family of admissible trajectories remains inside it and reaches `A_r`.

Connectedness alone does not imply robustness, stability, high probability, or safety. A corridor may be empty, disconnected under another metric, or reachable only from some initial states.

## Different bodies

Body models `b1` and `b2` generally have different `Q_b`, dynamics, constraints and controls. Statements across them require explicit maps

    Phi_12 : T_feas(b1) -> Z
    Phi_22 : T_feas(b2) -> Z

into a common comparison space `Z`, or comparison only of their returns in `Y`. Without such maps, `same corridor` is ill-typed. The defensible statement is:

> Different declared body models may contain different feasible trajectories whose task returns fall in the same predeclared return class.

## Kaskadenz relation

For a path `gamma`, let `kappa(gamma)` be its declared sequence/timing record of transfer events from the closed predecessor model. Then:

    KASKADENZ = kappa(gamma)
    CAT_IN_THE_BASKET = T_task(b,r), or a declared corridor C within it

Thus:

    THE BASKET DEFINES THE ADMISSIBLE KASKADENZ FAMILY.
    THE DANCE SELECTS ONE TRAJECTORY.
    THE RETURN PERMITS A DECLARED COMPARISON.

This does not guarantee that every abstract event sequence is dynamically realizable.

## Status

    FEASIBLE_BODY_STATUS = BOUNDED_BODY_INDEXED_FEASIBLE_TRAJECTORY_FAMILY_SPECIFIED
    CORRIDOR_STATUS = TOPOLOGY_AND_METRIC_DEPENDENT_CONNECTED_SUBSET_SPECIFIED
    NEW_MATHEMATICS = NO
    NEW_PHYSICS = NO
    NEW_BIOMECHANICS = NO

