# Form State Response Envelope Decision

## Files inspected

- `src/kernel/action.js`
- `src/kernel/response.js`
- `tests/kernel-action-validation-shape.test.js`
- `tests/kernel-action-domain-failure.test.js`
- `docs/internal/action-validation-error-shape-decision.md`
- `docs/internal/form-state-safe-value-preservation-decision.md`
- `docs/internal/form-state-issue-mapping-decision.md`

## Files changed

- `docs/internal/form-state-response-envelope-decision.md`

## Decision summary

Future form response state should be opt-in, not automatic default action behavior.

Existing action responses should remain compatible:

- successful actions keep returning normal Potentia responses/results
- validation failures keep current diagnostic envelope
- domain failures keep current `fail(...)` response behavior
- redirects keep current `redirect(...)` behavior

A future helper may convert existing action outcomes and parsed input into a form-state envelope.

## Validation failure envelope

Recommended future opt-in form validation failure state:

```js
{
  ok: false,
  kind: 'form',
  values,
  errors,
  issues,
  error: {
    code: 'POTENTIA_ACTION_INPUT_FAILED',
    message: 'Action input contract failed.'
  },
  meta: null
}
```

`values` are safe parsed values. `errors` is derived from canonical issues. `issues` preserves canonical issues.

## Domain failure envelope

Recommended future opt-in domain failure state:

```js
{
  ok: false,
  kind: 'form',
  values,
  errors: {
    _form: [issue]
  },
  issues: [issue],
  error: {
    code: 'USER_EMAIL_TAKEN',
    message: 'Email is already in use'
  },
  meta: null
}
```

Domain failures may preserve safe parsed values. Domain issues should default to `_form` unless the domain failure explicitly supplies safe field metadata through a future protocol.

## Success without redirect

Recommended future opt-in success state when a form helper chooses to represent success as data:

```js
{
  ok: true,
  kind: 'form',
  value,
  error: null,
  issues: [],
  errors: {},
  meta: null
}
```

This is not a replacement for normal Potentia JSON/text/native responses.

## Success with redirect

Explicit redirects remain redirects. A redirect response should not be wrapped as JSON form state.

A future enhanced client can observe `303`/`Location` via normal fetch behavior, but server semantics remain native HTTP redirect semantics.

## Handler failures

Handler failures should not produce form state by default.

They should keep safe framework failure behavior and avoid preserving submitted values.

## Output failures

Output failures should not produce form state by default.

They are server-side failures and should remain safe `500` responses.

## Compatibility decision

The future form envelope should be an opt-in helper or projection/helper layer, not default action behavior.

Rejected for now:

1. changing every action response to `kind: 'form'`
2. auto-detecting form submissions and changing the response shape
3. requiring frontend/client helpers to consume action results

## Deferred

- implementation
- content negotiation for enhanced clients
- helper naming/API
- field-specific domain issue protocol
- session/flash integration

## Blockers

- The exact helper API should wait until value preservation and issue mapping implementation evidence exists.
