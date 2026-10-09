# Complex Numbers, Phase and Readout — NEXAH Fundamentals Crosswalk

Date: `2026-10-08`

Status: `DOCUMENTATION_ONLY / EDUCATIONAL_CROSSWALK / SOURCE_REVIEWED_WITH_OPEN_DISPUTE / NO_QUANTUM_OR_NEW_PHYSICS_CLAIM`

Operational effect: `NONE`

Interactive reading surface:
[NEXAH A0 Book — Introduction and Fundamentals Index](A0_BOOK/index.html)

The HTML is an internal teaching and navigation layer over this record. It
does not change the claim status, activate a demonstration or modify the
frozen Science Navigator.

## Purpose

This paper gives a controlled first-principles reading of a supplied public
video transcript about real numbers, complex numbers and quantum mechanics.
It has two jobs:

1. explain the established mathematical and physical essentials in plain
   language; and
2. distinguish them from several NEXAH uses of addition, complement, phase,
   partition, projection and Return.

The paper is a **crosswalk**, not a derivation of NEXAH from quantum mechanics.
It creates no new operator, axiom, physical model, experiment or Core claim.

## Source and authority

The immediate source is the user-supplied transcript:

`[local attachment path omitted in public preview]`

The transcript is a secondary explanatory source associated with the public
channel name `The Feynman Axiom`. It is not treated as a statement by Richard
Feynman, a textbook, a peer-reviewed paper or an authority merely because of
the channel name. Automatic transcript errors and compressed explanations are
expected.

Primary or instructional controls used for this crosswalk:

- MIT OpenCourseWare, *Quantum Physics II, Lecture Notes 6* — unitary time
  evolution and the Schrödinger equation:
  <https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/79a8091ef4f18d8e3ff76a097e8db33c_MIT8_05F13_Chap_06.pdf>
- MIT OpenCourseWare, *Axioms of Quantum Mechanics* — self-adjoint Hamiltonian
  and unitary infinitesimal evolution:
  <https://ocw.mit.edu/courses/22-51-quantum-theory-of-radiation-interactions-fall-2012/9cdcc3c1e36da2ae3e2f925d5b435ab6_MIT22_51F12_Ch3.pdf>
- Renou et al. (2021), *Quantum theory based on real numbers can be
  experimentally falsified*:
  <https://www.nature.com/articles/s41586-021-04160-4>
- Li et al. (2022), *Ruling Out Real-Valued Standard Formalism of Quantum
  Theory*:
  <https://doi.org/10.1103/PhysRevLett.128.040403>
- Wu et al. (2022), *Experimental Refutation of Real-Valued Quantum Mechanics
  under Strict Locality Conditions*:
  <https://doi.org/10.1103/PhysRevLett.129.140401>
- Hoffreumon and Woods (2026), *Quantum theory based on real numbers cannot be
  experimentally falsified* — a current technical challenge to the earlier
  interpretation:
  <https://arxiv.org/abs/2603.19208>

The last four records do not form a settled one-line story. The 2021–2022
papers and experiments argue that a standard real-Hilbert-space alternative
can be separated from complex quantum theory in network scenarios. The 2026
paper argues that this conclusion depends on a non-operational independence
assumption. This crosswalk therefore records the experimental-status question
as **technically disputed**, not as a final proof that nature “is complex.”

## The minimum mathematical foundation

### 1. Complex numbers add an oriented plane

A complex number is

```text
z = a + i b,        i² = -1.
```

It may be read as the point `(a,b)` in a two-dimensional real plane. Its
magnitude and phase are

```text
|z| = sqrt(a²+b²),
arg(z) = theta,
z = |z| e^(i theta).
```

Multiplication by `i` rotates a point by a quarter turn:

```text
i(a+ib) = -b + ia.
```

The same operation can be represented over the reals by

```text
J = [[0,-1],[1,0]],       J² = -I.
```

So complex notation is compact, but rotation is not created by typography.
The real two-dimensional representation retains the same structure when the
operator `J` and its composition rules are retained.

### 2. Euler's formula packages phase and rotation

```text
e^(i theta) = cos(theta) + i sin(theta).
```

This is the **Euler formula** relevant to the transcript. It must remain
separate from:

| Euler reference | Object |
|---|---|
| Euler formula | complex exponential and rotation |
| Euler method | numerical integration scheme |
| Euler equations | inviscid fluid equations |
| Euler polynomial `n²+n+41` | classical number-theory object used in the separate Euler-41 source line |

A shared name does not create a shared operator.

### 3. Quantum alternatives add as amplitudes before readout

For two coherent alternatives `A` and `B`, the quantum state contribution may
be written

```text
psi = psi_A + psi_B.
```

The observed probability is not normally `psi_A + psi_B`. It is obtained by
the Born rule:

```text
p = |psi|²
  = |psi_A|² + |psi_B|² + 2 Re(psi_A conjugate(psi_B)).
```

The last term is the interference cross term. Relative phase can therefore
change the result even when the two individual magnitudes stay fixed. A common
global phase does not change the Born probabilities; relative phase does.

This gives the first essential type distinction:

```text
AMPLITUDE ADDITION -> MAGNITUDE-SQUARED READOUT -> PROBABILITY
```

It is not the same operation as adding probabilities, mixing distances or
partitioning a state space.

### 4. Schrödinger evolution preserves norm under the right generator

For a time-independent Hamiltonian `H`, standard quantum evolution has the
form

```text
i hbar d|psi>/dt = H|psi>,
|psi(t)> = exp(-iHt/hbar)|psi(0)>.
```

If `H` is self-adjoint, the evolution operator is unitary:

```text
U†U = I,
||U psi|| = ||psi||.
```

The factor `i` is structurally important, but `i` alone does not guarantee
unitarity. The generator, domain and self-adjointness conditions matter. Real
differential equations can also rotate when their state has at least two real
components and an antisymmetric generator. The careful claim is therefore:

> Complex Hilbert-space notation makes phase rotation and norm-preserving
> evolution natural and compact; preservation follows from the full operator
> structure, not from the symbol `i` in isolation.

## Four equations that look similar but are not the same

| Form | Type | What is combined | Readout or test |
|---|---|---|---|
| `P = A + B` | bookkeeping / complement | declared parts or accounts | verify types, units, normalization and coverage |
| `dP² = w_A dA² + w_B dB²` | metric mixture | normalized squared distances | compare predictive or geometric performance |
| `X = R_A union G_C union R_B` | partition | disjoint or typed regions of a carrier | verify coverage and overlap rules |
| `psi = psi_A + psi_B`, `p=|psi|²` | coherent amplitude superposition | complex amplitudes | interference cross term and Born readout |

The visible plus sign is insufficient to identify the operation.

## NEXAH crosswalk

### A. `P = A + B` and the 63/64–1/64 split

In `CA-IDENT-05`, the historical complement relation was translated into the
explicit metric mixture

```text
dP² = (63/64) dFourier² + (1/64) dMemory².
```

Here:

- `A` is the normalized radial-Fourier distance contribution;
- `B` is the normalized Shadow-Memory distance contribution;
- `63/64 + 1/64 = 1` is exact bookkeeping;
- the quantities are **weights**, not quantum amplitudes;
- there is no complex relative phase and no interference cross term.

The test result is scientifically useful precisely because the arithmetic
identity and the proposed semantic role were separated. The registered
63/64-dominant model reached macro-F1 `0.5277`, slightly below Fourier alone
at `0.5307`; equal weighting reached `0.5853`; the reversed control reached
`0.6084`. Therefore:

```text
NORMALIZATION = VALID
HISTORICAL ORIENTATION OF THE WEIGHTS = NOT SUPPORTED ON THIS TASK
QUANTUM SUPERPOSITION INTERPRETATION = NOT ADMITTED
```

No equation can recover a behavior class absent from the training support of
both views. This is a coverage and identifiability issue, not a failure of
arithmetic.

### B. Lorenz `A`, `B` and `C`

When NEXAH labels the two Lorenz lobes `A` and `B` and the central transition
region `C`, the letters name regions or roles in a state-space description.
A controlled form is

```text
X = R_A union G_C union R_B,
```

with declared overlap, boundary and event rules. A trajectory moves through
the carrier; it is not thereby a quantum state coherently occupying two
alternatives. If probabilities are assigned to regions, they are classical
state-occupancy or transition estimates unless a different physical model is
explicitly established.

### C. Phase in NEXAH records

NEXAH uses phase in several legitimate but different senses:

- the argument of a complex Fourier coefficient;
- the phase of an analytic signal;
- a position within a periodic cycle;
- a named stage in a process grammar;
- a historical visual or symbolic label.

Only the first two automatically inherit standard complex-signal mathematics.
The others require their own carrier, units, map and comparison rule. A shared
word does not authorize transfer of quantum meaning.

### D. Projection, readout and Return

The strongest connection to current NEXAH is methodological:

```text
SOURCE OBJECT
  -> REPRESENTATION
  -> TRANSFORMATION
  -> READOUT RULE
  -> OBSERVED RECORD
  -> RESIDUAL / UNAVAILABLE INFORMATION
  -> BOUNDED INTERPRETATION
  -> RETURN
```

Quantum mechanics is one domain in which state, representation, evolution and
measurement must be kept distinct. NEXAH generalizes only the **audit
question**—what object, map, readout and loss produced this record—not the
quantum formalism or its physical authority.

## Relation to Premath and Prephysics

Premath and Prephysics sit before a domain equation is allowed to carry
meaning. They ask which distinctions, carriers, relations and measurement
conditions have been fixed.

```text
orientation
  -> distinction and relation
  -> persistence
  -> comparability
  -> projection
  -> measurement
  -> cartography and representation
```

This chain does not derive complex numbers, the Born rule or quantum theory.
It can, however, prevent untyped transfers such as:

- treating a complex coordinate as a physical substance;
- treating a metric weight as an amplitude;
- treating a visual phase as a measured phase;
- treating a state-space partition as a superposition;
- treating exact Return in one representation as recovery of the complete
  source object.

Thus the defensible relation is **precondition and audit**, not prephysical
prediction.

## Transcript audit

| Transcript theme | Controlled disposition |
|---|---|
| complex numbers encode magnitude and phase | retain with standard definitions |
| multiplication by `i` is rotation | retain in the complex plane / real `J` representation |
| alternatives interfere through amplitudes | retain for coherent quantum alternatives with Born readout |
| real equations only grow or decay | reject as stated; real multidimensional systems can rotate |
| `i` by itself guarantees probability conservation | correct to self-adjoint generator plus unitary evolution |
| boundary conditions yield discrete spectra | retain as a domain-specific eigenvalue statement, not a universal consequence of complexity |
| atoms, lasers, tunnelling and quantum computing use complex phase evolution | retain as broad textbook orientation; each application needs its own model |
| experiments prove nature cannot be real | record as technically disputed; define the tested real-theory axioms and independence assumptions |
| complex numbers are “what nature does” | philosophical interpretation, not a direct experimental datum |

## What NEXAH learns from the comparison

1. **Type the plus sign.** Addition can mean complement, mixture, union,
   coherent superposition or ledger closure.
2. **Separate state from readout.** A state representation is not the observed
   quantity; a readout rule connects them.
3. **Preserve relative information.** Magnitude-only views can destroy phase
   relations needed for exact reconstruction.
4. **Do not confuse exactness with usefulness.** Exact normalization may fail
   the task, as `CA-IDENT-05` shows.
5. **Do not confuse richer representation with better performance.** Additional
   views can add noise, redundancy or unsupported dimensions.
6. **Name equivalence conditions.** A complex one-dimensional representation
   and a real two-dimensional representation can encode the same local
   structure only when the translation and composition rules are retained.
7. **Keep disputes visible.** A scientific Return may be `OPEN`, `DISPUTED`,
   `NOT IDENTIFIABLE` or `NOT TESTED`; it need not force closure.

## Candidate demonstrations — not activated

These are future teaching or audit candidates only:

1. **Complex versus real representation equivalence** — replay the same planar
   rotation as multiplication by `e^(i theta)` and as a real `2x2` matrix;
   compare exact Return.
2. **Global versus relative phase** — show that a common phase leaves Born
   probabilities unchanged while a relative phase changes interference.
3. **Amplitude versus metric mixture** — compare a coherent cross-term model
   with the CA-IDENT-05 weighted-distance mixture on a synthetic fixture.
4. **Magnitude-only loss** — demonstrate collisions after discarding Fourier
   phase and record the missing information as a typed residual.

No demonstration, Lab, Study or Navigator module is authorized by listing it.

## Claim ledger

| Claim | Status |
|---|---|
| the complex plane represents magnitude and phase | established mathematics |
| Euler's formula connects exponential phase with sine and cosine | established mathematics |
| standard quantum mechanics uses complex amplitudes and Born readout | established physics formalism |
| self-adjoint Hamiltonians generate unitary time evolution | established physics/mathematics under stated conditions |
| standard real-Hilbert-space alternatives are experimentally excluded | disputed in the current primary literature; assumptions must be named |
| NEXAH `P=A+B` is quantum superposition | rejected |
| Lorenz lobes are quantum alternatives | rejected |
| Premath/Prephysics derives quantum mechanics | rejected |
| the crosswalk improves Human understanding | not tested |
| NEXAH gains a new physics claim from this paper | no |

## Bounded conclusion

The useful result is not that NEXAH has discovered quantum structure. It is
that NEXAH already contains several operations that look similar on the page
but behave differently under audit. Complex numbers and quantum amplitudes
provide a sharp training case for the rule:

> Before interpreting an equation, identify the carrier, object type,
> operation, readout, invariant, residual and claim boundary.

That rule strengthens NEXAH's mathematical literacy while keeping established
physics, historical NEXAH language and current experimental disputes visibly
separate.
