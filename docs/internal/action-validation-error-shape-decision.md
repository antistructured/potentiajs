# Action Validation / Error Shape Decision

## Files inspected

- `docs/internal/action-boundary-model-decision.md`
- `docs/internal/action-input-parsing-decision.md`
- `src/kernel/contract.js`
- `src/kernel/error.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `docs/internal/framework-contract-diagnostics.md`
- `docs/internal/effect-error-diagnostics.md`

## Decision summary

Future actions should use action-specific error codes while remaining compatible with existing framework errors and result/response normalization.

Recommended future codes:

```txt
POTENTIA_ACTION_INPUT_FAILED
POTENTIA_ACTION_OUTPUT_FAILED
POTENTIA_ACTION_HANDLER_FAILED
```

These codes should be action-specific because they identify the action boundary, not only a generic route contract boundary.

## Input validation failure

Action input contract failure should produce:

- status: `400`
- code: `POTENTIA_ACTION_INPUT_FAILED`
- safe message: `Action input contract failed.`
- issues: sanitized contract issues
- no handler execution

## Output validation failure

Action output contract failure should produce:

- status: `500`
- code: `POTENTIA_ACTION_OUTPUT_FAILED`
- safe message: `Action output contract failed.`
- issues: sanitized contract issues
- no unsafe value leak

## Handler failure

Unsafe thrown action handler errors should follow existing safe handler posture:

- status: `500`
- code: `POTENTIA_ACTION_HANDLER_FAILED` if inside an action boundary
- safe public message: `Internal server error`
- original error kept as internal cause only

If implementation cannot safely distinguish action handler errors from route handler errors at first, it may reuse `POTENTIA_HANDLER_FAILED` internally and document that action-specific handler code is deferred. Input/output errors should still be action-specific.

## Action result envelope

Projection/client-facing action responses should use a deterministic envelope:

Success:

```js
{
  ok: true,
  value: value,
  error: null,
  issues: [],
  meta: null
}
```

Failure:

```js
{
  ok: false,
  value: null,
  error: {
    code,
    message
  },
  issues,
  meta: null
}
```

This envelope is the action protocol shape for future forms/fetch helpers. It should not replace the existing route result model.

## Compatibility with `ok()` / `fail()`

Action handlers should continue to return existing Potentia results:

- `ok(value)`
- `fail(error)`

The route layer should continue to normalize through `toResponse(...)`.

The action envelope may be produced by an action response helper or by future action projection/fetch enhancement, but it should not force every normal route response to adopt the envelope.

## Issue shape

Issues should remain sanitized and deterministic.

Recommended public issue shape:

```js
{
  path: ['email'],
  message: 'Invalid value'
}
```

When path information is unavailable, issue objects may omit `path` or use `path: []`, but tests should not require field-level paths until the contract adapter reliably exposes them.

## Relationship to existing contract failures

Existing route contract failures use `POTENTIA_CONTRACT_FAILED` / `POTENTIA_RESPONSE_CONTRACT_FAILED` semantics.

Action failures should wrap the same underlying contract diagnostics with action-specific codes because the user-facing boundary is action input/output.

## Deferred

- implementation of new error codes
- action response envelope helper
- exact HTTP response content type negotiation
- richer SigilJS issue path projection
- per-field form error mapping
- multi-status action responses
- redirect-after-action conventions
- flash/session integration

## Blockers

- Existing `safeContractIssues(...)` is intentionally coarse; field-level form errors require later adapter work.
- Output validation must define how to extract a body from existing response descriptors before implementation.
- Redirect and non-JSON action responses need a separate design before being treated as stable action behavior.

## Addendum — Action Result / Redirect Semantics

The action result semantics block formalized redirect and domain-failure behavior without adding action-specific result helpers.

- Success continues through existing response projection (`ok(...)`, response descriptors, plain values, native `Response`).
- Validation failures now include form-friendly top-level `ok: false`, `boundary`, and `issues` metadata while preserving nested `error.boundary` / `error.issues`.
- Domain failures use existing `fail(...)`; `fail(error, status)` is accepted as a concise experimental status shorthand.
- Explicit redirects use existing `redirect(location, status)` and bypass action output/route response contracts.
