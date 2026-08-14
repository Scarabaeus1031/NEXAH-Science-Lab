# A5XE Typed Failure-State Contract

The end-to-end derivation returns exactly one execution state:

1. `IMPLEMENTATION_FAILURE`: N5-SYNTH semantic failure before release. `release_permitted=false`; no classification.
2. `INVALID_EXPERIMENT`: malformed/incomplete evidence, failed postauthorization validity, N5-RUN failure or contradictory model provenance. No classification survives.
3. `VALID_SCIENTIFIC_RESULT`: all validity gates pass; P1–P5 and the accepted Rössler label are derived.

Within valid evidence, a failed scientific proposition is not invalidity. Dominance nonpositive/dominated, a null comparison failure or a nonpositive endpoint metric sets its proposition false and continues through the accepted classifier.

Classification precedence remains invalid → replicated → partial → not replicated. Cross-system invalidity maps to `INCONCLUSIVE`; strict cross-system replication remains unreachable.
