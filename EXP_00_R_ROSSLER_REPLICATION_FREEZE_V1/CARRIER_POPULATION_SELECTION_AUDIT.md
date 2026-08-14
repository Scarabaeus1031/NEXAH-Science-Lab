# Carrier Population Selection Audit

**Review status:** resolved before registered execution. No registered seed or outcome was accessed.

## Question

The draft restricted both primary carrier regressions to jointly supported states on which both TRAJECTORY and LEARNED_FIELD proposed a nonzero action. This gave the two carrier analyses the same rows, but row inclusion depended on both representations' outputs.

## A — Common-nonzero population

Let

\[
I(x)=1[\hat u_T(x)\ne0\ \land\ \hat u_F(x)\ne0].
\]

Both proposed actions are functions of the representations' scores, margins, and agreement. Conditioning on (I=1) can therefore change the distribution of coherence, estimator confidence, task difficulty, and carrier quality. In a causal reading, it conditions on a joint descendant of the two estimators and creates an avoidable selection/collider pathway. It also removes precisely the disagreements in which one representation selects the shared null action.

**Decision:** reject as the primary population.

## B — All jointly supported states

Retain every state for which both representations return complete rankings. The carrier-selected action may be any member of the frozen physical set, including (u=0). The paired endpoint remains

\[
\Delta J=J(x_H^{u^*})-J(x_H^0).
\]

For (u^*=0), (Delta J=0) identically and binary success under the frozen threshold (Delta J\le-0.01) is false. This is not imputation: it is the observed consequence of selecting the explicitly available null action. Both carrier analyses use the identical jointly supported population.

This endpoint estimates reliability of each representation's complete action-selection policy, including its decision to do nothing. It does not claim that zero is an active intervention.

**Decision:** adopt as the primary rule.

## C — Exogenous eligibility population

An alternative would define eligibility from pre-action state variables alone, such as target distance or phase. That avoids carrier-output conditioning but introduces an additional threshold, narrows the estimand, and has no existing scientific justification. It is unnecessary because option B is fully typed.

**Decision:** do not add.

## Frozen rule

Primary population: all jointly supported held-out states. Zero-action selections receive (Delta J=0) and `success = false`. Active-only carrier results may be reported descriptively as secondary analyses but cannot replace, rescue, or modify the primary endpoint.

This is a preregistration change relative to design draft v0 and is versioned in `EXP_00_R_PREREGISTRATION_FROZEN_V1.md` and `EXP_00_R_FROZEN_CONFIG.yaml`. The original design package remains unchanged.

