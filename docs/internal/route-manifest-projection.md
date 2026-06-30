# Route Manifest Projection

## Files inspected

- `src/kernel/route-manifest.js`
- `src/kernel/route-projection.js`
- `src/index.js`
- `tests/kernel-route-manifest.test.js`

## Files changed

- `src/kernel/route-manifest.js`
- `src/index.js`
- `tests/kernel-route-manifest.test.js`
- `docs/internal/route-manifest-projection.md`

## Public experimental export

Added:

- `createRouteManifest(input, options)`

No manifest API is stable.

## Supported inputs

- direct route arrays
- `createRoutes(...)` route collections
- `mount(...)` descriptors
- `createApp(...)` app objects

## Manifest shape

```js
{
  kind: 'potentia-route-manifest',
  version: 1,
  package: { name, version },
  routes,
  lookups,
  diagnostics,
  meta
}
```

Manifest routes include:

- `id`
- `name`
- `method`
- `path`
- `contracts`
- `hooks`
- `source`
- `meta`
- `index`

## Safety behavior

Manifest creation uses route/collection projection and does not execute:

- handlers
- hooks
- contracts
- request handling code

Invalid input returns a manifest with a deterministic diagnostic rather than throwing.

## Verification

```bash
bun test tests/kernel-route-manifest.test.js tests/kernel-route-id-strategy.test.js
```

Result:

- 18 pass
- 0 fail

## Deferred

- manifest file writing
- manifest loading
- OpenAPI
- client generation
- forms/actions generation
- runtime router lookup replacement
