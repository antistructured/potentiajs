# Action URL-Encoded Contract / Error Behavior

## Files inspected

- `src/kernel/action.js`
- `src/kernel/error.js`
- `src/kernel/contract.js`
- `tests/kernel-action-contracts.test.js`
- `tests/kernel-action-errors.test.js`

## Files changed

- `tests/kernel-action-urlencoded-contracts.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`
- `docs/internal/action-urlencoded-contract-error-behavior.md`

## Contract behavior

URL-encoded action input reuses existing action input contracts.

Supported:

- SigilJS contracts
- generic function contracts
- `{ parse(value) }`
- `{ check(value) }`

Contracts can transform URL-encoded string values into typed values. The parser itself performs no coercion.

Action output contract behavior is preserved for URL-encoded submissions.

## Error behavior

Malformed URL-encoded input returns deterministic `400` with `POTENTIA_ACTION_INPUT_FAILED`.

Dangerous field names are rejected before handler execution:

- `__proto__`
- `constructor`
- `prototype`

Raw form bodies are not exposed in public error responses.

Handler failures still return safe `POTENTIA_ACTION_HANDLER_FAILED` diagnostics and hide unsafe thrown messages.

Issue arrays remain deterministic.

## Verification

```bash
bun test tests/kernel-action-urlencoded-contracts.test.js tests/kernel-action-urlencoded-errors.test.js tests/kernel-action-urlencoded-input.test.js tests/kernel-action-contracts.test.js tests/kernel-action-errors.test.js
```

Result:

- 34 pass
- 0 fail

## Deferred

- field-level issue paths
- form-friendly action result envelopes
- redirect-after-action semantics
- multipart/file validation
