# Public Preview Readiness Re-Gate Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Dev dependencies: none

## 2. Current version

- `0.0.1`

## 3. Current private/public status

- `private: true`
- Not ready for registry publish from this block.
- This re-gate did not publish and did not change package visibility.

## 4. Current license status

- Package metadata: `UNLICENSED`
- No root `LICENSE` file decision was made.
- `UNLICENSED` remains the accurate metadata until the owner chooses a license.

## 5. Export surface summary

Live root exports: 28.

The surface is coherent but broad. Core app-author exports are understandable; lower-level internals are visible at the root and should be reconsidered before public preview.

## 6. API classification summary

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

No export was removed in this re-gate.

## 7. README truthfulness summary

README is truthful and restrained:

- says the package is experimental
- says it is not production-ready
- says no public API is stable
- identifies Bun-first runtime and plain JavaScript source
- identifies SigilJS dependency
- documents current examples and commands
- distinguishes projection from generation
- clearly defers frontend/runtime/client/OpenAPI/form-rendering/CLI/compiler/DB/auth/publish areas

One small truthfulness fix was made: the public API status list now includes `projectForm`.

## 8. Examples summary

Shipped examples are useful and smoke-tested:

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`

Repo-only/internal examples remain excluded:

- `examples/file-routing-dev/`
- `examples/UserProfile.view`

Example smoke result:

- `31 pass`
- `0 fail`
- `80 expect() calls`

## 9. Package contents summary

`npm pack --dry-run --json` passes.

Dry-run package contents are clean:

- entry count: `37`
- no `docs/internal/`
- no `tests/`
- no `.potentia/`
- no editor/history artifacts
- internal file-routing dev example excluded

Included examples are intentional.

## 10. Packed artifact smoke summary

Packed artifact install smoke passes in a fresh temporary project with `bun add <tarball>`.

Verified from installed package:

- root import from `potentia-js`
- `@weipertda/sigiljs` runtime dependency resolution
- `createApp`
- `route`
- `action`
- JSON action input
- `ctx.input`
- `ok(json(...))`
- `createFormState`
- `projectForm`

Observed smoke output:

```json
{"status":200,"input":{"name":"Ada"},"formField":"name","dependency":"function"}
```

## 11. npm blockers

- `private: true`
- no root `LICENSE` file
- `UNLICENSED` metadata until license decision
- repository/bugs/homepage metadata absent
- npm package visibility/access/2FA/publish intent unconfirmed
- no changelog/release notes artifact yet
- no explicit publish config decision
- no TypeScript declarations for consumers
- public export pruning/stabilization decision unresolved

## 12. JSR blockers

- no `jsr.json` / JSR package metadata decision
- package name/scope for JSR unresolved
- license unresolved
- compatibility expectations for JSR consumers unresolved
- TypeScript declaration/story unresolved
- package is Bun-first and has not been audited for JSR-specific expectations

## 13. CI/release blockers

- CI workflow absent
- git/release workflow not confirmed
- no release checklist/changelog for preview target
- no automated packed-artifact install smoke in CI
- no owner-confirmed registry publish target

## 14. Stability risks

- all APIs remain experimental
- 28 root exports is broad for a first public preview
- lower-level exports (`createRequestContext`, `runEffect`, `normalizeFrameworkError`, `toResponse`) may create accidental commitment
- projection APIs are useful but early; must remain metadata-only
- no TypeScript declarations may slow preview consumers
- examples use source-relative imports in repo, though packed artifact import smoke passes

## 15. Recommended next path

Recommendation: **C — API Pruning / Stabilization Pass**.

Reason: the package is clean and the packed artifact works, so the next highest-value pre-preview work is reducing public surface risk. Mechanical publish prep should wait until the owner confirms license/repository/npm/JSR intent and after root export commitments are clearer.

The next block should decide:

- which exports remain public root exports
- which lower-level exports become internal
- whether to add subpath exports later
- whether projection APIs remain root exports
- whether `createRequestContext`, `runEffect`, `normalizeFrameworkError`, and `toResponse` should be hidden before preview

## 16. Recommended version target

Current version should remain:

- `0.0.1`

Likely future public preview target remains:

- `0.0.2-preview.0`

No version bump should happen in this re-gate.

## 17. Final recommendation

Potentia is in good internal shape for a public-preview readiness discussion, but not yet ready for publish prep. Package contents are clean, examples are useful, README is truthful, and packed-artifact install smoke passes. The main remaining pre-preview risk is API surface commitment, not runtime/package correctness.

Proceed with **API Pruning / Stabilization Pass** before Public Preview Publish Prep.
