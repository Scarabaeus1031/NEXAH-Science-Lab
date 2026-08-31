# 07 — Orientation versus Direction

S1 supplies a recoverable marker angle and therefore an oriented radial ray.
Static geometry still supplies no time ordering and no displacement sequence.
It does not select clockwise/counterclockwise, forward/backward,
inward/outward motion.

## Chirality control

S3 replaces B with a fixed bent feature C: a radial stem plus a short tangential
arm on its counterclockwise side. This distinguishes its mirror image and
therefore encodes handedness as well as registered orientation. The object
remains static.

```text
ASYMMETRY_PROVIDES_ORIENTATION_INFORMATION=YES
DIRECTION_FROM_STATIC_ASYMMETRY=NO
CHIRALITY_TESTED=YES
CHIRALITY_DISTINGUISHES_MIRROR_HANDEDNESS=YES
CHIRALITY_IMPLIES_MOTION=NO
```
