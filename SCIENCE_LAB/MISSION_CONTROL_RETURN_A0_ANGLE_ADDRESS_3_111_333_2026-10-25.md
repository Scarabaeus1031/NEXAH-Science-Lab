# Mission Control Return · A0 angle-address comparison 3° / 111° / 333°

Date: `2026-10-25`  
Status: `PASS_EXACT_FINITE_ADDRESS_COMPARISON / NO SCIENCE RUN`  
Authority effect: `NONE`

## Big-picture return

The existing `NEXAH_A0_ORIENTATION_CONTROLLER_BENCH` circle/address view now compares the fixed `3°` and `111°` sequences at constant radius, common zero orientation and exactly 120 addresses. The result is exact finite modular geometry:

- `111 = 3×37`, `gcd(37,120)=1`, and `37⁻¹ = 13 mod 120`;
- both sequences visit the same 120 directions exactly once before returning;
- both close after 120 steps;
- `3°` draws `{120/1}` and `111°` draws `{120/37}`.

The requested `333°` addition is retained as a separate negative control. Since its address increment is `111` and `gcd(111,120)=3`, it visits only 40 directions, returns after 40 steps and repeats each visited direction three times over 120 steps. Its fan-like appearance therefore exposes address loss, not merely a new ordering of the same 120-point set.

## Bound sources

- interactive view: `A0_BOOK/A0_ORIENTATION_CONTROLLER_BENCH.html#angleAddressCompare`
- compact visual: `A0_BOOK/results/a0-angle-address-compare-3-111-333-2026-10-25.svg`
- reproducible record: `A0_BOOK/results/a0-angle-address-compare-3-111-333-2026-10-25.json`
- verifier: `A0_BOOK/a0-angle-address-compare-tests.cjs`
- Science Desk: `A0_BOOK/A0_RESEARCH_DESK.html#angle-address-3-111-return-20261025`

Owner notations `111`, `|11` and `1–2–3` are preserved as notes and receive no additional operator semantics.

## Boundary

Existing identities are reused: `NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1` and `NEXAH_A0_ORIENTATION_CONTROLLER_BENCH`. No new canonical ID, relation, Study, Finding, evidence promotion, research activation or publication authorization is created. Radius growth, prime filtering and golden-spiral variants remain explicitly outside this return.
