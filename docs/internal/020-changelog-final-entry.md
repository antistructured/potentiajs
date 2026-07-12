# 0.2.0 CHANGELOG Final Entry

## Changes made

Updated `CHANGELOG.md` by adding a final `0.2.0` entry above the preview entries.

## Entry

Added:

```md
## 0.2.0

### HTML-first response and page composition

- Added the `@potentiajs/core/html` public subpath.
- Added safe HTML values with escaping by default.
- Added explicit trusted HTML through `raw(...)`.
- Added tagged `html` templates.
- Added `fragment(...)` for HTML composition.
- Added `attrs(...)` for safe attribute rendering.
- Added `htmlResponse(...)` for server-first HTML responses.
- Added `page(...)` for HTML document shell composition.
- Added `layout(...)` for reusable server-first layout functions.
- Added `examples/html-basic`.
- Updated `examples/full-flow-basic` to compose routing, actions, forms, and HTML page responses.

### Notes

- HTML helpers remain subpath-only through `@potentiajs/core/html`.
- PotentiaJS remains experimental under ZeroVer.
- JSX, compiler, hydration, virtual DOM, and client runtime behavior remain intentionally out of scope.
```

## Preview history

Preview history remains preserved below the final entry:

- `0.2.0-preview.1`
- `0.2.0-preview.0`

## Stability posture

The final changelog entry does not overclaim production readiness, API permanence, or 1.0 stability.

## Blockers

None.
