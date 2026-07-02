# API Pruning / Stabilization Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Dev dependencies: none

## 2. Current version

- `0.0.1`

No version bump was performed.

## 3. Scope completed

Completed API pruning/stabilization before public preview:

- locked pruning scope
- audited root export usage
- decided internal candidate exports
- pruned high-risk internal candidates from package root
- kept projection APIs as experimental root exports
- kept advanced/diagnostic APIs with explicit classification
- aligned README/API docs with the actual root surface
- added root export smoke coverage
- reran package and packed artifact verification

No framework feature was added.

## 4. Root exports before

Before pruning, root exports were 28 symbols:

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

## 5. Root exports after

After pruning, root exports are 24 symbols:

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

## 6. Removed root exports

Removed from package root:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

These remain internal module APIs for implementation/tests.

## 7. Kept root exports by category

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

## 8. Internal-only implementation APIs

Internal-only now:

- request context creation: `src/kernel/context.js`
- effect execution: `src/kernel/effect.js`
- framework error normalization: `src/kernel/error.js`
- response projection: `src/kernel/response.js`

Tests that need these internals import from internal module paths.

## 9. Projection API decision

Decision: `keep-root-preview`.

Projection APIs remain root exports because metadata/projection is Potentia's core spine. They stay experimental and metadata-only. They do not imply OpenAPI/client/docs/form generator stability.

## 10. Advanced API decision

- `composeRoutes`: keep as advanced explicit composition primitive.
- `createPlugin`: keep as advanced/early minimal plugin seam.
- `createFrameworkError`: keep as diagnostic/advanced public helper for intentional framework-shaped errors.

## 11. README/examples alignment

README public API status now matches actual root exports.

Shipped examples do not import removed APIs.

Internal candidates no longer appear in README/examples.

## 12. Export smoke result

Added `tests/root-export-surface.test.js`.

It verifies:

- exact root export set
- preview core exports
- preview advanced exports
- preview projection exports
- preview diagnostic exports
- removed internal candidates are absent

## 13. Package verification result

Verification passed:

- tests: `557 pass`, `0 fail`, `1173 expect() calls`
- file-routing tests: `35 pass`, `0 fail`, `112 expect() calls`
- `bun run check`: pass
- `bun run check:preview`: pass
- `npm pack --dry-run --json`: pass
- packed artifact smoke: pass

Package dry-run remains clean:

- entry count: `37`
- no `docs/internal/`
- no `tests/`
- no `.potentia/`

## 14. Remaining publish blockers

- `private: true`
- no root `LICENSE` file
- license remains `UNLICENSED`
- repository/bugs/homepage metadata absent
- CI workflow absent
- npm access/2FA/publish intent unconfirmed
- JSR metadata/name/scope unresolved
- TypeScript declarations absent
- changelog/release notes not created
- no publish-prep release smoke tied to owner-confirmed target

## 15. API risks

- all APIs remain experimental
- no TypeScript declarations yet
- projection APIs are intentionally early and must remain metadata-only
- plugin seam is minimal/early
- future subpath exports may be useful for internals/tools, but were intentionally not added here

## 16. Recommendation

Recommendation: **A — Public Preview Publish Prep**.

Reason: root API surface is now intentional, package contents are clean, examples are aligned, README is truthful, packed artifact install smoke passes, and the remaining blockers are mechanical/product publishing decisions rather than framework-shape blockers.

Next block should handle:

- license decision/root `LICENSE` file
- repository metadata
- bugs/homepage metadata
- CI workflow
- changelog/release notes
- version target
- npm publish dry-run
- JSR readiness decision
- release smoke

Current version should remain `0.0.1` until publish prep intentionally selects `0.0.2-preview.0` or another target.
