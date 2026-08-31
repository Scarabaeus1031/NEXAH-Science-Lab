# 09 — Mandelbrot–Julia Quaternion Interface

## Preserved closed baseline

MJPR-01 remains the ordinary complex system

`f_c(z)=z²+c`, with `z,c∈C`,

and its actual numerical intermediate remains `E_c^{W,G,N,R}`, not exact `J_c`.

## Slice control

Embed the complex system into one slice using the algebra isomorphism

`φ_u(a+bi)=a+bu`.

If both state and parameter remain in `C_u`, then

`φ_u(z²+c)=φ_u(z)²+φ_u(c)`.

Thus moving the entire registered system from `C_i` to `C_j` is an isomorphic copy of ordinary complex quadratic dynamics. It does not require full quaternion algebra.

## Genuine quaternion interface—not executed

A distinct test would first need to define

`q_{n+1}=q_n²+c_H`, with `q_n,c_H∈H`,

plus parameter/state domains, multiplication convention, escape/norm rule, slice/full-space restriction, sampling, observation, and reconstruction semantics. Noncommutativity makes more general coefficient placement/order material. None of this was run or imported into MJPR-01.

`MJPR_COMPLEX_DYNAMICS_PRESERVED=YES`  
`QUATERNION_MANDELBROT_TEST_EXECUTED=NO`  
`QUATERNION_INTERPRETATION_OF_MJPR_ESTABLISHED=NO`

