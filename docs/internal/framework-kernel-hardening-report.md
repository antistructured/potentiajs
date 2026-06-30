# Framework Kernel Hardening Report

## 1. Current package

- Package: `potentia-js`
- Private package: yes
- Runtime target: Bun-first plain JavaScript ESM

## 2. Current version

- `0.0.1`

## 3. Scope completed

This block hardened the experimental kernel without expanding into frontend, CLI, compiler, database, auth, package splitting, TypeScript, SigilJS installation, or release automation.

Completed:

- dynamic route params
- deterministic route specificity
- query contract boundaries
- header contract boundaries
- typed framework errors
- deterministic response projection semantics
- app-level lifecycle hooks
- basic kernel smoke example
- README and internal docs updates

## 4. New/changed public exports

New experimental public exports:

- `createFrameworkError`
- `normalizeFrameworkError`

Preserved experimental exports:

- `createApp`
- `createRequestContext`
- `effect`
- `fail`
- `json`
- `ok`
- `redirect`
- `route`
- `runEffect`
- `text`
- `toResponse`

No API is stable.

## 5. Dynamic routing behavior

- Supports `:param` route segments.
- Extracted params are decoded strings on `ctx.params`.
- Static routes beat dynamic routes.
- More specific routes beat less specific routes.
- Declaration order breaks ties after specificity.
- Segment count must match exactly.
- Invalid param encoding returns `POTENTIA_BAD_REQUEST`.

## 6. Contract boundary behavior

Route options now support:

- `body`
- `query`
- `headers`
- `response`

Contract styles remain:

- function contract
- `{ parse(value) }`
- `{ check(value) }`

Query/header semantics:

- `ctx.query` is a sorted plain object.
- repeated query params become arrays.
- `ctx.headers` is a sorted plain object with lowercase header names.
- failed body/query/header contracts return `POTENTIA_CONTRACT_FAILED` with status 400.
- failed response contracts return `POTENTIA_RESPONSE_CONTRACT_FAILED` with status 500.

SigilJS was not installed or hardcoded.

## 7. Error model

Added typed framework errors:

```js
{
  name: 'PotentiaError',
  code,
  message,
  status,
  detail,
  cause,
  expose
}
```

Codes:

- `POTENTIA_NOT_FOUND`
- `POTENTIA_METHOD_NOT_ALLOWED`
- `POTENTIA_CONTRACT_FAILED`
- `POTENTIA_RESPONSE_CONTRACT_FAILED`
- `POTENTIA_HANDLER_FAILED`
- `POTENTIA_BAD_REQUEST`

Unsafe unknown errors hide internals behind `Internal server error`.

## 8. Response projection rules

Projection order:

1. native `Response` passthrough
2. `ok(value)` unwraps and projects
3. `fail(error)` returns typed error response
4. response descriptors convert to native `Response`
5. errors normalize to typed framework errors
6. `undefined` returns 204
7. `null` returns 204
8. strings return text responses
9. plain objects return JSON responses

Response contracts validate logical handler body before final native response projection where practical. Native `Response` passthrough is not response-contract validated.

## 9. Lifecycle hook behavior

`createApp` supports app-level hooks:

- `beforeRequest`
- `afterResponse`
- `onError`

Hooks may be plain, async, or effect handlers. Hooks run in declaration order.

Allowed behavior:

- `beforeRequest` may short-circuit with a response/result/descriptor.
- `afterResponse` may replace the response.
- `onError` may replace the error response.

No full middleware system was introduced.

## 10. Example app

Created `examples/kernel-basic/`:

- `examples/kernel-basic/package.json`
- `examples/kernel-basic/index.js`
- `examples/kernel-basic/README.md`

The example demonstrates:

- `createApp`
- static route
- dynamic route param
- query contract
- header contract
- body contract
- response contract
- effect handler
- typed framework error
- `Bun.serve({ fetch: app.fetch })`

## 11. Tests added/updated

Added:

- `tests/kernel-dynamic-routes.test.js`
- `tests/kernel-query-header-contracts.test.js`
- `tests/kernel-framework-errors.test.js`
- `tests/kernel-response-projection.test.js`
- `tests/kernel-lifecycle-hooks.test.js`
- `tests/kernel-basic-example.test.js`

Updated existing tests for typed error codes and plain query objects.

Final test count after this block: 79 passing tests.

## 12. Docs added/updated

Added:

- `docs/internal/framework-kernel-hardening-scope-lock.md`
- `docs/internal/framework-dynamic-route-params.md`
- `docs/internal/framework-query-header-contracts.md`
- `docs/internal/framework-error-model.md`
- `docs/internal/framework-response-projection.md`
- `docs/internal/framework-lifecycle-hooks.md`
- `docs/internal/framework-kernel-hardening-report.md`

Updated:

- `README.md`

## 13. Remaining blockers

- No Git repository at this path.
- No lint script/dependency by design.
- No CI/release workflow.
- SigilJS is not installed or natively integrated yet.
- No file routing, frontend runtime, full middleware ecosystem, database, auth, or compiler integration.
- No streaming/file/cookie/content negotiation response helpers.

## 14. Recommendation

Next block: **SigilJS Native Integration — Manual Virtual Sub-Agent Workflow**

Focus on first real SigilJS dependency decision, native SigilJS route/body/query/header/response contracts, contract projection to docs/examples, generated contract test cases, boundary error diagnostics, runtime contract performance notes, and package compatibility with SigilJS consumers.
