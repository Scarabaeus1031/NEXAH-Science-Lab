# Adversarial Controls

1. Every lossy map is executed and must return `INFORMATION_LOST` or
   `UNIDENTIFIABLE` with null recovery/error.
2. `L1_SIGN_SQUARE` records two valid preimages explicitly.
3. F2 versus F2_CF must collide under `C1_DISTANCE_ORDER` while differing under
   `C3_ORIENTATION`.
4. F3 versus F3_CF must collide under `C5_CONNECTIVITY` while differing under
   `C2_ADJACENCY`.
5. Large registered perturbations may change structure; numerical closeness is
   never allowed to override a certificate change.
6. All registered cells must appear once. Exceptions become `INVALID`; they are
   retained.
7. Replay must be byte-identical. Result JSON excludes clocks, platform strings
   and nondeterministic iteration order.

