# Prüfpunkt 13 — Winkelversatz und 404-Gate

**Datum:** 28. September 2026. **Status:** Rechentest zweier ausdrücklich gewählter Abbildungen, keine historische SCN-Regel. Baut auf Prüfpunkt 12 auf. Das Feedback zu CRT und Angle Folds korrigiert die Nummerierung 60/61, die Parität der +8-Spur und das Vorzeichen der 50°→60°-Differenz. Damit liefert es noch keine Abbildung der Winkel und Restklassen auf die Regler des bestehenden 404-Labyrinths.

## Unabhängige Gate-Regel

Der vorbestehende Code des `knickfield-labyrinth.html` verwendet ganzzahlige Regler `a,b` in `[-45,45]`. Mit `phase=b-a`, `mean=(a+b)/2` gilt 404/Alignment genau dann, wenn `abs(phase)<8`, `abs(mean)<6` und `hypot(4.2*phase,6.2*mean)<34`. Die Angabe „404“ ist im Code eine UI-Zustandsbezeichnung, keine Winkelangabe.

## Test A — Ein Winkelpaar, zwei Nullpunkte

Wir nehmen die im Feedback genannten 50° und 60° und teilen beide Winkel durch 10. Diese Skalierung ist eine **Kandidatenkonvention**, keine aus dem Labyrinth abgeleitete Kalibrierung.

| Abbildung | a | b | phase | mean | Alignment-Metrik | 404? |
|---|---:|---:|---:|---:|---:|---|
| absolut: `(50/10,60/10)` | 5 | 6 | 1 | 5,5 | 34,3577 | nein: Metrik ≥34 |
| um 50° verschoben: `((50-50)/10,(60-50)/10)` | 0 | 1 | 1 | 0,5 | 5,2202 | ja |

Beide Abbildungen haben dieselbe Differenz `b-a=1`. Die Verschiebung ändert aber den Mittelwert, den der vorhandene Gate-Code ebenfalls auswertet. Auch `10°/10=+1 mod 11`, nicht `−1 mod 11`. Man könnte mit `10° mod 11=−1` rechnen, würde damit aber die Einheit und Abbildung wechseln. Der Winkelabstand alleine bestimmt keinen 404-Zustand.

## Test B — Eine vor dem Test fixierte SCN-Kandidatenbrücke

Als Anschluss an Prüfpunkt 12 definieren wir ausdrücklich: `r=n mod 11`, `d(r)=r` für `r≤5`, sonst `r−11`, und `F(r)=(a,b)=(-d(r),d(r))`. Die gewählte Verstärkung 1 kann man als *einen Regler-Tick pro 10°-Schritt* lesen. Die Texte definieren jedoch weder eine Winkelphase `θ(n)` noch, warum `r=0` das Zentrum beider Regler sein muss. Dies ist somit eine **Modellwahl**.

| Start | 404-Treffer in einem vollständigen 11er-Zyklus (k) | Zahl bei Restklasse 0 | 404 an den behaupteten SCN-Rollen? |
|---:|---|---:|---|
| 7801 | 0, 1, 4, 5, 7, 8, 9 | 7865 (k=8) | k=2 und k=6 nein; k=8 ja, neben sechs weiteren Treffern |
| 8000 | 0, 1, 2, 4, 5, 8, 9 | 8008 (k=1) | Rollen k=6,10,12 nicht durch Trefferliste dieses ersten Zyklus gedeckt; siehe unten |

Für den verschobenen Start 8000 liegen die vorab definierten Rollen `r=7,6,0` bei `k=6,10,12`. Der Adapter weist `r=7` und `r=6` stets **kein** 404-Alignment zu und `r=0` stets **404**; er wiederholt also genau diese per Konstruktion festgelegte Musterwahl im nächsten Zyklus. Er bestätigt damit keine unabhängige Winkelregel. Die Zahl 8008 (k=1) ist nur die erste Nullrest-Stelle nach 8000, während die sequenzielle SCN-Regel die Schließung *nach* r=6 auswählt, also k=12 und 8096. Wegen Periodizität modulo 11 haben beide r=0 dasselbe Adapterergebnis.

**Zusätzliche Nullpunktkontrolle aus Prüfpunkt 12:** Setzt man `d(r)=r−5` statt des zentrierten Restes und die Verstärkung auf 4, wählt derselbe historische 404-Code exklusiv `r=5` statt `r=0`. Eine eindeutige Adapterkalibrierung ist weiterhin nicht belegt.

## Weitere überprüfte Aussagen des Feedbacks

- `1087 mod (10,11,12,60)=(7,9,7,7)` ist korrekt. Weil 10 und 12 nicht teilerfremd sind, gilt hier die kompatible verallgemeinerte Restklassenrechnung; es folgt keine Bindung an eine Rastermitte. Bei `1..121` liegt sie bei 61, bei `0..120` bei 60.
- Alle `7801+8k` sind ungerade, 292 und 404 gerade. Eine direkte numerische Identifikation ist ausgeschlossen. Abstrakte Zustandsnamen könnten durch eine eigens definierte Funktion gekoppelt werden; eine solche Funktion liegt nicht vor.
- `33°=0,57595865... rad` und `π/5,45=0,57643902... rad` liegen nahe beieinander. Eine Folgerung auf 7 oder √7 fehlt. `360/φ²≈137,507764°` liegt nahe 137,5°; kein Faktor 73 wird daraus hergeleitet.
- `444−404=11+29=40` und `12928=11·1087+971` sind korrekt, definieren aber für sich keine Winkel- oder Return-Operation.

## Reproduktion

```python
from math import hypot

def check(a,b):
    phase=b-a
    mean=(a+b)/2
    metric=hypot(4.2*phase,6.2*mean)
    return abs(phase)<8 and abs(mean)<6 and metric<34

assert check(5,6) is False
assert check(0,1) is True

def bridge(n):
    r=n%11
    d=r if r<=5 else r-11
    return -d,d

def hits(start):
    return [k for k in range(11) if check(*bridge(start+8*k))]

assert hits(7801)==[0,1,4,5,7,8,9]
assert hits(8000)==[0,1,2,4,5,8,9]
assert [(k,(8000+8*k)%11,check(*bridge(8000+8*k))) for k in (6,10,12)] == [(6,7,False),(10,6,False),(12,0,True)]
```

**Prüfentscheidung:** Die Winkel liefern eine beschreibbare Variation, aber keine festgelegte prädiktive SCN→404-Kopplung. Für einen belastbaren nächsten Test benötigt man eine *vor dem Zahlenvergleich* unabhängige, in Einheiten definierte Regel `θ,n → (a,b)` einschließlich Ursprung und Richtung. Danach müssten die Gate-Treffer und Negativkontrollen auf weiteren Spuren ohne Nachjustierung geprüft werden.
