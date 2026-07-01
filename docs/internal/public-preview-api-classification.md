# Public Preview API Classification

## Scope

This document classifies the package root exports from `src/index.js` for the public preview readiness re-gate.

All current exports are **experimental**. No export is stable.

## Files inspected

- `src/index.js`
- `README.md`
- `tests/` root import usage
- `examples/` root/source-relative import usage
- prior `docs/internal/public-preview-api-classification.md`

## Live root exports

Verified with a live import from `./src/index.js`:

- `action`
- `call`
- `composeRoutes`
- `context`
- `createApp`
- `createFormState`
- `createFrameworkError`
- `createPlugin`
- `createRequestContext`
- `createRouteManifest`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `normalizeFrameworkError`
- `ok`
- `projectAction`
- `projectContract`
- `projectForm`
- `projectRoute`
- `projectRoutes`
- `redirect`
- `route`
- `runEffect`
- `text`
- `toResponse`
- `value`

## Re-gate classification

| Export | Classification | Reason | Preview recommendation |
| --- | --- | --- | --- |
| `createApp` | preview-core | Primary app constructor with `fetch`. | Keep public. |
| `route` | preview-core | Primary explicit route constructor. | Keep public. |
| `createRoutes` | preview-core | Primary explicit route grouping/composition API. | Keep public. |
| `mount` | preview-core | Primary explicit mounting API. | Keep public. |
| `action` | preview-core | Primary action boundary primitive now covered by examples/tests. | Keep public but experimental. |
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
| `composeRoutes` | preview-advanced | Low-level composition primitive, useful for tools/tests/advanced users. | Keep for preview or hide in pruning pass. |
| `createPlugin` | preview-advanced | Minimal plugin seam, useful but early. | Keep experimental; revisit before stable. |
| `projectContract` | preview-projection | Core metadata/projection primitive. | Keep experimental. |
| `projectRoute` | preview-projection | Route metadata primitive. | Keep experimental. |
| `projectRoutes` | preview-projection | Collection/app metadata primitive. | Keep experimental. |
| `projectAction` | preview-projection | Action metadata primitive. | Keep experimental. |
| `projectForm` | preview-projection | Renderer-independent form metadata primitive. | Keep experimental. |
| `createRouteManifest` | preview-projection | Deterministic route/action manifest projection. | Keep experimental; no file writer/loader. |
| `createFrameworkError` | preview-diagnostic | Intentional framework error construction for advanced handlers/tests. | Keep experimental. |
| `createRequestContext` | preview-internal-candidate | Mostly test/internals shape; app authors rarely need it. | Consider hiding before public preview. |
| `runEffect` | preview-internal-candidate | Interpreter entry point; tests use it but app authors normally use handlers. | Consider hiding before public preview. |
| `normalizeFrameworkError` | preview-internal-candidate | Error boundary internal/adapter helper. | Consider hiding before public preview. |
| `toResponse` | preview-internal-candidate | Response normalization internals; useful in tests but lower-level than examples. | Consider hiding before public preview. |

## Coherence findings

Names are mostly coherent around explicit nouns and verbs: `createApp`, `route`, `createRoutes`, `mount`, `action`, `project*`, and response/result helpers.

The projection family is sizeable but coherent. Projection APIs may feel early, but they are central to Potentia's tooling story and obey the metadata-only law. They should stay experimental and clearly not be described as generators.

The root export list is becoming large for a `0.0.1` private package. The risk is not catastrophic, but a pruning/stabilization pass before public preview would reduce commitment pressure.

## README exposure findings

README examples use the core path heavily and mention internal candidates only in the public API status section. This is appropriate for a re-gate. Tutorial examples do not require `createRequestContext`, `runEffect`, `normalizeFrameworkError`, or `toResponse`.

## Internal implementation details that remain unexported

- route matching/parser internals
- contract adapter internals
- diagnostics internals
- action input parsing internals
- form projection low-level helpers from package root
- file-routing scanner/generator/writer internals

## Risks

- `createRequestContext`, `runEffect`, `normalizeFrameworkError`, and `toResponse` are likely too low-level for public preview root exports.
- `composeRoutes` may be more of a tooling helper than an app-author API, though it is understandable.
- Projection APIs are intentionally early; they should remain experimental and metadata-only.
- No TypeScript declarations means public consumers get no typed API contract yet.

## Recommendation

Do not remove exports in this re-gate. Use the final readiness recommendation to decide whether the next block should be an API pruning/stabilization pass before publish prep.
