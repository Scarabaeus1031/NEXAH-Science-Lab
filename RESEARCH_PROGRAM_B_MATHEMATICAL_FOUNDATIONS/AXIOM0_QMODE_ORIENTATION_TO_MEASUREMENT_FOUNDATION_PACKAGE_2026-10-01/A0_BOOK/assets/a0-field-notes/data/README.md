# LANiF frequency-anchor seed

Status: `OWNER FIELD NOTE / SYNTHETIC MAPPING / NOT VALIDATED PHYSICS`

`lanif_freq_anchor.csv` records the six frequency seeds currently named in the
Owner thread. It is a calculation aid inside the existing A0 Field Notes
identity, not a new Study, evidence set, planetary fit or LANiF authority.

Definitions:

```text
f_ref = 444 Hz
Fz = 0.022
O(f) = log2(f / f_ref)
x(f) = f / f_ref - 1
Delta_phi_O(f; k_O) = k_O * O(f), k_O in {30, 45, 63} degrees
k_x = 360 degrees * Fz = 7.92 degrees
Delta_phi_x(f) = k_x * x(f)
```

`O` is an octave coordinate: it is zero at 444 Hz and increases by one when
frequency doubles. The linear `x` map is only a local small-signal candidate
near 444 Hz. Its values for 7.83, 12.6 and 13.7 Hz are retained as explicit
out-of-domain extrapolations, not as validated Earth, membrane or planetary
couplings.

The labels `Schumann candidate`, `ELF 12.6 candidate` and `ELF 13.7 candidate`
preserve Owner-provided seed roles. They do not certify resonance identity,
causal relevance or fitness for a planetary model. The visual tokens `1031`
and `1033` are intentionally excluded from the numeric CSV until a frequency
role and source contract are declared.
