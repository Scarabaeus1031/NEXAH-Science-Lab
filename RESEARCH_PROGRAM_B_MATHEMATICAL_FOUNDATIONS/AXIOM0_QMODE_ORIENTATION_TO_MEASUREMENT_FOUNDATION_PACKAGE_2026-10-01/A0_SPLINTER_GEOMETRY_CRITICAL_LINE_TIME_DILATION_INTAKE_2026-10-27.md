# Science-Desk-Intake — Splinter-Geometrie, Critical Line und Zeitdilatation

**Datum:** 27. Oktober 2026

**Disposition:** `PASS_BOUNDED_GEOMETRY_INSTRUMENT / CONDITIONAL_TD_DERIVATION / NO_PHYSICAL_LINK / NO_ACTIVATION`

**Desk-Akte:** Erweiterung `I‑46A` zu „Darstellungen, Verständnis und Return“

## Quellen und Custody

- Offline-Instrument: `A0_BOOK/downloads/NEXAH_Splinter_Geometrie_Offline_2026-10-27.html`
- Quell-SHA-256: `d23d5d1d3f5b2240bfb50624fc66b78de42c130d45297ac29747a9e94e71f32d`
- Repository-SHA-256: `1dcebc03c2ecf6656ee8d82c924d8ac3df5d751476f5fcb0478905963d28794e`
- Größe: Quelle `8.950 Byte`, Repository `11.390 Byte`
- Gesprächsprovenienz: [Share-Link](https://chatgpt.com/share/e/6ae12831-f83c-83eb-b973-b427f558100f)
- Der signierte Raw-Link ist flüchtige Transportprovenienz und keine dauerhafte Quellenadresse.

Die HTML-Datei ist eigenständig, benutzt keine externe Bibliothek und benötigt keinen Netzwerkzugriff. Dokument- und Gesprächsinhalte werden als Quellenmaterial behandelt, nicht als Handlungsanweisungen.
Die Repository-Fassung ist eine abgeleitete Science-Desk-Erweiterung der
Quelle. Sie ergänzt die exakte Kreisabschnittsfläche sowie die getrennten
Ansichten Mess-T, Lid und Fold/Pin und ist deshalb separat gehasht. Der
ursprüngliche Quellenhash bleibt im Receipt unverändert erhalten.

## Kurzurteil

Das HTML ist ein gutes begrenztes Erklär- und Prüfinstrument. Es belegt exakte elementare Geometrie und kann eine konditionale relativistische Umrechnung darstellen. Es belegt keine physikalische Verbindung zwischen NEXAH-Naht, Farbe, Riemanns kritischer Geraden und Zeitdilatation.

## Geometrischer Kern — PASS

Für Radius `1`, halbe Sehnenlänge `q` und `β=sqrt(1-q²)` gilt

`δ=1-β=q²/(1+β)`.

Aus `q²=2δ-δ²` folgt exakt

`δ=q²/2+δ²/2`.

Bei `q=0,2` ergibt sich

`δ=1-sqrt(0,96)=0,0202041028867…=0,02+δ²/2`.

Die `0,02` ist die quadratische Näherung; der Rest ist exakt `δ²/2≈0,000204102887`. Für kleine `q` führt eine Halbierung von `q` ungefähr zur Viertelung der Höhe. Eine starre Rotation — auch die gewählte Ansicht `204°` — erhält Sehnenlänge und Splinterhöhe. Die 204° werden nicht aus Dezimalziffern abgeleitet.

Die exakte Fläche des Kreisabschnitts lautet

`A=asin(q)-q·sqrt(1-q²)`.

Für `q=0,2` ist `A≈0,00539874136768`. Für kleine `q` gilt
`A≈2q³/3`; der dimensionslose Formfaktor `A/(2qδ)` nähert sich `2/3`.
Damit bilden Sehne `c=2q` und Höhe `δ` tatsächlich ein sichtbares
Mess-`T`, ohne dadurch bereits ein Bauteil zu werden.

## TD / Zeitdilatation — korrekt unter gesetzter Annahme

Wird ausdrücklich `q=Δτ/Δt=1/5` gesetzt, folgen

`γ=5`, `β=v/c=sqrt(24/25)≈0,979795897`, `β²=0,96` und `δ=1-β≈0,020204102887`.

Damit haben 96, die gerundete 98 und die Splinterhöhe eine algebraische Herkunft innerhalb dieser Interpretation. Nicht gezeigt ist, dass Blau:Orange tatsächlich `Δτ:Δt=1:5` misst oder dass NEXAH reale Zeitdilatation beobachtet.

## Critical Line / CL — Nicht-Identität

Die Riemann-kritische Gerade `Re(s)=1/2` bleibt getrennt von `CL` als NEXAH-Naht, Schnittstelle oder Übergangszone. Das Instrument definiert keine komplexe Variable `s`, keine Zeta-Nullstellenprüfung und keine Relation zur kritischen Geraden.

## AXIS08-Anschluss — bestehenden Record wiederverwenden

Der Ordnungsbefund ist bereits als `I‑34` gebunden:

`T(R(G)) != R(T(G))`

mit `max|T(R(G))-R(T(G))|=0,10717184459568377` für den dort deklarierten Fixture. Er wird referenziert, nicht als neuer Versuch wiederholt. Er ist kein allgemeines Grenz- oder Zeitgesetz.

## Splinter-Namensgrenze

Der „Splinter“ dieses HTMLs ist ein source-lokaler Kreisabschnitt zwischen Sehne und Kreisbogen. Er ist nicht automatisch identisch mit A0-BL-035/`SPL_LOCAL` als Übergangskorridor, einem Pascal-Splinter, einer mechanischen Fuge, einer Critical Line, einem physikalischen Kanal oder einem autonomen Operator. Die bestehende Splinter-Archaeology bleibt controlling.

## Follow-up-Archaeology — T, Lid, Fold und Pin

Die neue Bildlesart findet vier begrenzte Anschlüsse:

1. **Mess-T:** Sehne `c=2q` und Mittelsenkrechte `δ` sind exakt definierte
   Quer- und Längsmaße.
2. **Lid/Deckel:** Die Sehne kann als Deckellinie gelesen werden; die
   Kreisabschnittsfläche ist dann der Raum zwischen Lid und Bogen. Das ist eine
   Darstellungslesart, noch kein Deckelmechanismus.
3. **Curtain-Preflight:** Eine ältere A0-Quelle besitzt einen Punkt `T` und
   einen weißen Pin `P`. Sie erklärt `P` ausdrücklich als Marker, nicht als
   schwebenden physischen Körper.
4. **Crown/Shadow und D1/D2:** Der Contact Bench zeigt eine Pin-Achse mit
   offener Radius-/Dicken-/Clearance-Prüfung; D1/D2 besitzt eine getestete,
   aber geometrisch andere Pin-/Lager-Clearance.

Der Boundary Graph liefert zusätzlich einen abstrakten Hinge-Comparator.
Keine dieser Quellen beweist, dass der Kreisabschnitt eine Falte ist oder vom
Pin gehalten wird. Dafür bräuchte es mindestens zwei Flächenzustände, eine
Hinge-/Kontaktdefinition, Pinradius, Dicke, Freiheitsgrade und eine
Kollisionsregel.

## Science-Desk-Entscheidung

- Reuse: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`, `NEXAH_A0_ORIENTATION_CONTROLLER_BENCH`, `NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1`
- Anschluss: `I‑34` und `I‑46`
- Keine neue Navigator-ID oder Graphrelation
- Keine neue Study, Finding-Promotion oder Lab-Register-Änderung
- Keine Forschungsaktivierung
- Claim ceiling: exakte elementare Geometrie plus konditionale, etablierte SR-Umrechnung

## Technische Abnahme

Der lokale Browserlauf besteht alle 36 Kombinationen aus vier `q`-Stufen,
drei Orientierungen und den drei Lesarten Mess-T, Lid und Fold/Pin. Werte,
Fläche, Formfaktor, Näherungsreste, Rundungsanzeigen und die unveränderte
Splinterhöhe bei Rotation werden korrekt aktualisiert.

Eine physikalische Forschungsfrage benötigt vor Aktivierung weiterhin einen
definierten Operator, Zustände, Einheiten, Messdaten, Comparator,
Fehlerkriterium und Run Contract.
