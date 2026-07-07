# File Routing Public API Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/dev/file-routing/index.js`
- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/generator.js`
- `scripts/generate-file-routes.js`
- `examples/file-routing-dev/`
- `tests/file-routing-*.test.js`
- `docs/internal/file-routing-public-api-design-gate-report.md`
- `docs/internal/file-routing-public-api-shape-decision.md`
- `docs/internal/file-routing-generated-output-package-identity-decision.md`
- `docs/internal/file-routing-public-diagnostics-decision.md`
- `docs/internal/file-routing-manifest-source-metadata-decision.md`

## Scope lock

This block implements the first public file-routing API foundation only:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

The root package export remains unchanged. `generateFileRoutes(...)` must not be added to `@potentiajs/core` root exports.

## Current internal generator shape

Current internal implementation lives under `src/dev/file-routing/`:

- `index.js` re-exports internal scanner/generator/writer helpers.
- `writer.js` exports `generateFileRoutes(options)`.
- `generator.js` exports `generateRouteModule(scanResult, options)`.
- `scanner.js`, `path-mapping.js`, and `diagnostics.js` provide scan/diagnostic internals.

Current writer accepts:

- `rootDir`
- `outputFile`
- `packageName`
- `cwd`

Current writer returns result objects and does not throw for normal validation failures.

## Package files allowlist impact

Current package files include only:

- root entry and declarations
- `src/kernel/`
- selected public examples
- `README.md`
- `CHANGELOG.md`

To publish the subpath, package contents must add:

- `src/file-routing.js`
- `src/dev/file-routing/`

The package should continue excluding:

- `docs/internal/`
- tests
- `.github/`
- `.potentia/`
- `examples/file-routing-dev/` unless intentionally promoted later

## Subpath export strategy

Add a package export for:

```txt
./file-routing
```

The public entry file should expose only:

```js
export { generateFileRoutes } from './dev/file-routing/writer.js';
```

or equivalent.

Do not expose scanner, mapper, generator internals, diagnostic constants, or writer internals as public API in this block.

## Current package identity assumptions

Current package identity is:

```txt
@potentiajs/core
```

Default generated imports already target `@potentiajs/core` in current local source after the prior verification/design work. This block should preserve that default and test both default and override behavior.

## Test adjustments needed

Add/adjust tests to verify:

- subpath import works through package self-import
- root package does not export `generateFileRoutes`
- subpath exposes only `generateFileRoutes`
- public function returns deterministic success/failure results
- generated output imports from `@potentiajs/core` by default
- `packageName` override still works
- package dry-run includes subpath files
- installed artifact can import the subpath and generate usable explicit routes

## Out of scope

- no CLI/bin
- no watch mode
- no compiler integration
- no frontend/runtime/form renderer/client SDK/OpenAPI
- no TypeScript route files
- no named `GET`/`POST` route module exports
- no catch-all/optional/group routes
- no release/publish workflow repair
- no registry recovery
- no npm/JSR publish
- no package version bump

## Publish status

No publish command was run.
