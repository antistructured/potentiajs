# PotentiaJS

PotentiaJS is an experimental Bun-first JavaScript framework kernel for explicit, contract-driven request handling.

It is **not production-ready** and has **no stable public API** yet.

## Current status

- Package: `potentia-js`
- Version: `0.0.1`
- Visibility: private
- License metadata: `UNLICENSED`
- Runtime: Bun
- Source: plain JavaScript ES modules
- TypeScript source: none
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Future preview target: `0.0.2-preview.0`

Current kernel flow:

```txt
Request → Route Match → Contract Boundary → Effect Execution → Result Normalization → Response
```

## Install / local usage

From this repository:

```bash
bun install
bun run test
bun run check
bun run check:preview
```

The package is not npm-ready yet. Use local checkout or packed-artifact experiments only after preview checks pass.

## Minimal route

```js
import { createApp, json, ok, route } from 'potentia-js';

const app = createApp({
  routes: [
    route('GET', '/', () => ok(json({ ok: true })))
  ]
});

Bun.serve({ fetch: app.fetch });
```

## SigilJS contract route

Potentia uses SigilJS for runtime contracts.

```js
import { sigil, optional } from '@weipertda/sigiljs';
import { createApp, json, ok, route } from 'potentia-js';

const UserParams = sigil({ id: String });
const UserQuery = sigil({ include: optional(String) });
const UserResponse = sigil({ id: String, name: String });

const app = createApp({
  routes: [
    route('GET', '/users/:id', (ctx) => ok(json({
      id: ctx.params.id,
      name: ctx.query.include === 'full' ? 'Ada Lovelace' : 'Ada'
    })), {
      params: UserParams,
      query: UserQuery,
      response: UserResponse
    })
  ]
});
```

SigilJS `0.18.0` uses JavaScript constructors/helpers such as `sigil({ id: String })` and `optional(String)`.

## Route composition

Composition is explicit. There is no implemented file routing, auto-discovery, or global mutable route registry.

```js
import { createApp, createRoutes, json, mount, ok, route } from 'potentia-js';

const userRoutes = createRoutes({
  prefix: '/users',
  routes: [
    route('GET', '/', () => ok(json({ users: [] }))),
    route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id })))
  ]
});

const app = createApp({
  routes: [
    route('GET', '/', () => ok(json({ ok: true }))),
    mount(userRoutes, { prefix: '/api' })
  ]
});
```

Effective paths:

- `/`
- `/api/users`
- `/api/users/:id`

An internal/dev-only file-routing projection prototype now follows this explicit model:

```txt
filesystem → route modules → createRoutes / route / mount → createApp
```

The prototype can scan a route tree and generate an explicit `.potentia/routes.generated.js` module, but no public file-routing API is stable yet. The internal dev wrapper can write that generated module during development/build steps. The generated `.potentia/` directory is ignored by default. The runtime kernel does not perform production runtime filesystem scanning, and public CLI/watch/compiler integration remain deferred.

## Effects

Handlers and hooks may be plain functions, async functions, or experimental `effect(...)` descriptors. Effect helpers are small command constructors that keep generator workflows readable.

```js
import { call, effect, json, ok, route } from 'potentia-js';

const loadGreeting = (name) => ({ message: `hello ${name}` });

route('GET', '/hello', effect(function* hello(ctx) {
  const greeting = yield call(loadGreeting, ctx.query.name || 'world');
  return ok(json(greeting));
}));
```

Available helpers are `call(fn, ...args)`, `value(value)`, and `context(key)`. Raw command objects remain supported for compatibility, but helpers are preferred for normal usage.

The current effect runner is intentionally small. It is not a full effect system: concurrency, retries, cancellation, timeouts, queues, supervisors, and workflow tracing are deferred.

## Contract projection

Projection APIs are experimental metadata helpers for docs, tests, examples, and future tooling. They do not execute handlers, hooks, or generic contract logic.

```js
import { createRouteManifest, projectContract, projectRoute, projectRoutes } from 'potentia-js';

const contract = projectContract(UserResponse);
const single = projectRoute(route('GET', '/users/:id', handler, { response: UserResponse }));
const collection = projectRoutes(app);
const manifest = createRouteManifest(app, { packageName: 'potentia-js', packageVersion: '0.0.1' });
```

`projectContract()` reports honest metadata such as capability, opacity, schema, field summaries, required fields, and optional fields. Generic function/parse/check contracts remain opaque. SigilJS contracts expose richer metadata only where SigilJS safely provides it.

`projectRoute()` and `projectRoutes()` summarize methods, paths, contract boundaries, and hook counts without running application code. These helpers are not OpenAPI, client, forms, or docs generators; those remain deferred.

Route metadata is experimental. Routes may include optional `name`, `meta`, and `source` options for manifest/tooling descriptions. `createRouteManifest()` creates a deterministic route manifest with route IDs, names, contracts, hook counts, source/meta, diagnostics, and lookup tables. Manifest creation does not execute handlers, hooks, or contracts; it is a foundation for future docs, tests, clients, forms/actions, and dev tooling, not a completed generator.

## Hooks

Apps, route collections, and mounts can define lifecycle hooks:

```js
const secureRoutes = createRoutes({
  hooks: {
    beforeRequest: [requireAuth],
    afterResponse: [auditResponse],
    onError: [recover]
  },
  routes: []
});
```

Hook order for matched routes:

1. app `beforeRequest`
2. outer collection `beforeRequest`
3. inner collection `beforeRequest`
4. route handler
5. inner collection `afterResponse`
6. outer collection `afterResponse`
7. app `afterResponse`

Scoped `onError` recovery is nearest-local first, then outer scopes, then app hooks.

## Error/result model

Handlers usually return `ok(value)` or `fail(error)`. Response helpers create descriptors that project to native `Response` objects:

```js
return ok(json({ ok: true }));
```

Safe error body example:

```js
{
  error: {
    code: 'POTENTIA_CONTRACT_FAILED',
    message: 'Request body failed contract validation',
    boundary: 'body',
    issues: [{ message: 'SigilJS contract rejected value' }]
  }
}
```

Unsafe thrown handler errors return `POTENTIA_HANDLER_FAILED` with `Internal server error`.

## Examples

- [`examples/kernel-basic/`](examples/kernel-basic/) — generic contract kernel smoke app.
- [`examples/sigiljs-basic/`](examples/sigiljs-basic/) — focused SigilJS contract smoke app.
- [`examples/composed-basic/`](examples/composed-basic/) — explicit route composition smoke app.

Each example exports `app` for smoke tests and only starts `Bun.serve()` when run directly.

## Commands

```bash
bun run test          # test suite
bun run check         # current local check
bun run check:preview # tests + check + npm pack dry-run
bun run check:file-routing # internal file-routing projection tests
bun run generate:file-routes -- --root routes --out .potentia/routes.generated.js # internal/dev-only generation wrapper
bun run pack:dry      # npm pack --dry-run --json
```

## Current limitations

Deferred intentionally:

- stable public APIs
- registry publish
- root license/repository metadata decisions
- stable public file-based routing API and route auto-discovery
- nested layout routing
- frontend rendering and hydration
- client router
- server actions/RPC
- full middleware ecosystem
- large plugin ecosystem
- async plugin loading/discovery
- advanced effect workflows/concurrency/retries/cancellation
- field-level verbose contract diagnostics
- OpenAPI/JSON Schema/TypeScript/route docs/client/forms generators
- route manifest file writing/loading
- streaming/file responses/content negotiation/cookies API
- CLI expansion
- `.view` compiler changes
- database integration
- auth
- package splitting
- CI/release automation

## Public API status

All exports are experimental:

- app/routes: `createApp`, `route`, `createRoutes`, `mount`, `composeRoutes`
- results/responses: `ok`, `fail`, `json`, `text`, `redirect`, `toResponse`
- effects: `effect`, `call`, `value`, `context`, `runEffect`
- errors: `createFrameworkError`, `normalizeFrameworkError`
- contracts/projection/manifest/plugins/context: `projectContract`, `projectRoute`, `projectRoutes`, `createRouteManifest`, `createPlugin`, `createRequestContext`

Lower-level exports such as `createRequestContext`, `runEffect`, `normalizeFrameworkError`, and `toResponse` may be hidden or reshaped before any stable API commitment.

## Registry blockers

Before a public registry preview:

- package is still private
- root `LICENSE` file is absent
- repository/bugs/homepage metadata are not set
- no Git repository was detected in this checkout
- no public API is stable
- fresh install-from-packed-artifact smoke is still deferred
