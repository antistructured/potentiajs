# File Routing Design Gate Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Entrypoint: `./src/index.js`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- file routing scope lock
- existing primitive compatibility review
- path mapping decisions
- route module export decisions
- folder metadata convention decisions
- projection/build boundary decisions
- README honesty update

Not performed:

- file routing implementation
- new public exports
- runtime filesystem scanning
- CLI implementation
- compiler implementation
- frontend/layout runtime
- TypeScript conversion
- DB/auth/package split
- CI/publish prep

## 4. File routing philosophy

File routing must be a projection layer over explicit route composition.

Design law:

```txt
filesystem
↓
route modules
↓
createRoutes / route / mount
↓
createApp
```

The explicit route model remains the source of truth. File routing must not become a hidden router, global route registry, or production runtime filesystem scanner.

## 5. Existing primitive compatibility

Existing primitives are enough for a first projection prototype:

- `route()` maps route modules to explicit route descriptors.
- `createRoutes()` maps folders to scoped route collections.
- `mount()` maps nested folders/prefixes to explicit composition.
- `composeRoutes()` preserves pre-request flattening and deterministic route specificity.
- scoped contracts map to folder metadata.
- scoped hooks map to folder metadata.
- effect handlers and hooks are already supported.
- plugin seam remains explicit and separate.

Missing future primitives are useful but not blockers:

- source file metadata
- route IDs/names
- generated route manifest
- collision diagnostics with source references
- lazy route loading policy
- dev-only route introspection

## 6. Path mapping decisions

Accepted initial conventions:

| Filesystem entry | Route path |
| --- | --- |
| `routes/index.js` | `/` |
| `routes/users/index.js` | `/users` |
| `routes/users/profile.js` | `/users/profile` |
| `routes/users/[id].js` | `/users/:id` |
| nested folders | nested URL segments |
| `_`-prefixed files/folders | ignored/private, except `_routes.js` |
| `.js` files | initial ESM-only module support |

Deferred:

- catch-all routes
- optional params
- route groups
- method-specific filename magic
- named method exports
- non-JS extensions
- frontend/page/layout conventions

Collision behavior:

- fail closed before app startup
- report source files, route path, and method when known
- preserve existing static-over-dynamic specificity model

## 7. Route module export decisions

Accepted initial route modules:

```js
export default route(...)
```

or:

```js
export default createRoutes(...)
```

Deferred:

- named method exports such as `GET`/`POST`
- named metadata exports on route modules
- `export const routes = []`
- plugin auto-discovery
- lazy/async route modules
- default plain handler functions

Reason: default explicit primitives are easiest to test, least magical, and directly compatible with current kernel behavior.

## 8. Folder metadata decisions

Accepted metadata file:

```txt
_routes.js
```

Accepted behavior:

- `_routes.js` default-exports `createRoutes(...)`
- contributes scoped `contracts`, `hooks`, `meta`, and optional `prefix`
- does not create a route by itself
- generated projection attaches discovered children to the folder collection
- nested metadata composes through existing scoped hook/contract semantics

Deferred:

- `_layout.js`
- route groups
- manual child route lists inside `_routes.js`
- plugin discovery from folder metadata
- frontend/server separation

## 9. Projection/build boundary decisions

Rejected:

- production runtime filesystem scanning
- hidden global route registries
- kernel filesystem imports

Accepted future direction:

- dev/build projection utility scans `routes/`
- generated output goes to `.potentia/routes.generated.js`
- generated output imports route modules and exports explicit `createRoutes(...)`
- generated files are not committed by default
- CLI/dev tool later owns generation
- kernel remains usable without file routing

Deferred:

- `fromFiles()` public helper
- watch mode
- compiler integration
- public manifest API

## 10. Deferred features

- implementation of scanner/projector
- catch-all and optional segment matcher semantics
- route groups
- layout/page/frontend conventions
- method-specific filename magic
- named method exports
- lazy route loading
- CLI commands
- compiler integration
- route docs generation
- public API stabilization

## 11. Required future implementation passes

Recommended **File Routing Projection Prototype** passes:

1. scope lock and no-kernel-filesystem rule
2. fixture route tree setup
3. path mapper implementation
4. module export validator
5. `_routes.js` metadata merger
6. collision detector
7. generated `.potentia/routes.generated.js` emitter
8. smoke app/tests using generated output
9. docs update marking feature experimental/dev-only
10. final verification/package check

## 12. Risks

- route path source-of-truth ambiguity if explicit `route()` paths conflict with filenames
- collision diagnostics can become hard to read without source metadata
- `_routes.js` prefix overrides can create surprising paths
- named method exports may be tempting but would add magic too early
- route groups can accidentally imply frontend/layout semantics
- runtime scanning would undermine the explicit architecture if added carelessly

## 13. Recommendation

Proceed next to **File Routing Projection Prototype** if publish decisions remain deferred.

Keep **Public Preview Publish Prep** deferred until Git repository, root license, public/private package decision, repository metadata, and npm preview intent are resolved.
