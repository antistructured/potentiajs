# Framework Route Collection Model

## Files changed

- `src/kernel/route-collection.js`
- `src/kernel/app.js`
- `src/index.js`
- `tests/kernel-route-collections.test.js`

## Public exports

Added experimental exports:

- `createRoutes`
- `composeRoutes`

## Collection shape

`createRoutes()` returns:

```js
{
  kind: 'routes',
  prefix: '',
  routes: [],
  hooks: { beforeRequest: [], afterResponse: [], onError: [] },
  contracts: {},
  meta: null
}
```

## Behavior

- Empty route collections are accepted by `createApp()`.
- Collections containing direct routes flatten into the app route table.
- Mixed direct routes and route collections work.
- Caller-owned route arrays are copied, not mutated.
- Router matching semantics remain unchanged.

## Deferred to later passes

- Prefix application.
- Explicit `mount()`.
- Scoped contract defaults.
- Scoped hooks.
- Plugin seam.
- File routing.

## Verification

```bash
bun test tests/kernel-route-collections.test.js tests/kernel-router-context.test.js tests/kernel-dynamic-routes.test.js
```

Result:

- 20 pass
- 0 fail
