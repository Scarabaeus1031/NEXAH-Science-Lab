# EXP-ORION-RS2-001 immutable preregistration lock

Lock timestamp UTC: `2026-08-10T20:01:16Z`  
Reviewed preregistration: `ORION_SECOND_ORDER_RELATIONAL_STABILITY_PREREGISTRATION/`  
Reviewed preregistration SHA-256: `5a9bd087fa6deff38e7b94753346ba13836e6dc9c7da8c94ae0a1991542f4856`  
Review state: `CRITICAL 0 / MAJOR 0 / MINOR 4`  
**RESULT KNOWN AT LOCK TIME: NO**  
**EXECUTED AT LOCK TIME: NO**

## Frozen primary objects

- experiment: `EXP-ORION-RS2-001`;
- population: 512 deterministic positive base-10, precision-18 fractional
  encodings from the reviewed SHAKE256 source contract;
- support: all six `T23` transitions and core indices `C={3,...,14}`, exactly
  `512*6*12=36,864` comparison cells;
- `A2`: normalized width-2 block-mean field;
- `A3`: normalized width-3 block-mean field;
- `Q`: data-decorated weighted overlap contrast, equivalently
  `q(i)=a2(i)-a3(i)`;
- action: `T23:(s2,s3)->(s2+1 mod 2,s3+1 mod 3)` over CRT orbit
  `0->1->2->3->4->5->0`;
- sole transport: `(rho_T f)(i+1)=f(i)` on the registered support;
- `Delta_2=(1/12) sum |a2'(i+1)-a2(i)|`;
- `Delta_3=(1/12) sum |a3'(i+1)-a3(i)|`;
- `Delta_R=(1/24) sum |q'(i+1)-q(i)|`;
- `M_(x,c)=min(Delta_2,Delta_3)-Delta_R`;
- population statistic:
  `M_bar=(1/512) sum_x [(1/6) sum_c M_(x,c)]`.

## Frozen gates and inference

- informativeness: at least 90% of all source-transition units have both
  `Delta_2>0` and `Delta_3>0`;
- nonseparability: exact `2^18` binary precision-18 fixture audit for all six
  phases; Q not reconstructible from A2 alone or A3 alone, jointly exact;
- construction audit: fixture domain contains `M>0`, `M<=0`, and at least two
  distinct positive `Delta_R` values;
- primary null: N4, uniform permutation of twelve correspondence coordinates,
  same permutation for corresponding pre/post G3 trajectory;
- N4 generator: SHAKE256 counter stream with unbiased Fisher-Yates;
- N4 master seed:
  `3e1a7ffb850aecb9f8c1da34556e2d97edcba243058645858740662ece9ce3cf`;
- exactly 9,999 N4 realizations, duplicates retained;
- empirical Q99: probability 0.99, method `higher`;
- p-value: `(1 + count(null >= observed))/10,000`, upper tail;
- effect threshold: `M_bar >= 0.05`;
- null criterion: observed `M_bar > Q99` and `p<=0.01`;
- D1 fixed relative-phase destruction: reduction at least 0.05 and statistic
  at or below primary N4 Q99;
- D2 frozen correspondence destruction: same degradation requirements;
- D3 exact degree-preserving rewiring contract: same degradation requirements;
- D4 positive common translation: exact rational `Delta_R=0` and interval
  bijection;
- information boundary: separate `FIRST_ORDER_INPUT`, `RELATION_INPUT`, and
  `NULL_RELATION_INPUT`; N4 cannot access authentic kappa; opaque identities;
- provenance, exact support, schema, transport and leakage checks fail closed;
- exact rational scientific arithmetic and canonical deterministic result;
- primary run plus independently generated clean replay; scientific-result
  bytes and SHA-256 must be identical.

## Frozen decisions

`RELATIONALLY_STABLE` requires the conjunction of provenance PASS, support
exactly 36,864, transport PASS, informativeness PASS, nonseparability PASS,
construction audit PASS, `M_bar>=0.05`, observed above N4 Q99, `p_N4<=0.01`,
D1-D4 PASS, no leakage, and byte-identical clean replay.

`LEE_CANDIDATE` is evaluated only after `RELATIONALLY_STABLE` and additionally
requires the reviewed N3 unrelated-source criterion, nonseparability,
construction audit, D1-D3 degradation and identical replay. `LEE_EFFECT` is
forbidden.

Q receives a logically separate ORION class: `INVARIANT`, `EQUIVARIANT`,
`ROBUST`, `REPRESENTATION_DEPENDENT`, or `UNDEFINED`, exactly under the reviewed
rules. `SECOND_ORDER_ROBUST` is not awardable by this protocol.

No metric, source law, support, observable, transform, transport, normalizer,
threshold, null, seed, control, gate, class or interpretation may change after
this lock. Scale, critical-line, 5+1, directional/dodecahedral and later NEXAH
interpretations remain out of scope.
