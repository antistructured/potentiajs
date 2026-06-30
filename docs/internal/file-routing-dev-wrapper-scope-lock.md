# File Routing Dev Wrapper Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/dev/file-routing/`
- `tests/file-routing-*.test.js`
- `tests/fixtures/file-routing-app/`
- `docs/internal/file-routing-projection-prototype-report.md`
- `docs/internal/file-routing-projection-boundary-decision.md`
- `docs/internal/file-routing-design-gate-report.md`
- `.gitignore`

## Findings

The projection prototype already has repo-internal pieces for path mapping, scanning, diagnostics, and source generation under `src/dev/file-routing/`. The generator is pure and does not write files. Tests currently write fixture output manually when needed.

The package root export remains only `./src/index.js`; file-routing internals are not exposed through `package.json` exports and are not included in the package `files` allowlist.

The current README documents file routing as internal/dev-only and explicitly says no stable public file-routing API exists. It does not yet document the new write wrapper or `.potentia/` ignore guidance.

`.gitignore` exists and does not yet include `.potentia/`.

## Decisions

- Add the write helper at `src/dev/file-routing/writer.js`.
- Export the write helper from `src/dev/file-routing/index.js` for repo-internal tests/scripts only.
- Do not export file-routing helpers from package root `src/index.js`.
- Do not add a package export subpath.
- Add an internal script at `scripts/generate-file-routes.js`.
- Add package script `generate:file-routes` pointing to the internal script.
- Script defaults:
  - root: `routes`
  - output: `.potentia/routes.generated.js`
- Allow only tiny optional script args:
  - `--root <path>`
  - `--out <path>`
  - `--package <name>`
- Add `.potentia/` to `.gitignore`.
- Keep generated `.potentia/` output excluded from package contents through the existing package `files` allowlist.
- Generated example output should be created by tests and cleaned after tests.

## Explicitly deferred

- public CLI/bin field
- stable public file-routing API
- package export subpath
- `fromFiles()`
- watch mode
- compiler integration
- runtime filesystem scanning
- kernel changes
- catch-all routes
- optional params
- route groups
- method-aware collision detection
- route module export validation
- frontend/layout support
- publish prep

## Boundary rules for this block

Allowed filesystem access remains limited to:

- `src/dev/file-routing/*`
- `scripts/generate-file-routes.js`
- tests/fixtures
- generated fixture output that tests clean up

Forbidden:

- `fs` / `node:fs` imports in `src/kernel/*`
- `createApp()` auto-loading route files
- request-time filesystem reads
- public package root exports for file routing
- public CLI/bin promise
- watch mode

## Blockers

- File-routing dev wrapper will remain repo-internal and unavailable to consumers of the packed package unless a later public API/export decision changes package contents.
- Script self-import from generated example output may need fixture-local self-import handling in tests, as established by the projection prototype smoke test.
