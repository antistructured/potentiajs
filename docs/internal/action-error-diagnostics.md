# Action Error Diagnostics

## Files inspected

- `src/kernel/action.js`
- `src/kernel/error.js`
- `src/kernel/response.js`
- `src/kernel/result.js`

## Files changed

- `src/kernel/action.js`
- `src/kernel/error.js`
- `tests/kernel-action-errors.test.js`
- `docs/internal/action-error-diagnostics.md`

## Error codes added

Action-specific framework codes now exist:

- `POTENTIA_ACTION_INPUT_FAILED`
- `POTENTIA_ACTION_OUTPUT_FAILED`
- `POTENTIA_ACTION_HANDLER_FAILED`

## Behavior

Malformed action JSON uses `POTENTIA_ACTION_INPUT_FAILED` rather than generic `POTENTIA_BAD_REQUEST` because the failure occurs at the action input boundary.

Failure mapping:

- malformed JSON → `400` / `POTENTIA_ACTION_INPUT_FAILED`
- input contract failure → `400` / `POTENTIA_ACTION_INPUT_FAILED`
- output contract failure → `500` / `POTENTIA_ACTION_OUTPUT_FAILED`
- thrown action handler error → `500` / `POTENTIA_ACTION_HANDLER_FAILED`

Public errors remain safe. Unsafe handler messages and stack traces are hidden.

Diagnostics include deterministic boundary values:

- `input`
- `output`
- `handler`

Issue arrays remain sanitized and deterministic.

## Verification

```bash
bun test tests/kernel-action-errors.test.js tests/kernel-action-contracts.test.js
```

Result:

- 17 pass
- 0 fail

## Deferred

- richer field-level issue paths
- redirect-after-action conventions
- multi-status action responses
- response content negotiation
