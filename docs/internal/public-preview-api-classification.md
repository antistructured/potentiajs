# Public Preview API Classification

## Scope

This document classifies the package root exports from `src/index.js` after the API pruning/stabilization pass.

All current exports are **experimental**. No export is stable.

## Files inspected

- `src/index.js`
- `README.md`
- `tests/` root import usage
- `examples/` root/source-relative import usage
- `docs/internal/root-export-usage-audit.md`

## Live root exports after pruning

Expected root exports:

- `action`
- `call`
- `composeRoutes`
- `context`
- `createApp`
- `createFormState`
- `createFrameworkError`
- `createPlugin`
- `createRouteManifest`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `ok`
- `projectAction`
- `projectContract`
- `projectForm`
- `projectRoute`
- `projectRoutes`
- `redirect`
- `route`
- `text`
- `value`

Removed from root before preview:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

## Stabilized preview classification

| Export | Classification | Reason | Preview recommendation |
| --- | --- | --- | --- |
| `createApp` | preview-core | Primary app constructor with `fetch`. | Keep public. |
| `route` | preview-core | Primary explicit route constructor. | Keep public. |
| `createRoutes` | preview-core | Primary explicit route grouping/composition API. | Keep public. |
| `mount` | preview-core | Primary explicit mounting API. | Keep public. |
| `action` | preview-core | Primary action boundary primitive covered by examples/tests. | Keep public but experimental. |
| `ok` | preview-core | Common success result helper. | Keep public. |
| `fail` | preview-core | Common intentional failure result helper. | Keep public. |
| `json` | preview-core | Common JSON response descriptor. | Keep public. |
| `text` | preview-core | Common text response descriptor. | Keep public. |
| `redirect` | preview-core | Common redirect descriptor, important for actions/forms. | Keep public. |
| `effect` | preview-core | Public handler descriptor for generator workflows. | Keep public but document minimal scope. |
| `call` | preview-core | Public effect command helper. | Keep public. |
| `value` | preview-core | Public effect command helper. | Keep public. |
| `context` | preview-core | Public effect command helper. | Keep public. |
| `createFormState` | preview-core | Useful opt-in action/form state helper. | Keep public but experimental. |
| `composeRoutes` | preview-advanced | Low-level but legitimate explicit composition primitive. | Keep public, advanced/experimental. |
| `createPlugin` | preview-advanced | Minimal plugin seam. | Keep public, advanced/early. |
| `projectContract` | preview-projection | Core metadata/projection primitive. | Keep experimental. |
| `projectRoute` | preview-projection | Route metadata primitive. | Keep experimental. |
| `projectRoutes` | preview-projection | Collection/app metadata primitive. | Keep experimental. |
| `projectAction` | preview-projection | Action metadata primitive. | Keep experimental. |
| `projectForm` | preview-projection | Renderer-independent form metadata primitive. | Keep experimental. |
| `createRouteManifest` | preview-projection | Deterministic route/action manifest projection. | Keep experimental; no file writer/loader. |
| `createFrameworkError` | preview-diagnostic | Intentional framework error construction for advanced handlers/hooks/tests. | Keep public but diagnostic/advanced. |

## Internal-only implementation APIs

These remain available to source/tests through internal module paths, but are no longer package-root exports:

- `createRequestContext` from `src/kernel/context.js`
- `runEffect` from `src/kernel/effect.js`
- `normalizeFrameworkError` from `src/kernel/error.js`
- `toResponse` from `src/kernel/response.js`

## Deferred public surfaces

Not implemented or not promoted:

- file routing / route discovery API
- frontend runtime API
- compiler API / `.view` API
- CLI API
- DB/auth APIs
- OpenAPI/schema/docs/client/forms generator APIs
- full middleware ecosystem
- plugin registry/discovery/async loading
- TypeScript declaration surface
- subpath exports

## Stability statement

The root API is now more intentional for public preview, but every export remains experimental. The removal of internal candidates reduces accidental commitment while preserving implementation behavior and internal test coverage.
