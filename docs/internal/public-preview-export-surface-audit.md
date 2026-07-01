# Public Preview Export Surface Audit

## Files inspected

- `src/index.js`
- `README.md`
- `tests/` imports from `../src/index.js`
- `examples/` imports from source-relative package root
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `docs/internal/public-preview-export-surface-audit.md`
- `docs/internal/public-preview-api-classification.md`

## Live export verification

Live import from `./src/index.js` exposes 28 root symbols:

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

## Classification summary

### preview-core

- `createApp`
- `route`
- `createRoutes`
- `mount`
- `action`
- `ok`
- `fail`
- `json`
- `text`
- `redirect`
- `effect`
- `call`
- `value`
- `context`
- `createFormState`

### preview-advanced

- `composeRoutes`
- `createPlugin`

### preview-projection

- `projectContract`
- `projectRoute`
- `projectRoutes`
- `projectAction`
- `projectForm`
- `createRouteManifest`

### preview-diagnostic

- `createFrameworkError`

### preview-internal-candidate

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

### defer/remove-candidate

No catastrophic remove-candidate was found. The internal candidates above should be evaluated before public preview but were not removed during this gate.

## Coherence assessment

The public surface is coherent around explicit server composition and metadata projection. The naming pattern is understandable:

- creation: `create*`
- route/action primitives: `route`, `action`
- response/result helpers: `ok`, `fail`, `json`, `text`, `redirect`
- effects: `effect`, `call`, `value`, `context`
- projection: `project*`, `createRouteManifest`

The root export list is large for a private `0.0.1` package. It is still understandable, but public preview should avoid implying that all 28 exports are equally durable.

## Projection API timing

Projection APIs feel early but justified for Potentia's architecture because they are metadata-only and heavily tested. They should remain experimental, and docs must keep distinguishing projection from generation.

## Internal candidate risks

- `createRequestContext`: context shape is likely to change as adapters/middleware mature.
- `runEffect`: useful in tests but exposes interpreter details.
- `normalizeFrameworkError`: primarily boundary infrastructure.
- `toResponse`: response normalization details may change as response features grow.

## README exposure

README does not overuse internal candidates in quickstart paths. Lower-level exports are listed in API status as experimental and candidate for hiding.

## Blockers

No export surface issue blocks internal development. Before public preview, the main risk is commitment pressure from lower-level exports rather than name incoherence.
