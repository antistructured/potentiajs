# Framework Route Composition Foundation Report

## 1. Current package

- Package: `potentia-js`
- Private: yes
- Runtime: Bun-first plain JavaScript ESM
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- composition scope lock
- explicit route collections
- deterministic route flattening
- explicit route mounting
- prefix composition
- scoped contract defaults
- scoped lifecycle hooks
- small plugin seam
- composed example app
- README and internal docs updates

Not added:

- file routing
- route auto-discovery
- frontend runtime
- compiler changes
- CLI expansion
- database/auth
- package split
- CI/release automation

## 4. New/changed public exports

Added experimental exports:

- `createRoutes`
- `mount`
- `composeRoutes`
- `createPlugin`

Existing exports remain experimental.

## 5. Route collection behavior

`createRoutes()` creates deterministic route collections:

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

`createApp()` accepts direct routes and route collections. Collections flatten into the app route table without mutating caller-owned arrays.

## 6. Mount/prefix behavior

`mount(collectionOrRoute, { prefix })` applies an explicit mount prefix.

Prefix order:

```txt
mount prefix + collection prefix + route path
```

Behavior:

- duplicate slashes normalize
- root paths under prefixes are deterministic
- dynamic params work under prefixes
- static/dynamic route specificity is preserved
- original route objects are not mutated

## 7. Scoped contract behavior

Collections and mounts may define scoped contract defaults.

Merge rules:

- parent contracts apply first
- child collection contracts override parent defaults
- route contracts override scoped defaults
- different boundaries merge

Supported boundaries:

- `params`
- `query`
- `headers`
- `body`
- `response`

Generic and SigilJS contracts both work.

## 8. Scoped hook behavior

Collections and mounts may define scoped lifecycle hooks.

Before order:

1. app
2. outer collection
3. inner collection

After order:

1. inner collection
2. outer collection
3. app

`onError` recovery is nearest-local first, then outer scopes, then app hooks.

Plain, async, and effect hooks work. Scoped hooks apply only to child routes.

## 9. Plugin seam behavior or deferral reason

Implemented a small explicit plugin seam:

```js
createPlugin({
  name,
  routes,
  hooks,
  contracts,
  setup
})
```

Plugin behavior:

- routes compose into app routes
- hooks apply only to plugin routes
- contracts apply only to plugin routes
- synchronous setup runs at app creation
- setup receives frozen `{ name, state, meta }`

Deferred plugin ecosystem behavior:

- async loading
- dynamic imports
- registry/discovery
- dependency injection
- permissions
- lifecycle beyond setup/routes/hooks/contracts

## 10. Example app

Created `examples/composed-basic/`:

- `package.json`
- `index.js`
- `README.md`

The example demonstrates:

- `createApp`
- `createRoutes`
- `mount`
- `createPlugin`
- static route
- dynamic route
- scoped contracts
- scoped hooks
- SigilJS contracts
- `Bun.serve({ fetch: app.fetch })`

## 11. Tests added/updated

Added:

- `tests/kernel-route-collections.test.js`
- `tests/kernel-route-mounting.test.js`
- `tests/kernel-scoped-contracts.test.js`
- `tests/kernel-scoped-hooks.test.js`
- `tests/kernel-plugin-seam.test.js`
- `tests/composed-basic-example.test.js`

## 12. Docs added/updated

Added:

- `docs/internal/framework-route-composition-scope-lock.md`
- `docs/internal/framework-route-collection-model.md`
- `docs/internal/framework-route-mounting.md`
- `docs/internal/framework-scoped-contract-defaults.md`
- `docs/internal/framework-scoped-hooks.md`
- `docs/internal/framework-plugin-seam.md`
- `docs/internal/framework-route-composition-foundation-report.md`

Updated:

- `README.md`
- `package.json`

## 13. Remaining blockers

- No Git repository at this path.
- No CI/release workflow.
- No lint script/dependency by design.
- File routing remains deferred.
- Frontend, compiler, CLI expansion, DB, auth, package split, and release automation remain deferred.

## 14. Recommendation

Next block: **Public Preview Readiness Gate — Manual Virtual Sub-Agent Workflow**

Focus on package metadata, version target, README accuracy, public API classification, package contents, release scripts, CI workflow readiness, GitHub workflow readiness, npm dry-run validation, JSR readiness decision, and example smoke verification.
