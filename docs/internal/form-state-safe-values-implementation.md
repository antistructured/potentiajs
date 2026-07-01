# Form State Safe Values Implementation

## Files changed

- `src/kernel/form-state.js`
- `tests/kernel-form-state-values.test.js`
- `docs/internal/form-state-safe-values-implementation.md`

## Implemented behavior

`preserveFormValues(input, options)` preserves safe parsed values for future form state.

Preserved values:

- strings
- numbers
- booleans
- `null`
- arrays of safe values
- nested plain objects with safe values

Omitted values:

- sensitive fields
- dangerous keys
- functions
- symbols
- bigints
- class instances
- non-plain objects
- cyclic object branches
- `null` / `undefined` top-level input, which becomes `{}`

## Sensitive field behavior

Sensitive fields are omitted by default. Matching is case-insensitive and checks normalized field segments, including compound names such as `confirmPassword` and `apiKey`.

Additional sensitive field names may be passed through `options.sensitiveFields`.

## Safety posture

The helper only accepts parsed values. It does not read raw request bodies and does not mutate the input object.

## Verification

`tests/kernel-form-state-values.test.js` covers scalar preservation, arrays, nested objects, sensitive omission, dangerous keys, omitted unsafe values, non-mutation, and null/undefined behavior.
