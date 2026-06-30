# Route Projection Model

## Files inspected

- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `src/kernel/contract-projection.js`
- `src/index.js`
- `tests/kernel-route-projection.test.js`

## Files changed

- `src/kernel/route-projection.js`
- `src/index.js`
- `tests/kernel-route-projection.test.js`
- `docs/internal/route-projection-model.md`

## Public experimental export

Added:

- `projectRoute(route)`

This is experimental and intended for docs/tests/future tooling metadata only.

## Projection shape

```js
{
  kind: 'route',
  id,
  name,
  method,
  path,
  contracts: {
    params,
    query,
    headers,
    body,
    response
  },
  hooks: {
    beforeRequest,
    afterResponse,
    onError
  },
  source,
  meta
}
```

Contract boundaries use `projectContract()` when present and `null` when absent.

## Safety behavior

Route projection does not execute:

- route handlers
- hooks
- contracts
- request handling code

Invalid/non-route input projects deterministically as `kind: 'unknown-route'` with null contracts and zero hook counts.

## Verification

```bash
bun test tests/kernel-route-projection.test.js tests/kernel-sigiljs-projection.test.js
```

Result:

- 14 pass
- 0 fail

## Addendum — Route Metadata / Manifest Foundation

Route projection now includes deterministic route IDs plus optional route `name`, `source`, and `meta` metadata. These fields are descriptive and experimental.

`id` uses the default manifest strategy: `METHOD /normalized/path`.

## Deferred

- OpenAPI path item generation
- route manifest file writing/loading
- client generation
- filesystem manifest output
