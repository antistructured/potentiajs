# File Routing Projection Prototype Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/`
- `tests/`
- `examples/`
- `docs/internal/file-routing-design-gate-report.md`
- `docs/internal/file-routing-path-mapping-decision.md`
- `docs/internal/file-routing-route-module-export-decision.md`
- `docs/internal/file-routing-folder-metadata-decision.md`
- `docs/internal/file-routing-projection-boundary-decision.md`

## Scope decision

Implement a dev/build-time file-routing projection prototype under `src/dev/file-routing/`.

The runtime kernel remains filesystem-independent. No file routing code may be imported from `src/kernel/*`, and `createApp()` must not scan or import files.

## Dev-only code location

Accepted location:

```txt
src/dev/file-routing/
```

Initial modules:

- `path-mapping.js`
- `scanner.js`
- `diagnostics.js`
- `generator.js`
- `index.js`

This keeps the prototype internal and avoids adding new root package exports.

## Public export posture

No root export is added in this block.

Tests may import the internal dev utility directly:

```js
import { scanRouteTree, generateRouteModule } from '../src/dev/file-routing/index.js';
```

A public `fromFiles()` helper, CLI command, and package subpath export remain deferred.

## Fixtures

Fixture route trees should live under:

```txt
tests/fixtures/file-routing-*/
```

Generated test output should stay inside fixture-local temp directories, not package-root `.potentia/`.

## Generated output path

Prototype generator targets the design path:

```txt
.potentia/routes.generated.js
```

The pure generator returns source and output path. It does not write files unless a future wrapper explicitly owns writing.

## Pack / ignore posture

No package-root `.potentia/` should be created by this block.

No `.gitignore` or publish metadata changes are required during the prototype because package `files` already allowlists only `src/`, examples, package metadata, and README. Tests must verify generated fixture output is not shipped.

## Implemented syntax conventions

In scope now:

- `.js` ESM route files only
- `index.js` routes
- nested folders
- `[param].js` dynamic segments mapped to `:param`
- `_`-prefixed private files/folders ignored
- `_routes.js` scope metadata discovered
- deterministic route tree scan
- deterministic generated ESM module
- collision/unsupported-convention diagnostics

## Deferred conventions

Remain deferred:

- catch-all routes
- optional params
- route groups
- method-specific filename magic
- named `GET`/`POST` exports
- lazy route loading
- frontend layouts/pages
- compiler integration
- public CLI command
- watch mode
- public `fromFiles()` API

## Blockers

- No route module export validator is implemented beyond generated/imported smoke coverage in this block.
- Static method/path collision detection is path-level for the prototype; full method-aware validation requires importing modules and remains future work unless proven simple in smoke tests.
- CLI and write helpers remain future work.

## Acceptance status

- Prototype scope is locked.
- Dev/build boundary is confirmed.
- Deferred conventions remain deferred.
- No source behavior changed in this pass.
