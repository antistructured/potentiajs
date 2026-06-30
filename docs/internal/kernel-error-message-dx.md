# Kernel Error Message DX

## Files inspected

- `src/kernel/error.js`
- `src/kernel/response.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `tests/kernel-framework-errors.test.js`
- `tests/kernel-contract-diagnostics.test.js`
- `README.md`

## Files changed

- `src/kernel/app.js`
- `src/kernel/error.js`
- `tests/kernel-error-message-dx.test.js`
- existing 404/405 expectations in tests
- `docs/internal/kernel-error-message-dx.md`

## Message changes

Improved route-level error messages:

- `POTENTIA_NOT_FOUND`: `No route matched the request path`
- `POTENTIA_METHOD_NOT_ALLOWED`: `Route matched the path, but not the request method`

Kept safety-sensitive behavior unchanged:

- `POTENTIA_HANDLER_FAILED` still returns `Internal server error` for unsafe thrown errors.
- Explicit exposed framework errors still keep their caller-provided message.
- Contract failures still identify their boundary where available.
- Status codes are unchanged.
- Error body shape is unchanged.

## Tests added

Added `tests/kernel-error-message-dx.test.js` for:

- 404 message clarity
- 405 message clarity
- bad request message clarity
- request contract boundary clarity
- response contract safety
- handler failure safety
- exposed framework error message behavior
- deterministic error body shape

## Verification

```bash
bun test tests/kernel-error-message-dx.test.js tests/kernel-framework-errors.test.js tests/kernel-router-context.test.js
```

Result:

- 22 pass
- 0 fail

## Blockers

- No verbose debug mode was added by design.
- Stack traces remain intentionally excluded from responses.
