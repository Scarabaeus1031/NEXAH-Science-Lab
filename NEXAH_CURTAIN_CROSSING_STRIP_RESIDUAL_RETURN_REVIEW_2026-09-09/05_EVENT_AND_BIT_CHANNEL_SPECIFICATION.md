# Event and Bit-Channel Specification

## Event sequence

Given a source-bound trajectory and gate,

`E={t_k : g(x(t_k))=0 and direction/tangency rule accepts k}`.

Each event record needs: event ID, bracket `[t_i,t_{i+1}]`, interpolated/root-solved `t_k`, pre/post signs, `gdot` or direction, state estimate, projection/frame, tolerance, uncertainty, and source hashes.

Sign-change detection alone misses tangencies and can miss multiple roots within one sampling step. Current SciPy documentation likewise warns that event location based on stepwise sign changes can miss multiple crossings in a step; see [`solve_ivp` events](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html).

## Optional binary channel

Only after windows `W_j=[s_j,s_{j+1})` are frozen:

`b_j=1` iff at least one accepted `t_k∈W_j`; otherwise `b_j=0`.

This loses multiplicity unless an event count `c_j` is also retained. Boundary conventions must prevent double assignment at bin edges.

## Required reports

- inter-event intervals `Δt_k=t_{k+1}-t_k`;
- density `N/(T_1-T_0)` with observation exposure;
- multiplicity and direction;
- clustering/burstiness, with the chosen statistic declared;
- sensitivity to time window, gate threshold/tolerance and hysteresis;
- sampling-step and interpolation sweep;
- missed-root/aliasing analysis;
- comparison to time-shifted and random-gate events.

## Repository finding

No executable lineage was found that maps the requested pink/red strips to phase wrap, reference-direction crossing, sign change, threshold, peak, synchronization event or manual annotation. Existing vertical-line calls belong to other plots. Therefore the requested strip event sequence cannot be reconstructed.

