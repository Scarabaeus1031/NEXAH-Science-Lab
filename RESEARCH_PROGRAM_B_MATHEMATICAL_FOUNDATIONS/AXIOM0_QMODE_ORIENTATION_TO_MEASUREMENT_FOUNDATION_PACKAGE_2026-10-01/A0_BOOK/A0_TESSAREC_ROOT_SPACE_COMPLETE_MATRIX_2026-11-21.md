# A0 · Tessarec Root Space — Complete Matrix

Date: `2026-11-21`  
Status: `BOUNDED FORMALIZATION / DOCUMENTARY RETURN`  
Identity: reuses `MOD:TESSAREC` and `ART:TESSAREC:ROOT_SPACE_8_16`  
Navigator effect: `REUSE + EXTEND / NEW ID 0 / RELATION 0 / ALIAS 0`

## Result in one sentence

The finite stones are the sixteen binary addresses of `Q4`; the mathematically
defined *in-between* is the open four-dimensional cell bounded by those
addresses.  With root-length axes it is a four-dimensional orthotope.  Only
after coordinate normalization is it a regular combinatorial tesseract.

## 1. Root carrier

Let

\[
B=\operatorname{diag}(\sqrt2,\sqrt3,\sqrt5,\sqrt7),\qquad
G=B^{\mathsf T}B=\operatorname{diag}(2,3,5,7).
\]

For every binary address
\(\varepsilon=(\varepsilon_1,\ldots,\varepsilon_4)\in\{0,1\}^4\), define

\[
v_\varepsilon=B\varepsilon
=(\varepsilon_1\sqrt2,\varepsilon_2\sqrt3,
  \varepsilon_3\sqrt5,\varepsilon_4\sqrt7).
\]

This yields exactly sixteen vertices and thirty-two one-bit edges.  The four
edge types have squared lengths `2, 3, 5, 7`.  Consequently the raw body is a
root-scaled **4-orthotope**, not a regular tesseract.  Applying
\(B^{-1}\) returns the normalized coordinates \(\varepsilon\in\{0,1\}^4\)
and the standard `Q4` tesseract.

## 2. What “Complete Matrix” means here

The term is fixed to four explicit records:

1. **basis matrix** \(B\), carrying the root scales;
2. **Gram matrix** \(G\), carrying the exact metric;
3. **adjacency matrix** \(A\in\{0,1\}^{16\times16}\), where
   \(A_{\varepsilon\eta}=1\) exactly when the Hamming distance is one;
4. **squared-distance matrix**

\[
D_{\varepsilon\eta}
=(\varepsilon-\eta)^{\mathsf T}G(\varepsilon-\eta)
=\sum_{i=1}^4p_i\,|\varepsilon_i-\eta_i|,
\quad(p_1,p_2,p_3,p_4)=(2,3,5,7).
\]

The opposite-corner value is therefore
\(D_{0000,1111}=2+3+5+7=17\).

The number grids inside the supplied artwork are not imported as a law because
their generating rule is not stated.  They remain visual provenance.

## 3. The in-between

The open root cell is

\[
\mathcal C^°=(0,\sqrt2)\times(0,\sqrt3)\times(0,\sqrt5)\times(0,\sqrt7).
\]

After normalization it is `(0,1)^4`.  The sixteen vertices are finite
addresses; the interior contains a continuum of points.  This is a precise
version of “between the stones”, but it is not a literal hole between rational
numbers: both \(\mathbb Q\) and \(\mathbb R\setminus\mathbb Q\) are dense in
\(\mathbb R\).

## 4. Algebraic cross-check — same count, different object

The multiquadratic field

\[
K=\mathbb Q(\sqrt2,\sqrt3,\sqrt5,\sqrt7)
\]

has degree `16` over \(\mathbb Q\).  One basis is formed by the products
\(\prod_{i\in S}\sqrt{p_i}\) over all sixteen subsets
\(S\subseteq\{1,2,3,4\}\).  This sixteen-element field basis is **not** the
same object as the sixteen geometric `Q4` vertices.  Their equal counts license
a typed cross-view, not an identity.

## 5. Relation to the existing Root Space 8 → 16

The existing artifact owns the `Q3 → Q4` carrier:

- `Q3`: 8 vertices, 12 edges;
- doubled `Q3`: two 8-state layers plus eight bridges;
- `Q4`: 16 vertices, 32 edges, degree 4;
- existing `8|3|8` reading mask remains a declared graph reading, not a root
  metric or a physical code.

This note adds the exact root metric and the open-cell interpretation without
re-identifying or replacing that artifact.

## 6. Visual provenance supplied on 21 November 2026

| Source visual | SHA-256 | Role |
|---|---|---|
| Geometry of Time · Cubit to Quantum | `0fa16a63685e6cf1511c1facc0c1c326114abc76a69c4b884ad8f96a838dbd50` | conceptual artwork; no unit conversion imported |
| Recursive Golden Polyhedral Structure | `c091a1a94f4341958fd5a50ed7b41878ded4d8ba9ed47d3bfb83cd4646c7a736` | 2D visual provenance; no generator recovered |
| Prime Trinity / Spiral Logic / Number Grid | `a2229b18ae7a118f78c150a6fc3934bcfd03399a459e46e000cfe7883c923cee` | symbolic composition; grid law unstated |
| Tessarec Root Space — Complete Matrix | `965e26df5315b760b19bcc34bc25b171b56bd90106787b800ae53e6da9f3caec` | naming and layout stimulus; labels not treated as formal matrix data |

## Claim boundary

This is finite geometry and algebraic bookkeeping.  It does not establish a
preferred natural geometry, a time quantum, a cubit-to-quantum conversion,
resonance, physical motion, or a universal mechanism.  “Between the stones” is
the Owner metaphor for the explicitly defined open cell.

## Replay

```bash
node A0_BOOK/a0-tessarec-root-space-matrix-tests.cjs
```

Expected: `A0 Tessarec Root Space complete matrix: 643 assertions passed`.
