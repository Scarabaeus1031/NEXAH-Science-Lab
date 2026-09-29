# Prüfpunkt 14 — Ziffernumkehr, modulo 11 und SCN-Spiegel

**Stand:** 28. September 2026. **Status:** exakter Zahlentheorie-Befund; die Deutung als NEXAH-Horizonmirror ist eine Modellzuordnung. Kein Nachweis einer dynamischen 292→404-Schaltung.

## 1. Was die Umkehr mathematisch tut

Für eine Dezimalzahl `N` mit **fester Ziffernlänge** `L` sei `rev_L(N)` die Umkehr der `L` Ziffern (führende Nullen werden bei Bedarf als Platzhalter beibehalten). Weil `10 ≡ −1 (mod 11)`, gilt

`rev_L(N) ≡ (−1)^(L−1) N (mod 11)`.

Folglich invertiert die Umkehr bei geradem `L` den Rest modulo 11; bei ungeradem `L` erhält sie den Rest. Für vierstellige Zahlen ist also `r' ≡ −r mod 11`. Bei `r=0` ist die Null ihr eigener Spiegel. Bei positivem Rest `r` ist der Standardvertreter des Gegenrests `11−r`.

Für wiederholte zweistellige Blöcke `ab|ab` gilt zusätzlich `N=101(10a+b)` und `rev_4(N)=101(10b+a)`. Ihre Summe ist `N+rev_4(N)=1111(a+b)`, also durch 11 teilbar. Diese Identität gilt für die *ganze Klasse* solcher Paare, nicht nur für ausgewählte Kanalzahlen.

| Ziffernpaar | Reste modulo 11 | Summe | Einordnung |
|---|---|---|
| 1616 ↔ 6161 | 10 ↔ 1 | 7777 | Vierstellige Inversion |
| 3232 ↔ 2323 | 9 ↔ 2 | 5555 | Vierstellige Inversion |
| 6464 ↔ 4646 | 7 ↔ 4 | 11110 | Vierstellige Inversion |
| 1919 ↔ 9191 | 5 ↔ 6 | 11110 | Zentral benachbarte Restklassen |
| 1414 ↔ 4141 | 6 ↔ 5 | 5555 | Gegenprobe: dieselbe zentrale Paarung |
| 12928 ↔ 82921 | 3 ↔ 3 | 95849 | Fünfstellig: Rest bleibt erhalten |
| 404 ↔ 404 | 8 ↔ 8 | 808 | Dreistellig: Rest bleibt erhalten |

Die 5↔6-Paarung ist wegen des ungeraden Modulus 11 die zentrale Paarung *unter den von 0 verschiedenen Standardresten*. Sie kennzeichnet `1919↔9191` nicht eindeutig: unter vierstelligen wiederholten Blöcken mit Ziffern 1…9 treten auch `1414↔4141`, `2525↔5252`, `3636↔6363`, `4747↔7474`, `5858↔8585` und `6969↔9696` auf.

## 2. Echte Folgerung für die 7801-Spur

Auf `n_k=7801+8k` ist `r_k≡2+8k (mod 11)`. Fordert man für einen Spiegelpartner nur `r_k'≡−r_k (mod 11)`, dann gilt nach Umformen

`k+k'≡5 (mod 11)`, also `k'≡5−k (mod 11)`.

| k ↔ k' | Restklassen | Bemerkung |
|---|---|---|
| 0 ↔ 5 | 2 ↔ 9 | Standardpaar |
| 1 ↔ 4 | 10 ↔ 1 | Wie beim Block 1616↔6161 |
| 2 ↔ 3 | 7 ↔ 4 | Impulsrest 7 hat Gegenrest 4 |
| 6 ↔ 10 | 6 ↔ 5 | Vorbereitungsrest 6 trifft Gegenrest 5 |
| 7 ↔ 9 | 3 ↔ 8 | Standardpaar |
| 8 ↔ 8 | 0 ↔ 0 | einziger Fixpunkt in einem 11er-Zyklus |

Die gespiegelten SCN-Zahlen sind **nicht notwendigerweise die Dezimalumkehr voneinander**: gespiegelt wird hier nur ihre Restklasse. Beispiel: k=6 liefert 7849 mit Rest 6, k=10 liefert 7881 mit Rest 5; `rev_4(7849)=9487`, nicht 7881.

Verschiebt man den Spuranfang auf 8000, lautet die Indexregel stattdessen `k+k'≡2 (mod 11)` und der Fixpunkt liegt bei k=1 (8008). Daher ist k=8 als Fixpunkt *startgebunden*, während die Eigenschaft „genau ein Nullrest-Fixpunkt pro Umlauf“ allgemein gilt.

## 3. Reichweite des Befunds

`292 mod 11=6`, `808 mod 11=5`; damit stehen **ihre Reste** in der Paarung 6↔5. Ebenso ist `7849 mod 11=6`. Aus gleicher Restklasse folgt weder Zahlengleichheit noch Zustandsübergang. `292+808=1100` liefert eine zusätzliche exakte Zahlengleichung, definiert jedoch ebenfalls keinen Zeitoperator, der 292 in 808 oder 404 schaltet.

**Prüfentscheidung:** Die vierstellige Ziffernumkehr liefert eine echte allgemeine Involution und erzeugt eine berechenbare Spiegelpaarung auf der SCN-Bahn. Für einen prädiktiven „Horizonmirror“-Mechanismus muss zusätzlich eine unabhängige Regel feststehen, *welche Zahlen oder Zustände überhaupt umgekehrt werden, wann das geschieht und wie das Ergebnis in die Regler `a,b` des 404-Labyrinths eingeht*. Die bloße Restklassenpaarung beweist das nicht.

## Reproduktion

```python
pairs=[(1616,6161),(3232,2323),(6464,4646),(1919,9191),(1414,4141)]
assert all((a+b)%11==0 for a,b in pairs)
assert 12928%11==82921%11==3
assert 404%11==8
for start, expected in ((7801,5),(8000,2)):
    for k in range(11):
        mate=(expected-k)%11
        assert ((start+8*k)+(start+8*mate))%11==0
assert 7849%11==292%11==6
assert 7881%11==808%11==5
assert int(str(7849)[::-1])!=7881
```
