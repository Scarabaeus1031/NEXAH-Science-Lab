# Limitations

1. All studies are synthetic and use finite, registered families and
   transformations; external validity is untested.
2. Exact certificate equality is only one operationalization of robustness.
3. Counterfactual discrimination depends on the registered counterfactual set.
4. Collision counts depend on the certificate and sampled system collection.
5. Study 1 is small and descriptive.
6. Studies 1 and 2 use the same historical implementation and contain hard-coded
   local checkout paths. A temporary-copy path adapter removes that location
   dependency without altering frozen files, but Study 2 still fails exact replay.
7. Study 3 is implementation-independent of that codebase and passed replay in
   the locked owner-gate runtime.
8. The certificate ladder did not form a strictly monotone information order.
9. No registered certificate satisfied the joint high-robustness/high-
   discrimination gate in Studies 2 or 3.
10. Correlations across seven certificates are descriptive and do not establish
    a universal trade-off law or causal mechanism.
11. No physical system, real application, prediction, control action, or
    early-warning capability was tested.
12. Authorship, license applicability to all copied untracked research
    artifacts, and final citation metadata require owner confirmation.
