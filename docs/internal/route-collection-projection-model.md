# Route Collection Projection Model

## Files inspected

- `src/kernel/route-projection.js`
- `src/kernel/route-collection.js`
- `src/kernel/app.js`
- `src/index.js`
- `tests/kernel-route-collection-projection.test.js`

## Files changed

- `src/kernel/route-projection.js`
- `src/index.js`
- `tests/kernel-route-collection-projection.test.js`
- `docs/internal/route-collection-projection-model.md`

## Public experimental export

Added:

- `projectRoutes(routesOrCollection)`

This is experimental and intended for docs/tests/future tooling metadata only.

## Supported inputs

`projectRoutes()` supports:

- direct route arrays
- `createRoutes(...)` collections
- `mount(...)` descriptors
- `createApp(...)` objects with composed `routes`

## Projection shape

```js
{
  kind: 'routes',
  prefix,
  routes,
  hooks,
  contracts,
  meta
}
```

Route children use `projectRoute()`.

Route children now include deterministic IDs plus optional route name/source/meta metadata when present.

Scoped contracts are projected with `projectContract()` through the shared contract-boundary shape.

Hooks are summarized as counts only:

```js
{
  beforeRequest,
  afterResponse,
  onError
}
```

## Safety behavior

Collection projection does not execute:

- route handlers
- hooks
- contracts
- app request handling

Mounted/collection inputs are composed through existing descriptor composition so effective paths and scoped contracts project consistently.

Invalid input projects deterministically as `kind: 'unknown-routes'`.

## Verification

```bash
bun test tests/kernel-route-collection-projection.test.js tests/kernel-route-projection.test.js
```

Result:

- 16 pass
- 0 fail

## Deferred

- OpenAPI generation
- route manifest file writing/loading
- route client generation
- filesystem manifest output
