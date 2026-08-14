# A3 Null Reporting Contract

For each required statistic and each complete 200-value N1–N4 distribution:

1. retain the 200 finite null values with repetition IDs;
2. report values sorted ascending by numeric value, breaking exact numeric ties by repetition ID ascending;
3. report the descriptive nearest-rank 97.5th percentile at `ceil(0.975*200)=195`, using one-based ascending rank, i.e. zero-based array index 194;
4. separately compute the controlling one-sided p-value `p=(1+count(T_null>=T_observed))/201` with adverse ties;
5. pass only by the frozen `p<=0.025`, equivalently `k<=4` rule.

The nearest-rank value is descriptive. It cannot replace, alter, rescue, or veto the Monte Carlo decision. Sorted values, rank-195 value, exceedance count, and p-value are mandatory report fields.
