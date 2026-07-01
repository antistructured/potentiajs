# Action Redirect Semantics

## Files inspected

- `src/kernel/action.js`
- `src/kernel/app.js`
- `src/kernel/response.js`

## Files changed

- `src/kernel/action.js`
- `src/kernel/app.js`
- `src/kernel/response.js`
- `tests/kernel-action-redirect.test.js`
- `docs/internal/action-redirect-semantics.md`

## Decisions

Actions redirect through the existing `redirect(location, status)` helper. No `actionRedirect()` helper was added.

Redirect status behavior follows existing `redirect(...)` behavior:

- default status: `302`
- custom status supported through the second argument, e.g. `redirect('/users', 303)`

Redirect response body is empty.

Redirects remain explicit. No automatic redirect, session flash, cookie, or form state behavior was added.

## Contract interaction

Action output contracts bypass redirect descriptors/results.

Route response contracts also bypass redirect descriptors/results, matching the native `Response` bypass posture.

Normal non-redirect action output contracts still run.

## Input compatibility

Redirects work after both JSON and URL-encoded action submissions.

## Verification

```bash
bun test tests/kernel-action-redirect.test.js tests/kernel-action-result-compatibility.test.js
```

Result:

- 17 pass
- 0 fail

## Deferred

- action result helpers
- redirect-after-validation-failure conventions
- session flash
- form state preservation
- content negotiation
