# File Routing Scope Lock

## Files inspected

- `README.md`
- `package.json`
- `src/index.js`
- `src/kernel/`
- `examples/`
- `tests/`
- `docs/internal/kernel-dx-polish-report.md`
- `docs/internal/framework-route-composition-foundation-report.md`
- `docs/internal/kernel-public-export-pruning-review.md`

## Scope decision

File routing is a future **projection layer** over Potentia's explicit route composition primitives.

Required hierarchy:

```txt
filesystem
↓
route modules
↓
createRoutes / route / mount
↓
createApp
```

The explicit route model remains the source of truth. File routing must not become a hidden parallel router, global registry, or production runtime filesystem scanner.

## Existing explicit route composition support

Current primitives already support the target projection shape:

- `route()` creates method/path/handler route descriptors.
- `createRoutes()` creates scoped route collections with prefix, contracts, hooks, and metadata.
- `mount()` composes a route or route collection under an explicit prefix.
- `composeRoutes()` flattens explicit composition into effective routes.
- scoped contracts compose by boundary.
- scoped hooks compose deterministically.
- plugins are explicit and small.
- handlers and hooks may use `effect(...)` descriptors.

## File routing should project into

- direct `route(...)` modules
- `createRoutes(...)` route collections
- explicit `mount(...)` prefixes where needed
- generated/imported route collection modules consumed by `createApp({ routes: [...] })`

## Scope for this design gate

In scope:

- file routing philosophy
- filesystem path mapping decisions
- route module export decisions
- folder metadata convention
- projection/build boundary decision
- future implementation recommendations
- README honesty update

Out of scope:

- source implementation
- new public exports
- runtime filesystem scanning
- CLI implementation
- compiler implementation
- frontend/layout/page runtime
- server actions
- DB/auth
- package split
- TypeScript conversion
- CI/publish prep

## Public API freeze for this block

Do not change `src/index.js` during this block.

Current experimental exports remain unchanged:

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

## Design decisions required before implementation

- path mapping from filenames/folders to route paths
- dynamic segment syntax
- catch-all and optional segment posture
- ignored/private file rules
- route group posture
- route module export shape
- folder metadata file name and behavior
- generated output location
- collision behavior
- production runtime filesystem rule
- CLI/dev tool ownership boundary

## Deferred blockers

- no file routing implementation exists
- no CLI or compiler exists for projection
- no public API is stable
- publish prep remains deferred

## Acceptance status

- Scope is locked.
- Implementation is explicitly deferred.
- File routing is defined as projection over route composition.
- No source behavior changed.
