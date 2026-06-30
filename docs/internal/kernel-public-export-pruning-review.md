# Kernel Public Export Pruning Review

## Files inspected

- `src/index.js`
- `src/kernel/`
- `README.md`
- `examples/`
- `tests/`
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `docs/internal/kernel-public-export-pruning-review.md`

No source exports were removed in this block.

## Decision summary

All current exports remain experimental. No export is clearly accidental enough to remove during a DX polish block.

## Export decisions

| Export | Decision | Rationale |
| --- | --- | --- |
| `createApp` | keep for preview | Primary app construction API. |
| `route` | keep for preview | Primary explicit routing primitive. |
| `createRoutes` | keep for preview | Primary route collection primitive. |
| `mount` | keep for preview | Primary route composition/prefix primitive. |
| `composeRoutes` | keep for preview; consider hiding before stabilization | Useful for inspection/tests and explicit composition, but lower-level than normal app use. |
| `createPlugin` | keep for preview; revisit before stabilization | Demonstrates intentionally tiny plugin seam, but may be too early for a public plugin story. |
| `createRequestContext` | internal candidate | Mostly useful for tests/advanced consumers; context construction shape may change. Remove only with explicit approval. |
| `effect` | keep for preview | Public effect descriptor helper used by examples/tests. |
| `runEffect` | internal candidate | Useful for tests and advanced integration, but the app already runs effects. Remove only with explicit approval. |
| `ok` | keep for preview | Primary success result helper. |
| `fail` | keep for preview | Primary failure result helper. |
| `json` | keep for preview | Primary JSON response helper. |
| `text` | keep for preview | Primary text response helper. |
| `redirect` | keep for preview | Small common response helper. |
| `toResponse` | internal candidate | Low-level projection helper; useful for tests/integrations but can expose internals prematurely. Remove only with explicit approval. |
| `createFrameworkError` | keep for preview | Needed for explicit safe errors and examples. |
| `normalizeFrameworkError` | internal candidate | Useful but lower-level; public consumers rarely need it directly. Remove only with explicit approval. |
| `projectContract` | keep for preview; consider experimental-internal later | Useful for contract introspection but not central to first-run app building. |

## Recommended preview grouping

High-level tutorial APIs:

- `createApp`
- `route`
- `createRoutes`
- `mount`
- `ok`
- `fail`
- `json`
- `text`
- `redirect`
- `effect`

Advanced/low-level APIs:

- `composeRoutes`
- `createPlugin`
- `createRequestContext`
- `runEffect`
- `toResponse`
- `normalizeFrameworkError`
- `projectContract`
- `createFrameworkError`

## Future pruning candidates

Before any stable public API commitment, consider hiding or reshaping:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

Consider holding back or marking as advanced preview:

- `createPlugin`
- `composeRoutes`
- `projectContract`

## Decision pressure

Reasons not to remove exports now:

- This block is DX polish, not a breaking API block.
- Existing tests/examples use several lower-level exports.
- Public preview classification already says all exports are experimental.
- Removing exports without a dedicated API-pruning block would create churn without enough consumer evidence.

## Blockers

- No public API is stable.
- No consumer feedback exists yet.
- Fresh packed-artifact consumer smoke remains deferred to publish prep.
