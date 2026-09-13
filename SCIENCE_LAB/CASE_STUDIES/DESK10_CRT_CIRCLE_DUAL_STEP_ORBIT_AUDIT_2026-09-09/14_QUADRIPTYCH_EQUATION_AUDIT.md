# Quadriptych equation audit

| Line | Exact rendered equation | LHS | RHS | Classification |
|---:|---|---:|---:|---|
| 1 | (23^0-24+25^3=204^2) | 15602 | 41616 | `CONTRADICTED; OCR_OR_RENDERING_ERROR` |
| 2 | (204^2+26^4=1403) | 498592 | 1403 | `CONTRADICTED; OCR_OR_RENDERING_ERROR` |
| 3 | (-1408+1/12=1407\;11/12) | (-16895/12) | (16895/12) | `CONTRADICTED; OCR_OR_RENDERING_ERROR` |

Every displayed equation is false as rendered. Line 1 has exponent zero and a minus sign, so it is not accepted as the correct cube identity. Line 3 has the wrong sign; the nearby valid identity (1408-1/12=1407\;11/12) is not displayed.

Decision: `VISUAL_EQUATIONS_PARTIALLY_CORRUPTED` (equation region only).
