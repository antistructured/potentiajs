# Framework Contract Adapter Architecture

## Files inspected

- `src/kernel/contract.js`
- `src/kernel/app.js`
- `src/kernel/route.js`
- `src/kernel/error.js`
- `tests/kernel-contract-boundary.test.js`
- `tests/kernel-query-header-contracts.test.js`

## Files changed

- `src/kernel/contract.js`
- `tests/kernel-contract-adapter.test.js`

## Adapter path

The contract layer now has one normalization path:

- `normalizeContract(contract)`
- `applyContract(contract, value, context)`
- `applyContractResult(contract, value, context)`

The normalized internal shape is deterministic:

```js
{
  kind,
  source,
  parse,
  project,
  describe
}
```

## Generic compatibility preserved

Supported generic styles still work:

- function contract
- `{ parse(value) }`
- `{ check(value) }`

Failure paths normalize through `POTENTIA_CONTRACT_FAILED` without exposing raw inputs.

## Public API decision

No new public exports were added in this pass. Adapter helpers remain internal module exports for kernel tests and future integration work.

## Verification

Targeted verification passed:

```bash
bun test tests/kernel-contract-adapter.test.js tests/kernel-contract-boundary.test.js tests/kernel-query-header-contracts.test.js
```

Result:

- 23 pass
- 0 fail

## Blockers

- SigilJS-specific detection is deferred to the native SigilJS pass.
- Params contracts are deferred to the next pass.
