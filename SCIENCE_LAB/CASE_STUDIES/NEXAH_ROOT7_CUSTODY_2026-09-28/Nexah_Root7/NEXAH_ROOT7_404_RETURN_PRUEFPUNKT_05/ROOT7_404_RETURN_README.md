# NEXAH √7 · Prüfpunkt 05: 404-Gate und zwei Return-Wege

Stand: 28.09.2026 · Status: **PASS_BOUNDED (synthetische Gate-Anbindung)**

## Quelle und neue Definition

Die beigefügten Tafeln `NEXAH ARCHITECTURE – PROJECTION, HINGE & GATE (404 ALIGNMENT)` und der Screenshot des Kompassspiels bezeichnen **404** als Ausrichtungs-/Gate-Zustand: Phase 0°, mittlere Neigung 0°, Fehler 0; für das Einrasten werden außerdem offener Spalt, geringe Geschwindigkeit und gemeinsame Ausrichtung genannt. Die Tafel `X:XI:XII GRID HINGES & MIRROR CHANNELS` zeigt 404 als Spiegelmarker und gerichtete Übergänge 404→402→403. Das legt **noch keinen** numerischen Wert von 404 für eine 4D-Koordinate fest.

Für einen kleinen, reproduzierbaren Modellversuch setzen wir daher **als Arbeitsregel**:

`G404(site) = (phase=0°) ∧ (tilt=0°) ∧ (error=0) ∧ open_gap ∧ slow`.

Nur ein w-Schritt darf vom Gate abhängen. `open_gap` und `slow` sind hier boolesche Vorgaben; die Screenshots liefern **keine numerischen Schwellen** für sie. Die Zuordnung des Gate-Inputs zu einem bestimmten 4D-Punkt ist ebenfalls ein Testparameter, keine alte Herleitung.

## Zwei vollständige Return-Wege mit gleichem Ziel

Wir nutzen Arbeitsmodell A, also die lange **z**-Achse mit Gitter z=0,1,2. Der vordere 3|1|3-Weg beginnt bei Q0=(0,0,0,0) und endet bei Q3=(1,1,2,1). Nun vergleichen wir:

| Weg | Koordinatenfolge | Abstände² vom Ursprung | w-Schritt | Träger |
| --- | --- | --- | --- | --- |
| **Außen zuerst** | (1,1,2,1)→(1,1,2,0)→(1,1,0,0)→(1,0,0,0)→(0,0,0,0) | **7→6→2→1→0** | ganz am Anfang, am äußeren Punkt Q3 | alle Punkte in den 16 äußeren Eckzuständen |
| **Innen am Hinge** | (1,1,2,1)→(1,1,1,1)→(1,1,1,0)→(0,0,0,0) | **7→4→3→0** | nach dem ersten Schritt, am inneren Punkt Q2 | benötigt die mittlere z=1-Lage des 24-Punkte-Gitters |

Der Innenweg ist die **exakte Umkehr der gewählten 3|1|3-Koordinatenfolge**. Der Außenweg ist ebenfalls eine erlaubte Rückkehr zur selben Koordinate, aber mit anderer Zwischenlage. In beiden Fällen endet der sichtbare w-Code bei 47. Ein bloßer Vergleich von Start und Ende kann die Wege nicht unterscheiden. Der vollständige Record kann den Gate-Ort, die Folge der Zustände und den Zeitpunkt des 74→47-Wechsels unterscheiden.

## Gate-Gegenproben

| Vorab gegebene Gate-Lage | Außen zuerst | Innen am Hinge |
| --- | --- | --- |
| Beide Orte exakt ausgerichtet, offen und langsam | zugelassen | zugelassen |
| Nur der äußere Punkt so ausgerichtet | zugelassen | blockiert am w-Schritt |
| Nur der innere Hinge so ausgerichtet | blockiert am w-Schritt | zugelassen |
| Spalt an beiden Orten geschlossen | blockiert | blockiert |
| An beiden Orten zu schnell | blockiert | blockiert |

Ein vorübergehend geschlossener Gate-Eingang unterbricht den Versuch; daraus wird **keine** 404-Physik behauptet. Die beiden verschiedenen Antworten der mittleren Zeilen sind eine Folge der **explizit gewählten Gate-Ortsregel**. Die Architekturtafel zeichnet H als gemeinsamen Kreuzungspunkt der vier Projektionen, identifiziert H aber nicht mit einem der beiden Gitterpunkte Q2 oder Q3. Genau diese Zuordnung ist weiterhin offen.

## Abgleich mit anderen beigefügten Tafeln

- `IN / VARIANT — THE CHANNEL OF RETURN` zeigt \(X\to X'\), die Erhaltung einer bezeichneten Invariante und einen Return/Axis-Ort. Unsere zwei Wege illustrieren, wie derselbe räumliche Endpunkt zwei **unterschiedliche Historien** zulässt. Sie beweisen keine weitergehende Invariante der Return-Tafel.
- `ORION MULTI-GRID RELATION CALCULUS` trennt Einzelgitter und Relation-Gitter; bei gleichgerichteter Verschiebung *kann* eine Relation gleich bleiben, bei gegensinniger nicht. Das unterstützt einen getrennten **Record von Zustand und Relation**; die dortige \(\mathbb Z_2\times\mathbb Z_3\)-Phase ist keine festgelegte Abbildung auf unsere 4D-Punkte.
- `THE OPERATOR DECIDES` zeigt am Kaprekar-Operator, dass 4774 als **Ziffernfolge** unter Sortierung Information verliert. Unsere Labels 47/74 sind ein anderer Typ; die Operatoren werden nicht gleichgesetzt.
- `EXP-31 exploratory boundary sweep` vergleicht Orbit-Verweilzeiten und zeigt 404/4774 als Iterationsmarken; weder eine Gate-Schwelle noch ein 4D-Längenverhältnis lässt sich daraus entnehmen.

## Entscheidung

**Befund:** Ein Return-Operator mit typisiertem Gate-Record ist sinnvoll und testbar. Eine fünfte *räumliche* Achse ist nicht nötig, um die beiden Wege zu unterscheiden: Der Record ist eine zusätzliche Information über Richtung und Verlauf. Das gefundene Muster ist **kein unabhängiger Nachweis**, dass NEXAHs 404-Gate genau der w-Schritt am inneren Hinge ist.

**Nächster echter Evidenzschritt:** In einer vorhandenen Quelle den Punkt H (und die Bedeutung von `|` oder `¥`) auf einen benannten Übergang und seine Eingangsdaten binden, idealerweise mit Gegenfall „Gate geschlossen“. Erst dann kann die Ortswahl als geprüfte NEXAH-Regel statt als Modellentscheidung gelten.

## Reproduktion

`python3 ROOT7_404_RETURN_GATE.py` erzeugt `ROOT7_404_RETURN_RESULTS.json` und prüft beide Wege, die 16/24-Zustandszugehörigkeit und fünf Gate-Szenarien mit Assertions. Es wird nur Python-Standardbibliothek verwendet; E8/H4 bleibt ein unabhängiger Referenzbenchmark.
