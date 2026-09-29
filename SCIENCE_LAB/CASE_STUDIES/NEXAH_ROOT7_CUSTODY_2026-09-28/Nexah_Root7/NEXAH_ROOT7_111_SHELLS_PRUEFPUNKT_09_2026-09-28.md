# Prüfpunkt 09 — 111-Strahlen und die skalierte √7-Diagonale

**Stand:** 28. September 2026. Anschluss an Prüfpunkt 06 (111×111-Feld), 08 (SCN), den √7-Gittertest und die vom Nutzer genannten Werte 222², 333², 444².

## Exakte Identität

Definiere `L=111`, `a_m=mL` und `S_m=a_m²=m²·12321`, für nichtnegative ganze m. Dann gilt allgemein

`S_(m+1)−S_m = ((m+1)²−m²)L² = (2m+1)L²`.

| m | a_m | S_m | Zuwachs seit m−1 | Quotient durch L² |
|---:|---:|---:|---:|---:|
| 1 | 111 | 12 321 | 12 321 | 1 |
| 2 | 222 | 49 284 | 36 963 | 3 |
| 3 | 333 | 110 889 | 61 605 | 5 |
| 4 | 444 | 197 136 | **86 247** | **7** |
| 5 | 555 | 308 025 | 110 889 | 9 |

**Verbindung:** `444²−333²=7·111²=86 247`. Der 4D-Ganzzahlvektor `v=(222,111,111,111)=111·(2,1,1,1)` hat `||v||²=86 247` und Länge `111√7`. Das ist die Skalierung der bekannten 4D-Diagonale. Die Strecke zwischen den auf einer Zahlengeraden liegenden Punkten 333 und 444 hat hingegen Länge **111**: Eine Differenz quadrierter Radien ist nicht automatisch die Distanz der beiden Punkte.

**3D-Schranke:** Weil 111 ungerade ist, `111²≡1 (mod 8)` und damit `7·111²≡7 (mod 8)`. Jedes ganzzahlige Quadrat ist `0`, `1` oder `4 (mod 8)`; drei solche Quadrate können sich nicht zu `7 (mod 8)` addieren. Folglich gibt es keinen 3D-Ganzzahlvektor der Länge `111√7`.

**Folgetest:** Für jeden ungeraden Skalierungsfaktor L und jedes `m≡3 (mod 4)` ist `(2m+1)L²≡7 (mod 8)` und daher als quadrierte Länge im 3D-Ganzzahlgitter ausgeschlossen. Beispiel m=7: Zuwachs `15L²`. Für die spezielle Folge m=1→2→3→4 erscheinen 3, 5, 7 als aufeinanderfolgende Primzahlen; bei m=4→5 folgt 9, daher ist die Primsituation nicht die allgemeine Regel.

## Projektion in das gewählte 111×111-Zeilenmodell

In der **gewählten** Fortsetzung `n=111²·t+111y+x` mit `0≤x,y<111` liegen die vier Quadrate exakt am lokalen Ursprung `(x,y)=(0,0)` der Kacheln `t=1,4,9,16`. Eine 111×111-Kachel hat 12 321 Indexplätze; die Quadrate sind **Kachelgrenzen**, keine vier zusätzlichen Punkte in einer einzigen Kachel. Ihre globalen Modulo-11-Reste sind 1,4,9,5; die Kachelzahl t darf deshalb beim Wrap nicht verworfen werden. Das ist eine definierte Darstellung, nicht die einzig mögliche Abbildung der NEXAH-Karten.

## Was der Befund leistet und was er offen lässt

- **Exakt:** Quadratzuwächse `2m+1`, eine explizite skalierte 4D-Diagonale und die 3D-Unmöglichkeit im Fall m=3; allgemeiner für `m≡3 (mod 4)` bei ungeradem L.
- **Ziffernbild:** 111, 222, 333, 444 und 292 sind Dezimalpalindrome. Von den gezeigten Quadraten 12 321, 49 284, 110 889, 197 136 ist **nur 12 321** palindromisch. Die mathematische Identität hängt nicht an Dezimalpalindromen: Sie gilt für jedes L.
- **Offen:** Eine aus älteren Quellen unabhängig definierte SCN- oder 292-Schaltfunktion, die gerade den Übergang m=3→4 auswählt. Die Gleichung allein erzeugt kein Schaltjahr, keinen physikalischen Kanal und keine E8-Zuordnung. Zudem ist `11²=121` aus Prüfpunkt 08 nicht `111²=12 321`.

**Interpretation für NEXAH:** Der vierte Skalenübergang ist ein guter *geometrischer Marker* für die √7-Schranke. Als Beleg für den NCS-Switch benötigt er eine vorab fixierte Regel, die diese Skala gegenüber anderen Skalen auszeichnet.
