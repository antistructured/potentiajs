# Framework Route Mounting

## Files changed

- `src/kernel/route-collection.js`
- `src/index.js`
- `tests/kernel-route-mounting.test.js`

## Public export

Added experimental export:

- `mount`

## Prefix behavior

`createRoutes({ prefix, routes })` applies the collection prefix to child routes.

`mount(collectionOrRoute, { prefix })` applies an additional mount prefix.

Prefix composition is deterministic:

```txt
mount prefix + collection prefix + route path
```

Example:

```txt
/api + /users + /:id = /api/users/:id
```

## Normalization

- duplicate slashes are collapsed
- root route `/` under `/api` becomes `/api`
- dynamic params continue to decode through the existing router
- static/dynamic specificity is preserved after prefixing

## Mutation safety

Mounted routes are cloned into the app route table. Original route objects and collections are not mutated.

## Deferred

- optional prefix params
- host routing
- versioning helpers
- aliases
- file routing

## Verification

```bash
bun test tests/kernel-route-mounting.test.js tests/kernel-route-collections.test.js tests/kernel-dynamic-routes.test.js
```

Result:

- 20 pass
- 0 fail
