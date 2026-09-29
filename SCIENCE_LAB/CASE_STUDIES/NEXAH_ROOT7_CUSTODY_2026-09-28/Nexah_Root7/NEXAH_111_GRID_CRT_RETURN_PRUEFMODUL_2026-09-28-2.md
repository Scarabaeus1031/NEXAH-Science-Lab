# NEXAH · 111er-Grid, CRT und Return

**Status:** rechnerisch geprüftes Rastermodell; die Fibonacci-Quaternion-Brücke ist eine ausdrücklich gewählte Einbettung. **Datum:** 28. September 2026.

## 1. Definitionen und exakter Befund

Das Grid hat 111 Spalten und 111 Zeilen, mit `0 ≤ i,j ≤ 110`. Die zeilenweise Adresse ist

\[
n=i+111j\quad(0\leq n\leq12320),\qquad 111^2=12321.
\]

Die Zeilenschrittweite hat unter den beiden teilerfremden Moduli unterschiedliche Vorzeichen:

\[
111\equiv-1\pmod7,\qquad111\equiv+1\pmod{11}.
\]

Daher gelten **für jedes Gridfeld** die beiden Kanäle

\[
n\equiv i-j\pmod7,\qquad n\equiv i+j\pmod{11}.
\]

Die chinesische Restsatz-Rekonstruktion bestimmt allein die **Restklasse** der Adresse modulo 77, nicht die volle Adresse oder beide Koordinaten:

\[
n\equiv22\,(i-j)+56\,(i+j)\pmod{77}.
\]

Denn `22 ≡ 1 (mod 7), 22 ≡ 0 (mod 11)` und `56 ≡ 0 (mod 7), 56 ≡ 1 (mod 11)`.

## 2. Drehung, Grenze und +1

Die 180°-Drehung des endlichen Grids ist

\[
R(i,j)=(110-i,110-j),\qquad R(n)=12320-n.
\]

Da `12320 = 111² − 1 = 77 × 160`, gilt gleichzeitig `R(n) ≡ −n (mod 7)` und `R(n) ≡ −n (mod 11)`, somit auch modulo 77. Der Mittelpunkt `(55,55)` hat Adresse 6160 und Rest 0 modulo 77. Darüber hinaus ist `111 ≡ 34 (mod 77)` eine nichttriviale Quadratwurzel von 1: `34² ≡ 1 (mod 77)`; ihre CRT-Komponenten sind `(−1 mod 7, +1 mod 11)`.

**Die Grenzunterscheidung:** `n=12320` ist das letzte Gridfeld `(110,110)` und hat CRT-Rest 0. `n=12321` ist *kein* Feld dieses Grids. Beim zyklischen Wickeln `n mod 12321` fällt es auf das erste Feld `(0,0)` zurück; zugleich ist `12321 ≡ 1 (mod 77)`. Ein voller Durchlauf erzeugt also einen **CRT-Drift von +1**. Rückkehr der Gridposition und Rückkehr der CRT-Adresse sind verschiedene Aussagen. Erst nach 77 solchen Durchläufen ist auch die CRT-Restklasse wieder dieselbe.

## 3. Zahlenbeispiel 4774 + 292 = 5066

| Zahl | Grid `(i,j)` | `mod 7 = i−j` | `mod 11 = i+j` | `mod 77` | Primfaktoren |
|---:|:---:|---:|---:|---:|:---|
| 4774 | `(1,43)` | 0 | 0 | 0 | `2·7·11·31` |
| 292 | `(70,2)` | 5 | 6 | 61 | `2²·73` |
| 5066 | `(71,45)` | 5 | 6 | 61 | `2·17·149` |

Hier addieren sich die Koordinaten ohne Übertrag. Die 7 und 11 teilen 4774; 17 teilt 5066. Der Faktorenwechsel ist eine Eigenschaft dieser gewählten Zahlen, keine aus CRT erzwungene Primzahl-Regel.

## 4. Deklarierte Fibonacci-Quaternion-Einbettung

Für ein **gewähltes**, orientiertes Ganzzahlpaar `(a,b)` definieren wir

\[
E(a,b)=(a+b,a,b,b),\qquad G(a,b)=6160+a+111b.
\]

Die Projektion `P(x,y,z,w)=(y,z)` erfüllt `P(E(a,b))=(a,b)`: ein Rückweg **auf dem Bild von E**. Sie ist keine inverse Abbildung von beliebigen Quaternionen. Für die Seed-Werte gilt `E(1,1)=(2,1,1,1)` und `||E(1,1)||²=7`. Die Quaternion-Norm hat allgemein den Wert `2a²+2ab+3b²`. Mit Fibonacci-Update `T(a,b)=(b,a+b)` folgt `T(1,1)=(1,2)`, aber `||E(1,2)||²=18`, nicht 17.

Die Spiegelverträglichkeit ist exakt, solange `G(a,b)` innerhalb des Grids liegt:

\[
12320-G(a,b)=G(-a,-b),\qquad E(-a,-b)=-E(a,b).
\]

Außerdem `G(a,b) mod 7 = a−b` und `G(a,b) mod 11 = a+b`, weil 6160 durch 77 teilbar ist. Die Wahl, gerade die Koordinate `b` im Quaternionvektor zu wiederholen, stammt aus der Modelldefinition; eine einzigartige physikalische oder zahlentheoretische Notwendigkeit dafür wurde nicht gezeigt.

## 5. Prüfstand und Grenzen

Die unten stehende unabhängige Schleife überprüft alle 12 321 Felder. Für die Quaternion-Abbildung prüft sie nur die angegebenen Definitionen, nicht deren Einzigartigkeit.

```python
SIDE = 111
SPAN = SIDE * SIDE - 1
assert SPAN == 12320 and SPAN % 77 == 0

for j in range(SIDE):
    for i in range(SIDE):
        n = i + SIDE * j
        r7, r11 = (i - j) % 7, (i + j) % 11
        assert n % 7 == r7 and n % 11 == r11
        assert n % 77 == (22 * r7 + 56 * r11) % 77
        assert (SPAN - n) % 77 == (-n) % 77

assert 12321 % 77 == 1
assert [(n % 7, n % 11) for n in (4774, 292, 5066)] == [
    (0, 0), (5, 6), (5, 6)
]

def E(a, b):
    return a + b, a, b, b

def G(a, b):
    return 6160 + a + 111 * b

for a, b in ((1, 1), (1, 2), (2, 3), (-1, -1)):
    assert (E(a, b)[1], E(a, b)[2]) == (a, b)
    assert SPAN - G(a, b) == G(-a, -b)

assert sum(x*x for x in E(1, 1)) == 7
assert sum(x*x for x in E(1, 2)) == 18
print("PASS: 12321 Gridfelder; CRT, Drehung und definierte Einbettung")
```

## 6. Zwölfteiliger Takt und 112er-Mikrotakt (Nachtrag)

Die älteren Tafeln *NEXAH Orientation Dynamics II/III*, *Shiva-Q° Pipe* und *Drift Quantization* zeigen bereits die Labels `−1/12 Drift`, `+1/12 Draft` und `+1/112 Micro Drift/Draft`. Diese Labels sind Modellnotationen der Tafeln. Die folgende Abbildung definiert ihre **neue, eng begrenzte Verwendung in diesem Grid**; sie behauptet keine Lorenz-, Kuramoto- oder andere physikalische Dynamik.

Wir wählen für jede Integeradresse `n=i+111j` zusätzlich die Phasenlinsen `c12(n)=n mod 12` und `c112(n)=n mod 112`. Ein Tick ist `1/m` einer Umdrehung in der jeweiligen Linse; `1/12 = 30°`, `1/112 ≈ 3,2142857°`. Bei der 112er-Linse ist der Zeilenschritt dem Spaltenschritt entgegengesetzt, **weil `111 ≡ −1 (mod 112)`**:

| Linse | Formel für `(i,j)` | Eine Spalte `+1` | Eine Zeile `+111` | Ein ganzer Gridumlauf `+12321` |
|---|---|---|---|---|
| `mod 7` | `i−j` | `+1` | `−1` | `+1` |
| `mod 11` | `i+j` | `+1` | `+1` | `+1` |
| `mod 12` (gewählter Makrotakt) | `i+3j` | `+1/12` | `+3/12` | `+9/12` |
| `mod 112` (gewählter Mikrotakt) | `i−j` | `+1/112` | `−1/112` | `+1/112` |

Da `12320 = 110×112 = 160×77`, ist das letzte Gridfeld unter `mod 77` **und** `mod 112` Rest 0. Die unmittelbar folgende Zahl `12321` ist unter beiden Rest 1. Das ist eine echte arithmetische Verankerung für den *Mikrotick* `+1/112` an der Grenze. Unter `mod 12` lauten die beiden Reste dagegen 8 und 9: Auch dort ist die Grenzüberschreitung ein einzelner Tick, **aber das volle Grid beginnt nicht bei einer 12er-Nullphase und endet nicht dort**. Der `1/12`-Takt bleibt eine zusätzlich gewählte Darstellung.

Wenn wir „Draft“ als positiven Vorschritt und „Drift“ als gerichtete Abweichung lesen möchten, müssen diese Rollen ausdrücklich so **definiert** werden. Die Bilder allein legen keine unterschiedlichen Rechenoperatoren für die beiden englischen Wörter fest. Die Tabelle liefert zwei überprüfbare Richtungen für `mod 112` (`+` Spalte, `−` Zeile), ohne daraus nachträglich eine physikalische Semantik abzuleiten.

Der sequenzielle vollständige Gridumlauf ändert `mod 77` um `+1`, `mod 112` um `+1`, `mod 12` um `+9`. Die einzelnen Linsen kehren nach 77, 112 beziehungsweise 4 Umläufen zu ihrem vorigen Rest zurück; **alle drei gemeinsam nach 1232 Umläufen**. Diese letzte Zahl ist eine Periodenrechnung für das deklarierte Mehrlinsenmodell, keine Beobachtung eines Naturzyklus.

```python
from math import gcd, lcm

SIDE, LENGTH = 111, 111**2
assert (LENGTH - 1) % 77 == (LENGTH - 1) % 112 == 0
assert (LENGTH % 77, LENGTH % 112, LENGTH % 12) == (1, 1, 9)
for j in range(SIDE):
    for i in range(SIDE):
        n = i + SIDE*j
        assert n % 12 == (i + 3*j) % 12
        assert n % 112 == (i - j) % 112
assert lcm(77, 112, 12 // gcd(LENGTH, 12)) == 1232
print("PASS: 12er- und 112er-Linsen auf allen 12321 Feldern")
```

**Befundstatus:** volle arithmetische Prüfung der Rasteridentitäten und der beiden zusätzlich definierten Taktlinsen; definierter, teilweise reversibler Fibonacci-Quaternion-Modelloperator. Kein einzigartig aus den Bildern abgeleiteter Drift/Draft-Operator, keine abgeleitete Quaternion-Primzahl-Dynamik, kein automatischer Übergang zu √17 und keine nachgewiesene physikalische Bedeutung.

## 7. Formatvergleich: 111×111 gegen 112×110

**Konvention:** `112×110` heißt 112 Spalten und 110 Zeilen. Beide Formate werden zeilenweise ab der Integeradresse 0 gefüllt. Diese Konvention ist Teil des Tests; die Rasterform allein setzt keine identischen räumlichen Nachbarschaften voraus.

```text
111² = 12321 = 10×1232 + 1
112×110 = 12320 = 10×1232
1232 = 112×11 = lcm(77,112)
```

**CRT-Basis als deklarierte Verfeinerung:** 112 und 11 sind teilerfremd. Ein Adressrest modulo 1232 lässt sich eindeutig aus `(n mod 112, n mod 11)` rekonstruieren:

```text
n ≡ 561·(n mod 112) + 672·(n mod 11)  (mod 1232).
```

Hier sind `561 ≡ 1 (mod 112), ≡ 0 (mod 11)` und `672 ≡ 0 (mod 112), ≡ 1 (mod 11)`. Die 7 ist bereits in `112=16×7` enthalten; `mod 7` ist **kein dritter unabhängiger CRT-Kanal**.

| Raster | Linearisierung | `mod 112` | `mod 11` | 180°-Drehung modulo 1232 |
|---|---|---|---|---|
| Quadrat 111×111 | `n=i+111j`, `0≤i,j≤110` | `i−j` | `i+j` | `n' ≡ −n`, denn `n'=12320−n` |
| Rechteck 112×110 | `n=x+112y`, `0≤x≤111, 0≤y≤109` | `x` | `x+2y` | `n' ≡ −1−n`, denn `n'=12319−n` |

Der Quadrat-Zeilenschritt 111 ist modulo 1232 invertierbar und hat Ordnung 2: `111²=12321≡1 (mod 1232)` und `111≠1 (mod 1232)`. Der Rechteck-Zeilenschritt 112 ist dort **nicht invertierbar** (`gcd(112,1232)=112`); sein Rest modulo 112 ist 0. Das unterscheidet die zwei Ansichten algebraisch, ohne ein Gesetz über Primzahlen zu liefern.

**Vollständige Enumeration:** Die linearen Adressen 0 bis 12319 liegen in beiden Formaten und besitzen dieselben CRT-Reste. Ihre Koordinaten unterscheiden sich in 12209 von 12320 Fällen. Im Rechteck erscheint jede der 1232 Restklassen genau zehnmal. Das Quadrat besitzt zusätzlich `n=12320` an `(110,110)`: Restklasse 0 kommt dort elfmal vor, jede andere zehnmal. Die nächste Adresse 12321 liegt außerhalb des Quadrats und hat Restklasse 1.

**QRT/ILAU bei deklariertem Vergleich:** Die gemeinsamen linearen Adressen sind `I` (retained). Die Quadratansicht hat eine zusätzliche Adresse 12320 als `A` (introduced **relativ zum Rechteck**); sie erzeugt damit keine neue CRT-Restklasse, sondern eine weitere Instanz von Rest 0. Der `+1`-Phasenschritt zur folgenden Adresse kann als `r` (residual) protokolliert werden. `U` bleiben eine physikalische Dynamik und eine zwingende Fibonacci-/√7-Anbindung. Die Labels benennen Vergleichsergebnisse; sie sind keine Rechenoperatoren.

```python
from collections import Counter
from math import gcd

BASE = 112 * 11
RECT, SQUARE = 112 * 110, 111 * 111
assert (BASE, RECT, SQUARE) == (1232, 12320, 12321)
assert (RECT, SQUARE) == (10 * BASE, 10 * BASE + 1)
assert gcd(112, 11) == 1 and gcd(112, BASE) == 112

def crt(r112, r11):
    return (561 * r112 + 672 * r11) % BASE

rect_counts, square_counts = Counter(), Counter()
changed_coordinates = 0
for n in range(RECT):
    i, j = n % 111, n // 111
    x, y = n % 112, n // 112
    assert crt((i - j) % 112, (i + j) % 11) == n % BASE
    assert crt(x, (x + 2*y) % 11) == n % BASE
    rect_counts[n % BASE] += 1
    square_counts[n % BASE] += 1
    changed_coordinates += (i, j) != (x, y)
    assert (RECT - 1 - n) % BASE == (-1 - n) % BASE
for n in range(RECT, SQUARE):
    square_counts[n % BASE] += 1
for n in range(SQUARE):
    assert (SQUARE - 1 - n) % BASE == (-n) % BASE

assert changed_coordinates == 12209
assert all(rect_counts[r] == 10 for r in range(BASE))
assert square_counts[0] == 11
assert all(square_counts[r] == 10 for r in range(1, BASE))
assert SQUARE % BASE == 1
print("PASS: beide Formate, CRT-1232, Spiegel und Restzählung")
```

**Erweiterter Befundstatus:** volle arithmetische Prüfung der zwei Rasterformate und Phasenlinsen. Die CRT-Basis 1232 verfeinert die bestehende 77er-Adresse; QRT/ILAU beschreiben Repräsentationswechsel und Vergleichsergebnisse. Keine neue Zahlentheorie, keine eindeutig abgeleitete physikalische Dynamik und kein automatischer Fibonacci-/√17-Mechanismus.
