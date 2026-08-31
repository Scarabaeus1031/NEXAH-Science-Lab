# 05 — c Parameter and i Role Audit

For the historical value

`c=-0.750+0.100i`,

- `c` is one selected complex parameter;
- `-0.750` is its real component;
- `0.100` is its imaginary-coordinate coefficient;
- `i` is the declared complex basis unit;
- `i` is not a second parameter and does not establish full quaternion structure.

The rewrite `-0.750j+i` changes both coefficients and roles and is invalid without an explicit map. It is not an alternative spelling of the same complex value.

Inside `H`, the fixed-basis elements

```text
-0.750+0.100i
-0.750+0.100j
-0.750+0.100k
```

are distinct quaternion elements. Each lies in an isomorphic complex slice. The coefficient pair is reusable under an explicitly declared algebra isomorphism, but reuse does not make the elements identical.

`COMPLEX_i_EQUALS_QUATERNION_STRUCTURE=NO`  
`i_IS_SECOND_PARAMETER=NO`  
`ISOMORPHIC_COMPLEX_SLICE_EQUALS_IDENTICAL_QUATERNION_ELEMENT=NO`

