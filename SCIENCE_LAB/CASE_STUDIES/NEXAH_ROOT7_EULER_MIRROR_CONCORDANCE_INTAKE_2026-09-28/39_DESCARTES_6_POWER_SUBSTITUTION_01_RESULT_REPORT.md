# DESCARTES_6_POWER_SUBSTITUTION_01 result report

Date: `2026-09-29`

## Result

```text
PASS_DESCARTES_6_POWER_SUBSTITUTION__EXACT_COORDINATE_CHANGE_ONLY
```

All `8/8` checks passed. Under the printed substitution `y=x+6n`,

```text
y^6 - 35ny^5 + 504n^2y^4 - 3780n^3y^3
    + 15120n^4y^2 - 27216n^5y
```

becomes exactly

```text
x^6 + nx^5 - 6n^2x^4 + 36n^3x^3
    - 216n^4x^2 + 1296n^5x - 7776n^6.
```

The six-term tail is precisely

```text
1, -6, 36, -216, 1296, -7776 = (-6)^0 ... (-6)^5.
```

Reverse substitution recovers the source polynomial exactly. The apparent
coefficient complexity is therefore a coordinate-shift view of a simple
alternating power ladder. Figures 11 and 25 remain historical geometric
context; no modern operator semantics were imported.

Machine-result SHA-256:

```text
5246683edd7301c3e9136a5963f0a7e166f36c73ea551a80ff320372f8fa9b60
```
