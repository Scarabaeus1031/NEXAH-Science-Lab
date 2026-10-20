# Groma–Astrolabium–Dodekaeder: Forschungsfrage

Datum: `2026-10-05`

Status: `RESEARCH_QUESTION / EXACT_GEOMETRIC_CORE / HISTORICAL_FUNCTION_OPEN`

## Zweck dieser Akte

Diese Akte formuliert eine prüfbare Forschungsfrage. Sie beansprucht **nicht**,
die historische Funktion gallorömischer Dodekaeder bestimmt zu haben.

Der mögliche Beitrag liegt zunächst in der sauberen Trennung von:

1. mathematisch beweisbaren Eigenschaften eines idealen regulären
   Dodekaeders;
2. gemessenen Eigenschaften realer gallorömischer Artefakte;
3. einem modernen, konstruktiven Messverfahren, das diese Geometrie nutzen
   könnte;
4. der offenen historischen Frage, ob ein vergleichbares Verfahren antik
   tatsächlich verwendet wurde.

## Forschungsfrage

> Kann ein regelmäßiger Dodekaeder als diskreter Winkelkörper und ein realer
> gelochter gallorömischer Dodekaeder als individuell kalibrierbare
> Aperturstruktur innerhalb einer gekoppelten Vermessungskette untersucht
> werden, in der ein astronomischer Richtungsrahmen, eine terrestrische
> rechtwinklige Basis und räumliche Visierachsen getrennte Funktionen
> übernehmen?

Diese Frage besitzt drei voneinander unabhängige Teile:

```text
ASTRONOMISCHER RAHMEN
Astrolabium / Sternbeobachtung / Richtungsreferenz
             ↓
TERRESTRISCHE BASIS
Groma / Gerade / rechter Winkel / Basislinie
             ↓
RÄUMLICHER OPERATOR
Dodekaederachsen oder reale Aperturpaare
```

Eine Bestätigung der mathematischen Funktionsfähigkeit würde noch keinen
historischen Gebrauch beweisen.

## A. Verbindlicher mathematischer Kern

Die folgenden Aussagen gelten für den **idealen regulären Dodekaeder**.

### A1. Kombinatorik und H3-Träger

```text
20 Ecken
30 Kanten
12 regelmäßige Pentagonflächen
6 Paare gegenüberliegender Flächen
```

Die zwölf gerichteten Flächennormalen bilden die zwölf Ecken des dualen
Ikosaeders. Die sechs ungerichteten Normalenpaare bilden sechs Visierachsen.

### A2. Exakter Achsenwinkel

Für zwei verschiedene Achsen dieser Sechserfamilie gilt für den spitzen
Zwischenwinkel:

```text
cos(theta) = 1 / sqrt(5)
theta      = arccos(1 / sqrt(5))
           = arctan(2)
           = 63.434948... degrees
tan(theta) = 2
```

Damit besitzt das zugehörige rechtwinklige Dreieck das Seitenverhältnis:

```text
1 : 2 : sqrt(5)
```

Das ist eine exakte Eigenschaft der Dodekaeder-/Ikosaeder-Achsengeometrie.
Sie entsteht zwischen **zwei verschiedenen Achsen**. Ein einzelnes Paar
gegenüberliegender Flächen definiert nur eine Achse.

### A3. Pentagon und Goldener Schnitt

Für eine regelmäßige Pentagonfläche mit Kantenlänge `a` gilt:

```text
phi = (1 + sqrt(5)) / 2
Pentagon-Diagonale = a * phi
```

### A4. Fünf eingeschriebene Würfel

Die 20 Dodekaederecken tragen einen Verbund aus fünf eingeschriebenen Würfeln.
Jeder Würfel verwendet acht Ecken; jede Dodekaederecke gehört zu zwei Würfeln:

```text
5 * 8 / 2 = 20
```

Für jeden dieser Würfel gilt:

```text
Würfelkante          = a * phi
Würfel-Flächendiagonale = a * phi * sqrt(2)
Würfel-Raumdiagonale    = a * phi * sqrt(3)
```

Die Würfelkanten erscheinen als Pentagon-Diagonalen. Die fünf Würfel machen
damit die fünf Diagonalen beziehungsweise das Pentagramm jeder Fläche als
zusammenhängende Raumstruktur lesbar.

### A5. Abstand gegenüberliegender Flächen

Der Inkreisradius des regulären Dodekaeders lautet:

```text
r_i = a/20 * sqrt(250 + 110*sqrt(5))
```

Der ideale Abstand zweier gegenüberliegender Flächenebenen ist `2*r_i`.
Dieser Abstand ist eine geometrische Länge, nicht automatisch eine optische
Brennweite.

### A6. Bedingte Zweiloch-Geometrie

Für zwei koaxiale Kreisöffnungen mit Radien `r < R` und Ebenenabstand `L`
definieren die gemeinsamen Tangenten einen virtuellen Kegel:

```text
tan(beta) = (R - r) / L
x         = r*L / (R - r)
```

`x` ist der Abstand des virtuellen Apex hinter der kleineren Öffnung. Nur bei
definierter Augenposition, Zentrierung und Blickrichtung entsteht eine
wiederholbare Kalibrierung. Bei einem symmetrisch im vollständigen Sichtfeld
liegenden Objekt der Höhe `H` und Entfernung `z` gilt:

```text
H = 2*z*tan(beta)
```

Eine einseitig von der optischen Achse gemessene Höhe verwendet dagegen den
Faktor `1` statt `2`. Beide Messmodelle dürfen nicht vermischt werden.

## B. Verbindlicher Sachstand zu den Instrumenten

### B1. Groma

Die Groma ist als antikes Vermessungsinstrument zur Verlängerung gerader
Fluchten und zum Abstecken rechter Winkel belegt. In dieser Akte wird sie
daher als **terrestrische Richtungsbasis**, nicht als mathematischer
Projektionsoperator, bezeichnet.

Quelle: [Science Museum Group – Groma](https://collection.sciencemuseumgroup.org.uk/objects/co53187/groma-roughly-made-groma)

### B2. Astrolabium

Das planisphärische Astrolabium verwendet stereografische Projektion. Es kann
astronomische Beobachtung, Zeit- und Richtungsbestimmung unterstützen. Eine
physische Übertragung auf eine Bodenachse erfordert jedoch einen definierten
Beobachtungs- und Kalibrierungsablauf. Eine automatische, allgemeine
Langzeitkorrektur der Präzession ist nicht vorauszusetzen.

Quelle: [Museo Galileo – Planisphere](https://catalogue.museogalileo.it/indepth/Planisphere.html)

### B3. Gallorömische Dodekaeder

Gesichert sind hohle, meist kupferlegierte Körper mit zwölf pentagonalen
Flächen, verschieden großen Öffnungen und gewöhnlich 20 Eckknöpfen. Funktion,
Benennung und Bedienung sind nicht antik überliefert. Die Funde konzentrieren
sich auf nördliche und westliche Provinzen; diese Verteilung allein beweist
keine militärische oder vermessungstechnische Funktion.

Der Norton-Disney-Fund besitzt zwölf gemessene Öffnungen zwischen `9.9 mm`
und `29 mm`. Das dort dokumentierte gegenüberliegende Paar A/G misst `29 mm`
und `27 mm` und bildet kein universelles `phi`-Verhältnis.

Quelle: [Norton Disney excavation report, Appendix 7](https://archaeologydataservice.ac.uk/catalogue/adsdata/arch-805-1/dissemination/allenarc1-521355_222037.pdf)

## C. Konstruktive Hypothese

Folgende Kette ist geometrisch konstruierbar und experimentell prüfbar:

```text
beobachtete Richtungsreferenz
  -> auf dem Boden fixierte Basislinie
  -> rechter Winkel oder bekannte Basisausrichtung
  -> Auswahl zweier Dodekaederachsen
  -> Schnitt zweier Visierlinien
  -> Distanz- oder Höhenrelation
```

Ein idealer Dodekaeder könnte dabei als **diskreter Winkelkörper** untersucht
werden. Ein reales gelochtes Artefakt wäre davon getrennt als
**Aperturstruktur** zu vermessen. Seine Kalibrierung müsste aus den konkreten
Lochradien, Wand- und Ebenenabständen, Zentrierungsfehlern und einer fixierten
Augenposition bestimmt werden.

Diese zwei Modi dürfen nicht gleichgesetzt werden:

| Modus | Träger | Status |
|---|---|---|
| Achsenmodus | idealer regulärer Dodekaeder / H3-Normalen | `EXACT` |
| Aperturmodus | konkretes Artefakt mit gemessenen Öffnungen | `EXPERIMENTAL` |
| historische Instrumentenkette | Astrolabium–Groma–Dodekaeder | `OPEN` |

## D. Ausdrücklich nicht festgestellt

Diese Akte behauptet nicht:

- dass gallorömische Dodekaeder Vermessungsgeräte waren;
- dass sie mit Gromae oder Astrolabien gekoppelt wurden;
- dass ihre Löcher universell nach `phi`, `sqrt(2)` oder `sqrt(5)` kalibriert
  wurden;
- dass es einen römischen Militärstandard für diese Körper gab;
- dass Werkstätten in Nida oder an der Saalburg solche Geräte fertigten;
- dass die Genauigkeit römischer Bauwerke diese Instrumentenkette beweist;
- dass mathematische Verwendbarkeit historische Verwendung bedeutet.

Auch die Annahme geheimen oder nur mündlich übertragenen Wissens gilt nicht
als positive Evidenz, solange sie nicht unabhängig belegt werden kann.

## E. Falsifizierbares Prüfprogramm

### E1. Ideales Referenzmodell

- regulären Dodekaeder mit bekannten Toleranzen fertigen;
- alle sechs Achsen markieren;
- Winkel zwischen sämtlichen Achsen unabhängig vermessen;
- Wiederholbarkeit einer `1:2`-Triangulation mit verblindeten Zieldistanzen
  testen;
- mit einem einfachen Winkelmaß beziehungsweise einer Dioptra kontrollieren.

### E2. Reale Aperturmodelle

- publizierte 3D-Scans oder vollständige Maßtabellen einzelner Funde verwenden;
- gegenüberliegende Öffnungspaare, Wandstärke und Achsversatz bestimmen;
- Augenposition beziehungsweise mechanischen Augenanschlag explizit variieren;
- Sichtfeld, Fehlerfortpflanzung und Nutzerstreuung messen;
- Resultate mit einer einfachen Zweilochplatte gleicher Maße vergleichen.

### E3. Groma-Kopplung

- Groma erzeugt ausschließlich Basis und rechten Winkel;
- Dodekaeder darf erst danach als unabhängiger Winkelkörper hinzukommen;
- Zielentfernungen und Zielhöhen werden randomisiert und den Testpersonen
  verborgen;
- Fehler, Zeitbedarf und Lernkurve werden gegen Groma + Dioptra sowie gegen
  Schnur-/Stabmethoden verglichen.

### E4. Astronomische Orientierung

- zunächst moderne bekannte Referenzazimute verwenden;
- danach einen historisch plausiblen astronomischen Beobachtungsablauf separat
  rekonstruieren;
- Instrumentendatum, Breitengrad, Sternkoordinaten und Präzession dokumentieren;
- erst nach bestandener Einzelprüfung mit der terrestrischen Messung koppeln.

### E5. Archäologische Prüfung

- vollständige metrische Vergleichsdaten über möglichst viele Funde erfassen;
- nach wiederkehrenden gegenüberliegenden Lochpaaren und Toleranzen suchen;
- Gebrauchsspuren, Reparaturen, Ablagerungen und Griff-/Montagespuren prüfen;
- Fundkontexte auf unabhängige Verbindung zu Vermessung, Militär,
  Astronomie, Handwerk oder Ritual untersuchen;
- Hypothese gegen konkurrierende Erklärungen testen, nicht nur auf
  Kompatibilität mit der Vermessungsidee.

## F. Fragen an Spezialistinnen und Spezialisten

### Polyedergeometrie / Coxeter-Gruppen

- Ist die gewählte Sechserfamilie der H3-Flächenachsen vollständig und korrekt
  als äquiangulare Linienfamilie beschrieben?
- Welche Achsen- und Würfelrelationen bleiben unter realen Formabweichungen
  stabil?

### Optische Messtechnik

- Welches exakte Sichtmodell beschreibt zwei endliche Öffnungen plus Pupille?
- Welche Augenfixierung wäre für eine praktisch brauchbare Kalibrierung nötig?
- Welche Genauigkeit ist bei artefakttypischen Dimensionen überhaupt erreichbar?

### Römische Vermessungsgeschichte

- Gibt es Texte, Darstellungen oder Fundverbände, die eine Kopplung mehrerer
  Richtungsinstrumente nahelegen?
- Welche dokumentierten antiken Verfahren lösen dieselben Aufgaben bereits
  einfacher?

### Archäologie und Archäometallurgie

- Sind Öffnungen und Flächen ausreichend regelmäßig für präzise Visierung?
- Zeigen Innenflächen, Ränder oder Knöpfe passende Gebrauchsspuren?
- Lassen sich Lochmuster werkstattübergreifend standardisieren?

### Archäoastronomie

- Welche astronomische Richtungsbestimmung wäre für Ort und Epoche realistisch?
- Welche Instrumente oder Beobachtungsverfahren sind im betreffenden Kontext
  tatsächlich belegt?

## G. Möglicher wissenschaftlicher Beitrag

Der vertretbare Beitrag wäre gegenwärtig nicht eine historische Lösung,
sondern:

> die Formulierung und offene Prüfung eines gekoppelten geometrischen
> Messmodells, das den exakten H3-Achsenkern, die Optik realer Aperturpaare und
> den archäologischen Evidenzstand strikt getrennt hält.

Ein positives Experiment würde zeigen, dass ein solches Verfahren
**funktionieren kann**. Erst unabhängige archäologische Evidenz könnte zeigen,
dass es historisch **so verwendet wurde**.

## Referenzen für den Ausgangspunkt

- [Wolfram MathWorld – Regular Dodecahedron](https://mathworld.wolfram.com/RegularDodecahedron.html)
- [Euclid, Elements XIII, Proposition 17](https://www.euclids-elements.org/elements/books/bookXIII/propositions/propXIII17/)
- [Wolfram MathWorld – Cube 5-Compound](https://mathworld.wolfram.com/Cube5-Compound.html)
- [Science Museum Group – Groma](https://collection.sciencemuseumgroup.org.uk/objects/co53187/groma-roughly-made-groma)
- [Museo Galileo – Planisphere](https://catalogue.museogalileo.it/indepth/Planisphere.html)
- [Norton Disney excavation report](https://archaeologydataservice.ac.uk/catalogue/adsdata/arch-805-1/dissemination/allenarc1-521355_222037.pdf)
- [Sparavigna – A Roman Dodecahedron for measuring distance](https://arxiv.org/abs/1204.6497)
- [Sparavigna – Roman Dodecahedron as dioptron](https://arxiv.org/abs/1206.0946)

The last two references formulate possible rangefinder models. They are
relevant prior hypotheses, not archaeological confirmation of use.

## H. Current specialist disposition — 2026-10-08

This record remains a promising domain research question despite the closure
of any broad NEXAH scientific-novelty claim. Its strength is the explicit
separation of exact geometry, experimental aperture performance and historical
use.

```text
GEOMETRIC_CORE                    = EXACT_FOR_IDEAL_MODEL
REAL_ARTEFACT_OPTICAL_PERFORMANCE = UNTESTED
HISTORICAL_FUNCTION               = OPEN
SPECIALIST_PACKET                 = PREPARABLE
OUTREACH_AUTHORIZED               = NO
```

Before a specialist packet is sent, select one published artefact or corpus,
bind a compact dimensional and uncertainty table, and direct separate bounded
questions to the relevant expertise. A positive feasibility result would show
only that the device could work under the tested contract; it would not show
that Roman users employed it that way.
