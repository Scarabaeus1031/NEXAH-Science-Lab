# Prüfpunkt 08 — SCN / Select Cut N auf der +8-Bahn

**Datum:** 28. September 2026. Anschluss an Prüfpunkt 07 (7801/7809/292), CARD_08, CARD_09, Root Cube v2.05 und JANUS ROPE OPERATOR. Die Zuordnung `29↔92` und 292 NCS sind Bildbeschriftungen; ein externer Datensatz mit tatsächlichen Switch-Ereignissen liegt für diese Bahn nicht vor.

## Vorab festgelegter Test

`n(k)=7801+8k`, für `k=0,...,10`. Auswahlfunktion `SCN_r(k)=1` genau dann, wenn `n(k) mod 11=r`. Die drei **konkurrierenden** Kandidaten sind `r=0` (Nullrest / Feldabschluss), `r=292 mod 11=6` (Zahlencode des NCS) und `r=29 mod 11=7` (Wert der X. Primzahl). Diese Wahl ist eine Testdefinition, keine aus den Karten abgeleitete NCS-Regel.

| k | n(k) | mod 11 | x=n mod 111 | y=⌊n/111⌋ | SCN-Kandidat |
|---:|---:|---:|---:|---:|---|
| 0 | 7801 | 2 | 31 | 70 | – |
| 1 | 7809 | 10 | 39 | 70 | – |
| 2 | 7817 | 7 | 47 | 70 | 29-Wert |
| 3 | 7825 | 4 | 55 | 70 | – |
| 4 | 7833 | 1 | 63 | 70 | – |
| 5 | 7841 | 9 | 71 | 70 | – |
| 6 | 7849 | 6 | 79 | 70 | 292-Wert |
| 7 | 7857 | 3 | 87 | 70 | – |
| 8 | 7865 | 0 | 95 | 70 | Nullrest |
| 9 | 7873 | 8 | 103 | 70 | – |
| 10 | 7881 | 5 | 0 | 71 | Zeilenwechsel im **gewählten** Raster |

Nach `k=11` folgt 7889 mit Rest 2; die Restklassen wiederholen sich, die Zahlenwerte nicht. Der Beweis ist `gcd(8,11)=1`: die Addition von 8 durchläuft zwangsläufig alle elf Restklassen genau einmal. **Jede** fest gewählte Zielrestklasse selektiert daher exakt einen Punkt je Periode. Das ist eine Eigenschaft der Modulo-Bahn, keine Evidenz für einen der drei NCS-Kandidaten.

## Kontrolltests

1. **Verschobener Start:** Bei 7793 als Start wählt `r=6` Index 7, bei 7801 Index 6, bei 7809 Index 5. Die ausgewählte absolute Zahl ist jeweils 7849. Der Selektor ist damit lediglich eine Eigenschaft der Zahl modulo 11, unabhängig davon, wo wir die Sequenz beginnen.
2. **292 als echter Modulus:** Jedes `n(k)=7801+8k` hat Rest 1 modulo 4; `292=4·73`. Daher ist für *alle* ganzzahligen k `n(k) mod 292 ≠ 0`. Ein literal gemeinter Teilbarkeitsswitch `SCN(k)=[292 | n(k)]` schaltet auf dieser gesamten Bahn **nie**. Das widerlegt keine andere, noch zu definierende Zustandsregel für den 292 NCS.
3. **Feld-Zeilenwechsel:** Die Zeile in der frei gewählten Abbildung `n=x+111y` wechselt erst bei k=10 (7881). Dies fällt mit keinem der Kandidaten k=2, k=6, k=8 zusammen. Ein physikalisches Gate folgt daraus nicht.
4. **Indizes versus Werte:** Die Primzahlen 11 und 29 haben Position V und X; ihre Positionssumme ist XV=15, ihre Wertsumme 40=XL. Die Kalendernotation 29.2. und zwei Viererschritte (4+4=8) liefern Motiv und Schrittgröße, aber ohne Kalenderzustand keinen Gate-Index.

## Entscheidung

**Bestätigt:** Exakte +8-Bahn, vollständiger 11-Phasenzyklus, drei unterscheidbare Schnittstellen und Ausschluss einer wörtlichen Teilbarkeit durch 292. **Noch nicht bestätigt:** Welche Schnittstelle das NCS-Ereignis bezeichnet; ob 29. Februar, Janus Closure, Root Cube und SCN einen gemeinsamen messbaren Operator teilen. Ein Nachweis benötigt eine *unabhängige* Zustandsmarkierung `gate(k)` oder eine aus dem alten NCS-Modul eindeutig entnehmbare Entscheidungsfunktion, vor Auswahl des Rests r. Ohne solche Markierung bleibt SCN eine sauber spezifizierte **Kandidatenfamilie**.

## Reproduzierbar in Python

```python
from math import gcd

assert gcd(8, 11) == 1
orbit = [(k, 7801 + 8*k, (7801 + 8*k) % 11) for k in range(11)]
assert sorted(r for _, _, r in orbit) == list(range(11))
assert {r: [(k,n) for k,n,a in orbit if a == r] for r in (0,6,7)} == {
    0: [(8,7865)], 6: [(6,7849)], 7: [(2,7817)]
}
assert all((7801 + 8*k) % 292 != 0 for k in range(73))
# Fuer alle ganzen k folgt dasselbe bereits aus (7801+8k) % 4 == 1.
```
