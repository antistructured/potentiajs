# Framework Dynamic Route Params

## Files changed

- `src/kernel/route.js`
- `src/kernel/app.js`
- `tests/kernel-dynamic-routes.test.js`

## Behavior added

Dynamic route segments are now supported:

```js
route('GET', '/users/:id', handler)
route('GET', '/orgs/:orgId/users/:userId', handler)
```

Matched params are decoded and attached to `ctx.params` as strings.

## Matching rules

- Exact static routes still work.
- Path segment count must match exactly.
- `/users/:id` does not match `/users`.
- `/users/:id` does not match `/users/123/profile`.
- Static routes win over dynamic routes.
- More specific routes win before declaration order.
- Declaration order breaks ties only after specificity.
- Wrong method returns 405 when the path pattern exists.
- Invalid route param URL encoding returns deterministic 400.

## Deferred

- Wildcards.
- Optional params.
- Regex params.
- Nested routers.
- Route groups.
- File routing.

## Verification

`bun test tests/kernel-dynamic-routes.test.js tests/kernel-router-context.test.js` passes with 15 tests.
