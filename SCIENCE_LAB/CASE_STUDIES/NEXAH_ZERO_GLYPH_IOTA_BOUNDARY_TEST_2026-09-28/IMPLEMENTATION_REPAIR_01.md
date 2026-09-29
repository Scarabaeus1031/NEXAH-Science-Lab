# Implementation repair 01

The first primary and replay both returned T5 false because the implementation
serialized `-0.0` and `0.0` as different strings while counting rotated ideal
circle states. In real arithmetic these values are equal, and Python numeric
comparison also treats them as equal.

The retained outputs are under `failed_attempts/attempt_01_negative_zero_bug/`.
The repair canonicalizes rounded zero coordinates to `0.0` and counts tuples
by numeric equality. No preregistered sample, threshold, test, hypothesis or
decision rule changed.
