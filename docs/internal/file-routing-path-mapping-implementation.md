# File Routing Path Mapping Implementation

## Files inspected

- `docs/internal/file-routing-path-mapping-decision.md`
- `docs/internal/file-routing-projection-prototype-scope-lock.md`
- `src/`
- `tests/`

## Files changed

- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/index.js`
- `tests/file-routing-path-mapping.test.js`
- `docs/internal/file-routing-path-mapping-implementation.md`

## Implementation

Added `mapRouteFile(filePath, rootDir)` as a dev-only utility.

Stable result shapes:

- route result: `{ ok: true, kind: 'route', ignored: false, routePath, segments, error: null }`
- ignored result: `{ ok: true, kind: 'ignored', ignored: true, reason, routePath: null }`
- invalid result: `{ ok: false, kind: 'invalid', ignored: false, error }`

Supported now:

- `index.js` root and nested index routes
- nested folders
- `[param].js` dynamic params
- `.js` ESM files only
- `_` private file/folder ignoring
- duplicate slash normalization in inputs

Deferred conventions fail or ignore deterministically:

- catch-all: `POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL`
- optional params: `POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM`
- route groups: `POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP`
- invalid dynamic params: `POTENTIA_FILE_ROUTE_INVALID_PARAM`
- non-JS files: ignored with `unsupported-extension`

## Verification

```bash
bun test tests/file-routing-path-mapping.test.js
```

Result:

- 10 pass
- 0 fail

## Boundary check

Filesystem/path utility code lives under `src/dev/file-routing/`. No `src/kernel/*` file imports filesystem APIs.

## Blockers

- Scanner is not implemented yet.
- Collision diagnostics are not implemented yet.
- Generator is not implemented yet.
