# Framework Scoped Hooks

## Files changed

- `src/kernel/app.js`
- `src/kernel/route-collection.js`
- `tests/kernel-scoped-hooks.test.js`

## Behavior

Route collections and mounts may define scoped lifecycle hooks:

```js
createRoutes({
  hooks: {
    beforeRequest: [requireAuth],
    afterResponse: [auditResponse],
    onError: [recover]
  },
  routes: []
});
```

## Ordering

For a matched route, hook order is deterministic:

1. app `beforeRequest`
2. outer collection `beforeRequest`
3. inner collection `beforeRequest`
4. route handler
5. inner collection `afterResponse`
6. outer collection `afterResponse`
7. app `afterResponse`

`onError` uses nearest-local recovery first:

1. inner collection `onError`
2. outer collection `onError`
3. app `onError`

## Hook capabilities

Scoped hooks support the existing hook behavior:

- plain functions
- async functions
- effect handlers
- `beforeRequest` short-circuit responses
- `afterResponse` response replacement
- `onError` recovery responses

## Locality

Scoped hooks apply only to child routes. Sibling collections do not share hooks.

## Mutation safety

Hook arrays are copied during normalization. Caller-owned hook arrays are not mutated.

## Not implemented

- middleware composition helpers
- dependency injection
- plugin lifecycle beyond the small seam pass
- file-routing middleware conventions

## Verification

```bash
bun test tests/kernel-scoped-hooks.test.js tests/kernel-lifecycle-hooks.test.js
```

Result:

- 17 pass
- 0 fail
