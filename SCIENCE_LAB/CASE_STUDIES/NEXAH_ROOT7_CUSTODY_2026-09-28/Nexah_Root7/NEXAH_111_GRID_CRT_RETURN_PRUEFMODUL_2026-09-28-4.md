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

## 8. Provenienztest 1729 und Gegenspur modulo 11

**Fragestellung:** Bleiben die zwei Kubuszerlegungen von 1729 bei der Abbildung auf eine Rasteradresse unterscheidbar? Erzwingt der Rest `1729 mod 11 = 2` eine besondere Gegenspur zu `n_k=7801+8k`?

### Zwei Quellen, eine Adresse

Wir protokollieren zunächst ungeordnete Paare positiver ganzer Zahlen als *Quellen* und bilden erst danach `F(a,b)=a³+b³`. Die folgende Kontrollzahl wurde nach derselben Vorschrift geprüft:

| Zahl `n` | Zwei verschiedene Quellen `(a,b)` | `n mod 11` | Adresse im 111×111 Raster `(i,j)` | Adresse im 112×110 Raster `(x,y)` | `n mod 1232` |
|---|---|---:|---:|---:|---:|
| 1729 | `(1,12)` und `(9,10)` | 2 | `(64,15)` | `(49,15)` | 497 |
| 4104 (Kontrolle) | `(2,16)` und `(9,15)` | 1 | `(108,36)` | `(72,36)` | 408 |

Die beiden Quellen ergeben *innerhalb jeder Zeile* denselben Integerwert `n`. Deshalb können weder `n mod 11`, noch die Rasterkoordinaten, noch die CRT-Signatur die Kubuspaare auseinanderhalten. Das gilt auch für 4104: Der Informationsverlust ist eine Eigenschaft der Abbildung `F`, kein spezieller Effekt der 1729. Soll das System die Herkunft rekonstruieren, muss es `(a,b)` oder einen eindeutigen Quellenbezeichner **zusätzlich** übergeben. Bei einem Vergleich zwischen einem vorgelagerten Datensatz *mit* Quellpaaren und dem nachgelagerten Datensatz *nur mit* `n` darf QRT/ILAU die Herkunft als verloren (`L`) protokollieren; der Zahlenwert `n` bleibt erhalten (`I`). Welche Quelle tatsächlich verwendet wurde, ist aus `n` allein unentschieden (`U`). Wurde von Anfang an kein Quellpaar erfasst, ist dessen Herkunft nicht rückwirkend als „verloren“ nachgewiesen.

### Gewählte Spiegelung und unabhängige Zentren

Für `r_k=n_k mod 11` **definieren** wir eine bei Rest 2 verankerte Spiegelspur `s_k=M₂(r_k)=(4−r_k) mod 11`. Der Anlass zur Wahl von 2 ist die gemeinsame Restklasse `1729 mod 11 = 7801 mod 11 = 2`; dieser Anlass ist keine Herleitung eines Naturgesetzes. Wenn `k` um 1 steigt, gilt `r_{k+1}−r_k≡8≡−3`, während `s_{k+1}−s_k≡−8≡+3 (mod 11)`. Ferner gilt `r_k+s_k≡4`. Im gesamten Zyklus `k=0,…,10` sind die Werte:

| `k` | `r_k` | `M₂(r_k)` | `M₀(r_k)` (Kontrolle) | `M₅(r_k)` (Kontrolle) |
|---:|---:|---:|---:|---:|
| 0 | 2 | 2 | 9 | 8 |
| 1 | 10 | 5 | 1 | 0 |
| 2 | 7 | 8 | 4 | 3 |
| 3 | 4 | 0 | 7 | 6 |
| 4 | 1 | 3 | 10 | 9 |
| 5 | 9 | 6 | 2 | 1 |
| 6 | 6 | 9 | 5 | 4 |
| 7 | 3 | 1 | 8 | 7 |
| 8 | 0 | 4 | 0 | 10 |
| 9 | 8 | 7 | 3 | 2 |
| 10 | 5 | 10 | 6 | 5 |

Die beiden Kontrollen verwenden dieselbe Formel `M_c(r)=(2c−r) mod 11` mit `c=0` beziehungsweise `c=5`. **Jedes** Zentrum `c` erzeugt den Gegenschritt `+3`. Das beobachtete `+8/−3` und seine Umkehr wählen somit Zentrum 2 nicht aus. Die 180°-Drehung des **tatsächlichen** 111×111 Rasters aus Abschnitt 7 hat modulo 11 dagegen `r→−r=M₀(r)`, weil sie `n→12320−n` abbildet. Beispielsweise wird die Adresse 1729 dadurch zu 10591 mit Rest 9; die zusätzlich gewählte Abbildung `M₂(2)` gibt Rest 2. Beide Spiegelungen müssen im Modell unterscheidbar bleiben.

```python
from collections import defaultdict

sources = defaultdict(list)
for a in range(1, 26):
    for b in range(a, 26):
        sources[a**3 + b**3].append((a, b))
assert sources[1729] == [(1, 12), (9, 10)]
assert sources[4104] == [(2, 16), (9, 15)]
for n, square, rectangle, residue in [
    (1729, (64, 15), (49, 15), 497),
    (4104, (108, 36), (72, 36), 408),
]:
    assert (n % 111, n // 111) == square
    assert (n % 112, n // 112) == rectangle
    assert n % 1232 == residue

def mirror(r, c):
    return (2*c - r) % 11

for c in (0, 2, 5):
    for k in range(11):
        r = (7801 + 8*k) % 11
        nxt = (7801 + 8*(k+1)) % 11
        assert (nxt-r) % 11 == 8
        assert (mirror(nxt, c)-mirror(r, c)) % 11 == 3
        assert (r + mirror(r, c)) % 11 == (2*c) % 11

assert 1729 % 11 == 7801 % 11 == 2
assert (12320-1729) % 11 == mirror(1729 % 11, 0) == 9
assert mirror(1729 % 11, 2) == 2
print("PASS: Quellenkollision und Kontrollen für alle elf Modulo-Phasen")
```

**Befund:** Der QRT/ILAU-Vergleich hat hier einen klaren, reproduzierbaren Anwendungsfall: Eine reine Wertadresse verwischt bei beiden Kontrollzahlen den Unterschied zwischen zwei Quellen. Die definierte 2-Spiegelung modelliert einen arithmetischen Gegentakt; dass er für jedes Zentrum entsteht, verhindert eine eindeutige Identifizierung als Janus-Schaltung, physikalische Rückführung oder Verschlüsselung.

## 9. Der 953-Treffer: Addition, Dezimalteilung und Restwechsel

**Exakte Beobachtung:** `1729+7801=9530=10×953`. Die Zahl 953 ist prim, und beim Zählen ab 2 als erster Primzahl steht sie an Stelle 162. Die Teilung durch 2 und danach durch 5 ist zusammen schlicht die Teilung durch 10; sie ist hier ganzzahlig, weil die Ausgangszahlen auf 9 und 1 enden.

| Schritt | Wert | Rest modulo 11 | Was er besagt |
|---|---:|---:|---|
| Taxicab-Wert | 1729 | 2 | Wert aus zwei Kubuspaaren; Quelle bleibt nach Abschnitt 8 mehrdeutig |
| Startwert | 7801 | 2 | gewählte Verankerung der Spur |
| Summe | 9530 | 4 | folgt zwingend aus `2+2≡4`; gleich dem Rest von 202 |
| Dezimalteilung durch 10 | 953 | 7 | `10≡−1 (mod 11)`, also `953≡−9530≡−4≡7` |
| Erster Spurimpuls | 7817 | 7 | ein weiterer gleicher Rest, ohne daraus folgende Kausalbindung |

**Wichtig zur „Gegenrotation“:** Der Wechsel `4→7` ist genau die Inversion `r→−r (mod 11)`, da Division durch 10 modulo 11 einer Multiplikation mit `−1` entspricht. Damit besitzt diese Kaskade tatsächlich eine *einfach beschreibbare arithmetische Spiegelung*. Sie ist die Spiegelung `M₀` aus Abschnitt 8; sie beweist **nicht** das dort zusätzlich definierte Spiegelzentrum `M₂`, einen eingefrorenen Drift oder eine schaltende Kopplung an das 202- beziehungsweise 404-Gate. `953 mod 11 = 7` ist außerdem eine Restklassenaussage, keine geometrische Herleitung einer `√7`-Distanz.

**Kontrolle mit erhaltener Ausgangsphase:** Verschieben wir nur den Spurstart um Vielfache von 110, bleiben seine Endziffer 1 und seine Restklasse 2 modulo 11 erhalten. Daher bleiben sowohl die ganzzahlige Teilbarkeit der Summe durch 10 als auch der Ergebnisrest 7 bestehen. Die Primzahleigenschaft wechselt jedoch:

| Spurstart | `(1729+Start)/10` | Rest mod 11 | Prim? |
|---:|---:|---:|---|
| 7801 | 953 | 7 | ja |
| 7911 | 964 | 7 | nein (`4×241`) |
| 8241 | 997 | 7 | ja |

Das Beispiel 953 ist damit ein echter Primzahltreffer **innerhalb einer allgemeinen Restregel**, aber die Restregel erzwingt den Primzahltreffer nicht. Auch die Addition `1729+7801` ändert nichts am Provenienzproblem: Sie liefert denselben Wert 9530, unabhängig davon, welches Kubuspaar zuvor 1729 erzeugt hat.

**Notation und Zyklus:** Als *beschriftete Anschauung* bilden X, XI, XII die Zahlen 10, 11, 12 ab. Deren Reste modulo 11 sind `10,0,1`; bei 11 läuft der Restzähler durch Null. Der dezimale Stellenübertrag geschieht dagegen bei `9→10`. Beides lässt sich im Bild nebeneinander zeigen, sollte aber nicht als derselbe zwingende Operator behandelt werden.

```python
from math import isqrt

def is_prime(n):
    return n >= 2 and all(n % d for d in range(2, isqrt(n)+1))

assert 1729 + 7801 == 9530 == 10*953
assert is_prime(953)
assert sum(is_prime(n) for n in range(2, 954)) == 162
assert (1729 % 11, 7801 % 11, 9530 % 11, 953 % 11) == (2, 2, 4, 7)
assert 953 % 11 == (-9530) % 11
for start, q, prime in [(7801, 953, True), (7911, 964, False), (8241, 997, True)]:
    assert (start-7801) % 110 == 0
    assert (1729+start)//10 == q
    assert (1729+start) % 10 == 0
    assert q % 11 == 7 and is_prime(q) == prime
assert [n % 11 for n in (10, 11, 12)] == [10, 0, 1]
print("PASS: 953, Primzahlstelle und phasenerhaltende Kontrollen")
```

**Befundstatus:** Der Primzahltreffer 953 und die Modulo-11-Inversion durch Dezimalteilung sind geprüft. Ein eindeutiges Gate, ein eingefrorener Phasendrift oder eine physikalische Interpretation folgt daraus nicht.

## 10. Blasenbild, Base 50 und der Wechsel von Oktal zu Duodezimal

**Bildbezug:** Die beigefügten Darstellungen „Codex-Blasenmechanismus: 1 → 2 → 0 → 3“, die Base-10/20/30/40/50-Spiralen, die Root-Room-Schnitte und „Base Modulation Grid: Octal & Duodecimal“ stellen *verschiedene* Dinge dar: eine gezeichnete Zustandsfolge, beschriftete Skalierungen sowie Stellenwertsysteme. Solange weder eine Funktion für den Schritt `1→2→0→3` noch ein Skalengesetz für die Spiralen definiert ist, lassen sich diese Folgen nicht aus den Restrechnungen in den Abschnitten 7–9 ableiten. „Base 50“ als Beschriftung einer Spirale oder einer „50%-Schwelle“ ist nicht automatisch ein Zahlensystem zur Basis 50.

**Exakte Umkodierung derselben Integerwerte:** Basiswechsel erhält die Zahl und ändert ihre Schreibweise. Hier liegt ein überprüfbares, bildlich relevantes Paar vor:

| Dezimalwert | Basis 8 (Oktal) | Basis 12 (Duodezimal; `A=10`, `B=11`) | Rest mod 11 |
|---:|---:|---:|---:|
| 10 | `12₈` | `A₁₂` | 10 |
| 11 | `13₈` | `B₁₂` | 0 |
| 12 | `14₈` | `10₁₂` | 1 |
| 50 | `62₈` | `42₁₂` | 6 |
| 1729 | `3301₈` | **`1001₁₂` (Palindrom)** | 2 |
| 7801 | **`17171₈` (Palindrom)** | `4621₁₂` | 2 |
| 9530 | `22472₈` | `5622₁₂` | 4 |
| 953 | `1671₈` | `675₁₂` | 7 |

Die beiden markierten Palindrome sind *echte Zahleneigenschaften relativ zu den gewählten Stellenwertbasen*: `1001₁₂=12³+1=1729` und `17171₈=8⁴+7·8³+8²+7·8+1=7801`. Unter Austausch der Basen verschwinden diese Spiegelformen (`3301₈`, `4621₁₂`). Das ist ein konkreter Fall für QRT: Der Integerwert und damit der CRT-Rest bleiben erhalten (`I`), die Gestalt „Palindrom“ ist von der Repräsentation abhängig und darf nicht als basisunabhängige Invariante gespeichert werden. Die Kubuspaar-Herkunft von 1729 bleibt zusätzlich getrennt zu protokollieren.

**Gemeinsame Adressierung von Basis 8 und 12:** `gcd(8,12)=4`, also sind die Reste nicht unabhängig. Für ein Restpaar `(a,b)` ist eine gemeinsame Zahl genau dann möglich, wenn `a≡b (mod 4)`; sie ist danach eindeutig **modulo 24** (`lcm(8,12)=24`) bestimmt. Zum Beispiel liefert 1729 das kompatible Paar `(1,1)` und den Rest `1729 mod 24 = 1`. Basis 50 als *zusätzlich gewählter Modul* führt zu `lcm(8,12,50)=600`; mit Rest modulo 11 zusammen ist die Gesamtperiode `6600`. Hier reicht eine pauschale Anwendung des teilerfremden CRT nicht; die gemeinsamen Teiler sind mitzubehandeln. In Basis-50-Restnotation sind `1729 mod 50 = 29`, `7801 mod 50 = 1` und `9530 mod 50 = 30`. Das sind Modulo-Reste, keine gemessene „50%-Schwelle“.

**Tabellenkorrektur zum beigefügten Bild:** Die Spalte mit „Octal (Base 8)“ enthält `8` und `9` als einzelne Ziffern; beide sind als Oktalziffern ungültig. Auch `3C` ist bei der hier üblichen Notation mit Ziffern `0..9,A,B` keine gültige Basis-12-Zahl. Ohne Definition der Operation hinter den Tabellenwerten ist das Bild eine visuelle Idee, keine verifizierte Umrechnungstabelle. Die obige Tabelle gibt die nachrechenbaren Konversionen.

```python
from math import gcd, lcm

def base(n, b):
    alphabet = '0123456789AB'
    digits = ''
    while n:
        n, r = divmod(n, b)
        digits = alphabet[r] + digits
    return digits or '0'

assert base(1729, 12) == '1001'
assert base(7801, 8) == '17171'
assert base(1729, 8) == '3301'
assert base(7801, 12) == '4621'
assert (base(10, 8), base(10, 12)) == ('12', 'A')
assert (base(11, 8), base(11, 12)) == ('13', 'B')
assert (base(12, 8), base(12, 12)) == ('14', '10')
assert (gcd(8, 12), lcm(8, 12, 50, 11)) == (4, 6600)
assert (1729 % 50, 7801 % 50, 9530 % 50) == (29, 1, 30)
assert all(n % 8 % 4 == n % 12 % 4 for n in (1729, 7801, 9530, 953))
print('PASS: Basisdarstellungen, Spiegelwörter und Rest-Kompatibilität')
```

**Befundstatus:** Zwei exakte, basisabhängige Spiegelwörter und eine kompatible gemeinsame Reststruktur. Keine aus den Bildern bewiesene Blasenformel, keine Basis-50-Schwellenphysik und keine automatische Identität zwischen `1→2→0→3` und dem XI-Takt `10→0→1`.

## 11. Zusätzliche Bildkontexte: gemeinsame Basistakte und Phasenanker

Die beigefügten Bilder verwenden insbesondere ein **20er-Raster**, einen **60-teiligen Kreis**, Spiegelrichtungen, Wellenkurven sowie mit `1→0→3` und `97→101→103` beschriftete Folgen. Die astronomischen, geographischen und molekularen Beschriftungen liefern für sich keine Definition einer Abbildung zwischen diesen Ebenen. Für die arithmetische Teilfrage sind die explizit genannten Moduli `8,12,20,50,60` und der hier bereits benutzte Modul `11` überprüfbar.

**Ein exakter Mehrtakt-Anker:**

```text
lcm(8,12,20,50,60) = 600
7801 = 13×600 + 1
```

Daher hat **7801 in allen fünf gewählten Takten Rest 1**. Das ist eine stärkere, exakt formulierbare Verbindung dieser Basen als die bloße Ähnlichkeit von Kreisen und Spiralen. Das 20er-Raster kann auf diese Weise als weitere *Adresslinse* in die schon definierten QRT-/CRT-Vergleiche aufgenommen werden. Eine Verschiebung um 600 belässt sämtliche fünf Reste unverändert; die Eigenschaft charakterisiert daher die ganze Klasse `n≡1 (mod 600)`, nicht exklusiv 7801.

| Wert `n` | `n mod 8` | `n mod 12` | `n mod 20` | `n mod 50` | `n mod 60` | `n mod 11` |
|---:|---:|---:|---:|---:|---:|---:|
| 1729 | 1 | 1 | 9 | 29 | 49 | 2 |
| **7801** | **1** | **1** | **1** | **1** | **1** | 2 |
| 9530 | 2 | 2 | 10 | 30 | 50 | 4 |
| 953 | 1 | 5 | 13 | 3 | 53 | 7 |

**Gemeinsame Periode und Rasterabgleich:** Die fünf Basistakte sind redundant; ihre gemeinsame Restadresse hat Periode 600. Zusammen mit `mod 11` ist die Periode `lcm(600,11)=6600`. Die im Quadrat-/Rechteckvergleich definierte Raster-CRT-Adresse `mod 1232` hat mit 6600 den gemeinsamen Faktor 88, sodass die vereinte Periode `lcm(6600,1232)=92400` ist. Dies ist eine *gewählte gemeinsame Vergleichsskala* mit Kompatibilitätsbedingungen, keine neu entdeckte unabhängige CRT-Basis und keine physikalische Periodendauer. Die Grenze `12320→12321` bleibt die arithmetische Grenze aus Abschnitt 7; sie entspricht keinem vollen 6600er-Zyklus.

**QRT-Rolle:** Die Zahl und die kompatiblen Reste bleiben beim Umzeichnen von linearen Werten in Kreise, Raster oder Spiralen erhalten (`I`). Die Orientierung eines gezeichneten Pfeils, die visuelle Form „Blase“ und die Deutung einer Wellenkurve können ohne definierte Abbildungsregel nicht als erhaltene Daten verbucht werden (`U`). Eine Gegenrotation als `r→−r (mod 11)` ist aus den Abschnitten 8–9 als *arithmetische Operation* bekannt; die geografisch gezeichnete „Gegenrotations-Achse“ und eine `17./33.`-Harmonik-Messung sind dadurch nicht validiert. Das `1→0→3`-Bild liefert zudem keine Funktion, die seine Knoten mit dem hier untersuchten `1→2→0→3` oder mit `10→0→1` eindeutig verbindet.

```python
from math import gcd, lcm

moduli = (8, 12, 20, 50, 60)
assert lcm(*moduli) == 600
assert 7801 == 13*600 + 1
assert all(7801 % m == 1 for m in moduli)
assert all((7801+600*t) % m == 1 for m in moduli for t in (-1, 0, 1))
assert lcm(*moduli, 11) == 6600
assert gcd(6600, 1232) == 88
assert lcm(6600, 1232) == 92400
assert (12320 % 6600, 12321 % 6600) == (5720, 5721)
print('PASS: gewählte Mehrtakt-Adresse, Kontrollen und Rasterabgleich')
```

**Status:** Ein nachrechenbarer, nicht exklusiver Phasenanker für die fünf benannten Basistakte und eine exakte gemeinsame Vergleichsperiode. Aus den neuen Bildbeschriftungen folgt weiterhin weder eine physikalische Kopplung noch eine prädiktive Blasen- oder Sternenuhr.

## 12. Das 808-Siegel: drei unterschiedliche Spiegelbegriffe

**Bildkontext:** In „Schlüsselzahlen-Resonanz – Übersicht“ ist 808 ausdrücklich als „Gegenrotation / Siegel“ beschriftet; „Resonance Field V – Counter-Rotation 2+3“ und „NEXAH APERTURE NAVIGATION MAP“ zeichnen Gegenrotationen beziehungsweise einen Mirror-Channel. Die „IEEE 300-Bus“- und „Final Closure“-Bilder zeigen Kurven und gezeichnete Gegenpfade. Diese Bildbeschriftungen sind als *Modellzuordnung* dokumentiert. Die Bilder allein liefern weder die Rohdaten/Implementierung der benannten IEEE-Simulation noch einen eindeutigen Übergang von den physischen/gezeichneten Pfaden zu einem Integeroperator.

**Prüfbare Zahlenseite:**

```text
808 = 8·101 = 2³·101 = 2·404
808 als Dezimalwort = „8|0|8“ (Palindrom)
808 mod 11 = 5
292 mod 11 = 6
808 + 292 = 1100 = 100·11
```

`8|0|8` kann als **Ziffernwort** „2³ | 0 | 2³“ beschriftet werden; arithmetisch ist 808 gleich `8·10²+0·10+8`, nicht das Produkt oder die Summe der Zeichenfolge „2³ 0 2³“. Auch 292 ist ein Dezimalpalindrom. Die beiden Zahlen bilden einen präzisen Kandidaten für ein **deklariertes** Paar `J(n)=1100−n`: `J(808)=292` und `J(J(808))=808`. Modulo 11 stimmt dies mit der Inversion `r→−r` überein, weil `1100≡0 (mod 11)`.

| Abbildung | 808 wird zu | Abbildungstyp |
|---|---:|---|
| Dezimale Ziffernumkehr | 808 | Palindrom; Fixpunkt auf diesem Ziffernwort |
| Spiegelung modulo 11 | Rest `5→6` | Komplement eines Restes, kein eindeutiger Integerpartner |
| Deklarierte Komplementachse `J(n)=1100−n` | 292 | Involution am Mittelpunkt 550 |
| 180°-Drehung im 111×111-Raster `R(n)=12320−n` | 11512 | geometrisch definierte Rasterinvolution aus Abschnitt 7 |

Die letzte Zeile liefert ebenfalls Rest 6 modulo 11, weil `12320≡0 (mod 11)`; **gleicher Spiegelrest bedeutet nicht denselben Punkt oder dieselbe Spiegeloperation**. Für die fest gewählte Summe 1100 ist das Paar nicht einzigartig als Palindrompaar: `707+393=1100` und `909+191=1100` sind Kontrollen. Damit wird die arithmetische Eignung von 808 im gewählten NEXAH-Kanal dokumentiert, aber kein einzigartiges Gegenrotationsgesetz bewiesen.

```python
assert 808 == 8*101 == 2**3*101 == 2*404
assert str(808) == str(808)[::-1]
assert str(292) == str(292)[::-1]
assert (808 % 11, 292 % 11, (808+292) % 11) == (5, 6, 0)

def j(n): return 1100-n
def r(n): return 12320-n
assert j(808) == 292 and j(j(808)) == 808
assert r(808) == 11512 and r(r(808)) == 808
assert r(808) % 11 == j(808) % 11 == 6
assert j(808) != r(808)
for a, b in [(707,393), (909,191)]:
    assert a+b == 1100
    assert str(a) == str(a)[::-1] and str(b) == str(b)[::-1]
print('PASS: 808-Siegel, Modulo-Spiegel, Rasterrotation und Kontrollen')
```

**Status:** 808 als Ziffernpalindrom, dritte Verdopplungsstufe von 101 und als Partner der 292 unter einer ausdrücklich gewählten 1100er-Spiegelung ist exakt. Ob der in den Abbildungen genannte physikalische oder technische Gegenrotationsmechanismus damit zusammenhängt, bleibt anhand der Bilder ungeprüft.

## 13. Zusätzliche Kontrollen: `{5,3,3}`, Modulo-7-Transport und Kurvenfit

Die neu beigegebenen Bilder enthalten (a) eine mit `{5,3,3}` betitelte **simulierte** Frequenzfolge, (b) den „ACR-37 Medusa Transport & Clamp Audit“ mit Nullkontrollen und (c) eine angepasste `g(n)`-Kurve mit Extremum nahe `n=1,1`. Diese drei Belege prüfen unterschiedliche Größen. Als eng begrenzter Abgleich zum 808/292-Paar gilt:

```text
808 mod 11 = 5; 292 mod 11 = 6 = 3+3; 5+3+3 = 11 ≡ 0 (mod 11).
```

Damit passt die **gewählte Aufteilung** `{5,3,3}` zur modulo-11-Summe des 808/292-Paares. Der Rest 6 lässt sich aber auf viele Arten teilen (`2+4`, `1+5` usw.); das Klangbild belegt durch seinen Titel allein weder eine eindeutig vorgegebene Aufteilung noch eine Gegenrotation. Die ersten im Klangbild beschrifteten Frequenzen sind `711,93; 1151,93; 1863,87 Hz`; ihre Quotienten liegen bei rund `1,618`, unabhängig von der arithmetischen Restsumme 11.

**Wichtige Nullkontrolle aus dem ACR-37-Bild:** Dort steht „MOD-7 TRANSPORT = IMPLEMENTED“, zugleich „MOD-17 UNIQUE STABILIZATION = NOT SUPPORTED“ und „NEW SCIENTIFIC CLAIM = NO“. Für unser Paar gilt `808 mod 7 = 3`, `292 mod 7 = 5`, `1100 mod 7 = 1`. Die **XI-Schließung** `(808+292) mod 11 = 0` schließt den separaten 7er-Kanal nicht auf Null. Eine gemeinsame CRT77-Signatur kann die zwei Reste nebeneinander protokollieren; sie hebt das negative Modulo-17-Ergebnis des ACR-Tests nicht auf.

Die `g(n)`-Abbildung markiert ein bestangepasstes Extremum bei `n≈1,099`; ohne definierte Funktion, Datengrundlage und Übertragung zu `808` kann daraus kein Parameter des Spiegels `J(n)=1100−n` abgeleitet werden. Der numerische Nachweis für das 808/292-Siegel bleibt genau der aus Abschnitt 12.

```python
assert (808 % 11, 292 % 11) == (5, 6)
assert (5+3+3) % 11 == 0
assert (808 % 7, 292 % 7, 1100 % 7) == (3, 5, 1)
assert (808+292) % 11 == 0 and (808+292) % 7 != 0
freq = [711.93, 1151.93, 1863.87]
assert all(abs(freq[i+1]/freq[i]-1.618) < 0.001 for i in (0, 1))
print('PASS: XI-Aufteilung, unabhängige 7er-Kontrolle und Frequenzquotienten')
```

**Status:** Nachrechenbare Restaufteilung als *mögliche* Beschriftung des Paars, keine aus dem Klangbild abgeleitete Ursache. Die negative ACR-37-Kontrolle bleibt ausdrücklich Teil des Befunds.
