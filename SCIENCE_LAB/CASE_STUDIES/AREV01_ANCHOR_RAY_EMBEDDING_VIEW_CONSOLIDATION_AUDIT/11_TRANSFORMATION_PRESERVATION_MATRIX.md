# Transformation Preservation Matrix

Assume the abstract graph identity is carried unchanged and the listed map acts on a Euclidean embedding. “Projection” denotes a general view operation; special cameras may preserve more, but no such special case is presumed.

| Transform | Adjacency | Degree | Collinearity | Parallelism | Euclidean length | Unsigned angle | Orientation | Source angle preserved in resulting view |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| translation | yes | yes | yes | yes | yes | yes | yes | yes, for the same Euclidean view plane |
| rotation | yes | yes | yes | yes | yes | yes | yes | yes, for the same Euclidean view plane |
| reflection | yes | yes | yes | yes | yes | yes | no | yes in unsigned magnitude |
| uniform positive scaling | yes | yes | yes | yes | no, scaled | yes | yes | yes, for the same Euclidean view plane |
| invertible affine shear | yes | yes | yes | yes | no in general | no in general | yes if determinant positive; reversed if negative | no in general |
| general projection/view | graph may remain declared but may not be visually recoverable | same qualification | conditional on projection class | no in general | no in general | no in general | conditional | no in general |

Visible occlusion, merging or clipping can make adjacency and degree unrecoverable from a view even when the source graph has not changed. This is a reconstruction limitation, not a mutation of `G`.

`MIRROR_EQUALS_REFLECTION=ONLY_IF_TRANSFORMATION_RULE_DECLARED`

`PROJECTION_PRESERVES_ANGLES_IN_GENERAL=NO`

`AFFINE_EQUIVALENCE_EQUALS_EUCLIDEAN_EQUIVALENCE=NO`
