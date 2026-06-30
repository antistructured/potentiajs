# Kernel DX Polish Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Current private/public posture

- `private: true`
- `license: UNLICENSED`
- No root `LICENSE`
- No Git repository detected in this checkout
- No repository/bugs/homepage metadata
- npm readiness remains not ready
- JSR readiness remains deferred

## 4. Scope completed

Completed:

- DX scope lock
- safer, clearer framework error messages
- safer, clearer contract diagnostic summaries
- example simplification and README polish
- README quickstart tightening
- public export pruning review
- package check and preview verification

Not performed:

- publish prep
- version bump
- license/repository metadata decisions
- CI workflow
- feature expansion
- TypeScript conversion
- frontend/compiler/CLI/DB/auth/package split

## 5. Error message changes

Improved route-level messages:

- `POTENTIA_NOT_FOUND`: `No route matched the request path`
- `POTENTIA_METHOD_NOT_ALLOWED`: `Route matched the path, but not the request method`

Preserved safety:

- unsafe handler failures still return `Internal server error`
- explicit exposed framework errors keep their safe messages
- status codes and response shape remain deterministic

## 6. Contract diagnostic changes

Contract issue summaries are now more useful while staying safe:

- SigilJS validation: `SigilJS contract rejected value`
- generic check false: `Contract check returned false`
- generic parser/function rejection: `Contract parser rejected value`

Still deferred:

- field-level verbose SigilJS projection
- debug modes
- custom diagnostic formatters

## 7. Example changes

- Kernel basic example: removed a no-op app hook and kept one effect handler.
- SigilJS basic example: changed the GET route to a plain handler to keep focus on contracts.
- Example READMEs: tightened run instructions, smoke-test posture, and source-relative import limitation.
- Composed example behavior stayed unchanged; README clarified composition/plugin boundaries.

## 8. README changes

README now follows a sharper preview shape:

1. What Potentia is
2. Current status
3. Install / local usage
4. Minimal route
5. SigilJS contract route
6. Route composition
7. Effects
8. Hooks
9. Error/result model
10. Examples
11. Commands
12. Current limitations
13. Public API status

No stable or production-readiness claim was introduced.

## 9. Export pruning recommendations

Keep high-level preview APIs visible:

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

Future internal candidates:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

Advanced/experimental surfaces to revisit:

- `composeRoutes`
- `createPlugin`
- `projectContract`

No exports were removed in this block.

## 10. Tests added/updated

Added:

- `tests/kernel-error-message-dx.test.js`
- `tests/kernel-contract-diagnostic-dx.test.js`

Updated expectations for clearer 404/405 messages and contract diagnostic issue summaries.

## 11. Package contents status

Package contents remain preview-clean:

- source included
- packaged examples included
- README included
- internal docs excluded
- old prototype `.view` example excluded
- editor/history junk excluded

## 12. Remaining blockers

- No Git repository detected.
- No root license file.
- Package remains private.
- License metadata remains `UNLICENSED`.
- No real repository/bugs/homepage metadata.
- No CI workflow.
- npm readiness remains not ready.
- JSR readiness remains deferred.
- Fresh install-from-packed-artifact smoke remains deferred to publish prep.
- No public API is stable.

## 13. Recommendation

Next block should be **File Routing Design Gate** if publish decisions remain deferred.

Choose **Public Preview Publish Prep** only after the owner resolves Git repository, root license, public/private package, repository metadata, and npm preview intent.
