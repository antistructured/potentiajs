# File Routing Folder Metadata Decision

## Files inspected

- `src/kernel/route-collection.js`
- `src/kernel/app.js`
- `tests/kernel-scoped-contracts.test.js`
- `tests/kernel-scoped-hooks.test.js`
- `examples/composed-basic/index.js`
- `docs/internal/file-routing-primitive-compatibility-review.md`
- `docs/internal/file-routing-route-module-export-decision.md`

## Status

This is a design decision only. No folder metadata loader was implemented.

## Accepted folder metadata file

Use `_routes.js` for folder-level route collection metadata.

Accepted shape:

```js
import { createRoutes } from 'potentia-js';

export default createRoutes({
  contracts: {
    headers: AuthHeaders
  },
  hooks: {
    beforeRequest: [requireAuth]
  },
  meta: {
    name: 'users'
  }
});
```

## Why `_routes.js`

- maps directly to `createRoutes(...)`
- avoids frontend/layout meaning
- keeps folder metadata explicit
- uses existing scoped contracts/hooks semantics
- clearly marks the file as special/private to routing projection
- does not imply page layouts, components, or rendering

## Rejected initial names

- `_layout.js`: rejected for now because it implies frontend/layout semantics.
- `_group.js`: deferred because route groups are not accepted initially.
- `_scope.js`: clear but less directly tied to existing `createRoutes()`.
- `routes.js`: rejected because it can collide visually with normal route module names.
- `index.config.js`: rejected because config-style files imply a separate config model.

## `_routes.js` behavior

### Does `_routes.js` create a route?

No.

`_routes.js` contributes scoped metadata for its containing folder. It does not create a route by itself.

### What may `_routes.js` define?

Initial accepted fields are the existing `createRoutes()` fields:

- `prefix`
- `contracts`
- `hooks`
- `meta`

The generated projector attaches discovered child routes to this collection.

### May `_routes.js` manually list child routes?

Deferred for first implementation.

Recommended first implementation rule:

- `_routes.js` should not manually list filesystem-discovered children.
- If it provides `routes`, the projector should either fail closed or treat it as an advanced explicit override only after a separate design decision.

Reason: mixing manual child lists with filesystem discovery creates collision and ordering ambiguity.

### How does it combine with discovered children?

Projection model:

1. import folder `_routes.js` if present
2. validate default export is a route collection
3. create or reuse a `createRoutes(...)` collection for the folder
4. apply metadata hooks/contracts/prefix from `_routes.js`
5. attach discovered child route modules/child folder collections as `routes`
6. export the explicit generated tree

Conceptually:

```js
const usersScope = createRoutes({
  prefix: '/users',
  contracts: usersRoutes.contracts,
  hooks: usersRoutes.hooks,
  meta: usersRoutes.meta,
  routes: discoveredChildren
});
```

The exact implementation can preserve object identity or clone metadata, but must not mutate user-owned exported collections.

## Prefix behavior

Filesystem-derived prefix is the default.

Explicit `prefix` in `_routes.js` is allowed but should be treated carefully:

- allowed for advanced explicit override
- must be normalized by existing `createRoutes()` behavior
- must not silently create duplicate path segments
- should trigger collision checks

Recommended implementation posture:

- default to filesystem prefix
- allow explicit prefix only when it matches intended folder semantics or is clearly documented
- fail closed on ambiguous conflict between filesystem path and explicit prefix

## Nested metadata composition

Nested `_routes.js` files compose through existing route collection semantics:

- parent contracts apply first
- child contracts override parent for the same boundary
- route contracts override scoped defaults
- `beforeRequest` order: app → outer folder → inner folder
- `afterResponse` order: inner folder → outer folder → app
- `onError` order: nearest-local first, then outer scopes, then app

## Metadata

`meta` remains experimental and conservative.

Suggested generated metadata for later:

```js
meta: {
  source: 'routes/users/_routes.js',
  segment: 'users'
}
```

Do not require source metadata for first implementation unless diagnostics need it.

## Collision behavior

Projection must fail closed when:

- multiple metadata files exist for the same folder
- `_routes.js` default export is not a route collection
- `_routes.js` manually lists routes while discovery also attaches children, unless explicitly allowed later
- explicit prefix conflicts with filesystem path mapping
- metadata creates duplicate effective route paths/methods

## Deferred

- `_layout.js` and layout semantics
- route groups
- manually listed child filesystem routes
- plugin discovery from folder metadata
- async setup/loading
- frontend/server boundaries

## Blockers

- No folder metadata loader exists.
- No generated manifest exists.
- No source metadata/collision diagnostics exist yet.
- No implementation was added.
