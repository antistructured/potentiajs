# File Routing Projection Prototype Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- projection prototype scope lock
- dev-only path mapper
- dev-only route tree scanner
- deterministic diagnostics
- pure route module generator
- fixture smoke test proving generated output through `createApp()`
- README prototype-status update
- internal report/docs
- package hygiene verification

Not performed:

- public file-routing API
- `fromFiles()` helper
- public CLI command
- watch mode
- compiler integration
- runtime filesystem scanning
- frontend/layout/page support
- catch-all/optional params/route groups
- TypeScript conversion
- publish prep

## 4. Dev/build boundary

All filesystem access lives under `src/dev/file-routing/` and tests.

Runtime kernel files remain filesystem-independent. `src/kernel/*` does not import `fs`, `node:fs`, Bun filesystem APIs, scanner, or generator code.

## 5. Path mapping implemented

Implemented in `src/dev/file-routing/path-mapping.js`.

Supported:

- `routes/index.js` → `/`
- nested `index.js`
- nested folders
- `[param].js` → `:param`
- `_` private files/folders
- `.js` ESM-only route files

Deferred conventions report deterministic ignored/invalid results.

## 6. Scanner behavior

Implemented in `src/dev/file-routing/scanner.js`.

Scanner:

- recursively scans route roots
- discovers route files
- discovers `_routes.js` scope metadata
- ignores private files/folders
- ignores unsupported extensions
- sorts deterministically
- does not import or execute route modules
- returns `{ ok, rootDir, routes, scopes, ignored, errors }`

## 7. Diagnostics behavior

Implemented in `src/dev/file-routing/diagnostics.js` and mapper/scanner diagnostics.

Codes:

- `POTENTIA_FILE_ROUTE_COLLISION`
- `POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL`
- `POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM`
- `POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP`
- `POTENTIA_FILE_ROUTE_INVALID_PARAM`
- `POTENTIA_FILE_ROUTE_MISSING_ROOT`

Collisions fail closed at scan time.

## 8. Generator behavior

Implemented in `src/dev/file-routing/generator.js`.

Generator:

- accepts scanner result
- fails when scanner result has errors
- emits deterministic JavaScript source
- imports `createRoutes` and `mount` from `potentia-js`
- imports route modules explicitly
- imports `_routes.js` metadata explicitly
- exports default `createRoutes(...)`
- groups scoped folder routes under explicit `mount(createRoutes(...))`
- emits no filesystem scanning code
- does not write files

## 9. Smoke test behavior

`tests/file-routing-generated-smoke.test.js` proves:

- scan fixture route tree
- generate source
- write fixture-local `.potentia/routes.generated.js`
- import generated module
- build app with `createApp()`
- verify `/`, `/health`, `/users`, `/users/:id`
- verify private route file is not generated
- verify scoped contract/hook behavior
- cleanup generated fixture output

## 10. Files changed

Source:

- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/diagnostics.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/index.js`

Tests/fixtures:

- `tests/file-routing-path-mapping.test.js`
- `tests/file-routing-scanner.test.js`
- `tests/file-routing-diagnostics.test.js`
- `tests/file-routing-generator.test.js`
- `tests/file-routing-generated-smoke.test.js`
- `tests/fixtures/file-routing-basic/`
- `tests/fixtures/file-routing-collisions/`
- `tests/fixtures/file-routing-app/`

Docs/package:

- `README.md`
- `package.json`
- `docs/internal/file-routing-projection-prototype-scope-lock.md`
- `docs/internal/file-routing-path-mapping-implementation.md`
- `docs/internal/file-routing-scanner-implementation.md`
- `docs/internal/file-routing-collision-diagnostics.md`
- `docs/internal/file-routing-generator-implementation.md`
- `docs/internal/file-routing-generated-smoke.md`
- `docs/internal/file-routing-projection-prototype-report.md`

## 11. Tests added/updated

Added:

- path mapping tests
- scanner tests
- diagnostics tests
- generator tests
- generated smoke tests

Added script:

```bash
bun run check:file-routing
```

## 12. Deferred features

- public API/export
- public CLI command
- watch mode
- compiler integration
- write helper
- `fromFiles()`
- catch-all routes
- optional params
- route groups
- named method exports
- lazy loading
- method-aware collision detection
- route module export-shape validation beyond smoke import

## 13. Recommendation

Next block should be **File Routing Dev Tool Wrapper** if publish decisions remain deferred.

That block should add an internal generation wrapper/write helper, document `.potentia/` ignore guidance, and keep CLI/watch/compiler/public API commitments deferred unless explicitly approved.
