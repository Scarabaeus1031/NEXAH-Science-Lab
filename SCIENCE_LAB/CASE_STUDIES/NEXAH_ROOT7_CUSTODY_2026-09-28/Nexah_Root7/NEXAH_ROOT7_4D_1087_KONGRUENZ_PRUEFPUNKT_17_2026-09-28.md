# Prüfpunkt 17 — √7 in 4D und die behauptete 1087→12928-Synchronisation

**Datum:** 28. September 2026. **Entscheidung:** Die euklidische 4D-Konstruktion ist richtig; die neue behauptete Synchronisation modulo 11 ist **falsch und auf dem gewählten Strahl unmöglich**. „Raumzeit“ ist hier eine mögliche Modellbezeichnung, keine aus der euklidischen Rechnung abgeleitete physikalische Aussage.

## Der geometrische Teil

Für `v=(2,1,1,1)` gilt `||v||²=7`, also `||v||=√7`. Dies ist eine Distanz zwischen Punkten von `Z⁴`; `7` ist keine Summe aus drei ganzzahligen Quadraten und darum keine Distanz zum Quadrat in `Z³` mit ganzzahligen Koordinaten. Der vierte Koordinatenwert ist mathematisch eine räumliche euklidische Koordinate. Eine physikalische Zeitachse oder Raumzeitmetrik wird dadurch nicht festgelegt.

Für einen beliebigen **ganzzahligen** Skalierungsfaktor `m` gilt `m·v=(2m,m,m,m)` und `||m·v||²=7m²`. Die erste Koordinate `808=2·404` ist die direkte Folge der gewählten `2` im Basisvektor, keine zusätzliche Messung eines 808-Zustands.

| Faktor m | 4D-Vektor m·v | Norm² | Norm² mod 11 |
|---:|---|---:|---:|
| 1 | (2,1,1,1) | 7 | 7 |
| 404 | (808,404,404,404) | 1.142.512 | 8 |
| 1087 | (2174,1087,1087,1087) | **8.270.983** | **6** |

Eine konkret wählbare Folge für „3|1|3“ ist `(0,0,0,0)→(1,1,1,0)→(1,1,1,1)→(2,1,1,1)`. Ihre quadrierten **Radien** sind `0,3,4,7`, die Zuwächse also `3,1,3`. Die drei Wegstücke sind dabei nicht Längen 3,1,3; die Folge und die Koordinatenreihenfolge sind eine Modellwahl.

## Das ausschlaggebende Modulo-11-Ergebnis

`1087 mod 11=9`; daher `7·1087²≡7·9²≡7·4≡6 (mod 11)`. Hingegen `12928 mod 11=3`. Der behauptete Vergleich `6=3` scheitert. Das letzte vom Nutzer übernommene Python-Skript berechnet `sync_match=False` und gibt deshalb selbst **`CRITICAL DRIFT DETECTED`** aus; die begleitende Behauptung von „perfekter Synchronisation“ widerspricht seinem Code.

Die Unmöglichkeit ist stärker als dieser Einzelfall. Die quadratischen Reste modulo 11 sind `{0,1,3,4,5,9}`. Multipliziert man sie mit 7, erhält man `{0,2,6,7,8,10}`. Die Zielklasse **3** kommt nicht vor. Folglich existiert **kein ganzzahliges m** mit

`||m·(2,1,1,1)||² ≡ 12928 ≡ 3 (mod 11)`.

Das betrifft nur die **ganzzahligen Skalierungen dieses √7-Vektors** unter dem gewählten euklidischen Quadratnorm-Vergleich; es verbietet weder andere 4D-Vektoren noch andere sauber definierte Abbildungen. Ein Wechsel von Vektor oder Vergleichsregel wäre ein neues Modell und müsste vor weiteren Treffern begründet werden.

## Reproduzierbare Korrektur

```python
from math import isqrt

v=(2,1,1,1)
def norm2(xs):
    return sum(x*x for x in xs)
def scale(m):
    return tuple(m*x for x in v)

assert norm2(v)==7
assert scale(404)==(808,404,404,404)
assert norm2(scale(404))==1_142_512
assert scale(1087)==(2174,1087,1087,1087)
assert norm2(scale(1087))==8_270_983
assert norm2(scale(1087))%11==6
assert 12_928%11==3
assert norm2(scale(1087))%11 != 12_928%11

squares={m*m%11 for m in range(11)}
assert squares=={0,1,3,4,5,9}
reachable={7*s%11 for s in squares}
assert reachable=={0,2,6,7,8,10}
assert 12_928%11 not in reachable

path=[(0,0,0,0),(1,1,1,0),(1,1,1,1),v]
assert [norm2(p) for p in path]==[0,3,4,7]
assert [norm2(path[i+1])-norm2(path[i]) for i in range(3)]==[3,1,3]
print('4D-√7-Konstruktion bestätigt; 1087→12928-Norm²-Kongruenz widerlegt.')
```

**Nächste sachliche Entscheidung:** Den 4D-√7-Strahl als geometrische Konstruktion behalten und den behaupteten 1087/12928-Match zurückziehen. Erst nach einer unabhängigen Definition, wie SCN-Zeit, 404-Regler und 4D-Koordinaten ineinander übersetzt werden, lässt sich eine neue Kopplung testen. Die hier falsifizierte Norm²-Gleichsetzung darf nicht durch nachträgliche Wahl eines anderen Faktors auf demselben ganzzahligen Strahl repariert werden; sie ist dort unmöglich.
