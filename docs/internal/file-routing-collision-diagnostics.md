# File Routing Collision Diagnostics

## Files inspected

- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/scanner.js`
- `tests/fixtures/file-routing-collisions/`

## Files changed

- `src/dev/file-routing/diagnostics.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/index.js`
- `tests/file-routing-diagnostics.test.js`
- `tests/fixtures/file-routing-collisions/`
- `docs/internal/file-routing-collision-diagnostics.md`

## Implementation

Added deterministic diagnostic codes and collision detection:

- `POTENTIA_FILE_ROUTE_COLLISION`
- `POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL`
- `POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM`
- `POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP`
- `POTENTIA_FILE_ROUTE_INVALID_PARAM`
- `POTENTIA_FILE_ROUTE_MISSING_ROOT`

The scanner now fails closed when route files map to the same route path.

## Diagnostic behavior

Diagnostics include stable file/path context:

- unsupported convention diagnostics include `filePath` and `relativePath`
- collision diagnostics include `routePath` and sorted `files`
- scanner returns diagnostics in a deterministic order
- scanner carries errors in result objects instead of throwing for expected projection problems

## Verification

```bash
bun test tests/file-routing-diagnostics.test.js tests/file-routing-scanner.test.js tests/file-routing-path-mapping.test.js
```

Result:

- 17 pass
- 0 fail

## Boundary check

Diagnostics are dev/projection diagnostics only. Runtime `createFrameworkError` was not used or changed.

## Blockers

- Collisions are path-level in this prototype. Full method-aware collision detection requires route module export validation/import semantics in a later block.
- Generator is not implemented yet.
