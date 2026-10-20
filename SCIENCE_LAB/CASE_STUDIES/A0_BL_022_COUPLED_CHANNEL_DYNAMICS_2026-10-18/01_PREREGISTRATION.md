# A0-BL-022 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN / ADMITTED / ACTIVE_PENDING_LOCK`

## Typed system

```text
state x=(a,b,q) in C5 x C6 x C2
i5(a)=6a mod 30
i6(b)=5b mod 30
advance: a' = a+1 mod 5; b' = b+1 mod 6
event: e'=1 iff i5(a')=i6(b')
channel: q' = q xor e'
```

The two carriers are not identified. Equality is evaluated only between their
typed C30 port images. `q` is study-local channel memory, not energy, matter,
spin or a physical signal.

## Frozen controls and predictions

1. no step-equivariant direct function `C5 -> C6` exists;
2. the natural port sets intersect once, at phase zero;
3. every carrier pair returns after 30 steps, while every full coupled state
   returns first after 60 because one pulse occurs per 30 steps;
4. disabling the channel pulse returns every full state after 30;
5. a one-sided `C5` kick after step 7 remains detectable and cannot converge
   to the unperturbed deterministic orbit within 60 further steps, while the
   kicked state still has its own 60-step Return;
6. a matched shuffled C6 port assignment retains one event per 30 and period
   60 but moves the event to another typed carrier state, so period alone does
   not select canonical ports.

## Gates

`G1` typed source/port integrity; `G2` direct-map obstruction; `G3` all 60
coupled states have first period 60 and carrier Return 30; `G4` all uncoupled
states have period 30; `G5` exact event accounting; `G6` phase-kick memory and
post-kick Return; `G7` matched shuffled-port nonselection.

## Claim ceiling

Finite declared automaton only. No `O-C-O` or `MONAD(t)` mechanism, physical
flow, stability law, `.83` band, dodecahedron dynamics, universal coupling,
Human utility, novelty or publication claim.
