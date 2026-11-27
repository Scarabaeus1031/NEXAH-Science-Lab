# T1--T7 · Transformation Sketch

## Core sketch

**A, B, C → D, E, F, G → higher relations**

**Leitfrage:** Was überlebt den Wechsel der Darstellung?

`I(X) ?= I(T(X))`

## Transformation catalogue

  -------------------------------------------------------------------------------
  T                 Transformation    Status            Core test
  ----------------- ----------------- ----------------- -------------------------
  T1                Translation /     Classical control Abstände, Winkel,
                    Move                                Inzidenz und
                                                        Schnittstruktur

  T2                Rotation          Classical control Form, Abstände, Winkel
                                                        und Schnittstruktur

  T3                Reflection /      Classical control Metrik bleibt;
                    Mirror                              Orientierung/Handedness
                                                        kann wechseln

  T4                Scaling           Classical control Winkel und Verhältnisse
                                                        bleiben; absolute Maße
                                                        ändern sich

  T5                Relation → Object Candidate         Welche Herkunfts-,
                                                        Ordnungs- oder
                                                        Relationsinformation
                                                        bleibt beim Lift
                                                        erhalten?

  T6                Generation / Lift Candidate         Ist der Lift
                                                        wohldefiniert? Was geht
                                                        verloren oder entsteht
                                                        zusätzlich?

  T7                Representation /  Candidate         Bleibt ein Invariant über
                    Return                              Darstellungswechsel
                                                        erhalten? Wann bricht er?
  -------------------------------------------------------------------------------

## Level structure

### Level 0 --- Objects

`A, B, C`

### Level 1 --- Relations as objects

-   `D = A ∩ B`
-   `E = B ∩ C`
-   `F = C ∩ A`
-   `G = A ∩ B ∩ C`

Damit: **ABC → DEFG**

### Level 2 --- Relations between relations

`[D,E,F,G] → R′(relations)`

Interessanter Sketch-Bereich:

`A R B → [ARB]`

anschließend beispielsweise:

`[ARB] R′ [BRC]`

## Control group vs. candidate zone

**T1--T4:** bekannte euklidische bzw. Ähnlichkeitstransformationen.
Kontrollgruppe, keine Neuigkeitskandidaten.

**T5--T7:** Relation→Object, Generation/Lift und Representation/Return.
Hier suchen wir zunächst nur nach einer präzisen Invariante und einer
Failure Condition. Noch keine Neuheitsbehauptung.

## Candidate invariant test

Gesucht ist ein wohldefiniertes `I`, für das unter spezifizierten
Transformationen beispielsweise gilt:

`I(R1(X)) = I(R2(X))`

Ebenso wichtig:

**Wann bricht diese Gleichheit?**

## Sketch status

**SKETCH / DISCOVERY --- NOT YET LAB CLAIM**

Nächste Schwelle:

**Sketch → Candidate Rule → falsifizierbarer Test → Lab**
