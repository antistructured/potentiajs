# Field Diagnostics Regression / Safety

## Files changed

- `tests/kernel-field-diagnostics-safety.test.js`
- `tests/kernel-field-diagnostics-regression.test.js`
- existing diagnostics tests updated for canonical issue shape
- `docs/internal/field-diagnostics-regression-safety.md`

## Safety coverage

Added regression tests proving diagnostics do not expose:

- raw email-like values as `received`
- raw object input
- raw array input
- thrown generic contract messages
- thrown handler messages
- raw URL-encoded bodies
- dangerous form keys such as `__proto__`

## Regression coverage

Added tests confirming:

- action validation shape still includes `ok: false`
- nested `error.issues` compatibility remains
- route contract diagnostics still include boundary
- action example success still works
- route contract success behavior still works

## Verification

Focused diagnostics tests passed before full-suite migration:

- 49 pass
- 0 fail
