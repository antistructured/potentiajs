# Action Result Compatibility Review

## Files inspected

- `src/kernel/action.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `src/kernel/error.js`

## Files changed

- `src/kernel/result.js`
- `src/kernel/error.js`
- `src/kernel/response.js`
- `tests/kernel-action-result-compatibility.test.js`
- `tests/kernel-action-contracts.test.js`
- `tests/kernel-action-errors.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`
- `docs/internal/action-result-compatibility-review.md`

## Compatibility verified

Actions support existing Potentia response semantics:

- `ok(json(value))`
- `ok(text(value))`
- `fail(error)`
- plain object
- string
- `null`
- `undefined`
- native `Response`
- thrown handler error

Non-action route behavior remains unchanged.

## Small compatibility fixes

`fail(error, status)` now supports numeric status as a convenience for intentional domain failures while still returning a normal Potentia result.

Custom non-`POTENTIA_` domain error codes are preserved instead of being mapped to handler failure.

Safe error responses now include form-friendly top-level metadata:

- `ok: false`
- `boundary`
- `issues`

Existing nested `error.boundary` and `error.issues` are preserved for compatibility.

## Verification

```bash
bun test tests/kernel-action-result-compatibility.test.js tests/kernel-action-errors.test.js tests/kernel-action-contracts.test.js tests/kernel-action-urlencoded-errors.test.js
```

Result:

- 31 pass
- 0 fail

## Helper decision

No new action-specific success/failure helper was added. Existing primitives are sufficient for this block.
