# Framework Params Contracts

## Files changed

- `src/kernel/app.js`
- `tests/kernel-params-contracts.test.js`

## Behavior added

Route options now support:

```js
route('GET', '/users/:id', handler, {
  params: paramsContract
})
```

## Execution order

1. Route matching extracts and URL-decodes params.
2. Invalid param encoding fails before contract validation with `POTENTIA_BAD_REQUEST`.
3. `params` contract runs before query/header/body contracts and before handler execution.
4. Validated/transformed params are attached to `ctx.params`.

## Supported contract styles

Params contracts use the same adapter path as other contracts:

- function contract
- `{ parse(value) }`
- `{ check(value) }`
- SigilJS contracts after native SigilJS support is enabled

## Failure behavior

Failed params contracts return deterministic 400 JSON:

```js
{ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Params failed contract validation' } }
```

## Verification

Targeted verification passed:

```bash
bun test tests/kernel-params-contracts.test.js tests/kernel-dynamic-routes.test.js tests/kernel-query-header-contracts.test.js
```

Result:

- 23 pass
- 0 fail

## Deferred

- Rich boundary diagnostics are deferred to the diagnostics pass.
- Native SigilJS detection/application is deferred to the SigilJS native pass.
