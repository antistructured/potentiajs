# Action Input / Output Contracts

## Files inspected

- `src/kernel/action.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/response.js`

## Files changed

- `src/kernel/action.js`
- `tests/kernel-action-contracts.test.js`
- `docs/internal/action-input-output-contracts.md`

## Behavior added

Actions now support:

- `input` contract
- `output` contract

Supported contract styles match existing contract adapter behavior:

- generic function contract
- `{ parse(value) }`
- `{ check(value) }`
- SigilJS contract

## Contract order

Action route execution order is:

1. route params/query/header contracts
2. action JSON input parsing
3. optional route body contract against parsed JSON
4. action input contract
5. action handler
6. action output contract against logical response body
7. route response contract
8. response projection

## Input behavior

Input contracts run after JSON parsing and before handler execution. The validated/transformed input is attached to `ctx.input`.

Input contract failure returns `400` with `POTENTIA_ACTION_INPUT_FAILED`.

## Output behavior

Output contracts validate the logical action output body before final response projection.

Native `Response` output is not validated in this block.

Output contract failure returns `500` with `POTENTIA_ACTION_OUTPUT_FAILED`.

## Verification

```bash
bun test tests/kernel-action-contracts.test.js tests/kernel-action-input.test.js
```

Result:

- 16 pass
- 0 fail

## Deferred

- native `Response` output validation
- richer field-level issue paths
- multiple output contracts by status
- URL-encoded/multipart input contracts
