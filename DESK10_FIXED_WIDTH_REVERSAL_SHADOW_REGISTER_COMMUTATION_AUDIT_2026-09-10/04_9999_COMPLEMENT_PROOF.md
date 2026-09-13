# 9999 complement proof

## Exhaustive result

All 10,000 words satisfy R_4(T_9999(x))=T_9999(R_4(x)). Equality count 10,000; failure count 0.

## Symbolic proof

Write x with digits d_1,d_2,d_3,d_4. Since 9999-x performs digitwise complement without borrow,

T_9999(x)=(9-d_1)(9-d_2)(9-d_3)(9-d_4).

Reversing gives (9-d_4)(9-d_3)(9-d_2)(9-d_1). Reversing first gives d_4d_3d_2d_1, and applying T_9999 produces the same word. Hence R_4 composed with T_9999 equals T_9999 composed with R_4.

The proof depends on fixed width and leading-zero preservation. For lower repdigits, inputs containing a digit above d force borrow; universal commutation fails.

Decision: MAXIMAL_COMPLEMENT_COMMUTATION_PROVED.
