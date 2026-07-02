# API Pruning Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/`
- `tests/`
- `examples/`
- `docs/internal/public-preview-readiness-regate-report.md`
- `docs/internal/public-preview-export-surface-audit.md`
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `docs/internal/api-pruning-scope-lock.md`

## Findings

The current package root exposes 28 symbols:

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

The readiness re-gate identified four high-risk root exports:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

These are useful for tests and internals but may constrain implementation details too early if shipped as public preview root exports.

## Decisions

This block may remove root exports when the export does not answer: “Would a serious preview user reasonably import this from `potentia-js`?”

Allowed work:

- usage audit of every root export
- root export pruning decisions
- root export removal from `src/index.js` if justified
- test import updates to internal module paths where needed
- README/API classification updates
- export smoke tests
- package and packed-artifact verification

Disallowed work:

- no new framework features
- no publish prep
- no version bump
- no license/repository metadata changes
- no CI implementation
- no package split
- no subpath export implementation unless a catastrophic blocker appears
- no TypeScript declarations
- no JSR implementation
- no form renderer/frontend/client SDK/OpenAPI

## Subpath export decision

Subpath exports are out of scope for this pass. If removed root APIs need future exposure, document a later subpath decision rather than adding subpaths now.

## Expected pruning direction

Likely root removals:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

Likely root keeps:

- preview core app/route/action/form/effect helper APIs
- projection APIs
- `composeRoutes`
- `createPlugin`
- `createFrameworkError`

## Blockers

No blocker to performing the pruning pass. The main risk is updating tests that currently import internal candidates from the root; those tests should move to internal source module imports without changing implementation behavior.
