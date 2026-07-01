# Route / Action Diagnostic Envelope Alignment

## Files changed

- `src/kernel/response.js`
- `src/kernel/action.js`
- `tests/kernel-route-contract-diagnostic-envelope.test.js`
- `tests/kernel-action-diagnostic-envelope.test.js`
- `docs/internal/route-action-diagnostic-envelope-alignment.md`

## Behavior

Contract failure responses with diagnostic details now share a consistent envelope:

```js
{
  ok: false,
  error: {
    code,
    message,
    boundary,
    issues
  },
  boundary,
  issues
}
```

Nested `error.boundary` and `error.issues` are preserved.

## Route coverage

Route params/query/headers/body failures use canonical issues and return `400`.

Route response failures use canonical issues and return `500`.

## Action coverage

Action input, output, JSON parse, and URL-encoded parse failures use canonical issues.

Input failures return `400`; output failures return `500`.

## Safety

Raw input/body/output values and unsafe thrown messages are not exposed.

## Deferred

- custom generic issue protocol
- projection/manifest diagnostics metadata
- form state preservation
