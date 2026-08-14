# A3 N1 Forward Action-Permutation Contract

Let canonical actions be `u[j]`, `j=0..4`. The N1 generator returns index permutation `p`. Define the sampled bijection in the **forward** direction:

`pi(u[j]) = u[p[j]]`.

For every original training record/path generated under physical action `a`:

- its null action label is `pi(a)`;
- TRAJECTORY stores that original path's terminal outcome under label `pi(a)`;
- LEARNED_FIELD stores the path under label `pi(a)` and constructs its natural-derivative label by subtracting `B*pi(a)` from the observed derivative;
- OOF and full-training refits consume these relabeled records in canonical row/action order;
- predicted score/rank coordinates retain the canonical physical action labels;
- a null carrier selecting label `b` selects physical action `b` in the existing all-action outcome table; no inverse map is used for outcome lookup and no new simulation occurs.

The inverse `pi^-1` is used only to explain which original training record appears under a requested refit label: records under label `b` originated at `pi^-1(b)`. It is never substituted for the forward relabeling rule.

## Distinguishing fixture

With index permutation `p=[1,2,0,4,3]`, original labels map `0→1, 1→2, 2→0, 3→4, 4→3`. Because the 3-cycle is not self-inverse, a record originally at index 0 must be stored under index 1, not index 2. A conforming test must reject the inverse result.
