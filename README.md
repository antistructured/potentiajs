# PotentiaJS

PotentiaJS is an experimental, contract-driven JavaScript framework kernel for building server-first applications with explicit routing, actions, form metadata, and file-routing projection.

<img src="assets/images/potentiajs-full-banner.png" alt="PotentiaJS – Contract-Driven Application Kernel" width="100%" height="auto">

`0.2.0-preview.0` builds on the first serious public foundation with a preview HTML-first response layer. PotentiaJS is usable and externally installable, but it is **not production-ready**, **not a 1.0 stability guarantee**, and still has **no permanent public API** commitment.

## Current status

- Package: `@potentiajs/core`
- Version: `0.2.0-preview.0`
- Visibility: HTML-first response foundation preview
- License: MIT
- Runtime: Bun-first/Node
- Source: plain JavaScript ES modules
- TypeScript source: none
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Type declarations: minimal conservative declarations included

Current kernel flow:

```txt
Request → Route Match → Contract Boundary → Effect Execution → Result Normalization → Response
```

## Install / local usage

Install from npm:

```bash
npm install @potentiajs/core
```

With Bun:

```bash
bun add @potentiajs/core
```

From this repository:

```bash
bun install
bun run test
bun run check
bun run check:preview
```

The package is published as `@potentiajs/core` on npm and JSR.

## Minimal route

```js
import { createApp, json, ok, route } from '@potentiajs/core';

const app = createApp({
  routes: [
    route('GET', '/', () => ok(json({ ok: true })))
  ]
});

Bun.serve({ fetch: app.fetch });
```

## HTML-first responses

PotentiaJS includes experimental HTML-first response helpers through the `@potentiajs/core/html` subpath. They are plain JavaScript helpers for server-rendered HTML responses — not JSX, not a compiler, not a virtual DOM, and not a client runtime.

```js
import { createApp, route } from '@potentiajs/core';
import { attrs, fragment, html, htmlResponse, layout, page, raw } from '@potentiajs/core/html';

const appLayout = layout(({ title, children }) => html`
  <main${attrs({ class: ['page', 'home'] })}>
    <h1>${raw('<span aria-hidden="true">★</span>')} ${title}</h1>
    ${children}
  </main>
`);

const app = createApp({
  routes: [
    route('GET', '/', () => htmlResponse(page({
      title: 'Potentia',
      body: appLayout({
        title: 'Potentia',
        children: fragment(
          html`<p>${'Escaped by default: <script>'}</p>`,
          html`<p>Regular HTML, explicit trust boundaries.</p>`
        )
      })
    })))
  ]
});
```

Interpolated values escape by default. Use `raw(...)` only for trusted HTML. `layout(...)` wraps reusable server-first page shells, `page(...)` composes a full HTML document shell, and `htmlResponse(...)` returns a standard `Response` with `text/html; charset=utf-8` unless a content type is already provided.

The HTML helpers are subpath-only in `0.2.0-preview.1`; they are not root exports.

## SigilJS contract route

Potentia uses SigilJS for runtime contracts.

```js
import { sigil, optional } from '@weipertda/sigiljs';
import { createApp, json, ok, route } from '@potentiajs/core';

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

Composition is explicit. File routing is optional generated projection, not auto-discovery during request handling or a global mutable route registry.

```js
import { createApp, createRoutes, json, mount, ok, route } from '@potentiajs/core';

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

The experimental file-routing subpath follows this explicit model:

```txt
filesystem → route modules → createRoutes / route / mount → createApp
```

The file-routing preview API can scan a route tree and generate an explicit `.potentia/routes.generated.js` module. It is a package subpath, not a root export.

Route files:

```txt
routes/
  index.js
  health.js
  users/
    [id].js
```

Generate explicit routes with the experimental CLI:

```bash
potentia routes generate
potentia routes check
```

Equivalent explicit form:

```bash
potentia routes generate --root routes --out .potentia/routes.generated.js --package @potentiajs/core
potentia routes check --root routes --out .potentia/routes.generated.js --package @potentiajs/core
```

`generate` writes `.potentia/routes.generated.js`. `check` verifies the generated output is current without writing files, which makes it suitable for CI. Both commands support the same `--root`, `--out`, `--package`, and `--cwd` flags.

For scripts and CI tooling, add `--json` to either command:

```bash
potentia routes generate --json
potentia routes check --json
```

JSON changes output format only: `generate --json` still writes files, `check --json` remains non-mutating, JSON envelopes go to stdout, and exit codes remain the same. The CLI does not include watch mode, config files, a dev server, or a compiler.

You can also call the programmatic API directly:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';

await generateFileRoutes({
  rootDir: 'routes',
  outputFile: '.potentia/routes.generated.js'
});
```

Use the generated module explicitly:

```js
import { createApp } from '@potentiajs/core';
import routes from './.potentia/routes.generated.js';

const app = createApp({
  routes: [routes]
});
```

File routing remains projection over explicit route composition: generated modules import `createRoutes(...)` / `mount(...)` from `@potentiajs/core`, while runtime apps still consume normal route collections. The generated `.potentia/` directory is ignored by default and is usually not committed. The runtime kernel does not perform production runtime filesystem scanning. Watch mode, config files, dev server behavior, and compiler integration remain deferred.

See [`examples/file-routing-basic/`](examples/file-routing-basic/) for a runnable example.

See [`examples/full-flow-basic/`](examples/full-flow-basic/) for a compact full-flow app combining file routing, actions, form projection, server-rendered forms, form state, and redirects.

## Effects

Handlers and hooks may be plain functions, async functions, or experimental `effect(...)` descriptors. Effect helpers are small command constructors that keep generator workflows readable.

```js
import { call, effect, json, ok, route } from '@potentiajs/core';

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
import { createRouteManifest, projectContract, projectRoute, projectRoutes } from '@potentiajs/core';

const contract = projectContract(UserResponse);
const single = projectRoute(route('GET', '/users/:id', handler, { response: UserResponse }));
const collection = projectRoutes(app);
const manifest = createRouteManifest(app, { packageName: '@potentiajs/core', packageVersion: '0.2.0-preview.0' });
```

`projectContract()` reports honest metadata such as capability, opacity, schema, field summaries, required fields, and optional fields. Generic function/parse/check contracts remain opaque. SigilJS contracts expose richer metadata only where SigilJS safely provides it.

`projectRoute()` and `projectRoutes()` summarize methods, paths, contract boundaries, and hook counts without running application code. These helpers are not OpenAPI, client, forms, or docs generators; those remain deferred.

Route metadata is experimental. Routes may include optional `name`, `meta`, and `source` options for manifest/tooling descriptions. `createRouteManifest()` creates a deterministic route manifest with route IDs, names, contracts, hook counts, source/meta, diagnostics, and lookup tables. Manifest creation does not execute handlers, hooks, or contracts; it is a foundation for future docs, tests, clients, forms/actions, and dev tooling, not a completed generator.

## Actions

Actions are experimental server-side contract boundaries. They support JSON input and `application/x-www-form-urlencoded` input. Parsed and validated action input is attached to `ctx.input`, handlers may use plain/async/effect execution, and output contracts validate the logical response body before route response projection.

```js
import { action, call, effect, json, ok, route } from '@potentiajs/core';

const createUser = action('users.create', effect(function* createUser(ctx) {
  const user = yield call(insertUser, ctx.input);
  return ok(json(user));
}), {
  input: CreateUserInput,
  output: CreateUserOutput
});

route('POST', '/users', createUser);
```

URL-encoded submissions parse into plain objects. Repeated fields become arrays, empty values stay empty strings, and values remain strings until input contracts transform them.

Actions return normal Potentia results and responses. Use `ok(...)` for success, `fail(...)` for intentional domain failures, and `redirect(...)` for explicit post-action redirects. Validation failures are deterministic and safe: action input failures return `ok: false`, an action error code, boundary metadata, and an issues array.

Server validation remains authoritative. Form generation, multipart/file uploads, frontend runtime, client SDK, and OpenAPI generation remain deferred. Future client-side validation will be projection-only convenience.

`createFormState(...)` is an experimental opt-in helper for failed form submissions. It preserves safe parsed values only, omits sensitive fields such as passwords/tokens/secrets, groups canonical issues by field with `_form` for root-level issues, and leaves default action behavior unchanged. Redirects remain explicit; successful form submissions should use `redirect('/path', 303)` when post-submit navigation is desired.

```js
return fail(createFormState({
  ok: false,
  values: ctx.input,
  error: { code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }
}), 409);
```

Potentia is HTML-first and server-first. It includes an experimental optional server-side HTML string renderer on the forms subpath. Rendering is metadata-driven, escaped by default, and state-aware. It does not add a frontend runtime, JSX, hydration, custom renderer system, client SDK, OpenAPI generator, session/flash helper, or multipart/file upload helper. JSX is intentionally not part of the official framework direction.

```js
import { createFormState, projectForm } from '@potentiajs/core';
import { renderForm } from '@potentiajs/core/forms';

const formProjection = projectForm(createUser);
const formState = createFormState({
  ok: false,
  values: ctx.input,
  error: { code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }
});

const html = renderForm(formProjection, {
  action: '/users',
  state: formState
});
```

`renderForm(...)` returns a plain HTML string. It renders projected fields, preserves safe state values, omits sensitive values, and renders root/field errors. It supports explicit textarea and hidden metadata, finite options as `<select>`, stable `data-potentia-*` styling/testing hooks, and baseline accessibility attributes. Server validation remains authoritative. The renderer is intentionally exported from `@potentiajs/core/forms`, not the package root.

`projectForm(...)` is an experimental metadata-only helper. It projects action input contracts into renderer-independent field metadata where safe. SigilJS object contracts can expose field paths, derived labels, conservative input hints, required/optional flags, scalar-array `multiple` hints, and sensitive flags. Generic function/parse/check contracts remain opaque and do not invent fields. Server validation remains authoritative.

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

Safe contract failure body example:

```js
{
  ok: false,
  error: {
    code: 'POTENTIA_CONTRACT_FAILED',
    message: 'Request body failed contract validation',
    boundary: 'body',
    issues: [{
      code: 'invalid_type',
      message: 'SigilJS contract rejected value',
      path: ['email'],
      field: 'email',
      boundary: 'body',
      source: 'sigil',
      expected: 'string',
      received: 'number',
      meta: null
    }]
  },
  boundary: 'body',
  issues: [/* same issue objects */]
}
```

Contract failures now expose normalized issue metadata across route and action boundaries. SigilJS can provide field-level `path` / `field` issues where structured metadata is available. Generic contracts remain opaque and use root-level issues (`path: []`, `field: null`). Raw input values are not exposed; `received` uses safe type descriptors such as `string`, `number`, `array`, or `object`. These diagnostics support future forms/tooling, but Potentia still does not include a form generator, client SDK, or OpenAPI generator.

Unsafe thrown handler errors return `POTENTIA_HANDLER_FAILED` with `Internal server error`.

## Examples

- [`examples/kernel-basic/`](examples/kernel-basic/) — generic contract kernel smoke app.
- [`examples/sigiljs-basic/`](examples/sigiljs-basic/) — focused SigilJS contract smoke app.
- [`examples/composed-basic/`](examples/composed-basic/) — explicit route composition smoke app.
- [`examples/action-basic/`](examples/action-basic/) — experimental JSON and URL-encoded action smoke app.
- [`examples/form-state-basic/`](examples/form-state-basic/) — opt-in safe form state helper smoke app.
- [`examples/form-rendering-basic/`](examples/form-rendering-basic/) — server-rendered escaped form HTML smoke app.
- [`examples/file-routing-basic/`](examples/file-routing-basic/) — experimental file-route generation smoke app.
- [`examples/full-flow-basic/`](examples/full-flow-basic/) — file routing + actions + form projection + server-rendered forms.

Each example exports `app` for smoke tests and only starts `Bun.serve()` when run directly.

## Commands

```bash
bun run test          # test suite
bun run check         # current local check
bun run check:preview # tests + check + npm pack dry-run
bun run check:release # release gate alias
bun run check:file-routing # internal file-routing projection tests
potentia routes generate # experimental file-route generation CLI after package install/link
potentia routes check # verify generated file-route output is current without writing
bun run generate:file-routes -- --root routes --out .potentia/routes.generated.js # internal/dev-only generation wrapper
bun run pack:dry      # npm pack --dry-run --json
```

## Current limitations

Deferred intentionally:

- stable 1.0 public APIs
- production-readiness guarantee
- stable public file-based routing API and route auto-discovery beyond the experimental `@potentiajs/core/file-routing` generation subpath
- nested layout routing
- frontend rendering and hydration
- client router
- stable server actions/RPC
- full middleware ecosystem
- large plugin ecosystem
- async plugin loading/discovery
- advanced effect workflows/concurrency/retries/cancellation
- field-level verbose contract diagnostics
- OpenAPI/JSON Schema/route docs/client/forms generators
- multipart/file uploads and form generation
- session/flash form state persistence
- route manifest file writing/loading
- streaming/file responses/content negotiation/cookies API
- CLI expansion
- `.view` compiler changes
- database integration
- auth
- package splitting
- automatic publish on push

## Public API status

All exports are experimental:

- app/routes/actions/forms: `createApp`, `route`, `action`, `createFormState`, `createRoutes`, `mount`, `composeRoutes`
- results/responses: `ok`, `fail`, `json`, `text`, `redirect`
- effects: `effect`, `call`, `value`, `context`
- errors: `createFrameworkError`
- contracts/projection/manifest/plugins: `projectContract`, `projectAction`, `projectForm`, `projectRoute`, `projectRoutes`, `createRouteManifest`, `createPlugin`

Lower-level implementation helpers such as request-context construction, effect execution, framework error normalization, and response projection remain internal and may be reshaped before any stable API commitment.

Experimental package subpaths:

- file routing generation: `@potentiajs/core/file-routing` exports `generateFileRoutes`
- form rendering: `@potentiajs/core/forms` exports `renderForm`
- HTML-first responses: `@potentiajs/core/html` exports `html`, `raw`, `escapeHtml`, `attrs`, `fragment`, and `htmlResponse`

## Release / publish status

Prepared as the first `0.2.0` preview capability expansion:

- package metadata targets `@potentiajs/core@0.2.0-preview.0`
- license is MIT
- repository metadata targets `https://github.com/antistructured/potentiajs`
- package is configured as public
- `CHANGELOG.md` and conservative declarations are included
- no 1.0 stability guarantee is implied
- npm and JSR registry publication should be verified after release

Post-release verification should confirm npm and JSR registry visibility after the publish workflow completes.

## License

MIT © Daniel Weipert

See [`LICENSE`](LICENSE).

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md).
