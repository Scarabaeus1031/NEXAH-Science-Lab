# Q106 Square-Index Readout — Navigator candidate

Status: `INTERNAL CANDIDATE / UNBOUND / NOT ADMITTED / NOT PUBLIC`

This is the current **thematic home** of the Q106 square-index readout lens in
the NEXAH Navigator. It has no stable Navigator ID yet because the topic is
still being sorted.

The typed reading is:

```text
Q106
  -> R(Q106)=(9,16,25,106)
  -> (3^2,4^2,5^2)
  -> P_square(3,4,5)=(23,53,97)
  -> 106=2*p16=p25+3^2
```

The bounded contrast adds:

```text
C_k=2*p_(k^2):  46 <-> 106 <-> 194
return equation: C_k-p_((k+1)^2)=(k-1)^2
declared hits for 2<=k<=1000: [4]
```

## Two roles, no collapse

- **NN / NEXAH Navigator:** thematic location and future navigation role.
- **A0 Evidence:** provenance and exact audit support.

The relation is `evidence-supported-by`. It does not identify the candidate
with A0 and does not admit a new Navigator object, Study, Family, PENT layer,
operator or Prime Pascal Pyramid.

Validation:

```bash
node validate_candidate.mjs
```
