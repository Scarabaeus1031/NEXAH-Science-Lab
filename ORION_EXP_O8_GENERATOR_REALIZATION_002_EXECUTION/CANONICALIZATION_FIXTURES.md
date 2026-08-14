# Canonicalization fixtures

Result: **10/10 PASS**.

| Fixture | Observed |
|---|---|
| C01 insertion order | correctly equal |
| C02 numeric `1,2,10` ordering | correctly equal |
| C03 `kappa` input order | correctly equal |
| C04 mapping insertion order | correctly equal |
| C05 duplicate records | correctly equal; multiplicity retained |
| C06 changed numeric value | correctly unequal |
| C07 changed type tag | correctly unequal |
| C08 changed orientation | correctly unequal |
| C09 changed `kappa` member | correctly unequal |
| C10 missing record | correctly unequal |

Canonicalization did not normalize away any registered semantic difference.

