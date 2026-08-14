# A1 N5 Adversarial Review

## Verdict

**N5 CONTRACT: PASS** as a scientific prose contract. Machine-readable omissions are separately recorded in the prose/YAML audit.

## Scientific assessment

The two-tier choice is defensible:

- N5-SYNTH tests implementation integrity before registered access.
- N5-RUN tests the authorized representation pipeline on actual registered inputs without using intervention outcomes.

This does not assert a new empirical invariance hypothesis. Its threshold is a validity expectation for coordinate re-expression of the same mathematical pipeline. Failure states are correctly separated: synthetic failure is implementation failure; registered pipeline failure is invalidity; neither is nonreplication.

## Typed-rule audit

| Item | A1 rule | Assessment |
|---|---|---|
| Synthetic population | exact 125-state training grid and 48-query grid; original jointly supported queries | explicit |
| Registered population | original untransformed jointly supported held-out queries including zero carrier actions | explicit and frozen before transformed inspection |
| Transform | first 12 lexicographically sorted determinant +1 signed-permutation matrices | explicit |
| Physical semantics | `x'=Qx`, `B'=QB`, scalar `u` unchanged | preserved |
| Target/normalization | transformed mean/scale/center; radius unchanged; original high-x subset not reselected | explicit |
| Refit | both representations freshly refitted per matrix | explicit |
| Support | refitted/evaluated in transformed coordinates | explicit |
| Transformed membership | any missing transformed ranking fails; row is not dropped | explicit |
| Inverse registration | state-valued terminal outputs inverse-registered before original objective | explicit |
| Ranking comparison | query-level five-action Kendall tau-b; minimum over all required axes | explicit |
| Undefined tau | identical constant vectors →1; other undefined case →0 | explicit |
| Threshold/count | tau ≥0.99; 12 transforms once per tier | explicit |
| Stage | N5-RUN after original support, before outcomes/nulls/classification | no post-treatment conditioning |

## Counterexamples

| Fixture | Required result | Contract result |
|---|---|---|
| All tau values 1.0 and complete rankings | tier passes | PASS |
| One N5-SYNTH tau 0.98 | execution never enabled | `IMPLEMENTATION_FAILURE` |
| One N5-RUN tau 0.98 | no scientific label | `INVALID EXPERIMENT` |
| Both weak-rank vectors constant/equal | defined comparison | tau=1 |
| One rank vector constant | adverse undefined handling | tau=0, tier fails |
| Original row supported; transformed pipeline abstains | no favorable row deletion | tier fails |
| P1–P3 all positive; N5-RUN fails | invalidity dominates | `INVALID EXPERIMENT` |

No ambiguous scientific classification was found in the N5 prose. The YAML must still be completed in a future amendment because it omits the synthetic estimator/support parameters.
