# Fourier Reproduction

## Binding decision

No exact spatial input is bound to the legacy Fourier visual. Therefore the visual itself was not numerically reproduced.

An independent control calculation was performed on the 8×8 unbound numerical table solely to test established FFT properties.

## Convention

- Transform: P = FFTSHIFT(FFT2(p)).
- Library: NumPy 2.3.5.
- Normalization: NumPy backward convention; forward transform unnormalized, inverse divided by N = 64.
- Grid spacing: one arbitrary index unit in both axes because no physical spacing is supplied.
- Boundary assumption: periodic extension implicit in the DFT.
- Frequency coordinates: integer-bin coordinates after fftshift; no physical k units can be assigned.

## Independent candidate results

For the raw 8×8 matrix M:

- Re(P) range: −1.0311565694640645 to 32.22937567786184.
- Im(P) range: −3.2284457072790476 to 3.2284457072790476.
- max |P|: 32.22937567786184.
- max |P|²: 1038.7326565847522.
- phase was calculated as angle(P) by the declared convention but has no bound physical interpretation.

Parseval check:

- Σ|M|² = 20.85588028339434.
- Σ|P|² / 64 = 20.855880283394345.
- absolute discrepancy = 3.552713678800501×10⁻15.

This discrepancy is ordinary floating-point rounding.

## Gaussian comparison

No fitted or explicit Gaussian source is bound to the legacy visual. The supplied 8×8 candidate has a central minimum, so fitting it as the alleged center-peaked “Boltzmann” surface would be unjustified. Analytic Gaussian-transform and σxσk claims are therefore **NOT APPLICABLE TO A BOUND SOURCE**.

Established result retained: a Gaussian transforms to a Gaussian under a stated Fourier convention. Visual Gaussian resemblance does not establish a new law or common provenance.

## Reproduction status

- Source array → legacy Fourier PNG: UNRESOLVED.
- Legacy PNG → numeric amplitude/power/phase: UNRESOLVED.
- Independent candidate FFT and Parseval identity: NUMERICALLY VERIFIED.
- Legacy output reproduction: NOT ACHIEVED.

