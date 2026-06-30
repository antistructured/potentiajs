# Public Preview API Classification

## Scope

This document classifies the package root exports from `src/index.js` for the public preview readiness gate.

All current exports are **experimental public**. No export is stable.

## Files inspected

- `src/index.js`
- `src/kernel/app.js`
- `src/kernel/context.js`
- `src/kernel/contract.js`
- `src/kernel/contract-projection.js`
- `src/kernel/effect.js`
- `src/kernel/error.js`
- `src/kernel/plugin.js`
- `src/kernel/response.js`
- `src/kernel/result.js`
- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `README.md`
- `examples/`
- `tests/`
- `docs/internal/framework-public-surface-classification.md`

## Current package exports

Live root exports:

- `composeRoutes`
- `createApp`
- `createFrameworkError`
- `createPlugin`
- `createRequestContext`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `normalizeFrameworkError`
- `ok`
- `projectContract`
- `createRouteManifest`
- `projectRoute`
- `projectRoutes`
- `call`
- `context`
- `value`
- `redirect`
- `route`
- `runEffect`
- `text`
- `toResponse`

## Export classification

| Export | Classification | Purpose | Minimal usage | Stability | Known limitations | Preview survival intent |
| --- | --- | --- | --- | --- | --- | --- |
| `createApp` | experimental public | Create an app object with `fetch(request)`. | `createApp({ routes })` | Experimental | Bun-first; no adapter abstraction; no server factory beyond `fetch`. | Yes, core preview surface. |
| `route` | experimental public | Define an explicit route. | `route('GET', '/', handler, options)` | Experimental | No route aliases, host routing, optional params, or file routing. | Yes, core preview surface. |
| `createRoutes` | experimental public | Group routes with optional prefix/hooks/contracts. | `createRoutes({ prefix, routes })` | Experimental | No file discovery or lazy loading. | Yes, core composition surface. |
| `mount` | experimental public | Explicitly mount a route/collection/array with optional prefix/hooks/contracts. | `mount(routes, { prefix: '/api' })` | Experimental | No host/version helpers; prefix params not supported. | Yes, core composition surface. |
| `composeRoutes` | experimental public | Flatten route entries into effective routes. | `composeRoutes([route(...), createRoutes(...)])` | Experimental | Low-level helper; not required for most consumers. | Maybe; useful but may become internal later. |
| `createPlugin` | experimental public | Create a tiny plugin object with routes/hooks/contracts/setup. | `createPlugin({ name, routes })` | Experimental | No registry, discovery, async loading, permissions, or DI. | Maybe; intentionally minimal, could change. |
| `createRequestContext` | experimental public | Build the request context for matched routes. | `createRequestContext(request, match, state)` | Experimental | Mostly useful for tests/advanced use; shape may change. | Maybe; candidate to internalize later. |
| `effect` | experimental public | Wrap generator/effect workflows. | `effect(function* (ctx) { ... })` | Experimental | Minimal command set only: value/call/context. | Yes, current effect surface. |
| `call` | experimental public | Create a shape-stable effect call command. | `yield call(fn, ...args)` | Experimental | No concurrency/retry/cancel semantics. | Yes, current effect DX surface. |
| `value` | experimental public | Create a shape-stable effect value command. | `yield value(data)` | Experimental | Simple pass-through only. | Yes, current effect DX surface. |
| `context` | experimental public | Create a shape-stable context lookup command. | `yield context('key')` | Experimental | Direct key lookup only. | Yes, current effect DX surface. |
| `runEffect` | experimental public | Execute plain/async/effect handlers. | `await runEffect(handler, ctx)` | Experimental | Minimal interpreter; not a full effect system. | Maybe; useful for tests/advanced use. |
| `ok` | experimental public | Create success result shape. | `ok(json({ ok: true }))` | Experimental | Result shape may evolve before stabilization. | Yes, common handler helper. |
| `fail` | experimental public | Create failure result shape. | `fail(error)` | Experimental | Error detail projection intentionally limited. | Yes, common handler helper. |
| `json` | experimental public | Create JSON response descriptor. | `json({ ok: true })` | Experimental | No streaming/file/content negotiation helper. | Yes, common response helper. |
| `text` | experimental public | Create text response descriptor. | `text('hello')` | Experimental | Plain text only. | Yes, common response helper. |
| `redirect` | experimental public | Create redirect response descriptor. | `redirect('/login')` | Experimental | Minimal redirect descriptor; no URL policy. | Yes, common response helper. |
| `toResponse` | experimental public | Project descriptors/results/plain values into native `Response`. | `toResponse(ok(json({})))` | Experimental | Projection order may be refined; native `Response` passthrough skips response contracts. | Maybe; useful lower-level helper. |
| `createFrameworkError` | experimental public | Create typed Potentia errors. | `createFrameworkError('POTENTIA_BAD_REQUEST', 'Bad request')` | Experimental | Error code set may expand/change. | Yes, error boundary helper. |
| `normalizeFrameworkError` | experimental public | Normalize unknown errors into typed framework errors. | `normalizeFrameworkError(error)` | Experimental | Hides unsafe messages by design. | Maybe; useful for integrations/tests. |
| `projectContract` | experimental public | Project generic/SigilJS contract metadata. | `projectContract(contract)` | Experimental | Metadata only; generic contracts stay opaque; no OpenAPI/TS generator. | Maybe; preview docs/debug helper. |
| `createRouteManifest` | experimental public | Create deterministic route metadata manifests. | `createRouteManifest(app)` | Experimental | No file writer/loader, OpenAPI, clients, or forms generator. | Maybe; preview docs/test/tooling helper. |
| `projectRoute` | experimental public | Project route method/path/contracts/hooks metadata. | `projectRoute(route(...))` | Experimental | Does not expose handler source or generate manifests. | Maybe; preview docs/test helper. |
| `projectRoutes` | experimental public | Project route arrays, collections, mounts, or app routes. | `projectRoutes(app)` | Experimental | Not a full manifest/client/docs generator. | Maybe; preview docs/test helper. |

## Internal implementation details

These are not exported from the package root and should remain internal:

- `matchRoute`
- `parsePathPattern`
- `normalizeHooks`
- `pluginRoutes`
- contract adapter internals such as `normalizeContract`, `applyContract`, `createContractFailure`
- response internals such as `errorResponse`, `responseBody`, `replaceResponseBody`
- error constants/helpers not exported at the root

## Deferred public surfaces

Not implemented or not promoted:

- file routing / route discovery API
- frontend runtime API
- compiler API / `.view` API
- CLI API
- DB/auth APIs
- OpenAPI/schema/docs/client/forms generator APIs
- full middleware ecosystem
- plugin registry/discovery/async loading
- TypeScript declaration surface

## Accidental exports

No accidental package-root export was found in `src/index.js`.

`composeRoutes`, `createRequestContext`, `runEffect`, `toResponse`, `normalizeFrameworkError`, `projectContract`, `projectRoute`, and `projectRoutes` are lower-level than the primary tutorial path. They are intentionally exported today but should be reconsidered before any stable API commitment.

## Stability statement

No API is stable. All public exports remain experimental for the public preview gate.
