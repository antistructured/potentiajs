# File Routing Primitive Compatibility Review

## Files inspected

- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `src/kernel/app.js`
- `src/kernel/plugin.js`
- `src/kernel/contract.js`
- `src/kernel/effect.js`
- `examples/composed-basic/`
- `tests/kernel-route-collections.test.js`
- `tests/kernel-route-mounting.test.js`
- `tests/kernel-scoped-contracts.test.js`
- `tests/kernel-scoped-hooks.test.js`
- `tests/kernel-plugin-seam.test.js`

## Compatibility summary

Existing primitives are sufficient for a first file-routing projection prototype.

A future projector can import route modules, convert filesystem structure into route paths/prefixes, build explicit route collections, and export a generated `createRoutes(...)` tree without kernel changes.

## Primitive review

### `route()`

Compatible.

- Accepts method, path, handler, and options.
- Supports dynamic `:param` segments.
- Preserves route options for params/query/headers/body/response contracts.
- Does not know or need to know source filenames.

Design implication: file routing should produce explicit route paths before calling or importing `route(...)` descriptors.

### `createRoutes()`

Compatible.

- Stable collection shape: `{ kind, prefix, routes, hooks, contracts, meta }`.
- Supports folder-level prefixing and scoped metadata.
- Preserves caller-owned route arrays.

Design implication: each folder can project to a `createRoutes(...)` collection.

### `mount()`

Compatible.

- Explicitly applies a prefix to a route, route collection, or array.
- Composes with collection prefixes.
- Preserves deterministic slash normalization.

Design implication: generated route trees can use `mount(...)` for nested folder prefixes, or emit nested `createRoutes({ prefix })` collections directly.

### `composeRoutes()`

Compatible.

- Flattens explicit route composition before request handling.
- Preserves static/dynamic specificity in the matcher.
- Clones effective routes rather than mutating caller-owned descriptors.

Design implication: generated output should stay explicit and let `createApp()`/`composeRoutes()` normalize.

### Scoped contracts

Compatible.

- Boundaries: `params`, `query`, `headers`, `body`, `response`.
- Parent defaults apply first.
- Child collection defaults override parent defaults for the same boundary.
- Route-level contracts override scoped defaults.
- SigilJS and generic contracts both work.

Design implication: folder metadata can map cleanly to `createRoutes({ contracts })`.

### Scoped hooks

Compatible.

- `beforeRequest`: app → outer → inner.
- `afterResponse`: inner → outer → app.
- `onError`: nearest-local first, then outer scopes, then app.
- Hooks can be plain, async, or `effect(...)` descriptors.

Design implication: folder metadata can map cleanly to `createRoutes({ hooks })`.

### Plugin seam

Compatible but not central to file routing.

- Plugins compose into route collections.
- Plugin hooks/contracts apply only to plugin routes.
- Setup is synchronous and explicit.

Design implication: file routing should not auto-discover plugins in the first implementation. A route module may import and mount plugin routes explicitly, or plugin integration can remain separate.

## Missing future primitives

Not required for first implementation, but likely useful later:

- route source metadata: source file path, generated route id, original filesystem path
- route IDs or names for diagnostics/docs
- generated route manifest shape for dev tools
- dev-only route introspection report
- collision diagnostics with source file references
- lazy route loading policy
- async route module loading policy
- route metadata projection beyond current `meta`

## Non-blockers

- Current `meta` already gives a place to carry conservative source metadata in generated collections if needed.
- First implementation can fail closed on unsupported module shapes rather than adding runtime adapters.
- Kernel can remain filesystem-independent.

## Blockers

- No path mapping syntax is implemented.
- No route module convention is implemented.
- No projection/generation tool exists.
- No source changes were made in this review.
