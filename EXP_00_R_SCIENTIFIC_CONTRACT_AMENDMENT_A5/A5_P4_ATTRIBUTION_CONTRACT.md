# A5 P4 Attribution Contract

## Reconstructed authority

V1 P4 requires positive direction and log-loss gain for every preregistered carrier/leave-one-representation attribution analysis after representation score/margin controls. V1 preregisters two symmetric carrier analyses and separately calls TRAJECTORY-only, LEARNED_FIELD-only, and fusion mandatory attribution diagnostics; only fusion is explicitly declared secondary. With exactly two representations, removing either leaves one ranking and therefore no Kendall pair and no `C_tau`.

## Exact registry

Classification-critical analyses are exactly `T_PRIMARY_CARRIER` and `F_PRIMARY_CARRIER` on the same frozen jointly supported primary row IDs, including zero-action rows. For each, the baseline contains all frozen covariates including both representations' best score and top-two margin; the augmented model adds standardized `C_tau` only. Each requires coefficient `>0` and held-out baseline-minus-augmented log loss `>0`.

Mandatory report-only analyses are exactly `TRAJECTORY_ONLY_OUTCOME_PREDICTION`, `LEARNED_FIELD_ONLY_OUTCOME_PREDICTION`, and `EQUAL_SCORE_FUSION_CARRIER`. Missing/nonfinite/provenance-mismatched diagnostics fail `PROVENANCE_COMPLETE`, making the experiment invalid, but their scientific values cannot change P4 or rescue another criterion.

For the two single-view diagnostics, “only” means the matching carrier endpoint and the frozen model/popu­lation/split, with the other representation's best-score and margin columns removed. The named representation's best score and margin remain, together with all non-representation baseline covariates and carrier action magnitude/sign. Report held-out log loss, AUC, Brier score, calibration fields, coefficient vector, and per-seed metrics. No coherence coefficient or coherence gain is defined. Fusion follows frozen within-state min-max score fusion and is secondary.

## Executable P4

`P4 = critical_carriers_pass AND score_margin_controls_present AND per_seed_pass_T AND per_seed_pass_F AND dominance_pass_T AND dominance_pass_F`.

`critical_carriers_pass` means, for each exact member of `{T_PRIMARY_CARRIER,F_PRIMARY_CARRIER}`, finite standardized coherence coefficient `>0` and finite held-out log-loss gain `>0`. Per-seed pass means at least 21 of the 30 registered test seeds have direction `>=0`, using exact frozen zero conventions. Dominance is A5 exact rational PASS. No report-only numeric value appears in this Boolean expression.

**NEW PROSPECTIVE SCIENTIFIC CHOICE:** the single-view predictive diagnostics are mandatory-report-only, not P4 classification-critical.

