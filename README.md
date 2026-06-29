# potentia

PotentiaJS is an experimental Bun-first JavaScript framework kernel for explicit, contract-driven request handling.

It is **not production-ready** and has **no stable public API** yet. The current package is a private preview candidate: useful for local/GitHub evaluation, not ready for registry publishing without a follow-up publish-prep decision.

## What exists today

Potentia currently provides an experimental server/kernel layer:

Request → Route Match → Contract Boundary → Effect Execution → Result Normalization → Response

Implemented capabilities:

- Bun-native `app.fetch`
- plain JavaScript ES modules
- static routes
- dynamic `:param` routes
- deterministic route specificity
- params/query/headers/body/response contracts
- generic function, `{ parse(value) }`, and `{ check(value) }` contracts
- native `@weipertda/sigiljs` runtime contract support
- typed framework errors
- deterministic response projection
- app-level lifecycle hooks
- explicit route collections
- explicit route mounting and prefix composition
- scoped contract defaults
- scoped lifecycle hooks
- minimal plugin seam
- minimal contract projection

## Runtime and package status

- Runtime target: Bun
- Source language: plain JavaScript
- Module format: ES modules
- TypeScript source: none
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Current package version: `0.0.1`
- Current package visibility: private
- Suggested future preview target: `0.0.2-preview.0`

## Install locally

From this repository:

```bash
bun install
bun run test
bun run check
bun run pack:dry
```

For local package-consumer experiments, install from a packed artifact or local path only after running the preview checks. Do not treat this as a stable npm package yet.

## Current experimental exports

All exports are experimental:

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
- `redirect`
- `route`
- `runEffect`
- `text`
- `toResponse`

## Minimal route example

```js
import { createApp, json, ok, route } from 'potentia-js';

const app = createApp({
  routes: [
    route('GET', '/', (ctx) => ok(json({ message: 'hello', path: ctx.path })))
  ]
});

Bun.serve({ fetch: app.fetch });
```

## SigilJS contract example

Potentia uses SigilJS as its runtime contract layer.

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

## Route composition example

Potentia uses explicit composition primitives. There is no file routing, hidden auto-discovery, or global mutable route registry.

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

Prefix composition normalizes duplicate slashes and preserves static/dynamic route specificity.

## Scoped contracts

Route collections and mounts can define scoped contract defaults. Route-level contracts override scoped defaults for the same boundary; different boundaries merge.

```js
import { sigil } from '@weipertda/sigiljs';
import { createRoutes, json, ok, route } from 'potentia-js';

const AuthHeaders = sigil({ 'x-auth': String });
const UserParams = sigil({ id: String });
const UserResponse = sigil({ id: String, name: String });

const userRoutes = createRoutes({
  prefix: '/users',
  contracts: {
    headers: AuthHeaders
  },
  routes: [
    route('GET', '/:id', (ctx) => ok(json({
      id: ctx.params.id,
      name: 'Ada'
    })), {
      params: UserParams,
      response: UserResponse
    })
  ]
});
```

Supported boundaries:

- `params`
- `query`
- `headers`
- `body`
- `response`

## Scoped hooks

Route collections and mounts can define scoped lifecycle hooks:

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

Hook order for matched routes is deterministic:

1. app `beforeRequest`
2. outer collection `beforeRequest`
3. inner collection `beforeRequest`
4. route handler
5. inner collection `afterResponse`
6. outer collection `afterResponse`
7. app `afterResponse`

Scoped `onError` recovery is nearest-local first, then outer scopes, then app hooks.

## Minimal plugin seam

`createPlugin()` is experimental and intentionally small:

```js
import { createApp, createPlugin, json, ok, route } from 'potentia-js';

const healthPlugin = createPlugin({
  name: 'health',
  routes: [route('GET', '/health', () => ok(json({ ok: true })))]
});

const app = createApp({
  plugins: [healthPlugin]
});
```

Plugin routes, hooks, and contracts apply only to plugin routes. There is no plugin discovery, registry, async loading, dependency injection container, or permission system.

## Contract diagnostics

Contract failures return deterministic safe diagnostics:

```js
{
  error: {
    code: 'POTENTIA_CONTRACT_FAILED',
    message: 'Params failed contract validation',
    boundary: 'params',
    issues: [{ message: 'Contract validation failed' }]
  }
}
```

Unsafe raw inputs and thrown validator internals are not exposed.

## Contract projection

`projectContract(contract)` returns honest, minimal metadata for docs/test/debug usage without executing generic contract logic. For SigilJS contracts, projection includes safe JSON Schema metadata via SigilJS.

This is not an OpenAPI, TypeScript, or route documentation generator.

## Examples

- [`examples/kernel-basic/`](examples/kernel-basic/) — generic contract kernel smoke app.
- [`examples/sigiljs-basic/`](examples/sigiljs-basic/) — SigilJS-native contract smoke app.
- [`examples/composed-basic/`](examples/composed-basic/) — explicit route composition smoke app.

Each example has a smoke test under `tests/*example*.test.js`.

## Commands

```bash
bun install
bun run test
bun run check
bun run pack:dry
```

If available in your checkout after the preview-readiness gate:

```bash
bun run check:preview
```

## Current limitations and deferred work

Deferred intentionally:

- stable public APIs
- registry publish
- file-based routing and route auto-discovery
- nested layout routing
- frontend rendering and hydration
- client router
- server actions/RPC
- full middleware ecosystem
- large plugin ecosystem
- async plugin loading/discovery
- field-level verbose contract diagnostics
- OpenAPI/JSON Schema/TypeScript/route docs generators
- streaming/file responses/content negotiation/cookies API
- CLI expansion
- `.view` compiler changes
- database integration
- auth
- package splitting
- CI/release automation

## Preview readiness notes

Current blockers before a public registry preview:

- package is still private
- root `LICENSE` file is absent
- repository/bugs/homepage metadata are not set
- no Git repository was detected in this checkout
- no public API is stable

See `docs/internal/` in the repository for audit reports. Those internal docs are repository evidence and may be excluded from registry packages later.
