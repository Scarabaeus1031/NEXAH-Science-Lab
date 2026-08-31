# 06 — Complex Slice Audit

Let `u` be a pure unit quaternion satisfying `u²=-1`. For `a,b,c,d∈R`,

`(a+bu)(c+du)=(ac-bd)+(ad+bc)u`,

so `C_u={a+bu}` is closed and follows ordinary complex multiplication. No independent `j` or `k` is needed inside one fixed slice.

The map

`φ_{i→j}(a+bi)=a+bj`

is a real-algebra isomorphism from `C_i` to `C_j`. It preserves addition and multiplication, but it maps one element to a generally different element of `H`. With the standard fixed basis:

`C_i != C_j` as subsets of `H`, while `C_i ≅ C_j` as complex algebras.

## Historical i/j changes

No inspected historical source declares state objects in `H` and then demonstrates cross-slice multiplication. An i/j replacement is therefore fully explainable as one of:

- same complex plane with a relabeled basis;
- rotated/re-embedded complex plane;
- different complex slice in `H` connected by a declared isomorphism;
- coordinate/view convention.

It is not evidence of a full quaternion state or quaternion operation.

`COMPLEX_SLICE_REQUIRES_FULL_H=NO`  
`CI_AND_CJ_ISOMORPHIC_AS_COMPLEX_ALGEBRAS=YES`  
`CI_AND_CJ_IDENTICAL_SUBSETS_OF_H=NO`

