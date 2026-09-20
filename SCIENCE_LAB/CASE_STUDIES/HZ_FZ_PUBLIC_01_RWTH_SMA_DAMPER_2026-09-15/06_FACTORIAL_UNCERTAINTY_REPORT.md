# HZ_FZ_PUBLIC_01: 0.5 Hz well-candidate audit

## Result

The three run medians draw a minimum at 0.5 Hz, but it does **not** survive the cycle-level uncertainty gate. Both moving-block bootstrap contrast intervals include zero.

- 0.5 − 0.1 Hz: -14.244 J/cycle; descriptive 95% interval [-144.768, +59.578]
- 0.5 − 1.0 Hz: -41.568 J/cycle; descriptive 95% interval [-69.836, +22.431]

Classification: `INCONCLUSIVE_DESCRIPTIVE_WELL_CANDIDATE`.

The stronger result is a history-dependent crossover. Against 0.1 Hz, the 0.5 Hz loop area is lower for 7 of 10 matching cycle labels and crosses sign between cycles 7 and 8. Against 1.0 Hz, it is lower for all 8 matching cycle labels. Classification: `SUPPORTED_HISTORY_DEPENDENT_CROSSOVER`.

## Method

The audit uses all 56 active cycles in the six 8-wire factorial cells. It reports the raw cycle points, median and interquartile range. A circular moving-block bootstrap with block length 2, 20,000 draws and seed 20260915 estimates descriptive intervals for each cycle median and for the two 40 mm contrasts.

## Claim boundary

There is only one source run in each frequency-amplitude cell. Cycles from one run are not independent experimental replicates. The result therefore does not establish a stable 0.5 Hz well, a universal critical frequency or a causal physical law. It supports the narrower descriptive statement that frequency response and cycle history interact in this run set.

## Next measurement gate

Repeat independent runs and add 0.3, 0.4, 0.6 and 0.7 Hz at 40 mm. Only then fit and test the location, width and repeatability of the minimum.
