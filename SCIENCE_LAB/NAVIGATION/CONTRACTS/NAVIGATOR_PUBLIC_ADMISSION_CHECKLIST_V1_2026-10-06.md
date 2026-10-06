# Navigator Public Admission Checklist v1

Status: `OWNER GATE / DENY BY DEFAULT / NO RELEASE AUTHORIZED`

Every public entity, surface and connection must pass all applicable gates.

## A. Identity and ownership

- [ ] Stable namespaced ID exists.
- [ ] Owning repository and controlling record are known.
- [ ] Public title and summary are Human-readable.
- [ ] Master, support, variant, historical or copy role is explicit.
- [ ] No duplicate public card is created for an alternate view.

## B. Evidence and claim boundary

- [ ] Evidence class is explicit.
- [ ] Package-local verdict is preserved where applicable.
- [ ] Current interpretation is present.
- [ ] Claim ceiling is present and not weaker than the owning record.
- [ ] Negative, mixed, provisional or no-result state is visible.
- [ ] Visual resemblance is not presented as mechanism identity.

## C. Relations

- [ ] Every public edge has a permitted relation type.
- [ ] The explanation says why the edge exists.
- [ ] `preserves` is declared.
- [ ] `does_not_imply` is declared.
- [ ] Evidence or controlling records are linked.
- [ ] Both endpoints are independently admitted to the public manifest.

## D. Rights, privacy and security

- [ ] Rights state is `cleared`, `original`, `linked` or `public_domain`.
- [ ] Attribution is complete.
- [ ] No local absolute path is present.
- [ ] No private Mission Control record or owner deliberation is included.
- [ ] No personal contact data, secret, token or credential is present.
- [ ] External URLs are HTTPS and allowlisted.
- [ ] Embedded HTML has an explicit sandbox policy.
- [ ] All bundled dependencies are present and licensed for release.

## E. Technical release quality

- [ ] Public URL or bundle-relative URL resolves.
- [ ] Keyboard navigation works.
- [ ] Mobile and desktop layouts are usable.
- [ ] Reduced-motion mode is respected.
- [ ] Contrast and focus states pass accessibility review.
- [ ] Browser console contains no runtime error.
- [ ] Direct deep link survives reload and back/forward navigation.
- [ ] Public manifest and bundle hashes are recorded.
- [ ] Previous public release remains recoverable.

## F. Human Owner release gate

- [ ] Editorial reason for inclusion is recorded.
- [ ] Intended audience and reader question are recorded.
- [ ] Public omission does not misrepresent the larger corpus.
- [ ] Human Owner signs the exact allowlist and claim ceiling.
- [ ] Publication destination and date are explicitly authorized.

Failure of any mandatory item keeps the object internal or returns it to
`public_candidate`. Existing public availability does not waive this review.
