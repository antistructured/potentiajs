# Framework Scoped Contract Defaults

## Files changed

- `src/kernel/route-collection.js`
- `tests/kernel-scoped-contracts.test.js`

## Behavior

Route collections and mounts may define scoped contract defaults:

```js
createRoutes({
  contracts: {
    headers: AuthHeaders,
    query: CommonQuery
  },
  routes: []
});
```

Supported boundaries:

- `params`
- `query`
- `headers`
- `body`
- `response`

## Merge rules

- Parent contracts apply first as defaults.
- Child collection contracts override parent defaults for the same boundary.
- Route contracts override scoped contracts for the same boundary.
- Different boundaries merge.

## Compatibility

Scoped contracts use the existing route contract adapter, so these styles work:

- generic function contracts
- `{ parse(value) }`
- `{ check(value) }`
- SigilJS contracts

## Mutation safety

Route option objects are not mutated. Effective scoped contracts are applied to cloned route objects in the app route table.

## Not implemented

- contract pipelines for the same boundary
- multiple validators per same boundary
- auth policy DSL
- OpenAPI generation

## Verification

```bash
bun test tests/kernel-scoped-contracts.test.js
```

Result:

- 8 pass
- 0 fail
