# Framework Lifecycle Hooks

## Files changed

- `src/kernel/app.js`
- `src/kernel/effect.js`
- `src/kernel/response.js`
- `tests/kernel-lifecycle-hooks.test.js`

## Hook configuration

`createApp` now accepts app-level hooks:

```js
createApp({
  routes: [],
  hooks: {
    beforeRequest: [],
    afterResponse: [],
    onError: []
  }
})
```

Hook arrays are copied during app creation so caller-owned hook arrays are not mutated.

## Hook phases

- `beforeRequest` runs after context creation and before contracts/handler execution.
- `afterResponse` runs after response projection.
- `onError` runs when handler/effect/contract/hook processing fails.

## Hook behavior

- Hooks may be plain functions, async functions, or effect descriptors.
- Hooks run in declaration order.
- `beforeRequest` receives `context`.
- `beforeRequest` may short-circuit by returning a response/result/response descriptor.
- `afterResponse` receives `context` and native `Response`.
- `afterResponse` may return a replacement response/result/response descriptor.
- `onError` receives `context` and a normalized framework error.
- `onError` may return a replacement response/result/response descriptor.
- Hook errors normalize through typed framework errors.

## Not a middleware system

Deferred:

- route-level middleware
- nested middleware
- middleware composition helpers
- plugin system
- dependency injection container
- request-scoped service registry

## Verification

`bun test` passes with 75 tests.
