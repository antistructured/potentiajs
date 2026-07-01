# SigilJS Field Diagnostics Implementation

## Files changed

- `src/kernel/diagnostics.js`
- `src/kernel/contract.js`
- `tests/kernel-sigiljs-field-diagnostics.test.js`
- `docs/internal/sigiljs-field-diagnostics-implementation.md`

## Behavior

SigilJS validation errors with `code: 'SIGIL_VALIDATION_FAILED'` now normalize into canonical Potentia issues.

Structured fields used conservatively:

- `path` → normalized array path
- `expected` → safe expected descriptor
- `actual` → safe `received` type descriptor

The issue source is `sigil`.

## Safety

`actual` is converted through `safeReceived(...)`; raw values such as emails, objects, and arrays are not exposed.

Potentia does not parse arbitrary human error strings for paths or types.

## Fallback

If a SigilJS-looking error lacks structured data, Potentia falls back to a root-level issue with `source: 'sigil'`.

## Tests

`tests/kernel-sigiljs-field-diagnostics.test.js` covers missing fields, invalid field types, nested fields, URL-encoded repeated-field rejection, raw-value hiding, fallback, and determinism.
