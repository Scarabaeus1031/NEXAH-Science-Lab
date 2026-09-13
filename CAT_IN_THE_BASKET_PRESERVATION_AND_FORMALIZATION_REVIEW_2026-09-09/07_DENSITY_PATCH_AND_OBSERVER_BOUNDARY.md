# Density, Patch and Observer Boundary

## Local patch

If `B` is a smooth `n`-manifold and `U subseteq B` is open, a coordinate chart is:

    psi : U -> psi(U) subseteq R^n

with the required homeomorphism and smooth compatibility conditions. The coordinates describe only `U`; overlap maps are needed to relate patches. If the feasible object has corners, inequality boundaries, singular contact strata or discrete hybrid modes, an ordinary smooth chart may be invalid. Then use a labeled local representation or a stratified/hybrid chart contract rather than silently claiming a manifold.

A visual crop, zoom or colored rectangle is `VISUAL_LOCAL_PATCH` only. It becomes a mathematical chart only after domain, codomain, invertibility-on-domain and transition rules are supplied.

## Path density

For one time-parameterized trajectory `gamma=(x(.),u(.))`, a normalized state occupation measure may be defined by:

    mu_gamma(A) = (1/T) integral_0^T 1_A(x(t)) dt

For trials `gamma_1,...,gamma_N`, an empirical occupation measure is:

    mu_N = (1/N) sum_n mu_(gamma_n)

A density `rho=d mu/d lambda` exists only relative to a declared reference measure `lambda`; an estimator `rho_hat` additionally requires samples, sampling clock, weights, bandwidth/binning/kernel, boundary treatment, coordinate/Jacobian handling, transient rule and uncertainty.

Time sampling, arc-length sampling and event sampling yield different occupancies. Projection can merge distinct source states. Longer dwell time can raise occupancy without implying attraction, robustness, control preference or causal stability. This agrees with the local GRC01 audit: `TRAJECTORY_EQUALS_DENSITY=NO` and `DENSITY_EQUALS_STABILITY=NO`.

Until data and estimator exist:

    PATH_DENSITY_STATUS = SYMBOL_DEFINED_NO_DENSITY_CLAIM_NO_DATA

The density surface in the visual is illustrative only.

## Observer and projection

For observer/view `p`:

    y_p = O_p(gamma)
    Fiber_p(y_p) = {gamma in T_task : O_p(gamma)=y_p}

and information ledger:

    ILAU_p = {retained, lost, introduced, unresolved}

Different paths can share one projection. Multiple views contract a reconstruction fiber only when they add compatible independent constraints; an empty intersection means inconsistency, not identification. The observer record must include source identity, frame, time/sample rule, projection, resolution, comparator, uncertainty and claim ceiling.

## Return and residual

    y = F[gamma]
    e = compare(y, target, declared_metric_or_partition)
    residual = {numeric_error, projection_loss, unresolved_path_fiber,
                model_mismatch, provenance_gap}

These residual types cannot be summed without a declared common representation. A small output error does not prove state reconstruction or a unique path.

    LOCAL_PATCH_STATUS = CHART_ONLY_UNDER_REGULARITY_OTHERWISE_BOUNDED_LOCAL_REPRESENTATION
    PATH_DENSITY_STATUS = ESTIMATOR_AND_MEASURE_BOUND_NO_CURRENT_DATA

