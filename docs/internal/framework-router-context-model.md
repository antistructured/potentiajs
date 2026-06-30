# Framework Router / Context Model

## Files changed

- `src/kernel/app.js`
- `src/kernel/route.js`
- `src/kernel/context.js`
- `src/index.js`
- `tests/kernel-router-context.test.js`

## Experimental exports

- `createApp(options)`
- `route(method, path, handler, options)`
- `createRequestContext(request, match, appState)`

## Supported routing behavior

- Exact static path matching.
- HTTP method matching.
- Deterministic 404 JSON response for missing paths.
- Deterministic 405 JSON response when a path exists but the method does not match.
- Route-local options object retained on route descriptors.
- Native request handling through `app.fetch(request)`.

## Context shape

Route handlers receive a context object with stable keys:

```js
{
  request,
  method,
  url,
  path,
  params,
  query,
  headers,
  body,
  route,
  state
}
```

`params` and `query` always exist. `body` starts as `null`.

## Deferred

- Dynamic params.
- Wildcards.
- Nested routes.
- File routing.
- Middleware chains.
- Streaming.
- Server actions.
- Frontend routing.

## Verification

`bun test tests/kernel-router-context.test.js tests/kernel-result-response.test.js` passes with 14 tests.
