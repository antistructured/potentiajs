# Form State Envelope Helper

## Files changed

- `src/kernel/form-state.js`
- `src/index.js`
- `tests/kernel-form-state-helper.test.js`
- `docs/internal/form-state-envelope-helper.md`

## Export decision

`createFormState` is exported from the root package as an experimental opt-in helper.

Lower-level helpers remain available only from the internal module for tests and implementation reuse.

## Implemented behavior

`createFormState(input)` returns:

```js
{
  ok,
  kind: 'form',
  values,
  errors,
  issues,
  error,
  value,
  meta
}
```

Defaults:

- `ok: false`
- `kind: 'form'`
- `values: {}`
- `errors` derived from `issues`
- `issues` normalized from input or generated from failed `error`
- `error` defaults to `{ code: 'FORM_FAILED', message: 'Form submission failed' }` for failure
- `error: null` for success
- `value: null`
- `meta: null`

## Safety

Values pass through `preserveFormValues(...)`.

Issues pass through canonical issue normalization and then group into `errors`.

The helper does not mutate its input and does not affect default action behavior.

## Verification

`tests/kernel-form-state-helper.test.js` covers failed state, success state, errors derivation, safe values, sensitive omission, issue preservation, deterministic defaults, non-mutation, and unchanged default action behavior.
