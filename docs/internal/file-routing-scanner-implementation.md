# File Routing Scanner Implementation

## Files inspected

- `src/dev/file-routing/path-mapping.js`
- `tests/fixtures/file-routing-basic/`
- `docs/internal/file-routing-projection-prototype-scope-lock.md`

## Files changed

- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/index.js`
- `tests/file-routing-scanner.test.js`
- `tests/fixtures/file-routing-basic/`
- `docs/internal/file-routing-scanner-implementation.md`

## Implementation

Added `scanRouteTree(rootDir)` as a dev-only scanner.

Behavior:

- accepts a route root directory
- recursively scans entries with deterministic sorting
- discovers `.js` route files
- discovers `_routes.js` as scope metadata
- ignores `_`-prefixed private files/folders except `_routes.js`
- ignores unsupported non-JS files deterministically
- does not import or execute discovered modules
- returns stable `{ ok, rootDir, routes, scopes, ignored, errors }`

Route entries include:

- `filePath`
- `importPath`
- `routePath`
- `segments`
- `kind: 'route'`

Scope entries include:

- `filePath`
- `importPath`
- `routePath`
- `directoryPath`
- `segments`
- `kind: 'scope'`

## Verification

```bash
bun test tests/file-routing-scanner.test.js tests/file-routing-path-mapping.test.js
```

Result:

- 14 pass
- 0 fail

## Boundary check

Scanner uses `node:fs` and `node:path` only under `src/dev/file-routing/`. Runtime kernel files remain untouched and filesystem-independent.

## Blockers

- Collision diagnostics are not implemented yet.
- Generator is not implemented yet.
- Scanner does not validate route module exports; generated smoke coverage handles imports later.
