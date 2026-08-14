# Canonicalization contract

The sole canonical byte function recursively applies:

- enum order `G2<G3` and `FORWARD_23<REVERSE_32`;
- numeric ordering for `indices`, endpoints and `kappa`;
- block key `(type,indices,mean numerator,mean denominator)`;
- relation key `(endpoint types,endpoint indices,kappa,weight,difference)`;
- structural-case key `(phase,orientation)`;
- sorted mapping keys and semantically sorted sets;
- preserved semantic sequence order for source arrays and registered ordered
  sequences;
- preserved duplicate multiplicity;
- compact UTF-8 JSON plus one LF.

The function changes representation order only. It does not change, add,
remove, merge, infer or repair scientific content. Fresh, direct, stepwise,
signature, equality, output, subprocess and replay paths used this function.

