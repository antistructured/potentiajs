# Route Manifest Diagnostics / Lookups

## Files inspected

- `src/kernel/route-manifest.js`
- `tests/kernel-route-manifest.test.js`

## Files changed

- `src/kernel/route-manifest.js`
- `tests/kernel-route-manifest-diagnostics.test.js`
- `docs/internal/route-manifest-diagnostics-lookups.md`

## Diagnostics added

Manifest creation now reports deterministic diagnostics for:

- `POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID`
- `POTENTIA_MANIFEST_DUPLICATE_ROUTE_NAME`
- `POTENTIA_MANIFEST_INVALID_ROUTE`

Duplicate IDs/names do not throw. The manifest still returns with diagnostics.

## Lookup tables

Manifest output includes:

```js
lookups: {
  byId: {},
  byName: {},
  byMethodPath: {}
}
```

Lookup value strategy:

- `byId[routeId]` -> route index
- `byName[name]` -> route ID
- `byMethodPath['METHOD /path']` -> route ID

Duplicate lookup entries keep the first route and emit diagnostics for later duplicates.

## Safety behavior

Lookups are metadata only. They do not replace the runtime router and do not execute app logic.

## Verification

```bash
bun test tests/kernel-route-manifest-diagnostics.test.js tests/kernel-route-manifest.test.js
```

Result:

- 19 pass
- 0 fail

## Deferred

- runtime router lookup replacement
- client lookup APIs
- manifest file writer
- route source inference
