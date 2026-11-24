# NEXAH · Prüf- & Grenz-Notiz: Ihara-Zeta, Ramanujan-Graph und 8→7+1 Return

**Namespace:** `MOD:NUMBER_VIEW_SUITE` · `ART:A0:MATHEMATICAL_JOINTS` · `AXIS08_CROSS_LENS`  
**Status:** `ENGINEERING_AUDIT_REPLAYED / SOURCE_BOUND / NOT_A_SCIENCE_RUN`  
**Datum:** `2026-11-21`

## Ergebnis

Der vorhandene A0-Träger ist reproduzierbar ein zusammenhängender,
nicht-bipartiter, 3-regulärer Graph mit `48` Knoten und `72` Kanten. Für diesen
konkreten Graphen liefert der bestehende Jacobi-Solver

```text
max |λ_nontrivial| = 2.7313013160030897
2√2                 = 2.8284271247461903
margin              = 0.09712580874310062
```

Damit besteht der **numerische Ramanujan-Test**. Die aus den nicht-trivialen
Adjazenz-Eigenwerten berechneten `94` nicht-trivialen Ihara-Pole liegen innerhalb
der numerischen Toleranz auf `|u| = 1/√2`; der maximale Radiusfehler beträgt
`1.1102230246251565e-16`.

Das ist eine endliche graph-spektrale Aussage. Sie ist weder ein Beweis der
klassischen Riemannschen Vermutung noch ein physikalischer Energie- oder
Resonanzbefund.

## Welche 48 Knoten geprüft wurden

Der geprüfte Carrier ist der explizit erzeugte
`O2-P16-H8 Blue Body shell`. Seine Knoten heißen `A0..A7`, `B0..B7`,
`C0..C7`, `E0..E7`, `D0..D7` und `F0..F7`; seine Kanten werden aus den
deklarierten Polygonflächen abgeleitet.

Auch das reduzierte Restklassensystem modulo `210` hat
`φ(210) = 48` Elemente. Diese Gleichheit der Kardinalität ist hier nur eine
**Cross-Lens**. Es gibt in den geprüften Quellen keine bijektive,
kanten-erhaltende Abbildung zwischen den 48 Restklassen und dem Blue-Body-Graphen.
Darum wird keine Carrier- oder Graphidentität behauptet.

## AXIS08: was `8 → 7 + 1` exakt bedeutet

Für `x=(x₁,…,x₈)` und Gewichte `w₇+w₈≠0` gilt

```text
q₇₈ = (w₇x₇ + w₈x₈) / (w₇+w₈)
δ    = x₇ - x₈
```

Die sieben Quotientenkoordinaten `(x₁,…,x₆,q₇₈)` plus das Residuum `δ`
rekonstruieren `x₇,x₈` exakt nach der im AXIS08-QRR-01-Modell deklarierten
Umkehrformel. Für skalare Lanes ist `δ` ein Skalar. Für vektorwertige Lanes ist
`δ` **komponentenweise ein Vektor gleicher Dimension**. `7+1` bezeichnet also
eine Quotienten- plus Residual-Lane und nicht zwingend acht einzelne Skalare.

Der A0-Spektraladapter koppelt die mittleren Lanes `L4/L5`; der gemessene
Float64-Rekonstruktionsfehler beträgt `5.204170427930421e-18`.

## E8-Referenz und antipodale Achsen

Der bestehende E8-Generator reproduziert `240` eindeutige Wurzeln:

- `112` ganzzahlige Wurzeln;
- `128` halbzahlige Spinor-Wurzeln;
- Normquadrat `2` für jede Wurzel;
- exakt `120` antipodale Paare `{±α}`.

Eine Achse plus Orientierungsbit rekonstruiert daher die ausgewählte E8-Wurzel
ohne Residuum. Der zusätzliche A0-Abstandsvektor zur nächsten Wurzel ist dagegen
ein **deskriptives Return-Residual der Cross-Lens**, kein Beweis einer E8-Identität
des Graphen oder seines Spektrums.

## Intake des angehängten Registry-Manifests

Das am `2026-11-21` gelieferte Textobjekt mit SHA-256
`9f175bdaef2458dfffa87ebfdf538b2645ffa7d5905e37000598dd1b7817cecf`
ist in der erhaltenen Form **kein valides JSON**. Zwölf Werte fehlen direkt nach
einem Doppelpunkt (`domain`, `dimensions`, `full_121_layer_ends`, `pair`,
`prime_indices`, `moduli`, `markers`, `primes`, `composites`, `anchors`,
`orbit_nodes`, `prime_factors`). Es wird daher nicht als Registry oder
Source-Graph-Änderung aufgenommen. Der Inhalt bleibt ein Intake-Entwurf; eine
spätere korrigierte Fassung braucht eine erneute Hash- und Schema-Prüfung.

## Claim Boundary

Unterstützt werden nur:

- der numerische Spektral- und Ihara-Test des deklarierten endlichen Graphen;
- die exakte algebraische AXIS08-Rekonstruktion mit explizitem Residuum;
- die Standardzählung `240 → 120` antipodaler E8-Achsen;
- die Feststellung `φ(210)=48` als getrennte Kardinalität.

Nicht unterstützt werden RH-Beweis, Riemann/Ihara-Identität, E8-Spezifität des
Graphen, Identität mit den Restklassen modulo 210, physikalische Energie,
Resonanz, Feldmechanismus, Neuheit oder optimale Kompression.

## Replay

```bash
node a0-ihara-ramanujan-axis08-boundary-audit-tests.cjs
```

