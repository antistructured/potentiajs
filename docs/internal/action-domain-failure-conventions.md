# Action Domain Failure Conventions

## Files inspected

- `src/kernel/result.js`
- `src/kernel/error.js`
- `src/kernel/action.js`
- `tests/kernel-action-result-compatibility.test.js`

## Files changed

- `src/kernel/result.js`
- `src/kernel/error.js`
- `src/kernel/action.js`
- `tests/kernel-action-domain-failure.test.js`
- `docs/internal/action-domain-failure-conventions.md`

## Convention

Intentional domain/business failures should use existing `fail(...)` results.

Recommended concise form:

```js
return fail({
  code: 'USER_EMAIL_TAKEN',
  message: 'Email is already in use'
}, 409);
```

The second numeric argument is interpreted as HTTP status for the normalized error. Non-numeric second arguments remain `meta` as before.

Custom domain error codes are preserved rather than mapped to handler failures.

## Output contract interaction

Action output contracts do not run for failed action results. They validate successful logical action values only.

## Safety boundary

Intentional domain failures are distinct from thrown unsafe errors:

- domain failure → caller-provided safe code/message/status
- thrown handler error → `POTENTIA_ACTION_HANDLER_FAILED` with unsafe details hidden

## Verification

```bash
bun test tests/kernel-action-domain-failure.test.js tests/kernel-action-result-compatibility.test.js tests/kernel-action-contracts.test.js
```

Result:

- 24 pass
- 0 fail

## Deferred

- domain error class hierarchy
- localization
- field-mapping framework
- form state persistence
