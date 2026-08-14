# A5XR Seed-Dominance Derivation

For each carrier, raw finite binary64 loss pairs are converted with exact `Fraction.from_float`. With total eligible rows `N`, `g_s=(1/N)sum(loss0-loss1)`, signed and including negatives. Seed IDs must belong to the sealed registry and be unique. Fewer than three is invalid; zero-row seeds are absent. `G=sum g_s`; if `G<=0`, fail. Sort exact `g_s` descending, seed-ID ascending on ties; `D3` is top-three sum. PASS iff exact `2D3<=G`; equality passes and no tolerance exists.

