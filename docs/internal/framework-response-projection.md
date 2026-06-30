# Framework Response Projection

## Files changed

- `src/kernel/response.js`
- `src/kernel/app.js`
- `tests/kernel-response-projection.test.js`

## Projection order

Handler return values project in this order:

1. Native `Response` returns unchanged.
2. `ok(value)` unwraps `value` and projects it.
3. `fail(error)` returns deterministic typed error JSON.
4. Response descriptors from `json()`, `text()`, and `redirect()` convert to native `Response`.
5. `Error` and unknown thrown errors normalize to `POTENTIA_HANDLER_FAILED`.
6. `undefined` returns 204 No Content.
7. `null` returns 204 No Content.
8. strings return text responses.
9. plain objects return JSON responses.

## Response contract position

Response contracts run against the logical handler body before final native response projection where practical.

Examples:

- `ok({ id: '1' })` with a response transform can become `{ id: 1 }` before JSON projection.
- `ok(json({ id: '1' }))` validates/transforms the descriptor body.
- Native `Response` passthrough is not contract-validated in this block.

## Deferred

- Streaming response projection.
- File responses.
- HTML helpers.
- Content negotiation.
- Cookies API.
- Multiple response contracts by status.

## Verification

`bun test` passes with 66 tests.
