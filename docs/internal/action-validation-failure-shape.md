# Action Validation Failure Shape

## Files inspected

- `src/kernel/response.js`
- `src/kernel/error.js`
- `src/kernel/action.js`
- `tests/kernel-action-errors.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`

## Files changed

- `src/kernel/response.js`
- `tests/kernel-action-validation-shape.test.js`
- existing action error/contract tests updated for the expanded shape
- `docs/internal/action-validation-failure-shape.md`

## Shape

Action validation and safe framework failures now return a deterministic body with form-friendly top-level metadata:

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

The nested `error.boundary` and `error.issues` fields are preserved for compatibility with existing error-shape tests and callers.

## Input validation failures

Input validation failures return:

- status: `400`
- code: `POTENTIA_ACTION_INPUT_FAILED`
- `ok: false`
- `boundary: 'input'`
- deterministic `issues`

JSON and URL-encoded failures share the same shape.

## Output / handler failures

Output validation failures remain safe `500` responses with `boundary: 'output'`.

Handler failures remain safe `500` responses with `POTENTIA_ACTION_HANDLER_FAILED`; unsafe thrown messages are hidden.

## Verification

```bash
bun test tests/kernel-action-validation-shape.test.js tests/kernel-action-errors.test.js tests/kernel-action-urlencoded-errors.test.js tests/kernel-action-content-type.test.js tests/kernel-action-input.test.js tests/kernel-action-urlencoded-contracts.test.js
```

Result:

- 39 pass
- 0 fail

## Deferred

- field-level diagnostic overhaul
- localization
- form state preservation
- flash/session support
