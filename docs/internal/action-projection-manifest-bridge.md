# Action Projection / Manifest Bridge

## Files inspected

- `src/kernel/action.js`
- `src/kernel/action-projection.js`
- `src/kernel/route-projection.js`
- `src/kernel/route-manifest.js`
- `src/index.js`

## Files changed

- `src/kernel/action-projection.js`
- `src/kernel/route-projection.js`
- `src/kernel/route-manifest.js`
- `src/index.js`
- `tests/kernel-action-projection.test.js`
- `tests/kernel-route-projection.test.js`
- `docs/internal/action-projection-manifest-bridge.md`

## Public experimental export

Added:

- `projectAction(action)`

## Action projection shape

```js
{
  kind: 'action',
  id,
  input,
  output,
  source,
  meta
}
```

`input` and `output` use `projectContract(...)`.

Projection does not execute:

- action handlers
- input contracts
- output contracts

Invalid action input projects deterministically as `unknown-action`.

## Route projection bridge

`projectRoute(...)` now detects action handlers and includes an `action` projection when present.

Non-action route projections include `action: null`.

## Manifest bridge

`createRouteManifest(...)` now includes a top-level `actions` array for action handlers discoverable from routes.

Manifest action entries include:

- `kind`
- `id`
- `routeId`
- `method`
- `path`
- `input`
- `output`
- `contentTypes: ['application/json', 'application/x-www-form-urlencoded']`
- `enhancement`
- `source`
- `meta`
- `index`

The bridge keeps existing route entries intact and does not force every route to be an action.

## Verification

```bash
bun test tests/kernel-action-projection.test.js tests/kernel-route-projection.test.js tests/kernel-route-manifest.test.js tests/kernel-route-manifest-diagnostics.test.js
```

Result:

- 34 pass
- 0 fail

## Deferred

- client generation
- docs generation
- form generation
- action manifest file writer
- RPC endpoint discovery
- action lookups/diagnostics beyond route linkage
