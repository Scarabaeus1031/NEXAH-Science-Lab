# NEXAH Mathematical Foundations — Baseline

Stand: 2026-09-17  
Dokumenttyp: mathematische Grundordnung  
Status: `FOUNDATIONS_BASELINE / NO_NEW_THEORY_CLAIM`  
Operational effect: `NONE`

## 1. Zweck und Grenze

Dieses Dokument fixiert zuerst die Mathematik. Es enthält keine Farbenlehre,
Wahrnehmungspsychologie, Kunstgeschichte, Genealogie oder physikalische
Deutung. Diese Gebiete dürfen später an klar definierte mathematische Objekte
angebunden werden, aber nicht deren Definition ersetzen.

Die Leitfrage lautet:

> Welche mathematischen Objekte, Abbildungen und erhaltenen oder verlorenen
> Eigenschaften liegen in einer NEXAH-Darstellung tatsächlich vor?

## 2. Minimale Grundregel

Keine mathematische Aussage ohne:

```text
Objekt + Definitionsbereich + Abbildung + Vergleichsregel + Gültigkeitsgrenze
```

Insbesondere gilt:

```text
Bezeichnung != mathematisches Objekt
Bildähnlichkeit != Isomorphie
gleicher Wert != gleicher Generator
gleiche Darstellung != gleiche Transformationsgeschichte
sichtbare Schleife != Windungszahl
Rastergröße != topologische Eigenschaft
```

## 3. Grundobjekte

### 3.1 Träger oder Quellraum

Ein Träger `X` ist die deklarierte Menge der zulässigen Zustände oder Objekte.
Beispiele sind eine endliche Punktmenge, ein Zahlenregister, `R^2`, `C`, ein
Graph, eine geordnete Sequenz oder ein Parameterraum.

Ein gebundenes Quellobjekt ist ein bestimmtes `x in X` zusammen mit seiner
Identität, Version, den Parametern und gegebenenfalls dem Zeitpunkt.

### 3.2 Relation

Eine Relation `R` zwischen Mengen `X` und `Y` ist eine Teilmenge

```text
R subseteq X x Y.
```

Sie sagt, welche Paare miteinander verbunden sind. Eine Relation muss weder
eindeutig noch umkehrbar noch kausal sein.

### 3.3 Funktion und Operator

Eine Funktion

```text
F: D subseteq X -> Y
```

weist jedem zulässigen Eingang aus `D` genau einen Ausgang in `Y` zu. Ein
NEXAH-Operator ist eine solche Abbildung nur dann, wenn Ein- und Ausgang,
Parameter, Randfälle und Kompositionsregel erklärt sind.

Ein Pfeil, ein Verb oder eine visuelle Ähnlichkeit ist noch kein Operator.

### 3.4 Darstellung

Eine Darstellung ist ein mathematisches oder rechnerisches Objekt `Y`, das
durch eine deklarierte Abbildung aus einer Quelle entsteht:

```text
y = O(x).
```

Die Darstellung kann die Quelle vollständig, teilweise oder mehrdeutig
abbilden.

### 3.5 Identität und Adresse

Identität beantwortet, welches Objekt vorliegt. Eine Adresse gibt an, wo oder
unter welchem Index es in einer Darstellung gefunden wird. Eine Änderung der
Adresse muss keine Änderung des Objekts sein; identische Werte können aus
verschiedenen Objekten oder Generatoren entstehen.

## 4. Raum, Frame und Messung

### 4.1 Anchor

Ein Anchor `A` ist eine persistente Referenzidentität. Er kann einen Ursprung
oder Referenzpunkt festlegen, bestimmt allein aber weder Richtung noch
Händigkeit noch Maßstab.

### 4.2 Frame

Ein Frame ergänzt den Anchor um eine Basis, Richtung, Orientierung und die zur
Messung benötigte Struktur. Im einfachsten euklidischen Fall:

```text
F = (A, e_1, ..., e_n, metric).
```

### 4.3 Koordinaten

Koordinaten sind Zahlen, die ein Objekt relativ zu einem Frame beschreiben.
Sie sind nicht das Objekt selbst. Bei einem Framewechsel können sich die
Koordinaten ändern, obwohl die geometrische Beziehung erhalten bleibt.

### 4.4 Metrik

Eine Metrik `d` legt fest, wie Abstände verglichen werden. Ohne deklarierte
Metrik sind Aussagen wie nah, fern, Zentrum oder kleinster Fehler
unterbestimmt.

Die euklidische Metrik ist ein wichtiger Standardfall, aber nicht automatisch
für Graphen, gekrümmte Räume oder gemischte Datentypen geeignet.

### 4.5 Winkel und Orthogonalität

Winkel und Rechtwinkligkeit benötigen eine geeignete metrische beziehungsweise
innere-Produkt-Struktur. Sie sind keine rein graphischen Eigenschaften.

## 5. Transformationen und Erhaltung

### 5.1 Translation, Rotation und Spiegelung

Im euklidischen Raum erhalten Translationen, Rotationen und Spiegelungen
Abstände und Winkelbeträge. Spiegelungen kehren die Orientierung beziehungsweise
Händigkeit um.

Horizontale, vertikale und diagonale Spiegelungen gehören derselben Klasse
euklidischer Isometrien an, sind aber verschiedene Abbildungen mit
verschiedenen Fixgeraden.

### 5.2 Skalierung

Eine gleichmäßige positive Skalierung erhält Winkel und skaliert Längen. Eine
anisotrope Skalierung kann Winkel und euklidische Abstände verändern.

### 5.3 Affine Abbildungen

Affine Abbildungen erhalten insbesondere Geraden, Kollinearität und
Parallelität. Allgemeine affine Scherungen erhalten nicht notwendig Längen,
Winkel oder Rechtwinkligkeit.

### 5.4 Invariante und Equivarianz

Eine Größe `I` ist unter einer Transformationsklasse `G` invariant, wenn

```text
I(g x) = I(x)  for all admissible g in G.
```

Eine Darstellung ist equivariant, wenn eine Transformation der Quelle einer
deklarierten Transformation ihrer Darstellung entspricht:

```text
O(g x) = rho(g) O(x).
```

Eine Invariante besitzt erst Inhalt, wenn Objekt, Transformationsklasse und
Vergleichsregel feststehen.

## 6. Schnitt, Projektion und Mehrdeutigkeit

### 6.1 Cut

Ein Cut ist eine deklarierte Auswahl, Einschränkung oder partielle Beobachtung.
Er verändert nicht notwendig die Quelle; er bestimmt, welcher Teil in die
Darstellung eingeht.

### 6.2 Projektion

Eine Projektion oder allgemeine Beobachtungsabbildung

```text
P: X -> Y
```

kann verschiedene Quellobjekte auf denselben Ausgang abbilden. Dann ist `P`
nicht injektiv und die Quelle aus `y` allein nicht eindeutig rekonstruierbar.

### 6.3 Faser und Rekonstruktionsmenge

Die zu einer Beobachtung `y` kompatiblen Quellen bilden die Faser

```text
P^(-1)(y) = {x in X : P(x)=y}.
```

In einem endlichen registrierten Modell ist dies die Rekonstruktionsmenge.
Mehrere Ansichten verengen sie durch Schnitt:

```text
Theta_(A,B) = Theta_A intersection Theta_B.
```

Eine kleinere Rekonstruktionsmenge bedeutet mehr Unterscheidungsinformation,
aber nicht automatisch eine besondere physikalische Kopplung der Ansichten.

### 6.4 Verlust, Zusatz und Unbestimmtheit

Für einen Darstellungswechsel werden vier Fälle getrennt:

- erhalten oder invariant;
- verloren;
- durch die Darstellung hinzugefügt;
- unaufgelöst oder nicht entscheidbar.

`UNKNOWN` ist weder null noch falsch.

## 7. Graph, Raster und Einbettung

### 7.1 Graph

Ein Graph bestimmt Knoten und Kanten. Ohne zusätzliche Attribute bestimmt er
keine euklidischen Positionen, Längen oder Winkel.

### 7.2 Einbettung

Eine Einbettung weist Graphknoten Positionen in einem Raum zu. Derselbe Graph
kann verschieden eingebettet werden und dabei dieselbe Adjazenz, aber andere
sichtbare Winkel und Distanzen besitzen.

### 7.3 Raster

Ein Raster ist ein diskreter Adress- und Darstellungsraum. Seine Auflösung,
Parität, Mittelzelle und Randbehandlung beeinflussen die Darstellung.

```text
Rastergröße != Windungszahl
Rastergröße != Primzahlinvariante
Rasterbild != Quelle
```

Ein ungerades `n x n`-Raster besitzt eine eindeutige Mittelzelle. Ein gerades
Raster besitzt stattdessen eine zentrale Naht oder einen zentralen Block.

### 7.4 3×3 und 11×11

Ein `3×3`-Raster ist der kleinste hier verwendete quadratische Rasterfall mit
expliziter Mittelzelle und acht Nachbarzellen. Ein `11×11`-Raster bietet eine
feinere Quantisierung, ohne dadurch eine andere Trägerart zu werden.

Der historische V27-`3×3`-Zustandskern ist ein Produkt zweier dreistufiger
Klassifikationen und kein geometrisches Naturgesetz:

```text
state = 3 * level + phase.
```

## 8. Endliche Arithmetik

### 8.1 Restklasse

Für Modul `m` gehören ganze Zahlen `a` und `b` zur selben Restklasse, wenn

```text
a congruent b (mod m).
```

Modulo-Klassen sind zyklische Adressen. Eine Restklasse ist keine räumliche
Windung und keine physikalische Phase, sofern keine zusätzliche Abbildung dies
definiert.

Beispiel:

```text
110 mod 11 = 0
111 mod 11 = 1
112 mod 11 = 2.
```

### 8.2 Chinesischer Restsatz

Der CRT beschreibt, wann kompatible Restklassen bezüglich teilerfremder Moduln
eindeutig zu einer Restklasse im Produktmodul zusammengesetzt werden können.
NEXAH verwendet den CRT als Standardwerkzeug für Adresszerlegung und
Rekonstruktion; er ist keine neue NEXAH-Mathematik.

### 8.3 Primzahl und Primindex

Eine Primzahl ist eine positive ganze Zahl größer als eins mit genau zwei
positiven Teilern. Ein Primindex ist ihre Position in der aufsteigenden
Primzahlfolge. Wert und Index bleiben getrennt:

```text
41 = P_13
97 = P_25
101 = P_26
103 = P_27
107 = P_28
109 = P_29
113 = P_30.
```

Lokale Gap-Muster dürfen beschrieben werden. Ein Zyklus, Flip oder musikalischer
Einsatz ist erst dann ein mathematischer Operator, wenn Auswahl- und
Fortsetzungsregel definiert sind.

### 8.4 Zahl, Ziffernfolge und Glyph

Der Zahlenwert, seine Primzahlposition, seine Restklasse, seine Dezimalschreibweise
und seine visuelle Form sind verschiedene Objekte. Konkatenation ist weder
Addition noch Multiplikation. Ein Palindrom ist zunächst eine Eigenschaft einer
gewählten Schreibweise und Basis.

## 9. Ordnung, Bahn und Dynamik

### 9.1 Sequenz und Pfad

Eine Sequenz besitzt eine Reihenfolge. Zwei Pfade mit denselben Zuständen, aber
anderer Reihenfolge sind nicht derselbe Pfad.

### 9.2 Iteration und Orbit

Für eine Abbildung `f: X -> X` ist der Orbit von `x_0` die Folge

```text
x_0, f(x_0), f^2(x_0), ...
```

Eine Projektion des Orbits ist nicht der vollständige Zustandsraum.

### 9.3 Periode und Rückkehr

Eine exakte Periode `k` erfüllt `f^k(x)=x`. Eine Rückkehr in einer Darstellung
kann dagegen auftreten, obwohl Quelle, Geschichte oder nicht beobachtete
Koordinaten nicht zurückgekehrt sind.

```text
return of representation != reset of complete state
```

### 9.4 Windungszahl

Eine Windungszahl benötigt eine geschlossene orientierte Kurve und einen
Referenzpunkt außerhalb der Kurve. Sie ist eine topologische Größe. Ein
sichtbarer Loop, ein Q11-Raster oder elf Phasenklassen bestimmen allein keine
Windungszahl.

### 9.5 Mandelbrot und Julia

Für

```text
f_c(z)=z^2+c
```

ist `c` der Parameter und `z` der dynamische Zustand. Ein endliches
Escape-Time-Bild ist eine numerische Darstellung unter Fenster, Raster,
Iterationsgrenze und Escape-Radius. Es ist nicht die exakte Julia-Menge.

Die unterstützte NEXAH-Kette lautet:

```text
Parameter -> Dynamik -> endliches Feld -> Beobachtung -> Rekonstruktionsmenge.
```

## 10. QRT als endlicher Demonstrator

Im geborgenen QRT-Demonstrator ist ein siebenstelliger Carrier definiert:

```text
X = [A B C D E F X]
  -> Q: deklarierter Cut
  -> T: Frame- oder Prefix-Flip
  -> R: inverse Ausrichtung und Adressabgleich
  -> Vergleich von X' mit X.
```

Dies ist ein endlicher Transformations- und Rückkehrdemonstrator. Es ist kein
Ersatz für den Chinesischen Restsatz und kein universeller Operator.

Der erhaltene Kernsatz lautet:

```text
SAME_OUTPUT != SAME_GENERATOR
NUMERICAL_CLOSURE != INFORMATIONAL_CLOSURE
```

## 11. Residual und Rückvergleich

Für Quelle `x`, Beobachtung `y=O(x)` und Rekonstruktion `x_hat=R(y)` benötigt
ein numerischer Rest eine deklarierte Metrik:

```text
r = d(x, x_hat).
```

Daneben kann ein struktureller Rest bestehen: verlorene Ordnung, unbekannte
Generatoridentität, fehlende Region oder nicht rekonstruierbare Provenienz.

Ein Rest ist daher immer typisiert:

```text
numerisch | strukturell | außerhalb der Unterstützung | unaufgelöst
```

Er ist nicht automatisch Messfehler, Substanz oder neue Physik.

## 12. Mathematischer NEXAH-Kern

Die derzeit belastbare Architektur lautet:

```text
TRÄGER / QUELLE
  -> RELATION / CONSTRAINT
  -> FRAME / ADRESSE
  -> TRANSFORMATION ODER PROJEKTION
  -> BEOBACHTUNG
  -> FASER / MEHRDEUTIGKEIT
  -> ZWEITE ANSICHT / BINDUNG
  -> REKONSTRUKTION ODER ENTHALTUNG
  -> REST / PROVENIENZ / RÜCKVERGLEICH
```

Diese Architektur verbindet bekannte Mathematik. Ihre derzeitige
NEXAH-spezifische Leistung ist die typisierte Komposition, nicht ein neuer
allgemeiner Satz.

## 13. Was als exakt gilt

Zum bestehenden exakten Bestand gehören unter anderem:

- standardmäßige euklidische Transformationsinvarianten;
- endliche Identifizierbarkeits- und Projektionskollisionen;
- exakte Restklassen- und CRT-Berechnungen;
- deklarierte endliche QRT-Cut/Flip/Return-Abläufe;
- konkrete modulare Orbit- und Periodenzerlegungen;
- bekannte gcd-Identitäten für `10^n-1` und die parity-gesteuerte `+1`-Variante;
- reproduzierte endliche Julia-Escape-Arrays in einem gebundenen Fall;
- exakte, lokal definierte Graph-, Raster- und Adressabbildungen.

Diese Resultate sind gültig, auch wenn die zugrunde liegenden allgemeinen
Sätze bekannt sind.

## 14. Was offen bleibt

Noch nicht vorhanden sind:

- ein neuer allgemeiner NEXAH-Satz;
- eine universelle Geometrie aller historischen Darstellungen;
- eine bewiesene gemeinsame Struktur hinter ähnlichen Bildern verschiedener
  Fachgebiete;
- ein vollständig spezifizierter allgemeiner Kompositionskalkül;
- ein nichttrivialer Vorteil des Mehransichten-Binders gegenüber gewöhnlicher
  zusätzlicher Information;
- ein allgemeiner stabiler Aggregator außerhalb des euklidischen gewichteten
  Mittels;
- ein bewiesener Zusammenhang zwischen Primzahlmustern, Musiknotation und
  physikalischer Dynamik.

## 15. Reihenfolge für das Grundlagenwerk

Die mathematische Schule wird in dieser Reihenfolge aufgebaut:

1. Menge, Element, Identität und Typ;
2. Relation, Funktion und partieller Operator;
3. Punkt, Linie, Winkel, Dreieck und euklidischer Raum;
4. Anchor, Frame, Koordinate und Metrik;
5. Transformation, Gruppe, Invariante und Equivarianz;
6. Cut, Projektion, Faser und Rekonstruktion;
7. Graph, Raster, Einbettung und Auflösung;
8. Zahl, Schreibweise, Restklasse, Primzahl und CRT;
9. Sequenz, Pfad, Iteration, Orbit und Windungszahl;
10. Residual, Rückkehr, Provenienz und Vergleich;
11. erst danach: Farbe, Licht, Wahrnehmung und historische Genealogie.

## 16. Parkgrenze

Die folgenden Themen sind wichtig, gehören aber nicht in diese erste
mathematische Fixierung:

- Sehen als aktiver und interaktiver Prozess;
- Licht, Nebel, Schatten und atmosphärische Streuung;
- Farbwahrnehmung und Mustererkennung;
- Leonardo, Goethe, Leibniz oder die Frankfurter Schule;
- Kunst-, Wissenschafts- und Ideengeschichte;
- die alltagssprachliche Gleichsetzung von Sichtbarkeit und Wahrheit.

Sie werden später als eigene Beobachtungs-, Wahrnehmungs- oder
Genealogieschichten an die mathematischen Definitionen angebunden. Sie werden
nicht verworfen und nicht vorzeitig vermischt.
